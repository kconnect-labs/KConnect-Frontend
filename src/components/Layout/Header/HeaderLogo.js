import React from 'react';
import { Box, Typography, useTheme, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoSVG } from '../../../assets/Logo.svg';

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(1),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
}));

const HeaderLogo = ({ isMobile, t }) => {
  const theme = useTheme();
  return (
    <LogoSection>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
        <LogoSVG style={{ height: 32, width: 'auto' }} />
        {!isMobile && (
          <LogoText>
            <Box component="span" sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black', opacity: 0.9 }}>
              {t('header.logo.text')}
            </Box>
          </LogoText>
        )}
      </Link>
    </LogoSection>
  );
};

export default HeaderLogo; 