import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
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
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipForward,
  IoPlaySkipBack,
  IoHeart,
  IoHeartOutline,
  IoVolumeHigh,
  IoVolumeMedium,
  IoVolumeMute,
  IoList,
  IoRepeat,
  IoRepeatOutline,
  IoShuffle,
  IoChevronDown,
  IoShareSocial
} from 'react-icons/io5';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { ThemeSettingsContext } from '../../App';
import { useContext } from 'react';
import FullScreenPlayer from './FullScreenPlayer/index.js';
import { extractDominantColor } from '../../utils/imageUtils';


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


const MarqueeText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isactive'
})(({ isactive }) => ({
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


const ControlButton = memo(({ icon, onClick, ariaLabel, color = 'white', active = false, activeColor = null }) => (
  <IconButton
    onClick={onClick}
    aria-label={ariaLabel}
    sx={{
      color: active ? (activeColor || 'primary.main') : color,
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }
    }}
  >
    {icon}
  </IconButton>
));


const getColorFromImage = extractDominantColor;

const DesktopPlayer = memo(() => {
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
    toggleMute,
    getCurrentTimeRaw,
    getDurationRaw,
    audioRef
  } = useMusic();

  const [seekValue, setSeekValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); 
  const [shuffleMode, setShuffleMode] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  const [isPlayerHovered, setIsPlayerHovered] = useState(false);
  
  
  const [titleOverflowing, setTitleOverflowing] = useState(false);
  const [artistOverflowing, setArtistOverflowing] = useState(false);
  
  const [shareSnackbar, setShareSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const progressRef = useRef(null);
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const currentSeekValueRef = useRef(0);
  
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
        
        const currentTimeEl = document.getElementById('desktop-current-time');
        const durationEl = document.getElementById('desktop-duration');
        

        if (currentTimeEl && window.audioTiming && window.audioTiming.formattedCurrentTime) {
          currentTimeEl.textContent = window.audioTiming.formattedCurrentTime;
        }
        
        if (durationEl && window.audioTiming && window.audioTiming.formattedDuration) {
          durationEl.textContent = window.audioTiming.formattedDuration;
        }
        

        if (!isSeeking && window.audioTiming && typeof window.audioTiming.progress === 'number') {
          setSeekValue(window.audioTiming.progress);
          currentSeekValueRef.current = window.audioTiming.progress;
        }
        

        if (isMounted) {
          requestAnimationFrame(updateDisplays);
        }
      } catch (error) {
        console.error("Error updating player displays:", error);

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
  }, [isSeeking]);

  
  useEffect(() => {
    
  }, []);
  
  useEffect(() => {
    if (titleRef.current) {
      setTitleOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
    if (artistRef.current) {
      setArtistOverflowing(artistRef.current.scrollWidth > artistRef.current.clientWidth);
    }
  }, [currentTrack]);
  
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
    
    const handleProgressUpdate = (event) => {
      if (!isSeeking && event.detail && event.detail.progressPercent) {
        setSeekValue(event.detail.progressPercent);
        currentSeekValueRef.current = event.detail.progressPercent;
      }
    };
    
    document.addEventListener('audioProgressUpdate', handleProgressUpdate);
    
    
    if (window.currentAudioProgress !== undefined && !isSeeking) {
      setSeekValue(window.currentAudioProgress);
      currentSeekValueRef.current = window.currentAudioProgress;
    }
    
    return () => {
      document.removeEventListener('audioProgressUpdate', handleProgressUpdate);
    };
  }, [isSeeking]);
  
  if (!currentTrack) {
    return null;
  }
  
  const handleSeekStart = useCallback(() => {
    setIsSeeking(true);
  }, []);
  
  const handleSeekChange = useCallback((_, newValue) => {
    setSeekValue(newValue);
  }, []);
  
  const handleSeekEnd = useCallback((_, newValue) => {
    try {
      let durationValue = 0;
      

      if (typeof getDurationRaw === 'function') {
        const rawDuration = getDurationRaw();
        if (typeof rawDuration === 'number' && rawDuration > 0) {
          durationValue = rawDuration;
        } else if (typeof duration === 'number' && duration > 0) {
          durationValue = duration;
        }
      } else if (typeof duration === 'number' && duration > 0) {
        durationValue = duration;
      } else if (audioRef && audioRef.current && audioRef.current.duration) {

        durationValue = audioRef.current.duration;
      }
      

      if (durationValue > 0) {
        seekTo((newValue * durationValue) / 100);
      }
      
      setIsSeeking(false);
    } catch (error) {
      console.error("Error in handleSeekEnd:", error);
      setIsSeeking(false);
    }
  }, [seekTo, getDurationRaw, duration, audioRef]);

  const handleClickProgress = useCallback((event) => {
    try {
      if (progressRef.current) {

        let durationValue = 0;
        
        if (typeof getDurationRaw === 'function') {
          const rawDuration = getDurationRaw();
          if (typeof rawDuration === 'number' && rawDuration > 0) {
            durationValue = rawDuration;
          } else if (typeof duration === 'number' && duration > 0) {
            durationValue = duration;
          }
        } else if (typeof duration === 'number' && duration > 0) {
          durationValue = duration;
        } else if (audioRef && audioRef.current && audioRef.current.duration) {
          durationValue = audioRef.current.duration;
        }
        

        if (durationValue > 0) {
          const rect = progressRef.current.getBoundingClientRect();
          const position = ((event.clientX - rect.left) / rect.width) * 100;
          const clampedPosition = Math.min(Math.max(position, 0), 100);
          setSeekValue(clampedPosition);
          seekTo((clampedPosition * durationValue) / 100);
        }
      }
    } catch (error) {
      console.error("Error in handleClickProgress:", error);
    }
  }, [progressRef, seekTo, getDurationRaw, duration, audioRef]);

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

  const handleShare = useCallback(() => {
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
    setShareSnackbar(prev => ({ ...prev, open: false }));
  }, []);
  
  const handleVolumeChange = useCallback((_, newValue) => {
    setVolume(newValue / 100);
  }, [setVolume]);
  
  const handleRepeatClick = useCallback(() => {
    
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);
  
  const handleShuffleClick = useCallback(() => {
    setShuffleMode(prev => !prev);
  }, []);
  
  const openFullScreen = useCallback(() => {
    setFullScreenOpen(true);
  }, []);
  
  const closeFullScreen = useCallback(() => {
    setFullScreenOpen(false);
  }, []);
  
  const getVolumeIcon = useMemo(() => {
    if (isMuted || volume === 0) return <IoVolumeMute size={20} />;
    if (volume < 0.5) return <IoVolumeMedium size={20} />;
    return <IoVolumeHigh size={20} />;
  }, [isMuted, volume]);
  
  const getRepeatIcon = useMemo(() => {
    if (repeatMode === 'one') return <IoRepeat size={20} />;
    return <IoRepeatOutline size={20} />;
  }, [repeatMode]);
  
  return (
    <React.Fragment>
      <PlayerContainer 
        elevation={0} 
        covercolor={dominantColor}
        onMouseEnter={() => setIsPlayerHovered(true)}
        onMouseLeave={() => setIsPlayerHovered(false)}
        sx={{ display: fullScreenOpen ? 'none' : 'flex' }}
        className={fullScreenOpen ? 'hidden' : ''}
      >
        {/* Трек-информация */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '25%',
            cursor: 'pointer',
          }}
          onClick={openFullScreen}
        >
          <Box
            component="img"
            src={currentTrack?.cover_path || '/static/uploads/system/album_placeholder.jpg'}
            alt={currentTrack?.title || ''}
            sx={{
              width: 52,
              height: 52,
              borderRadius: 1.5,
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginRight: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
              },
            }}
          />
          
          <Box sx={{ overflow: 'hidden', maxWidth: '70%' }}>
            <MarqueeText
              variant="body1"
              ref={titleRef}
              fontWeight="medium"
              isactive={titleOverflowing && isPlayerHovered ? 'true' : 'false'}
              data-text={currentTrack?.title || 'Unknown Title'}
              sx={{ 
                fontSize: '0.95rem',
                color: 'white'
              }}
            >
              {currentTrack?.title || 'Unknown Title'}
            </MarqueeText>
            
            <MarqueeText
              variant="body2"
              ref={artistRef}
              isactive={artistOverflowing && isPlayerHovered ? 'true' : 'false'}
              data-text={currentTrack?.artist || 'Unknown Artist'}
              sx={{ 
                fontSize: '0.8rem',
                opacity: 0.7,
                color: 'white'
              }}
            >
              {currentTrack?.artist || 'Unknown Artist'}
            </MarqueeText>
          </Box>
        </Box>
        
        {/* Кнопки управления и прогресс */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, mx: 2 }}>
          {/* Кнопки */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.8 }}>
            <ControlButton
              icon={<IoShuffle size={20} />}
              onClick={handleShuffleClick}
              ariaLabel="Toggle shuffle"
              active={shuffleMode}
            />
            
            <ControlButton
              icon={<IoPlaySkipBack size={20} />}
              onClick={prevTrack}
              ariaLabel="Previous track"
            />
            
            <ControlButton
              icon={isPlaying ? <IoPauseCircle size={24} /> : <IoPlayCircle size={24} />}
              onClick={togglePlay}
              ariaLabel={isPlaying ? "Pause" : "Play"}
              active={true}
              activeColor={dominantColor ? `rgba(${dominantColor}, 1)` : null}
            />
            
            <ControlButton
              icon={<IoPlaySkipForward size={20} />}
              onClick={nextTrack}
              ariaLabel="Next track"
            />
            
            <ControlButton
              icon={repeatMode === 'one' ? <IoRepeat size={20} /> : <IoRepeatOutline size={20} />}
              onClick={handleRepeatClick}
              ariaLabel="Toggle repeat mode"
              active={repeatMode !== 'off'}
            />
          </Box>
          
          {/* Прогресс */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
            <Typography 
              id="desktop-current-time"
              variant="caption" 
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1, minWidth: 35, textAlign: 'center' }}
            >
              {formattedCurrentTime}
            </Typography>
            
            <Box
              ref={progressRef}
              onClick={handleClickProgress}
              sx={{ flexGrow: 1 }}
            >
              <TrackSlider
                covercolor={dominantColor}
                value={seekValue}
                onChange={handleSeekChange}
                onMouseDown={handleSeekStart}
                onChangeCommitted={handleSeekEnd}
                onTouchStart={handleSeekStart}
                aria-labelledby="track-progress-slider"
                step={0.01}
              />
            </Box>
            
            <Typography 
              id="desktop-duration"
              variant="caption" 
              sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 1, minWidth: 35, textAlign: 'center' }}
            >
              {formattedDuration}
            </Typography>
          </Box>
        </Box>
        
        {/* Дополнительные кнопки */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '25%' }}>
          <ControlButton
            icon={currentTrack?.is_liked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
            onClick={toggleLikeTrack}
            ariaLabel="Toggle like"
            active={currentTrack?.is_liked}
            activeColor="error.main"
          />
          
          <ControlButton
            icon={<IoShareSocial size={20} />}
            onClick={handleShare}
            ariaLabel="Share track"
          />
          
          <ControlButton
            icon={isMuted ? <IoVolumeMute size={20} /> : 
                 volume < 0.5 ? <IoVolumeMedium size={20} /> : 
                 <IoVolumeHigh size={20} />}
            onClick={toggleMute}
            ariaLabel="Toggle mute"
          />
          
          <VolumeSlider
            covercolor={dominantColor}
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            aria-labelledby="volume-slider"
            sx={{ mx: 1 }}
          />
          
          <ControlButton
            icon={<IoChevronDown size={20} />}
            onClick={openFullScreen}
            ariaLabel="Open fullscreen player"
          />
        </Box>
      </PlayerContainer>
      
      <FullScreenPlayer open={fullScreenOpen} onClose={closeFullScreen} />
      
      <Snackbar
        open={shareSnackbar.open && !fullScreenOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default DesktopPlayer; 