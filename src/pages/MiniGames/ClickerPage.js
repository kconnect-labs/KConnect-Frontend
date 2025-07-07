import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  alpha,
  useTheme,
  CircularProgress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ClickerBottomNavigation from '../../components/ClickerBottomNavigation';
import { toast } from 'react-hot-toast';


import TouchAppIcon from '@mui/icons-material/TouchApp';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SpeedIcon from '@mui/icons-material/Speed';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CategoryIcon from '@mui/icons-material/Category';
import TimelineIcon from '@mui/icons-material/Timeline';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const ClickButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: 200,
  borderRadius: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: theme.palette.primary.main,
  border: `3px solid ${alpha(theme.palette.primary.light, 0.3)}`,
  boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.25)}, 
              0 20px 60px ${alpha(theme.palette.primary.dark, 0.15)},
              inset 0 1px 0 ${alpha('#ffffff', 0.1)}`,
  transition: 'all 0.15s ease-out',
  overflow: 'hidden',
  position: 'relative',
  color: '#ffffff',
  fontWeight: 600,
  
  '&:hover': {
    background: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: `0 15px 40px ${alpha(theme.palette.primary.main, 0.35)}, 
                0 25px 70px ${alpha(theme.palette.primary.dark, 0.2)},
                inset 0 1px 0 ${alpha('#ffffff', 0.15)}`,
  },
  
  '&:active': {
    transform: 'translateY(1px) scale(0.98)',
    boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.4)}, 
                inset 0 2px 4px ${alpha('#000000', 0.1)}`,
    transition: 'all 0.05s ease-out',
  },
  
  // Ripple effect on click
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    background: alpha('#ffffff', 0.3),
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
    opacity: 0,
    pointerEvents: 'none',
  },
  
  '&.clicked::after': {
    width: '300px',
    height: '300px',
    opacity: 1,
    transition: 'width 0.4s ease, height 0.4s ease, opacity 0.4s ease',
  },
  
  [theme.breakpoints.down('sm')]: {
    height: 160,
    borderRadius: 20,
  },
}));

const BalanceCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.95) 
    : alpha(theme.palette.grey[50], 0.95),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}, 
              0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: theme.palette.primary.main,
    borderRadius: '20px 20px 0 0',
  },
  
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.15)}, 
                0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
    '&::before': {
      height: 6,
    }
  }
}));

const UpgradeCard = styled(Card)(({ theme, disabled }) => ({
  borderRadius: 18,
  background: disabled 
    ? theme.palette.mode === 'dark' 
      ? alpha(theme.palette.grey[900], 0.6) 
      : alpha(theme.palette.grey[300], 0.6)
    : theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.95) 
      : alpha(theme.palette.grey[50], 0.95),
  backdropFilter: 'blur(16px)',
  border: disabled 
    ? `1px solid ${alpha(theme.palette.divider, 0.3)}` 
    : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: disabled 
    ? `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`
    : `0 6px 20px ${alpha(theme.palette.common.black, 0.1)}, 
       0 2px 6px ${alpha(theme.palette.common.black, 0.05)}`,
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  position: 'relative',
  opacity: disabled ? 0.6 : 1,
  overflow: 'hidden',
  
  '&:hover': {
    transform: disabled ? 'none' : 'translateY(-2px)',
    boxShadow: disabled 
      ? `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`
      : `0 10px 28px ${alpha(theme.palette.common.black, 0.15)}, 
         0 4px 10px ${alpha(theme.palette.common.black, 0.08)}`,
    '&::after': {
      opacity: disabled ? 0 : 1,
    }
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: disabled ? 'transparent' : theme.palette.primary.main,
    borderRadius: '18px 18px 0 0',
    opacity: 0,
    transition: 'all 0.3s ease',
  }
}));


const formatCompactNumber = (number) => {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(number % 1000 < 100 ? 0 : 1) + 'к';
  } else {
    return (number / 1000000).toFixed(number % 1000000 < 100000 ? 1 : 2) + 'М';
  }
};

