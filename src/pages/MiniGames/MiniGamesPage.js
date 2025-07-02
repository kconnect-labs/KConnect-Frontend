import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Paper, 
  Chip,
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
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SEO from '../../components/SEO';


const PageHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(4, 2),
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  position: 'relative',
  overflow: 'hidden',
}));

const GameCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,

}));


const BalanceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
  marginBottom: theme.spacing(1),
  position: 'relative',
  overflow: 'hidden',

}));

const PlayButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  fontWeight: 'bold',
  transition: 'all 0.2s ease',
  
}));




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
      description: 'Угадайте, под какой чашей находится шарик!',
      icon: <LocalCafeIcon sx={{ fontSize: 40 }} />,
      color: '#e91e63',
      path: '/minigames/cups',
      available: true
    },
    // {
    //   id: 'roulette',
    //   name: 'Рулетка',
    //   description: 'Крутите рулетку и выигрывайте!',
    //   icon: <CasinoIcon sx={{ fontSize: 40 }} />,
    //   color: '#ff9800',
    //   path: '/minigames/roulette',
    //   available: true
    // },
    {
      id: 'clicker',
      name: 'Кликер',
      description: 'Кликайте, чтобы зарабатывать баллы!',
      icon: <TouchAppIcon sx={{ fontSize: 40 }} />,
      color: '#3f51b5',
      path: '/minigames/clicker',
      available: true
    },
    {
      id: 'blackjack',
      name: '21',
      description: 'Наберите 21 очко или больше чем у дилера, не перебрав!',
      icon: <CasinoIcon sx={{ fontSize: 40 }} />,
      color: '#3f51b5',
      path: '/minigames/blackjack',
      available: true
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
        title="Мини-игры"
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
          <CreditCardIcon sx={{ fontSize: 40, color: 'primary.light' }} />
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
            color="primary"
            onClick={() => navigate('/balance')}
            sx={{ 
              borderRadius: '8px',
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
            <GameCard >

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
                
                <Typography variant="body2" color="text.secondary" paragraph sx={{marginBottom: '50px'}}>
                  {game.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, position: 'absolute', bottom: '10px', width: '90%'}}>
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