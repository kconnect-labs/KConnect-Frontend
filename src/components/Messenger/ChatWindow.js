import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { useMessenger } from '../../contexts/MessengerContext';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';


const MemoizedMessageItem = memo(MessageItem);


const ModeratorBanner = () => {
  return (
    <div className="moderator-banner">
      <div className="moderator-banner-content">
        <i className="fas fa-shield-alt mr-2"></i>
        <span>
          <strong>Внимание!</strong> Вы общаетесь с модератором платформы. Пожалуйста, будьте вежливы и корректны. Модератор поможет решить ваши вопросы или проблемы.
        </span>
      </div>
      <style jsx>{`
        .moderator-banner {
          background-color:rgb(26 26 26);
          border-left: 4px solidrgb(131, 59, 246);
          padding: 10px 15px;
          margin-bottom: 15px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: -16px;
          z-index: 100;
        }
        .moderator-banner-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color:rgb(167, 109, 187);
        }
        .moderator-banner-content i {
          font-size: 18px;
          color:rgba(178, 59, 246, 0.83);
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

const ChatWindow = ({ backAction, isMobile }) => {
  const { 
    activeChat, 
    messages, 
    loadMessages, 
    hasMoreMessages,
    loadingMessages,
    typingUsers,
    sendTextMessage,
    sendTypingIndicator,
    decryptMessage,
    uploadFile,
    user,
    onlineUsers,
    deleteChat
  } = useMessenger();
  
  const navigate = useNavigate();
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const loadMoreTriggerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const chatIdRef = useRef(null);
  const typingTimestampRef = useRef(null);
  
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  
  const [hasModeratorMessages, setHasModeratorMessages] = useState(false);
  
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleOpenProfile = () => {
    if (!activeChat || activeChat.is_group) return;
    
    
    const otherUser = activeChat.members?.find(member => {
      const memberId = member.user_id || member.id;
      return memberId !== user?.id;
    });
    
    if (otherUser) {
      
      navigate(`/profile/${otherUser.username}`);
    }
    
    handleCloseMenu();
  };
  
  const handleOpenDeleteDialog = () => {
    handleCloseMenu();
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteChat = async () => {
    if (activeChat) {
      const result = await deleteChat(activeChat.id);
      
      if (result.success) {
        
        console.log(`Чат ${activeChat.id} успешно удален`);
        
        
        if (isMobile && backAction) {
          backAction();
        }
      } else {
        console.error(`Ошибка при удалении чата: ${result.error}`);
        
      }
    }
    
    setDeleteDialogOpen(false);
  };
  
  
  useEffect(() => {
    if (activeChat?.id) {
      chatIdRef.current = activeChat.id;
    }
  }, [activeChat]);
  
  
  useEffect(() => {
    let mounted = true;
    
    if (activeChat?.id && (!messages[activeChat.id] || messages[activeChat.id].length === 0)) {
      
      console.log(`ChatWindow: Loading messages for chat ${activeChat.id}, is_group=${activeChat.is_group}`, 
        { chat: activeChat, messagesState: messages });
      
      
      const timer = setTimeout(() => {
        if (mounted && chatIdRef.current === activeChat.id) {
          console.log(`ChatWindow: Executing loadMessages for chat ${activeChat.id}`);
          loadMessages(activeChat.id);
          
          
          if (activeChat.is_group) {
            setTimeout(() => {
              if (mounted && chatIdRef.current === activeChat.id && 
                  (!messages[activeChat.id] || messages[activeChat.id].length === 0)) {
                console.log(`ChatWindow: Retry loading messages for group chat ${activeChat.id}`);
                loadMessages(activeChat.id);
              }
            }, 1500);
          }
        }
      }, 100);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
    
    return () => {
      mounted = false;
    };
  }, [activeChat, loadMessages, messages]);
  
  
  useEffect(() => {
    if (activeChat && messages[activeChat.id]) {
      
      const apiHasModeratorMessages = messages[activeChat.id].hasModeratorMessages;
      
      
      if (apiHasModeratorMessages !== undefined) {
        setHasModeratorMessages(apiHasModeratorMessages);
      } else {
        
        const hasModerator = messages[activeChat.id].some(message => 
          message.is_from_moderator || 
          (activeChat.members && activeChat.members.some(member => 
            member.id === message.sender_id && member.is_moderator
          ))
        );
        setHasModeratorMessages(hasModerator);
      }
    } else {
      setHasModeratorMessages(false);
    }
  }, [activeChat, messages]);
  
  
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);
  
  
  useEffect(() => {
    if (activeChat && messages[activeChat.id] && autoScrollEnabled) {
      scrollToBottom();
    }
  }, [activeChat, messages, scrollToBottom, autoScrollEnabled]);
  
  
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
      const scrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setIsAtBottom(scrolledToBottom);
      
      
      if (scrolledToBottom && !autoScrollEnabled) {
        setAutoScrollEnabled(true);
      } 
      
      else if (!scrolledToBottom && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }
    }
  }, [autoScrollEnabled]);
  
  
  const throttledScrollHandler = useCallback(() => {
    let isThrottled = false;
    
    return () => {
      if (!isThrottled) {
        handleScroll();
        isThrottled = true;
        
        setTimeout(() => {
          isThrottled = false;
        }, 200);
      }
    };
  }, [handleScroll]);
  
  
  useEffect(() => {
    const container = messagesContainerRef.current;
    const throttled = throttledScrollHandler();
    
    if (container) {
      container.addEventListener('scroll', throttled);
      return () => container.removeEventListener('scroll', throttled);
    }
  }, [throttledScrollHandler]);
  
  
  const hasMoreMessagesForChat = activeChat && 
                               hasMoreMessages && 
                               Object.prototype.hasOwnProperty.call(hasMoreMessages, activeChat.id) && 
                               hasMoreMessages[activeChat.id];
                               
  
  
  useIntersectionObserver({
    target: loadMoreTriggerRef,
    onIntersect: () => {
      if (activeChat && hasMoreMessagesForChat && !loadingMessages) {
        
        const container = messagesContainerRef.current;
        if (container) {
          const scrollHeight = container.scrollHeight;
          const scrollPosition = container.scrollTop;
          
          
          loadMessages(activeChat.id).then(() => {
            
            setTimeout(() => {
              if (container) {
                
                const newScrollHeight = container.scrollHeight;
                const addedHeight = newScrollHeight - scrollHeight;
                
                
                container.scrollTop = scrollPosition + addedHeight;
              }
            }, 100); 
          });
        } else {
          loadMessages(activeChat.id);
        }
      }
    },
    enabled: !!activeChat && hasMoreMessagesForChat && !loadingMessages,
    threshold: 0.5,
    rootMargin: '100px'
  });
  
  
  const handleSendMessage = useCallback(async (text) => {
    if (!activeChat || !text.trim()) return;
    
    try {
      const replyToId = replyTo ? replyTo.id : null;
      await sendTextMessage(activeChat.id, text, replyToId);
      
      
      setReplyTo(null);
      
      
      setTimeout(() => scrollToBottom(true), 100);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  }, [activeChat, replyTo, sendTextMessage, scrollToBottom]);
  
  
  const handleFileUpload = useCallback(async (file, type) => {
    if (!activeChat || !file) return;
    
    try {
      const replyToId = replyTo ? replyTo.id : null;
      await uploadFile(activeChat.id, file, type, replyToId);
      
      
      setReplyTo(null);
      
      
      setTimeout(() => scrollToBottom(true), 100);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    }
  }, [activeChat, replyTo, uploadFile, scrollToBottom]);
  
  
  const handleTyping = useCallback((isTyping) => {
    if (!activeChat) return;
    
    if (isTyping) {
      
      const now = new Date().getTime();
      const lastTypingEvent = typingTimestampRef.current || 0;
      
      if (now - lastTypingEvent > 2000) {
        sendTypingIndicator(activeChat.id, isTyping);
        typingTimestampRef.current = now;
      }
    } else {
      sendTypingIndicator(activeChat.id, isTyping);
    }
  }, [activeChat, sendTypingIndicator]);
  
  
  const renderTypingIndicator = useCallback(() => {
    if (!activeChat || !typingUsers[activeChat.id]) return null;
    
    const typingUserIds = Object.keys(typingUsers[activeChat.id]);
    if (typingUserIds.length === 0) return null;
    
    return <TypingIndicator userIds={typingUserIds} chatMembers={activeChat.members} />;
  }, [activeChat, typingUsers]);
  
  
  const renderScrollToBottom = () => {
    if (isAtBottom) return null;
    
    return (
      <button 
        className="scroll-to-bottom"
        onClick={() => {
          setAutoScrollEnabled(true);
          scrollToBottom(true);
        }}
      >
        ↓
      </button>
    );
  };
  
  
  const getChatTitle = useCallback(() => {
    if (!activeChat) return 'Чат';
    
    if (activeChat.is_group || activeChat.chat_type === 'group') {
      return activeChat.title || 'Групповой чат';
    } else {
      
      const otherMember = activeChat.members?.find(member => {
        const memberId = member.user_id || member.id;
        
        const memberIdStr = memberId ? String(memberId) : null;
        const currentUserIdStr = user?.id ? String(user.id) : null;
        
        return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
      });
      
      if (otherMember) {
        return otherMember.name || otherMember.username || activeChat.title || 'Личная переписка';
      }
      
      return activeChat.title || 'Личная переписка';
    }
  }, [activeChat, user]);
  
  
  const getChatAvatar = useCallback(() => {
    if (!activeChat) return null;
    
    if (activeChat.is_group || activeChat.chat_type === 'group') {
      return activeChat.avatar || null;
    } else {
      
      const otherMember = activeChat.members?.find(member => {
        const memberId = member.user_id || member.id;
        
        const memberIdStr = memberId ? String(memberId) : null;
        const currentUserIdStr = user?.id ? String(user.id) : null;
        
        return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
      });
      
      
      if (otherMember) {
        const otherUserId = otherMember.user_id || otherMember.id;
        const photo = otherMember.photo || otherMember.avatar;
        
        
        if (photo && otherUserId && typeof photo === 'string') {
          if (!photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('/static/')) {
            console.log(`ChatWindow: строим правильный путь аватара для ${otherUserId}`);
            return `/static/uploads/avatar/${otherUserId}/${photo}`;
          }
        }
        
        return otherMember.avatar || otherMember.photo || null;
      }
      
      return activeChat.avatar || null;
    }
  }, [activeChat, user]);

  
  const getAvatarLetter = useCallback(() => {
    const title = getChatTitle();
    return title?.[0]?.toUpperCase() || '?';
  }, [getChatTitle]);
  
  
  
  const chatMessages = activeChat ? (messages[activeChat.id] || []) : [];
  const memoizedMessages = React.useMemo(() => {
    if (!activeChat) return [];
    
    return chatMessages.map((message) => (
      <MemoizedMessageItem 
        key={message.id}
        message={message}
        isCurrentUser={message.sender_id === user?.id}
        decryptedContent={activeChat?.encrypted ? decryptMessage(message, activeChat.id) : message.content}
        onReply={() => setReplyTo(message)}
        replyMessage={message.reply_to_id ? chatMessages.find(m => m.id === message.reply_to_id) : null}
        chatMembers={activeChat?.members}
      />
    ));
  }, [chatMessages, user, activeChat, decryptMessage, setReplyTo]);
  
  
  const formatLastActive = (dateObject) => {
    if (!dateObject) return "Не в сети";
    
    try {
      
      if (typeof dateObject === 'string' && /^\d{1,2}:\d{2}$/.test(dateObject)) {
        
        const today = new Date();
        const options = {
          month: 'long',
          day: 'numeric'
        };
        const formattedDate = today.toLocaleDateString('ru-RU', options);
        return `Был${isFemale ? 'а' : ''} в сети ${formattedDate} в ${dateObject}`;
      }
      
      
      if (typeof dateObject === 'string' && /^\d{1,2}\s+\w+$/.test(dateObject)) {
        return `Был${isFemale ? 'а' : ''} в сети ${dateObject}`;
      }
      
      
      const date = dateObject instanceof Date ? dateObject : new Date(dateObject);
      if (isNaN(date.getTime())) {
        console.error('Неверный формат даты:', dateObject);
        
        return typeof dateObject === 'string' 
          ? `Был${isFemale ? 'а' : ''} в сети ${dateObject}` 
          : "Не в сети";
      }
      
      const now = new Date();
      
      
      const diffMs = now - date;
      
      
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      
      if (diffMins < 1) return 'В сети';
      if (diffMins < 60) return `Был${isFemale ? 'а' : ''} в сети ${diffMins} мин. назад`;
      if (diffHours < 24) return `Был${isFemale ? 'а' : ''} в сети ${diffHours} ч. назад`;
      if (diffDays < 7) return `Был${isFemale ? 'а' : ''} в сети ${diffDays} дн. назад`;
      
      
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      return `Был${isFemale ? 'а' : ''} в сети ${date.toLocaleString('ru-RU', options)}`;
    } catch (e) {
      console.error('Ошибка форматирования даты:', e, dateObject);
      
      return typeof dateObject === 'string' 
        ? `Был${isFemale ? 'а' : ''} в сети ${dateObject}` 
        : "Не в сети";
    }
  };
  
  
  const otherUser = useMemo(() => {
    if (!activeChat || activeChat.is_group || !activeChat.members) return null;
    
    return activeChat.members.find(member => {
      const memberId = member.user_id || member.id;
      
      const memberIdStr = memberId ? String(memberId) : null;
      const currentUserIdStr = user?.id ? String(user.id) : null;
      
      return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
    });
  }, [activeChat, user]);
  
  
  const isFemale = useMemo(() => {
    if (!otherUser) return false;
    
    
    if (otherUser.gender) {
      return otherUser.gender === 'female';
    }
    
    
    const name = otherUser.name || '';
    return name.endsWith('а') || name.endsWith('я');
  }, [otherUser]);
  
  
  const userStatus = useMemo(() => {
    if (!otherUser) return 'Не в сети';
    
    if (onlineUsers[otherUser.user_id || otherUser.id]) {
      return 'В сети';
    }
    
    
    if (otherUser.last_active) {
      return formatLastActive(otherUser.last_active);
    }
    
    return 'Не в сети';
  }, [otherUser, onlineUsers]);
  
  if (!activeChat) {
    return (
      <div className="chat-window chat-window-empty">
        <div className="empty-state">
          <h3>Выберите чат или начните новый</h3>
          <p>Выберите существующий чат слева или создайте новый, чтобы начать общение</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="chat-window">
      <header className="chat-header">
        {isMobile && (
          <div 
            className="back-button-icon" 
            onClick={backAction}
          >
            ←
          </div>
        )}
        
        <div 
          className="chat-avatar"
          onClick={handleOpenMenu}
          style={{ cursor: 'pointer' }}
        >
          {getChatAvatar() ? (
            <img src={getChatAvatar()} alt={getChatTitle()} />
          ) : (
            <div className="avatar-placeholder">
              {getAvatarLetter()}
            </div>
          )}
        </div>
        
        <div className="chat-info">
          <h3>{getChatTitle()}</h3>
          {!activeChat.is_group && activeChat.chat_type !== 'group' && (
            <span className="user-status">{userStatus}</span>
          )}
          {activeChat.is_group && (
            <span className="members-count">{activeChat.members?.length || 0} участников</span>
          )}
          {activeChat.encrypted && <span className="encrypted-badge">🔒</span>}
        </div>
        
        <div className="chat-actions">
          <div 
            className="chat-menu-button" 
            onClick={handleOpenMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#aaa',
              transition: 'all 0.2s ease',
              position: 'absolute',
              right: '10px',
              top: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#aaa';
            }}
          >
            <MoreVertIcon />
          </div>
        </div>
        
        {/* Меню управления чатом */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {!activeChat?.is_group && (
            <MenuItem onClick={handleOpenProfile}>
              <PersonIcon fontSize="small" style={{ marginRight: '8px' }} />
              Профиль пользователя
            </MenuItem>
          )}
          <MenuItem onClick={handleOpenDeleteDialog}>
            <DeleteIcon fontSize="small" style={{ marginRight: '8px' }} />
            Удалить чат
          </MenuItem>
        </Menu>
        
        {/* Диалог подтверждения удаления чата */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Удаление чата</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы действительно хотите удалить чат {getChatTitle()}? Это действие нельзя отменить.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Отмена
            </Button>
            <Button onClick={handleDeleteChat} color="error" autoFocus>
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </header>
      
      <div 
        className="messages-container" 
        ref={messagesContainerRef}
        style={{ paddingRight: 0 }}
      >
        {/* Показываем баннер модератора если собеседник модератор ИЛИ есть сообщения от модераторов */}
        {(
          (activeChat?.chat_type === 'personal' && 
           activeChat?.members?.some(member => member.id !== user?.id && member.is_moderator)) ||
          hasModeratorMessages
        ) && <ModeratorBanner />}
        
        {/* Триггер для загрузки предыдущих сообщений при прокрутке вверх */}
        {hasMoreMessagesForChat && (
          <div 
            ref={loadMoreTriggerRef} 
            className="load-more-trigger"
          >
            {loadingMessages && (
              <div className="loading-more">
                <div className="loading-spinner-small"></div>
                <span>Загрузка истории...</span>
              </div>
            )}
          </div>
        )}
        
        {/* Список сообщений */}
        <div className="messages-list">
          {memoizedMessages}
        </div>
        
        {/* Индикатор "Печатает..." */}
        {renderTypingIndicator()}
        
        {/* Невидимый элемент для прокрутки вниз */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Кнопка прокрутки вниз */}
      {renderScrollToBottom()}
      
      {/* Поле ввода сообщения */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onFileUpload={handleFileUpload}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default memo(ChatWindow); 