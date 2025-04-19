import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(to bottom, #131313, #1a1a1a)',
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: '10rem',
  fontWeight: 'bold',
  background: 'linear-gradient(to right, #D0BCFF, #9A7ACE)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 10px 30px rgba(208, 188, 255, 0.3)',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '6rem',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  background: 'linear-gradient(to right, #9A7ACE, #D0BCFF)',
  color: 'white',
  padding: '12px 32px',
  borderRadius: theme.shape.borderRadius * 2,
  fontSize: '1rem',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(to right, #D0BCFF, #E9DDFF)',
  },
}));

const NotFound = () => {
  return (
    <NotFoundContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorCode variant="h1">404</ErrorCode>
        
        <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
          Страница не найдена
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#C2C2C2', maxWidth: 500, mx: 'auto' }}>
          К сожалению, страница, которую вы искали, не существует или была перемещена.
        </Typography>
        
        <StyledButton component={Link} to="/" variant="contained">
          Вернуться на главную
        </StyledButton>
      </motion.div>
    </NotFoundContainer>
  );
};

export default NotFound; 