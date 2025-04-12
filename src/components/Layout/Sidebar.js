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
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
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
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, rgb(35, 37, 38) 0%, rgb(18, 18, 18) 100%)',
  backdropFilter: 'blur(12px)',
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
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3), 0 0 25px rgba(0, 0, 0, 0.15)',
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

const UserProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1.8, 1, 2, 1),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.5)}, transparent)`,
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.5, 1, 1.8, 1),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.2, 0.8, 1.5, 0.8),
  }
}));

const StyledAvatar = styled(Avatar)(({ theme, themecolor }) => ({
  width: 76,
  height: 76,
  border: `3px solid ${themecolor || theme.palette.primary.main}`,
  boxShadow: `0 8px 25px ${alpha(themecolor || theme.palette.primary.main, 0.25)}`,
  transition: 'all 0.35s ease',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 10px 30px ${alpha(themecolor || theme.palette.primary.main, 0.35)}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    right: '-8px',
    bottom: '-8px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${alpha(themecolor || theme.palette.primary.main, 0)} 0%, ${alpha(themecolor || theme.palette.primary.main, 0.2)} 100%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  '&:hover::after': {
    opacity: 1,
  },
  [theme.breakpoints.down('lg')]: {
    width: 68,
    height: 68,
  },
  [theme.breakpoints.down('md')]: {
    width: 60,
    height: 60,
  }
}));

const UserName = styled(Typography)(({ theme, themecolor }) => ({
  fontWeight: '700',
  fontSize: '1.15rem',
  marginTop: theme.spacing(1.2),
  marginBottom: theme.spacing(0.2),
  letterSpacing: '0.5px',
  background: `linear-gradient(90deg, ${themecolor || theme.palette.primary.main}, ${alpha(themecolor || theme.palette.primary.main, 0.7)})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: `0 2px 10px ${alpha(themecolor || theme.palette.primary.main, 0.3)}`,
  [theme.breakpoints.down('lg')]: {
    fontSize: '1rem',
    marginTop: theme.spacing(1),
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.9rem',
    marginTop: theme.spacing(0.8),
  }
}));

const UserNameTag = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.text.secondary, 0.8),
  fontSize: '0.8rem',
  letterSpacing: '0.3px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.75rem',
    marginBottom: theme.spacing(1.2),
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.7rem',
    marginBottom: theme.spacing(1),
  }
}));

const EditButton = styled(Button)(({ theme, themecolor }) => ({
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5, 2.5),
  borderRadius: '12px',
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
    padding: theme.spacing(0.4, 2),
    fontSize: '0.75rem',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.3, 1.5),
    fontSize: '0.7rem',
  }
}));

const NavItem = styled(ListItem)(({ theme, active, isSpecial, themecolor }) => ({
  borderRadius: theme.spacing(1.8),
  marginBottom: theme.spacing(0.6),
  padding: theme.spacing(0.8, 1.5),
  backgroundColor: active ? 
    alpha(isSpecial ? '#f44336' : themecolor || theme.palette.primary.main, 0.15) : 
    'transparent',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active ? 
      alpha(isSpecial ? '#f44336' : themecolor || theme.palette.primary.main, 0.2) : 
      alpha(isSpecial ? '#f44336' : themecolor || theme.palette.primary.main, 0.08),
    transform: 'translateX(3px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '15%',
    height: '70%',
    width: active ? '4px' : '0px',
    backgroundColor: isSpecial ? '#f44336' : themecolor || theme.palette.primary.main,
    borderRadius: '0 4px 4px 0',
    transition: 'width 0.2s ease',
  },
  '&:hover::before': {
    width: active ? '4px' : '2px',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0.7, 1.3),
    marginBottom: theme.spacing(0.5),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.6, 1.1),
    marginBottom: theme.spacing(0.4),
  }
}));

const NavIcon = styled(ListItemIcon)(({ theme, active, isSpecial, themecolor }) => ({
  minWidth: '36px',
  color: active ? 
    (isSpecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
    theme.palette.text.secondary,
  transition: 'all 0.25s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
    transition: 'transform 0.25s ease',
  },
  '.MuiListItem-root:hover &': {
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.15)',
    }
  },
  [theme.breakpoints.down('lg')]: {
    minWidth: '32px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.15rem',
    },
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '28px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  }
}));

const NavText = styled(ListItemText)(({ theme, active, isSpecial, themecolor }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 500,
    fontSize: '0.9rem',
    color: active ? 
      (isSpecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
      theme.palette.text.primary,
    letterSpacing: active ? '0.3px' : '0.2px',
    transition: 'all 0.25s ease',
  },
  '.MuiListItem-root:hover & .MuiListItemText-primary': {
    letterSpacing: '0.35px',
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
    color: active ? themecolor || theme.palette.primary.main : theme.palette.text.secondary,
  }
}));

const NestedItem = styled(NavItem)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.8, 1.3, 0.8, 2.2),
  borderRadius: theme.spacing(1.5),
}));

