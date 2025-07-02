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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useLanguage } from '../../../../context/LanguageContext';
import { formatDate } from '../../../../utils/dateUtils';
import { getLighterColor } from '../utils/colorUtils';

const ProfileInfo = ({ 
  user, 
  medals = [], 
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

        {/* Medals section */}
        {medals && medals.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1.5,
              pb: 2,
              borderBottom: '1px solid rgba(255,255,255,0.07)'
            }}>
              <EmojiEventsIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.medals.title')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  {medals.map((medal) => (
                    <Tooltip
                      key={medal.id}
                      title={
                        <Box>
                          {medal.description && (
                            <Typography variant="caption">{medal.description}</Typography>
                          )}
                          <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                            {t('profile.awarded_on', { date: new Date(medal.awarded_at).toLocaleDateString() })}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                            {t('profile.awarded_by', { by: `@${medal.awarded_by}` })}
                          </Typography>
                        </Box>
                      }
                      arrow
                    >
                      <img
                        src={medal.image_path}
                        alt={medal.name}
                        style={{ 
                          width: 150,
                          height: 150,
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default ProfileInfo; 