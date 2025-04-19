import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const SettingsBottomNavigation = ({ activeTab, onTabChange }) => {
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
        value={activeTab}
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
          label="Назад" 
          icon={<Icon icon="solar:arrow-left-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value={0}
          icon={<Icon icon="solar:user-circle-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value={1}
          icon={<Icon icon="solar:brush-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value={2}
          icon={<Icon icon="solar:bell-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value={3}
          icon={<Icon icon="solar:medal-ribbon-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value={4}
          icon={<Icon icon="solar:at-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value={5}
          icon={<Icon icon="solar:lock-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default SettingsBottomNavigation; 