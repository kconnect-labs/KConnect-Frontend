import React, { useState, useCallback, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useMessenger } from '../../contexts/MessengerContext';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  Snackbar, 
  Alert,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SimpleImageViewer from '../../components/SimpleImageViewerMes';
import { TextWithLinks } from './linkUtils';
import StickerPackModal from './StickerPackModal';
import Lottie from 'lottie-react';
import pako from 'pako';

// Функция для определения типа стикера
const getStickerType = (stickerUrl, stickerData) => {
  if (!stickerUrl) return 'unknown';
  
  // Сначала проверяем данные стикера, если есть
  if (stickerData && stickerData.mime_type) {
    if (stickerData.mime_type === 'application/x-tgsticker') return 'tgs';
    if (stickerData.mime_type === 'video/webm') return 'webm';
    return 'static';
  }
  
  // Если данных нет, проверяем URL (менее надежно)
  const url = stickerUrl.toLowerCase();
  if (url.includes('.tgs') || url.includes('tgsticker')) return 'tgs';
  if (url.includes('.webm')) return 'webm';
  
  // Для API эндпоинтов делаем асинхронную проверку
  if (url.includes('/api/messenger/stickers/')) {
    return 'api_check_needed';
  }
  
  return 'static'; // webp, png, jpeg
};

