import React, { useContext, useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Paper,
  Typography,
  Avatar,
  Button,
  Badge,
  Collapse,
  Tooltip,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import homeIcon from '@iconify-icons/solar/home-bold';
import personIcon from '@iconify-icons/solar/user-bold';
import groupIcon from '@iconify-icons/solar/users-group-rounded-bold';
import musicIcon from '@iconify-icons/solar/music-notes-bold';
import messageIcon from '@iconify-icons/solar/chat-round-dots-bold';
import settingsIcon from '@iconify-icons/solar/settings-bold';
import searchIcon from '@iconify-icons/solar/magnifer-bold';
import arrowDownIcon from '@iconify-icons/solar/alt-arrow-down-bold';
import arrowUpIcon from '@iconify-icons/solar/alt-arrow-up-bold';
import bookmarkIcon from '@iconify-icons/solar/bookmark-bold';
import eventIcon from '@iconify-icons/solar/calendar-bold';
import gameIcon from '@iconify-icons/solar/gamepad-bold';
import peopleIcon from '@iconify-icons/solar/users-group-two-rounded-bold';
import bugIcon from '@iconify-icons/solar/bug-bold';
import adminIcon from '@iconify-icons/solar/shield-user-bold';
import chatIcon from '@iconify-icons/solar/chat-round-bold';
import leaderboardIcon from '@iconify-icons/solar/chart-bold';
import moderatorIcon from '@iconify-icons/solar/shield-star-bold';
import rulesIcon from '@iconify-icons/solar/document-text-bold';
import moreIcon from '@iconify-icons/solar/menu-dots-bold';
import shopIcon from '@iconify-icons/solar/shop-bold';
import apiIcon from '@iconify-icons/solar/code-bold';
import starIcon from '@iconify-icons/solar/star-bold';
import subscriptionIcon from '@iconify-icons/solar/crown-bold';
import GroupsIcon from '@mui/icons-material/Groups';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';
import axios from 'axios';

// Обновленные стилизованные компоненты
const SidebarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 1.5),
  borderRadius: theme.spacing(2),
  height: 'calc(100vh - 100px)',
  position: 'sticky',
  top: '84px',
  overflowY: 'auto',
  overflowX: 'hidden',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.07)',
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)', // Safari поддержка
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    width: '0px', // Скрываем скроллбар, но оставляем функциональность
    background: 'transparent',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
  },
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
  // Сохраняем оригинальное позиционирование
  [theme.breakpoints.up('md')]: {
    width: '230px',
    marginRight: 0,
    marginLeft: 'auto',
  },
  // Адаптивность
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.5, 1.2),
    width: '220px',
  },
  [theme.breakpoints.down('md')]: {
    width: '210px',
    padding: theme.spacing(1.2, 1),
  }
}));

const UserProfile = styled(Box)(({ theme, themecolor }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1.5, 1, 1.8, 1),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: '1px',
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)`
      : `linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)`,
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.2, 1, 1.5, 1),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 0.8, 1.2, 0.8),
  }
}));

const StyledAvatar = styled(Avatar)(({ theme, themecolor }) => ({
  width: 70,
  height: 70,
  border: theme.palette.mode === 'dark' ? `1px solid rgba(255, 255, 255, 0.15)` : `1px solid rgba(0, 0, 0, 0.15)`,
  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.12)`,
  transition: 'all 0.35s ease',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 6px 16px rgba(0, 0, 0, 0.16)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    borderRadius: '50%',
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%)`
      : `linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  '&:hover::after': {
    opacity: 1,
  },
  [theme.breakpoints.down('lg')]: {
    width: 65,
    height: 65,
  },
  [theme.breakpoints.down('md')]: {
    width: 60,
    height: 60,
  }
}));

const UserName = styled(Typography)(({ theme, themecolor }) => ({
  fontWeight: '600',
  fontSize: '1rem',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.2),
  letterSpacing: '0.4px',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.9rem',
    marginTop: theme.spacing(0.8),
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.85rem',
    marginTop: theme.spacing(0.6),
  }
}));

const UserNameTag = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
  fontSize: '0.75rem',
  letterSpacing: '0.3px',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.7rem',
    marginBottom: theme.spacing(0.8),
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.65rem',
    marginBottom: theme.spacing(0.6),
  }
}));

