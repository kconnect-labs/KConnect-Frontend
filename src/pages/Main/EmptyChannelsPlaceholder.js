import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import TvOffIcon from '@mui/icons-material/TvOff';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: 16,
  background: 'linear-gradient(145deg, #222222, #1c1c1c)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const EmptyChannelsPlaceholder = ({ message = "Каналы не найдены" }) => {
  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <TvOffIcon sx={{ fontSize: 70, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {message}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 400 }}>
          Попробуйте изменить параметры поиска или вернитесь позже, когда появятся новые каналы
        </Typography>
      </Box>
    </StyledPaper>
  );
};

export default EmptyChannelsPlaceholder; 