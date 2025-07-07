import React, { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  DialogActions as MuiDialogActions,
  TextField,
  Snackbar,
  InputAdornment,
  useMediaQuery,
  TableRow,
  TableCell
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../context/AuthContext';
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
import { ReactComponent as BallsSVG } from '../../assets/balls.svg';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TagIcon from '@mui/icons-material/Tag';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { downloadPdfReceipt } from '../../utils/pdfGenerator';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CasinoIcon from '@mui/icons-material/Casino';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { TransferMenu } from '../../UIKIT';
import StyledTabs from '../../UIKIT/StyledTabs';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoBlock from '../../UIKIT/InfoBlock';
import { useLanguage } from '@/context/LanguageContext';



const BalanceAmount = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: '700',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  color: '#ffffff',
  lineHeight: 1.2,
}));

const TransactionItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateX(4px)',
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
  width: 64,
  height: 64,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  '& svg': {
    width: '100%',
    height: '100%',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
  }
}));

const CreatedBadgeImage = styled('img')({
  width: 50,
  height: 50,
  objectFit: 'contain',
});

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2)
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
  backgroundColor: '#614C93', 
  marginBottom: theme.spacing(0.8),
  '& svg': {
    color: '#fff',
    fontSize: 24,
  },
}));

const ActionButtonText = styled(Typography)(({ theme }) => ({
  fontSize: '0.6rem',
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
    style={{ marginTop: '8px' }}
  >
    {value === index && (
      <Box>
        {children}
      </Box>
    )}
  </div>
);



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

const KeyTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.1)',
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(0, 0, 0, 0.7)',
  }
}));


const DialogAvatar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: 'rgba(156, 100, 242, 0.2)',
  marginRight: theme.spacing(2),
  '& svg': {
    color: '#9c64f2',
    fontSize: 28,
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.1)',
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(0, 0, 0, 0.7)',
  }
}));

const SuggestionsContainer = styled(Box)(({ theme }) => ({
  marginTop: -2,
  marginBottom: theme.spacing(3),
  borderRadius: '0 0 12px 12px',
  backgroundColor: 'rgba(30, 30, 30, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderTop: 'none',
  overflow: 'hidden',
}));

const SuggestionItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  fontSize: '0.9rem',
  marginRight: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  background: 'linear-gradient(45deg, #6200ee 30%, #9c64f2 90%)',
  color: '#fff',
  boxShadow: '0 4px 10px rgba(98, 0, 238, 0.25)',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(98, 0, 238, 0.4)',
  },
  '&:disabled': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(0, 0, 0, 0.12)',
    color: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.26)',
  }
}));


const ReceiptIconButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  }
}));

const SuccessIconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.success.main, 0.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));


const generateReceiptForTransaction = async (transaction) => {
  try {
    
    const transactionId = `TR-${transaction.id || Date.now().toString().slice(-8)}`;
    
    
    const response = await axios.post('/api/user/generate-receipt', {
      transaction_data: {
        transactionId: transactionId,
        amount: Math.abs(transaction.amount),
        recipientUsername: transaction.type === 'transfer' ? 
          (transaction.amount < 0 ? transaction.recipient_username : transaction.sender_username) : '',
        senderUsername: transaction.type === 'transfer' ? 
          (transaction.amount < 0 ? transaction.sender_username : transaction.recipient_username) : '',
        date: transaction.date,
      }
    });
    
    if (response.data && response.data.success) {
      
      const pdfDataUrl = `data:application/pdf;base64,${response.data.pdf_data}`;
      
      
      downloadPdfReceipt(pdfDataUrl, transactionId, response.data.file_path);
    } else {
      throw new Error(t('balance.errors.receipt_generation'));
    }
  } catch (error) {
    console.error('Ошибка при создании чека для транзакции:', error);
  }
};


const TransactionDetailDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    background: theme.palette.mode === 'dark' ? 
      'linear-gradient(135deg, rgba(35, 35, 40, 0.95) 0%, rgba(20, 20, 25, 0.95) 100%)' : 
      'linear-gradient(135deg, rgba(250, 250, 255, 0.95) 0%, rgba(240, 240, 250, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    maxWidth: '500px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      borderRadius: 0,
    }
  }
}));

const TransactionDetailHeader = styled(Box)(({ theme, type }) => ({
  padding: theme.spacing(3, 3, 3.5, 3),
  background: type === 'income' ?
    'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(76, 175, 80, 0.2) 100%)' :
    'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(244, 67, 54, 0.2) 100%)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
}));

const TransactionDetailAmount = styled(Typography)(({ theme, type }) => ({
  fontWeight: 700,
  fontSize: '2.2rem',
  lineHeight: 1.2,
  color: type === 'income' ? theme.palette.success.main : theme.palette.error.main,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const TransactionStatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 12,
  height: 24,
  fontSize: '0.7rem',
  fontWeight: 600,
  backgroundColor: status === 'completed' ? 
    alpha(theme.palette.success.main, 0.1) : 
    alpha(theme.palette.grey[500], 0.1),
  color: status === 'completed' ? 
    theme.palette.success.main : 
    theme.palette.grey[500],
  border: `1px solid ${status === 'completed' ? 
    alpha(theme.palette.success.main, 0.3) : 
    alpha(theme.palette.grey[500], 0.3)}`,
  margin: theme.spacing(0, 0.5),
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:last-child': {
    borderBottom: 'none',
  }
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.6),
  fontSize: '0.85rem',
  fontWeight: 500,
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.85rem',
  fontWeight: 600,
  textAlign: 'right',
  wordBreak: 'break-word',
  maxWidth: '50%',
}));

const TransactionAvatar = styled(Avatar)(({ theme, transactionType }) => ({
  width: 46,
  height: 46,
  borderRadius: 14,
  backgroundColor: transactionType === 'positive' ? 
    alpha(theme.palette.success.main, 0.15) : 
    alpha(theme.palette.error.main, 0.15),
  border: `1px solid ${transactionType === 'positive' ? 
    alpha(theme.palette.success.main, 0.3) : 
    alpha(theme.palette.error.main, 0.3)}`,
  padding: theme.spacing(0.7),
  '& .MuiSvgIcon-root': {
    fontSize: '1.4rem',
  }
}));

const BankStyleTransactionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '2.5px',
  width: '100%',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  }
}));

const TransactionInfo = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flex: 1,
  width: '100%',
  overflow: 'hidden',
}));

const TransactionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '260px',
  '@media (max-width: 600px)': {
    maxWidth: '160px',
  },
}));

const TransactionDate = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: alpha(theme.palette.text.secondary, 0.8),
  marginTop: 2,
}));

const TransactionDetailContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Add styled component for expandable content
const ExpandableContent = styled(Box)(({ theme, expanded }) => ({
  maxHeight: expanded ? '1000px' : '0',
  overflow: 'hidden',
  opacity: expanded ? 1 : 0,
  transition: theme.transitions.create(['opacity', 'max-height'], {
    duration: theme.transitions.duration.standard
  })
}));

const ExpandIcon = styled(ExpandMoreIcon)(({ theme, expanded }) => ({
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  color: 'rgba(255,255,255,0.7)',
}));

