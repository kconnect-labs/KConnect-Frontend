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
import { generatePlaceholder } from '../utils/imageUtils';
import SettingsBottomNavigation from '../components/SettingsBottomNavigation';
import LoginSettingsTab from '../components/LoginSettingsTab';


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
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BlockIcon from '@mui/icons-material/Block';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';


const SettingsContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: 0
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
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
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
    if (lowerUrl.includes('vk.com')) return <svg xmlns="http:
    if (lowerUrl.includes('tiktok.com')) return <svg xmlns="http:
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
      return <svg xmlns="http:
    case 'tiktok':
      return <svg xmlns="http:
    default:
      
      if (lowerName.includes('facebook')) return <FacebookIcon />;
      if (lowerName.includes('twitter')) return <TwitterIcon />;
      if (lowerName.includes('instagram')) return <InstagramIcon />;
      if (lowerName.includes('telegram')) return <TelegramIcon />;
      if (lowerName.includes('youtube')) return <YouTubeIcon />;
      if (lowerName.includes('element')) return <ElementIcon />;
      if (lowerName.includes('aumbent') || lowerName.includes('iq_search')) return <AumbentIcon />;
      if (lowerName.includes('vk') || lowerName.includes('вконтакте')) return <svg xmlns="http:
      if (lowerName.includes('tiktok')) return <svg xmlns="http:
      
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
        accept="image}
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
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Увеличьте лимит юзернеймов с подпиской:</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • Basic: 5 юзернеймов
              </Typography>
              <Typography variant="body2">
                • Premium: 8 юзернеймов
              </Typography>
              <Typography variant="body2">
                • Ultimate: без ограничений
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                color="primary"
                onClick={() => navigate('/balance')}
                sx={{ mt: 1 }}
              >
                Купить подписку
              </Button>
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
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
            borderRadius: 2,
          }}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" sx={{ color: '#FF9800', mb: 1 }}>
                Достигнут лимит юзернеймов
              </Typography>
          <Typography variant="body2">
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
              {(!userSubscription || userSubscription.subscription_type !== 'ultimate') && (
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/balance')}
                  sx={{ mt: 2, mr: 1 }}
                >
                  Купить подписку
                </Button>
              )}
              <Button 
                variant="outlined" 
                color="primary"
                href="https:
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
      
      {}
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
      
      {}
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
  
  
  const [elementConnected, setElementConnected] = useState(false);
  const [elementLinking, setElementLinking] = useState(false);
  const [elementToken, setElementToken] = useState('');
  const [loadingElementStatus, setLoadingElementStatus] = useState(false);
  
  
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialLink, setNewSocialLink] = useState('');
  
  
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
  
  
  const [telegramWebAppMode, setTelegramWebAppMode] = useState(
    localStorage.getItem('telegramWebAppMode') === 'true'
  );
  
  
  useEffect(() => {
    fetchProfileData();
    
    fetchUserAchievements();
    
    fetchUserWarnings();
    
    
    
    
    const handleStorageChange = (e) => {
      if (e.key === 'elem_connected' && e.newValue === 'true') {
        checkElementStatus();
        localStorage.removeItem('elem_connected'); 
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  
  useEffect(() => {
    const checkElementOnFocus = () => {
      checkElementStatus();
    };
    
    window.addEventListener('focus', checkElementOnFocus);
    
    return () => {
      window.removeEventListener('focus', checkElementOnFocus);
    };
  }, []);
  
  
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
        
        
        if (profileData.user.element_connected !== undefined) {
          setElementConnected(profileData.user.element_connected);
        } else {
          
          setElementConnected(!!profileData.user.elem_id);
        }
      }
      
      
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
  
  
  const handleSetActiveBadge = async (achievementId) => {
    try {
      setUpdatingActiveBadge(true);
      const response = await axios.post('/api/profile/achievements/active', {
        achievement_id: achievementId
      });
      
      if (response.data && response.data.success) {
        
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
      
      
      if (updateUserData) {
        updateUserData({
          ...user,
          name,
          username,
          about
        });
      }
      
      
      if (hasErrors) {
        
        let errorMessage = 'Некоторые изменения не удалось сохранить: ';
        const failedOperations = responses.filter(r => !r.success).map(r => r.type);
        errorMessage += failedOperations.join(', ');
        console.error('Save errors:', failedOperations);
        showNotification('error', errorMessage);
      } else {
        
        console.log('All operations successful');
        showNotification('success', 'Профиль успешно сохранен');
        
        navigate(`/profile/${username}`);
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('error', 'Произошла ошибка при сохранении профиля');
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
      
      
      const response = await ProfileService.updateSettings(settingsToSave);
      
      if (response && response.success) {
        setSuccess(true);
        
        
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
      
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };
  
  
  const handleColorChange = (colorType, color) => {
    
    const updatedSettings = {
      ...settings,
      [colorType]: color
    };
    setSettings(updatedSettings);

    
    document.documentElement.style.setProperty(`--${colorType.replace(/_/g, '-')}`, color);

    
    if (colorType === 'background_color') {
      updateThemeSettings({ backgroundColor: color });
    } else if (colorType === 'container_color') {
      updateThemeSettings({ paperColor: color });
    } else if (colorType === 'header_color') {
      updateThemeSettings({ headerColor: color });
      
      document.querySelectorAll('.MuiAppBar-root').forEach(el => {
        el.style.backgroundColor = color;
        el.style.color = getContrastTextColor(color);
      });
    } else if (colorType === 'bottom_nav_color') {
      updateThemeSettings({ bottomNavColor: color });
      
      document.querySelectorAll('.MuiBottomNavigation-root').forEach(el => {
        el.style.backgroundColor = color;
      });
      document.querySelectorAll('.MuiBottomNavigationAction-root').forEach(el => {
        el.style.color = getContrastTextColor(color);
      });
    } else if (colorType === 'content_color') {
      updateThemeSettings({ contentColor: color });
      
      document.querySelectorAll('.MuiCard-root').forEach(el => {
        el.style.backgroundColor = color;
        el.style.color = getContrastTextColor(color);
      });
    } else if (colorType === 'welcome_bubble_color') {
      updateThemeSettings({ welcomeBubbleColor: color });
    } else if (colorType === 'avatar_border_color') {
      updateThemeSettings({ primaryColor: color });
      
      document.documentElement.style.setProperty('--primary', color);
      document.documentElement.style.setProperty('--primary-light', color);
      document.documentElement.style.setProperty('--primary-dark', color);
      
      
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
    
    
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    setAutoSaveTimeout(setTimeout(() => {
      handleSaveSettings();
    }, 500));
  };

  
  const getContrastTextColor = (hexColor) => {
    
    const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
    
    
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };
  
  
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
      
      
      setSettings(newSettings);
      
      
      updateThemeSettings({
        backgroundColor: newSettings.background_color,
        paperColor: newSettings.container_color,
      });
      
      
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
  
  
  const handleTogglePushNotifications = async () => {
    try {
      setSavingNotificationPrefs(true);
      
      
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
  
  
  const checkElementStatus = async () => {
    try {
      
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
  
  
  const generateElementToken = async () => {
    try {
      setElementLinking(true);
      
      
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
  
  
  const handleLinkElement = () => {
    generateElementToken();
    
    
    const checkInterval = setInterval(() => {
      checkElementStatus().then(isConnected => {
        if (isConnected) {
          
          clearInterval(checkInterval);
          setElementLinking(false);
          setElementToken('');
          showNotification('success', 'Element аккаунт успешно подключен!');
        }
      });
    }, 2000); 
    
    
    localStorage.setItem('element_auth_pending', 'true');
    
    
    setTimeout(() => {
      clearInterval(checkInterval);
      localStorage.removeItem('element_auth_pending');
    }, 120000);
  };
  
  
  const handleCancelElementLinking = () => {
    setElementToken('');
    setElementLinking(false);
    
    localStorage.removeItem('element_auth_pending');
  };
  
  
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
  
  
  const handleToggleTelegramWebAppMode = () => {
    const newMode = !telegramWebAppMode;
    setTelegramWebAppMode(newMode);
    
    
    localStorage.setItem('telegramWebAppMode', newMode.toString());
    
    
    window.location.reload();
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
          <StyledTab icon={<NotificationsIcon />} label="Уведомления" />
          <StyledTab icon={<EmojiEventsIcon />} label="Бейджи" />
          <StyledTab icon={<AlternateEmailIcon />} label="Юзернеймы" />
          <StyledTab icon={<LockIcon />} label="Вход по паролю" />
        </StyledTabs>
        
        {}
        {activeTab === 0 && (
          <Box component={motion.div} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {}
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
                  bgcolor: accountStatus === 'good' 
                    ? alpha(theme.palette.success.main, 0.1)
                    : accountStatus === 'warning'
                      ? alpha(theme.palette.warning.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${
                    accountStatus === 'good' 
                      ? alpha(theme.palette.success.main, 0.3)
                      : accountStatus === 'warning'
                        ? alpha(theme.palette.warning.main, 0.3)
                        : alpha(theme.palette.error.main, 0.3)
                  }`,
                  mb: 2
                }}>
                  <Box sx={{ mr: 2 }}>
                    {accountStatus === 'good' && (
                      <VerifiedUserIcon color="success" sx={{ fontSize: 36 }} />
                    )}
                    {accountStatus === 'warning' && (
                      <WarningAmberIcon color="warning" sx={{ fontSize: 36 }} />
                    )}
                    {accountStatus === 'banned' && (
                      <BlockIcon color="error" sx={{ fontSize: 36 }} />
                    )}
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {accountStatus === 'good' && 'Всё в порядке'}
                      {accountStatus === 'warning' && 'Есть предупреждения'}
                      {accountStatus === 'banned' && 'Аккаунт заблокирован'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {accountStatus === 'good' && 'Ваша учетная запись в хорошем состоянии.'}
                      {accountStatus === 'warning' && `У вас есть ${userWarnings.length} активных предупреждений от модераторов.`}
                      {accountStatus === 'banned' && 'Ваша учетная запись временно заблокирована.'}
                    </Typography>
                  </Box>
                </Box>
                
                {accountStatus === 'banned' && banInfo && (
                  <Box 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha('#d32f2f', 0.08), 
                      border: `1px solid ${alpha('#d32f2f', 0.2)}`
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
                
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={openWarningsDialog}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: accountStatus === 'good' ? theme.palette.success.main : 
                                accountStatus === 'warning' ? theme.palette.warning.main : theme.palette.error.main,
                    color: accountStatus === 'good' ? theme.palette.success.main : 
                          accountStatus === 'warning' ? theme.palette.warning.main : theme.palette.error.main,
                  }}
                >
                  Просмотреть историю предупреждений
                </Button>
              </SettingsCardContent>
            </SettingsCard>
            
            <SettingsCard>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <PersonIcon />
                  Основная информация
                </SectionTitle>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {}
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
                            accept="image}
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
                          e.target.src = generatePlaceholder(800, 200, 'Banner', '#424242', '#ffffff');
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
                          accept="image}
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
                      placeholder="https:
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
        
        {}
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
                
                <Box sx={{ textAlign: 'center', my: 4 }}>
                  <Typography variant="h4" color="primary" fontWeight="600" gutterBottom>
                    Скоро
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Новые возможности кастомизации внешнего вида появятся в ближайшем обновлении
                  </Typography>
                </Box>
              </SettingsCardContent>
            </SettingsCard>

            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <PaletteIcon />
                  Сезонные профили
                </SectionTitle>
                
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Скоро вы сможете выбрать сезонное оформление для своего профиля. Оформление будет автоматически меняться в зависимости от времени года.
                </Typography>
                
                <Grid container spacing={3}>
                  {[
                    { id: 'winter', name: 'Зима', color: '#E3F2FD', icon: '❄️', disabled: true },
                    { id: 'spring', name: 'Весна', color: '#E8F5E9', icon: '🌸', disabled: true },
                    { id: 'summer', name: 'Лето', color: '#FFF3E0', icon: '☀️', disabled: true },
                    { id: 'autumn', name: 'Осень', color: '#FBE9E7', icon: '🍂', disabled: true }
                  ].map((season) => (
                    <Grid item xs={12} sm={6} md={3} key={season.id}>
                      <Card 
                        sx={{ 
                          position: 'relative',
                          height: '100%',
                          borderRadius: 2,
                          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          opacity: season.disabled ? 0.7 : 1,
                          '&:hover': { 
                            transform: season.disabled ? 'none' : 'translateY(-5px)',
                            boxShadow: season.disabled ? theme.shadows[1] : theme.shadows[4]
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: 120, 
                            background: `linear-gradient(to bottom, ${season.color}, ${alpha(theme.palette.background.paper, 0.5)})`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '3rem'
                          }}
                        >
                          {season.icon}
                        </Box>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom>
                            {season.name}
                          </Typography>
                          <Chip 
                            label="Скоро" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="body2" color="text.disabled">
                    Сезонные профили станут доступны в ближайшем обновлении
                  </Typography>
                </Box>
              </SettingsCardContent>
            </SettingsCard>
            
            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <BrushIcon />
                  Дополнительные настройки
                </SectionTitle>
                
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
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        {}
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

            
            
            {}
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
                    
                    {}
                    {window.setupCaching && typeof window.setupCaching === 'function' && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Система защиты от кэширования может помешать работе push-уведомлений. Если у вас возникли проблемы с получением уведомлений, обратитесь к администратору.
                      </Alert>
                    )}
                    
                    {}
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
                    
                    {}
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
            
            {}
            <SettingsCard sx={{ mt: 3 }}>
              <SettingsCardContent>
                <SectionTitle variant="h5">
                  <LinkIcon />
                  Связанные аккаунты
                </SectionTitle>
                
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Подключите внешние аккаунты для расширенных возможностей
                </Typography>
                
                {}
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
                          href={`https:
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
                
                {}
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
                        
                        if (notificationPrefs.telegramConnected) {
                          
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
        
        {}
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
        
        {}
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
                p: { xs: 1, sm: 2, md: 3 } 
              }}>
                <UsernameShopTab 
                  activeTab={activeTab}
                />
              </SettingsCardContent>
            </SettingsCard>
          </Box>
        )}
        
        {}
        {activeTab === 5 && (
          <Box component={motion.div} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoginSettingsTab />
          </Box>
        )}
        
        {}
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
        
        {}
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
                href="https:
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
        
        {}
        <Dialog
          open={warningsDialogOpen}
          onClose={() => setWarningsDialogOpen(false)}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 1, 
              background: 'rgba(18, 18, 18, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
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
                {}
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
                
                {}
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
        
        {}
        <SettingsBottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
      </SettingsContainer>
    </motion.div>
  );
};

export default SettingsPage;
