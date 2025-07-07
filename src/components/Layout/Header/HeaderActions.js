import React from 'react';
import { Box, IconButton, Tooltip, Avatar, alpha } from '@mui/material';
import { Icon } from '@iconify/react';

const HeaderActions = ({
  user,
  isMobile,
  t,
  theme,
  navigate,
  toggleSearch,
  showSearch,
  handleProfileMenuOpen,
  NotificationList,
  handleNewNotification
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {/* Кнопка кошелька рендерится только на PC */}
    {user && !isMobile && (
      <Tooltip title={t('header.tooltips.wallet')}>
        <IconButton
          color="inherit"
          onClick={() => navigate('/balance')}
          sx={{
            bgcolor: 'transparent',
            color: 'inherit',
            opacity: 0.7,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              transform: 'scale(1.05)',
              opacity: 1
            },
            mr: 0.5
          }}
        >
          <Icon icon="solar:wallet-money-bold" width="24" height="24" />
        </IconButton>
      </Tooltip>
    )}
    
    {/* Кнопка поиска рендерится везде */}
    <IconButton 
      color="inherit" 
      onClick={toggleSearch}
      sx={{ 
        bgcolor: showSearch 
          ? alpha(theme.palette.primary.main, 0.1) 
          : 'transparent',
        color: showSearch
          ? 'primary.main' 
          : 'inherit',
        opacity: 0.7,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          transform: 'scale(1.05)',
          opacity: 1
        }
      }}
    >
      <Icon icon="solar:magnifer-bold" width="24" height="24" />
    </IconButton>
    
    {/* Уведомления рендерятся везде */}
    {user && (
      <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.6, transition: 'opacity 0.2s', '&:hover': { opacity: 1 } }}>
        <NotificationList onNewNotification={handleNewNotification} />
      </Box>
    )}
    
    {/* Кнопка профиля рендерится везде */}
    <IconButton
      edge="end"
      aria-label="account"
      aria-haspopup="true"
      onClick={handleProfileMenuOpen}
      color="inherit"
      sx={{ 
        ml: 0.5,
        opacity: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          opacity: 1
        }
      }}
    >
      {user ? (
        <Avatar 
          src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
          alt={user.name || user.username} 
          sx={{ 
            width: 30, 
            height: 30,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        />
      ) : (
        <Icon icon="solar:user-bold" width="24" height="24" />
      )}
    </IconButton>
  </Box>
);

export default HeaderActions; 