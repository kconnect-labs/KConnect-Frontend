import React, { memo } from 'react';
import { 
  Box, 
  Typography,
  Avatar,
  Button,
  alpha,
  styled
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


const UserProfileWrapper = styled(Box)(({ theme, themecolor }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1.5, 1, 1.8, 1),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: '1px',
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)`
      : `linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)`,
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.2, 1, 1.5, 1),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 0.8, 1.2, 0.8),
  }
}));

const StyledAvatar = styled(Avatar)(({ theme, themecolor }) => ({
  width: 70,
  height: 70,
  border: theme.palette.mode === 'dark' ? `1px solid rgba(255, 255, 255, 0.15)` : `1px solid rgba(0, 0, 0, 0.15)`,
  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.12)`,
  transition: 'all 0.35s ease',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 6px 16px rgba(0, 0, 0, 0.16)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    borderRadius: '50%',
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%)`
      : `linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  '&:hover::after': {
    opacity: 1,
  },
  [theme.breakpoints.down('lg')]: {
    width: 65,
    height: 65,
  },
  [theme.breakpoints.down('md')]: {
    width: 60,
    height: 60,
  }
}));

const UserName = styled(Typography)(({ theme, themecolor }) => ({
  fontWeight: '600',
  fontSize: '1rem',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.2),
  letterSpacing: '0.4px',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.9rem',
    marginTop: theme.spacing(0.8),
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.85rem',
    marginTop: theme.spacing(0.6),
  }
}));

const UserNameTag = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
  fontSize: '0.75rem',
  letterSpacing: '0.3px',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.7rem',
    marginBottom: theme.spacing(0.8),
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.65rem',
    marginBottom: theme.spacing(0.6),
  }
}));

const EditButton = styled(Button)(({ theme, themecolor }) => ({
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.4, 2),
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '0.8rem',
  background: `linear-gradient(90deg, ${themecolor || theme.palette.primary.main}, ${alpha(themecolor || theme.palette.primary.main, 0.8)})`,
  boxShadow: `0 4px 15px ${alpha(themecolor || theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 6px 20px ${alpha(themecolor || theme.palette.primary.main, 0.5)}`,
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0.3, 1.8),
    fontSize: '0.7rem',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.25, 1.6),
    fontSize: '0.65rem',
  }
}));


const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.user?.name === nextProps.user?.name &&
    prevProps.user?.username === nextProps.user?.username &&
    prevProps.user?.photo === nextProps.user?.photo &&
    prevProps.primaryColor === nextProps.primaryColor
  );
};


const UserProfileBlock = ({ user, primaryColor }) => {
  if (!user) return null;
  
  return (
    <UserProfileWrapper themecolor={primaryColor}>
      <StyledAvatar 
        src={user?.photo ? (user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}`) : undefined}
        alt={user?.name || 'User'}
        themecolor={primaryColor}
        onError={(e) => {
          console.error(`Failed to load avatar for ${user?.username}`);
          e.target.onerror = null; 
          e.target.src = `/static/uploads/avatar/system/avatar.png`;
        }}
      />
      <UserName variant="h6" themecolor={primaryColor}>
        {user?.name || 'Пользователь'}
      </UserName>
      <UserNameTag variant="body2">
        @{user?.username || 'username'}
      </UserNameTag>
      <EditButton 
        variant="contained" 
        size="small" 
        color="primary" 
        component={RouterLink}
        to={`/settings`}
        themecolor={primaryColor}
      >
        Редактировать
      </EditButton>
    </UserProfileWrapper>
  );
};

export default memo(UserProfileBlock, areEqual); 