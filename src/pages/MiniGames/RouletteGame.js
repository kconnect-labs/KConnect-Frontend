/*
BACKEND API CODE TO IMPLEMENT:

// POST /api/minigames/roulette/spin
// Body: { betAmount: number }
// Response: { 
//   winningIndex: number,  // индекс выигранного элемента в массиве items
//   items: [               // массив всех элементов рулетки
//     { 
//       id: number,
//       type: 'balls' | 'noballs',
//       text: string,
//       image: string,
//       multiplier?: number  // для balls - множитель ставки
//     }
//   ],
//   totalWin: number,      // общая сумма выигрыша
//   balance: number        // новый баланс пользователя
// }

Example response:
{
  "winningIndex": 15,
  "items": [
    { "id": 1, "type": "balls", "text": "+200₽", "image": "/static/icons/balls.png", "multiplier": 2 },
    { "id": 2, "type": "noballs", "text": "Без выигрыша", "image": "/static/icons/noballs.png" },
    // ... 46 more items (total 48 items for 2 full circles)
  ],
  "totalWin": 200,
  "balance": 1500
}
*/

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Slider,
  Paper,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CasinoIcon from '@mui/icons-material/Casino';
import Confetti from 'react-confetti';
import RoulettePro from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';

// Глобальные стили для рулетки
const GlobalRouletteStyles = styled('div')`
  .roulette-pro-regular-design-prize-item-horizontal {
    background: url(http://k-connect.ru/static/img/minigames/item.png) !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    position: relative !important;
    overflow: hidden !important;
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
    }
    
    & > * {
      position: relative;
      z-index: 2;
    }
  }
  
  .roulette-pro-regular-prize-item-wrapper {
    background: transparent !important;
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
    z-index: 2 !important;
  }
  
  .roulette-pro-regular-prize-item-image {
    margin: auto;
    margin-top: 20px;
    max-width: 75% !important;
    max-height: 75% !important;
    width: 75% !important;
    height: 75% !important;
    object-fit: contain !important;
    display: block !important;
    position: relative !important;
    z-index: 3 !important;
  }
  
  .roulette-pro-prize-list.horizontal {
    gap: 4px !important;
  }
`;

const ICONS = {
  balls: 'http://k-connect.ru/static/icons/balls.png',
  noballs: 'http://k-connect.ru/static/icons/noballs.png',
};

const bounce = keyframes`
  0% { transform: scale(1); }
  20% { transform: scale(1.18, 0.92); }
  40% { transform: scale(0.95, 1.08); }
  60% { transform: scale(1.08, 0.97); }
  80% { transform: scale(0.98, 1.03); }
  100% { transform: scale(1); }
`;

const GameContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 900,
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 8,
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
}));

const ReelWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 170,
  overflow: 'hidden',
  margin: '0 auto',
  background: alpha(theme.palette.background.paper, 0.7),
  borderRadius: 16,
  border: `2.5px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.10)}`,
}));

const Reel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  willChange: 'transform',
}));

const Item = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iscenter' && prop !== 'bounce',
})(({ theme, iscenter, bounce }) => ({
  width: 120,
  minWidth: 120,
  height: 140,
  margin: '0 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 14,
  background: iscenter ? alpha(theme.palette.primary.main, 0.13) : 'transparent',
  boxShadow: iscenter
    ? `0 0 0 3px ${theme.palette.primary.main}, 0 0 16px 2px ${alpha(theme.palette.primary.main, 0.18)}, 0 0 32px 8px ${alpha(theme.palette.primary.main, 0.13)}`
    : 'none',
  transition: 'box-shadow 0.2s, background 0.2s',
  position: 'relative',
  zIndex: iscenter ? 2 : 1,
  animation: bounce ? `${bounce} 0.7s cubic-bezier(.36,1.56,.64,1) 1` : 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  '&::after': {
    content: '""',
    position: 'absolute',
    right: -12,
    top: '10%',
    height: '80%',
    width: 1,
    background: alpha(theme.palette.divider, 0.2),
  }
}));

const CenterLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: `translateX(-50%)`,
  width: ITEM_WIDTH,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  zIndex: 10,
  '&::after': {
    content: '""',
    display: 'block',
    width: 6,
    height: '100%',
    margin: '0 auto',
    background: `linear-gradient(180deg, ${theme.palette.primary.main} 60%, transparent 100%)`,
    borderRadius: 3,
    boxShadow: `0 0 18px 4px ${alpha(theme.palette.primary.main, 0.35)}`,
  },
}));

