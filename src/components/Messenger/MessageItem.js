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
  Typography
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SimpleImageViewer from '../../components/SimpleImageViewerMes';


const MessageItem = ({ 
  message, 
  isCurrentUser, 
  decryptedContent,
  onReply,
  replyMessage,
  chatMembers = [],
  showDateSeparator = false,
  dateSeparatorText = ''
}) => {
  const [showActions, setShowActions] = useState(false);
  const { getFileUrl, avatarCache, getAvatarUrl, deleteMessage } = useMessenger();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const messageRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  
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
      
      
      const messagesContainer = messagesContainerRef.current;
      const scrollTop = messagesContainer?.scrollTop;
      const scrollHeight = messagesContainer?.scrollHeight;
      
      try {
        
        const result = await deleteMessage(message.id);
        
        if (result && result.success) {
          
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
  
  
  const renderMessageContent = () => {
    const timeElement = (
      <span className="message-time-inline">
        {formatMessageTime(message.created_at)}
        {renderReadStatus()}
      </span>
    );

    switch (message.message_type) {
      case 'text':
        
        const isLongMessage = decryptedContent.length > 30;
        
        return (
          <div className="message-text-container" 
               style={{ 
                 flexDirection: isLongMessage ? 'column' : 'row',
                 alignItems: isLongMessage ? 'flex-end' : 'flex-end',
                 flexWrap: 'nowrap',
                 justifyContent: 'space-between'
               }}>
            <p className="message-text" style={{ 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all',
          overflowWrap: 'break-word',
              display: isLongMessage ? 'block' : 'inline',
              textAlign: 'left',
              width: isLongMessage ? '100%' : 'auto',
              marginRight: isLongMessage ? '0' : '8px'
            }}>{decryptedContent}</p>
            {timeElement}
          </div>
        );
        
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
        previewContent = replyMessage.content.length > 30 
          ? replyMessage.content.substring(0, 15) + '...'
          : replyMessage.content;
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
        className={`message-item ${isCurrentUser ? 'my-message' : 'their-message'} ${isDeleting ? 'deleting' : ''}`}
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
        {!isCurrentUser && isGroupChat && (
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
          {!isCurrentUser && isGroupChat && (
            <div className="message-sender">{message.sender_name || getSenderName(message.sender_id)}</div>
          )}
          
            {message.reply_to_id && renderReplyContent()}
          
          <div className="message-bubble">
            {renderMessageContent()}
            </div>
          </div>
          
          {/* Кнопки действий с сообщением - полупрозрачные, чтобы не мешали контенту */}
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
      
      {/* Диалог подтверждения удаления - улучшенный стиль */}
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
    </>
  );
};

export default MessageItem; 