import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * ChatPopupContext – хранит массив открытых поп-апов формата
 * { chatId, minimized }
 */
const ChatPopupContext = createContext({
  popups: [],
  openPopup: () => {},
  closePopup: () => {},
  toggleMinimize: () => {}
});

export const ChatPopupProvider = ({ children }) => {
  const [popups, setPopups] = useState([]); // [{chatId, minimized}]

  const openPopup = useCallback((chatId) => {
    setPopups((prev) => {
      // Уже открыт
      if (prev.some((p) => p.chatId === chatId)) return prev;
      // Ограничиваем максимум до 4 окон – можно настроить
      const limited = prev.slice(-3);
      return [...limited, { chatId, minimized: false }];
    });
  }, []);

  const closePopup = useCallback((chatId) => {
    setPopups((prev) => prev.filter((p) => p.chatId !== chatId));
  }, []);

  const toggleMinimize = useCallback((chatId) => {
    setPopups((prev) => prev.map((p) => p.chatId === chatId ? { ...p, minimized: !p.minimized } : p));
  }, []);

  return (
    <ChatPopupContext.Provider value={{ popups, openPopup, closePopup, toggleMinimize }}>
      {children}
    </ChatPopupContext.Provider>
  );
};

export const useChatPopups = () => useContext(ChatPopupContext); 