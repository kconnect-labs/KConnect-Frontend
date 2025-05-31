import React, { useState, useRef, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhotoIcon from '@mui/icons-material/Photo';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const MessageInput = ({ 
  onSendMessage, 
  onTyping,
  onFileUpload,
  replyTo,
  onCancelReply
}) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
  
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        
        onTyping(false);
      }
    };
  }, [typingTimeout, onTyping]);
  
  
  useEffect(() => {
    if (replyTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTo]);
  
  
  const handleSendMessage = useCallback(() => {
    if (!message.trim() && !isUploading) return;
    
    const currentMessage = message;
    
    
    const messageToSend = currentMessage;
    
    
    
    setMessage(' ');
    
    
    setTimeout(() => {
      
      setMessage('');
      
      
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      
      
      onSendMessage(messageToSend);
    }, 10);
    
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    
    onTyping(false);
  }, [message, onSendMessage, typingTimeout, onTyping, isUploading]);
  
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  
  const handleMessageChange = useCallback((e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    
    if (newMessage.trim() && !typingTimeout) {
      onTyping(true);
      
      
      const timeout = setTimeout(() => {
        onTyping(false);
        setTypingTimeout(null);
      }, 3000);
      
      setTypingTimeout(timeout);
    } else if (!newMessage.trim() && typingTimeout) {
      clearTimeout(typingTimeout);
      onTyping(false);
      setTypingTimeout(null);
    } else if (typingTimeout) {
      
      clearTimeout(typingTimeout);
      const timeout = setTimeout(() => {
        onTyping(false);
        setTypingTimeout(null);
      }, 3000);
      
      setTypingTimeout(timeout);
    }
  }, [onTyping, typingTimeout]);
  
  
  const triggerFileUpload = useCallback(() => {
    
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-upload-type', 'photo');
      fileInputRef.current.click();
    }
  }, []);
  
  
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadType = 'photo';
    
    
    if (file.size > 50 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 50MB');
      return;
    }
    
    
    const fileType = file.type.split('/')[0];
    if (fileType !== 'image') {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    
    
    setIsUploading(true);
    
    
    onFileUpload(file, uploadType)
      .finally(() => {
        setIsUploading(false);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  }, [onFileUpload]);
  
  
  const renderReplyInfo = () => {
    if (!replyTo) return null;
    
    let previewContent = '';
    if (replyTo.message_type === 'text') {
      previewContent = replyTo.content.length > 30 
        ? replyTo.content.substring(0, 30) + '...'
        : replyTo.content;
    } else if (replyTo.message_type === 'photo') {
      previewContent = '📷 Фото';
    } else if (replyTo.message_type === 'video') {
      previewContent = '🎬 Видео';
    } else if (replyTo.message_type === 'audio') {
      previewContent = '🎵 Аудио';
    } else {
      previewContent = '📎 Файл';
    }
    
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          marginBottom: '4px',
          borderRadius: '12px 12px 0 0',
          backgroundColor: '#252525',
          borderLeft: '2px solid #D0BCFF'
        }}
      >
        <div className="reply-text" style={{ color: '#d8d8d8' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#D0BCFF' }}>
            {replyTo.sender_name}
          </div>
          <div style={{ fontSize: '13px' }}>{previewContent}</div>
        </div>
        <IconButton 
          size="small" 
          onClick={onCancelReply}
          sx={{ 
            color: '#6b6b6b',
            padding: '4px'
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };
  
  return (
    <Box
      sx={{
        borderTop: '1px solid #2C2C2C',
        padding: '8px',
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {renderReplyInfo()}
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#1C1C1C',
          borderRadius: '18px',
          padding: '0 4px'
        }}
      >
        <IconButton 
          size="small"
          onClick={triggerFileUpload}
          sx={{ 
            color: '#D0BCFF', 
            padding: '8px',
            '&:hover': { 
              color: '#D0BCFF'
            }
          }}
        >
          <PhotoIcon fontSize="small" />
        </IconButton>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение..."
          disabled={isUploading}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: '#ffffff',
            resize: 'none',
            outline: 'none',
            margin: '0',
            flex: 1,
            minHeight: '20px',
            maxHeight: '80px',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            alignContent: 'center'
          }}
        />
        
        <IconButton 
          size="small"
          onClick={handleSendMessage}
          disabled={!message.trim() && !isUploading}
          sx={{
            color: message.trim() ? '#D0BCFF' : '#3a3a3a',
            padding: '8px',
            '&:hover': { 
              color: message.trim() ? '#D0BCFF' : '#3a3a3a'
            }
          }}
        >
          {isUploading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <SendIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default React.memo(MessageInput); 