import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Slider, 
  Dialog, 
  DialogContent,
  Fade,
  useTheme,
  Button,
  useMediaQuery,
  alpha,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipNext, 
  SkipPrevious, 
  Close, 
  VolumeUp, 
  VolumeOff,
  VolumeDown,
  Favorite,
  FavoriteBorder,
  RepeatOne,
  Repeat,
  Shuffle,
  Share
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { ThemeSettingsContext } from '../../App';
import { useContext } from 'react';

// Function to extract color from album cover
const getColorFromImage = (imgSrc, callback) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    
    context.drawImage(img, 0, 0);
    
    // Get color from center of image
    const centerX = img.width / 2;
    const centerY = img.height / 2;
    const data = context.getImageData(centerX, centerY, 1, 1).data;
    
    // Format RGB color string
    callback(`${data[0]}, ${data[1]}, ${data[2]}`);
  };
  
  img.onerror = () => {
    callback(null);
  };
  
  img.src = imgSrc;
};

const FullScreenPlayer = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { themeSettings } = useContext(ThemeSettingsContext);
  const [seekPosition, setSeekPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [shuffleMode, setShuffleMode] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  const progressRef = useRef(null);
  // Add state for share notification
  const [shareSnackbar, setShareSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    currentTime,
    duration,
    seekTo,
    likeTrack
  } = useMusic();

  // Extract color from album cover when track changes
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

  // Lock body scroll when player is open
  useEffect(() => {
    const enableScroll = () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // Ensure scroll is re-enabled when player closes
      enableScroll();
      // Double-check with timeout to ensure it's applied after animations
      setTimeout(enableScroll, 300);
    }

    // Cleanup function ensures scroll is always re-enabled when component unmounts
    return enableScroll;
  }, [open]);

  // Update slider position during playback
  useEffect(() => {
    if (!isSeeking && duration > 0) {
      setSeekPosition((currentTime / duration) * 100);
    }
  }, [currentTime, duration, isSeeking]);

  if (!currentTrack) {
    return null;
  }

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue / 100);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (event, newValue) => {
    setSeekPosition(newValue);
  };

  const handleSeekEnd = (event, newValue) => {
    seekTo((newValue * duration) / 100);
    setIsSeeking(false);
  };

  const handleClickProgress = (event) => {
    if (progressRef.current && duration) {
      const rect = progressRef.current.getBoundingClientRect();
      const position = ((event.clientX - rect.left) / rect.width) * 100;
      const clampedPosition = Math.min(Math.max(position, 0), 100);
      setSeekPosition(clampedPosition);
      seekTo((clampedPosition * duration) / 100);
    }
  };

  const handleRepeatClick = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const handleShuffleClick = () => {
    setShuffleMode(!shuffleMode);
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

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      transitionDuration={200}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(18, 18, 18, 0.98)',
          backgroundImage: 'none',
          boxShadow: 'none',
          overflow: 'hidden',
          margin: 0,
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          maxWidth: '100vw',
          borderRadius: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 12000
        }
      }}
      sx={{
        zIndex: 12000,
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center' 
        }
      }}
    >
      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        
        <IconButton 
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            top: isMobile ? 16 : 24, 
            right: isMobile ? 16 : 24, 
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            '&:hover': { 
              bgcolor: 'rgba(0,0,0,0.7)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s',
            zIndex: 100,
            width: 40,
            height: 40
          }}
        >
          <Close />
        </IconButton>

        
        <IconButton 
          onClick={(e) => toggleLikeTrack(e)}
          sx={{ 
            position: 'absolute',
            top: isMobile ? 16 : 24,
            left: isMobile ? 16 : 24,
            color: currentTrack.is_liked ? 'error.main' : 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            '&:hover': { 
              bgcolor: 'rgba(0,0,0,0.7)',
              transform: 'scale(1.05)',
              color: currentTrack.is_liked ? 'error.light' : '#ff6b6b',
            },
            transition: 'all 0.2s',
            zIndex: 100,
            width: 40,
            height: 40
          }}
        >
          {currentTrack.is_liked ? (
            <Favorite 
              sx={{ 
                animation: 'heartPop 0.6s ease-out',
                '@keyframes heartPop': {
                  '0%': { transform: 'scale(1)' },
                  '10%': { transform: 'scale(0.8)' },
                  '30%': { transform: 'scale(1.5)', filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.6))' },
                  '50%': { transform: 'scale(1.2)', filter: 'drop-shadow(0 0 5px rgba(255,0,0,0.4))' },
                  '70%': { transform: 'scale(1.3)', filter: 'drop-shadow(0 0 3px rgba(255,0,0,0.2))' },
                  '100%': { transform: 'scale(1)' }
                }
              }} 
            />
          ) : (
            <FavoriteBorder 
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  animation: 'heartbeatHover 1.5s infinite',
                  '@keyframes heartbeatHover': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '25%': { transform: 'scale(1.1)', opacity: 0.8 },
                    '50%': { transform: 'scale(1)', opacity: 1 },
                    '75%': { transform: 'scale(1.1)', opacity: 0.8 },
                    '100%': { transform: 'scale(1)', opacity: 1 }
                  }
                }
              }}
            />
          )}
        </IconButton>
        
        
        <IconButton 
          onClick={handleShare}
          sx={{ 
            position: 'absolute',
            top: isMobile ? 16 : 24,
            left: isMobile ? (16 + 50) : (24 + 50), // Position next to like button
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            '&:hover': { 
              bgcolor: 'rgba(0,0,0,0.7)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s',
            zIndex: 100,
            width: 40,
            height: 40
          }}
        >
          <Share />
        </IconButton>

        
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(80px) saturate(180%)',
            WebkitBackdropFilter: 'blur(80px) saturate(180%)',
            background: dominantColor ? 
              `linear-gradient(to bottom, rgba(${dominantColor}, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)` : 
              'linear-gradient(to bottom, rgba(60, 60, 60, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)',
            zIndex: 1
          }
        }} />

        <Box sx={{ 
          position: 'relative',
          width: '100%',
          maxWidth: isMobile ? '95%' : '550px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '16px' : '24px',
          zIndex: 10
        }}>
          
          <Box sx={{ 
            width: '100%',
            maxWidth: isMobile ? '280px' : '350px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            mb: 4,
            aspectRatio: '1/1',
            position: 'relative',
            margin: '0 auto',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
              zIndex: 1
            }
          }}>
            <img 
              src={currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'} 
              alt={currentTrack.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          </Box>

          
          <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              fontWeight="600" 
              gutterBottom 
              sx={{ 
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 1,
                letterSpacing: '-0.02em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}
            >
              {currentTrack.title}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '400',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}
            >
              {currentTrack.artist} {currentTrack.album && `• ${currentTrack.album}`}
            </Typography>
          </Box>

          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mt: -1, 
            mb: 2,
            gap: 0.5,
            height: 24
          }}>
            {isPlaying && (
              <>
                {[0, 1, 2, 3].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 3,
                      height: index % 2 === 0 ? 12 : 16,
                      borderRadius: 4,
                      backgroundColor: dominantColor 
                        ? `rgba(${dominantColor}, 0.9)` 
                        : theme.palette.primary.main,
                      mx: 0.5
                    }}
                  />
                ))}
              </>
            )}
          </Box>

          
          <Box sx={{ width: '100%', mb: 3, px: 1 }} ref={progressRef} onClick={handleClickProgress}>
            <Slider
              value={seekPosition}
              onChange={handleSeekChange}
              onChangeCommitted={handleSeekEnd}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              aria-labelledby="track-progress"
              sx={{
                color: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main,
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 0,
                  height: 0,
                  opacity: 0,
                  transition: 'all 0.2s ease',
                  '&:hover, &.Mui-active': {
                    boxShadow: `0 0 0 8px ${alpha(dominantColor ? `rgb(${dominantColor})` : theme.palette.primary.main, 0.2)}`,
                    width: 16,
                    height: 16,
                    opacity: 1
                  }
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  backgroundColor: 'rgba(255,255,255,0.3)'
                },
                '&:hover .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  opacity: 1
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {formatDuration(currentTime)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {formatDuration(duration)}
              </Typography>
            </Box>
          </Box>

          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 4 }}>
            
            <IconButton 
              onClick={handleShuffleClick}
              sx={{ 
                color: shuffleMode ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'rgba(255,255,255,0.6)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Shuffle sx={{ fontSize: 24 }} />
            </IconButton>
            
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton 
                onClick={prevTrack}
                sx={{ 
                  color: 'white',
                  mx: 2,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                <SkipPrevious sx={{ fontSize: 36 }} />
              </IconButton>
              
              <IconButton
                onClick={togglePlay}
                sx={{ 
                  mx: 2, 
                  bgcolor: dominantColor ? `rgba(${dominantColor}, 0.9)` : theme.palette.primary.main,
                  color: 'white',
                  p: isMobile ? 1.5 : 2,
                  boxShadow: `0 4px 20px ${alpha(dominantColor ? `rgb(${dominantColor})` : theme.palette.primary.main, 0.5)}`,
                  '&:hover': {
                    bgcolor: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.light,
                    boxShadow: `0 6px 25px ${alpha(dominantColor ? `rgb(${dominantColor})` : theme.palette.primary.main, 0.6)}`,
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                {isPlaying ? 
                  <Pause sx={{ fontSize: isMobile ? 36 : 42 }} /> : 
                  <PlayArrow sx={{ fontSize: isMobile ? 36 : 42 }} />
                }
              </IconButton>
              
              <IconButton 
                onClick={nextTrack}
                sx={{ 
                  color: 'white',
                  mx: 2,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                <SkipNext sx={{ fontSize: 36 }} />
              </IconButton>
            </Box>
            
            
            <IconButton 
              onClick={handleRepeatClick}
              sx={{ 
                color: repeatMode !== 'off' ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'rgba(255,255,255,0.6)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {repeatMode === 'one' ? <RepeatOne sx={{ fontSize: 24 }} /> : <Repeat sx={{ fontSize: 24 }} />}
            </IconButton>
          </Box>

          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '100%',
              maxWidth: '280px',
              py: 1.5,
              px: 2,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <IconButton 
              onClick={toggleMute}
              sx={{ 
                mr: 1.5,
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              {isMuted || volume === 0 ? 
                <VolumeOff /> : 
                volume < 0.5 ? 
                  <VolumeDown /> : 
                  <VolumeUp />
              }
            </IconButton>
            
            <Slider
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              step={1}
              min={0}
              max={100}
              aria-labelledby="volume-slider"
              sx={{
                width: '100%',
                color: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main,
                height: 6,
                padding: '13px 0',
                '& .MuiSlider-rail': {
                  opacity: 0.8,
                  backgroundColor: 'rgba(255,255,255,0.4)'
                },
                '& .MuiSlider-track': {
                  height: 6,
                  borderRadius: 3
                },
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  '&:before': {
                    display: 'none'
                  },
                  '&:after': {
                    display: 'none'
                  },
                  '&:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: `0 0 0 8px ${alpha(dominantColor ? `rgb(${dominantColor})` : theme.palette.primary.main, 0.3)}`,
                    width: 20,
                    height: 20
                  }
                }
              }}
            />
          </Box>
        </Box>
        
        
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
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenPlayer; 