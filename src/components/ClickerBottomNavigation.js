import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const ClickerBottomNavigation = ({ activeSection, onSectionChange }) => {
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
        value={activeSection}
        onChange={(event, newValue) => {
          if (newValue === 'back') {
            navigate(-1); 
          } else {
            onSectionChange(newValue);
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
          value="back"
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
          value="click"
          label="Кликер"
          icon={<Icon icon="material-symbols:touch-app" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value="shop"
          label="Магазин"
          icon={<Icon icon="solar:shop-2-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value="stats"
          label="Статистика"
          icon={<Icon icon="solar:chart-2-bold" width="28" height="28" />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        <BottomNavigationAction 
          value="leaderboard"
          label="Лидеры"
          icon={<Icon icon="material-symbols:leaderboard" width="28" height="28" />}
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

export default ClickerBottomNavigation; 