const BalancePage = () => {
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  const [newTransferMenuOpen, setNewTransferMenuOpen] = useState(false);
  const [transferData, setTransferData] = useState({ username: '', amount: '', message: '', recipient_id: null });
  const [transferErrors, setTransferErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [userSearch, setUserSearch] = useState({
    loading: false,
    exists: false,
    suggestions: [],
    timer: null
  });
  const [openKeyDialog, setOpenKeyDialog] = useState(false);
  const [keyValue, setKeyValue] = useState('');
  const [isSubmittingKey, setIsSubmittingKey] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [keySuccess, setKeySuccess] = useState(null);
  const [activeTopupTab, setActiveTopupTab] = useState(0);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [gameTransactions, setGameTransactions] = useState([]);
  
  const debounceTimerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [isPointsInfoExpanded, setIsPointsInfoExpanded] = useState(false);
  const { language } = useLanguage();

  
  const allTransactions = React.useMemo(() => {
    const purchases = purchaseHistory.map(purchase => ({
      ...purchase,
      type: 'purchase',
      date: new Date(purchase.purchase_date),
      amount: -purchase.price_paid,
      title: t('balance.transactions.badge_purchase'),
      description: `"${purchase.badge.name}"`,
      icon: <ShoppingCartIcon sx={{ color: 'error.main' }} />
    }));

    const royalties = royaltyHistory.map(royalty => ({
      ...royalty,
      type: 'royalty',
      date: new Date(royalty.purchase_date),
      amount: royalty.royalty_amount,
      title: t('balance.transactions.royalty_from_purchase'),
      description: `${royalty.buyer.name}`,
      buyer_name: royalty.buyer.name,
      badge_name: royalty.badge_name,
      icon: <MonetizationOnIcon sx={{ color: 'success.main' }} />
    }));

    const transfers = transferHistory.map(transfer => {
      const senderId = parseInt(transfer.sender_id, 10);
      const userId = parseInt(user.id, 10);
      const is_sender = senderId === userId;
      
      const isClickerWithdrawal = transfer.sender_id === transfer.recipient_id && 
                               transfer.message === t('balance.transactions.clicker_withdrawal_message');
      
      let title = isClickerWithdrawal ? t('balance.transactions.clicker_withdrawal') : 
                 (is_sender ? t('balance.transactions.transfer') : t('balance.transactions.deposit'));
      let description = isClickerWithdrawal ? t('balance.transactions.clicker_points') : 
                       (is_sender ? transfer.recipient_username : transfer.sender_username);
      
      return {
        ...transfer,
        type: 'transfer',
        date: new Date(transfer.date),
        amount: isClickerWithdrawal ? transfer.amount : (is_sender ? -transfer.amount : transfer.amount),
        title: title,
        description: description,
        is_sender: isClickerWithdrawal ? false : is_sender,
        icon: isClickerWithdrawal 
          ? <TouchAppIcon sx={{ color: 'success.main' }} />
          : (is_sender 
              ? <SendIcon sx={{ color: 'error.main' }} />
              : <AccountBalanceWalletIcon sx={{ color: 'success.main' }} />)
      };
    });

    const usernames = usernamePurchases.map(purchase => ({
      ...purchase,
      type: 'username',
      date: new Date(purchase.purchase_date),
      amount: -purchase.price_paid,
      title: t('balance.transactions.username_purchase'),
      description: `@${purchase.username}`,
      icon: <AccountCircleIcon sx={{ color: 'error.main' }} />
    }));

    const weeklyActivities = gameTransactions
      .filter(transaction => transaction.transaction_type === 'weekly_activity')
      .map(transaction => {
        return {
          ...transaction,
          type: 'weekly_activity',
          date: new Date(transaction.date || transaction.created_at),
          title: t('balance.transactions.weekly_points'),
          description: transaction.description || t('balance.transactions.activity_reward'),
          icon: <TrendingUpIcon sx={{ color: 'success.main' }} />
        };
      });
    

    const otherGameTransactions = gameTransactions
      .filter(transaction => transaction.transaction_type !== 'weekly_activity')
      .map(transaction => {
        let icon = null;
        let title = transaction.description || t('balance.transactions.transaction');
        let type = transaction.transaction_type || 'unknown';
        
        // Игровые транзакции (Blackjack)
        if (type.includes('blackjack')) {
          if (type === 'blackjack_win' || type === 'blackjack_win_21') {
            icon = <CasinoIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.blackjack_win');
          } else if (type === 'blackjack_tie') {
            icon = <CasinoIcon sx={{ color: 'info.main' }} />;
            title = t('balance.transactions.blackjack_tie');
          } else if (type === 'blackjack_lose' || type === 'blackjack_lose_bust') {
            icon = <CasinoIcon sx={{ color: 'error.main' }} />;
            title = t('balance.transactions.blackjack_lose');
          } else if (type === 'blackjack_bet') {
            icon = <CasinoIcon sx={{ color: 'error.main' }} />;
            title = t('balance.transactions.blackjack_bet');
          }
        }
        // Игровые транзакции (Roulette)
        else if (type.includes('roulette')) {
          if (type === 'roulette_win') {
            icon = <CasinoIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.roulette_win');
          } else if (type === 'roulette_bet') {
            icon = <CasinoIcon sx={{ color: 'error.main' }} />;
            title = t('balance.transactions.roulette_bet');
          }
        }
        // Игровые транзакции (Cups)
        else if (type === 'cups_win') {
          icon = <CasinoIcon sx={{ color: 'success.main' }} />;
          title = t('balance.transactions.cups_win');
        }
        // Мини-игры
        else if (type === 'minigame_bet') {
          icon = <SportsEsportsIcon sx={{ color: 'error.main' }} />;
          title = t('balance.transactions.minigame_bet');
        }
        // Аукционы
        else if (type.includes('auction') && !type.includes('username_auction')) {
          if (type === 'auction_bid' || type === 'auction_bid_increase') {
            icon = <TagIcon sx={{ color: 'error.main' }} />;
            title = t('balance.transactions.auction_bid');
          } else if (type === 'auction_bid_refund' || type === 'auction_refund') {
            icon = <TagIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.auction_refund');
          } else if (type === 'auction_sale') {
            icon = <TagIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.auction_sale');
          }
        }
        // Аукционы юзернеймов
        else if (type.includes('username_auction')) {
          if (type === 'username_auction_bid') {
            icon = <AccountCircleIcon sx={{ color: 'error.main' }} />;
            title = t('balance.transactions.username_auction_bid');
          } else if (type === 'username_auction_refund') {
            icon = <AccountCircleIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.username_auction_refund');
          } else if (type === 'username_auction_sale' || type === 'username_bid_accepted_sale') {
            icon = <AccountCircleIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.username_auction_sale');
          }
        }
        // Покупки юзернеймов
        else if (type === 'username_immediate_purchase' || type === 'username_purchase') {
          icon = <AccountCircleIcon sx={{ color: 'error.main' }} />;
          title = t('balance.transactions.username_purchase');
        }
        // Покупки пачек
        else if (type === 'pack_purchase') {
          icon = <ShoppingCartIcon sx={{ color: 'error.main' }} />;
          title = t('balance.transactions.pack_purchase');
        }
        // Маркетплейс
        else if (type.includes('marketplace')) {
          if (type === 'marketplace_buy') {
            icon = <ShoppingCartIcon sx={{ color: 'error.main' }} />;
            title = t('balance.transactions.marketplace_buy');
          } else if (type === 'marketplace_sell') {
            icon = <ShoppingCartIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.marketplace_sell');
          }
        }
        // Передачи предметов
        else if (type === 'item_transfer') {
          icon = <SendIcon sx={{ color: 'error.main' }} />;
          title = t('balance.transactions.item_transfer');
        }
        // Апгрейд предметов
        else if (type === 'item_upgrade') {
          icon = <TrendingUpIcon sx={{ color: 'error.main' }} />;
          title = t('balance.transactions.item_upgrade');
        }
        // Конвертация
        else if (type.includes('conversion')) {
          if (type === 'conversion_deposit') {
            icon = <AccountBalanceWalletIcon sx={{ color: 'success.main' }} />;
            title = t('balance.transactions.conversion_deposit');
          } else if (type === 'conversion_withdrawal') {
            icon = <AccountBalanceWalletIcon sx={{ color: 'error.main' }} />;
            title = t('balance.transactions.conversion_withdrawal');
          }
        }
        // Компенсация
        else if (type === 'compensation') {
          icon = <MonetizationOnIcon sx={{ color: 'success.main' }} />;
          title = t('balance.transactions.compensation');
        }
        // Кастомная активность
        else if (type === 'custom_period_activity') {
          icon = <TrendingUpIcon sx={{ color: 'success.main' }} />;
          title = t('balance.transactions.custom_period_activity');
        }
        // Призы за топ
        else if (type === 'top_prize') {
          icon = <DiamondIcon sx={{ color: 'success.main' }} />;
          title = t('balance.transactions.top_prize');
        }
        // По умолчанию
        else {
          icon = <SportsEsportsIcon sx={{ color: transaction.amount > 0 ? 'success.main' : 'error.main' }} />;
          title = transaction.description || t('balance.transactions.transaction');
        }
        
        return {
          ...transaction, 
          type: 'game',
          date: new Date(transaction.date),
          title: title,
          description: transaction.transaction_type.replace(/_/g, ' '),
          icon: icon
        };
      });
    
    return [...purchases, ...royalties, ...transfers, ...usernames, ...weeklyActivities, ...otherGameTransactions]
      .sort((a, b) => b.date - a.date);
  }, [purchaseHistory, royaltyHistory, transferHistory, usernamePurchases, gameTransactions, user?.id, t]);

  useEffect(() => {
    if (user) {
      
      fetchUserPoints();
      fetchWeeklyEstimate();
      fetchPurchaseHistory();
      fetchRoyaltyHistory();
      fetchCreatedBadges();
      fetchTransferHistory();
      fetchUsernamePurchases();
      fetchSubscriptionStatus();
      fetchGameTransactions();
    }
  }, [user]);

  
  useEffect(() => {
    console.log('Subscription state changed:', subscription);
  }, [subscription]);

  
  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Ошибка при загрузке баллов:', error);
      setError(t('balance.errors.points_loading'));
    }
  };

  
  const fetchWeeklyEstimate = async () => {
    try {
      
      const response = await axios.get('/api/leaderboard/user/' + user.id + '?period=week');
      setWeeklyEstimate(response.data.score || 0);
    } catch (error) {
      console.error('Ошибка при загрузке прогноза:', error);
      setWeeklyEstimate(0);
    }
  };

  
  const fetchPurchaseHistory = async () => {
    try {
      const response = await axios.get('/api/badges/purchases');
      
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

  
  const fetchRoyaltyHistory = async () => {
    try {
      const response = await axios.get('/api/badges/royalties');
      
      console.log('Received royalty data:', response.data);
      setRoyaltyHistory(response.data.royalties || []);
    } catch (error) {
      console.error('Ошибка при загрузке истории роялти:', error);
      setRoyaltyHistory([]);
    }
  };

  
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

  
  const fetchTransferHistory = async () => {
    try {
      const response = await axios.get('/api/user/transfer-history');
      if (response.data && response.data.transfers) {
        setTransferHistory(response.data.transfers);
      }
    } catch (error) {
      console.error('Ошибка при получении истории переводов:', error);
      
    }
  };

  
  const fetchUsernamePurchases = async () => {
    try {
      const response = await axios.get('/api/user/username-purchases');
      if (response.data && response.data.purchases) {
        setUsernamePurchases(response.data.purchases);
      }
    } catch (error) {
      console.error('Ошибка при получении истории покупок юзернеймов:', error);
      
    }
  };

  
  const searchUser = useCallback((username) => {
    // Always clear previous timer first to reset the debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // If username is empty, just reset everything
    if (!username) {
      setUserSearch(prev => ({
        ...prev,
        loading: false,
        exists: false,
        suggestions: [],
      }));
      setTransferData(prev => ({...prev, recipient_id: null}));
      return;
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      // Only show loading and make the API call after timeout
      setUserSearch(prev => ({ ...prev, loading: true }));
      
      axios.get(`/api/user/search-recipients?query=${username}`)
        .then(response => {
          if (response.data && response.data.users) {
            // Find exact match
            const exactMatch = response.data.users.find(
              user => user.username.toLowerCase() === username.toLowerCase()
            );
            
            // Update recipient ID if exact match found
            if (exactMatch) {
              setTransferData(prev => ({...prev, recipient_id: exactMatch.id}));
            } else {
              setTransferData(prev => ({...prev, recipient_id: null}));
            }
            
            // Update search results
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: !!exactMatch,
              suggestions: response.data.users.slice(0, 3),
            }));
          } else {
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: false,
              suggestions: [],
            }));
            setTransferData(prev => ({...prev, recipient_id: null}));
          }
        })
        .catch(error => {
          console.error('Ошибка при поиске пользователя:', error);
          setUserSearch(prev => ({
            ...prev,
            loading: false,
            exists: false,
            suggestions: [],
          }));
          setTransferData(prev => ({...prev, recipient_id: null}));
        });
    }, 1000); // 1 second delay
  }, []);
  
  
  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setTransferData(prev => ({...prev, username}));
    
    // Simple pass to searchUser, which now handles proper debouncing
    if (username.trim()) {
      searchUser(username.trim());
    } else {
      // If empty, reset search state and clear any pending timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setUserSearch(prev => ({
        ...prev,
        loading: false,
        exists: false,
        suggestions: [],
      }));
      setTransferData(prev => ({...prev, recipient_id: null}));
    }
  };
  
  
  const selectSuggestion = (username, userId) => {
    setTransferData(prev => ({...prev, username, recipient_id: userId}));
    setUserSearch(prev => ({
      ...prev,
      loading: false,
      exists: true,
      suggestions: []
    }));
  };

  
  const handleTransferPoints = async () => {
    const errors = {};
    if (!transferData.username) errors.username = t('balance.transfer.errors.enter_username');
    if (!transferData.recipient_id) errors.username = t('balance.transfer.errors.user_not_found');
    if (!transferData.amount) {
      errors.amount = t('balance.transfer.errors.enter_amount');
    } else if (isNaN(transferData.amount) || parseInt(transferData.amount) <= 0) {
      errors.amount = t('balance.transfer.errors.positive_amount');
    } else if (parseInt(transferData.amount) > userPoints) {
      errors.amount = t('balance.transfer.errors.insufficient_points');
    }

    if (Object.keys(errors).length > 0) {
      setTransferErrors(errors);
      return;
    }


    if (isTransferring) return;

    setTransferErrors({});
    setIsTransferring(true);
    
    try {
      
      const response = await axios.post('/api/user/transfer-points', {
        recipient_username: transferData.username,
        recipient_id: transferData.recipient_id,
        amount: parseInt(transferData.amount),
        message: transferData.message
      });
      
      
      fetchUserPoints();
      
      
      setTransferDialogOpen(false);
      
      
      try {
        const now = new Date();
        const transactionId = `TR-${Date.now().toString().slice(-8)}`;
        
        
        const response = await axios.post('/api/user/generate-receipt', {
          transaction_data: {
            transactionId: transactionId,
            amount: parseInt(transferData.amount),
            recipientUsername: transferData.username,
            senderUsername: user.username,
            date: now.toISOString(),
          }
        });
        
        if (response.data && response.data.success) {
          
          const receiptData = {
            dataUrl: `data:application/pdf;base64,${response.data.pdf_data}`,
            filePath: response.data.file_path
          };
          
          setReceiptData(receiptData);
          setTransferSuccess(true);
        } else {
          throw new Error('Не удалось сгенерировать чек на сервере');
        }
      } catch (error) {
        console.error('Ошибка при создании чека:', error);
      }
      
      
      fetchTransferHistory();
      
      
      setTransferData({ username: '', amount: '', message: '', recipient_id: null });
    } catch (error) {
      console.error('Ошибка при переводе баллов:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Ошибка при переводе баллов',
        severity: 'error'
      });
    } finally {
      setIsTransferring(false);
    }
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    
    const userTimezoneOffset = date.getTimezoneOffset();
    
    
    const userDate = new Date(date.getTime() - (userTimezoneOffset * 60000));
    
    
    const formattedDate = userDate.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
      timeZoneName: 'short' 
    });
    
    return formattedDate;
  };

  
  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 50, 0, 0);
    
    return {
      start: monday.toLocaleDateString(language === 'EN' ? 'en-US' : 'ru-RU', { day: 'numeric', month: 'long' }),
      end: sunday.toLocaleDateString(language === 'EN' ? 'en-US' : 'ru-RU', { day: 'numeric', month: 'long' })
    };
  };

  
  const weekRange = useMemo(() => getCurrentWeekRange(), [language]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  
  const formatKeyInput = (input) => {
    
    const cleaned = input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0 && i < 16) {
        formatted += '-';
      }
      if (i < 16) { 
        formatted += cleaned[i];
      }
    }
    
    return formatted;
  };
  
  
  const handleKeyChange = (e) => {
    const formattedKey = formatKeyInput(e.target.value);
    setKeyValue(formattedKey);
    setKeyError('');
  };
  
  
  const isValidKeyFormat = (key) => {
    
    return /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key);
  };
  
  
  const handleRedeemKey = async () => {
    setKeyError('');
    setKeySuccess(null);
    setIsSubmittingKey(true);
    
    try {
      const response = await fetch('/api/user/redeem-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: keyValue }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {

        if (data.error && data.error.includes('Невозможно активировать подписку') && 
            data.error.includes('так как у вас уже есть подписка более высокого уровня')) {
          setKeyError(data.error);
        } else {
          setKeyError(data.error || 'Ошибка при активации ключа');
        }
        setIsSubmittingKey(false);
        return;
      }
      
      if (data.type === 'points') {
        
        setKeySuccess({
          message: data.message,
          type: 'points',
          newBalance: data.new_balance
        });
        
        setUserPoints(data.new_balance);
      } else if (data.type === 'subscription') {
        
        setKeySuccess({
          message: data.message,
          type: 'subscription',
          subscriptionType: data.subscription_type,
          expiresAt: data.expires_at,
          duration_days: data.duration_days
        });
        
        fetchSubscriptionStatus();
      }
      
    } catch (error) {
      console.error('Ошибка при активации ключа:', error);
      setKeyError('Произошла ошибка при активации ключа');
    } finally {
      setIsSubmittingKey(false);
    }
  };

  
  const fetchSubscriptionStatus = async () => {
    try {
      console.log('Fetching subscription status...');
      const response = await axios.get('/api/user/subscription/status');
      
      if (response.data) {
        console.log('Received subscription data:', response.data);
        
        
        if (response.data.active && response.data.subscription_type) {
          setSubscription({
            active: true,
            type: response.data.subscription_type,
            expires_at: response.data.expiration_date,
            
            features: response.data.features || []
          });
        } else {
          
          setSubscription(null);
        }
      } else {
        console.error('Invalid subscription status response');
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscription(null);
    }
  };

  
  const handleOpenTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailDialogOpen(true);
  };

  
  const handleCloseTransactionDetails = () => {
    setDetailDialogOpen(false);
    setSelectedTransaction(null);
  };

  
  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    return `${amount < 0 ? '-' : '+'}${formatNumberWithSpaces(absAmount)}`;
  };

  
  const formatNumberWithSpaces = (number) => {
    if (number === null || number === undefined) return '0';
    
    // Safari-совместимый способ разделения чисел пробелами
    // Используем простую логику без lookahead/lookbehind
    const str = number.toString();
    const parts = [];
    let i = str.length;
    
    while (i > 0) {
      const start = Math.max(0, i - 3);
      parts.unshift(str.slice(start, i));
      i = start;
    }
    
    return parts.join(' ');
  };

  
  const getTransactionId = (transaction) => {
    return `TR-${transaction.id || new Date(transaction.date).getTime().toString().slice(-8)}`;
  };

  const fetchGameTransactions = async () => {
    try {
      const response = await axios.get('/api/user/transactions-history');
      if (response.data && response.data.transactions) {
        setGameTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Ошибка при получении истории игровых транзакций:', error);
    }
  };

  // Add new useEffect to reset loading state when username changes
  useEffect(() => {
    // If user changes the username, cancel any loading state
    if (userSearch.loading) {
      setUserSearch(prev => ({
        ...prev,
        loading: false
      }));
    }
  }, [transferData.username]);

  // Update the dialog close handler
  const handleCloseTransferDialog = () => {
    // Clear the debounce timer properly
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Reset all state
    setTransferDialogOpen(false);
    setTransferData({ username: '', amount: '', message: '', recipient_id: null });
    setTransferErrors({});
    setUserSearch({
      loading: false,
      exists: false,
      suggestions: [],
    });
  };

  // Find the useEffect for dialog closing and update it
  useEffect(() => {
    if (!newTransferMenuOpen && debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [newTransferMenuOpen]);

  // Add a cleanup useEffect after the existing one
  useEffect(() => {
    // Cleanup function for component unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  // Add handler for the new transfer menu
  const handleNewTransferSuccess = (receiptData) => {
    // Don't set transferSuccess to true, as the new component has its own success UI
    // Just update the balance and history
    fetchUserPoints();
    fetchTransferHistory();
  };

  const getTransactionDescription = (transaction) => {
    switch (transaction.transaction_type) {
      case 'weekly_activity':
        return 'Еженедельное начисление баллов за активность';
      case 'custom_period_activity':
        return 'Начисление баллов за активность за период';
      case 'top_prize':
        if (transaction.description.includes('Ultimate подписка')) {
          return 'Приз за 1 место - Ultimate подписка на 30 дней';
        } else if (transaction.description.includes('2 место')) {
          return 'Приз за 2 место - бонусные баллы';
        } else if (transaction.description.includes('3 место')) {
          return 'Приз за 3 место - бонусные баллы';
        }
        return transaction.description;
      case 'compensation':
        return 'Компенсация';
      case 'conversion_deposit':
        return 'Конвертация - пополнение';
      case 'conversion_withdrawal':
        return 'Конвертация - списание';
      case 'blackjack_win':
      case 'blackjack_win_21':
        return 'Выигрыш в блэкджек';
      case 'blackjack_lose':
      case 'blackjack_lose_bust':
        return 'Проигрыш в блэкджек';
      case 'blackjack_tie':
        return 'Ничья в блэкджек';
      case 'blackjack_bet':
        return 'Ставка в блэкджек';
      case 'roulette_win':
        return 'Выигрыш в рулетке';
      case 'roulette_bet':
        return 'Ставка в рулетке';
      case 'cups_win':
        return 'Выигрыш в игре "Чашки"';
      case 'minigame_bet':
        return 'Ставка в мини-игре';
      case 'auction_bid':
      case 'auction_bid_increase':
        return 'Ставка на аукционе';
      case 'auction_bid_refund':
      case 'auction_refund':
        return 'Возврат ставки с аукциона';
      case 'auction_sale':
        return 'Продажа на аукционе';
      case 'username_auction_bid':
        return 'Ставка на аукционе юзернейма';
      case 'username_auction_refund':
        return 'Возврат ставки с аукциона юзернейма';
      case 'username_auction_sale':
      case 'username_bid_accepted_sale':
        return 'Продажа юзернейма на аукционе';
      case 'username_immediate_purchase':
      case 'username_purchase':
        return 'Покупка юзернейма';
      case 'pack_purchase':
        return 'Покупка пачки';
      case 'marketplace_buy':
        return 'Покупка на маркетплейсе';
      case 'marketplace_sell':
        return 'Продажа на маркетплейсе';
      case 'item_transfer':
        return 'Передача предмета';
      case 'item_upgrade':
        return 'Апгрейд предмета';
      case 'purchase':
        return 'Покупка';
      case 'transfer':
        return transaction.description || 'Перевод баллов';
      case 'royalty':
        return 'Роялти';
      case 'game':
        return 'Игровая транзакция';
      case 'key_redeem':
        return 'Активация ключа';
      default:
        return transaction.description || 'Транзакция';
    }
  };

  const renderTransactionRow = (transaction) => {
    const positiveTypes = [
      'weekly_activity', 
      'custom_period_activity',
      'top_prize', 
      'royalty', 
      'key_redeem',
      'compensation',
      'conversion_deposit',
      'blackjack_win',
      'blackjack_win_21',
      'roulette_win',
      'cups_win',
      'auction_bid_refund',
      'auction_refund',
      'auction_sale',
      'username_auction_refund',
      'username_auction_sale',
      'username_bid_accepted_sale',
      'marketplace_sell'
    ];
    const isPositive = positiveTypes.includes(transaction.transaction_type);
    const amount = transaction.amount || 0;
    
    return (
      <TableRow 
        key={getTransactionId(transaction)}
        hover
        onClick={() => handleOpenTransactionDetails(transaction)}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell>
          <Typography variant="body2">
            {getTransactionDescription(transaction)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {formatDate(transaction.created_at)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            variant="body2"
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 'bold' }}
          >
            {isPositive ? '+' : '-'}{formatCurrency(amount)}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  // Calculate paginated transactions
  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allTransactions, currentPage]);

  const hasNextPage = allTransactions.length > currentPage * ITEMS_PER_PAGE;

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 4, 
        pb: 12.5, 
        paddingTop: 2,
        [theme.breakpoints.down('sm')]: { pl: 1, pr: 1 }
      }}
    >
      <InfoBlock
        styleVariant="dark"
        sx={{
          '&::before': {
            bottom: 0,
            transform: 'rotate(-12deg)',
          },
          '&::after': {
            bottom: 0,
            transform: 'rotate(12deg)',
          }
        }}
        title={
          <Box sx={{ textAlign: 'center' }}>
            <PointsIcon>
              <BallsSVG />
            </PointsIcon>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                marginBottom: 1
              }}
            >
              {t('balance.current_balance.title')}
            </Typography>
            <BalanceAmount>
              {formatNumberWithSpaces(userPoints)}
            </BalanceAmount>
          </Box>
        }
        description={
          <ActionButtonsContainer>
            <ActionButtonItem key="action-pay" onClick={() => navigate('/badge-shop')}>
              <ActionCircleIcon>
                <PaymentIcon />
              </ActionCircleIcon>
              <ActionButtonText>{t('balance.actions.pay')}</ActionButtonText>
            </ActionButtonItem>
            
            <ActionButtonItem key="action-topup" onClick={() => setOpenKeyDialog(true)}>
              <ActionCircleIcon>
                <AddIcon />
              </ActionCircleIcon>
              <ActionButtonText>{t('balance.actions.topup')}</ActionButtonText>
            </ActionButtonItem>

            <ActionButtonItem key="action-transfer" onClick={() => setNewTransferMenuOpen(true)}>
              <ActionCircleIcon>
                <SendIcon />
              </ActionCircleIcon>
              <ActionButtonText>{t('balance.actions.transfer')}</ActionButtonText>
            </ActionButtonItem>
          </ActionButtonsContainer>
        }
      />

      <InfoBlock
        styleVariant="dark"
        description={
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {`${weekRange.start} — ${weekRange.end}`}
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 2 }}>
              {`+${formatNumberWithSpaces(weeklyEstimate)} ${t('balance.current_balance.points_suffix')}`}
            </Typography>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('balance.weekly_forecast.description')}
            </Typography>
          </>
        }
      />

      <InfoBlock
        styleVariant="dark"
        title={
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: '100%',
              cursor: 'pointer',
              marginBottom: 0
            }}
            onClick={() => setIsPointsInfoExpanded(!isPointsInfoExpanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
              <InfoIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
              <Typography variant="h6" sx={{ color: 'white' }}>
                {t('balance.weekly_forecast.how_to_earn.title')}
              </Typography>
              <ExpandIcon 
                expanded={isPointsInfoExpanded} 
                sx={{ ml: 1 }}
              />
            </Box>
            <Box onClick={(e) => e.stopPropagation()}>
              <Tooltip title={t('balance.weekly_forecast.how_to_earn.tooltip')}>
                <IconButton 
                  size="small"
                  component={Link}
                  to="/leaderboard"
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <TimelineIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
        description={
          <ExpandableContent expanded={isPointsInfoExpanded}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
              {t('balance.weekly_forecast.how_to_earn.description')}
            </Typography>
            <Box component="ul" sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              mt: 1, 
              pl: 2,
              '& li': { mb: 1 }
            }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('balance.points.earning_methods.title')}
              </Typography>
              <li key="points-posts">{t('balance.points.earning_methods.posts')}</li>
              <li key="points-likes">{t('balance.points.earning_methods.likes')}</li>
              <li key="points-replies">{t('balance.points.earning_methods.replies')}</li>
              <li key="points-reposts">{t('balance.points.earning_methods.reposts')}</li>
              <li key="points-reactions">{t('balance.points.earning_methods.reactions')}</li>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
              {t('balance.weekly_forecast.how_to_earn.details')}
            </Typography>
          </ExpandableContent>
        }
      />

      
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        fullWidth={true}
        tabs={[
          {
            label: t('balance.tabs.history'),
            value: 0,
            icon: ReceiptLongIcon,
            iconPosition: "start"
          },
          {
            label: t('balance.tabs.assets'),
            value: 1,
            icon: DiamondIcon,
            iconPosition: "start"
          },
          {
            label: t('balance.tabs.subscription'),
            value: 2,
            icon: FlashOnIcon,
            iconPosition: "start",
            key: "subscription-tab"
          }
        ]}
      />

      
      <TabPanel value={tabValue} index={0}>
        <InfoBlock
          styleVariant="dark"

          description={null}
          sx={{ 
            pt: 0,
            padding: '2.5px',
            '&::before': {
              top: 0,
              transform: 'rotate(-12deg)',
              height: '90px'
            },
            '&::after': {
              top: 0,
              transform: 'rotate(12deg)',
              height: '90px'
            }
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress size={30} />
            </Box>
          ) : allTransactions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t('balance.transactions.no_history')}
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ width: '100%' }}>
                {paginatedTransactions.map((transaction, index) => (
                  <TransactionItem 
                    key={`${transaction.type}-${transaction.id || index}`}
                    onClick={() => handleOpenTransactionDetails(transaction)}
                  >
                    <BankStyleTransactionItem>
                      <TransactionAvatar 
                        transactionType={transaction.amount > 0 ? 'positive' : 'negative'}
                      >
                        {transaction.type === 'purchase' ? (
                          <BadgeImage 
                            src={`/static/images/bages/shop/${transaction.badge.image_path}`}
                            alt={transaction.badge.name}
                          />
                        ) : transaction.icon}
                      </TransactionAvatar>
                      <TransactionInfo>
                        <TransactionTitle>
                          {transaction.title}
                        </TransactionTitle>
                        <TransactionDate>
                          {formatDate(transaction.date)}
                        </TransactionDate>
                      </TransactionInfo>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <TransactionAmount type={transaction.amount > 0 ? 'positive' : 'negative'}>
                          {transaction.amount > 0 ? '+' : ''}{formatNumberWithSpaces(transaction.amount)}
                        </TransactionAmount>
                        <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 500, opacity: 0.7 }}>
                          {transaction.description && transaction.description.length > 18
                            ? transaction.description.slice(0, 18) + '...'
                            : transaction.description}
                        </Typography>
                      </Box>
                    </BankStyleTransactionItem>
                  </TransactionItem>
                ))}
              </List>
              {hasNextPage && (
                <Box display="flex" justifyContent="center" mt={2} mb={1}>
                  <Button
                    variant="outlined"
                    onClick={handleNextPage}
                    endIcon={<ArrowForwardIcon />}
                  >
                    {t('balance.transactions.load_more')}
                  </Button>
                </Box>
              )}
            </>
          )}
        </InfoBlock>
      </TabPanel>

      
      <TransactionDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseTransactionDetails}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        {selectedTransaction && (
          <>
            <TransactionDetailHeader type={selectedTransaction.amount > 0 ? 'income' : 'expense'}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedTransaction.type === 'transfer' && 
                   selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                   selectedTransaction.message === t('balance.transactions.clicker_withdrawal_message') ? (
                    <TouchAppIcon sx={{ mr: 1, color: 'success.main' }} />
                  ) : selectedTransaction.type === 'transfer' && selectedTransaction.is_sender ? (
                    <CallMadeIcon sx={{ mr: 1, color: 'error.main' }} />
                  ) : selectedTransaction.type === 'transfer' ? (
                    <CallReceivedIcon sx={{ mr: 1, color: 'success.main' }} />
                  ) : selectedTransaction.type === 'purchase' ? (
                    <ShoppingCartIcon sx={{ mr: 1, color: 'error.main' }} />
                  ) : selectedTransaction.type === 'username' ? (
                    <AccountCircleIcon sx={{ mr: 1, color: 'info.main' }} />
                  ) : selectedTransaction.type === 'weekly_activity' ? (
                    <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                  ) : selectedTransaction.type === 'game' ? (
                    <CasinoIcon sx={{ mr: 1, color: selectedTransaction.amount > 0 ? 'success.main' : 'error.main' }} />
                  ) : (
                    <DiamondIcon sx={{ mr: 1, color: 'success.main' }} />
                  )}
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {selectedTransaction.type === 'transfer' ? 
                      (selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                      selectedTransaction.message === t('balance.transactions.clicker_withdrawal_message') ?
                      t('balance.transactions.clicker_withdrawal') :
                      (selectedTransaction.is_sender ? t('balance.transactions.transfer') : t('balance.transactions.deposit'))) :
                      selectedTransaction.type === 'purchase' ? t('balance.transactions.badge_purchase') :
                      selectedTransaction.type === 'royalty' ? t('balance.transactions.royalty_from_purchase') :
                      selectedTransaction.type === 'weekly_activity' ? t('balance.transactions.weekly_points') :
                      selectedTransaction.type === 'custom_period_activity' ? t('balance.transactions.custom_period_activity') :
                      selectedTransaction.type === 'username' ? t('balance.transactions.username_purchase') :
                      selectedTransaction.type === 'game' ? getTransactionDescription(selectedTransaction) :
                      selectedTransaction.type === 'compensation' ? t('balance.transactions.compensation') :
                      selectedTransaction.type === 'conversion_deposit' ? t('balance.transactions.conversion_deposit') :
                      selectedTransaction.type === 'conversion_withdrawal' ? t('balance.transactions.conversion_withdrawal') :
                      selectedTransaction.type === 'top_prize' ? t('balance.transactions.top_prize') :
                      getTransactionDescription(selectedTransaction)
                    }
                  </Typography>
                </Box>
                <TransactionStatusChip label="Выполнен" status="completed" />
              </Box>
              
              <TransactionDetailAmount type={selectedTransaction.amount > 0 ? 'income' : 'expense'}>
                {formatCurrency(selectedTransaction.amount)}
              </TransactionDetailAmount>
              
              <Typography variant="caption" color="text.secondary">
                {formatDate(selectedTransaction.date)}
              </Typography>
            </TransactionDetailHeader>
            
            <TransactionDetailContent>
              <DetailRow key="transaction-id">
                <DetailLabel>ID транзакции</DetailLabel>
                <DetailValue>{getTransactionId(selectedTransaction)}</DetailValue>
              </DetailRow>
              
              {selectedTransaction.type === 'transfer' && (
                <>
                  <DetailRow key="transfer-type">
                    <DetailLabel>Тип</DetailLabel>
                    <DetailValue>
                      {selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                       selectedTransaction.message === t('balance.transactions.clicker_withdrawal_message') ?
                       t('balance.transactions.clicker_withdrawal') :
                       (selectedTransaction.is_sender ? t('balance.transactions.transfer') : t('balance.transactions.deposit'))}
                    </DetailValue>
                  </DetailRow>
                  
                  {(selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                   selectedTransaction.message === t('balance.transactions.clicker_withdrawal_message')) ? (
                    <>
                      <DetailRow key="transfer-source">
                        <DetailLabel>Источник</DetailLabel>
                        <DetailValue>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TouchAppIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'success.main' }} />
                            <span>{t('balance.transactions.clicker_points')}</span>
                          </Box>
                        </DetailValue>
                      </DetailRow>
                      <DetailRow key="transfer-operation-type">
                        <DetailLabel>Тип операции</DetailLabel>
                        <DetailValue>{t('balance.transactions.withdrawal')}</DetailValue>
                      </DetailRow>
                    </>
                  ) : (
                    <>
                      <DetailRow key="transfer-sender">
                        <DetailLabel>Отправитель</DetailLabel>
                        <DetailValue>{selectedTransaction.sender_username}</DetailValue>
                      </DetailRow>
                      <DetailRow key="transfer-recipient">
                        <DetailLabel>Получатель</DetailLabel>
                        <DetailValue>{selectedTransaction.recipient_username}</DetailValue>
                      </DetailRow>
                    </>
                  )}
                  
                  {selectedTransaction.message && (
                    <DetailRow key="transfer-message">
                      <DetailLabel>Сообщение</DetailLabel>
                      <DetailValue>{selectedTransaction.message}</DetailValue>
                    </DetailRow>
                  )}
                </>
              )}
              
              {selectedTransaction.type === 'purchase' && (
                <>
                  <DetailRow key="purchase-badge-name">
                    <DetailLabel>Название бейджика</DetailLabel>
                    <DetailValue>{selectedTransaction.badge.name}</DetailValue>
                  </DetailRow>
                  {selectedTransaction.badge.description && (
                    <DetailRow key="purchase-badge-description">
                      <DetailLabel>Описание</DetailLabel>
                      <DetailValue>{selectedTransaction.badge.description}</DetailValue>
                    </DetailRow>
                  )}
                </>
              )}
              
              {selectedTransaction.type === 'royalty' && (
                <>
                  <DetailRow key="royalty-badge-name">
                    <DetailLabel>Название бейджика</DetailLabel>
                    <DetailValue>{selectedTransaction.badge_name}</DetailValue>
                  </DetailRow>
                  <DetailRow key="royalty-buyer">
                    <DetailLabel>Покупатель</DetailLabel>
                    <DetailValue>{selectedTransaction.buyer_name}</DetailValue>
                  </DetailRow>
                </>
              )}
              
              {selectedTransaction.type === 'username' && (
                <DetailRow key="username-value">
                  <DetailLabel>{t('balance.transaction_details.username.label')}</DetailLabel>
                  <DetailValue>{t('balance.transaction_details.username.prefix')}{selectedTransaction.username}</DetailValue>
                </DetailRow>
              )}
              
              {selectedTransaction.type === 'weekly_activity' && (
                <>
                  <DetailRow key="weekly-activity-type">
                    <DetailLabel>{t('balance.transaction_details.operation.type')}</DetailLabel>
                    <DetailValue>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'success.main' }} />
                        <span>{t('balance.transactions.weekly_points')}</span>
                      </Box>
                    </DetailValue>
                  </DetailRow>
                  
                  <DetailRow key="weekly-activity-description">
                    <DetailLabel>{t('balance.transaction_details.operation.description')}</DetailLabel>
                    <DetailValue>{selectedTransaction.description}</DetailValue>
                  </DetailRow>
                  
                  <DetailRow key="weekly-activity-date">
                    <DetailLabel>{t('balance.transaction_details.operation.date')}</DetailLabel>
                    <DetailValue>{formatDate(selectedTransaction.date)}</DetailValue>
                  </DetailRow>
                </>
              )}
              
              {selectedTransaction.type === 'game' && (
                <>
                  <DetailRow key="game-operation-type">
                    <DetailLabel>{t('balance.transaction_details.operation.type')}</DetailLabel>
                    <DetailValue>
                      {selectedTransaction.description}
                    </DetailValue>
                  </DetailRow>
                  <DetailRow key="game-description">
                    <DetailLabel>{t('balance.transaction_details.operation.description')}</DetailLabel>
                    <DetailValue>
                      {selectedTransaction.title}
                    </DetailValue>
                  </DetailRow>
                </>
              )}
              
              <DetailRow key="transaction-amount">
                <DetailLabel>{t('balance.transaction_details.operation.amount')}</DetailLabel>
                <DetailValue sx={{ 
                  color: selectedTransaction.amount > 0 ? 'success.main' : 'error.main',
                  fontWeight: 700
                }}>
                  {formatCurrency(selectedTransaction.amount)}
                </DetailValue>
              </DetailRow>
              
              {selectedTransaction.type === 'transfer' && (
                <Button
                  startIcon={<PictureAsPdfIcon />}
                  variant="outlined"
                  onClick={() => generateReceiptForTransaction(selectedTransaction)}
                  sx={{ borderRadius: 2 }}
                >
                  {t('balance.transaction_details.receipt.download')}
                </Button>
              )}
              
              {selectedTransaction.type === 'weekly_activity' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="success.main">
                    {t('balance.transaction_details.weekly_activity.description')}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                 selectedTransaction.message === t('balance.transactions.clicker_withdrawal_message') && (
                  <Button
                    startIcon={<TouchAppIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => generateReceiptForTransaction(selectedTransaction)}
                    sx={{ ml: 2, borderRadius: 2 }}
                  >
                    {t('balance.transaction_details.receipt.payment')}
                  </Button>
                )}
                <Button 
                  onClick={handleCloseTransactionDetails}
                  sx={{ ml: 2, borderRadius: 2 }}
                >
                  {t('balance.transaction_details.receipt.close')}
                </Button>
              </Box>
            </TransactionDetailContent>
          </>
        )}
      </TransactionDetailDialog>

      
      <TabPanel value={tabValue} index={1}>
        <InfoBlock
          styleVariant="dark"

          description={null}
          sx={{ 
            pt: 0,
            padding: '2.5px',
            '&::before': {
              top: 0,
              transform: 'rotate(-12deg)',
              height: '90px'
            },
            '&::after': {
              top: 0,
              transform: 'rotate(12deg)',
              height: '90px'
            }
          }}
        >
          {createdBadges.length > 0 || usernamePurchases.length > 0 ? (
            <List sx={{ width: '100%' }}>
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
                            label={t('balance.assets.badges.points_cost', { amount: badge.price })} 
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
                      {badge.description || t('balance.assets.badges.no_description')}
                    </Typography>
                    
                    {badge.purchases.length > 0 ? (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('balance.assets.badges.purchases.title', { count: badge.purchases.length })}
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
                                secondary={
                                  <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {t('balance.assets.badges.purchases.date', { date: formatDate(purchase.purchase_date) })}
                                    </Typography>
                                  </Box>
                                }
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
                        {t('balance.assets.badges.purchases.none')}
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}

              {createdBadges.length > 0 && usernamePurchases.length > 0 && (
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    px: 2, 
                    py: 1, 
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  {t('balance.assets.usernames.section_title')}
                </Typography>
              )}

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
                            label={t('balance.assets.usernames.active')}
                            color="success"
                            sx={{ ml: 1, height: 20, '& .MuiChip-label': { px: 1, py: 0.2 } }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {t('balance.assets.usernames.purchased_on')}: {formatDate(purchase.purchase_date)}
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
          ) : (
            <Box sx={{ textAlign: 'center', py: 5, px: 3, bgcolor: alpha(theme.palette.background.paper, 0.4), borderRadius: 4 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {t('balance.assets.empty.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('balance.assets.empty.description')}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/username-auction')}
                startIcon={<AccountCircleIcon />}
                sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
              >
                {t('balance.assets.empty.username_auction')}
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/badge-shop')}
                startIcon={<ShoppingCartIcon />}
              >
                {t('balance.assets.empty.badge_shop')}
              </Button>
            </Box>
          )}
        </InfoBlock>
      </TabPanel>

      
      <TabPanel value={tabValue} index={2}>
        <InfoBlock
          styleVariant="dark"
          description={null}
          sx={{ 
            pt: 0,
            padding: '2.5px'
          }}
        >
          {subscription && subscription.active ? (
            <Card elevation={3} sx={{ 
              backgroundImage: `unset`,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DiamondIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    {t('balance.subscription.active.title')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1">
                    {t('balance.subscription.active.type')}: <Chip 
                      label={subscription.type === 'basic' ? t('balance.subscription.types.basic') : 
                            subscription.type === 'premium' ? t('balance.subscription.types.premium') : 
                            subscription.type === 'ultimate' ? t('balance.subscription.types.ultimate') : 
                            subscription.type}
                      color={subscription.type === 'premium' ? 'secondary' : subscription.type === 'ultimate' ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold', ml: 1 }}
                    />
                  </Typography>
                  
                  <Typography variant="body2">
                    {t('balance.subscription.active.expires')}: {new Date(subscription.expires_at).toLocaleDateString()} 
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {t('balance.subscription.active.days_left', { days: Math.ceil((new Date(subscription.expires_at) - new Date()) / (1000 * 60 * 60 * 24)) })}
                    </Typography>
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {t('balance.subscription.active.features.title')}:
                    </Typography>
                    <List dense sx={{ pl: 2 }}>
                      {subscription.type === 'basic' && (
                        <Box key="basic-features">
                          <ListItem key="basic-monthly-points" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.basic.monthly_points')} /></ListItem>
                          <ListItem key="basic-no-ads" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.basic.no_ads')} /></ListItem>
                          <ListItem key="basic-badge-limit" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.basic.badge_limit')} /></ListItem>
                          <ListItem key="basic-username-limit" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.basic.username_limit')} /></ListItem>
                        </Box>
                      )}
                      {subscription.type === 'premium' && (
                        <Box key="premium-features">
                          <ListItem key="premium-monthly-points" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.premium.monthly_points')} /></ListItem>
                          <ListItem key="premium-features" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.premium.features')} /></ListItem>
                          <ListItem key="premium-support" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.premium.support')} /></ListItem>
                          <ListItem key="premium-badge-limit" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.premium.badge_limit')} /></ListItem>
                          <ListItem key="premium-username-limit" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.premium.username_limit')} /></ListItem>
                        </Box>
                      )}
                      {subscription.type === 'ultimate' && (
                        <Box key="ultimate-features">
                          <ListItem key="premium-benefits" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.ultimate.premium_benefits')} /></ListItem>
                                                      <ListItem key="monthly-points" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.ultimate.monthly_points')} /></ListItem>
                            <ListItem key="animated-badges" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.ultimate.animated_badges')} /></ListItem>
                              <ListItem key="unlimited-badges" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.ultimate.unlimited_badges')} /></ListItem>
                            <ListItem key="unlimited-usernames" sx={{ py: 0 }}><ListItemText primary={t('balance.subscription.active.features.ultimate.unlimited_usernames')} /></ListItem>
                        </Box>
                      )}
                    </List>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5, px: 3, bgcolor: alpha(theme.palette.background.paper, 0.4), borderRadius: 4 }}>
              <FlashOnIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                У вас нет активной подписки
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Активируйте подписку, чтобы получить доступ к расширенным возможностям платформы
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setOpenKeyDialog(true)}
                startIcon={<AddIcon />}
              >
                Активировать ключ
              </Button>
            </Box>
          )}
        </InfoBlock>
      </TabPanel>

      

      
      <StyledDialog
        open={openKeyDialog}
        onClose={() => {
          if (!isSubmittingKey) {
            setOpenKeyDialog(false);
            setKeyValue('');
            setKeyError('');
            setKeySuccess(null);
            setActiveTopupTab(0);
          }
        }}
        fullWidth
      >
        <DialogHeader>
          <HeaderGlow />
          <DialogHeaderContent>
            <MonetizationOnIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="primary.light">
              Пополнение баланса
            </Typography>
          </DialogHeaderContent>
          {!isSubmittingKey && (
            <IconButton
              aria-label="close"
              onClick={() => setOpenKeyDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogHeader>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Tabs 
            value={activeTopupTab} 
            onChange={(e, newValue) => setActiveTopupTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label={t('balance.topup.tabs.key')} />
            <Tab label={t('balance.topup.tabs.donate')} />
          </Tabs>
          
          {activeTopupTab === 0 && !keySuccess ? (
            <ContentBox>
              <Typography variant="body1" gutterBottom>
                {t('balance.topup.key.enter')}
              </Typography>
              
              <KeyTextField
                fullWidth
                label={t('balance.topup.key.label')}
                variant="outlined"
                placeholder={t('balance.topup.key.placeholder')}
                value={keyValue}
                onChange={handleKeyChange}
                error={!!keyError}
                helperText={keyError}
                disabled={isSubmittingKey}
                sx={{ mt: 2, mb: 2 }}
                InputProps={{
                  endAdornment: keyValue && (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setKeyValue('')}
                        edge="end"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Typography variant="caption" color="text.secondary">
                {t('balance.topup.key.hint')}
              </Typography>
            </ContentBox>
          ) : activeTopupTab === 1 ? (
            <ContentBox>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t('balance.topup.donate.title')}
              </Typography>
              <Typography variant="body2" paragraph>
                {t('balance.topup.donate.description')}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                {t('balance.topup.donate.rate')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MonetizationOnIcon />}
                fullWidth
                onClick={() => window.open('https://boosty.to/qsoul', '_blank')}
              >
                {t('balance.topup.donate.button')}
              </Button>
            </ContentBox>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              position: 'relative',
              overflow: 'hidden'
            }}>
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
                  {t('balance.topup.key.success.title')}
                </Typography>
                <Typography variant="body1" align="center">
                  {keySuccess.message}
                </Typography>
                
                {keySuccess.type === 'points' ? (
                  
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
                      {t('balance.topup.key.success.new_balance')}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                      {keySuccess.newBalance} {t('balance.topup.key.success.points')}
                    </Typography>
                  </Box>
                ) : (
                  
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
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
                      {t('balance.topup.key.success.subscription_activated')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Chip
                        label={t(`balance.subscription.types.${keySuccess.subscriptionType}`)}
                        color="secondary"
                        sx={{ fontSize: '1rem', py: 2, px: 1 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {t('balance.topup.key.success.expires_at', { date: keySuccess.expiresAt ? new Date(keySuccess.expiresAt).toLocaleDateString() : t('balance.subscription.duration.unlimited') })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      {t('balance.topup.key.success.duration', { days: keySuccess.duration_days })}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          {!keySuccess ? (
            <>
              <CancelButton 
                onClick={() => setOpenKeyDialog(false)} 
                variant="outlined"
                disabled={isSubmittingKey}
              >
                {t('balance.common.cancel')}
              </CancelButton>
              <ActionButton
                onClick={handleRedeemKey}
                disabled={!keyValue || isSubmittingKey || keyValue.length < 19} 
                startIcon={isSubmittingKey ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {isSubmittingKey ? t('balance.topup.key.process') : t('balance.topup.key.activate')}
              </ActionButton>
            </>
          ) : (
            <ActionButton
              onClick={() => {
                setOpenKeyDialog(false);
                setKeySuccess(null);
                setKeyValue('');
              }}
              sx={{ mx: 'auto' }}
            >
              {t('balance.common.done')}
            </ActionButton>
          )}
        </DialogActions>
      </StyledDialog>

      
      <StyledDialog
        open={transferSuccess}
        onClose={() => setTransferSuccess(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogHeader>
          <HeaderGlow />
          <DialogHeaderContent>
            <CheckCircleIcon color="success" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {t('balance.transactions.success.title')}
            </Typography>
          </DialogHeaderContent>
          <IconButton
            aria-label="close"
            onClick={() => setTransferSuccess(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2,
            textAlign: 'center'
          }}>
            <SuccessIconWrapper>
              <CheckCircleIcon color="success" sx={{ fontSize: 50 }} />
            </SuccessIconWrapper>
            
            <Typography variant="h5" gutterBottom>
              {t('balance.transactions.success.title')}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('balance.transactions.success.amount_sent', { amount: transferData.amount, username: transferData.username })}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {t('balance.transactions.success.receipt_info')}
            </Typography>
            
            <ReceiptIconButton
              onClick={() => {
                if (receiptData) {
                  try {
                    downloadPdfReceipt(receiptData.dataUrl, `TR-${Date.now().toString().slice(-8)}`, receiptData.filePath);
                  } catch (error) {
                    console.error(t('balance.transactions.success.receipt_error'), error);
                    setSnackbar({
                      open: true,
                      message: t('balance.transactions.success.receipt_error'),
                      severity: 'error'
                    });
                  }
                }
              }}
              startIcon={<PictureAsPdfIcon />}
              endIcon={<DownloadIcon />}
              disabled={!receiptData}
            >
              {t('balance.transactions.success.open_receipt')}
            </ReceiptIconButton>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <ActionButton onClick={() => setTransferSuccess(false)} sx={{ mx: 'auto' }}>
            {t('balance.common.close')}
          </ActionButton>
        </DialogActions>
      </StyledDialog>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />

      {/* New Transfer Menu Component */}
      <TransferMenu 
        open={newTransferMenuOpen}
        onClose={() => setNewTransferMenuOpen(false)}
        userPoints={userPoints}
        onSuccess={handleNewTransferSuccess}
      />
    </Container>
  );
};


export default BalancePage; 