import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton, 
  Tabs, 
  Tab,
  useTheme,
  CircularProgress,
  Fab,
  Divider,
  useMediaQuery,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  styled,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
  Fade,
  Grow
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  FavoriteBorder,
  Favorite,
  Add,
  MusicNote,
  AccessTime,
  MoreHoriz,
  NavigateNext,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Search,
  ContentCopy,
  Share
} from '@mui/icons-material';
import { useMusic } from '../context/MusicContext';
import { formatDuration } from '../utils/formatters';
import { useContext } from 'react';
import { ThemeSettingsContext } from '../App';
import FullScreenPlayer from '../components/Music/FullScreenPlayer';
import MobilePlayer from '../components/Music/MobilePlayer';
import MusicUploadDialog from '../components/Music/MusicUploadDialog';
import { getCoverWithFallback } from '../utils/imageUtils';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';


const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};


const DarkPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(18, 18, 18, 0.6)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(3),
}));

const PlaylistCover = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const PlaylistCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(25, 25, 25, 0.6)',
  backdropFilter: 'blur(10px)',
  borderRadius: 12,
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.25)',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'normal',
  fontSize: '0.9rem',
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: 'white',
    fontWeight: 'medium',
  }
}));

const HeaderButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 30,
  textTransform: 'none',
  padding: theme.spacing(0.8, 2.5),
  color: 'white',
  fontWeight: 'medium',
  fontSize: '0.95rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  }
}));

const SearchInput = styled(Box)(({ theme, expanded }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 30,
  padding: theme.spacing(0.8, 2),
  display: 'flex',
  alignItems: 'center',
  width: expanded ? '100%' : '100%',
  maxWidth: expanded ? '100%' : 300,
  color: 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    maxWidth: expanded ? '100%' : 160,
  }
}));


