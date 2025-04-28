import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Container, 
  Paper, 
  Button,
  Chip
} from '@mui/material';

/**
 * Компонент для обработки авторизации через Element
 * Принимает token из query параметров и отправляет запрос на сервер
 */
const ElementAuth = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Подготовка авторизации...');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    console.log("[BROWSER] Запуск авторизации с токеном:", token);
    checkServiceStatus();
    const timeoutId = setTimeout(() => tryAuth(), 500);
    return () => clearTimeout(timeoutId);
  }, [token]);

  // Проверяем статус сервиса авторизации
  const checkServiceStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const status = await response.json();
      setConnectionInfo(status);
      console.log("[BROWSER] Статус сервиса:", status);
      
      if (!status.external_socket_connected) {
        setStatus("Ожидание подключения к серверу Element...");
      }
    } catch (err) {
      console.error("[BROWSER] Ошибка при проверке статуса:", err);
    }
  };

  const tryAuth = async () => {
    setAttemptCount(prev => prev + 1);
    setStatus("Попытка авторизации...");
    console.log("[BROWSER] Отправка запроса на сервер...");

    try {
      const response = await fetch(`/api/auth_elem/${token}`, {  
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ connect_key: token })
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("[BROWSER] Ответ сервера:", result);
      
      if(result.status === "success" && result.redirect) {
        setStatus("Авторизация успешна. Перенаправляем...");
        console.log("[BROWSER] Перенаправление на:", result.redirect);
        
        // Если была успешная привязка Element аккаунта, устанавливаем флаг в localStorage
        if (result.elem_connected) {
          localStorage.setItem('elem_connected', 'true');
          // Также сообщаем об успешном подключении через event для других вкладок
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'elem_connected',
            newValue: 'true'
          }));
        }
        
        navigate(result.redirect);
      } else if (result.status === "error" && result.message.includes("недоступен")) {
        // Если сервис недоступен, показываем ошибку и предлагаем проверить статус
        setError(result.message);
        setStatus("Проблема с сервисом авторизации");
        setIsLoading(false);
        // Повторно проверяем статус соединения
        await checkServiceStatus();
      } else {
        console.error("[BROWSER] ❌ Ошибка авторизации:", result.message);
        setError(result.message || "Неизвестная ошибка");
        setStatus("Ошибка авторизации");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("[BROWSER] ❌ Ошибка связи с сервером:", err);
      setError(`Ошибка связи: ${err.message}`);
      setStatus("Ошибка авторизации");
      setIsLoading(false);
      // Проверяем статус соединения при ошибке
      await checkServiceStatus();
    }
  };

  // Обработчик повторной попытки
  const handleRetry = () => {
    setError('');
    setIsLoading(true);
    tryAuth();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
          Авторизация через Element
        </Typography>
        
        {connectionInfo && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Chip 
              label={connectionInfo.external_socket_connected ? "Соединение активно" : "Соединение отсутствует"} 
              color={connectionInfo.external_socket_connected ? "success" : "error"}
              size="small"
            />
            {connectionInfo.using_proxy && (
              <Chip 
                label={`${connectionInfo.proxy_type || ""} прокси`} 
                color="info"
                size="small"
              />
            )}
          </Box>
        )}
        
        {isLoading ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="body1" color="text.secondary">
              {status}
            </Typography>
            {attemptCount > 1 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Попытка {attemptCount}...
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ width: '100%', mt: 2 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
              >
                {error}
              </Alert>
            )}
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleRetry}
              sx={{ mt: 2 }}
            >
              Попробовать снова
            </Button>
            
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Вернуться на страницу входа
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ElementAuth; 