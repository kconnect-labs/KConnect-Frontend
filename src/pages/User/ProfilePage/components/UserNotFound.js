import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UserNotFound = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">Пользователь не найден</Typography>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2, borderRadius: 20, textTransform: 'none' }}
        >
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
};

export default UserNotFound; 