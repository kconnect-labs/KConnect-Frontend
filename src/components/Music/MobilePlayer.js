import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
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
  IoPlayCircle,
  IoPauseCircle,
  IoHeart,
  IoHeartOutline,
  IoChevronUp
} from 'react-icons/io5';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { ThemeSettingsContext } from '../../App';
import { useContext } from 'react';
import FullScreenPlayer from './FullScreenPlayer/index.js';
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
  '&.hidden': {
    display: 'none !important',
    opacity: 0,
    pointerEvents: 'none',
    visibility: 'hidden'
  },
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


const ControlButton = memo(({ icon, onClick, ariaLabel, disabled = false }) => (
  <IconButton
    onClick={onClick}
    size="small"
    aria-label={ariaLabel}
    disabled={disabled}
    sx={{
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }
    }}
  >
    {icon}
  </IconButton>
));


const TrackInfo = memo(({ title, artist, onClick }) => (
  <Box sx={{ 
    flexGrow: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden',
    cursor: 'pointer'
  }} onClick={onClick}>
    <Typography 
      variant="body2" 
      noWrap 
      sx={{ 
        fontWeight: 'medium',
        color: 'white'
      }}
    >
      {title || 'Unknown Title'}
    </Typography>
    <Typography 
      variant="caption" 
      noWrap 
      sx={{ 
        color: 'rgba(255, 255, 255, 0.7)' 
      }}
    >
      {artist || 'Unknown Artist'}
    </Typography>
  </Box>
));