const SidebarFooter = styled(Box)(({ theme, themecolor }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2, 1, 1),
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.5)}, transparent)`,
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.5, 1, 0.8),
  }
}));

// Основной компонент сайдбара
const Sidebar = ({ mobile, closeDrawer }) => {
  const { user } = useContext(AuthContext);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const location = useLocation();
  const [expandMore, setExpandMore] = useState(false);
  const [isModeratorUser, setIsModeratorUser] = useState(false);
  const theme = useTheme();

  // Проверка активного пути
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  // Проверка является ли пользователь админом (id === 3)
  const isAdmin = user?.id === 3;
  
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
    { text: 'Мой профиль', icon: <PersonRoundedIcon />, path: `/profile/${user?.username || user?.id}` },
    { text: 'Лента', icon: <HomeRoundedIcon />, path: '/' },
    { text: 'Лидерборд', icon: <LeaderboardRoundedIcon />, path: '/leaderboard' },
    { text: 'Подписки', icon: <PeopleAltRoundedIcon />, path: '/subscriptions' },
    { text: 'Музыка', icon: <MusicNoteRoundedIcon />, path: '/music' },
    { text: 'Поиск', icon: <SearchRoundedIcon />, path: '/search' },
    { text: 'Магазин бейджиков', icon: <StorefrontRoundedIcon />, path: '/badge-shop' },
  ];

  // Дополнительные пункты меню (для раздела "Еще")
  const moreMenuItems = [
    { text: 'Баг-репорты', icon: <BugReportRoundedIcon />, path: '/bugs' },
    { text: 'Правила', icon: <GavelRoundedIcon />, path: '/rules' },
    { text: 'API Документация', icon: <ApiRoundedIcon />, path: '/api-docs' },
  ];

  const toggleExpandMore = () => {
    setExpandMore(!expandMore);
  };

  // Определяем основной цвет темы
  const primaryColor = themeSettings?.primaryColor || theme.palette.primary.main;

  return (
    <SidebarContainer elevation={5}>
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
          {/* Профиль */}
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
              <PersonRoundedIcon />
            </NavIcon>
            <NavText 
              primary="Мой профиль" 
              active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {/* Модератор */}
          {isModeratorUser && (
            <NavItem
              button
              component={RouterLink}
              to="/moderator"
              active={isActive('/moderator') ? 1 : 0}
              isSpecial={1}
            >
              <NavIcon 
                active={isActive('/moderator') ? 1 : 0}
                isSpecial={1}
              >
                <SupervisorAccountRoundedIcon />
              </NavIcon>
              <NavText 
                primary="Модерировать" 
                active={isActive('/moderator') ? 1 : 0}
                isSpecial={1}
              />
            </NavItem>
          )}
          
          {/* Основные пункты меню (кроме профиля, который уже отдельно) */}
          {mainMenuItems.slice(1).map((item, index) => (
            <NavItem
              key={index}
              button
              component={RouterLink}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
              themecolor={primaryColor}
            >
              <NavIcon 
                active={isActive(item.path) ? 1 : 0}
                themecolor={primaryColor}
              >
                {item.icon}
              </NavIcon>
              <NavText 
                primary={item.text} 
                active={isActive(item.path) ? 1 : 0}
                themecolor={primaryColor}
              />
            </NavItem>
          ))}
          
          {/* Админка */}
          {isAdmin && (
            <NavItem
              button
              component={RouterLink}
              to="/admin"
              active={isActive('/admin') ? 1 : 0}
              themecolor={primaryColor}
            >
              <NavIcon 
                active={isActive('/admin') ? 1 : 0}
                themecolor={primaryColor}
              >
                <AdminPanelSettingsRoundedIcon />
              </NavIcon>
              <NavText 
                primary="Админ Панель" 
                active={isActive('/admin') ? 1 : 0}
                themecolor={primaryColor}
              />
            </NavItem>
          )}

          {/* Раздел "Еще" с выпадающим списком */}
          <MoreButton 
            button 
            onClick={toggleExpandMore}
            active={expandMore ? 1 : 0}
            themecolor={primaryColor}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavIcon 
                active={expandMore ? 1 : 0}
                themecolor={primaryColor}
              >
                <MoreHorizRoundedIcon />
              </NavIcon>
              <NavText 
                primary="Еще" 
                active={expandMore ? 1 : 0}
                themecolor={primaryColor}
              />
            </Box>
            <Box className="arrow-icon">
              {expandMore ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
            </Box>
          </MoreButton>

          <Collapse in={expandMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1.5, pt: 0.5 }}>
              {moreMenuItems.map((item, index) => (
                <NestedItem
                  key={index}
                  button
                  component={RouterLink}
                  to={item.path}
                  active={isActive(item.path) ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <NavIcon 
                    active={isActive(item.path) ? 1 : 0}
                    themecolor={primaryColor}
                  >
                    {item.icon}
                  </NavIcon>
                  <NavText 
                    primary={item.text} 
                    active={isActive(item.path) ? 1 : 0}
                    themecolor={primaryColor}
                  />
                </NestedItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Футер сайдбара с информацией */}
      <SidebarFooter themecolor={primaryColor}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            background: `linear-gradient(90deg, ${primaryColor}, ${alpha(primaryColor, 0.7)})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            letterSpacing: '0.5px',
            fontSize: {
              xs: '0.75rem',
              sm: '0.8rem',
              md: '0.85rem',
            }
          }}
        >
          К-Коннект v2.2
        </Typography>
        <Typography variant="caption" display="block" sx={{ 
          opacity: 0.8, 
          fontSize: {
            xs: '0.65rem',
            sm: '0.7rem',
            md: '0.75rem'
          }
        }}>
          Правообладателям
        </Typography>
        <Typography variant="caption" display="block" sx={{ 
          opacity: 0.8, 
          pt: 0.2, 
          fontWeight: 500,
          fontSize: {
            xs: '0.65rem',
            sm: '0.7rem',
            md: '0.75rem'
          }
        }}>
          verif@k-connect.ru
        </Typography>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