const BetAmount = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const PrizeDisplay = styled(Box)(({ theme, win }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 8,
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: win ? '2px solid #16a34a' : '2px solid #dc2626',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '1.2rem',
  boxShadow: win ? '0 0 16px 2px rgba(22, 163, 74, 0.3)' : '0 0 16px 2px rgba(220, 38, 38, 0.3)',
}));

const ITEM_WIDTH = 144;
const REEL_LENGTH = 35;
const VISIBLE_ITEMS = 7; // Сколько реально видно ячеек на экране
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2); // Центр всегда по центру ячейки
const LOOP_COUNT = 8;
const FIXED_START_ITEMS = 8;
const WIN_OFFSET_FROM_START = FIXED_START_ITEMS + CENTER_INDEX;

// Константы для рулетки
const TOTAL_ITEMS = 100; // Больше элементов для бесконечной ленты
const ITEMS_PER_CIRCLE = 24; // Элементов в одном круге
const SPIN_DURATION = 4000; // Фиксированная длительность (4 секунды)

function getLongReelData(betAmount) {
  // 16 balls, 32 noballs, перемешать
  const arr = [
    ...Array(16).fill({ type: 'balls', text: `+${betAmount * 2}₽` }),
    ...Array(32).fill({ type: 'noballs', text: 'Без выигрыша' }),
  ];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map(item => ({
    image: ICONS[item.type],
    text: item.text,
    type: item.type,
  }));
}

const renderPrize = (prize, idx, { isActive }) => (
  <Box
    key={idx}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      minWidth: 100,
      height: 120,
      backgroundImage: 'url(http://k-connect.ru/static/img/minigames/item.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backdropFilter: 'blur(20px)',
      borderRadius: 8,
      border: isActive 
        ? '3px solid #D0BCFF' 
        : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isActive 
        ? '0 0 20px 4px rgba(208, 188, 255, 0.4)' 
        : '0 2px 8px rgba(0,0,0,0.1)',
      p: 1.5,
      m: '0 2px',
      transition: 'all 0.3s ease',
      position: 'relative',
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      overflow: 'hidden',
    }}
  >
    {/* Overlay для затемнения фона */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 8,
      }}
    />
    
    {/* Основной контент */}
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        component="img"
        src={prize.type === 'balls' ? ICONS.balls : ICONS.noballs}
        alt={prize.type}
        sx={{ 
          width: 24, 
          height: 24, 
          mb: 1,
          opacity: 0.8,
          filter: prize.type === 'noballs' 
            ? 'grayscale(1)' 
            : 'none',
          transition: 'all 0.3s ease',
        }}
      />
      <Typography
        sx={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          px: 0.5,
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        {prize.text}
      </Typography>
    </Box>
    
    {isActive && (
      <Box
        sx={{
          position: 'absolute',
          top: -3,
          left: -3,
          right: -3,
          bottom: -3,
          border: '3px solid #f59e0b',
          borderRadius: 8,
          pointerEvents: 'none',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.7, transform: 'scale(1.02)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
        }}
      />
    )}
  </Box>
);

// Функция для создания данных рулетки (временная, до подключения бэка)
function generateRouletteData(betAmount) {
  const baseItems = [];
  
  // Создаем базовый набор из 20 элементов
  for (let i = 0; i < 20; i++) {
    // Примерно 1/3 выигрышных элементов
    const isWin = Math.random() < 0.33;
    
    if (isWin) {
      const multiplier = Math.random() < 0.7 ? 2 : (Math.random() < 0.8 ? 3 : 5);
      baseItems.push({
        id: i + 1,
        type: 'balls',
        text: `+${betAmount * multiplier}₽`,
        image: ICONS.balls,
        multiplier
      });
    } else {
      baseItems.push({
        id: i + 1,
        type: 'noballs',
        text: 'Без выигрыша',
        image: ICONS.noballs
      });
    }
  }
  
  // Дублируем элементы для создания бесконечной ленты
  const items = [];
  for (let cycle = 0; cycle < 5; cycle++) {
    baseItems.forEach((item, index) => {
      items.push({
        ...item,
        id: cycle * baseItems.length + index + 1,
      });
    });
  }
  
  return items;
}

