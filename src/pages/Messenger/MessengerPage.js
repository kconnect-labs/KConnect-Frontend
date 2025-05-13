import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  Badge, 
  Drawer, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider, 
  Paper, 
  CircularProgress,
  useMediaQuery,
  InputAdornment,
  Tooltip,
  styled,
  Button
} from '@mui/material';
import { 
  Send as SendIcon, 
  Menu as MenuIcon, 
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
  SentimentSatisfiedAlt as EmojiIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import messengerService from '../../services/Messenger/MessengerService';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';




const MessageBubble = React.memo(({ message, isOwn, showAvatar, userName }) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  
  const formattedTime = useMemo(() => {
    try {
      const date = new Date(message.created_at);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  }, [message.created_at]);
  
  const isRead = useMemo(() => {
    return message.read_by && message.read_by.length > 0;
  }, [message.read_by]);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mb: 1,
        position: 'relative',
      }}
    >
      {!isOwn && showAvatar && (
        <Avatar
          src={message.user_photo} 
          alt={message.user_name}
          sx={{ 
            width: 32, 
            height: 32,
            mr: 1,
            mt: 'auto',
            mb: 0.5
          }}
        />
      )}
      
      {!isOwn && !showAvatar && (
        <Box sx={{ width: 32, mr: 1 }} />
      )}
      
      <Box 
        sx={{ 
          maxWidth: { xs: '85%', sm: '70%', md: '60%' },
          borderRadius: isOwn 
            ? '18px 18px 0px 18px' 
            : '18px 18px 18px 0px',
          p: 1.5,
          pb: 2.5,
          backgroundColor: isOwn 
            ? themeSettings.primaryColor || '#D0BCFF' 
            : themeSettings.paperColor || 'rgba(32, 33, 36, 0.5)',
          color: isOwn ? '#000' : theme.palette.text.primary,
          position: 'relative',
          wordBreak: 'break-word',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {!isOwn && (
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 'bold', 
              color: themeSettings.primaryColor || '#D0BCFF',
              fontSize: '0.85rem',
              mb: 0.5
            }}
          >
            {message.user_name}
          </Typography>
        )}
        
        <Typography variant="body1">
          {message.content}
        </Typography>
        
        <Box 
          sx={{ 
            position: 'absolute', 
            right: 8, 
            bottom: 4, 
            display: 'flex', 
            alignItems: 'center',
            opacity: 0.7,
            fontSize: '0.7rem'
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.7rem', 
              mr: isOwn ? 0.5 : 0,
              color: isOwn ? 'rgba(0,0,0,0.7)' : 'inherit'
            }}
          >
            {formattedTime}
          </Typography>
          
          {isOwn && (
            isRead ? (
              <DoneAllIcon 
                sx={{ 
                  fontSize: '0.9rem', 
                  color: themeSettings.secondaryColor || '#4285F4'
                }} 
              />
            ) : (
              <CheckIcon 
                sx={{ 
                  fontSize: '0.9rem', 
                  color: 'rgba(0,0,0,0.5)'
                }} 
              />
            )
          )}
        </Box>
      </Box>
    </Box>
  );
});


