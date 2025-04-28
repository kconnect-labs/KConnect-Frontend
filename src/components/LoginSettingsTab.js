import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, 
  Alert, Snackbar, CircularProgress 
} from '@mui/material';
import { Icon } from '@iconify/react';
import LockIcon from '@mui/icons-material/Lock';

// Импортируем стилизованные компоненты из SettingsPage
import { SettingsCard, SettingsCardContent, SectionTitle } from '../pages/User/SettingsPage';

const LoginSettingsTab = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    // Проверяем, есть ли у пользователя настройки входа
    const checkCredentials = async () => {
      try {
        const response = await fetch('/api/user/has-credentials', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHasCredentials(data.hasCredentials);
        } else {
          console.error('Ошибка при проверке учетных данных');
        }
      } catch (error) {
        console.error('Ошибка при проверке учетных данных:', error);
      }
    };
    
    checkCredentials();
  }, []);

  // Валидация полей формы
  const validateForm = () => {
    let isValid = true;
    
    // Проверка имени пользователя
    if (!username) {
      setUsernameError('Имя пользователя обязательно');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Имя пользователя должно быть не менее 3 символов');
      isValid = false;
    } else {
      setUsernameError('');
    }
    
    // Проверка email
    if (!email) {
      setEmailError('Email обязателен');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Введите корректный email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Проверка пароля
    if (!password) {
      setPasswordError('Пароль обязателен');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Пароль должен быть не менее 6 символов');
      isValid = false;
    } else if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const showNotification = (severity, message) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/setup-credentials', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', 'Учетные данные успешно сохранены');
        setHasCredentials(true);
        // Очищаем поля пароля после успешного сохранения
        setPassword('');
        setConfirmPassword('');
      } else {
        showNotification('error', data.error || 'Ошибка при сохранении учетных данных');
      }
    } catch (error) {
      console.error('Ошибка при сохранении учетных данных:', error);
      showNotification('error', 'Ошибка при сохранении учетных данных');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsCard>
      <SettingsCardContent>
        <SectionTitle variant="h5">
          <Icon icon="solar:lock-bold" width="24" height="24" />
          Настройки входа по логину и паролю
        </SectionTitle>
        
        {hasCredentials ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            У вас уже настроены учетные данные для входа. Вы можете обновить их при необходимости.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            Настройте учетные данные, чтобы иметь возможность входить по логину и паролю.
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!usernameError}
                helperText={usernameError}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Подтвердите пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={password !== confirmPassword && confirmPassword !== ''}
                helperText={password !== confirmPassword && confirmPassword !== '' ? 'Пароли не совпадают' : ''}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Сохранить'}
              </Button>
            </Grid>
          </Grid>
        </form>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </SettingsCardContent>
    </SettingsCard>
  );
};

export default LoginSettingsTab; 