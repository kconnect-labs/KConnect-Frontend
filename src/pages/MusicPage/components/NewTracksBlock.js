import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMusic } from '../../../context/MusicContext';
import apiClient from '../../../services/axiosConfig';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const NewTracksContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const NewTracksCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  background: 'rgba(0, 0, 0, 0.03)', // Фон 003
  backdropFilter: 'blur(20px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const NewTracksHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const TrackItem = styled(ListItem)(({ theme, isActive }) => ({
  borderRadius: 12,
  background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  marginBottom: theme.spacing(0.25),
  padding: theme.spacing(0.75, 2),
  transition: 'background 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
  },
  '&:last-child': {
    marginBottom: 0,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1.5),
  },
}));

const TrackAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(1.5),
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: 'text.secondary',
  width: 40,
  height: 40,
  marginLeft: theme.spacing(0.5),
  '&:hover': {
    color: 'text.primary',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 36,
    height: 36,
    marginLeft: theme.spacing(0.25),
  },
}));

const NewTracksBlock = () => {
  const { playTrack, isPlaying, currentTrack, togglePlay } = useMusic();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewTracks();
  }, []);

  const fetchNewTracks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/music/tracks?type=new&limit=10');
      if (response.data.success) {
        setTracks(response.data.tracks);
      } else {
        setError('Не удалось загрузить новые треки');
      }
    } catch (err) {
      console.error('Error fetching new tracks:', err);
      setError('Ошибка при загрузке новых треков');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlayTrack = useCallback((track) => {
    if (isPlaying && currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, 'new');
    }
  }, [isPlaying, currentTrack, playTrack, togglePlay]);

  const handleLikeTrack = async (trackId) => {
    try {
      const response = await apiClient.post(`/api/music/${trackId}/like`);
      if (response.data.success) {
        setTracks(prevTracks => 
          prevTracks.map(track => 
            track.id === trackId 
              ? { ...track, is_liked: !track.is_liked, likes_count: response.data.likes_count }
              : track
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <NewTracksContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress color="primary" />
        </Box>
      </NewTracksContainer>
    );
  }

  if (error || !tracks.length) {
    return null; // Скрываем блок при ошибке или отсутствии треков
  }

  return (
    <NewTracksContainer>
      <NewTracksCard>
        <CardContent>
          <NewTracksHeader>
            <NewReleasesIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
              Новые треки коннекта
            </Typography>
          </NewTracksHeader>
          
          <List sx={{ p: 0 }}>
            {tracks.slice(0, 5).map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isTrackPlaying = isPlaying && isCurrentTrack;

              return (
                <React.Fragment key={track.id}>
                  <TrackItem 
                    isActive={isCurrentTrack}
                    onClick={() => handlePlayTrack(track)}
                  >
                    <ListItemAvatar>
                      <TrackAvatar
                        src={track.cover_path}
                        alt={track.title}
                      />
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body1" 
                            fontWeight={isCurrentTrack ? 600 : 500}
                            sx={{ 
                              color: isCurrentTrack ? 'primary.main' : 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {track.title}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {track.artist}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDuration(track.duration)}
                            </Typography>
                            {track.genre && (
                              <>
                                <Typography variant="caption" color="text.secondary">•</Typography>
                                <Chip 
                                  label={track.genre} 
                                  size="small" 
                                  sx={{ 
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'text.secondary',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                  }} 
                                />
                              </>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeTrack(track.id);
                          }}
                        >
                          {track.is_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </ActionButton>
                        
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track);
                          }}
                          sx={{ 
                            color: isCurrentTrack ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {isTrackPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </ActionButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </TrackItem>
                  {index < Math.min(tracks.length, 5) - 1 && (
                    <Divider sx={{ 
                      mx: 2, 
                      borderColor: 'rgba(255, 255, 255, 0.05)',
                      opacity: 0.5 
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </NewTracksCard>
    </NewTracksContainer>
  );
};

export default NewTracksBlock; 