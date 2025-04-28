import React from 'react';
import { Box } from '@mui/material';

/**
 * ContentLoader component with no animations
 * Directly renders content without any transitions
 */
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