import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Slider,
  styled,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Favorite,
  FavoriteBorder,
  VolumeUp,
  VolumeOff,
  VolumeDown,
  QueueMusic,
  RepeatOne,
  Repeat,
  Shuffle,
  ExpandMore,
  Share
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { ThemeSettingsContext } from '../../App';
import { useContext } from 'react';
import FullScreenPlayer from './FullScreenPlayer';
import { extractDominantColor } from '../../utils/imageUtils';

// Используем styled для создания более красивых компонентов с сильными эффектами блюра
const PlayerContainer = styled(Paper)(({ theme, covercolor }) => ({
  position: 'fixed',
  bottom: 20,
  left: '60%',
  transform: 'translateX(-50%)',
  width: '85%',
  maxWidth: 1100,
  minWidth: 580,
  zIndex: theme.zIndex.appBar - 1,
  backgroundColor: covercolor ? `rgba(${covercolor}, 0.22)` : 'rgba(10, 10, 10, 0.3)',
  backdropFilter: 'blur(35px)',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.2)',
  borderRadius: 16,
  padding: theme.spacing(0.8),
  border: '1px solid rgba(255, 255, 255, 0.06)',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: covercolor ? 
      `radial-gradient(circle at center, rgba(${covercolor}, 0.3) 0%, rgba(10, 10, 10, 0.1) 70%)` :
      'none',
    opacity: 0.6,
    pointerEvents: 'none',
  },
  '@media (max-width: 900px)': {
    width: '85%',
    minWidth: 'auto',
  },
}));

// Стилизованный компонент для прокручивающегося текста
const MarqueeText = styled(Typography)(({ isactive }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
  position: 'relative',
  animation: isactive === 'true' ? 'marquee 15s linear infinite' : 'none',
  animationDelay: '1.5s',
  '@keyframes marquee': {
    '0%': {
      transform: 'translateX(0%)',
    },
    '100%': {
      transform: 'translateX(-100%)',
    },
  },
  '&::after': {
    content: isactive === 'true' ? 'attr(data-text)' : 'none',
    position: 'absolute',
    whiteSpace: 'nowrap',
    left: '100%',
    paddingLeft: '20px',
  }
}));

const TrackSlider = styled(Slider)(({ theme, covercolor }) => ({
  color: covercolor ? `rgba(${covercolor}, 1)` : theme.palette.primary.main,
  height: 3,
  '& .MuiSlider-thumb': {
    width: 0,
    height: 0,
    opacity: 0,
    transition: '0.2s cubic-bezier(.47,1.64,.41,.8)',
  },
  '&:hover .MuiSlider-thumb, &.Mui-active .MuiSlider-thumb': {
    width: 10,
    height: 10,
    opacity: 1,
  },
  '& .MuiSlider-rail': {
    opacity: 0.3,
    height: 3,
  },
  '& .MuiSlider-track': {
    height: 3,
  }
}));

