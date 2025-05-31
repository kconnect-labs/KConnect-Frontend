import React, { memo, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  Card, 
  CardMedia, 
  CardContent,
  IconButton,
  Skeleton,
  Stack,
  Avatar,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

const StyledCard = styled(Card)(({ theme, active }) => ({
  backgroundColor: active 
    ? theme.palette.mode === 'dark' || theme.palette.mode === 'contrast'
      ? alpha(theme.palette.primary.dark, 0.8)
      : alpha(theme.palette.primary.light, 0.2)
    : theme.palette.mode === 'light'
      ? alpha(theme.palette.background.paper, 0.9)
      : theme.palette.mode === 'contrast'
        ? '#101010'
        : '#121212',
  borderRadius: theme.spacing(1.2),
  boxShadow: theme.shadows[3],
  transition: 'all 0.2s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  border: active 
    ? `1px solid ${theme.palette.primary.main}` 
    : theme.palette.mode === 'light'
      ? '1px solid rgba(0, 0, 0, 0.08)'
      : '1px solid rgba(255, 255, 255, 0.05)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[5],
    '& .media-overlay': {
      opacity: 1,
    },
  },
}));

const MediaWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '100%', 
  backgroundColor: theme.palette.mode === 'light'
    ? alpha(theme.palette.grey[300], 0.5)
    : theme.palette.mode === 'contrast'
      ? '#080808'
      : '#0A0A0A',
}));

const StyledMedia = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
}));

const MediaOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ContentArea = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0.8, 1),
  backgroundColor: theme.palette.mode === 'light'
    ? theme.palette.background.paper 
    : theme.palette.mode === 'contrast'
      ? '#101010'
      : '#121212',
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#fff',
}));

const TrackPreviewArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  marginTop: theme.spacing(0.5),
}));

const TrackPreviewItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  borderRadius: theme.spacing(0.75),
  padding: theme.spacing(0.15, 0.3),
  backgroundColor: theme.palette.mode === 'light'
    ? alpha(theme.palette.grey[300], 0.5)
    : theme.palette.mode === 'contrast'
      ? '#151515'
      : '#1E1E1E',
}));

const TrackPreviewImage = styled('img')(({ theme }) => ({
  width: 15,
  height: 15,
  borderRadius: theme.spacing(0.2),
  objectFit: 'cover',
}));

const VisibilityIcon = styled(Box)(({ theme, isPublic }) => ({
  position: 'absolute',
  top: theme.spacing(0.75),
  right: theme.spacing(0.75),
  backgroundColor: isPublic 
    ? alpha(theme.palette.success.main, 0.8)
    : alpha(theme.palette.text.secondary, 0.5),
  color: '#fff',
  borderRadius: '50%',
  padding: theme.spacing(0.25),
  width: 18,
  height: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
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

const Title = styled(Typography)(({ theme, compact }) => ({
  fontWeight: 600,
  fontSize: compact ? '0.8rem' : '0.9rem',
  lineHeight: 1.2,
  letterSpacing: '0.1px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  marginBottom: theme.spacing(0.2),
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#fff',
}));

const Subtitle = styled(Typography)(({ theme, compact }) => ({
  fontSize: compact ? '0.7rem' : '0.75rem',
  color: theme.palette.mode === 'light' 
    ? theme.palette.text.secondary 
    : 'rgba(255, 255, 255, 0.7)',
  lineHeight: 1.2,
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
  '.PlaylistCard-root:hover &': {
    opacity: 1,
  },
}));

const PreviewTracks = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1.5),
  left: theme.spacing(1.5),
  right: theme.spacing(1.5),
  display: 'flex',
  gap: theme.spacing(0.8),
}));

const PreviewTrackCover = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: theme.spacing(0.5),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
}));

const TracksCountChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  fontSize: '0.7rem',
  height: 24,
  '& .MuiChip-icon': {
    color: 'inherit',
    marginLeft: theme.spacing(0.5),
    fontSize: '1rem'
  }
}));

const PlaylistCardSkeleton = ({ compact }) => (
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

const PlaylistCard = React.memo(({ 
  id,
  name,
  description,
  coverImage,
  tracksCount,
  previewTracks,
  owner,
  isPublic,
  active,
  onClick,
  onMoreClick,
  isLoading = false
}) => {
  const theme = useTheme();

  
  const handleMoreClick = useCallback((e) => {
    if (onMoreClick) {
      onMoreClick(e);
    }
  }, [onMoreClick]);

  if (isLoading) {
    return <PlaylistCardSkeleton />;
  }

  return (
    <StyledCard
      active={active}
      onClick={() => onClick && onClick(id)}
    >
      <MediaWrapper>
        {isPublic !== undefined && (
          <VisibilityIcon isPublic={isPublic}>
            {isPublic ? <PublicIcon sx={{ fontSize: 12 }} /> : <LockIcon sx={{ fontSize: 12 }} />}
          </VisibilityIcon>
        )}
        <StyledMedia 
          src={coverImage || '/static/uploads/system/playlist_placeholder.jpg'} 
          alt={name} 
        />
        <MediaOverlay className="media-overlay">
          <IconButton
            size="small"
            sx={{ 
              color: '#fff',
              backgroundColor: alpha(theme.palette.primary.main, 0.8),
              '&:hover': { 
                backgroundColor: theme.palette.primary.main,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
              width: 32,
              height: 32,
            }}
          >
            <PlayArrowRoundedIcon fontSize="small" />
          </IconButton>
        </MediaOverlay>
      </MediaWrapper>
      <ContentArea>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography 
              variant="body2" 
              component="h3" 
              noWrap
              sx={{ 
                fontWeight: 600,
                mb: 0.25
              }}
            >
              {name || 'My Playlist'}
            </Typography>
            
            {owner && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.25,
                  mb: 0.25
                }}
              >
                <PersonIcon fontSize="inherit" />
                {owner.name || owner.username || 'Unknown User'}
              </Typography>
            )}
            
            {tracksCount !== undefined && (
              <Typography 
                variant="caption" 
                color="text.secondary"
              >
                {tracksCount} {tracksCount === 1 ? 'трек' : tracksCount > 1 && tracksCount < 5 ? 'трека' : 'треков'}
              </Typography>
            )}
          </Box>
          
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMoreClick(e);
            }}
            sx={{ ml: 0.5, p: 0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {previewTracks && previewTracks.length > 0 && (
          <TrackPreviewArea>
            {previewTracks.slice(0, 3).map((track, index) => (
              <TrackPreviewItem key={track.id || index}>
                <TrackPreviewImage 
                  src={track.cover_path || '/static/uploads/system/album_placeholder.jpg'} 
                  alt={track.title}
                />
                <Typography variant="caption" noWrap sx={{ flex: 1, fontSize: '0.7rem' }}>
                  {track.title}
                </Typography>
              </TrackPreviewItem>
            ))}
          </TrackPreviewArea>
        )}
      </ContentArea>
    </StyledCard>
  );
});

export { PlaylistCardSkeleton };
export default memo(PlaylistCard); 