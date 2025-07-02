import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Alert,
  styled,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Slider,
  Tooltip,
  useTheme,
  alpha,
  Badge,
  Stack,
  Card,
  CardContent,
  useMediaQuery,
  Link,
  ListItemIcon,
  FormHelperText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Chip,
  DialogContentText,
  AlertTitle,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileService from '../../services/ProfileService';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';
import { motion } from 'framer-motion';
import NotificationService from '../../services/NotificationService';
import { generatePlaceholder } from '../../utils/imageUtils';
import SettingsBottomNavigation from '../../components/SettingsBottomNavigation';
import LoginSettingsTab from '../../components/LoginSettingsTab';
import { useSnackbar } from 'notistack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BadgeIcon from '@mui/icons-material/Badge';
import ClearIcon from '@mui/icons-material/Clear';
import StraightenIcon from '@mui/icons-material/Straighten';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ConnectionModal from '../../components/Connections/ConnectionModal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled as styledMui } from '@mui/material/styles';
import ProfileKonnectModal from './settings/ProfileKonnectModal';


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#D0BCFF',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#D0BCFF',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#555' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PublicIcon from '@mui/icons-material/Public';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CheckIcon from '@mui/icons-material/Check';
import BrushIcon from '@mui/icons-material/Brush';
import PersonIcon from '@mui/icons-material/Person';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LinkIcon from '@mui/icons-material/Link';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SvgIcon from '@mui/material/SvgIcon';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BlockIcon from '@mui/icons-material/Block';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import ChatIcon from '@mui/icons-material/Chat';
import CloudIcon from '@mui/icons-material/Cloud';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShieldIcon from '@mui/icons-material/Shield';
import DevicesIcon from '@mui/icons-material/Devices';
import { SessionManager } from '../../UIKIT';
import ColorizeIcon from '@mui/icons-material/Colorize';
import DeleteChannelDialog from '../../components/DeleteChannelDialog';


const SettingsContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: 0,
  [theme.breakpoints.down('sm')]: {
    paddingBottom: '100px'
  }
}));

const SettingsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
}));

export const SettingsCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backgroundImage: 'unset',
  backgroundColor: theme.palette.mode === 'light' 
    ? alpha(theme.palette.background.paper, 0.95)
    : theme.palette.mode === 'contrast'
      ? alpha('#101010', 0.95)
      : alpha('#1c1c1c', 0.95),
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(0, 0, 0, 0.08)'
    : '1px solid rgba(255, 255, 255, 0.05)',
  '&:hover': {
    boxShadow: theme.palette.mode === 'light'
      ? '0 8px 30px rgba(0, 0, 0, 0.15)'
      : '0 8px 30px rgba(0, 0, 0, 0.25)'
  }
}));

export const SettingsCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main
  }
}));

const ColorPreview = styled(Box)(({ bg }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: bg,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'light'
    ? 'rgba(240, 240, 240, 0.8)'
    : theme.palette.mode === 'contrast'
      ? 'rgba(10, 10, 10, 0.8)' 
      : 'rgba(16, 16, 16, 0.6)',
  borderRadius: 8,
  padding: '4px',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
  '& .MuiTab-root': {
    fontWeight: 600,
    textTransform: 'none',
    minWidth: 120,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.MuiTab-root': {
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    }
  },
}));

const FileInput = styled('input')({
  display: 'none',
});

const getSocialIcon = (name, url) => {
  if (url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('facebook.com')) return <FacebookIcon />;
    if (lowerUrl.includes('twitter.com')) return <TwitterIcon />;
    if (lowerUrl.includes('instagram.com')) return <InstagramIcon />;
    if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.')) return <TelegramIcon />;
    if (lowerUrl.includes('youtube.com')) return <YouTubeIcon />;
    if (lowerUrl.includes('vk.com')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2M15.54 13.5C15.24 13.41 14.95 13.33 14.7 13.21C13.3 12.58 12.64 11.3 12.34 10.55C12.23 10.26 12.16 10 12.15 9.89C12.15 9.89 12.15 9.89 12.15 9.89V9.85C12.15 9.63 12.34 9.44 12.56 9.44H13.43C13.6 9.44 13.75 9.59 13.75 9.76V9.76C13.81 9.93 13.82 9.98 13.96 10.26C14.11 10.59 14.36 11.09 14.91 11.54C15.18 11.77 15.34 11.75 15.46 11.66C15.46 11.66 15.5 11.55 15.5 11.13V10.11C15.46 9.85 15.4 9.77 15.35 9.67C15.32 9.61 15.29 9.56 15.27 9.47C15.27 9.37 15.35 9.28 15.45 9.28H17.1C17.27 9.28 17.4 9.41 17.4 9.58V10.94C17.4 11.05 17.42 11.94 18.05 11.94C18.38 11.94 18.66 11.63 19.07 11.15C19.5 10.57 19.71 10.08 19.81 9.85C19.86 9.76 19.93 9.53 20.04 9.47C20.12 9.42 20.21 9.44 20.28 9.44H21.1C21.27 9.44 21.42 9.59 21.42 9.77C21.42 9.77 21.42 9.77 21.42 9.77C21.46 9.97 21.39 10.14 21.17 10.45C20.88 10.91 20.57 11.32 20.32 11.66C19.58 12.68 19.58 12.75 20.35 13.46C20.65 13.76 20.9 14.02 21.1 14.25C21.27 14.45 21.45 14.66 21.6 14.89C21.69 15.04 21.77 15.19 21.74 15.37C21.71 15.57 21.53 15.72 21.33 15.72H20.2C19.84 15.72 19.77 15.5 19.44 15.11C19.37 15.02 19.28 14.94 19.2 14.85C18.98 14.59 18.81 14.4 18.59 14.23C18 13.71 17.57 13.77 17.33 13.77C17.13 13.79 16.98 13.95 16.98 14.15V15.07C16.98 15.35 16.95 15.5 16.71 15.62C16.66 15.62 16.57 15.67 16.53 15.67H15.54V13.5Z" /></svg>;
    if (lowerUrl.includes('tiktok.com')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.5 0-1.4 1.16-2.5 2.59-2.5.27 0 .53.04.77.13v-3.13c-.25-.02-.5-.04-.77-.04-3.09 0-5.59 2.57-5.59 5.67 0 3.1 2.5 5.67 5.59 5.67 3.09 0 5.59-2.57 5.59-5.67V9.14c.85.63 1.91 1.05 3.09 1.05V7.15c-1.32 0-2.59-.7-3.09-1.33z"/></svg>;
  }
  
  const lowerName = (name || '').toLowerCase();
  switch (lowerName) {
    case 'facebook':
      return <FacebookIcon />;
    case 'twitter':
      return <TwitterIcon />;
    case 'instagram':
      return <InstagramIcon />;
    case 'telegram':
      return <TelegramIcon />;
    case 'youtube':
      return <YouTubeIcon />;
    case 'vk':
    case 'вконтакте':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2M15.54 13.5C15.24 13.41 14.95 13.33 14.7 13.21C13.3 12.58 12.64 11.3 12.34 10.55C12.23 10.26 12.16 10 12.15 9.89C12.15 9.89 12.15 9.89 12.15 9.89V9.85C12.15 9.63 12.34 9.44 12.56 9.44H13.43C13.6 9.44 13.75 9.59 13.75 9.76V9.76C13.81 9.93 13.82 9.98 13.96 10.26C14.11 10.59 14.36 11.09 14.91 11.54C15.18 11.77 15.34 11.75 15.46 11.66C15.46 11.66 15.5 11.55 15.5 11.13V10.11C15.46 9.85 15.4 9.77 15.35 9.67C15.32 9.61 15.29 9.56 15.27 9.47C15.27 9.37 15.35 9.28 15.45 9.28H17.1C17.27 9.28 17.4 9.41 17.4 9.58V10.94C17.4 11.05 17.42 11.94 18.05 11.94C18.38 11.94 18.66 11.63 19.07 11.15C19.5 10.57 19.71 10.08 19.81 9.85C19.86 9.76 19.93 9.53 20.04 9.47C20.12 9.42 20.21 9.44 20.28 9.44H21.1C21.27 9.44 21.42 9.59 21.42 9.77C21.42 9.77 21.42 9.77 21.42 9.77C21.46 9.97 21.39 10.14 21.17 10.45C20.88 10.91 20.57 11.32 20.32 11.66C19.58 12.68 19.58 12.75 20.35 13.46C20.65 13.76 20.9 14.02 21.1 14.25C21.27 14.45 21.45 14.66 21.6 14.89C21.69 15.04 21.77 15.19 21.74 15.37C21.71 15.57 21.53 15.72 21.33 15.72H20.2C19.84 15.72 19.77 15.5 19.44 15.11C19.37 15.02 19.28 14.94 19.2 14.85C18.98 14.59 18.81 14.4 18.59 14.23C18 13.71 17.57 13.77 17.33 13.77C17.13 13.79 16.98 13.95 16.98 14.15V15.07C16.98 15.35 16.95 15.5 16.71 15.62C16.66 15.62 16.57 15.67 16.53 15.67H15.54V13.5Z" /></svg>;
    case 'tiktok':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.5 0-1.4 1.16-2.5 2.59-2.5.27 0 .53.04.77.13v-3.13c-.25-.02-.5-.04-.77-.04-3.09 0-5.59 2.57-5.59 5.67 0 3.1 2.5 5.67 5.59 5.67 3.09 0 5.59-2.57 5.59-5.67V9.14c.85.63 1.91 1.05 3.09 1.05V7.15c-1.32 0-2.59-.7-3.09-1.33z"/></svg>;
    default:
      
      if (lowerName.includes('facebook')) return <FacebookIcon />;
      if (lowerName.includes('twitter')) return <TwitterIcon />;
      if (lowerName.includes('instagram')) return <InstagramIcon />;
      if (lowerName.includes('telegram')) return <TelegramIcon />;
      if (lowerName.includes('youtube')) return <YouTubeIcon />;
      if (lowerName.includes('vk') || lowerName.includes('вконтакте')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2M15.54 13.5C15.24 13.41 14.95 13.33 14.7 13.21C13.3 12.58 12.64 11.3 12.34 10.55C12.23 10.26 12.16 10 12.15 9.89C12.15 9.89 12.15 9.89 12.15 9.89V9.85C12.15 9.63 12.34 9.44 12.56 9.44H13.43C13.6 9.44 13.75 9.59 13.75 9.76V9.76C13.81 9.93 13.82 9.98 13.96 10.26C14.11 10.59 14.36 11.09 14.91 11.54C15.18 11.77 15.34 11.75 15.46 11.66C15.46 11.66 15.5 11.55 15.5 11.13V10.11C15.46 9.85 15.4 9.77 15.35 9.67C15.32 9.61 15.29 9.56 15.27 9.47C15.27 9.37 15.35 9.28 15.45 9.28H17.1C17.27 9.28 17.4 9.41 17.4 9.58V10.94C17.4 11.05 17.42 11.94 18.05 11.94C18.38 11.94 18.66 11.63 19.07 11.15C19.5 10.57 19.71 10.08 19.81 9.85C19.86 9.76 19.93 9.53 20.04 9.47C20.12 9.42 20.21 9.44 20.28 9.44H21.1C21.27 9.44 21.42 9.59 21.42 9.77C21.42 9.77 21.42 9.77 21.42 9.77C21.46 9.97 21.39 10.14 21.17 10.45C20.88 10.91 20.57 11.32 20.32 11.66C19.58 12.68 19.58 12.75 20.35 13.46C20.65 13.76 20.9 14.02 21.1 14.25C21.27 14.45 21.45 14.66 21.6 14.89C21.69 15.04 21.77 15.19 21.74 15.37C21.71 15.57 21.53 15.72 21.33 15.72H20.2C19.84 15.72 19.77 15.5 19.44 15.11C19.37 15.02 19.28 14.94 19.2 14.85C18.98 14.59 18.81 14.4 18.59 14.23C18 13.71 17.57 13.77 17.33 13.77C17.13 13.79 16.98 13.95 16.98 14.15V15.07C16.98 15.35 16.95 15.5 16.71 15.62C16.66 15.62 16.57 15.67 16.53 15.67H15.54V13.5Z" /></svg>;
      if (lowerName.includes('tiktok')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.5 0-1.4 1.16-2.5 2.59-2.5.27 0 .53.04.77.13v-3.13c-.25-.02-.5-.04-.77-.04-3.09 0-5.59 2.57-5.59 5.67 0 3.1 2.5 5.67 5.59 5.67 3.09 0 5.59-2.57 5.59-5.67V9.14c.85.63 1.91 1.05 3.09 1.05V7.15c-1.32 0-2.59-.7-3.09-1.33z"/></svg>;
      
      return <PublicIcon />;
  }
};


const FileUploader = ({ id, currentImage, onFileSelect, icon, label, borderRadius }) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Неподдерживаемый формат файла. Разрешены только JPEG, PNG и GIF');
      return;
    }

    onFileSelect(file);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: borderRadius || '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          '& .MuiBox-root': {
            opacity: 1,
          },
        },
      }}
    >
      <input
        type="file"
        id={id}
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <label htmlFor={id} style={{ cursor: 'pointer', display: 'block', height: '100%' }}>
        {currentImage ? (
          <Box
            component="img"
            src={currentImage}
            alt="Upload preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: borderRadius || '12px',
              p: 2,
            }}
          >
            {icon}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {label}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
        >
          <Typography variant="body2" color="white" sx={{ mt: 1 }}>
            Изменить
          </Typography>
        </Box>
      </label>
    </Box>
  );
};