const VolumeSlider = styled(Slider)(({ theme, covercolor }) => ({
  color: covercolor ? `rgba(${covercolor}, 1)` : theme.palette.primary.main,
  width: 80,
  height: 3,
  '& .MuiSlider-thumb': {
    width: 8,
    height: 8,
    '&:hover, &.Mui-focusVisible': {
      boxShadow: 'none',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.3,
  },
}));

// Функция для извлечения цвета из обложки
const getColorFromImage = extractDominantColor;

const DesktopPlayer = () => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack,
    likeTrack,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute
  } = useMusic();

  const [seekValue, setSeekValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [shuffleMode, setShuffleMode] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  const [isPlayerHovered, setIsPlayerHovered] = useState(false);
  
  // Состояния для анимации текста
  const [titleOverflowing, setTitleOverflowing] = useState(false);
  const [artistOverflowing, setArtistOverflowing] = useState(false);
  
  // Add state for share notification
  const [shareSnackbar, setShareSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const progressRef = useRef(null);
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  
  // Проверяем, переполняется ли текст
  useEffect(() => {
    if (titleRef.current) {
      setTitleOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
    if (artistRef.current) {
      setArtistOverflowing(artistRef.current.scrollWidth > artistRef.current.clientWidth);
    }
  }, [currentTrack]);
  
  // Эффект для извлечения цвета из обложки при смене трека
  useEffect(() => {
    if (currentTrack?.cover_path) {
      getColorFromImage(
        currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg',
        (color) => {
          setDominantColor(color);
        }
      );
    }
  }, [currentTrack]);
  
  useEffect(() => {
    if (!isSeeking && duration > 0) {
      setSeekValue((currentTime / duration) * 100);
    }
  }, [currentTime, duration, isSeeking]);
  
  if (!currentTrack) {
    return null;
  }
  
  const handleSeekStart = () => {
    setIsSeeking(true);
  };
  
  const handleSeekChange = (_, newValue) => {
    setSeekValue(newValue);
  };
  
  const handleSeekEnd = (_, newValue) => {
    seekTo((newValue * duration) / 100);
    setIsSeeking(false);
  };

  const handleClickProgress = (event) => {
    if (progressRef.current && duration) {
      const rect = progressRef.current.getBoundingClientRect();
      const position = ((event.clientX - rect.left) / rect.width) * 100;
      const clampedPosition = Math.min(Math.max(position, 0), 100);
      setSeekValue(clampedPosition);
      seekTo((clampedPosition * duration) / 100);
    }
  };

  const toggleLikeTrack = (e) => {
    // Stop event propagation to prevent other handlers
    if (e) {
      e.stopPropagation();
    }
    
    if (currentTrack?.id) {
      try {
        // Create animation effect on the button
        const likeButton = e.currentTarget;
        likeButton.style.transform = 'scale(1.3)';
        setTimeout(() => {
          likeButton.style.transform = 'scale(1)';
        }, 150);
        
        likeTrack(currentTrack.id)
          .then(result => {
            console.log("Like result:", result);
            // Success animation could be added here if needed
          })
          .catch(error => {
            console.error("Error liking track:", error);
          });
      } catch (error) {
        console.error("Error liking track:", error);
      }
    }
  };

  // Add share function
  const handleShare = () => {
    if (!currentTrack) return;
    
    const trackLink = `${window.location.origin}/music?track=${currentTrack.id}`;
    
    // Просто копируем ссылку в буфер обмена вместо использования Web Share API
    copyToClipboard(trackLink);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareSnackbar({
          open: true,
          message: 'Ссылка на трек скопирована в буфер обмена',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
        setShareSnackbar({
          open: true,
          message: 'Не удалось скопировать ссылку',
          severity: 'error'
        });
      });
  };
  
  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShareSnackbar({...shareSnackbar, open: false});
  };

  const handleVolumeChange = (_, newValue) => {
    setVolume(newValue / 100);
  };

  const handleRepeatClick = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const handleShuffleClick = () => {
    setShuffleMode(!shuffleMode);
  };

  const openFullScreen = () => {
    setFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setFullScreenOpen(false);
  };
  
  return (
    <>
      <PlayerContainer 
        elevation={0} 
        covercolor={dominantColor}
        onMouseEnter={() => setIsPlayerHovered(true)}
        onMouseLeave={() => setIsPlayerHovered(false)}
      >
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mr: 2,
            minWidth: 140,
            maxWidth: 200,
            width: '20%',
            flex: '0 0 auto',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box 
            sx={{ 
              width: 45, 
              height: 45, 
              borderRadius: 1.5, 
              overflow: 'hidden', 
              mr: 1.5, 
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
            onClick={openFullScreen}
          >
            <img
              src={currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          
          <Box 
            sx={{ 
              overflow: 'hidden',
              minWidth: 0,
              flexGrow: 0,
              flexShrink: 1,
              cursor: 'pointer'
            }}
            onClick={openFullScreen}
          >
            <MarqueeText
              ref={titleRef}
              variant="subtitle1"
              isactive={titleOverflowing && isPlayerHovered ? 'true' : 'false'}
              data-text={currentTrack.title}
              sx={{
                fontWeight: 'medium',
                fontSize: '0.95rem',
                lineHeight: 1.2,
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {currentTrack.title}
            </MarqueeText>
            
            <MarqueeText
              ref={artistRef}
              variant="body2"
              isactive={artistOverflowing && isPlayerHovered ? 'true' : 'false'}
              data-text={currentTrack.artist}
              sx={{
                fontSize: '0.8rem',
                lineHeight: 1.2,
                color: 'rgba(255,255,255,0.7)',
                mt: 0.5
              }}
            >
              {currentTrack.artist}
            </MarqueeText>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={(e) => toggleLikeTrack(e)}
              sx={{ 
                color: currentTrack.is_liked ? 'error.main' : 'rgba(255,255,255,0.8)',
                ml: 1,
                p: 0.8,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: currentTrack.is_liked ? 'error.light' : '#ff6b6b',
                  transform: 'scale(1.1)'
                }
              }}
            >
              {currentTrack.is_liked ? (
                <Favorite fontSize="small" 
                  sx={{ 
                    animation: 'heartRadiate 0.6s ease-out',
                    '@keyframes heartRadiate': {
                      '0%': { transform: 'scale(1)' },
                      '15%': { transform: 'scale(0.85)' },
                      '30%': { transform: 'scale(1.4)', filter: 'drop-shadow(0 0 6px rgba(255,82,82,0.7))' },
                      '50%': { transform: 'scale(1.2)', filter: 'drop-shadow(0 0 4px rgba(255,82,82,0.5))' },
                      '75%': { transform: 'scale(1.1)', filter: 'drop-shadow(0 0 2px rgba(255,82,82,0.3))' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }} 
                />
              ) : (
                <FavoriteBorder 
                  fontSize="small" 
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      animation: 'pulseOutline 1.8s infinite ease-in-out',
                      '@keyframes pulseOutline': {
                        '0%': { transform: 'scale(1)', opacity: 1 },
                        '50%': { transform: 'scale(1.15)', opacity: 0.7 },
                        '100%': { transform: 'scale(1)', opacity: 1 }
                      }
                    }
                  }}
                />
              )}
            </IconButton>
            
            
            <IconButton 
              size="small" 
              onClick={handleShare}
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                ml: 0.5,
                p: 0.8,
                '&:hover': {
                  color: 'white'
                }
              }}
            >
              <Share fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            flexGrow: 1,
            mx: 2,
            minWidth: 300,
            position: 'relative',
            zIndex: 1
          }}
        >
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0.5
          }}>
            <IconButton 
              size="small" 
              onClick={handleShuffleClick}
              sx={{ 
                color: shuffleMode ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'rgba(255,255,255,0.6)',
                mx: 0.5,
                p: 0.6,
                transition: 'color 0.3s ease'
              }}
            >
              <Shuffle sx={{ fontSize: 16 }} />
            </IconButton>
            
            <IconButton 
              onClick={prevTrack}
              size="small"
              sx={{ 
                mx: 1,
                color: 'white',
                transition: 'transform 0.2s ease',
                p: 0.6,
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <SkipPrevious sx={{ fontSize: 20 }} />
            </IconButton>
            
            <IconButton
              onClick={togglePlay}
              size="small"
              sx={{
                mx: 1,
                bgcolor: dominantColor ? `rgba(${dominantColor}, 0.9)` : 'primary.main',
                color: 'white',
                p: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: dominantColor ? `rgba(${dominantColor}, 1)` : 'primary.dark',
                  transform: 'scale(1.08)'
                }
              }}
            >
              {isPlaying ? <Pause style={{ fontSize: 20 }} /> : <PlayArrow style={{ fontSize: 20 }} />}
            </IconButton>
            
            <IconButton 
              onClick={nextTrack}
              size="small"
              sx={{ 
                mx: 1,
                color: 'white',
                p: 0.6,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <SkipNext sx={{ fontSize: 20 }} />
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={handleRepeatClick}
              sx={{ 
                color: repeatMode !== 'off' ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'rgba(255,255,255,0.6)',
                mx: 0.5,
                p: 0.6,
                transition: 'color 0.3s ease'
              }}
            >
              {repeatMode === 'one' ? <RepeatOne sx={{ fontSize: 16 }} /> : <Repeat sx={{ fontSize: 16 }} />}
            </IconButton>
          </Box>
          
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ mr: 1, minWidth: 32, textAlign: 'right', color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem' }}>
              {formatDuration(currentTime)}
            </Typography>
            
            <Box sx={{ flexGrow: 1, my: 0.2 }}>
              <TrackSlider
                ref={progressRef}
                value={seekValue}
                onChange={handleSeekChange}
                onChangeCommitted={handleSeekEnd}
                onMouseDown={handleSeekStart}
                onTouchStart={handleSeekStart}
                onClick={handleClickProgress}
                aria-label="time-indicator"
                covercolor={dominantColor}
              />
            </Box>
            
            <Typography variant="caption" sx={{ ml: 1, minWidth: 32, color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem' }}>
              {formatDuration(duration)}
            </Typography>
          </Box>
        </Box>
        
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          ml: 1,
          flexShrink: 0,
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <IconButton 
              size="small" 
              onClick={toggleMute}
              sx={{ color: 'rgba(255,255,255,0.8)', p: 0.8 }}
            >
              {isMuted || volume === 0 ? 
                <VolumeOff sx={{ fontSize: 18 }} /> : 
                volume < 0.5 ? 
                  <VolumeDown sx={{ fontSize: 18 }} /> : 
                  <VolumeUp sx={{ fontSize: 18 }} />
              }
            </IconButton>
            
            <VolumeSlider
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              aria-label="volume-slider"
              sx={{ ml: 1 }}
              covercolor={dominantColor}
              size="small"
            />
          </Box>
          
          <IconButton 
            onClick={openFullScreen}
            size="small"
            sx={{ 
              ml: 1.5,
              color: 'rgba(255,255,255,0.8)',
              p: 0.8,
              '&:hover': {
                color: 'white'
              }
            }}
          >
            <ExpandMore sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </PlayerContainer>

      
      <Snackbar 
        open={shareSnackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 999999999 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={shareSnackbar.severity} 
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {shareSnackbar.message}
        </Alert>
      </Snackbar>

      <FullScreenPlayer open={fullScreenOpen} onClose={closeFullScreen} />
    </>
  );
};

export default DesktopPlayer; 