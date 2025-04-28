import React from 'react';
import { ContextMenu, useContextMenu } from './index';
const ContextMenuExample = () => {
  const { contextMenuState, handleContextMenu, closeContextMenu } = useContextMenu();
  const menuItems = [
    {
      id: 'edit',
      label: 'Редактировать',
      icon: '✏️',
      onClick: () => console.log('Нажата кнопка Редактировать'),
    },
    {
      id: 'delete',
      label: 'Удалить',
      icon: '🗑️',
      onClick: () => console.log('Нажата кнопка Удалить'),
    },
    {
      id: 'share',
      label: 'Поделиться',
      icon: '↗️',
      onClick: () => console.log('Нажата кнопка Поделиться'),
    },
    {
      id: 'disabled',
      label: 'Недоступная опция',
      icon: '🚫',
      onClick: () => console.log('Эта функция не должна вызываться'),
      disabled: true,
    },
  ];
  return (
    <div>
      <div 
        style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          cursor: 'context-menu'
        }}
        onContextMenu={(e) => handleContextMenu(e, { type: 'example' })}
      >
        Нажмите правую кнопку мыши, чтобы открыть контекстное меню
      </div>
      <ContextMenu 
        items={menuItems}
        x={contextMenuState.x}
        y={contextMenuState.y}
        show={contextMenuState.show}
        onClose={closeContextMenu}
      />
    </div>
  );
};
export default ContextMenuExample; 