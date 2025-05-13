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
  useTheme,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Icon } from '@iconify/react';
import GavelIcon from '@mui/icons-material/Gavel';
import SettingsIcon from '@mui/icons-material/Settings';


const ProfileBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 140,
  width: '100vw',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.primary.dark,
  backgroundImage: 'linear-gradient(135deg, #6f57bd 0%, #8c54ff 100%)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: 0,
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
    opacity: 0.08,
    zIndex: 1
  }
}));

const BannerCurve = styled(Box)({
  position: 'absolute',
  bottom: -2,
  left: 0,
  right: 0,
  height: '40px',
  borderRadius: '50% 50% 0 0',
  zIndex: 3,
});

const ProfileAvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '-25px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  padding: '3px',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 125,
  height: 125,
  border: '3px solid',
  borderColor: theme.palette.background.paper,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.primary.main,
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.1rem',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));


const MenuSection = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  overflow: 'hidden', 
  marginBottom: theme.spacing(1.5),
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.6) 
    : 'rgba(250, 250, 252, 0.8)',
  boxSizing: 'border-box',
  width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 600,
  color: alpha(theme.palette.text.secondary, 0.7),
  padding: theme.spacing(1.5, 2, 0.7),
  textTransform: 'none',
  letterSpacing: '0.2px',
}));


const MenuListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.spacing(2.5),
  transition: 'all 0.15s ease',
  maxWidth: 'calc(100% - 8px)',
  margin: theme.spacing(0, 0.5),
  marginBottom: 2,
  width: 'auto',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.primary.main, 0.05),
    transform: 'translateX(2px)',
  },
  '& .MuiListItemText-root': {
    margin: 0,
    overflow: 'hidden',
    flexShrink: 1,
    minWidth: 0,
  },
  '& .MuiTypography-primary': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  '& .MuiTypography-secondary': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.7rem',
    color: alpha(theme.palette.text.secondary, 0.8),
  }
}));

const HighlightedMenuItem = styled(MenuListItem)(({ theme, color = 'primary' }) => ({
  backgroundColor: alpha(theme.palette[color].main, 0.06),
  margin: theme.spacing(0, 0.5),
  marginBottom: 2,
  maxWidth: 'calc(100% - 8px)',
  '&:hover': {
    backgroundColor: alpha(theme.palette[color].main, 0.1),
    transform: 'translateX(2px)',
  },
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '36px',
  color: theme.palette.text.primary,
  opacity: 0.85,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
  },
}));


const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  padding: theme.spacing(0.8, 1.5),
  flex: 1,
  minWidth: 0,
  marginBottom: 2,
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.9) : theme.palette.text.primary,
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.2) 
    : alpha(theme.palette.background.paper, 0.7),
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  textTransform: 'none',
  boxShadow: theme.palette.mode === 'dark' 
    ? 'none' 
    : '0 1px 2px rgba(0, 0, 0, 0.03)',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.25) 
      : alpha(theme.palette.background.paper, 0.85),
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  },
  '& .MuiButton-startIcon': {
    marginRight: 6,
    opacity: 0.8,
    minWidth: 18,
  },
  '& .MuiButton-endIcon': {
    marginLeft: 0,
    marginRight: 0,
    opacity: 0.7,
  }
}));


const BalanceButton = styled(ActionButton)(({ theme }) => ({
  '& .number': {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  '& .unit': {
    marginLeft: 3,
    fontWeight: 500
  }
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(8),
  padding: theme.spacing(1.5),
  textAlign: 'center',
  opacity: 0.8,
}));

const StatCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: alpha(theme.palette.primary.main, 0.06),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5),
  flex: 1,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
  }
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: theme.palette.primary.main,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));


const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  if (num < 1000) return num.toString();
  
  const units = ['', 'k', 'M', 'B'];
  const unit = Math.floor((num.toFixed(0).length - 1) / 3);
  const value = (num / Math.pow(1000, unit)).toFixed(1);
  

  return `${parseFloat(value)}${units[unit]}`;
};

const MorePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [userPoints, setUserPoints] = useState(0);
  const isAdmin = user?.id === 3; 
  const isChannel = user?.account_type === 'channel';
  const [isModeratorUser, setIsModeratorUser] = useState(false);
  const [lastModeratorCheck, setLastModeratorCheck] = useState(0);
  
  useEffect(() => {
    if (user) {
      checkModeratorStatus();
      fetchUserPoints();
    }
  }, [user]);

  const checkModeratorStatus = async () => {
    try {
      if (window._moderatorCheckInProgress) {
        console.log('MorePage: Moderator check already in progress, skipping...');
        return;
      }
      
      const now = Date.now();
      if (now - lastModeratorCheck < 15 * 60 * 1000) {
        console.log('MorePage: Using cached moderator status');
        return;
      }
      
      window._moderatorCheckInProgress = true;
      
      const response = await axios.get('/api/moderator/status');
      if (response.data && response.data.is_moderator) {
        setIsModeratorUser(true);
      } else {
        setIsModeratorUser(false);
      }
      
      setLastModeratorCheck(now);
    } catch (error) {
      console.error('Error checking moderator status:', error);
      setIsModeratorUser(false);
    } finally {
      window._moderatorCheckInProgress = false;
    }
  };
  
  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Ошибка при загрузке баллов:', error);
      setUserPoints(0);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      pb: 10, 
      position: 'relative', 
      overflow: 'hidden',
      px: { xs: 1.5, sm: 2 }
    }}>
      {/* Profile Banner */}
      <ProfileBanner>
        {user?.banner ? (
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
              zIndex: 0,
            }}
            onError={(e) => {
              console.error("Ошибка загрузки баннера");
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(135deg, 
                ${alpha(theme.palette.primary.dark, 0.9)} 0%, 
                ${alpha(theme.palette.primary.main, 0.8)} 50%,
                ${alpha(theme.palette.primary.light, 0.7)} 100%)`,
              backgroundSize: 'cover',
              zIndex: 0,
            }}
          />
        )}
        <BannerCurve sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff'
        }}/>
        <ProfileAvatarWrapper>
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
        </ProfileAvatarWrapper>
      </ProfileBanner>

      {/* Profile Info */}
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ProfileName variant="h5">
          {user?.name || 'Пользователь'}
          {user?.verification && user.verification.status > 0 && (
            <Icon 
              icon="solar:verified-check-bold" 
              width="18" 
              height="18"
              style={{ 
                marginLeft: '4px', 
                color: user.verification.status === 1 ? '#9e9e9e' : 
                      user.verification.status === 2 ? '#d67270' : 
                      user.verification.status === 3 ? '#b39ddb' : 
                      theme.palette.primary.main 
              }} 
            />
          )}
        </ProfileName>
        <Typography variant="body2" color="textSecondary" align="center">
          @{user?.username || 'username'}
        </Typography>
        
        {/* Primary Actions - Telegram/SwiftUI style */}
        <Box sx={{ 
          display: 'flex', 
          width: '100%', 
          gap: 1.2,
          mt: 1.5,
          mb: 0.5,
          px: { xs: 1, sm: 1.5 },
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <BalanceButton
            component={Link}
            to="/balance"
            startIcon={<Icon icon="solar:wallet-money-bold" width="18" height="18" />}
            sx={{ px: 1 }}
          >
            <span className="number">{formatNumber(userPoints)}</span>
            <span className="unit">баллов</span>
          </BalanceButton>
          
          <ActionButton
            component={Link}
            to="/badge-shop"
            startIcon={<Icon icon="solar:shop-bold" width="18" height="18" />}
            sx={{ px: 1 }}
          >
            Магазин
          </ActionButton>
          
          <ActionButton
            component={Link}
            to="/settings"
            startIcon={<SettingsIcon sx={{ fontSize: '1rem' }} />}
            sx={{ px: 1 }}
          >
            Настройки
          </ActionButton>
        </Box>
      </Box>

      {/* Social & Content */}
      <MenuSection>
        <SectionTitle>Социальное</SectionTitle>
        <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
          <MenuListItem button component={Link} to="/search">
            <MenuItemIcon>
              <Icon icon="solar:magnifer-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Поиск" />
          </MenuListItem>

          <MenuListItem button component={Link} to="/subscriptions">
            <MenuItemIcon>
              <Icon icon="solar:users-group-rounded-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Подписки" />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/channels">
            <MenuItemIcon>
              <Icon icon="solar:play-stream-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Каналы" />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/leaderboard">
            <MenuItemIcon>
              <Icon icon="solar:chart-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Рейтинг" />
          </MenuListItem>
        </List>
      </MenuSection>

      {/* Entertainment & Features */}
      <MenuSection>
        <SectionTitle>Развлечения</SectionTitle>
        <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
          {!isChannel && (
            <HighlightedMenuItem 
              button 
              component={Link} 
              to="/minigames"
              color="secondary"
            >
              <MenuItemIcon sx={{ color: theme.palette.secondary.main }}>
                <Icon icon="solar:gamepad-bold" width="20" height="20" />
              </MenuItemIcon>
              <ListItemText 
                primary="Мини-игры" 
              />
            </HighlightedMenuItem>
          )}
          
          <HighlightedMenuItem
            button 
            component={Link} 
            to="/username-auction"
          >
            <MenuItemIcon>
              <GavelIcon sx={{ fontSize: '1.1rem' }} />
            </MenuItemIcon>
            <ListItemText 
              primary="Аукцион юзернеймов"
              sx={{ flexShrink: 1, minWidth: 0 }}
            />
            <Chip 
              label="Новое" 
              size="small" 
              color="primary" 
              sx={{ 
                height: 18, 
                fontSize: '0.6rem',
                fontWeight: 'bold',
                flexShrink: 0,
                ml: 0.5,
                maxWidth: 55
              }} 
            />
          </HighlightedMenuItem>
          
          {!isChannel && (
            <MenuListItem button component={Link} to="/sub-planes">
              <MenuItemIcon>
                <Icon icon="solar:star-bold" width="20" height="20" />
              </MenuItemIcon>
              <ListItemText primary="Планы подписок" />
            </MenuListItem>
          )}
        </List>
      </MenuSection>

      {/* Admin Section */}
      {(isAdmin || isModeratorUser) && (
        <MenuSection>
          <SectionTitle>Администрирование</SectionTitle>
          <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
            {isModeratorUser && (
              <HighlightedMenuItem 
                button 
                component={Link} 
                to="/moderator"
                color="error"
              >
                <MenuItemIcon sx={{ color: theme.palette.error.main }}>
                  <Icon icon="solar:shield-star-bold" width="20" height="20" />
                </MenuItemIcon>
                <ListItemText primary="Модерация" />
              </HighlightedMenuItem>
            )}

            {isAdmin && (
              <MenuListItem button component={Link} to="/admin">
                <MenuItemIcon>
                  <Icon icon="solar:shield-user-bold" width="20" height="20" />
                </MenuItemIcon>
                <ListItemText primary="Админ-панель" />
              </MenuListItem>
            )}
          </List>
        </MenuSection>
      )}

      {/* Platform Section */}
      <MenuSection>
        <SectionTitle>Платформа</SectionTitle>
        <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
          {!isChannel && (
            <MenuListItem button component={Link} to="/bugs">
              <MenuItemIcon>
                <Icon icon="solar:bug-bold" width="20" height="20" />
              </MenuItemIcon>
              <ListItemText primary="Баг-репорты" />
            </MenuListItem>
          )}
          
          <MenuListItem button component={Link} to="/about" target="_blank" rel="noopener noreferrer">
            <MenuItemIcon>
              <Icon icon="solar:info-circle-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="О платформе" />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/rules" target="_blank" rel="noopener noreferrer">
            <MenuItemIcon>
              <Icon icon="solar:document-text-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Правила" />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/api-docs">
            <MenuItemIcon>
              <Icon icon="solar:code-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="API Документация" />
          </MenuListItem>
          
          <Divider sx={{ my: 1, mx: 2 }} />
          
          <MenuListItem button onClick={handleLogout}>
            <MenuItemIcon sx={{ color: theme.palette.error.main }}>
              <Icon icon="solar:logout-3-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText 
              primary="Выйти" 
              primaryTypographyProps={{ sx: { color: theme.palette.error.main } }}
            />
          </MenuListItem>
        </List>
      </MenuSection>

      {/* Footer */}
      <FooterSection>
        <Typography variant="caption" display="block" color="primary" sx={{ fontWeight: 500, mb: 0.5 }}>
          К-Коннект v2.6
        </Typography>
        <Typography variant="caption" display="block" color="textSecondary">
          verif@k-connect.ru
        </Typography>
      </FooterSection>
    </Container>
  );
};

export default MorePage; 