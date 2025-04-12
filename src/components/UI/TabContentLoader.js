import React from 'react';
import { Box } from '@mui/material';

/**
 * TabContentLoader without animations
 * Just directly renders tab content
 */
const TabContentLoader = ({ 
  tabIndex, 
  children,
  containerSx = {}
}) => {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', ...containerSx }}>
      {children}
    </Box>
  );
};

export default TabContentLoader; 