import React from 'react';
import { Box } from '@mui/material';
import TabContentLoader from '../../../../components/UI/TabContentLoader';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <TabContentLoader tabIndex={index}>
          <Box sx={{ pt: 0 }}>
            {children}
          </Box>
        </TabContentLoader>
      )}
    </div>
  );
};

export default TabPanel; 