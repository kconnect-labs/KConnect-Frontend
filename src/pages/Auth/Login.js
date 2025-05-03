import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Link, 
  Divider, 
  Typography, 
  InputAdornment, 
  IconButton,
  Alert,
  CircularProgress,
  Box,
  useMediaQuery,
  Container,
  Paper,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AuthCard from '../../components/AuthCard';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banInfo, setBanInfo] = useState(null);
  const [redirectPath, setRedirectPath] = useState('/');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error: contextError, checkAuth } = useContext(AuthContext);

  
  useEffect(() => {
    
    const fromPath = location.state?.from;
    
    
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo');
    
    
    const savedRedirect = localStorage.getItem('redirect_after_login');
    
    
    if (redirectTo) {
      setRedirectPath(redirectTo);
    } else if (fromPath) {
      setRedirectPath(fromPath);
    } else if (savedRedirect) {
      setRedirectPath(savedRedirect);
      
      localStorage.removeItem('redirect_after_login');
    }
  }, [location]);

  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        
        const hasSessionCookie = document.cookie.split(';').some(cookie => 
          cookie.trim().startsWith('kconnect_session=')
        );
        
        
        if (hasSessionCookie) {
          console.log('Session cookie found, redirecting to saved path:', redirectPath);
          navigate(redirectPath, { replace: true });
          return;
        }
        
        
        await checkAuth();
        
        
        if (isAuthenticated) {
          console.log('User already authenticated, redirecting to saved path:', redirectPath);
          navigate(redirectPath, { replace: true });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuthentication();
  }, [checkAuth, isAuthenticated, navigate, redirectPath]);

  
  useEffect(() => {
    const savedError = localStorage.getItem('login_error');
    if (savedError) {
      try {
        
        const parsedError = JSON.parse(savedError);
        if (parsedError.ban_info) {
          setBanInfo(parsedError.ban_info);
        } else {
          setError(savedError);
        }
      } catch (e) {
        
        setError(savedError);
      }
      
      localStorage.removeItem('login_error');
    }
  }, []);

  
  useEffect(() => {
    if (contextError) {
      if (contextError.ban_info) {
        
        setBanInfo(contextError.ban_info);
        
        localStorage.setItem('login_error', JSON.stringify(contextError));
      } else {
        const errorMessage = contextError.details || contextError.message || 'Произошла ошибка при входе';
        setError(errorMessage);
        
        localStorage.setItem('login_error', errorMessage);
      }
    }
  }, [contextError]);

  
  
  useEffect(() => {
    
    
    
    
    
    if (isAuthenticated && !error && !contextError && !loading && !banInfo) {
      console.log('Успешная авторизация, перенаправляем на:', redirectPath);
      
      localStorage.removeItem('login_error');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, error, contextError, loading, banInfo, redirectPath]);
  
  
  useEffect(() => {
    const handleTelegramAuthMessage = (event) => {
      if (event.data.type === 'telegram-auth-success') {
        console.log('Получены данные аутентификации Telegram:', event.data);
        setLoading(true);
        
        try {
          
          if (event.data.user) {
            localStorage.setItem('kconnect-user', JSON.stringify(event.data.user));
          }
          
          
          if (event.data.needs_profile_setup) {
            localStorage.setItem('k-connect-needs-profile-setup', 'true');
          } else {
            localStorage.removeItem('k-connect-needs-profile-setup');
          }
          
          
          if (event.data.needs_profile_setup) {
            navigate('/register/profile');
          } else if (event.data.redirect) {
            navigate(event.data.redirect);
          } else {
            
            navigate(redirectPath !== '/' ? redirectPath : '/profile');
          }
        } catch (err) {
          console.error('Ошибка при обработке данных Telegram:', err);
          setError('Произошла ошибка при входе через Telegram. Пожалуйста, попробуйте снова.');
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener('message', handleTelegramAuthMessage);
    
    return () => {
      window.removeEventListener('message', handleTelegramAuthMessage);
    };
  }, [navigate, redirectPath]);

  
  const handleElementLogin = () => {
    
    const elementAuthHandler = (event) => {
      try {
        
        const elemPattern = /^https?:\/\/(.*\.)?elemsocial\.com(\/.*)?$/;
        if (!elemPattern.test(event.origin)) {
          console.warn("Получено сообщение с неизвестного источника:", event.origin);
          return;
        }

        
        if (event.data && typeof event.data === 'string') {
          console.log("Получено сообщение от Element:", event.data);
          
          
          window.removeEventListener('message', elementAuthHandler);
          
          let token = null;
          
          
          if (event.data.includes('/auth_elem/')) {
            token = event.data.split('/auth_elem/')[1];
          } else if (event.data.includes('/auth/element/')) {
            token = event.data.split('/auth/element/')[1];
          } else if (event.data.includes('.')) {
            
            token = event.data;
          }
          
          if (token) {
            console.log("Извлечён токен авторизации Element:", token);
            
            window.location.href = `/auth_elem/direct/${token}`;
          }
        }
      } catch (err) {
        console.error("Ошибка при обработке сообщения от Element:", err);
      }
    };

    
    window.addEventListener('message', elementAuthHandler);
    
    
    window.location.href = "https://elemsocial.com/connect_app/0195a00f-826a-7a34-85f1-45065c8c727d";
  };
  
  
  const handleTelegramLogin = () => {
    
    setError('');
    
    
    const width = 550;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const telegramWindow = window.open(
      '/telegram-auth.html',
      'TelegramAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    
    if (!telegramWindow || telegramWindow.closed || typeof telegramWindow.closed === 'undefined') {
      setError('Не удалось открыть окно авторизации. Пожалуйста, проверьте настройки блокировки всплывающих окон в вашем браузере.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); 
    setBanInfo(null); 
    localStorage.removeItem('login_error'); 
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; 
    
    setLoading(true);
    setError('');
    setBanInfo(null);
    localStorage.removeItem('login_error'); 
    
    try {
      const { usernameOrEmail, password } = formData;
      
      if (!usernameOrEmail || !password) {
        const errorMsg = 'Пожалуйста, заполните все поля';
        setError(errorMsg);
        localStorage.setItem('login_error', errorMsg);
        setLoading(false);
        return;
      }
      
      
      const result = await login({
        usernameOrEmail,
        password,
        preventRedirect: false
      });
      
      
      if (result && !result.success) {
        if (result.ban_info) {
          
          setBanInfo(result.ban_info);
          localStorage.setItem('login_error', JSON.stringify(result));
        } else if (result.error) {
          
          let errorMsg;
          if (result.error.includes('не верифицирован')) {
            errorMsg = 'Ваша почта не подтверждена. Пожалуйста, проверьте вашу электронную почту и перейдите по ссылке в письме для подтверждения аккаунта.';
          } else {
            errorMsg = result.error;
          }
          
          setError(errorMsg);
          
          localStorage.setItem('login_error', errorMsg);
        }
        
        
        setLoading(false);
        
        
        document.getElementById('login-button')?.focus();
        
        
        return;
      }
      
      
      
      localStorage.removeItem('login_error');
      
      
    } catch (error) {
      const errorMsg = 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова.';
      setError(errorMsg);
      localStorage.setItem('login_error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  
  const formatBanExpiration = (expirationDate) => {
    if (!expirationDate) return 'Неизвестно';
    
    try {
      const date = new Date(expirationDate);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting ban date:', e);
      return expirationDate;
    }
  };
  
  
  const getBanTimeRemaining = (expirationDate) => {
    if (!expirationDate) return null;
    
    try {
      const expiration = new Date(expirationDate);
      const now = new Date();
      
      if (expiration <= now) return 'Срок блокировки истёк';
      
      const diffMs = expiration - now;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `${diffDays} д. ${diffHours} ч.`;
      } else {
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours} ч. ${diffMinutes} мин.`;
      }
    } catch (e) {
      console.error('Error calculating ban time remaining:', e);
      return null;
    }
  };

  
  if (banInfo) {
    return (
      <Container 
        maxWidth={false} 
        disableGutters
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={6}
            sx={{ 
              p: isMobile ? 3 : 4, 
              width: '90%',
              maxWidth: '480px',
              borderRadius: 4,
              background: 'rgba(30, 30, 40, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <img 
                src="/static/icons/clear-logonew.svg" 
                alt="К-Коннект Лого" 
                style={{ width: isMobile ? 80 : 100, marginBottom: 16 }}
              />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Аккаунт заблокирован
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Вход в аккаунт временно ограничен
              </Typography>
            </Box>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 3, 
                width: '100%', 
                backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                border: '1px solid rgba(211, 47, 47, 0.3)',
                borderRadius: 3
              }}
            >
              <Typography variant="h6" sx={{ color: '#d32f2f', mb: 1 }}>
                Ваш аккаунт временно заблокирован
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                Причина: {banInfo.reason}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                Бан истечет: {banInfo.formatted_end_date}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                Осталось дней: {banInfo.remaining_days}
              </Typography>
              
              {banInfo.is_auto_ban && (
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Блокировка выдана автоматически за получение 3 предупреждений от модераторов.
                </Typography>
              )}
            </Paper>
            
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#D0BCFF',
                  color: '#D0BCFF',
                  '&:hover': {
                    borderColor: '#B69DF8',
                    backgroundColor: 'rgba(208, 188, 255, 0.04)'
                  }
                }}
              >
                Вернуться на главную
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    );
  }

  return (
    <Container 
      disableGutters
      maxWidth={false} 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      
      {!isMobile && (
        <Box 
          sx={{ 
            flex: '0 0 45%',
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 1) 0%, rgba(40, 40, 60, 0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            p: 6
          }}
        >
          <Box sx={{ 
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: 'radial-gradient(circle, rgba(208, 188, 255, 0.05) 0%, rgba(208, 188, 255, 0) 70%)',
            zIndex: 0
          }} />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <img 
              src="/static/icons/clear-logonew.svg" 
              alt="К-Коннект Лого" 
              style={{ width: 180, marginBottom: 40 }} 
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              <span style={{ color: '#D0BCFF' }}>К</span>-КОННЕКТ
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 400 }}>
              Присоединяйтесь к нашему сообществу и открывайте новые возможности
            </Typography>
          </motion.div>
          
          
          <Box sx={{ 
            position: 'absolute', 
            bottom: 40, 
            left: 0, 
            right: 0, 
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + (i * 0.2) }}
              >
                <Box sx={{ 
                  width: 12 + (i * 4), 
                  height: 12 + (i * 4), 
                  borderRadius: '50%', 
                  background: `rgba(208, 188, 255, ${0.6 - (i * 0.15)})` 
                }} />
              </motion.div>
            ))}
          </Box>
        </Box>
      )}
      
      
      <Box 
        sx={{ 
          flex: isMobile ? 1 : '0 0 55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0,
          background: isMobile ? 'linear-gradient(135deg, rgba(20, 20, 30, 1) 0%, rgba(40, 40, 60, 0.95) 100%)' : 'transparent'
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '16px' : '40px'
          }}
        >
          
          {isMobile && (
            <Box sx={{ 
              position: 'absolute',
              top: '32px',
              left: 0,
              width: '100%',
              textAlign: 'center'
            }}>
              <img 
                src="/static/icons/clear-logonew.svg" 
                alt="К-Коннект Лого" 
                style={{ width: 90, marginBottom: 16 }} 
              />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                <span style={{ color: '#D0BCFF' }}>К</span>-КОННЕКТ
              </Typography>
            </Box>
          )}

          <Paper 
            elevation={isMobile ? 0 : 6}
            sx={{ 
              p: isMobile ? 3 : 4,
              width: '100%',
              maxWidth: '480px',
              borderRadius: 4,
              background: isMobile ? 'transparent' : 'rgba(30, 30, 40, 0.85)',
              backdropFilter: 'blur(10px)',
              border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              mt: isMobile ? '120px' : 0
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
              Вход в аккаунт
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Войдите в К-Коннект для доступа к своему профилю
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="usernameOrEmail"
                label="Имя пользователя или Email"
                name="usernameOrEmail"
                autoComplete="username"
                autoFocus
                value={formData.usernameOrEmail}
                onChange={handleChange}
                variant="outlined"
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Link 
                  component={RouterLink} 
                  to="/forgot-password" 
                  sx={{ 
                    color: '#D0BCFF',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Забыли пароль?
                </Link>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(90deg, #B69DF8 0%, #D0BCFF 100%)',
                  boxShadow: '0 4px 12px rgba(182, 157, 248, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #D0BCFF 0%, #E9DDFF 100%)',
                    boxShadow: '0 6px 16px rgba(182, 157, 248, 0.4)',
                  }
                }}
                disabled={loading}
                id="login-button"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
              </Button>
            </form>
            
            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
              <Typography variant="body2" color="text.secondary">
                или
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={
                  <svg width="24" height="24" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2194 5.27527C7.49181 5.62505 4.98695 6.93564 3.17176 8.96273C1.35657 10.9898 0.354917 13.5951 0.353516 16.2929C0.353608 19.2413 1.54789 22.0688 3.67364 24.1536C5.79939 26.2384 8.68251 27.4096 11.6888 27.4097C14.6951 27.4096 17.5782 26.2384 19.7039 24.1536C21.8297 22.0688 23.024 19.2413 23.024 16.2929C23.0242 15.9984 23.0124 15.704 22.9887 15.4105C21.6194 16.2335 20.045 16.6699 18.4391 16.6714C16.1259 16.6713 13.9075 15.7701 12.2719 14.166C10.6362 12.5619 9.71732 10.3862 9.71728 8.11768C9.71938 7.14916 9.88917 6.18803 10.2194 5.27527Z" fill="#D0BCFF"/>
                    <path d="M18.4401 15.9104C22.8285 15.9104 26.386 12.4214 26.386 8.11756C26.386 3.81372 22.8285 0.324768 18.4401 0.324768C14.0517 0.324768 10.4941 3.81372 10.4941 8.11756C10.4941 12.4214 14.0517 15.9104 18.4401 15.9104Z" fill="#D0BCFF"/>
                  </svg>
                }
                onClick={handleElementLogin}
                sx={{ 
                  py: 1.25,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#D0BCFF',
                  color: '#D0BCFF',
                  '&:hover': {
                    borderColor: '#B69DF8',
                    backgroundColor: 'rgba(208, 188, 255, 0.04)'
                  }
                }}
              >
                Войти через Element
              </Button>
              
              
              <Button
                fullWidth
                variant="outlined"
                onClick={handleTelegramLogin}
                sx={{ 
                  py: 1.25,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#0088cc',
                  color: '#0088cc',
                  '&:hover': {
                    borderColor: '#0088cc',
                    backgroundColor: 'rgba(0, 136, 204, 0.1)',
                  },
                  svg: {
                    fill: '#0088cc',
                  }
                }}
                startIcon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 240 240"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M120,0C53.73,0,0,53.73,0,120s53.73,120,120,120s120-53.73,120-120S186.27,0,120,0z M177.36,78.13l-20.52,97.21
                      c-1.55,6.99-5.61,8.71-11.36,5.42l-31.41-23.15l-15.15,14.59c-1.67,1.67-3.07,3.07-6.28,3.07l2.24-31.78l57.87-52.26
                      c2.51-2.24-0.55-3.49-3.89-1.26l-71.48,45.05l-30.78-9.61c-6.69-2.07-6.84-6.69,1.39-9.89l120.44-46.44
                      C173.26,66.55,179.35,70.1,177.36,78.13z"/>
                  </svg>
                }
              >
                Войти через Telegram
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2">
                Ещё нет аккаунта?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  sx={{ 
                    color: '#D0BCFF',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;
