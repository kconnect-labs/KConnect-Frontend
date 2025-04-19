import React from 'react';
import { Box } from '@mui/material';


const ContentLoader = ({ 
  loading, 
  children, 
  skeletonCount = 1,
  height = '100px',
  sx = {},
  showSkeleton = false
}) => {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {children}
    </Box>
  );
};

export default ContentLoader; 