const ChatList = React.memo(({ chats, selectedChatId, onChatSelect, searchQuery, onSearchChange }) => {
  
  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter(chat => 
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.members?.some(member => 
        member.user_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [chats, searchQuery]);
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          p: 2, 
          position: 'sticky', 
          top: 0, 
          zIndex: 1, 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <TextField
          fullWidth
          placeholder="Поиск чатов"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            borderRadius: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
      </Box>
      
      <List sx={{ flexGrow: 1, overflow: 'auto', pt: 0 }}>
        {filteredChats.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'Чаты не найдены' : 'Нет доступных чатов'}
            </Typography>
          </Box>
        ) : (
          filteredChats.map(chat => (
            <React.Fragment key={chat.id}>
              <ListItem 
                button 
                selected={selectedChatId === chat.id}
                onClick={() => onChatSelect(chat.id)}
                sx={{ 
                  py: 1.5,
                  backgroundColor: selectedChatId === chat.id 
                    ? 'rgba(208, 188, 255, 0.08)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="error"
                    badgeContent={chat.unread_count}
                    invisible={chat.unread_count <= 0}
                    overlap="circular"
                  >
                    <Avatar 
                      src={
                        chat.is_group
                          ? null
                          : chat.members.find(member => member.user_id !== chat.current_user_id)?.user_photo
                      }
                      alt={chat.name}
                      sx={{ bgcolor: chat.is_group ? 'primary.main' : undefined }}
                    >
                      {!chat.is_group && chat.name ? chat.name.charAt(0).toUpperCase() : 'G'}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      noWrap 
                      sx={{ 
                        fontWeight: chat.unread_count > 0 ? 'bold' : 'normal'
                      }}
                    >
                      {chat.name}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      noWrap 
                      color="text.secondary"
                      sx={{ 
                        opacity: 0.7,
                        fontWeight: chat.unread_count > 0 ? 'medium' : 'normal'
                      }}
                    >
                      {chat.last_message?.content ? (
                        <>
                          {chat.is_group && `${chat.last_message.user_name}: `}
                          {chat.last_message.content}
                        </>
                      ) : 'Нет сообщений'}
                    </Typography>
                  }
                />
                {chat.last_message && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      ml: 1, 
                      minWidth: 40, 
                      textAlign: 'right',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatMessageTime(chat.last_message.created_at)}
                  </Typography>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
});


const ChatHeader = React.memo(({ chat, onBackClick, isMobile }) => {
  const lastSeen = useMemo(() => {
    if (chat.is_group) return `${chat.members.length} участников`;
    
    const otherMember = chat.members?.find(m => m.user_id !== chat.current_user_id);
    return 'В сети';
  }, [chat]);
  
  return (
    <Box 
      sx={{ 
        p: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        borderBottom: 1, 
        borderColor: 'divider', 
        backgroundColor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      {isMobile && (
        <IconButton edge="start" onClick={onBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
      )}
      
      <Avatar 
        src={
          chat.is_group
            ? null
            : chat.members?.find(member => member.user_id !== chat.current_user_id)?.user_photo
        }
        sx={{ width: 40, height: 40, mr: 2 }}
      >
        {chat.name ? chat.name.charAt(0).toUpperCase() : ''}
      </Avatar>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography variant="subtitle1" noWrap>
          {chat.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {lastSeen}
        </Typography>
      </Box>
      
      <IconButton>
        <SearchIcon />
      </IconButton>
      
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
});


const formatMessageTime = (timestamp) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {

      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {

      return 'Вчера';
    } else {

      return formatDistanceToNow(date, { locale: ru, addSuffix: true });
    }
  } catch (e) {
    return '';
  }
};


const MessengerPage = () => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const { user } = useContext(AuthContext);
  

  useEffect(() => {
    console.log('🔎 DEBUG: MessengerPage component mounted');
    console.log('🔎 DEBUG: messengerService imported:', messengerService);
    

    const token = localStorage.getItem('session_key');
    console.log('🔎 DEBUG: Current session_key token:', token ? `${token.substring(0, 20)}...` : 'No token');
    

    console.log('🔎 DEBUG: Testing direct fetch to API');
    fetch('/api-messenger/', {
      headers: {
        'Authorization': token || ''
      }
    })
      .then(response => {
        console.log('🔎 DEBUG: Direct API response status:', response.status);
        return response.text();
      })
      .then(text => {
        console.log('🔎 DEBUG: Direct API response text:', text);
        

        console.log('🔎 DEBUG: Testing direct fetch to /chats API with query param');
        return fetch(`/api-messenger/chats?session_key=${encodeURIComponent(token || '')}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      })
      .then(response => {
        console.log('🔎 DEBUG: Direct /chats API with query param response status:', response.status);
        return response.text();
      })
      .then(text => {
        console.log('🔎 DEBUG: Direct /chats API with query param response text:', text);
        

        console.log('🔎 DEBUG: Testing direct fetch to /chats API with Authorization header only');
        return fetch('/api-messenger/chats', {
          headers: {
            'Authorization': token || '',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
      })
      .then(response => {
        console.log('🔎 DEBUG: Direct /chats API with auth header response status:', response.status);
        return response.text();
      })
      .then(text => {
        console.log('🔎 DEBUG: Direct /chats API with auth header response text:', text);
      })
      .catch(error => {
        console.error('🔎 DEBUG: Direct API fetch error:', error);
      });
    

    console.log('🔎 DEBUG: Testing chat list via service');
    messengerService.getChats()
      .then(chats => {
        console.log('🔎 DEBUG: Service getChats success:', chats);
      })
      .catch(error => {
        console.error('🔎 DEBUG: Service getChats error:', error);
      });
      
  }, []);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const messageContainerRef = useRef(null);
  

  useEffect(() => {
    console.log('Initializing WebSocket in component mount');

    messengerService.initWebSocket();
    

    const removeConnectionListener = messengerService.addConnectionListener((status) => {
      console.log('WebSocket connection status changed:', status);
      setWsConnected(status.connected);
    });
    
    return () => {
      removeConnectionListener();
    };
  }, []);
  

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching chats in component...');
      const chatList = await messengerService.getChats();
      console.log('Chats received in component:', chatList);
      setChats(chatList);
      

      if (!selectedChatId && chatList.length > 0) {
        setSelectedChatId(chatList[0].id);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Не удалось загрузить список чатов. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [selectedChatId]);
  

  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    
    try {
      setChatLoading(true);
      setError(null);
      console.log(`Fetching messages for chat ${chatId} in component...`);
      const messageList = await messengerService.getChatMessages(chatId);
      console.log(`Messages for chat ${chatId} received in component:`, messageList);
      setMessages(messageList);
      

      await messengerService.markChatAsRead(chatId);
      

      fetchChats();
    } catch (error) {
      console.error(`Error fetching messages for chat ${chatId}:`, error);
      setError('Не удалось загрузить сообщения. Пожалуйста, попробуйте позже.');
    } finally {
      setChatLoading(false);
    }
  }, [fetchChats]);
  

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedChatId) return;
    
    try {
      setError(null);
      const trimmedMessage = messageInput.trim();
      setMessageInput('');
      

      const isConnected = messengerService.checkAndReconnect();
      console.log('WebSocket connection status before sending:', isConnected ? 'connected' : 'disconnected');
      

      const tempMessage = {
        id: `temp-${Date.now()}`,
        chat_id: selectedChatId,
        user_id: user.id,
        user_name: user.username || user.name,
        user_photo: user.photo,
        content: trimmedMessage,
        created_at: new Date().toISOString(),
        read_by: []
      };
      
      setMessages(prev => [...prev, tempMessage]);
      

      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      }, 100);
      
      console.log(`Sending message to chat ${selectedChatId} with content:`, trimmedMessage);

      const response = await messengerService.sendMessage(selectedChatId, trimmedMessage);
      console.log('Message sent successfully, response:', response);
      

      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? response : msg
      ));
      

      fetchChats();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Не удалось отправить сообщение. Пожалуйста, попробуйте позже.');
    }
  }, [messageInput, selectedChatId, user, fetchChats]);
  

  const handleChatSelect = useCallback((chatId) => {
    setSelectedChatId(chatId);
    setError(null);
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);
  

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  

  useEffect(() => {
    console.log('Component mounted, fetching initial chats');
    fetchChats();
  }, []);
  

  useEffect(() => {
    if (selectedChatId) {
      console.log(`Selected chat changed to ${selectedChatId}, fetching messages`);
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId, fetchMessages]);
  

  useEffect(() => {
    if (messageContainerRef.current && messages.length > 0) {
      console.log('Scrolling to bottom of messages container');
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  

  useEffect(() => {
    console.log('Setting up message listener');

    const removeMessageListener = messengerService.addMessageListener((data) => {
      console.log('New message received in component:', data);
      if (data.type === 'new_message' && data.message) {

        if (data.chat_id === selectedChatId) {
          console.log('Message is for current chat, adding to messages list');
          setMessages(prev => [...prev, data.message]);
          

          messengerService.markChatAsRead(selectedChatId);
        } else {
          console.log('Message is for another chat, updating chat list only');
        }
        

        fetchChats();
      }
    });
    
    return () => {
      console.log('Cleaning up message listener');
      removeMessageListener();
    };
  }, [selectedChatId, fetchChats]);
  

  const groupedMessages = useMemo(() => {
    const result = [];
    let currentGroup = null;
    
    messages.forEach((message, index) => {




      const startNewGroup = 
        !currentGroup || 
        currentGroup.userId !== message.user_id ||
        (new Date(message.created_at) - new Date(currentGroup.messages[currentGroup.messages.length - 1].created_at)) > 5 * 60 * 1000;
      
      if (startNewGroup) {
        if (currentGroup) {
          result.push(currentGroup);
        }
        
        currentGroup = {
          userId: message.user_id,
          messages: [message]
        };
      } else {
        currentGroup.messages.push(message);
      }
    });
    
    if (currentGroup) {
      result.push(currentGroup);
    }
    
    return result;
  }, [messages]);
  
  const selectedChat = useMemo(() => {
    return chats.find(chat => chat.id === selectedChatId) || null;
  }, [chats, selectedChatId]);
  

  useEffect(() => {
    document.title = selectedChat 
      ? `Чат с ${selectedChat.name} | K-Connect` 
      : 'Мессенджер | K-Connect';
  }, [selectedChat]);


  const handleRetry = useCallback(() => {
    setError(null);
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    } else {
      fetchChats();
    }
    messengerService.checkAndReconnect();
  }, [fetchChats, fetchMessages, selectedChatId]);
  
  return (
    <Box 
      sx={{ 
        height: '100vh', 
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Боковая панель с чатами (ящик для мобильной версии) */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            display: 'block',
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: { xs: '100%', sm: 320 },
              backgroundColor: theme.palette.background.paper
            },
          }}
        >
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
          />
        </Drawer>
      ) : (
        <Box 
          sx={{ 
            width: 320, 
            flexShrink: 0, 
            borderRight: 1, 
            borderColor: 'divider',
            display: { xs: 'none', md: 'block' },
            backgroundColor: theme.palette.background.paper
          }}
        >
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      )}
      
      {/* Основная область чата */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.default}, rgba(32, 33, 36, 0.5))`,
        }}
      >
        {error && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'error.main', 
              color: 'error.contrastText', 
              position: 'sticky', 
              top: 0, 
              zIndex: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2">{error}</Typography>
            <Button 
              variant="outlined" 
              size="small" 
              color="inherit" 
              onClick={handleRetry}
              sx={{ ml: 2, borderColor: 'currentColor' }}
            >
              Повторить
            </Button>
          </Box>
        )}
        
        {!wsConnected && (
          <Box 
            sx={{ 
              p: 1.5, 
              bgcolor: 'warning.main', 
              color: 'warning.contrastText', 
              position: 'sticky', 
              top: error ? 'auto' : 0, 
              zIndex: 15,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2">
              Соединение с сервером отсутствует. Пытаемся восстановить...
            </Typography>
          </Box>
        )}
        
        {selectedChat ? (
          <>
            {/* Шапка чата */}
            <ChatHeader 
              chat={selectedChat} 
              onBackClick={() => setDrawerOpen(true)} 
              isMobile={isMobile} 
            />
            
            {/* Область сообщений */}
            <Box 
              ref={messageContainerRef}
              sx={{ 
                flexGrow: 1, 
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {chatLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : messages.length === 0 ? (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    flexDirection: 'column',
                    opacity: 0.7
                  }}
                >
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Нет сообщений
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Начните общение прямо сейчас
                  </Typography>
                </Box>
              ) : (
                groupedMessages.map((group, groupIndex) => (
                  <Box key={`group-${groupIndex}`}>
                    {group.messages.map((message, messageIndex) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.user_id === user?.id}
                        showAvatar={messageIndex === 0}
                        userName={message.user_name}
                      />
                    ))}
                  </Box>
                ))
              )}
            </Box>
            
            {/* Поле ввода сообщения */}
            <Box 
              sx={{ 
                p: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                backgroundColor: 'background.paper'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <IconButton color="primary" sx={{ p: 1 }}>
                  <EmojiIcon />
                </IconButton>
                
                <IconButton color="primary" sx={{ p: 1 }}>
                  <AttachFileIcon />
                </IconButton>
                
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Введите сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={4}
                  size="small"
                  sx={{ 
                    mx: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 6
                    }
                  }}
                />
                
                {messageInput.trim() ? (
                  <IconButton 
                    color="primary" 
                    onClick={handleSendMessage}
                    disabled={!wsConnected}
                    sx={{ 
                      p: 1,
                      backgroundColor: themeSettings.primaryColor || '#D0BCFF',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#b899ff'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(208, 188, 255, 0.5)',
                        color: 'rgba(0, 0, 0, 0.5)'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                ) : (
                  <IconButton color="primary" sx={{ p: 1 }}>
                    <MicIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column'
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {isMobile && (
                  <IconButton 
                    onClick={() => setDrawerOpen(true)}
                    sx={{ position: 'absolute', top: 16, left: 16 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Выберите чат для начала общения
                </Typography>
                {chats.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    У вас пока нет доступных чатов
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessengerPage;
