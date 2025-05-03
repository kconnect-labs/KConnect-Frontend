import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  useTheme,
  alpha,
  Divider,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SEO from '../../components/SEO';
import axios from 'axios';


const CupImage = ({ lifted, winner }) => {
  return (
    <Box sx={{ 
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      
      <Box sx={{ 
        width: '80%',
        height: '80%',
        backgroundImage: 'url("/static/icons/cup.png")',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: lifted ? 'translateY(-25px)' : 'translateY(0)',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 2
      }} />
      
      
      {winner && (
        <Box sx={{ 
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #ff5722, #e91e63)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          zIndex: 1,
          opacity: lifted ? 1 : 0,
          transition: 'opacity 0.3s ease 0.4s'
        }} />
      )}
    </Box>
  );
};

const CupsGamePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState('10');
  const [selectedCup, setSelectedCup] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState(null);
  const [gameAnimation, setGameAnimation] = useState(false);
  const [revealResult, setRevealResult] = useState(false);
  
  
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
  
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);
  
  
  const handleBetChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setBetAmount(value);
  };
  
  
  const handleCupSelect = (cupIndex) => {
    if (!isPlaying) {
      setSelectedCup(cupIndex);
    }
  };
  
  
  const formatNumber = (num) => {
    return parseInt(num).toLocaleString();
  };
  
  
  const startGame = async () => {
    
    const bet = parseInt(betAmount, 10);
    if (isNaN(bet) || bet <= 0) {
      setError('Пожалуйста, введите корректную ставку.');
      return;
    }
    
    if (bet > balance) {
      setError('Недостаточно средств для ставки.');
      return;
    }
    
    if (selectedCup === null) {
      setError('Пожалуйста, выберите чашу.');
      return;
    }
    
    setLoading(true);
    setIsPlaying(true);
    setGameAnimation(true);
    setRevealResult(false);
    
    try {
      const response = await axios.post('/api/minigames/cups/play', {
        bet: bet,
        selected_cup: selectedCup
      });
      
      console.log('Game response:', response.data); 

      if (response?.data?.success) {
        
        setTimeout(() => {
          setGameAnimation(false);
          
          
          const processedResult = {
            ...response.data,
            is_win: response.data.won,  
            new_balance: response.data.balance 
          };
          
          setGameResult(processedResult);
          setRevealResult(true);
          
          
          if (response.data.balance !== undefined) {
            setBalance(parseInt(response.data.balance));
          } else {
            fetchBalance();
          }
        }, 1500);
      } else {
        setError(response?.data?.error || 'Произошла ошибка при игре.');
        setIsPlaying(false);
        setGameAnimation(false);
      }
    } catch (err) {
      console.error('Ошибка при игре:', err);
      setError('Произошла ошибка при взаимодействии с сервером. Пожалуйста, попробуйте позже.');
      setIsPlaying(false);
      setGameAnimation(false);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  
  
  const resetGame = () => {
    setIsPlaying(false);
    setSelectedCup(null);
    setGameResult(null);
    setRevealResult(false);
  };
  
  
  const setMaxBet = () => {
    setBetAmount(Math.floor(balance).toString());
  };
  
  
  const predefinedBets = [10, 50, 100, 500];
  
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: { xs: 2, sm: 3 }, 
        mb: { xs: 10, sm: 10 }, 
        pb: { xs: '80px', sm: 0 }, 
        px: { xs: 1, sm: 2 }
      }}
    >
      <SEO title="Три чаши | Мини-игры | К-Коннект" description="Игра Три чаши - угадайте, под какой чашей находится шарик!" />
      
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/minigames')}
          sx={{ 
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          К играм
        </Button>
        
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          backdropFilter: 'blur(8px)',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Typography variant="body2" color="text.secondary" align={isMobile ? "left" : "right"}>
            Ваш баланс:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            {formatNumber(balance)} баллов
          </Typography>
        </Box>
      </Box>
      
      
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha('#e91e63', 0.1)}, ${alpha('#e91e63', 0.05)})`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            opacity: 0.1,
            background: `radial-gradient(circle at 30% 50%, ${alpha('#e91e63', 0.3)} 0%, transparent 70%)`,
            zIndex: 0 
          }} 
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box 
              component="img" 
              src="/static/icons/cup.png" 
              alt="Cup icon"
              sx={{ 
                width: 36, 
                height: 36,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} 
            />
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}>
              Три чаши
            </Typography>
            <Tooltip title="Правила игры">
              <Button 
                size="small" 
                sx={{ ml: 'auto' }}
                onClick={() => setShowRules(true)}
              >
                <HelpOutlineIcon />
              </Button>
            </Tooltip>
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            Угадайте, под какой чашей находится шарик, и выиграйте в два раза больше своей ставки!
          </Typography>
        </Box>
      </Paper>
      
      
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 3, 
        mb: 3,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom, #424242, #303030)'
          : 'linear-gradient(to bottom, #ffffff, #f5f5f5)'
      }}>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:before': {
              content: '""',
              display: 'block',
              width: 3,
              height: 20,
              backgroundColor: '#e91e63',
              borderRadius: 4
            }
          }}>
            Ваша ставка
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            alignItems: 'flex-start', 
            flexWrap: { sm: 'wrap' }
          }}>
            <TextField
              label="Сумма ставки"
              variant="outlined"
              value={betAmount}
              onChange={handleBetChange}
              disabled={isPlaying}
              sx={{ 
                width: { xs: '100%', sm: 200 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                endAdornment: (
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={setMaxBet}
                    disabled={isPlaying}
                    sx={{ 
                      minWidth: 'auto', 
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    max
                  </Button>
                )
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              width: { xs: '100%', sm: 'auto' }
            }}>
              {predefinedBets.map((bet) => (
                <Button 
                  key={bet}
                  variant="outlined"
                  disabled={isPlaying}
                  onClick={() => setBetAmount(bet.toString())}
                  sx={{ 
                    flex: { xs: 1, sm: 'none' },
                    minWidth: '60px',
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.divider, 0.5),
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  {bet}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:before': {
              content: '""',
              display: 'block',
              width: 3,
              height: 20,
              backgroundColor: '#e91e63',
              borderRadius: 4
            }
          }}>
            Выберите чашу
          </Typography>
          
          <Box sx={{ 
            mt: 3,
            position: 'relative',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(to bottom, #212121, #1e1e1e)' 
              : 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
            borderRadius: 4,
            p: 2,
            py: 3,
            mb: 3,
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(to right, #e91e63, #9c27b0)'
            }
          }}>
            <Grid container spacing={2} justifyContent="center">
              {[1, 2, 3].map((cup) => (
                <Grid item xs={4} sm={4} key={cup}>
                  <Box
                    onClick={() => handleCupSelect(cup)}
                    sx={{
                      height: { xs: 140, sm: 180 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: isPlaying ? 'default' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s ease-in-out',
                      transform: (selectedCup === cup && !gameAnimation) ? 'translateY(-5px)' : 'translateY(0)',
                      filter: isPlaying && selectedCup !== cup ? 'grayscale(40%) brightness(0.8)' : 'none',
                      '&:hover': {
                        transform: isPlaying ? 
                          'translateY(0)' : 
                          (selectedCup === cup ? 'translateY(-5px)' : 'translateY(-8px)'),
                      },
                      animation: gameAnimation && selectedCup === cup ? 'shake 0.5s ease-in-out' : 'none',
                      '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '25%': { transform: 'translateX(-5px) rotate(-5deg)' },
                        '50%': { transform: 'translateX(5px) rotate(5deg)' },
                        '75%': { transform: 'translateX(-5px) rotate(-5deg)' }
                      }
                    }}
                  >
                    
                    {selectedCup === cup && !isPlaying && (
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          bottom: -5,
                          left: '25%',
                          width: '50%',
                          height: 3,
                          background: '#e91e63',
                          borderRadius: 4,
                          boxShadow: '0 0 8px rgba(233, 30, 99, 0.6)',
                          transition: 'opacity 0.3s ease',
                          zIndex: 1
                        }} 
                      />
                    )}
                    
                    
                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                      <CupImage 
                        lifted={revealResult} 
                        winner={gameResult && gameResult.winning_cup === cup}
                      />
                    </Box>
                    
                    <Typography 
                      variant="subtitle2" 
                      align="center" 
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        fontWeight: 600,
                        color: selectedCup === cup ? '#e91e63' : 'text.secondary',
                        mt: 1,
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Чаша {cup}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!isPlaying ? (
            <Button
              variant="contained"
              size="large"
              onClick={startGame}
              disabled={selectedCup === null || betAmount === '' || parseInt(betAmount, 10) <= 0 || loading}
              sx={{ 
                minWidth: 200, 
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                backgroundColor: '#e91e63',
                '&:hover': {
                  backgroundColor: '#c2185b'
                },
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Загрузка...' : 'Играть'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              onClick={resetGame}
              sx={{ 
                minWidth: 200, 
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                borderColor: '#e91e63',
                color: '#e91e63',
                '&:hover': {
                  borderColor: '#c2185b',
                  backgroundColor: alpha('#e91e63', 0.05)
                }
              }}
            >
              Играть снова
            </Button>
          )}
        </Box>
      </Paper>
      
      
      {gameResult && (
        <Fade in={true} timeout={800}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: gameResult.is_win ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${gameResult.is_win ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.error.main, 0.3)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              {gameResult.is_win ? (
                <EmojiEventsIcon sx={{ color: theme.palette.success.main, fontSize: 28 }} />
              ) : (
                <SentimentVeryDissatisfiedIcon sx={{ color: theme.palette.error.main, fontSize: 28 }} />
              )}
              <Typography variant="h5" sx={{ 
                color: gameResult.is_win ? theme.palette.success.main : theme.palette.error.main,
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                {gameResult.is_win ? 'Поздравляем!' : 'Вы не угадали!'}
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              {gameResult.is_win 
                ? `Вы выиграли ${formatNumber(gameResult.winnings || gameResult.bet * 2)} баллов! Шарик был под чашей ${gameResult.winning_cup}.`
                : `Шарик был под чашей ${gameResult.winning_cup}. Вы потеряли ${formatNumber(gameResult.bet)} баллов.`
              }
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              justifyContent: 'space-between',
              gap: 2,
              mt: 2 
            }}>
              <Typography variant="body2" color="text.secondary">
                Новый баланс: <strong>{formatNumber(gameResult.new_balance || gameResult.balance)}</strong> баллов
              </Typography>
              

            </Box>
          </Paper>
        </Fade>
      )}
      
      
      <Dialog
        open={showRules}
        onClose={() => setShowRules(false)}
        sx={{ 
          '& .MuiDialog-paper': { 
            borderRadius: 3,
            '@media (max-width: 600px)': {
              width: '100%',
              maxWidth: '100%',
              margin: 0,
              borderRadius: 0,
            }
          } 
        }}
      >
        <DialogTitle>Правила игры "Три чаши"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography paragraph>
              "Три чаши" - это классическая игра на везение и интуицию. Правила просты:
            </Typography>
            
            <Typography component="ol" sx={{ pl: 2 }}>
              <li>Сделайте ставку из своего баланса очков.</li>
              <li>Выберите одну из трех чаш, под которой, как вы думаете, находится шарик.</li>
              <li>Если вы угадали, ваша ставка утраивается!</li>
              <li>Если не угадали, вы теряете сумму ставки.</li>
            </Typography>
            
            <Typography paragraph sx={{ mt: 2 }}>
              Шанс выигрыша составляет 1 к 3, что даёт 33.3% вероятность победы.
            </Typography>
            
            <Typography>
              Удачи в игре!
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRules(false)} autoFocus>
            Понятно
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      
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
    </Container>
  );
};

export default CupsGamePage; 