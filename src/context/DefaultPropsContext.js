import React, { createContext, useContext } from 'react';

const DefaultPropsContext = createContext({});

export const DefaultPropsProvider = ({ children }) => {
  const defaultProps = {
    // Add any default props you want to provide throughout the app
    direction: 'ltr',
    // Add more default props as needed
  };

  return (
    <DefaultPropsContext.Provider value={defaultProps}>
      {children}
    </DefaultPropsContext.Provider>
  );
};

export const useDefaultProps = () => {
  const context = useContext(DefaultPropsContext);
  if (!context) {
    throw new Error('useDefaultProps must be used within a DefaultPropsProvider');
  }
  return context;
};

export default DefaultPropsContext; 