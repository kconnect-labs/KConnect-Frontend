import React from 'react';
import { Box, Typography, IconButton, Avatar, Grid, keyframes, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const TrackItemContainer = styled(Box)(({ theme, isPlaying }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1.5),
  borderRadius: '12px',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
  backgroundColor: isPlaying 
    ? alpha(theme.palette.primary.main, 0.15) 
    : 'transparent',
  border: '1px solid transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, 0.05),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    '.play-button-container': {
      opacity: 1,
    },
    '.track-number': {
      display: 'none',
    },
  },
}));

const CoverArtWrapper = styled(Box)({
  position: 'relative',
  width: 48,
  height: 48,
  flexShrink: 0,
});

const CoverArt = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}));

const PlayButtonContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.6)',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  borderRadius: '8px',
});

const TrackInfo = styled(Box)({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginLeft: '16px',
});

const PlayingIndicator = styled(GraphicEqIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  animation: `${pulseAnimation} 1.2s infinite ease-in-out`,
}));

const formatDuration = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return '0:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const TrackItem = ({ track, index, isPlaying, onPlay }) => {
  const { title, artist, cover_path, duration, album } = track;
  const theme = useTheme();

  return (
    <TrackItemContainer isPlaying={isPlaying}>
      <Grid container alignItems="center" spacing={2}>

        <Grid item xs={10} md={6} sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <Typography 
            sx={{ 
              width: '24px', 
              textAlign: 'center', 
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            {isPlaying ? <PlayingIndicator fontSize="small" /> : <span className="track-number">{index + 1}</span>}
          </Typography>

          <CoverArtWrapper>
            <CoverArt src={cover_path} alt={title} />
            <PlayButtonContainer className="play-button-container">
              <IconButton onClick={() => onPlay(track)} size="large" sx={{ color: 'white' }}>
                {isPlaying ? <PauseIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
              </IconButton>
            </PlayButtonContainer>
          </CoverArtWrapper>

          <TrackInfo>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 500, color: isPlaying ? theme.palette.primary.main : 'text.primary' }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {artist}
            </Typography>
          </TrackInfo>
        </Grid>

        <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' }, overflow: 'hidden' }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {album || 'Без альбома'}
          </Typography>
        </Grid>

        <Grid item xs={2} container justifyContent="flex-end" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {formatDuration(duration)}
          </Typography>
        </Grid>

      </Grid>
    </TrackItemContainer>
  );
};

export default TrackItem; 