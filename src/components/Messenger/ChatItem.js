import React, { useMemo, memo, useEffect, useState } from 'react';
import { useMessenger } from '../../contexts/MessengerContext';

const ChatItem = ({ 
  chat, 
  isActive, 
  unreadCount, 
  onClick, 
  currentUserId,
  onlineUsers
}) => {
  const { getUserInfo } = useMessenger();
  const [otherUserDetails, setOtherUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const otherMember = useMemo(() => {
    if (chat.is_group) return null;
    
    
    if (!chat.members || !Array.isArray(chat.members) || chat.members.length === 0) {
      console.error(`Chat ${chat.id} has no valid members array:`, chat);
      return null;
    }
    
    console.log(`Finding other member for chat ${chat.id}. Current user: ${currentUserId}. Members:`, chat.members);
    
    
    const other = chat.members.find(member => {
      
      const memberId = member.user_id || member.id || (member.user && member.user.id);
      
      
      if (!memberId) {
        console.warn(`Member without ID found in chat ${chat.id}:`, member);
      }
      
      return memberId && memberId !== currentUserId;
    });
    
    if (!other) {
      console.error(`Could not find other member in chat ${chat.id}. Members:`, chat.members);
    } else {
      console.log(`Found other member in chat ${chat.id}:`, other);
    }
    
    return other;
  }, [chat, currentUserId]);
  
  
  useEffect(() => {
    if (chat.is_group || !otherMember) return;
    
    const loadUserDetails = async () => {
      
      const otherUserId = otherMember.user_id || otherMember.id || (otherMember.user && otherMember.user.id);
      
      if (!otherUserId) {
        console.error(`Cannot find valid user ID for other member in chat ${chat.id}:`, otherMember);
        return;
      }
      
      if (!isLoading && !otherUserDetails) {
        setIsLoading(true);
        try {
          console.log(`Loading details for user ${otherUserId} in chat ${chat.id}`);
          const userInfo = await getUserInfo(otherUserId);
          if (userInfo) {
            console.log(`Got details for user ${otherUserId}:`, userInfo.name);
            setOtherUserDetails(userInfo);
          } else {
            console.warn(`No user info returned for ${otherUserId}`);
          }
        } catch (err) {
          console.error(`Error loading user info for ${otherUserId}:`, err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserDetails();
  }, [chat, otherMember, getUserInfo, isLoading, otherUserDetails]);
  
  
  const title = useMemo(() => {
    
    if (chat.is_group) {
      return chat.title || 'Групповой чат';
    }
    
    
    if (!otherMember) {
      console.error(`Personal chat ${chat.id} has no other member:`, chat);
      return `Чат ${chat.id}`;
    }
    
    
    const otherUserId = otherMember.user_id || otherMember.id || (otherMember.user && otherMember.user.id);
    
    
    if (otherUserDetails) {
      return otherUserDetails.name || otherUserDetails.username || `Пользователь #${otherUserId}`;
    }
    
    
    const memberName = otherMember.name 
      || (otherMember.user && otherMember.user.name)
      || otherMember.username
      || (otherMember.user && otherMember.user.username);
    
    if (memberName && memberName !== 'Пользователь') {
      return memberName;
    }
    
    
    if (isLoading) {
      return 'Загрузка...';
    }
    
    
    return `Пользователь #${otherUserId}`;
  }, [chat, otherMember, otherUserDetails, isLoading]);
  
  
  const isOnline = useMemo(() => {
    if (chat.is_group || !otherMember) return false;
    
    const otherUserId = otherMember.user_id || otherMember.id || (otherMember.user && otherMember.user.id);
    if (!otherUserId) return false;
    
    return !!onlineUsers[otherUserId];
  }, [chat, otherMember, onlineUsers]);
  
  
  const lastMessagePreview = useMemo(() => {
    const message = chat.last_message;
    if (!message) return '';
    
    
    let senderName = '';
    
    
    if (message.sender_id === currentUserId) {
      senderName = 'Вы';
    } 
    
    else if (!chat.is_group) {
      
      senderName = '';
    }
    
    else {
      
      if (otherMember && message.sender_id === (otherMember.user_id || otherMember.id)) {
        senderName = otherUserDetails?.name || otherMember.name || 'Участник';
      }
      
      else {
        const sender = chat.members?.find(
          member => (member.user_id || member.id) === message.sender_id
        );
        
        if (sender) {
          senderName = sender.name || (sender.user && sender.user.name) || message.sender_name || 'Участник';
        } else {
          senderName = message.sender_name || 'Участник';
        }
      }
    }
    
    
    const senderPrefix = chat.is_group && message.sender_id !== currentUserId
      ? `${senderName}: `
      : '';
    
    
    switch (message.message_type) {
      case 'text':
        return `${senderPrefix}${message.content}`;
      case 'photo':
        return `${senderPrefix}📷 Фото`;
      case 'video':
        return `${senderPrefix}🎬 Видео`;
      case 'audio':
        return `${senderPrefix}🎵 Аудио`;
      case 'file':
        return `${senderPrefix}📎 Файл: ${message.original_filename || 'файл'}`;
      default:
        return `${senderPrefix}Новое сообщение`;
    }
  }, [chat, currentUserId, otherMember, otherUserDetails]);
  
  
  const lastMessageTime = useMemo(() => {
    const message = chat.last_message;
    if (!message) return '';
    
    try {
      
      if (typeof message.created_at === 'string' && /^\d{1,2}:\d{2}$/.test(message.created_at)) {
        return message.created_at;
      }
      
      
      if (typeof message.created_at === 'string' && /^\d{1,2}\s+\w+$/.test(message.created_at)) {
        return message.created_at;
      }
      
      
      const date = message.created_at instanceof Date ? message.created_at : new Date(message.created_at);
      if (isNaN(date.getTime())) {
        console.error('Неверный формат даты:', message.created_at);
        
        return typeof message.created_at === 'string' ? message.created_at : '';
      }
      
      const now = new Date();
      
      
      const dateString = date.toLocaleDateString();
      const nowString = now.toLocaleDateString();
      
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayString = yesterday.toLocaleDateString();
      
      
      if (dateString === nowString) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      
      if (dateString === yesterdayString) {
        return 'Вчера';
      }
      
      
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    } catch (e) {
      console.error('Ошибка форматирования даты:', e);
      
      return typeof message.created_at === 'string' ? message.created_at : '';
    }
  }, [chat]);
  
  
  const avatarLetter = title?.[0]?.toUpperCase() || '?';
  
  
  console.log(`ChatItem ${chat.id} render:`, { 
    title, 
    avatar: chat.avatar, 
    is_group: chat.is_group
  });
  
  return (
    <div 
      className={`chat-item ${isActive ? 'active' : ''} ${unreadCount > 0 ? 'unread' : ''}`}
      onClick={onClick}
    >
      <div className="chat-avatar-container">
        <div className="chat-avatar">
          {chat.avatar ? (
            <img 
              src={chat.avatar} 
              alt={title} 
              style={{
                objectFit: 'cover',
                
                ...(chat.avatar.toLowerCase().endsWith('.gif') && {
                  objectFit: 'contain',
                  background: 'transparent'
                })
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              {avatarLetter}
            </div>
          )}
        </div>
        {isOnline && (
          <span 
            className="online-indicator" 
            style={{ 
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              border: '2px solid var(--background-color, #1A1A1A)',
              zIndex: 2
            }}
          />
        )}
      </div>
      
      <div className="chat-info">
        <div className="chat-title-row">
          <h4 className="chat-title">
            {title}
            {chat.encrypted && <span className="encrypted-badge">🔒</span>}
          </h4>
          <span className="chat-time">{lastMessageTime}</span>
        </div>
        
        <div className="chat-preview-row">
          <p className="last-message">{lastMessagePreview}</p>
          
          {unreadCount > 0 && (
            <span className="unread-counter">{unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};


export default memo(ChatItem); 