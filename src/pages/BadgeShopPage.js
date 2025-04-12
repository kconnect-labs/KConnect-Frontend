import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SortIcon from '@mui/icons-material/Sort';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { Fade } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  backgroundColor: theme.palette.mode === 'dark' ? alpha('#000', 0.8) : '#fff',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    '& .badge-image': {
      transform: 'scale(1.05)',
    },
    '& .badge-overlay': {
      opacity: 1,
    }
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiCardMedia-root': {
      height: '100px',
    }
  }
}));

const BadgeImage = styled('img')({
  width: '100%',
  height: '130px',
  objectFit: 'contain',
  padding: '12px',
  transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '@media (max-width: 600px)': {
    height: '100px',
    padding: '8px',
  },
});

const BadgeOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 1,
}));

const BadgeCardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2, 1.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  '@media (max-width: 600px)': {
    padding: theme.spacing(1.5, 1.5, 1),
  },
}));

const BadgeCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: theme.palette.background.paper,
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:last-child': {
    paddingBottom: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  }
}));

const BadgeTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginBottom: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
  }
}));

const BadgeDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  lineHeight: 1.4,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    marginBottom: theme.spacing(1),
  }
}));

const BadgeCreator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.75),
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
  }
}));

const BadgeCreatorAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  border: `2px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.down('sm')]: {
    width: 20,
    height: 20,
  }
}));

const BadgeCreatorName = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
  }
}));

const BadgeFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(0.5),
  }
}));

const BadgePrice = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.25),
  }
}));

const BadgePriceIcon = styled(MonetizationOnIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '1.2rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  }
}));

const BadgePriceText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  fontSize: '0.9rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  }
}));

const BadgeBuyButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
  fontWeight: 600,
  padding: '4px 12px',
  minWidth: 'auto',
  fontSize: '0.75rem',
  boxShadow: 'none',
  backgroundColor: theme.palette.mode === 'dark' ? '#d0bcff' : '#6200ee',
  color: theme.palette.mode === 'dark' ? '#000' : '#fff',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#cabcfc' : '#5000d2',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  '&.Mui-disabled': {
    backgroundColor: alpha(theme.palette.action.disabled, 0.1),
    color: theme.palette.action.disabled,
  },
  [theme.breakpoints.down('sm')]: {
    padding: '2px 8px',
    fontSize: '0.7rem',
  }
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  background: `linear-gradient(45deg, #d0bcff 30%, ${alpha('#d0bcff', 0.8)} 90%)`,
  color: '#1a1a1a',
  border: 'none',
  boxShadow: '0 3px 5px 2px rgba(208, 188, 255, 0.2)',
  borderRadius: 20,
  padding: '0 10px',
  '& .MuiChip-label': {
    fontSize: '0.9rem',
    '@media (max-width: 600px)': {
      fontSize: '0.8rem',
    },
  },
}));

const BalanceChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.1rem',
  background: `linear-gradient(45deg, #d0bcff 30%, ${alpha('#d0bcff', 0.8)} 90%)`,
  color: '#1a1a1a',
  boxShadow: '0 3px 5px 2px rgba(208, 188, 255, 0.2)',
  borderRadius: 20,
  padding: '5px 15px',
  '@media (max-width: 600px)': {
    fontSize: '1rem',
    padding: '4px 12px',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    backgroundColor: '#d0bcff',
  },
  '& .MuiTab-root': {
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: '#d0bcff',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, #d0bcff 30%, ${alpha('#d0bcff', 0.8)} 90%)`,
  color: '#1a1a1a',
  fontWeight: 'bold',
  padding: '8px 24px',
  borderRadius: 25,
  boxShadow: '0 3px 5px 2px rgba(208, 188, 255, 0.2)',
  '&:hover': {
    background: `linear-gradient(45deg, ${alpha('#d0bcff', 0.9)} 30%, #d0bcff 90%)`,
  },
  '@media (max-width: 600px)': {
    padding: '6px 16px',
    fontSize: '0.9rem',
  },
}));

const BadgeDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '90%',
    width: '400px',
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '95%',
      margin: theme.spacing(1),
      maxHeight: '85vh',
    },
    zIndex: 1000000
  },
  '& .MuiBackdrop-root': {
    zIndex: 999999
  }
}));

const BadgeDialogImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxHeight: '200px',
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    maxHeight: '150px',
  }
}));

const BadgeDialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const BadgeDialogTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  '@media (max-width: 600px)': {
    fontSize: '1.25rem',
  },
}));

const BadgeDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  }
}));

const BadgeDialogDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
  lineHeight: 1.5,
  padding: theme.spacing(1.5),
  background: alpha(theme.palette.background.default, 0.5),
  borderRadius: 12,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));

const BadgeDialogFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5),
    marginTop: theme.spacing(1),
  }
}));

const CreatorInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  }
}));

const CreatorAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
  }
}));

const OwnerSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  background: alpha(theme.palette.success.main, 0.1),
  borderRadius: 16,
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0, 255, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  }
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  background: alpha(theme.palette.background.paper, 0.1),
  borderRadius: 16,
  marginBottom: theme.spacing(1.5),
  boxShadow: '0 2px 8px rgba(208, 188, 255, 0.1)',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(1),
  background: alpha(theme.palette.background.paper, 0.5),
  borderRadius: 12,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75),
  }
}));

const BadgeGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  }
}));

const SortSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 160,
  margin: theme.spacing(0, 2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    background: alpha(theme.palette.background.paper, 0.9),
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
    margin: theme.spacing(1, 0),
  },
}));

const CopiesChip = styled(Chip)(({ theme, issoldout }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  height: 24,
  borderRadius: 12,
  fontWeight: 500,
  backgroundColor: issoldout === 'true' 
    ? alpha(theme.palette.error.main, 0.1)
    : alpha(theme.palette.mode === 'dark' ? '#d0bcff' : '#6200ee', 0.1),
  color: issoldout === 'true'
    ? theme.palette.error.main
    : theme.palette.mode === 'dark' ? '#d0bcff' : '#6200ee',
  border: `1px solid ${issoldout === 'true' 
    ? alpha(theme.palette.error.main, 0.2) 
    : alpha(theme.palette.mode === 'dark' ? '#d0bcff' : '#6200ee', 0.2)}`,
  backdropFilter: 'blur(4px)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  '& .MuiChip-label': {
    fontSize: '0.7rem',
    padding: '0 8px',
    letterSpacing: '0.02em',
  },
  [theme.breakpoints.down('sm')]: {
    height: 20,
    top: 6,
    right: 6,
    '& .MuiChip-label': {
      fontSize: '0.65rem',
    }
  }
}));

