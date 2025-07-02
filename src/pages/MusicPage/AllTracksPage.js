import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AllTracksBlock from './components/AllTracksBlock';

const AllTracksPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/music')}
          sx={{ mr: 1 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography 
          variant="h6" 
          fontWeight="600"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Все треки
        </Typography>
      </Box>

      {/* AllTracksBlock с встроенным поиском */}
      <AllTracksBlock />
    </Box>
  );
};

export default AllTracksPage; 