import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  LinearProgress,
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
  KeyboardArrowUp,
  Share
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { ThemeSettingsContext } from '../../App';
import { useContext } from 'react';
import FullScreenPlayer from './FullScreenPlayer';
import { extractDominantColor, getCoverWithFallback } from '../../utils/imageUtils';

const getColorFromImage = extractDominantColor;

const PlayerContainer = styled(Paper)(({ theme, covercolor }) => ({
  position: 'fixed',
  bottom:65, 
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar - 1,
  backgroundColor: covercolor ? `rgba(${covercolor}, 0.35)` : 'rgba(10, 10, 10, 0.6)', 
  backdropFilter: 'blur(30px)', 
  boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.25)',
  padding: theme.spacing(0.5, 1, 0.5, 1), 
  display: 'flex',
  flexDirection: 'column',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  borderTop: '1px solid rgba(255, 255, 255, 0.07)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.07)',
  borderRight: '1px solid rgba(255, 255, 255, 0.07)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: covercolor ? 
      `radial-gradient(ellipse at top, rgba(${covercolor}, 0.3) 0%, rgba(10, 10, 10, 0.1) 70%)` :
      'none',
    opacity: 0.6,
    pointerEvents: 'none',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  }
}));

const ProgressBar = styled(LinearProgress)(({ theme, covercolor }) => ({
  height: 2, 
  borderRadius: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 0,
    backgroundColor: covercolor ? `rgba(${covercolor}, 1)` : theme.palette.primary.main,
  },
}));

const MobilePlayer = () => {
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
    seekTo
  } = useMusic();

  const [progressValue, setProgressValue] = useState(0);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  
  const [shareSnackbar, setShareSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  
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
    if (duration > 0) {
      setProgressValue((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);
  
  if (!currentTrack) {
    return null;
  }

  const handleLike = () => {
    if (currentTrack?.id) {
      try {
        likeTrack?.(currentTrack.id);
      } catch (error) {
        console.error("Error liking track:", error);
      }
    }
  };
  
  
  const handleShare = (e) => {
    e.stopPropagation();
    if (!currentTrack) return;
    
    const trackLink = `${window.location.origin}/music?track=${currentTrack.id}`;
    
    
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
  
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShareSnackbar({...shareSnackbar, open: false});
  };

  const openFullScreen = () => {
    setFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setFullScreenOpen(false);
  };
  
  const handleControlClick = (e, callback) => {
    e.stopPropagation();
    try {
      callback();
    } catch (error) {
      console.error("Error in control click:", error);
    }
  };
  
  return (
    <React.Fragment>
      <PlayerContainer elevation={0} covercolor={dominantColor}>
        {}
        <ProgressBar 
          variant="determinate" 
          value={progressValue} 
          sx={{ 
            marginTop: '-4px', 
            marginBottom: '6px', 
          }}
          covercolor={dominantColor}
        />

        <Box 
          onClick={openFullScreen}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            padding: '2px 0' 
          }}
        >
          {}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <Box 
              component="img"
              src={getCoverWithFallback(currentTrack?.cover_path || '', "album")}
              alt={currentTrack?.title || ''}
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: 1,
                objectFit: 'cover',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginRight: 1.5,
              }}
            />
            
            <Box sx={{ 
              flexGrow: 1, 
              overflow: 'hidden',
              minWidth: 0
            }}>
              <Typography 
                variant="body2" 
                fontWeight="500"
                noWrap
              >
                {currentTrack?.title || 'Без названия'}
              </Typography>
              
              <Typography 
                variant="caption" 
                color="text.secondary"
                noWrap
              >
                {currentTrack?.artist || 'Неизвестный исполнитель'}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              marginLeft: 'auto',
              '& > button': { padding: 1 } 
            }}>
              <IconButton 
                onClick={(e) => handleControlClick(e, prevTrack)}
                size="small" 
                sx={{ 
                  color: 'text.primary'
                }}
              >
                <SkipPrevious fontSize="small" />
              </IconButton>
              
              <IconButton 
                onClick={(e) => handleControlClick(e, togglePlay)}
                size="small" 
                sx={{ 
                  color: 'white',
                  backgroundColor: dominantColor 
                    ? `rgba(${dominantColor}, 0.9)` 
                    : theme.palette.primary.main,
                  mx: 0.5,
                  width: 32, 
                  height: 32, 
                  '&:hover': {
                    backgroundColor: dominantColor 
                      ? `rgba(${dominantColor}, 1)` 
                      : theme.palette.primary.dark,
                  }
                }}
              >
                {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
              </IconButton>
              
              <IconButton 
                onClick={(e) => handleControlClick(e, nextTrack)}
                size="small" 
                sx={{ 
                  color: 'text.primary',
                  marginRight: 0.5
                }}
              >
                <SkipNext fontSize="small" />
              </IconButton>
              
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                size="small" 
                sx={{ 
                  color: currentTrack?.is_liked ? 'error.main' : 'text.secondary',
                  width: 30,
                  height: 30,
                }}
              >
                {currentTrack?.is_liked ? (
                  <Favorite fontSize="small" />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </PlayerContainer>
      
      {}
      <FullScreenPlayer 
        open={fullScreenOpen}
        onClose={closeFullScreen}
      />
      
      {}
      <Snackbar
        open={shareSnackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: 70 }} 
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={shareSnackbar.severity}
          sx={{ 
            width: '100%', 
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: shareSnackbar.severity === 'success' ? '#4caf50' : '#f44336'
            }
          }}
        >
          {shareSnackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default MobilePlayer; 