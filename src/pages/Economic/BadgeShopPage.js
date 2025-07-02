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
  DialogActions as MuiDialogActions,
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
  InputLabel,
  AlertTitle
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { AuthContext } from '../../context/AuthContext';
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
import { useNavigate, useLocation } from 'react-router-dom';
import BadgeShopBottomNavigation from '../../components/BadgeShopBottomNavigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
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
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(40px)',
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
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      borderRadius: 0,
      maxHeight: '100vh',
    },
    zIndex: 1000000,
    background: 'rgba(18, 18, 18, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
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


const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    zIndex: 999999999999
  },
  "& .MuiDialog-paper": {
    borderRadius: 16,
    background: theme.palette.mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(208, 188, 255, 0.3)',
    overflow: 'hidden',
    maxWidth: '450px',
    width: '100%',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      borderRadius: 0,
    },
  },
  "& .MuiDialogTitle-root": {
    fontSize: '1.2rem',
    fontWeight: 500
  }
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(208, 188, 255, 0.2)'}`,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, rgba(208, 188, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%)'
    : 'linear-gradient(90deg, rgba(208, 188, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
}));

const HeaderGlow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -50,
  right: -50,
  width: 150,
  height: 150,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(208, 188, 255, 0.3) 0%, rgba(208, 188, 255, 0) 70%)',
  zIndex: 0
}));

const DialogHeaderContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center'
}));

