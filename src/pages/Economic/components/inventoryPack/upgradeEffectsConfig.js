import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

// ===== АНИМАЦИИ =====
export const sparkleAnimation = keyframes`
  0%, 100% { 
    opacity: 0; 
    transform: scale(0) rotate(0deg); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1) rotate(180deg); 
  }
`;

export const starFloatAnimation = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(0px) rotate(0deg); 
  }
  25% { 
    opacity: 1; 
    transform: translateY(-10px) rotate(90deg); 
  }
  50% { 
    opacity: 0.8; 
    transform: translateY(-20px) rotate(180deg); 
  }
  75% { 
    opacity: 0.6; 
    transform: translateY(-10px) rotate(270deg); 
  }
  100% { 
    opacity: 0; 
    transform: translateY(0px) rotate(360deg); 
  }
`;

export const glowPulseAnimation = keyframes`
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.05); 
  }
`;

// ===== СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ =====
export const AnimatedSparkle = styled(Box)(({ color, delay, size }) => ({
  position: 'absolute',
  width: size || '4px',
  height: size || '4px',
  backgroundColor: color || '#FFD700',
  borderRadius: '50%',
  animation: `${sparkleAnimation} 2s ease-in-out infinite`,
  animationDelay: `${delay || 0}s`,
  boxShadow: `0 0 6px ${color || '#FFD700'}`,
}));

export const AnimatedStar = styled(StarIcon)(({ color, delay, size }) => ({
  position: 'absolute',
  fontSize: size || '12px',
  color: color || '#FFD700',
  animation: `${starFloatAnimation} 3s ease-in-out infinite`,
  animationDelay: `${delay || 0}s`,
  filter: `drop-shadow(0 0 4px ${color || '#FFD700'})`,
}));

export const GlowEffect = styled(Box)(({ color }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 'inherit',
  background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
  animation: `${glowPulseAnimation} 2s ease-in-out infinite`,
  pointerEvents: 'none',
}));

// ===== КОНФИГУРАЦИЯ ЭФФЕКТОВ =====
export const EFFECTS_CONFIG = {
  // Конфигурация искр
  sparkles: [
    { delay: 0, size: '3px', position: { top: '10%', left: '15%' } },
    { delay: 0.3, size: '2px', position: { top: '20%', right: '20%' } },
    { delay: 0.6, size: '4px', position: { bottom: '30%', left: '25%' } },
    { delay: 0.9, size: '3px', position: { bottom: '15%', right: '15%' } },
    { delay: 1.2, size: '2px', position: { top: '40%', left: '5%' } },
    { delay: 1.5, size: '3px', position: { top: '60%', right: '5%' } },
  ],
  
  // Конфигурация звездочек
  stars: [
    { delay: 0, size: '10px', position: { top: '5%', left: '10%' } },
    { delay: 1, size: '8px', position: { top: '25%', right: '10%' } },
    { delay: 2, size: '12px', position: { bottom: '20%', left: '10%' } },
    { delay: 1.5, size: '9px', position: { bottom: '5%', right: '20%' } },
    { delay: 0.5, size: '6px', position: { top: '50%', left: '5%' } },
    { delay: 2.5, size: '7px', position: { top: '70%', right: '5%' } },
  ],
  
  // Fallback цвета для разных типов предметов
  fallbackColors: {
    // По редкости
    rarity: {
      common: '#95a5a6',    // Серый
      rare: '#3498db',      // Синий
      epic: '#9b59b6',      // Фиолетовый
      legendary: '#f39c12'  // Оранжевый
    },
    
    // По типу предмета
    itemType: {
      sword: '#e74c3c',      // Красный для мечей
      shield: '#3498db',     // Синий для щитов
      armor: '#95a5a6',      // Серый для брони
      helmet: '#f39c12',     // Оранжевый для шлемов
      ring: '#9b59b6',       // Фиолетовый для колец
      necklace: '#f1c40f',   // Желтый для ожерелий
      boots: '#27ae60',      // Зеленый для ботинок
      gloves: '#e67e22',     // Оранжевый для перчаток
      wand: '#9b59b6',       // Фиолетовый для палочек
      staff: '#8e44ad',      // Темно-фиолетовый для посохов
      dagger: '#e74c3c',     // Красный для кинжалов
      bow: '#27ae60',        // Зеленый для луков
      arrow: '#f39c12',      // Оранжевый для стрел
      potion: '#e91e63',     // Розовый для зелий
      scroll: '#ff9800',     // Оранжевый для свитков
      gem: '#00bcd4',        // Голубой для камней
      crystal: '#9c27b0',    // Фиолетовый для кристаллов
      orb: '#3f51b5',        // Индиго для сфер
      amulet: '#ff5722',     // Красно-оранжевый для амулетов
      talisman: '#795548',   // Коричневый для талисманов
    }
  },
  
  // Настройки извлечения цвета
  colorExtraction: {
    sampleRate: 16,        // Каждый N-й пиксель (для производительности)
    alphaThreshold: 128,   // Минимальная прозрачность
    brightnessThreshold: {
      min: 20,             // Минимальная яркость (исключает черные пиксели)
      max: 240             // Максимальная яркость (исключает белые пиксели)
    },
    colorRounding: 10      // Округление цветов для группировки
  }
};

// ===== УТИЛИТЫ =====
export const extractDominantColor = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorCounts = {};
        const config = EFFECTS_CONFIG.colorExtraction;
        
        for (let i = 0; i < data.length; i += config.sampleRate) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Пропускаем прозрачные пиксели
          if (a < config.alphaThreshold) continue;
          
          // Пропускаем слишком светлые и темные пиксели
          if ((r > config.brightnessThreshold.max && g > config.brightnessThreshold.max && b > config.brightnessThreshold.max) || 
              (r < config.brightnessThreshold.min && g < config.brightnessThreshold.min && b < config.brightnessThreshold.min)) continue;
          
          // Округляем цвета для группировки
          const roundedR = Math.round(r / config.colorRounding) * config.colorRounding;
          const roundedG = Math.round(g / config.colorRounding) * config.colorRounding;
          const roundedB = Math.round(b / config.colorRounding) * config.colorRounding;
          
          const colorKey = `${roundedR},${roundedG},${roundedB}`;
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        
        // Находим самый частый цвет
        let maxCount = 0;
        let dominantColorKey = null;
        
        for (const [colorKey, count] of Object.entries(colorCounts)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColorKey = colorKey;
          }
        }
        
        if (dominantColorKey) {
          const [r, g, b] = dominantColorKey.split(',').map(Number);
          const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          resolve(hexColor);
        } else {
          resolve('#FFD700'); // Золотой по умолчанию
        }
        
      } catch (error) {
        console.warn('Не удалось извлечь цвет из изображения:', error);
        resolve('#FFD700');
      }
    };
    
    img.onerror = () => {
      console.warn('Не удалось загрузить изображение для извлечения цвета');
      resolve('#FFD700');
    };
    
    img.src = imageUrl;
  });
};

export const getFallbackColor = (item) => {
  const { fallbackColors } = EFFECTS_CONFIG;
  
  // Сначала пробуем по редкости
  if (item.rarity && fallbackColors.rarity[item.rarity]) {
    return fallbackColors.rarity[item.rarity];
  }
  
  // Затем по типу предмета
  const itemName = item.item_name.toLowerCase();
  for (const [type, color] of Object.entries(fallbackColors.itemType)) {
    if (itemName.includes(type)) {
      return color;
    }
  }
  
  return '#FFD700'; // Золотой по умолчанию
};

// ===== ХУК ДЛЯ ЭФФЕКТОВ =====
export const useUpgradeEffects = (item) => {
  const [dominantColor, setDominantColor] = useState('#FFD700');
  
  useEffect(() => {
    if (item && item.upgrade_level === 1 && item.image_url) {
      extractDominantColor(item.image_url)
        .then(color => setDominantColor(color))
        .catch(() => setDominantColor(getFallbackColor(item)));
    }
  }, [item]);

  return {
    dominantColor,
    isUpgraded: item && item.upgrade_level === 1,
    effectsConfig: EFFECTS_CONFIG
  };
}; 