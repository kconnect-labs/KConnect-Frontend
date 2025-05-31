import React from 'react';
import { Box, Typography, Button, Grid, Container, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  background: '#111111',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  background: 'linear-gradient(to right, #9A7ACE, #D0BCFF)',
  color: 'white',
  padding: '12px 32px',
  borderRadius: theme.shape.borderRadius * 2,
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(to right, #D0BCFF, #E9DDFF)',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(208, 188, 255, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: '900',
  letterSpacing: '-0.5px',
  color: 'white',
  textShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
    textAlign: 'center',
  },
}));

const SubText = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1.1rem',
  marginBottom: theme.spacing(4),
  maxWidth: 400,
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    fontSize: '1rem',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const NotFound = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <NotFoundContainer>
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          {isMobile ? (
            
            <>
              <Grid item xs={12} component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <ImageContainer>
                  <Box
                    component="img"
                    src="/static/404/404.jpg"
                    alt="404"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: 300,
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </ImageContainer>
              </Grid>
              <Grid item xs={12} component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                <Box textAlign="center">
                  <ErrorText variant="h1">
                    СТРАНИЦА<br />НЕ РАБОТАЕТ
                  </ErrorText>
                  <SubText>
                    Страница, которую вы ищете, не найдена или была удалена. Проверьте URL или вернитесь на главную.
                  </SubText>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <StyledButton component={Link} to="/" variant="contained">
                      Окак,на главную
                    </StyledButton>
                  </motion.div>
                </Box>
              </Grid>
            </>
          ) : (
            
            <>
              <Grid item xs={12} md={6} component={motion.div}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}>
                <ErrorText variant="h1">
                  СТРАНИЦА<br />НЕ РАБОТАЕТ
                </ErrorText>
                <SubText>
                  Страница, которую вы ищете, не найдена или была удалена. Проверьте URL или вернитесь на главную.
                </SubText>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <StyledButton component={Link} to="/" variant="contained">
                    Окак, на главную
                  </StyledButton>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6} component={motion.div}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}>
                <ImageContainer>
                  <Box
                    component="img"
                    src="/static/404/404.jpg"
                    alt="404"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </ImageContainer>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </NotFoundContainer>
  );
};

export default NotFound; 