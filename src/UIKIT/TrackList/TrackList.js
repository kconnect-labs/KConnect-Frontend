import React, { memo } from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Avatar,
  Divider,
  Skeleton
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import ExplicitRoundedIcon from '@mui/icons-material/ExplicitRounded';

const TrackListContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledList = styled(List)(({ theme, dense }) => ({
  padding: 0,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.2)' 
    : 'rgba(255, 255, 255, 0.5)',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
}));

const TrackItem = styled(ListItem)(({ theme, active, hover }) => ({
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease',
  position: 'relative',
  backgroundColor: active 
    ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')
    : hover 
      ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)')
      : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.04)',
    '& .track-hover-controls': {
      opacity: 1,
    }
  },
}));

const AlbumCover = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: theme.spacing(0.8),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const TrackTitle = styled(Typography)(({ theme, active }) => ({
  fontWeight: active ? 600 : 500,
  fontSize: '0.9rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: active 
    ? theme.palette.primary.main 
    : (theme.palette.mode === 'dark' ? '#fff' : '#000'),
}));

const TrackArtist = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const TrackDuration = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  whiteSpace: 'nowrap',
}));

const TrackNumber = styled(Typography)(({ theme, active }) => ({
  fontSize: '0.85rem',
  fontWeight: active ? 600 : 400,
  minWidth: 24,
  textAlign: 'center',
  color: active 
    ? theme.palette.primary.main 
    : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
}));

const ExplicitBadge = styled(ExplicitRoundedIcon)(({ theme }) => ({
  fontSize: 16,
  opacity: 0.7,
  marginLeft: theme.spacing(0.5),
  verticalAlign: 'middle',
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
  },
  width: 32,
  height: 32,
  transition: 'all 0.2s ease',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
  },
  padding: 6,
}));

const HoverControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.2s ease',
}));


const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};


const TrackItemSkeleton = () => (
  <TrackItem>
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 1, mr: 2 }} />
      <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
        <Skeleton variant="text" width="60%" height={22} />
        <Skeleton variant="text" width="40%" height={18} />
      </Box>
      <Skeleton variant="text" width={40} height={20} sx={{ ml: 2 }} />
    </Box>
  </TrackItem>
);

const TrackList = ({
  title,
  subtitle,
  tracks = [],
  loading = false,
  showAlbumArt = true,
  showTrackNumbers = true,
  currentTrackId = null,
  onTrackPlay,
  onTrackPause,
  onTrackFavoriteToggle,
  onTrackMoreClick,
  dense = false,
  maxHeight,
  ...rest
}) => {

  if (loading) {
    return (
      <TrackListContainer {...rest}>
        {title && (
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
            {subtitle}
          </Typography>
        )}
        
        <StyledList dense={dense ? 1 : 0}>
          {Array.from(new Array(5)).map((_, index) => (
            <React.Fragment key={index}>
              <TrackItemSkeleton />
              {index < 4 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </StyledList>
      </TrackListContainer>
    );
  }


  if (tracks.length === 0) {
    return null;
  }

  const isCurrentlyPlaying = (track) => {
    return track.id === currentTrackId;
  };

  return (
    <TrackListContainer {...rest}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          {subtitle}
        </Typography>
      )}
      
      <StyledList 
        dense={dense ? 1 : 0}
        sx={{ 
          maxHeight: maxHeight,
          overflow: maxHeight ? 'auto' : 'visible',
        }}
      >
        {tracks.map((track, index) => {
          const playing = isCurrentlyPlaying(track);
          
          return (
            <React.Fragment key={track.id || index}>
              <TrackItem active={playing ? 1 : 0}>
                {showTrackNumbers ? (
                  <TrackNumber active={playing ? 1 : 0}>
                    {index + 1}
                  </TrackNumber>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24 }}>
                    <Box
                      className="track-hover-controls"
                      sx={{
                        opacity: playing ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {playing ? (
                        <PlayButton
                          size="small"
                          onClick={() => onTrackPause(track, index)}
                          aria-label="pause"
                        >
                          <PauseRoundedIcon sx={{ fontSize: 16 }} />
                        </PlayButton>
                      ) : (
                        <PlayButton
                          size="small"
                          onClick={() => onTrackPlay(track, index)}
                          aria-label="play"
                        >
                          <PlayArrowRoundedIcon sx={{ fontSize: 16 }} />
                        </PlayButton>
                      )}
                    </Box>
                    {!playing && (
                      <Box
                        sx={{
                          opacity: 1,
                          transition: 'opacity 0.2s ease',
                          '.track-hover-controls:not(:empty) ~ &': { display: 'none' }
                        }}
                      >
                        <MusicNoteRoundedIcon 
                          sx={{ 
                            fontSize: 16, 
                            opacity: 0.5
                          }} 
                        />
                      </Box>
                    )}
                  </Box>
                )}
                
                {showAlbumArt && (
                  <ListItemAvatar sx={{ minWidth: 60 }}>
                    <AlbumCover
                      src={track.albumCover || track.image}
                      alt={track.albumTitle || track.album || track.title}
                      variant="rounded"
                    >
                      <MusicNoteRoundedIcon />
                    </AlbumCover>
                  </ListItemAvatar>
                )}
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrackTitle active={playing ? 1 : 0}>
                        {track.title}
                      </TrackTitle>
                      {track.explicit && <ExplicitBadge />}
                    </Box>
                  }
                  secondary={
                    <TrackArtist>
                      {track.artist}
                    </TrackArtist>
                  }
                  sx={{ margin: 0 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <TrackDuration sx={{ mr: 2 }}>
                    {formatDuration(track.duration)}
                  </TrackDuration>
                  
                  <HoverControls className="track-hover-controls">
                    <ActionButton
                      size="small"
                      onClick={() => onTrackFavoriteToggle(track, index)}
                      aria-label={track.isFavorite ? "remove from favorites" : "add to favorites"}
                    >
                      {track.isFavorite ? (
                        <FavoriteRoundedIcon fontSize="small" color="error" />
                      ) : (
                        <FavoriteBorderRoundedIcon fontSize="small" />
                      )}
                    </ActionButton>
                    
                    <ActionButton
                      size="small"
                      onClick={(event) => onTrackMoreClick(event, track, index)}
                      aria-label="more options"
                    >
                      <MoreVertRoundedIcon fontSize="small" />
                    </ActionButton>
                  </HoverControls>
                </Box>
              </TrackItem>
              {index < tracks.length - 1 && <Divider component="li" />}
            </React.Fragment>
          );
        })}
      </StyledList>
    </TrackListContainer>
  );
};

export default memo(TrackList); 