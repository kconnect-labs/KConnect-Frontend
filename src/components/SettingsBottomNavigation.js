import React, { useContext } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import BrushIcon from '@mui/icons-material/Brush';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useTheme } from '@mui/material/styles';
import { ThemeSettingsContext } from '../App';

const SettingsBottomNavigation = ({ activeTab, onTabChange, user, isMobile }) => {
  // SettingsBottomNavigation рендерится только на мобильных устройствах
  if (!isMobile) {
    return null;
  }
  const navigate = useNavigate();
  const isChannel = user?.account_type === 'channel';
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
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
      }} 
      elevation={0}
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
          icon={<BrushIcon sx={{ fontSize: 28 }} />}
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        {!isChannel && (
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
        )}
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
        {!isChannel && (
          <BottomNavigationAction 
            value={4}
            icon={<AlternateEmailIcon sx={{ fontSize: 28 }} />}
            sx={{ 
              minWidth: 'auto',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.8rem'
              }
            }}
          />
        )}
        {!isChannel && (
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
        )}
      </BottomNavigation>
    </Paper>
  );
};

export default SettingsBottomNavigation; 