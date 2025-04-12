import React, { useContext, useState } from 'react';
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
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EventIcon from '@mui/icons-material/Event';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import PeopleIcon from '@mui/icons-material/People';
import BugReportIcon from '@mui/icons-material/BugReport';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';

const SidebarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  height: 'calc(100vh - 100px)',
  position: 'sticky',
  top: '84px',
  overflowY: 'auto',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.7) 0%, rgba(18, 18, 18, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  // Добавляем стиль для "островного" отображения
  [theme.breakpoints.up('md')]: {
    width: '230px', // Чуть шире для лучшей читаемости
    marginRight: 0,
    marginLeft: 'auto', // Выравнивание по правому краю
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2, 0, 3),
  position: 'relative',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 85,
  height: 85,
  marginBottom: theme.spacing(1.5),
  border: `3px solid ${theme.palette.primary.main}`,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)',
  }
}));

const Username = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.1rem',
  marginTop: theme.spacing(1),
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const MenuListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(0.8),
  padding: theme.spacing(1, 2),
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.hover, 0.1),
    transform: 'translateX(5px)',
  },
  '&::before': active ? {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 4,
    height: '70%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '0 4px 4px 0',
  } : {},
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme, active }) => ({
  minWidth: '40px',
  color: active ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.8),
  transition: 'all 0.3s ease',
}));

const MenuItemText = styled(ListItemText)(({ theme, active }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
    fontSize: '0.95rem',
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    transition: 'all 0.3s ease',
  },
}));

const EditButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(0.5, 2),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.8rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(4px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  }
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  opacity: 0.1,
  width: '100%',
}));

