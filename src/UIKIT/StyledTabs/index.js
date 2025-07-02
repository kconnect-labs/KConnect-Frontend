import React from 'react';
import { Tabs, Tab, Box, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const getTabsContainerStyle = (customStyle, theme, fullWidth) => {
  if (customStyle) {
    return {
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      backgroundImage: 'unset',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      mb: 1,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      width: fullWidth ? '100%' : 'auto',
      maxWidth: fullWidth ? 'none' : 750,
      minWidth: 320,
      mx: 'auto',
      position: 'relative',
      zIndex: 2,
    };
  }
  return {
    borderRadius: '16px',
    background: 'rgba(26,26,26, 0.03)',
    backdropFilter: 'blur(20px)',
    backgroundImage: 'unset',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    mb: 1,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: fullWidth ? '100%' : 'auto',
    maxWidth: fullWidth ? 'none' : 750,
    minWidth: 320,
    mx: 'auto',
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      left: -80,
      top: '50%',
      transform: 'translateY(-50%) rotate(-12deg)',
      width: 180,
      height: 220,
      background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
      opacity: 0.25,
      filter: 'blur(18px)',
      borderRadius: '50%',
      zIndex: 1,
      pointerEvents: 'none',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      right: -80,
      top: '50%',
      transform: 'translateY(-50%) rotate(12deg)',
      width: 180,
      height: 220,
      background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
      opacity: 0.25,
      filter: 'blur(18px)',
      borderRadius: '50%',
      zIndex: 1,
      pointerEvents: 'none',
    },
    zIndex: 2,
  };
};

const StyledTabsContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'customStyle',
})(({ theme, fullWidth = false, customStyle = false }) => getTabsContainerStyle(customStyle, theme, fullWidth));

const StyledTabs = ({ 
  value, 
  onChange, 
  tabs, 
  variant = 'standard',
  centered = false,
  fullWidth = false,
  customStyle = false,
  ...props 
}) => {
  const theme = useTheme();

  return (
    <StyledTabsContainer fullWidth={fullWidth} customStyle={customStyle}>
      <Tabs
        value={value}
        onChange={onChange}
        variant={variant}
        centered={centered}
        sx={{ 
          '& .MuiTab-root': {
            color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            background: 'rgba(26,26,26, 0.03)',
            backdropFilter: 'blur(20px)',
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: 0,
            minHeight: 48,
            transition: 'color 0.2s',
            '&.Mui-selected': {
              color: theme => theme.palette.primary.main,
              backgroundColor: 'rgba(26,26,26, 0.1)',
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#D0BCFF',
            height: 3,
            borderRadius: '3px',
            transition: 'all 0.2s',
          },
          minHeight: 48,
        }}
        {...props}
      >
        {tabs.map((tab, index) => {
          const IconComponent = tab.icon;
          return (
            <Tab
              key={`${tab.value}-${tab.label}`}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {IconComponent && <IconComponent sx={{ mr: 1 }} />}
                  {tab.label}
                </Box>
              }
              value={tab.value}
            />
          );
        })}
      </Tabs>
    </StyledTabsContainer>
  );
};

export default StyledTabs; 