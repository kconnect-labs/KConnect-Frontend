import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Chip,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMusic } from '../../../context/MusicContext';
import apiClient from '../../../services/axiosConfig';
import { 
  PlayArrowRounded,
  PauseRounded,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const AllTracksContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const AllTracksCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  background: 'rgba(0, 0, 0, 0.03)', // Фон 003
  backdropFilter: 'blur(20px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const AllTracksHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    '&.Mui-focused': {
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
  },
}));

const TrackCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: '2px',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
  }
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

const AllTracksBlock = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack,
    toggleLike,
    searchTracks,
    searchResults,
    isSearching
  } = useMusic();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Refs для управления поиском
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const loadTracks = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await apiClient.get(`/api/music?page=${pageNum}&per_page=20`);
      console.log('All tracks response:', response.data);
      
      if (response.data && response.data.tracks) {
        const newTracks = response.data.tracks;
        if (append) {
          setTracks(prev => [...prev, ...newTracks]);
        } else {
          setTracks(newTracks);
        }
        setHasMore(newTracks.length === 20);
      } else {
        setTracks([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load all tracks:', err);
      setError('Не удалось загрузить треки');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Стабильная функция поиска
  const performSearch = useCallback(async (query) => {
    // Отменяем предыдущий запрос если он еще выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Проверяем минимальную длину запроса
    if (!query.trim() || query.trim().length < 2) {
      console.log('[AllTracksBlock] Запрос слишком короткий:', query);
      return;
    }
    
    console.log('[AllTracksBlock] Выполняем поиск для:', query);
    
    // Создаем новый AbortController для этого запроса
    abortControllerRef.current = new AbortController();
    
    try {
      const results = await searchTracks(query);
      console.log('[AllTracksBlock] Результаты поиска:', results);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[AllTracksBlock] Ошибка поиска:', error);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [searchTracks]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      console.log('[AllTracksBlock] Размонтирование - очищаем ресурсы');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTracks(nextPage, true);
    }
  }, [loadingMore, hasMore, page, loadTracks]);

  const handlePlayTrack = useCallback((track) => {
    playTrack(track, 'all');
  }, [playTrack]);

  const handleLikeTrack = useCallback((trackId, event) => {
    event.stopPropagation();
    toggleLike(trackId);
  }, [toggleLike]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    console.log('[AllTracksBlock] Изменение поискового запроса:', query);
    
    // Отменяем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Отменяем активный поиск если запрос слишком короткий
    if (query.trim().length < 2) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }
    
    // Устанавливаем новый таймер для debounce
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 1200); // 1.2 секунды debounce
  };

  const clearSearch = () => {
    console.log('[AllTracksBlock] Очистка поиска');
    setSearchQuery('');
    // Отменяем активный поиск
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Отменяем таймер debounce
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <AllTracksContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress color="primary" />
        </Box>
      </AllTracksContainer>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
        <Button 
          onClick={() => loadTracks()} 
          sx={{ mt: 2 }}
          variant="contained"
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  return (
    <AllTracksContainer>
      <AllTracksCard>
        <CardContent>
          <AllTracksHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LibraryMusicIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {searchQuery.trim() ? 'Результаты поиска' : 'Все треки'}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {searchQuery.trim() ? `${searchResults.length} найдено` : `${tracks.length} треков`}
            </Typography>
          </AllTracksHeader>

          <SearchContainer>
            <StyledSearchField
              fullWidth
              placeholder="Поиск трека или исполнителя..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={clearSearch}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </SearchContainer>
          
          <List sx={{ p: 0 }}>
            {(searchQuery.trim() ? searchResults : tracks).map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isTrackPlaying = isPlaying && isCurrentTrack;

              return (
                <React.Fragment key={track.id}>
                  <TrackCard onClick={() => handlePlayTrack(track)}>
                    <Box
                      component="img"
                      src={track.cover_path || '/default-cover.jpg'}
                      alt={track.title}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0, marginLeft: '8px' }}>
                      <Typography variant="body2" noWrap>
                        {track.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {track.artist}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        isPlaying && currentTrack?.id === track.id ? pauseTrack() : handlePlayTrack(track);
                      }}
                      sx={{ color: '#fff' }}
                    >
                      {isPlaying && currentTrack?.id === track.id ? <PauseRounded /> : <PlayArrowRounded />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleLikeTrack(track.id, e)}
                      sx={{ color: track.is_liked ? '#ff4081' : '#fff' }}
                    >
                      {track.is_liked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </TrackCard>
                  {index < (searchQuery.trim() ? searchResults.length : tracks.length) - 1 && (
                    <Divider sx={{ 
                      mx: 2, 
                      my: 0.5,
                      borderColor: 'rgba(255, 255, 255, 0.05)'
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>

          {searchQuery.trim() && isSearching && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {hasMore && !searchQuery.trim() && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outlined"
                sx={{ 
                  color: '#fff', 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                {loadingMore ? <CircularProgress size={20} /> : 'Загрузить еще'}
              </Button>
            </Box>
          )}
        </CardContent>
      </AllTracksCard>
    </AllTracksContainer>
  );
};

export default AllTracksBlock; 