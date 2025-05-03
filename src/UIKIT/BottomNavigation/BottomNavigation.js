import React, { useContext } from 'react';
import { Paper, BottomNavigation as MuiBottomNavigation, BottomNavigationAction } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeSettingsContext } from '../../App';

const UIBottomNavigation = ({ 
  value, 
  onChange, 
  children, 
  id,
  sx = {}
}) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);

  // Set background color from theme settings
  const bottomNavColor = themeSettings.bottomNavColor || theme.palette.background.paper;
  const borderColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <Paper 
      id={id}
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
        backdropFilter: 'blur(10px)',
        ...sx
      }} 
      elevation={3}
    >
      <MuiBottomNavigation
        value={value}
        onChange={onChange}
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
        {children}
      </MuiBottomNavigation>
    </Paper>
  );
};

export default UIBottomNavigation; 