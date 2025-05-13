import React, { memo } from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Skeleton
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

const StyledCard = styled(Card)(({ theme, compact }) => ({
  position: 'relative',
  borderRadius: compact ? theme.spacing(1.2) : theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 16px rgba(0, 0, 0, 0.4)'
      : '0 6px 16px rgba(0, 0, 0, 0.1)',
    '& .MusicCard-hoverControls': {
      opacity: 1,
    },
    '& .MusicCard-media': {
      filter: 'brightness(0.85)',
    }
  },
  width: compact ? 160 : 200,
  maxWidth: '100%',
}));

const MediaWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  aspectRatio: '1/1',
}));

const StyledMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'all 0.3s ease',
}));

const HoverControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'all 0.3s ease',
  background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.mode === 'dark' ? '#000' : theme.palette.primary.main,
  '&:hover': {
    backgroundColor: '#fff',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  transition: 'all 0.2s ease',
  padding: 6,
}));

const Title = styled(Typography)(({ theme, compact }) => ({
  fontWeight: 600,
  fontSize: compact ? '0.85rem' : '0.95rem',
  lineHeight: 1.3,
  letterSpacing: '0.2px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  marginBottom: theme.spacing(0.3),
}));

const Subtitle = styled(Typography)(({ theme, compact }) => ({
  fontSize: compact ? '0.75rem' : '0.8rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
}));

const MoreButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  padding: 4,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  opacity: 0,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  transition: 'all 0.2s ease',
  '.MusicCard-root:hover &': {
    opacity: 1,
  },
}));


const MusicCardSkeleton = ({ compact }) => (
  <StyledCard compact={compact}>
    <Box sx={{ p: compact ? 1 : 1.5 }}>
      <MediaWrapper>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
          sx={{ 
            borderRadius: (theme) => theme.spacing(1),
            aspectRatio: '1/1'
          }}
        />
      </MediaWrapper>
      <Box sx={{ pt: 1.5 }}>
        <Skeleton width="80%" height={24} animation="wave" />
        <Skeleton width="60%" height={20} animation="wave" />
      </Box>
    </Box>
  </StyledCard>
);

const MusicCard = ({ 
  image, 
  title, 
  artist, 
  isPlaying = false, 
  isFavorite = false,
  onPlay, 
  onPause, 
  onToggleFavorite,
  onMoreClick,
  compact = false,
  loading = false,
  ...rest
}) => {
  
  if (loading) {
    return <MusicCardSkeleton compact={compact} />;
  }

  return (
    <StyledCard compact={compact} className="MusicCard-root" {...rest}>
      <Box sx={{ p: compact ? 1 : 1.5 }}>
        <MediaWrapper>
          <StyledMedia
            className="MusicCard-media"
            image={image}
            title={title}
          />
          <HoverControls className="MusicCard-hoverControls">
            <PlayButton 
              aria-label={isPlaying ? "pause" : "play"} 
              onClick={isPlaying ? onPause : onPlay}
              size="medium"
            >
              {isPlaying ? (
                <PauseRoundedIcon fontSize={compact ? "small" : "medium"} />
              ) : (
                <PlayArrowRoundedIcon fontSize={compact ? "small" : "medium"} />
              )}
            </PlayButton>
          </HoverControls>
          
          <MoreButton 
            size="small" 
            aria-label="more" 
            onClick={onMoreClick}
            sx={{ opacity: 0 }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </MoreButton>
          
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 8, 
              right: 8, 
              borderRadius: '50%', 
              opacity: 0,
              transition: 'all 0.2s ease',
              '.MusicCard-root:hover &': {
                opacity: 1,
              }
            }}
          >
            <ActionButton 
              size="small" 
              onClick={onToggleFavorite}
            >
              {isFavorite ? (
                <FavoriteRoundedIcon fontSize="small" color="error" />
              ) : (
                <FavoriteBorderRoundedIcon fontSize="small" />
              )}
            </ActionButton>
          </Box>
        </MediaWrapper>
        
        <Box sx={{ pt: 1 }}>
          <Title variant="subtitle1" compact={compact ? 1 : 0}>
            {title}
          </Title>
          <Subtitle variant="body2" compact={compact ? 1 : 0}>
            {artist}
          </Subtitle>
        </Box>
      </Box>
    </StyledCard>
  );
};

export { MusicCardSkeleton };
export default memo(MusicCard); 