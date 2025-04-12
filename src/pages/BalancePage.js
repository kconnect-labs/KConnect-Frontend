import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TimelineIcon from '@mui/icons-material/Timeline';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';
import SendIcon from '@mui/icons-material/Send';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DiamondIcon from '@mui/icons-material/Diamond';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BallsSVG } from '../assets/balls.svg';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TagIcon from '@mui/icons-material/Tag';

// Создаем стилизованные компоненты
const BalanceHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const BalanceCard = styled(Card)(({ theme }) => ({
  overflow: 'visible',
  borderRadius: 16,
  position: 'relative',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.3)} 100%)`,
  backdropFilter: 'blur(10px)',
  boxShadow: `0 10px 40px -15px ${alpha(theme.palette.primary.main, 0.4)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  marginBottom: theme.spacing(3),
}));

const BalanceCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const BalanceAmount = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: '700',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  color: '#ffffff',
  lineHeight: 1.2,
}));

const WeeklyPredictionCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.light, 0.1)} 100%)`,
  marginBottom: theme.spacing(4),
}));

const HistoryCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  overflow: 'hidden',
}));

const InfoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: alpha(theme.palette.background.paper, 0.6),
  borderRadius: 12,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  background: alpha(theme.palette.background.paper, 0.5),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const TransactionItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  background: alpha(theme.palette.background.paper, 0.3),
  transition: 'transform 0.2s ease, background 0.2s ease',
  '&:hover': {
    background: alpha(theme.palette.background.paper, 0.6),
    transform: 'translateX(5px)',
  },
}));

const TransactionAmount = styled(Typography)(({ theme, type }) => ({
  fontWeight: 'bold',
  fontSize: '0.9rem',
  padding: '4px 8px',
  borderRadius: '8px',
  backgroundColor: type === 'positive' 
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.error.main, 0.1),
  color: type === 'positive' 
    ? theme.palette.success.main 
    : theme.palette.error.main,
}));

const BadgeImage = styled('img')({
  width: 40,
  height: 40,
  objectFit: 'contain',
});

const PointsIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  marginBottom: theme.spacing(1),
  '& svg': {
    width: '100%',
    height: '100%',
  }
}));

// Новые стилизованные компоненты
const BadgeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  background: alpha(theme.palette.background.paper, 0.4),
  position: 'relative',
  overflow: 'hidden',
}));

const CreatedBadgeImage = styled('img')({
  width: 50,
  height: 50,
  objectFit: 'contain',
});

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  background: `linear-gradient(135deg, rgba(206, 188, 255, 0.5) 0%, rgba(97, 76, 147, 0.6) 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: 28,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(97, 76, 147, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const ActionButtonItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  padding: theme.spacing(1),
  cursor: 'pointer',
  borderRadius: 16,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const ActionCircleIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: '#614C93', // Более темный из градиента
  marginBottom: theme.spacing(0.8),
  '& svg': {
    color: '#fff',
    fontSize: 24,
  },
}));

const ActionButtonText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#fff',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

// Новый компонент для карточек действий в стиле Тинькофф
const ActionCardsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(1, 1fr)',
  },
}));

