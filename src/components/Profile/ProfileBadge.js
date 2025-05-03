import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Компонент для отображения бейджа/значка в профиле пользователя
 * @param {Object} props - Свойства компонента
 * @param {Object} props.badgeData - Данные значка (текст, эмодзи, позиция)
 * @param {Array|String} props.gradientColors - Цвета градиента или строка с цветом
 * @param {String} props.textColor - Цвет текста
 */
const ProfileBadge = ({ badgeData, gradientColors, textColor = '#ffffff' }) => {
  if (!badgeData || !badgeData.show) return null;
  
  
  const position = badgeData.position || { top: 10, right: 10 };
  
  
  let background;
  if (Array.isArray(gradientColors) && gradientColors.length >= 2) {
    background = `linear-gradient(45deg, ${gradientColors.join(', ')})`;
  } else {
    background = gradientColors || '#8e44ad';
  }
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: `${position.top}px`,
        right: `${position.right}px`,
        padding: '5px 10px',
        borderRadius: '12px',
        background,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(2px)',
        animation: 'glow 3s infinite alternate',
        '@keyframes glow': {
          '0%': { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' },
          '100%': { boxShadow: `0 2px 15px ${Array.isArray(gradientColors) ? gradientColors[0] : gradientColors}` }
        }
      }}
    >
      {badgeData.emoji && (
        <Typography 
          sx={{ 
            fontSize: '16px', 
            lineHeight: 1,
            filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))'
          }}
        >
          {badgeData.emoji}
        </Typography>
      )}
      
      {badgeData.text && (
        <Typography 
          sx={{ 
            fontSize: '14px', 
            fontWeight: 'bold',
            color: textColor,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          {badgeData.text}
        </Typography>
      )}
    </Box>
  );
};

export default ProfileBadge; 