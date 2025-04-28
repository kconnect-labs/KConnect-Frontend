import React, { useContext } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import BrushIcon from '@mui/icons-material/Brush';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useTheme } from '@mui/material/styles';
import { ThemeSettingsContext } from '../App';

const SettingsBottomNavigation = ({ activeTab, onTabChange, user }) => {
  const navigate = useNavigate();
  const isChannel = user?.account_type === 'channel';
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);

  // Set background color from theme settings
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
        value={activeTab}
        onChange={(event, newValue) => {
          if (newValue === -1) {
            navigate(-1); // Go back
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