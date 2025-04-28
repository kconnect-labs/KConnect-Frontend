import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Avatar,
  useMediaQuery,
  Container,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { motion } from 'framer-motion';
import AuthCard from '../../components/AuthCard';
import AuthService from '../../services/AuthService';
import { AuthContext } from '../../context/AuthContext';
const RegisterChannel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    interests: '',
    about: '',
    agree_terms: false,
    agree_privacy: false
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'agree_terms' || name === 'agree_privacy' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    setError('');
  };
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  };
  const validateForm = () => {
    if (!formData.name) {
      setError('Имя канала не может быть пустым');
      return false;
    }
    if (!formData.agree_terms || !formData.agree_privacy) {
      setError('Необходимо согласиться с правилами и политикой конфиденциальности');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      const channelFormData = new FormData();
      Object.keys(formData).forEach(key => {
        channelFormData.append(key, formData[key]);
      });
      channelFormData.append('account_type', 'channel');
      channelFormData.append('main_account_id', user.id);
      if (avatar) {
        channelFormData.append('photo', avatar);
      }
      const response = await fetch('/api/users/create-channel', {
        method: 'POST',
        body: channelFormData,
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/channel-dashboard', { replace: true });
      } else {
        setError(data.error || 'Произошла ошибка при создании канала');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Ошибка при создании канала. Пожалуйста, попробуйте позже.');
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
              Создайте свой канал и делитесь контентом с сообществом
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
              textAlign: 'center'
            }}>
              <img 
                src="/static/icons/clear-logonew.svg" 
                alt="К-Коннект Лого" 
                style={{ width: 80, marginBottom: 12 }} 
              />
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
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
              mt: isMobile ? '140px' : 0,
              overflowY: 'auto',
              maxHeight: isMobile ? 'calc(100vh - 200px)' : 'fit-content',
              minHeight: isMobile ? 'auto' : '0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
              Создание канала
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Заполните информацию о вашем новом канале
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
              </Alert>
            )}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 3 
              }}>
                <Avatar
                  src={avatarPreview}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 2,
                    border: '2px solid #D0BCFF'
                  }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ 
                    borderColor: '#D0BCFF', 
                    color: '#D0BCFF',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#B69DF8',
                      backgroundColor: 'rgba(208, 188, 255, 0.04)'
                    }
                  }}
                >
                  Загрузить аватар канала
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </Button>
              </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Название канала"
                name="name"
                autoFocus
                value={formData.name}
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
                fullWidth
                id="interests"
                label="Тематика канала"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                variant="outlined"
                placeholder="Музыка, спорт, программирование..."
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="about"
                label="Описание канала"
                name="about"
                value={formData.about}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                placeholder="Расскажите о своем канале..."
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Правовые соглашения
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agree_terms"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                    color="primary"
                    required
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
                    Я принимаю{' '}
                    <Button 
                      href="/terms-of-service" 
                      target="_blank" 
                      sx={{ 
                        color: '#D0BCFF',
                        p: 0,
                        minWidth: 'auto',
                        fontWeight: 'normal',
                        textTransform: 'none',
                        fontSize: 'inherit',
                        '&:hover': {
                          background: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Правила пользования
                    </Button>
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="agree_privacy"
                    checked={formData.agree_privacy}
                    onChange={handleChange}
                    color="primary"
                    required
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
                    <Button 
                      href="/privacy" 
                      target="_blank" 
                      sx={{ 
                        color: '#D0BCFF',
                        p: 0,
                        minWidth: 'auto',
                        fontWeight: 'normal',
                        textTransform: 'none',
                        fontSize: 'inherit',
                        '&:hover': {
                          background: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Политикой конфиденциальности
                    </Button>
                  </Typography>
                }
                sx={{ mb: 3 }}
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
                  },
                  mb: 2
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Создать канал'}
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};
export default RegisterChannel; 