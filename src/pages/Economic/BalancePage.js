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
  DialogActions as MuiDialogActions,
  TextField,
  Snackbar,
  InputAdornment
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
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
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
  borderRadius: 16,
  marginBottom: theme.spacing(1.5),
  background: alpha(theme.palette.background.paper, 0.4),
  backdropFilter: 'blur(10px)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  padding: theme.spacing(1.5, 2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  '&:hover': {
    background: alpha(theme.palette.background.paper, 0.7),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
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
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);


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
      throw new Error('Не удалось сгенерировать чек на сервере');
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
  width: '100%',
  padding: theme.spacing(0.5),
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

  
  const allTransactions = React.useMemo(() => {
    const purchases = purchaseHistory.map(purchase => ({
      ...purchase,
      type: 'purchase',
      date: new Date(purchase.purchase_date),
      amount: -purchase.price_paid,
      title: `Покупка бейджика`,
      description: `"${purchase.badge.name}"`,
      icon: <ShoppingCartIcon sx={{ color: 'error.main' }} />
    }));

    const royalties = royaltyHistory.map(royalty => ({
      ...royalty,
      type: 'royalty',
      date: new Date(royalty.purchase_date),
      amount: royalty.royalty_amount,
      title: `Роялти от покупки`,
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
                               transfer.message === "Вывод баллов из кликера";
      
      let title = isClickerWithdrawal ? 'Вывод из кликера' : 
                 (is_sender ? 'Перевод' : 'Пополнение');
      let description = isClickerWithdrawal ? 'Баллы из кликера' : 
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
      title: `Покупка юзернейма`,
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
          title: 'Еженедельные баллы',
          description: transaction.description || 'Начисление за активность',
          icon: <TrendingUpIcon sx={{ color: 'success.main' }} />
        };
      });
    

    const otherGameTransactions = gameTransactions
      .filter(transaction => transaction.transaction_type !== 'weekly_activity')
      .map(transaction => {
        let icon = null;
        let title = transaction.description || 'Транзакция';
        let type = transaction.transaction_type || 'unknown';
        

        if (type.includes('blackjack') || type.includes('minigame')) {

          if (type === 'blackjack_win' || type === 'blackjack_win_21') {
            icon = <CasinoIcon sx={{ color: 'success.main' }} />;
            title = 'Выигрыш в игре "21"';
          } else if (type === 'blackjack_tie') {
            icon = <CasinoIcon sx={{ color: 'info.main' }} />;
            title = 'Ничья в игре "21"';
          } else if (type === 'blackjack_lose' || type === 'blackjack_lose_bust') {
            icon = <CasinoIcon sx={{ color: 'error.main' }} />;
            title = 'Проигрыш в игре "21"';
          } else if (type === 'minigame_bet') {
            icon = <SportsEsportsIcon sx={{ color: 'error.main' }} />;
            title = 'Ставка в мини-игре';
          } else {
            icon = <SportsEsportsIcon sx={{ color: transaction.amount > 0 ? 'success.main' : 'error.main' }} />;
          }
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
  }, [purchaseHistory, royaltyHistory, transferHistory, usernamePurchases, gameTransactions, user?.id]);

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
      setError('Не удалось загрузить баланс баллов');
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
    
    if (userSearch.timer) clearTimeout(userSearch.timer);
    
    
    if (!username) {
      setUserSearch(prev => ({
        ...prev,
        loading: false,
        exists: false,
        suggestions: [],
        timer: null
      }));
      
      setTransferData(prev => ({...prev, recipient_id: null}));
      return;
    }
    
    
    setUserSearch(prev => ({
      ...prev,
      loading: true,
      timer: setTimeout(async () => {
        try {
          
          const response = await axios.get(`/api/user/search-recipients?query=${username}`);
          
          if (response.data && response.data.users) {
            
            const exactMatch = response.data.users.find(
              user => user.username.toLowerCase() === username.toLowerCase()
            );
            
            
            if (exactMatch) {
              setTransferData(prev => ({...prev, recipient_id: exactMatch.id}));
            } else {
              setTransferData(prev => ({...prev, recipient_id: null}));
            }
            
            
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: !!exactMatch,
              suggestions: response.data.users.slice(0, 3) 
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
      }, 500) 
    }));
  }, [userSearch.timer]);
  
  
  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setTransferData(prev => ({...prev, username}));
    
    
    searchUser(username);
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
      start: monday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      end: sunday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    };
  };

  
  const weekRange = getCurrentWeekRange();

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
          expiresAt: data.expires_at
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
    return `${amount < 0 ? '-' : '+'}${absAmount}`;
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
          
          
          <ActionButtonsContainer>
            <ActionButtonItem onClick={() => navigate('/badge-shop')}>
              <ActionCircleIcon>
                <PaymentIcon />
              </ActionCircleIcon>
              <ActionButtonText>Оплатить</ActionButtonText>
            </ActionButtonItem>
            
            <ActionButtonItem onClick={() => setOpenKeyDialog(true)}>
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
            Баллы начисляются каждое воскресенье в 23:50 по UTC+03:00, статистика обновляется в Понедельник 02:50.
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
          <Tab 
            icon={<FlashOnIcon />} 
            iconPosition="start" 
            label="Подписка" 
            id="tab-2"
            aria-controls="tabpanel-2"
          />
        </Tabs>
      </Box>

      
      <TabPanel value={tabValue} index={0}>
        <HistoryCard>
          <CardContent sx={{ p: 1.25 }}>
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
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </TransactionAmount>
                        <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 500, opacity: 0.7 }}>
                          {transaction.description}
                        </Typography>
                      </Box>
                    </BankStyleTransactionItem>
                  </TransactionItem>
                ))}
              </List>
            )}
          </CardContent>
        </HistoryCard>
      </TabPanel>

      
      <TransactionDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseTransactionDetails}
        fullWidth
        maxWidth="sm"
      >
        {selectedTransaction && (
          <>
            <TransactionDetailHeader type={selectedTransaction.amount > 0 ? 'income' : 'expense'}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedTransaction.type === 'transfer' && 
                   selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                   selectedTransaction.message === "Вывод баллов из кликера" ? (
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
                      selectedTransaction.message === "Вывод баллов из кликера" ?
                      'Вывод из кликера' :
                      (selectedTransaction.is_sender ? 'Исходящий перевод' : 'Входящий перевод')) :
                      selectedTransaction.type === 'purchase' ? 'Покупка бейджика' :
                      selectedTransaction.type === 'royalty' ? 'Роялти от бейджика' :
                      selectedTransaction.type === 'weekly_activity' ? 'Еженедельное начисление' :
                      selectedTransaction.type === 'username' ? 'Покупка юзернейма' :
                      selectedTransaction.type === 'game' ? 'Транзакция в мини-игре' :
                      'Транзакция'
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
              <DetailRow>
                <DetailLabel>ID транзакции</DetailLabel>
                <DetailValue>{getTransactionId(selectedTransaction)}</DetailValue>
              </DetailRow>
              
              {selectedTransaction.type === 'transfer' && (
                <>
                  <DetailRow>
                    <DetailLabel>Тип</DetailLabel>
                    <DetailValue>
                      {selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                       selectedTransaction.message === "Вывод баллов из кликера" ?
                       'Вывод из кликера' :
                       (selectedTransaction.is_sender ? 'Исходящий перевод' : 'Входящий перевод')}
                    </DetailValue>
                  </DetailRow>
                  
                  
                  {(selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                   selectedTransaction.message === "Вывод баллов из кликера") ? (
                    <>
                      <DetailRow>
                        <DetailLabel>Источник</DetailLabel>
                        <DetailValue>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TouchAppIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'success.main' }} />
                            <span>Кликер</span>
                          </Box>
                        </DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Тип операции</DetailLabel>
                        <DetailValue>Вывод заработанных баллов</DetailValue>
                      </DetailRow>
                    </>
                  ) : (
                    <>
                      <DetailRow>
                        <DetailLabel>Отправитель</DetailLabel>
                        <DetailValue>{selectedTransaction.sender_username}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Получатель</DetailLabel>
                        <DetailValue>{selectedTransaction.recipient_username}</DetailValue>
                      </DetailRow>
                    </>
                  )}
                  
                  {selectedTransaction.message && (
                    <DetailRow>
                      <DetailLabel>Сообщение</DetailLabel>
                      <DetailValue>{selectedTransaction.message}</DetailValue>
                    </DetailRow>
                  )}
                </>
              )}
              
              {selectedTransaction.type === 'purchase' && (
                <>
                  <DetailRow>
                    <DetailLabel>Название бейджика</DetailLabel>
                    <DetailValue>{selectedTransaction.badge.name}</DetailValue>
                  </DetailRow>
                  {selectedTransaction.badge.description && (
                    <DetailRow>
                      <DetailLabel>Описание</DetailLabel>
                      <DetailValue>{selectedTransaction.badge.description}</DetailValue>
                    </DetailRow>
                  )}
                </>
              )}
              
              {selectedTransaction.type === 'royalty' && (
                <>
                  <DetailRow>
                    <DetailLabel>Название бейджика</DetailLabel>
                    <DetailValue>{selectedTransaction.badge_name}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Покупатель</DetailLabel>
                    <DetailValue>{selectedTransaction.buyer_name}</DetailValue>
                  </DetailRow>
                </>
              )}
              
              {selectedTransaction.type === 'username' && (
                <DetailRow>
                  <DetailLabel>Юзернейм</DetailLabel>
                  <DetailValue>@{selectedTransaction.username}</DetailValue>
                </DetailRow>
              )}
              
              {selectedTransaction.type === 'weekly_activity' && (
                <>
                  <DetailRow>
                    <DetailLabel>Тип операции</DetailLabel>
                    <DetailValue>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'success.main' }} />
                        <span>Еженедельное начисление</span>
                      </Box>
                    </DetailValue>
                  </DetailRow>
                  
                  <DetailRow>
                    <DetailLabel>Описание</DetailLabel>
                    <DetailValue>{selectedTransaction.description}</DetailValue>
                  </DetailRow>
                  
                  <DetailRow>
                    <DetailLabel>Дата начисления</DetailLabel>
                    <DetailValue>{formatDate(selectedTransaction.date)}</DetailValue>
                  </DetailRow>
                </>
              )}
              
              {selectedTransaction.type === 'game' && (
                <>
                  <DetailRow>
                    <DetailLabel>Тип операции</DetailLabel>
                    <DetailValue>
                      {selectedTransaction.description}
                    </DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Описание</DetailLabel>
                    <DetailValue>
                      {selectedTransaction.title}
                    </DetailValue>
                  </DetailRow>
                </>
              )}
              
              <DetailRow>
                <DetailLabel>Сумма</DetailLabel>
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
                  Скачать чек
                </Button>
              )}
              
              {selectedTransaction.type === 'weekly_activity' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="success.main">
                    Баллы начислены за вашу активность на платформе за прошедшую неделю.
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {selectedTransaction.sender_id === selectedTransaction.recipient_id && 
                 selectedTransaction.message === "Вывод баллов из кликера" && (
                  <Button
                    startIcon={<TouchAppIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => generateReceiptForTransaction(selectedTransaction)}
                    sx={{ ml: 2, borderRadius: 2 }}
                  >
                    Чек выплаты
                  </Button>
                )}
                <Button 
                  onClick={handleCloseTransactionDetails}
                  sx={{ ml: 2, borderRadius: 2 }}
                >
                  Закрыть
                </Button>
              </Box>
            </TransactionDetailContent>
          </>
        )}
      </TransactionDetailDialog>

      
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
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
                                  secondary={
                                    <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Приобретен: {formatDate(purchase.date)}
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
                          <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
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
                onClick={() => navigate('/username-auction')}
                startIcon={<AccountCircleIcon />}
                sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
              >
                Аукцион юзернеймов
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

      
      <TabPanel value={tabValue} index={2}>
        {subscription && subscription.active ? (
          <Card elevation={3} sx={{ 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.dark, 0.3)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DiamondIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Активная подписка
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  Тип: <Chip 
                    label={subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)} 
                    color={subscription.type === 'premium' ? 'secondary' : subscription.type === 'ultimate' ? 'primary' : 'default'}
                    size="small"
                    sx={{ fontWeight: 'bold', ml: 1 }}
                  />
                </Typography>
                
                <Typography variant="body2">
                  Истекает: {new Date(subscription.expires_at).toLocaleDateString()} 
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    (осталось {Math.ceil((new Date(subscription.expires_at) - new Date()) / (1000 * 60 * 60 * 24))} дней)
                  </Typography>
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Возможности подписки:
                  </Typography>
                  <List dense sx={{ pl: 2 }}>
                    {subscription.type === 'basic' && (
                      <>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Ежемесячное пополнение  на 1.000 баллов" /></ListItem>

                        <ListItem sx={{ py: 0 }}><ListItemText primary="Отсутствие рекламы" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Создание до 5 бейджиков" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Покупка до 5 Юзернеймов" /></ListItem>
                      </>
                    )}
                    {subscription.type === 'premium' && (
                      <>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Ежемесячное пополнение  на 5.000 баллов" /></ListItem>

                        <ListItem sx={{ py: 0 }}><ListItemText primary="Расширенные функции платформы" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Приоритетная поддержка" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Создание до 8 бейджиков" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Покупка до 8 Юзернеймов" /></ListItem>
                      </>
                    )}
                    {subscription.type === 'ultimate' && (
                      <>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Все преимущества Premium" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Ежемесячное пополнение  на 10.000 баллов" /></ListItem>

                        <ListItem sx={{ py: 0 }}><ListItemText primary="Создание Анимированных бейджиков" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Безлимитное создание бейджиков" /></ListItem>
                        <ListItem sx={{ py: 0 }}><ListItemText primary="Покупка неограниченного количества Юзернеймов" /></ListItem>
                      </>
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
      </TabPanel>

      
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
          <CancelButton 
            onClick={() => setTransferDialogOpen(false)}
            disabled={isTransferring}
          >
            Отмена
          </CancelButton>
          <GradientButton 
            onClick={handleTransferPoints} 
            disabled={!userSearch.exists || !transferData.recipient_id || userSearch.loading || !transferData.amount || isTransferring}
            startIcon={isTransferring ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          >
            {isTransferring ? 'Выполнение перевода...' : (userSearch.exists && transferData.recipient_id ? 'Перевести безопасно' : 'Перевести')}
          </GradientButton>
        </Box>
      </StyledDialog>

      
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
            <Tab label="У меня есть ключ" />
            <Tab label="Донат" />
          </Tabs>
          
          {activeTopupTab === 0 && !keySuccess ? (
            <ContentBox>
              <Typography variant="body1" gutterBottom>
                Введите ключ активации для пополнения баланса:
              </Typography>
              
              <KeyTextField
                fullWidth
                label="Ключ активации"
                variant="outlined"
                placeholder="XXXX-XXXX-XXXX-XXXX"
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
                Ключ активации можно получить в результате покупки на нашем сайте или от администратора.
              </Typography>
            </ContentBox>
          ) : activeTopupTab === 1 ? (
            <ContentBox>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Пополнение с помощью доната
              </Typography>
              <Typography variant="body2" paragraph>
                Вы можете пополнить баланс рублями через Boosty.
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                1 рубль = 5 баллов
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MonetizationOnIcon />}
                fullWidth
                onClick={() => window.open('https://boosty.to/qsoul', '_blank')}
              >
                Перейти к пополнению
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
                  Ключ успешно активирован!
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
                      Новый баланс:
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                      {keySuccess.newBalance} баллов
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
                      Активирована подписка:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Chip
                        label={keySuccess.subscriptionType === 'basic' ? 'Базовая' : 
                              keySuccess.subscriptionType === 'premium' ? 'Премиум' : 
                              keySuccess.subscriptionType === 'ultimate' ? 'Ультимейт' : 
                              keySuccess.subscriptionType}
                        color="secondary"
                        sx={{ fontSize: '1rem', py: 2, px: 1 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Срок действия до: {keySuccess.expiresAt ? new Date(keySuccess.expiresAt).toLocaleDateString() : 'Бессрочно'}
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
                Отмена
              </CancelButton>
              <ActionButton
                onClick={handleRedeemKey}
                disabled={!keyValue || isSubmittingKey || keyValue.length < 19} 
                startIcon={isSubmittingKey ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {isSubmittingKey ? 'Активация...' : 'Активировать ключ'}
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
              Готово
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
              Перевод выполнен успешно
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
              Средства успешно переведены
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Вы перевели <strong>{transferData.amount} баллов</strong> пользователю <strong>{transferData.username}</strong>
            </Typography>
            
            {transferData.message && (
              <Typography variant="body2" paragraph sx={{ fontStyle: 'italic', mt: 1 }}>
                "{transferData.message}"
              </Typography>
            )}
            
            <Divider sx={{ my: 2, width: '100%' }} />
            
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Вы можете скачать справку о переводе в формате PDF
            </Typography>
            
            <ReceiptIconButton
              onClick={() => {
                if (receiptData) {
                  try {
                    downloadPdfReceipt(receiptData.dataUrl, `TR-${Date.now().toString().slice(-8)}`, receiptData.filePath);
                  } catch (error) {
                    console.error('Ошибка при открытии PDF:', error);
                    
                    setSnackbar({
                      open: true,
                      message: 'Не удалось открыть PDF. Попробуйте позже.',
                      severity: 'error'
                    });
                  }
                }
              }}
              startIcon={<PictureAsPdfIcon />}
              endIcon={<DownloadIcon />}
              disabled={!receiptData}
            >
              Открыть справку
            </ReceiptIconButton>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <ActionButton onClick={() => setTransferSuccess(false)} sx={{ mx: 'auto' }}>
            Закрыть
          </ActionButton>
        </DialogActions>
      </StyledDialog>

      
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