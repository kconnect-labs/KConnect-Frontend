import React, { memo, useMemo } from 'react';

const TypingIndicator = ({ userIds = [], chatMembers = [] }) => {
  const typingText = useMemo(() => {
    if (!userIds.length) return '';
    
    const typingUserNames = userIds.map(userId => {
      const member = chatMembers.find(m => m.user_id === parseInt(userId));
      const name = member?.name || member?.username || 'Кто-то';
      return name.length > 6 ? name.substring(0, 6) + '...' : name;
    });
    
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} печатает...`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} и ${typingUserNames[1]} печатают...`;
    } else {
      return `${typingUserNames.length} человек печатают...`;
    }
  }, [userIds, chatMembers]);
  
  if (!typingText) return null;
  
  return (
    <div className="typing-indicator">
      <div className="typing-animation">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <span className="typing-text">{typingText}</span>
    </div>
  );
};

export default memo(TypingIndicator); 