const EditButton = styled(Button)(({ theme, themecolor }) => ({
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.4, 2),
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '0.8rem',
  background: `linear-gradient(90deg, ${themecolor || theme.palette.primary.main}, ${alpha(themecolor || theme.palette.primary.main, 0.8)})`,
  boxShadow: `0 4px 15px ${alpha(themecolor || theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 6px 20px ${alpha(themecolor || theme.palette.primary.main, 0.5)}`,
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0.3, 1.8),
    fontSize: '0.7rem',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.25, 1.6),
    fontSize: '0.65rem',
  }
}));

const NavItem = styled(ListItem)(({ theme, active, isspecial, themecolor }) => ({
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.7, 1.3),
  backgroundColor: active ? 
    'rgba(255, 255, 255, 0.08)' : 
    'transparent',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active ? 
      'rgba(255, 255, 255, 0.12)' : 
      'rgba(255, 255, 255, 0.05)',
    transform: 'translateX(2px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '30%',
    height: '40%',
    width: active ? '2px' : '0px',
    backgroundColor: isspecial ? '#f44336' : (themecolor || theme.palette.primary.main),
    borderRadius: '0 2px 2px 0',
    transition: 'width 0.2s ease',
  },
  '&:hover::before': {
    width: active ? '2px' : '1px',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0.6, 1.1),
    marginBottom: theme.spacing(0.4),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5, 1),
    marginBottom: theme.spacing(0.3),
  }
}));

const NavIcon = styled(ListItemIcon)(({ theme, active, isspecial, themecolor }) => ({
  minWidth: '32px',
  color: active ? 
    (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
    (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
  transition: 'all 0.25s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.15rem',
    transition: 'transform 0.25s ease',
    filter: active ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : 'none',
  },
  '.MuiListItem-root:hover &': {
    color: active ? 
      (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'),
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.12)',
    }
  },
  [theme.breakpoints.down('lg')]: {
    minWidth: '30px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '26px',
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
    },
  }
}));

const NavText = styled(ListItemText)(({ theme, active, isspecial, themecolor }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: active ? 500 : 400,
    fontSize: '0.85rem',
    color: active 
      ? (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) 
      : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'),
    letterSpacing: active ? '0.3px' : '0.2px',
    transition: 'all 0.25s ease',
    textShadow: active ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
  },
  '.MuiListItem-root:hover & .MuiListItemText-primary': {
    letterSpacing: '0.3px',
  },
  [theme.breakpoints.down('lg')]: {
    '& .MuiListItemText-primary': {
      fontSize: '0.8rem',
      letterSpacing: active ? '0.25px' : '0.15px',
    }
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiListItemText-primary': {
      fontSize: '0.75rem',
    }
  }
}));

const MoreButton = styled(NavItem)(({ theme, active, themecolor }) => ({
  justifyContent: 'space-between',
  paddingRight: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  '& .arrow-icon': {
    transition: 'transform 0.3s ease',
    transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
    color: active ? (themecolor || theme.palette.primary.main) : 
      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
  }
}));

const NestedItem = styled(NavItem)(({ theme }) => ({
  marginBottom: theme.spacing(0.4),
  padding: theme.spacing(0.6, 1.2, 0.6, 2),
  borderRadius: theme.spacing(1.2),
}));

