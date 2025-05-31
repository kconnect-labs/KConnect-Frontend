import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useMessenger } from '../../contexts/MessengerContext';
import ChatItem from './ChatItem';
import SearchUsers from './SearchUsers';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';

const ChatList = ({ onSelectChat }) => {
  const { 
    chats, 
    loading, 
    activeChat, 
    setActiveChat,
    unreadCounts,
    refreshChats,
    onlineUsers,
    user
  } = useMessenger();
  
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const initialLoadRef = useRef(false);
  
  
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      console.log('ChatList: Force refreshing chats on initial render');
      refreshChats();
      
      
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log('ChatList: Window became visible, refreshing chats...');
          refreshChats();
        }
      };
      
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      
      const refreshTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          console.log('ChatList: Running periodic refresh to ensure updated avatars');
          refreshChats();
        }
      }, 30000); 
      
      return () => {
        clearInterval(refreshTimer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [refreshChats]);
  
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = chats.filter(chat => {
      
      if (chat.title && chat.title.toLowerCase().includes(query)) {
        return true;
      }
      
      
      if (!chat.is_group && chat.members) {
        const otherMember = chat.members.find(member => member.user_id !== user?.id);
        if (otherMember && (
          (otherMember.name && otherMember.name.toLowerCase().includes(query)) ||
          (otherMember.username && otherMember.username.toLowerCase().includes(query))
        )) {
          return true;
        }
      }
      
      
      if (chat.last_message && 
          chat.last_message.message_type === 'text' && 
          chat.last_message.content &&
          chat.last_message.content.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredChats(filtered);
  }, [searchQuery, chats, user]);
  
  
  const toggleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
    
    if (searchMode) {
      setSearchQuery('');
    }
  }, [searchMode]);
  
  
  const handleChatSelect = useCallback((chatId) => {
    console.log('ChatList: Handling chat selection for chat ID:', chatId);
    
    setActiveChat(chatId);
    
    
    if (onSelectChat) {
      console.log('ChatList: Calling external onSelectChat handler');
      onSelectChat();
    }
  }, [setActiveChat, onSelectChat]);
  
  
  const handleRefreshChats = useCallback(() => {
    refreshChats();
  }, [refreshChats]);
  
  
  const renderHeader = () => {
    return (
      <div className="chat-list-header">
        <h2>Сообщения</h2>
        <div className="header-actions">
          <IconButton 
            size="small"
            color={searchMode ? "primary" : "default"}
            onClick={toggleSearchMode}
            title={searchMode ? "Вернуться к чатам" : "Найти пользователя"}
          >
            {searchMode ? <ArrowBackIcon /> : <PersonSearchIcon />}
          </IconButton>
          <IconButton 
            size="small"
            onClick={handleRefreshChats}
            title="Обновить список чатов"
          >
            <RefreshIcon />
          </IconButton>
        </div>
      </div>
    );
  };
  
  
  const renderSearch = () => {
    if (searchMode) {
      return <SearchUsers onClose={toggleSearchMode} />;
    }
    
    return (
      <div className="chat-search">
        <input
          type="text"
          placeholder="Поиск по сообщениям..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <IconButton
            size="small"
            onClick={() => setSearchQuery('')}
            sx={{ padding: '4px' }}
            title="Очистить поиск"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    );
  };
  
  
  const renderContent = () => {
    if (loading) {
      return <div className="chat-list-loading">Загрузка чатов...</div>;
    }
    
    if (filteredChats.length === 0) {
      return (
        <div className="chat-list-empty">
          {searchQuery
            ? 'Нет результатов по вашему запросу'
            : 'У вас пока нет чатов. Найдите пользователя, чтобы начать беседу.'}
        </div>
      );
    }
    
    return (
      <div className="chat-list-items">
        {filteredChats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChat?.id === chat.id}
            unreadCount={unreadCounts[chat.id] || 0}
            onClick={() => handleChatSelect(chat.id)}
            currentUserId={user?.id}
            onlineUsers={onlineUsers}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="chat-list">
      {renderHeader()}
      {renderSearch()}
      {!searchMode && renderContent()}
    </div>
  );
};

export default memo(ChatList); 