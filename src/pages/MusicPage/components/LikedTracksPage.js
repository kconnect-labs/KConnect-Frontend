import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Alert, 
  IconButton, 
  Tooltip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMusic } from '../../../context/MusicContext';
import apiClient from '../../../services/axiosConfig';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MusicUploadDialog from '../../../components/Music/MusicUploadDialog';
import UploadIcon from '@mui/icons-material/Upload';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MoreHoriz } from '@mui/icons-material';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const TrackListItem = styled(ListItem)(({ theme, isActive }) => ({
  borderRadius: 12,
  background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  marginBottom: theme.spacing(0.25), // 2px отступ между треками
  padding: theme.spacing(0.75, 2), // Еще меньше паддинг для компактности
  transition: 'background 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
  },
  '&:last-child': {
    marginBottom: 0,
  },
  // Адаптивность для телефонов
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1.5), // Еще меньше паддинг на телефонах
  },
}));

const TrackAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginRight: theme.spacing(2), // Добавляем расстояние между обложкой и названиями
  // Адаптивность для телефонов
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
  marginLeft: theme.spacing(0.5), // Добавляем отступ между кнопками
  '&:hover': {
    color: 'text.primary',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Адаптивность для телефонов
  [theme.breakpoints.down('sm')]: {
    width: 36,
    height: 36,
    marginLeft: theme.spacing(0.25),
  },
}));

const LikedTracksPage = ({ onBack }) => {
  const { playTrack, isPlaying, currentTrack, togglePlay, forceLoadTracks } = useMusic();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    fetchLikedTracks();
    // Принудительно загружаем треки в MusicContext для секции 'liked'
    if (forceLoadTracks) {
      forceLoadTracks('liked');
    }
  }, [forceLoadTracks]);

  const fetchLikedTracks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/music/liked');
      if (response.data.success) {
        setTracks(response.data.tracks);
      } else {
        setError('Не удалось загрузить любимые треки');
      }
    } catch (err) {
      console.error('Error fetching liked tracks:', err);
      setError('Ошибка при загрузке любимых треков');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = useCallback((track) => {
    if (isPlaying && currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, 'liked');
    }
  }, [isPlaying, currentTrack, playTrack, togglePlay]);

  const handleLikeTrack = async (trackId) => {
    try {
      const response = await apiClient.post(`/api/music/${trackId}/like`);
      if (response.data.success) {
        setTracks(prevTracks => {
          const track = prevTracks.find(t => t.id === trackId);
          if (track && track.is_liked) {
            return prevTracks.filter(t => t.id !== trackId);
          } else {
            return prevTracks.map(track => 
              track.id === trackId 
                ? { ...track, is_liked: !track.is_liked, likes_count: response.data.likes_count }
                : track
            );
          }
        });
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

  // Upload dialog handlers
  const handleOpenUploadDialog = () => setUploadDialogOpen(true);
  const handleCloseUploadDialog = () => setUploadDialogOpen(false);

  // Menu handlers
  const handleOpenMenu = (event, track) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTrack(track);
  };
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedTrack(null);
  };

  if (loading) {
    return (
      <PageContainer maxWidth="xl" disableGutters sx={{ pb: 10 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="primary" />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" disableGutters sx={{ pb: 10 }}>
      <HeaderCard sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 2, pb: '16px !important' }}>
          <IconButton 
            onClick={onBack} 
            sx={{ 
              mr: 2, 
              color: 'text.primary',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              Мои любимые
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tracks.length} треков в вашей коллекции
            </Typography>
          </Box>
          <Tooltip title="Загрузить трек">
            <IconButton
              onClick={handleOpenUploadDialog}
              sx={{
                ml: 2,
                color: 'primary.main',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'rgba(255,255,255,0.08)',
                }
              }}
              size="large"
            >
              <UploadIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </CardContent>
      </HeaderCard>

      <MusicUploadDialog open={uploadDialogOpen} onClose={handleCloseUploadDialog} onSuccess={fetchLikedTracks} />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 12 }}>
          {error}
        </Alert>
      )}

      {tracks.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="40vh"
          sx={{ 
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            У вас пока нет любимых треков
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Лайкайте треки, которые вам нравятся, и они появятся здесь
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const isTrackPlaying = isPlaying && isCurrentTrack;

            return (
              <React.Fragment key={track.id}>
                <TrackListItem 
                  isActive={isCurrentTrack}
                  onClick={() => handlePlayTrack(track)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleOpenMenu(e, track);
                  }}
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
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMenu(e, track);
                        }}
                      >
                        <MoreHoriz />
                      </ActionButton>
                    </Box>
                  </ListItemSecondaryAction>
                </TrackListItem>
                {index < tracks.length - 1 && (
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
      )}

      {/* Меню для трека */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }
        }}
      >
        {selectedTrack && (
          <MenuItem onClick={() => { handlePlayTrack(selectedTrack); handleCloseMenu(); }}>
            <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} /> Воспроизвести
          </MenuItem>
        )}
        {selectedTrack && (
          <MenuItem onClick={() => { navigator.clipboard.writeText(window.location.origin + '/music/' + selectedTrack.id); handleCloseMenu(); }}>
            <FavoriteBorderIcon fontSize="small" sx={{ mr: 1 }} /> Копировать ссылку
          </MenuItem>
        )}
        {/* Добавьте другие пункты меню по необходимости */}
      </Menu>
    </PageContainer>
  );
};

export default LikedTracksPage; 