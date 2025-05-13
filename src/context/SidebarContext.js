import React, { createContext, useState, useCallback, useMemo } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [expandedMore, setExpandedMore] = useState(false);
  const [expandedAdminMod, setExpandedAdminMod] = useState(false);
  const [expandedShops, setExpandedShops] = useState(false);
  
  const toggleExpandMore = useCallback(() => {
    setExpandedMore(prev => !prev);
  }, []);

  const toggleExpandAdminMod = useCallback(() => {
    setExpandedAdminMod(prev => !prev);
  }, []);
  
  const toggleExpandShops = useCallback(() => {
    setExpandedShops(prev => !prev);
  }, []);
  
  const value = useMemo(() => ({
    expandedMore,
    expandedAdminMod,
    expandedShops,
    toggleExpandMore,
    toggleExpandAdminMod,
    toggleExpandShops
  }), [expandedMore, expandedAdminMod, expandedShops, toggleExpandMore, toggleExpandAdminMod, toggleExpandShops]);
  
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}; 