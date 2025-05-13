import React, { useState, memo } from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  IconButton, 
  Slider,
  Avatar,
  Paper
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import RepeatOneRoundedIcon from '@mui/icons-material/RepeatOneRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRoundedIcon from '@mui/icons-material/VolumeDownRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';


const PlayerContainer = styled(Paper)(({ theme, expanded }) => ({
  borderRadius: expanded ? theme.spacing(2) : theme.spacing(2, 2, 0, 0),
  padding: expanded ? theme.spacing(3) : theme.spacing(1.5),
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(20, 20, 20, 0.9)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: expanded ? 'column' : 'row',
  alignItems: expanded ? 'stretch' : 'center',
}));

const TrackInfoContainer = styled(Box)(({ theme, expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: expanded ? '0 0 auto' : '0 0 25%',
  marginBottom: expanded ? theme.spacing(2) : 0,
}));

const TrackCover = styled(Avatar)(({ theme, expanded }) => ({
  width: expanded ? 64 : 48,
  height: expanded ? 64 : 48,
  marginRight: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
}));

const TrackTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.9rem',
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
}));

const TrackArtist = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
}));

const ControlsContainer = styled(Box)(({ theme, expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: expanded ? 'center' : 'flex-end',
  flex: expanded ? '0 0 auto' : '0 0 75%',
  gap: expanded ? theme.spacing(1) : theme.spacing(0.5),
}));

const PlayPauseButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
}));

const ControlButton = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : 
    (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  },
  transition: 'all 0.2s ease',
}));

const ProgressSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    display: 'none',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
    },
  },
  '&:hover .MuiSlider-thumb': {
    display: 'block',
  },
  '& .MuiSlider-rail': {
    opacity: 0.3,
  },
}));

const VolumeSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
  width: 80,
  height: 4,
  '& .MuiSlider-thumb': {
    width: 10,
    height: 10,
    display: 'none',
  },
  '&:hover .MuiSlider-thumb': {
    display: 'block',
  },
  '& .MuiSlider-rail': {
    opacity: 0.3,
  },
}));

const TimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  minWidth: 38,
  textAlign: 'center',
}));


const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicPlayer = ({
  title,
  artist,
  coverImage,
  currentTime = 0,
  duration = 0,
  volume = 75,
  isPlaying = false,
  isFavorite = false,
  repeatMode = 'none',
  shuffleEnabled = false,
  expanded = false,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onToggleFavorite,
  onQueueOpen,
  ...rest
}) => {

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeMuteRoundedIcon fontSize="small" />;
    if (volume < 50) return <VolumeDownRoundedIcon fontSize="small" />;
    return <VolumeUpRoundedIcon fontSize="small" />;
  };

  return (
    <PlayerContainer expanded={expanded ? 1 : 0} {...rest}>
      {/* Track Info Section */}
      <TrackInfoContainer expanded={expanded ? 1 : 0}>
        <TrackCover 
          src={coverImage} 
          alt={title}
          variant="rounded"
          expanded={expanded ? 1 : 0}
        />
        <Box sx={{ 
            minWidth: 0, 
            overflow: 'hidden',
            flex: '1 1 auto',
          }}
        >
          <TrackTitle variant="subtitle1">
            {title}
          </TrackTitle>
          <TrackArtist variant="body2">
            {artist}
          </TrackArtist>
        </Box>
        
        {!expanded && (
          <ControlButton 
            size="small" 
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
          >
            {isFavorite ? (
              <FavoriteRoundedIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderRoundedIcon fontSize="small" />
            )}
          </ControlButton>
        )}
      </TrackInfoContainer>

      {/* Progress bar section - only in expanded mode */}
      {expanded && (
        <Box sx={{ mb: 2, width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1,
            width: '100%'
          }}>
            <TimeText>{formatTime(currentTime)}</TimeText>
            <ProgressSlider
              value={currentTime}
              max={duration}
              onChange={(_, value) => onSeek(value)}
              aria-label="Time"
            />
            <TimeText>{formatTime(duration)}</TimeText>
          </Box>
        </Box>
      )}

      {/* Controls Section */}
      <ControlsContainer expanded={expanded ? 1 : 0}>
        {expanded && (
          <>
            <ControlButton 
              size="small" 
              onClick={onToggleShuffle}
              active={shuffleEnabled ? 1 : 0}
              aria-label="shuffle"
            >
              <ShuffleRoundedIcon fontSize="small" />
            </ControlButton>
            
            <ControlButton
              onClick={onPrev}
              aria-label="previous"
            >
              <SkipPreviousRoundedIcon />
            </ControlButton>
            
            <PlayPauseButton 
              aria-label={isPlaying ? "pause" : "play"} 
              onClick={isPlaying ? onPause : onPlay}
              size="large"
            >
              {isPlaying ? (
                <PauseRoundedIcon fontSize="medium" />
              ) : (
                <PlayArrowRoundedIcon fontSize="medium" />
              )}
            </PlayPauseButton>
            
            <ControlButton
              onClick={onNext}
              aria-label="next"
            >
              <SkipNextRoundedIcon />
            </ControlButton>
            
            <ControlButton 
              size="small" 
              onClick={onToggleRepeat}
              active={repeatMode !== 'none' ? 1 : 0}
              aria-label="repeat"
            >
              {repeatMode === 'one' ? (
                <RepeatOneRoundedIcon fontSize="small" />
              ) : (
                <RepeatRoundedIcon fontSize="small" />
              )}
            </ControlButton>
          </>
        )}
        
        {!expanded && (
          <>
            <ControlButton
              onClick={onPrev}
              aria-label="previous"
              size="small"
            >
              <SkipPreviousRoundedIcon fontSize="small" />
            </ControlButton>
            
            <PlayPauseButton 
              aria-label={isPlaying ? "pause" : "play"} 
              onClick={isPlaying ? onPause : onPlay}
              size="small"
            >
              {isPlaying ? (
                <PauseRoundedIcon fontSize="small" />
              ) : (
                <PlayArrowRoundedIcon fontSize="small" />
              )}
            </PlayPauseButton>
            
            <ControlButton
              onClick={onNext}
              aria-label="next"
              size="small"
            >
              <SkipNextRoundedIcon fontSize="small" />
            </ControlButton>
          </>
        )}
        
        {expanded && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            ml: 'auto'
          }}>
            <ControlButton 
              size="small"
              aria-label="volume"
            >
              {getVolumeIcon()}
            </ControlButton>
            <VolumeSlider
              value={volume}
              onChange={(_, value) => onVolumeChange(value)}
              aria-label="Volume"
              min={0}
              max={100}
            />
            
            <ControlButton 
              size="small" 
              onClick={onToggleFavorite}
              aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
            >
              {isFavorite ? (
                <FavoriteRoundedIcon fontSize="small" color="error" />
              ) : (
                <FavoriteBorderRoundedIcon fontSize="small" />
              )}
            </ControlButton>
            
            <ControlButton 
              size="small" 
              onClick={onQueueOpen}
              aria-label="queue"
            >
              <QueueMusicRoundedIcon fontSize="small" />
            </ControlButton>
          </Box>
        )}
      </ControlsContainer>
      
      {/* Mini progress bar - only in compact mode */}
      {!expanded && (
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: 3 
        }}>
          <ProgressSlider
            value={currentTime}
            max={duration}
            onChange={(_, value) => onSeek(value)}
            aria-label="Time"
            disableSwap
            sx={{ height: 3, borderRadius: 0, p: 0, m: 0, '& .MuiSlider-thumb': { display: 'none' } }}
          />
        </Box>
      )}
    </PlayerContainer>
  );
};

export default memo(MusicPlayer); 