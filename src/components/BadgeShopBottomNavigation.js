import React, { useContext } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import { useTheme } from '@mui/material/styles';
import { ThemeSettingsContext } from '../App';

const BadgeShopBottomNavigation = ({ tabValue, onTabChange }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);

  
  const bottomNavColor = themeSettings.bottomNavColor || theme.palette.background.paper;
  const borderColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
        borderTop: `1px solid ${borderColor}`,
        backgroundColor: bottomNavColor,
        backgroundImage: 'unset',
        backdropFilter: 'blur(10px)'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={tabValue}
        onChange={(event, newValue) => {
          if (newValue === -1) {
            navigate(-1); 
          } else {
            onTabChange(event, newValue);
          }
        }}
        sx={{
          bgcolor: 'transparent',
          height: 75,
          '& .MuiBottomNavigationAction-root': {
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.secondary,
            '&.Mui-selected': {
              color: themeSettings.primaryColor || theme.palette.primary.main
            }
          }
        }}
      >
        <BottomNavigationAction 
          value={-1}
          icon={<Icon icon="solar:arrow-left-bold" width="28" height="28" />}
          sx={{ minWidth: 'auto' }}
        />
        <BottomNavigationAction 
          value={0}
          icon={<Icon icon="solar:star-bold" width="28" height="28" />}
          sx={{ minWidth: 'auto' }}
        />
        <BottomNavigationAction 
          value={1}
          icon={<Icon icon="solar:user-circle-bold" width="28" height="28" />}
          sx={{ minWidth: 'auto' }}
        />
        <BottomNavigationAction 
          value={2}
          icon={<Icon icon="solar:cart-large-bold" width="28" height="28" />}
          sx={{ minWidth: 'auto' }}
        />
        <BottomNavigationAction 
          value={3}
          icon={<Icon icon="solar:tag-price-bold" width="28" height="28" />}
          sx={{ minWidth: 'auto' }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BadgeShopBottomNavigation; 