import React, { useState, useContext } from 'react';
import { 
  Box, 
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  styled,
  useTheme,
  useMediaQuery,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Paper,
  Divider,
  CircularProgress,
  alpha
} from '@mui/material';
import { ThemeSettingsContext } from '../../App';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';


const ViewDialog = styled(Dialog)(({ theme }) => ({
  '&&': {
    '& .MuiDialog-paper': {
      [theme.breakpoints.down('sm')]: {
        borderRadius: '0 !important',
        maxWidth: '100% !important',
        maxHeight: '100% !important',
        width: '100% !important', 
        height: '100% !important',
        margin: '0 !important',
      },
      [theme.breakpoints.up('sm')]: {
        borderRadius: `${theme.spacing(2)}px !important`,
        maxWidth: '800px !important',
        maxHeight: '80vh !important',
        width: '800px !important',
        height: '80vh !important',
        margin: '40px auto !important',
      },
      backgroundColor: theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.mode === 'contrast'
          ? '#101010'
          : '#121212',
      backgroundImage: 'none !important',
      overflow: 'hidden !important',
    }
  }
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'light'
    ? theme.palette.background.paper
    : theme.palette.mode === 'contrast'
      ? '#101010'
      : '#1A1A1A',
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#fff',
}));

const CoverImage = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const TrackItem = styled(ListItem)(({ theme, isPlaying }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1, 1.5),
  backgroundColor: isPlaying
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.15 : 0.25)
    : 'transparent',
  '&:hover': {
    backgroundColor: isPlaying
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.2 : 0.3)
      : theme.palette.mode === 'light' 
        ? alpha(theme.palette.grey[300], 0.3) 
        : alpha(theme.palette.common.white, 0.05),
  },
}));

const TrackAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: theme.spacing(1),
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  height: '100%',
  padding: theme.spacing(0, 0, 0, 0),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.mode === 'light' 
      ? alpha(theme.palette.grey[300], 0.3)
      : alpha(theme.palette.common.white, 0.05),
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'light' 
      ? alpha(theme.palette.grey[500], 0.4)
      : alpha(theme.palette.common.white, 0.2),
    borderRadius: '3px',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  boxShadow: 'none',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  marginRight: theme.spacing(1),
}));

const PlayingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(1),
  animation: 'pulse 1.5s infinite ease-in-out',
  '@keyframes pulse': {
    '0%': { opacity: 0.6 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.6 }
  }
}));

