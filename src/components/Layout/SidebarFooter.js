import React, { memo } from 'react';
import { Box, Typography, styled, useTheme } from '@mui/material';


const FooterContainer = styled(Box)(({ theme, themecolor }) => ({
  marginTop: 'auto',
  padding: theme.spacing(1.5, 1, 0.8),
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: '1px',
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)`
      : `linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)`,
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.2, 1, 0.6),
  }
}));


const FooterTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  fontSize: {
    xs: '0.6rem',
    sm: '0.65rem',
    md: '0.7rem'
  }
}));


const areEqual = (prevProps, nextProps) => {
  return prevProps.primaryColor === nextProps.primaryColor;
};

const SidebarFooter = ({ primaryColor }) => {
  const theme = useTheme();
  
  return (
    <FooterContainer themecolor={primaryColor}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontWeight: 500, 
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
          mb: 0.8,
          letterSpacing: '0.4px',
          fontSize: {
            xs: '0.7rem',
            sm: '0.75rem',
            md: '0.8rem',
          }
        }}
      >
        К-Коннект v2.6
      </Typography>
      <FooterTypography variant="caption" display="block">
        Правообладателям
      </FooterTypography>
      <FooterTypography variant="caption" display="block" sx={{ pt: 0.2 }}>
        verif@k-connect.ru
      </FooterTypography>
    </FooterContainer>
  );
};

export default memo(SidebarFooter, areEqual); 