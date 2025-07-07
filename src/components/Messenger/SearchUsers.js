import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMessenger } from '../../contexts/MessengerContext';

const SearchUsers = ({ onClose }) => {
  const { 
    searchUsers, 
    createPersonalChat,
    setActiveChat,
    getChatDetails
  } = useMessenger();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const searchTimeout = useRef(null);
  
  
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    
    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const users = await searchUsers(query);
        setResults(users);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Ошибка поиска пользователей');
      } finally {
        setLoading(false);
      }
    }, 300); 
    
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, searchUsers]);
  
  
  const handleStartChat = useCallback(async (userId, existingChatId = null) => {
    if (creating) return;
    
    try {
      setCreating(true);
      
      let chatId;
      
      if (existingChatId) {
        
        const chatDetails = await getChatDetails(existingChatId);
        chatId = chatDetails?.id || null;
      } else {
        
        chatId = await createPersonalChat(userId);
      }
      
      if (chatId) {
        
        setActiveChat(chatId);
        
        onClose();
      }
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('Не удалось создать чат');
    } finally {
      setCreating(false);
    }
  }, [createPersonalChat, setActiveChat, onClose, getChatDetails, creating]);
  
  
  const renderResults = () => {
    if (loading) {
      return <div className="search-loading">Поиск...</div>;
    }
    
    if (error) {
      return <div className="search-error">{error}</div>;
    }
    
    if (results.length === 0) {
      if (query.trim().length >= 2) {
        return <div className="search-empty">Пользователи не найдены</div>;
      }
      return <div className="search-hint">Введите запрос для поиска пользователей</div>;
    }
    
    return (
      <div className="search-results">
        {results.map(user => (
          <div key={user.id} className="search-user-item">
            <div className="user-avatar">
              {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-username">@{user.username}</div>
            </div>
            
            <button
              className="start-chat-btn"
              onClick={() => handleStartChat(user.id, user.existing_chat_id)}
              disabled={creating}
            >
              {user.has_chat ? 'Открыть' : 'Написать'}
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="search-users">

      
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Введите имя или логин..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            className="clear-search"
            onClick={() => setQuery('')}
          >
            ×
          </button>
        )}
      </div>
      
      {renderResults()}
    </div>
  );
};

export default SearchUsers; 