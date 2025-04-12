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

// Function to extract color from album cover
const getColorFromImage = extractDominantColor;

const PlayerContainer = styled(Paper)(({ theme, covercolor }) => ({
  position: 'fixed',
  bottom: 76, // Увеличиваем с 67 до 76 для соответствия новой высоте нижней навигации
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar - 1,
  backgroundColor: covercolor ? `rgba(${covercolor}, 0.35)` : 'rgba(10, 10, 10, 0.6)', // Фон с цветом обложки
  backdropFilter: 'blur(30px)', // Усиленный блюр
  boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.25)',
  padding: theme.spacing(0.5, 1.5, 1, 1.5),
  display: 'flex',
  flexDirection: 'column',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  }
}));

// Custom styled progress bar
const ProgressBar = styled(LinearProgress)(({ theme, covercolor }) => ({
  height: 3,
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
  // Add state for share notification
  const [shareSnackbar, setShareSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
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
  
  // Add share function
  const handleShare = (e) => {
    e.stopPropagation();
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
        {/* Simple non-interactive progress bar */}
        <ProgressBar 
          variant="determinate" 
          value={progressValue} 
          sx={{ 
            marginTop: '-4px', 
            marginBottom: '10px',
          }}
          covercolor={dominantColor}
        />

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mt: 0.5,
            position: 'relative',
            zIndex: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: 1,
            overflow: 'hidden',
            mr: 1.5
          }}>
            <Box 
              sx={{ 
                width: 45, 
                height: 45, 
                borderRadius: 2, 
                overflow: 'hidden', 
                mr: 2, 
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={(e) => handleControlClick(e, openFullScreen)}
            >
              <img
                src={getCoverWithFallback(currentTrack.cover_path, 'album')}
                alt={currentTrack.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Box>
            
            <Box 
              sx={{ 
                overflow: 'hidden', 
                flexGrow: 1, 
                cursor: 'pointer' 
              }}
              onClick={(e) => handleControlClick(e, openFullScreen)}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 'medium',
                  fontSize: '0.85rem',
                  lineHeight: 1.2,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {currentTrack.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                {currentTrack.artist}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexShrink: 0
          }}>
            <IconButton 
              onClick={(e) => handleControlClick(e, handleLike)}
              sx={{ 
                color: currentTrack.is_liked ? 'error.main' : 'rgba(255,255,255,0.8)',
                padding: '8px'
              }}
            >
              {currentTrack.is_liked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            
            {/* Add Share Button */}
            <IconButton 
              onClick={handleShare}
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                padding: '8px'
              }}
            >
              <Share />
            </IconButton>

            <IconButton 
              onClick={(e) => handleControlClick(e, prevTrack)}
              sx={{
                color: 'white',
                padding: '8px'
              }}
            >
              <SkipPrevious />
            </IconButton>
            
            <IconButton
              onClick={(e) => handleControlClick(e, togglePlay)}
              sx={{
                mx: 0.5,
                bgcolor: dominantColor ? `rgba(${dominantColor}, 0.9)` : 'primary.main',
                color: 'white',
                padding: '10px',
                '&:hover': {
                  bgcolor: dominantColor ? `rgba(${dominantColor}, 1)` : 'primary.dark',
                },
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              {isPlaying ? <Pause sx={{ fontSize: 22 }} /> : <PlayArrow sx={{ fontSize: 22 }} />}
            </IconButton>
            
            <IconButton 
              onClick={(e) => handleControlClick(e, nextTrack)}
              sx={{
                color: 'white',
                padding: '8px'
              }}
            >
              <SkipNext />
            </IconButton>

            <IconButton
              onClick={(e) => handleControlClick(e, openFullScreen)}
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                padding: '8px'
              }}
            >
              <KeyboardArrowUp />
            </IconButton>
          </Box>
        </Box>
      </PlayerContainer>

      {/* Snackbar for share notifications */}
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
    </React.Fragment>
  );
};

export default MobilePlayer; 