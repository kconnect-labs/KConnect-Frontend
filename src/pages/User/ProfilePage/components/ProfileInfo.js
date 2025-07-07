import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  Tooltip, 
  Link 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import CakeIcon from '@mui/icons-material/Cake';
import TodayIcon from '@mui/icons-material/Today';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DiamondIcon from '@mui/icons-material/Diamond';
import StarIcon from '@mui/icons-material/Star';
import { useLanguage } from '../../../../context/LanguageContext';
import { formatDate } from '../../../../utils/dateUtils';
import { getLighterColor } from '../utils/colorUtils';

const ProfileInfo = ({ 
  user, 
  onUsernameClick 
}) => {
  const { t } = useLanguage();

  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Grid container spacing={3}>
        {/* Основная информация */}
        <Grid item xs={12}>
          {/* Коннект */}
          {user?.connect_info && user.connect_info.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  component={RouterLink} 
                  to={`/profile/${user.username}`}
                  sx={{ 
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  @{user.username}
                </Typography>
                <Typography sx={{ mx: 1, color: 'text.secondary' }}>
                  •
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {user.connect_info[0].days} {t('profile.days')}
                </Typography>
                <Typography sx={{ mx: 1, color: 'text.secondary' }}>
                  •
                </Typography>
                <Typography 
                  component={RouterLink} 
                  to={`/profile/${user.connect_info[0].username}`}
                  sx={{ 
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  @{user.connect_info[0].username}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Остальная информация */}
          {user?.about && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1,
                lineHeight: 1.5,
                color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary,
                p: 1.5,
                borderRadius: 2,
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
          )}
        </Grid>
        
        {user?.location && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.location')}
                </Typography>
                <Typography variant="body2">
                  {user.location}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
        
        {user?.website && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <LinkIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.website')}
                </Typography>
                <Typography variant="body2">
                  <Link href={user.website} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                    {user.website.replace(/^https?:\/\//, '')}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
        
        {user?.birthday && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <CakeIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.birthday')}
                </Typography>
                <Typography variant="body2">
                  {formatDate(user.birthday)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <TodayIcon color="primary" sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('profile.registration_date')}
              </Typography>
              <Typography variant="body2">
                {user?.registration_date ? new Date(user.registration_date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : t('profile.not_available')}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        {user?.purchased_usernames && user.purchased_usernames.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <AlternateEmailIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.usernames')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.purchased_usernames.map((usernameObj, idx) => (
                    <Chip 
                      key={idx}
                      label={usernameObj.username}
                      size="small"
                      variant={usernameObj.is_active ? "filled" : "outlined"}
                      color={usernameObj.is_active ? "primary" : "default"}
                      onClick={(e) => onUsernameClick(e, usernameObj.username)}
                      sx={{ 
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        )}

        {/* Секция подписки */}
        {user?.subscription && (
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1.5,
              p: 2,
              borderRadius: 2,
              background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              border: '1px solid',
              borderColor: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.3)' : 
                          user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.3)' :
                          user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.3)' :
                          user.subscription.type === 'channel' ? 'rgba(66, 165, 245, 0.3)' :
                          'rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: user.subscription.type === 'premium' ? 'linear-gradient(90deg, #ba68c8, #9c27b0)' : 
                            user.subscription.type === 'ultimate' ? 'linear-gradient(90deg, #7c4dff, #6200ea)' :
                            user.subscription.type === 'pick-me' ? 'linear-gradient(90deg, #d0bcff, #b388ff)' :
                            user.subscription.type === 'channel' ? 'linear-gradient(90deg, #42a5f5, #1976d2)' :
                            'linear-gradient(90deg, #fff, #ccc)',
                zIndex: 1
              }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.15)' : 
                            user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.15)' :
                            user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.15)' :
                            user.subscription.type === 'channel' ? 'rgba(66, 165, 245, 0.15)' :
                            'rgba(255, 255, 255, 0.1)',
                border: '1px solid',
                borderColor: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.3)' : 
                            user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.3)' :
                            user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.3)' :
                            user.subscription.type === 'channel' ? 'rgba(66, 165, 245, 0.3)' :
                            'rgba(255, 255, 255, 0.2)',
                animation: 'pulse-subscription 2s infinite',
                '@keyframes pulse-subscription': {
                  '0%': {
                    boxShadow: user.subscription.type === 'premium' ? 
                      '0 0 0 0 rgba(186, 104, 200, 0.4)' : 
                      user.subscription.type === 'ultimate' ? 
                      '0 0 0 0 rgba(124, 77, 255, 0.4)' :
                      user.subscription.type === 'pick-me' ? 
                      '0 0 0 0 rgba(208, 188, 255, 0.4)' :
                      user.subscription.type === 'channel' ? 
                      '0 0 0 0 rgba(66, 165, 245, 0.4)' :
                      '0 0 0 0 rgba(255, 255, 255, 0.2)'
                  },
                  '70%': {
                    boxShadow: user.subscription.type === 'premium' ? 
                      '0 0 0 8px rgba(186, 104, 200, 0)' : 
                      user.subscription.type === 'ultimate' ? 
                      '0 0 0 8px rgba(124, 77, 255, 0)' :
                      user.subscription.type === 'pick-me' ? 
                      '0 0 0 8px rgba(208, 188, 255, 0)' :
                      user.subscription.type === 'channel' ? 
                      '0 0 0 8px rgba(66, 165, 245, 0)' :
                      '0 0 0 8px rgba(255, 255, 255, 0)'
                  },
                  '100%': {
                    boxShadow: user.subscription.type === 'premium' ? 
                      '0 0 0 0 rgba(186, 104, 200, 0)' : 
                      user.subscription.type === 'ultimate' ? 
                      '0 0 0 0 rgba(124, 77, 255, 0)' :
                      user.subscription.type === 'pick-me' ? 
                      '0 0 0 0 rgba(208, 188, 255, 0)' :
                      user.subscription.type === 'channel' ? 
                      '0 0 0 0 rgba(66, 165, 245, 0)' :
                      '0 0 0 0 rgba(255, 255, 255, 0)'
                  }
                }
              }}>
                {/* Показываем значок длительности подписки, если есть total_duration_months */}
                {user.subscription.total_duration_months > 0 ? (
                  <Tooltip title={`${t('profile.subscription.subscriber')} • ${user.subscription.total_duration_months} ${t('profile.subscription.months')}`} arrow>
                    <Box 
                      component="img" 
                      src={`/static/subs/${user.subscription.total_duration_months >= 6 ? 'diamond' : 
                            user.subscription.total_duration_months >= 3 ? 'gold' : 
                            user.subscription.total_duration_months >= 2 ? 'silver' : 'bronze'}.svg`}
                      alt="Подписка"
                      sx={{ 
                        width: 48, 
                        height: 48,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }} 
                    />
                  </Tooltip>
                ) : (
                  /* Обычные иконки для подписок без длительности */
                  user.subscription.type === 'channel' ? (
                    <StarIcon sx={{ 
                      color: user.subscription.type === 'channel' ? '#42a5f5' : 'inherit',
                      fontSize: 24
                    }} />
                  ) : (
                    <DiamondIcon sx={{ 
                      color: user.subscription.type === 'premium' ? '#ba68c8' : 
                              user.subscription.type === 'ultimate' ? '#7c4dff' :
                              user.subscription.type === 'pick-me' ? '#d0bcff' : '#42a5f5',
                      fontSize: 24
                    }} />
                  )
                )}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    color: user.subscription.type === 'premium' ? '#ba68c8' : 
                            user.subscription.type === 'ultimate' ? '#7c4dff' :
                            user.subscription.type === 'pick-me' ? '#d0bcff' :
                            user.subscription.type === 'channel' ? '#42a5f5' : 'inherit'
                  }}>
                    {user.subscription.type === 'channel' ? t('profile.subscription.channel') :
                     user.subscription.type === 'premium' ? t('balance.subscription_types.premium') :
                     user.subscription.type === 'ultimate' ? t('balance.subscription_types.ultimate') :
                     user.subscription.type === 'pick-me' ? t('profile.subscription.pick_me') :
                     t('balance.subscription_types.basic')}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {user.subscription.expires_at ? (
                    <>
                      {t('profile.subscription.expires')}: {new Date(user.subscription.expires_at).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </>
                  ) : (
                    t('profile.subscription.active')
                  )}
                </Typography>
                
                {user.subscription.total_duration_months > 0 && (
                  <Typography variant="body2" sx={{ 
                    color: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.8)' : 
                            user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.8)' :
                            user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.8)' :
                            user.subscription.type === 'channel' ? 'rgba(66, 165, 245, 0.8)' : 'text.secondary',
                    fontWeight: 500
                  }}>
                    {t('profile.subscription.total_duration')}: {user.subscription.total_duration_months} {t('profile.subscription.months')}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        )}

      </Grid>
    </Paper>
  );
};

export default ProfileInfo; 