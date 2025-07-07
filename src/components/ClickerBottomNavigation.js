import React, { useContext } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import { ThemeSettingsContext } from '../App';

const ClickerBottomNavigation = ({ activeSection, onSectionChange, isMobile }) => {
  // ClickerBottomNavigation рендерится только на мобильных устройствах
  if (!isMobile) {
    return null;
  }
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);

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
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
        borderTop: `1px solid ${borderColor}`,
        backgroundColor: getBackgroundColor(),
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