const ColorPicker = ({ label, color, onChange }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [red, setRed] = useState(parseInt(color.slice(1, 3), 16));
  const [green, setGreen] = useState(parseInt(color.slice(3, 5), 16));
  const [blue, setBlue] = useState(parseInt(color.slice(5, 7), 16));
  
  
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  
  const updateColor = (r, g, b) => {
    const hexColor = rgbToHex(r, g, b);
    setCurrentColor(hexColor);
    onChange(hexColor); 
  };
  
  
  const handleRedChange = (event, value) => {
    setRed(value);
    updateColor(value, green, blue);
  };
  
  const handleGreenChange = (event, value) => {
    setGreen(value);
    updateColor(red, value, blue);
  };
  
  const handleBlueChange = (event, value) => {
    setBlue(value);
    updateColor(red, green, value);
  };
  
  
  const handlePresetColorClick = (presetColor) => {
    const r = parseInt(presetColor.slice(1, 3), 16);
    const g = parseInt(presetColor.slice(3, 5), 16);
    const b = parseInt(presetColor.slice(5, 7), 16);
    
    setCurrentColor(presetColor);
    setRed(r);
    setGreen(g);
    setBlue(b);
    onChange(presetColor); 
  };
  
  
  const handleHexChange = (value) => {
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i)) {
      setCurrentColor(value);
      
      
      const r = parseInt(value.slice(1, 3), 16);
      const g = parseInt(value.slice(3, 5), 16);
      const b = parseInt(value.slice(5, 7), 16);
      
      setRed(r);
      setGreen(g);
      setBlue(b);
      
      onChange(value); 
    }
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography variant="body2" sx={{ minWidth: 180, color: 'text.secondary' }}>{label}</Typography>
      <Tooltip title="Нажмите для выбора цвета">
        <Badge 
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ColorLensIcon sx={{ fontSize: 12, color: 'primary.main' }} />
            </Box>
          }
        >
          <ColorPreview bg={color} onClick={() => setOpen(true)} />
        </Badge>
      </Tooltip>
      
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: { 
            bgcolor: theme.palette.background.paper, 
            color: theme.palette.text.primary,
            borderRadius: 2,
            boxShadow: theme.shadows[24],
            '@media (max-width: 600px)': {
              width: '100%',
              maxWidth: '100%',
              margin: 0,
              borderRadius: 0,
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaletteIcon fontSize="small" color="primary" />
            <Typography variant="h6">Выберите цвет</Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ 
            height: 100, 
            width: '100%', 
            backgroundColor: currentColor, 
            borderRadius: 2, 
            mb: 3,
            boxShadow: `0 4px 20px ${alpha(currentColor, 0.5)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Красный ({red})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={red}
                onChange={handleRedChange}
                min={0}
                max={255}
                sx={{ 
                  color: '#f44336',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#f44336',
                  },
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Зеленый ({green})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={green}
                onChange={handleGreenChange}
                min={0}
                max={255}
                sx={{ 
                  color: '#4caf50',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#4caf50',
                  },
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Синий ({blue})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={blue}
                onChange={handleBlueChange}
                min={0}
                max={255}
                sx={{ 
                  color: '#2196f3',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#2196f3',
                  },
                }}
              />
            </Box>
          </Box>
          
          <TextField
            label="HEX код"
            value={currentColor}
            onChange={(e) => handleHexChange(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ height: 16, width: 16, backgroundColor: currentColor, borderRadius: 1 }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[
              '#000000', '#FFFFFF', '#F44336', '#E91E63', '#9C27B0', '#673AB7',
              '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
              '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
            ].map((presetColor) => (
              <Box
                key={presetColor}
                sx={{
                  height: 32,
                  width: 32,
                  backgroundColor: presetColor,
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
                onClick={() => handlePresetColorClick(presetColor)}
              />
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setOpen(false)} color="primary" variant="contained">
            Готово
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const PurchaseDialogHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '8px 8px 0 0',
  background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.15) 0%, rgba(124, 77, 255, 0.25) 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  }
}));

const PurchaseButton = styled(Button)(({ theme }) => ({
  backgroundImage: 'linear-gradient(135deg, rgba(100, 181, 246, 0.8) 0%, rgba(25, 118, 210, 0.9) 100%)',
  borderRadius: 12,
  padding: theme.spacing(1.2, 3),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
    transform: 'translateY(0)',
  },
  '&.Mui-disabled': {
    background: 'rgba(30, 30, 30, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }
}));


const UsernameShopTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [username, setUsername] = useState('');
  const [usernameData, setUsernameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState([]);
  const [error, setError] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isChangingActive, setIsChangingActive] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [purchaseAnimation, setPurchaseAnimation] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [usernameLimit, setUsernameLimit] = useState(3); 
  
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  
  
  
  const showNotification = (severity, message) => {
    if (!message) {
      message = severity === 'error' 
        ? 'Произошла ошибка при выполнении операции' 
        : 'Операция выполнена';
    }
    
    
    if (typeof message === 'object' && message !== null) {
      if (message.message) {
        message = message.message;
      } else {
        try {
          message = JSON.stringify(message);
        } catch (e) {
          message = 'Неизвестная ошибка';
        }
      }
    }
    
    
    setSnackbar({
      open: true,
      message,
      severity
    });
    
    
    enqueueSnackbar(message, { 
      variant: severity,
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
    });
  };
  
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  
  const calculateUsernameLimit = (subscriptionType) => {
    if (!subscriptionType) return 3; 
    if (subscriptionType === 'basic') return 5;
    if (subscriptionType === 'premium') return 8;
    if (subscriptionType === 'ultimate') return Infinity; 
    return 3; 
  };
  
  
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get('/api/user/subscription/status');
      if (response.data.active) {
        setUserSubscription(response.data);
        const newLimit = calculateUsernameLimit(response.data.subscription_type);
        setUsernameLimit(newLimit);
      } else {
        setUserSubscription(null);
        setUsernameLimit(3);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setUserSubscription(null);
      setUsernameLimit(3);
    }
  };
  
  
  useEffect(() => {
    fetchPurchasedUsernames();
    fetchUserPoints();
    fetchSubscriptionStatus();
  }, []);
  
  const fetchPurchasedUsernames = async () => {
    try {
      const response = await axios.get('/api/username/purchased');
      if (response.data.success) {
        const usernames = response.data.usernames || [];
        setPurchased(usernames);
        setLimitReached(usernames.length >= usernameLimit);
      } else {
        setError(response.data.message || 'Failed to fetch purchased usernames');
        setPurchased([]);
      }
    } catch (e) {
      console.error('Error fetching purchased usernames', e);
      setError('Error loading purchased usernames: ' + e.message);
      setPurchased([]);
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
  
  const handleUsernameChange = (e) => {
    const value = e.target.value; // .trim() удален, чтобы разрешить пробелы для проверки, но они будут удалены позже
    setUsername(value);

    if (!value) {
      setUsernameData(null);
      setError('');
      return;
    }

    // --- Новая логика валидации ---
    const isCyrillic = /[а-яА-ЯёЁ]/.test(value);
    const isLatin = /[a-zA-Z]/.test(value);
    let validationError = '';

    if (value.length < 3) {
      validationError = 'Юзернейм должен содержать не менее 3 символов';
    } else if (value.length > 16) {
      validationError = 'Юзернейм не должен превышать 16 символов';
    } else if (isCyrillic && isLatin) {
      validationError = 'Юзернейм не может содержать одновременно кириллицу и латиницу';
    } else if (isCyrillic) {
      // Правила для кириллицы
      if (!/^[а-яА-ЯёЁ0-9]+$/.test(value)) {
        validationError = 'Кириллический юзернейм может содержать только буквы и цифры';
      }
    } else if (isLatin) {
      // Правила для латиницы
      if (!/^[a-zA-Z]/.test(value)) {
        validationError = 'Латинский юзернейм должен начинаться с буквы';
      } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
        validationError = 'Латинский юзернейм содержит недопустимые символы';
      } else if (/[._-]{2,}/.test(value)) {
        validationError = 'Спецсимволы не могут идти подряд';
      } else if ((value.match(/[._-]/g) || []).length > 1) {
        validationError = 'Может быть использован только один спецсимвол (. или _ или -)';
      }
    } else if (!isCyrillic && !isLatin) {
        validationError = 'Юзернейм должен содержать хотя бы одну букву';
    }
    
    if (validationError) {
      setError(validationError);
      setUsernameData(null);
      return;
    }
    // --- Конец новой логики ---

    setError('');

    const delayDebounceFn = setTimeout(() => {
      calculateUsernamePrice(value.trim()); // Отправляем на сервер уже очищенное значение
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  };
  
  const calculateUsernamePrice = async (value) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/api/username/calculate-price', { username: value });
      
      if (response.data.success) {
        setUsernameData(response.data);
      } else {
        setError(response.data.message || 'Error calculating price');
        setUsernameData(null);
      }
    } catch (e) {
      console.error('Error calculating username price', e);
      setError('Error calculating price: ' + (e.response?.data?.message || e.message));
      setUsernameData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenPurchaseDialog = () => {
    if (!username || !usernameData || !usernameData.available || usernameData.owned || userPoints < usernameData.price) {
      return;
    }
    setOpenPurchaseDialog(true);
  };
  
  const handlePurchase = async () => {
    if (!username || !usernameData || !usernameData.available || usernameData.owned) {
      return;
    }
    
    try {
      setPurchasing(true);
      setPurchaseAnimation(true);
      setError('');
      
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await axios.post('/api/username/purchase', { 
        username,
        subscription_type: userSubscription?.subscription_type || null
      });
      
      if (response.data.success) {
        
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userData.points = response.data.new_balance;
            localStorage.setItem('userData', JSON.stringify(userData));
          } catch (e) {
            console.error('Error updating points in localStorage', e);
          }
        }
        
        
        setUserPoints(response.data.new_balance);
        
        
        setPurchaseComplete(true);
        
        
        setTimeout(() => {
          setOpenPurchaseDialog(false);
          setPurchaseAnimation(false);
          setPurchaseComplete(false);
          
          
          showNotification('success', response.data.message || 'Username purchased successfully!');
          
          
          setUsername('');
          setUsernameData(null);
          
          
          fetchPurchasedUsernames();
        }, 1000);
      } else {
        setError(response.data.message || 'Failed to purchase username');
        showNotification('error', response.data.message || 'Failed to purchase username');
        setOpenPurchaseDialog(false);
        setPurchaseAnimation(false);
      }
    } catch (e) {
      console.error('Error purchasing username', e);
      const errorData = e.response?.data || {};
      const errorMessage = errorData.message || e.message;
      
      
      if (errorData.limit_reached) {
        setLimitReached(true);
        showNotification('warning', errorMessage);
        
        if (errorData.donation_url) {
          window.open(errorData.donation_url, '_blank');
        }
      } else {
        
        const message = errorMessage.includes('PurchasedUsername') ? 
          'Server error: Problem creating purchased username entry. Please try again later.' : 
          'Error purchasing username: ' + errorMessage;
        
        setError(message);
        showNotification('error', message);
      }
      
      setOpenPurchaseDialog(false);
      setPurchaseAnimation(false);
    } finally {
      setPurchasing(false);
      
      fetchUserPoints();
    }
  };
  
  const handleSetActive = (usernameObj) => {
    setSelectedUsername(usernameObj);
    setOpenConfirmDialog(true);
  };
  
  const confirmSetActive = async () => {
    if (!selectedUsername) return;
    
    setIsChangingActive(true);
    
    try {
      const response = await axios.post('/api/username/set-active', { username_id: selectedUsername.id });
      
      if (response.data.success) {
        
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userData.username = response.data.username;
            localStorage.setItem('userData', JSON.stringify(userData));
          } catch (e) {
            console.error('Error updating username in localStorage', e);
          }
        }
        
        
        showNotification('success', response.data.message || 'Username changed successfully!');
        
        
        fetchPurchasedUsernames();
      } else {
        setError(response.data.message || 'Failed to change username');
        showNotification('error', response.data.message || 'Failed to change username');
      }
    } catch (e) {
      console.error('Error changing username', e);
      setError('Error changing username: ' + (e.response?.data?.message || e.message));
      showNotification('error', 'Error changing username: ' + (e.response?.data?.message || e.message));
    } finally {
      setIsChangingActive(false);
      setOpenConfirmDialog(false);
    }
  };
  
  
  const getLengthFactor = (length) => {
    if (length <= 3) return 3.0;
    if (length <= 6) return 2.0;
    if (length <= 10) return 1.5;
    return 1.0;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  
  useEffect(() => {
    if (purchased.length > 0) {
      
      if (userSubscription?.subscription_type === 'ultimate') {
        setLimitReached(false);
      } else {
        setLimitReached(purchased.length >= usernameLimit);
      }
    }
  }, [usernameLimit, purchased.length, userSubscription]);
  
  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
    <Box sx={{ 
        mb: { xs: 2, md: 4 }, 
        p: { xs: 1.5, md: 2 }, 
        bgcolor: 'rgba(30, 30, 30, 0.6)', 
        borderRadius: 2 
      }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Приобретайте уникальные юзернеймы и выделитесь среди других пользователей! Чем короче и популярнее юзернейм, тем он дороже.
      </Typography>
        <Typography variant="body2" sx={{ color: '#D0BCFF' }}>
          У вас {userPoints} баллов
        </Typography>
      </Box>
      
      
      <Paper 
        elevation={0} 
            sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: { xs: 2, md: 3 }, 
          bgcolor: 'rgba(18, 18, 18, 0.9)', 
          borderRadius: 2,
          border: '1px solid rgba(208, 188, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon sx={{ color: '#D0BCFF', mr: 1.5, fontSize: '1.2rem' }} />
          <Typography variant="h6" sx={{ color: '#D0BCFF', fontWeight: 600, fontSize: '1.1rem' }}>
          Правила покупки юзернеймов
            </Typography>
        </Box>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {userSubscription && userSubscription.subscription_type === 'ultimate' ? (
              <span>С подпиской <strong style={{ color: '#D0BCFF' }}>Ultimate</strong> вы можете приобрести <strong style={{ color: '#4CAF50' }}>неограниченное количество</strong> юзернеймов.</span>
            ) : (
              <span>
                Вы можете купить до <strong style={{ color: '#D0BCFF' }}>{usernameLimit === Infinity ? "∞" : usernameLimit} юзернеймов</strong> на один аккаунт
                {userSubscription ? (
                  <span> с вашей <strong style={{ color: '#D0BCFF' }}>{userSubscription.subscription_type === 'basic' ? 'Basic' : 'Premium'}</strong> подпиской.</span>
                ) : (
                  <span>.</span>
                )}
              </span>
            )}
            {limitReached && (
              <span style={{ color: '#FF9800', fontWeight: 'bold' }}> Вы достигли лимита.</span>
            )}
            </Typography>
          
          <Divider sx={{ my: 1.5, borderColor: 'rgba(208, 188, 255, 0.1)' }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: 'rgba(0, 0, 0, 0.2)', 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                height: '100%'
              }}>
                <Typography variant="subtitle2" sx={{ color: '#D0BCFF', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <StraightenIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                  Цена зависит от длины:
              </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label="1-3 символа: x3.0" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(208, 188, 255, 0.1)', color: '#fff', border: '1px solid rgba(208, 188, 255, 0.2)' }}
                  />
                  <Chip 
                    label="4-6 символов: x2.0" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(208, 188, 255, 0.08)', color: '#fff', border: '1px solid rgba(208, 188, 255, 0.15)' }}
                  />
                  <Chip 
                    label="7-10 символов: x1.5" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(208, 188, 255, 0.05)', color: '#fff', border: '1px solid rgba(208, 188, 255, 0.1)' }}
                  />
                  <Chip 
                    label="11+ символов: x1.0" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(208, 188, 255, 0.02)', color: '#fff', border: '1px solid rgba(208, 188, 255, 0.07)' }}
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: 'rgba(0, 0, 0, 0.2)', 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                height: '100%' 
              }}>
                <Typography variant="subtitle2" sx={{ color: '#D0BCFF', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                  Популярность:
              </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                Чем популярнее юзернейм, тем выше его стоимость. Популярность зависит от частоты использования подобных юзернеймов.
              </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {limitReached && (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 2, 
                borderRadius: 2,
                backgroundColor: 'rgba(237, 108, 2, 0.1)',
                border: '1px solid rgba(237, 108, 2, 0.2)',
                '& .MuiAlert-icon': { color: '#FF9800' }
              }}
            >
              {!userSubscription ? (
                <span>Для увеличения лимита приобретите подписку или обратитесь в поддержку t.me/KConnectSUP_bot</span>
              ) : userSubscription.subscription_type !== 'ultimate' ? (
                <span>Для снятия ограничений перейдите на подписку Ultimate или обратитесь в поддержку t.me/KConnectSUP_bot</span>
              ) : (
                <span>Для решения вопроса обратитесь в поддержку t.me/KConnectSUP_bot</span>
              )}
            </Alert>
          )}
          
          {!userSubscription && (
            <Alert 
              severity="info" 
              icon={<AttachMoneyIcon fontSize="inherit" />}
              sx={{ 
                mt: 2, 
                borderRadius: 2,
                backgroundColor: 'rgba(41, 182, 246, 0.1)',
                border: '1px solid rgba(41, 182, 246, 0.2)',
                '& .MuiAlert-icon': { color: '#29B6F6' }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Увеличьте лимит юзернеймов с подпиской:
              </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                  <Chip label="Basic: 5 юзернеймов" size="small" color="primary" variant="outlined" />
                  <Chip label="Premium: 8 юзернеймов" size="small" color="primary" variant="outlined" />
                  <Chip label="Ultimate: без ограничений" size="small" color="primary" variant="outlined" />
                </Box>
              <Button 
                variant="outlined" 
                size="small" 
                color="primary"
                onClick={() => navigate('/balance')}
                  startIcon={<ShoppingCartIcon fontSize="small" />}
                  sx={{ alignSelf: 'flex-start', borderRadius: 2, textTransform: 'none' }}
              >
                Купить подписку
              </Button>
              </Box>
            </Alert>
          )}
          </Box>
      </Paper>
      
      {/* Поиск юзернейма */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: { xs: 2, md: 3 }, 
          bgcolor: 'rgba(18, 18, 18, 0.9)', 
      borderRadius: 2, 
          border: '1px solid rgba(208, 188, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          opacity: limitReached ? 0.7 : 1,
          position: 'relative'
        }}
      >
        {limitReached && userSubscription?.subscription_type !== 'ultimate' && (
        <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 1,
            borderRadius: 2,
          }}>
            <Box sx={{ textAlign: 'center', p: 3, maxWidth: '80%' }}>
              <LockIcon sx={{ fontSize: 48, color: '#FF9800', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#FF9800', mb: 1.5, fontWeight: 600 }}>
                Достигнут лимит юзернеймов
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                {!userSubscription ? (
                  <>
                    Вы уже приобрели максимальное количество юзернеймов ({usernameLimit}).
                    Приобретите подписку для увеличения лимита.
                  </>
                ) : userSubscription.subscription_type === 'basic' ? (
                  <>Вы уже приобрели максимальное количество юзернеймов ({usernameLimit}).
                  Перейдите на Premium (8) или Ultimate (без ограничений).</>
                ) : (
                  <>Вы уже приобрели максимальное количество юзернеймов ({usernameLimit}).
                  Перейдите на Ultimate для получения безлимитного доступа.</>
                )}
          </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
              {(!userSubscription || userSubscription.subscription_type !== 'ultimate') && (
                <Button 
                    variant="contained" 
                  color="primary"
                  onClick={() => navigate('/balance')}
                    startIcon={<ShoppingCartIcon />}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Купить подписку
                </Button>
              )}
              <Button 
                variant="outlined" 
                color="primary"
                href="https://t.me/KConnectSUP_bot"
                target="_blank"
                  startIcon={<SupportAgentIcon />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Поддержка
              </Button>
              </Box>
        </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ color: '#D0BCFF', mr: 1.5, fontSize: '1.2rem' }} />
          <Typography variant="h6" sx={{ color: '#D0BCFF', fontWeight: 600, fontSize: '1.1rem' }}>
          Найти и приобрести юзернейм
        </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
          Юзернейм должен начинаться с латинской буквы и может содержать только один спецсимвол (. или _ или -). 
          Длина от 3 до 16 символов. Более короткие юзернеймы стоят дороже.
        </Typography>
        
        <TextField
          fullWidth
          label="Введите желаемый юзернейм"
          variant="outlined"
          value={username}
          onChange={handleUsernameChange}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'rgba(208, 188, 255, 0.5)',
                borderWidth: '1px'
              },
              '&:hover fieldset': {
                borderColor: '#D0BCFF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#D0BCFF',
                borderWidth: '1px'
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#D0BCFF'
            },
            '& .MuiFormHelperText-root': {
              fontSize: '0.75rem',
              marginTop: '4px',
              marginLeft: '4px'
            }
          }}
          helperText="Юзернейм должен: 1) начинаться с латинской буквы, 2) содержать только один спецсимвол (. или _ или -), 3) быть длиной от 3 до 16 символов. Спецсимволы не могут повторяться подряд."
          error={!!error}
          InputProps={{
            endAdornment: username && (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setUsername('')}
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} sx={{ color: '#D0BCFF' }} />
          </Box>
        )}
        
        {usernameData && usernameData.available && !usernameData.owned && (
          <Box sx={{ 
            mt: 2, 
            p: { xs: 2, md: 2.5 }, 
            bgcolor: 'rgba(30, 30, 30, 0.7)', 
            borderRadius: 2,
            border: '1px solid rgba(208, 188, 255, 0.15)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <CheckCircleIcon sx={{ color: '#81C784', mr: 1, fontSize: '1.2rem' }} />
              <Typography variant="subtitle1" sx={{ color: '#81C784', fontWeight: 600 }}>
              Юзернейм доступен!
      </Typography>
            </Box>
            
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 2
            }}>
              <Chip 
                icon={<StraightenIcon />}
                label={`Длина: ${usernameData?.length || 0} символов (x${getLengthFactor(usernameData?.length || 0)})`}
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(208, 188, 255, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(208, 188, 255, 0.15)',
                  fontWeight: 500,
                  '& .MuiChip-icon': { color: 'rgba(255, 255, 255, 0.8)' }
                }}
              />
              <Chip 
                icon={<TrendingUpIcon />}
                label={`Популярность: x${usernameData?.popularity?.toFixed(1) || '1.0'}`}
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(208, 188, 255, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(208, 188, 255, 0.15)',
                  fontWeight: 500,
                  '& .MuiChip-icon': { color: 'rgba(255, 255, 255, 0.8)' }
                }}
              />
            </Box>
      
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', my: 1.5 }} />
      
      <Box sx={{ 
        display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center', 
              justifyContent: 'space-between', 
              mt: 1.5,
              gap: isMobile ? 1.5 : 0
            }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Стоимость:
                </Typography>
                <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                color: '#D0BCFF',
                  fontSize: '1.25rem',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center'
              }}>
                  <AttachMoneyIcon sx={{ fontSize: '1.2rem', mr: 0.5 }} />
                  {usernameData?.price || 0} баллов
              </Typography>
              </Box>
              
              <Button 
                variant="contained"
                color="primary"
                disabled={purchasing || userPoints < (usernameData?.price || 0)}
                onClick={handleOpenPurchaseDialog}
                startIcon={purchasing ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
            sx={{ 
                  bgcolor: '#D0BCFF', 
                  color: '#1A1A1A',
                  fontWeight: 600,
                  width: isMobile ? '100%' : 'auto',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(208, 188, 255, 0.3)',
                  '&:hover': {
                    bgcolor: '#B39DDB',
                    boxShadow: '0 6px 15px rgba(208, 188, 255, 0.4)',
                  },
                }}
              >
                {purchasing ? 'Покупка...' : 'Купить'}
              </Button>
            </Box>
            
            {userPoints < (usernameData?.price || 0) && (
              <Alert 
                severity="warning" 
                icon={<AccountBalanceWalletIcon fontSize="inherit" />}
                sx={{ 
                  mt: 2, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(237, 108, 2, 0.1)',
                  border: '1px solid rgba(237, 108, 2, 0.2)',
                  '& .MuiAlert-icon': { color: '#FF9800' }
                }}
              >
                У вас недостаточно баллов для покупки этого юзернейма. 
                <Button 
                  size="small" 
                  sx={{ ml: 1, textTransform: 'none', fontSize: '0.75rem' }} 
                  onClick={() => navigate('/balance')}
                >
                  Пополнить баланс
                </Button>
              </Alert>
            )}
          </Box>
        )}
        
        {usernameData && !usernameData.available && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2, 
              borderRadius: 2,
              backgroundColor: 'rgba(237, 108, 2, 0.1)',
              border: '1px solid rgba(237, 108, 2, 0.2)'
            }}
          >
            Юзернейм уже занят
          </Alert>
        )}
        
        {usernameData && usernameData.owned && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2, 
              borderRadius: 2,
              backgroundColor: 'rgba(41, 182, 246, 0.1)',
              border: '1px solid rgba(41, 182, 246, 0.2)'
            }}
          >
            Вы уже владеете этим юзернеймом
          </Alert>
        )}
      </Paper>
      
      {/* Мои юзернеймы */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: { xs: 2, md: 4 }, 
          bgcolor: 'rgba(18, 18, 18, 0.9)', 
          borderRadius: 2,
          border: '1px solid rgba(208, 188, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BadgeIcon sx={{ color: '#D0BCFF', mr: 1.5, fontSize: '1.2rem' }} />
          <Typography variant="h6" sx={{ color: '#D0BCFF', fontWeight: 600, fontSize: '1.1rem' }}>
          Мои юзернеймы
        </Typography>
        </Box>
        
        {purchased && purchased.length > 0 ? (
          <>
            {/* Desktop view */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <TableContainer sx={{ 
                mt: 1, 
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.05)',
                backgroundColor: 'transparent'
              }}>
                <Table size="medium">
              <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(208, 188, 255, 0.05)' }}>
                      <TableCell sx={{ color: '#D0BCFF', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Юзернейм</TableCell>
                      <TableCell sx={{ color: '#D0BCFF', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Цена</TableCell>
                      <TableCell sx={{ color: '#D0BCFF', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Дата покупки</TableCell>
                      <TableCell sx={{ color: '#D0BCFF', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Статус</TableCell>
                      <TableCell sx={{ color: '#D0BCFF', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchased.map((item) => (
                  <TableRow key={item.id} sx={{ 
                        bgcolor: item.is_active ? 'rgba(208, 188, 255, 0.05)' : 'transparent',
                        '&:hover': { bgcolor: 'rgba(208, 188, 255, 0.03)' },
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                  }}>
                    <TableCell 
                      sx={{ 
                        fontWeight: item.is_active ? 'bold' : 'normal', 
                        color: item.is_active ? '#D0BCFF' : 'inherit',
                        maxWidth: '120px',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                            borderBottom: 'none'
                      }}
                    >
                      {item.username}
                    </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>{item.price_paid} баллов</TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>{formatDate(item.purchase_date)}</TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                      {item.is_active ? (
                            <Chip 
                              label="Активен" 
                              color="success" 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(76, 175, 80, 0.15)', 
                                color: '#81C784',
                                border: '1px solid rgba(76, 175, 80, 0.3)',
                                fontWeight: 500
                              }} 
                            />
                      ) : item.is_current ? (
                            <Chip 
                              label="Текущий" 
                              color="warning" 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(255, 152, 0, 0.15)', 
                                color: '#FFB74D',
                                border: '1px solid rgba(255, 152, 0, 0.3)',
                                fontWeight: 500
                              }} 
                            />
                      ) : null}
                    </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                      {!item.is_active && (
          <Button 
            variant="outlined" 
            size="small"
                          onClick={() => handleSetActive(item)}
            sx={{ 
                            borderColor: '#D0BCFF',
                            color: '#D0BCFF',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '0.8125rem',
                            '&:hover': {
                              borderColor: '#D0BCFF',
                              color: '#D0BCFF',
                              bgcolor: 'rgba(208, 188, 255, 0.05)'
                            }
                          }}
                        >
                          Использовать
          </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            </Box>
            
            {/* Mobile view */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, mt: 2 }}>
              {purchased.map((item) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${item.is_active ? 'rgba(208, 188, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                    backgroundColor: item.is_active ? 'rgba(208, 188, 255, 0.05)' : 'rgba(16, 16, 16, 0.5)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: item.is_active ? 600 : 500, 
                        color: item.is_active ? '#D0BCFF' : 'white',
                        wordBreak: 'break-word'
                      }}
                    >
                      {item.username}
                    </Typography>
                    
                    {(item.is_active || item.is_current) && (
                      <Chip
                        label={item.is_active ? "Активен" : "Текущий"}
                        color={item.is_active ? "success" : "warning"}
                        size="small"
                        sx={{ 
                          bgcolor: item.is_active 
                            ? 'rgba(76, 175, 80, 0.15)'
                            : 'rgba(255, 152, 0, 0.15)',
                          color: item.is_active ? '#81C784' : '#FFB74D',
                          border: item.is_active
                            ? '1px solid rgba(76, 175, 80, 0.3)'
                            : '1px solid rgba(255, 152, 0, 0.3)',
                          fontWeight: 500,
                          height: 24
                        }}
                      />
                    )}
                  </Box>

                  <Grid container spacing={1} sx={{ mb: 1.5 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Цена:
                      </Typography>
                      <Typography variant="body2">
                        {item.price_paid} баллов
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Дата покупки:
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(item.purchase_date)}
                      </Typography>
                    </Grid>
                  </Grid>

                  {!item.is_active && (
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => handleSetActive(item)}
                      sx={{
                        borderColor: '#D0BCFF',
                        color: '#D0BCFF',
                        borderRadius: 2,
                        textTransform: 'none',
                        mt: 1,
                        '&:hover': {
                          borderColor: '#D0BCFF',
                          color: '#D0BCFF',
                          bgcolor: 'rgba(208, 188, 255, 0.05)'
                        }
                      }}
                    >
                      Использовать
                    </Button>
                  )}
                </Paper>
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center', 
            color: 'text.secondary', 
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2, 
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <BadgeIcon sx={{ fontSize: 40, color: 'rgba(208, 188, 255, 0.3)', mb: 1 }} />
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            У вас пока нет приобретенных юзернеймов
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
              Используйте форму выше, чтобы найти и приобрести уникальный юзернейм
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Диалоги оставляем без изменений */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1e1e1e',
            color: '#fff',
            borderRadius: '8px'
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: '#D0BCFF', p: isMobile ? 2 : 3 }}>
          Сменить юзернейм
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <DialogContentText sx={{ color: '#eeeeee' }}>
            Вы уверены, что хотите изменить свой юзернейм на <strong style={{ 
              color: '#D0BCFF', 
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>{selectedUsername?.username}</strong>?
            <br/><br/>
            Этот юзернейм будет отображаться в вашем профиле и всех ваших действиях на платформе.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenConfirmDialog(false)} 
            sx={{ color: '#D0BCFF' }}
            disabled={isChangingActive}
          >
            Отмена
          </Button>
          <Button 
            onClick={confirmSetActive} 
            variant="contained" 
            disabled={isChangingActive}
            startIcon={isChangingActive ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ 
              bgcolor: '#D0BCFF', 
              color: '#1A1A1A',
              '&:hover': {
                bgcolor: '#B39DDB',
              }
            }}
          >
            {isChangingActive ? 'Применение...' : 'Применить'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={openPurchaseDialog} 
        onClose={() => !purchaseAnimation && setOpenPurchaseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            backgroundImage: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(20, 20, 20, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }
        }}
      >
        <PurchaseDialogHeader>
          <Avatar sx={{ 
            width: isMobile ? 60 : 70, 
            height: isMobile ? 60 : 70, 
            bgcolor: 'rgba(208, 188, 255, 0.15)', 
            mb: 2,
            border: '2px solid rgba(208, 188, 255, 0.2)'
          }}>
            <ShoppingCartIcon sx={{ fontSize: isMobile ? 30 : 40, color: '#d0bcff' }} />
          </Avatar>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1, fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
            Покупка юзернейма
            </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '80%' }}>
            Вы собираетесь приобрести юзернейм <strong>{username}</strong>
          </Typography>
        </PurchaseDialogHeader>
        
        <DialogContent sx={{ p: isMobile ? 2 : 3, mt: isMobile ? 1 : 2 }}>
          {purchaseAnimation ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: isMobile ? 2 : 3 }}>
              {purchaseComplete ? (
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: isMobile ? 50 : 70, color: '#4CAF50', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    Покупка успешно завершена!
            </Typography>
        </Box>
              ) : (
                <>
                  <CircularProgress size={isMobile ? 50 : 70} sx={{ mb: 3, color: '#D0BCFF' }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Обработка покупки...
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Пожалуйста, подождите
                  </Typography>
                </>
              )}
      </Box>
          ) : (
            <>
              <Box sx={{ mb: isMobile ? 2 : 3 }}>
                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid item xs={12}>
        <Box sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(30, 30, 30, 0.6)', 
                      border: '1px solid rgba(208, 188, 255, 0.2)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                    }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Детали покупки:
          </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Юзернейм: <span style={{ 
                          color: '#D0BCFF', 
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}>{username}</span>
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Длина: {usernameData?.length || 0} символов (x{getLengthFactor(usernameData?.length || 0)})
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Популярность: x{usernameData?.popularity?.toFixed(1) || '1.0'}
                      </Typography>
                      <Divider sx={{ my: 1.5, bgcolor: 'rgba(208, 188, 255, 0.1)' }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Баланс:</Typography>
                        <Typography variant="body1">{userPoints} баллов</Typography>
        </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Стоимость:</Typography>
                        <Typography variant="body1" color="error">-{usernameData?.price || 0} баллов</Typography>
                      </Box>
                      <Divider sx={{ my: 1.5, bgcolor: 'rgba(208, 188, 255, 0.1)' }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1" fontWeight="bold">Останется:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {userPoints - (usernameData?.price || 0)} баллов
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </DialogContent>
        
        {!purchaseAnimation && (
          <Box sx={{ 
            p: isMobile ? 2 : 3, 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(208, 188, 255, 0.1)'
          }}>
          <Button 
              onClick={() => setOpenPurchaseDialog(false)}
            sx={{ 
                borderRadius: 2,
                color: 'rgba(255,255,255,0.7)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
            }}
          >
              Отмена
          </Button>
          <Button 
              onClick={handlePurchase}
              disabled={purchasing}
              startIcon={<ShoppingCartIcon />}
            variant="contained" 
            sx={{ 
                bgcolor: '#D0BCFF', 
                color: '#1A1A1A',
                backgroundImage: 'linear-gradient(135deg, #D0BCFF 0%, #7C4DFF 100%)',
              '&:hover': {
                  backgroundImage: 'linear-gradient(135deg, #B39DDB 0%, #673AB7 100%)',
              }
            }}
          >
              Подтвердить покупку
          </Button>
        </Box>
        )}
      </Dialog>
      
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            bgcolor: severity => severity === 'success' ? 'rgba(46, 125, 50, 0.9)' : 
                      severity === 'error' ? 'rgba(211, 47, 47, 0.9)' :
                      severity === 'warning' ? 'rgba(237, 108, 2, 0.9)' : 'rgba(2, 136, 209, 0.9)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const DecorationItem = styled('img')(({ customStyles }) => ({
  position: 'absolute',
  right: 0,
  height: 'max-content',
  maxHeight: 60,
  opacity: 1,
  pointerEvents: 'none',
  zIndex: 1,
  ...customStyles
}));

const DecorationPreview = ({ decoration, children }) => {
  // Определяем тип фона (градиент, изображение или цвет)
  const isGradient = decoration?.background?.includes('linear-gradient');
  const isImage = decoration?.background?.includes('/');
  const isHexColor = decoration?.background?.startsWith('#');

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 60,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.default',
        background: decoration?.background ? (
          isImage ? 'none' : decoration.background
        ) : 'background.default',
        '&::before': isImage ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${decoration.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.75,
          zIndex: 0,
        } : {},
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
    </Box>
  );
};

const SettingsPage = () => {

  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, updateUserData } = useContext(AuthContext);
  const { themeSettings, updateThemeSettings, setProfileBackground, clearProfileBackground, globalProfileBackgroundEnabled, setGlobalProfileBackgroundEnabled } = useContext(ThemeSettingsContext);
  const { enqueueSnackbar } = useSnackbar();
  
  const [userDecorations, setUserDecorations] = useState([]);
  const [loadingDecorations, setLoadingDecorations] = useState(false);
  const isChannel = user?.account_type === 'channel';
  

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  

  const [sessionManagerOpen, setSessionManagerOpen] = useState(false);
  

  const handleOpenSessionManager = () => {
    setSessionManagerOpen(true);
  };
  
  const handleCloseSessionManager = () => {
    setSessionManagerOpen(false);
  };
  

  const [accountStatus, setAccountStatus] = useState('good'); 
  const [userWarnings, setUserWarnings] = useState([]);
  const [warningsDialogOpen, setWarningsDialogOpen] = useState(false);
  const [loadingWarnings, setLoadingWarnings] = useState(false);
  const [banInfo, setBanInfo] = useState(null);
  
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [socials, setSocials] = useState([]);
  
  
  const [userAchievements, setUserAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [updatingActiveBadge, setUpdatingActiveBadge] = useState(false);
    
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialLink, setNewSocialLink] = useState('');
  
  
  // Упрощенная структура настроек
  const [settings, setSettings] = useState({
    primary_color: '#D0BCFF',
    theme: 'dark'
  });
  
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushNotificationsEnabled: true,
    telegramNotificationsEnabled: false,
    telegramConnected: false
  });
  const [loadingNotificationPrefs, setLoadingNotificationPrefs] = useState(false);
  const [savingNotificationPrefs, setSavingNotificationPrefs] = useState(false);
  const [pushNotificationSupported, setPushNotificationSupported] = useState(false);
  const [pushSubscriptionStatus, setPushSubscriptionStatus] = useState(false);
  
  
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState('default');
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  
  
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [telegramIdInput, setTelegramIdInput] = useState('');
  const [telegramIdError, setTelegramIdError] = useState('');
  const [savingTelegramId, setSavingTelegramId] = useState(false);
  
  
  const [profileData, setProfileData] = useState(null);
  const [purchasedBadges, setPurchasedBadges] = useState([]);
  const [loadingPurchasedBadges, setLoadingPurchasedBadges] = useState(false);
  const [isCustomProfileActive, setIsCustomProfileActive] = useState(false); 
  const [deleteChannelDialogOpen, setDeleteChannelDialogOpen] = useState(false);
  
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [konnectModalOpen, setKonnectModalOpen] = useState(false);
  
 
  
  useEffect(() => {
    fetchProfileData();
    fetchUserAchievements();
    fetchUserWarnings();
    fetchUserDecorations();
    fetchSettings();
  }, []);
  
  // Функция для загрузки настроек с бэкенда
  const fetchSettings = async () => {
    try {
      const settingsData = await ProfileService.getSettings();
      if (settingsData && settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
        
        // Обновляем localStorage с данными с бэкенда
        localStorage.setItem('primaryColor', settingsData.settings.primary_color || '#D0BCFF');
        localStorage.setItem('theme', settingsData.settings.theme || 'dark');
        
        // Обновляем контекст темы
        updateThemeSettings({
          primaryColor: settingsData.settings.primary_color || '#D0BCFF',
          theme: settingsData.settings.theme || 'dark'
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      // Используем дефолтные значения при ошибке
      setSettings({
        primary_color: '#D0BCFF',
        theme: 'dark'
      });
    }
  };
  
  // Функция для сохранения настроек через API
  const saveSettings = async (newSettings) => {
    try {
      const response = await ProfileService.updateSettings(newSettings);
      if (response && response.success) {
        setSettings(newSettings);
        showNotification('success', 'Настройки сохранены');
        return true;
      } else {
        showNotification('error', 'Ошибка сохранения настроек');
        return false;
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      showNotification('error', 'Ошибка сохранения настроек');
      return false;
    }
  };
  
  const fetchUserDecorations = async () => {
    setLoadingDecorations(true);
    try {
      const response = await fetch('/api/decorations/current');
      if (!response.ok) throw new Error('Failed to fetch decorations');
      
      const data = await response.json();
      if (data.success) {
        setUserDecorations(data.decorations);
      }
    } catch (error) {
      console.error('Error fetching decorations:', error);
    } finally {
      setLoadingDecorations(false);
    }
  };
  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      
      const profileData = await ProfileService.getProfile(user.username);
      if (profileData && profileData.user) {
        setName(profileData.user.name || '');
        setUsername(profileData.user.username || '');
        setAbout(profileData.user.about || '');
        setAvatarPreview(profileData.user.avatar_url || '');
        setBannerPreview(profileData.user.banner_url || '');
        setSocials(profileData.socials || []);
        
        
        setProfileData(profileData);
        
        
        setIsCustomProfileActive(profileData.user.profile_id === 2);
        
        
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      showNotification('error', 'Не удалось загрузить данные пользователя');
      setLoading(false);
    }
  };
  
  
  const fetchUserAchievements = async () => {
    try {
      setLoadingAchievements(true);
      const response = await axios.get('/api/profile/achievements');
      
      if (response.data && response.data.achievements) {
        setUserAchievements(response.data.achievements);
      }
      
      setLoadingAchievements(false);
    } catch (error) {
      console.error('Ошибка загрузки достижений:', error);
      setLoadingAchievements(false);
    }
  };
  
  
  const fetchPurchasedBadges = async () => {
    try {
      setLoadingPurchasedBadges(true);
      const response = await axios.get('/api/badges/purchases');
      
      if (response.data && response.data.purchases) {
        setPurchasedBadges(response.data.purchases);
      }
      
      setLoadingPurchasedBadges(false);
    } catch (error) {
      console.error('Ошибка загрузки приобретенных бейджей:', error);
      setLoadingPurchasedBadges(false);
    }
  };
  
  
  useEffect(() => {
    if (user) {
      fetchUserAchievements();
      fetchPurchasedBadges();
    }
  }, [user]);
  
  
  const handleSetActiveBadge = async (achievementId) => {
    try {
      setUpdatingActiveBadge(true);
      const response = await axios.post('/api/profile/achievements/active', {
        achievement_id: achievementId
      });
      
      if (response.data && response.data.success) {
        
        fetchUserAchievements();
        fetchPurchasedBadges();
        showNotification('success', 'Активный бейдж обновлен');
      }
      
      setUpdatingActiveBadge(false);
    } catch (error) {
      console.error('Ошибка обновления активного бейджа:', error);
      showNotification('error', 'Не удалось обновить активный бейдж');
      setUpdatingActiveBadge(false);
    }
  };
  
  
  useEffect(() => {
    if (!user) return;
    
    
    const checkPushSupport = () => {
      const isSupported = 
        'serviceWorker' in navigator && 
        'PushManager' in window &&
        'Notification' in window;
      
      setPushNotificationSupported(isSupported);
      
      
      setPushSubscriptionStatus(false);
      
      
      if (isSupported && window.PushNotifications) {
        window.PushNotifications.checkSubscription()
          .then(isSubscribed => {
            console.log('Push subscription status:', isSubscribed);
            setPushSubscriptionStatus(isSubscribed);
          })
          .catch(error => {
            console.error('Ошибка при проверке статуса подписки:', error);
            setPushSubscriptionStatus(false);
          });
      }
    };
    
    
    const loadNotificationPreferences = async () => {
      try {
        setLoadingNotificationPrefs(true);
        const response = await axios.get('/api/notifications/preferences');
        
        if (response.data) {
          const pushEnabled = response.data.push_notifications_enabled;
          const telegramEnabled = response.data.telegram_notifications_enabled;
          const telegramConnected = response.data.telegram_connected;
          
          console.log('Notification preferences loaded:', { 
            pushEnabled, 
            telegramEnabled, 
            telegramConnected 
          });
          
          setNotificationPrefs({
            pushNotificationsEnabled: pushEnabled,
            telegramNotificationsEnabled: telegramEnabled,
            telegramConnected: telegramConnected
          });
        }
        
        setLoadingNotificationPrefs(false);
      } catch (error) {
        console.error('Ошибка загрузки настроек уведомлений:', error);
        setLoadingNotificationPrefs(false);
      }
    };
    
    checkPushSupport();
    loadNotificationPreferences();
  }, [user]);
  
  
  useEffect(() => {
    if (user) {
      
      const checkNotificationSupport = async () => {
        try {
          const isSupported = await NotificationService.isPushNotificationSupported();
          setPushSupported(isSupported);
          
          if (isSupported) {
            const permission = await NotificationService.getNotificationPermissionStatus();
            setPushPermission(permission);
            
            
            const antiCachingActive = window.setupCaching && 
                                      typeof window.setupCaching === 'function';
            
            if (antiCachingActive) {
              console.warn('Anti-caching system may interfere with push notifications');
            }
            
            
            let swRegistered = false;
            if ('serviceWorker' in navigator) {
              try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                const pushSW = registrations.find(reg => 
                  reg.active && reg.active.scriptURL && 
                  reg.active.scriptURL.includes('service-worker.js')
                );
                
                swRegistered = !!pushSW;
                
                if (pushSW) {
                  const subscription = await pushSW.pushManager.getSubscription();
                  setPushSubscribed(!!subscription);
                } else {
                  setPushSubscribed(false);
                  console.warn('Push notification service worker not registered. Notifications may not work.');
                }
              } catch (err) {
                console.error('Error checking service worker registration:', err);
                setPushSubscribed(false);
              }
            } else {
              setPushSubscribed(false);
            }
          }
        } catch (error) {
          console.error('Error checking push support:', error);
        }
      };
      
      checkNotificationSupport();
    }
  }, [user]);
  
  
  const handleEnablePushNotifications = async () => {
    try {
      setPushLoading(true);
      console.log('Starting push notification setup...');
      
      
      const isSupported = await NotificationService.isPushNotificationSupported();
      console.log('Push notifications supported:', isSupported);
      
      if (!isSupported) {
        showNotification('error', 'Push-уведомления не поддерживаются вашим браузером');
        setPushLoading(false);
        return;
      }
      
      
      const permission = await NotificationService.getNotificationPermissionStatus();
      console.log('Current permission status:', permission);
      
      if (permission === 'denied') {
        showNotification('error', 'Разрешение на уведомления заблокировано. Пожалуйста, измените настройки в браузере.');
        setPushLoading(false);
        return;
      }
      
      try {
        
        console.log('Subscribing to push notifications...');
        await NotificationService.subscribeToPushNotifications();
        setPushSubscribed(true);
        
        
        console.log('Updating notification preferences on server...');
        try {
          await axios.post('/api/notifications/preferences', {
            push_notifications_enabled: true
          });
          console.log('Notification preferences updated successfully');
        } catch (prefError) {
          console.error('Error updating notification preferences:', prefError);
          if (prefError.response) {
            console.error('Server response:', prefError.response.data);
          }
        }
        
        
        try {
          console.log('Sending test notification...');
          const testResult = await NotificationService.sendTestNotification();
          console.log('Test notification result:', testResult);
          showNotification('success', 'Push-уведомления успешно включены');
        } catch (testError) {
          console.error('Error sending test notification:', testError);
          if (testError.response) {
            console.error('Server response:', testError.response.data);
          }
          showNotification('info', 'Push-уведомления включены, но тестовое уведомление не отправлено');
        }
        
      } catch (subError) {
        console.error('Error in subscription process:', subError);
        showNotification('error', `Ошибка при подписке на уведомления: ${subError.message}`);
        setPushLoading(false);
        return;
      }
      
      setPushLoading(false);
    } catch (error) {
      console.error('General error enabling push notifications:', error);
      showNotification('error', `Ошибка при включении push-уведомлений: ${error.message}`);
      setPushLoading(false);
    }
  };
  
  
  const handleDisablePushNotifications = async () => {
    try {
      setPushLoading(true);
      
      const success = await NotificationService.unsubscribeFromPushNotifications();
      
      
      try {
        await axios.post('/api/notifications/preferences', {
          push_notifications_enabled: false
        });
      } catch (prefError) {
        console.error('Error updating notification preferences:', prefError);
      }
      
      setPushSubscribed(false);
      showNotification(success ? 'success' : 'info', 'Push-уведомления отключены');
      setPushLoading(false);
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      showNotification('error', 'Произошла ошибка, но push-уведомления отключены');
      setPushSubscribed(false);
      setPushLoading(false);
    }
  };
  
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  
  const getTabContent = (tabIndex) => {
    if (!isChannel) {
      return tabIndex;
    }
    
    
    
    switch(tabIndex) {
      case 0: return 0; 
      case 1: return 1; 
      case 2: return 3; 
      default: return tabIndex;
    }
  };
  
  
  const handleAvatarChange = (file) => {
    if (!file) return;
    
    setAvatarFile(file);
    
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  
  const handleBannerChange = (file) => {
    if (!file) return;
    
    setBannerFile(file);
    
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      console.log('Starting profile save...');
      
      let hasErrors = false;
      let responses = [];
      

      if (name !== user.name) {
        try {
          console.log('Updating name...');
          const formData = new FormData();
          formData.append('name', name);
          
          const response = await axios.post('/api/profile/update-name', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Name update response:', response.data);
          responses.push({ 
            type: 'name', 
            success: response.data.success || false, 
            message: response.data.message || response.data.error || 'Неизвестная ошибка'
          });
          
          if (!response.data.success) hasErrors = true;
        } catch (error) {
          console.error('Error updating name:', error);
          responses.push({ 
            type: 'name', 
            success: false, 
            message: error.response?.data?.error || error.response?.data?.message || 'Ошибка обновления имени'
          });
          hasErrors = true;
        }
      }
      

      if (username !== user.username) {
        try {
          console.log('Updating username...');
          const formData = new FormData();
          formData.append('username', username);
          
          const response = await axios.post('/api/profile/update-username', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Username update response:', response.data);
          responses.push({ 
            type: 'username', 
            success: response.data.success || false, 
            message: response.data.message || response.data.error || 'Неизвестная ошибка'
          });
          
          if (!response.data.success) hasErrors = true;
        } catch (error) {
          console.error('Error updating username:', error);
          responses.push({ 
            type: 'username', 
            success: false, 
            message: error.response?.data?.error || error.response?.data?.message || 'Ошибка обновления username'
          });
          hasErrors = true;
        }
      }
      

      if (about !== (user.about || '')) {
        try {
          console.log('Updating about...');
          const formData = new FormData();
          formData.append('about', about);
          
          const response = await axios.post('/api/profile/update-about', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('About update response:', response.data);
          responses.push({ 
            type: 'about', 
            success: response.data.success || false, 
            message: response.data.message || response.data.error || 'Неизвестная ошибка'
          });
          
          if (!response.data.success) hasErrors = true;
        } catch (error) {
          console.error('Error updating about:', error);
          responses.push({ 
            type: 'about', 
            success: false, 
            message: error.response?.data?.error || error.response?.data?.message || 'Ошибка обновления описания'
          });
          hasErrors = true;
        }
      }
      

      if (avatarFile) {
        try {
          console.log('Uploading avatar...');
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          
          const response = await axios.post('/api/profile/upload-avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Avatar upload response:', response.data);
          responses.push({ 
            type: 'avatar', 
            success: response.data.success || false, 
            message: response.data.message || response.data.error || 'Неизвестная ошибка'
          });
          
          if (!response.data.success) hasErrors = true;
        } catch (error) {
          console.error('Error uploading avatar:', error);
          responses.push({ 
            type: 'avatar', 
            success: false, 
            message: error.response?.data?.error || error.response?.data?.message || 'Ошибка загрузки аватара'
          });
          hasErrors = true;
        }
      }
      

      if (bannerFile) {
        try {
          console.log('Uploading banner...');
          const formData = new FormData();
          formData.append('banner', bannerFile);
          
          const response = await axios.post('/api/profile/upload-banner', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Banner upload response:', response.data);
          responses.push({ 
            type: 'banner', 
            success: response.data.success || false, 
            message: response.data.message || response.data.error || 'Неизвестная ошибка'
          });
          
          if (!response.data.success) hasErrors = true;
        } catch (error) {
          console.error('Error uploading banner:', error);
          responses.push({ 
            type: 'banner', 
            success: false, 
            message: error.response?.data?.error || error.response?.data?.message || 'Ошибка загрузки баннера'
          });
          hasErrors = true;
        }
      }
      

      if (updateUserData) {
        updateUserData({
          ...user,
          name,
          username,
          about
        });
      }
      

      if (hasErrors) {
        let errorMessage = '';
        const failedResponses = responses.filter(r => !r.success);
        
        if (failedResponses.length === 1) {
          errorMessage = failedResponses[0].message;
        } else {
          errorMessage = 'Не удалось сохранить следующие данные:\n';
          failedResponses.forEach(resp => {
            errorMessage += `• ${resp.type}: ${resp.message}\n`;
          });
        }
        
        console.error('Save errors:', failedResponses);
        showNotification('error', errorMessage);
      } else {
        console.log('All operations successful');
        showNotification('success', 'Профиль успешно сохранен');
        

        navigate(`/profile/${username}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('error', 'Произошла ошибка при сохранении профиля: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setSaving(false);
    }
  };
  
  
  const handleSaveSettings = async () => {
    setSaving(true);
    setSuccess(false);
    
    try {

      const settingsToSave = {
        background_color: settings.background_color,
        container_color: settings.container_color,
        welcome_bubble_color: settings.welcome_bubble_color,
        avatar_border_color: settings.avatar_border_color,
        info_bubble_color: settings.info_bubble_color,
        info_bubble_border_color: settings.info_bubble_border_color,
        
        header_color: settings.header_color || settings.container_color,
        bottom_nav_color: settings.bottom_nav_color || settings.container_color,
        content_color: settings.content_color || settings.container_color,
      };
      

      const response = await axios.post('/api/profile/settings', settingsToSave, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        setSuccess(true);
        showNotification('success', 'Настройки успешно сохранены');
        
        // оставлена тема цвет
        themeSettings.updateThemeSettings({
          primaryColor: response.data.settings.avatar_border_color
        });
      } else {
        throw new Error(response.data?.error || 'Не удалось сохранить настройки');
      }
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      
      showNotification('error', error.message || 'Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
      

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };
  
  
  const handleAddSocial = async () => {
    try {
      setSaving(true);
      
      
      if (!newSocialName || !newSocialLink) {
        showNotification('error', 'Пожалуйста, заполните все поля');
        setSaving(false);
        return;
      }
      
      
      let url = newSocialLink;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      
      if (socials.some(social => social.name.toLowerCase() === newSocialName.toLowerCase())) {
        showNotification('error', `Социальная сеть ${newSocialName} уже добавлена`);
        setSaving(false);
        return;
      }
      
      const response = await ProfileService.addSocial(newSocialName, url);
      
      if (response.success) {
        
        setSocials([...socials, { name: newSocialName, link: url }]);
        showNotification('success', 'Социальная сеть добавлена');
        
        
        setSocialDialogOpen(false);
        setNewSocialName('');
        setNewSocialLink('');
      } else {
        
        showNotification('error', response.error || 'Ошибка добавления социальной сети');
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Ошибка добавления социальной сети:', error);
      showNotification('error', error.response?.data?.error || error.message || 'Не удалось добавить социальную сеть');
      setSaving(false);
    }
  };
  
  
  const handleDeleteSocial = async (name) => {
    try {
      setSaving(true);
      
      const response = await ProfileService.deleteSocial(name);
      
      if (response.success) {
        setSocials(socials.filter(social => social.name !== name));
        showNotification('success', 'Социальная сеть удалена');
      } else {
        throw new Error(response.error || 'Failed to delete social network');
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Ошибка удаления социальной сети:', error);
      showNotification('error', 'Ошибка удаления социальной сети');
      setSaving(false);
    }
  };
  
  
  const showNotification = (severity, message) => {
    if (!message) {
      message = severity === 'error' 
        ? 'Произошла ошибка при выполнении операции' 
        : 'Операция выполнена';
    }
    
    
    if (typeof message === 'object' && message !== null) {
      if (message.message) {
        message = message.message;
      } else {
        try {
          message = JSON.stringify(message);
        } catch (e) {
          message = 'Неизвестная ошибка';
        }
      }
    }
    
    
    setSnackbar({
      open: true,
      message,
      severity
    });
    
    
    enqueueSnackbar(message, { 
      variant: severity,
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
    });
  };
  
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  
  const applyTheme = async (theme) => {
    try {
      setSaving(true);
      
      const saveThemeSetting = (key, value) => {
        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);
        
        try {
          const expires = new Date();
          expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
          document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        } catch (e) {
          console.error('Error setting cookie:', e);
        }
        
        if (key === 'theme') {
          document.documentElement.setAttribute('data-theme', value);
        } else {
          // Применяем CSS переменные сразу
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          document.documentElement.style.setProperty(`--${cssKey}`, value);
        }
      };
      
      let themeMode = 'dark';
      let backgroundColor = '#131313';
      let textColor = '#FFFFFF';
      
      if (theme === 'default') {
        // Дефолтная тема - темный фон, белый текст
        saveThemeSetting('theme', 'default');
        saveThemeSetting('backgroundColor', '#131313');
        saveThemeSetting('textColor', '#FFFFFF');
        themeMode = 'dark';
        backgroundColor = '#131313';
        textColor = '#FFFFFF';
        
      } else if (theme === 'light') {
        // Белая тема - белый фон, черный текст
        saveThemeSetting('theme', 'light');
        saveThemeSetting('backgroundColor', '#ffffff');
        saveThemeSetting('textColor', '#000000');
        themeMode = 'light';
        backgroundColor = '#ffffff';
        textColor = '#000000';
        
      } else if (theme === 'contrast') {
        // Контрастная тема - черный фон, белый текст
        saveThemeSetting('theme', 'contrast');
        saveThemeSetting('backgroundColor', '#000000');
        saveThemeSetting('textColor', '#FFFFFF');
        themeMode = 'contrast';
        backgroundColor = '#000000';
        textColor = '#FFFFFF';
      }
      
      // Обновляем настройки темы для немедленного применения
      updateThemeSettings({ 
        mode: themeMode,
        backgroundColor: backgroundColor,
        textColor: textColor
      });
      
      // Сохраняем тему в БД через API
      try {
        const response = await fetch('/api/profile/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            theme: themeMode
          })
        });
        
        const data = await response.json();
        if (data && data.success) {
          console.log('Тема успешно сохранена в БД:', themeMode);
        } else {
          console.error('Ошибка сохранения темы в БД:', data?.error);
        }
      } catch (apiError) {
        console.error('Ошибка API при сохранении темы:', apiError);
      }
      
      showNotification('success', `Тема "${theme}" применена`);
      window.dispatchEvent(new Event('storage'));
      
      setSaving(false);
    } catch (error) {
      console.error('Ошибка применения темы:', error);
      showNotification('error', 'Ошибка применения темы');
      setSaving(false);
    }
  };
  
    
  
  
  const handleToggleTelegramNotifications = async () => {
    try {
      setSavingNotificationPrefs(true);
      
      
      if (!notificationPrefs.telegramConnected) {
        console.error('Telegram не подключен, невозможно включить Telegram-уведомления');
        showNotification('warning', 'Для получения уведомлений сначала подключите Telegram в профиле');
        setSavingNotificationPrefs(false);
        return;
      }
      
      const newTelegramEnabled = !notificationPrefs.telegramNotificationsEnabled;
      console.log('Переключение Telegram уведомлений на:', newTelegramEnabled);
      
      try {
        
        const response = await axios.post('/api/notifications/preferences', {
          push_notifications_enabled: notificationPrefs.pushNotificationsEnabled,
          telegram_notifications_enabled: newTelegramEnabled
        });
        
        console.log('Ответ сервера при изменении настроек Telegram-уведомлений:', response.data);
        
        if (response.data && response.data.success) {
          setNotificationPrefs({
            ...notificationPrefs,
            telegramNotificationsEnabled: newTelegramEnabled
          });
          
          showNotification('success', newTelegramEnabled ? 
            'Telegram-уведомления включены' : 
            'Telegram-уведомления отключены');
        } else {
          throw new Error(response.data?.error || response.data?.message || 'Ошибка сохранения настроек');
        }
      } catch (apiError) {
        console.error('Ошибка API при переключении Telegram-уведомлений:', apiError);
        showNotification('error', apiError.message || 'Не удалось изменить настройки Telegram-уведомлений');
      }
      
      setSavingNotificationPrefs(false);
    } catch (error) {
      console.error('Ошибка при переключении Telegram-уведомлений:', error);
      showNotification('error', error.message || 'Не удалось изменить настройки Telegram-уведомлений');
      setSavingNotificationPrefs(false);
    }
  };
  
  
  const handleSaveTelegramId = async () => {
    try {
      
      setTelegramIdError('');
      setSavingTelegramId(true);
      
      
      if (!telegramIdInput.trim()) {
        setTelegramIdError('Telegram ID не может быть пустым');
        setSavingTelegramId(false);
        return;
      }
      
      
      if (!/^\d+$/.test(telegramIdInput.trim())) {
        setTelegramIdError('Telegram ID должен быть числом');
        setSavingTelegramId(false);
        return;
      }
      
      
      const response = await axios.post('/api/profile/telegram-connect', {
        telegram_id: telegramIdInput.trim()
      });
      
      if (response.data && response.data.success) {
        
        setNotificationPrefs({
          ...notificationPrefs,
          telegramConnected: true
        });
        
        
        showNotification('success', 'Telegram аккаунт успешно привязан');
        
        
        setTelegramDialogOpen(false);
        setTelegramIdInput('');
      } else {
        throw new Error(response.data?.error || 'Не удалось привязать Telegram ID');
      }
      
      setSavingTelegramId(false);
    } catch (error) {
      console.error('Ошибка при привязке Telegram ID:', error);
      setTelegramIdError(error.response?.data?.error || error.message || 'Произошла ошибка при привязке Telegram ID');
      setSavingTelegramId(false);
    }
  };

  
  const handleClearActiveBadge = async () => {
    try {
      setUpdatingActiveBadge(true);
      const response = await axios.post('/api/profile/achievements/deactivate');
      
      if (response.data && response.data.success) {
        
        fetchUserAchievements();
        fetchPurchasedBadges();
        showNotification('success', 'Активный бейдж удален');
      }
      
      setUpdatingActiveBadge(false);
    } catch (error) {
      console.error('Ошибка удаления активного бейджа:', error);
      showNotification('error', 'Не удалось удалить активный бейдж');
      setUpdatingActiveBadge(false);
    }
  };
  
  
  const handleStatusUpdate = (statusData) => {
    
    setProfileData(prevData => ({
      ...prevData,
      status_text: statusData.status_text,
      status_color: statusData.status_color
    }));
  };
  
  
  const fetchUserWarnings = async () => {
    try {
      setLoadingWarnings(true);
      const response = await axios.get('/api/user/warnings');
      
      if (response.data.success) {
        setUserWarnings(response.data.warnings || []);
        setAccountStatus(response.data.account_status || 'good');
        setBanInfo(response.data.ban_info);
      } else {
        console.error('Error fetching user warnings:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user warnings:', error);
    } finally {
      setLoadingWarnings(false);
    }
  };
  
  
  const formatWarningDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const openWarningsDialog = () => {
    fetchUserWarnings();
    setWarningsDialogOpen(true);
  };
  
  
  const StatusSettings = ({ profileData, subscription, onStatusUpdate }) => {
    const theme = useTheme();
    const [statusText, setStatusText] = useState('');
    const [statusColor, setStatusColor] = useState('#D0BCFF');
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [isUltimate, setIsUltimate] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [customColorOpen, setCustomColorOpen] = useState(false);
    const maxLength = 50;
    const { user } = useContext(AuthContext);
    const isChannel = user?.account_type === 'channel';
  
    
    const presetColors = [
      '#D0BCFF', 
      '#90CAF9', 
      '#A5D6A7', 
      '#FFCC80', 
      '#EF9A9A', 
      '#CE93D8', 
      '#FFF59D', 
      '#B0BEC5', 
      '#F48FB1', 
      '#81D4FA'  
    ];
    
    
    const availableIcons = [
      { name: 'cloud', component: <CloudIcon sx={{ fontSize: 24 }} /> },
      { name: 'minion', component: (
        <SvgIcon sx={{ fontSize: 24 }}>
          <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M402.667 518C367.33 518 332.786 507.523 303.405 487.89C274.023 468.257 251.123 440.353 237.6 407.707C224.077 375.06 220.539 339.137 227.433 304.478C234.327 269.82 251.343 237.984 276.33 212.997C301.317 188.01 333.153 170.994 367.81 164.1C402.47 157.206 438.393 160.744 471.04 174.267C503.687 187.79 531.59 210.69 551.223 240.072C570.853 269.453 581.333 303.997 581.333 339.333C581.333 362.797 576.713 386.03 567.733 407.707C558.753 429.383 545.593 449.08 529.003 465.67C512.413 482.26 492.717 495.42 471.04 504.4C449.363 513.38 426.13 518 402.667 518ZM402.667 210.667C377.22 210.667 352.343 218.213 331.183 232.351C310.024 246.489 293.533 266.584 283.794 290.095C274.056 313.606 271.508 339.477 276.472 364.437C281.437 389.393 293.691 412.32 311.686 430.313C329.68 448.31 352.607 460.563 377.567 465.527C402.523 470.493 428.393 467.943 451.907 458.207C475.417 448.467 495.51 431.977 509.65 410.817C523.787 389.657 531.333 364.78 531.333 339.333C531.333 305.209 517.777 272.482 493.647 248.353C469.517 224.223 436.79 210.667 402.667 210.667Z" fill="currentColor"/>
          <path d="M400 643.667C376.53 643.72 353.28 639.123 331.597 630.14C309.913 621.157 290.224 607.97 273.667 591.333C269.251 586.593 266.847 580.327 266.961 573.85C267.075 567.373 269.699 561.193 274.28 556.613C278.86 552.033 285.04 549.407 291.516 549.293C297.993 549.18 304.261 551.583 309 556C333.693 579.057 366.216 591.88 400 591.88C433.783 591.88 466.31 579.057 491 556C495.74 551.583 502.006 549.18 508.483 549.293C514.96 549.407 521.14 552.033 525.72 556.613C530.303 561.193 532.926 567.373 533.04 573.85C533.153 580.327 530.75 586.593 526.333 591.333C509.776 607.97 490.086 621.157 468.403 630.14C446.72 639.123 423.47 643.72 400 643.667Z" fill="currentColor"/>
          <path d="M402.667 400C436.173 400 463.333 372.837 463.333 339.333C463.333 305.828 436.173 278.666 402.667 278.666C369.163 278.666 342 305.828 342 339.333C342 372.837 369.163 400 402.667 400Z" fill="currentColor"/>
          <path d="M666.666 755.333C660.036 755.333 653.676 752.7 648.99 748.01C644.3 743.323 641.666 736.963 641.666 730.333V333.333C637.156 272.944 609.983 216.492 565.596 175.297C521.21 134.102 462.89 111.209 402.333 111.209C341.776 111.209 283.457 134.102 239.07 175.297C194.684 216.492 167.511 272.944 163 333.333V730.333C163 736.963 160.366 743.323 155.678 748.01C150.989 752.7 144.631 755.333 138 755.333C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333V333.333C115.55 258.166 147.202 186.929 201.278 134.656C255.354 82.3832 327.623 53.1636 402.833 53.1636C478.043 53.1636 550.313 82.3832 604.39 134.656C658.466 186.929 690.116 258.166 692.666 333.333V730.333C692.623 733.69 691.913 737.003 690.58 740.08C689.246 743.16 687.313 745.943 684.893 748.27C682.476 750.597 679.62 752.417 676.49 753.63C673.36 754.843 670.023 755.423 666.666 755.333Z" fill="currentColor"/>
          <path d="M666.666 755.333H138C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333C113 723.703 115.634 717.343 120.322 712.657C125.011 707.967 131.37 705.333 138 705.333H666.666C673.296 705.333 679.656 707.967 684.343 712.657C689.033 717.343 691.666 723.703 691.666 730.333C691.666 736.963 689.033 743.323 684.343 748.01C679.656 752.7 673.296 755.333 666.666 755.333Z" fill="currentColor"/>
          </svg>
        </SvgIcon>
      ) },
      { name: 'heart', component: (
        <SvgIcon sx={{ fontSize: 24 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z"/>
          </svg>
        </SvgIcon>
      ) },
      { name: 'star', component: (
        <SvgIcon sx={{ fontSize: 24 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"/>
          </svg>
        </SvgIcon>
      ) },
      { name: 'music', component: <MusicNoteIcon sx={{ fontSize: 24 }} /> },
      { name: 'location', component: <LocationOnIcon sx={{ fontSize: 24 }} /> },
      { name: 'cake', component: <CakeIcon sx={{ fontSize: 24 }} /> },
      { name: 'chat', component: <ChatIcon sx={{ fontSize: 24 }} /> },
      { name: 'info', component: <InfoIcon sx={{ fontSize: 24 }} /> },
    ];
  
    
    useEffect(() => {
      if (profileData) {
        if (isChannel && profileData.user && profileData.user.main_account_id) {
          const hasValidSubscription = 
            (subscription && 
              (subscription.type === 'premium' || 
              subscription.type === 'ultimate' || 
              subscription.type === 'pick-me') && 
              subscription.active) ||
            (profileData.main_account_subscription && 
              (profileData.main_account_subscription.type === 'premium' || 
              profileData.main_account_subscription.type === 'ultimate' || 
              profileData.main_account_subscription.type === 'pick-me') && 
              profileData.main_account_subscription.active);
          
          setIsPremium(hasValidSubscription);
          
          const hasUltimateSubscription = 
            (subscription && 
              subscription.type === 'ultimate' && 
              subscription.active) ||
            (profileData.main_account_subscription && 
              profileData.main_account_subscription.type === 'ultimate' && 
              profileData.main_account_subscription.active);
          
          setIsUltimate(hasUltimateSubscription);
        } else {
          setIsPremium(subscription && 
            (subscription.type === 'premium' || 
             subscription.type === 'ultimate' || 
             subscription.type === 'pick-me') && 
            subscription.active);
          
          setIsUltimate(subscription && 
            subscription.type === 'ultimate' && 
            subscription.active);
        }
        
        
        const statusTextToUse = profileData.user?.status_text || profileData.status_text;
        if (statusTextToUse) {
          const parsedStatus = parseStatusText(statusTextToUse);
          setStatusText(parsedStatus.text);
          setSelectedIcon(parsedStatus.iconName);
          console.log("Loaded status text:", parsedStatus.text, "icon:", parsedStatus.iconName);
        }
        
        
        const statusColorToUse = profileData.user?.status_color || profileData.status_color;
        if (statusColorToUse) {
          setStatusColor(statusColorToUse);
          console.log("Loaded status color:", statusColorToUse);
        }
        
        setInitialLoaded(true);
      }
    }, [profileData, subscription, isChannel]);
    
    
    const parseStatusText = (text) => {
      
      const iconTagRegex = /\{(\w+)\}/;
      const match = text.match(iconTagRegex);
      
      
      const result = {
        text: text,
        iconName: null
      };
      
      if (match) {
        
        result.iconName = match[1].toLowerCase();
        
        result.text = text.replace(iconTagRegex, '').trim();
      }
      
      return result;
    };

    const handleStatusTextChange = (e) => {
      const value = e.target.value;
      
      if (value.length <= maxLength) {
        setStatusText(value);
        setHasError(false);
        setErrorMessage('');
      }
    };

    const handlePresetColorClick = (color) => {
      if (!color || color.trim() === '') {
        setStatusColor('#D0BCFF');
        return;
      }
      setStatusColor(color);
    };
    
    const handleIconSelect = (iconName) => {
      setSelectedIcon(iconName === selectedIcon ? null : iconName);
    };
    
    
    const getFullStatusText = () => {
      return selectedIcon ? `{${selectedIcon}} ${statusText}` : statusText;
    };

    const getContrastTextColor = (hexColor) => {
      
      const r = parseInt(hexColor.substr(1, 2), 16);
      const g = parseInt(hexColor.substr(3, 2), 16);
      const b = parseInt(hexColor.substr(5, 2), 16);
      
      
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      
      return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    const saveStatus = async () => {
      if (!isPremium) {
        setHasError(true);
        if (isChannel) {
          setErrorMessage('Для установки статуса необходимо, чтобы основной аккаунт имел подписку Premium, Ultimate или Pick-me!');
        } else {
          setErrorMessage('Для установки статуса необходима подписка Premium, Ultimate или Pick-me!');
        }
        return;
      }
  
      setIsSaving(true);
      
      try {
        const response = await fetch('/api/profile/v2update-profilestatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status_text: getFullStatusText(),
            status_color: statusColor,
            is_channel: isChannel
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setHasError(false);
          setErrorMessage('');
          
          
          showNotification('success', 'Статус успешно обновлен');
          
          
          if (onStatusUpdate) {
            onStatusUpdate({
              status_text: getFullStatusText(),
              status_color: statusColor
            });
          }
        } else {
          setHasError(true);
          setErrorMessage(data.error || 'Ошибка при обновлении статуса');
          showNotification('error', 'Ошибка при обновлении статуса');
        }
      } catch (error) {
        console.error('Ошибка при обновлении статуса:', error);
        setHasError(true);
        setErrorMessage('Ошибка соединения. Попробуйте позже.');
        showNotification('error', 'Ошибка соединения. Попробуйте позже.');
      } finally {
        setIsSaving(false);
      }
    };
  
    
    const StatusPreview = () => {
      
      const createGradientColor = (hexColor) => {
        
        let r = parseInt(hexColor.substr(1, 2), 16);
        let g = parseInt(hexColor.substr(3, 2), 16);
        let b = parseInt(hexColor.substr(5, 2), 16);
        
        
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        
        if (brightness < 128) {
          
          r = Math.min(255, r + 30);
          g = Math.min(255, g + 30);
          b = Math.min(255, b + 30);
        } else {
          
          r = Math.max(0, r - 30);
          g = Math.max(0, g - 30);
          b = Math.max(0, b - 30);
        }
        
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };

      
      const gradientColor = createGradientColor(statusColor || '#D0BCFF');
      const textColor = getContrastTextColor(statusColor || '#D0BCFF');
      
      
      const getIconByName = (iconName) => {
        const icon = availableIcons.find(icon => icon.name === iconName);
        return icon ? icon.component : availableIcons[0].component; 
      };

      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2,
          padding: 2,
          marginBottom: 2,
          position: 'relative'
        }}>
          <Avatar sx={{ width: 50, height: 50, marginRight: 3 }}>
            <PersonIcon />
          </Avatar>
          
          {statusText || selectedIcon ? (
            <Box sx={{ 
              position: 'relative',
              ml: 1,
            }}>
              <Box sx={{
                position: 'relative',
                filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.2))`,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: '40%',
                  left: -14,
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '0 14px 14px 0',
                  borderColor: `transparent ${statusColor || '#D0BCFF'} transparent transparent`,
                  transform: 'rotate(40deg)',
                  filter: 'drop-shadow(-3px 2px 2px rgba(0,0,0,0.1))',
                  zIndex: 0
                }
              }}>
                <Box sx={{
                  background: `linear-gradient(135deg, ${statusColor || '#D0BCFF'} 0%, ${gradientColor} 100%)`,
                  color: textColor,
                  padding: '8px 12px',
                  borderRadius: '18px',
                  fontSize: '14px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  boxShadow: `inset 0 0 10px rgba(255,255,255,0.15), 
                             0 1px 1px rgba(0,0,0,0.1),
                             0 4px 10px rgba(0,0,0,0.15)`,
                  backdropFilter: 'blur(4px)',
                  border: `1px solid ${statusColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '200px'
                }}>
                  {selectedIcon ? getIconByName(selectedIcon) : <ChatIcon sx={{ fontSize: 16, opacity: 0.7 }} />}
                  {statusText}
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Здесь будет отображаться ваш статус
            </Typography>
          )}
        </Box>
      );
    };
  
    return (
      <Box sx={{ mt: 4 }}>
        <SectionTitle variant="h6">
          <ChatIcon /> 
          Статус профиля
          {!isPremium && (
            <Chip
              label="Premium"
              size="small"
              color="secondary"
              sx={{ ml: 1 }}
            />
          )}
        </SectionTitle>
        
        {!initialLoaded ? (
          <CircularProgress />
        ) : (
          <>
            {!isPremium ? (
              <Alert 
                severity="info" 
                variant="filled"
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                <AlertTitle>Функция доступна только для Premium-подписки</AlertTitle>
                Статус профиля доступен только пользователям с подписками <strong>Premium</strong>, <strong>Ultimate</strong> или <strong>Pick-me</strong>. Оформите подписку, чтобы установить свой уникальный статус и выделиться среди других пользователей.
              </Alert>
            ) : (
              <>
                <StatusPreview />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Выберите иконку для статуса
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {availableIcons.map((icon) => (
                      <IconButton
                        key={icon.name}
                        onClick={() => handleIconSelect(icon.name)}
                        sx={{
                          borderRadius: 2,
                          padding: 1,
                          bgcolor: selectedIcon === icon.name ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
                          color: selectedIcon === icon.name ? theme.palette.primary.main : 'inherit',
                          border: selectedIcon === icon.name ? `1px solid ${theme.palette.primary.main}` : '1px solid rgba(255,255,255,0.1)',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        {icon.component}
                      </IconButton>
                    ))}
                  </Box>
                </Box>
                
                <TextField
                  label="Текст статуса"
                  value={statusText}
                  onChange={handleStatusTextChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  helperText={`${statusText.length}/${maxLength} символов`}
                  error={hasError}
                  FormHelperTextProps={{
                    sx: {
                      display: 'flex',
                      justifyContent: 'space-between',
                    },
                  }}
                  InputProps={{
                    startAdornment: selectedIcon && (
                      <InputAdornment position="start">
                        {availableIcons.find(icon => icon.name === selectedIcon)?.component}
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                {hasError && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Typography>
                )}
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Цвет статуса
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mb: 2,
                    mt: 1,
                    alignItems: 'center' 
                  }}
                >
                  {presetColors.map(color => (
                    <Box
                      key={color}
                      onClick={() => handlePresetColorClick(color)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: color,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform: statusColor === color ? 'scale(1.2)' : 'scale(1)',
                        border: statusColor === color ? `2px solid white` : '2px solid transparent',
                        boxShadow: statusColor === color ? 
                          `0 0 0 2px ${theme.palette.primary.main}, 0 0 10px rgba(0,0,0,0.2)` : 
                          'none',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                        },
                      }}
                    />
                  ))}
                  
                  {isUltimate && (
                    <Button 
                      variant="outlined" 
                      onClick={() => setCustomColorOpen(true)}
                      startIcon={<ColorizeIcon />}
                      sx={{ 
                        ml: 1,
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                      }}
                    >
                      Выбрать цвет с палитры
                    </Button>
                  )}
                </Box>
                
                {isUltimate && (
                  <Dialog 
                    open={customColorOpen} 
                    onClose={() => setCustomColorOpen(false)}
                    maxWidth="sm"
                    PaperProps={{
                      sx: { 
                        bgcolor: theme.palette.background.paper, 
                        color: theme.palette.text.primary,
                        borderRadius: 2,
                        boxShadow: theme.shadows[24],
                        '@media (max-width: 600px)': {
                          width: '100%',
                          maxWidth: '100%',
                          margin: 0,
                          borderRadius: 0,
                        }
                      }
                    }}
                  >
                    <DialogTitle sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      pb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaletteIcon fontSize="small" color="primary" />
                        <Typography variant="h6">Выберите любой цвет</Typography>
                        <Chip 
                          label="Ultimate" 
                          size="small" 
                          color="secondary" 
                        />
                      </Box>
                      <IconButton size="small" onClick={() => setCustomColorOpen(false)} color="inherit">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </DialogTitle>
                    
                    <DialogContent sx={{ pt: 3 }}>
                      <Box sx={{ 
                        height: 100, 
                        width: '100%', 
                        backgroundColor: statusColor, 
                        borderRadius: 2, 
                        mb: 3,
                        boxShadow: `0 4px 20px ${alpha(statusColor, 0.5)}`,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                      }} />
                      
                      <input 
                        type="color" 
                        value={statusColor}
                        onChange={(e) => handlePresetColorClick(e.target.value)}
                        style={{ 
                          width: '100%', 
                          height: 60,
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: 'none'
                        }}
                      />
                      
                      <TextField
                        label="HEX код"
                        value={statusColor}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^#([0-9A-F]{3}){1,2}$/i.test(value)) {
                            handlePresetColorClick(value || '#D0BCFF');
                          }
                        }}
                        fullWidth
                        margin="normal"
                        placeholder="#RRGGBB"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ height: 16, width: 16, backgroundColor: statusColor, borderRadius: 1 }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                        Предустановленные цвета
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {[
                          '#000000', '#FFFFFF', '#F44336', '#E91E63', '#9C27B0', '#673AB7',
                          '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
                          '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
                        ].map((presetColor) => (
                          <Box
                            key={presetColor}
                            onClick={() => handlePresetColorClick(presetColor)}
                            sx={{
                              height: 32,
                              width: 32,
                              backgroundColor: presetColor,
                              borderRadius: 1,
                              cursor: 'pointer',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transform: statusColor === presetColor ? 'scale(1.1)' : 'scale(1)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </DialogContent>
                    
                    <DialogActions sx={{ p: 2, pt: 1 }}>
                      <Button onClick={() => setCustomColorOpen(false)} color="primary" variant="contained">
                        Выбрать
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
                
                <Box 
                  sx={{ 
                    mt: 1,
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    border: '1px solid',
                    borderColor: isUltimate ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2),
                  }}
                >
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: theme.palette.primary.light }}>
                    <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                    {isUltimate ? 
                      'С подпиской Ultimate вы можете выбрать любой цвет для вашего профиля!' : 
                      'Оформите подписку Ultimate, чтобы выбрать любой цвет для вашего профиля!'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveStatus}
                  disabled={isSaving}
                  startIcon={isSaving ? <CircularProgress size={20} /> : <CheckIcon />}
                  fullWidth
                  sx={{ mt: 1, width: 'auto'}}
                >
                  {isSaving ? 'Сохранение...' : 'Сохранить статус'}
                </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    );
  };
     
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  const handleDeleteChannelSuccess = (data) => {
    showNotification('success', 'Канал успешно удален');
    // После удаления канала перенаправляем на главную страницу
    window.location.href = '/';
  };
  
  const handleDeleteAvatar = async () => {
    try {
      const response = await axios.post('/api/profile/delete-avatar');
      if (response.data.success) {
        setAvatarPreview('');
        setAvatarFile(null);
        showNotification('success', 'Аватар успешно удален');
        if (updateUserData) {
          updateUserData({
            ...user,
            photo: null
          });
        }
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      showNotification('error', error.response?.data?.error || 'Ошибка при удалении аватара');
    }
  };
  
  const handleDeleteBanner = async () => {
    try {
      const response = await axios.post('/api/profile/delete-banner');
      if (response.data.success) {
        setBannerPreview('');
        setBannerFile(null);
        showNotification('success', 'Баннер успешно удален');
        if (updateUserData) {
          updateUserData({
            ...user,
            banner: null
          });
        }
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      showNotification('error', error.response?.data?.error || 'Ошибка при удалении баннера');
    }
  };
  



  const handleToggleDecoration = async (decorationId, isActive) => {
    try {
      const response = await fetch('/api/decorations/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          decoration_id: decorationId,
          is_active: isActive
        })
      });

      if (!response.ok) throw new Error('Failed to toggle decoration');
      
      // Обновляем список декораций
      fetchUserDecorations();
    } catch (error) {
      console.error('Error toggling decoration:', error);
    }
  };

  const renderDecorationSettings = () => {
    if (loadingDecorations) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (userDecorations.length === 0) {
      return (
        <Typography color="textSecondary">
          У вас пока нет декораций
        </Typography>
      );
    }

    return userDecorations.map(item => {
      const decoration = item.decoration;
      return (
        <Paper
          key={decoration.id}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: 'background.paper',
            borderRadius: 2
          }}
        >
          <DecorationPreview decoration={decoration}>
            {decoration.item_path && (() => {
              const [path, ...styles] = decoration.item_path.split(';');
              const styleObj = styles.reduce((acc, style) => {
                const [key, value] = style.split(':').map(s => s.trim());
                return { ...acc, [key]: value };
              }, {});
              
              return (
                <DecorationItem
                  src={path}
                  alt=""
                  customStyles={styleObj}
                />
              );
            })()}
          </DecorationPreview>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 1 
          }}>
            <Typography variant="subtitle1">
              {decoration.name}
            </Typography>
            <IOSSwitch
              checked={item.is_active}
              onChange={(e) => handleToggleDecoration(decoration.id, e.target.checked)}
            />
          </Box>
        </Paper>
      );
    });
  };
  
  const handleGlobalProfileBackgroundToggle = async (event) => {
    const enabled = event.target.checked;
    // Сохраняем настройку на сервере
    await axios.post('/api/user/settings/global-profile-bg', { enabled });
    setGlobalProfileBackgroundEnabled(enabled);
    if (enabled && profileData?.user?.profile_background_url) {
      setProfileBackground(profileData.user.profile_background_url);
      localStorage.setItem('myProfileBackgroundUrl', profileData.user.profile_background_url);
      document.cookie = `myProfileBackgroundUrl=${encodeURIComponent(profileData.user.profile_background_url)}; path=/; max-age=${60*60*24*365}`;
    } else {
      clearProfileBackground();
      localStorage.removeItem('myProfileBackgroundUrl');
      document.cookie = 'myProfileBackgroundUrl=; path=/; max-age=0';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SettingsContainer maxWidth="lg">
        <SettingsHeader>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>Настройки профиля</Typography>
        </SettingsHeader>
        
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          centered={!isMobile}
          sx={{
            display: { xs: 'none', md: 'flex' },
            '& .MuiTabs-scroller': {
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              scrollbarWidth: 'none'
            }
          }}
        >
          <StyledTab icon={<AccountCircleIcon />} label="Профиль" />
          <StyledTab icon={<BrushIcon />} label="Оформление" />
          {!isChannel && <StyledTab icon={<NotificationsIcon />} label="Уведомления" />}
          <StyledTab icon={<EmojiEventsIcon />} label="Бейджи" />
          {!isChannel && <StyledTab icon={<AlternateEmailIcon />} label="Юзернеймы" />}
          {!isChannel && <StyledTab icon={<LockIcon />} label="Вход по паролю" />}
        </StyledTabs>
        
        
        {getTabContent(activeTab) === 0 && (
          <Box component={motion.div} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            
            <SettingsCard>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <PersonIcon />
                  Основная информация
                </SectionTitle>
                
                <Box sx={{ 
                  position: 'relative', 
                  mb: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(18, 18, 18, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex', 
                  flexDirection: 'column',
                }}>
                  {/* New Compact Profile Layout */}
                  <Grid container sx={{ p: 2 }}>
                    {/* Left column - Avatar */}
                    <Grid item xs={12} sm={4} md={3} sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                  alignItems: 'center', 
                      justifyContent: 'center',
                      p: 2
                    }}>
                      <Box sx={{ 
                        position: 'relative',
                        width: { xs: 120, sm: 140 },
                        height: { xs: 120, sm: 140 },
                        borderRadius: '50%',
                        border: `4px solid ${settings.avatar_border_color || theme.palette.primary.main}`,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                        backgroundColor: 'rgba(18, 18, 18, 0.7)',
                      mb: 2, 
                        '&:hover .avatar-overlay': {
                          opacity: 1
                        }
                      }}>
                        <Avatar
                          src={avatarPreview || (user?.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : undefined)}
                          sx={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                        <Box 
                          className="avatar-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            transition: 'all 0.2s',
                            opacity: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            borderRadius: '50%',
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        >
                          <label htmlFor="avatar-input">
                            <IconButton component="span" sx={{ bgcolor: 'rgba(0, 0, 0, 0.6)', color: '#fff', p: 1 }}>
                              <PhotoCameraIcon />
                            </IconButton>
                          </label>
                          <IconButton
                            onClick={handleDeleteAvatar}
                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.6)', color: '#fff', p: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <FileInput
                            id="avatar-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAvatarChange(e.target.files[0])}
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5, textAlign: 'center' }}>
                        Аватар профиля
                      </Typography>
                      
                      {/* Removing the Цвет обводки TextField */}
                  </Grid>
                  
                    {/* Right column - Banner */}
                    <Grid item xs={12} sm={8} md={9} sx={{ p: 2 }}>
                      <Box sx={{ 
                        position: 'relative', 
                        height: { xs: 150, sm: 180 },
                        width: '100%', 
                        overflow: 'hidden', 
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}>
                        <Box 
                          component="img"
                          src={bannerPreview || (user?.banner ? `/static/uploads/banner/${user.id}/${user.banner}` : undefined)}
                          alt="Banner"
                          sx={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = generatePlaceholder(800, 200, 'Banner', '#424242', '#ffffff');
                          }}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.2s',
                            opacity: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        >
                          <label htmlFor="banner-input">
                            <IconButton component="span" sx={{ bgcolor: 'rgba(0, 0, 0, 0.6)', color: '#fff' }}>
                              <PhotoCameraIcon />
                            </IconButton>
                          </label>
                          <IconButton
                            onClick={handleDeleteBanner}
                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.6)', color: '#fff' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <FileInput
                            id="banner-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBannerChange(e.target.files[0])}
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                        Баннер профиля
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Рекомендуемый размер: 1200×300 пикселей
                    </Typography>
                  </Grid>
                </Grid>
                </Box>
                
                <Grid container spacing={2} sx={{ mt: 7 }}> {/* Увеличиваем отступ для аватара */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      helperText={`${name?.length || 0}/15 символов`}
                      inputProps={{ maxLength: 15 }}
                      FormHelperTextProps={{ sx: { ml: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Имя пользователя"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      helperText={`${username?.length || 0}/16 символов, без пробелов`}
                      inputProps={{ maxLength: 16 }}
                      FormHelperTextProps={{ sx: { ml: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="О себе"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      variant="outlined"
                      helperText={`${about?.length || 0}/200 символов`}
                      inputProps={{ maxLength: 200 }}
                      FormHelperTextProps={{ sx: { ml: 0 } }}
                    />
                  </Grid>
                </Grid>
                
                {/* Status Settings */}
                <StatusSettings 
                  profileData={profileData} 
                  subscription={profileData?.subscription} 
                  onStatusUpdate={handleStatusUpdate}
                />



                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"

                    startIcon={<FavoriteIcon />}
                    onClick={() => setConnectionModalOpen(true)}
                    sx={{
                    }}
                  >
                    Коннект
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={20} /> : success ? <CheckIcon /> : <SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    sx={{ borderRadius: '12px', py: 1 }}
                  >
                    {saving ? 'Сохранение...' : success ? 'Сохранено' : 'Сохранить изменения'}
                  </Button>
                </Box>
              </SettingsCardContent>
            </SettingsCard>
            
            <SettingsCard>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <PublicIcon />
                  Социальные сети
                </SectionTitle>
                
                <List sx={{ bgcolor: 'rgba(16, 16, 16, 0.8)', borderRadius: 2, mb: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {socials.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" color="text.secondary" align="center">
                            У вас нет добавленных социальных сетей
                          </Typography>
                        } 
                      />
                    </ListItem>
                  ) : (
                    socials.map((social, index) => (
                      <ListItem 
                        key={index} 
                        divider={index < socials.length - 1}
                        sx={{ 
                          borderRadius: index === 0 ? '8px 8px 0 0' : index === socials.length - 1 ? '0 0 8px 8px' : '0',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                        }}
                      >
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                          {getSocialIcon(social.name, social.link)}
                        </Box>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2" fontWeight={500}>
                              {social.name}
                            </Typography>
                          } 
                          secondary={
                            <Typography 
                              variant="body2" 
                              component="a" 
                              href={social.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                              {social.link}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleDeleteSocial(social.name)} 
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
                
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setSocialDialogOpen(true)}
                    sx={{ borderRadius: '12px', py: 1, px: 3 }}
                  >
                    Добавить социальную сеть
                  </Button>
                </Box>
                
                
                <Dialog 
                  open={socialDialogOpen} 
                  onClose={() => setSocialDialogOpen(false)}
                  maxWidth="sm"
                  PaperProps={{
                    sx: { 
                      bgcolor: theme.palette.background.paper, 
                      color: theme.palette.text.primary,
                      borderRadius: 2
                    }
                  }}
                >
                  <DialogTitle sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Добавить социальную сеть</Typography>
                      <IconButton onClick={() => setSocialDialogOpen(false)} size="small">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </DialogTitle>
                  <DialogContent sx={{ mt: 2 }}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Социальная сеть</InputLabel>
                      <Select
                        value={newSocialName}
                        onChange={(e) => setNewSocialName(e.target.value)}
                        label="Социальная сеть"
                      >
                        <MenuItem value="VK">ВКонтакте</MenuItem>
                        <MenuItem value="TikTok">TikTok</MenuItem>
                        <MenuItem value="Telegram">Telegram</MenuItem>
                        <MenuItem value="YouTube">YouTube</MenuItem>
                        <MenuItem value="Website">Веб-сайт</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Ссылка"
                      value={newSocialLink}
                      onChange={(e) => setNewSocialLink(e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      placeholder="https://"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {getSocialIcon(newSocialName)}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </DialogContent>
                  <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setSocialDialogOpen(false)} color="inherit">Отмена</Button>
                    <Button 
                      onClick={handleAddSocial} 
                      color="primary" 
                      variant="contained"
                      disabled={!newSocialName || !newSocialLink || saving}
                      startIcon={saving ? <CircularProgress size={16} /> : <AddIcon />}
                    >
                      {saving ? 'Добавление...' : 'Добавить'}
                    </Button>
                  </DialogActions>
                </Dialog>
              </SettingsCardContent>
            </SettingsCard>
            
            {/* Account status moved to the bottom */}
            <SettingsCard>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <SecurityIcon />
                  Состояние учетной записи
                </SectionTitle>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: 'rgba(18, 18, 18, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  mb: accountStatus !== 'good' ? 2 : 0,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                }}>
                  <Box sx={{ mr: 2 }}>
                    {accountStatus === 'good' && (
                      <VerifiedUserIcon sx={{ color: '#81C784', fontSize: 30 }} />
                    )}
                    {accountStatus === 'warning' && (
                      <WarningAmberIcon sx={{ color: '#FFB74D', fontSize: 30 }} />
                    )}
                    {accountStatus === 'banned' && (
                      <BlockIcon sx={{ color: '#E57373', fontSize: 30 }} />
                    )}
          </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {accountStatus === 'good' && 'Всё в порядке'}
                      {accountStatus === 'warning' && 'Есть предупреждения'}
                      {accountStatus === 'banned' && 'Аккаунт заблокирован'}
                    </Typography>
                    {accountStatus !== 'good' && (
                      <Typography variant="body2" color="text.secondary">
                        {accountStatus === 'warning' && `${userWarnings.length} активных предупреждений`}
                        {accountStatus === 'banned' && 'Временная блокировка'}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ ml: 'auto' }}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={openWarningsDialog}
                      startIcon={<HistoryIcon fontSize="small" />}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        color: accountStatus === 'good' ? '#81C784' : 
                                accountStatus === 'warning' ? '#FFB74D' : '#E57373',
                      }}
                    >
                      История
                    </Button>
                  </Box>
                </Box>
                
                {accountStatus === 'banned' && banInfo && (
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(18, 18, 18, 0.9)', 
                      border: `1px solid ${alpha('#d32f2f', 0.3)}`
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Причина блокировки:</strong> {banInfo.reason}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>До:</strong> {formatWarningDate(banInfo.end_date)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Осталось дней:</strong> {banInfo.remaining_days}
                    </Typography>
                    {banInfo.details && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        {banInfo.details}
                      </Typography>
                    )}
                  </Box>
                )}
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        
        {getTabContent(activeTab) === 1 && (
          <Box component={motion.div} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* Theme selector for customizing appearance */}
            <ThemeSelector onThemeSelect={applyTheme} />
            
            {/* Profile style toggle - only for Ultimate subscription */}
            {profileData?.subscription?.type === 'ultimate' && (
              <Box sx={{ mt: 4, mb: 2 }}>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(18, 18, 18, 0.9)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Необычный профиль
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Изменить внешний вид профиля
                      </Typography>
                    </Box>
                    <IOSSwitch 
                      checked={isCustomProfileActive}
                      onChange={async () => {
                        try {
                          const newProfileId = isCustomProfileActive ? 1 : 2;
                          const response = await fetch('/api/user/profile-style', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ profile_id: newProfileId })
                          });
                          
                          const data = await response.json();
                          if (data.success) {
                            setIsCustomProfileActive(!isCustomProfileActive);
                            showNotification('success', 'Стиль профиля обновлен');
                          } else {
                            showNotification('error', data.error || 'Не удалось обновить стиль профиля');
                          }
                        } catch (error) {
                          console.error('Error updating profile style:', error);
                          showNotification('error', 'Ошибка при обновлении стиля профиля');
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            

      {/* Декорации профиля */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Декорации профиля
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Отображается в Лидерборде, поиске, при переводе и т.д.
        </Typography>
        
        {loadingDecorations ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : userDecorations.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography color="textSecondary">
              У вас пока нет декораций
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {userDecorations.map(item => {
              const decoration = item.decoration;
              return (
                <Grid item xs={12} md={6} key={decoration.id}>
                  <Paper 
                    sx={{ 
                      p: 2,
                      bgcolor: 'background.paper',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => theme.shadows[4]
                      }
                    }}
                  >
                    <DecorationPreview decoration={decoration}>
                      {decoration.item_path && (() => {
                        const [path, ...styles] = decoration.item_path.split(';');
                        const styleObj = styles.reduce((acc, style) => {
                          const [key, value] = style.split(':').map(s => s.trim());
                          return { ...acc, [key]: value };
                        }, {});
                        
                        return (
                          <DecorationItem
                            src={path}
                            alt=""
                            customStyles={styleObj}
                          />
                        );
                      })()}
                    </DecorationPreview>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 1 
                    }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {decoration.name} 
                        </Typography>
                      </Box>
                      <IOSSwitch
                        checked={item.is_active}
                        onChange={(e) => handleToggleDecoration(decoration.id, e.target.checked)}
                      />
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
            
            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <BrushIcon />
                  Дополнительные настройки
                </SectionTitle>
                
                {/* Profile background upload for Ultimate */}
                {profileData?.subscription?.type === 'ultimate' && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      Фоновая картинка профиля
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {profileData.user?.profile_background_url ? (
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            variant="rounded"
                            src={profileData.user.profile_background_url}
                            alt="Profile Background"
                            sx={{ width: 96, height: 96, borderRadius: 3, boxShadow: 2 }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)' }}
                            onClick={async () => {
                              try {
                                await axios.delete('/api/profile/background');
                                showNotification('success', 'Фон успешно удалён');
                                // Обновить профиль
                                if (fetchProfileData) fetchProfileData();
                              } catch (e) {
                                showNotification('error', e?.response?.data?.error || 'Ошибка удаления фона');
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{ width: 96, height: 96, borderRadius: 3, bgcolor: 'background.default', color: 'text.disabled', boxShadow: 1 }}
                        >
                          <PhotoCameraIcon fontSize="large" />
                        </Avatar>
                      )}
                      <Box>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<PhotoCameraIcon />}
                        >
                          Загрузить фон
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            hidden
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('background', file);
                              try {
                                await axios.post('/api/profile/background', formData, {
                                  headers: { 'Content-Type': 'multipart/form-data' }
                                });
                                showNotification('success', 'Фон успешно загружен');
                                if (fetchProfileData) fetchProfileData();
                              } catch (e) {
                                showNotification('error', e?.response?.data?.error || 'Ошибка загрузки фона');
                              }
                            }}
                          />
                        </Button>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                          Только для подписки Ultimate. PNG, JPG, GIF. До 5MB.
                        </Typography>
                      </Box>
                    </Box>
                    {/* Экспериментальная функция: глобальные обои профиля */}
                    {profileData.user?.profile_background_url && (
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IOSSwitch
                          checked={globalProfileBackgroundEnabled}
                          onChange={handleGlobalProfileBackgroundToggle}
                          inputProps={{ 'aria-label': 'Экспериментальная функция: Глобальные обои профиля' }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            Экспериментальная функция: Глобальные обои профиля
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            При включении ваша фоновая картинка будет использоваться по всему сайту (кроме чужих профилей с их обоями)
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {/* Accent Color Picker */}
                    <Box sx={{ mt: 2 }}>
                      <AccentColorBlock />
                    </Box>
                    {/* Экспериментальная функция: глобальные обои профиля */}
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 1, borderRadius: 2, fontWeight: 500 }}
                      onClick={() => setKonnectModalOpen(true)}
                    >
                      Экспорт / Импорт профиля (.konnect)
                    </Button>
                    <ProfileKonnectModal open={konnectModalOpen} onClose={() => setKonnectModalOpen(false)} />
                  </Box>
                )}
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        
        {getTabContent(activeTab) === 2 && !isChannel && (
          <Box component={motion.div} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle variant="h5">
              <NotificationsActiveIcon />
              Настройки уведомлений
            </SectionTitle>

            
            
            
            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5" sx={{ mb: 2 }}>
                  <NotificationsIcon sx={{ mr: 1 }} />
                  Уведомления
                </SectionTitle>
                
                {!pushSupported ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Ваш браузер не поддерживает push-уведомления
                  </Alert>
                ) : (
                  <>
                    {pushPermission === 'denied' && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Вы заблокировали разрешение на отправку уведомлений.
                      </Alert>
                    )}
                    
                    <List disablePadding sx={{ mb: 1 }}>
                      {/* Push-уведомления */}
                      <ListItem 
                        sx={{ 
                          py: 1.5, 
                          px: 2, 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.4),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          mb: 1
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <NotificationsActiveIcon color={pushSubscribed ? "success" : "action"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Push-уведомления" 
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        {pushLoading ? (
                          <CircularProgress size={24} sx={{ color: '#D0BCFF' }} />
                        ) : (
                          <IOSSwitch
                            checked={pushSubscribed}
                            onChange={pushSubscribed ? handleDisablePushNotifications : handleEnablePushNotifications}
                            disabled={pushPermission === 'denied'}
                          />
                        )}
                      </ListItem>
                      
                      {/* Telegram-уведомления */}
                      <ListItem 
                        sx={{ 
                          py: 1.5, 
                          px: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.4),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <TelegramIcon color={notificationPrefs.telegramNotificationsEnabled ? "success" : "action"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Telegram-уведомления" 
                          primaryTypographyProps={{ fontWeight: 500 }}
                          secondary={!notificationPrefs.telegramConnected ? "Подключите Telegram" : undefined}
                        />
                        {savingNotificationPrefs ? (
                          <CircularProgress size={24} sx={{ color: '#D0BCFF' }} />
                        ) : (
                          <IOSSwitch
                            checked={notificationPrefs.telegramNotificationsEnabled}
                            onChange={handleToggleTelegramNotifications}
                            disabled={!notificationPrefs.telegramConnected}
                          />
                        )}
                      </ListItem>
                    </List>
                    
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.disabled', textAlign: 'center' }}>
                      Push-уведомления работают даже когда браузер закрыт
                    </Typography>
                  </>
                )}
              </SettingsCardContent>
            </SettingsCard>
            
            
            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5" sx={{ mb: 2 }}>
                  <LinkIcon sx={{ mr: 1 }} />
                  Связанные аккаунты
                </SectionTitle>
                
                <List disablePadding>
               
                  {/* Telegram аккаунт */}
                  <ListItem 
                    sx={{ 
                      py: 1.5, 
                      px: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.4),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TelegramIcon sx={{ color: notificationPrefs.telegramConnected ? '#D0BCFF' : '#777' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Telegram"
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={notificationPrefs.telegramConnected ? "Подключен" : "Не подключен"}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setTelegramDialogOpen(true)}
                      disabled={false}
                      sx={{
                        bgcolor: notificationPrefs.telegramConnected ? 'transparent' : 'rgba(208, 188, 255, 0.1)',
                        color: notificationPrefs.telegramConnected ? 'success.main' : '#D0BCFF',
                        border: notificationPrefs.telegramConnected ? 'none' : '1px solid rgba(208, 188, 255, 0.3)',
                        boxShadow: 'none',
                        minWidth: 'auto',
                        px: 2,
                        '&:hover': {
                          bgcolor: 'rgba(208, 188, 255, 0.2)',
                        }
                      }}
                    >
                      {notificationPrefs.telegramConnected ? (
                        <CheckIcon fontSize="small" />
                      ) : 'Подключить'}
                    </Button>
                  </ListItem>
                </List>
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        
        {getTabContent(activeTab) === 3 && (
          <Box component={motion.div} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsCard>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <EmojiEventsIcon />
                  Управление бейджами
                </SectionTitle>
                
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Выберите бейдж, который будет отображаться рядом с вашим именем в профиле и публикациях
                </Typography>
                
                {loadingAchievements || loadingPurchasedBadges ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ width: '100%' }}>
                      {userAchievements.some(achievement => achievement.is_active) && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<RemoveCircleOutlineIcon />}
                          onClick={handleClearActiveBadge}
                          disabled={updatingActiveBadge}
                          sx={{ 
                            borderRadius: '10px', 
                            textTransform: 'none', 
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.08),
                            }
                          }}
                        >
                          Убрать бейдж
                        </Button>
                      </Box>
                    )}
                    
                    {userAchievements.length > 0 && (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
                          <ShieldIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                            Заработанные достижения
                          </Typography>
                    </Box>
                    
                        <Grid container spacing={1.5}>
                          {userAchievements
                            .filter(achievement => !achievement.image_path.includes('shop/'))
                            .map((achievement) => (
                              <Grid item xs={4} sm={3} md={2} key={achievement.id}>
                          <Card 
                                  elevation={0}
                            sx={{ 
                              position: 'relative',
                              height: '100%',
                              borderRadius: 2,
                                    background: 'transparent',
                              border: achievement.is_active 
                                ? `2px solid ${theme.palette.primary.main}` 
                                : `1px solid rgba(255, 255, 255, 0.05)`,
                                    transition: 'all 0.2s ease',
                              overflow: 'visible',
                              '&:hover': { 
                                      transform: 'translateY(-3px)',
                                      boxShadow: achievement.is_active ? theme.shadows[4] : 'none'
                              }
                            }}
                          >
                            {achievement.is_active && (
                              <Box 
                                sx={{
                                  position: 'absolute',
                                        top: -6,
                                        right: -6,
                                  backgroundColor: theme.palette.success.main,
                                        color: '#fff',
                                  borderRadius: '50%',
                                        width: 16,
                                        height: 16,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 2
                                }}
                              >
                                      <CheckIcon sx={{ fontSize: 12 }} />
                              </Box>
                            )}
                            
                            <CardContent sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                                    p: 1.5,
                                    '&:last-child': { pb: 1.5 }
                              }}>
                                <Box 
                                  component="img" 
                                  src={`/static/images/bages/${achievement.image_path}`}
                                  alt={achievement.name || achievement.bage}
                                  sx={{ 
                                        width: 50, 
                                        height: 50,
                                    objectFit: 'contain',
                                        mb: 1,
                                    filter: achievement.is_active ? 'none' : 'grayscale(30%)',
                                    transition: 'all 0.3s ease',
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/static/images/bages/default-badge.png';
                                  }}
                                />
                              
                              <Typography 
                                      variant="caption" 
                                sx={{ 
                                  fontWeight: 600,
                                        mb: 0.5,
                                  display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                      {achievement.name || achievement.bage}
                              </Typography>

                                <Button 
                                      variant={achievement.is_active ? "text" : "contained"}
                                      color={achievement.is_active ? "success" : "primary"}
                                      onClick={() => handleSetActiveBadge(achievement.id)}
                                      size="small"
                                  sx={{ 
                                        fontSize: '0.7rem',
                                        minHeight: 0,
                                        py: 0.5,
                                    width: '100%',
                                        minWidth: 'auto',
                                        borderRadius: '8px',
                                    textTransform: 'none',
                                        boxShadow: 'none'
                                  }}
                                      disabled={updatingActiveBadge}
                                >
                                      {achievement.is_active ? "Активен" : "Выбрать"}
                                </Button>
                                  </CardContent>
                                </Card>
                              </Grid>
                          ))}
                        </Grid>
                        
                        <Box sx={{ mt: 1, mb: 3, display: 'flex', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Собирайте новые достижения, участвуя в сообществе
                          </Typography>
                        </Box>
                      </>
                    )}
                    
                    {purchasedBadges.length > 0 && (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                          <ShoppingBagIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                          <Typography variant="h6" color="secondary" sx={{ fontWeight: 600 }}>
                            Приобретенные бейджи
                          </Typography>
                        </Box>
                        
                        <Grid container spacing={1.5}>
                          {userAchievements
                            .filter(achievement => achievement.image_path.includes('shop/'))
                            .map((achievement) => (
                              <Grid item xs={4} sm={3} md={2} key={achievement.id}>
                                <Card 
                                  elevation={0}
                                  sx={{ 
                                    position: 'relative',
                                    height: '100%',
                                    borderRadius: 2,
                                    background: 'transparent',
                                    border: achievement.is_active 
                                      ? `2px solid ${theme.palette.secondary.main}` 
                                      : `1px solid rgba(255, 255, 255, 0.05)`,
                                    transition: 'all 0.2s ease',
                                    overflow: 'visible',
                                    '&:hover': { 
                                      transform: 'translateY(-3px)',
                                      boxShadow: achievement.is_active ? theme.shadows[4] : 'none'
                                    }
                                  }}
                                >
                                  {achievement.is_active && (
                                    <Box 
                                      sx={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -6,
                                        backgroundColor: theme.palette.success.main,
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: 16,
                                        height: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2
                                      }}
                                    >
                                      <CheckIcon sx={{ fontSize: 12 }} />
                                    </Box>
                                  )}
                                  
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: -4,
                                      left: -4,
                                      backgroundColor: theme.palette.secondary.main,
                                      color: '#fff',
                                      borderRadius: '50%',
                                      width: 14,
                                      height: 14,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      zIndex: 2
                                    }}
                                  >
                                    <ShoppingBagIcon sx={{ fontSize: 8 }} />
                                  </Box>
                                  
                                  <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 1.5,
                                    '&:last-child': { pb: 1.5 }
                                    }}>
                                      <Box 
                                        component="img" 
                                        src={`/static/images/bages/${achievement.image_path}`}
                                        alt={achievement.name || achievement.bage}
                                        sx={{ 
                                        width: 50, 
                                        height: 50,
                                          objectFit: 'contain',
                                        mb: 1,
                                          filter: achievement.is_active ? 'none' : 'grayscale(30%)',
                                          transition: 'all 0.3s ease',
                                        }}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = '/static/images/bages/default-badge.png';
                                        }}
                                      />
                                    
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontWeight: 600,
                                        mb: 0.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}
                                    >
                                      {achievement.name || achievement.bage}
                                    </Typography>

                                <Button 
                                      variant={achievement.is_active ? "text" : "contained"}
                                      color={achievement.is_active ? "success" : "secondary"}
                                  onClick={() => handleSetActiveBadge(achievement.id)}
                                      size="small"
                                  sx={{ 
                                        fontSize: '0.7rem',
                                        minHeight: 0,
                                        py: 0.5,
                                    width: '100%',
                                        minWidth: 'auto',
                                        borderRadius: '8px',
                                    textTransform: 'none',
                                        boxShadow: 'none'
                                  }}
                                  disabled={updatingActiveBadge}
                                >
                                      {achievement.is_active ? "Активен" : "Выбрать"}
                                </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    
                        <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            Покупайте новые бейджи в магазине 
                      </Typography>
                          <Link href="/badge-shop" sx={{ textDecoration: 'none' }}>
                            <Button 
                              variant="text" 
                              color="secondary" 
                              size="small"
                              startIcon={<StorefrontIcon sx={{ fontSize: 14 }} />}
                              sx={{ 
                                textTransform: 'none',
                                py: 0,
                                ml: -1
                              }}
                            >
                              Перейти в магазин
                            </Button>
                          </Link>
                    </Box>
                      </>
                    )}
                  </Box>
                )}
                
                <Box 
                  component="style"
                  dangerouslySetInnerHTML={{
                    __html: `
                      @keyframes pulse {
                        0% {
                          transform: scale(1);
                          opacity: 0.8;
                        }
                        50% {
                          transform: scale(1.05);
                          opacity: 0.5;
                        }
                        100% {
                          transform: scale(1);
                          opacity: 0.8;
                        }
                      }
                      
                      @keyframes badge-glow {
                        0% {
                          box-shadow: 0 0 5px 0px ${theme.palette.primary.main};
                        }
                        50% {
                          box-shadow: 0 0 15px 2px ${theme.palette.primary.main};
                        }
                        100% {
                          box-shadow: 0 0 5px 0px ${theme.palette.primary.main};
                        }
                      }
                    `
                  }}
                />
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        
        {getTabContent(activeTab) === 4 && !isChannel && (
          <Box component={motion.div} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle variant="h5">
              <AlternateEmailIcon />
              Магазин Юзернеймов
            </SectionTitle>
            
            <SettingsCard>
              <SettingsCardContent sx={{ 
                p: { xs: 1, sm: 2, md: 3 } 
              }}>
                <UsernameShopTab 
                  activeTab={activeTab}
                />
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        
        {getTabContent(activeTab) === 5 && !isChannel && (
          <Box component={motion.div} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoginSettingsTab />
          </Box>
        )}
        
        
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ 
              width: '100%',
              bgcolor: severity => severity === 'success' ? 'rgba(46, 125, 50, 0.9)' : 
                        severity === 'error' ? 'rgba(211, 47, 47, 0.9)' :
                        severity === 'warning' ? 'rgba(237, 108, 2, 0.9)' : 'rgba(2, 136, 209, 0.9)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        
        
        <Dialog
          open={telegramDialogOpen}
          onClose={() => setTelegramDialogOpen(false)}
          aria-labelledby="telegram-dialog-title"
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: theme.shadows[10],
              background: 'rgba(18, 18, 18, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Подключение Telegram</Typography>
              <IconButton onClick={() => setTelegramDialogOpen(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Для подключения Telegram введите ваш Telegram ID, который вы можете получить через бота <strong>@getmyid_bot</strong>.
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Внимание:</strong> Не вводите чужой ID. Это может привести к отправке уведомлений не тому человеку.
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Telegram ID"
              variant="outlined"
              value={telegramIdInput}
              onChange={(e) => setTelegramIdInput(e.target.value)}
              error={!!telegramIdError}
              helperText={telegramIdError || 'Введите ваш числовой ID из Telegram'}
              disabled={savingTelegramId}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                href="https://t.me/getmyid_bot"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<TelegramIcon />}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Открыть @getmyid_bot
              </Button>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={() => setTelegramDialogOpen(false)} 
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSaveTelegramId} 
              variant="contained" 
              color="primary"
              disabled={savingTelegramId || !telegramIdInput.trim()}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              {savingTelegramId ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Сохранение...
                </>
              ) : "Подключить Telegram"}
            </Button>
          </DialogActions>
        </Dialog>
        
        
        <Dialog
          open={warningsDialogOpen}
          onClose={() => setWarningsDialogOpen(false)}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 1, 
              background: 'rgba(12, 12, 12, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1 }} />
              История предупреждений
            </Box>
          </DialogTitle>
          
          <DialogContent dividers>
            {loadingWarnings ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={40} />
              </Box>
            ) : userWarnings.length > 0 ? (
              <Box>
                
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Дата</TableCell>
                          <TableCell>Причина</TableCell>
                          <TableCell>Детали</TableCell>
                          <TableCell>Статус</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userWarnings.map((warning) => (
                          <TableRow key={warning.id}>
                            <TableCell>{formatWarningDate(warning.created_at)}</TableCell>
                            <TableCell>{warning.reason}</TableCell>
                            <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {warning.details}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={warning.active ? "Активно" : "Снято"} 
                                color={warning.active ? "warning" : "default"}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                
                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                  {userWarnings.map((warning) => (
                    <Paper 
                      key={warning.id} 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        border: `1px solid ${warning.active ? alpha(theme.palette.warning.main, 0.3) : alpha(theme.palette.divider, 0.2)}`,
                        background: warning.active ? alpha(theme.palette.warning.main, 0.05) : 'transparent'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {warning.reason}
                        </Typography>
                        <Chip 
                          label={warning.active ? "Активно" : "Снято"} 
                          color={warning.active ? "warning" : "default"}
                          size="small"
                          sx={{ height: 22, fontSize: '0.75rem' }}
                        />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {formatWarningDate(warning.created_at)}
                      </Typography>
                      
                      {warning.details && (
                        <Typography variant="body2" sx={{ 
                          mt: 1, 
                          fontSize: '0.875rem',
                          color: alpha(theme.palette.text.primary, 0.8) 
                        }}>
                          {warning.details}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <VerifiedUserIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6">
                  Нет предупреждений
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  У вас нет активных или прошлых предупреждений.
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setWarningsDialogOpen(false)} color="primary">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
        
        
        <SettingsBottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          user={user}
          />
        
          <Box sx={{ mt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.12)', pt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Безопасность и устройства
            </Typography>
            
            <Button
              variant="contained"
              onClick={handleOpenSessionManager}
              sx={{ 
                mt: 2, 
                borderRadius: 2,
                py: 1.8,
                justifyContent: 'flex-start',
                textTransform: 'none',
                backgroundColor: 'rgba(16, 16, 16, 0.9)',
                backgroundImage: 'linear-gradient(45deg, rgba(16, 16, 16, 0.9), rgba(22, 22, 22, 0.9))',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(208, 188, 255, 0.1)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(22, 22, 22, 0.9)',
                  backgroundImage: 'linear-gradient(45deg, rgba(22, 22, 22, 0.9), rgba(30, 30, 30, 0.9))',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                },
                width: '100%'
              }}
              startIcon={
                <DevicesIcon sx={{ 
                  color: '#d0bcff',
                  fontSize: '1.5rem'
                }} />
              }
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                ml: 1
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#fff' }}>
                  Управление сессиями
                </Typography>
                <Typography variant="caption" sx={{ color: '#d0bcff' }}>
                  Устройства, подключенные к аккаунту
                </Typography>
              </Box>
            </Button>
          </Box>
          
          {/* Session Manager Dialog */}
          <SessionManager 
            open={sessionManagerOpen} 
            onClose={handleCloseSessionManager} 
          />
  
          {/* Добавляем кнопку удаления канала только если это канал */}
          {profileData?.user?.account_type === 'channel' && (
            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
              <Button
                onClick={() => setDeleteChannelDialogOpen(true)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                  },
                }}
              >
                Удалить канал
              </Button>
            </Box>
          )}
  
          <DeleteChannelDialog
            open={deleteChannelDialogOpen}
            onClose={() => setDeleteChannelDialogOpen(false)}
            channelId={profileData?.user?.id}
            onDelete={handleDeleteChannelSuccess}
          />
  
          {/* Add this button where you want it to appear */}
  
               <ConnectionModal 
            open={connectionModalOpen}
            onClose={() => setConnectionModalOpen(false)}
        />
      </SettingsContainer>
    </motion.div>
  );
};


const ThemeSelector = ({ onThemeSelect }) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  const themes = [
    {
      id: 'default',
      name: 'По умолчанию',
      bg: '#131313',
      paper: '#1c1c1c',
      primary: '#D0BCFF',
      textColor: '#FFFFFF'
    },
    {
      id: 'light',
      name: 'Светлая тема',
      bg: '#ffffff',
      paper: '#ffffff',
      primary: '#8c52ff',
      textColor: '#000000'
    },
    {
      id: 'contrast',
      name: 'Контрастная',
      bg: '#000000',
      paper: '#000000',
      primary: '#7B46E3',
      textColor: '#FFFFFF'
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Готовые темы оформления
      </Typography>
      <Grid container spacing={2}>
        {themes.map(themeOption => (
          <Grid item xs={12} sm={4} key={themeOption.id}>
            <Box
              onClick={() => onThemeSelect(themeOption.id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: `2px solid ${currentTheme === themeOption.id ? 
                  (themeSettings.primaryColor || theme.palette.primary.main) : 
                  theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.palette.mode === 'light' 
                    ? '0 4px 20px rgba(0,0,0,0.1)' 
                    : '0 4px 20px rgba(0,0,0,0.2)'
                }
              }}
            >
              <Box sx={{ height: 120, bgcolor: themeOption.bg, position: 'relative', p: 1 }}>
                <Box sx={{ height: 24, bgcolor: themeOption.paper, borderRadius: 1, mb: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, height: 60 }}>
                  <Box sx={{ width: '30%', bgcolor: themeOption.paper, borderRadius: 1 }} />
                  <Box sx={{ width: '70%', bgcolor: themeOption.paper, borderRadius: 1, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', width: 30, height: 6, bgcolor: themeOption.primary, borderRadius: 1, top: 10, left: 10 }} />
                  </Box>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  p: 1.5, 
                  bgcolor: themeOption.paper, 
                  color: themeOption.textColor
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {themeOption.name}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};


const handleOpenSessionManager = () => {
  setSessionManagerOpen(true);
};

const handleCloseSessionManager = () => {
  setSessionManagerOpen(false);
};

function AccentColorBlock() {
  const [pendingAccentColor, setPendingAccentColor] = useState(() => localStorage.getItem('accentColorOverride') || '#d0bcff');
  const [pendingTextColorMode, setPendingTextColorMode] = useState(() => localStorage.getItem('accentTextColorMode') || 'light');
  const [appliedAccentColor, setAppliedAccentColor] = useState(() => localStorage.getItem('accentColorOverride') || '#d0bcff');
  const [appliedTextColorMode, setAppliedTextColorMode] = useState(() => localStorage.getItem('accentTextColorMode') || 'light');
  const [isApplying, setIsApplying] = useState(false);

  const isChanged = pendingAccentColor !== appliedAccentColor || pendingTextColorMode !== appliedTextColorMode;

  console.log('isChanged:', isChanged);
  console.log('pendingAccentColor:', pendingAccentColor);
  console.log('appliedAccentColor:', appliedAccentColor);

  const handleApply = async () => {
    console.log('handleApply вызван');
    console.log('pendingAccentColor:', pendingAccentColor);
    setIsApplying(true);
    
    try {
      // Сохраняем в localStorage
      localStorage.setItem('accentColorOverride', pendingAccentColor);
      localStorage.setItem('primaryColor', pendingAccentColor);
      console.log('localStorage установлен:', localStorage.getItem('primaryColor'));
      
      // Сохраняем в БД через API
      const response = await fetch('/api/profile/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primary_color: pendingAccentColor
        })
      });
      
      const data = await response.json();
      if (data && data.success) {
        console.log('Primary color успешно сохранен в БД:', pendingAccentColor);
        
        // Обновляем страницу после успешного сохранения
        window.location.reload();
      } else {
        console.error('Ошибка сохранения primary color в БД:', data?.error);
      }
      
      setAppliedAccentColor(pendingAccentColor);
      setAppliedTextColorMode(pendingTextColorMode);
      setIsApplying(false);
      console.log('handleApply завершен');
    } catch (error) {
      console.error('Ошибка при сохранении primary color:', error);
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    setPendingAccentColor('#d0bcff');
    setPendingTextColorMode('light');
    localStorage.removeItem('accentColorOverride');
    localStorage.removeItem('primaryColor');
    setAppliedAccentColor('#d0bcff');
    setAppliedTextColorMode('light');
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 340, mx: 'auto', mt: 0, mb: 2,
      p: 0,
      background: 'none',
      borderRadius: 0
    }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>Персонализация акцента</Typography>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" gutterBottom>Цвет акцента</Typography>
        <input
          type="color"
          value={pendingAccentColor}
          onChange={e => setPendingAccentColor(e.target.value)}
          style={{ width: 48, height: 48, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8 }}
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" gutterBottom>Цвет текста в сайдбаре</Typography>
        <ToggleButtonGroup
          value={pendingTextColorMode}
          exclusive
          onChange={(_, val) => val && setPendingTextColorMode(val)}
          size="small"
          sx={{ mt: 1 }}
        >
          <ToggleButton value="light">Светлый текст</ToggleButton>
          <ToggleButton value="dark">Тёмный текст</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', width: '100%', mt: 2 }}>
        <Button
          size="medium"
          variant="contained"
          onClick={handleApply}
          disabled={!isChanged || isApplying}
          sx={{ minWidth: 100 }}
        >
          Применить
        </Button>
        <Button size="medium" variant="outlined" onClick={handleReset} sx={{ minWidth: 100 }}>
          Сбросить
        </Button>
      </Box>
    </Box>
  );
}

export default SettingsPage;

