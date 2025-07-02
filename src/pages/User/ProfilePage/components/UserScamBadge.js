import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useLanguage } from '../../../../context/LanguageContext';

const UserScamBadge = ({ user }) => {
  const { t } = useLanguage();
  if (!user?.scam) return null;
  return (
    <Tooltip title={t('profile.ban.scam')} arrow placement="top">
      <Typography 
        variant="caption" 
        sx={{
          display: 'flex', 
          alignItems: 'center',
          color: '#fff',
          fontWeight: 500,
          background: 'rgba(211, 47, 47, 0.6)',
          px: 1,
          py: 0.1,
          borderRadius: 4,
          border: '1px solid rgba(211, 47, 47, 0.8)',
          boxShadow: '0 0 8px rgba(211, 47, 47, 0.5)',
          '&:hover': {
            background: 'rgba(211, 47, 47, 0.7)',
          },
          animation: 'pulse-red 2s infinite',
          '@keyframes pulse-red': {
            '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
            '70%': { boxShadow: '0 0 0 6px rgba(211, 47, 47, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
          }
        }}
      >
        <WarningIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.9 }} />
        <span>{t('profile.ban.scam')}</span>
      </Typography>
    </Tooltip>
  );
};

export default UserScamBadge; 