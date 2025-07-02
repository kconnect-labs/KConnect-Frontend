import { useState } from 'react';

export const useTabs = (initialValue = 0) => {
  const [tabValue, setTabValue] = useState(initialValue);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return {
    tabValue,
    setTabValue,
    handleTabChange
  };
}; 