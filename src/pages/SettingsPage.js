import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
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
  Snackbar,
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
  FormControlLabel,
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
  AlertTitle
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileService from '../services/ProfileService';
import { AuthContext } from '../context/AuthContext';
import { ThemeSettingsContext } from '../App';
import { motion } from 'framer-motion';
import NotificationService from '../services/NotificationService';

// Иконки
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import WarningIcon from '@mui/icons-material/Warning';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LinkIcon from '@mui/icons-material/Link';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SvgIcon from '@mui/material/SvgIcon';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LaunchIcon from '@mui/icons-material/Launch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Стилизованные компоненты
const SettingsContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

const SettingsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
}));

const SettingsCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[4],
  overflow: 'visible',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const SettingsCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const ProfileImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  '&:hover .edit-overlay': {
    opacity: 1,
  },
}));

const EditOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.common.black, 0.5),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const BannerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 180,
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  '&:hover .edit-overlay': {
    opacity: 1,
  },
}));

const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.common.black, 0.5),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
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
  '& .MuiTabs-indicator': {
    backgroundColor: '#D0BCFF',
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
  '& .MuiTab-root': {
    fontWeight: 600,
    textTransform: 'none',
    minWidth: 120,
    '&.Mui-selected': {
      color: '#D0BCFF',
    },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.MuiTab-root': {
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha('#D0BCFF', 0.08),
    },
    '&.Mui-selected': {
      color: '#D0BCFF',
    }
  },
}));

const FileInput = styled('input')({
  display: 'none',
});

// Element SVG Icon component
const ElementIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.17 14.93l-4.11-4.11 1.41-1.41 2.7 2.7 5.88-5.88 1.41 1.41-7.29 7.29z" />
  </SvgIcon>
);

const AumbentIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 6000 6000">
    <rect x="3564.05" y="1024" width="1500" height="3500" rx="221" transform="rotate(24.0085 3564.05 1024)" fill="currentColor"/>
    <rect x="1066" y="1901.42" width="1500" height="3250" rx="221" transform="rotate(-18.8815 1066 1901.42)" fill="currentColor"/>
  </SvgIcon>
);

const getSocialIcon = (name, url) => {
  if (url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('facebook.com')) return <FacebookIcon />;
    if (lowerUrl.includes('twitter.com')) return <TwitterIcon />;
    if (lowerUrl.includes('instagram.com')) return <InstagramIcon />;
    if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.')) return <TelegramIcon />;
    if (lowerUrl.includes('youtube.com')) return <YouTubeIcon />;
    if (lowerUrl.includes('element.com') || lowerUrl.includes('elemsocial.com')) return <ElementIcon />;
    if (lowerUrl.includes('aumbent.ru')) return <AumbentIcon />;
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
    case 'element':
      return <ElementIcon />;
    case 'aumbent':
    case 'iq_search':
      return <AumbentIcon />;
    case 'vk':
    case 'вконтакте':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2M15.54 13.5C15.24 13.41 14.95 13.33 14.7 13.21C13.3 12.58 12.64 11.3 12.34 10.55C12.23 10.26 12.16 10 12.15 9.89C12.15 9.89 12.15 9.89 12.15 9.89V9.85C12.15 9.63 12.34 9.44 12.56 9.44H13.43C13.6 9.44 13.75 9.59 13.75 9.76V9.76C13.81 9.93 13.82 9.98 13.96 10.26C14.11 10.59 14.36 11.09 14.91 11.54C15.18 11.77 15.34 11.75 15.46 11.66C15.46 11.66 15.5 11.55 15.5 11.13V10.11C15.46 9.85 15.4 9.77 15.35 9.67C15.32 9.61 15.29 9.56 15.27 9.47C15.27 9.37 15.35 9.28 15.45 9.28H17.1C17.27 9.28 17.4 9.41 17.4 9.58V10.94C17.4 11.05 17.42 11.94 18.05 11.94C18.38 11.94 18.66 11.63 19.07 11.15C19.5 10.57 19.71 10.08 19.81 9.85C19.86 9.76 19.93 9.53 20.04 9.47C20.12 9.42 20.21 9.44 20.28 9.44H21.1C21.27 9.44 21.42 9.59 21.42 9.77C21.42 9.77 21.42 9.77 21.42 9.77C21.46 9.97 21.39 10.14 21.17 10.45C20.88 10.91 20.57 11.32 20.32 11.66C19.58 12.68 19.58 12.75 20.35 13.46C20.65 13.76 20.9 14.02 21.1 14.25C21.27 14.45 21.45 14.66 21.6 14.89C21.69 15.04 21.77 15.19 21.74 15.37C21.71 15.57 21.53 15.72 21.33 15.72H20.2C19.84 15.72 19.77 15.5 19.44 15.11C19.37 15.02 19.28 14.94 19.2 14.85C18.98 14.59 18.81 14.4 18.59 14.23C18 13.71 17.57 13.77 17.33 13.77C17.13 13.79 16.98 13.95 16.98 14.15V15.07C16.98 15.35 16.95 15.5 16.71 15.62C16.66 15.62 16.57 15.67 16.53 15.67H15.54V13.5Z" /></svg>;
    case 'tiktok':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.5 0-1.4 1.16-2.5 2.59-2.5.27 0 .53.04.77.13v-3.13c-.25-.02-.5-.04-.77-.04-3.09 0-5.59 2.57-5.59 5.67 0 3.1 2.5 5.67 5.59 5.67 3.09 0 5.59-2.57 5.59-5.67V9.14c.85.63 1.91 1.05 3.09 1.05V7.15c-1.32 0-2.59-.7-3.09-1.33z"/></svg>;
    default:
      // Check if name contains known platform names
      if (lowerName.includes('facebook')) return <FacebookIcon />;
      if (lowerName.includes('twitter')) return <TwitterIcon />;
      if (lowerName.includes('instagram')) return <InstagramIcon />;
      if (lowerName.includes('telegram')) return <TelegramIcon />;
      if (lowerName.includes('youtube')) return <YouTubeIcon />;
      if (lowerName.includes('element')) return <ElementIcon />;
      if (lowerName.includes('aumbent') || lowerName.includes('iq_search')) return <AumbentIcon />;
      if (lowerName.includes('vk') || lowerName.includes('вконтакте')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2M15.54 13.5C15.24 13.41 14.95 13.33 14.7 13.21C13.3 12.58 12.64 11.3 12.34 10.55C12.23 10.26 12.16 10 12.15 9.89C12.15 9.89 12.15 9.89 12.15 9.89V9.85C12.15 9.63 12.34 9.44 12.56 9.44H13.43C13.6 9.44 13.75 9.59 13.75 9.76V9.76C13.81 9.93 13.82 9.98 13.96 10.26C14.11 10.59 14.36 11.09 14.91 11.54C15.18 11.77 15.34 11.75 15.46 11.66C15.46 11.66 15.5 11.55 15.5 11.13V10.11C15.46 9.85 15.4 9.77 15.35 9.67C15.32 9.61 15.29 9.56 15.27 9.47C15.27 9.37 15.35 9.28 15.45 9.28H17.1C17.27 9.28 17.4 9.41 17.4 9.58V10.94C17.4 11.05 17.42 11.94 18.05 11.94C18.38 11.94 18.66 11.63 19.07 11.15C19.5 10.57 19.71 10.08 19.81 9.85C19.86 9.76 19.93 9.53 20.04 9.47C20.12 9.42 20.21 9.44 20.28 9.44H21.1C21.27 9.44 21.42 9.59 21.42 9.77C21.42 9.77 21.42 9.77 21.42 9.77C21.46 9.97 21.39 10.14 21.17 10.45C20.88 10.91 20.57 11.32 20.32 11.66C19.58 12.68 19.58 12.75 20.35 13.46C20.65 13.76 20.9 14.02 21.1 14.25C21.27 14.45 21.45 14.66 21.6 14.89C21.69 15.04 21.77 15.19 21.74 15.37C21.71 15.57 21.53 15.72 21.33 15.72H20.2C19.84 15.72 19.77 15.5 19.44 15.11C19.37 15.02 19.28 14.94 19.2 14.85C18.98 14.59 18.81 14.4 18.59 14.23C18 13.71 17.57 13.77 17.33 13.77C17.13 13.79 16.98 13.95 16.98 14.15V15.07C16.98 15.35 16.95 15.5 16.71 15.62C16.66 15.62 16.57 15.67 16.53 15.67H15.54V13.5Z" /></svg>;
      if (lowerName.includes('tiktok')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.5 0-1.4 1.16-2.5 2.59-2.5.27 0 .53.04.77.13v-3.13c-.25-.02-.5-.04-.77-.04-3.09 0-5.59 2.57-5.59 5.67 0 3.1 2.5 5.67 5.59 5.67 3.09 0 5.59-2.57 5.59-5.67V9.14c.85.63 1.91 1.05 3.09 1.05V7.15c-1.32 0-2.59-.7-3.09-1.33z"/></svg>;
      
      return <PublicIcon />;
  }
};

// Компонент для загрузки файлов с предпросмотром
const FileUploader = ({ id, currentImage, onFileSelect, icon, label, borderRadius }) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    // Проверяем тип файла
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

// Компонент для изменения цвета
const ColorPicker = ({ label, color, onChange }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [red, setRed] = useState(parseInt(color.slice(1, 3), 16));
  const [green, setGreen] = useState(parseInt(color.slice(3, 5), 16));
  const [blue, setBlue] = useState(parseInt(color.slice(5, 7), 16));
  
  // Преобразуем компоненты RGB в цвет в формате hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  // Обновление цвета при изменении слайдеров
  const updateColor = (r, g, b) => {
    const hexColor = rgbToHex(r, g, b);
    setCurrentColor(hexColor);
    onChange(hexColor); // Сразу применяем изменения
  };
  
  // Обработчики изменения компонентов RGB
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
  
  // Обработчик выбора предустановленного цвета
  const handlePresetColorClick = (presetColor) => {
    const r = parseInt(presetColor.slice(1, 3), 16);
    const g = parseInt(presetColor.slice(3, 5), 16);
    const b = parseInt(presetColor.slice(5, 7), 16);
    
    setCurrentColor(presetColor);
    setRed(r);
    setGreen(g);
    setBlue(b);
    onChange(presetColor); // Сразу применяем изменения
  };
  
  // Обработчик изменения HEX-кода
  const handleHexChange = (value) => {
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i)) {
      setCurrentColor(value);
      
      // Обновляем значения RGB
      const r = parseInt(value.slice(1, 3), 16);
      const g = parseInt(value.slice(3, 5), 16);
      const b = parseInt(value.slice(5, 7), 16);
      
      setRed(r);
      setGreen(g);
      setBlue(b);
      
      onChange(value); // Сразу применяем изменения
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
            boxShadow: theme.shadows[24]
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

// After the imports at the top, add this styled component for a blurred dialog
const BlurredDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    backgroundImage: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.8), rgba(36, 36, 36, 0.8))',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  }
}));

