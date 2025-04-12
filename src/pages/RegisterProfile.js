import React, { useState, useEffect } from 'react';
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
  Avatar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AuthCard from '../components/AuthCard';
import AuthService from '../services/AuthService';

const RegisterProfile = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    interests: '',
    about: '',
    agree_terms: false,
    agree_privacy: false,
    chat_id: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlChatId = params.get('chat_id');
    
    const storedChatId = localStorage.getItem('k-connect-chat-id');
    
    const chatId = urlChatId || storedChatId || '';
    
    if (chatId) {
      console.log('Found chat_id:', chatId);
      setFormData(prev => ({ ...prev, chat_id: chatId }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'agree_terms' || name === 'agree_privacy' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    setError('');
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Сохраняем файл в состоянии и создаем превью
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name) {
      setError('Имя не может быть пустым');
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
      // Получаем chat_id из LocalStorage, если он там есть
      const chatId = localStorage.getItem('k-connect-chat-id');
      
      // Создаем FormData для отправки профиля и аватара
      const profileFormData = new FormData();
      
      // Добавляем все поля формы
      Object.keys(formData).forEach(key => {
        profileFormData.append(key, formData[key]);
      });
      
      // Если есть сохраненный chat_id и он отсутствует в formData, добавляем его
      if (chatId && !formData.chat_id) {
        profileFormData.append('chat_id', chatId);
        console.log('Добавлен chat_id из localStorage:', chatId);
      }
      
      // Если есть аватар, добавляем его
      if (avatar) {
        profileFormData.append('photo', avatar);
      }
      
      // Логируем все данные, которые отправляем
      console.log('Отправка профиля:');
      for (let pair of profileFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const profileResponse = await AuthService.registerProfile(profileFormData);
      
      if (profileResponse.success && profileResponse.user) {
        setUser(profileResponse.user);
        localStorage.removeItem('k-connect-chat-id');
        navigate('/', { replace: true });
      } else if (profileResponse.error) {
        setError(profileResponse.error);
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        // Более понятное сообщение об ошибке для пользователя
        const errorMsg = err.response.data.error;
        if (errorMsg.includes('chat_id is required')) {
          setError('Ошибка идентификации. Попробуйте перейти по ссылке из письма повторно или обратитесь в поддержку.');
        } else if (errorMsg.includes('уже существует')) {
          setError('Профиль с этими данными уже существует. Попробуйте войти в систему.');
        } else {
          setError(errorMsg);
        }
      } else {
        setError('Ошибка при создании профиля. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Завершение регистрации" 
      subtitle="Заполните информацию о себе"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
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
              border: '2px solid var(--primary)'
            }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            Загрузить аватар
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
          label="Ваше имя"
          name="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="interests"
          label="Интересы"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 2 }}
          placeholder="Музыка, спорт, программирование..."
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="about"
          label="О себе"
          name="about"
          value={formData.about}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={4}
          sx={{ mb: 3 }}
          placeholder="Расскажите немного о себе..."
        />
        
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
            />
          }
          label={
            <Typography variant="body2">
              Я принимаю <a href="/terms" target="_blank" style={{ color: 'var(--primary)' }}>Правила пользования</a>
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
            />
          }
          label={
            <Typography variant="body2">
              Я согласен с <a href="/privacy" target="_blank" style={{ color: 'var(--primary)' }}>Политикой конфиденциальности</a>
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
            mb: 2,
            background: 'linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)',
            }
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Создать профиль'}
        </Button>
      </form>
    </AuthCard>
  );
};

export default RegisterProfile; 