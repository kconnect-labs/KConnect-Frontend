import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';

/**
 * Улучшенный просмотрщик изображений для мессенджера
 */
const SimpleImageViewerMes = ({ src, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Закрытие на Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  // Обработчики для зума и поворота
  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const rotateLeft = () => setRotation(prev => prev - 90);
  const rotateRight = () => setRotation(prev => prev + 90);
  
  // Обработчики для перетаскивания изображения
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Обработчики для сенсорных экранов
  const handleTouchStart = (e) => {
    if (scale <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Сбрасываем зум и вращение по двойному клику/тапу
  const handleDoubleClick = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <div 
      className="simple-image-viewer-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <img 
        src={src} 
        alt="Просмотр" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '90%', 
          maxHeight: '90%', 
          objectFit: 'contain',
          transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
          cursor: isDragging ? 'grabbing' : 'grab'
        }} 
      />
      
      {/* Кнопки управления */}
      <div 
        className="image-viewer-controls"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: '20px',
          display: 'flex',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.6)',
          padding: '8px',
          borderRadius: '24px',
          backdropFilter: 'blur(8px)'
        }}
      >
        <IconButton onClick={zoomIn} size="small" sx={{ color: 'white' }}>
          <ZoomInIcon />
        </IconButton>
        <IconButton onClick={zoomOut} size="small" sx={{ color: 'white' }}>
          <ZoomOutIcon />
        </IconButton>
        <IconButton onClick={rotateLeft} size="small" sx={{ color: 'white' }}>
          <RotateLeftIcon />
        </IconButton>
        <IconButton onClick={rotateRight} size="small" sx={{ color: 'white' }}>
          <RotateRightIcon />
        </IconButton>
      </div>
      
      {/* Кнопка закрытия */}
      <IconButton
        sx={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
};

export default SimpleImageViewerMes; 