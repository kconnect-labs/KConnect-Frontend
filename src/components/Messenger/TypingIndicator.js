import React, { memo } from 'react';

const TypingIndicator = ({ userIds = [], chatMembers = [] }) => {
  if (!userIds.length) return null;
  
  
  const typingUserNames = userIds.map(userId => {
    const member = chatMembers.find(m => m.user_id === parseInt(userId));
    return member?.name || member?.username || 'Кто-то';
  });
  
  
  let typingText = '';
  if (typingUserNames.length === 1) {
    typingText = `${typingUserNames[0]} печатает...`;
  } else if (typingUserNames.length === 2) {
    typingText = `${typingUserNames[0]} и ${typingUserNames[1]} печатают...`;
  } else if (typingUserNames.length > 2) {
    typingText = `${typingUserNames.length} человек печатают...`;
  }
  
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