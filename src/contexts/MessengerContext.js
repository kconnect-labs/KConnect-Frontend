import React, { createContext, useState, useEffect, useRef, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';


const PING_INTERVAL = 15000; 
const PONG_TIMEOUT = 10000;  
const RECONNECT_BASE_DELAY = 1000; 
const DEV_MODE = process.env.NODE_ENV !== 'production'; 


const logger = {
  debug: (...args) => {
    if (DEV_MODE || window.MESSENGER_DEV_MODE) console.debug('[Messenger]', ...args);
  },
  log: (...args) => {
    if (DEV_MODE || window.MESSENGER_DEV_MODE) console.log('[Messenger]', ...args);
  },
  info: (...args) => {
    console.info('[Messenger]', ...args);
  },
  warn: (...args) => {
    console.warn('[Messenger]', ...args);
  },
  error: (...args) => {
    console.error('[Messenger]', ...args);
  }
};

export const MessengerContext = createContext();


const buildAvatarUrl = (userId, avatarFilename) => {
  if (!avatarFilename || !userId) {
    console.log(`Создание URL аватара: Missing required params - userId: ${userId}, filename: ${avatarFilename}`);
    return null;
  }
  
  
  if (avatarFilename.startsWith('http')) {
    console.log(`buildAvatarUrl: Already a full URL: ${avatarFilename}`);
    return avatarFilename;
  }
  
  
  if (avatarFilename.startsWith('/static/')) {
    console.log(`buildAvatarUrl: Already starts with /static/: ${avatarFilename}`);
    return avatarFilename;
  }
  
  
  let filename = avatarFilename;
  if (avatarFilename.includes('uploads/avatar/') || avatarFilename.includes('avatar/')) {
    const parts = avatarFilename.split('/');
    filename = parts[parts.length - 1];
    console.log(`buildAvatarUrl: Extracted filename from path: ${filename}`);
  }
  
  
  const finalUrl = `/static/uploads/avatar/${userId}/${filename}`;
  console.log(`buildAvatarUrl: Created URL for user ${userId}: ${finalUrl}`);
  return finalUrl;
};


const xorCipher = (text, key) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};


const formatToLocalTime = (isoDateString) => {
  if (!isoDateString) return '';
  
  try {
    
    if (typeof isoDateString === 'string' && /^\d{1,2}:\d{2}$/.test(isoDateString)) {
      return isoDateString;
    }
    
    
    if (typeof isoDateString === 'string' && /^\d{1,2}\s+\w+$/.test(isoDateString)) {
      return isoDateString;
    }
    
    
    const date = new Date(isoDateString);
    
    
    if (isNaN(date.getTime())) {
      console.warn('Неверный формат даты:', isoDateString);
      return typeof isoDateString === 'string' ? isoDateString : '';
    }
    
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    
    return `${hours}:${minutes}`;
  } catch (e) {
    console.error('Ошибка преобразования времени:', e);
    return typeof isoDateString === 'string' ? isoDateString : '';
  }
};

