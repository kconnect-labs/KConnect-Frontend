import React from 'react';
import { Box, Typography, Avatar, Button, IconButton, Chip, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const BannerImage = styled(Box)(({ theme }) => ({
  height: '180px',
  width: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '12px 12px 0 0',
  position: 'relative',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  marginTop: '-60px',
  boxShadow: theme.shadows[3],
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const VerifiedBadge = styled(CheckCircleIcon)(({ theme, status }) => ({
  color: status === 1 ? '#9e9e9e' : 
         status === 2 ? '#d67270' : 
         status === 3 ? '#b39ddb' :
         status === 4 ? '#ff9800' : 
         theme.palette.primary.main,
  marginLeft: theme.spacing(1),
  width: 20,
  height: 20,
}));

const SocialChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ProfileHeader = ({ 
  profile, 
  isCurrentUser,
  onFollow,
  onToggleNotifications,
  isLoading
}) => {
  if (!profile) return null;

  const {
    name,
    username,
    about,
    avatar_url,
    banner_url,
    followers_count,
    following_count,
    total_likes,
    is_following,
    notifications_enabled,
    verification,
    achievement,
    socials = []
  } = profile;

  const handleFollow = () => {
    if (!isLoading) onFollow();
  };

  const handleToggleNotifications = () => {
    if (!isLoading) onToggleNotifications();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 3,
        mb: 3
      }}>
        {/* Баннер профиля */}
        <BannerImage sx={{ backgroundImage: `url(${banner_url})` }} />
        
        {/* Основная информация и аватар */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <ProfileAvatar src={avatar_url} alt={name} />
            
            {/* Кнопки действий (только если это не профиль текущего пользователя) */}
            {!isCurrentUser && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained"
                  color={is_following ? "secondary" : "primary"}
                  onClick={handleFollow}
                  disabled={isLoading}
                >
                  {is_following ? 'Отписаться' : 'Подписаться'}
                </Button>
                
                {is_following && (
                  <Tooltip title={notifications_enabled ? 'Отключить уведомления' : 'Включить уведомления'}>
                    <IconButton onClick={handleToggleNotifications} disabled={isLoading}>
                      {notifications_enabled ? <NotificationsIcon /> : <NotificationsOffIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
          
          {/* Имя пользователя и верификация */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              {name}
              {verification && verification.status > 0 && (
                <VerifiedBadge fontSize="large" status={verification.status} />
              )}
              {achievement && (
                <Box 
                  component="img" 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    ml: 1 
                  }} 
                  src={`/static/images/bages/${achievement.image_path}`} 
                  alt={achievement.bage}
                  onError={(e) => {
                    console.error("Achievement badge failed to load:", e);
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </Typography>
          </Box>
          
          {/* Username */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            @{username}
          </Typography>
          
          {/* Описание профиля */}
          {about && (
            <Typography 
              variant="body1" 
              sx={{ 
                my: 2,
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {about}
            </Typography>
          )}
          
          {/* Социальные сети */}
          {socials.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
              {socials.map((social, index) => (
                <SocialChip
                  key={index}
                  label={social.name}
                  component="a"
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                />
              ))}
            </Box>
          )}
          
          {/* Статистика профиля */}
          <StatsContainer>
            <StatItem>
              <Typography variant="h6">{followers_count}</Typography>
              <Typography variant="body2" color="text.secondary">Подписчиков</Typography>
            </StatItem>
            <StatItem>
              <Typography variant="h6">{following_count}</Typography>
              <Typography variant="body2" color="text.secondary">Подписок</Typography>
            </StatItem>
            <StatItem>
              <Typography variant="h6">{total_likes}</Typography>
              <Typography variant="body2" color="text.secondary">Лайков</Typography>
            </StatItem>
          </StatsContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProfileHeader; 