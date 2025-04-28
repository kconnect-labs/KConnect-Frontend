import React, { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  InputAdornment,
  Tab,
  Tabs,
  styled,
  alpha
} from '@mui/material';
import { 
  Search, 
  PlayArrow, 
  Pause, 
  Add, 
  Close,
  Check,
  MusicNote
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { motion } from 'framer-motion';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: 'rgba(18, 18, 22, 0.95)',
    backdropFilter: 'blur(30px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    width: '100%',
    maxWidth: 500,
    maxHeight: '80vh',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      borderRadius: 0,
    }
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 'normal',
  minWidth: 100,
  '&.Mui-selected': {
    fontWeight: 'medium',
    color: theme.palette.primary.main
  }
}));

const StyledTrack = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: 8,
  marginBottom: 8,
  backgroundColor: selected 
    ? alpha(theme.palette.primary.main, 0.1)
    : 'rgba(255, 255, 255, 0.03)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: selected 
      ? alpha(theme.palette.primary.main, 0.15)
      : 'rgba(255, 255, 255, 0.05)',
  },
  border: selected 
    ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
    : '1px solid rgba(255, 255, 255, 0.05)',
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 1
    }
  }
}));

/**
 * Music selection dialog component for selecting tracks to attach to posts
 */
const MusicSelectDialog = ({ open, onClose, onSelectTracks, maxTracks = 3 }) => {
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(new Audio());
  const lastSearchQuery = React.useRef('');
  
  // Get tracks from music context
  const { 
    tracks, 
    likedTracks,

    isLoading,
    searchTracks: contextSearchTracks,
  } = useMusic();
  
  // Function to stop playing audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Reset source to release resources
      setIsPlaying(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Debounce search to avoid too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  
  // Search for tracks
  const searchTracksHandler = useCallback(
    debounce(async (query) => {
      if (query.trim()) {
        // Don't search if the query is the same as the last one
        if (query === lastSearchQuery.current) {
          return;
        }
        
        // Save current query
        lastSearchQuery.current = query;
        
        setIsSearching(true);
        try {
          // First try to filter local tracks
          const filteredTracks = tracks.filter(track => 
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase())
          );
          
          // If we have enough results locally, use them
          if (filteredTracks.length >= 5) {
            setSearchResults(filteredTracks);
          } else {
            // Otherwise, search from API
            try {
              const response = await contextSearchTracks(query);
              if (response && Array.isArray(response)) {
                setSearchResults(response);
              } else {
                setSearchResults(filteredTracks); // Fallback to local results
              }
            } catch (error) {
              console.error('Error searching tracks from API:', error);
              setSearchResults(filteredTracks); // Fallback to local results
            }
          }
        } catch (error) {
          console.error('Error searching tracks:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    [tracks, contextSearchTracks]
  );
  
  // Trigger search when query changes
  useEffect(() => {
    searchTracksHandler(searchQuery);
  }, [searchQuery, searchTracksHandler]);
  
  // Handle audio play/pause
  const handleTogglePlay = (track) => {
    if (currentPlayingTrack && currentPlayingTrack.id === track.id) {
      // Toggle play/pause for current track
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.pause();
        
        // Use the file path directly, without adding extra prefix
        let audioSrc = track.file_path;
        // Ensure the path starts with a slash
        if (!audioSrc.startsWith('/')) {
          audioSrc = `/${audioSrc}`;
        }
        
        audioRef.current.src = audioSrc;
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setCurrentPlayingTrack(track);
        setIsPlaying(true);
      }
    }
  };
  
  // Handle track selection
  const handleSelectTrack = (track) => {
    setSelectedTracks(prev => {
      const isAlreadySelected = prev.some(t => t.id === track.id);
      
      if (isAlreadySelected) {
        return prev.filter(t => t.id !== track.id);
      } else {
        if (prev.length >= maxTracks) {
          // If we reached the max, remove the first one and add the new one
          return [...prev.slice(1), track];
        }
        return [...prev, track];
      }
    });
  };
  
  // Handle track selection complete
  const handleComplete = () => {
    stopAudio();
    setCurrentPlayingTrack(null);
    onSelectTracks(selectedTracks);
    onClose();
  };
  
  // Format track duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Get track cover with fallback
  const getCoverWithFallback = (coverPath) => {
    if (!coverPath) return '/uploads/system/album_placeholder.jpg';
    
    // If the path already includes /static/, use it directly
    if (coverPath.startsWith('/static/')) {
      return coverPath;
    }
    
    // Handle paths that don't start with slash
    if (coverPath.startsWith('static/')) {
      return `/${coverPath}`;
    }
    
    // Direct URL paths
    if (coverPath.startsWith('http')) {
      return coverPath;
    }
    
    // Legacy path format - assume it's a relative path in the music directory
    return `/static/music/${coverPath}`;
  };
  
  // Clean up audio on unmount and pause on visibility change
  useEffect(() => {
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAudio();
      }
    };
    
    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up on unmount
    return () => {
      stopAudio();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Additional handler to stop audio when dialog is closed
  const handleClose = () => {
    stopAudio();
    setCurrentPlayingTrack(null);
    onClose();
  };
  
  // Get currently displayed tracks based on tab or search
  const displayedTracks = searchQuery.trim()
    ? searchResults
    : tabValue === 0 ? tracks : likedTracks;
  
  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pt: 3, 
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
          Выберите музыку
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={handleClose}
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ px: 3 }}>
        <SearchInput
          fullWidth
          placeholder="Поиск треков..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => setSearchQuery('')}
                  edge="end"
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
      </Box>
      
      {!searchQuery && (
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <StyledTab label="Все треки" />
          <StyledTab label="Любимые" />
        </Tabs>
      )}
      
      <DialogContent sx={{ py: 2 }}>
        {selectedTracks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Выбрано ({selectedTracks.length}/{maxTracks}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedTracks.map(track => (
                <Chip
                  key={`selected-${track.id}`}
                  label={`${track.title} - ${track.artist}`}
                  onDelete={() => handleSelectTrack(track)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
        
        {isLoading || isSearching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={30} />
          </Box>
        ) : displayedTracks.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 6
          }}>
            <MusicNote sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography color="text.secondary">
              {searchQuery 
                ? 'Ничего не найдено' 
                : tabValue === 0 
                  ? 'Нет доступных треков' 
                  : 'У вас пока нет любимых треков'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {displayedTracks.map((track) => {
              const isSelected = selectedTracks.some(t => t.id === track.id);
              const isCurrentlyPlaying = currentPlayingTrack && currentPlayingTrack.id === track.id;
              
              return (
                <StyledTrack
                  key={track.id}
                  selected={isSelected}
                >
                  <ListItemAvatar>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar 
                        variant="rounded" 
                        sx={{ width: 48, height: 48 }}
                        src={getCoverWithFallback(track.cover_path)}
                      >
                        <MusicNote />
                      </Avatar>
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: 1,
                          transition: 'background 0.2s ease',
                          '&:hover': {
                            background: 'rgba(0,0,0,0.5)',
                          }
                        }}
                      >
                        <IconButton 
                          size="small" 
                          onClick={() => handleTogglePlay(track)}
                          sx={{ 
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.3)'
                            }
                          }}
                        >
                          {isCurrentlyPlaying && isPlaying ? (
                            <Pause fontSize="small" />
                          ) : (
                            <PlayArrow fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={track.title}
                    secondary={`${track.artist} • ${formatDuration(track.duration)}`}
                    primaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true,
                      sx: { 
                        fontWeight: isSelected ? 'medium' : 'normal',
                        color: isSelected ? 'primary.main' : 'text.primary' 
                      }
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      noWrap: true
                    }}
                    sx={{ ml: 1 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="select" 
                      onClick={() => handleSelectTrack(track)}
                      sx={{ color: isSelected ? 'primary.main' : 'text.secondary' }}
                    >
                      {isSelected ? <Check /> : <Add />}
                    </IconButton>
                  </ListItemSecondaryAction>
                </StyledTrack>
              );
            })}
          </List>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          sx={{ 
            textTransform: 'none', 
            color: 'text.secondary',
            borderRadius: 2
          }}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleComplete} 
          variant="contained" 
          color="primary"
          disabled={selectedTracks.length === 0}
          sx={{ 
            textTransform: 'none',
            borderRadius: 2,
            px: 3
          }}
        >
          Прикрепить ({selectedTracks.length})
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default MusicSelectDialog; 