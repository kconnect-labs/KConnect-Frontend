import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Цвета для мастей
const suitColors = {
  hearts: '#ff5252',    // красный
  diamonds: '#ff5252',  // красный
  clubs: '#424242',     // черный
  spades: '#424242'     // черный
};

// Символы мастей
const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

// Стилизованный компонент карты
const CardContainer = styled(Box)(({ theme, suits, hidden }) => ({
  width: '120px',
  height: '180px',
  borderRadius: '10px',
  background: hidden ? '#7986cb' : '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '10px',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s ease',
  cursor: 'default',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
  }
}));

// Стилизованный символ масти
const SuitSymbol = styled(Typography)(({ color }) => ({
  fontSize: '36px',
  color: color,
  lineHeight: 1
}));

// Стилизованный ранг карты
const Rank = styled(Typography)(({ color }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
  color: color,
  lineHeight: 1
}));

// Скрытая часть карты (рубашка)
const CardBack = styled(Box)({
  width: '100%',
  height: '100%',
  background: 'repeating-linear-gradient(45deg, #5c6bc0, #5c6bc0 10px, #3f51b5 10px, #3f51b5 20px)',
  borderRadius: '8px',
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const PlayingCard = ({ rank, suit, hidden = false }) => {
  // Если карта скрыта, показываем рубашку
  if (hidden) {
    return (
      <CardContainer hidden={true}>
        <CardBack>
          <Typography variant="h4" color="white" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
            21
          </Typography>
        </CardBack>
      </CardContainer>
    );
  }

  // Получаем цвет масти
  const color = suitColors[suit] || '#424242';
  // Получаем символ масти
  const suitSymbol = suitSymbols[suit] || '?';

  return (
    <CardContainer>
      <Box sx={{ alignSelf: 'flex-start' }}>
        <Rank color={color}>{rank}</Rank>
        <SuitSymbol color={color}>{suitSymbol}</SuitSymbol>
      </Box>
      
      <Box sx={{ alignSelf: 'center', transform: 'scale(2)' }}>
        <SuitSymbol color={color}>{suitSymbol}</SuitSymbol>
      </Box>
      
      <Box sx={{ alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>
        <Rank color={color}>{rank}</Rank>
        <SuitSymbol color={color}>{suitSymbol}</SuitSymbol>
      </Box>
    </CardContainer>
  );
};

export default PlayingCard; 