const DialogActions = styled(MuiDialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.4)'
    : 'rgba(255, 255, 255, 0.6)',
  borderTop: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(208, 188, 255, 0.2)'}`,
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(0, 0, 0, 0.2)',
  color: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.7)'
    : 'rgba(0, 0, 0, 0.7)',
  '&:hover': {
    borderColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(0, 0, 0, 0.4)',
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)'
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  background: 'linear-gradient(45deg, #6200ee 30%, #9c64f2 90%)',
  color: '#fff',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2.5),
  borderRadius: 8,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(208, 188, 255, 0.05)'
    : 'rgba(208, 188, 255, 0.1)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(208, 188, 255, 0.2)'
    : 'rgba(208, 188, 255, 0.3)'}`,
  marginBottom: theme.spacing(2),
}));

const BadgeShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const [badges, setBadges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [openBadgeDialog, setOpenBadgeDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState(0);
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    price: '',
    royalty_percentage: 30,
    max_copies: '',
    image: null
  });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [createdBadgesCount, setCreatedBadgesCount] = useState(0);
  const [badgeLimitReached, setBadgeLimitReached] = useState(false);
  const [badgeLimit, setBadgeLimit] = useState(3); 
  const [userSubscription, setUserSubscription] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get('/api/user/subscription/status');
      if (response.data.active) {
        setUserSubscription(response.data);
        updateBadgeLimit(response.data.subscription_type);
      } else {
        setUserSubscription(null);
        setBadgeLimit(3); 
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setUserSubscription(null);
      setBadgeLimit(3);
    }
  };
  
  
  const updateBadgeLimit = (subscriptionType) => {
    if (!subscriptionType) {
      setBadgeLimit(3); 
      return;
    }
    
    
    const subType = subscriptionType.toLowerCase().trim();
    
    if (subType === 'basic') {
      setBadgeLimit(5);
    } else if (subType === 'premium') {
      setBadgeLimit(8);
    } else if (subType === 'ultimate' || subType.includes('ultimate')) {
      setBadgeLimit(Infinity); 
    } else {
      setBadgeLimit(3);
    }
  };
  
  
  const fetchCreatedBadgesCount = async () => {
    try {
      const response = await axios.get('/api/badges/created');
      if (response.data && response.data.total_badges !== undefined) {
        setCreatedBadgesCount(response.data.total_badges);
        
        
        
        const isUltimate = userSubscription && userSubscription.subscription_type && 
          (userSubscription.subscription_type.toLowerCase() === 'ultimate' || 
           userSubscription.subscription_type.toLowerCase().includes('ultimate'));
        
        if (isUltimate) {
          setBadgeLimitReached(false);
        } else {
          setBadgeLimitReached(response.data.total_badges >= badgeLimit);
        }
      }
    } catch (error) {
      console.error('Error fetching created badges count:', error);
    }
  };

  useEffect(() => {
    fetchBadges();
    fetchUserPoints();
    fetchSubscriptionStatus();
  }, []);
  
  
  useEffect(() => {
    const isUltimate = userSubscription && userSubscription.subscription_type && 
      (userSubscription.subscription_type.toLowerCase() === 'ultimate' || 
       userSubscription.subscription_type.toLowerCase().includes('ultimate'));
    
    if (isUltimate) {
      setBadgeLimitReached(false);
    } else {
      setBadgeLimitReached(createdBadgesCount >= badgeLimit);
    }
  }, [badgeLimit, createdBadgesCount, userSubscription]);
  
  
  useEffect(() => {
    fetchCreatedBadgesCount();
  }, [userSubscription]);

  // Открытие бейджика по openBadgeId из state
  useEffect(() => {
    if (location.state && location.state.openBadgeId && badges.length > 0) {
      const badgeToOpen = badges.find(b => String(b.id) === String(location.state.openBadgeId));
      if (badgeToOpen) {
        setSelectedBadge(badgeToOpen);
        setOpenBadgeDialog(true);
        // Очищаем state, чтобы при повторном заходе не открывалось снова
        navigate('/badge-shop', { replace: true, state: {} });
      }
    }
  }, [location.state, badges]);

  const getBadgeImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return `/static/images/bages/shop/${imagePath}`;
  };

  const fetchBadges = async () => {
      setLoading(true);
    try {
      const response = await axios.get('/api/badges/shop');
      setBadges(response.data.badges || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
      setError('Ошибка при загрузке бейджиков');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const handleCreateBadge = async () => {
    try {
      
      

      
      if (!newBadge.name || !newBadge.description || !newBadge.price || !newBadge.image) {
        setError('Пожалуйста, заполните все обязательные поля');
        return;
      }

      
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
      
      
      const maxCopies = parseInt(newBadge.max_copies) || 0;
      if (maxCopies === 1) {
        formData.append('max_copies', 1);
        formData.append('is_sold_out', true); 
      } else if (newBadge.max_copies) {
        formData.append('max_copies', newBadge.max_copies);
      }
      
      formData.append('image', newBadge.image);
      formData.append('strip_path_prefix', true);
      formData.append('file_path_mode', 'clean');
      formData.append('auto_assign_to_creator', true); 

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
      
      
      
      await fetchCreatedBadgesCount();
      fetchBadges();
      fetchUserPoints();
    } catch (err) {
      console.error('Ошибка при создании бейджика:', err);
      setError(err.response?.data?.error || 'Ошибка при создании бейджика');
    }
  };

  const handlePurchaseBadge = async (badge) => {
    if (isPurchasing) return; 
    
    try {
      
      setIsPurchasing(true);
      
      
      setPurchaseStep(1.5); 
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      await axios.post(`/api/badges/purchase/${badge.id}`, {
        
        badge_info: {
          
          name: badge.name !== 'shop_1' ? badge.name : 'Бейджик',
          
          remove_badge_prefix: true,
          
          add_shop_prefix: true
        }
      });
      
      
      setPurchaseStep(2);
      setPurchaseSuccess(true);
      setShowConfetti(true); 
      
      
      setTimeout(() => {
        setOpenPurchaseDialog(false);
        setPurchaseStep(0);
        setPurchaseSuccess(false);
        setShowConfetti(false);
        fetchBadges();
        fetchUserPoints();
        setIsPurchasing(false); 
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при покупке бейджика');
      setPurchaseStep(0);
      setIsPurchasing(false); 
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
      
      
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setError('Пожалуйста, загрузите SVG файл');
    }
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setOpenBadgeDialog(true);
  };

  const handleCopyBadgeLink = () => {
    const badgeLink = `${window.location.origin}/badge/${selectedBadge.id}`;
    navigator.clipboard.writeText(badgeLink).then(() => {
      // Show a temporary success message
      const copyButton = document.getElementById('copy-badge-link');
      if (copyButton) {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Скопировано!';
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      }
    });
  };

  const handleCloseBadgeDialog = () => {
    setOpenBadgeDialog(false);
    setSelectedBadge(null);
  };

  
  const getSortedBadges = (badges) => {
    if (!badges.length) return [];
    
    switch (sortOption) {
      case 'newest':
        
        return [...badges].sort((a, b) => b.id - a.id);
      case 'oldest':
        
        return [...badges].sort((a, b) => a.id - b.id);
      case 'popular':
        
        return [...badges].sort((a, b) => (b.purchases?.length || 0) - (a.purchases?.length || 0));
      case 'price-low':
        
        return [...badges].sort((a, b) => a.price - b.price);
      case 'price-high':
        
        return [...badges].sort((a, b) => b.price - a.price);
      default:
        return badges;
    }
  };

  
  const processedBadges = () => {
    
    let filtered = badges;
    if (tabValue === 0) {
      
      filtered = badges.filter(badge => 
        
        !((badge.max_copies === 1 && badge.copies_sold >= 1) || 
          (badge.max_copies && badge.copies_sold >= badge.max_copies)) &&
        
        !badge.purchases?.some(p => p.buyer_id === user?.id)
      );
    } else if (tabValue === 1) {
      
      filtered = badges.filter(badge => badge.creator_id === user?.id);
    } else if (tabValue === 2) {
      
      filtered = badges.filter(badge => badge.purchases?.some(p => p.buyer_id === user?.id));
    } else if (tabValue === 3) {
      
      filtered = badges.filter(badge => 
        (badge.max_copies === 1 && badge.copies_sold >= 1) || 
        (badge.max_copies && badge.copies_sold >= badge.max_copies)
      );
    }

    
    return getSortedBadges(filtered);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const badgePreviewStyles = {
    previewContainer: {
      display: 'flex', 
      gap: theme.spacing(3),
      marginTop: theme.spacing(2),
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2),
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    previewItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing(1)
    },
    previewLabel: {
      fontSize: 12,
      color: theme.palette.text.secondary
    }
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

      
      {isMobile && (
        <Box sx={{ 
          mb: 2, 
          p: 1.5, 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
            {tabValue === 0 && 'Доступные бейджики'}
            {tabValue === 1 && 'Мои бейджики'}
            {tabValue === 2 && 'Купленные бейджики'}
            {tabValue === 3 && 'Скупленные бейджики'}
          </Typography>
        </Box>
      )}

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
          sx={{ 
            mb: isMobile ? 2 : 0,
            display: { xs: 'none', md: 'flex' } 
          }}
        >
          <Tab label="Доступные" />
          <Tab label="Мои" />
          <Tab label="Купленные" />
          <Tab label="Скупленные" />
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
            zIndex: 1000000000,
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

              <Button
                id="copy-badge-link"
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => {
                  const badgeLink = `${window.location.origin}/badge/${selectedBadge.id}`;
                  navigator.clipboard.writeText(badgeLink).then(() => {
                    const copyButton = document.getElementById('copy-badge-link');
                    if (copyButton) {
                      const originalText = copyButton.textContent;
                      copyButton.textContent = 'Скопировано!';
                      setTimeout(() => {
                        copyButton.textContent = originalText;
                      }, 2000);
                    }
                  });
                }}
                sx={{ mb: 2 }}
              >
                Ссылка
              </Button>

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
          },
          '& .MuiPaper-root': {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                bgcolor: 'primary.light',
                borderRadius: '50%',
                color: 'white',
                mr: 1
              }}
            >
              <AddIcon fontSize="small" />
            </Box>
          Создание нового бейджика
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setOpenCreateDialog(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          padding: theme.spacing(3), 
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ pt: 1 }}>
            
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Лимиты создания бейджиков:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Chip label="Без подписки: 3 бейджика" size="small" />
                <Chip label="Basic: 5 бейджиков" size="small" />
                <Chip label="Premium: 8 бейджиков" size="small" />
                <Chip label="Ultimate: без ограничений" size="small" color="primary" />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Вы создали {createdBadgesCount || 0} из {userSubscription?.subscription_type === 'ultimate' ? '∞' : badgeLimit || 3} бейджиков
              </Typography>
            </Box>
            
            
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Требования к изображению:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Загружайте только SVG формат
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Максимальная ширина: 100px
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                • Ограничения по высоте: 23px, 30px, 60px
              </Typography>
              
              {previewUrl ? (
                <Box sx={badgePreviewStyles.previewContainer}>
                  <Box sx={badgePreviewStyles.previewItem}>
                    <Typography sx={badgePreviewStyles.previewLabel}>23px</Typography>
                    <Box sx={{ 
                      height: 23, 
                      maxWidth: 100, 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '4px',
                      padding: '0 8px',
                      overflow: 'hidden'
                    }}>
                      <img src={previewUrl} alt="Badge preview" style={{ height: '100%', maxWidth: '100%' }} />
                    </Box>
                  </Box>
                  
                  <Box sx={badgePreviewStyles.previewItem}>
                    <Typography sx={badgePreviewStyles.previewLabel}>30px</Typography>
                    <Box sx={{ 
                      height: 30, 
                      maxWidth: 100, 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '4px',
                      padding: '0 8px',
                      overflow: 'hidden'
                    }}>
                      <img src={previewUrl} alt="Badge preview" style={{ height: '100%', maxWidth: '100%' }} />
                    </Box>
                  </Box>
                  
                  <Box sx={badgePreviewStyles.previewItem}>
                    <Typography sx={badgePreviewStyles.previewLabel}>60px</Typography>
                    <Box sx={{ 
                      height: 60, 
                      maxWidth: 100, 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '4px',
                      padding: '0 8px',
                      overflow: 'hidden'
                    }}>
                      <img src={previewUrl} alt="Badge preview" style={{ height: '100%', maxWidth: '100%' }} />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                  Загрузите SVG для просмотра превью
                </Typography>
              )}
            </Box>
            
            <TextField
              fullWidth
              label="Название"
              value={newBadge.name}
              onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
              margin="normal"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
            />
            <TextField
              fullWidth
              label="Описание"
              multiline
              rows={3}
              value={newBadge.description}
              onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
              margin="normal"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
            />
            <TextField
              fullWidth
              label="Цена (баллов)"
              type="number"
              value={newBadge.price}
              onChange={(e) => setNewBadge({ ...newBadge, price: e.target.value })}
              margin="normal"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
            />
            <TextField
              fullWidth
              label="Максимальное количество копий"
              type="number"
              value={newBadge.max_copies}
              onChange={(e) => setNewBadge({ ...newBadge, max_copies: e.target.value })}
              margin="normal"
              helperText="Оставьте пустым для неограниченного количества"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
            />
            <Box
              component="label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                mt: 2,
                borderRadius: '12px',
                border: '2px dashed',
                borderColor: previewUrl ? 'primary.main' : 'divider',
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(0, 0, 0, 0.03)'
                }
              }}
            >
              <input
                type="file"
                hidden
                accept=".svg"
                onChange={handleImageChange}
              />
              <Box sx={{ textAlign: 'center' }}>
                {previewUrl ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img 
                      src={previewUrl} 
                      alt="SVG Preview" 
                      style={{ 
                        height: 80, 
                        maxWidth: '100%', 
                        marginBottom: theme.spacing(2),
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                      }} 
                    />
                    <Typography variant="body2" color="primary">
                      Нажмите, чтобы выбрать другой файл
              </Typography>
                  </Box>
                ) : (
                  <>

                    <Typography variant="subtitle1" gutterBottom>
                      Загрузите SVG изображение
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Перетащите файл сюда или нажмите для выбора
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          padding: theme.spacing(2, 3),
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          backgroundColor: 'rgba(0, 0, 0, 0.02)'
        }}>
          <Button 
            onClick={() => setOpenCreateDialog(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleCreateBadge}
            variant="contained"
            disabled={!newBadge.name || !newBadge.price || !newBadge.image}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              px: 3
            }}
          >
            Создать за 3000 баллов
          </Button>
        </DialogActions>
      </Dialog>

      
      <StyledDialog 
        open={openPurchaseDialog} 
        onClose={() => {
          if (purchaseStep !== 2) {
            setOpenPurchaseDialog(false);
            setPurchaseStep(0);
          }
        }}
        fullWidth
      >
        <DialogHeader>
          <HeaderGlow />
          <DialogHeaderContent>
            <ShoppingCartIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="primary.light">
              Покупка бейджика
            </Typography>
          </DialogHeaderContent>
          {purchaseStep !== 2 && (
            <IconButton
              aria-label="close"
              onClick={() => setOpenPurchaseDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogHeader>
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          {selectedBadge && (
            <>
              <Stepper 
                activeStep={purchaseStep} 
                sx={{ 
                  mt: 3, 
                  mb: 4,
                  '& .MuiStepLabel-label': {
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '0.75rem',
                    }
                  },
                  '& .MuiStepper-root': {
                    flexWrap: 'nowrap',
                  },
                  '& .MuiStep-root': {
                    px: 0,
                  },
                  '& .MuiStepConnector-line': {
                    minHeight: 0,
                  }
                }}
                alternativeLabel={isMobile}
              >
                <Step>
                  <StepLabel>
                    {isMobile ? 'Инфо' : 'Информация'}
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    {isMobile ? 'Подтв.' : 'Подтверждение'}
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    {isMobile ? 'Итог' : 'Завершение'}
                  </StepLabel>
                </Step>
              </Stepper>
              
              {purchaseStep === 0 && (
                <ContentBox>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    mb: 3 
                  }}>
                    <Box sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(208, 188, 255, 0.1)',
                      borderRadius: 2,
                      padding: 1
                    }}>
                      <img 
                        src={getBadgeImageUrl(selectedBadge.image_path)} 
                        alt={selectedBadge.name} 
                        style={{ width: '90%', height: '90%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>{selectedBadge.name}</Typography>
                      <Typography variant="body2" gutterBottom sx={{ opacity: 0.7 }}>{selectedBadge.description}</Typography>
                      <PriceChip 
                        icon={<MonetizationOnIcon />} 
                        label={`${selectedBadge.price} баллов`}
                        variant="outlined"
                        size="medium"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>

                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <AlertTitle>Важное уведомление</AlertTitle>
                    Покупка бейджика является необратимой операцией. Пожалуйста, убедитесь, что вы хотите приобрести этот бейджик.
                  </Alert>
                </ContentBox>
              )}
              
              {purchaseStep === 1 && (
                <ContentBox>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
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
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Ваш баланс после покупки:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {userPoints - selectedBadge.price} баллов
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" color="text.secondary">
                    Бейджик будет добавлен в ваши достижения сразу после покупки
                  </Typography>
                </ContentBox>
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
                          
                          {[...Array(15)].map((_, i) => (
                            <Box
                              key={i}
                              sx={{
                                position: 'absolute',
                                width: Math.random() * 8 + 5,
                                height: Math.random() * 8 + 5,
                                backgroundColor: [
                                  '#6200ee', '#9c64f2', '#d0bcff', '#e9ddff', '#6200ee',
                                  '#9c64f2', '#d0bcff', '#e9ddff', '#6200ee', '#9c64f2'
                                ][Math.floor(Math.random() * 10)],
                                borderRadius: '50%',
                                left: `${Math.random() * 100}%`,
                                top: 0,
                                animation: `fall${i % 3} ${Math.random() * 1.5 + 1}s linear forwards`,
                                '@keyframes fall0': {
                                  to: { transform: 'translateY(300px) rotate(360deg)', opacity: 0 }
                                },
                                '@keyframes fall1': {
                                  to: { transform: 'translateY(300px) rotate(-360deg)', opacity: 0 }
                                },
                                '@keyframes fall2': {
                                  to: { transform: 'translateY(300px) rotate(720deg)', opacity: 0 }
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
                        
                        
                        <Box sx={{ 
                          mt: 3,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          width: '100%',
                          maxWidth: 250,
                          animation: 'fade-in 1s ease-in-out forwards',
                          '@keyframes fade-in': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                          }
                        }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
                            Новый баланс:
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                            {userPoints - Math.ceil(selectedBadge?.price * 1.1)} баллов
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
                      <CircularProgress size={40} />
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
        <DialogActions>
          {purchaseStep === 0 && (
            <>
              <CancelButton 
                onClick={() => setOpenPurchaseDialog(false)} 
                variant="outlined"
              >
                Отмена
              </CancelButton>
              <ActionButton
                onClick={handleNextPurchaseStep}
                disabled={userPoints < (selectedBadge?.price || 0)}
              >
                Продолжить
              </ActionButton>
            </>
          )}
          
          {purchaseStep === 1 && (
            <>
              <CancelButton 
                onClick={() => setPurchaseStep(0)} 
                variant="outlined"
                disabled={isPurchasing}
              >
                Назад
              </CancelButton>
              <ActionButton
                onClick={() => handlePurchaseBadge(selectedBadge)}
                disabled={isPurchasing}
                startIcon={isPurchasing ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {isPurchasing ? 'Обработка...' : 'Подтвердить покупку'}
              </ActionButton>
            </>
          )}
          
          {purchaseStep === 2 && purchaseSuccess && (
            <ActionButton
              onClick={() => {
                setOpenPurchaseDialog(false);
                setPurchaseStep(0);
              }}
              sx={{ mx: 'auto' }}
            >
              Готово
            </ActionButton>
          )}
        </DialogActions>
      </StyledDialog>
      
      
      <BadgeShopBottomNavigation 
        tabValue={tabValue}
        onTabChange={(e, newValue) => setTabValue(newValue)}
      />
    </Container>
  );
};

export default BadgeShopPage; 