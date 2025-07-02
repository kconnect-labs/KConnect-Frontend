import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: 10,
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  [theme.breakpoints.down('sm')]: {
    boxShadow: 'none',
    marginBottom: 2,
    width: '100%'
  }
}));

const PostSkeleton = () => {
  const theme = useTheme();
  
  // Use theme-based colors for skeleton backgrounds
  const skeletonBgColor = theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)';
    
  return (
    <PostCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            sx={{ bgcolor: skeletonBgColor }} 
            animation="wave"
          />
          <Box sx={{ ml: 1, width: '50%' }}>
            <Skeleton 
              variant="text" 
              width="80%" 
              height={20} 
              sx={{ bgcolor: skeletonBgColor }} 
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="40%" 
              height={15} 
              sx={{ bgcolor: skeletonBgColor }} 
              animation="wave"
            />
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Skeleton 
            variant="text" 
            height={18} 
            sx={{ bgcolor: skeletonBgColor }} 
            animation="wave"
          />
          <Skeleton 
            variant="text" 
            height={18} 
            sx={{ bgcolor: skeletonBgColor }} 
            animation="wave"
          />
          <Skeleton 
            variant="text" 
            width="80%" 
            height={18} 
            sx={{ bgcolor: skeletonBgColor }} 
            animation="wave"
          />
        </Box>
        
        <Skeleton 
          variant="rectangular" 
          height={200} 
          sx={{ mb: 2, bgcolor: skeletonBgColor, borderRadius: 1 }} 
          animation="wave"
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Skeleton 
            variant="rounded" 
            width={90} 
            height={32} 
            sx={{ bgcolor: skeletonBgColor }} 
            animation="wave"
          />
          <Skeleton 
            variant="rounded" 
            width={90} 
            height={32} 
            sx={{ bgcolor: skeletonBgColor }} 
            animation="wave"
          />
          <Skeleton 
            variant="rounded" 
            width={90} 
            height={32} 
            sx={{ bgcolor: skeletonBgColor }} 
            animation="wave"
          />
        </Box>
      </CardContent>
    </PostCard>
  );
};

export default PostSkeleton; 