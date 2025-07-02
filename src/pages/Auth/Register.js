import React, { useState } from 'react';
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
  Checkbox,
  FormControlLabel,
  Box,
  useMediaQuery,
  Container,
  Paper,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AuthService from '../../services/AuthService';
const Register = ({ setUser }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'agreeTerms' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    setError('');
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return false;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      setError('Имя пользователя может содержать только латинские буквы, цифры, ., _ и -');
      return false;
    }
    if (formData.username.length > 16) {
      setError('Имя пользователя не должно превышать 16 символов');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Пожалуйста, введите корректный email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('Необходимо согласиться с правилами пользования');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { username, email, password } = formData;
      console.log('Отправка данных регистрации:', { username, email, password: '***' });
      const response = await AuthService.register(username, email, password);
      console.log('Ответ регистрации:', response);
      if (response.success) {
        setSuccess(response.message || 'Регистрация успешна! Пожалуйста, проверьте свою почту для подтверждения аккаунта. После подтверждения вы сможете создать профиль.');
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      if (err.response && err.response.data) {
        console.error('Ответ сервера:', err.response.data);
        const errorMessage = err.response.data.error || 'Ошибка при регистрации';
        if (errorMessage.includes('username уже занят')) {
          setError('Это имя пользователя уже занято. Пожалуйста, выберите другое.');
        } else if (errorMessage.includes('email уже зарегистрирован')) {
          setError('Эта электронная почта уже зарегистрирована. Попробуйте войти или восстановить пароль.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Ошибка при регистрации. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };
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
              Создайте аккаунт и станьте частью нашего сообщества
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
              top: '24px',
              left: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5
            }}>
              <img 
                src="/static/icons/clear-logonew.svg" 
                alt="К-Коннект Лого" 
                style={{ width: 30, height: 30 }} 
              />
              <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
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
              mt: isMobile ? '70px' : 0,
              overflowY: 'auto',
              maxHeight: isMobile ? 'calc(100vh - 200px)' : 'fit-content',
              minHeight: isMobile ? 'auto' : '0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
              Регистрация
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Создайте аккаунт в К-Коннект и получите доступ ко всем возможностям
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
      {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {success}
              </Alert>
      )}
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Имя пользователя"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!error}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!error}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Пароль"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={!!error}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
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
        <TextField
          fullWidth
          label="Подтвердите пароль"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!error}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              color="primary"
                    sx={{
                      color: '#D0BCFF',
                      '&.Mui-checked': {
                        color: '#D0BCFF',
                      },
                    }}
            />
          }
          label={
                  <Typography variant="body2">
                    Я согласен с{' '}
                    <Link 
                      href="/terms-of-service" 
                      target="_blank"
                      sx={{ 
                        color: '#D0BCFF',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      правилами пользования
                    </Link>
                  </Typography>
          }
          sx={{ mb: 2 }}
        />
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
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
        </Button>
      </form>
            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
        <Typography variant="body2" color="text.secondary">
          или
        </Typography>
      </Divider>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
        Уже есть аккаунт?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login"
                  sx={{ 
                    color: '#D0BCFF',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
          Войти
        </Link>
      </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};
export default Register; 