import React, { memo } from 'react';
import { 
  Box, 
  Typography,
  Avatar,
  Button,
  styled
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

const UserProfileWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  position: 'relative',
  gap: theme.spacing(1.5),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '8px',
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
  flexShrink: 0,
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const UserInfoContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flex: 1,
  minWidth: 0
});

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  fontSize: '0.95rem',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));

const UserNameTag = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));

const EditButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.25, 1.5),
  borderRadius: '6px',
  textTransform: 'none',
  fontSize: '0.7rem',
  marginTop: theme.spacing(0.5),
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
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

const UserProfileBlock = ({ user }) => {
  const { t } = useLanguage();
  if (!user) return null;
  
  return (
    <UserProfileWrapper
      component={RouterLink}
      to={`/profile/${user?.username || user?.id}`}
      sx={{
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <StyledAvatar 
        src={user?.photo ? (user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}`) : undefined}
        alt={user?.name || t('sidebar.profile.default_name')}
        onError={(e) => {
          console.error(`Failed to load avatar for ${user?.username}`);
          e.target.onerror = null; 
          e.target.src = `/static/uploads/avatar/system/avatar.png`;
        }}
      />
      <UserInfoContainer>
        <UserName variant="h6">
          {user?.name || t('sidebar.profile.default_name')}
        </UserName>
        <UserNameTag variant="body2">
          @{user?.username || t('sidebar.profile.default_username')}
        </UserNameTag>
      </UserInfoContainer>
    </UserProfileWrapper>
  );
};

export default memo(UserProfileBlock, areEqual); 