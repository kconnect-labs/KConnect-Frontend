import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { useMessenger } from '../../contexts/MessengerContext';
import ChatItem from './ChatItem';
import SearchUsers from './SearchUsers';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
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
    user,
    createGroupChat
  } = useMessenger();
  
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter(chat => {
      if (chat.title && chat.title.toLowerCase().includes(query)) return true;
      if (!chat.is_group && chat.members) {
        const otherMember = chat.members.find(member => member.user_id !== user?.id);
        if (otherMember && (
          (otherMember.name && otherMember.name.toLowerCase().includes(query)) ||
          (otherMember.username && otherMember.username.toLowerCase().includes(query))
        )) return true;
      }
      if (chat.last_message && chat.last_message.message_type === 'text' && chat.last_message.content && chat.last_message.content.toLowerCase().includes(query)) return true;
      return false;
    });
  }, [searchQuery, chats, user]);
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
  
  
  const toggleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
    
    if (searchMode) {
      setSearchQuery('');
    }
  }, [searchMode]);
  
  
  const handleChatSelect = useCallback((chatId) => {
    setActiveChat(chatId);
    if (onSelectChat) onSelectChat();
  }, [setActiveChat, onSelectChat]);
  
  
  const handleCreateGroup = useCallback(async () => {
    const title = prompt('Название группы:');
    if (!title) return;
    try {
      await createGroupChat(title, []);
      refreshChats();
    } catch (e) {
      console.error('Ошибка создания группы', e);
    }
  }, [createGroupChat, refreshChats]);
  
  
  
  
  const renderSearch = () => {
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
      return (
      <>
        {loading && <div className="chat-list-loading">Загрузка чатов...</div>}
        {!loading && filteredChats.length === 0 && (
        <div className="chat-list-empty">
          {searchQuery
            ? 'Нет результатов по вашему запросу'
            : 'У вас пока нет чатов. Найдите пользователя, чтобы начать беседу.'}
        </div>
        )}
        {!loading && filteredChats.length > 0 && (
      <div className="chat-list-items">
        {filteredChats.map(chat => {
          const unreadCount = unreadCounts[chat.id] || 0;
          return (
            <MemoizedChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              unreadCount={unreadCount}
              onClick={() => handleChatSelect(chat.id)}
              currentUserId={user?.id}
              onlineUsers={onlineUsers}
            />
          );
        })}
      </div>
        )}
      </>
    );
  };
  
  // Открытие поиска по внешнему событию (Новый чат)
  useEffect(() => {
    const toggleSearch = () => setSearchMode(prev => !prev);
    window.addEventListener('messenger-new-chat', toggleSearch);
    return () => window.removeEventListener('messenger-new-chat', toggleSearch);
  }, []);
  
  return (
    <div className="chat-list">
      {searchMode ? (
        <SearchUsers onClose={toggleSearchMode} />
      ) : (
        <>
      {renderSearch()}
          {renderContent()}
        </>
      )}
    </div>
  );
};

const MemoizedChatItem = React.memo(ChatItem);

export default memo(ChatList); 