import React, { memo } from 'react';
import { Box, Typography, styled, useTheme, Chip } from '@mui/material';
import { useLanguage } from '../../../context/LanguageContext';
import { Icon } from '@iconify/react';

// Enhanced footer container with better styling
const FooterContainer = styled(Box)(({ theme, themecolor }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2, 1.5, 1.5),
  textAlign: 'center',
  position: 'relative',
  borderRadius: theme.spacing(1, 1, 0, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '2px',
    borderRadius: '1px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.spacing(1, 1, 0, 0),
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.5, 1, 1),
  }
}));

// Enhanced typography with better styling
const FooterTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
  fontSize: {
    xs: '0.65rem',
    sm: '0.7rem',
    md: '0.75rem'
  },
  fontWeight: 400,
  letterSpacing: '0.3px',
  transition: 'color 0.2s ease-in-out',
  '&:hover': {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
  }
}));

// Version chip with enhanced styling
const VersionChip = styled(Chip)(({ theme, themecolor }) => ({
  background: `linear-gradient(135deg, ${themecolor || theme.palette.primary.main}20, ${themecolor || theme.palette.primary.main}10)`,
  border: `1px solid ${themecolor || theme.palette.primary.main}30`,
  color: themecolor || theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.7rem',
  height: '24px',
  '& .MuiChip-label': {
    padding: theme.spacing(0, 1),
  },
  '&:hover': {
    background: `linear-gradient(135deg, ${themecolor || theme.palette.primary.main}30, ${themecolor || theme.palette.primary.main}20)`,
    transform: 'translateY(-1px)',
    boxShadow: `0 2px 8px ${themecolor || theme.palette.primary.main}20`,
  },
  transition: 'all 0.2s ease-in-out',
}));

// Enhanced title typography
const FooterTitle = styled(Typography)(({ theme, themecolor }) => ({
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)',
  marginBottom: theme.spacing(1),
  letterSpacing: '0.5px',
  fontSize: {
    xs: '0.75rem',
    sm: '0.8rem',
    md: '0.85rem',
  },
  textShadow: theme.palette.mode === 'dark' 
    ? `0 1px 2px ${themecolor || theme.palette.primary.main}20`
    : 'none',
}));

// Contact info container
const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.3),
  marginTop: theme.spacing(1),
  padding: theme.spacing(1, 0),
  borderTop: `1px solid ${theme.palette.divider}30`,
}));

const areEqual = (prevProps, nextProps) => {
  return prevProps.primaryColor === nextProps.primaryColor;
};

const SidebarFooter = ({ primaryColor }) => {
  const theme = useTheme();
  const { t } = useLanguage();
  
  return (
    <FooterContainer themecolor={primaryColor}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <FooterTitle variant="subtitle2" themecolor={primaryColor}>
          {t('sidebar.footer.version')}
        </FooterTitle>
        
        <VersionChip 
          label="v2.9" 
          size="small" 
          themecolor={primaryColor}
          icon={<Icon icon="solar:star-bold" width="12" height="12" />}
        />
        
        <ContactInfo>
          <FooterTypography variant="caption" display="block">
            {t('sidebar.footer.copyright')}
          </FooterTypography>
          <FooterTypography variant="caption" display="block">
            {t('sidebar.footer.email')}
          </FooterTypography>
        </ContactInfo>
      </Box>
    </FooterContainer>
  );
};

export default memo(SidebarFooter, areEqual); 