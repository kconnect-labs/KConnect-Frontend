import React, { useState } from 'react';
import { Box, Avatar, Typography, Paper, Link as MuiLink, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContextMenu from './ContextMenu/ContextMenu';

const UserCardContainer = styled(Paper)(({ theme, cardRadius }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1.2),
  borderRadius: cardRadius ?? 18,
  transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
  minHeight: 72,
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0,0,0,0.18)'
    : '0 2px 12px rgba(0,0,0,0.07)',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-1px) scale(1.012)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 18px rgba(0,0,0,0.22)'
      : '0 8px 24px rgba(0,0,0,0.10)',
  },
}));

const TruncatedText = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const UserCard = ({ id, username, name, about, photo, is_verified, is_following, onUnfollow, onFollow, cardRadius, forceUnfollow }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  let avatarUrl = photo;
  if (avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('/')) {
    avatarUrl = `/static/uploads/avatar/${id}/${avatarUrl}`;
  }

  const handleMenuClick = (e) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const menuItems = (forceUnfollow || is_following)
    ? [{ id: 'unfollow', label: 'Отписаться', icon: null, onClick: () => onUnfollow && onUnfollow(id) }]
    : [{ id: 'follow', label: 'Добавить', icon: null, onClick: () => onFollow && onFollow(id) }];

  return (
    <Box sx={{ position: 'relative' }}>
      <MuiLink href={`/profile/${username}`} underline="none" sx={{ display: 'block' }}>
        <UserCardContainer cardRadius={cardRadius}>
          <Avatar
            src={avatarUrl || '/static/uploads/avatar/system/avatar.png'}
            alt={name || username}
            sx={{ width: 48, height: 48, minWidth: 48, marginRight: 2, border: '2px solid', borderColor: 'primary.main', boxShadow: 1 }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TruncatedText variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 600, maxWidth: 150 }}>
                {name || username}
              </TruncatedText>
              {is_verified && (
                <VerifiedIcon sx={{ ml: 0.5, fontSize: 16, color: 'primary.main' }} />
              )}
            </Box>
            <TruncatedText variant="body2" sx={{ color: 'text.secondary', maxWidth: 200 }}>
              @{username}
            </TruncatedText>
          </Box>
          <IconButton
            size="small"
            sx={{ ml: 1, alignSelf: 'flex-start' }}
            onClick={handleMenuClick}
            aria-label="Меню"
          >
            <MoreVertIcon />
          </IconButton>
        </UserCardContainer>
      </MuiLink>
      {menuOpen && (
        <ContextMenu
          show={menuOpen}
          x={menuPos.x}
          y={menuPos.y}
          onClose={() => setMenuOpen(false)}
          items={menuItems}
          sx={{ width: 'unset' }}
        />
      )}
    </Box>
  );
};

export default UserCard; 