// Этот файл гарантирует доступность глобальных функций
import React from 'react';

// Экспортируем функцию createSvgIcon
function ensureCreateSvgIcon() {
  // Проверяем доступность функции в глобальном контексте
  if (typeof window !== 'undefined') {
    // Переопределяем функцию createSvgIcon с использованием React
    window.createSvgIcon = function(Component, displayName) {
      if (typeof Component === 'string') {
        // Обработка строки URL
        const SvgIcon = React.forwardRef((props, ref) => {
          return React.createElement('img', {
            src: Component,
            alt: displayName || 'Icon',
            ref: ref,
            ...props
          });
        });
        
        SvgIcon.displayName = displayName || 'SvgIcon';
        return SvgIcon;
      }
      
      // Обработка React-компонента
      const SvgIcon = React.forwardRef((props, ref) => {
        if (!Component) return null;
        return React.createElement(Component, {
          ...props,
          ref: ref
        });
      });
      
      SvgIcon.displayName = displayName || (Component && Component.displayName) || 'SvgIcon';
      return SvgIcon;
    };
    
    console.log('createSvgIcon function installed (React version)');
  }
}

// Автоматически вызываем функцию при импорте
ensureCreateSvgIcon();

export default ensureCreateSvgIcon; 