// Анимированный эффект появления
const FadeInBox = styled(Box)(({ theme }) => ({
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

// Основной компонент сайдбара
const Sidebar = ({ mobile, closeDrawer }) => {
  const { user } = useContext(AuthContext);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [expandMore, setExpandMore] = useState(false);
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'));

  // Проверка активного пути
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  // Проверка является ли пользователь админом
  const isAdmin = user?.id === 3;

  // Основные пункты меню
  const mainMenuItems = [
    { text: 'Мой профиль', icon: <PersonIcon />, path: `/profile/${user?.username || user?.id}` },
    { text: 'Лента', icon: <HomeIcon />, path: '/' },
    { text: 'Подписки', icon: <PeopleIcon />, path: '/subscriptions' },
    { text: 'Музыка', icon: <MusicNoteIcon />, path: '/music' },
    { text: 'Поиск', icon: <SearchIcon />, path: '/search' },
    { text: 'Баг-репорты', icon: <BugReportIcon />, path: '/bugs' },
  ];

  // Дополнительные пункты меню (для раздела "Еще")
  const moreMenuItems = [
    { text: 'Закладки', icon: <BookmarkIcon />, path: '/bookmarks' },
    { text: 'События', icon: <EventIcon />, path: '/events' },
  ];

  const toggleExpandMore = () => {
    setExpandMore(!expandMore);
  };

  return (
    <SidebarContainer 
      elevation={4} 
      sx={{ 
        background: `linear-gradient(145deg, ${alpha(themeSettings.paperColor, 0.8)} 0%, ${alpha('#151515', 0.9)} 100%)` 
      }}
    >
      {user && (
        <FadeInBox>
          <UserInfo>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <UserAvatar 
                src={user?.photo ? (user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}`) : undefined}
                alt={user?.name || 'User'}
                sx={{ border: `3px solid ${themeSettings.primaryColor}` }}
                onError={(e) => {
                  console.error(`Failed to load avatar for ${user?.username}`);
                  e.target.onerror = null; // Prevent infinite recursion
                  e.target.src = `/static/uploads/avatar/system/avatar.png`;
                }}
              />
            </StyledBadge>
            
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Username variant="h6" sx={{ 
                color: themeSettings.primaryColor,
                background: `linear-gradient(90deg, ${themeSettings.primaryColor} 0%, #AB82FF 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {user?.name || 'Пользователь'}
              </Username>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha(theme.palette.text.secondary, 0.8),
                  backdropFilter: 'blur(4px)',
                  marginTop: 0.5
                }}
              >
                @{user?.username || 'username'}
              </Typography>
            </Box>
            
            <EditButton 
              variant="outlined" 
              startIcon={<ModeEditOutlineIcon fontSize="small" />}
              color="primary" 
              component={RouterLink}
              to={`/settings`}
              sx={{ 
                mt: 2.5, 
                borderColor: alpha(themeSettings.primaryColor, 0.4),
                color: themeSettings.primaryColor,
                '&:hover': {
                  borderColor: themeSettings.primaryColor,
                  backgroundColor: alpha(themeSettings.primaryColor, 0.1)
                }
              }}
            >
              Редактировать
            </EditButton>
          </UserInfo>
          <SectionDivider />
        </FadeInBox>
      )}

      <FadeInBox sx={{ animationDelay: '0.2s' }}>
        <List component="nav" sx={{ p: 0 }}>
          {mainMenuItems.map((item, index) => (
            <MenuListItem
              key={index}
              button
              component={RouterLink}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
              onClick={() => mobile && closeDrawer && closeDrawer()}
              sx={{ 
                animationDelay: `${0.1 * index}s`,
                animation: 'fadeInLeft 0.3s ease-out forwards',
                opacity: 0,
                '@keyframes fadeInLeft': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(-10px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0)'
                  }
                }
              }}
            >
              <MenuItemIcon active={isActive(item.path) ? 1 : 0}>
                {item.icon}
              </MenuItemIcon>
              <MenuItemText 
                primary={item.text} 
                active={isActive(item.path) ? 1 : 0}
              />
              {isActive(item.path) && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 12,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main
                  }}
                />
              )}
            </MenuListItem>
          ))}
          
          {/* Admin Panel button - only visible for admin users */}
          {isAdmin && (
            <MenuListItem
              button
              component={RouterLink}
              to="/admin"
              active={isActive('/admin') ? 1 : 0}
            >
              <MenuItemIcon active={isActive('/admin') ? 1 : 0}>
                <AdminPanelSettingsIcon />
              </MenuItemIcon>
              <MenuItemText 
                primary="Админ Панель" 
                active={isActive('/admin') ? 1 : 0}
              />
            </MenuListItem>
          )}

          {/* Раздел "Еще" с выпадающим списком */}
          <MenuListItem 
            button 
            onClick={toggleExpandMore}
          >
            <MenuItemIcon>
              {expandMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </MenuItemIcon>
            <MenuItemText primary="Еще" />
            <Box
              sx={{
                transform: `rotate(${expandMore ? 180 : 0}deg)`,
                transition: 'transform 0.3s ease',
                marginLeft: 1
              }}
            >
              <ExpandMoreIcon fontSize="small" sx={{ opacity: 0.6 }} />
            </Box>
          </MenuListItem>

          <Collapse in={expandMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {moreMenuItems.map((item, index) => (
                <MenuListItem
                  key={index}
                  button
                  component={RouterLink}
                  to={item.path}
                  active={isActive(item.path) ? 1 : 0}
                  sx={{ 
                    mb: 0.5,
                    py: 0.75,
                  }}
                  onClick={() => mobile && closeDrawer && closeDrawer()}
                >
                  <MenuItemIcon active={isActive(item.path) ? 1 : 0}>
                    {item.icon}
                  </MenuItemIcon>
                  <MenuItemText 
                    primary={item.text} 
                    active={isActive(item.path) ? 1 : 0}
                  />
                </MenuListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </FadeInBox>

      {/* Footer with version info */}
      <Box 
        sx={{ 
          mt: 'auto', 
          pt: 2, 
          opacity: 0.5, 
          textAlign: 'center',
          fontSize: '0.7rem',
          color: theme.palette.text.secondary
        }}
      >
        <Typography variant="caption" display="block" gutterBottom>
          K-Connect v2.0 React
        </Typography>
        <Typography variant="caption" display="block">
          Правообладателям
        </Typography>
        <Typography variant="caption" display="block">
          verif@k-connect.ru
        </Typography>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