const MobilePlayer = memo(() => {
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
    getCurrentTimeRaw,
    getDurationRaw,
    audioRef
  } = useMusic();

  
  const progressRef = useRef(0);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  
  const [shareSnackbar, setShareSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  
  const formattedCurrentTime = useMemo(() => {
    try {

      const globalTimeElement = document.getElementById('global-player-current-time');
      if (globalTimeElement && globalTimeElement.textContent) {
        return globalTimeElement.textContent;
      }
      

      if (typeof getCurrentTimeRaw === 'function') {
        const time = getCurrentTimeRaw();
        return formatDuration(typeof time === 'number' ? time : 0);
      }
      

      return '0:00';
    } catch (error) {
      console.error("Error getting current time:", error);
      return '0:00';
    }
  }, [getCurrentTimeRaw]);
  
  const formattedDuration = useMemo(() => {
    try {

      const globalDurationElement = document.getElementById('global-player-duration');
      if (globalDurationElement && globalDurationElement.textContent) {
        return globalDurationElement.textContent;
      }
      

      if (typeof getDurationRaw === 'function') {
        const duration = getDurationRaw();
        return formatDuration(typeof duration === 'number' ? duration : 0);
      }
      

      return '0:00';
    } catch (error) {
      console.error("Error getting duration:", error);
      return '0:00';
    }
  }, [getDurationRaw]);
  
  
  useEffect(() => {

    let isMounted = true;
    
    const updateDisplays = () => {
      try {

        if (!isMounted) return;
        
        const currentTimeEl = document.getElementById('mobile-current-time');
        const durationEl = document.getElementById('mobile-duration');
        const progressBar = document.getElementById('mobile-player-progress');
        

        if (currentTimeEl && window.audioTiming && window.audioTiming.formattedCurrentTime) {
          currentTimeEl.textContent = window.audioTiming.formattedCurrentTime;
        }
        

        if (durationEl && window.audioTiming && window.audioTiming.formattedDuration) {
          durationEl.textContent = window.audioTiming.formattedDuration;
        }
        

        if (progressBar && window.audioTiming && typeof window.audioTiming.progress === 'number') {
          progressBar.style.width = `${window.audioTiming.progress}%`;
          progressRef.current = window.audioTiming.progress;
        }
        

        if (isMounted) {
          requestAnimationFrame(updateDisplays);
        }
      } catch (error) {
        console.error("Error updating mobile player displays:", error);

        if (isMounted) {
          requestAnimationFrame(updateDisplays);
        }
      }
    };
    

    const animationId = requestAnimationFrame(updateDisplays);
    

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationId);
    };
  }, []);

  
  useEffect(() => {
    
  }, []);
  
  
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
    
    
    if (audioRef?.current) {
      const currentTimeValue = audioRef.current.currentTime || 0;
      const durationValue = audioRef.current.duration || 0;
      
      if (durationValue > 0) {
        progressRef.current = (currentTimeValue / durationValue) * 100;
        const progressBar = document.getElementById('mobile-player-progress');
        if (progressBar) {
          progressBar.style.width = `${progressRef.current}%`;
        }
      }
    }
  }, [audioRef]);
  
  
  
  useEffect(() => {
    if (duration > 0) {
      progressRef.current = (currentTime / duration) * 100;
    }
  }, [currentTime, duration]);
  
  if (!currentTrack) {
    return null;
  }

  const toggleLikeTrack = useCallback((e) => {
    
    if (e) {
      e.stopPropagation();
    }
    
    if (currentTrack?.id) {
      try {
        
        const likeButton = e.currentTarget;
        likeButton.style.transform = 'scale(1.3)';
        setTimeout(() => {
          likeButton.style.transform = 'scale(1)';
        }, 150);
        
        likeTrack(currentTrack.id)
          .then(result => {
            console.log("Like result:", result);
            
          })
          .catch(error => {
            console.error("Error liking track:", error);
          });
      } catch (error) {
        console.error("Error liking track:", error);
      }
    }
  }, [currentTrack, likeTrack]);
  
  
  const handleShare = useCallback((e) => {
    e.stopPropagation();
    if (!currentTrack) return;
    
    const trackLink = `${window.location.origin}/music?track=${currentTrack.id}`;
    
    
    copyToClipboard(trackLink);
  }, [currentTrack]);
  
  const copyToClipboard = useCallback((text) => {
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
  }, []);
  
  
  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShareSnackbar(prev => ({...prev, open: false}));
  }, []);

  const openFullScreen = useCallback(() => {
    setFullScreenOpen(true);
  }, []);

  const closeFullScreen = useCallback(() => {
    setFullScreenOpen(false);
  }, []);
  
  const handleControlClick = useCallback((e, callback) => {
    e.stopPropagation();
    try {
      callback();
    } catch (error) {
      console.error("Error in control click:", error);
    }
  }, []);
  
  const handlePrevClick = useCallback((e) => handleControlClick(e, prevTrack), [handleControlClick, prevTrack]);
  const handlePlayClick = useCallback((e) => handleControlClick(e, togglePlay), [handleControlClick, togglePlay]);
  const handleNextClick = useCallback((e) => handleControlClick(e, nextTrack), [handleControlClick, nextTrack]);
  
  return (
    <React.Fragment>
      <PlayerContainer 
        elevation={0} 
        covercolor={dominantColor} 
        sx={{ display: fullScreenOpen ? 'none' : 'flex' }}
        className={fullScreenOpen ? 'hidden' : ''}
      >
        
        {/* Custom progress bar instead of Material UI component */}
        <div style={{ 
          height: 2,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginTop: '-4px', 
          marginBottom: '6px',
          position: 'relative'
        }}>
          <div 
            id="mobile-player-progress"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progressRef.current}%`,
              backgroundColor: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main,
              transition: 'none'
            }}
          />
        </div>

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
          {/* Добавляем скрытые элементы для времени */}
          <div style={{ display: 'none' }}>
            <span id="mobile-current-time">0:00</span>
            <span id="mobile-duration">0:00</span>
          </div>
          
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
            
            <TrackInfo 
              title={currentTrack?.title}
              artist={currentTrack?.artist}
              onClick={openFullScreen}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <ControlButton
                icon={isPlaying ? <IoPauseCircle size={30} /> : <IoPlayCircle size={30} />}
                onClick={handlePlayClick}
                ariaLabel={isPlaying ? "Pause" : "Play"}
              />
              
              <ControlButton
                icon={currentTrack?.is_liked ? <IoHeart size={20} color={dominantColor ? `rgba(${dominantColor}, 1)` : "#ff2d55"} /> : <IoHeartOutline size={20} />}
                onClick={toggleLikeTrack}
                ariaLabel="Toggle like"
              />
              
              <ControlButton
                icon={<IoChevronUp size={20} />}
                onClick={openFullScreen}
                ariaLabel="Open fullscreen player"
              />
            </Box>
          </Box>
          
        </Box>
      </PlayerContainer>
      
      <FullScreenPlayer
        open={fullScreenOpen}
        onClose={closeFullScreen}
      />
      
      <Snackbar 
        open={shareSnackbar.open && !fullScreenOpen}
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: 70 }} 
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={shareSnackbar.severity} 
          sx={{ width: '100%' }}
        >
          {shareSnackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
});

export default MobilePlayer; 