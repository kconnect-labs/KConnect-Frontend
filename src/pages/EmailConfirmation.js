import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Button,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';

const EmailConfirmation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/confirm-email/${token}`);
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          
          
          if (response.data.chat_id) {
            setChatId(response.data.chat_id);
            
            localStorage.setItem('k-connect-chat-id', response.data.chat_id);
            console.log('Сохранен chat_id в localStorage:', response.data.chat_id);
          }
          
          
          if (response.data.needs_profile_setup) {
            
            setTimeout(() => {
              navigate('/register/profile', { replace: true });
            }, 2000);
          } else {
            
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
          }
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Произошла ошибка при подтверждении email.');
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        backgroundImage: 'linear-gradient(120deg, #321d5b 0%, #1a1a1a 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress 
              size={80} 
              sx={{ color: 'var(--primary)', mb: 3 }} 
            />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Подтверждение Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Пожалуйста, подождите, мы подтверждаем ваш Email...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon 
              sx={{ fontSize: 80, color: 'success.main', mb: 3 }} 
            />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Email подтвержден!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Вы будете перенаправлены автоматически через несколько секунд.
            </Alert>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                if (status === 'success' && message.includes('создать профиль')) {
                  navigate('/register/profile');
                } else {
                  navigate('/login');
                }
              }}
              sx={{ 
                borderRadius: '20px',
                background: 'var(--primary)', 
                '&:hover': { 
                  background: 'var(--primary-dark)' 
                }
              }}
            >
              {status === 'success' && message.includes('создать профиль') 
                ? 'Создать профиль' 
                : 'Перейти на страницу входа'}
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon 
              sx={{ fontSize: 80, color: 'error.main', mb: 3 }} 
            />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ошибка подтверждения
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ 
                borderRadius: '20px',
                background: 'var(--primary)', 
                '&:hover': { 
                  background: 'var(--primary-dark)' 
                }
              }}
            >
              Вернуться на страницу входа
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default EmailConfirmation; 