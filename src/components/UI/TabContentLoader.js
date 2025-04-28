import React from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TabContentLoader component that provides instant tab switching
 * without any loading indicators or background color flashes
 */
const TabContentLoader = ({ 
  tabIndex, 
  children,
  containerSx = {}
}) => {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', ...containerSx }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tabIndex}
          initial={{ opacity: 0.95 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.95 }}
          transition={{ 
            type: 'tween',
            duration: 0.12,
            ease: 'easeInOut'
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default TabContentLoader; 