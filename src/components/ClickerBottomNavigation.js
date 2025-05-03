import React, { useContext } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import { ThemeSettingsContext } from '../App';

const ClickerBottomNavigation = ({ activeSection, onSectionChange }) => {
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
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.secondary,
            '&.Mui-selected': {
              color: themeSettings.primaryColor || theme.palette.primary.main
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