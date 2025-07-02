import React from 'react';
import { Box, IconButton, Avatar, Typography, alpha, styled } from '@mui/material';
import { Icon } from '@iconify/react';

const PlayerControls = (props) => <Box {...props} />;

const VolumeControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&:hover .volume-slider': {
    opacity: 1,
    visibility: 'visible',
    transitionDelay: '0s',
  },
  '& .volume-slider': {
    transitionDelay: '0.2s',
  }
}));

const VolumeSlider = styled('input')(({ theme }) => ({
  position: 'absolute',
  left: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '60px',
  height: 3,
  marginLeft: theme.spacing(0.5),
  borderRadius: 1.5,
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  appearance: 'none',
  outline: 'none',
  transition: 'all 0.2s ease',
  opacity: 0,
  visibility: 'hidden',
  cursor: 'pointer',
  '&::-webkit-slider-thumb': {
    appearance: 'none',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
  },
  '&::-moz-range-thumb': {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
    border: 'none',
  }
}));

/**
 * HeaderPlayer - компонент плеера в хедере
 * @param {Function} onOpenFullscreen - функция для открытия фуллскрин плеера при клике на обложку
 * 
 * Пример использования:
 * <HeaderPlayer 
 *   currentTrack={currentTrack}
 *   isPlaying={isPlaying}
 *   onOpenFullscreen={() => setFullscreenPlayerOpen(true)}
 *   // ... другие пропы
 * />
 */
const HeaderPlayer = ({
  currentTrack,
  isPlaying,
  isMuted,
  volume,
  togglePlay,
  nextTrack,
  prevTrack,
  toggleMute,
  setVolume,
  theme,
  truncateTitle,
  isMobile = false,
  onClose,
  onOpenFullscreen
}) => {
  if (!currentTrack) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
      <Box 
        onClick={onOpenFullscreen || (() => console.warn('onOpenFullscreen не передан в HeaderPlayer'))}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          minWidth: 0,
          cursor: onOpenFullscreen ? 'pointer' : 'default',
          borderRadius: '8px',
          padding: '4px',
          transition: 'all 0.2s ease',
          '&:hover': onOpenFullscreen ? {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            transform: 'scale(1.02)'
          } : {}
        }}
      >
        <Avatar 
          variant="rounded" 
          src={currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'} 
          alt={currentTrack.title}
          sx={{ 
            width: 32, 
            height: 32, 
            mr: 1, 
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }
          }}
        />
        <Box sx={{ minWidth: 0, maxWidth: 180 }}>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {truncateTitle(currentTrack.title, 20)}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {truncateTitle(currentTrack.artist, 20)}
          </Typography>
        </Box>
      </Box>
      <PlayerControls sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
        <IconButton size="small" onClick={prevTrack} sx={{ p: 0.5, opacity: 0.6, transition: 'all 0.2s', '&:hover': { opacity: 1 } }}>
          <Icon icon="solar:skip-previous-bold" width="20" height="20" />
        </IconButton>
        <IconButton 
          onClick={togglePlay}
          size="small"
          sx={{ 
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            p: 0.7,
            mx: 0.5,
            opacity: 0.6,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              opacity: 1
            }
          }}
        >
          {isPlaying ? <Icon icon="solar:pause-bold" width="20" height="20" /> : <Icon icon="solar:play-bold" width="20" height="20" />}
        </IconButton>
        <IconButton size="small" onClick={nextTrack} sx={{ p: 0.5, opacity: 0.6, transition: 'all 0.2s', '&:hover': { opacity: 1 } }}>
          <Icon icon="solar:skip-next-bold" width="20" height="20" />
        </IconButton>
        <VolumeControl>
          <IconButton 
            size="small" 
            onClick={toggleMute}
            sx={{ p: 0.5, ml: 0.5, opacity: 0.6, transition: 'all 0.2s', '&:hover': { opacity: 1 } }}
          >
            {isMuted || volume === 0 ? 
              <Icon icon="solar:volume-cross-bold" width="20" height="20" /> : 
              <Icon icon="solar:volume-loud-bold" width="20" height="20" />
            }
          </IconButton>
          <VolumeSlider 
            className="volume-slider"
            type="range" 
            min={0} 
            max={1} 
            step={0.01} 
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </VolumeControl>
      </PlayerControls>
      {isMobile && false && (
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            color: 'inherit',
            opacity: 0.6,
            zIndex: 2,
            transition: 'all 0.2s',
            '&:hover': { opacity: 1 }
          }}
        >
          <Icon icon="solar:close-circle-bold" width="24" height="24" />
        </IconButton>
      )}
    </Box>
  );
};

export default HeaderPlayer; 