const SidebarFooter = styled(Box)(({ theme, themecolor }) => ({
  marginTop: 'auto',
  padding: theme.spacing(1.5, 1, 0.8),
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: '1px',
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)`
      : `linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)`,
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.2, 1, 0.6),
  }
}));

// Стилизованный компонент для FooterTypography
const FooterTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  fontSize: {
    xs: '0.6rem',
    sm: '0.65rem',
    md: '0.7rem'
  }
}));

// Основной компонент сайдбара (существующий)
const Sidebar = ({ mobile, closeDrawer }) => {
  const [expandedMore, setExpandedMore] = useState(false);
  const [expandedAdminMod, setExpandedAdminMod] = useState(false);
  const { user } = useContext(AuthContext);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const location = useLocation();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isModeratorUser, setIsModeratorUser] = useState(false);
  const theme = useTheme();

  // Get colors from theme settings
  const sidebarBackgroundColor = themeSettings.paperColor || theme.palette.background.paper;
  const sidebarTextColor = themeSettings.textColor || theme.palette.text.primary;
  const primaryColor = themeSettings.primaryColor || theme.palette.primary.main;

  // Update the SidebarContainer component style
  const sidebarStyle = {
    backgroundColor: sidebarBackgroundColor,
    color: sidebarTextColor,
    boxShadow: `0 4px 15px ${alpha('#000000', 0.07)}`,
    borderColor: alpha(sidebarTextColor, 0.08)
  };

  // Проверка активного пути
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  // Проверка является ли пользователь админом (id === 3)
  const isAdmin = user?.id === 3;
  
  // Проверка является ли пользователь каналом
  const isChannel = user?.account_type === 'channel';
  
  // Проверяем, есть ли пользователь в таблице moderator_permission
  useEffect(() => {
    if (user) {
      checkModeratorStatus();
    }
  }, [user]);

  // Кэш и время последней проверки модератора
  const [lastModeratorCheck, setLastModeratorCheck] = useState(0);

  const checkModeratorStatus = async () => {
    try {
      // Проверяем, не выполняется ли уже проверка
      if (window._moderatorCheckInProgress) {
        console.log('Moderator check already in progress, skipping...');
        return;
      }
      
      // Используем кэш, если проверка была недавно (в течение 15 минут)
      const now = Date.now();
      if (now - lastModeratorCheck < 15 * 60 * 1000) {
        console.log('Using cached moderator status');
        return;
      }
      
      // Быстрая проверка, только для UI - использует легкий endpoint
      // Устанавливаем флаг, что проверка выполняется
      window._moderatorCheckInProgress = true;
      
      // Используем endpoint quick-status, который не требует полных прав модератора
      const response = await axios.get('/api/moderator/quick-status');
      if (response.data && response.data.is_moderator) {
        setIsModeratorUser(true);
      } else {
        setIsModeratorUser(false);
      }
      
      // Обновляем время последней проверки
      setLastModeratorCheck(now);
    } catch (error) {
      console.error('Error checking moderator status:', error);
      setIsModeratorUser(false);
    } finally {
      // Сбрасываем флаг
      window._moderatorCheckInProgress = false;
    }
  };
  
  // Основные пункты меню с обновленными иконками
  const mainMenuItems = [
    { text: 'Мой профиль', icon: 'user', path: `/profile/${user?.username || user?.id}` },
    { text: 'Лента', icon: 'home', path: '/' },
    { text: 'Музыка', icon: 'music-notes', path: '/music' },
    { text: 'Подписки', icon: 'users-group-two-rounded', path: '/subscriptions' },
    { text: 'Каналы', icon: 'users-group-rounded', path: '/channels' },
    { text: 'Поиск', icon: 'magnifer', path: '/search' },
    { text: 'Мини-игры', icon: 'gamepad', path: '/minigames' },
    { text: 'Магазин бейджиков', icon: 'shop', path: '/badge-shop' },
    { text: 'Планы подписок', icon: 'crown', path: '/sub-planes' },
  ];

  // Дополнительные пункты меню (для раздела "Еще")
  const moreMenuItems = [
    { text: 'Лидерборд', icon: 'chart', path: '/leaderboard' },
    { text: 'Баг-репорты', icon: 'bug', path: '/bugs' },
    { text: 'Правила', icon: 'document-text', path: '/rules' },
    { text: 'API Документация', icon: 'code', path: '/api-docs' },
    { text: 'О платформе', icon: 'info-circle', path: '/about' },
  ];

  const toggleExpandMore = () => {
    setExpandedMore(!expandedMore);
  };

  const toggleExpandAdminMod = () => {
    setExpandedAdminMod(!expandedAdminMod);
  };

  return (
    <SidebarContainer elevation={2} style={sidebarStyle}>
      <Box>
        {user && (
          <UserProfile>
            <StyledAvatar 
              src={user?.photo ? (user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}`) : undefined}
              alt={user?.name || 'User'}
              themecolor={primaryColor}
              onError={(e) => {
                console.error(`Failed to load avatar for ${user?.username}`);
                e.target.onerror = null; // Prevent infinite recursion
                e.target.src = `/static/uploads/avatar/system/avatar.png`;
              }}
            />
            <UserName variant="h6" themecolor={primaryColor}>
              {user?.name || 'Пользователь'}
            </UserName>
            <UserNameTag variant="body2">
              @{user?.username || 'username'}
            </UserNameTag>
            <EditButton 
              variant="contained" 
              size="small" 
              color="primary" 
              component={RouterLink}
              to={`/settings`}
              themecolor={primaryColor}
            >
              Редактировать
            </EditButton>
          </UserProfile>
        )}

        <List component="nav" sx={{ p: 1, mt: 1 }}>
          
          <NavItem
            button
            component={RouterLink}
            to={`/profile/${user?.username || user?.id}`}
            active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon={personIcon} width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Мой профиль" 
              active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          
          <NavItem
            button
            component={RouterLink}
            to="/"
            active={isActive('/') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon={homeIcon} width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Лента" 
              active={isActive('/') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          
          <NavItem
            button
            component={RouterLink}
            to="/music"
            active={isActive('/music') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/music') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon={musicIcon} width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Музыка" 
              active={isActive('/music') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          
          <NavItem
            button
            component={RouterLink}
            to="/subscriptions"
            active={isActive('/subscriptions') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/subscriptions') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon={peopleIcon} width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Подписки" 
              active={isActive('/subscriptions') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          
          <NavItem
            button
            component={RouterLink}
            to="/channels"
            active={isActive('/channels') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/channels') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:users-group-rounded-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Каналы" 
              active={isActive('/channels') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          
          <NavItem
            button
            component={RouterLink}
            to="/search"
            active={isActive('/search') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/search') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon={searchIcon} width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Поиск" 
              active={isActive('/search') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          
          <NavItem
            button
            component={RouterLink}
            to="/badge-shop"
            active={isActive('/badge-shop') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/badge-shop') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon={shopIcon} width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Магазин бейджиков" 
              active={isActive('/badge-shop') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          
          {(isAdmin || isModeratorUser) && (
            <>
              <NavItem
                onClick={toggleExpandAdminMod}
                active={expandedAdminMod ? 1 : 0}
                isspecial="true"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NavIcon 
                    active={expandedAdminMod ? 1 : 0}
                    isspecial="true"
                  >
                    <Icon icon={adminIcon} width="20" height="20" />
                  </NavIcon>
                  <NavText 
                    primary="Управление" 
                    active={expandedAdminMod ? 1 : 0}
                    isspecial="true"
                  />
                </Box>
                {expandedAdminMod ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </NavItem>
              
              <Collapse in={expandedAdminMod} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 1.5, pt: 0.5 }}>
                  
                  {isAdmin && (
                    <NestedItem
                      button
                      component={RouterLink}
                      to="/admin"
                      active={isActive('/admin') ? 1 : 0}
                      isspecial="true"
                    >
                      <NavIcon 
                        active={isActive('/admin') ? 1 : 0}
                        isspecial="true"
                      >
                        <Icon icon={adminIcon} width="20" height="20" />
                      </NavIcon>
                      <NavText 
                        primary="Админ Панель" 
                        active={isActive('/admin') ? 1 : 0}
                        isspecial="true"
                      />
                    </NestedItem>
                  )}
                  
                  
                  {isModeratorUser && (
                    <NestedItem
                      button
                      component={RouterLink}
                      to="/moderator"
                      active={isActive('/moderator') ? 1 : 0}
                      isspecial="true"
                    >
                      <NavIcon 
                        active={isActive('/moderator') ? 1 : 0}
                        isspecial="true"
                      >
                        <Icon icon={moderatorIcon} width="20" height="20" />
                      </NavIcon>
                      <NavText 
                        primary="Модерировать" 
                        active={isActive('/moderator') ? 1 : 0}
                        isspecial="true"
                      />
                    </NestedItem>
                  )}
                </List>
              </Collapse>
            </>
          )}
          
          
          {!isChannel && (
            <NavItem
              button
              component={RouterLink}
              to="/minigames"
              active={isActive('/minigames') ? 1 : 0}
              themecolor={primaryColor}
            >
              <NavIcon 
                active={isActive('/minigames') ? 1 : 0}
                themecolor={primaryColor}
              >
                <Icon icon={gameIcon} width="20" height="20" />
              </NavIcon>
              <NavText 
                primary="Мини-игры" 
                active={isActive('/minigames') ? 1 : 0}
                themecolor={primaryColor}
              />
            </NavItem>
          )}
          
          
          {!isChannel && (
            <NavItem
              button
              component={RouterLink}
              to="/sub-planes"
              active={isActive('/sub-planes') ? 1 : 0}
              themecolor={primaryColor}
            >
              <NavIcon 
                active={isActive('/sub-planes') ? 1 : 0}
                themecolor={primaryColor}
              >
                <Icon icon={subscriptionIcon} width="20" height="20" />
              </NavIcon>
              <NavText 
                primary="Планы подписок" 
                active={isActive('/sub-planes') ? 1 : 0}
                themecolor={primaryColor}
              />
            </NavItem>
          )}

          
          <MoreButton 
            button 
            onClick={toggleExpandMore}
            active={expandedMore ? 1 : 0}
            themecolor={primaryColor}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavIcon 
                active={expandedMore ? 1 : 0}
                themecolor={primaryColor}
              >
                <Icon icon={moreIcon} width="20" height="20" />
              </NavIcon>
              <NavText 
                primary="Еще" 
                active={expandedMore ? 1 : 0}
                themecolor={primaryColor}
              />
            </Box>
            <Box className="arrow-icon">
              {expandedMore ? <Icon icon={arrowUpIcon} width="20" height="20" /> : <Icon icon={arrowDownIcon} width="20" height="20" />}
            </Box>
          </MoreButton>

          <Collapse in={expandedMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1.5, pt: 0.5 }}>
              
              {!isChannel && (
                <NestedItem
                  button
                  component={RouterLink}
                  to="/leaderboard"
                  active={isActive('/leaderboard') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <NavIcon 
                    active={isActive('/leaderboard') ? 1 : 0}
                    themecolor={primaryColor}
                  >
                    <Icon icon={leaderboardIcon} width="20" height="20" />
                  </NavIcon>
                  <NavText 
                    primary="Лидерборд" 
                    active={isActive('/leaderboard') ? 1 : 0}
                    themecolor={primaryColor}
                  />
                </NestedItem>
              )}
              
              
              {!isChannel && (
                <NestedItem
                  button
                  component={RouterLink}
                  to="/bugs"
                  active={isActive('/bugs') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <NavIcon 
                    active={isActive('/bugs') ? 1 : 0}
                    themecolor={primaryColor}
                  >
                    <Icon icon={bugIcon} width="20" height="20" />
                  </NavIcon>
                  <NavText 
                    primary="Баг-репорты" 
                    active={isActive('/bugs') ? 1 : 0}
                    themecolor={primaryColor}
                  />
                </NestedItem>
              )}
              
              
              <NestedItem
                button
                component={RouterLink}
                to="/rules"
                active={isActive('/rules') ? 1 : 0}
                themecolor={primaryColor}
              >
                <NavIcon 
                  active={isActive('/rules') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <Icon icon={rulesIcon} width="20" height="20" />
                </NavIcon>
                <NavText 
                  primary="Правила" 
                  active={isActive('/rules') ? 1 : 0}
                  themecolor={primaryColor}
                />
              </NestedItem>
              
              
              <NestedItem
                button
                component={RouterLink}
                to="/api-docs"
                active={isActive('/api-docs') ? 1 : 0}
                themecolor={primaryColor}
              >
                <NavIcon 
                  active={isActive('/api-docs') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <Icon icon={apiIcon} width="20" height="20" />
                </NavIcon>
                <NavText 
                  primary="API Документация" 
                  active={isActive('/api-docs') ? 1 : 0}
                  themecolor={primaryColor}
                />
              </NestedItem>
              
              
              <NestedItem
                button
                component={RouterLink}
                to="/about"
                active={isActive('/about') ? 1 : 0}
                themecolor={primaryColor}
              >
                <NavIcon 
                  active={isActive('/about') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <Icon icon={rulesIcon} width="20" height="20" />
                </NavIcon>
                <NavText 
                  primary="О платформе" 
                  active={isActive('/about') ? 1 : 0}
                  themecolor={primaryColor}
                />
              </NestedItem>
            </List>
          </Collapse>
        </List>
      </Box>

      
      <SidebarFooter themecolor={primaryColor}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 500, 
            color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
            mb: 0.8,
            letterSpacing: '0.4px',
            fontSize: {
              xs: '0.7rem',
              sm: '0.75rem',
              md: '0.8rem',
            }
          }}
        >
          К-Коннект v2.3
        </Typography>
        <FooterTypography variant="caption" display="block">
          Правообладателям
        </FooterTypography>
        <FooterTypography variant="caption" display="block" sx={{ pt: 0.2 }}>
          verif@k-connect.ru
        </FooterTypography>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;