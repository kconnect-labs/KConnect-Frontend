import React from 'react';
import { Typography } from '@mui/material';

const ProfileAbout = ({ user, getLighterColor }) => {
  if (!user?.about) return null;
  
  return (
    <Typography 
      variant="body2" 
      sx={{ 
        mt: 1,
        lineHeight: 1.5,
        color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary,
        p: 1.5,
        borderRadius: 1,
        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        backdropFilter: 'blur(10px)',
        border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        whiteSpace: 'normal'
      }}
    >
      {user.about}
    </Typography>
  );
};

export default ProfileAbout; 