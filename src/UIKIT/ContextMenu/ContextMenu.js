import React, { useEffect, useRef, useState } from 'react';
import './ContextMenu.css';

/**
 * Переиспользуемый компонент контекстного меню
 * @param {Object} props
 * @param {Array} props.items - Массив элементов меню [{id, label, icon, onClick, disabled}]
 * @param {number} props.x - X позиция меню
 * @param {number} props.y - Y позиция меню
 * @param {boolean} props.show - Отображать ли меню
 * @param {Function} props.onClose - Функция, вызываемая при закрытии меню
 */
const ContextMenu = ({ items, x, y, show, onClose }) => {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ x, y });

  // Корректируем позицию, чтобы меню не выходило за пределы экрана
  useEffect(() => {
    if (show && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = x;
      let adjustedY = y;
      
      // Проверяем, не выходит ли меню за правый край экрана
      if (x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width;
      }
      
      // Проверяем, не выходит ли меню за нижний край экрана
      if (y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height;
      }
      
      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [show, x, y]);

  // Закрываем меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  // Закрываем при нажатии Esc
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className="context-menu"
      ref={menuRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {items.map((item) => (
        <div 
          key={item.id} 
          className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
          onClick={() => {
            if (!item.disabled) {
              item.onClick();
              onClose();
            }
          }}
        >
          {item.icon && <span className="context-menu-icon">{item.icon}</span>}
          <span className="context-menu-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ContextMenu; 