const ActionCard = styled(Box)(({ theme, colorStart, colorEnd }) => ({
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  padding: theme.spacing(2.5),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`,
  boxShadow: `0 8px 20px -12px ${alpha(colorEnd, 0.6)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 15px 30px -8px ${alpha(colorEnd, 0.7)}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at 100% 0%, ${alpha('#ffffff', 0.2)} 0%, transparent 25%)`,
    pointerEvents: 'none',
  },
}));

const ActionIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha('#ffffff', 0.15),
  backdropFilter: 'blur(5px)',
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  boxShadow: `0 4px 15px -5px ${alpha('#000000', 0.2)}`,
  '& svg': {
    fontSize: 32,
    color: '#ffffff',
  },
}));

const ActionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#ffffff',
  fontSize: '1.1rem',
  textAlign: 'center',
  marginBottom: theme.spacing(0.5),
}));

const ActionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: alpha('#ffffff', 0.8),
  textAlign: 'center',
}));

// Add new styled components for the dialog design
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    backgroundImage: 'linear-gradient(to bottom, #1a1a1a, #242424)',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  }
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #9E77ED 0%, #614C93 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  position: 'relative',
}));

const DialogAvatar = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  border: '2px solid rgba(255,255,255,0.2)',
  '& svg': {
    fontSize: 36,
    color: 'white',
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.07)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255,255,255,0.07)',
      boxShadow: '0 0 0 2px rgba(158, 119, 237, 0.5)',
    },
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(158, 119, 237, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(158, 119, 237, 0.5)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
  },
}));

const SuggestionsContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 12,
  margin: theme.spacing(0, 0, 3),
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.05)',
  backdropFilter: 'blur(5px)',
}));

const SuggestionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(158, 119, 237, 0.2)',
  },
  '&:not(:last-child)': {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: 'rgba(158, 119, 237, 0.3)',
  marginRight: theme.spacing(2),
  border: '1px solid rgba(255,255,255,0.1)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  backgroundImage: 'linear-gradient(135deg, #9E77ED 0%, #614C93 100%)',
  borderRadius: 12,
  padding: theme.spacing(1.2, 3),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(97, 76, 147, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(97, 76, 147, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    boxShadow: '0 2px 8px rgba(97, 76, 147, 0.3)',
    transform: 'translateY(0)',
  },
  '&.Mui-disabled': {
    background: 'rgba(255,255,255,0.1)',
  }
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.2, 3),
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(5px)',
  color: 'rgba(255,255,255,0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  }
}));

// Главный компонент страницы
const BalancePage = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [userPoints, setUserPoints] = useState(0);
  const [weeklyEstimate, setWeeklyEstimate] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [royaltyHistory, setRoyaltyHistory] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [createdBadges, setCreatedBadges] = useState([]);
  const [usernamePurchases, setUsernamePurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferData, setTransferData] = useState({ username: '', amount: '', message: '', recipient_id: null });
  const [transferErrors, setTransferErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [userSearch, setUserSearch] = useState({
    loading: false,
    exists: false,
    suggestions: [],
    timer: null
  });

  // Объединяем историю покупок и роялти в единую историю транзакций
  const allTransactions = React.useMemo(() => {
    const purchases = purchaseHistory.map(purchase => ({
      ...purchase,
      type: 'purchase',
      date: new Date(purchase.purchase_date),
      amount: -purchase.price_paid,
      description: `Покупка бейджика "${purchase.badge.name}"`,
      icon: <ShoppingCartIcon sx={{ color: 'error.main' }} />
    }));

    const royalties = royaltyHistory.map(royalty => ({
      ...royalty,
      type: 'royalty',
      date: new Date(royalty.purchase_date),
      amount: royalty.royalty_amount,
      description: `${royalty.buyer.name} купил бейджик "${royalty.badge_name}"`,
      icon: <MonetizationOnIcon sx={{ color: 'success.main' }} />
    }));

    const transfers = transferHistory.map(transfer => {
      // Определяем, является ли текущий пользователь отправителем
      // Convert both IDs to numbers for reliable comparison
      const senderId = parseInt(transfer.sender_id, 10);
      const userId = parseInt(user.id, 10);
      const is_sender = senderId === userId;
      
      // Формируем описание перевода с учетом сообщения
      let description = is_sender 
        ? `Перевод баллов пользователю ${transfer.recipient_username}`
        : `Получение баллов от пользователя ${transfer.sender_username}`;
        
      // Добавляем сообщение, если оно есть
      if (transfer.message) {
        description += `: "${transfer.message}"`;
      }
      
      return {
        ...transfer,
        type: 'transfer',
        date: new Date(transfer.date),
        amount: is_sender ? -transfer.amount : transfer.amount,
        description: description,
        icon: is_sender 
          ? <SendIcon sx={{ color: 'error.main' }} />
          : <AccountBalanceWalletIcon sx={{ color: 'success.main' }} />
      };
    });

    // Добавляем покупки юзернеймов
    const usernames = usernamePurchases.map(purchase => ({
      ...purchase,
      type: 'username',
      date: new Date(purchase.purchase_date),
      amount: -purchase.price_paid,
      description: `Покупка юзернейма "@${purchase.username}"`,
      icon: <AccountCircleIcon sx={{ color: 'error.main' }} />
    }));

    // Сортируем по дате (новые сначала)
    return [...purchases, ...royalties, ...transfers, ...usernames].sort((a, b) => b.date - a.date);
  }, [purchaseHistory, royaltyHistory, transferHistory, usernamePurchases, user?.id]);

  useEffect(() => {
    if (user) {
      // Загружаем данные при монтировании компонента
      fetchUserPoints();
      fetchWeeklyEstimate();
      fetchPurchaseHistory();
      fetchRoyaltyHistory();
      fetchCreatedBadges();
      fetchTransferHistory();
      fetchUsernamePurchases();
    }
  }, [user]);

  // Получение текущего баланса баллов
  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Ошибка при загрузке баллов:', error);
      setError('Не удалось загрузить баланс баллов');
    }
  };

  // Получение оценки баллов за текущую неделю
  const fetchWeeklyEstimate = async () => {
    try {
      // Получаем данные из лидерборда за текущую неделю
      const response = await axios.get('/api/leaderboard/user/' + user.id + '?period=week');
      setWeeklyEstimate(response.data.score || 0);
    } catch (error) {
      console.error('Ошибка при загрузке прогноза:', error);
      setWeeklyEstimate(0);
    }
  };

  // Получение истории покупок
  const fetchPurchaseHistory = async () => {
    try {
      const response = await axios.get('/api/badges/purchases');
      // Сортируем покупки по дате (новые сначала)
      const sortedPurchases = response.data.purchases.sort((a, b) => 
        new Date(b.purchase_date) - new Date(a.purchase_date)
      );
      setPurchaseHistory(sortedPurchases);
    } catch (error) {
      console.error('Ошибка при загрузке истории покупок:', error);
      setPurchaseHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Получение истории роялти от бейджиков
  const fetchRoyaltyHistory = async () => {
    try {
      const response = await axios.get('/api/badges/royalties');
      // Данные уже отсортированы на бэкенде
      console.log('Received royalty data:', response.data);
      setRoyaltyHistory(response.data.royalties || []);
    } catch (error) {
      console.error('Ошибка при загрузке истории роялти:', error);
      setRoyaltyHistory([]);
    }
  };

  // Получение созданных пользователем бейджиков
  const fetchCreatedBadges = async () => {
    try {
      const response = await axios.get('/api/badges/created');
      console.log('Received created badges data:', response.data);
      setCreatedBadges(response.data.badges || []);
    } catch (error) {
      console.error('Ошибка при загрузке созданных бейджиков:', error);
      setCreatedBadges([]);
    }
  };

  // Новая функция для получения истории переводов
  const fetchTransferHistory = async () => {
    try {
      const response = await axios.get('/api/user/transfer-history');
      if (response.data && response.data.transfers) {
        setTransferHistory(response.data.transfers);
      }
    } catch (error) {
      console.error('Ошибка при получении истории переводов:', error);
      // Не показываем ошибку пользователю, просто логируем
    }
  };

  // Функция для получения истории покупок юзернеймов
  const fetchUsernamePurchases = async () => {
    try {
      const response = await axios.get('/api/user/username-purchases');
      if (response.data && response.data.purchases) {
        setUsernamePurchases(response.data.purchases);
      }
    } catch (error) {
      console.error('Ошибка при получении истории покупок юзернеймов:', error);
      // Не показываем ошибку пользователю, просто логируем
    }
  };

  // Функция для поиска пользователя с debounce
  const searchUser = useCallback((username) => {
    // Очищаем предыдущий таймер
    if (userSearch.timer) clearTimeout(userSearch.timer);
    
    // Если имя пользователя пустое, сбрасываем состояние поиска
    if (!username) {
      setUserSearch(prev => ({
        ...prev,
        loading: false,
        exists: false,
        suggestions: [],
        timer: null
      }));
      // Сбрасываем recipient_id при пустом username
      setTransferData(prev => ({...prev, recipient_id: null}));
      return;
    }
    
    // Устанавливаем состояние загрузки
    setUserSearch(prev => ({
      ...prev,
      loading: true,
      timer: setTimeout(async () => {
        try {
          // Запрос на API для проверки/поиска пользователя
          const response = await axios.get(`/api/user/search-recipients?query=${username}`);
          
          if (response.data && response.data.users) {
            // Проверяем, есть ли точное совпадение
            const exactMatch = response.data.users.find(
              user => user.username.toLowerCase() === username.toLowerCase()
            );
            
            // Если нашли точное совпадение, сохраняем ID получателя
            if (exactMatch) {
              setTransferData(prev => ({...prev, recipient_id: exactMatch.id}));
            } else {
              setTransferData(prev => ({...prev, recipient_id: null}));
            }
            
            // Обновляем состояние поиска
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: !!exactMatch,
              suggestions: response.data.users.slice(0, 3) // Ограничиваем до 3 предложений
            }));
          } else {
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: false,
              suggestions: []
            }));
            setTransferData(prev => ({...prev, recipient_id: null}));
          }
        } catch (error) {
          console.error('Ошибка при поиске пользователя:', error);
          setUserSearch(prev => ({
            ...prev,
            loading: false,
            exists: false,
            suggestions: []
          }));
          setTransferData(prev => ({...prev, recipient_id: null}));
        }
      }, 500) // Задержка в 500 мс перед отправкой запроса
    }));
  }, [userSearch.timer]);
  
  // Обработчик изменения имени пользователя
  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setTransferData(prev => ({...prev, username}));
    
    // Запускаем поиск пользователя
    searchUser(username);
  };
  
  // Выбор предложенного пользователя
  const selectSuggestion = (username, userId) => {
    setTransferData(prev => ({...prev, username, recipient_id: userId}));
    setUserSearch(prev => ({
      ...prev,
      loading: false,
      exists: true,
      suggestions: []
    }));
  };

  // Функция перевода баллов
  const handleTransferPoints = async () => {
    const errors = {};
    if (!transferData.username) errors.username = 'Введите имя пользователя';
    if (!transferData.recipient_id) errors.username = 'Пользователь не найден';
    if (!transferData.amount) {
      errors.amount = 'Введите сумму перевода';
    } else if (isNaN(transferData.amount) || parseInt(transferData.amount) <= 0) {
      errors.amount = 'Сумма должна быть положительным числом';
    } else if (parseInt(transferData.amount) > userPoints) {
      errors.amount = 'Недостаточно баллов для перевода';
    }

    if (Object.keys(errors).length > 0) {
      setTransferErrors(errors);
      return;
    }

    setTransferErrors({});
    try {
      // Отправляем и ID, и username для двойной верификации
      await axios.post('/api/user/transfer-points', {
        recipient_username: transferData.username,
        recipient_id: transferData.recipient_id,
        amount: parseInt(transferData.amount),
        message: transferData.message
      });
      
      // Обновляем баланс
      fetchUserPoints();
      
      // Закрываем диалог
      setTransferDialogOpen(false);
      
      // Показываем уведомление об успешном переводе
      setSnackbar({
        open: true,
        message: `Успешно переведено ${transferData.amount} баллов пользователю ${transferData.username}`,
        severity: 'success'
      });
      
      // Сбрасываем данные формы
      setTransferData({ username: '', amount: '', message: '', recipient_id: null });
    } catch (error) {
      console.error('Ошибка при переводе баллов:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Ошибка при переводе баллов',
        severity: 'error'
      });
    }
  };

  // Функция форматирования даты с учетом часового пояса пользователя
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Получаем смещение часового пояса пользователя в минутах
    const userTimezoneOffset = date.getTimezoneOffset();
    
    // Создаем новую дату с учетом смещения
    const userDate = new Date(date.getTime() - (userTimezoneOffset * 60000));
    
    // Форматируем дату с учетом локали пользователя
    const formattedDate = userDate.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Используем 24-часовой формат
      timeZoneName: 'short' // Добавляем отображение часового пояса
    });
    
    return formattedDate;
  };

  // Получение информации о границах текущей недели
  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0-воскресенье, 1-понедельник, ...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Расчет смещения до понедельника
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 50, 0, 0);
    
    return {
      start: monday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      end: sunday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    };
  };

  // Получаем границы текущей недели
  const weekRange = getCurrentWeekRange();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, mb: 10 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <BalanceHeader>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Коннеки-Баланс
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2, maxWidth: 600 }}>
          Управляйте своими баллами, отслеживайте историю транзакций и используйте баллы для покупок
        </Typography>
      </BalanceHeader>

      <BalanceCard>
        <BalanceCardContent>
          <PointsIcon>
            <BallsSVG />
          </PointsIcon>
          <Typography variant="subtitle1" color="inherit" gutterBottom sx={{ opacity: 0.8 }}>
            Текущий баланс
          </Typography>
          <BalanceAmount>
            {userPoints}
          </BalanceAmount>
          
          {/* Новый единый блок с кнопками управления балансом */}
          <ActionButtonsContainer>
            <ActionButtonItem onClick={() => navigate('/badge-shop')}>
              <ActionCircleIcon>
                <PaymentIcon />
              </ActionCircleIcon>
              <ActionButtonText>Оплатить</ActionButtonText>
            </ActionButtonItem>
            
            <ActionButtonItem onClick={() => window.open('https://www.donationalerts.com/r/qsouls', '_blank')}>
              <ActionCircleIcon>
                <AddIcon />
              </ActionCircleIcon>
              <ActionButtonText>Пополнить</ActionButtonText>
            </ActionButtonItem>
            
            <ActionButtonItem onClick={() => setTransferDialogOpen(true)}>
              <ActionCircleIcon>
                <SendIcon />
              </ActionCircleIcon>
              <ActionButtonText>Перевести</ActionButtonText>
            </ActionButtonItem>
          </ActionButtonsContainer>
        </BalanceCardContent>
      </BalanceCard>

      <WeeklyPredictionCard>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6">
              Прогноз на текущую неделю
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {weekRange.start} — {weekRange.end}
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 2 }}>
            +{weeklyEstimate} баллов
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Это прогноз баллов, которые вы получите в конце недели за вашу активность. 
            Баллы начисляются каждое воскресенье в 23:50.
          </Typography>
        </CardContent>
      </WeeklyPredictionCard>

      <InfoSection>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Как начисляются баллы?</Typography>
        </Box>
        <Tooltip title="Подробнее о начислении баллов">
          <IconButton 
            size="small"
            component={Link}
            to="/leaderboard"
            sx={{ color: 'primary.main' }}
          >
            <TimelineIcon />
          </IconButton>
        </Tooltip>
      </InfoSection>

      {/* Вкладки для переключения между историей транзакций и активами */}
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            }
          }}
        >
          <Tab 
            icon={<ReceiptLongIcon />} 
            iconPosition="start" 
            label="История транзакций" 
            id="tab-0"
            aria-controls="tabpanel-0"
          />
          <Tab 
            icon={<DiamondIcon />} 
            iconPosition="start" 
            label="Активы" 
            id="tab-1"
            aria-controls="tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* Панель истории транзакций */}
      <TabPanel value={tabValue} index={0}>
        <HistoryCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Все транзакции ({allTransactions.length})
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress size={30} />
              </Box>
            ) : allTransactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  У вас пока нет истории транзакций
                </Typography>
              </Box>
            ) : (
              <List sx={{ width: '100%' }}>
                {allTransactions.map((transaction, index) => (
                  <TransactionItem key={`${transaction.type}-${transaction.id || index}`}>
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        sx={{ 
                          bgcolor: transaction.amount > 0 
                            ? alpha(theme.palette.success.main, 0.2)
                            : alpha(theme.palette.error.main, 0.2),
                          p: 0.5 
                        }}
                      >
                        {transaction.type === 'purchase' ? (
                          <BadgeImage 
                            src={`/static/images/bages/shop/${transaction.badge.image_path}`}
                            alt={transaction.badge.name}
                          />
                        ) : transaction.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={transaction.description}
                      secondary={formatDate(transaction.date)}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TransactionAmount type={transaction.amount > 0 ? 'positive' : 'negative'}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </TransactionAmount>
                    </Box>
                  </TransactionItem>
                ))}
              </List>
            )}
          </CardContent>
        </HistoryCard>
      </TabPanel>

      {/* Панель активов */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Секция с созданными бейджиками */}
          {createdBadges.length > 0 ? (
            <HistoryCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Ваши созданные бейджики
                </Typography>
                
                {createdBadges.map((badge) => (
                  <Accordion 
                    key={badge.id}
                    sx={{ 
                      mb: 2, 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      '&:before': { display: 'none' },
                      boxShadow: 'none',
                      background: alpha(theme.palette.background.paper, 0.4)
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ borderRadius: '12px' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar 
                          variant="rounded" 
                          sx={{ mr: 2, bgcolor: 'background.paper', p: 0.5 }}
                        >
                          <CreatedBadgeImage 
                            src={`/static/images/bages/shop/${badge.image_path}`}
                            alt={badge.name}
                          />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1">{badge.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip 
                              size="small" 
                              label={`${badge.price} баллов`} 
                              sx={{ mr: 1, fontSize: '0.7rem' }}
                            />
                            <Badge 
                              badgeContent={badge.purchases.length} 
                              color="primary"
                              sx={{ mr: 1 }}
                            >
                              <PeopleIcon fontSize="small" />
                            </Badge>
                            {badge.total_royalty_earned > 0 && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MonetizationOnIcon sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption" color="success.main" fontWeight="bold">
                                  +{badge.total_royalty_earned}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {badge.description || 'Без описания'}
                      </Typography>
                      
                      {badge.purchases.length > 0 ? (
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Покупки ({badge.purchases.length})
                          </Typography>
                          <List dense sx={{ bgcolor: alpha(theme.palette.background.paper, 0.3), borderRadius: 2, mb: 1 }}>
                            {badge.purchases.map((purchase) => (
                              <ListItem key={purchase.id}>
                                <ListItemAvatar>
                                  <Avatar 
                                    src={purchase.buyer.avatar_url} 
                                    alt={purchase.buyer.name}
                                    sx={{ width: 32, height: 32 }}
                                  />
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={purchase.buyer.name}
                                  secondary={formatDate(purchase.date)}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <MonetizationOnIcon sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
                                  <Typography variant="caption" color="success.main" fontWeight="bold">
                                    +{purchase.royalty_amount}
                                  </Typography>
                                </Box>
                              </ListItem>
                            ))}
                          </List>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Пока нет покупок этого бейджика
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </HistoryCard>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5, px: 3, bgcolor: alpha(theme.palette.background.paper, 0.4), borderRadius: 4 }}>
              <DiamondIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                У вас пока нет созданных активов
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Создайте свой бейджик в магазине, чтобы начать зарабатывать роялти от продаж
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/badge-shop')}
                startIcon={<ShoppingCartIcon />}
              >
                Перейти в магазин бейджиков
              </Button>
            </Box>
          )}

          {/* Секция с купленными юзернеймами */}
          {usernamePurchases.length > 0 && (
            <HistoryCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Ваши приобретенные юзернеймы ({usernamePurchases.length})
                </Typography>
                
                <List sx={{ width: '100%' }}>
                  {usernamePurchases.map((purchase) => (
                    <ListItem 
                      key={purchase.id}
                      sx={{
                        borderRadius: '12px',
                        mb: 2,
                        background: alpha(theme.palette.background.paper, 0.4),
                        padding: '12px 16px',
                        '&:hover': {
                          background: alpha(theme.palette.background.paper, 0.6)
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: purchase.is_active ? 'success.main' : 'action.disabled',
                            width: 40, 
                            height: 40
                          }}
                        >
                          <TagIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              @{purchase.username}
                            </Typography>
                            {purchase.is_active && (
                              <Chip
                                size="small"
                                label="Активный"
                                color="success"
                                sx={{ ml: 1, height: 20, '& .MuiChip-label': { px: 1, py: 0.2 } }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Приобретен: {formatDate(purchase.purchase_date)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Длина: {purchase.length} символов
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 1 }}>
                        <MonetizationOnIcon sx={{ color: 'error.main', fontSize: '1rem', mr: 0.5 }} />
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold"
                          color="error.main"
                        >
                          -{purchase.price_paid}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </HistoryCard>
          )}
          
          {/* Если пока нет ни бейджиков, ни юзернеймов */}
          {createdBadges.length === 0 && usernamePurchases.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 5, px: 3, bgcolor: alpha(theme.palette.background.paper, 0.4), borderRadius: 4 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                У вас пока нет активов
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Создавайте бейджики или приобретайте уникальные юзернеймы, чтобы они отображались здесь
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/username-shop')}
                startIcon={<AccountCircleIcon />}
                sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
              >
                Магазин юзернеймов
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/badge-shop')}
                startIcon={<ShoppingCartIcon />}
              >
                Магазин бейджиков
              </Button>
            </Box>
          )}
        </Box>
      </TabPanel>

      {/* Диалог для перевода баллов */}
      <StyledDialog 
        open={transferDialogOpen} 
        onClose={() => setTransferDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogHeader>
          <DialogAvatar>
            <SendIcon />
          </DialogAvatar>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            Перевод баллов
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '80%' }}>
            Мгновенный перевод баллов другому пользователю платформы
          </Typography>
        </DialogHeader>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Доступно для перевода
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#9E77ED' }}>
              {userPoints} баллов
            </Typography>
          </Box>

          <InputContainer>
            <StyledTextField
              label="Получатель"
              fullWidth
              variant="outlined"
              value={transferData.username}
              onChange={handleUsernameChange}
              error={!!transferErrors.username}
              helperText={transferErrors.username}
              placeholder="Введите имя пользователя"
              InputProps={{
                endAdornment: (
                  <React.Fragment>
                    {userSearch.loading && <CircularProgress size={20} color="inherit" />}
                    {userSearch.exists && !userSearch.loading && 
                      <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                    }
                  </React.Fragment>
                )
              }}
            />
          </InputContainer>
          
          {/* Предложения похожих пользователей */}
          {userSearch.suggestions.length > 0 && !userSearch.exists && (
            <SuggestionsContainer>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  Похожие пользователи
                </Typography>
              </Box>
              {userSearch.suggestions.map(user => (
                <SuggestionItem
                  key={user.id}
                  onClick={() => selectSuggestion(user.username, user.id)}
                >
                  <UserAvatar>{user.username.charAt(0).toUpperCase()}</UserAvatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.username}
                    </Typography>
                    {user.name && (
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {user.name}
                      </Typography>
                    )}
                  </Box>
                </SuggestionItem>
              ))}
            </SuggestionsContainer>
          )}
          
          {/* Показываем блок с подтверждением валидации для безопасности */}
          {userSearch.exists && transferData.recipient_id && (
            <Box sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: 2,
              border: '1px solid rgba(76, 175, 80, 0.2)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
              <Typography variant="body2">
                Получатель подтвержден: <strong>{transferData.username}</strong> (ID: {transferData.recipient_id})
              </Typography>
            </Box>
          )}
          
          <InputContainer>
            <StyledTextField
              label="Количество баллов"
              fullWidth
              variant="outlined"
              type="number"
              inputProps={{ min: 1, max: userPoints }}
              value={transferData.amount}
              onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
              error={!!transferErrors.amount}
              helperText={transferErrors.amount}
              placeholder="Введите сумму перевода"
            />
          </InputContainer>
          
          <InputContainer>
            <StyledTextField
              label="Сообщение (необязательно)"
              fullWidth
              variant="outlined"
              value={transferData.message}
              onChange={(e) => setTransferData({...transferData, message: e.target.value})}
              placeholder="Добавьте сообщение к переводу"
              multiline
              rows={2}
            />
          </InputContainer>
        </DialogContent>
        
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.07)'
        }}>
          <CancelButton onClick={() => setTransferDialogOpen(false)}>
            Отмена
          </CancelButton>
          <GradientButton 
            onClick={handleTransferPoints} 
            disabled={!userSearch.exists || !transferData.recipient_id || userSearch.loading || !transferData.amount}
            startIcon={<SendIcon />}
          >
            {userSearch.exists && transferData.recipient_id ? 'Перевести безопасно' : 'Перевести'}
          </GradientButton>
        </Box>
      </StyledDialog>

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Container>
  );
};

export default BalancePage; 