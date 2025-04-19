import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';

const BadgeShopBottomNavigation = ({ tabValue, onTabChange }) => {
  const navigate = useNavigate();

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(26,26,26,0.95) 100%)',
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
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main'
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