export const MessengerProvider = ({ children }) => {
  
  const authContext = useContext(AuthContext);
  
  
  const isChannel = authContext?.user?.type === 'channel';
  
  
  if (isChannel) {
    console.warn('MessengerContext: Канал не может использовать мессенджер. Доступ заблокирован.');
    
    
    return (
      <MessengerContext.Provider value={{ 
        isChannel: true,
        loading: false,
        error: 'Каналы не могут использовать мессенджер',
        chats: [],
        messages: {},
        user: null
      }}>
        {children}
      </MessengerContext.Provider>
    );
  }
  
  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  
  const sessionKeyCookie = getCookie('session_key') || getCookie('jwt') || getCookie('token');
  const jwtToken = localStorage.getItem('token') || sessionKeyCookie;
  
  
  const sessionKey = authContext?.sessionKey || authContext?.session_key || 
                   localStorage.getItem('session_key') || sessionKeyCookie || jwtToken;
  
  
  const [deviceId] = useState(() => {
    const existingDeviceId = localStorage.getItem('messenger_device_id');
    if (existingDeviceId) return existingDeviceId;
    
    
    const newDeviceId = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
    localStorage.setItem('messenger_device_id', newDeviceId);
    return newDeviceId;
  });
  
  
  useEffect(() => {
    
    if (jwtToken && !localStorage.getItem('session_key')) {
      localStorage.setItem('session_key', jwtToken);
      console.log('Контекст мессенджера: Использование JWT токена в качестве session_key');
    }
    
    if (sessionKeyCookie && !localStorage.getItem('session_key')) {
      localStorage.setItem('session_key', sessionKeyCookie);
      console.log('Контекст мессенджера: Сохранение session_key из cookie в localStorage');
    }
  }, [jwtToken, sessionKeyCookie]);
  
  
  useEffect(() => {
    const setupAuthHeaders = () => {
      if (sessionKey) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionKey}`;
      } else if (jwtToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      }
    };
    
    setupAuthHeaders();
    
    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, [sessionKey, jwtToken]);
  
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState({});
  const [lastFetchedMessageId, setLastFetchedMessageId] = useState({});

  
  const socket = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  
  const pingTimeoutRef = useRef(null);
  const pongTimeoutRef = useRef(null);
  const lastPongTimeRef = useRef(Date.now());
  const missedPongsRef = useRef(0);
  
  
  const forceReconnect = useCallback(() => {
    logger.info('Принудительное переподключение вебсокета');
    
    
    if (socket.current) {
      try {
        
        socket.current.onclose = null;
        socket.current.onerror = null;
        socket.current.onmessage = null;
        
        setIsSocketConnected(false);
        socket.current.close();
        socket.current = null;
      } catch (err) {
        logger.error('Ошибка при закрытии вебсокета:', err);
      }
    }
    
    
    clearAllTimers();
    
    
    reconnectAttempts.current = 0;
    connectWebSocket();
  }, [/* dependencies */]);
  
  
  const clearAllTimers = useCallback(() => {
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    
    
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current);
      pingTimeoutRef.current = null;
    }
    
    if (pongTimeoutRef.current) {
      clearTimeout(pongTimeoutRef.current);
      pongTimeoutRef.current = null;
    }
    
    
    if (connectionCheckerRef.current) {
      clearInterval(connectionCheckerRef.current);
      connectionCheckerRef.current = null;
    }
  }, []);
  
  
  const connectionCheckerRef = useRef(null);
  const lastMessageTimeRef = useRef(Date.now());
  
  
  const startConnectionChecker = useCallback(() => {
    
    if (connectionCheckerRef.current) {
      clearInterval(connectionCheckerRef.current);
    }
    
    
    lastMessageTimeRef.current = Date.now();
    
    
    connectionCheckerRef.current = setInterval(() => {
      
      if (isSocketConnected && Date.now() - lastMessageTimeRef.current > 45000) {
        console.log('Обнаружено неактивное соединение (45 сек без сообщений), принудительное переподключение');
        forceReconnect();
      }
    }, 15000); 
  }, [isSocketConnected, forceReconnect]);
  
  
  useEffect(() => {
    return () => {
      if (connectionCheckerRef.current) {
        clearInterval(connectionCheckerRef.current);
      }
    };
  }, []);
  
  
  const API_URL = 'https://k-connect.ru/apiMes';
  
  
  const pingIntervalRef = useRef(null);
  
  
  useEffect(() => {
    console.log('MessengerContext: Using session key:', sessionKey);
    console.log('MessengerContext: API URL:', API_URL);
    console.log('MessengerContext: User is channel:', isChannel);
  }, [sessionKey, isChannel]);
  
  
  const [globalLoading, setGlobalLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState({});
  const activeRequestsRef = useRef({});
  const requestQueueRef = useRef({});
  
  
  const safeRequest = useCallback(async (key, fn) => {
    
    if (activeRequestsRef.current[key]) {
      console.log(`Запрос ${key} уже выполняется, пропускаем дубликат`);
      return null;
    }
    
    
    const now = Date.now();
    const lastRequest = lastRequestTime[key] || 0;
    if (now - lastRequest < 1000) {
      console.log(`Слишком частые запросы для ${key}, пропускаем`);
      return null;
    }
    
    try {
      activeRequestsRef.current[key] = true;
      setLastRequestTime(prev => ({...prev, [key]: now}));
      
      return await fn();
    } finally {
      
      setTimeout(() => {
        activeRequestsRef.current[key] = false;
      }, 300);
    }
  }, [lastRequestTime]);
  
  
  const handleWebSocketMessage = (data) => {
    const { type } = data;
    
    
    lastMessageTimeRef.current = Date.now();
    
    switch (type) {
      case 'connected':
        console.log('Connected as', data.user);
        break;
      
      case 'pong':
        
        break;
      
      case 'error':
        console.error('WebSocket error:', data.message);
        setError(data.message);
        
        
        if (data.message && (
            data.message.includes('authentication') || 
            data.message.includes('session expired') ||
            data.message.includes('unauthorized')
        )) {
          console.log('Серьезная ошибка авторизации, переподключение через 2 секунды');
          setTimeout(() => forceReconnect(), 2000);
        }
        break;
      
      case 'new_message':
        
        const newMessageChatId = data.chatId || data.chat_id;
        const newMessage = data.message;
        
        
        if (newMessage?.sender) {
          const senderId = newMessage.sender.id || newMessage.sender_id;
          
          
          if (senderId && avatarCache[senderId]) {
            newMessage.sender.avatar = avatarCache[senderId];
            console.log(`WebSocket: Применение кэшированной аватарки для отправителя ${senderId}`);
          }
          
          else if (senderId && newMessage.sender.photo) {
            newMessage.sender.avatar = getAvatarUrl(senderId, newMessage.sender.photo);
            console.log(`WebSocket: Обработка аватара для отправителя ${senderId}`);
          }
        }
        
        
        const isOwnMessageFromOtherDevice = newMessage?.sender_id === user?.id;
        
        if (isOwnMessageFromOtherDevice) {
          console.log('Получено собственное сообщение от другого устройства:', newMessage.id);
        }
        
        
        const chatExists = chats.some(c => c.id === parseInt(newMessageChatId));
        
        
        if (!chatExists) {
          console.log(`Получено сообщение для чата ${newMessageChatId}, который не в списке, обновляем список чатов...`);
          refreshChats();
        }
        
        
        handleNewMessage(newMessage, newMessageChatId);
        break;
      
      case 'message_read':
        
        console.log('Received message_read event:', data);
        const messageId = data.messageId || data.message_id;
        const chatId = data.chatId || data.chat_id;
        const userId = data.userId || data.user_id;
        updateReadStatus(messageId, chatId, userId);
        break;
      
      case 'typing_indicator':
        
        updateTypingStatus(data.chatId || data.chat_id, data.userId || data.user_id, true);
        break;
      
      case 'typing_indicator_end':
        
        updateTypingStatus(data.chatId || data.chat_id, data.userId || data.user_id, false);
        break;
      
      case 'user_status':
        
        updateUserStatus(data.user_id, data.status === 'online');
        break;
      
      case 'chat_update':
        
        if (data.chat) {
          console.log('Получено обновление данных чата:', data.chat.id);
          
          
          if (data.chat.members && Array.isArray(data.chat.members)) {
            data.chat.members.forEach(member => {
              const userId = member.user_id || member.id;
              
              
              if (userId && avatarCache[userId]) {
                member.avatar = avatarCache[userId];
                console.log(`WebSocket chat_update: Использована кэшированная аватарка для участника ${userId}`);
              }
              
              else if (userId) {
                const photo = member.photo || member.avatar;
                if (photo) {
                  member.avatar = getAvatarUrl(userId, photo);
                  console.log(`WebSocket chat_update: Обработка аватара для участника ${userId}`);
                }
              }
            });
          }
          
          
          if (!data.chat.is_group && data.chat.members) {
            const otherMember = data.chat.members.find(m => {
              const memberId = m.user_id || m.id;
              const memberIdStr = memberId ? String(memberId) : null;
              const currentUserIdStr = user?.id ? String(user.id) : null;
              return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
            });
            
            if (otherMember) {
              const otherUserId = otherMember.user_id || otherMember.id;
              
              
              if (otherUserId && avatarCache[otherUserId]) {
                data.chat.avatar = avatarCache[otherUserId];
                console.log(`WebSocket chat_update: Использована кэшированная аватарка для чата ${data.chat.id}`);
              }
              
              else if (otherUserId) {
                const photo = otherMember.photo || otherMember.avatar;
                if (photo) {
                  data.chat.avatar = getAvatarUrl(otherUserId, photo);
                  console.log(`WebSocket chat_update: Обработка аватара для чата ${data.chat.id}`);
                }
              }
            }
          }
          
          
          setChats(prev => {
            const chatIndex = prev.findIndex(c => c.id === data.chat.id);
            if (chatIndex === -1) return prev;
            
            
            const currentChat = prev[chatIndex];
            
            
            const newChat = {...data.chat};
            if (currentChat.avatar && 
                typeof currentChat.avatar === 'string' && 
                currentChat.avatar.startsWith('/static/')) {
              newChat.avatar = currentChat.avatar;
            }
            
            
            const newChats = [...prev];
            newChats[chatIndex] = newChat;
            return newChats;
          });
        }
        break;
      
      default:
        console.log('Unknown message type:', type, data);
    }
  };
  
  
  const updateUserStatus = (userId, isOnline) => {
    if (!userId) return;
    
    setOnlineUsers(prev => ({
      ...prev,
      [userId]: isOnline ? new Date().toISOString() : null
    }));
  };
  
  
  const updateTypingStatus = (chatId, userId, isTyping) => {
    if (!chatId || !userId) return;
    
    
    const now = new Date().toISOString();
    
    
    setTypingUsers(prev => {
      const chatTyping = prev[chatId] || {};
      
      if (isTyping) {
        return {
          ...prev,
          [chatId]: {
            ...chatTyping,
            [userId]: now
          }
        };
      } else {
        
        return {
          ...prev,
          [chatId]: {
            ...chatTyping,
            [userId]: 'end-' + now 
          }
        };
      }
    });
    
    
    if (!isTyping) {
      setTimeout(() => {
        setTypingUsers(current => {
          const chatTyping = current[chatId] || {};
          const userTypingStatus = chatTyping[userId];
          
          
          if (userTypingStatus && typeof userTypingStatus === 'string' && userTypingStatus.startsWith('end-')) {
            const newChatTyping = { ...chatTyping };
            delete newChatTyping[userId];
            
            
            if (Object.keys(newChatTyping).length === 0) {
              const newTypingUsers = { ...current };
              delete newTypingUsers[chatId];
              return newTypingUsers;
            }
            
            return {
              ...current,
              [chatId]: newChatTyping
            };
          }
          
          return current;
        });
      }, 5000);
    }
  };
  
  
  const fetchCurrentUser = useCallback(async () => {
    if (!sessionKey || isChannel) return;
    
    try {
      console.log('Загрузка информации о текущем пользователе...');
      const response = await fetch(`${API_URL}/messenger/user`, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        console.log('Получена информация о пользователе:', data.user);
        setUser(data.user);
        
        
        
        setTimeout(() => {
          loadChats();
        }, 100);
        
      } else {
        console.error('Ошибка получения информации о пользователе:', data.error);
        setError('Ошибка получения информации о пользователе');
      }
    } catch (err) {
      console.error('Ошибка получения информации о пользователе:', err);
      setError('Ошибка получения информации о пользователе');
    }
  }, [sessionKey, isChannel, API_URL]);
  
  
  useEffect(() => {
    if (sessionKey && !isChannel) {
      console.log('MessengerContext: Initializing with session key');
      fetchCurrentUser();
      
    } else if (isChannel) {
      console.warn('MessengerContext: Channels cannot use messenger');
    } else {
      console.warn('MessengerContext: No session key available');
    }
    
    return () => {
      if (socket.current) {
        socket.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [sessionKey, fetchCurrentUser, isChannel]);
  
  
  const connectWebSocket = useCallback(() => {
    if (isChannel || !sessionKey) return;
    
    
    if (activeRequestsRef.current['websocket']) {
      console.log('WebSocket соединение уже в процессе, пропускаем');
      return;
    }
    
    
    activeRequestsRef.current['websocket'] = true;
    
    
    const checkWebSocketAvailability = async () => {
      try {
        console.log('Проверка доступности сети перед установкой вебсокета');
        
        const promises = [
          fetch(`${API_URL}/ping?t=${Date.now()}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store'
            },
            timeout: 5000
          }).catch(() => null),
          
          
          fetch(`${window.location.origin}/manifest.json?t=${Date.now()}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store'
            },
            timeout: 5000
          }).catch(() => null)
        ];
        
        const results = await Promise.all(promises);
        
        
        return results.some(response => response && response.ok);
      } catch (err) {
        console.log('Проверка доступности сети не прошла:', err);
        return false;
      }
    };
    
    const setupWebSocket = async () => {
      try {
        
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        
        if (isMobile) {
          console.log('Обнаружено мобильное устройство, проверка доступности сети');
          const isNetworkAvailable = await checkWebSocketAvailability();
          if (!isNetworkAvailable) {
            console.log('Сеть кажется неустойчивой для вебсокета, повторная попытка позже');
            
            setTimeout(() => {
              activeRequestsRef.current['websocket'] = false;
              
              reconnectWebSocket();
            }, 5000);
            return;
          }
        }
        
        
        let connectionEstablished = false;
        
        
        if (socket.current) {
          try {
            console.log('Закрытие существующего вебсокета');
            socket.current.onclose = null; 
            socket.current.onerror = null; 
            socket.current.onmessage = null; 
            socket.current.close();
            socket.current = null;
          } catch (err) {
            console.error('Ошибка при закрытии существующего вебсокета:', err);
            
          } finally {
            
            setIsSocketConnected(false);
          }
        }
        
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/messenger`;
        
        console.log('Подключение к вебсокету:', wsUrl);
        
        
        const webSocket = new WebSocket(wsUrl);
        socket.current = webSocket;
        
        
        const connectionTimeout = setTimeout(() => {
          if (!connectionEstablished) {
            console.log('Время подключения к вебсокету истекло');
            
            
            try {
              webSocket.onclose = null; 
              webSocket.onerror = null;
              webSocket.onmessage = null;
              webSocket.close();
            } catch (e) {
              
            }
            
            
            if (socket.current === webSocket) {
              socket.current = null;
              setIsSocketConnected(false);
            }
            
            
            activeRequestsRef.current['websocket'] = false;
            
            
            if (reconnectAttempts.current < 2) {
              console.log('Попытка альтернативного URL вебсокета (прямой IP)');
              
              
              setTimeout(() => {
                connectWebSocket();
              }, 500);
            } else {
              
              reconnectWebSocket();
            }
          }
        }, isMobile ? 15000 : 10000); 
        
        webSocket.onopen = () => {
          console.log('Вебсокет подключен');
          connectionEstablished = true;
          clearTimeout(connectionTimeout);
          setIsSocketConnected(true);
          
          
          webSocket.send(JSON.stringify({
            token: sessionKey,
            device_id: deviceId
          }));
          
          
          if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
          }
          
          
          
          const pingInterval = isMobile ? 10000 : 30000;
          
          pingIntervalRef.current = setInterval(() => {
            if (webSocket.readyState === WebSocket.OPEN) {
              console.log('Отправка пинга для поддержания соединения');
              try {
                webSocket.send(JSON.stringify({ type: 'ping', device_id: deviceId }));
              } catch (err) {
                console.error('Ошибка при отправке пинга:', err);
                forceReconnect(); 
              }
            } else {
              
              console.log('Пинг обнаружил закрытое соединение, переподключение...');
              forceReconnect(); 
            }
          }, pingInterval);
          
          
          reconnectAttempts.current = 0;
          
          
          startConnectionChecker();
          
          
          setTimeout(() => {
            activeRequestsRef.current['websocket'] = false;
          }, 1000);
        };
        
        webSocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Вебсокет: получено сообщение:', data.type);
            handleWebSocketMessage(data);
            
            
            lastMessageTimeRef.current = Date.now();
          } catch (err) {
            console.error('Ошибка при разборе сообщения вебсокета:', err);
          }
        };
        
        webSocket.onclose = (event) => {
          console.log(`Вебсокет отключен с кодом: ${event.code}, причиной: ${event.reason}`);
          setIsSocketConnected(false);
          clearTimeout(connectionTimeout);
          
          
          if (event.code === 1006) {
            
            console.warn('Аномальное закрытие соединения (код 1006), возможны проблемы с сетью');
            
            setTimeout(() => reconnectWebSocket(), 1000);
          } else if (event.code === 1008 || event.code === 1011) {
            
            console.warn(`Серьезная ошибка соединения (код ${event.code}), возможны проблемы аутентификации`);
            
            setTimeout(() => reconnectWebSocket(), 3000);
          } else {
            
            reconnectWebSocket();
          }
          
          
          if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
          }
        };
        
        webSocket.onerror = (error) => {
          console.error('Ошибка вебсокета:', error);
          
          setErrorReportRef.current('websocket', `WebSocket error: ${error.message || 'Unknown error'}`);
          setIsSocketConnected(false);
          clearTimeout(connectionTimeout);
          
          
          if (socket.current === webSocket) {
            console.log('Обнаружена ошибка активного соединения, принудительное переподключение');
            
            
            try {
              webSocket.close();
            } catch (e) {
              
            }
            
            
            socket.current = null;
            
            
            setTimeout(() => {
              reconnectWebSocket();
            }, 2000);
          }
        };
      } catch (err) {
        console.error('Ошибка при установке вебсокета:', err);
        setError('Ошибка подключения к серверу сообщений');
        
        
        setErrorReportRef.current('websocket_setup', err.message || err.toString());
        
        
        setTimeout(() => {
          activeRequestsRef.current['websocket'] = false;
        }, 5000);
        
        
        reconnectWebSocket();
      }
    };
    
    
    setupWebSocket();
  }, [sessionKey, isChannel, API_URL, deviceId, forceReconnect, startConnectionChecker]);
  
  
  const errorReportRef = useRef({});
  
  
  const setErrorReportRef = {
    current: (key, message) => {
      errorReportRef.current[key] = {
        message,
        timestamp: new Date().toISOString(),
        device: navigator.userAgent
      };
    }
  };
  
  
  const connectionCheckTimerRef = useRef(null);
  
  
  const reconnectAttempts = useRef(0);
  
  const reconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    
    activeRequestsRef.current['websocket'] = false;
    
    
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    
    
    const maxDelay = isMobile ? 15000 : 30000;
    const baseDelay = isMobile ? 800 : 1000;
    
    
    
    const randomFactor = 0.5 + Math.random(); 
    const delay = Math.min(baseDelay * Math.pow(1.5, reconnectAttempts.current) * randomFactor, maxDelay);
    
    reconnectAttempts.current += 1;
    
    console.log(`Планирование переподключения через ${Math.round(delay)}мс (попытка #${reconnectAttempts.current})`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Попытка переподключения #${reconnectAttempts.current}`);
      
      
      if (reconnectAttempts.current > 5) {
        forceReconnect();
      } else {
        connectWebSocket();
      }
    }, delay);
  }, [connectWebSocket, forceReconnect]);
  
  
  useEffect(() => {
    const checkConnectionInterval = setInterval(() => {
      if (sessionKey && !isChannel && !isSocketConnected && !activeRequestsRef.current['websocket']) {
        console.log('Проверка соединения: вебсокет не подключен, переподключение...');
        connectWebSocket();
      }
    }, 60000);
    
    return () => {
      clearInterval(checkConnectionInterval);
    };
  }, [sessionKey, isChannel, isSocketConnected, connectWebSocket]);
  
  
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Страница стала видимой, проверка соединения вебсокета');
        
        
        if (socket.current && 
            (socket.current.readyState === WebSocket.CLOSED || 
             socket.current.readyState === WebSocket.CLOSING)) {
          console.log('Переподключение вебсокета после того, как страница стала видимой');
          
          
          setTimeout(() => {
            connectWebSocket();
          }, 1000);
        } else if (!socket.current) {
          
          connectWebSocket();
        } else {
          
          
          setTimeout(() => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
              console.log('Отправка пинга после изменения видимости');
              socket.current.send(JSON.stringify({ type: 'ping' }));
            }
          }, 1000);
        }
      }
    };

    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectWebSocket]);
  
  
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    
    if (isMobile) {
      
      let failedConnectionsCount = 0;
      
      
      const connectionStateHandler = () => {
        
        if (!isSocketConnected) {
          failedConnectionsCount++;
          console.log(`Счетчик последовательных ошибок подключения на мобильном устройстве: ${failedConnectionsCount}`);
          
          
          
          if (failedConnectionsCount >= 3) {
            console.log('Несколько последовательных ошибок подключения к вебсокету на мобильном устройстве. Реализуем более агрессивную стратегию переподключения');
            
            
            reconnectAttempts.current = 0;
            
            
            reconnectWebSocket();
          }
        } else {
          
          failedConnectionsCount = 0;
        }
      };
      
      
      const checkInterval = setInterval(connectionStateHandler, 15000);
      
      return () => {
        clearInterval(checkInterval);
      };
    }
  }, [isSocketConnected, reconnectWebSocket]);
  
  
  const handleNewMessage = (message, chatId) => {
    if (!message || !chatId) return;
    
    console.log(`Handling new message in chat ${chatId}: message ID ${message.id}`);
    
    
    if (message.created_at) {
      message.created_at = formatToLocalTime(message.created_at);
    }
    
    
    if (message.sender) {
      const senderId = message.sender.id || message.sender_id;
      
      
      if (senderId && !message.sender.avatar && avatarCache[senderId]) {
        message.sender.avatar = avatarCache[senderId];
        console.log(`Применение кэшированной аватарки для отправителя ${senderId}`);
      }
      
      else if (senderId && !message.sender.avatar && message.sender.photo) {
        message.sender.avatar = getAvatarUrl(senderId, message.sender.photo);
        console.log(`Обработка новой аватарки отправителя ${senderId}`);
      }
    }
    
    
    if (message.message_type && message.message_type !== 'text') {
      const messageType = message.message_type;
      const content = message.content;
      
      
      if (content) {
        if (messageType === 'photo' && !message.photo_url) {
          message.photo_url = getFileUrl(chatId, content);
          console.debug(`Сгенерирован URL для фото: ${message.photo_url}`);
        } else if (messageType === 'video' && !message.video_url) {
          message.video_url = getFileUrl(chatId, content);
          console.debug(`Сгенерирован URL для видео: ${message.video_url}`);
        } else if (messageType === 'audio' && !message.audio_url) {
          message.audio_url = getFileUrl(chatId, content);
          console.debug(`Сгенерирован URL для аудио: ${message.audio_url}`);
        } else if (messageType === 'file' && !message.file_url) {
          message.file_url = getFileUrl(chatId, content);
          console.debug(`Сгенерирован URL для файла: ${message.file_url}`);
        }
      } else {
        console.warn(`У сообщения ${message.id} типа ${messageType} отсутствует содержимое`);
      }
    }
    
    
    const isFromCurrentUser = message.sender_id === user?.id;
    
    
    const numChatId = typeof chatId === 'string' ? parseInt(chatId) : chatId;
    
    
    setMessages(prev => {
      const chatMessages = prev[numChatId] || [];
      
      
      if (chatMessages.some(m => m.id === message.id)) {
        return prev;
      }
      
      return {
        ...prev,
        [numChatId]: [...chatMessages, message].sort((a, b) => a.id - b.id)
      };
    });
    
    
    setChats(prev => {
      
      const chatIndex = prev.findIndex(c => c.id === numChatId);
      
      
      if (chatIndex === -1) {
        console.log(`Chat ${numChatId} not found in chat list, refreshing chats...`);
        setTimeout(() => refreshChats(), 100);
        return prev;
      }
      
      
      const chat = { ...prev[chatIndex], last_message: message };
      
      
      if (!chat.is_group && chat.members) {
        
        const otherMember = chat.members.find(m => {
          const memberId = m.user_id || m.id;
          
          const memberIdStr = memberId ? String(memberId) : null;
          const currentUserIdStr = user?.id ? String(user.id) : null;
          return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
        });
        
        if (otherMember) {
          const otherUserId = otherMember.user_id || otherMember.id;
          
          
          if (!chat.avatar || 
              (chat.avatar && typeof chat.avatar === 'string' && !chat.avatar.startsWith('/static/'))) {
            
            
            if (otherUserId && avatarCache[otherUserId]) {
              chat.avatar = avatarCache[otherUserId];
              console.log(`Применение кэшированной аватарки для чата ${numChatId}`);
            }
            
            else {
              const photo = otherMember.photo || otherMember.avatar;
              if (otherUserId && photo) {
                chat.avatar = getAvatarUrl(otherUserId, photo);
                console.log(`Обновление аватара чата ${numChatId} при новом сообщении: ${chat.avatar}`);
              }
            }
          }
        }
      }
      
      
      const newChats = [...prev];
      newChats.splice(chatIndex, 1);
      
      
      console.log(`Moving chat ${numChatId} to top of chat list`);
      return [chat, ...newChats];
    });
    
    
    if (activeChat?.id !== numChatId) {
      
      if (!isFromCurrentUser) {
        setUnreadCounts(prev => ({
          ...prev,
          [numChatId]: (prev[numChatId] || 0) + 1
        }));
      }
    } else if (user && !isFromCurrentUser) {
      
      markMessageAsRead(message.id);
    }
  };
  
  
  const markMessageAsRead = async (messageId) => {
    if (!sessionKey || !messageId || isChannel) return;
    
    try {
      
      await fetch(`${API_URL}/messenger/read/${messageId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Accept': 'application/json'
        }
      });
      
      
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        
        const chatId = Object.keys(messages).find(chatId => 
          messages[chatId].some(message => message.id === messageId)
        );
        
        if (chatId) {
          console.log(`Отправка подтверждения прочтения для сообщения ${messageId} в чате ${chatId}`);
          
          
          
          socket.current.send(JSON.stringify({
            type: 'read_receipt',
            messageId: messageId,
            chatId: parseInt(chatId),
            device_id: deviceId
          }));
          
          
          updateReadStatus(messageId, parseInt(chatId), user?.id);
        }
      }
    } catch (err) {
      console.error('Ошибка при отметке сообщения как прочитанного:', err);
    }
  };
  
  
  const markAllMessagesAsRead = (chatId) => {
    if (!user || !chatId || isChannel) return;
    
    const chatMessages = messages[chatId] || [];
    
    const unreadMessages = chatMessages.filter(msg => 
      msg.sender_id !== user.id && 
      (!msg.read_by || !msg.read_by.includes(user.id))
    );
    
    
    unreadMessages.forEach(msg => {
      markMessageAsRead(msg.id);
    });
    
    
    if (unreadMessages.length > 0) {
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: 0
      }));
    }
  };
  
  
  const updateReadStatus = (messageId, chatId, userId) => {
    if (!messageId || !chatId || !userId) return;
    
    console.log(`Обновление статуса прочтения для сообщения ${messageId} в чате ${chatId} пользователем ${userId}`);
    
    setMessages(prev => {
      const chatMessages = prev[chatId] || [];
      
      const updatedMessages = chatMessages.map(msg => {
        if (msg.id === messageId) {
          
          const currentReadBy = msg.read_by || [];
          
          if (!currentReadBy.includes(userId)) {
            return {
              ...msg,
              read_by: [...currentReadBy, userId],
              read_count: (msg.read_count || 0) + 1
            };
          }
        }
        return msg;
      });
      
      
      
      if (activeChat?.id === chatId && userId === user?.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: 0
        }));
      }
      
      return {
        ...prev,
        [chatId]: updatedMessages
      };
    });
  };
  
  
  const [avatarCache, setAvatarCache] = useState({});
  
  
  const getAvatarUrl = useCallback((userId, photoPath) => {
    if (!userId || !photoPath) return null;
    
    
    if (avatarCache[userId]) {
      return avatarCache[userId];
    }
    
    
    const avatarUrl = buildAvatarUrl(userId, photoPath);
    
    
    setAvatarCache(prev => ({
      ...prev,
      [userId]: avatarUrl
    }));
    
    return avatarUrl;
  }, [avatarCache]);
  
  
  const loadChats = useCallback(async () => {
    if (!sessionKey || isChannel) return;
    if (globalLoading) return;
    
    
    return safeRequest('load_chats', async () => {
      setLoading(true);
      setError(null);
      setGlobalLoading(true);
      
      try {
        console.log('Загрузка чатов с:', `${API_URL}/messenger/chats`);
        const response = await fetch(`${API_URL}/messenger/chats`, {
          headers: {
            'Authorization': `Bearer ${sessionKey}`,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('Получен ответ не в формате JSON:', textResponse.substring(0, 100) + '...');
          throw new Error('API вернул ответ не в формате JSON');
        }
        
        const data = await response.json();
        
        if (data.success) {
          
          const filteredChats = data.chats.filter(chat => {
            
            if (chat.members) {
              const hasChannels = chat.members.some(member => member.type === 'channel');
              return !hasChannels;
            }
            return true;
          });
          
          
          filteredChats.forEach(chat => {
            
            if (chat.last_message && chat.last_message.created_at) {
              chat.last_message.created_at = formatToLocalTime(chat.last_message.created_at);
            }
            
            
            if (chat.members && Array.isArray(chat.members)) {
              chat.members.forEach(member => {
                if (member.last_active) {
                  member.last_active = formatToLocalTime(member.last_active);
                }
                
                const userId = member.user_id || member.id;
                
                if (userId && avatarCache[userId]) {
                  member.avatar = avatarCache[userId];
                }
                
                else if (userId) {
                  const photo = member.photo || member.avatar;
                  if (photo) {
                    
                    member.avatar = getAvatarUrl(userId, photo);
                  }
                }
              });
            }
            
            
            if (!chat.is_group && chat.members) {
              
              const otherMember = chat.members.find(m => {
                const memberId = m.user_id || m.id;
                
                const memberIdStr = memberId ? String(memberId) : null;
                const currentUserIdStr = user?.id ? String(user.id) : null;
                
                return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
              });
              
              if (otherMember) {
                
                const otherUserId = otherMember.user_id || otherMember.id;
                
                
                if (otherUserId && avatarCache[otherUserId]) {
                  chat.avatar = avatarCache[otherUserId];
                }
                
                else if (otherUserId) {
                  const photo = otherMember.photo || otherMember.avatar;
                  if (photo) {
                    
                    chat.avatar = getAvatarUrl(otherUserId, photo);
                  }
                }
                
                
                if (!chat.title) {
                  chat.title = otherMember.name || otherMember.username || `Пользователь #${otherUserId}`;
                }
              }
            }
          });
          
          setChats(filteredChats);
          
          
          const newHasMoreMessages = {};
          const newLastFetchedMessageId = {};
          
          filteredChats.forEach(chat => {
            newHasMoreMessages[chat.id] = true;
            newLastFetchedMessageId[chat.id] = null;
          });
          
          setHasMoreMessages(newHasMoreMessages);
          setLastFetchedMessageId(newLastFetchedMessageId);
          
          
          connectWebSocket();
        } else {
          setError(data.error || 'Ошибка загрузки чатов');
        }
      } catch (err) {
        console.error('Ошибка загрузки чатов:', err);
        setError('Ошибка загрузки чатов');
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    });
  }, [sessionKey, isChannel, API_URL, connectWebSocket, safeRequest, globalLoading, user, avatarCache, getAvatarUrl]);
  
  
  const getChatDetails = async (chatId) => {
    if (!sessionKey || !chatId || isChannel) return null;
    
    try {
      const response = await fetch(`${API_URL}/messenger/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Accept': 'application/json'
        }
      });
      
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Получен ответ не в формате JSON:', textResponse.substring(0, 100) + '...');
        throw new Error('API вернул ответ не в формате JSON');
      }
      
      const data = await response.json();
      
      if (data.success) {
        
        if (data.chat.members) {
          const hasChannels = data.chat.members.some(member => member.type === 'channel');
          if (hasChannels) {
            console.warn('Чат имеет участников-каналов, не возвращаем детали');
            return null;
          }
          
          
          if (data.chat.last_message && data.chat.last_message.created_at) {
            data.chat.last_message.created_at = formatToLocalTime(data.chat.last_message.created_at);
          }
          
          
          data.chat.members.forEach(member => {
            
            if (member.last_active) {
              member.last_active = formatToLocalTime(member.last_active);
            }
            
            const userId = member.user_id || member.id;
            
            if (userId) {
              const photo = member.photo || member.avatar;
              if (photo) {
                console.log(`Детали чата ${chatId}: обработка аватара для участника ${userId}, фото: ${photo}`);
                member.avatar = buildAvatarUrl(userId, photo);
              }
            }
          });
          
          
          if (!data.chat.is_group) {
            console.log(`Детали чата ${chatId}, мой ID: ${user?.id}, участники:`, 
              data.chat.members.map(m => ({ id: m.user_id || m.id, name: m.name })));
            
            
            const otherMember = data.chat.members.find(m => {
              const memberId = m.user_id || m.id;
              
              const memberIdStr = memberId ? String(memberId) : null;
              const currentUserIdStr = user?.id ? String(user.id) : null;
              
              return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
            });
            
            console.log(`Детали чата ${chatId} - собеседник:`, otherMember ? 
              { id: otherMember.user_id || otherMember.id, name: otherMember.name } : 'не найден');
            
            if (otherMember) {
              
              const otherUserId = otherMember.user_id || otherMember.id;
              
              const photo = otherMember.photo || otherMember.avatar;
              
              if (otherUserId && photo) {
                console.log(`Детали чата ${chatId}: установка аватара из данных пользователя ${otherUserId}, фото: ${photo}`);
                data.chat.avatar = buildAvatarUrl(otherUserId, photo);
                
                
                if (!data.chat.title) {
                  data.chat.title = otherMember.name || otherMember.username || `Пользователь #${otherUserId}`;
                }
              } else {
                console.warn(`Детали чата ${chatId}: нет данных для аватара, пользователь ${otherUserId}`);
              }
            } else {
              console.warn(`Детали чата ${chatId}: не найден собеседник`);
            }
          }
        }
        
        return data.chat;
      } else {
        console.error('Ошибка получения деталей чата:', data.error);
        return null;
      }
    } catch (err) {
      console.error('Ошибка получения деталей чата:', err);
      return null;
    }
  };
  
  
  const loadMessages = useCallback(async (chatId, limit = 30, isRetry = false) => {
    if (!sessionKey || !chatId || isChannel) return;
    
    
    const chat = chats.find(c => c.id === chatId);
    const isGroupChat = chat?.is_group;
    
    console.log(`MessengerContext.loadMessages: Загрузка сообщений для чата ${chatId}, isGroup=${isGroupChat}, isRetry=${isRetry}`);
    
    
    if (loadingMessages || (hasMoreMessages[chatId] === false && messages[chatId]?.length > 0)) {
      console.log(`MessengerContext.loadMessages: Пропуск запроса - уже загружается или все сообщения загружены`);
      return;
    }
    
    
    const requestKey = isRetry ? `load_messages_retry_${chatId}` : `load_messages_${chatId}`;
    
    return safeRequest(requestKey, async () => {
      setLoadingMessages(true);
      
      try {
        const beforeId = lastFetchedMessageId[chatId];
        const url = `${API_URL}/messenger/chats/${chatId}/messages${beforeId ? `?before_id=${beforeId}&limit=${limit}` : `?limit=${limit}`}`;
        
        console.log(`MessengerContext.loadMessages: Fetching messages from ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${sessionKey}`,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store'
          }
        });
        
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('Получен ответ не в формате JSON:', textResponse.substring(0, 100) + '...');
          throw new Error('API вернул ответ не в формате JSON');
        }
        
        const data = await response.json();
        
        if (data.success) {
          const newMessages = data.messages || [];
          console.log(`MessengerContext.loadMessages: Получено ${newMessages.length} сообщений для чата ${chatId}`);
          
          
          newMessages.forEach(msg => {
            if (msg.created_at) {
              msg.created_at = formatToLocalTime(msg.created_at);
            }
          });
          
          
          const hasModeratorMessages = data.has_moderator_messages === true;
          
          setMessages(prev => {
            const existingMessages = prev[chatId] || [];
            
            
            const mergedMessages = [...existingMessages];
            
            newMessages.forEach(newMsg => {
              if (!mergedMessages.some(msg => msg.id === newMsg.id)) {
                mergedMessages.push(newMsg);
              }
            });
            
            
            mergedMessages.sort((a, b) => a.id - b.id);
            
            
            mergedMessages.hasModeratorMessages = hasModeratorMessages;
            
            return {
              ...prev,
              [chatId]: mergedMessages
            };
          });
          
          
          if (newMessages.length < limit) {
            setHasMoreMessages({
              ...hasMoreMessages,
              [chatId]: false
            });
          } else {
            
            const oldestMsgId = Math.min(...newMessages.map(m => m.id));
            setLastFetchedMessageId({
              ...lastFetchedMessageId,
              [chatId]: oldestMsgId
            });
          }
          
          
          if (user) {
            newMessages.forEach(msg => {
              if (msg.sender_id !== user.id) {
                markMessageAsRead(msg.id);
              }
            });
          }
          
          
          if (isGroupChat && newMessages.length === 0 && chat?.last_message && !isRetry) {
            console.log(`MessengerContext.loadMessages: Scheduling retry for group chat ${chatId} with empty messages`);
            setTimeout(() => {
              loadMessages(chatId, limit, true);
            }, 1000);
          }
        } else {
          console.error('Ошибка загрузки сообщений:', data.error);
        }
      } catch (err) {
        console.error('Ошибка загрузки сообщений:', err);
        
        
        if (isGroupChat && !isRetry) {
          console.log(`MessengerContext.loadMessages: Scheduling retry after error for group chat ${chatId}`);
          setTimeout(() => {
            loadMessages(chatId, limit, true);
          }, 1500);
        }
      } finally {
        setLoadingMessages(false);
      }
    });
  }, [sessionKey, isChannel, API_URL, lastFetchedMessageId, loadingMessages, hasMoreMessages, messages, safeRequest, chats, user]);
  
  
  const createPersonalChat = async (userId, encrypted = false) => {
    if (!sessionKey || !userId || isChannel) return null;
    
    try {
      
      const userInfo = await getUserInfo(userId);
      if (userInfo?.type === 'channel') {
        setError('Нельзя создать чат с каналом');
        return null;
      }
      
      const response = await fetch(`${API_URL}/messenger/chats/personal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, encrypted })
      });
      
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        
        await loadChats();
        return data.chat_id;
      } else {
        setError(data.error || 'Ошибка создания чата');
        return null;
      }
    } catch (err) {
      console.error('Ошибка создания личного чата:', err);
      setError('Ошибка создания чата');
      return null;
    }
  };
  
  
  const createGroupChat = async (title, memberIds, encrypted = false) => {
    if (!sessionKey || !memberIds || !memberIds.length || isChannel) return null;
    
    try {
      
      const memberPromises = memberIds.map(id => getUserInfo(id));
      const memberInfos = await Promise.all(memberPromises);
      
      if (memberInfos.some(m => m?.type === 'channel')) {
        setError('Нельзя добавлять каналы в групповой чат');
        return null;
      }
      
      const response = await fetch(`${API_URL}/messenger/chats/group`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          title, 
          member_ids: memberIds,
          encrypted 
        })
      });
      
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        
        await loadChats();
        return data.chat_id;
      } else {
        setError(data.error || 'Ошибка создания группы');
        return null;
      }
    } catch (err) {
      console.error('Error creating group chat:', err);
      setError('Ошибка создания группы');
      return null;
    }
  };
  
  
  const sendTextMessage = async (chatId, text, replyToId = null) => {
    if (!sessionKey || !chatId || !text.trim() || !user || isChannel) return null;
    
    try {
      const chat = chats.find(c => c.id === chatId);
      let messageText = text;
      
      
      if (chat?.encrypted) {
        const encryptionKey = chat.encryption_key || String(chatId);
        messageText = xorCipher(text, encryptionKey);
      }
      
      
      const headers = {
        'Authorization': `Bearer ${sessionKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Device-ID': deviceId
      };
      
      const response = await fetch(`${API_URL}/messenger/chats/${chatId}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          text: messageText,
          reply_to_id: replyToId,
          device_id: deviceId  
        })
      });
      
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        
        const newMessage = data.message;
        
        
        if (newMessage.created_at) {
          newMessage.created_at = formatToLocalTime(newMessage.created_at);
        }
        
        
        setMessages(prev => {
          const chatMessages = prev[chatId] || [];
          return {
            ...prev,
            [chatId]: [...chatMessages, newMessage].sort((a, b) => a.id - b.id)
          };
        });
        
        
        setChats(prev => {
          const chatIndex = prev.findIndex(c => c.id === chatId);
          if (chatIndex === -1) return prev;
          
          const updatedChat = { ...prev[chatIndex], last_message: newMessage };
          const newChats = [...prev];
          newChats.splice(chatIndex, 1);
          
          return [updatedChat, ...newChats];
        });
        
        return newMessage;
      } else {
        setError(data.error || 'Ошибка отправки сообщения');
        return null;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Ошибка отправки сообщения');
      return null;
    }
  };
  
  
  const uploadFile = async (chatId, file, type, replyToId = null) => {
    if (!sessionKey || !chatId || !file || !user || isChannel) return null;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message_type', type);
      
      if (replyToId) {
        formData.append('reply_to_id', replyToId);
      }
      
      const response = await fetch(`${API_URL}/messenger/chats/${chatId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        
        const newMessage = data.message;
        
        
        if (newMessage.created_at) {
          newMessage.created_at = formatToLocalTime(newMessage.created_at);
        }
        
        setMessages(prev => {
          const chatMessages = prev[chatId] || [];
          return {
            ...prev,
            [chatId]: [...chatMessages, newMessage].sort((a, b) => a.id - b.id)
          };
        });
        
        
        setChats(prev => {
          return prev.map(chat => {
            if (chat.id === chatId) {
              return { ...chat, last_message: newMessage };
            }
            return chat;
          });
        });
        
        return newMessage;
      } else {
        setError(data.error || 'Ошибка загрузки файла');
        return null;
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Ошибка загрузки файла');
      return null;
    }
  };
  
  
  const sendTypingIndicator = (chatId, isTyping) => {
    if (!socket.current || !chatId || !isSocketConnected || isChannel) return;
    
    try {
      socket.current.send(JSON.stringify({
        type: isTyping ? 'typing_start' : 'typing_end',
        chatId
      }));
    } catch (err) {
      console.error('Error sending typing indicator:', err);
    }
  };
  
  
  const searchUsers = async (query, limit = 20) => {
    if (!sessionKey || !query || isChannel) return [];
    
    try {
      const response = await fetch(`${API_URL}/messenger/users/search?query=${encodeURIComponent(query)}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Accept': 'application/json'
        }
      });
      
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        
        const filteredUsers = (data.users || []).filter(user => user.type !== 'channel');
        return filteredUsers;
      } else {
        console.error('Error searching users:', data.error);
        return [];
      }
    } catch (err) {
      console.error('Error searching users:', err);
      return [];
    }
  };
  
  
  const getUserInfo = async (userId) => {
    if (!sessionKey || !userId || isChannel) return null;
    
    try {
      const response = await fetch(`${API_URL}/messenger/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Accept': 'application/json'
        }
      });
      
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        
        if (data.user) {
          
          console.log('User fields:', Object.keys(data.user));
          
          
          const photo = data.user.photo || data.user.avatar;
          if (photo) {
            data.user.avatar = buildAvatarUrl(data.user.id, photo);
          }
        }
        return data.user;
      } else {
        console.error('Error getting user info:', data.error);
        return null;
      }
    } catch (err) {
      console.error('Error getting user info:', err);
      return null;
    }
  };
  
  
  const decryptMessage = (message, chatId) => {
    if (!message) return message;
    
    const chat = chats.find(c => c.id === chatId);
    
    if (chat?.encrypted && message.content) {
      const encryptionKey = chat.encryption_key || String(chatId);
      try {
        return xorCipher(message.content, encryptionKey);
      } catch (err) {
        console.error('Error decrypting message:', err);
        return '🔒 [Ошибка расшифровки]';
      }
    }
    
    return message.content;
  };
  
  
  const getFileUrl = (chatId, filePath) => {
    if (!sessionKey || !filePath) return '';
    
    
    const authParam = `token=${encodeURIComponent(sessionKey)}`;
    
    
    let url = `${API_URL}/messenger/files/${chatId}/`;
    
    
    if (filePath.includes(`attachments/chat_${chatId}/`)) {
      
      const pathParts = filePath.split(`attachments/chat_${chatId}/`);
      url += pathParts[1];
    } else {
      
      url += filePath;
    }
    
    
    url += `?${authParam}`;
    
    console.log(`Generated file URL: ${url}`);
    return url;
  };
  
  
  const setActiveAndLoadChat = useCallback((chatId) => {
    if (isChannel) return;
    
    const chat = chats.find(c => c.id === chatId);
    
    if (chat) {
      
      if (activeChat?.id === chatId) return;
      
      console.log(`MessengerContext.setActiveAndLoadChat: Activating chat ${chatId}, isGroup=${chat.is_group}`);
      setActiveChat(chat);
      
      
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: 0
      }));
      
      
      if (!messages[chatId] || messages[chatId].length === 0) {
        console.log(`MessengerContext.setActiveAndLoadChat: No messages loaded for chat ${chatId}, loading...`);
        setTimeout(() => {
          loadMessages(chatId);
          
          
          if (chat.is_group) {
            setTimeout(() => {
              if (!messages[chatId] || messages[chatId].length === 0) {
                console.log(`MessengerContext.setActiveAndLoadChat: Retry loading messages for group chat ${chatId}`);
                loadMessages(chatId, 30, true);
              }
            }, 1500);
          }
        }, 100);
      } else {
        console.log(`MessengerContext.setActiveAndLoadChat: Already have ${messages[chatId].length} messages for chat ${chatId}`);
      }
      
      
      if (user && messages[chatId] && messages[chatId].length > 0) {
        messages[chatId].forEach(msg => {
          if (msg.sender_id !== user.id && (!msg.read_by || !msg.read_by.includes(user.id))) {
            markMessageAsRead(msg.id);
          }
        });
      }
    }
  }, [isChannel, chats, messages, user, loadMessages, activeChat]);
  
  
  const updateLastMessage = (chatId, message) => {
    if (isChannel) return;
    
    setChats(prev => {
      return prev.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, last_message: message };
        }
        return chat;
      }).sort((a, b) => {
        const aTime = a.last_message?.created_at ? new Date(a.last_message.created_at).getTime() : 0;
        const bTime = b.last_message?.created_at ? new Date(b.last_message.created_at).getTime() : 0;
        return bTime - aTime;
      });
    });
  };
  
  
  const refreshChats = () => {
    if (isChannel) return;
    
    
    if (!user) {
      console.log('refreshChats: данные пользователя не загружены, сначала загружаем user');
      fetchCurrentUser();
      return;
    }
    
    console.log('refreshChats: обновление списка чатов...');
    loadChats();
  };
  
  
  const getTotalUnreadCount = () => {
    if (isChannel) return 0;
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  };
  
  
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const fallbackPollingRef = useRef(null);
  
  
  useEffect(() => {
    
    if (useFallbackMode) return;
    
    
    if (reconnectAttempts.current > 5) {
      console.log('Too many WebSocket connection failures, switching to fallback mode (REST polling)');
      setUseFallbackMode(true);
    }
    
    
    const checkWebSocketAvailability = async () => {
      try {
        const pingResponse = await fetch(`${API_URL}/ping?t=${Date.now()}`, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache, no-store' }
        }).catch(() => null);
        
        if (pingResponse && pingResponse.ok) {
          console.log('Network seems stable, attempting to switch back to WebSocket mode');
          setUseFallbackMode(false);
          reconnectAttempts.current = 0;
          connectWebSocket();
        }
      } catch (err) {
        
      }
    };
    
    
    if (useFallbackMode) {
      console.log('Setting up fallback polling mechanism');
      
      
      if (fallbackPollingRef.current) {
        clearInterval(fallbackPollingRef.current);
      }
      
      
      fallbackPollingRef.current = setInterval(async () => {
        if (document.visibilityState !== 'visible') return;
        
        
        if (activeChat) {
          try {
            console.log(`Fallback mode: polling for new messages in chat ${activeChat.id}`);
            await loadMessages(activeChat.id, 10);
          } catch (err) {
            console.error('Error polling messages in fallback mode:', err);
          }
        }
        
        
        try {
          console.log('Fallback mode: refreshing chat list');
          await loadChats();
        } catch (err) {
          console.error('Error refreshing chats in fallback mode:', err);
        }
        
        
        if (Math.random() < 0.3) { 
          checkWebSocketAvailability();
        }
      }, 5000); 
      
      return () => {
        if (fallbackPollingRef.current) {
          clearInterval(fallbackPollingRef.current);
        }
      };
    }
  }, [useFallbackMode, activeChat, API_URL, loadChats, loadMessages, connectWebSocket]);
  
  
  useEffect(() => {
    
    const handleNetworkChange = () => {
      if (navigator.onLine) {
        
        console.log('Сеть снова доступна, проверка состояния вебсокета');
        if (!isSocketConnected || !socket.current || 
            socket.current.readyState !== WebSocket.OPEN) {
          console.log('Вебсокет отключен или в неправильном состоянии, переподключение');
          setTimeout(() => {
            forceReconnect();
          }, 1000);
        }
      } else {
        
        console.log('Сеть недоступна, ожидание восстановления');
        setIsSocketConnected(false);
      }
    };

    
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, [isSocketConnected, forceReconnect]);

  
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
        
        
        if (url.includes('/apiMes/') && response.status === 401) {
          console.warn('Обнаружена ошибка авторизации API (401), проверка состояния вебсокета');
          
          
          setTimeout(() => {
            if (sessionKey) {
              forceReconnect();
            }
          }, 2000);
        }
        
        return response;
      } catch (error) {
        
        if (args[0].includes && args[0].includes('/apiMes/')) {
          console.warn('Ошибка сети при запросе к API мессенджера');
          
          
          if (isSocketConnected && socket.current && socket.current.readyState === WebSocket.OPEN) {
            console.log('API ошибка: Вебсокет подключен, отправка тестового пинга');
            
            try {
              socket.current.send(JSON.stringify({ type: 'ping', device_id: deviceId }));
            } catch (err) {
              console.error('Ошибка отправки тестового пинга, переподключение вебсокета');
              forceReconnect();
            }
          }
        }
        
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, [sessionKey, isSocketConnected, deviceId, forceReconnect]);
  
  
  useEffect(() => {
    if (user && chats.length > 0) {
      console.log('MessengerContext: Пользователь загружен, обновляем пути аватарок для чатов');
      
      
      const updatedChats = [...chats];
      
      
      updatedChats.forEach(chat => {
        
        if (!chat.is_group && chat.members) {
          
          const otherMember = chat.members.find(m => {
            const memberId = m.user_id || m.id;
            const memberIdStr = memberId ? String(memberId) : null;
            const currentUserIdStr = user?.id ? String(user.id) : null;
            
            return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
          });
          
          if (otherMember) {
            const otherUserId = otherMember.user_id || otherMember.id;
            const photo = otherMember.photo || otherMember.avatar;
            
            if (otherUserId && photo) {
              
              chat.avatar = buildAvatarUrl(otherUserId, photo);
              console.log(`Обновлен аватар для чата ${chat.id}, пользователь ${otherUserId}, аватар: ${chat.avatar}`);
            }
          }
        }
      });
      
      
      setChats(updatedChats);
    }
  }, [user, chats.length]);
  
  
  const value = {
    user,
    chats,
    activeChat,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    loadingMessages,
    error,
    unreadCounts,
    hasMoreMessages,
    isSocketConnected,
    isChannel,
    deviceId,
    useFallbackMode,
    avatarCache, 
    getAvatarUrl, 
    setActiveChat: (chatId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return;
      }
      return setActiveAndLoadChat(chatId);
    },
    loadMessages: (chatId, limit) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return loadMessages(chatId, limit);
    },
    loadMoreMessages: (chatId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return loadMessages(chatId);
    },
    sendTextMessage: (chatId, text, replyToId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return sendTextMessage(chatId, text, replyToId);
    },
    uploadFile: (chatId, file, type, replyToId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return uploadFile(chatId, file, type, replyToId);
    },
    markMessageAsRead: (messageId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return;
      }
      return markMessageAsRead(messageId);
    },
    markAllMessagesAsRead: (chatId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return;
      }
      return markAllMessagesAsRead(chatId);
    },
    sendTypingIndicator: (chatId, isTyping) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return;
      }
      return sendTypingIndicator(chatId, isTyping);
    },
    searchUsers: (query, limit) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve([]);
      }
      return searchUsers(query, limit);
    },
    getUserInfo: (userId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return getUserInfo(userId);
    },
    createPersonalChat: (userId, encrypted) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return createPersonalChat(userId, encrypted);
    },
    createGroupChat: (title, memberIds, encrypted) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return createGroupChat(title, memberIds, encrypted);
    },
    getChatDetails: (chatId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return Promise.resolve(null);
      }
      return getChatDetails(chatId);
    },
    decryptMessage,
    getFileUrl,
    refreshChats: () => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return;
      }
      return refreshChats();
    },
    getTotalUnreadCount: () => {
      
      if (isChannel) return 0;
      return getTotalUnreadCount();
    },
    updateLastMessage: (chatId, message) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return;
      }
      return updateLastMessage(chatId, message);
    },
    sessionKey,
    forceReconnectSocket: () => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return;
      }
      return forceReconnect();
    },
    
    deleteMessage: async (messageId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return { success: false, error: 'Операция недоступна для каналов' };
      }

      try {
        const response = await axios.delete(`/api/messenger/messages/${messageId}`, {
          headers: { 
            'X-Device-ID': deviceId,
            'X-Session-Key': sessionKey
          }
        });
        
        if (response.data && response.data.success) {
          
          let messageChatId = null;
          let deletedMessage = null;
          
          
          Object.entries(messages).forEach(([chatId, chatMessages]) => {
            const foundMessage = chatMessages.find(msg => msg.id === messageId);
            if (foundMessage) {
              messageChatId = parseInt(chatId);
              deletedMessage = foundMessage;
            }
          });
          
          if (messageChatId) {
            
            setMessages(prevMessages => {
              const updatedChatMessages = (prevMessages[messageChatId] || [])
                .filter(msg => msg.id !== messageId);
                
              return {
                ...prevMessages,
                [messageChatId]: updatedChatMessages
              };
            });
            
            
            const chat = chats.find(c => c.id === messageChatId);
            if (chat && chat.last_message && chat.last_message.id === messageId) {
              
              const chatMessages = messages[messageChatId] || [];
              const newLastMessage = chatMessages
                .filter(msg => msg.id !== messageId)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
              
              if (newLastMessage) {
                updateLastMessage(messageChatId, newLastMessage);
              }
            }
          }
          
          return { success: true };
        } else {
          console.error('Ошибка удаления сообщения:', response.data?.error || 'Неизвестная ошибка');
          return { success: false, error: response.data?.error || 'Не удалось удалить сообщение' };
        }
      } catch (error) {
        console.error('Ошибка удаления сообщения:', error);
        return { 
          success: false, 
          error: error.response?.data?.error || 'Произошла ошибка при удалении сообщения' 
        };
      }
    },
    
    
    deleteChat: async (chatId) => {
      
      if (isChannel) {
        console.warn('MessengerContext: Канал не может использовать мессенджер. Операция заблокирована.');
        return { success: false, error: 'Операция недоступна для каналов' };
      }

      try {
        const response = await axios.delete(`/api/messenger/chats/${chatId}`, {
          headers: { 
            'X-Device-ID': deviceId,
            'X-Session-Key': sessionKey
          }
        });
        
        if (response.data && response.data.success) {
          
          setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
          
          
          if (activeChat && activeChat.id === chatId) {
            setActiveChat(null);
            setMessages([]);
          }
          
          return { success: true };
        } else {
          console.error('Ошибка удаления чата:', response.data?.error || 'Неизвестная ошибка');
          return { success: false, error: response.data?.error || 'Не удалось удалить чат' };
        }
      } catch (error) {
        console.error('Ошибка удаления чата:', error);
        return { 
          success: false, 
          error: error.response?.data?.error || 'Произошла ошибка при удалении чата'
        };
      }
    },
    
    
    enableLogging: (enable = true) => {
      if (typeof window !== 'undefined') {
        window.MESSENGER_DEV_MODE = enable;
        console.log(`Messenger logging ${enable ? 'enabled' : 'disabled'}`);
      }
    }
  };
  
  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
};

export const useMessenger = () => {
  const context = React.useContext(MessengerContext);
  if (!context) {
    throw new Error('useMessenger must be used within a MessengerProvider');
  }
  return context;
}; 