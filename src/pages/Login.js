import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthCard from '../components/AuthCard';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, error: contextError, checkAuth } = useContext(AuthContext);

  // Check immediately if user is already authenticated and redirect to home page
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the session cookie exists
        const hasSessionCookie = document.cookie.split(';').some(cookie => 
          cookie.trim().startsWith('kconnect_session=')
        );
        
        // If session cookie exists, redirect to home immediately
        if (hasSessionCookie) {
          console.log('Session cookie found, redirecting to home page');
          navigate('/', { replace: true });
          return;
        }
        
        // Otherwise, check if user is already authenticated
        await checkAuth();
        
        // If authenticated, redirect to home page
        if (isAuthenticated) {
          console.log('User already authenticated, redirecting to home page');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuthentication();
  }, [checkAuth, isAuthenticated, navigate]);

  // Проверяем, есть ли сохраненное сообщение об ошибке при монтировании компонента
  useEffect(() => {
    const savedError = localStorage.getItem('login_error');
    if (savedError) {
      setError(savedError);
      // Очищаем сохраненную ошибку после того, как отобразили её
      localStorage.removeItem('login_error');
    }
  }, []);

  // Обработка ошибок из контекста авторизации
  useEffect(() => {
    if (contextError) {
      const errorMessage = contextError.details || contextError.message || 'Произошла ошибка при входе';
      setError(errorMessage);
      // Сохраняем ошибку в localStorage на случай перезагрузки страницы
      localStorage.setItem('login_error', errorMessage);
    }
  }, [contextError]);

  // Если пользователь уже авторизован, перенаправляем на главную
  // ТОЛЬКО если нет ошибок и это действительно успешная авторизация
  useEffect(() => {
    // Перенаправление только если:
    // 1. Пользователь авторизован 
    // 2. Нет ошибок в контексте или компоненте
    // 3. Не идет процесс загрузки
    if (isAuthenticated && !error && !contextError && !loading) {
      console.log('Успешная авторизация, перенаправляем на главную');
      // Очищаем возможные сохраненные ошибки перед редиректом
      localStorage.removeItem('login_error');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, error, contextError, loading]);
  
  // Обрабатываем сообщение от окна авторизации Telegram
  useEffect(() => {
    const handleTelegramAuthMessage = (event) => {
      if (event.data.type === 'telegram-auth-success') {
        if (event.data.user) {
          // Данные пользователя будут обновлены во время проверки авторизации
          localStorage.setItem('k-connect-user', JSON.stringify(event.data.user));
        }
        
        // Выполняем редирект
        if (event.data.needs_profile_setup) {
          navigate('/register/profile');
        } else if (event.data.redirect) {
          navigate(event.data.redirect);
        } else {
          navigate('/profile'); // Редирект на профиль по умолчанию
        }
      }
    };

    window.addEventListener('message', handleTelegramAuthMessage);
    
    return () => {
      window.removeEventListener('message', handleTelegramAuthMessage);
    };
  }, [navigate]);

  // Обработчик для входа через Element
  const handleElementLogin = () => {
    // Настраиваем обработчик сообщений от Element
    const elementAuthHandler = (event) => {
      try {
        // Проверяем источник сообщения для безопасности
        const elemPattern = /^https?:\/\/(.*\.)?elemsocial\.com(\/.*)?$/;
        if (!elemPattern.test(event.origin)) {
          console.warn("Получено сообщение с неизвестного источника:", event.origin);
          return;
        }

        // Если это сообщение с токеном авторизации от Element
        if (event.data && typeof event.data === 'string') {
          console.log("Получено сообщение от Element:", event.data);
          
          // Удаляем обработчик, чтобы избежать утечек памяти
          window.removeEventListener('message', elementAuthHandler);
          
          let token = null;
          
          // Проверяем различные возможные форматы URL
          if (event.data.includes('/auth_elem/')) {
            token = event.data.split('/auth_elem/')[1];
          } else if (event.data.includes('/auth/element/')) {
            token = event.data.split('/auth/element/')[1];
          } else if (event.data.includes('.')) {
            // Предполагаем, что сообщение само является токеном
            token = event.data;
          }
          
          if (token) {
            console.log("Извлечён токен авторизации Element:", token);
            // Перенаправляем на прямой маршрут авторизации через Element
            window.location.href = `/auth_elem/direct/${token}`;
          }
        }
      } catch (err) {
        console.error("Ошибка при обработке сообщения от Element:", err);
      }
    };

    // Добавляем обработчик событий сообщений
    window.addEventListener('message', elementAuthHandler);
    
    // Открываем страницу Element для авторизации
    window.location.href = "https://elemsocial.com/connect_app/0195a00f-826a-7a34-85f1-45065c8c727d";
  };
  
  // Функция для открытия окна авторизации через Telegram
  const handleTelegramLogin = () => {
    // Открываем новое окно по центру экрана
    const width = 550;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const telegramWindow = window.open(
      '/telegram-auth.html',
      'TelegramAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Очищаем ошибку при изменении полей
    localStorage.removeItem('login_error'); // Очищаем сохраненную ошибку
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Предотвращаем повторную отправку во время загрузки
    
    setLoading(true);
    setError('');
    localStorage.removeItem('login_error'); // Очищаем предыдущие ошибки
    
    try {
      const { usernameOrEmail, password } = formData;
      
      if (!usernameOrEmail || !password) {
        const errorMsg = 'Пожалуйста, заполните все поля';
        setError(errorMsg);
        localStorage.setItem('login_error', errorMsg);
        setLoading(false);
        return;
      }
      
      // Добавляем параметр preventRedirect: true, чтобы предотвратить автоматический редирект
      const result = await login({
        usernameOrEmail,
        password,
        preventRedirect: false
      });
      
      // Проверяем успешность входа или наличие ошибки
      if (result && !result.success && result.error) {
        // Отображаем ошибку из результата
        let errorMsg;
        if (result.error.includes('не верифицирован')) {
          errorMsg = 'Ваша почта не подтверждена. Пожалуйста, проверьте вашу электронную почту и перейдите по ссылке в письме для подтверждения аккаунта.';
        } else {
          errorMsg = result.error;
        }
        
        setError(errorMsg);
        // Сохраняем ошибку в localStorage для случая перезагрузки
        localStorage.setItem('login_error', errorMsg);
        
        // Явно устанавливаем loading в false, чтобы гарантировать, что форма разблокирована
        setLoading(false);
        
        // Принудительно устанавливаем фокус на кнопку входа для лучшего UX
        document.getElementById('login-button')?.focus();
        
        // Предотвращаем автоматическое перенаправление при ошибке
        return;
      }
      
      // Если мы здесь, значит вход был успешным
      // Очищаем любые сохраненные ошибки
      localStorage.removeItem('login_error');
      
      // При успешном входе, редирект будет выполнен через useEffect
    } catch (error) {
      const errorMsg = 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова.';
      setError(errorMsg);
      localStorage.setItem('login_error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Вход в аккаунт" 
      subtitle="Войдите в K-Connect для доступа к своему профилю"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
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
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ 
            mt: 2, 
            mb: 2,
            background: 'linear-gradient(90deg, #B69DF8 0%, #D0BCFF 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #D0BCFF 0%, #E9DDFF 100%)',
            }
          }}
          disabled={loading}
          id="login-button"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
        </Button>
        
        <Typography variant="body2" align="center" sx={{ mt: 1, mb: 2 }}>
          <Link component={RouterLink} to="/forgot-password" sx={{ color: '#D0BCFF' }}>
            Забыли пароль?
          </Link>
        </Typography>
      </form>
      
      <Divider sx={{ my: 3, width: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          или
        </Typography>
      </Divider>

      {/* Кнопка для входа через Element */}
      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2194 5.27527C7.49181 5.62505 4.98695 6.93564 3.17176 8.96273C1.35657 10.9898 0.354917 13.5951 0.353516 16.2929C0.353608 19.2413 1.54789 22.0688 3.67364 24.1536C5.79939 26.2384 8.68251 27.4096 11.6888 27.4097C14.6951 27.4096 17.5782 26.2384 19.7039 24.1536C21.8297 22.0688 23.024 19.2413 23.024 16.2929C23.0242 15.9984 23.0124 15.704 22.9887 15.4105C21.6194 16.2335 20.045 16.6699 18.4391 16.6714C16.1259 16.6713 13.9075 15.7701 12.2719 14.166C10.6362 12.5619 9.71732 10.3862 9.71728 8.11768C9.71938 7.14916 9.88917 6.18803 10.2194 5.27527Z" fill="#D0BCFF"/>
            <path d="M18.4401 15.9104C22.8285 15.9104 26.386 12.4214 26.386 8.11756C26.386 3.81372 22.8285 0.324768 18.4401 0.324768C14.0517 0.324768 10.4941 3.81372 10.4941 8.11756C10.4941 12.4214 14.0517 15.9104 18.4401 15.9104Z" fill="#D0BCFF"/>
          </svg>
        }
        onClick={handleElementLogin}
        sx={{ 
          mt: 0.2, 
          mb: 2,
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
          mb: 2,
          py: 1,
          borderColor: '#0088cc',
          color: '#0088cc',
          '&:hover': {
            borderColor: '#0088cc',
            backgroundColor: 'rgba(0, 136, 204, 0.1)',
          },
          svg: {
            fill: '#0088cc', // Иконка теперь белая
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


      
      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Ещё нет аккаунта?{' '}
        <Link component={RouterLink} to="/register" sx={{ color: '#D0BCFF' }}>
          Зарегистрироваться
        </Link>
      </Typography>
    </AuthCard>
  );
};

export default Login;
