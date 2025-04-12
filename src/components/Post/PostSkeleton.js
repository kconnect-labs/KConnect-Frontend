import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: 10,
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  background: '#1A1A1A',
  [theme.breakpoints.down('sm')]: {
    boxShadow: 'none',
    marginBottom: 2,
    width: '100%'
  }
}));

const PostSkeleton = () => {
  return (
    <PostCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            animation="wave"
          />
          <Box sx={{ ml: 1, width: '50%' }}>
            <Skeleton 
              variant="text" 
              width="80%" 
              height={20} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="40%" 
              height={15} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
              animation="wave"
            />
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Skeleton 
            variant="text" 
            height={18} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            animation="wave"
          />
          <Skeleton 
            variant="text" 
            height={18} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            animation="wave"
          />
          <Skeleton 
            variant="text" 
            width="80%" 
            height={18} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            animation="wave"
          />
        </Box>
        
        <Skeleton 
          variant="rectangular" 
          height={200} 
          sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }} 
          animation="wave"
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Skeleton 
            variant="rounded" 
            width={90} 
            height={32} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            animation="wave"
          />
          <Skeleton 
            variant="rounded" 
            width={90} 
            height={32} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            animation="wave"
          />
          <Skeleton 
            variant="rounded" 
            width={90} 
            height={32} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            animation="wave"
          />
        </Box>
      </CardContent>
    </PostCard>
  );
};

export default PostSkeleton; 