// Компонент для TGS стикера с улучшенной загрузкой
const TGSSticker = ({ src, style, onClick }) => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadTGS = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(src);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        
        // Проверяем, действительно ли это TGS файл
        if (contentType !== 'application/x-tgsticker') {
          console.log('Not a TGS file, falling back to image:', contentType);
          setError(true);
          return;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        let jsonData;
        
        try {
          // Пробуем распаковать как gzip
          const decompressed = pako.inflate(arrayBuffer);
          const textDecoder = new TextDecoder();
          jsonData = JSON.parse(textDecoder.decode(decompressed));
        } catch (gzipError) {
          // Если не gzip, пробуем как обычный JSON
          const textDecoder = new TextDecoder();
          jsonData = JSON.parse(textDecoder.decode(arrayBuffer));
        }
        
        setAnimationData(jsonData);
      } catch (error) {
        console.error('Error loading TGS:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadTGS();
    }
  }, [src]);

  if (loading) {
    return (
      <div style={{ 
        ...style, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        minHeight: style?.maxWidth || '120px',
        minWidth: style?.maxWidth || '120px' 
      }}>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error || !animationData) {
    // Fallback to image if TGS loading failed
    return (
      <img
        src={src}
        style={style}
        onClick={onClick}
        alt="Стикер"
      />
    );
  }

  return (
    <div style={style} onClick={onClick}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        speed={0.75}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

// Компонент для асинхронной проверки типа стикера
const AsyncStickerRenderer = ({ src, style, onClick, stickerData }) => {
  const [stickerType, setStickerType] = useState('loading');
  const [animationData, setAnimationData] = useState(null);
  
  useEffect(() => {
    const checkStickerType = async () => {
      try {
        // Сначала пробуем загрузить как TGS
        const response = await fetch(src);
        
        if (!response.ok) {
          setStickerType('static');
          return;
        }
        
        const contentType = response.headers.get('content-type');
        
        if (contentType === 'application/x-tgsticker') {
          // Это TGS файл, пробуем его загрузить
          try {
            const arrayBuffer = await response.arrayBuffer();
            let jsonData;
            
            try {
              // Пробуем распаковать как gzip
              const decompressed = pako.inflate(arrayBuffer);
              const textDecoder = new TextDecoder();
              jsonData = JSON.parse(textDecoder.decode(decompressed));
            } catch (gzipError) {
              // Если не gzip, пробуем как обычный JSON
              const textDecoder = new TextDecoder();
              jsonData = JSON.parse(textDecoder.decode(arrayBuffer));
            }
            
            setAnimationData(jsonData);
            setStickerType('tgs');
          } catch (error) {
            console.error('Error loading TGS data:', error);
            setStickerType('static');
          }
        } else if (contentType === 'video/webm') {
          setStickerType('webm');
        } else {
          setStickerType('static');
        }
      } catch (error) {
        console.error('Error checking sticker type:', error);
        setStickerType('static');
      }
    };
    
    checkStickerType();
  }, [src]);
  
  if (stickerType === 'loading') {
    return (
      <div style={{ 
        ...style,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        minHeight: style?.maxWidth || '120px',
        minWidth: style?.maxWidth || '120px'
      }}>
        <CircularProgress size={24} />
      </div>
    );
  }
  
  if (stickerType === 'tgs' && animationData) {
    return (
      <div style={style} onClick={onClick}>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          speed={0.75}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  } else if (stickerType === 'webm') {
    return (
      <video
        src={src}
        style={style}
        onClick={onClick}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  } else {
    return (
      <img
        src={src}
        style={style}
        onClick={onClick}
        alt="Стикер"
      />
    );
  }
};

const MessageItem = ({ 
  message, 
  isCurrentUser, 
  decryptedContent,
  onReply,
  replyMessage,
  chatMembers = [],
  showDateSeparator = false,
  dateSeparatorText = '',
  showAvatar = true
}) => {
  const [showActions, setShowActions] = useState(false);
  const { getFileUrl, avatarCache, getAvatarUrl, deleteMessage, messages, setMessages } = useMessenger();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const messageRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  // Состояние для модалки стикерпака
  const [stickerModalOpen, setStickerModalOpen] = useState(false);
  const [selectedStickerPackId, setSelectedStickerPackId] = useState(null);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  
  useEffect(() => {
    messagesContainerRef.current = document.querySelector('.messages-list');
  }, []);
  
  
  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };
  
  const handleOpenDeleteDialog = (e) => {
    e.stopPropagation();
    handleCloseMenu();
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteMessage = async () => {
    if (message && message.id) {
      setIsDeleting(true);
      setDeleteDialogOpen(false);
      
      // Сохраняем позицию скролла
      const messagesContainer = messagesContainerRef.current;
      const scrollTop = messagesContainer?.scrollTop;
      const scrollHeight = messagesContainer?.scrollHeight;
      
      try {
        // Для временных сообщений просто удаляем из локального состояния
        if (typeof message.id === 'string' && message.id.startsWith('temp_')) {
          console.log(`Удаление временного сообщения ${message.id} из локального состояния`);
          
          // Находим чат, в котором находится сообщение
          const chatId = Object.keys(messages).find(chatId => 
            messages[chatId].some(msg => msg.id === message.id)
          );
          
          if (chatId) {
            setMessages(prevMessages => {
              const updatedChatMessages = (prevMessages[chatId] || [])
                .filter(msg => msg.id !== message.id);
                
              return {
                ...prevMessages,
                [chatId]: updatedChatMessages
              };
            });
          }
          
          // Применяем анимацию удаления
          if (messageRef.current) {
            messageRef.current.classList.add('deleting');
            
            setTimeout(() => {
              if (messageRef.current) {
                messageRef.current.style.opacity = '0';
                messageRef.current.style.transform = 'scale(0.8)';
                messageRef.current.style.maxHeight = '0';
                messageRef.current.style.marginTop = '0';
                messageRef.current.style.marginBottom = '0';
                messageRef.current.style.padding = '0';
                
                setTimeout(() => {
                  if (messagesContainer) {
                    const newScrollHeight = messagesContainer.scrollHeight;
                    const heightDiff = scrollHeight - newScrollHeight;
                    
                    if (heightDiff > 0 && scrollTop) {
                      messagesContainer.scrollTop = scrollTop - heightDiff;
                    } else if (scrollTop) {
                      messagesContainer.scrollTop = scrollTop;
                    }
                  }
                }, 50);
              }
            }, 50);
          }
          
          console.log(`Временное сообщение ${message.id} успешно удалено`);
          return;
        }
        
        // Для обычных сообщений используем функцию из контекста
        const result = await deleteMessage(message.id);
        
        if (result && result.success) {
          // Применяем анимацию удаления
          if (messageRef.current) {
            messageRef.current.classList.add('deleting');
            
            setTimeout(() => {
              if (messageRef.current) {
                messageRef.current.style.opacity = '0';
                messageRef.current.style.transform = 'scale(0.8)';
                messageRef.current.style.maxHeight = '0';
                messageRef.current.style.marginTop = '0';
                messageRef.current.style.marginBottom = '0';
                messageRef.current.style.padding = '0';
                
                setTimeout(() => {
                  if (messagesContainer) {
                    const newScrollHeight = messagesContainer.scrollHeight;
                    const heightDiff = scrollHeight - newScrollHeight;
                    
                    if (heightDiff > 0 && scrollTop) {
                      messagesContainer.scrollTop = scrollTop - heightDiff;
                    } else if (scrollTop) {
                      messagesContainer.scrollTop = scrollTop;
                    }
                  }
                }, 50);
              }
            }, 50);
          }
          console.log(`Сообщение ${message.id} успешно удалено`);
        } else {
          console.error(`Ошибка при удалении сообщения: ${result?.error || 'Неизвестная ошибка'}`);
          setError(result?.error || 'Что-то пошло не так при удалении сообщения');
          setIsDeleting(false);
        }
      } catch (err) {
        console.error('Исключение при удалении сообщения:', err);
        setError('Что-то пошло не так при удалении сообщения');
        setIsDeleting(false);
      }
    }
  };

  const handleCloseError = () => {
    setError(null);
  };
  
  // Обработчик клика на стикер
  const handleStickerClick = (packId, stickerId) => {
    setSelectedStickerPackId(parseInt(packId));
    setSelectedStickerId(parseInt(stickerId));
    setStickerModalOpen(true);
  };
  
  const handleCloseStickerModal = () => {
    setStickerModalOpen(false);
    setSelectedStickerPackId(null);
    setSelectedStickerId(null);
  };
  
  const getSenderInfo = useCallback((senderId) => {
    if (!chatMembers.length) return { name: 'Пользователь', avatar: null };
    
    
    if (message.sender?.avatar) {
      return {
        name: message.sender.name || message.sender.username || 'Пользователь',
        avatar: message.sender.avatar
      };
    }
    
    const member = chatMembers.find(m => {
      const memberId = m.user_id || m.id;
      return memberId === senderId;
    });
    
    if (!member) return { name: 'Пользователь', avatar: null };
    
    
    let avatarUrl = null;
    if (avatarCache && avatarCache[senderId]) {
      avatarUrl = avatarCache[senderId];
    } 
    
    else if (member.avatar || member.photo) {
      if (getAvatarUrl) {
        avatarUrl = getAvatarUrl(senderId, member.avatar || member.photo);
      } else {
        
        const photoPath = member.avatar || member.photo;
        if (photoPath?.startsWith('/static/')) {
          avatarUrl = photoPath;
        } else {
          avatarUrl = `/static/uploads/avatar/${senderId}/${photoPath}`;
        }
      }
    }
    
    return { 
      name: member.name || member.username || 'Пользователь',
      avatar: avatarUrl
    };
  }, [chatMembers, message.sender, avatarCache, getAvatarUrl]);
  
  
  const getSenderName = useCallback((senderId) => {
    return getSenderInfo(senderId).name;
  }, [getSenderInfo]);
  
  
  const getSenderAvatar = useCallback((senderId) => {
    return getSenderInfo(senderId).avatar;
  }, [getSenderInfo]);
  
  
  const handleOpenLightbox = (imageUrl) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };

  
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  
  const handlePhotoClick = (e, photoUrl) => {
    e.stopPropagation(); 
    handleOpenLightbox(photoUrl);
  };
  
  
  const formatMessageTime = (timestamp) => {
    try {
      
      if (typeof timestamp === 'string') {
        
        if (/^\d{1,2}:\d{2}$/.test(timestamp)) {
          return timestamp;
        }
        
        
        if (/^\d{1,2}\s+\w+$/.test(timestamp)) {
          return timestamp;
        }
        
        
      }
      
      
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.error('Неверный формат даты:', timestamp);
        
        return typeof timestamp === 'string' ? timestamp : 'Неизвестно';
      }
      
      const now = new Date();
      
      
      const dateLocal = date.toLocaleDateString();
      const nowLocal = now.toLocaleDateString();
      
      
      if (dateLocal === nowLocal) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      
      if (date > weekAgo) {
        return formatDistanceToNow(date, { addSuffix: true, locale: ru });
      }
      
      
      return date.toLocaleString([], { 
        day: 'numeric',
        month: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      console.error('Ошибка форматирования времени сообщения:', e, timestamp);
      
      return typeof timestamp === 'string' ? timestamp : 'Неизвестно';
    }
  };
  
  // Функция для определения, является ли сообщение коротким
  const isShortMessage = (text) => {
    if (!text) return true;
    // Простая эвристика: если меньше 50 символов или меньше 2 строк, считаем коротким
    return text.length <= 50 && !text.includes('\n');
  };
  
  const renderMessageContent = () => {
    const timeElement = (
      <span className="message-time-inline">
        {formatMessageTime(message.created_at)}
        {renderReadStatus()}
      </span>
    );

    switch (message.message_type) {
      case 'text':
        // Проверяем, является ли текстовое сообщение стикером
        const stickerMatch = decryptedContent.match(/\[STICKER_(\d+)_(\d+)\]/);
        if (stickerMatch) {
          // Обрабатываем как стикер
          const packId = stickerMatch[1];
          const stickerId = stickerMatch[2];
          const stickerUrl = `/api/messenger/stickers/${packId}/${stickerId}`;
          
          return (
            <div className="sticker-message" style={{
              position: 'relative',
              display: 'inline-block',
              maxWidth: '256px',
              minWidth: '150px'
            }}>
              {/* Определяем тип стикера и рендерим соответствующий компонент */}
              {(() => {
                const stickerType = getStickerType(stickerUrl, message.sticker_data);
                const commonStyle = {
                  width: '100%',
                  height: 'auto',
                  maxWidth: '256px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  cursor: 'pointer'
                };

                const commonClickHandler = (e) => {
                  e.stopPropagation();
                  handleStickerClick(packId, stickerId);
                };

                // Для API эндпоинтов используем асинхронную проверку
                if (stickerType === 'api_check_needed') {
                  return (
                    <AsyncStickerRenderer
                      src={stickerUrl}
                      style={commonStyle}
                      onClick={commonClickHandler}
                      stickerData={message.sticker_data}
                    />
                  );
                }

                // Для известных типов используем прямой рендеринг
                if (stickerType === 'tgs') {
                  return (
                    <TGSSticker
                      src={stickerUrl}
                      style={commonStyle}
                      onClick={commonClickHandler}
                    />
                  );
                } else if (stickerType === 'webm') {
                  return (
                    <video
                      src={stickerUrl}
                      style={commonStyle}
                      onClick={commonClickHandler}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  );
                } else {
                  // Статичные стикеры (webp, png, jpeg)
                  return (
                    <img 
                      src={stickerUrl}
                      alt="Стикер"
                      loading="lazy"
                      style={commonStyle}
                      onClick={commonClickHandler}
                    />
                  );
                }
              })()}
              {/* Время справа внизу как в Телеграме */}
              <div className="sticker-time-bubble">
                {formatMessageTime(message.created_at)}
                {isCurrentUser && (
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    {(message.read_by && message.read_by.length > 0) || 
                     (message.read_count && message.read_count > 0) ? 
                      <DoneAllIcon sx={{ fontSize: 12 }} /> : 
                      <DoneIcon sx={{ fontSize: 12 }} />}
                  </span>
                )}
              </div>
            </div>
          );
        }
        
        // Обычный текст
        const isShort = isShortMessage(decryptedContent);
        
        if (isShort) {
          // Короткое сообщение - время в одной строке с текстом
          return (
            <div className="message-text-container" 
                 style={{ 
                   display: 'flex',
                   alignItems: 'flex-end',
                   gap: '8px'
                 }}>
              <div className="message-text" style={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                display: 'inline',
                textAlign: 'left',
                flex: '0 1 auto'
              }}>
                <TextWithLinks text={decryptedContent} isCurrentUser={isCurrentUser} />
              </div>
              <div style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}>
                {timeElement}
              </div>
            </div>
          );
        } else {
          // Длинное сообщение - время на отдельной строке
          return (
            <div className="message-text-container" 
                 style={{ 
                   flexDirection: 'column',
                   alignItems: 'flex-end',
                   flexWrap: 'nowrap',
                   justifyContent: 'space-between'
                 }}>
              <div className="message-text" style={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                display: 'block',
                textAlign: 'left',
                width: '100%',
                marginBottom: '4px'
              }}>
                <TextWithLinks text={decryptedContent} isCurrentUser={isCurrentUser} />
              </div>
              {timeElement}
            </div>
          );
        }
        
      case 'photo':
        const photoUrl = message.photo_url || getFileUrl(message.chat_id, message.content);
        console.log(`Photo attachment URL for message ${message.id}:`, photoUrl);
        console.log(`Original content path:`, message.content);
        
        
        const isGif = message.mime_type === 'image/gif' || 
                      (message.content && message.content.toLowerCase().endsWith('.gif'));
                      
        return (
          <div className="message-content-wrapper">
            <div className="message-photo" onClick={(e) => e.stopPropagation()}>
            <img 
              src={photoUrl} 
              alt="Фото" 
              loading="lazy"
                onClick={(e) => handlePhotoClick(e, photoUrl)}
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                  imageRendering: isGif ? 'auto' : 'auto',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 5
              }}
            />
            </div>
            <span className="message-time-inline" style={{ alignSelf: 'flex-end' }}>
              {formatMessageTime(message.created_at)}
              {renderReadStatus()}
            </span>
          </div>
        );
        
      case 'video':
        const videoUrl = getFileUrl(message.chat_id, message.content);
        console.log(`Video attachment URL for message ${message.id}:`, videoUrl);
        return (
          <div className="message-content-wrapper">
          <div className="message-video">
            <video 
              controls 
              preload="metadata"
              src={videoUrl}
            />
            </div>
            <span className="message-time-inline" style={{ alignSelf: 'flex-end' }}>
              {formatMessageTime(message.created_at)}
              {renderReadStatus()}
            </span>
          </div>
        );
        
      case 'audio':
        const audioUrl = getFileUrl(message.chat_id, message.content);
        console.log(`Audio attachment URL for message ${message.id}:`, audioUrl);
        return (
          <div className="message-content-wrapper">
          <div className="message-audio">
            <audio 
              controls
              preload="metadata"
              src={audioUrl}
            />
            </div>
            <span className="message-time-inline" style={{ alignSelf: 'flex-end' }}>
              {formatMessageTime(message.created_at)}
              {renderReadStatus()}
            </span>
          </div>
        );
        
      case 'file':
        const fileUrl = getFileUrl(message.chat_id, message.content);
        console.log(`File attachment URL for message ${message.id}:`, fileUrl);
        return (
          <div className="message-content-wrapper">
          <div className="message-file">
            <a 
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="file-link"
            >
              <span className="file-icon">📄</span>
              <span className="file-details">
                <span className="file-name">{message.original_filename}</span>
                <span className="file-size">{formatFileSize(message.file_size)}</span>
              </span>
            </a>
            </div>
            <span className="message-time-inline" style={{ alignSelf: 'flex-end' }}>
              {formatMessageTime(message.created_at)}
              {renderReadStatus()}
            </span>
          </div>
        );
        
      case 'sticker':
        // Обрабатываем стикеры как в Телеграме - без обводки
        let stickerUrl = null;
        let packId = null;
        let stickerId = null;
        
        // Если есть данные стикера
        if (message.sticker_data) {
          packId = message.sticker_data.pack_id;
          stickerId = message.sticker_data.sticker_id;
          stickerUrl = `/api/messenger/stickers/${packId}/${stickerId}`;
        } else {
          // Извлекаем данные стикера из контента [STICKER_PACKID_STICKERID]
          const stickerMatch = decryptedContent.match(/\[STICKER_(\d+)_(\d+)\]/);
          if (stickerMatch) {
            packId = stickerMatch[1];
            stickerId = stickerMatch[2];
            stickerUrl = `/api/messenger/stickers/${packId}/${stickerId}`;
          }
        }
        
        if (!stickerUrl) {
          return (
            <div className="message-text-container">
              <p className="message-text">❓ Стикер недоступен</p>
              {timeElement}
            </div>
          );
        }
        
        return (
          <div className="sticker-message" style={{
            position: 'relative',
            display: 'inline-block',
            maxWidth: '256px',
            minWidth: '150px'
          }}>
            {/* Определяем тип стикера и рендерим соответствующий компонент */}
            {(() => {
              const stickerType = getStickerType(stickerUrl, message.sticker_data);
              const commonStyle = {
                width: '100%',
                height: 'auto',
                maxWidth: '256px',
                objectFit: 'contain',
                borderRadius: '12px',
                cursor: 'pointer'
              };

              const commonClickHandler = (e) => {
                e.stopPropagation();
                handleStickerClick(packId, stickerId);
              };

              // Для API эндпоинтов используем асинхронную проверку
              if (stickerType === 'api_check_needed') {
                return (
                  <AsyncStickerRenderer
                    src={stickerUrl}
                    style={commonStyle}
                    onClick={commonClickHandler}
                    stickerData={message.sticker_data}
                  />
                );
              }

              // Для известных типов используем прямой рендеринг
              if (stickerType === 'tgs') {
                return (
                  <TGSSticker
                    src={stickerUrl}
                    style={commonStyle}
                    onClick={commonClickHandler}
                  />
                );
              } else if (stickerType === 'webm') {
                return (
                  <video
                    src={stickerUrl}
                    style={commonStyle}
                    onClick={commonClickHandler}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                );
              } else {
                // Статичные стикеры (webp, png, jpeg)
                return (
                  <img 
                    src={stickerUrl}
                    alt="Стикер"
                    loading="lazy"
                    style={commonStyle}
                    onClick={commonClickHandler}
                  />
                );
              }
            })()}
            {/* Время справа внизу как в Телеграме */}
            <div className="sticker-time-bubble">
              {formatMessageTime(message.created_at)}
              {isCurrentUser && (
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {(message.read_by && message.read_by.length > 0) || 
                   (message.read_count && message.read_count > 0) ? 
                    <DoneAllIcon sx={{ fontSize: 12 }} /> : 
                    <DoneIcon sx={{ fontSize: 12 }} />}
                </span>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="message-text-container">
            <p className="message-text">Неподдерживаемый тип сообщения</p>
            {timeElement}
          </div>
        );
    }
  };
  
  
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };
  
  
  const renderReplyContent = () => {
    if (!replyMessage) return null;
    
    const replySenderName = getSenderName(replyMessage.sender_id);
    let previewContent = '';
    
    switch (replyMessage.message_type) {
      case 'text':
        // Проверяем, является ли текстовое сообщение стикером
        const stickerMatch = replyMessage.content.match(/\[STICKER_(\d+)_(\d+)\]/);
        if (stickerMatch) {
          previewContent = '🏷️ Стикер';
        } else {
          previewContent = replyMessage.content.length > 30 
            ? replyMessage.content.substring(0, 15) + '...'
            : replyMessage.content;
        }
        break;
      case 'photo':
        previewContent = '📷 Фото';
        break;
      case 'video':
        previewContent = '🎬 Видео';
        break;
      case 'audio':
        previewContent = '🎵 Аудио';
        break;
      case 'sticker':
        previewContent = '🏷️ Стикер';
        break;
      default:
        previewContent = '📎 Файл';
    }
    
    return (
      <div className="replied-message">
        <span className="reply-sender">{replySenderName}</span>
        <span className="reply-content">{previewContent}</span>
      </div>
    );
  };
  
  
  const renderReadStatus = () => {
    if (!isCurrentUser) return null;
    
    
    const isRead = (message.read_by && message.read_by.length > 0) || 
                  (message.read_count && message.read_count > 0);
    
    return (
      <span className={`read-status ${isRead ? 'read' : 'unread'}`} style={{ display: 'inline-flex', alignItems: 'center', height: '12px' }}>
        {isRead ? <DoneAllIcon sx={{ fontSize: 14 }} /> : <DoneIcon sx={{ fontSize: 14 }} />}
      </span>
    );
  };
  
  
  const senderAvatar = getSenderAvatar(message.sender_id);
  
  
  const isGroupChat = chatMembers && chatMembers.length > 2;
  
  return (
    <>
      {/* Показываем разделитель даты, если нужно */}
      {showDateSeparator && (
        <div className="date-separator">
          <span>{dateSeparatorText}</span>
        </div>
      )}
      
      <div 
        ref={messageRef}
        className={`message-item ${isCurrentUser ? 'my-message' : 'their-message'} ${isDeleting ? 'deleting' : ''} ${!isCurrentUser && isGroupChat && !showAvatar ? 'no-avatar' : ''}`}
        style={{
          transition: 'opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease, margin 0.3s ease, padding 0.3s ease',
          opacity: isDeleting ? 0 : 1,
          transform: isDeleting ? 'scale(0.8)' : 'scale(1)',
          position: 'relative'
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="message-container">
          {!isCurrentUser && isGroupChat && showAvatar && (
            <div className="message-avatar">
              {senderAvatar ? (
                <img src={senderAvatar} alt={message.sender_name || 'Avatar'} />
              ) : (
                <div className="avatar-placeholder">
                  {(message.sender_name?.charAt(0) || 'U').toUpperCase()}
                </div>
              )}
            </div>
          )}
          
          <div className="message-content">
            {message.reply_to_id && renderReplyContent()}
            <div className="message-bubble">
              {/* Имя внутри баббла сверху */}
              {!isCurrentUser && isGroupChat && (
                <div className="sender-name-in-bubble">
                  {message.sender_name || getSenderName(message.sender_id)}
                </div>
              )}
              {renderMessageContent()}
            </div>
          </div>
          
          {/* Кнопки действий с сообщением */}
          <div className={`message-actions ${showActions ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onReply && onReply(message);
              }}
              className="action-button reply-button"
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
            
            {/* Отображаем кнопку удаления только для своих сообщений */}
            {isCurrentUser && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDeleteDialog(e);
                }}
                className="action-button delete-button"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        </div>
      </div>
      
      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            bgcolor: 'background.paper',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            overflow: 'hidden',
            maxWidth: '360px',
            width: '90%'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          py: 2,
          px: 3 
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Удаление сообщения
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <DialogContentText sx={{ color: 'text.primary', mb: 1 }}>
            Вы уверены, что хотите удалить это сообщение?
          </DialogContentText>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ 
          px: 2, 
          py: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            variant="outlined"
            sx={{
              borderRadius: '20px',
              px: 2,
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteMessage} 
            color="error" 
            variant="contained"
            sx={{
              borderRadius: '20px',
              px: 2,
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.25)'
            }}
            autoFocus
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Просмотрщик изображений */}
      {lightboxOpen && lightboxImage && (
        <SimpleImageViewer
          src={lightboxImage}
          onClose={handleCloseLightbox}
        />
      )}
      
      {/* Уведомление об ошибке */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            border: '1px solid rgba(211, 47, 47, 0.2)'
          }}
        >
          {error}
        </Alert>
      </Snackbar>
      
      {/* Модалка стикерпака */}
      <StickerPackModal
        open={stickerModalOpen}
        onClose={handleCloseStickerModal}
        packId={selectedStickerPackId}
        stickerId={selectedStickerId}
      />
    </>
  );
};

// Кастомное сравнение props для мемоизации
function areEqual(prevProps, nextProps) {
  // Сравниваем только id, isCurrentUser и decryptedContent (если нужно)
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.updated_at === nextProps.message.updated_at &&
    prevProps.isCurrentUser === nextProps.isCurrentUser &&
    prevProps.decryptedContent === nextProps.decryptedContent &&
    prevProps.showAvatar === nextProps.showAvatar
  );
}

export default React.memo(MessageItem, areEqual);