// 1. Создадим стилизованные компоненты с правильным градиентом
const PurchaseDialogHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '8px 8px 0 0',
  background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.3) 0%, rgba(124, 77, 255, 0.5) 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  }
}));

const PurchaseButton = styled(Button)(({ theme }) => ({
  backgroundImage: 'linear-gradient(135deg, #64B5F6 0%, #1976D2 100%)',
  borderRadius: 12,
  padding: theme.spacing(1.2, 3),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
    transform: 'translateY(0)',
  },
  '&.Mui-disabled': {
    background: 'rgba(255,255,255,0.1)',
  }
}));

// Компонент для магазина юзернеймов
const UsernameShopTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Add local showNotification function
  const showNotification = (severity, message) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Fetch purchased usernames on mount
  useEffect(() => {
    fetchPurchasedUsernames();
    fetchUserPoints();
  }, []);
  
  const fetchPurchasedUsernames = async () => {
    try {
      const response = await axios.get('/api/username/purchased');
      if (response.data.success) {
        const usernames = response.data.usernames || [];
        setPurchased(usernames);
        setLimitReached(usernames.length >= 3);
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
    const value = e.target.value.trim();
    setUsername(value);
    
    // Clear previous data
    if (!value) {
      setUsernameData(null);
      return;
    }
    
    // Debounce the API call
    const delayDebounceFn = setTimeout(() => {
      calculateUsernamePrice(value);
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
      
      // Display animation for 1.5 seconds before actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await axios.post('/api/username/purchase', { username });
      
      if (response.data.success) {
        // Update points in localStorage to keep it in sync
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
        
        // Update points state directly from API response
        setUserPoints(response.data.new_balance);
        
        // Show success animation
        setPurchaseComplete(true);
        
        // Wait 1 second before closing dialog
        setTimeout(() => {
          setOpenPurchaseDialog(false);
          setPurchaseAnimation(false);
          setPurchaseComplete(false);
          
          // Show success message
          showNotification('success', response.data.message || 'Username purchased successfully!');
          
          // Clear form
          setUsername('');
          setUsernameData(null);
          
          // Refresh purchased usernames
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
      
      // Check if this is a limit reached error
      if (errorData.limit_reached) {
        setLimitReached(true);
        showNotification('warning', errorMessage);
        // Automatically open links in new tabs if provided in the error
        if (errorData.donation_url) {
          window.open(errorData.donation_url, '_blank');
        }
      } else {
        // Generic error handling for other errors
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
      // Refresh user points to ensure accurate balance
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
        // Update username in localStorage
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
        
        // Show success message
        showNotification('success', response.data.message || 'Username changed successfully!');
        
        // Refresh purchased usernames
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
  
  // Calculate length factor
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
      
      {/* Info Paper - Username Purchase Rules */}
      <Paper 
        elevation={3}
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: { xs: 2, md: 3 }, 
          bgcolor: 'rgba(40, 40, 40, 0.9)', 
          borderRadius: 2,
          border: '1px solid rgba(208, 188, 255, 0.2)'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: '#D0BCFF' }}>
          Правила покупки юзернеймов
        </Typography>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" paragraph>
            Вы можете купить до <strong style={{ color: '#D0BCFF' }}>3 юзернеймов</strong> на один аккаунт. 
            {limitReached && (
              <span style={{ color: '#FF9800', fontWeight: 'bold' }}> Вы достигли лимита.</span>
            )}
          </Typography>
          
          <Divider sx={{ my: 1.5, borderColor: 'rgba(208, 188, 255, 0.1)' }} />
          
          <Typography variant="subtitle2" sx={{ color: '#D0BCFF', mt: 1.5 }}>
            Факторы, влияющие на цену:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Длина юзернейма:</strong>
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                • 1-3 символа: x3.0
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                • 4-6 символов: x2.0
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                • 7-10 символов: x1.5
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                • 11+ символов: x1.0
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Популярность:</strong>
              </Typography>
              <Typography variant="body2">
                Чем популярнее юзернейм, тем выше его стоимость. Популярность зависит от частоты использования подобных юзернеймов.
              </Typography>
            </Grid>
          </Grid>
          
          {limitReached && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Для увеличения лимита обратитесь в поддержку t.me/KConnectSUP_bot или сделайте донат на donationalerts.com/r/qsouls
            </Alert>
          )}
        </Box>
      </Paper>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: { xs: 2, md: 4 }, 
          bgcolor: 'rgba(40, 40, 40, 0.9)', 
      borderRadius: 2, 
          border: '1px solid rgba(208, 188, 255, 0.2)',
          opacity: limitReached ? 0.7 : 1,
          position: 'relative'
        }}
      >
        {limitReached && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
            borderRadius: 2,
          }}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" sx={{ color: '#FF9800', mb: 1 }}>
                Достигнут лимит юзернеймов
              </Typography>
              <Typography variant="body2">
                Вы уже приобрели максимальное количество юзернеймов (3)
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                href="https://www.donationalerts.com/r/qsouls"
                target="_blank"
                sx={{ mt: 2, mr: 1 }}
              >
                Донат
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                href="https://t.me/KConnectSUP_bot"
                target="_blank"
                sx={{ mt: 2 }}
              >
                Поддержка
              </Button>
            </Box>
          </Box>
        )}
        <Typography variant="h6" gutterBottom sx={{ color: '#D0BCFF' }}>
          Найти и приобрести юзернейм
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
          Юзернейм должен содержать хотя бы одну букву и не может состоять только из цифр или специальных символов. 
          Длина от 1 до 16 символов. Более короткие юзернеймы стоят дороже.
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
              '& fieldset': {
                borderColor: 'rgba(208, 188, 255, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: '#D0BCFF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#D0BCFF',
              },
            },
          }}
          helperText="Должен содержать хотя бы одну букву. Допустимы только латинские буквы, цифры, точки, подчеркивания и дефисы."
          error={!!error}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
            p: { xs: 1.5, md: 2 }, 
            bgcolor: 'rgba(30, 30, 30, 0.6)', 
            borderRadius: 2,
            border: '1px solid rgba(208, 188, 255, 0.1)' 
          }}>
            <Typography variant="h6" sx={{ color: '#81C784', mb: 1 }}>
              Юзернейм доступен!
      </Typography>
            
            <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Длина:</Typography>
                <Typography>{usernameData?.length || 0} символов (x{getLengthFactor(usernameData?.length || 0)})</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Фактор популярности:</Typography>
                <Typography>x{usernameData?.popularity?.toFixed(1) || '1.0'}</Typography>
              </Grid>
            </Grid>
      
      <Box sx={{ 
        display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center', 
              justifyContent: 'space-between', 
              mt: 2,
              gap: isMobile ? 2 : 0
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: '#D0BCFF',
                fontSize: isMobile ? '1.2rem' : '1.5rem'
              }}>
                Стоимость: {usernameData?.price || 0} баллов
              </Typography>
              
              <Button 
                variant="contained"
                color="primary"
                disabled={purchasing || userPoints < (usernameData?.price || 0)}
                onClick={handleOpenPurchaseDialog}
                startIcon={purchasing ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
            sx={{ 
                  bgcolor: '#D0BCFF', 
                  color: '#1A1A1A',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': {
                    bgcolor: '#B39DDB',
                  },
                }}
              >
                {purchasing ? 'Покупка...' : 'Купить'}
              </Button>
            </Box>
            
            {userPoints < (usernameData?.price || 0) && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                У вас недостаточно баллов для покупки этого юзернейма
              </Typography>
            )}
          </Box>
        )}
        
        {usernameData && !usernameData.available && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Юзернейм уже занят
          </Alert>
        )}
        
        {usernameData && usernameData.owned && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Вы уже владеете этим юзернеймом
          </Alert>
        )}
      </Paper>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: { xs: 2, md: 4 }, 
          bgcolor: 'rgba(40, 40, 40, 0.9)', 
          borderRadius: 2,
          border: '1px solid rgba(208, 188, 255, 0.2)'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: '#D0BCFF' }}>
          Мои юзернеймы
        </Typography>
        
        {purchased && purchased.length > 0 ? (
          <TableContainer component={Paper} sx={{ 
            bgcolor: 'rgba(30, 30, 30, 0.6)', 
            mt: 2, 
            borderRadius: 2,
            border: '1px solid rgba(208, 188, 255, 0.1)',
            ...(isMobile && {
              '& .MuiTableCell-root': {
                padding: '8px 4px',
                fontSize: '0.8rem'
              }
            })
          }}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#D0BCFF', fontWeight: 'bold' }}>Юзернейм</TableCell>
                  {!isMobile && <TableCell sx={{ color: '#D0BCFF', fontWeight: 'bold' }}>Цена</TableCell>}
                  {!isMobile && <TableCell sx={{ color: '#D0BCFF', fontWeight: 'bold' }}>Дата покупки</TableCell>}
                  <TableCell sx={{ color: '#D0BCFF', fontWeight: 'bold' }}>Статус</TableCell>
                  <TableCell sx={{ color: '#D0BCFF', fontWeight: 'bold' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchased.map((item) => (
                  <TableRow key={item.id} sx={{ 
                    bgcolor: item.is_active ? 'rgba(208, 188, 255, 0.1)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(208, 188, 255, 0.05)' }
                  }}>
                    <TableCell 
                      sx={{ 
                        fontWeight: item.is_active ? 'bold' : 'normal', 
                        color: item.is_active ? '#D0BCFF' : 'inherit',
                        maxWidth: '120px',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {item.username}
                    </TableCell>
                    {!isMobile && <TableCell>{item.price_paid} баллов</TableCell>}
                    {!isMobile && <TableCell>{formatDate(item.purchase_date)}</TableCell>}
                    <TableCell>
                      {item.is_active ? (
                        <Chip label="Активен" color="success" size="small" sx={{ bgcolor: '#4CAF50' }} />
                      ) : item.is_current ? (
                        <Chip label="Текущий" color="warning" size="small" sx={{ bgcolor: '#FF9800' }} />
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {!item.is_active && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleSetActive(item)}
                          sx={{ 
                            borderColor: '#D0BCFF',
                            color: '#D0BCFF',
                            padding: isMobile ? '4px 8px' : '6px 16px',
                            fontSize: isMobile ? '0.7rem' : '0.8125rem',
                            minWidth: isMobile ? '60px' : '64px',
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
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            У вас пока нет приобретенных юзернеймов
          </Box>
        )}
      </Paper>
      
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
      
      {/* Add the purchase dialog */}
      <Dialog 
        open={openPurchaseDialog} 
        onClose={() => !purchaseAnimation && setOpenPurchaseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#1e1e1e',
            color: '#fff',
            borderRadius: '8px',
            overflow: 'hidden'
          }
        }}
      >
        <PurchaseDialogHeader>
          <Avatar sx={{ 
            width: isMobile ? 60 : 70, 
            height: isMobile ? 60 : 70, 
            bgcolor: 'rgba(208, 188, 255, 0.2)', 
            mb: 2,
            border: '2px solid rgba(208, 188, 255, 0.3)'
          }}>
            <ShoppingCartIcon sx={{ fontSize: isMobile ? 30 : 40, color: 'white' }} />
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
      
      {/* Add local snackbar for notifications */}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Основной компонент страницы настроек
const SettingsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, updateUserData } = useContext(AuthContext);
  const { themeSettings, updateThemeSettings } = useContext(ThemeSettingsContext);
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  
  // Состояния для данных профиля
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [socials, setSocials] = useState([]);
  
  // Состояния для бейджей
  const [userAchievements, setUserAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [updatingActiveBadge, setUpdatingActiveBadge] = useState(false);
  
  // Состояние для Element аккаунта
  const [elementConnected, setElementConnected] = useState(false);
  const [elementLinking, setElementLinking] = useState(false);
  const [elementToken, setElementToken] = useState('');
  const [loadingElementStatus, setLoadingElementStatus] = useState(false);
  
  // Состояния для диалога добавления социальной сети
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialLink, setNewSocialLink] = useState('');
  
  // Состояния для настроек цветов
  const [settings, setSettings] = useState({
    background_color: '#131313',
    container_color: '#1c1c1c',
    welcome_bubble_color: '#131313',
    avatar_border_color: '#D0BCFF',
    button_primary_color: '#ffffff00',
    button_primary_border_color: '#ffffff00',
    button_edit_color: '#ffffff00',
    button_edit_border_color: '#ff9800',
    info_bubble_color: '#242526',
    info_bubble_border_color: '#cccccc',
    popup_alert_color: 'rgba(0, 0, 0, 0.8)',
    header_color: '#1c1c1c',
    bottom_nav_color: '#1c1c1c',
    content_color: '#1c1c1c',
  });
  
  // Состояние для уведомлений
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Add notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushNotificationsEnabled: true,
    telegramNotificationsEnabled: false,
    telegramConnected: false
  });
  const [loadingNotificationPrefs, setLoadingNotificationPrefs] = useState(false);
  const [savingNotificationPrefs, setSavingNotificationPrefs] = useState(false);
  const [pushNotificationSupported, setPushNotificationSupported] = useState(false);
  const [pushSubscriptionStatus, setPushSubscriptionStatus] = useState(false);
  
  // Add new state variables for push notifications
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState('default');
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  
  // Состояния для работы с Telegram ID
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [telegramIdInput, setTelegramIdInput] = useState('');
  const [telegramIdError, setTelegramIdError] = useState('');
  const [savingTelegramId, setSavingTelegramId] = useState(false);
  
  // Состояние для отслеживания режима Telegram WebApp
  const [telegramWebAppMode, setTelegramWebAppMode] = useState(
    localStorage.getItem('telegramWebAppMode') === 'true'
  );
  
  // UseEffect для загрузки данных профиля
  useEffect(() => {
    fetchProfileData();
    // Также загружаем бейджи при загрузке страницы
    fetchUserAchievements();
    // Не нужно проверять статус Element, так как это теперь делается в fetchProfileData
    
    // Добавляем слушатель события storage для обновления статуса Element
    // когда пользователь возвращается после авторизации Element
    const handleStorageChange = (e) => {
      if (e.key === 'elem_connected' && e.newValue === 'true') {
        checkElementStatus();
        localStorage.removeItem('elem_connected'); // Очищаем флаг
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Дополнительный эффект для проверки статуса Element при возвращении на страницу
  useEffect(() => {
    const checkElementOnFocus = () => {
      checkElementStatus();
    };
    
    window.addEventListener('focus', checkElementOnFocus);
    
    return () => {
      window.removeEventListener('focus', checkElementOnFocus);
    };
  }, []);
  
  // Загрузка данных пользователя
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Загружаем профиль
      const profileData = await ProfileService.getProfile(user.username);
      if (profileData && profileData.user) {
        setName(profileData.user.name || '');
        setUsername(profileData.user.username || '');
        setAbout(profileData.user.about || '');
        setAvatarPreview(profileData.user.avatar_url || '');
        setBannerPreview(profileData.user.banner_url || '');
        setSocials(profileData.socials || []);
        
        // Проверяем подключен ли Element аккаунт через новые поля API
        if (profileData.user.element_connected !== undefined) {
          setElementConnected(profileData.user.element_connected);
        } else {
          // Для обратной совместимости
          setElementConnected(!!profileData.user.elem_id);
        }
      }
      
      // Загружаем настройки
      const settingsData = await ProfileService.getSettings();
      if (settingsData && settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      showNotification('error', 'Не удалось загрузить данные пользователя');
      setLoading(false);
    }
  };
  
  // Загрузка достижений пользователя
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
  
  // Установка активного бейджа
  const handleSetActiveBadge = async (achievementId) => {
    try {
      setUpdatingActiveBadge(true);
      const response = await axios.post('/api/profile/achievements/active', {
        achievement_id: achievementId
      });
      
      if (response.data && response.data.success) {
        // Обновляем список достижений
        fetchUserAchievements();
        showNotification('success', 'Активный бейдж обновлен');
      }
      
      setUpdatingActiveBadge(false);
    } catch (error) {
      console.error('Ошибка обновления активного бейджа:', error);
      showNotification('error', 'Не удалось обновить активный бейдж');
      setUpdatingActiveBadge(false);
    }
  };
  
  // Проверка поддержки push-уведомлений и загрузка настроек уведомлений
  useEffect(() => {
    if (!user) return;
    
    // Проверяем поддержку push-уведомлений в браузере
    const checkPushSupport = () => {
      const isSupported = 
        'serviceWorker' in navigator && 
        'PushManager' in window &&
        'Notification' in window;
      
      setPushNotificationSupported(isSupported);
      
      // По умолчанию считаем, что подписка не активирована
      setPushSubscriptionStatus(false);
      
      // Только если поддерживается и скрипт загружен, проверяем статус
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
    
    // Загружаем настройки уведомлений
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
  
  // Fix for the checkPushSupport useEffect
  useEffect(() => {
    if (user) {
      // Update the checkPushSupport function here instead of the separate one
      const checkNotificationSupport = async () => {
        try {
          const isSupported = await NotificationService.isPushNotificationSupported();
          setPushSupported(isSupported);
          
          if (isSupported) {
            const permission = await NotificationService.getNotificationPermissionStatus();
            setPushPermission(permission);
            
            // Check if service worker is being disabled by anti-caching code
            const antiCachingActive = window.setupCaching && 
                                      typeof window.setupCaching === 'function';
            
            if (antiCachingActive) {
              console.warn('Anti-caching system may interfere with push notifications');
            }
            
            // Try to get service worker registrations
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
  
  // Add a function to handle enabling push notifications
  const handleEnablePushNotifications = async () => {
    try {
      setPushLoading(true);
      console.log('Starting push notification setup...');
      
      // Check if push notifications are supported
      const isSupported = await NotificationService.isPushNotificationSupported();
      console.log('Push notifications supported:', isSupported);
      
      if (!isSupported) {
        showNotification('error', 'Push-уведомления не поддерживаются вашим браузером');
        setPushLoading(false);
        return;
      }
      
      // Check if permission is already granted
      const permission = await NotificationService.getNotificationPermissionStatus();
      console.log('Current permission status:', permission);
      
      if (permission === 'denied') {
        showNotification('error', 'Разрешение на уведомления заблокировано. Пожалуйста, измените настройки в браузере.');
        setPushLoading(false);
        return;
      }
      
      try {
        // Subscribe to push notifications
        console.log('Subscribing to push notifications...');
        await NotificationService.subscribeToPushNotifications();
        setPushSubscribed(true);
        
        // Also update user preferences on server
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
        
        // Send a test notification
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
  
  // Add a function to handle disabling push notifications
  const handleDisablePushNotifications = async () => {
    try {
      setPushLoading(true);
      
      const success = await NotificationService.unsubscribeFromPushNotifications();
      
      // Update server preferences regardless of unsubscribe result
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
  
  // Обработчик смены вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Обработчик изменения аватара
  const handleAvatarChange = (file) => {
    if (!file) return;
    
    setAvatarFile(file);
    
    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Обработчик изменения баннера
  const handleBannerChange = (file) => {
    if (!file) return;
    
    setBannerFile(file);
    
    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Обработчик сохранения профиля
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      console.log('Starting profile save...');
      
      let hasErrors = false;
      let responses = [];
      
      // Сохраняем имя пользователя
      if (name !== user.name) {
        try {
          console.log('Updating name...');
          const response = await ProfileService.updateName(name);
          console.log('Name update response:', response);
          responses.push({ type: 'name', success: response.success, message: response.message });
          if (!response.success) hasErrors = true;
        } catch (error) {
          console.error('Error updating name:', error);
          responses.push({ type: 'name', success: false, message: error.response?.data?.error || 'Ошибка обновления имени' });
          hasErrors = true;
        }
      }
      
      // Сохраняем username
      if (username !== user.username) {
        try {
          console.log('Updating username...');
          const response = await ProfileService.updateUsername(username);
          console.log('Username update response:', response);
          responses.push({ type: 'username', success: response.success, message: response.message });
          if (!response.success) hasErrors = true;
        } catch (error) {
          console.error('Error updating username:', error);
          responses.push({ type: 'username', success: false, message: error.response?.data?.error || 'Ошибка обновления username' });
          hasErrors = true;
        }
      }
      
      // Сохраняем описание
      if (about !== user.about) {
        try {
          console.log('Updating about...');
          const response = await ProfileService.updateAbout(about);
          console.log('About update response:', response);
          responses.push({ type: 'about', success: response.success, message: response.message });
          if (!response.success) hasErrors = true;
        } catch (error) {
          console.error('Error updating about:', error);
          responses.push({ type: 'about', success: false, message: error.response?.data?.error || 'Ошибка обновления описания' });
          hasErrors = true;
        }
      }
      
      // Загружаем баннер
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
          
          console.log('Banner upload response:', response);
          responses.push({ type: 'banner', success: response.data.success, message: response.data.message });
          if (!response.data.success) hasErrors = true;
        } catch (error) {
          console.error('Error uploading banner:', error);
          responses.push({ type: 'banner', success: false, message: error.response?.data?.error || 'Ошибка загрузки баннера' });
          hasErrors = true;
        }
      }
      
      // Загружаем аватар
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
          
          console.log('Avatar upload response:', response);
          responses.push({ type: 'avatar', success: response.data.success, message: response.data.message });
          if (!response.data.success) hasErrors = true;
        } catch (error) {
          console.error('Error uploading avatar:', error);
          responses.push({ type: 'avatar', success: false, message: error.response?.data?.error || 'Ошибка загрузки аватара' });
          hasErrors = true;
        }
      }
      
      // Обновляем данные пользователя в контексте, если есть
      if (updateUserData) {
        updateUserData({
          ...user,
          name,
          username,
          about
        });
      }
      
      // Отображаем общий результат
      if (hasErrors) {
        // Если были ошибки, показываем ошибку с деталями
        let errorMessage = 'Некоторые изменения не удалось сохранить: ';
        const failedOperations = responses.filter(r => !r.success).map(r => r.type);
        errorMessage += failedOperations.join(', ');
        console.error('Save errors:', failedOperations);
        showNotification('error', errorMessage);
      } else {
        // Если не было ошибок, показываем успех
        console.log('All operations successful');
        showNotification('success', 'Профиль успешно сохранен');
        // Редиректим на страницу профиля
        navigate(`/profile/${username}`);
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('error', 'Произошла ошибка при сохранении профиля');
      setSaving(false);
    }
  };
  
  // Обработчик сохранения настроек цветов
  const handleSaveSettings = async () => {
    setSaving(true);
    setSuccess(false);
    
    try {
      // Получаем текущие настройки для отправки
      const settingsToSave = {
        background_color: settings.background_color,
        container_color: settings.container_color,
        welcome_bubble_color: settings.welcome_bubble_color,
        avatar_border_color: settings.avatar_border_color,
        info_bubble_color: settings.info_bubble_color,
        info_bubble_border_color: settings.info_bubble_border_color,
        // Добавляем новые настройки для сохранения
        header_color: settings.header_color || settings.container_color,
        bottom_nav_color: settings.bottom_nav_color || settings.container_color,
        content_color: settings.content_color || settings.container_color,
        // Другие настройки...
      };
      
      // Отправляем обновленные настройки на сервер
      const response = await ProfileService.updateSettings(settingsToSave);
      
      if (response && response.success) {
        setSuccess(true);
        
        // Применяем новые настройки к глобальному контексту темы
        themeSettings.updateThemeSettings({
          backgroundColor: response.settings.background_color,
          paperColor: response.settings.container_color,
          headerColor: response.settings.header_color || response.settings.container_color,
          bottomNavColor: response.settings.bottom_nav_color || response.settings.container_color,
          contentColor: response.settings.content_color || response.settings.container_color,
          primaryColor: response.settings.avatar_border_color
        });
      }
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
    } finally {
      setSaving(false);
      
      // Таймер для сброса статуса успеха
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };
  
  // Обработчик изменения цвета в настройках
  const handleColorChange = (colorType, color) => {
    // Обновляем настройки
    const updatedSettings = {
      ...settings,
      [colorType]: color
    };
    setSettings(updatedSettings);

    // Применяем цвет к CSS переменным для мгновенного эффекта
    document.documentElement.style.setProperty(`--${colorType.replace(/_/g, '-')}`, color);

    // Обновляем настройки в глобальном контексте темы
    if (colorType === 'background_color') {
      updateThemeSettings({ backgroundColor: color });
    } else if (colorType === 'container_color') {
      updateThemeSettings({ paperColor: color });
    } else if (colorType === 'header_color') {
      updateThemeSettings({ headerColor: color });
      // Принудительно обновляем стиль заголовка для мгновенного эффекта
      document.querySelectorAll('.MuiAppBar-root').forEach(el => {
        el.style.backgroundColor = color;
        el.style.color = getContrastTextColor(color);
      });
    } else if (colorType === 'bottom_nav_color') {
      updateThemeSettings({ bottomNavColor: color });
      // Принудительно обновляем стиль нижней навигации для мгновенного эффекта
      document.querySelectorAll('.MuiBottomNavigation-root').forEach(el => {
        el.style.backgroundColor = color;
      });
      document.querySelectorAll('.MuiBottomNavigationAction-root').forEach(el => {
        el.style.color = getContrastTextColor(color);
      });
    } else if (colorType === 'content_color') {
      updateThemeSettings({ contentColor: color });
      // Принудительно обновляем стиль контентных блоков для мгновенного эффекта
      document.querySelectorAll('.MuiCard-root').forEach(el => {
        el.style.backgroundColor = color;
        el.style.color = getContrastTextColor(color);
      });
    } else if (colorType === 'welcome_bubble_color') {
      updateThemeSettings({ welcomeBubbleColor: color });
    } else if (colorType === 'avatar_border_color') {
      updateThemeSettings({ primaryColor: color });
      // Обновляем primary цвета
      document.documentElement.style.setProperty('--primary', color);
      document.documentElement.style.setProperty('--primary-light', color);
      document.documentElement.style.setProperty('--primary-dark', color);
      
      // Обновляем рамки аватаров
      document.querySelectorAll('.MuiAvatar-root').forEach(el => {
        el.style.borderColor = color;
      });
    } else if (colorType === 'button_primary_color') {
      updateThemeSettings({ buttonPrimaryColor: color });
    } else if (colorType === 'button_primary_border_color') {
      updateThemeSettings({ buttonPrimaryBorderColor: color });
    } else if (colorType === 'button_edit_color') {
      updateThemeSettings({ buttonEditColor: color });
    } else if (colorType === 'button_edit_border_color') {
      updateThemeSettings({ buttonEditBorderColor: color });
    } else if (colorType === 'info_bubble_color') {
      updateThemeSettings({ infoBubbleColor: color });
    } else if (colorType === 'info_bubble_border_color') {
      updateThemeSettings({ infoBubbleBorderColor: color });
    } else if (colorType === 'popup_alert_color') {
      updateThemeSettings({ popupAlertColor: color });
    }
    
    // Автоматически сохраняем изменения с небольшой задержкой для предотвращения частых запросов
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    setAutoSaveTimeout(setTimeout(() => {
      handleSaveSettings();
    }, 500));
  };

  // Функция для получения контрастного цвета текста
  const getContrastTextColor = (hexColor) => {
    // Remove the # if present
    const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Calculate relative luminance (per WCAG 2.0)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark ones
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };
  
  // Обработчик добавления социальной сети
  const handleAddSocial = async () => {
    if (!newSocialName || !newSocialLink) return;
    
    try {
      setSaving(true);
      
      const response = await ProfileService.updateSocial(newSocialName, newSocialLink);
      
      if (response.success) {
        setSocials([...socials, { name: newSocialName, link: newSocialLink }]);
        setNewSocialName('');
        setNewSocialLink('');
        setSocialDialogOpen(false);
        showNotification('success', 'Социальная сеть добавлена');
      } else {
        throw new Error(response.error || 'Failed to add social network');
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Ошибка добавления социальной сети:', error);
      showNotification('error', 'Ошибка добавления социальной сети');
      setSaving(false);
    }
  };
  
  // Обработчик удаления социальной сети
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
  
  // Обработчик для отображения уведомлений
  const showNotification = (severity, message) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Закрытие уведомления
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Функция для применения предустановленной темы
  const applyTheme = async (theme) => {
    try {
      setSaving(true);
      let newSettings = {...settings};
      
      if (theme === 'dark') {
        newSettings = {
          ...newSettings,
          background_color: '#131313',
          container_color: '#1c1c1c',
          welcome_bubble_color: '#131313',
          avatar_border_color: '#D0BCFF',
          info_bubble_color: '#242526',
        };
      } else if (theme === 'light') {
        newSettings = {
          ...newSettings,
          background_color: '#f5f5f5',
          container_color: '#ffffff',
          welcome_bubble_color: '#f0f0f0',
          avatar_border_color: '#8c52ff',
          info_bubble_color: '#e0e0e0',
        };
      } else if (theme === 'contrast') {
        newSettings = {
          ...newSettings,
          background_color: '#111111',
          container_color: '#1c1c1c',
          welcome_bubble_color: '#131313',
          avatar_border_color: '#ff9800',
          info_bubble_color: '#242526',
        };
      }
      
      // Обновляем состояние
      setSettings(newSettings);
      
      // Update theme context
      updateThemeSettings({
        backgroundColor: newSettings.background_color,
        paperColor: newSettings.container_color,
      });
      
      // Сохраняем настройки на сервере
      const response = await ProfileService.updateSettings(newSettings);
      
      if (response.success) {
        setSuccess(true);
        showNotification('success', `Тема "${theme}" применена`);
      } else {
        throw new Error('Failed to apply theme');
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Ошибка применения темы:', error);
      showNotification('error', 'Ошибка применения темы');
      setSaving(false);
    }
  };
  
  // Обработчик переключения push-уведомлений
  const handleTogglePushNotifications = async () => {
    try {
      setSavingNotificationPrefs(true);
      
      // Если push уведомления не поддерживаются, просто возвращаемся
      if (!pushNotificationSupported) {
        console.error('Push-уведомления не поддерживаются в этом браузере');
        showNotification('error', 'Ваш браузер не поддерживает push-уведомления');
        setSavingNotificationPrefs(false);
        return;
      }
      
      const newPushEnabled = !notificationPrefs.pushNotificationsEnabled;
      console.log('Переключение push-уведомлений на:', newPushEnabled);
      
      try {
        if (newPushEnabled) {
          // Если включаем уведомления, подписываемся
          if (window.PushNotifications) {
            console.log('Инициализация push-уведомлений...');
            const success = await window.PushNotifications.initialize();
            if (!success) {
              console.error('Не удалось инициализировать push-уведомления');
              showNotification('error', 'Не удалось включить push-уведомления. Возможно, вы отклонили разрешение.');
              setSavingNotificationPrefs(false);
              return;
            }
            console.log('Push-уведомления успешно инициализированы');
            setPushSubscriptionStatus(true);
          } else {
            console.error('window.PushNotifications не найден');
            showNotification('error', 'Модуль push-уведомлений не загружен');
            setSavingNotificationPrefs(false);
            return;
          }
        } else {
          // Если выключаем уведомления, отписываемся
          if (window.PushNotifications && pushSubscriptionStatus) {
            console.log('Отписка от push-уведомлений...');
            const registration = await navigator.serviceWorker.ready;
            const success = await window.PushNotifications.unsubscribe(registration);
            if (success) {
              console.log('Успешная отписка от push-уведомлений');
              setPushSubscriptionStatus(false);
            } else {
              console.error('Не удалось отписаться от push-уведомлений');
            }
          }
        }
        
        // Сохраняем настройки на сервере
        console.log('Отправка настроек на сервер...');
        const response = await axios.post('/api/notifications/preferences', {
          push_notifications_enabled: newPushEnabled,
          telegram_notifications_enabled: notificationPrefs.telegramNotificationsEnabled
        });
        
        console.log('Ответ сервера при изменении настроек push-уведомлений:', response.data);
        
        if (response.data && response.data.success) {
          setNotificationPrefs({
            ...notificationPrefs,
            pushNotificationsEnabled: newPushEnabled
          });
          
          showNotification('success', newPushEnabled ? 
            'Push-уведомления включены' : 
            'Push-уведомления отключены');
        } else {
          throw new Error(response.data?.error || response.data?.message || 'Ошибка сохранения настроек');
        }
      } catch (apiError) {
        console.error('Ошибка API при переключении push-уведомлений:', apiError);
        showNotification('error', apiError.message || 'Не удалось изменить настройки push-уведомлений');
      }
      
      setSavingNotificationPrefs(false);
    } catch (error) {
      console.error('Ошибка при переключении push-уведомлений:', error);
      showNotification('error', error.message || 'Не удалось изменить настройки push-уведомлений');
      setSavingNotificationPrefs(false);
    }
  };
  
  // Обработчик переключения Telegram-уведомлений
  const handleToggleTelegramNotifications = async () => {
    try {
      setSavingNotificationPrefs(true);
      
      // Проверяем, есть ли telegram_id
      if (!notificationPrefs.telegramConnected) {
        console.error('Telegram не подключен, невозможно включить Telegram-уведомления');
        showNotification('warning', 'Для получения уведомлений сначала подключите Telegram в профиле');
        setSavingNotificationPrefs(false);
        return;
      }
      
      const newTelegramEnabled = !notificationPrefs.telegramNotificationsEnabled;
      console.log('Переключение Telegram уведомлений на:', newTelegramEnabled);
      
      try {
        // Сохраняем настройки на сервере
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
  
  // Обработчик сохранения Telegram ID
  const handleSaveTelegramId = async () => {
    try {
      // Сброс ошибок
      setTelegramIdError('');
      setSavingTelegramId(true);
      
      // Валидация
      if (!telegramIdInput.trim()) {
        setTelegramIdError('Telegram ID не может быть пустым');
        setSavingTelegramId(false);
        return;
      }
      
      // Проверяем, что введено число
      if (!/^\d+$/.test(telegramIdInput.trim())) {
        setTelegramIdError('Telegram ID должен быть числом');
        setSavingTelegramId(false);
        return;
      }
      
      // Отправляем запрос на сервер
      const response = await axios.post('/api/profile/telegram-connect', {
        telegram_id: telegramIdInput.trim()
      });
      
      if (response.data && response.data.success) {
        // Обновляем состояние приложения
        setNotificationPrefs({
          ...notificationPrefs,
          telegramConnected: true
        });
        
        // Показываем уведомление об успехе
        showNotification('success', 'Telegram аккаунт успешно привязан');
        
        // Закрываем диалог
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
  
  // Загрузка статуса подключения Element
  const checkElementStatus = async () => {
    try {
      // Если у нас уже есть данные из fetchProfileData, не делаем запрос
      if (!loadingElementStatus && elementConnected !== null) {
        return elementConnected;
      }
      
      setLoadingElementStatus(true);
      const response = await axios.get('/api/profile/element/status');
      
      const isConnected = response.data && response.data.connected;
      if (isConnected) {
        setElementConnected(true);
      } else {
        setElementConnected(false);
      }
      setLoadingElementStatus(false);
      return isConnected;
    } catch (error) {
      console.error('Ошибка при проверке статуса Element:', error);
      setElementConnected(false);
      setLoadingElementStatus(false);
      return false;
    }
  };
  
  // Генерация временного токена для привязки Element
  const generateElementToken = async () => {
    try {
      setElementLinking(true);
      
      // Генерируем случайный токен для идентификации сессии
      const randomToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
      
      setElementToken(randomToken);
      showNotification('info', 'Перейдите по ссылке, чтобы привязать Element аккаунт');
      
    } catch (error) {
      console.error('Ошибка при генерации токена Element:', error);
      showNotification('error', 'Не удалось сгенерировать токен для Element');
      setElementLinking(false);
    }
  };
  
  // Обработчик для привязки Element
  const handleLinkElement = () => {
    generateElementToken();
    
    // Устанавливаем слушатель для проверки статуса при возвращении с Auth Element страницы
    const checkInterval = setInterval(() => {
      checkElementStatus().then(isConnected => {
        if (isConnected) {
          // Если успешно подключили Element, очищаем интервал и состояние привязки
          clearInterval(checkInterval);
          setElementLinking(false);
          setElementToken('');
          showNotification('success', 'Element аккаунт успешно подключен!');
        }
      });
    }, 2000); // Проверяем каждые 2 секунды
    
    // Устанавливаем локальное хранилище, чтобы другие вкладки могли узнать о подключении
    localStorage.setItem('element_auth_pending', 'true');
    
    // Очищаем интервал через 2 минуты, если пользователь не завершил процесс
    setTimeout(() => {
      clearInterval(checkInterval);
      localStorage.removeItem('element_auth_pending');
    }, 120000);
  };
  
  // Отмена привязки Element
  const handleCancelElementLinking = () => {
    setElementToken('');
    setElementLinking(false);
    // Очищаем признак ожидания авторизации
    localStorage.removeItem('element_auth_pending');
  };
  
  // Add a function to handle removing the active badge
  const handleClearActiveBadge = async () => {
    try {
      setUpdatingActiveBadge(true);
      const response = await axios.post('/api/profile/achievements/clear');
      
      if (response.data && response.data.success) {
        fetchUserAchievements();
        showNotification('success', 'Активный бейдж удален');
      }
      setUpdatingActiveBadge(false);
    } catch (error) {
      showNotification('error', 'Не удалось удалить активный бейдж');
      setUpdatingActiveBadge(false);
    }
  };
  
  // Обработчик изменения режима Telegram WebApp
  const handleToggleTelegramWebAppMode = () => {
    const newMode = !telegramWebAppMode;
    setTelegramWebAppMode(newMode);
    
    // Сохраняем в localStorage
    localStorage.setItem('telegramWebAppMode', newMode.toString());
    
    // Перезагружаем страницу для применения изменений
    window.location.reload();
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
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
          <StyledTab icon={<NotificationsIcon />} label="Уведомления" />
          <StyledTab icon={<EmojiEventsIcon />} label="Бейджи" />
          <StyledTab icon={<AlternateEmailIcon />} label="Юзернеймы" />
        </StyledTabs>
        
        {/* Раздел профиля */}
        {activeTab === 0 && (
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
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {/* Аватар */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                      <ProfileImageContainer>
                        <Avatar
                          src={avatarPreview}
                          alt={name}
                          sx={{ 
                            width: 120, 
                            height: 120, 
                            border: `4px solid ${settings.avatar_border_color || theme.palette.primary.main}`,
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                          }}
                        />
                        <EditOverlay className="edit-overlay">
                          <label htmlFor="avatar-input">
                            <IconButton component="span" sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>
                              <PhotoCameraIcon />
                            </IconButton>
                          </label>
                          <FileInput
                            id="avatar-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAvatarChange(e.target.files[0])}
                          />
                        </EditOverlay>
                      </ProfileImageContainer>
                      
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Нажмите на аватар, чтобы изменить
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    {/* Баннер */}
                    <BannerContainer>
                      <Box 
                        component="img"
                        src={bannerPreview}
                        alt="Banner"
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/800x200?text=Banner';
                        }}
                      />
                      <BannerOverlay className="edit-overlay">
                        <label htmlFor="banner-input">
                          <IconButton component="span" sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>
                            <PhotoCameraIcon />
                          </IconButton>
                        </label>
                        <FileInput
                          id="banner-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBannerChange(e.target.files[0])}
                        />
                      </BannerOverlay>
                    </BannerContainer>
                    
                    <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                      Нажмите на баннер, чтобы изменить
                    </Typography>
                  </Grid>
                </Grid>
                
                <Grid container spacing={3} mt={2}>
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
                      helperText={`${about?.length || 0}/500 символов`}
                      inputProps={{ maxLength: 500 }}
                      FormHelperTextProps={{ sx: { ml: 0 } }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
                
                <List sx={{ bgcolor: alpha(theme.palette.background.default, 0.3), borderRadius: 2, mb: 3 }}>
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
                
                {/* Диалог добавления социальной сети */}
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
                        <MenuItem value="Element">Element</MenuItem>
                        <MenuItem value="Aumbent">Aumbent</MenuItem>
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
          </Box>
        )}
        
        {/* Раздел настроек внешнего вида */}
        {activeTab === 1 && (
          <Box component={motion.div} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsCard>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <PaletteIcon />
                  Цветовая схема
                </SectionTitle>
                
                <Grid container spacing={4}>

                  
                  {/* Настройки цветов */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Настройка цветов интерфейса
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Основные цвета
                      </Typography>
                      <ColorPicker 
                        label="Цвет фона" 
                        color={settings.background_color} 
                        onChange={(color) => handleColorChange('background_color', color)} 
                      />
                      
                      <ColorPicker 
                        label="Цвет контейнеров" 
                        color={settings.container_color} 
                        onChange={(color) => handleColorChange('container_color', color)} 
                      />
                      
                      <ColorPicker 
                        label="Цвет блоков" 
                        color={settings.welcome_bubble_color} 
                        onChange={(color) => handleColorChange('welcome_bubble_color', color)} 
                      />
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Элементы интерфейса
                      </Typography>
                      <ColorPicker 
                        label="Цвет заголовка (Header)" 
                        color={settings.header_color || settings.container_color} 
                        onChange={(color) => handleColorChange('header_color', color)} 
                      />
                      
                      <ColorPicker 
                        label="Цвет нижней навигации" 
                        color={settings.bottom_nav_color || settings.container_color} 
                        onChange={(color) => handleColorChange('bottom_nav_color', color)} 
                      />
                      
                      <ColorPicker 
                        label="Цвет контентных блоков" 
                        color={settings.content_color || settings.container_color} 
                        onChange={(color) => handleColorChange('content_color', color)} 
                      />
                      
                      <ColorPicker 
                        label="Цвет рамки аватара" 
                        color={settings.avatar_border_color} 
                        onChange={(color) => handleColorChange('avatar_border_color', color)} 
                      />
                      
                      <ColorPicker 
                        label="Цвет информационных блоков" 
                        color={settings.info_bubble_color} 
                        onChange={(color) => handleColorChange('info_bubble_color', color)} 
                      />
                      
                      <ColorPicker 
                        label="Цвет рамки блоков" 
                        color={settings.info_bubble_border_color} 
                        onChange={(color) => handleColorChange('info_bubble_border_color', color)} 
                      />
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Дополнительные настройки
                      </Typography>
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={telegramWebAppMode}
                            onChange={handleToggleTelegramWebAppMode}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1">Режим Telegram Mini App</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Добавляет отступ сверху для кнопок меню Telegram
                            </Typography>
                          </Box>
                        }
                        sx={{ 
                          mb: 2, 
                          display: 'flex',
                          '.MuiFormControlLabel-label': {
                            width: '100%'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ 
                  mt: 4, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography 
                    variant="body2" 
                    color={success ? "success.main" : "text.secondary"} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    {success && <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />}
                    {success ? 'Настройки сохранены' : 'Настройки сохраняются автоматически'}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSaveSettings}
                    disabled={saving}
                    sx={{ borderRadius: '12px', py: 1 }}
                  >
                    {saving ? 'Сохранение...' : 'Применить настройки'}
                  </Button>
                </Box>
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        {/* Вкладка настроек уведомлений */}
        {activeTab === 2 && (
          <Box component={motion.div} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle variant="h5">
              <NotificationsActiveIcon />
              Настройки уведомлений
            </SectionTitle>

            
            
            {/* New Push Notifications Card */}
            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <NotificationsIcon />
                  Уведомления
                </SectionTitle>
                
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Настройте способы получения уведомлений о новых событиях
                </Typography>
                
                {!pushSupported ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Ваш браузер не поддерживает push-уведомления
                  </Alert>
                ) : (
                  <>
                    {pushPermission === 'denied' && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Вы заблокировали разрешение на отправку уведомлений. Пожалуйста, разрешите уведомления в настройках браузера.
                      </Alert>
                    )}
                    
                    {/* Add warning about service worker being disabled */}
                    {window.setupCaching && typeof window.setupCaching === 'function' && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Система защиты от кэширования может помешать работе push-уведомлений. Если у вас возникли проблемы с получением уведомлений, обратитесь к администратору.
                      </Alert>
                    )}
                    
                    {/* Push Notifications */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      mb: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.4),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {pushSubscribed ? (
                          <NotificationsActiveIcon color="success" sx={{ mr: 2 }} />
                        ) : (
                          <NotificationsOffIcon color="action" sx={{ mr: 2 }} />
                        )}
                        <Box>
                          <Typography variant="subtitle1">
                            {pushSubscribed ? 'Push-уведомления включены' : 'Push-уведомления отключены'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pushSubscribed 
                              ? 'Вы будете получать уведомления о новых событиях' 
                              : 'Включите, чтобы получать уведомления в реальном времени'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button
                        variant={pushSubscribed ? "outlined" : "contained"}
                        color={pushSubscribed ? "error" : "primary"}
                        onClick={pushSubscribed ? handleDisablePushNotifications : handleEnablePushNotifications}
                        disabled={pushLoading || pushPermission === 'denied'}
                        startIcon={pushSubscribed ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
                        sx={{ borderRadius: '10px', textTransform: 'none' }}
                      >
                        {pushLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          pushSubscribed ? '' : ''
                        )}
                      </Button>
                    </Box>
                    
                    {/* Telegram Notifications */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.4),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {notificationPrefs.telegramNotificationsEnabled ? (
                          <TelegramIcon color="success" sx={{ mr: 2 }} />
                        ) : (
                          <TelegramIcon color="action" sx={{ mr: 2 }} />
                        )}
                        <Box>
                          <Typography variant="subtitle1">
                            {notificationPrefs.telegramNotificationsEnabled ? 'Telegram-уведомления включены' : 'Telegram-уведомления отключены'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notificationPrefs.telegramConnected 
                              ? (notificationPrefs.telegramNotificationsEnabled 
                                ? 'Вы будете получать уведомления в Telegram' 
                                : 'Включите, чтобы получать уведомления в Telegram')
                              : 'Подключите Telegram в разделе Связанные аккаунты'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button
                        variant={notificationPrefs.telegramNotificationsEnabled ? "outlined" : "contained"}
                        color={notificationPrefs.telegramNotificationsEnabled ? "error" : "primary"}
                        onClick={handleToggleTelegramNotifications}
                        disabled={savingNotificationPrefs || !notificationPrefs.telegramConnected}
                        startIcon={notificationPrefs.telegramNotificationsEnabled ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
                        sx={{ borderRadius: '10px', textTransform: 'none' }}
                      >
                        {savingNotificationPrefs ? (
                          <CircularProgress size={24} />
                        ) : (
                          notificationPrefs.telegramNotificationsEnabled ? '' : ''
                        )}
                      </Button>
                    </Box>
                    
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.disabled', textAlign: 'center' }}>
                      Push-уведомления работают даже когда браузер закрыт
                    </Typography>
                  </>
                )}
              </SettingsCardContent>
            </SettingsCard>
            
            {/* Связанные аккаунты Card */}
            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <LinkIcon />
                  Связанные аккаунты
                </SectionTitle>
                
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Подключите внешние аккаунты для расширенных возможностей
                </Typography>
                
                {/* Element Account */}
                <Box sx={{ 
                  p: 2, 
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.4),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          bgcolor: elementConnected ? 'success.light' : 'action.disabledBackground'
                        }}
                      >
                        <ElementIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">Element</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {loadingElementStatus ? (
                            <>
                              <CircularProgress size={12} sx={{ mr: 1, verticalAlign: 'middle' }} />
                              Проверка статуса...
                            </>
                          ) : elementConnected ? (
                            <>
                              <CheckIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle', color: 'success.main' }} />
                              Аккаунт Element подключен
                            </>
                          ) : (
                            "Аккаунт Element не подключен"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {!elementLinking ? (
                      <Button
                        variant={elementConnected ? "outlined" : "contained"}
                        color={elementConnected ? "error" : "primary"}
                        startIcon={elementConnected ? <LinkOffIcon /> : <LinkIcon />}
                        onClick={handleLinkElement}
                        disabled={loadingElementStatus}
                        sx={{ borderRadius: '10px', textTransform: 'none' }}
                      >
                        {elementConnected ? "Отключить" : "Подключить"}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancelElementLinking}
                        sx={{ borderRadius: '10px', textTransform: 'none' }}
                      >
                        Отменить
                      </Button>
                    )}
                  </Box>
                  
                  {elementLinking && elementToken && (
                    <Box sx={{ mt: 3, p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Инструкция для подключения Element:
                      </Typography>
                      <ol>
                        <li>
                          <Typography variant="body2" paragraph>
                            Перейдите по ссылке ниже чтобы подключить ваш аккаунт Element.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            После успешной авторизации вы будете перенаправлены обратно.
                          </Typography>
                        </li>
                      </ol>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Link 
                          href={`https://elemsocial.com/connect_app/0195a00f-826a-7a34-85f1-45065c8c727d`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="contained"
                          component={Button}
                          color="primary"
                          sx={{ borderRadius: '12px', py: 1, px: 3 }}
                        >
                          Подключить Element
                        </Link>
                      </Box>
                    </Box>
                  )}
                </Box>
                
                {/* Telegram Account - можно добавить в будущем */}
                <Box sx={{ 
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.4),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          bgcolor: notificationPrefs.telegramConnected ? 'success.light' : 'action.disabledBackground'
                        }}
                      >
                        <TelegramIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">Telegram</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {notificationPrefs.telegramConnected ? (
                            <>
                              <CheckIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle', color: 'success.main' }} />
                              Telegram подключен
                            </>
                          ) : (
                            "Telegram не подключен"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant={notificationPrefs.telegramConnected ? "outlined" : "contained"}
                      color={notificationPrefs.telegramConnected ? "error" : "primary"}
                      startIcon={notificationPrefs.telegramConnected ? <LinkOffIcon /> : <LinkIcon />}
                      sx={{ borderRadius: '10px', textTransform: 'none' }}
                      onClick={() => {
                        // Если Telegram уже подключен, предлагаем отключить
                        if (notificationPrefs.telegramConnected) {
                          // Здесь можно добавить диалог подтверждения отключения
                          axios.post('/api/profile/telegram-disconnect')
                            .then(response => {
                              if (response.data && response.data.success) {
                                setNotificationPrefs({
                                  ...notificationPrefs,
                                  telegramConnected: false,
                                  telegramNotificationsEnabled: false
                                });
                                showNotification('success', 'Telegram аккаунт отключен');
                              }
                            })
                            .catch(error => {
                              console.error('Ошибка при отключении Telegram:', error);
                              showNotification('error', 'Не удалось отключить Telegram аккаунт');
                            });
                        } else {
                          // Если не подключен, открываем диалог для ввода ID
                          setTelegramDialogOpen(true);
                        }
                      }}
                    >
                      {notificationPrefs.telegramConnected ? "Отключить" : "Подключить"}
                    </Button>
                  </Box>
                </Box>
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        {/* Вкладка бейджей */}
        {activeTab === 3 && (
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
                
                {loadingAchievements ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : userAchievements.length > 0 ? (
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        Ваши достижения
                      </Typography>
                      {userAchievements.some(achievement => achievement.is_active) && (
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
                      )}
                    </Box>
                    
                    <Grid container spacing={2}>
                      {userAchievements.map((achievement) => (
                        <Grid item xs={6} sm={4} md={3} key={achievement.id}>
                          <Card 
                            elevation={achievement.is_active ? 4 : 1}
                            sx={{ 
                              position: 'relative',
                              height: '100%',
                              borderRadius: 2,
                              background: achievement.is_active 
                                ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`
                                : theme.palette.background.paper,
                              border: achievement.is_active 
                                ? `2px solid ${theme.palette.primary.main}` 
                                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              transition: 'all 0.3s ease',
                              overflow: 'visible',
                              animation: achievement.is_active ? 'badge-glow 2.5s infinite' : 'none',
                              '&:hover': { 
                                transform: 'translateY(-5px)',
                                boxShadow: theme.shadows[achievement.is_active ? 6 : 3]
                              }
                            }}
                          >
                            {achievement.is_active && (
                              <Box 
                                sx={{
                                  position: 'absolute',
                                  top: -10,
                                  right: -10,
                                  backgroundColor: theme.palette.success.main,
                                  color: theme.palette.success.contrastText,
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: theme.shadows[3],
                                  zIndex: 2
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </Box>
                            )}
                            
                            <CardContent sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              p: 2,
                              '&:last-child': { pb: 2 }
                            }}>
                              <Box sx={{
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1.5,
                                position: 'relative',
                                '&::after': achievement.is_active ? {
                                  content: '""',
                                  position: 'absolute',
                                  top: -5,
                                  left: -5,
                                  right: -5,
                                  bottom: -5,
                                  borderRadius: '50%',
                                  border: `2px solid ${theme.palette.primary.main}`,
                                  animation: 'pulse 1.5s infinite'
                                } : {}
                              }}>
                                <Box 
                                  component="img" 
                                  src={`/static/images/bages/${achievement.image_path}`}
                                  alt={achievement.name || achievement.bage}
                                  sx={{ 
                                    width: 70, 
                                    height: 70,
                                    objectFit: 'contain',
                                    filter: achievement.is_active ? 'none' : 'grayscale(30%)',
                                    transition: 'all 0.3s ease',
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/static/images/bages/default-badge.png';
                                  }}
                                />
                              </Box>
                              
                              <Typography 
                                variant={isMobile ? "body1" : "subtitle1"} 
                                sx={{ 
                                  mb: 1, 
                                  fontWeight: 600,
                                  fontSize: isMobile ? '0.9rem' : 'inherit'
                                }}
                              >
                                {achievement.name || achievement.bage}
                              </Typography>
                              
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                  mb: 2, 
                                  flexGrow: 1,
                                  fontSize: isMobile ? '0.75rem' : 'inherit',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {achievement.description || 'Заслуженное достижение'}
                              </Typography>

                              {achievement.max_copies === 1 && achievement.purchases?.length >= 1 ? (
                                <Button 
                                  variant="outlined"
                                  color="error"
                                  size={isMobile ? "small" : "medium"}
                                  sx={{ 
                                    width: '100%',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                  }}
                                  disabled
                                >
                                  Распродано
                                </Button>
                              ) : (
                                <Button 
                                  variant={achievement.is_active ? "outlined" : "contained"}
                                  color={achievement.is_active ? "success" : "primary"}
                                  onClick={() => handleSetActiveBadge(achievement.id)}
                                  size={isMobile ? "small" : "medium"}
                                  startIcon={achievement.is_active ? <CheckIcon /> : null}
                                  sx={{ 
                                    width: '100%',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    boxShadow: achievement.is_active ? 'none' : theme.shadows[1]
                                  }}
                                  disabled={updatingActiveBadge}
                                >
                                  {achievement.is_active ? "Активен" : "Установить"}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Собирайте новые достижения, участвуя в сообществе
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        Бейджи отображаются рядом с вашим именем в профиле и комментариях
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    px: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.4),
                    border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`
                  }}>
                    <EmojiEventsIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      У вас пока нет бейджей
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Участвуйте в сообществе, чтобы получать награды и достижения
                    </Typography>
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
        
        {/* Tab for UsernameShop */}
        {activeTab === 4 && (
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
                p: { xs: 1, sm: 2, md: 3 } // Адаптивные отступы
              }}>
                <UsernameShopTab />
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        {/* Уведомления */}
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
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        
        {/* Диалог для ввода Telegram ID */}
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
              background: theme.palette.background.paper
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
      </SettingsContainer>
    </motion.div>
  );
};

export default SettingsPage;
