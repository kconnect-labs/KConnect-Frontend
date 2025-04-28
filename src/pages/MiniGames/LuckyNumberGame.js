import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Chip,
  Slide,
  Fade,
  LinearProgress,
  Divider,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CasinoIcon from '@mui/icons-material/Casino';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';

// Стилизованные компоненты
const GameContainer = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column'
}));

const GameHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3, 2),
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.7)}, ${alpha(theme.palette.primary.main, 0.4)})`,
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
    zIndex: 0
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

const GameTable = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, #4b2d73, #3c2361)`,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  marginBottom: theme.spacing(4),
  border: '1px solid rgba(255,255,255,0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
    zIndex: 0
  }
}));

const NumberButton = styled(Button)(({ selected, theme }) => ({
  width: 60,
  height: 60,
  borderRadius: 30,
  margin: theme.spacing(0.5),
  fontWeight: 'bold',
  fontSize: '1.2rem',
  transition: 'all 0.3s ease',
  background: selected 
    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
    : alpha(theme.palette.background.paper, 0.2),
  color: selected ? theme.palette.common.white : 'rgba(255,255,255,0.7)',
  border: selected 
    ? `2px solid ${theme.palette.primary.light}` 
    : '1px solid rgba(255,255,255,0.1)',
  boxShadow: selected 
    ? `0 0 15px ${alpha(theme.palette.primary.main, 0.7)}` 
    : 'none',
  '&:hover': {
    background: !selected 
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.primary.dark, 0.3)})` 
      : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    transform: 'translateY(-3px)',
    boxShadow: `0 6px 12px ${alpha(theme.palette.common.black, 0.2)}`
  }
}));

const BetTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(4),
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(5px)',
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.5),
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const PrizeFactor = styled(Box)(({ factor, selected, theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: selected 
    ? alpha(theme.palette.success.main, 0.2) 
    : alpha(theme.palette.background.paper, 0.1),
  border: `1px solid ${
    selected 
      ? alpha(theme.palette.success.main, 0.5) 
      : alpha(theme.palette.divider, 0.2)
  }`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  boxShadow: selected 
    ? `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}` 
    : 'none',
  '&:hover': {
    backgroundColor: !selected 
      ? alpha(theme.palette.background.paper, 0.2) 
      : alpha(theme.palette.success.main, 0.2),
    transform: 'translateY(-2px)'
  }
}));

const ResultNumber = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '3rem',
  fontWeight: 'bold',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  color: theme.palette.common.white,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 70,
    background: `linear-gradient(135deg, ${theme.palette.primary.light}, transparent 70%)`,
    opacity: 0.5,
    zIndex: -1
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(4),
  padding: theme.spacing(1.5, 3),
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
  }
}));

const ResultMessage = styled(Paper)(({ result, theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  backgroundColor: result === 'win' 
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.error.main, 0.1),
  border: `1px solid ${
    result === 'win'
      ? alpha(theme.palette.success.main, 0.3)
      : alpha(theme.palette.error.main, 0.3)
  }`,
  marginBottom: theme.spacing(4)
}));

const LuckyNumberGame = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(10);
  const [showBetDialog, setShowBetDialog] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [multiplier, setMultiplier] = useState(2);
  const [result, setResult] = useState(null);
  const [resultMessage, setResultMessage] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Загружаем данные о балансе пользователя при монтировании компонента
    const fetchBalance = async () => {
      try {
        const response = await axios.get('/api/user/points');
        if (response?.data?.points !== undefined) {
          setBalance(parseInt(response.data.points));
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast.error('Не удалось загрузить баланс');
      }
    };
    
    fetchBalance();
  }, []);

  const handleBetAmountChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setBetAmount(value);
    }
  };

  const handleNumberSelect = (number) => {
    if (!gameActive || spinning) return;
    setSelectedNumber(number);
  };

  const handleMultiplierSelect = (factor) => {
    if (!gameActive || spinning) return;
    setMultiplier(factor);
  };

  const handleStartGame = async () => {
    try {
      setLoading(true);
      
      // Для тестирования без API создаем имитацию
      setGameActive(true);
      setSelectedNumber(null);
      setResult(null);
      setGameResult(null);
      setResultMessage('');
      
      // Обновляем баланс
      const response = await axios.get('/api/user/points');
      if (response?.data?.points !== undefined) {
        setBalance(parseInt(response.data.points));
      }
      
      setShowBetDialog(false);
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error(error.response?.data?.error || 'Не удалось начать игру');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async () => {
    if (!gameActive || spinning || selectedNumber === null) return;
    
    try {
      setSpinning(true);
      
      // Имитация вращения барабана с обратным отсчетом
      setCountdown(3);
      
      // Имитация запроса к API для тестирования
      // В реальном сценарии тут был бы запрос к API
      
      // Обратный отсчет
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Имитация результата
      const randomResult = Math.floor(Math.random() * 10);
      const win = randomResult === selectedNumber;
      
      setResult(randomResult);
      setGameResult(win ? 'win' : 'lose');
      setResultMessage(win ? 
        `Выпало число ${randomResult}! Вы выиграли ${betAmount * multiplier} баллов!` : 
        `Выпало число ${randomResult}. Вы выбрали ${selectedNumber}. Попробуйте еще раз!`);
      
      // Обновляем баланс
      const response = await axios.get('/api/user/points');
      if (response?.data?.points !== undefined) {
        setBalance(parseInt(response.data.points));
      }
    } catch (error) {
      console.error('Error playing lucky number game:', error);
      toast.error(error.response?.data?.error || 'Произошла ошибка');
    } finally {
      setSpinning(false);
      setCountdown(0);
    }
  };

  const handleNewGame = () => {
    setGameActive(false);
    setSelectedNumber(null);
    setMultiplier(2);
    setResult(null);
    setGameResult(null);
    setResultMessage('');
    setShowBetDialog(true);
  };

  const renderNumberButtons = () => {
    const numbers = Array.from({ length: 10 }, (_, i) => i);
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
        {numbers.map(number => (
          <NumberButton
            key={number}
            selected={selectedNumber === number}
            onClick={() => handleNumberSelect(number)}
            disabled={spinning}
          >
            {number}
          </NumberButton>
        ))}
      </Box>
    );
  };

  const renderMultiplierOptions = () => {
    const multipliers = [2, 3, 5, 10];
    
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: theme.palette.common.white, mb: 2, textAlign: 'center' }}>
          Выберите множитель:
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {multipliers.map(factor => (
            <Grid item key={factor} xs={6} sm={3}>
              <PrizeFactor 
                factor={factor} 
                selected={multiplier === factor}
                onClick={() => handleMultiplierSelect(factor)}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>
                  x{factor}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {factor === 2 ? 'Легко' : factor === 3 ? 'Средне' : factor === 5 ? 'Сложно' : 'Экстрим'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: theme.palette.common.white }}>
                  шанс 1/{10*factor/2}
                </Typography>
              </PrizeFactor>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="md" sx={{ 
      mt: { xs: 2, sm: 3 }, 
      mb: { xs: 10, sm: 8 },
      pb: { xs: '80px', sm: 0 } // Add padding for mobile bottom navigation
    }}>
      <GameHeader>
        <Box sx={{ zIndex: 1, position: 'relative' }}>
          <IconButton 
            onClick={() => navigate('/minigames')}
            sx={{ 
              color: theme.palette.common.white,
              bgcolor: 'rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' },
              mr: 2
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ display: 'inline-flex', fontWeight: 'bold', color: theme.palette.common.white }}>
            Счастливое Число
          </Typography>
        </Box>
        
        <Chip 
          icon={<AccountBalanceWalletIcon />} 
          label={`${balance} баллов`}
          sx={{ 
            zIndex: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.2),
            backdropFilter: 'blur(5px)',
            color: theme.palette.common.white,
            fontWeight: 'bold',
            border: '1px solid rgba(255,255,255,0.2)',
            '& .MuiChip-icon': { color: theme.palette.common.white }
          }}
        />
      </GameHeader>
      
      {!gameActive && (
        <GameTable>
          <Box sx={{ textAlign: 'center', color: theme.palette.common.white, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.common.white }}>
              Счастливое Число
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: theme.palette.common.white }}>
              Угадайте число от 0 до 9 и получите выигрыш в зависимости от выбранного множителя!
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.common.white }}>
              Правила игры:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: theme.palette.common.white }}>
              • Сделайте ставку и выберите число от 0 до 9
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: theme.palette.common.white }}>
              • Выберите множитель, который определит размер выигрыша
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: theme.palette.common.white }}>
              • Чем выше множитель, тем сложнее выиграть, но больше награда
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: theme.palette.common.white }}>
              • Если выпавшее число совпадет с вашим, вы получите ставку × множитель
            </Typography>
            
            <Button 
              variant="contained" 
              size="large"
              onClick={() => setShowBetDialog(true)}
              sx={{
                bgcolor: theme.palette.common.white,
                color: theme.palette.primary.dark,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.9)
                }
              }}
            >
              Начать игру
            </Button>
          </Box>
        </GameTable>
      )}
      
      {gameActive && (
        <GameTable>
          <Box sx={{ color: theme.palette.common.white, textAlign: 'center' }}>
            
            <Box sx={{ 
              mb: 4, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              pb: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>
                Ваша ставка: {betAmount} баллов
              </Typography>
              <Chip 
                label={`Множитель: x${multiplier}`}
                sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.light,
                  fontWeight: 'bold',
                  border: `1px solid ${alpha(theme.palette.success.main, 0.4)}`
                }}
              />
            </Box>
            
            
            {result !== null && (
              <Box sx={{ mb: 4 }}>
                <ResultNumber>
                  {result}
                </ResultNumber>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 'bold',
                    color: gameResult === 'win' ? theme.palette.success.light : theme.palette.error.light
                  }}
                >
                  {gameResult === 'win' ? 'Вы выиграли!' : 'Вы проиграли'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: theme.palette.common.white }}>
                  {resultMessage}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewGame}
                  sx={{ px: 4, py: 1.5, borderRadius: 4, fontWeight: 'bold' }}
                >
                  Сыграть ещё
                </Button>
              </Box>
            )}
            
            
            {result === null && (
              <>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  fontWeight: 'bold', 
                  textAlign: 'left',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  pb: 1,
                  color: theme.palette.common.white
                }}>
                  Выберите число от 0 до 9:
                </Typography>
                
                {renderNumberButtons()}
                
                
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  fontWeight: 'bold', 
                  textAlign: 'left',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  pb: 1,
                  color: theme.palette.common.white
                }}>
                  Выберите множитель:
                </Typography>
                
                {renderMultiplierOptions()}
                
                
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  {countdown > 0 ? (
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {countdown}
                      </Typography>
                      <LinearProgress 
                        color="secondary" 
                        sx={{ 
                          maxWidth: 200, 
                          mx: 'auto',
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.background.paper, 0.2)
                        }} 
                      />
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      disabled={selectedNumber === null || spinning}
                      onClick={handlePlayGame}
                      size="large"
                      startIcon={spinning ? <CircularProgress size={20} color="inherit" /> : <CasinoIcon />}
                      sx={{ 
                        px: 6, 
                        py: 1.5, 
                        borderRadius: 4,
                        fontWeight: 'bold',
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.5)}`
                      }}
                    >
                      {spinning ? 'Вращение...' : 'Играть'}
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Box>
        </GameTable>
      )}
      
      <Dialog
        open={showBetDialog}
        onClose={() => setShowBetDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
            '@media (max-width: 600px)': {
              width: '100%',
              maxWidth: '100%',
              margin: 0,
              borderRadius: 0,
            }
          }
        }}
      >
        <DialogTitle>Сделайте ставку</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Ваш баланс: <strong>{balance} баллов</strong>
            </Typography>
            <BetTextField
              label="Размер ставки"
              variant="outlined"
              fullWidth
              value={betAmount}
              onChange={handleBetAmountChange}
              type="number"
              InputProps={{
                inputProps: { min: 10, max: balance }
              }}
              helperText={`Минимальная ставка: 10, максимальная: ${balance}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBetDialog(false)} color="inherit">
            Отмена
          </Button>
          <Button 
            onClick={handleStartGame} 
            color="primary" 
            variant="contained"
            disabled={loading || betAmount < 10 || betAmount > balance}
          >
            {loading ? <CircularProgress size={24} /> : 'Сделать ставку'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LuckyNumberGame; 