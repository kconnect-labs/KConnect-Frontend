import React from 'react';
import { Box, Typography } from '@mui/material';
import UserCard from './UserCard';

const FriendsList = ({ users = [], cardSpacing = 2, cardRadius = 12, forceUnfollow = false }) => {
  if (!users.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Нет друзей
        </Typography>
      </Box>
    );
  }
  return (
    <Box>
      {users.map((user, idx) => (
        <Box key={user.id} sx={{ mb: idx !== users.length - 1 ? `${cardSpacing}px` : 0 }}>
          <UserCard {...user} cardRadius={cardRadius} forceUnfollow={forceUnfollow} />
        </Box>
      ))}
    </Box>
  );
};

export default FriendsList; 