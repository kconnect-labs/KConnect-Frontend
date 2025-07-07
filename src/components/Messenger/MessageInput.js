import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhotoIcon from '@mui/icons-material/Photo';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import StickerPicker from './StickerPicker';

// Мемоизированные кнопки и textarea
const PhotoButton = React.memo(({ onClick }) => (
  <IconButton 
    size="small"
    onClick={onClick}
    sx={{ 
      color: '#D0BCFF', 
      padding: '8px',
      '&:hover': { color: '#D0BCFF' }
    }}
  >
    <PhotoIcon fontSize="small" />
  </IconButton>
));

const EmojiButton = React.memo(({ onClick, active }) => (
  <IconButton 
    size="small"
    onClick={onClick}
    sx={{ 
      color: active ? '#D0BCFF' : '#6b6b6b', 
      padding: '8px',
      '&:hover': { color: '#D0BCFF' }
    }}
  >
    <EmojiEmotionsIcon fontSize="small" />
  </IconButton>
));

const SendButton = React.memo(({ onClick, isUploading, hasMessage }) => (
  <IconButton 
    size="small"
    onClick={onClick}
    disabled={!hasMessage && !isUploading}
    sx={{
      color: hasMessage ? '#D0BCFF' : '#3a3a3a',
      padding: '8px',
      '&:hover': { color: hasMessage ? '#D0BCFF' : '#3a3a3a' }
    }}
  >
    {isUploading ? (
      <CircularProgress size={18} color="inherit" />
    ) : (
      <SendIcon fontSize="small" />
    )}
  </IconButton>
));

const TextInputArea = React.memo(({ value, onChange, onKeyDown, disabled, textareaRef }) => (
  <textarea
    ref={textareaRef}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder="Сообщение..."
    disabled={disabled}
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
));

// Новый мемо-компонент для строки управления (серый контейнер)
const InputControlsRow = React.memo(({
  message,
  isUploading,
  showStickerPicker,
  onPhoto,
  onChange,
  onKeyDown,
  onEmoji,
  onSend,
  textareaRef,
  fileInputRef,
  handleFileChange
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#262626',
      borderRadius: '18px',
      padding: '0 4px',
      boxShadow: 'none',
    }}
  >
    <PhotoButton onClick={onPhoto} />
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      style={{ display: 'none' }}
    />
    <TextInputArea
      value={message}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={isUploading}
      textareaRef={textareaRef}
    />
    <EmojiButton onClick={onEmoji} active={showStickerPicker} />
    <SendButton onClick={onSend} isUploading={isUploading} hasMessage={message.trim()} />
  </Box>
), (prev, next) =>
  prev.message === next.message &&
  prev.isUploading === next.isUploading &&
  prev.showStickerPicker === next.showStickerPicker &&
  prev.onPhoto === next.onPhoto &&
  prev.onChange === next.onChange &&
  prev.onKeyDown === next.onKeyDown &&
  prev.onEmoji === next.onEmoji &&
  prev.onSend === next.onSend
);

const MessageInput = ({ 
  onSendMessage, 
  onTyping,
  onFileUpload,
  replyTo,
  onCancelReply,
  isMobile = false,
  containerRef
}) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
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
    
    onTyping(false);
  }, [message, onSendMessage, isUploading, onTyping]);
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  const handleMessageChange = useCallback((e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    if (newMessage.trim()) {
      onTyping(true);
    }
  }, [onTyping]);
  
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
  
  const handleStickerSelect = useCallback((stickerData) => {
    const stickerMessage = `[STICKER_${stickerData.pack_id}_${stickerData.sticker_id}]`;
    onSendMessage(stickerMessage);
    setShowStickerPicker(false);
  }, [onSendMessage]);
  
  const toggleStickerPicker = useCallback(() => {
    setShowStickerPicker(prev => !prev);
  }, []);
  
  const closeStickerPicker = useCallback(() => {
    setShowStickerPicker(false);
  }, []);
  
  const replyInfo = useMemo(() => {
    if (!replyTo) return null;
    
    let previewContent = '';
    if (replyTo.message_type === 'text') {
      const stickerMatch = replyTo.content.match(/\[STICKER_(\d+)_(\d+)\]/);
      if (stickerMatch) {
        previewContent = '🏷️ Стикер';
      } else {
        previewContent = replyTo.content.length > 30 
          ? replyTo.content.substring(0, 30) + '...'
          : replyTo.content;
      }
    } else if (replyTo.message_type === 'photo') {
      previewContent = '📷 Фото';
    } else if (replyTo.message_type === 'video') {
      previewContent = '🎬 Видео';
    } else if (replyTo.message_type === 'audio') {
      previewContent = '🎵 Аудио';
    } else if (replyTo.message_type === 'sticker') {
      previewContent = '🏷️ Стикер';
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
  }, [replyTo, onCancelReply]);
  
  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 6,
        padding: '8px',
        pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        backgroundColor: 'transparent' ? isMobile : '#1a1a1a',
        borderRadius: 0,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {replyInfo}
      <InputControlsRow
        message={message}
        isUploading={isUploading}
        showStickerPicker={showStickerPicker}
        onPhoto={triggerFileUpload}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        onEmoji={toggleStickerPicker}
        onSend={handleSendMessage}
        textareaRef={textareaRef}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />
      <StickerPicker
        isOpen={showStickerPicker}
        onStickerSelect={handleStickerSelect}
        onClose={closeStickerPicker}
      />
    </Box>
  );
};

// Кастомное сравнение для React.memo
function areEqual(prevProps, nextProps) {
  return (
    prevProps.replyTo?.id === nextProps.replyTo?.id &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.onSendMessage === nextProps.onSendMessage &&
    prevProps.onTyping === nextProps.onTyping &&
    prevProps.onFileUpload === nextProps.onFileUpload &&
    prevProps.onCancelReply === nextProps.onCancelReply
  );
}

export default React.memo(MessageInput, areEqual); 