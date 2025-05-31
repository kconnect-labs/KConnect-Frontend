import React, { useState, useEffect } from 'react';
import { MessengerProvider, useMessenger } from '../../contexts/MessengerContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Функция для форматирования времени последней активности
const formatLastActive = (dateObject) => {
  if (!dateObject) return "Не в сети";
  
  try {
    // Проверяем, является ли dateObject уже объектом Date
    const date = dateObject instanceof Date ? dateObject : new Date(dateObject);
    if (isNaN(date.getTime())) {
      console.error('Неверный формат даты:', dateObject);
      return "Не в сети";
    }
    
    const now = new Date();
    
    // Разница во времени в миллисекундах
    const diffMs = now - date;
    
    // Преобразуем в минуты/часы/дни
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    // Определяем формат вывода в зависимости от прошедшего времени
    if (diffMins < 1) return 'В сети';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    // Для более давних дат показываем полную дату
    const options = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    };
    
    return date.toLocaleString('ru-RU', options);
  } catch (e) {
    console.error('Ошибка форматирования даты:', e, dateObject);
    return "Не в сети";
  }
};

const MessengerContent = () => {
  const { user, loading, activeChat, onlineUsers, isChannel, error } = useMessenger();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Отслеживание изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      
      // На мобильных устройствах по умолчанию показываем список чатов,
      // если не выбран активный чат
      if (mobile && !activeChat) {
        setShowSidebar(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);
  
  // Когда выбран чат, на мобильных устройствах скрываем список
  useEffect(() => {
    if (activeChat && isMobileView) {
      setShowSidebar(false);
    }
  }, [activeChat, isMobileView]);
  
  // Блокировка для каналов - показываем сообщение, что каналы не могут использовать мессенджер
  if (isChannel) {
    return (
      <div className="messenger-blocked" style={{ 
        padding: '30px', 
        textAlign: 'center', 
        color: '#888', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#aaa' }}>
          Мессенджер недоступен
        </Typography>
        <Typography variant="body1">
          Каналы не могут использовать личные сообщения.
        </Typography>
      </div>
    );
  }
  
  // Показать экран загрузки
  if (loading) {
    return (
      <div className="messenger-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка мессенджера...</p>
      </div>
    );
  }
  
  // На мобильных устройствах показываем либо список, либо чат
  const handleChatSelect = () => {
    if (isMobileView) {
      setShowSidebar(false);
    }
  };
  
  const handleBackToList = () => {
    if (isMobileView) {
      setShowSidebar(true);
    }
  };
  
  // Получаем данные о собеседнике в личном чате для хедера
  const getChatHeaderInfo = () => {
    if (!activeChat) return { title: 'Чат', avatar: null, status: null };
    
    if (activeChat.is_group || activeChat.chat_type === 'group') {
      return { 
        title: activeChat.title || 'Групповой чат',
        avatar: activeChat.avatar,
        status: null
      };
    } else {
      // Для личного чата ищем собеседника (не текущего пользователя)
      const otherMember = activeChat.members?.find(member => {
        const memberId = member.user_id || member.id;
        return memberId !== user?.id;
      });
      
      let status = 'Не в сети';
      if (otherMember) {
        const userId = otherMember.user_id || otherMember.id;
        
        // Проверяем онлайн статус
        if (onlineUsers[userId]) {
          status = 'В сети';
        } else if (otherMember.last_active) {
          status = formatLastActive(otherMember.last_active);
        }
      }
      
      return {
        title: otherMember?.name || activeChat.title || 'Личная переписка',
        avatar: otherMember?.avatar || null,
        status: status
      };
    }
  };
  
  const { title, avatar, status } = getChatHeaderInfo();
  
  return (
    <div className="messenger-container">
      {/* Боковая панель со списком чатов */}
      <aside className={`messenger-sidebar ${isMobileView && !showSidebar ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', padding: '15px' }}>
            Личные сообщения
          </Typography>
        </div>
        <ChatList onSelectChat={handleChatSelect} />
      </aside>
      
      {/* Основная область с чатом */}
      <main className={`messenger-main ${isMobileView && showSidebar ? 'hidden' : ''}`}>
        {isMobileView && activeChat && (
          <Box 
            className="chat-header"
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 8px',
              borderBottom: '1px solid #2C2C2C',
              backgroundColor: '#1a1a1a',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              height: '60px'
            }}
          >
            <IconButton onClick={handleBackToList} sx={{ color: '#49A2F9' }}>
              <ArrowBackIcon />
            </IconButton>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flex: 1,
                overflow: 'hidden'
              }}
            >
              {avatar ? (
                <Box 
                  component="img"
                  src={avatar}
                  alt={title}
                  sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '12px',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Box 
                  sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2a5885',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    color: 'white',
                    fontSize: '18px'
                  }}
                >
                  {title[0]?.toUpperCase() || '?'}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="subtitle1" 
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '16px'
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '12px'
                  }}
                >
                  {status || (activeChat?.is_online ? 'В сети' : 'Был(а) недавно')}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        <ChatWindow />
      </main>
    </div>
  );
};

// Wrapper component that provides the MessengerContext
const Messenger = () => {
  return (
    <MessengerProvider>
      <MessengerContent />
    </MessengerProvider>
  );
};

export default Messenger; 