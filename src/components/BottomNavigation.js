import React, { useEffect, useState, useContext } from 'react';
import { Paper, BottomNavigation as MuiBottomNavigation, BottomNavigationAction, alpha } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import { ThemeSettingsContext } from '../App';


export const BOTTOM_NAV_ID = 'app-bottom-navigation';

const AppBottomNavigation = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visibleInMessenger, setVisibleInMessenger] = useState(true);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const theme = useTheme();
  
  
  const isChannel = user?.account_type === 'channel';
  
  
  useEffect(() => {
    const handleMessengerLayoutChange = (event) => {
      const { isInChat } = event.detail;
      console.log('Bottom navigation received layout change event:', isInChat ? 'in chat' : 'not in chat');
      setVisibleInMessenger(!isInChat);
    };
    
    
    document.addEventListener('messenger-layout-change', handleMessengerLayoutChange);
    
    
    return () => {
      document.removeEventListener('messenger-layout-change', handleMessengerLayoutChange);
    };
  }, []);
  
  
  const isInMessenger = location.pathname.startsWith('/messenger');
  if (isInMessenger && !visibleInMessenger) {
    console.log('Bottom navigation hidden in messenger chat');
    return null;
  }
  
  
  const authPages = ['/login', '/register', '/register/profile', '/confirm-email'];
  const isAuthPage = authPages.some(path => location.pathname.startsWith(path));
  const isSettingsPage = location.pathname.startsWith('/settings');
  const isBadgeShopPage = location.pathname.startsWith('/badge-shop');
  
  
  if (isAuthPage || isSettingsPage || isBadgeShopPage) {
    return null;
  }
  

  const getCurrentValue = () => {
    const path = location.pathname;
    if (path === '/' || path === '/feed' || path === '/main') return 0;
    if (path === '/music') return 1;
    if (path.startsWith('/messenger')) return 2;
    if (path.startsWith('/profile')) return 3;
    if (path === '/more') return 4;
    return false;
  };

  console.log("BottomNavigation rendering, user:", user, "pathname:", location.pathname);

  
  const handleNavigationChange = (event, newValue) => {
    switch(newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/music');
        break;
      case 2:
        navigate('/messenger');
        break;
      case 3:
        navigate(user ? `/profile/${user.username}` : '/login');
        break;
      case 4:
        
        navigate('/more');
        break;
      default:
        break;
    }
  };

  // Get appropriate colors based on theme mode
  const getBackgroundColor = () => {
    switch (theme.palette.mode) {
      case 'light':
        return alpha(theme.palette.background.paper, 0.9);
      case 'contrast':
        return '#101010';
      default: // dark
        return '#121212cf';
    }
  };

  const borderColor = theme.palette.mode === 'light' 
    ? alpha(theme.palette.divider, 0.1)
    : theme.palette.mode === 'contrast'
      ? alpha(theme.palette.common.white, 0.15)
      : alpha(theme.palette.common.white, 0.1);

  const textColor = theme.palette.mode === 'light'
    ? alpha(theme.palette.text.primary, 0.7)
    : theme.palette.mode === 'contrast'
      ? alpha(theme.palette.common.white, 0.9)
      : 'rgb(214 209 227 / 77%)';

  return (
    <Paper 
      id={BOTTOM_NAV_ID}
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
        borderTop: `1px solid ${borderColor}`,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
      }} 
      elevation={0}
    >
      <MuiBottomNavigation
        value={getCurrentValue()}
        onChange={handleNavigationChange}
        sx={{
          bgcolor: 'transparent',
          height: 75,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginTop: '10px',
          '& .MuiBottomNavigationAction-root': {
            color: textColor,
            '&.Mui-selected': {
              color: themeSettings.primaryColor || theme.palette.primary.main
            }
          }
        }}
      >
        <BottomNavigationAction 
          label="Лента" 
          icon={<Icon icon="solar:home-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          label="Музыка" 
          icon={<Icon icon="solar:music-notes-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          label="Мессенджер" 
          icon={<Icon icon="solar:chat-round-dots-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          label="Профиль" 
          icon={<Icon icon="solar:user-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          label="Еще" 
          icon={<Icon icon="solar:widget-2-bold" width="28" height="28" sx={{
            transform: 'scale(1.1)',
            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))',
          }} />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default AppBottomNavigation; 