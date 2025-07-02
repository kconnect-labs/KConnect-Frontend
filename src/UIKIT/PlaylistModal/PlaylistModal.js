import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
  Box, 
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  TextField,
  IconButton,
  styled,
  useTheme,
  useMediaQuery,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  FormControlLabel,
  Switch,
  Paper,
  Skeleton,
  Snackbar,
  Alert,
  alpha
} from '@mui/material';
import { ThemeSettingsContext } from '../../App';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';


const FullScreenDialog = styled(Dialog)(({ theme }) => ({
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
      backgroundColor: 'rgba(255, 255, 255, 0.03) !important',
      backdropFilter: 'blur(20px) !important',
      backgroundImage: 'none !important',
      overflow: 'hidden !important',
      border: '1px solid rgba(255, 255, 255, 0.1) !important',
    }
  }
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  color: '#fff',
}));

const CoverUploadBox = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: theme.spacing(2),
  border: `2px dashed ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.mode === 'light'
    ? alpha(theme.palette.grey[300], 0.3)
    : theme.palette.mode === 'contrast'
      ? 'rgba(0, 0, 0, 0.4)'
      : 'rgba(0, 0, 0, 0.3)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[300], 0.5)
      : theme.palette.mode === 'contrast'
        ? 'rgba(0, 0, 0, 0.6)'
        : 'rgba(0, 0, 0, 0.5)',
    borderColor: theme.palette.primary.main,
  },
}));

const CoverPreview = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const TrackSearchInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[300], 0.2)
      : theme.palette.mode === 'contrast'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(255, 255, 255, 0.05)',
  },
}));

const TrackItem = styled(ListItem)(({ theme, selected, isPlaying }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1, 1.5),
  backgroundColor: isPlaying
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.15 : 0.25)
    : selected 
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.16)
      : 'transparent',
  '&:hover': {
    backgroundColor: isPlaying
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.2 : 0.3)
      : theme.palette.mode === 'light' 
        ? alpha(theme.palette.grey[300], 0.3)
        : alpha(theme.palette.common.white, 0.08),
  },
}));

const TrackAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: theme.spacing(1),
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  maxHeight: 'calc(100% - 48px)',
  padding: theme.spacing(0, 3, 3, 3),
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

const PlaylistModal = ({ 
  open, 
  onClose, 
  playlist = null, 
  onSave,
  onAddTracks,
  onRemoveTrack,
  onDelete,
  isLoading = false,
  nowPlaying = null
}) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isVeryNarrow = useMediaQuery('(max-width:360px)');
  const [activeTab, setActiveTab] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  
  const isEditing = !!playlist;

  
  useEffect(() => {
    if (open && playlist) {
      
      setName(playlist.name || '');
      setDescription(playlist.description || '');
      setIsPublic(playlist.is_public !== false);
      setCoverPreview(playlist.cover_url || playlist.cover_image || '');
      setPlaylistTracks(playlist.tracks || []);
      setSelectedTracks([]);
    } else if (open) {
      
      setName('');
      setDescription('');
      setIsPublic(true);
      setCoverFile(null);
      setCoverPreview('');
      setSelectedTracks([]);
      setPlaylistTracks([]);
    }
    setActiveTab(0);
  }, [open, playlist]);

  
  const handleCoverSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const searchTracks = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/music/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching tracks:', error);
      setNotification({
        open: true,
        message: 'Ошибка при поиске треков',
        severity: 'error'
      });
    } finally {
      setIsSearching(false);
    }
  }, []);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      searchTracks(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchTracks]);

  
  const toggleTrackSelection = (track) => {
    setSelectedTracks(prev => {
      const isSelected = prev.some(t => t.id === track.id);
      if (isSelected) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  
  const handleSave = async () => {
    if (!name.trim()) {
      setNotification({
        open: true,
        message: 'Название плейлиста обязательно',
        severity: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_public', isPublic.toString());
    
    if (coverFile) {
      formData.append('cover', coverFile);
    }

    if (!isEditing) {
      
      const trackIds = selectedTracks.map(track => track.id);
      formData.append('track_ids', JSON.stringify(trackIds));
    }

    console.log('Sending playlist data to API:', {
      name,
      description,
      isPublic,
      hasCover: !!coverFile,
      trackCount: !isEditing ? selectedTracks.length : null
    });

    onSave(formData, isEditing ? playlist.id : null);
  };

  
  const handleAddTracks = () => {
    if (selectedTracks.length === 0) {
      setNotification({
        open: true,
        message: 'Выберите треки для добавления',
        severity: 'info'
      });
      return;
    }

    const trackIds = selectedTracks.map(track => track.id);
    onAddTracks(playlist.id, trackIds);
    setSelectedTracks([]);
    setActiveTab(0); 
  };

  
  const handleRemoveTrack = (trackId) => {
    onRemoveTrack(playlist.id, trackId);
  };

  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  
  const isTrackInPlaylist = (trackId) => {
    return playlistTracks.some(track => track.id === trackId);
  };

  
  const isTrackPlaying = (track) => {
    return nowPlaying && nowPlaying.id === track.id;
  };

  return (
    <FullScreenDialog
      open={open}
      onClose={onClose}
      fullScreen={false}
      maxWidth={false}
      fullWidth={false}
    >
      <DialogHeader>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditing ? 'Редактировать плейлист' : 'Создать плейлист'}
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogHeader>

      {isEditing && (
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Плейлист" />
          <Tab label="Добавить треки" />
        </Tabs>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <ScrollableContent>
          {/* Playlist Info Tab */}
          {(!isEditing || activeTab === 0) && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                gap: 3,
                alignItems: 'flex-start'
              }}>
                {/* Cover Upload */}
                <Box sx={{ 
                  width: isMobile ? '100%' : '200px', 
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  {coverPreview ? (
                    <CoverPreview>
                      <img 
                        src={coverPreview} 
                        alt="Playlist cover" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 8, 
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: '#fff',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleCoverSelect}
                        />
                        <AddPhotoAlternateOutlinedIcon />
                      </IconButton>
                    </CoverPreview>
                  ) : (
                    <CoverUploadBox component="label">
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleCoverSelect}
                      />
                      <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                      <Typography variant="body2" align="center">
                        Выберите обложку для плейлиста
                      </Typography>
                    </CoverUploadBox>
                  )}
                </Box>

                {/* Playlist Details */}
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Название плейлиста"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Описание"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={isPublic} 
                        onChange={(e) => setIsPublic(e.target.checked)} 
                        color="primary"
                      />
                    }
                    label="Публичный плейлист"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              {/* Current Playlist Tracks */}
              {isEditing && playlistTracks.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Треки в плейлисте ({playlistTracks.length})
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: theme => theme.breakpoints.down('sm') ? theme.spacing(1) : theme.spacing(2), 
                      overflow: 'hidden',
                      maxHeight: '400px',
                      mx: 1
                    }}
                  >
                    <List sx={{ overflow: 'auto', maxHeight: '100%' }}>
                      {playlistTracks.map((track, index) => {
                        const playing = isTrackPlaying(track);
                        return (
                          <TrackItem 
                            key={track.id} 
                            divider={index !== playlistTracks.length - 1}
                            isPlaying={playing}
                            sx={{
                              '&:hover': {
                                backgroundColor: playing
                                  ? (theme.palette.mode === 'dark' ? 'rgba(208, 188, 255, 0.2)' : 'rgba(208, 188, 255, 0.3)')
                                  : theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.05)' 
                                    : 'rgba(0, 0, 0, 0.03)'
                              }
                            }}
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
                                noWrap: true, 
                                fontWeight: 500, 
                                title: track.title,
                                color: playing ? 'primary' : 'inherit'
                              }}
                              secondaryTypographyProps={{ noWrap: true, title: track.artist }}
                              sx={{ mr: 1 }}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" size="small" onClick={() => handleRemoveTrack(track.id)}>
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </TrackItem>
                        );
                      })}
                    </List>
                  </Paper>
                </Box>
              )}

              {/* Selected Tracks (for new playlist) */}
              {!isEditing && selectedTracks.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Выбранные треки ({selectedTracks.length})
                  </Typography>
                  <Paper variant="outlined" sx={{ 
                    borderRadius: theme => theme.breakpoints.down('sm') ? theme.spacing(1) : theme.spacing(2), 
                    overflow: 'hidden',
                    mx: 1
                  }}>
                    <List sx={{ maxHeight: '200px', overflow: 'auto' }}>
                      {selectedTracks.map((track) => (
                        <TrackItem key={track.id} divider>
                          <ListItemAvatar sx={{ minWidth: 50 }}>
                            <TrackAvatar src={track.cover_path} alt={track.title}>
                              <MusicNoteOutlinedIcon />
                            </TrackAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={track.title}
                            secondary={track.artist}
                            primaryTypographyProps={{ noWrap: true, title: track.title }}
                            secondaryTypographyProps={{ noWrap: true, title: track.artist }}
                            sx={{ mr: 1 }}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" size="small" onClick={() => toggleTrackSelection(track)}>
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </TrackItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              )}

              {/* Track Search for new playlist */}
              {!isEditing && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Добавить треки
                  </Typography>
                  <TrackSearchInput
                    fullWidth
                    placeholder="Поиск треков..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                  />
                  <Paper variant="outlined" sx={{ 
                    borderRadius: theme => theme.breakpoints.down('sm') ? theme.spacing(1) : theme.spacing(2), 
                    overflow: 'hidden',
                    mx: 1
                  }}>
                    {isSearching ? (
                      <List>
                        {[1, 2, 3].map((_, index) => (
                          <ListItem key={index} divider>
                            <ListItemAvatar>
                              <Skeleton variant="rectangular" width={42} height={42} sx={{ borderRadius: 1 }} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={<Skeleton width="70%" />}
                              secondary={<Skeleton width="40%" />}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : searchResults.length > 0 ? (
                      <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                        {searchResults.map((track) => {
                          const isSelected = selectedTracks.some(t => t.id === track.id);
                          
                          return (
                            <TrackItem 
                              key={track.id} 
                              divider
                              selected={isSelected}
                              onClick={() => toggleTrackSelection(track)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <ListItemAvatar>
                                <TrackAvatar src={track.cover_path} alt={track.title}>
                                  <MusicNoteOutlinedIcon />
                                </TrackAvatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={track.title}
                                secondary={track.artist}
                                primaryTypographyProps={{ noWrap: true }}
                                secondaryTypographyProps={{ noWrap: true }}
                              />
                              {isSelected && (
                                <CheckCircleIcon color="primary" sx={{ mr: 2 }} />
                              )}
                            </TrackItem>
                          );
                        })}
                      </List>
                    ) : searchQuery.length > 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">Ничего не найдено</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          Введите запрос для поиска треков
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              )}

              {/* Bottom Actions */}
              {activeTab === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {isEditing && (
                    <ActionButton
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить этот плейлист?')) {
                          onDelete(playlist.id);
                        }
                      }}
                      startIcon={<DeleteIcon />}
                      fullWidth={isMobile}
                    >
                      {isMobile ? (isVeryNarrow ? '' : 'Удал.') : 'Удалить плейлист'}
                    </ActionButton>
                  )}
                  
                  <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
                    <ActionButton
                      variant="outlined"
                      onClick={onClose}
                    >
                      {isMobile ? (isVeryNarrow ? '' : 'Отм.') : 'Отмена'}
                    </ActionButton>
                    <ActionButton
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      startIcon={<SaveIcon />}
                      disabled={!name.trim()}
                    >
                      {isEditing ? 
                        (isMobile ? (isVeryNarrow ? '' : 'Сохр.') : 'Сохранить') : 
                        (isMobile ? (isVeryNarrow ? '' : 'Созд.') : 'Создать')}
                    </ActionButton>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Add Tracks Tab (only for editing) */}
          {isEditing && activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <TrackSearchInput
                fullWidth
                placeholder="Поиск треков для добавления..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />

              {/* Search Results */}
              <Paper variant="outlined" sx={{ 
                borderRadius: theme => theme.breakpoints.down('sm') ? theme.spacing(1) : theme.spacing(2), 
                overflow: 'hidden',
                mx: 1
              }}>
                {isSearching ? (
                  <List>
                    {[1, 2, 3].map((_, index) => (
                      <ListItem key={index} divider>
                        <ListItemAvatar>
                          <Skeleton variant="rectangular" width={42} height={42} sx={{ borderRadius: 1 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Skeleton width="70%" />}
                          secondary={<Skeleton width="40%" />}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : searchResults.length > 0 ? (
                  <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {searchResults.map((track) => {
                      const isSelected = selectedTracks.some(t => t.id === track.id);
                      const inPlaylist = isTrackInPlaylist(track.id);
                      
                      return (
                        <TrackItem 
                          key={track.id} 
                          divider
                          selected={isSelected}
                          onClick={() => !inPlaylist && toggleTrackSelection(track)}
                          sx={{ 
                            cursor: inPlaylist ? 'default' : 'pointer',
                            opacity: inPlaylist ? 0.6 : 1
                          }}
                        >
                          <ListItemAvatar>
                            <TrackAvatar src={track.cover_path} alt={track.title}>
                              <MusicNoteOutlinedIcon />
                            </TrackAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={track.title}
                            secondary={track.artist}
                            primaryTypographyProps={{ noWrap: true }}
                            secondaryTypographyProps={{ noWrap: true }}
                          />
                          {inPlaylist ? (
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                              Уже в плейлисте
                            </Typography>
                          ) : isSelected && (
                            <CheckCircleIcon color="primary" sx={{ mr: 2 }} />
                          )}
                        </TrackItem>
                      );
                    })}
                  </List>
                ) : searchQuery.length > 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">Ничего не найдено</Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Введите запрос для поиска треков
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Selected tracks count */}
              {selectedTracks.length > 0 && (
                <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                  Выбрано треков: {selectedTracks.length}
                </Typography>
              )}

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <ActionButton
                  variant="outlined"
                  onClick={() => {
                    setActiveTab(0);
                    setSelectedTracks([]);
                  }}
                >
                  {isMobile ? (isVeryNarrow ? '' : 'Отм.') : 'Отмена'}
                </ActionButton>
                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={handleAddTracks}
                  startIcon={<PlaylistAddIcon />}
                  disabled={selectedTracks.length === 0}
                >
                  {isMobile ? (isVeryNarrow ? '' : 'Добав.') : 'Добавить выбранные треки'}
                </ActionButton>
              </Box>
            </Box>
          )}
        </ScrollableContent>
      )}

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </FullScreenDialog>
  );
};

export default PlaylistModal; 