const MusicPage = React.memo(() => {
  const [tabValue, setTabValue] = useState(0);
  const [fullScreenPlayerOpen, setFullScreenPlayerOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mainTab, setMainTab] = useState(0); 
  const [playlists, setPlaylists] = useState([]); 
  const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(false); 
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false); 
  const [playlistTracksDialogOpen, setPlaylistTracksDialogOpen] = useState(false); 
  
  const [localLoading, setLocalLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { themeSettings } = useContext(ThemeSettingsContext);
  const searchInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  
  const musicContext = useMusic();
  const { 
    tracks, 
    likedTracks, 
    newTracks, 
    randomTracks, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    isLoading,
    searchResults,
    isSearching,
    searchTracks,
    setCurrentSection,
    playTrack,
    likeTrack,
    setRandomTracks
  } = musicContext;

  
  const loadMoreTracks = musicContext.loadMoreTracks || (async () => console.warn('loadMoreTracks not implemented'));
  const [hasMoreTracks, setHasMoreTracks] = useState(musicContext.hasMoreTracks || false);

  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const prevTabValue = useRef(tabValue);
  
  
  useEffect(() => {
    
    if (typeof setCurrentSection === 'function') {
      console.log('Инициализация страницы музыки, устанавливаем секцию "liked"');
      setCurrentSection('liked');
      
      
      if (!likedTracks || likedTracks.length === 0) {
        if (musicContext.resetPagination) {
          console.log('Сбрасываем пагинацию для секции "liked" при первой загрузке');
          musicContext.resetPagination('liked');
        }
      }
    }
  }, []);

  
  const fetchUserPlaylists = useCallback(async () => {
    try {
      setIsPlaylistsLoading(true);
      const response = await axios.get('/api/playlists');
      if (response.data.success) {
        setPlaylists(response.data.playlists);
      } else {
        console.error('Ошибка при получении плейлистов:', response.data.error);
      }
    } catch (error) {
      console.error('Ошибка при получении плейлистов:', error);
    } finally {
      setIsPlaylistsLoading(false);
    }
  }, []);

  
  useEffect(() => {
    if (mainTab === 1) {
      fetchUserPlaylists();
    }
  }, [mainTab, fetchUserPlaylists]);

  
  const createPlaylist = async (playlistData) => {
    try {
      const formData = new FormData();
      for (const key in playlistData) {
        if (key === 'cover_image' && playlistData[key] instanceof File) {
          formData.append(key, playlistData[key]);
        } else if (key === 'track_ids' && Array.isArray(playlistData[key])) {
          formData.append(key, JSON.stringify(playlistData[key]));
        } else {
          formData.append(key, playlistData[key]);
        }
      }

      const response = await axios.post('/api/playlists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        
        fetchUserPlaylists();
        setSnackbar({
          open: true,
          message: 'Плейлист успешно создан',
          severity: 'success'
        });
        return true;
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Ошибка при создании плейлиста',
          severity: 'error'
        });
        return false;
      }
    } catch (error) {
      console.error('Ошибка при создании плейлиста:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при создании плейлиста',
        severity: 'error'
      });
      return false;
    }
  };

  
  const updatePlaylist = async (playlistId, playlistData) => {
    try {
      const formData = new FormData();
      for (const key in playlistData) {
        if (key === 'cover_image' && playlistData[key] instanceof File) {
          formData.append(key, playlistData[key]);
        } else {
          formData.append(key, playlistData[key]);
        }
      }

      const response = await axios.put(`/api/playlists/${playlistId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        
        fetchUserPlaylists();
        setSnackbar({
          open: true,
          message: 'Плейлист успешно обновлен',
          severity: 'success'
        });
        return true;
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Ошибка при обновлении плейлиста',
          severity: 'error'
        });
        return false;
      }
    } catch (error) {
      console.error('Ошибка при обновлении плейлиста:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при обновлении плейлиста',
        severity: 'error'
      });
      return false;
    }
  };

  
  const deletePlaylist = async (playlistId) => {
    try {
      const response = await axios.delete(`/api/playlists/${playlistId}`);

      if (response.data.success) {
        
        fetchUserPlaylists();
        setSnackbar({
          open: true,
          message: 'Плейлист успешно удален',
          severity: 'success'
        });
        return true;
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Ошибка при удалении плейлиста',
          severity: 'error'
        });
        return false;
      }
    } catch (error) {
      console.error('Ошибка при удалении плейлиста:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении плейлиста',
        severity: 'error'
      });
      return false;
    }
  };

  
  const addTrackToPlaylist = async (playlistId, trackId) => {
    try {
      const response = await axios.post(`/api/playlists/${playlistId}/tracks`, {
        track_id: trackId
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Трек добавлен в плейлист',
          severity: 'success'
        });
        return true;
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Ошибка при добавлении трека в плейлист',
          severity: 'error'
        });
        return false;
      }
    } catch (error) {
      console.error('Ошибка при добавлении трека в плейлист:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при добавлении трека в плейлист',
        severity: 'error'
      });
      return false;
    }
  };

  
  const removeTrackFromPlaylist = async (playlistId, trackId) => {
    try {
      const response = await axios.delete(`/api/playlists/${playlistId}/tracks/${trackId}`);

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Трек удален из плейлиста',
          severity: 'success'
        });
        return true;
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Ошибка при удалении трека из плейлиста',
          severity: 'error'
        });
        return false;
      }
    } catch (error) {
      console.error('Ошибка при удалении трека из плейлиста:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении трека из плейлиста',
        severity: 'error'
      });
      return false;
    }
  };

  
  const playPlaylist = useCallback(async (playlistId) => {
    try {
      const response = await axios.get(`/api/playlists/${playlistId}`);
      
      if (response.data.success && response.data.playlist.tracks.length > 0) {
        
        const playlistSection = `playlist_${playlistId}`;
        setCurrentSection(playlistSection);
        
        
        const firstTrack = response.data.playlist.tracks[0];
        playTrack(firstTrack, playlistSection);
        
        
        if (typeof musicContext.setPlaylistTracks === 'function') {
          musicContext.setPlaylistTracks(response.data.playlist.tracks, playlistSection);
        }
        
        return true;
      } else {
        setSnackbar({
          open: true,
          message: 'В плейлисте нет треков',
          severity: 'info'
        });
        return false;
      }
    } catch (error) {
      console.error('Ошибка при воспроизведении плейлиста:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при воспроизведении плейлиста',
        severity: 'error'
      });
      return false;
    }
  }, [playTrack, setCurrentSection, musicContext]);

  
  const handleTabChange = useCallback((event, newValue) => {
    
    const oldValue = tabValue;
    
    
    setTabValue(newValue);
    
    
    if (oldValue !== newValue) {
      console.log(`Переключение вкладки с ${oldValue} на ${newValue}`);
      
      
      window.scrollTo(0, 0);
      
      
      if (searchQuery) {
        setSearchQuery('');
        if (searchInputRef.current) {
          searchInputRef.current.value = '';
        }
      }
      
      
      const tabToType = {
        0: 'liked',
        1: 'all',
        2: 'random'
      };
      
      const newType = tabToType[newValue] || 'all';
      
      
      setLocalLoading(true);
      
      
      console.log("Текущее состояние треков:");
      console.log(`- liked: ${likedTracks ? likedTracks.length : 0} треков`);
      console.log(`- all: ${tracks ? tracks.length : 0} треков`);
      console.log(`- random: ${randomTracks ? randomTracks.length : 0} треков`);
      
      
      if (musicContext.resetPagination) {
        console.log(`Сбрасываем пагинацию для типа ${newType}`);
        musicContext.resetPagination(newType);
      }
      
      
      if (musicContext.setCurrentSection) {
        console.log(`Устанавливаем секцию ${newType} в контексте`);
        musicContext.setCurrentSection(newType);
      }
      
      
      if (newType === 'random' && randomTracks && randomTracks.length > 0) {
        
        const reshuffledTracks = [...randomTracks].sort(() => Math.random() - 0.5);
        
        if (typeof musicContext.setRandomTracks === 'function') {
          musicContext.setRandomTracks(reshuffledTracks);
        }
      }
      
      
      setTimeout(() => {
        setLocalLoading(false);
      }, 800);
    }
  }, [tabValue, searchQuery, musicContext.resetPagination, musicContext.setCurrentSection, 
      likedTracks, randomTracks, tracks, musicContext.setRandomTracks, setLocalLoading]);

  const handleTrackClick = useCallback((track) => {
    playTrack(track);
  }, [playTrack]);

  const handleOpenFullScreenPlayer = useCallback(() => {
    setFullScreenPlayerOpen(true);
  }, []);

  const handleCloseFullScreenPlayer = useCallback(() => {
    setFullScreenPlayerOpen(false);
    
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }, []);

  const handleOpenUploadDialog = useCallback(() => {
    setUploadDialogOpen(true);
  }, []);

  const handleCloseUploadDialog = useCallback(() => {
    setUploadDialogOpen(false);
  }, []);

  
  const handleMainTabChange = useCallback((event, newValue) => {
    setMainTab(newValue);
  }, []);

  
  const handleOpenPlaylistDialog = useCallback((playlist = null) => {
    setSelectedPlaylist(playlist);
    setPlaylistDialogOpen(true);
  }, []);

  
  const handleClosePlaylistDialog = useCallback(() => {
    setSelectedPlaylist(null);
    setPlaylistDialogOpen(false);
  }, []);

  
  const handleOpenPlaylistTracksDialog = useCallback((playlist) => {
    setSelectedPlaylist(playlist);
    setPlaylistTracksDialogOpen(true);
  }, []);

  
  const handleClosePlaylistTracksDialog = useCallback(() => {
    setSelectedPlaylist(null);
    setPlaylistTracksDialogOpen(false);
  }, []);

  
  
  const currentTracks = useMemo(() => {
    if (tabValue === 0) return likedTracks;
    if (tabValue === 2) return randomTracks;
    return tracks;
  }, [tabValue, tracks, likedTracks, randomTracks]);

  
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        searchTracks(query);
      }
    }, 500),
    [searchTracks]
  );

  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    
    if (!query.trim()) {
      
      clearSearch();
      return;
    }
    
    
    debouncedSearch(query);
  };
  
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };
  
  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    
    
    const tabToType = {
      0: 'liked',
      1: 'all',
      2: 'random'
    };
    
    
    const currentType = tabToType[tabValue] || 'all';
    
    
    if (musicContext.resetPagination) {
      musicContext.resetPagination(currentType);
    }
    
    console.log('Поисковый запрос очищен');
  };

  
  const displayedTracks = useMemo(() => {
    return searchQuery.trim() ? searchResults : currentTracks;
  }, [searchQuery, searchResults, currentTracks]);

  
  const effectiveLoading = useMemo(() => {
    return isLoading || localLoading;
  }, [isLoading, localLoading]);

  
  useEffect(() => {
    
    if (typeof loadMoreTracks !== 'function') {
      console.warn('Infinite scroll functionality requires loadMoreTracks function');
      return;
    }

    
    const tabToType = {
      0: 'liked',
      1: 'all',
      2: 'random'
    };
    
    
    const currentType = tabToType[tabValue] || 'all';
    
    
    const currentHasMore = typeof musicContext.hasMoreByType === 'object' 
      ? musicContext.hasMoreByType[currentType] !== false 
      : hasMoreTracks;

    console.log(`Настройка бесконечного скролла для вкладки ${tabValue}, тип: ${currentType}, есть еще треки: ${currentHasMore}`);

    
    let isLoadingData = false;

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        
        
        if (entry.isIntersecting && !isLoadingMore && !isLoadingData && !effectiveLoading && currentHasMore) {
          setIsLoadingMore(true);
          isLoadingData = true;
          
          try {
            console.log(`Загружаем треки для вкладки ${tabValue}, тип: ${currentType}`);
            const result = await loadMoreTracks(currentType);
            
            
            if (result === false) {
              console.log(`Больше нет треков для типа: ${currentType}`);
              setHasMoreTracks(false);
            }
          } catch (error) {
            console.error('Ошибка при загрузке треков:', error);
            setHasMoreTracks(false);
          } finally {
            setIsLoadingMore(false);
            isLoadingData = false;
          }
        }
      },
      { threshold: 0.2 } 
    );

    
    if (loaderRef.current && currentHasMore && !effectiveLoading) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMoreTracks, isLoadingMore, loadMoreTracks, tabValue, musicContext.hasMoreByType, effectiveLoading]);

  
  useEffect(() => {
    if (prevTabValue.current !== tabValue) {
      prevTabValue.current = tabValue;
      
      
      window.scrollTo(0, 0);
      
      
      const tabToType = {
        0: 'liked',
        1: 'all',
        2: 'random'
      };
      
      
      const currentType = tabToType[tabValue] || 'all';
      
      
      if (searchQuery) {
        setSearchQuery('');
      }
      
      
      if (musicContext.resetPagination) {
        musicContext.resetPagination(currentType);
      }
      
      
      if (musicContext.setCurrentSection) {
        musicContext.setCurrentSection(currentType);
      }
      
      console.log(`Переключение на вкладку ${tabValue}, тип: ${currentType}`);
      
      
      if (typeof musicContext.hasMoreByType === 'object') {
        const hasMore = musicContext.hasMoreByType[currentType];
        setHasMoreTracks(hasMore !== false);
      }
    }
  }, [tabValue, musicContext.hasMoreByType, musicContext.resetPagination, musicContext.setCurrentSection, searchQuery]);

  
  const getSectionData = () => {
    const coverTypes = ['liked', 'all', 'random'];
    const type = coverTypes[tabValue] || 'all';
    
    switch(tabValue) {
      case 0:
        return {
          title: "Мне нравится",
          subtitle: "Ваши любимые треки",
          type: "playlist",
          cover: getCoverWithFallback("/uploads/system/like_playlist.jpg", "liked"),
          tracks: likedTracks
        };
      case 1: 
        return {
          title: "Все треки",
          subtitle: "Полная коллекция музыки",
          type: "collection",
          cover: getCoverWithFallback("/uploads/system/new_tracks.jpg", "all"),
          tracks: tracks
        };
      case 2:
        return {
          title: "Случайные",
          subtitle: "Открывайте новое в своей коллекции",
          type: "radio",
          cover: getCoverWithFallback("/uploads/system/random_tracks.jpg", "random"),
          tracks: randomTracks
        };
      default:
        return {
          title: "Музыка",
          subtitle: "",
          type: "collection",
          cover: getCoverWithFallback("/uploads/system/album_placeholder.jpg", "album"),
          tracks: []
        };
    }
  };
  
  const sectionData = getSectionData();

  
  useEffect(() => {
    return () => {
      
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  
  const copyTrackLink = (track, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    const trackLink = `${window.location.origin}/music?track=${track.id}`;
    navigator.clipboard.writeText(trackLink)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Ссылка на трек скопирована в буфер обмена',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
        setSnackbar({
          open: true,
          message: 'Не удалось скопировать ссылку',
          severity: 'error'
        });
      });
    
    
    handleCloseContextMenu();
  };
  
  
  const shareTrack = (track, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    
    copyTrackLink(track);
    
    
    handleCloseContextMenu();
  };
  
  
  const handleContextMenu = (event, track) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedTrack(track);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  
  
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };
  
  
  useEffect(() => {
    const trackId = searchParams.get('track');
    if (trackId) {
      
      const playTrackFromUrl = async () => {
        try {
          
          const response = await fetch(`/api/music/${trackId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch track');
          }
          
          const data = await response.json();
          if (data.success && data.track) {
            console.log('Playing track from URL parameter:', data.track);
            
            playTrack(data.track);
            
            setFullScreenPlayerOpen(true);
          }
        } catch (error) {
          console.error('Error playing track from URL:', error);
        }
      };
      
      playTrackFromUrl();
    }
  }, [searchParams]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: { xs: 10, md: 14 }, px: { xs: 1, md: 3 } }}>
      {}
      {currentTrack ? (
        <SEO
          title={`${currentTrack.title} - ${currentTrack.artist || 'Неизвестный исполнитель'}`}
          description={`Слушайте ${currentTrack.title} от ${currentTrack.artist || 'Неизвестный исполнитель'} на K-Connect`}
          image={currentTrack.cover || '/static/images/music_placeholder.jpg'}
          type="music"
          meta={{
            song: currentTrack.title,
            artist: currentTrack.artist,
            album: currentTrack.album
          }}
        />
      ) : selectedPlaylist ? (
        <SEO
          title={`Плейлист: ${selectedPlaylist.title}`}
          description={selectedPlaylist.description || `Плейлист ${selectedPlaylist.title} на K-Connect`}
          image={selectedPlaylist.cover || '/static/images/playlist_placeholder.jpg'}
          type="music.playlist"
        />
      ) : (
        <SEO
          title="Музыка | K-Connect"
          description="Слушайте музыку, создавайте плейлисты и делитесь любимыми треками на K-Connect"
          type="website"
        />
      )}
      
      {}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        <Box sx={{ width: '40px' }}></Box> {}
        
        <SearchInput expanded={isSearchFocused}>
          <Search sx={{ fontSize: 20, mr: 1 }} />
          <input
            ref={searchInputRef}
            placeholder="Поиск трека"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              width: '100%',
              fontSize: '14px'
            }}
          />
          {searchQuery && (
            <IconButton 
              size="small" 
              onClick={clearSearch}
              sx={{ color: 'rgba(255, 255, 255, 0.7)', p: 0.5 }}
            >
              <Box sx={{ fontSize: 18, fontWeight: 'bold' }}>×</Box>
            </IconButton>
          )}
        </SearchInput>
        
        {!isSearchFocused && (
          <Fab 
            size="small" 
            color="primary" 
            aria-label="add"
            onClick={handleOpenUploadDialog}
          >
            <Add />
          </Fab>
        )}
      </Box>
      
      {}
      {!searchQuery && (
        <DarkPaper elevation={0}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' } }}>
            <PlaylistCover sx={{ width: { xs: 160, md: 200 }, mr: { xs: 0, md: 4 }, mb: { xs: 2, md: 0 } }}>
              <img 
                src={sectionData.cover}
                alt={sectionData.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </PlaylistCover>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {sectionData.type === "playlist" ? "Плейлист" : 
                 sectionData.type === "radio" ? "Радио" : "Коллекция"}
              </Typography>
              
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
                {sectionData.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {sectionData.subtitle}
              </Typography>
              
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                <HeaderButton 
                  variant="contained" 
                  startIcon={<PlayArrow />}
                  onClick={() => {
                    if (sectionData.tracks.length > 0) {
                      playTrack(sectionData.tracks[0]);
                    }
                  }}
                >
                  Слушать
                </HeaderButton>
                
                <IconButton sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <MoreHoriz />
                </IconButton>
                
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {sectionData.tracks.length} {
                    sectionData.tracks.length === 1 ? 'трек' : 
                    sectionData.tracks.length > 1 && sectionData.tracks.length < 5 ? 'трека' : 'треков'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
        </DarkPaper>
      )}
      
      {}
      {!searchQuery && (
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <StyledTab label="Мне нравится" />
            <StyledTab label="Все треки" />
            <StyledTab label="Случайные" />
          </Tabs>
        </Box>
      )}
      
      {}
      {searchQuery && (
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Результаты поиска
          </Typography>
          {searchResults.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Найдено по запросу "{searchQuery}": {searchResults.length} {
                searchResults.length === 1 ? 'трек' : 
                searchResults.length > 1 && searchResults.length < 5 ? 'трека' : 'треков'
              }
            </Typography>
          )}
        </Box>
      )}
      
      {}
      <Box sx={{ mb: 4 }}>
        {isLoading || isSearching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <List sx={{ py: 0 }}>
              {displayedTracks.length > 0 ? (
                displayedTracks.map((track, index) => (
                  <Grow
                    key={track.id}
                    in={true}
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={300 + index % 10 * 50} 
                  >
                    <ListItem 
                      sx={{
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        backgroundColor: currentTrack && currentTrack.id === track.id 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'transparent',
                        cursor: 'pointer',
                        mb: 0.5,
                        transition: 'all 0.2s ease-in-out', 
                        transform: 'translateY(0)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          transform: 'translateY(-2px)', 
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                        }
                      }}
                      onClick={() => handleTrackClick(track)}
                      onContextMenu={(e) => handleContextMenu(e, track)}
                      disableGutters
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          width: '100%',
                          alignItems: 'center'
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            minWidth: 32,
                            mr: 2,
                            color: 'text.secondary',
                          }}
                        >
                          {currentTrack && currentTrack.id === track.id && isPlaying ? (
                            <Pause fontSize="small" sx={{ color: 'primary.main' }} />
                          ) : currentTrack && currentTrack.id === track.id ? (
                            <PlayArrow fontSize="small" sx={{ color: 'primary.main' }} />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {index + 1}
                            </Typography>
                          )}
                        </Box>
                        
                        <Avatar
                          variant="rounded"
                          src={getCoverWithFallback(track.cover_path, "album")}
                          alt={track.title}
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: 1, 
                            mr: 2,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)' 
                            }
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body2"
                            noWrap
                            color={currentTrack && currentTrack.id === track.id ? 'primary.main' : 'text.primary'}
                          >
                            {track.title}
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {track.artist}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            {formatDuration(track.duration)}
                          </Typography>
                          
                          <Tooltip title="Копировать ссылку">
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyTrackLink(track, e);
                              }}
                              sx={{ color: 'text.secondary', mr: 1 }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              likeTrack(track.id);
                            }}
                            sx={{ color: track.is_liked ? 'error.main' : 'text.secondary' }}
                          >
                            {track.is_liked ? (
                              <Favorite fontSize="small" />
                            ) : (
                              <FavoriteBorder fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                    </ListItem>
                  </Grow>
                ))
              ) : searchQuery ? (
                <Fade in={true} timeout={500}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '100%',
                    py: 6
                  }}>
                    <Search sx={{ fontSize: 42, color: 'text.secondary', opacity: 0.5, mb: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Ничего не найдено по запросу "{searchQuery}"
                    </Typography>
                  </Box>
                </Fade>
              ) : (
                <Fade in={true} timeout={500}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '100%',
                    py: 6
                  }}>
                    <MusicNote sx={{ fontSize: 42, color: 'text.secondary', opacity: 0.5, mb: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {tabValue === 0 ? 'У вас пока нет понравившихся треков' : 
                      tabValue === 2 ? 'Нет случайных треков' : 'Нет доступных треков'}
                    </Typography>
                    {tabValue === 1 && (
                      <Box sx={{ mt: 1.5 }}>
                        <Fab 
                          size="small"
                          color="primary"
                          onClick={handleOpenUploadDialog}
                          sx={{ mr: 1 }}
                        >
                          <Add />
                        </Fab>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Загрузите ваши первые треки
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Fade>
              )}
            </List>
            
            {}
            {!searchQuery && hasMoreTracks && (
              <Box 
                ref={loaderRef} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  py: 2 
                }}
              >
                {isLoadingMore ? (
                  <Fade in={true} timeout={300}>
                    <CircularProgress size={24} sx={{ color: 'primary.main', opacity: 0.7 }} />
                  </Fade>
                ) : (
                  <Fade in={true} timeout={300}>
                    <Typography variant="caption" color="text.secondary">
                      Прокрутите вниз для загрузки
                    </Typography>
                  </Fade>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
      
      {}
      {!searchQuery && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Мои плейлисты
            </Typography>
            <Button 
              endIcon={<NavigateNext />} 
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Показать все
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {playlists.map((playlist) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={playlist.id}>
                <PlaylistCard>
                  <CardMedia
                    component="img"
                    height={playlist.id === 1 ? 130 : 160}
                    image={getCoverWithFallback(playlist.cover, "playlist")}
                    alt={playlist.title}
                    sx={{
                      opacity: playlist.id === 1 ? 0.7 : 1,
                    }}
                  />
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="body2" noWrap>
                      {playlist.title}
                    </Typography>
                    {playlist.id !== 1 && (
                      <Typography variant="caption" color="text.secondary">
                        {playlist.tracks.length} {playlist.tracks.length === 1 ? 'трек' : 
                        playlist.tracks.length > 1 && playlist.tracks.length < 5 ? 'трека' : 'треков'}
                      </Typography>
                    )}
                  </CardContent>
                </PlaylistCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {}
      {isMobile && <MobilePlayer />}
      
      {}
      <FullScreenPlayer 
        open={fullScreenPlayerOpen} 
        onClose={handleCloseFullScreenPlayer} 
      />

      {}
      <MusicUploadDialog 
        open={uploadDialogOpen} 
        onClose={handleCloseUploadDialog} 
        onSuccess={() => {}} 
      />

      {}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {selectedTrack && (
          <>
            <MenuItem onClick={() => handleTrackClick(selectedTrack)}>
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <PlayArrow fontSize="small" />
              </ListItemAvatar>
              <ListItemText primary="Воспроизвести" />
            </MenuItem>
            <MenuItem onClick={(e) => copyTrackLink(selectedTrack, e)}>
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <ContentCopy fontSize="small" />
              </ListItemAvatar>
              <ListItemText primary="Копировать ссылку" />
            </MenuItem>
            <MenuItem onClick={(e) => shareTrack(selectedTrack, e)}>
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <Share fontSize="small" />
              </ListItemAvatar>
              <ListItemText primary="Поделиться" />
            </MenuItem>
            <MenuItem onClick={(e) => {
              e.stopPropagation();
              likeTrack(selectedTrack.id);
              handleCloseContextMenu();
            }}>
              <ListItemAvatar sx={{ minWidth: 36 }}>
                {selectedTrack.is_liked ? (
                  <Favorite fontSize="small" color="error" />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
              </ListItemAvatar>
              <ListItemText primary={selectedTrack.is_liked ? "Убрать из понравившихся" : "Добавить в понравившиеся"} />
            </MenuItem>
          </>
        )}
      </Menu>
      
      {}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
});

export default MusicPage; 