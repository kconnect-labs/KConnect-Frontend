import React, { useEffect, useRef, useState, useContext } from 'react';
import { Box, alpha, styled, useTheme } from '@mui/material';
import { ThemeSettingsContext } from '../../App';

/**
 * Переиспользуемый компонент контекстного меню
 * @param {Object} props
 * @param {Array} props.items - Массив элементов меню [{id, label, icon, onClick, disabled}]
 * @param {number} props.x - X позиция меню
 * @param {number} props.y - Y позиция меню
 * @param {boolean} props.show - Отображать ли меню
 * @param {Function} props.onClose - Функция, вызываемая при закрытии меню
 */

const MenuContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1000,
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255,255,255,0.03)'
    : theme.palette.mode === 'contrast'
      ? '#101010'
      : 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(10px)',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  // minWidth: 180,
  padding: '6px 0',
  overflow: 'hidden',
  animation: 'fadeIn 0.15s ease-out',
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(0, 0, 0, 0.08)'
    : '1px solid rgba(255, 255, 255, 0.1)',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

const MenuItem = styled(Box)(({ theme, disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'background-color 0.2s',
  userSelect: 'none',
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#E6E6E6',
  opacity: disabled ? 0.5 : 1,
  '&:hover': {
    backgroundColor: disabled ? 'transparent' : alpha(theme.palette.primary.main, 0.12),
  },
}));

const MenuIcon = styled(Box)(({ theme }) => ({
  marginRight: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  color: theme.palette.primary.main,
}));

const MenuLabel = styled(Box)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#E6E6E6',
}));

const ContextMenu = ({ items, x, y, show, onClose }) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (show && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = x - rect.width;
      let adjustedY = y;
      
      if (adjustedX < 0) {
        adjustedX = 0;
      }
      
      if (adjustedY + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height;
      }
      
      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [show, x, y]);

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
    <MenuContainer 
      ref={menuRef}
      sx={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {items.map((item) => (
        <MenuItem 
          key={item.id} 
          disabled={item.disabled}
          onClick={() => {
            if (!item.disabled) {
              item.onClick();
              onClose();
            }
          }}
        >
          {item.icon && <MenuIcon>{item.icon}</MenuIcon>}
          <MenuLabel>{item.label}</MenuLabel>
        </MenuItem>
      ))}
    </MenuContainer>
  );
};

export default ContextMenu; 