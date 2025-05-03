import React, { useState } from 'react';
import { Box, Card, CardContent, Avatar, Typography, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from '../../services/axiosConfig';

const FollowButton = styled(Button)(({ theme, following }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'medium',
  minWidth: '90px',
  padding: theme.spacing(0.5, 1.5),
  fontSize: '0.75rem',
  backgroundColor: following ? 'transparent' : theme.palette.primary.main,
  borderColor: following ? theme.palette.divider : theme.palette.primary.main,
  color: following ? theme.palette.text.primary : theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: following ? 'rgba(255, 255, 255, 0.05)' : theme.palette.primary.dark,
  }
}));

const UserRecommendation = ({ user }) => {
  const [following, setFollowing] = useState(user.is_following || false);
  const navigate = useNavigate();
  
  const handleFollow = async (e) => {
    e.stopPropagation();
    try {
      
      setFollowing(!following);
      
      const response = await axios.post(`/api/profile/follow`, {
        followed_id: user.id
      });
      
      
      if (response.data && response.data.success) {
        setFollowing(response.data.is_following);
      }
    } catch (error) {
      
      setFollowing(following);
      console.error('Error toggling follow:', error);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/profile/${user.username}`);
  };
  
  return (
    <Card 
      onClick={handleCardClick} 
      sx={{ 
        cursor: 'pointer',
        borderRadius: '12px',
        background: '#1d1d1d',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        mb: 1.5,
        border: '1px solid rgba(255, 255, 255, 0.03)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.06)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={user.avatar ? `/static/uploads/avatar/${user.id}/${user.avatar}` : '/static/uploads/avatar/system/avatar.png'}
              alt={user.username}
              sx={{ 
                width: 36, 
                height: 36, 
                mr: 1.5,
                border: '2px solid rgba(208, 188, 255, 0.2)'
              }}
            />
            <Box>
              <Typography variant="body2" fontWeight="medium" noWrap sx={{ 
                fontSize: '0.85rem',
                letterSpacing: '0.2px'
              }}>
                {user.display_name || user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                @{user.username}
              </Typography>
            </Box>
          </Box>
          
          <FollowButton
            variant={following ? "outlined" : "contained"}
            size="small"
            following={following}
            onClick={handleFollow}
            startIcon={following ? <PersonRemoveIcon fontSize="small" /> : <PersonAddIcon fontSize="small" />}
            sx={{
              px: 1.5,
              py: 0.5,
              minWidth: following ? '100px' : '96px'
            }}
          >
            {following ? 'Отписаться' : 'Подписаться'}
          </FollowButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserRecommendation; 