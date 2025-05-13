import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper, Grid, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlayingCard from './components/PlayingCard';
import SEO from '../../components/SEO';


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#121212',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#333333' : '#2a2a2a'}`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  color: '#ffffff'
}));

const GameButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 3,
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
  }
}));

const BlackjackPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  

  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState(null);
  

  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState('');
  

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/points');
      if (response?.data?.points !== undefined) {
        setBalance(parseInt(response.data.points));
      }
    } catch (err) {
      console.error('Ошибка при получении баланса:', err);
      setError('Не удалось загрузить баланс. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, []);
  

  const startNewGame = async () => {
    if (betAmount < 10 || betAmount > 2000) {
      setError('Ставка должна быть от 10 до 2000');
      return;
    }
    
    if (betAmount > balance) {
      setError('Недостаточно средств для такой ставки');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/minigames/blackjack/new-game', {
        bet: betAmount
      });
      
      if (response.data.success) {
        setGameState(response.data);
        setGameStarted(true);
        setBalance(response.data.balance);
        

        if (response.data.game_over) {
          showResult(response.data.result, response.data.message);
        }
      } else {
        setError(response.data.error || 'Ошибка при запуске игры');
      }
    } catch (error) {
      console.error('Ошибка при запуске игры:', error);
      setError('Не удалось запустить игру');
    } finally {
      setLoading(false);
    }
  };
  

  const hitCard = async () => {
    if (!gameState || gameState.game_over) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/minigames/blackjack/hit', {
        game_id: gameState.game_id,
        player_hand: gameState.player_hand,
        dealer_hand: gameState.dealer_hand,
        deck: gameState.deck,
        bet: gameState.bet
      });
      
      if (response.data.success) {
        setGameState(response.data);
        setBalance(response.data.balance);
        
        if (response.data.game_over) {
          showResult(response.data.result, response.data.message);
        }
      } else {
        setError(response.data.error || 'Ошибка при взятии карты');
      }
    } catch (error) {
      console.error('Ошибка при взятии карты:', error);
      setError('Не удалось взять карту');
    } finally {
      setLoading(false);
    }
  };
  

  const stand = async () => {
    if (!gameState || gameState.game_over) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/minigames/blackjack/stand', {
        game_id: gameState.game_id,
        player_hand: gameState.player_hand,
        dealer_hand: gameState.dealer_hand,
        deck: gameState.deck,
        bet: gameState.bet
      });
      
      if (response.data.success) {
        setGameState(response.data);
        setBalance(response.data.balance);
        
        showResult(response.data.result, response.data.message);
      } else {
        setError(response.data.error || 'Ошибка при остановке');
      }
    } catch (error) {
      console.error('Ошибка при остановке:', error);
      setError('Не удалось завершить игру');
    } finally {
      setLoading(false);
    }
  };
  

  const showResult = (result, message) => {
    if (result === 'win') {
      setAnimationType('win');
    } else if (result === 'lose') {
      setAnimationType('lose');
    } else {
      setAnimationType('tie');
    }
    
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    
    setError(message);
  };
  

  const playAgain = () => {
    setGameState(null);
    setGameStarted(false);
  };
  

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);
  

  const renderCard = (card, hidden = false) => {
    if (!card) return <PlayingCard hidden={true} />;
    
    if (hidden) {
      return <PlayingCard hidden={true} />;
    }
    
    const [rank, suit] = card;
    return <PlayingCard rank={rank} suit={suit} />;
  };
  

  const renderRules = () => (
    <Dialog open={showRules} onClose={() => setShowRules(false)} maxWidth="md">
      <DialogTitle>Правила игры "21"</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>Цель игры</Typography>
        <Typography paragraph>
          Набрать 21 очко или больше очков, чем у дилера, но не перебрать 21.
        </Typography>
        
        <Typography variant="h6" gutterBottom>Стоимость карт</Typography>
        <Typography paragraph>
          - Карты от 2 до 10 стоят по своему номиналу<br />
          - Валеты (J), Дамы (Q) и Короли (K) стоят по 10 очков<br />
          - Тузы (A) могут стоить либо 1, либо 11 очков в зависимости от того, что выгоднее игроку
        </Typography>
        
        <Typography variant="h6" gutterBottom>Ход игры</Typography>
        <Typography paragraph>
          1. Игрок делает ставку<br />
          2. Игрок и дилер получают по две карты. Одна карта дилера скрыта.<br />
          3. Игрок решает взять дополнительные карты (Hit) или остановиться (Stand)<br />
          4. Если игрок набирает больше 21 очка, он автоматически проигрывает<br />
          5. Когда игрок останавливается, дилер открывает свою скрытую карту и берет карты, пока не наберет минимум 17 очков<br />
          6. Сравниваются очки игрока и дилера
        </Typography>
        
        <Typography variant="h6" gutterBottom>Выигрыши</Typography>
        <Typography paragraph>
          - Блэкджек (21 очко с первых двух карт): выплата 3 к 2<br />
          - Обычная победа: выплата 2 к 1<br />
          - Ничья: возврат ставки
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowRules(false)} color="primary">
          Понятно
        </Button>
      </DialogActions>
    </Dialog>
  );
  

  const renderAnimation = () => {
    if (!showAnimation) return null;
    
    let text = '';
    let color = '';
    
    if (animationType === 'win') {
      text = 'ПОБЕДА!';
      color = theme.palette.success.main;
    } else if (animationType === 'lose') {
      text = 'ПРОИГРЫШ';
      color = theme.palette.error.main;
    } else {
      text = 'НИЧЬЯ';
      color = theme.palette.warning.main;
    }
    
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          animation: 'fadeIn 0.5s'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color,
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            animation: 'pulse 0.5s infinite alternate'
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  };
  
  return (
    <Box sx={{ 
      padding: theme.spacing(2),
      position: 'relative',
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(to bottom, #121212, #000000)',
      color: '#ffffff'
    }}>
      <SEO title="21 | Мини-игры | К-Коннект" description="Игра 21 (блэкджек) - наберите 21 очко или больше чем у дилера, не перебрав!" />
      
      {renderAnimation()}
      {renderRules()}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/minigames')}
          size="large"
        >
          Назад
        </Button>
        
        <Typography variant="h4" color="primary" fontWeight="bold">
          21
        </Typography>
        
        <Button 
          variant="outlined" 
          color="info"
          onClick={() => setShowRules(true)}
          size="large"
        >
          Правила
        </Button>
      </Box>
      
      <StyledPaper elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Баланс: {balance} баллов</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="h6">
              {gameState && gameState.result === 'win' && `Выигрыш: ${gameState.winnings} баллов`}
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
      
      {!gameStarted ? (
        <StyledPaper elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>Сделайте ставку и начните игру</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <TextField
              label="Ставка"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
              inputProps={{ min: 10, max: 2000 }}
              sx={{ 
                width: '150px', 
                mr: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#505050',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#aaaaaa',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            
            <GameButton
              variant="contained"
              color="primary"
              onClick={startNewGame}
              disabled={loading || balance < betAmount}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Начать игру'}
            </GameButton>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Минимальная ставка: 10 | Максимальная ставка: 2000
          </Typography>
        </StyledPaper>
      ) : (
        <Box sx={{ mt: 2 }}>
          {gameState && (
            <>
              <StyledPaper elevation={3} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Дилер: {gameState.game_over ? gameState.dealer_score : '?'}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                  {gameState.dealer_hand.map((card, index) => (
                    <Box key={`dealer-${index}`} sx={{ transform: 'scale(0.9)' }}>
                      {renderCard(card, index === 1 && !gameState.game_over)}
                    </Box>
                  ))}
                </Box>
              </StyledPaper>
              
              <StyledPaper elevation={3} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Игрок: {gameState.player_score}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                  {gameState.player_hand.map((card, index) => (
                    <Box key={`player-${index}`} sx={{ transform: 'scale(0.9)' }}>
                      {renderCard(card)}
                    </Box>
                  ))}
                </Box>
              </StyledPaper>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                {gameState.game_over ? (
                  <GameButton
                    variant="contained"
                    color="primary"
                    onClick={playAgain}
                    size="large"
                  >
                    Играть еще
                  </GameButton>
                ) : (
                  <>
                    <GameButton
                      variant="contained"
                      color="primary"
                      onClick={hitCard}
                      disabled={loading}
                      size="large"
                    >
                      Взять карту
                    </GameButton>
                    
                    <GameButton
                      variant="contained"
                      color="secondary"
                      onClick={stand}
                      disabled={loading}
                      size="large"
                    >
                      Хватит
                    </GameButton>
                  </>
                )}
              </Box>
              
              {gameState.message && !gameState.game_over && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Alert severity="info">{gameState.message}</Alert>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={5000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BlackjackPage; 