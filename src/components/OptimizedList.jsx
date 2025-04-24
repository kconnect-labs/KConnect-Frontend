import React, { useState, useId, useDeferredValue, useTransition, useMemo } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, CircularProgress } from '@mui/material';

const OptimizedList = ({ 
  items = [], 
  title = 'Список элементов',
  searchPlaceholder = 'Поиск...',
  emptyMessage = 'Нет элементов для отображения',
  renderItem = null,
  getItemText = (item) => item.toString(),
  filterFn = (item, query) => getItemText(item).toLowerCase().includes(query.toLowerCase()),
  maxHeight = 400
}) => {
  
  const id = useId();
  const searchId = `${id}-search`;
  const listId = `${id}-list`;
  
  
  const [searchQuery, setSearchQuery] = useState('');
  
  
  
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
  
  const [isPending, startTransition] = useTransition();
  
  
  const filteredItems = useMemo(() => {
    if (!deferredSearchQuery) return items;
    return items.filter(item => filterFn(item, deferredSearchQuery));
  }, [items, deferredSearchQuery, filterFn]);
  
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    
    startTransition(() => {
      setSearchQuery(value);
    });
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      
      <TextField
        id={searchId}
        fullWidth
        variant="outlined"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
        size="small"
        sx={{ mb: 2 }}
      />
      
      {}
      {isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} color="primary" />
        </Box>
      )}
      
      <Box 
        sx={{ 
          maxHeight, 
          overflow: 'auto',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {filteredItems.length > 0 ? (
          <List id={listId} disablePadding>
            {filteredItems.map((item, index) => {
              
              if (renderItem) {
                return renderItem(item, index, `${id}-item-${index}`);
              }
              
              
              return (
                <ListItem 
                  key={`${id}-item-${index}`}
                  divider={index < filteredItems.length - 1}
                >
                  <ListItemText primary={getItemText(item)} />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OptimizedList; 