const PlaylistViewModal = ({ 
  open, 
  onClose, 
  playlist = null,
  onEdit,
  onPlayTrack,
  isLoading = false,
  nowPlaying = null
}) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isVeryNarrow = useMediaQuery('(max-width:360px)');
  
  
  const handlePlayTrack = (track) => {
    if (onPlayTrack) {
      onPlayTrack(track);
      
    }
  };

  
  const isTrackPlaying = (track) => {
    return nowPlaying && nowPlaying.id === track.id;
  };

  
  const handleEditPlaylist = () => {
    if (onEdit && playlist) {
      onEdit(playlist);
      onClose(); 
    }
  };

  if (!playlist && !isLoading) {
    return null;
  }

  return (
    <ViewDialog
      open={open}
      onClose={onClose}
      fullScreen={false}
      maxWidth={false}
      fullWidth={false}
    >
      <DialogHeader>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isLoading ? 'Загрузка плейлиста...' : playlist?.name || 'Плейлист'}
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogHeader>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <ScrollableContent>
          <Box sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: 3,
              mb: 4
            }}>
              {/* Cover Image */}
              <Box sx={{ width: isMobile ? '100%' : '220px', flexShrink: 0 }}>
                <CoverImage>
                  <img 
                    src={playlist?.cover_url || playlist?.cover_image || '/static/uploads/system/playlist_placeholder.jpg'} 
                    alt={playlist?.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </CoverImage>

                {/* Playlist Info - Mobile View */}
                {isMobile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {playlist?.name}
                    </Typography>
                    
                    {/* Description */}
                    {playlist?.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {playlist?.description}
                      </Typography>
                    )}
                    
                    {/* Owner Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <UserAvatar src={playlist?.owner?.avatar_url}>
                        <PersonIcon />
                      </UserAvatar>
                      <Typography variant="body2" fontWeight={500}>
                        {playlist?.owner?.name || 'Неизвестный пользователь'}
                      </Typography>
                    </Box>
                    
                    {/* Stats */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {playlist?.tracks_count || 0} {getTracksText(playlist?.tracks_count || 0)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {playlist?.is_public ? (
                          <VisibilityIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        ) : (
                          <VisibilityOffIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {playlist?.is_public ? 'Публичный' : 'Приватный'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Actions - Mobile View */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {playlist?.is_owner && (
                        <ActionButton
                          variant="outlined"
                          color="primary"
                          onClick={handleEditPlaylist}
                          startIcon={<EditIcon />}
                          size="small"
                          fullWidth
                        >
                          {isVeryNarrow ? '' : 'Ред.'}
                        </ActionButton>
                      )}
                      
                      {playlist?.tracks && playlist.tracks.length > 0 && (
                        <ActionButton
                          variant="contained"
                          color="primary"
                          onClick={() => handlePlayTrack(playlist.tracks[0])}
                          startIcon={<PlayCircleOutlineIcon />}
                          size="small"
                          fullWidth
                        >
                          {isVeryNarrow ? '' : 'Слуш.'}
                        </ActionButton>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Playlist Info - Desktop View */}
              {!isMobile && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {playlist?.name}
                  </Typography>
                  
                  {/* Description */}
                  {playlist?.description && (
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {playlist?.description}
                    </Typography>
                  )}
                  
                  {/* Owner Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <UserAvatar src={playlist?.owner?.avatar_url}>
                      <PersonIcon />
                    </UserAvatar>
                    <Typography variant="body1" fontWeight={500}>
                      {playlist?.owner?.name || 'Неизвестный пользователь'}
                    </Typography>
                  </Box>
                  
                  {/* Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {playlist?.tracks_count || 0} {getTracksText(playlist?.tracks_count || 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {playlist?.is_public ? (
                        <VisibilityIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      ) : (
                        <VisibilityOffIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {playlist?.is_public ? 'Публичный' : 'Приватный'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Actions - Desktop View */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {playlist?.is_owner && (
                      <ActionButton
                        variant="outlined"
                        color="primary"
                        onClick={handleEditPlaylist}
                        startIcon={<EditIcon />}
                      >
                        Редактировать
                      </ActionButton>
                    )}
                    
                    {playlist?.tracks && playlist.tracks.length > 0 && (
                      <ActionButton
                        variant="contained"
                        color="primary"
                        onClick={() => handlePlayTrack(playlist.tracks[0])}
                        startIcon={<PlayCircleOutlineIcon />}
                      >
                        Слушать
                      </ActionButton>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Track List */}
            {playlist?.tracks && playlist.tracks.length > 0 ? (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Треки
                </Typography>
                <Paper variant="outlined" sx={{ 
                  borderRadius: theme => theme.breakpoints.down('sm') ? theme.spacing(1) : theme.spacing(2), 
                  overflow: 'hidden',
                  mx: 1
                }}>
                  <List disablePadding>
                    {playlist.tracks.map((track, index) => {
                      const playing = isTrackPlaying(track);
                      return (
                        <TrackItem
                          key={track.id}
                          divider={index !== playlist.tracks.length - 1}
                          onClick={() => handlePlayTrack(track)}
                          isPlaying={playing}
                          sx={{ cursor: 'pointer' }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '24px', mr: 1, flexShrink: 0 }}>
                            {playing ? (
                              <PlayingIndicator>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <rect x="4" y="4" width="3" height="16" rx="1.5">
                                    <animate attributeName="height" from="16" to="6" dur="0.6s" begin="0s" repeatCount="indefinite" values="16;6;16" keyTimes="0;0.5;1" />
                                  </rect>
                                  <rect x="10.5" y="4" width="3" height="16" rx="1.5">
                                    <animate attributeName="height" from="6" to="16" dur="0.6s" begin="0.1s" repeatCount="indefinite" values="6;16;6" keyTimes="0;0.5;1" />
                                  </rect>
                                  <rect x="17" y="4" width="3" height="16" rx="1.5">
                                    <animate attributeName="height" from="16" to="6" dur="0.6s" begin="0.2s" repeatCount="indefinite" values="16;6;16" keyTimes="0;0.5;1" />
                                  </rect>
                                </svg>
                              </PlayingIndicator>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {index + 1}
                              </Typography>
                            )}
                          </Box>
                          <ListItemAvatar sx={{ minWidth: 50 }}>
                            <TrackAvatar src={track.cover_path} alt={track.title}>
                              <MusicNoteOutlinedIcon />
                            </TrackAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={track.title}
                            secondary={track.artist}
                            primaryTypographyProps={{ 
                              fontWeight: 500, 
                              noWrap: true,
                              title: track.title,
                              color: playing ? 'primary' : 'inherit'
                            }}
                            secondaryTypographyProps={{ 
                              noWrap: true,
                              title: track.artist
                            }}
                            sx={{ mr: 1 }}
                          />
                          <IconButton edge="end" size="small" onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track);
                          }}>
                            <PlayCircleOutlineIcon />
                          </IconButton>
                        </TrackItem>
                      );
                    })}
                  </List>
                </Paper>
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                p: 4, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: 2,
                mt: 2
              }}>
                <Typography color="text.secondary">
                  Этот плейлист пока пуст
                </Typography>
                {playlist?.is_owner && (
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />} 
                    sx={{ mt: 2 }}
                    onClick={handleEditPlaylist}
                  >
                    Добавить треки
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </ScrollableContent>
      )}
    </ViewDialog>
  );
};


function getTracksText(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'треков';
  }
  
  if (lastDigit === 1) {
    return 'трек';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'трека';
  }
  
  return 'треков';
}

export default PlaylistViewModal; 