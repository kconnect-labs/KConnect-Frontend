import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const OwnedUsernames = ({ ownedUsernames, user, t, getLighterColor, handleUsernameClick }) => {
  const theme = useTheme();
  if (!ownedUsernames || ownedUsernames.length === 0) return null;
  return (
    <Box sx={{ 
      display: 'flex',
      mt: 1,
      width: '100%'
    }}>
      <Box 
        sx={{ 
          color: theme.palette.text.secondary,
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          backdropFilter: 'blur(5px)',
          px: 1.2,
          py: 0.4,
          borderRadius: 4,
          border: (user.status_color && user.status_text && user.subscription) ? 
            `1px solid ${user.status_color}33` : 
            theme.palette.mode === 'dark' ? '1px solid rgba(208, 188, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          fontSize: '0.75rem',
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: '100%',
          flexWrap: 'wrap'
        }}
      >
        <Typography variant="caption" sx={{ color: user?.status_color ? getLighterColor(user.status_color) : theme.palette.text.secondary, mr: 0.5 }}>
          {t('profile.also_follows', { count: ownedUsernames.length })}
        </Typography>
        {ownedUsernames.slice(0, 3).map((usernameItem, idx) => (
          <React.Fragment key={usernameItem}>
            <Typography 
              variant="caption" 
              component="span" 
              sx={{ 
                color: (user.status_color && user.status_text && user.subscription) ? 
                  user.status_color : 
                  theme.palette.mode === 'dark' ? '#d0bcff' : '#7c4dff',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={(e) => handleUsernameClick(e, usernameItem)}
            >
              @{usernameItem}
            </Typography>
            {idx < Math.min(ownedUsernames.length, 3) - 1 && (
              <Typography variant="caption" component="span" sx={{ mx: 0.5, color: theme.palette.text.disabled }}>
                ,
              </Typography>
            )}
          </React.Fragment>
        ))}
        {ownedUsernames.length > 3 && (
          <Typography variant="caption" component="span" sx={{ ml: 0.5, color: theme.palette.text.disabled }}>
            {t('profile.and_more', { count: ownedUsernames.length - 3 })}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default OwnedUsernames; 