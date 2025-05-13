import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import DiamondIcon from '@mui/icons-material/Diamond';
import KeyIcon from '@mui/icons-material/Key';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

const StyledCard = styled(Card)(({ theme, type }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  boxShadow: type === 'ultimate' 
    ? '0 8px 20px rgba(124, 77, 255, 0.2)'
    : type === 'premium' 
      ? '0 8px 20px rgba(186, 104, 200, 0.2)'
      : '0 8px 20px rgba(66, 165, 245, 0.2)',
  border: type === 'ultimate'
    ? '1px solid rgba(124, 77, 255, 0.3)'
    : type === 'premium'
      ? '1px solid rgba(186, 104, 200, 0.3)'
      : '1px solid rgba(66, 165, 245, 0.3)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: type === 'ultimate' 
      ? '0 12px 30px rgba(124, 77, 255, 0.3)'
      : type === 'premium'
        ? '0 12px 30px rgba(186, 104, 200, 0.3)'
        : '0 12px 30px rgba(66, 165, 245, 0.3)',
  },
  '&::before': type === 'ultimate' ? {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.3) 0%, rgba(0, 0, 0, 0) 60%)',
    borderRadius: '0 0 0 100%',
    zIndex: 0,
  } : {}
}));

const StyledCardHeader = styled(CardHeader)(({ theme, type }) => ({
  backgroundColor: type === 'ultimate'
    ? alpha('#7c4dff', 0.15)
    : type === 'premium'
      ? alpha('#ba68c8', 0.15)
      : alpha('#42a5f5', 0.15),
  borderBottom: type === 'ultimate'
    ? '1px solid rgba(124, 77, 255, 0.2)'
    : type === 'premium'
      ? '1px solid rgba(186, 104, 200, 0.2)'
      : '1px solid rgba(66, 165, 245, 0.2)',
  '& .MuiCardHeader-title': {
    fontWeight: 700,
    fontSize: '1.25rem',
    color: type === 'ultimate'
      ? '#7c4dff'
      : type === 'premium'
        ? '#ba68c8'
        : '#42a5f5',
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.9rem',
    color: 'text.secondary'
  }
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .currency': {
    fontSize: '1rem',
    marginLeft: theme.spacing(0.5),
    opacity: 0.8,
  }
}));

const FeatureIcon = styled(CheckIcon)(({ theme, type }) => ({
  color: type === 'ultimate'
    ? '#7c4dff'
    : type === 'premium'
      ? '#ba68c8'
      : '#42a5f5',
}));

const KeyActivationField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const PopularBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: '#f44336',
  color: '#fff',
  fontWeight: 'bold',
  zIndex: 5,
}));

