import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { IconButton, Slider, Tooltip, Box } from '@mui/material';

import { 
  IoPlayCircle, 
  IoPauseCircle, 
  IoPlaySkipForward, 
  IoPlaySkipBack,
  IoRepeat,
  IoRepeatOutline, 
  IoShuffle, 
  IoVolumeHigh, 
  IoVolumeMedium, 
  IoVolumeMute, 
  IoHeart, 
  IoHeartOutline 
} from 'react-icons/io5';

import { useMusic } from '../../../context/MusicContext';
import { formatDuration } from '../../../utils/formatters';
import styles from './PlayerControls.module.scss';


const ProgressUpdater = ({ onUpdate, getCurrentTimeRaw, getDurationRaw, isSeeking }) => {
  const animationFrameRef = useRef(null);
  const lastTimeUpdateRef = useRef(0);

  useEffect(() => {
    const updateProgress = () => {
      if (isSeeking) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
        return;
      }
      

      const rawCurrentTime = getCurrentTimeRaw();
      const rawDuration = getDurationRaw();
      
      if (rawDuration > 0) {
        const seekPosition = (rawCurrentTime / rawDuration) * 100;
        

        const now = Date.now();
        if (now - lastTimeUpdateRef.current > 250) {
          onUpdate({
            seekPosition,
            displayTime: {
              current: rawCurrentTime,
              duration: rawDuration
            }
          });
          lastTimeUpdateRef.current = now;
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateProgress);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSeeking, getCurrentTimeRaw, getDurationRaw, onUpdate]);

  return null;
};

const PlayerControls = ({ dominantColor }) => {
  const [seekPosition, setSeekPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [tempSeekPosition, setTempSeekPosition] = useState(null);
  const [repeatMode, setRepeatMode] = useState('off');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [displayTime, setDisplayTime] = useState({ current: 0, duration: 0 });
  
  const progressRef = useRef(null);
  
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
    seekTo,
    likeTrack,
    getCurrentTimeRaw,
    getDurationRaw
  } = useMusic();
  

  const getLightestShade = useCallback((color) => {
    if (!color) return '#ffffff';
    const [r, g, b] = color.split(',').map(Number);

    const lightR = Math.min(255, r + (255 - r) * 0.4);
    const lightG = Math.min(255, g + (255 - g) * 0.4);
    const lightB = Math.min(255, b + (255 - b) * 0.4);
    return `rgb(${Math.round(lightR)}, ${Math.round(lightG)}, ${Math.round(lightB)})`;
  }, []);


  const getVolumeIcon = useCallback(() => {
    if (isMuted || volume === 0) return <IoVolumeMute size={24} />;
    if (volume < 0.5) return <IoVolumeMedium size={24} />;
    return <IoVolumeHigh size={24} />;
  }, [isMuted, volume]);
  

  const getRepeatIcon = useCallback(() => {
    if (repeatMode === 'one') return <IoRepeat size={24} />;
    return <IoRepeatOutline size={24} />;
  }, [repeatMode]);


  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue / 100);
  };


  const handleClickProgress = (event) => {
    if (progressRef.current) {
      const currentDuration = getDurationRaw();
      if (currentDuration) {
        const rect = progressRef.current.getBoundingClientRect();
        const position = ((event.clientX - rect.left) / rect.width) * 100;
        const clampedPosition = Math.min(Math.max(position, 0), 100);
        setSeekPosition(clampedPosition);
        seekTo((clampedPosition * currentDuration) / 100);
      }
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


  const handleToggleLike = (e) => {
    if (e) e.stopPropagation();
    if (currentTrack?.id) {
      likeTrack(currentTrack.id);
    }
  };


  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (event, newValue) => {
    setTempSeekPosition(newValue);
  };

  const handleSeekEnd = (event, newValue) => {
    const finalPosition = tempSeekPosition !== null ? tempSeekPosition : newValue;
    setSeekPosition(finalPosition);
    
    const currentDuration = getDurationRaw();
    if (currentDuration) {
      seekTo((finalPosition * currentDuration) / 100);
    }
    
    setTempSeekPosition(null);
    setIsSeeking(false);
  };


  const handleProgressUpdate = useCallback(({ seekPosition: newPosition, displayTime: newDisplayTime }) => {
    setSeekPosition(newPosition);
    setDisplayTime(newDisplayTime);
  }, []);


  useEffect(() => {
    if (displayTime.duration > 0 && displayTime.current >= displayTime.duration - 0.1 && isPlaying) {
      if (repeatMode === 'one') {
        seekTo(0);
      } else if (repeatMode === 'all') {
        nextTrack();
      } else {
        togglePlay();
        seekTo(0);
      }
    }
  }, [displayTime, isPlaying, togglePlay, seekTo, repeatMode, nextTrack]);

  return (
    <div className={styles.container}>
      {/* Invisible component that handles progress updates */}
      <ProgressUpdater
        onUpdate={handleProgressUpdate}
        getCurrentTimeRaw={getCurrentTimeRaw}
        getDurationRaw={getDurationRaw}
        isSeeking={isSeeking}
      />
      
      {/* Progress bar with Apple Music styling */}
      <div 
        className={styles.progressContainer}
        ref={progressRef} 
        onClick={handleClickProgress}
      >
        <Slider
          value={tempSeekPosition !== null ? tempSeekPosition : seekPosition}
          onChange={handleSeekChange}
          onChangeCommitted={handleSeekEnd}
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          aria-labelledby="track-progress"
          className={styles.progressSlider}
          classes={{
            track: styles.sliderTrack,
            rail: styles.sliderRail,
            thumb: styles.sliderThumb
          }}
          sx={{
            color: dominantColor ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})` : '#d0bcff'
          }}
        />
        
        <div className={styles.timeDisplay}>
          <span className={styles.currentTime}>
            {formatDuration(displayTime.current)}
          </span>
          <span className={styles.duration}>
            -{formatDuration(displayTime.duration - displayTime.current)}
          </span>
        </div>
      </div>
      
      {/* Playback controls - Apple Music style */}
      <Box
        className={styles.controlsContainer}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <IconButton 
          onClick={handleShuffleClick}
          className={`${styles.controlButton} ${styles.secondaryButton} ${shuffleMode ? styles.active : ''}`}
          aria-label="shuffle"
          sx={{
            color: shuffleMode ? (dominantColor ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})` : '#d0bcff') : 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <IoShuffle />
        </IconButton>
        
        <IconButton 
          onClick={prevTrack} 
          className={`${styles.controlButton} ${styles.secondaryButton}`}
          aria-label="previous track"
        >
          <IoPlaySkipBack />
        </IconButton>
        
        <IconButton 
          onClick={togglePlay} 
          className={`${styles.controlButton} ${styles.primaryButton}`}
          aria-label={isPlaying ? "pause" : "play"}
          sx={{
            color: '#fff'
          }}
        >
          {isPlaying ? <IoPauseCircle /> : <IoPlayCircle />}
        </IconButton>
        
        <IconButton 
          onClick={nextTrack} 
          className={`${styles.controlButton} ${styles.secondaryButton}`}
          aria-label="next track"
        >
          <IoPlaySkipForward />
        </IconButton>
        
        <IconButton 
          onClick={handleRepeatClick}
          className={`${styles.controlButton} ${styles.secondaryButton} ${repeatMode !== 'off' ? styles.active : ''}`}
          aria-label="repeat"
          sx={{
            color: repeatMode !== 'off' ? (dominantColor ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})` : '#d0bcff') : 'rgba(255, 255, 255, 0.9)'
          }}
        >
          {getRepeatIcon()}
        </IconButton>
      </Box>
      
      {/* Additional controls - like button, volume, etc. */}
      <Box className={styles.additionalControls}>
        <div className={styles.volumeControl}>
          <IconButton 
            onClick={toggleMute}
            className={styles.volumeButton}
            aria-label={isMuted ? "unmute" : "mute"}
          >
            {getVolumeIcon()}
          </IconButton>
          
          <Slider
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            aria-labelledby="volume-slider"
            className={styles.volumeSlider}
            classes={{
              track: styles.sliderTrack,
              rail: styles.sliderRail,
              thumb: styles.sliderThumb
            }}
            sx={{
              color: dominantColor ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})` : '#d0bcff'
            }}
          />
        </div>
        
        <div className={styles.likeContainer}>
          <IconButton
            onClick={handleToggleLike}
            className={`${styles.likeButton} ${currentTrack?.liked ? styles.likedIcon : ''}`}
            aria-label={currentTrack?.liked ? "unlike" : "like"}
            sx={{
              color: currentTrack?.liked ? '#d0bcff' : 'rgba(255, 255, 255, 0.9)'
            }}
          >
            {currentTrack?.liked ? <IoHeart /> : <IoHeartOutline />}
          </IconButton>
        </div>
      </Box>
    </div>
  );
};

export default memo(PlayerControls); 