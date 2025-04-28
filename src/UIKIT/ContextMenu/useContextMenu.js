import { useState, useCallback } from 'react';

/**
 * Хук для управления состоянием контекстного меню
 * @returns {Object} - Состояние и методы контекстного меню
 */
const useContextMenu = () => {
  const [contextMenuState, setContextMenuState] = useState({
    show: false,
    x: 0,
    y: 0,
    data: null
  });

  // Обработчик открытия контекстного меню
  const handleContextMenu = useCallback((e, data = null) => {
    e.preventDefault(); // Предотвращаем стандартное контекстное меню браузера
    
    setContextMenuState({
      show: true,
      x: e.clientX,
      y: e.clientY,
      data
    });
  }, []);

  // Обработчик закрытия контекстного меню
  const closeContextMenu = useCallback(() => {
    setContextMenuState(prev => ({
      ...prev,
      show: false
    }));
  }, []);

  return {
    contextMenuState,
    handleContextMenu,
    closeContextMenu
  };
};

export default useContextMenu; 