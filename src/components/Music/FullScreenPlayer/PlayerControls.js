import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { IconButton, Slider, Tooltip } from '@mui/material';


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
          style={{

            color: dominantColor ? `rgb(${dominantColor})` : '#ffffff'
          }}
        />
        
        <div className={styles.timeDisplay}>
          <span className={styles.currentTime}>
            {formatDuration(displayTime.current)}
          </span>
          <span className={styles.duration}>
            {formatDuration(displayTime.duration)}
          </span>
        </div>
      </div>
      
      {/* Playback controls */}
      <div className={styles.controlsContainer}>
        {/* Secondary controls */}
        <div className={styles.secondaryControls}>
          <Tooltip title={shuffleMode ? "Перемешать: Вкл" : "Перемешать: Выкл"}>
            <IconButton 
              onClick={handleShuffleClick}
              className={`${styles.controlButton} ${styles.secondaryButton} ${shuffleMode ? styles.active : ''}`}
              style={{ 
                color: shuffleMode ? (dominantColor ? getLightestShade(dominantColor) : '#ffffff') : undefined,
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }}
            >
              <IoShuffle size={24} />
            </IconButton>
          </Tooltip>
          
          <IconButton 
            onClick={prevTrack}
            className={`${styles.controlButton} ${styles.secondaryButton}`}
            style={{ 
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: dominantColor ? getLightestShade(dominantColor) : '#ffffff'
            }}
          >
            <IoPlaySkipBack size={24} />
          </IconButton>
        </div>
        
        {/* Primary play/pause control */}
        <IconButton
          onClick={togglePlay}
          className={`${styles.controlButton} ${styles.primaryButton}`}
          style={{ 
            backgroundColor: 'transparent',
            boxShadow: 'none',
            color: dominantColor ? getLightestShade(dominantColor) : '#ffffff'
          }}
        >
          {isPlaying ? 
            <IoPauseCircle size={52} /> : 
            <IoPlayCircle size={52} />
          }
        </IconButton>
        
        {/* Secondary controls */}
        <div className={styles.secondaryControls}>
          <IconButton 
            onClick={nextTrack}
            className={`${styles.controlButton} ${styles.secondaryButton}`}
            style={{ 
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: dominantColor ? getLightestShade(dominantColor) : '#ffffff'
            }}
          >
            <IoPlaySkipForward size={24} />
          </IconButton>
          
          <Tooltip title={
            repeatMode === 'off' ? "Повтор: Выкл" : 
            repeatMode === 'all' ? "Повтор: Все" : "Повтор: Один"
          }>
            <IconButton 
              onClick={handleRepeatClick}
              className={`${styles.controlButton} ${styles.secondaryButton} ${repeatMode !== 'off' ? styles.active : ''}`}
              style={{ 
                color: repeatMode !== 'off' ? (dominantColor ? getLightestShade(dominantColor) : '#ffffff') : undefined,
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }}
            >
              {getRepeatIcon()}
            </IconButton>
          </Tooltip>
        </div>
      </div>
      
      {/* Additional controls: Volume and like */}
      <div className={styles.additionalControls}>
        <div className={styles.volumeControl}>
          <IconButton 
            onClick={toggleMute}
            className={styles.volumeButton}
            style={{ 
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: dominantColor ? getLightestShade(dominantColor) : '#ffffff'
            }}
          >
            {getVolumeIcon()}
          </IconButton>
          
          <Slider
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className={styles.volumeSlider}
            classes={{
              track: styles.sliderTrack,
              rail: styles.sliderRail,
              thumb: styles.sliderThumb
            }}
            style={{
              color: dominantColor ? getLightestShade(dominantColor) : '#ffffff'
            }}
          />
        </div>
        
        <div className={styles.likeContainer}>
          <Tooltip title={currentTrack?.is_liked ? "Убрать лайк" : "Нравится"}>
            <IconButton 
              onClick={handleToggleLike}
              className={`${styles.likeButton}`}
              style={{ 
                backgroundColor: 'transparent',
                boxShadow: 'none',
                color: dominantColor ? getLightestShade(dominantColor) : '#ffffff'
              }}
            >
              {currentTrack?.is_liked ? (
                <IoHeart size={24} style={{ color: dominantColor ? getLightestShade(dominantColor) : '#ffffff' }} />
              ) : (
                <IoHeartOutline size={24} />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default memo(PlayerControls); 