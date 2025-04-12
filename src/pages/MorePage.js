import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Avatar, 
  Container, 
  Button, 
  Divider,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Иконки
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import BugReportIcon from '@mui/icons-material/BugReport';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GavelIcon from '@mui/icons-material/Gavel';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ApiIcon from '@mui/icons-material/Api';

// Стилизованные компоненты
const ProfileBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 160,
  width: '100%',
  backgroundColor: theme.palette.primary.dark,
  backgroundImage: 'linear-gradient(135deg, #6f57bd 0%, #8c54ff 100%)',
  borderRadius: '0 0 24px 24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(7),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/static/img/pattern.png)',
    backgroundSize: '200px',
    backgroundRepeat: 'repeat',
    opacity: 0.1,
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 90,
  height: 90,
  border: '4px solid',
  borderColor: theme.palette.background.paper,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  position: 'absolute',
  bottom: -40,
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.primary.main,
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.4rem',
  textAlign: 'center',
  marginTop: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const MenuListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '40px',
  color: theme.palette.text.primary,
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  marginTop: 'auto',
  padding: theme.spacing(2, 3),
  textAlign: 'center',
}));

const MorePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [userPoints, setUserPoints] = useState(0);
  
  // Проверяем является ли пользователь админом
  const isAdmin = user?.id === 3; // Такое же условие как в Sidebar.js
  
  // Проверяем, является ли пользователь модератором
  const [isModeratorUser, setIsModeratorUser] = useState(false);
  // Кэш и время последней проверки модератора
  const [lastModeratorCheck, setLastModeratorCheck] = useState(0);
  
  useEffect(() => {
    if (user) {
      checkModeratorStatus();
      fetchUserPoints();
    }
  }, [user]);

  const checkModeratorStatus = async () => {
    try {
      // Проверяем, не выполняется ли уже проверка
      if (window._moderatorCheckInProgress) {
        console.log('MorePage: Moderator check already in progress, skipping...');
        return;
      }
      
      // Используем кэш, если проверка была недавно (в течение 15 минут)
      const now = Date.now();
      if (now - lastModeratorCheck < 15 * 60 * 1000) {
        console.log('MorePage: Using cached moderator status');
        return;
      }
      
      // Устанавливаем флаг, что проверка выполняется
      window._moderatorCheckInProgress = true;
      
      const response = await axios.get('/api/moderator/status');
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
  
  // Функция для получения баланса пользователя
  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Ошибка при загрузке баллов:', error);
      setUserPoints(0);
    }
  };
  
  // Функция для выхода из аккаунта
  const handleLogout = async () => {
    try {
      await logout();
      // Logout and redirect handled in AuthContext
    } catch (error) {
      // Fallback if logout from AuthContext fails
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 10 }}>
      <ProfileBanner>
        {user?.banner && (
          <Box
            component="img"
            src={user.banner_url || `/static/uploads/banner/${user.id}/${user.banner}`}
            alt="Баннер"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              console.error("Ошибка загрузки баннера");
              e.target.style.display = 'none';
            }}
          />
        )}
        <ProfileAvatar
          src={user?.avatar_url || (user?.photo && `/static/uploads/avatar/${user.id}/${user.photo}`)}
          alt={user?.name}
          onError={(e) => {
            console.error("Ошибка загрузки аватара");
            e.target.src = `/static/uploads/avatar/system/avatar.png`;
          }}
        >
          {user?.name ? user.name.charAt(0) : '?'}
        </ProfileAvatar>
      </ProfileBanner>

      {/* Информация о профиле */}
      <Box sx={{ mb: 4, px: 2 }}>
        <ProfileName variant="h5">
          {user?.name || 'Пользователь'}
          {user?.verification && user.verification.status > 0 && (
            <VerifiedIcon 
              sx={{ 
                ml: 0.5, 
                color: user.verification.status === 1 ? '#9e9e9e' : 
                       user.verification.status === 2 ? '#d67270' : 
                       user.verification.status === 3 ? '#b39ddb' : 
                       'primary.main'
              }} 
            />
          )}
          {user?.achievement && (
            <Box 
              component="img" 
              sx={{ 
                width: 24, 
                height: 24, 
                ml: 0.5 
              }} 
              src={`/bages/${user.achievement.image_path}`} 
              alt={user.achievement.bage}
              onError={(e) => {
                console.error("Ошибка загрузки достижения");
                e.target.style.display = 'none';
              }}
            />
          )}
        </ProfileName>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 0.5 }}>
          @{user?.username || 'username'}
        </Typography>
        
        {/* Кнопка редактирования профиля */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            component={Link}
            to="/settings"
            sx={{
              borderRadius: '12px',
              padding: '8px 20px',
              textTransform: 'none',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Редактировать профиль
          </Button>
        </Box>
      </Box>

      {/* Меню */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          mb: 2
        }}
      >
        <List sx={{ p: 1 }}>
          {/* Баланс и Магазин в одном блоке */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              borderRadius: '36px', 
              overflow: 'hidden'
            }}
          >
            <MenuListItem 
              button 
              component={Link} 
              to="/balance"
              sx={{
                flex: 1,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
                mb: 0,
                borderRadius: '36px'
              }}
            >
              <MenuItemIcon>
                <AccountBalanceWalletIcon />
              </MenuItemIcon>
              <ListItemText 
                primary="Баланс"
                secondary={`${userPoints} баллов`}
                primaryTypographyProps={{ fontSize: '0.95rem' }}
                secondaryTypographyProps={{ fontSize: '0.85rem' }}
              />
            </MenuListItem>

            <MenuListItem
              button
              component={Link}
              to="/badge-shop"
              sx={{
                flex: 1,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
                mb: 0,
                borderRadius: '36px'
              }}
            >
              <MenuItemIcon>
                <StorefrontIcon />
              </MenuItemIcon>
              <ListItemText 
                primary="Магазин"
                secondary="Бейджики"
                primaryTypographyProps={{ fontSize: '0.95rem' }}
                secondaryTypographyProps={{ fontSize: '0.85rem' }}
              />
            </MenuListItem>
          </Box>

          <MenuListItem button component={Link} to="/search">
            <MenuItemIcon>
              <SearchIcon />
            </MenuItemIcon>
            <ListItemText primary="Поиск" />
          </MenuListItem>

          <MenuListItem button component={Link} to="/leaderboard">
            <MenuItemIcon>
              <LeaderboardIcon />
            </MenuItemIcon>
            <ListItemText primary="Лидерборд" />
          </MenuListItem>
          <MenuListItem button component={Link} to="/subscriptions">
            <MenuItemIcon>
              <PeopleIcon />
            </MenuItemIcon>
            <ListItemText primary="Подписки" />
          </MenuListItem>
          
          {/* Кнопка "Правила" */}
          <MenuListItem button component={Link} to="/rules">
            <MenuItemIcon>
              <GavelIcon />
            </MenuItemIcon>
            <ListItemText primary="Правила" />
          </MenuListItem>
          
          {/* API Документация */}
          <MenuListItem button component={Link} to="/api-docs">
            <MenuItemIcon>
              <ApiIcon />
            </MenuItemIcon>
            <ListItemText primary="API Документация" />
          </MenuListItem>
          
          {/* Moderator Panel button - only visible if user is a moderator */}
          {isModeratorUser && (
            <MenuListItem 
              button 
              component={Link} 
              to="/moderator"
              sx={{ 
                background: alpha('#f44336', 0.08),
                '&:hover': {
                  backgroundColor: alpha('#f44336', 0.1),
                }
              }}
            >
              <MenuItemIcon sx={{ color: '#f44336' }}>
                <SupervisorAccountIcon />
              </MenuItemIcon>
              <ListItemText 
                primary="Модерировать" 
                primaryTypographyProps={{ 
                  sx: { 
                    color: '#f44336',
                    fontWeight: 600
                  } 
                }}
              />
            </MenuListItem>
          )}

          <MenuListItem button component={Link} to="/bugs">
            <MenuItemIcon>
              <BugReportIcon />
            </MenuItemIcon>
            <ListItemText primary="Баг-репорты" />
          </MenuListItem>

          {/* Админ-панель только для админов */}
          {isAdmin && (
            <MenuListItem button component={Link} to="/admin">
              <MenuItemIcon>
                <AdminPanelSettingsIcon />
              </MenuItemIcon>
              <ListItemText primary="Админ-панель" />
            </MenuListItem>
          )}
        </List>
      </Paper>

      {/* Кнопка выхода */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          mb: 4
        }}
      >
        <List sx={{ p: 1 }}>
          <MenuListItem button onClick={handleLogout}>
            <MenuItemIcon sx={{ color: 'error.main' }}>
              <LogoutIcon />
            </MenuItemIcon>
            <ListItemText 
              primary="Выйти из аккаунта" 
              primaryTypographyProps={{ 
                sx: { color: 'error.main' } 
              }}
            />
          </MenuListItem>
        </List>
      </Paper>

      {/* Подвал */}
      <FooterSection>
        <Typography variant="caption" display="block" gutterBottom sx={{ fontWeight: 500, color: alpha(theme.palette.primary.main, 0.85) }}>
          K-Connect v2.2 React
        </Typography>
        <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>
          Правообладателям
        </Typography>
        <Typography variant="caption" display="block" sx={{ opacity: 0.7, pt: 0.5 }}>
          verif@k-connect.ru
        </Typography>
      </FooterSection>
    </Container>
  );
};

export default MorePage; 