const RouletteGame = () => {
  const theme = useTheme();
  const [betAmount, setBetAmount] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [reelData, setReelData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameResult, setGameResult] = useState(null);

  // Загружаем начальные данные при монтировании компонента
  useEffect(() => {
    updateRouletteData(betAmount);
  }, []);

  const handleSpin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setPrize(null);
    setShowConfetti(false);
    setGameResult(null); // Очищаем предыдущий результат
    
    try {
      // API вызов к бэкенду
      const response = await fetch('/api/minigames/roulette/spin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ betAmount: betAmount })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Произошла ошибка при игре');
      }
      
      // Обновляем данные рулетки новыми элементами с бэка
      setReelData(data.items);
      
      // Небольшая задержка, чтобы данные успели обновиться
      setTimeout(() => {
        // Сохраняем результат игры
        setGameResult(data);
        // Устанавливаем правильный индекс выигрышного элемента
        setPrizeIndex(data.winningIndex);
      }, 100);
      
    } catch (error) {
      console.error('Ошибка при запросе к серверу:', error);
      setIsSpinning(false);
      // Показать сообщение об ошибке пользователю
      setPrize({
        type: 'error',
        amount: 0,
        text: error.message || 'Произошла ошибка сервера'
      });
    }
  };

  const handleSpinComplete = () => {
    if (!gameResult) {
      setIsSpinning(false);
      return;
    }
    
    const { winningItem, totalWin, subscriptionReward } = gameResult;
    
    // Используем данные с бэкенда напрямую
    let prizeData = {
      type: winningItem.type,
      amount: totalWin,
      text: winningItem.text
    };
    
    // Проверяем, есть ли выигрыш подписки
    if (subscriptionReward) {
      prizeData.isSubscription = true;
      prizeData.subscriptionType = subscriptionReward.type;
      prizeData.subscriptionDays = subscriptionReward.days;
    }
    
    setPrize(prizeData);
    
    // Показываем конфетти если есть выигрыш (баллы или подписка)
    if (totalWin > 0 || subscriptionReward) {
      setShowConfetti(true);
      // Убираем конфетти через 3 секунды
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    setIsSpinning(false);
  };

  // Функция для обновления данных рулетки при изменении ставки
  const updateRouletteData = async (newBetAmount) => {
    if (isSpinning) return; // Не обновляем во время игры
    
    try {
      const response = await fetch('/api/minigames/roulette/preview', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ betAmount: newBetAmount })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReelData(data.items);
        }
      } else {
        // В случае ошибки используем временную генерацию
        setReelData(generateRouletteData(newBetAmount));
      }
    } catch (error) {
      console.error('Ошибка при получении превью:', error);
      // В случае ошибки используем временную генерацию
      setReelData(generateRouletteData(newBetAmount));
    } finally {
      setIsLoading(false);
    }
  };

  // Добавляем таймер безопасности для завершения анимации
  useEffect(() => {
    if (isSpinning && gameResult) {
      const timer = setTimeout(() => {
        handleSpinComplete();
      }, SPIN_DURATION + 500); // Запас времени на завершение анимации

      return () => clearTimeout(timer);
    }
  }, [isSpinning, gameResult]);

  return (
    <GlobalRouletteStyles>
      <GameContainer sx={{ mt: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800, letterSpacing: 1, color: '#ffffff' }}>
          Рулетка удачи
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress sx={{ color: '#D0BCFF' }} />
            <Typography sx={{ ml: 2, color: '#ffffff' }}>Загрузка...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 900, mx: 'auto', my: 4 }}>
              <RoulettePro
                prizes={reelData}
                prizeIndex={prizeIndex}
                renderPrize={renderPrize}
                onPrizeDefined={handleSpinComplete}
                spinning={isSpinning}
                start={isSpinning}
                options={{
                  stopOnPrize: true,
                  prizeSlot: 3, // центральная позиция
                  duration: SPIN_DURATION, // Фиксированная длительность
                  easing: 'cubic-bezier(0.23, 1, 0.32, 1)', // Плавное замедление
                  spinCount: 4, // 4 оборота для более плавной анимации
                  withoutAnimation: false,
                  stopAtCenter: true,
                  infinite: false, // Убираем бесконечность для точной остановки
                }}
                style={{ 
                  height: 140,
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
              
              {/* Центральный указатель */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 4,
                  height: '70%',
                  background: '#D0BCFF',
                  borderRadius: 8,
                  boxShadow: '0 0 10px rgba(208, 188, 255, 0.5)',
                  zIndex: 10,
                  pointerEvents: 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '10px solid #D0BCFF',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '10px solid #D0BCFF',
                  },
                }}
              />
            </Box>

            <BetAmount>
              <Typography sx={{ fontWeight: 600, minWidth: 60, color: '#ffffff' }}>Ставка:</Typography>
              <Slider
                value={betAmount}
                onChange={(e, v) => {
                  setBetAmount(v);
                  updateRouletteData(v);
                }}
                min={100}
                max={50000}
                step={100}
                valueLabelDisplay="auto"
                valueLabelFormat={v => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <img src="http://k-connect.ru/static/icons/KBalls.svg" width="12" height="12" alt="" />
                    {v}
                  </Box>
                )}
                sx={{ 
                  flex: 1, 
                  mx: 3,
                  '& .MuiSlider-thumb': {
                    width: 20,
                    height: 20,
                    backgroundColor: '#D0BCFF',
                  },
                  '& .MuiSlider-track': {
                    height: 4,
                    backgroundColor: '#D0BCFF',
                  },
                  '& .MuiSlider-rail': {
                    height: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#D0BCFF',
                    color: '#000000',
                  },
                }}
                disabled={isSpinning || isLoading}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 80, justifyContent: 'flex-end' }}>
                <img src="http://k-connect.ru/static/icons/KBalls.svg" width="16" height="16" alt="" />
                <Typography sx={{ fontWeight: 700, color: '#ffffff' }}>
                  {betAmount}
                </Typography>
              </Box>
            </BetAmount>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="medium"
                onClick={handleSpin}
                disabled={isSpinning || isLoading || reelData.length === 0}
                startIcon={isSpinning ? <CircularProgress size={18} color="inherit" /> : <CasinoIcon />}
                sx={{
                  minWidth: 180,
                  height: 44,
                  fontSize: '1rem',
                  borderRadius: 8,
                  fontWeight: 600,
                  background: isSpinning 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : '#D0BCFF',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: isSpinning ? '#ffffff' : '#000000',
                  boxShadow: '0 4px 12px rgba(208, 188, 255, 0.3)',
                  letterSpacing: 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: isSpinning ? 'none' : 'translateY(-2px)',
                    background: isSpinning ? 'rgba(255, 255, 255, 0.1)' : '#C4A7FF',
                    boxShadow: isSpinning ? undefined : '0 6px 16px rgba(196, 167, 255, 0.4)',
                  },
                  '&:active': {
                    transform: isSpinning ? 'none' : 'translateY(0) scale(0.98)',
                  },
                }}
              >
                {isSpinning ? 'Крутится...' : 'Крутить'}
              </Button>
            </Box>

            {prize && (
              <PrizeDisplay win={prize.amount > 0 || prize.isSubscription}>
                {(prize.amount > 0 || prize.isSubscription) ? (
                  prize.isSubscription ? (
                    <>
                      🎉 Поздравляем! Вы выиграли подписку <strong>{prize.subscriptionType.toUpperCase()} на {prize.subscriptionDays} дня</strong> 🎉
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      🎉 Поздравляем! Вы выиграли 
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <img src="http://k-connect.ru/static/icons/KBalls.svg" width="20" height="20" alt="" />
                        <strong>{prize.amount}</strong>
                      </Box>
                      🎉
                    </Box>
                  )
                ) : prize.type === 'error' ? (
                  <>
                    ❌ Ошибка: {prize.text}
                  </>
                ) : (
                  <>
                    😔 Не повезло... Попробуйте еще раз!
                  </>
                )}
              </PrizeDisplay>
            )}
          </>
        )}

        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.25}
            colors={['#D0BCFF', '#C4A7FF', '#B794F6', '#9F7AEA', '#805AD5', '#6B46C1', '#553C9A']}
          />
        )}
      </GameContainer>
    </GlobalRouletteStyles>
  );
};

export default RouletteGame; 