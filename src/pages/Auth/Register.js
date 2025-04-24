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
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthCard from '../../components/AuthCard';
import AuthService from '../../services/AuthService';

const Register = ({ setUser }) => {
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
    <AuthCard 
      title="Регистрация" 
      subtitle="Создайте аккаунт в K-Connect"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
          {success}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Имя пользователя"
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          type="email"
          value={formData.email}
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
          autoComplete="new-password"
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
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Подтвердите пароль"
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Checkbox
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              color="primary"
            />
          }
          label={
            <span>
              Я согласен с <Link href="/terms-of-service" target="_blank">правилами пользования</Link>
            </span>
          }
          sx={{ mb: 2 }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ 
            mt: 1, 
            mb: 2,
            background: 'linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)',
            }
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
        </Button>
      </form>
      
      <Divider sx={{ my: 3, width: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          или
        </Typography>
      </Divider>
      
      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Уже есть аккаунт?{' '}
        <Link component={RouterLink} to="/login">
          Войти
        </Link>
      </Typography>
    </AuthCard>
  );
};

export default Register; 