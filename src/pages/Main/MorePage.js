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
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Icon } from '@iconify/react';


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

      
      <Box sx={{ mb: 4, px: 2 }}>
        <ProfileName variant="h5">
          {user?.name || 'Пользователь'}
          {user?.verification && user.verification.status > 0 && (
            <Icon 
              icon="solar:verified-check-bold" 
              width="24" 
              height="24"
              style={{ 
                marginLeft: '4px', 
                color: user.verification.status === 1 ? '#9e9e9e' : 
                      user.verification.status === 2 ? '#d67270' : 
                      user.verification.status === 3 ? '#b39ddb' : 
                      theme.palette.primary.main 
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
        
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Icon icon="solar:pen-bold" width="20" height="20" />}
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

      
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          mb: 2
        }}
      >
        <List sx={{ p: 1 }}>
          
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
                <Icon icon="solar:wallet-money-bold" width="24" height="24" />
              </MenuItemIcon>
              <ListItemText 
                primary="Баланс"
                secondary={`${userPoints} баллов`}
                primaryTypographyProps={{ fontSize: '0.8rem' }}
                secondaryTypographyProps={{ fontSize: '0.55rem' }}
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
                <Icon icon="solar:shop-bold" width="24" height="24" />
              </MenuItemIcon>
              <ListItemText 
                primary="Магазин"
                secondary="Бейджики"
                primaryTypographyProps={{ fontSize: '0.8rem' }}
                secondaryTypographyProps={{ fontSize: '0.55rem' }}
              />
            </MenuListItem>
          </Box>

          <MenuListItem button component={Link} to="/search">
            <MenuItemIcon>
              <Icon icon="solar:magnifer-bold" width="24" height="24" />
            </MenuItemIcon>
            <ListItemText primary="Поиск" />
          </MenuListItem>

          <MenuListItem button component={Link} to="/subscriptions">
            <MenuItemIcon>
              <Icon icon="solar:users-group-rounded-bold" width="24" height="24" />
            </MenuItemIcon>
            <ListItemText primary="Подписки" />
          </MenuListItem>

          
          {!isChannel && (
            <MenuListItem 
              button 
              component={Link} 
              to="/minigames"
              sx={{
                backgroundColor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.secondary.dark, 0.15)
                  : alpha(theme.palette.secondary.light, 0.15),
                borderRadius: '16px',
                mb: 2
              }}
            >
              <MenuItemIcon sx={{ color: theme.palette.secondary.main }}>
                <Icon icon="solar:gamepad-bold" width="24" height="24" />
              </MenuItemIcon>
              <ListItemText 
                primary="Мини-игры" 
                secondary="Кликер, Три чаши и другие"
                primaryTypographyProps={{ 
                  sx: { 
                    color: theme.palette.secondary.main,
                    fontWeight: 600
                  }
                }}
              />
            </MenuListItem>
          )}
          
          
          {!isChannel && (
            <MenuListItem button component={Link} to="/sub-planes">
              <MenuItemIcon>
                <Icon icon="solar:star-bold" width="24" height="24" />
              </MenuItemIcon>
              <ListItemText primary="Планы подписок" />
            </MenuListItem>
          )}
          
          
          {!isChannel && (
            <MenuListItem button component={Link} to="/leaderboard">
              <MenuItemIcon>
                <Icon icon="solar:chart-bold" width="24" height="24" />
              </MenuItemIcon>
              <ListItemText primary="Лидерборд" />
            </MenuListItem>
          )}
          
          {/* Добавляем кнопку для перехода на каналы */}
          <MenuListItem button component={Link} to="/channels">
            <MenuItemIcon>
              <Icon icon="solar:play-stream-bold" width="24" height="24" />
            </MenuItemIcon>
            <ListItemText primary="Каналы" />
          </MenuListItem>
          
          {!isChannel && (
            <MenuListItem button component={Link} to="/bugs">
              <MenuItemIcon>
                <Icon icon="solar:bug-bold" width="24" height="24" />
              </MenuItemIcon>
              <ListItemText primary="Баг-репорты" />
            </MenuListItem>
          )}
          
          
          <MenuListItem button component={Link} to="/about" target="_blank" rel="noopener noreferrer">
            <MenuItemIcon>
              <Icon icon="solar:info-circle-bold" width="24" height="24" />
            </MenuItemIcon>
            <ListItemText primary="О платформе" />
          </MenuListItem>
          
          
          <MenuListItem button component={Link} to="/rules" target="_blank" rel="noopener noreferrer">
            <MenuItemIcon>
              <Icon icon="solar:document-text-bold" width="24" height="24" />
            </MenuItemIcon>
            <ListItemText primary="Правила" />
          </MenuListItem>
          
{/*           
          <MenuListItem button component={Link} to="/api-docs">
            <MenuItemIcon>
              <Icon icon="solar:code-bold" width="24" height="24" />
            </MenuItemIcon>
            <ListItemText primary="API Документация" />
          </MenuListItem> */}
          
          
          {(isAdmin || isModeratorUser) && (
            <>
              
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
                    <Icon icon="solar:shield-star-bold" width="24" height="24" style={{ color: '#f44336' }} />
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

              
              {isAdmin && (
                <MenuListItem button component={Link} to="/admin">
                  <MenuItemIcon>
                    <Icon icon="solar:shield-user-bold" width="24" height="24" />
                  </MenuItemIcon>
                  <ListItemText primary="Админ-панель" />
                </MenuListItem>
              )}
            </>
          )}
        </List>
      </Paper>

      
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
              <Icon icon="solar:logout-3-bold" width="24" height="24" style={{ color: theme.palette.error.main }} />
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

      
      <FooterSection>
        <Typography variant="caption" display="block" gutterBottom sx={{ fontWeight: 500, color: alpha(theme.palette.primary.main, 0.85) }}>
          К-Коннект v2.5 React
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