const BadgeShopPage = () => {
  const { user } = useContext(AuthContext);
  const [badges, setBadges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [purchaseStep, setPurchaseStep] = useState(0);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    price: '',
    royalty_percentage: 30,
    max_copies: '',
    image: null
  });
  const [openBadgeDialog, setOpenBadgeDialog] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Функция для формирования правильного URL для изображений бейджей
  const getBadgeImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Если путь уже содержит полный URL, возвращаем его
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Если путь начинается с /, то это уже относительный путь от корня
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Добавляем префикс к пути, если он отсутствует
    if (!imagePath.startsWith('static/')) {
      return `/static/images/bages/shop/${imagePath}`;
    }
    
    // Иначе добавляем только слеш в начале
    return `/${imagePath}`;
  };

  useEffect(() => {
    fetchBadges();
    fetchUserPoints();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/badges/shop?sort=newest');
      const badges = response.data.badges.map(badge => ({
        ...badge,
        creator: badge.creator || {
          username: 'Неизвестный пользователь',
          name: 'Неизвестный пользователь',
          avatar_url: null
        },
        owners: badge.purchases.map(purchase => ({
          id: purchase.buyer_id,
          username: purchase.buyer?.username || 'Неизвестный пользователь',
          name: purchase.buyer?.name || 'Неизвестный пользователь',
          avatar_url: purchase.buyer?.avatar_url || null,
          purchase_date: purchase.purchase_date
        }))
      }));
      // Ensure newest badges are first by sorting by ID in descending order
      badges.sort((a, b) => b.id - a.id);
      setBadges(badges);
    } catch (error) {
      console.error('Ошибка при загрузке бейджиков:', error);
      setError('Ошибка при загрузке бейджиков');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (err) {
      console.error('Ошибка при загрузке баллов:', err);
    }
  };

  const handleCreateBadge = async () => {
    try {
      // Проверяем обязательные поля
      if (!newBadge.name || !newBadge.description || !newBadge.price || !newBadge.image) {
        setError('Пожалуйста, заполните все обязательные поля');
        return;
      }

      // Проверяем, что цена является положительным числом
      const price = parseInt(newBadge.price);
      if (isNaN(price) || price <= 0) {
        setError('Цена должна быть положительным числом');
        return;
      }

      const formData = new FormData();
      formData.append('name', newBadge.name);
      formData.append('description', newBadge.description);
      formData.append('price', price);
      formData.append('royalty_percentage', newBadge.royalty_percentage);
      
      // Если указано max_copies = 1, это значит что бейдж только для создателя
      const maxCopies = parseInt(newBadge.max_copies) || 0;
      if (maxCopies === 1) {
        formData.append('max_copies', 1);
        formData.append('is_sold_out', true); // Помечаем как распроданный сразу
      } else if (newBadge.max_copies) {
        formData.append('max_copies', newBadge.max_copies);
      }
      
      formData.append('image', newBadge.image);
      formData.append('strip_path_prefix', true);
      formData.append('file_path_mode', 'clean');
      formData.append('auto_assign_to_creator', true); // Флаг для автоматической выдачи бейджа создателю

      const response = await axios.post('/api/badges/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setOpenCreateDialog(false);
      setNewBadge({
        name: '',
        description: '',
        price: '',
        royalty_percentage: 30,
        max_copies: '',
        image: null
      });
      fetchBadges();
      fetchUserPoints();
    } catch (err) {
      console.error('Ошибка при создании бейджика:', err);
      setError(err.response?.data?.error || 'Ошибка при создании бейджика');
    }
  };

  const handlePurchaseBadge = async (badge) => {
    if (isPurchasing) return; // Предотвращаем повторные нажатия
    
    try {
      // Устанавливаем флаг покупки
      setIsPurchasing(true);
      
      // Анимация начала транзакции - переход к шагу подтверждения с анимацией
      setPurchaseStep(1.5); // Промежуточное значение для анимации
      
      // Имитируем задержку сети для анимации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Запрос на сервер
      await axios.post(`/api/badges/purchase/${badge.id}`, {
        // Указываем бэкенду, что нужно удалить префикс badges/ из image_path перед сохранением
        badge_info: {
          // Имя для поля bage в Achievement
          name: badge.name !== 'shop_1' ? badge.name : 'Бейджик',
          // Флаг для удаления префикса badges/ из пути
          remove_badge_prefix: true,
          // Добавляем префикс shop/ для покупок
          add_shop_prefix: true
        }
      });
      
      // Успешная покупка
      setPurchaseStep(2);
      setPurchaseSuccess(true);
      setShowConfetti(true); // Запускаем конфетти при успешной покупке
      
      // Обновляем данные и сбрасываем состояния
      setTimeout(() => {
        setOpenPurchaseDialog(false);
        setPurchaseStep(0);
        setPurchaseSuccess(false);
        setShowConfetti(false);
        fetchBadges();
        fetchUserPoints();
        setIsPurchasing(false); // Сбрасываем флаг покупки
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при покупке бейджика');
      setPurchaseStep(0);
      setIsPurchasing(false); // Сбрасываем флаг покупки при ошибке
    }
  };

  const handleOpenPurchaseDialog = (badge) => {
    setSelectedBadge(badge);
    setPurchaseStep(0);
    setPurchaseSuccess(false);
    setOpenPurchaseDialog(true);
  };

  const handleNextPurchaseStep = () => {
    setPurchaseStep(1);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      setNewBadge({ ...newBadge, image: file });
    } else {
      setError('Пожалуйста, загрузите SVG файл');
    }
  };

  const handleBadgeClick = (badge) => {
    console.log('Выбранный бейджик:', badge);
    setSelectedBadge(badge);
    setOpenBadgeDialog(true);
  };

  const handleCloseBadgeDialog = () => {
    setOpenBadgeDialog(false);
    setSelectedBadge(null);
  };

  // Sorting function for badges
  const getSortedBadges = (badges) => {
    if (!badges.length) return [];
    
    switch (sortOption) {
      case 'newest':
        // Sort by id descending (higher id = newer)
        return [...badges].sort((a, b) => b.id - a.id);
      case 'oldest':
        // Sort by id ascending (lower id = older)
        return [...badges].sort((a, b) => a.id - b.id);
      case 'popular':
        // Sort by number of purchases (most popular)
        return [...badges].sort((a, b) => (b.purchases?.length || 0) - (a.purchases?.length || 0));
      case 'price-low':
        // Sort by price (lowest first)
        return [...badges].sort((a, b) => a.price - b.price);
      case 'price-high':
        // Sort by price (highest first)
        return [...badges].sort((a, b) => b.price - a.price);
      default:
        return badges;
    }
  };

  // filter and sort badges
  const processedBadges = () => {
    // First filter by tab
    let filtered = badges;
    if (tabValue === 1) {
      filtered = badges.filter(badge => badge.creator_id === user?.id);
    } else if (tabValue === 2) {
      filtered = badges.filter(badge => badge.purchases?.some(p => p.buyer_id === user?.id));
    }

    // Then sort
    return getSortedBadges(filtered);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4, pb: isMobile ? 12 : 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={isMobile ? 2 : 4} flexDirection={isMobile ? 'column' : 'row'} gap={2}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom>
          Магазин бейджиков
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <BalanceChip
            icon={<AccountBalanceWalletIcon />}
            label={`${userPoints} баллов`}
          />
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Создать бейджик
          </StyledButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        mb: 3,
        gap: 2
      }}>
        <StyledTabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant={isMobile ? 'fullWidth' : 'standard'}
          centered={!isMobile}
          sx={{ mb: isMobile ? 2 : 0 }}
        >
          <Tab label="Все бейджики" />
          <Tab label="Мои бейджики" />
          <Tab label="Купленные" />
        </StyledTabs>

        <SortSelect size="small">
          <InputLabel id="sort-select-label">
            <Box display="flex" alignItems="center" gap={0.5}>
              <SortIcon fontSize="small" />
              <span>Сортировка</span>
            </Box>
          </InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortOption}
            onChange={handleSortChange}
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                <SortIcon fontSize="small" />
                <span>Сортировка</span>
              </Box>
            }
            size="small"
          >
            <MenuItem value="newest">
              <Box display="flex" alignItems="center" gap={1}>
                <NewReleasesIcon fontSize="small" />
                <span>Сначала новые</span>
              </Box>
            </MenuItem>
            <MenuItem value="oldest">
              <Box display="flex" alignItems="center" gap={1}>
                <NewReleasesIcon fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
                <span>Сначала старые</span>
              </Box>
            </MenuItem>
            <MenuItem value="popular">
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon fontSize="small" />
                <span>Популярные</span>
              </Box>
            </MenuItem>
            <MenuItem value="price-low">
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoneyIcon fontSize="small" />
                <span>Дешевле</span>
              </Box>
            </MenuItem>
            <MenuItem value="price-high">
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoneyIcon fontSize="small" sx={{ transform: 'scale(1.2)' }} />
                <span>Дороже</span>
              </Box>
            </MenuItem>
          </Select>
        </SortSelect>
      </Box>

      <Grid container spacing={isMobile ? 1 : 2}>
        {processedBadges().map((badge) => (
          <Grid item xs={6} sm={4} md={3} key={badge.id}>
            <StyledCard onClick={() => handleBadgeClick(badge)} sx={{ cursor: 'pointer', height: '100%' }}>
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <BadgeImage 
                  className="badge-image"
                  src={`/static/images/bages/shop/${badge.image_path}`}
                  alt={badge.name || 'Бейджик'} 
                />
                <BadgeOverlay className="badge-overlay">
                  <Typography variant="body2" color="white" sx={{ textAlign: 'center' }}>
                    Нажмите для подробностей
                  </Typography>
                </BadgeOverlay>
                {badge.max_copies > 0 && (
                  <CopiesChip
                    size="small"
                    label={`${badge.copies_sold || 0}/${badge.max_copies}`}
                    issoldout={((badge.max_copies === 1 && badge.copies_sold >= 1) || 
                      (badge.max_copies && badge.copies_sold >= badge.max_copies)).toString()}
                  />
                )}
              </Box>
              
              <BadgeCardHeader>
                <BadgeTitle variant="subtitle1">
                  {badge.name || 'Бейджик без названия'}
                </BadgeTitle>
              </BadgeCardHeader>
              
              <BadgeCardContent>
                <BadgeDescription variant="body2">
                  {badge.description || 'Описание отсутствует'}
                </BadgeDescription>
                
                <BadgeCreator>
                  <BadgeCreatorAvatar 
                    src={badge.creator?.avatar_url} 
                    alt={badge.creator?.name || 'Создатель'} 
                  />
                  <BadgeCreatorName variant="caption">
                    {badge.creator?.name || 'Создатель'}
                  </BadgeCreatorName>
                </BadgeCreator>
                
                <BadgeFooter>
                  <BadgePrice>
                    <BadgePriceIcon />
                    <BadgePriceText>
                      {badge.price} баллов
                    </BadgePriceText>
                  </BadgePrice>
                  {(badge.max_copies === 1 && badge.copies_sold >= 1) || 
                    (badge.max_copies && badge.copies_sold >= badge.max_copies) ? (
                    <BadgeBuyButton
                      variant="outlined"
                      color="error"
                      disabled
                    >
                      Распродано
                    </BadgeBuyButton>
                  ) : !badge.purchases?.some(p => p.buyer_id === user?.id) && (
                    <BadgeBuyButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPurchaseDialog(badge);
                      }}
                      disabled={userPoints < badge.price}
                    >
                      Купить
                    </BadgeBuyButton>
                  )}
                </BadgeFooter>
              </BadgeCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <BadgeDialog
        open={openBadgeDialog}
        onClose={handleCloseBadgeDialog}
        fullScreen={false}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        PaperProps={{
          style: {
            background: theme.palette.background.default,
            borderRadius: 20,
            overflow: 'hidden',
            zIndex: 1000000,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          },
        }}
      >
        {selectedBadge && (
          <>
            <BadgeDialogHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BadgeDialogTitle variant="h5">
                  {selectedBadge.name !== 'shop_1' ? selectedBadge.name : 'Бейджик без названия'}
                </BadgeDialogTitle>
                {selectedBadge.max_copies > 0 && (
                  <CopiesChip
                    size="small"
                    label={`${selectedBadge.copies_sold || 0}/${selectedBadge.max_copies}`}
                    issoldout={((selectedBadge.max_copies === 1 && selectedBadge.copies_sold >= 1) || 
                      (selectedBadge.max_copies && selectedBadge.copies_sold >= selectedBadge.max_copies)).toString()}
                    sx={{ position: 'static', my: 0, ml: 1 }}
                  />
                )}
              </Box>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseBadgeDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </BadgeDialogHeader>
            <BadgeDialogContent>
              <Box sx={{ position: 'relative', mb: 4 }}>
                <BadgeDialogImage src={getBadgeImageUrl(selectedBadge.image_path)} alt={selectedBadge.name} />
              </Box>
              
              <CreatorInfo>
                <CreatorAvatar src={selectedBadge.creator?.avatar_url} alt={selectedBadge.creator?.name} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Создатель
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {selectedBadge.creator?.name || 'Создатель'}
                  </Typography>
                </Box>
              </CreatorInfo>

              {selectedBadge.purchases?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Владельцы
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedBadge.purchases.map(purchase => (
                      <Box
                        key={purchase.buyer_id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          boxShadow: 1
                        }}
                      >
                        <Avatar
                          src={purchase.buyer?.avatar_url}
                          alt={purchase.buyer?.name}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography variant="body2">
                          {purchase.buyer?.name || 'Пользователь'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <BadgeDialogDescription variant="body1">
                {selectedBadge.description || 'Описание отсутствует'}
              </BadgeDialogDescription>

              <StatsBox>
                <StatItem>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {selectedBadge.max_copies > 0 ? 'Продано копий' : 'Всего продано'}
                  </Typography>
                  <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    {selectedBadge.max_copies > 0 
                      ? `${selectedBadge.purchases?.length || 0}/${selectedBadge.max_copies}`
                      : selectedBadge.purchases?.length || 0
                    }
                  </Typography>
                </StatItem>
                <StatItem>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Доход создателя
                  </Typography>
                  <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    {Math.round(((selectedBadge.purchases?.length || 0) * selectedBadge.price * 0.3))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    баллов
                  </Typography>
                </StatItem>
              </StatsBox>
            </BadgeDialogContent>
            <BadgeDialogFooter>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MonetizationOnIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  {selectedBadge.price} баллов
                </Typography>
              </Box>
              {!selectedBadge.purchases?.some(p => p.buyer_id === user?.id) && selectedBadge.creator_id !== user?.id && (
                <StyledButton
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => {
                    handleCloseBadgeDialog();
                    handleOpenPurchaseDialog(selectedBadge);
                  }}
                  disabled={userPoints < selectedBadge.price}
                  sx={{ minWidth: 120 }}
                >
                  Купить
                </StyledButton>
              )}
            </BadgeDialogFooter>
          </>
        )}
      </BadgeDialog>

      {/* Диалог создания бейджика */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)} 
        maxWidth="sm" 
        fullWidth
        sx={{ 
          position: 'fixed',
          zIndex: 1000000,
          '& .MuiBackdrop-root': {
            position: 'fixed',
          }
        }}
      >
        <DialogTitle>
          Создание нового бейджика
          <IconButton
            aria-label="close"
            onClick={() => setOpenCreateDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Название"
              value={newBadge.name}
              onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Описание"
              multiline
              rows={3}
              value={newBadge.description}
              onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Цена (баллов)"
              type="number"
              value={newBadge.price}
              onChange={(e) => setNewBadge({ ...newBadge, price: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Максимальное количество копий"
              type="number"
              value={newBadge.max_copies}
              onChange={(e) => setNewBadge({ ...newBadge, max_copies: e.target.value })}
              margin="normal"
              helperText="Оставьте пустым для неограниченного количества"
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Загрузить SVG изображение
              <input
                type="file"
                hidden
                accept=".svg"
                onChange={handleImageChange}
              />
            </Button>
            {newBadge.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Выбран файл: {newBadge.image.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Отмена</Button>
          <Button
            onClick={handleCreateBadge}
            variant="contained"
            disabled={!newBadge.name || !newBadge.price || !newBadge.image}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог покупки бейджика - стилизован как процесс оформления заказа */}
      <Dialog 
        open={openPurchaseDialog} 
        onClose={() => {
          if (purchaseStep !== 2) {
            setOpenPurchaseDialog(false);
            setPurchaseStep(0);
          }
        }}
        maxWidth="sm"
        fullWidth
        sx={{ 
          position: 'fixed',
          zIndex: 1000000,
          '& .MuiBackdrop-root': {
            position: 'fixed',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          Покупка бейджика
          {purchaseStep !== 2 && (
            <IconButton
              aria-label="close"
              onClick={() => setOpenPurchaseDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedBadge && (
            <>
              <Stepper activeStep={purchaseStep} sx={{ mt: 3, mb: 4 }}>
                <Step>
                  <StepLabel>Информация</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Подтверждение</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Завершение</StepLabel>
                </Step>
              </Stepper>
              
              {purchaseStep === 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: 100, height: 100, mr: 3 }}>
                    <img 
                      src={getBadgeImageUrl(selectedBadge.image_path)} 
                      alt={selectedBadge.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>{selectedBadge.name}</Typography>
                    <Typography variant="body1" gutterBottom>{selectedBadge.description}</Typography>
                    <PriceChip 
                      icon={<MonetizationOnIcon />} 
                      label={`${selectedBadge.price} баллов`}
                      variant="outlined"
                      size="medium"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              )}
              
              {purchaseStep === 1 && (
                <Box>
                  <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Детали покупки:
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Название:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedBadge.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Стоимость:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {selectedBadge.price} баллов
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Ваш баланс после покупки:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {userPoints - selectedBadge.price} баллов
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary">
                      Бейджик будет добавлен в ваши достижения сразу после покупки
                    </Typography>
                  </Paper>
                </Box>
              )}
              
              {purchaseStep === 2 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {purchaseSuccess ? (
                    <>
                      {showConfetti && (
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 1,
                          animation: 'confetti 1s ease-out forwards',
                          '@keyframes confetti': {
                            '0%': { opacity: 0 },
                            '100%': { opacity: 1 }
                          }
                        }}>
                          {/* Анимированные элементы конфетти */}
                          {[...Array(30)].map((_, i) => (
                            <Box
                              key={i}
                              sx={{
                                position: 'absolute',
                                width: Math.random() * 10 + 5,
                                height: Math.random() * 10 + 5,
                                backgroundColor: [
                                  '#3f51b5', '#f50057', '#00e676', '#ffea00', '#9c27b0',
                                  '#e91e63', '#2196f3', '#ff9800', '#4caf50', '#cddc39'
                                ][Math.floor(Math.random() * 10)],
                                borderRadius: '50%',
                                left: `${Math.random() * 100}%`,
                                top: 0,
                                animation: `fall${i % 3} ${Math.random() * 2 + 1}s linear infinite`,
                                '@keyframes fall0': {
                                  to: { transform: 'translateY(400px) rotate(360deg)', opacity: 0 }
                                },
                                '@keyframes fall1': {
                                  to: { transform: 'translateY(400px) rotate(-360deg)', opacity: 0 }
                                },
                                '@keyframes fall2': {
                                  to: { transform: 'translateY(400px) rotate(720deg)', opacity: 0 }
                                }
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      <Box sx={{
                        animation: 'pop-in 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards',
                        '@keyframes pop-in': {
                          '0%': { transform: 'scale(0)', opacity: 0 },
                          '80%': { transform: 'scale(1.1)', opacity: 1 },
                          '100%': { transform: 'scale(1)', opacity: 1 }
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 2
                      }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h6" gutterBottom align="center">
                          Поздравляем с покупкой!
                        </Typography>
                        <Typography variant="body1" align="center">
                          Бейджик "{selectedBadge.name}" успешно добавлен в ваши достижения.
                        </Typography>
                        
                        {/* Анимированное отображение нового баланса */}
                        <Box sx={{ 
                          mt: 3,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          width: '100%',
                          maxWidth: 300,
                          animation: 'fade-in 1s ease-in-out forwards',
                          '@keyframes fade-in': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                          }
                        }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Новый баланс:
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                            {userPoints - (selectedBadge?.price || 0)} баллов
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <CircularProgress size={50} />
                      <Typography variant="body1">
                        Обработка транзакции...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #eee', pt: 2 }}>
          {purchaseStep === 0 && (
            <>
              <Button onClick={() => setOpenPurchaseDialog(false)}>Отмена</Button>
              <Button
                onClick={handleNextPurchaseStep}
                variant="contained"
                disabled={userPoints < (selectedBadge?.price || 0)}
              >
                Продолжить
              </Button>
            </>
          )}
          
          {purchaseStep === 1 && (
            <>
              <Button onClick={() => setPurchaseStep(0)} disabled={isPurchasing}>Назад</Button>
              <Button
                onClick={() => handlePurchaseBadge(selectedBadge)}
                variant="contained"
                color="primary"
                disabled={isPurchasing}
                startIcon={isPurchasing ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isPurchasing ? 'Обработка...' : 'Подтвердить покупку'}
              </Button>
            </>
          )}
          
          {purchaseStep === 2 && purchaseSuccess && (
            <Button
              onClick={() => {
                setOpenPurchaseDialog(false);
                setPurchaseStep(0);
              }}
              variant="contained"
              color="primary"
              sx={{ mx: 'auto' }}
            >
              Готово
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BadgeShopPage; 