const ClickerPage = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeSection, setActiveSection] = useState('click'); 
  
  
  const [balance, setBalance] = useState(0);
  const [clickPower, setClickPower] = useState(0.001);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [upgrades, setUpgrades] = useState([]);
  const [minWithdrawal, setMinWithdrawal] = useState(10);
  const [userPoints, setUserPoints] = useState(0);
  const [autoClickerPaused, setAutoClickerPaused] = useState(false);
  
  
  const pendingClicksRef = useRef(0);
  const batchTimerRef = useRef(null);
  const lastClickTimeRef = useRef(Date.now());
  const [isSendingBatch, setIsSendingBatch] = useState(false);
  
  
  const [lastAutoClick, setLastAutoClick] = useState(Date.now());
  const autoClickIntervalRef = useRef(null);
  
  
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [clickEffects, setClickEffects] = useState([]);
  
  
  const touchStartTimeRef = useRef(0);
  const [touchActive, setTouchActive] = useState(false);
  const rapidClickIntervalRef = useRef(null);
  const [rapidClicksEnabled, setRapidClicksEnabled] = useState(false);
  const handleClickRef = useRef(null); // Ref для handleClick
  
  
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  
  
  
  const isInitialRender = useRef(true);
  
  
  // ДОБАВИТЬ:
  // Состояние для лимита кликов
  const [clicksLimitReached, setClicksLimitReached] = useState(false);
    
  useEffect(() => {
    fetchBalance();
    fetchLeaderboard();
    
    
    const intervalId = setInterval(() => {
      if (pendingClicksRef.current > 0) {
        sendBatchedClicks();
      }
    }, 2000); // Увеличили интервал с 1000 до 2000мс
    
    return () => {
      clearInterval(intervalId);
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current);
      }
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
    };
  }, []);
  
  
  useEffect(() => {
    
    batchTimerRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTimeRef.current;
      
      
      if (timeSinceLastClick >= 1500 && pendingClicksRef.current > 0 && !isSendingBatch) {
        console.log(`Прошло ${timeSinceLastClick}мс с последнего клика, отправляем ${pendingClicksRef.current} кликов`);
        sendBatchedClicks();
      }
    }, 500); // Увеличили интервал с 300 до 500мс
    
    return () => {
      if (batchTimerRef.current) {
        clearInterval(batchTimerRef.current);
      }
    };
  }, [isSendingBatch]);
  
  
  useEffect(() => {
    
    const intervalHandler = () => {
      // Проверяем лимит кликов
      if (clicksLimitReached) {
        return;
      }
      
      const now = Date.now();
      const secondsElapsed = (now - lastAutoClick) / 1000;
      const timeSinceLastManualClick = now - lastClickTimeRef.current;
      
      
      
      if (timeSinceLastManualClick < 2000) {
        
        setAutoClickerPaused(true);
        return;
      }
      
      
      if (autoClickerPaused) {
        setAutoClickerPaused(false);
      }
      
      if (secondsElapsed >= 1) {
        // Встроенная логика автоклика
        const autoClickUpgrade = upgrades.find(u => u.type === 'auto_click');
        if (autoClickUpgrade && autoClickUpgrade.level > 0) {
          // Выполняем автоклик напрямую
          const currentTime = Math.floor(Date.now() / 1000);
          const currentMinute = Math.floor(currentTime / 60);
          const challenge = `react_clicker_${user?.id}_${currentMinute}`;
          
          axios.post('/api/clicker/get-token', {
            action: 'auto_click',
            challenge: challenge
          }).then(tokenResponse => {
            if (tokenResponse.data.success) {
              const { token, timestamp } = tokenResponse.data;
              return axios.post('/api/clicker/auto-click', { 
                seconds: secondsElapsed,
                auto_click_token: token,
                timestamp: timestamp
              });
            }
          }).then(response => {
            if (response?.data.success) {
              setBalance(response.data.balance);
              setTotalEarned(prev => prev + response.data.earned);
              // Проверяем лимит
              if (response.data.total_clicks >= response.data.clicks_limit) {
                setClicksLimitReached(true);
              }
            }
          }).catch(error => {
            if (error.response?.data?.message?.includes('лимита')) {
              setClicksLimitReached(true);
            } else if (error.response?.status === 429 || error.response?.status === 403) {
              console.warn('Автоклик временно недоступен:', error.response.data.message);
            }
          });
        }
        setLastAutoClick(now);
      }
    };
    
    const autoClickUpgrade = upgrades.find(u => u.type === 'auto_click');
    
    
    if (autoClickIntervalRef.current) {
      clearInterval(autoClickIntervalRef.current);
      autoClickIntervalRef.current = null;
    }
    
    
    if (autoClickUpgrade && autoClickUpgrade.level > 0) {
      
      autoClickIntervalRef.current = setInterval(intervalHandler, 1000);
    }
    
    return () => {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current);
      }
    };
  }, [lastAutoClick, autoClickerPaused, upgrades, user?.id, clicksLimitReached]);
  
  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.get('/api/clicker/balance');
      console.log('Получены данные баланса:', response.data);
      
      
      setBalance(response.data.balance);
      setClickPower(response.data.click_power);
      setTotalEarned(response.data.total_earned);
      setTotalWithdrawn(response.data.total_withdrawn);
      setUpgrades(response.data.upgrades);
      setMinWithdrawal(response.data.min_withdrawal);
      setUserPoints(response.data.user_points || 0);
      
      // Проверяем лимит кликов при загрузке
      if (response.data.total_clicks >= 100000) {
        setClicksLimitReached(true);
      }
      
      
      if (response.data.upgrades && response.data.upgrades.length > 0) {
        console.log('Загружены улучшения:', response.data.upgrades);
        
        
        const clickPowerUpgrade = response.data.upgrades.find(u => u.type === 'click_power');
        if (clickPowerUpgrade) {
          console.log('Применяем улучшение мощности клика:', clickPowerUpgrade);
          setClickPower(clickPowerUpgrade.power);
        }
      } else {
        console.warn('Улучшения не загружены или пусты');
      }
    } catch (error) {
      console.error('Error fetching clicker balance:', error);
    }
  }, []);
  
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLeaderboardLoading(true);
      const response = await axios.get('/api/clicker/leaderboard');
      setLeaderboardData(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching clicker leaderboard:', error);
      toast.error('Не удалось загрузить таблицу лидеров');
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);
  
  
  const sendBatchedClicks = useCallback(async () => {
    if (pendingClicksRef.current === 0 || isSendingBatch || clicksLimitReached) return;
    setIsSendingBatch(true);
    const clicksToSend = pendingClicksRef.current;
    pendingClicksRef.current = 0;
    try {
      if (!user?.id) return;
      const currentTime = Math.floor(Date.now() / 1000);
      const currentMinute = Math.floor(currentTime / 60);
      const challenge = `react_clicker_${user.id}_${currentMinute}`;
      const tokenResponse = await axios.post('/api/clicker/get-token', {
        action: 'click',
        challenge: challenge
      });
      if (!tokenResponse.data.success) return;
      const { token, timestamp } = tokenResponse.data;
      const response = await axios.post('/api/clicker/click', { 
        clicks: clicksToSend,
        click_token: token,
        timestamp: timestamp
      });
      if (response.data.success) {
        setBalance(response.data.balance);
        setTotalEarned(prev => prev + response.data.earned);
        // Проверяем лимит
        if (response.data.total_clicks >= response.data.clicks_limit) {
          setClicksLimitReached(true);
        }
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('лимита')) {
        setClicksLimitReached(true);
        toast.error(error.response.data.message);
      }
    } finally {
      setIsSendingBatch(false);
    }
  }, [user?.id, isSendingBatch, clicksLimitReached]);
  

  
  

  
  
  // Touch handlers - объявляем вне useEffect
  const touchStartHandler = useCallback((e) => {
      e.preventDefault();
      touchStartTimeRef.current = Date.now();
      setTouchActive(true);
      
    if (handleClickRef.current) {
      handleClickRef.current();
    }
      
      if (rapidClicksEnabled) {
      if (rapidClickIntervalRef.current) {
        clearInterval(rapidClickIntervalRef.current);
        rapidClickIntervalRef.current = null;
      }
      
        rapidClickIntervalRef.current = setInterval(() => {
        if (handleClickRef.current) {
          handleClickRef.current();
      }
      }, 150); // Увеличили интервал с 100 до 150мс
    }
  }, [rapidClicksEnabled]);
    
  const touchEndHandler = useCallback((e) => {
      e.preventDefault();
      setTouchActive(false);
      if (rapidClickIntervalRef.current) {
        clearInterval(rapidClickIntervalRef.current);
        rapidClickIntervalRef.current = null;
      }
  }, []);

  useEffect(() => {
    const buttonElement = document.querySelector('.click-button');
    if (!buttonElement) return;
    
    buttonElement.addEventListener('touchstart', touchStartHandler, { passive: false });
    buttonElement.addEventListener('touchend', touchEndHandler, { passive: false });
    buttonElement.addEventListener('touchcancel', touchEndHandler, { passive: false });
    
    return () => {
      buttonElement.removeEventListener('touchstart', touchStartHandler);
      buttonElement.removeEventListener('touchend', touchEndHandler);
      buttonElement.removeEventListener('touchcancel', touchEndHandler);
      if (rapidClickIntervalRef.current) {
        clearInterval(rapidClickIntervalRef.current);
        rapidClickIntervalRef.current = null;
      }
    };
  }, [touchStartHandler, touchEndHandler]);
  
  

  
  const handleAutoClick = useCallback(async (seconds) => {
    if (clicksLimitReached) return;
    const autoClickUpgrade = upgrades.find(u => u.type === 'auto_click');
    if (!autoClickUpgrade || autoClickUpgrade.level === 0) return;
    try {
      if (!user?.id) return;
      const currentTime = Math.floor(Date.now() / 1000);
      const currentMinute = Math.floor(currentTime / 60);
      const challenge = `react_clicker_${user.id}_${currentMinute}`;
      const tokenResponse = await axios.post('/api/clicker/get-token', {
        action: 'auto_click',
        challenge: challenge
      });
      if (!tokenResponse.data.success) return;
      const { token, timestamp } = tokenResponse.data;
      const response = await axios.post('/api/clicker/auto-click', { 
        seconds,
        auto_click_token: token,
        timestamp: timestamp
      });
      if (response.data.success) {
        setBalance(response.data.balance);
        setTotalEarned(prev => prev + response.data.earned);
        if (response.data.total_clicks >= response.data.clicks_limit) {
          setClicksLimitReached(true);
        }
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('лимита')) {
        setClicksLimitReached(true);
        toast.error(error.response.data.message);
      }
    }
  }, [upgrades, user?.id, clicksLimitReached]);
  
  const handleBuyUpgrade = useCallback(async (upgradeType) => {
    if (clicksLimitReached) {
      toast.error('Вы достигли лимита кликов, улучшения недоступны');
      return;
    }
    try {
      const response = await axios.post('/api/clicker/buy-upgrade', { 
        upgrade_type: upgradeType
      });
      
      if (response.data.success) {
        
        setBalance(response.data.balance);
        setUserPoints(response.data.user_points || 0);
        
        
        setUpgrades(prev => prev.map(u => 
          u.type === upgradeType 
            ? {
                ...u,
                level: response.data.upgrade.level,
                power: response.data.upgrade.power,
                next_level_cost: response.data.upgrade.next_level_cost
              }
            : u
        ));
        
        
        if (upgradeType === 'click_power') {
          setClickPower(response.data.upgrade.power);
        }
        
        
        toast.success(response.data.message || 'Улучшение успешно приобретено');
      }
    } catch (error) {
      console.error('Error buying upgrade:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ошибка при покупке улучшения');
      }
    }
  }, [upgrades, userPoints, clicksLimitReached]);
  
  const handleWithdrawPoints = useCallback(async () => {
    try {
      const amount = parseInt(withdrawAmount);
      if (isNaN(amount) || amount < minWithdrawal) {
        alert(`Минимальная сумма вывода: ${minWithdrawal} баллов`);
        return;
      }
      
      const response = await axios.post('/api/clicker/withdraw', { amount });
      if (response.data.success) {
        setBalance(response.data.new_balance);
        setTotalWithdrawn(prev => prev + response.data.withdrawn);
        setWithdrawAmount("");
        setWithdrawDialogOpen(false);
      }
    } catch (error) {
      console.error('Error withdrawing points:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Произошла ошибка при выводе баллов');
      }
    }
  }, [withdrawAmount, minWithdrawal]);
  
  
  const getUpgrade = useCallback((type) => 
    upgrades.find(u => u.type === type) || { level: 0, power: 0, next_level_cost: 0 }, 
    [upgrades]
  );

  // Мемоизируем дорогие вычисления
  const clickPowerWithMultiplier = useMemo(() => {
    const multiplierUpgrade = upgrades.find(u => u.type === 'multiplier');
    const multiplier = multiplierUpgrade && multiplierUpgrade.level > 0 ? multiplierUpgrade.power : 1.0;
    return clickPower * multiplier;
  }, [clickPower, upgrades]);

  const autoClickUpgrade = useMemo(() => 
    upgrades.find(u => u.type === 'auto_click') || { level: 0, power: 0 }, 
    [upgrades]
  );

  // Мемоизируем обработчик кликов
  const handleClick = useCallback(() => {
    if (clicksLimitReached) return;
    // Add click animation to button
    const clickButton = document.querySelector('.click-button');
    if (clickButton) {
      clickButton.classList.add('clicked');
      setTimeout(() => {
        clickButton.classList.remove('clicked');
      }, 400);
    }
    
    lastClickTimeRef.current = Date.now();
    
    if (!autoClickerPaused && getUpgrade('auto_click').level > 0) {
      setAutoClickerPaused(true);
    }
    
    pendingClicksRef.current += 1;
    
    const x = Math.random() * 80 + 10; 
    const y = Math.random() * 80 + 10; 
    
    const pointsPerClick = clickPowerWithMultiplier;
    
    const newEffect = {
      amount: pointsPerClick,
      position: { x, y },
      id: Date.now() + Math.random() 
    };
    
    setClickEffects(prev => [...prev, newEffect]);
    
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);
    
    setBalance(prev => prev + pointsPerClick);
  }, [autoClickerPaused, getUpgrade, clickPowerWithMultiplier]);

  // Сохраняем handleClick в ref для использования в touch handlers
  useEffect(() => {
    handleClickRef.current = handleClick;
  }, [handleClick]);

  // Оптимизированные обработчики навигации и действий - объявляем до useMemo
  const handleRapidClicksChange = useCallback((e) => {
    setRapidClicksEnabled(e.target.checked);
  }, []);

  const handleWithdrawalChange = useCallback((e) => {
    setWithdrawAmount(e.target.value);
  }, []);

  const handleNavigateToClick = useCallback(() => setActiveSection('click'), []);
  const handleNavigateToShop = useCallback(() => setActiveSection('shop'), []);
  const handleNavigateToStats = useCallback(() => setActiveSection('stats'), []);
  const handleNavigateToLeaderboard = useCallback(() => setActiveSection('leaderboard'), []);
  const handleOpenWithdrawDialog = useCallback(() => setWithdrawDialogOpen(true), []);
  const handleCloseWithdrawDialog = useCallback(() => setWithdrawDialogOpen(false), []);

  // Отдельный мемоизированный компонент для эффектов кликов
  const ClickEffects = useMemo(() => 
    clickEffects.map(effect => (
      <Box
        key={effect.id}
        sx={{
          position: 'absolute',
          left: `${effect.position.x}%`,
          top: `${effect.position.y}%`,
          transform: 'translate(-50%, -50%)',
          color: '#ffffff',
          animation: 'floatUp 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
          fontWeight: '700',
          fontSize: '1.3rem',
          pointerEvents: 'none',
          zIndex: 10,
          textShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.6)}, 
                      0 0 12px ${alpha(theme.palette.primary.light, 0.4)}`,
          filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.3))',
          '@keyframes floatUp': {
            '0%': {
              opacity: 1,
              transform: 'translate(-50%, -50%) scale(0.6) rotateY(0deg)',
              filter: 'blur(0px) drop-shadow(0 0 6px rgba(255,255,255,0.3))'
            },
            '20%': {
              opacity: 1,
              transform: 'translate(-50%, -70%) scale(1.4) rotateY(5deg)',
              filter: 'blur(0px) drop-shadow(0 0 8px rgba(255,255,255,0.5))'
            },
            '60%': {
              opacity: 0.8,
              transform: 'translate(-50%, -120%) scale(1.1) rotateY(-2deg)',
              filter: 'blur(0.5px) drop-shadow(0 0 4px rgba(255,255,255,0.3))'
            },
            '100%': {
              opacity: 0,
              transform: 'translate(-50%, -180%) scale(0.8) rotateY(0deg)',
              filter: 'blur(1px) drop-shadow(0 0 2px rgba(255,255,255,0.1))'
            }
          }
        }}
      >
        +{effect.amount.toFixed(3)}
      </Box>
    )), [clickEffects, theme]);

  // Отдельные мемоизированные кнопки - ОБЪЯВЛЯЕМ ДО ИСПОЛЬЗОВАНИЯ
  const UpgradeButton = useMemo(() => (
    <Button 
      fullWidth 
      variant="outlined" 
      color="primary"
      size="large"
      onClick={handleNavigateToShop}
      startIcon={<UpgradeIcon />}
      disabled={clicksLimitReached}
      sx={{ 
        borderRadius: 16, 
        py: 2,
        borderWidth: 2,
        fontWeight: 600,
        textTransform: 'none',
        background: alpha(theme.palette.primary.main, 0.05),
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          borderWidth: 2,
          background: alpha(theme.palette.primary.main, 0.1),
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`
        },
        '&:disabled': {
          opacity: 0.6,
          transform: 'none',
          boxShadow: 'none'
        }
      }}
    >
      Улучшения
    </Button>
  ), [handleNavigateToShop, theme, clicksLimitReached]);

  // Изолированная кнопка вывода - ререндерится только при пересечении минимального порога
  const WithdrawButton = useMemo(() => {
    const canWithdraw = balance >= minWithdrawal;
    
    return (
      <Button 
        fullWidth 
        variant="contained" 
        color="secondary"
        size="large"
        onClick={handleOpenWithdrawDialog}
        startIcon={<MonetizationOnIcon />}
        disabled={!canWithdraw}
        sx={{ 
          borderRadius: 16, 
          py: 2,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 10px 28px ${alpha(theme.palette.secondary.main, 0.4)}`
          },
          '&:disabled': {
            opacity: 0.6,
            transform: 'none',
            boxShadow: 'none'
          }
        }}
      >
        Вывести баллы
      </Button>
    );
  }, [handleOpenWithdrawDialog, balance >= minWithdrawal, minWithdrawal, theme]);

  // Оптимизированная render секция с мемоизацией
  const renderClickSection = useMemo(() => (
    <Box>
      <BalanceCard elevation={3} sx={{ mb: 2 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Баланс кликера
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: theme.palette.primary.main,
            textShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
          }}>
            {balance.toFixed(3)}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Мощность клика
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {clickPower.toFixed(3)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Заработано всего
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {totalEarned.toFixed(3)}
              </Typography>
            </Grid>
          </Grid>
          
          
          {getUpgrade('auto_click').level > 0 && (
            <Paper 
              sx={{ 
                mt: 3, 
                p: 2, 
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                bgcolor: autoClickerPaused 
                  ? alpha(theme.palette.grey[500], 0.1)
                  : alpha(theme.palette.primary.main, 0.05)
              }}
            >
              <AutorenewIcon 
                color={autoClickerPaused ? "disabled" : "primary"} 
                sx={{ 
                  mr: 2,
                  animation: autoClickerPaused 
                    ? 'none'
                    : 'spin 3s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} 
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                  {autoClickerPaused 
                    ? 'Автоклик на паузе' 
                    : 'Автоклик активен'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {autoClickerPaused 
                    ? 'Приостановлен, пока вы кликаете' 
                    : `+${(getUpgrade('auto_click').power).toFixed(3)} в секунду`}
                </Typography>
              </Box>
            </Paper>
          )}
          
          
          {isMobile && (
            <Paper 
              sx={{ 
                mt: 2, 
                p: 2, 
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha(theme.palette.info.main, 0.05)
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                  Быстрый тап (для телефонов)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {rapidClicksEnabled ? 'Включен' : 'Выключен'}
                </Typography>
              </Box>
              <Switch 
                checked={rapidClicksEnabled} 
                onChange={handleRapidClicksChange}
                color="primary"
              />
            </Paper>
          )}
        </CardContent>
      </BalanceCard>
      
      <Box sx={{ position: 'relative', mb: 3 }}>
        {clicksLimitReached ? (
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4, 
            textAlign: 'center', 
            bgcolor: alpha(theme.palette.error.main, 0.08), 
            border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mb: 2 }}>
              Лимит кликов!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Вы достигли своего лимита, ожидайте новый сезон
            </Typography>
          </Paper>
        ) : (
          <ClickButton 
            variant="contained" 
            onClick={handleClick}
            className="click-button"
            disableRipple
          >
            <Box sx={{
              width: 60,
              height: 60,
              minWidth: 60,
              minHeight: 60,
              borderRadius: '50%',
              background: alpha('#ffffff', 0.15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              backdropFilter: 'blur(8px)',
              border: `2px solid ${alpha('#ffffff', 0.2)}`,
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}>
            <TouchAppIcon sx={{ 
                fontSize: 32,
                width: 32,
                height: 32,
                color: '#ffffff',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                flexShrink: 0
              }} />
            </Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: 0.5
            }}>
              КЛИК
            </Typography>
            <Typography variant="body1" sx={{ 
              bgcolor: alpha('#ffffff', 0.15),
              px: 3, 
              py: 1, 
              borderRadius: 20,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              fontWeight: 600,
              fontSize: '0.9rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              +{clickPowerWithMultiplier.toFixed(3)} за клик
            </Typography>
            
            
            {ClickEffects}
          </ClickButton>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {UpgradeButton}
        </Grid>
        <Grid item xs={12} sm={6}>
          {WithdrawButton}
        </Grid>
      </Grid>
    </Box>
  ), [balance, clickPower, totalEarned, autoClickerPaused, rapidClicksEnabled, clickPowerWithMultiplier, getUpgrade, handleRapidClicksChange, handleClick, ClickEffects, clicksLimitReached, theme]);
  
  const renderShopSection = useMemo(() => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <BalanceCard elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Баланс кликера
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main
              }}>
                {balance.toFixed(3)}
              </Typography>
            </CardContent>
          </BalanceCard>
        </Grid>
        <Grid item xs={6}>
          <BalanceCard elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Баллы аккаунта
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                color: theme.palette.success.main
              }}>
                {userPoints}
              </Typography>
            </CardContent>
          </BalanceCard>
        </Grid>
      </Grid>
      
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Улучшения
      </Typography>
      
      <Grid container spacing={2}>
        
        <Grid item xs={12}>
          <UpgradeCard 
            elevation={2} 
            disabled={userPoints < getUpgrade('click_power').next_level_cost}
            sx={{ cursor: 'default' }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    mr: 2
                  }}
                >
                  <SpeedIcon sx={{ color: theme.palette.primary.main }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Мощность клика
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {UPGRADES['click_power'].description}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    Lvl {getUpgrade('click_power').level}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Текущая мощность
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {getUpgrade('click_power').power.toFixed(3)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="textSecondary">
                    Стоимость улучшения
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'medium',
                      color: userPoints >= getUpgrade('click_power').next_level_cost ? 'success.main' : 'error.main'
                    }}
                  >
                    {getUpgrade('click_power').next_level_cost.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={Math.min((userPoints / getUpgrade('click_power').next_level_cost) * 100, 100)} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
              
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={userPoints < getUpgrade('click_power').next_level_cost || clicksLimitReached}
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => handleBuyUpgrade('click_power')}
                startIcon={<UpgradeIcon />}
              >
                Улучшить
              </Button>
            </CardContent>
          </UpgradeCard>
        </Grid>
        
        
        <Grid item xs={12}>
          <UpgradeCard 
            elevation={2} 
            disabled={userPoints < getUpgrade('auto_click').next_level_cost}
            sx={{ cursor: 'default' }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    mr: 2
                  }}
                >
                  <AutorenewIcon sx={{ color: theme.palette.success.main }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Автоклик
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {UPGRADES['auto_click'].description}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                    Lvl {getUpgrade('auto_click').level}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Автодоход в секунду
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {getUpgrade('auto_click').power.toFixed(3)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="textSecondary">
                    Стоимость улучшения
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'medium',
                      color: userPoints >= getUpgrade('auto_click').next_level_cost ? 'success.main' : 'error.main'
                    }}
                  >
                    {getUpgrade('auto_click').next_level_cost.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={Math.min((userPoints / getUpgrade('auto_click').next_level_cost) * 100, 100)} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
              
              
              <Button
                fullWidth
                variant="contained"
                color="success"
                disabled={userPoints < getUpgrade('auto_click').next_level_cost || clicksLimitReached}
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => handleBuyUpgrade('auto_click')}
                startIcon={<UpgradeIcon />}
              >
                Улучшить
              </Button>
            </CardContent>
          </UpgradeCard>
        </Grid>
        
        
        <Grid item xs={12}>
          <UpgradeCard 
            elevation={2} 
            disabled={userPoints < getUpgrade('multiplier').next_level_cost}
            sx={{ cursor: 'default' }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    display: 'flex',
                    mr: 2
                  }}
                >
                  <AutoAwesomeIcon sx={{ color: theme.palette.secondary.main }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Мультипликатор
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {UPGRADES['multiplier'].description}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                    Lvl {getUpgrade('multiplier').level}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Текущий множитель
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {getUpgrade('multiplier').power.toFixed(1)}x
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="textSecondary">
                    Стоимость улучшения
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'medium',
                      color: userPoints >= getUpgrade('multiplier').next_level_cost ? 'success.main' : 'error.main'
                    }}
                  >
                    {getUpgrade('multiplier').next_level_cost.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={Math.min((userPoints / getUpgrade('multiplier').next_level_cost) * 100, 100)} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
              
              
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                disabled={userPoints < getUpgrade('multiplier').next_level_cost || clicksLimitReached}
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => handleBuyUpgrade('multiplier')}
                startIcon={<UpgradeIcon />}
              >
                Улучшить
              </Button>
            </CardContent>
          </UpgradeCard>
        </Grid>
      </Grid>
    </Box>
  ), [upgrades, userPoints, getUpgrade, handleBuyUpgrade, clicksLimitReached]);
  
  const renderStatsSection = useMemo(() => (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
        Статистика
      </Typography>
      
      {clicksLimitReached && (
        <Paper sx={{ 
          p: 3, 
          borderRadius: 3, 
          textAlign: 'center', 
          bgcolor: alpha(theme.palette.error.main, 0.08), 
          border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
          mb: 3
        }}>
          <Typography variant="h6" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
            Лимит кликов достигнут!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Вы достигли своего лимита в 100,000 кликов. Ожидайте новый сезон для продолжения игры.
          </Typography>
        </Paper>
      )}
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <BalanceCard elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <MonetizationOnIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {balance.toFixed(3)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Текущий баланс
              </Typography>
            </CardContent>
          </BalanceCard>
        </Grid>
        
        <Grid item xs={6}>
          <BalanceCard elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TimelineIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {totalEarned.toFixed(3)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Всего заработано
              </Typography>
            </CardContent>
          </BalanceCard>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
          Мои улучшения
        </Typography>
        <List disablePadding>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <SpeedIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Мощность клика" 
              secondary={`Уровень ${getUpgrade('click_power').level}`} 
            />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {getUpgrade('click_power').power.toFixed(3)}
            </Typography>
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AutorenewIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Автоклик" 
              secondary={`Уровень ${getUpgrade('auto_click').level}`} 
            />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {getUpgrade('auto_click').power.toFixed(3)}/с
            </Typography>
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AutoAwesomeIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Мультипликатор" 
              secondary={`Уровень ${getUpgrade('multiplier').level}`} 
            />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              ×{getUpgrade('multiplier').power.toFixed(1)}
            </Typography>
          </ListItem>
        </List>
      </Paper>
      
      <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
          История транзакций
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Всего выведено
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {totalWithdrawn.toFixed(1)} баллов
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="textSecondary">
            Текущая скорость фарма
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {(getUpgrade('click_power').power * (getUpgrade('multiplier').power || 1) + 
              (getUpgrade('auto_click').power || 0) * (getUpgrade('multiplier').power || 1)).toFixed(3)}/с
          </Typography>
        </Box>
      </Paper>
      
      <Button 
        fullWidth 
        variant="outlined" 
        color="primary"
        size="large"
        onClick={handleNavigateToClick}
        startIcon={<TouchAppIcon />}
        sx={{ 
          borderRadius: 8, 
          py: 1.5,
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2
          }
        }}
      >
        Вернуться к клику
      </Button>
    </Box>
  ), [balance, totalEarned, totalWithdrawn, upgrades, getUpgrade, handleNavigateToClick, clicksLimitReached, theme]);
  
  
  const renderLeaderboardSection = useMemo(() => (
    <Box>
      <Typography variant="h5" sx={{ 
        mb: 3, 
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: { xs: '1.5rem', sm: '1.8rem' }
      }}>
        Таблица лидеров
      </Typography>
      
      {leaderboardLoading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          my: 4,
          gap: 2
        }}>
          <CircularProgress 
            size={40} 
            thickness={4}
          /> 
          <Typography variant="body2" color="text.secondary">
            Загрузка данных...
          </Typography>
        </Box>
      ) : leaderboardData.length === 0 ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center', 
          borderRadius: 3,
          background: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Box sx={{ mb: 2 }}>
            <LeaderboardIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
          </Box>
          <Typography variant="body1" color="text.secondary">
            Пока никто не в топе
          </Typography>
        </Paper>
      ) : (
        <>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-end',
            justifyContent: 'center',
            mb: 3,
            gap: { xs: 1, sm: 2, md: 3 }
          }}>
            
            {leaderboardData.length > 1 && (
              <Box sx={{ 
                width: { xs: '100%', sm: '32%' },
                order: { xs: 2, sm: 1 },
                transform: { xs: 'none', sm: 'translateY(15px)', md: 'translateY(25px)' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Paper sx={{
                  width: '100%',
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(192,192,192,0.3)',
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: { xs: 'center', md: 'center' },
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                  }
                }}>
                  <Box sx={{ 
                    mr: { xs: 2, md: 0 }, 
                    mb: { md: 2 },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: { xs: 'none', md: 'block' },
                        color: 'silver',
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    >
                      2 место
                    </Typography>
                    <Avatar 
                      src={leaderboardData[1].avatar_url} 
                      alt={leaderboardData[1].username}
                      sx={{ 
                        width: { xs: 40, md: 64 }, 
                        height: { xs: 40, md: 64 },
                        border: '1px solid silver',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      width: { xs: 20, md: 24 },
                      height: { xs: 20, md: 24 },
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid silver',
                    }}>
                      <Typography variant="caption" fontWeight="bold">2</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'hidden',
                    textAlign: { md: 'center' },
                    width: { md: '100%' }
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      fontSize={{ md: '1.1rem' }}
                      fontWeight={{ md: 'bold' }}
                      noWrap
                    >
                      {leaderboardData[1].username}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { md: 'center' },
                      mt: { md: 1 }
                    }}>
                      <MonetizationOnIcon sx={{ fontSize: { xs: '0.8rem', md: '1.1rem' }, mr: 0.5, color: { xs: 'text.secondary', md: 'silver' } }} />
                      <Typography 
                        variant="caption" 
                        fontSize={{ md: '1rem' }}
                        fontWeight={{ md: 'medium' }}
                        color={{ xs: 'text.secondary', md: 'white' }}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          '& .desktop-clicks': {
                            display: { xs: 'none', md: 'inline' },
                            ml: 0.5,
                            fontWeight: 'bold',
                            color: 'silver'
                          }
                        }}
                      >
                        <span>{formatCompactNumber(leaderboardData[1].total_earned || 0)}</span>
                        <span className="desktop-clicks"></span>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    ml: { xs: 1, md: 0 }, 
                    mt: { md: 2 },
                    gap: { xs: 0.5, md: 1.5 },
                    justifyContent: { md: 'center' },
                    width: { md: '100%' }
                  }}>
                    <Tooltip title="Мощность клика">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 24, md: 36 },
                        height: { xs: 24, md: 36 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1rem' }} color="primary.main" fontWeight="bold">
                          {leaderboardData[1].click_power_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Автоклик">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 24, md: 36 },
                        height: { xs: 24, md: 36 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1rem' }} color="success.main" fontWeight="bold">
                          {leaderboardData[1].auto_click_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Множитель">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 24, md: 36 },
                        height: { xs: 24, md: 36 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1rem' }} color="secondary.main" fontWeight="bold">
                          {leaderboardData[1].multiplier_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Paper>
              </Box>
            )}
            
            
            {leaderboardData.length > 0 && (
              <Box sx={{ 
                width: { xs: '100%', sm: '32%' },
                order: { xs: 1, sm: 2 },
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Paper sx={{
                  width: '100%',
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255,215,0,0.5)',
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: { xs: 'center', md: 'center' },
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                  }
                }}>
                  <Box sx={{ 
                    mr: { xs: 2, md: 0 }, 
                    mb: { md: 2 },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: { xs: 'none', md: 'block' },
                        color: 'gold',
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    >
                      Чемпион
                    </Typography>
                    <Avatar 
                      src={leaderboardData[0].avatar_url} 
                      alt={leaderboardData[0].username}
                      sx={{ 
                        width: { xs: 46, md: 80 }, 
                        height: { xs: 46, md: 80 },
                        border: { xs: '1px solid gold', md: '2px solid gold' },
                        boxShadow: { md: '0 0 10px rgba(255,215,0,0.4)' }
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: { xs: -5, md: -8 },
                      right: { xs: -5, md: -8 },
                      width: { xs: 22, md: 28 },
                      height: { xs: 22, md: 28 },
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid gold',
                    }}>
                      <EmojiEventsIcon sx={{ fontSize: { xs: 14, md: 18 }, color: 'gold' }} />
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'hidden',
                    textAlign: { md: 'center' },
                    width: { md: '100%' }
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      fontSize={{ md: '1.3rem' }}
                      fontWeight="bold" 
                      noWrap
                    >
                      {leaderboardData[0].username}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { md: 'center' },
                      mt: { md: 1 }
                    }}>
                      <MonetizationOnIcon sx={{ fontSize: { xs: '0.8rem', md: '1.2rem' }, mr: 0.5, color: { xs: 'text.secondary', md: 'gold' } }} />
                      <Typography 
                        variant="body2" 
                        fontSize={{ md: '1.2rem' }}
                        fontWeight="medium"
                        color={{ md: 'gold' }}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          '& .desktop-clicks': {
                            display: { xs: 'none', md: 'inline' },
                            ml: 0.5,
                            fontWeight: 'bold',
                            color: 'gold'
                          }
                        }}
                      >
                        <span>{formatCompactNumber(leaderboardData[0].total_earned || 0)}</span>
                        <span className="desktop-clicks"></span>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    ml: { xs: 1, md: 0 }, 
                    mt: { md: 2 },
                    gap: { xs: 0.5, md: 2 },
                    justifyContent: { md: 'center' },
                    width: { md: '100%' }
                  }}>
                    <Tooltip title="Мощность клика">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 28, md: 40 },
                        height: { xs: 28, md: 40 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1.1rem' }} color="primary.main" fontWeight="bold">
                          {leaderboardData[0].click_power_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Автоклик">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 28, md: 40 },
                        height: { xs: 28, md: 40 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1.1rem' }} color="success.main" fontWeight="bold">
                          {leaderboardData[0].auto_click_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Множитель">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 28, md: 40 },
                        height: { xs: 28, md: 40 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1.1rem' }} color="secondary.main" fontWeight="bold">
                          {leaderboardData[0].multiplier_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Paper>
              </Box>
            )}
            
            
            {leaderboardData.length > 2 && (
              <Box sx={{ 
                width: { xs: '100%', sm: '32%' },
                order: { xs: 3, sm: 3 },
                transform: { xs: 'none', sm: 'translateY(25px)', md: 'translateY(35px)' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Paper sx={{
                  width: '100%',
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(205,127,50,0.3)',
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: { xs: 'center', md: 'center' },
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                  }
                }}>
                  <Box sx={{ 
                    mr: { xs: 2, md: 0 }, 
                    mb: { md: 2 },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: { xs: 'none', md: 'block' },
                        color: '#cd7f32',
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    >
                      3 место
                    </Typography>
                    <Avatar 
                      src={leaderboardData[2].avatar_url} 
                      alt={leaderboardData[2].username}
                      sx={{ 
                        width: { xs: 40, md: 64 }, 
                        height: { xs: 40, md: 64 },
                        border: '1px solid #cd7f32',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      width: { xs: 20, md: 24 },
                      height: { xs: 20, md: 24 },
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #cd7f32',
                    }}>
                      <Typography variant="caption" fontWeight="bold">3</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'hidden',
                    textAlign: { md: 'center' },
                    width: { md: '100%' }
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      fontSize={{ md: '1.1rem' }}
                      fontWeight={{ md: 'bold' }}
                      noWrap
                    >
                      {leaderboardData[2].username}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { md: 'center' },
                      mt: { md: 1 }
                    }}>
                      <MonetizationOnIcon sx={{ fontSize: { xs: '0.8rem', md: '1.1rem' }, mr: 0.5, color: { xs: 'text.secondary', md: '#cd7f32' } }} />
                      <Typography 
                        variant="caption" 
                        fontSize={{ md: '1rem' }}
                        fontWeight={{ md: 'medium' }}
                        color={{ xs: 'text.secondary', md: 'white' }}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          '& .desktop-clicks': {
                            display: { xs: 'none', md: 'inline' },
                            ml: 0.5,
                            fontWeight: 'bold',
                            color: '#cd7f32'
                          }
                        }}
                      >
                        <span>{formatCompactNumber(leaderboardData[2].total_earned || 0)}</span>
                        <span className="desktop-clicks"></span>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    ml: { xs: 1, md: 0 }, 
                    mt: { md: 2 },
                    gap: { xs: 0.5, md: 1.5 },
                    justifyContent: { md: 'center' },
                    width: { md: '100%' }
                  }}>
                    <Tooltip title="Мощность клика">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 24, md: 36 },
                        height: { xs: 24, md: 36 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1rem' }} color="primary.main" fontWeight="bold">
                          {leaderboardData[2].click_power_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Автоклик">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 24, md: 36 },
                        height: { xs: 24, md: 36 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1rem' }} color="success.main" fontWeight="bold">
                          {leaderboardData[2].auto_click_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Множитель">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 24, md: 36 },
                        height: { xs: 24, md: 36 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '1rem' }} color="secondary.main" fontWeight="bold">
                          {leaderboardData[2].multiplier_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
          
          
          {leaderboardData.length > 3 && (
            <Box sx={{ 
              mt: 4, 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1, md: 2 }
            }}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Остальные участники
                </Typography>
              </Divider>
              
              {leaderboardData.slice(3).map((player, index) => (
                <Paper 
                  key={index}
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    borderRadius: { xs: 2, md: 3 },
                    background: alpha(theme.palette.background.paper, 0.3),
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      background: alpha(theme.palette.background.paper, 0.4),
                    }
                  }}
                >
                  <Box sx={{ 
                    width: { xs: 28, md: 40 }, 
                    height: { xs: 28, md: 40 }, 
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="caption" fontSize={{ xs: '0.75rem', md: '1rem' }} fontWeight="medium">{index + 4}</Typography>
                  </Box>
                  
                  <Avatar 
                    src={player.avatar_url} 
                    alt={player.username}
                    sx={{ 
                      width: { xs: 32, md: 48 }, 
                      height: { xs: 32, md: 48 }, 
                      mr: 1.5,
                      border: { md: '1px solid rgba(255,255,255,0.2)' }
                    }}
                  />
                  
                  <Box sx={{ flexGrow: 1, mr: 2, overflow: 'hidden' }}>
                    <Typography variant="body2" fontSize={{ md: '1rem' }} fontWeight={{ md: 'medium' }} noWrap>
                      {player.username}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MonetizationOnIcon sx={{ fontSize: { xs: '0.7rem', md: '1rem' }, mr: 0.5, color: 'text.secondary' }} />
                      <Typography 
                        variant="caption" 
                        fontSize={{ md: '0.9rem' }}
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          '& .desktop-clicks': {
                            display: { xs: 'none', md: 'inline' },
                            ml: 0.5,
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }
                        }}
                      >
                        <span>{formatCompactNumber(player.total_earned || 0)}</span>
                        <span className="desktop-clicks"></span>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
                    <Tooltip title="МК">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 22, md: 32 },
                        height: { xs: 22, md: 32 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '0.85rem' }} color="primary.main">
                          {player.click_power_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="АК">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 22, md: 32 },
                        height: { xs: 22, md: 32 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '0.85rem' }} color="success.main">
                          {player.auto_click_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="МН">
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                        borderRadius: '50%',
                        width: { xs: 22, md: 32 },
                        height: { xs: 22, md: 32 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="caption" fontSize={{ md: '0.85rem' }} color="secondary.main">
                          {player.multiplier_level}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
          
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleNavigateToClick}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Вернуться к клику
            </Button>
          </Box>
        </>
      )}
    </Box>
  ), [leaderboardData, leaderboardLoading, handleNavigateToClick]);
  
  
  const renderActiveSection = useMemo(() => {
    switch (activeSection) {
      case 'shop':
        return renderShopSection;
      case 'stats':
        return renderStatsSection;
      case 'leaderboard':
        return renderLeaderboardSection;
      default:
        return renderClickSection;
    }
  }, [activeSection, renderShopSection, renderStatsSection, renderLeaderboardSection, renderClickSection]);
  
  // Мемоизированная навигация
  const navigationButtons = useMemo(() => !isMobile && (
          <Box>
            <Button 
              variant={activeSection === 'click' ? 'contained' : 'text'} 
        onClick={handleNavigateToClick}
              sx={{ mx: 0.5 }}
              startIcon={<TouchAppIcon />}
            >
              Кликер
            </Button>
            <Button 
              variant={activeSection === 'shop' ? 'contained' : 'text'} 
        onClick={handleNavigateToShop}
              sx={{ mx: 0.5 }}
              startIcon={<CategoryIcon />}
            >
              Магазин
            </Button>
            <Button 
              variant={activeSection === 'stats' ? 'contained' : 'text'} 
        onClick={handleNavigateToStats}
              sx={{ mx: 0.5 }}
              startIcon={<TimelineIcon />}
            >
              Статистика
            </Button>
            <Button 
              variant={activeSection === 'leaderboard' ? 'contained' : 'text'} 
        onClick={handleNavigateToLeaderboard}
              sx={{ mx: 0.5 }}
              startIcon={<LeaderboardIcon />}
            >
              Лидеры
            </Button>
          </Box>
  ), [isMobile, activeSection, handleNavigateToClick, handleNavigateToShop, handleNavigateToStats, handleNavigateToLeaderboard]);

  // Мемоизированный хедер - НЕ РЕРЕНДЕРИТСЯ при кликах
  const HeaderSection = useMemo(() => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 4,
      background: alpha(theme.palette.primary.main, 0.05),
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      p: { xs: 2, sm: 3 },
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
    }}>
      <Box sx={{ 
        width: 48, 
        height: 48, 
        borderRadius: 2, 
        background: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
      }}>
        <TouchAppIcon sx={{ color: '#ffffff', fontSize: 28 }} />
      </Box>
      <Typography variant="h4" sx={{ 
        flexGrow: 1, 
        fontWeight: 700,
        color: theme.palette.primary.main,
        letterSpacing: 1,
        textShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
      }}>
        Кликер
      </Typography>
      
      {navigationButtons}
    </Box>
  ), [theme, navigationButtons]);

  return (
    <Container maxWidth="sm" sx={{ 
      mb: isMobile ? 12 : 4, 
      pt: 2,
      px: { xs: 2, sm: 3 } 
    }}>
      {HeaderSection}
      
      {renderActiveSection}
      
      
      <Dialog
        open={withdrawDialogOpen}
        onClose={handleCloseWithdrawDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: '100%',
            maxWidth: 360,
            '@media (max-width: 600px)': {
              width: '100%',
              maxWidth: '100%',
              margin: 0,
              borderRadius: 0,
            }
          }
        }}
      >
        <DialogTitle>Вывести баллы</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Вы можете вывести баллы из кликера на основной счет. Минимальная сумма вывода: {minWithdrawal} баллов.
          </DialogContentText>
          <TextField
            label="Количество баллов"
            type="number"
            fullWidth
            value={withdrawAmount}
            onChange={handleWithdrawalChange}
            inputProps={{ min: minWithdrawal }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseWithdrawDialog} 
            color="inherit"
          >
            Отмена
          </Button>
          <Button 
            onClick={handleWithdrawPoints} 
            variant="contained"
            disabled={!withdrawAmount || parseFloat(withdrawAmount) < minWithdrawal}
          >
            Вывести
          </Button>
        </DialogActions>
      </Dialog>
      
      
      {isMobile && (
        <ClickerBottomNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      )}
    </Container>
  );
};


const UPGRADES = {
  'click_power': {
    description: 'Увеличивает мощность одного клика'
  },
  'auto_click': {
    description: 'Автоматически приносит очки каждую секунду'
  },
  'multiplier': {
    description: 'Умножает все заработанные очки'
  }
};

export default ClickerPage; 