import React from 'react';
import { 
  Box, 
  Typography, 
  Tooltip 
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import WarningIcon from '@mui/icons-material/Warning';
import { useLanguage } from '../../../../context/LanguageContext';

const UserBanInfo = ({ 
  userBanInfo, 
  user, 
  currentUser, 
  isCurrentUserModerator,
  showTooltip = true,
  showDetailed = false 
}) => {
  const { t } = useLanguage();

  if (!userBanInfo) return null;

  // Краткий блок для всех пользователей
  if (showDetailed) {
    return (
      <Box sx={{ 
        mt: 2,
        p: 1.5,
        borderRadius: '12px',
        backgroundColor: 'rgba(211, 47, 47, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(211, 47, 47, 0.8)',
        boxShadow: '0 0 15px rgba(211, 47, 47, 0.4)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5
      }}>
        <WarningIcon sx={{ fontSize: 22, mt: 0.5, color: 'white' }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
            {t('profile.ban.banned')}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 0.5 }}>
            {t('profile.ban.reason', { reason: userBanInfo.reason })}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>
            {t('profile.ban.ends', { endDate: userBanInfo.end_date })}
            {userBanInfo.remaining_days > 0 && ` (${t('profile.ban.days_left', { days: userBanInfo.remaining_days })})`}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Маленький бейдж с тултипом (для основного профиля)
  if (showTooltip) {
    return (
      <Tooltip 
        title={
          <Box sx={{ p: 0.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Аккаунт заблокирован</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>Причина: {userBanInfo.reason}</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>До: {userBanInfo.end_date}</Typography>
            {userBanInfo.remaining_days > 0 && (
              <Typography variant="body2">
                Осталось дней: {userBanInfo.remaining_days}
              </Typography>
            )}
          </Box>
        } 
        arrow 
        placement="top"
      >
        <Typography 
          variant="caption" 
          sx={{
            display: 'flex', 
            alignItems: 'center',
            color: '#fff',
            fontWeight: 500,
            background: 'rgba(211, 47, 47, 0.7)', 
            px: 1,
            py: 0.1,
            borderRadius: 4,
            border: '1px solid rgba(211, 47, 47, 0.8)',
            boxShadow: '0 0 8px rgba(211, 47, 47, 0.5)',
            '&:hover': {
              background: 'rgba(211, 47, 47, 0.8)',
            },
            animation: 'pulse-red 2s infinite',
            '@keyframes pulse-red': {
              '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
              '70%': { boxShadow: '0 0 0 6px rgba(211, 47, 47, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
            }
          }}
        >
          <BlockIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.9 }} />
          <Box component="span">{t('profile.ban.banned')}</Box>
        </Typography>
      </Tooltip>
    );
  }

  return null;
};

export default UserBanInfo; 