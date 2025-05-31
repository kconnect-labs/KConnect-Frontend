import React from 'react';
import { Box, styled } from '@mui/material';

const MusicTrackContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1.5),
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  marginBottom: theme.spacing(0.3),
  border: '1px solid rgba(255, 255, 255, 0.07)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
  }
}));

const MusicTrack = ({ children, onClick, ...props }) => {
  return (
    <MusicTrackContainer onClick={onClick} {...props}>
      {children}
    </MusicTrackContainer>
  );
};

export default MusicTrack; 