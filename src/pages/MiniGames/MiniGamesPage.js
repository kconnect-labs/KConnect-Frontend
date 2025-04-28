import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Button, 
  Paper, 
  Chip,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import CasinoIcon from '@mui/icons-material/Casino';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import NumbersIcon from '@mui/icons-material/Numbers';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SEO from '../../components/SEO';

// Компоненты стилизации
const PageHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4, 2),
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.7)}, ${alpha(theme.palette.primary.main, 0.4)})`,
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
    zIndex: 0
  }
}));

const GameCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)'
    }
  }
}));

const GameCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  transition: 'transform 0.3s ease',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: `linear-gradient(to top, ${alpha(theme.palette.background.paper, 0.9)}, transparent)`,
  }
}));

const BalanceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.dark, 0.6)}, ${alpha(theme.palette.secondary.main, 0.3)})`,
  backdropFilter: 'blur(10px)',
  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 0
  }
}));

const PlayButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(5),
  padding: theme.spacing(1, 3),
  fontWeight: 'bold',
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
  }
}));

const InfoButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(5),
  padding: theme.spacing(1, 3),
  fontWeight: 'medium',
  border: `1px solid ${alpha(theme.palette.text.secondary, 0.5)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.secondary, 0.05),
    border: `1px solid ${theme.palette.text.secondary}`,
  }
}));

// Заглушки для изображений игр до загрузки с сервера
const DEFAULT_GAME_IMAGES = {
  cups: '/static/img/minigames/cups.jpg',
  dice: '/static/img/minigames/dice.jpg',
  lucky: '/static/img/minigames/lucky-number.jpg'
};

const MiniGamesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Запрос баланса пользователя
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/points');
        if (response?.data?.points !== undefined) {
          setUserBalance(parseInt(response.data.points));
        }
      } catch (error) {
        console.error('Ошибка при получении баланса:', error);
        toast.error('Не удалось загрузить баланс');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  // Форматирование чисел
  const formatNumber = (num) => {
    return parseInt(num).toLocaleString();
  };

  // Список доступных мини-игр
  const games = [

    {
      id: 'cups',
      name: 'Три чаши',
      description: 'Угадай, под какой чашей находится шарик, и удвой свою ставку!',
      icon: <LocalCafeIcon sx={{ fontSize: 40 }} />,
      color: '#e91e63',
      path: '/minigames/cups',
      available: true
    },
    {
      id: 'lucky-number',
      name: 'Счастливое Число',
      description: 'Выберите число и множитель, угадайте верно и получите крупный выигрыш!',
      icon: <NumbersIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/minigames/lucky-number',
      available: true
    },
    {
      id: 'clicker',
      name: 'Кликер',
      description: 'Кликай и зарабатывай баллы! Прокачивай свой клик и становись лучшим в таблице лидеров.',
      icon: <TouchAppIcon sx={{ fontSize: 40 }} />,
      color: '#3f51b5',
      path: '/clicker',
      available: true
    },
    {
      id: 'dice',
      name: 'Кости',
      description: 'Бросьте кости и выигрывайте в зависимости от выпавших комбинаций!',
      icon: <CasinoIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/minigames/dice',
      available: false
    },
    {
      id: 'coming-soon',
      name: 'Скоро',
      description: 'Новые мини-игры в разработке! Следите за обновлениями.',
      icon: <SportsEsportsIcon sx={{ fontSize: 40 }} />,
      color: '#607d8b',
      path: '',
      available: false
    }
  ];

  const handleGameClick = (path) => {
    if (path) navigate(path);
  };

  // Проверяем работоспособность API перед переходом
  const checkAPIandNavigate = async (game) => {
    if (!game.available || !game.path) return;
    
    try {
      setLoading(true);
      // Убираем проверку API, просто переходим на страницу игры
      navigate(game.path);
    } catch (error) {
      console.error(`Ошибка при переходе к ${game.name}:`, error);
      navigate(game.path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ 
      mt: { xs: 1, sm: 2 }, 
      mb: { xs: 10, sm: 10 },
      px: { xs: 1, sm: 2 },
      pb: { xs: '80px', sm: 0 } // Added padding for mobile bottom navigation
    }}>
      <SEO title="Мини-игры | К-Коннект" description="Играйте в мини-игры и зарабатывайте баллы" />
      
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: 4,
          background: `linear-gradient(145deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}05)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 0 }
        }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700, 
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}>
              Мини-игры
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Играйте в игры и зарабатывайте баллы
            </Typography>
          </Box>

        </Box>
      </Paper>

      <Grid container spacing={isMobile ? 2 : 3}>
        {games.map((game) => {
            const isClicker = game.id === 'clicker';
            return (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: { xs: 3, sm: 4 },
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                overflow: 'visible',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                },
                opacity: game.available ? 1 : 0.7
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -15,
                  left: 20,
                  zIndex: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: game.color,
                  boxShadow: `0 4px 10px ${alpha(game.color, 0.5)}`,
                  border: `3px solid ${theme.palette.background.paper}`,
                  color: '#fff',
                  transition: 'all 0.3s ease',
                }}
              >
                {game.icon}
              </Box>
              
              <Box
                sx={{
                  height: { xs: 140, sm: 160 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(game.color, 0.1),
                  transition: 'all 0.5s ease',
                  filter: game.available ? 'none' : 'grayscale(50%)',
                  overflow: 'hidden',
                  borderRadius: '48px',
                }}
              >
                <Box
                  sx={{
                    fontSize: 100,
                    color: alpha(game.color, 0.2),
                    transform: 'scale(1.5)',
                    opacity: 0.7,
                  }}
                >
                  {game.icon}
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, pt: 3, pb: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
                  {game.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {game.description}
                </Typography>
                
                <Button
                    variant="contained"
                    fullWidth
                    disabled={isClicker || loading}
                    onClick={() => checkAPIandNavigate(game)}
                    sx={{
                      mt: 'auto',
                      backgroundColor: game.color,
                      '&:hover': {
                        backgroundColor: alpha(game.color, 0.8),
                      },
                      borderRadius: 2,
                      fontWeight: 600,
                      height: { xs: 40, sm: 44 },
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {isClicker ? 'Сезон закончился' : (loading ? 'Загрузка...' : (game.available ? 'Играть' : 'Скоро'))}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      </Grid>
    </Container>
  );
};

export default MiniGamesPage; 