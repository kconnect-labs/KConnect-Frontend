import React from 'react';
import { Box, Button, Typography, Stack, Divider } from '@mui/material';

/**
 * Test component to demonstrate all notification types
 */
const TestNotifications = () => {
  const triggerAuthError = () => {
    window.dispatchEvent(new CustomEvent('auth-error', { 
      detail: { 
        message: "Сессия истекла", 
        shortMessage: "Войдите снова",
        notificationType: "auth",
        animationType: "pill"
      } 
    }));
  };
  
  const triggerRateLimitError = () => {
    window.dispatchEvent(new CustomEvent('rate-limit-error', { 
      detail: { 
        message: "Лимит запросов превышен",
        shortMessage: "Подождите",
        notificationType: "warning",
        animationType: "bounce", 
        retryAfter: 30
      } 
    }));
  };
  
  const triggerNetworkError = () => {
    window.dispatchEvent(new CustomEvent('network-error', { 
      detail: { 
        message: "Проблема с подключением", 
        shortMessage: "Нет сети",
        notificationType: "error",
        animationType: "drop"
      } 
    }));
  };
  
  const triggerApiRetry = () => {
    window.dispatchEvent(new CustomEvent('api-retry', { 
      detail: { 
        url: '/api/posts',
        attempt: 2,
        delay: 2000,
        message: "Повторное подключение",
        shortMessage: "Попытка 2",
        notificationType: "info",
        animationType: "pulse"
      } 
    }));
  };
  
  const triggerGenericError = () => {
    window.dispatchEvent(new CustomEvent('show-error', { 
      detail: { 
        message: "Ошибка загрузки данных", 
        shortMessage: "Ошибка",
        notificationType: "error",
        animationType: "pill"
      } 
    }));
  };
  
  const triggerSuccessNotification = () => {
    window.dispatchEvent(new CustomEvent('show-error', { 
      detail: { 
        message: "Операция выполнена успешно", 
        shortMessage: "Готово",
        notificationType: "success",
        animationType: "pill"
      } 
    }));
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Тест новых уведомлений
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Stack spacing={2} direction="column">
        <Button 
          variant="contained" 
          color="primary"
          onClick={triggerAuthError}
        >
          Сессия истекла
        </Button>
        
        <Button 
          variant="contained" 
          color="warning"
          onClick={triggerRateLimitError}
        >
          Лимит запросов
        </Button>
        
        <Button 
          variant="contained" 
          color="error"
          onClick={triggerNetworkError}
        >
          Нет сети
        </Button>
        
        <Button 
          variant="contained" 
          color="info"
          onClick={triggerApiRetry}
        >
          Повторное подключение
        </Button>
        
        <Button 
          variant="contained" 
          color="error"
          onClick={triggerGenericError}
        >
          Общая ошибка
        </Button>
        
        <Button 
          variant="contained" 
          color="success"
          onClick={triggerSuccessNotification}
        >
          Успех
        </Button>
      </Stack>
    </Box>
  );
};

export default TestNotifications; 