const SubPlanes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [subscriptionKey, setSubscriptionKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const typesResponse = await axios.get('/api/admin/subscription-types');
        setSubscriptionTypes(typesResponse.data.subscription_types || []);

        
        const statusResponse = await axios.get('/api/user/subscription/status');
        if (statusResponse.data.active) {
          setUserSubscription({
            type: statusResponse.data.subscription_type,
            expires_at: statusResponse.data.expiration_date,
            features: statusResponse.data.features || []
          });
        } else {
          setUserSubscription(null);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных о подписках:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const formatKeyInput = (input) => {
    
    let formatted = input.replace(/[^a-zA-Z0-9]/g, '');
    
    
    let result = '';
    for (let i = 0; i < formatted.length; i++) {
      if (i > 0 && i % 4 === 0 && i < formatted.length) {
        result += '-';
      }
      result += formatted[i];
    }
    
    return result.toUpperCase().slice(0, 23); 
  };

  const handleKeyChange = (e) => {
    const formattedValue = formatKeyInput(e.target.value);
    setSubscriptionKey(formattedValue);
  };

  
  const isValidKeyFormat = (key) => {
    
    const keyWithoutDashes = key.replace(/-/g, '');
    return keyWithoutDashes.length >= 16; 
  };

  
  const handleActivateKey = async () => {
    if (!subscriptionKey) {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, введите ключ активации',
        severity: 'error'
      });
      return;
    }

    setIsActivating(true);
    setError(null);
    
    try {
      
      const cleanKey = subscriptionKey.replace(/-/g, '');
      console.log('Sending key:', cleanKey);
      
      const response = await axios.post('/api/user/redeem-key', { 
        key: cleanKey
      });
      
      console.log('Redeem response:', response.data);
      
      if (response.data.success) {
        setSuccess(true);
        setSnackbar({
          open: true,
          message: response.data.message || `Успешно активирована ${response.data.subscription_type || ''} подписка!`,
          severity: 'success'
        });
        
        
        setTimeout(() => {
          setSubscriptionKey('');
          
          const fetchData = async () => {
            try {
              
              const statusResponse = await axios.get('/api/user/subscription/status');
              if (statusResponse.data.active) {
                setUserSubscription({
                  type: statusResponse.data.subscription_type,
                  expires_at: statusResponse.data.expiration_date,
                  features: statusResponse.data.features || []
                });
              } else {
                setUserSubscription(null);
              }
            } catch (err) {
              console.error('Ошибка при обновлении данных о подписке:', err);
            }
          };
          
          fetchData();
        }, 1000);
      } else {
        throw new Error(response.data.message || 'Ошибка активации ключа');
      }
    } catch (error) {
      console.error('Error activating key:', error);
      setError(error);
      
      
      let errorMessage = '';
      
      if (error.response) {
        

        if (error.response.data && 
            error.response.data.error && 
            error.response.data.error.includes('Невозможно активировать подписку') && 
            error.response.data.error.includes('так как у вас уже есть подписка более высокого уровня')) {
          errorMessage = error.response.data.error;
        } else {
          switch (error.response.status) {
            case 404:
              errorMessage = '404 - Неверный ключ';
              break;
            case 400:
              errorMessage = error.response.data?.error || '400 - Данный ключ уже не действителен!';
              break;
            case 403:
              errorMessage = '403 - Доступ запрещен';
              break;
            case 500:
              errorMessage = '500 - Ошибка сервера';
              break;
            default:
              errorMessage = error.response.data?.message || `Ошибка ${error.response.status}`;
          }
        }
      } else if (error.request) {
        
        errorMessage = 'Сервер не отвечает';
      } else {
        
        errorMessage = error.message || 'Ошибка активации ключа';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsActivating(false);
    }
  };

  
  const handleBuySubscription = () => {
    window.open('https://boosty.to/qsoul', '_blank');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  
  const getSubscriptionColor = (type) => {
    switch (type) {
      case 'ultimate':
        return '#7c4dff';
      case 'premium':
        return '#ba68c8';
      default:
        return '#42a5f5';
    }
  };

  
  const subscriptionPrices = {
    basic: '59₽',
    premium: '99₽',
    ultimate: '199₽'
  };
  
  
  const subscriptionDescriptions = {
    basic: 'Для тех, кто хочет немного больше чем простой пользователь.',
    premium: 'Расширенный функционал для активных пользователей платформы.',
    ultimate: 'Максимальные возможности без ограничений для настоящих ценителей.'
  };
  
  
  const subscriptionFeatures = {
    basic: [
      'Создание 5 Бейджиков',
      'Покупка 5 Никнеймов',
      'Базовая поддержка',
      'Ежемесячное пополнение на 1.000 баллов'
    ],
    premium: [
      'Все преимущества Basic',
      'Создание 8 Бейджиков',
      'Покупка 8 Никнеймов',
      'Приоритетная поддержка',
      'Установка статуса',
      'Изменение цвета профиля',
      'Ежемесячное пополнение на 5.000 баллов',
      "Установка статуса для каналов",
      "Изменение цвета канала",
    ],
    ultimate: [
      'Все преимущества Premium',
      'Неограниченное количество никнеймов',
      'Неограниченное количество бейджиков',
      'Создание анимированных бейджиков',
      'Любой цвет профиля/канала',
      'Ежемесячное пополнение на 10.000 баллов',
      'Ультима чат - голосование на обновление',
      "Лудка вместе с владельцем сайта"
    ]
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Планы подписок
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Выберите подходящий для вас план подписки и получите доступ к расширенным возможностям платформы
        </Typography>
      </Box>

      {}
      {userSubscription && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(getSubscriptionColor(userSubscription.type), 0.3)}`
          }}
        >
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
            <DiamondIcon sx={{ color: getSubscriptionColor(userSubscription.type), fontSize: 40 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {userSubscription.type === 'basic' ? 'Basic' : 
                 userSubscription.type === 'premium' ? 'Premium' : 
                 userSubscription.type === 'ultimate' ? 'Ultimate' : 'Подписка'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Активна до: {formatDate(userSubscription.expires_at)}
              </Typography>
            </Box>
            <Chip 
              label="Активна" 
              color="success" 
              size="small" 
              sx={{ ml: 'auto' }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Ваши преимущества:
          </Typography>
          <Grid container spacing={2}>
            {subscriptionFeatures[userSubscription.type]?.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckIcon sx={{ color: getSubscriptionColor(userSubscription.type), fontSize: 18 }} />
                  <Typography variant="body2">{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom align="center">
          Выберите подходящий для вас план подписки и получите доступ к расширенным возможностям платформы.
        </Typography>
        
        <Grid container spacing={3} mt={2}>
          {}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Basic
              </Typography>
              <Typography variant="h4" component="div" color="primary" fontWeight="bold" my={1}>
                {subscriptionPrices.basic}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {subscriptionDescriptions.basic}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                {subscriptionFeatures.basic.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleOutline sx={{ color: 'primary.main', mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleBuySubscription}
                sx={{ mt: 3, textTransform: 'none', py: 1 }}
              >
                Купить
              </Button>
            </Paper>
          </Grid>
          
          {}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                boxShadow: 4,
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'primary.main',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                Популярный
              </Box>
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Premium
              </Typography>
              <Typography variant="h4" component="div" color="primary" fontWeight="bold" my={1}>
                {subscriptionPrices.premium}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {subscriptionDescriptions.premium}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                {subscriptionFeatures.premium.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleOutline sx={{ color: 'primary.main', mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleBuySubscription}
                sx={{ mt: 3, textTransform: 'none', py: 1 }}
              >
                Купить
              </Button>
            </Paper>
          </Grid>
          
          {}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                boxShadow: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #7b68ee 0%, #3b5998 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Ultimate
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" my={1} sx={{ color: 'white' }}>
                {subscriptionPrices.ultimate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                {subscriptionDescriptions.ultimate}
              </Typography>
              <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
              <Box sx={{ flexGrow: 1 }}>
                {subscriptionFeatures.ultimate.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleOutline sx={{ color: 'white', mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>{feature}</Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleBuySubscription}
                sx={{
                  mt: 3,
                  textTransform: 'none',
                  py: 1,
                  bgcolor: 'white',
                  color: 'primary.dark',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Купить
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyIcon />
          Активация ключа подписки
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Если у вас есть ключ активации подписки, введите его ниже для получения доступа к выбранному плану
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
          <KeyActivationField
            fullWidth
            variant="outlined"
            placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
            value={subscriptionKey}
            onChange={handleKeyChange}
            disabled={isActivating}
            InputProps={{
              startAdornment: <KeyIcon sx={{ mr: 1, opacity: 0.7 }} />,
            }}
          />
          <Button
            variant="contained"
            onClick={handleActivateKey}
            disabled={subscriptionKey.length < 3 || isActivating}
            sx={{ 
              borderRadius: 2,
              minWidth: { xs: '100%', sm: 150 }
            }}
          >
            {isActivating ? <CircularProgress size={24} /> : 'Активировать'}
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          Для покупки подписки перейдите по ссылке <a href="https://boosty.to/qsoul" target="_blank" rel="noopener noreferrer" style={{color: '#90caf9'}}>boosty.to/qsoul</a>
        </Alert>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SubPlanes;