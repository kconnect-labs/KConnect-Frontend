import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Typography, 
  Paper,
  Link,
  Alert,
  CircularProgress,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../../components/SEO';

const ResetPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    // Extract token from URL parameters or hash
    const extractToken = () => {
      // First try from regular search params
      const params = new URLSearchParams(location.search);
      let tokenFromUrl = params.get('token');
      
      // If not found, try to extract from hash (for hash router format)
      if (!tokenFromUrl && window.location.hash) {
        const hashParts = window.location.hash.split('?');
        if (hashParts.length > 1) {
          const hashParams = new URLSearchParams(hashParts[1]);
          tokenFromUrl = hashParams.get('token');
        }
      }
      
      return tokenFromUrl;
    };
    
    const tokenFromUrl = extractToken();
    console.log('ResetPassword component - attempting to extract token:', tokenFromUrl ? `${tokenFromUrl.substring(0, 20)}...` : 'not found');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Clear any existing error since we found a token
      setTokenError('');
    } else {
      console.log('No reset token found in URL');
      setTokenError('Токен сброса пароля не найден. Пожалуйста, убедитесь, что вы перешли по правильной ссылке.');
      
      // If no token is present, redirect to forgot password page after a short delay
      setTimeout(() => {
        navigate('/forgot-password');
      }, 3000);
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.');
      return;
    }

    // Check password strength
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasLowercase, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    if (strength < 3) {
      setError('Пароль недостаточно надежный. Используйте комбинацию прописных и строчных букв, цифр и специальных символов.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/reset-password', { 
        token,
        password 
      });
      
      if (response.data.success) {
        setSuccess(response.data.message || 'Пароль успешно изменен. Теперь вы можете войти с новым паролем.');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.error || 'Произошла ошибка при сбросе пароля. Пожалуйста, попробуйте позже.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Произошла ошибка при сбросе пароля. Пожалуйста, попробуйте позже.');
      } else {
        setError('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
      <SEO
        title="Сброс пароля | К-Коннект"
        description="Сброс пароля в социальной сети К-Коннект"
      />
      
      {/* Left panel (visible only on desktop) */}
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
              Создайте новый пароль для доступа к вашему аккаунту
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
      
      {/* Right panel */}
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
          {/* Mobile header */}
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
              Сброс пароля
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Создайте новый пароль для входа в аккаунт
            </Typography>
            
            {tokenError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {tokenError}
                <Box mt={2}>
                  <Link 
                    component={RouterLink} 
                    to="/forgot-password" 
                    sx={{ 
                      color: '#D0BCFF',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Запросить новую ссылку для сброса пароля
                  </Link>
                </Box>
              </Alert>
            )}
            
            {error && !tokenError && (
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

            {!tokenError && (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Новый пароль"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                  name="confirmPassword"
                  label="Подтвердите пароль"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !password || !confirmPassword || tokenError}
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
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Сбросить пароль'}
                </Button>
              </Box>
            )}
            
            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Вспомнили пароль?{' '}
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

export default ResetPassword; 