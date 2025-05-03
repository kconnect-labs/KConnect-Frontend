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
  backgroundSize: 'cover',
  backgroundPosition: 'center',
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


const DEFAULT_GAME_IMAGES = {
  cups: '/static/img/minigames/cups.png',
  dice: '/static/img/minigames/dice.png',
  lucky: '/static/img/minigames/lucky-number.png',
  clicker: '/static/img/minigames/clicker.png'
};

const generateBackgroundStyles = (gameId, color) => {
  const colors = {
    cups: '#e91e63',
    'lucky-number': '#9c27b0',
    clicker: '#3f51b5',
    dice: '#ff9800',
    'coming-soon': '#607d8b'
  };
  
  const gameColor = color || colors[gameId] || '#3f51b5';
  
  return {
    backgroundImage: `linear-gradient(45deg, ${alpha(gameColor, 0.8)}, ${alpha(gameColor, 0.4)})`,
    backgroundSize: 'cover',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 70%)',
      opacity: 0.8,
      zIndex: 1
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'rgba(255,255,255,0.1)\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      backgroundSize: '150px',
      opacity: 0.5,
      zIndex: 2
    }
  };
};

const MiniGamesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  
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

  
  const formatNumber = (num) => {
    return parseInt(num).toLocaleString();
  };

  
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
      available: false,
      seasonEnded: true
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

  
  const checkAPIandNavigate = async (game) => {
    if (!game.available || !game.path) return;
    
    try {
      setLoading(true);
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
      pb: { xs: '80px', sm: 0 } 
    }}>
      <SEO 
        title="Мини-игры | K-Connect"
        description="Играйте в увлекательные мини-игры и зарабатывайте баллы!"
      />
      
      <PageHeader>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
              Мини-игры
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ position: 'relative', zIndex: 1 }}>
          Играйте и зарабатывайте баллы в наших увлекательных мини-играх!
        </Typography>
      </PageHeader>

      <BalanceCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', position: 'relative', zIndex: 1 }}>
          <CreditCardIcon sx={{ fontSize: 40, color: 'secondary.light' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Ваш баланс
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                userBalance !== null ? `${formatNumber(userBalance)} баллов` : 'Загрузка...'
              )}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/balance')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 120
            }}
          >
            Пополнить
          </Button>
        </Box>
      </BalanceCard>

      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <GameCard>
              <Box sx={{ 
                height: 200, 
                width: '100%', 
                ...generateBackgroundStyles(game.id, game.color),
                position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                {(game.id === 'cups' || game.id === 'dice' || game.id === 'lucky-number' || game.id === 'clicker') && (
                  <Box 
                    component="img"
                    src={DEFAULT_GAME_IMAGES[game.id === 'lucky-number' ? 'lucky' : game.id]}
                    alt={game.name}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '80%',
                      maxHeight: '80%',
                      objectFit: 'contain',
                      zIndex: 10
                    }}
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(game.color, 0.1),
                    color: game.color,
                    display: 'flex'
                  }}>
                  {game.icon}
                </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                  {game.name}
                </Typography>
                    {!game.available && (
                      <Chip 
                        label={game.seasonEnded ? "Сезон закончился" : "Скоро"} 
                        size="small" 
                        color={game.seasonEnded ? "error" : "secondary"}
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {game.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <PlayButton
                    variant="contained"
                    fullWidth
                    disabled={!game.available}
                    onClick={() => checkAPIandNavigate(game)}
                    sx={{
                      opacity: game.seasonEnded ? 0.6 : 1
                    }}
                  >
                    {game.seasonEnded ? 'Сезон закончился' : (game.available ? 'Играть' : 'Скоро')}
                  </PlayButton>
                  
                  {game.available && !game.seasonEnded && false && (
                    <Button
                      variant="outlined"
                      onClick={() => handleGameClick(game.path)}
                    >
                      Инфо
                </Button>
                  )}
                </Box>
              </CardContent>
            </GameCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MiniGamesPage; 