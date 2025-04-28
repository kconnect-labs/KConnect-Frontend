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
  Grow,
  SwipeableDrawer,
  BottomNavigation,
  BottomNavigationAction,
  Slide,
  Zoom
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
  Share,
  Home,
  LibraryMusic,
  Shuffle,
  QueueMusic,
  Refresh,
  ArrowBack,
  Upload,
  Download,
  KeyboardArrowUp
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { useContext } from 'react';
import { ThemeSettingsContext } from '../../App';
import FullScreenPlayer from '../../components/Music/FullScreenPlayer';
import MobilePlayer from '../../components/Music/MobilePlayer';
import MusicUploadDialog from '../../components/Music/MusicUploadDialog';
import { getCoverWithFallback } from '../../utils/imageUtils';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO';

// Custom debounce implementation
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

// Новые стилизованные компоненты для улучшенного UI
const MusicPageContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(14),
  padding: theme.spacing(0, 1),
  [theme.breakpoints.up('md')]: {
    marginBottom: theme.spacing(16),
    padding: theme.spacing(0, 3),
  }
}));

const CategoryCard = styled(Card)(({ theme, active }) => ({
  cursor: 'pointer',
  height: '100%',
  background: active ? 
    'linear-gradient(135deg, rgba(208, 188, 255, 0.6) 0%, rgba(208, 188, 255, 0.3) 100%)' : 
    'linear-gradient(135deg, rgba(25,25,25,0.7) 0%, rgba(15,15,15,0.7) 100%)',
  backdropFilter: 'blur(8px)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  transform: active ? 'scale(1.02)' : 'scale(1)',
  boxShadow: active ? 
    '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : 
    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  border: active ? `1px solid rgb(208, 188, 255)` : '1px solid rgba(255,255,255,0.05)',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    border: `1px solid rgba(208, 188, 255, 0.3)`,
  }
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'linear-gradient(45deg, rgba(208, 188, 255, 0.2) 0%, rgba(25,25,25,0.2) 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  marginBottom: theme.spacing(1.5),
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  '& svg': {
    fontSize: 28,
  }
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(9),
  right: theme.spacing(2),
  zIndex: 5,
  [theme.breakpoints.up('md')]: {
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  }
}));

const SearchContainer = styled(Box)(({ theme, open }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 5,
  width: '100%',
  padding: open ? theme.spacing(2, 1) : theme.spacing(2, 2, 1),
  backdropFilter: 'blur(10px)',
  backgroundColor: open ? 'rgba(18,18,18,0.9)' : 'rgba(18,18,18,0.6)',
  transition: 'all 0.3s ease',
  borderRadius: open ? 0 : '0 0 16px 16px',
  boxShadow: open ? 'none' : '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledSearchInput = styled(Box)(({ theme, focused }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  borderRadius: 24,
  backgroundColor: focused ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  boxShadow: focused ? '0 0 0 2px rgba(55,120,255,0.4)' : 'none',
  '& input': {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'white',
    fontSize: '14px',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.5)',
    }
  }
}));

const TrackItem = styled(ListItem)(({ theme, active }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: 8,
  cursor: 'pointer',
  marginBottom: 8,
  backgroundColor: active ? 'rgba(208, 188, 255, 0.1)' : 'transparent',
  transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
  border: active ? '1px solid rgba(208, 188, 255, 0.2)' : '1px solid transparent',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  }
}));

const PlaylistTile = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: 'rgba(25,25,25,0.6)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
  }
}));

const MobileNavigation = styled(BottomNavigation)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  height: 65,
  backgroundColor: 'rgba(18,18,18,0.95)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(255,255,255,0.05)',
}));

// Header component with stylized appearance
const HeaderPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(30,30,30,0.7) 0%, rgba(10,10,10,0.7) 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.05)',
}));

// Cover art component with enhanced styling
const CoverArtContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  aspectRatio: '1/1',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%)',
    pointerEvents: 'none'
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  }
}));

// Enhanced Action Button
const ActionButton = styled(Button)(({ theme, color = 'primary' }) => ({
  borderRadius: 30,
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 500,
  letterSpacing: 0.5,
  backgroundColor: color === 'primary' ? 
    theme.palette.primary.main : 'rgba(255,255,255,0.1)',
  color: color === 'primary' ? '#fff' : 'rgba(255,255,255,0.9)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: color === 'primary' ? 
      theme.palette.primary.dark : 'rgba(255,255,255,0.2)',
    transform: 'translateY(-2px)',
    boxShadow: color === 'primary' ? 
      '0 4px 12px rgba(55,120,255,0.4)' : '0 4px 10px rgba(0,0,0,0.2)',
  }
}));

// Дополнительные стили для RecentTracksCard
const RecentTracksCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  backgroundColor: 'rgba(18,18,18,0.6)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
  }
}));

const CompactTrackItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: 8,
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
}));

const MobileSearchContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  width: '100%',
  height: 64, // Такая же высота как у Header
  padding: theme.spacing(0, 1.5),
  background: 'rgba(18,18,18,0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  display: 'flex',
  alignItems: 'center'
}));

// Добавляем новые стилизованные компоненты для минималистичного дизайна в стиле Яндекс.Музыка
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(4),
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#121212',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  }
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 400,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const ChartTrackItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.03)',
  }
}));

const ChartPosition = styled(Box)(({ theme }) => ({
  width: 36,
  textAlign: 'center',
  fontWeight: 700,
  fontSize: '0.95rem',
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(1),
}));

const ChartCover = styled(Box)(({ theme }) => ({
  width: 42,
  height: 42,
  borderRadius: 4,
  overflow: 'hidden',
  marginRight: theme.spacing(2),
  flexShrink: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
}));

const ChartInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'hidden',
}));

const ChartTrackTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.9rem',
  marginBottom: 2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const ChartTrackArtist = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const ChartStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
  '& svg': {
    fontSize: '0.9rem',
    marginRight: 4,
  }
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const MusicCategoryGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

// Музыкальная страница
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
  const [viewMode, setViewMode] = useState('categories'); // 'categories', 'tracks', 'playlist'
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  // Добавляем состояние для чартов
  const [charts, setCharts] = useState({
    trending: [],
    most_played: [],
    most_liked: [],
    new_releases: []
  });
  const [chartsLoading, setChartsLoading] = useState(true);
  // Add state to track recently liked tracks for immediate animation
  // const [recentlyLikedTracks, setRecentlyLikedTracks] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { themeSettings } = useContext(ThemeSettingsContext);
  const searchInputRef = useRef(null);
  const headerRef = useRef(null);
  const pageRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track context menu
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  // Snackbar for copy notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Музыкальный контекст
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
    setRandomTracks,
    setTracks
  } = musicContext;

  // Дополнительная поддержка для старых версий контекста
  const loadMoreTracks = musicContext.loadMoreTracks || (async () => console.warn('loadMoreTracks not implemented'));
  const [hasMoreTracks, setHasMoreTracks] = useState(musicContext.hasMoreTracks || false);

  // Бесконечная прокрутка
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const prevTabValue = useRef(tabValue);
  
  // Настраиваем уведомление о плейлистах
  const [playlistBannerOpen, setPlaylistBannerOpen] = useState(true);
  
  // Обработчик скролла страницы
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Показываем/скрываем кнопку возврата наверх
      if (scrollTop > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
      
      // Управление видимостью навигации на мобильных
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setIsMobileNavVisible(false);
      } else {
        setIsMobileNavVisible(true);
      }
      
      setLastScrollTop(scrollTop);
      
      // Эффект скролла для хедера
      if (scrollTop > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);
  
  // При первом рендере устанавливаем категорию "liked" и загружаем нужные треки
  useEffect(() => {
    // Function to load initial data
    const loadInitialData = async () => {
      if (typeof setCurrentSection === 'function') {
        console.log('Инициализация страницы музыки');
        
        // Принудительно загружаем все треки при открытии страницы (вне зависимости от наличия)
        try {
          console.log('Загрузка всех треков при открытии страницы музыки');
          // Устанавливаем секцию на all и добавляем параметр random=true для получения случайного порядка
          setCurrentSection('all');
          if (musicContext.resetPagination) {
            // Добавляем параметр для получения случайного порядка
            await musicContext.resetPagination('all', true);
            console.log('Все треки загружены успешно в случайном порядке');
          }
        } catch (error) {
          console.error('Ошибка при загрузке треков:', error);
        }
        
        // Затем устанавливаем секцию liked (как активную по умолчанию)
        console.log('Устанавливаем секцию "liked"');
        setCurrentSection('liked');
        
        // Force load liked tracks
        try {
          console.log('Загрузка лайкнутых треков при открытии страницы музыки');
          if (musicContext.resetPagination) {
            await musicContext.resetPagination('liked');
            console.log('Лайкнутые треки загружены успешно');
          }
        } catch (error) {
          console.error('Ошибка при загрузке лайкнутых треков:', error);
        }
      }
      
      // Restore state from URL params
      const mode = searchParams.get('mode');
      const tab = searchParams.get('tab');
      
      if (mode) {
        setViewMode(mode);
      }
      
      if (tab) {
        const tabNum = parseInt(tab, 10) || 0;
        setTabValue(tabNum);
        
        // If tab is specified, also set the appropriate section
        const tabToType = {
          0: 'liked',
          1: 'all'
        };
        
        if (musicContext.setCurrentSection) {
          musicContext.setCurrentSection(tabToType[tabNum] || 'liked');
        }
      }
      
      // Загружаем чарты
      fetchCharts();
    };
    
    // Запускаем загрузку данных при монтировании компонента
    loadInitialData();
  }, []);
  
  // Функция для загрузки чартов
  const fetchCharts = async () => {
    try {
      setChartsLoading(true);
      const response = await axios.get('/api/music/charts');
      if (response.data.success) {
        // Получаем чарты
        const receivedCharts = response.data.charts;
        
        // Синхронизируем статус лайков с другими списками треков
        if (receivedCharts) {
          // Создаем множество ID треков, которые лайкнуты
          const likedTrackIds = new Set(likedTracks.map(track => track.id));
          
          // Функция для обновления статуса лайков в списке треков
          const syncLikes = (tracks) => {
            if (!tracks || !Array.isArray(tracks)) return tracks;
            
            return tracks.map(track => {
              if (!track || !track.id) return track;
              
              // Если трек есть в likedTracks, он должен быть помечен как лайкнутый
              const isLiked = likedTrackIds.has(track.id);
              
              // Проверяем, если трек существует в других списках, сохраняем его статус
              const existingTrack = 
                currentTrack?.id === track.id ? currentTrack :
                tracks.find(t => t.id === track.id) ||
                popularTracks.find(t => t.id === track.id) ||
                newTracks.find(t => t.id === track.id) ||
                randomTracks.find(t => t.id === track.id);
                
              if (existingTrack) {
                return { ...track, is_liked: existingTrack.is_liked };
              }
              
              // Иначе используем статус из likedTracks
              return { ...track, is_liked: isLiked };
            });
          };
          
          // Обновляем все чарты
          const updatedCharts = {
            most_played: syncLikes(receivedCharts.most_played),
            trending: syncLikes(receivedCharts.trending),
            most_liked: syncLikes(receivedCharts.most_liked),
            new_releases: syncLikes(receivedCharts.new_releases)
          };
          
          // Устанавливаем обновленные чарты
          setCharts(updatedCharts);
        } else {
          setCharts(response.data.charts);
        }
      }
    } catch (error) {
      console.error('Error fetching charts:', error);
    } finally {
      setChartsLoading(false);
    }
  };
  
  // Обновление URL при изменении режима просмотра или вкладки
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('mode', viewMode);
    params.set('tab', tabValue.toString());
    
    navigate(`?${params.toString()}`, { replace: true });
  }, [viewMode, tabValue, navigate]);

  // Получение плейлистов пользователя
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

  // Загружаем плейлисты при переключении на вкладку плейлистов
  useEffect(() => {
    if (mainTab === 1) {
      fetchUserPlaylists();
    }
  }, [mainTab, fetchUserPlaylists]);

  // Функция для создания нового плейлиста
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
        // Обновляем список плейлистов
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

  // Функция для обновления плейлиста
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
        // Обновляем список плейлистов
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

  // Функция для удаления плейлиста
  const deletePlaylist = async (playlistId) => {
    try {
      const response = await axios.delete(`/api/playlists/${playlistId}`);

      if (response.data.success) {
        // Обновляем список плейлистов
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

  // Функция для добавления трека в плейлист
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

  // Функция для удаления трека из плейлиста
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

  // Функция для воспроизведения плейлиста
  const playPlaylist = useCallback(async (playlistId) => {
    try {
      const response = await axios.get(`/api/playlists/${playlistId}`);
      
      if (response.data.success && response.data.playlist.tracks.length > 0) {
        // Устанавливаем текущую секцию как имя плейлиста для отслеживания
        const playlistSection = `playlist_${playlistId}`;
        setCurrentSection(playlistSection);
        
        // Воспроизводим первый трек
        const firstTrack = response.data.playlist.tracks[0];
        playTrack(firstTrack, playlistSection);
        
        // Сохраняем треки плейлиста в контексте музыки
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

  // Обновленная функция handleTabChange для более надежной загрузки треков
  const handleTabChange = useCallback((event, newValue) => {
    // Сохраняем текущее значение для сравнения
    const oldValue = tabValue;
    
    // Обновляем значение вкладки
    setTabValue(newValue);
    
    // Если действительно сменилась вкладка
    if (oldValue !== newValue) {
      console.log(`Переключение вкладки с ${oldValue} на ${newValue}`);
      
      // Прокручиваем к началу страницы
      window.scrollTo(0, 0);
      
      // Очищаем поисковый запрос
      if (searchQuery) {
        setSearchQuery('');
        if (searchInputRef.current) {
          searchInputRef.current.value = '';
        }
      }
      
      // Получаем тип для новой вкладки
      const tabToType = {
        0: 'liked',
        1: 'all'
      };
      
      const newType = tabToType[newValue] || 'all';
      
      // Устанавливаем флаг загрузки
      setLocalLoading(true);
      
      // Отладочная информация для диагностики
      console.log("Текущее состояние треков:");
      console.log(`- liked: ${likedTracks ? likedTracks.length : 0} треков`);
      console.log(`- all: ${tracks ? tracks.length : 0} треков`);
      
      // Принудительный сброс пагинации и загрузка новых треков при переключении
      if (musicContext.resetPagination) {
        console.log(`Сбрасываем пагинацию для типа ${newType}`);
        // Для вкладки "Все треки" добавляем параметр рандомизации
        const randomize = newType === 'all';
        musicContext.resetPagination(newType, randomize).then(() => {
          // После сброса пагинации и загрузки данных снимаем флаг загрузки
          setLocalLoading(false);
        }).catch(err => {
          console.error(`Ошибка при загрузке типа ${newType}:`, err);
          setLocalLoading(false);
        });
      } else {
        // Сбрасываем флаг загрузки через небольшую задержку
        setTimeout(() => {
          setLocalLoading(false);
        }, 800);
      }
      
      // Обновляем секцию в контексте музыки
      if (musicContext.setCurrentSection) {
        console.log(`Устанавливаем секцию ${newType} в контексте`);
        musicContext.setCurrentSection(newType);
      }
    }
  }, [tabValue, searchQuery, musicContext.resetPagination, musicContext.setCurrentSection, 
      likedTracks, tracks, setLocalLoading]);

  const handleTrackClick = useCallback((track) => {
    playTrack(track);
  }, [playTrack]);

  const handleOpenFullScreenPlayer = useCallback(() => {
    setFullScreenPlayerOpen(true);
  }, []);

  const handleCloseFullScreenPlayer = useCallback(() => {
    setFullScreenPlayerOpen(false);
    // Ensure scroll is restored when closing fullscreen player
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }, []);

  const handleOpenUploadDialog = useCallback(() => {
    setUploadDialogOpen(true);
  }, []);

  const handleCloseUploadDialog = useCallback(() => {
    setUploadDialogOpen(false);
  }, []);

  // Обработчик переключения основных вкладок (Музыка/Плейлисты)
  const handleMainTabChange = useCallback((event, newValue) => {
    setMainTab(newValue);
  }, []);

  // Открыть диалог создания плейлиста
  const handleOpenPlaylistDialog = useCallback((playlist = null) => {
    setSelectedPlaylist(playlist);
    setPlaylistDialogOpen(true);
  }, []);

  // Закрыть диалог создания плейлиста
  const handleClosePlaylistDialog = useCallback(() => {
    setSelectedPlaylist(null);
    setPlaylistDialogOpen(false);
  }, []);

  // Открыть диалог добавления треков в плейлист
  const handleOpenPlaylistTracksDialog = useCallback((playlist) => {
    setSelectedPlaylist(playlist);
    setPlaylistTracksDialogOpen(true);
  }, []);

  // Закрыть диалог добавления треков в плейлист
  const handleClosePlaylistTracksDialog = useCallback(() => {
    setSelectedPlaylist(null);
    setPlaylistTracksDialogOpen(false);
  }, []);

  // Определяем текущий список треков в зависимости от выбранной вкладки
  // Мемоизируем для предотвращения лишних вычислений при ререндерах
  const currentTracks = useMemo(() => {
    if (searchQuery.trim()) return searchResults;
    if (tabValue === 0) return likedTracks || [];
    return tracks || [];
  }, [tabValue, tracks, likedTracks, searchQuery, searchResults]);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        setSearchLoading(true);
        
        // Use the searchTracks function from MusicContext instead of direct API call
        musicContext.searchTracks(query)
          .then((results) => {
            setSearchResults(results || []);
            setSearchLoading(false);
            // Add notification when no results found
            if (results.length === 0) {
              setSnackbar({
                open: true,
                message: 'По вашему запросу ничего не найдено',
                severity: 'info'
              });
            }
          })
          .catch((error) => {
            console.error('Error searching tracks:', error);
            setSearchLoading(false);
            // Show error notification
            setSnackbar({
              open: true,
              message: 'Ошибка при поиске. Попробуйте позже.',
              severity: 'error'
            });
          });
      } else {
        setSearchResults([]);
      }
    }, 500),
    [setSnackbar, musicContext.searchTracks]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Если поисковый запрос пуст, сбрасываем состояние поиска и возвращаемся к обычному списку
    if (!query.trim()) {
      // Вызываем очистку поиска вместо простого сброса запроса
      clearSearch();
      return;
    }
    
    // Call the debounced search function
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

  // Функция для очистки поискового запроса
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    
    // Запрашиваем треки заново на основе текущей вкладки
    const tabToType = {
      0: 'liked',
      1: 'all'
    };
    
    // Определяем текущий тип
    const currentType = tabToType[tabValue] || 'all';
    
    // Сбрасываем пагинацию для текущего типа и загружаем треки заново
    if (musicContext.resetPagination) {
      musicContext.resetPagination(currentType);
    }
    
    console.log('Поисковый запрос очищен');
  };

  // Use search results when searching, otherwise use the current tab's tracks
  const displayedTracks = useMemo(() => {
    return searchQuery.trim() ? searchResults : currentTracks;
  }, [searchQuery, searchResults, currentTracks]);

  // Определяем состояние загрузки на основе контекста и локального состояния
  const effectiveLoading = useMemo(() => {
    return isLoading || localLoading;
  }, [isLoading, localLoading]);

  // Обработчик для InterSection Observer (бесконечная прокрутка)
  useEffect(() => {
    // Если функция загрузки дополнительных треков не определена в контексте, не создаем observer
    if (typeof loadMoreTracks !== 'function') {
      console.warn('Infinite scroll functionality requires loadMoreTracks function');
      return;
    }

    // Преобразование индекса вкладки в тип данных
    const tabToType = {
      0: 'liked',
      1: 'all'
    };
    
    // Определяем текущий тип на основе активной вкладки
    const currentType = tabToType[tabValue] || 'all';
    
    // Проверяем флаг наличия дополнительных треков для текущего типа
    const currentHasMore = typeof musicContext.hasMoreByType === 'object' 
      ? musicContext.hasMoreByType[currentType] !== false 
      : hasMoreTracks;

    console.log(`Настройка бесконечного скролла для вкладки ${tabValue}, тип: ${currentType}, есть еще треки: ${currentHasMore}`);

    // Флаг для отслеживания, был ли запрос на загрузку
    let isLoadingData = false;

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        
        // Проверяем видимость элемента и возможность загрузки
        if (entry.isIntersecting && !isLoadingMore && !isLoadingData && !effectiveLoading && currentHasMore) {
          setIsLoadingMore(true);
          isLoadingData = true;
          
          try {
            console.log(`Загружаем треки для вкладки ${tabValue}, тип: ${currentType}`);
            const result = await loadMoreTracks(currentType);
            
            // Обновляем флаг наличия дополнительных треков на основе результата
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
      { threshold: 0.2 } // Порог для раннего обнаружения прокрутки
    );

    // Регистрация observer только если у нас есть элемент и есть еще треки
    if (loaderRef.current && currentHasMore && !effectiveLoading) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMoreTracks, isLoadingMore, loadMoreTracks, tabValue, musicContext.hasMoreByType, effectiveLoading]);

  // При изменении вкладки обновляем состояние и сбрасываем пагинацию
  useEffect(() => {
    if (prevTabValue.current !== tabValue) {
      prevTabValue.current = tabValue;
      
      // Прокручиваем к началу при смене вкладки
      window.scrollTo(0, 0);
      
      // Преобразование индекса вкладки в тип данных
      const tabToType = {
        0: 'liked',
        1: 'all'
      };
      
      // Определяем текущий тип на основе активной вкладки
      const currentType = tabToType[tabValue] || 'all';
      
      // Сбрасываем состояние поиска при смене вкладки
      if (searchQuery) {
        setSearchQuery('');
      }
      
      // Сбрасываем пагинацию для текущего типа
      if (musicContext.resetPagination) {
        musicContext.resetPagination(currentType);
      }
      
      // Обновляем текущую секцию в контексте
      if (musicContext.setCurrentSection) {
        musicContext.setCurrentSection(currentType);
      }
      
      console.log(`Переключение на вкладку ${tabValue}, тип: ${currentType}`);
      
      // Обновляем флаг hasMoreTracks на основе значения для текущего типа
      if (typeof musicContext.hasMoreByType === 'object') {
        const hasMore = musicContext.hasMoreByType[currentType];
        setHasMoreTracks(hasMore !== false);
      }
    }
  }, [tabValue, musicContext.hasMoreByType, musicContext.resetPagination, musicContext.setCurrentSection, searchQuery]);

  // Get section data based on tabValue
  const getSectionData = () => {
    const coverTypes = ['liked', 'all'];
    const type = coverTypes[tabValue] || 'all';
    
    switch(tabValue) {
      case 0:
        return {
          title: "Мне нравится",
          subtitle: "Ваши любимые треки",
          type: "playlist",
          cover: getCoverWithFallback("/uploads/system/like_playlist.jpg", "liked"),
          tracks: likedTracks || []
        };
      case 1: 
        return {
          title: "Все треки",
          subtitle: "Треки в случайном порядке",
          type: "collection",
          cover: getCoverWithFallback("/uploads/system/new_tracks.jpg", "all"),
          tracks: tracks || []
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

  // Component cleanup
  useEffect(() => {
    return () => {
      // Always ensure scroll is enabled when navigating away from music page
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  // Function to copy track link to clipboard
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
    
    // Close context menu if it's open
    handleCloseContextMenu();
  };
  
  // Function to share a track
  const shareTrack = (track, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    // Просто копируем ссылку в буфер обмена вместо использования Web Share API
    copyTrackLink(track);
    
    // Close context menu if it's open
    handleCloseContextMenu();
  };
  
  // Handle context menu open
  const handleContextMenu = (event, track) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedTrack(track);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  
  // Handle context menu close
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  
  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };
  
  // Check for track parameter in URL when component mounts
  useEffect(() => {
    const trackId = searchParams.get('track');
    if (trackId) {
      // If we have a trackId in the URL, fetch and play that track
      const playTrackFromUrl = async () => {
        try {
          // Fetch the track info from the API
          const response = await fetch(`/api/music/${trackId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch track');
          }
          
          const data = await response.json();
          if (data.success && data.track) {
            console.log('Playing track from URL parameter:', data.track);
            // Play the track using the context
            playTrack(data.track);
            // Optionally open full screen player
            setFullScreenPlayerOpen(true);
          }
        } catch (error) {
          console.error('Error playing track from URL:', error);
        }
      };
      
      playTrackFromUrl();
    }
  }, [searchParams]);

  // Новые функции для улучшенного UI
  const handleSwitchToTracks = useCallback((index) => {
    setTabValue(index);
    setViewMode('tracks');
  }, []);
  
  const handleBackToCategories = useCallback(() => {
    setViewMode('categories');
  }, []);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const currentType = tabValue === 0 ? 'liked' : 'all';
    
    if (musicContext.resetPagination) {
      await musicContext.resetPagination(currentType);
    }
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [tabValue, musicContext]);
  
  const handleToggleSearch = useCallback(() => {
    setShowSearchBar(prev => !prev);
    
    if (!showSearchBar) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    } else {
      setSearchQuery('');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
    }
  }, [showSearchBar]);

  // Простая функция для лайка трека
  const handleLikeTrack = (trackId) => {
    likeTrack(trackId);
  };

  // Обновляем чарты при изменении массива лайкнутых треков
  useEffect(() => {
    if (charts && likedTracks) {
      // Создаем набор ID лайкнутых треков
      const likedTrackIds = new Set(likedTracks.map(track => track.id));
      
      // Функция для синхронизации лайков в чартах
      const updateChartsWithLikes = () => {
        // Функция для обновления статуса лайков
        const updateLikedStatus = (chartTracks) => {
          if (!chartTracks || !Array.isArray(chartTracks)) return chartTracks;
          
          return chartTracks.map(track => {
            if (!track || !track.id) return track;
            // Обновляем статус лайка
            return {
              ...track,
              is_liked: likedTrackIds.has(track.id)
            };
          });
        };
        
        // Обновляем каждый чарт
        setCharts(prevCharts => ({
          ...prevCharts,
          most_played: updateLikedStatus(prevCharts.most_played),
          new_releases: updateLikedStatus(prevCharts.new_releases),
          trending: updateLikedStatus(prevCharts.trending),
          most_liked: updateLikedStatus(prevCharts.most_liked)
        }));
      };
      
      // Обновляем чарты
      updateChartsWithLikes();
    }
  }, [likedTracks]);

  return (
    <MusicPageContainer 
      maxWidth="xl" 
      disableGutters 
      sx={{ 
        pb: 10 
      }}
    >
      
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
      
      
      {isMobile ? (
        <MobileSearchContainer>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%'
          }}>
            {viewMode !== 'categories' ? (
              <IconButton 
                color="inherit" 
                onClick={handleBackToCategories}
                size="small"
                sx={{ mr: 1 }}
              >
                <ArrowBack fontSize="small" />
              </IconButton>
            ) : (
              <Typography 
                variant="h6" 
                fontWeight="600"
                sx={{ 
                  display: showSearchBar ? 'none' : 'block',
                  fontSize: '1.1rem'
                }}
              >
                Музыка
              </Typography>
            )}
            
            {showSearchBar ? (
              <StyledSearchInput focused={isSearchFocused} sx={{ height: 40, flexGrow: 1 }}>
                <Search sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                <input
                  ref={searchInputRef}
                  placeholder="Поиск трека или исполнителя"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  style={{ fontSize: '0.875rem' }}
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
              </StyledSearchInput>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <IconButton 
                  color="inherit" 
                  onClick={handleToggleSearch}
                  sx={{ mr: 0.5 }}
                  size="small"
                >
                  <Search fontSize="small" />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  onClick={handleOpenUploadDialog}
                  sx={{ mr: 0.5 }}
                  size="small"
                >
                  <Upload fontSize="small" />
                </IconButton>
              </Box>
            )}
            
            {showSearchBar && (
              <Button 
                onClick={handleToggleSearch}
                size="small"
                sx={{ 
                  ml: 1,
                  textTransform: 'none',
                  minWidth: 'auto',
                  py: 0.5,
                  px: 1
                }}
              >
                Отмена
              </Button>
            )}
          </Box>
        </MobileSearchContainer>
      ) : (
        <SearchContainer open={showSearchBar} ref={headerRef}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: showSearchBar ? 0 : 1
          }}>
            {viewMode !== 'categories' ? (
              <IconButton 
                color="inherit" 
                onClick={handleBackToCategories}
                sx={{ mr: 1 }}
              >
                <ArrowBack />
              </IconButton>
            ) : (
              <Typography 
                variant="h6" 
                fontWeight="600"
                sx={{ 
                  display: { xs: showSearchBar ? 'none' : 'block', sm: 'block' },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Музыка
              </Typography>
            )}
            
            {showSearchBar ? (
              <StyledSearchInput focused={isSearchFocused}>
                <Search sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <input
                  ref={searchInputRef}
                  placeholder="Поиск трека или исполнителя"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
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
              </StyledSearchInput>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  color="inherit" 
                  onClick={handleToggleSearch}
                  sx={{ mr: 0.5 }}
                >
                  <Search />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  onClick={handleOpenUploadDialog}
                  sx={{ mr: 0.5 }}
                >
                  <Upload />
                </IconButton>
              </Box>
            )}
            
            {showSearchBar && (
              <Button 
                onClick={handleToggleSearch}
                sx={{ 
                  ml: 1,
                  textTransform: 'none',
                  minWidth: 'auto'
                }}
              >
                Отмена
              </Button>
            )}
          </Box>
        </SearchContainer>
      )}
      
      
      {!searchQuery ? (
        <>
          
          {viewMode === 'categories' && (
            <Fade in={true} timeout={500}>
              <Box sx={{ pt: 2 }}>
                <HeaderPaper elevation={0}>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ mb: 2 }}
                  >
                    Ваша музыка
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                        <CategoryCard 
                          elevation={3}
                          onClick={() => handleSwitchToTracks(0)}
                          active={tabValue === 0 && viewMode === 'tracks'}
                        >
                          <CardContent sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            height: '100%', 
                            p: { xs: 2, sm: 3 }
                          }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2
                            }}>
                              <CategoryIcon sx={{ mr: 2 }}>
                                <Favorite color="error" />
                              </CategoryIcon>
                              <Box>
                                <Typography variant="h6" fontWeight="600">
                                  Мне нравится
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {likedTracks?.length || 0} {likedTracks?.length === 1 ? 'трек' : 
                                  likedTracks?.length > 1 && likedTracks?.length < 5 ? 'трека' : 'треков'}
                                </Typography>
                              </Box>
                            </Box>
                            
                            
                            {likedTracks && likedTracks.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                {likedTracks.slice(0, 3).map((track, index) => (
                                  <CompactTrackItem key={track.id || index}>
                                    <Avatar
                                      variant="rounded"
                                      src={getCoverWithFallback(track.cover_path || '', "album")}
                                      alt={track.title || ''}
                                      sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        borderRadius: 1, 
                                        mr: 1.5 
                                      }}
                                    />
                                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                      <Typography variant="body2" noWrap>
                                        {track.title || 'Без названия'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        {track.artist || 'Неизвестный исполнитель'}
                                      </Typography>
                                    </Box>
                                  </CompactTrackItem>
                                ))}
                              </Box>
                            )}
                          </CardContent>
                        </CategoryCard>
                      </Zoom>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                        <CategoryCard 
                          elevation={3}
                          onClick={() => handleSwitchToTracks(1)}
                          active={tabValue === 1 && viewMode === 'tracks'}
                        >
                          <CardContent sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            height: '100%',
                            p: { xs: 2, sm: 3 }
                          }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2
                            }}>
                              <CategoryIcon sx={{ mr: 2 }}>
                                <Shuffle color="secondary" />
                              </CategoryIcon>
                              <Box>
                                <Typography variant="h6" fontWeight="600">
                                  Все треки
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {tracks?.length || 0} {tracks?.length === 1 ? 'трек' : 
                                  tracks?.length > 1 && tracks?.length < 5 ? 'трека' : 'треков'}
                                </Typography>
                              </Box>
                            </Box>
                            
                            
                            {tracks && tracks.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                {tracks.slice(0, 3).map((track, index) => (
                                  <CompactTrackItem key={track.id || index}>
                                    <Avatar
                                      variant="rounded"
                                      src={getCoverWithFallback(track.cover_path || '', "album")}
                                      alt={track.title || ''}
                                      sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        borderRadius: 1, 
                                        mr: 1.5 
                                      }}
                                    />
                                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                      <Typography variant="body2" noWrap>
                                        {track.title || 'Без названия'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        {track.artist || 'Неизвестный исполнитель'}
                                      </Typography>
                                    </Box>
                                  </CompactTrackItem>
                                ))}
                              </Box>
                            )}
                          </CardContent>
                        </CategoryCard>
                      </Zoom>
                    </Grid>
                  </Grid>
                </HeaderPaper>
                
                
                <HeaderPaper elevation={0}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2 
                  }}>
                    <Typography variant="h5" fontWeight="bold">
                      Чарты
                    </Typography>
                  </Box>
                  
                  {chartsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={30} />
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '150ms' }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              height: '100%',
                              borderRadius: 2,
                              backgroundColor: 'rgba(25,25,25,0.6)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.05)',
                            }}
                          >
                            <Typography variant="h6" gutterBottom fontWeight="600">
                              Популярные
                            </Typography>
                            
                            {charts.most_played && charts.most_played.length > 0 ? (
                              <Box>
                                {charts.most_played.slice(0, 5).map((track, index) => (
                                  <ChartTrackItem 
                                    key={track.id || index} 
                                    onClick={() => handleTrackClick(track)}
                                  >
                                    <ChartPosition>
                                      {index + 1}
                                    </ChartPosition>
                                    
                                    <ChartCover>
                                      <img 
                                        src={getCoverWithFallback(track.cover_path || '', "album")} 
                                        alt={track.title}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'cover' }}
                                      />
                                    </ChartCover>
                                    
                                    <ChartInfoContainer>
                                      <ChartTrackTitle>
                                        {track.title || 'Без названия'}
                                      </ChartTrackTitle>
                                      <ChartTrackArtist>
                                        {track.artist || 'Неизвестный исполнитель'}
                                      </ChartTrackArtist>
                                    </ChartInfoContainer>
                                    
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      ml: 'auto' 
                                    }}>
                                      <IconButton 
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLikeTrack(track.id);
                                        }}
                                        sx={{ 
                                          color: track.is_liked ? 'error.main' : 'text.secondary',
                                          transition: 'all 0.2s ease',
                                          '&:hover': {
                                            color: track.is_liked ? 'error.light' : '#ff6b6b',
                                            transform: 'scale(1.1)',
                                          }
                                        }}
                                      >
                                        {track.is_liked ? (
                                          <Favorite 
                                            fontSize="small" 
                                            sx={{ 
                                              animation: 'heartBeat 0.5s',
                                              '@keyframes heartBeat': {
                                                '0%': { transform: 'scale(1)' },
                                                '14%': { transform: 'scale(1.3)' },
                                                '28%': { transform: 'scale(1)' },
                                                '42%': { transform: 'scale(1.3)' },
                                                '70%': { transform: 'scale(1)' },
                                              }
                                            }}
                                          />
                                        ) : (
                                          <FavoriteBorder 
                                            fontSize="small"
                                            sx={{
                                              '&:hover': {
                                                animation: 'pulse 1.5s infinite',
                                                '@keyframes pulse': {
                                                  '0%': { opacity: 1 },
                                                  '50%': { opacity: 0.6 },
                                                  '100%': { opacity: 1 }
                                                }
                                              }
                                            }}
                                          />
                                        )}
                                      </IconButton>
                                    </Box>
                                  </ChartTrackItem>
                                ))}
                              </Box>
                            ) : (
                              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                Нет данных о популярных треках
                              </Typography>
                            )}
                          </Paper>
                        </Zoom>
                      </Grid>
                      
                      
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              height: '100%',
                              borderRadius: 2,
                              backgroundColor: 'rgba(25,25,25,0.6)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.05)',
                            }}
                          >
                            <Typography variant="h6" gutterBottom fontWeight="600">
                              Новинки
                            </Typography>
                            
                            {charts.new_releases && charts.new_releases.length > 0 ? (
                              <Box>
                                {charts.new_releases.slice(0, 5).map((track, index) => (
                                  <ChartTrackItem 
                                    key={track.id || index} 
                                    onClick={() => handleTrackClick(track)}
                                  >
                                    <ChartPosition>
                                      {index + 1}
                                    </ChartPosition>
                                    
                                    <ChartCover>
                                      <img 
                                        src={getCoverWithFallback(track.cover_path || '', "album")} 
                                        alt={track.title}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'cover' }}
                                      />
                                    </ChartCover>
                                    
                                    <ChartInfoContainer>
                                      <ChartTrackTitle>
                                        {track.title || 'Без названия'}
                                      </ChartTrackTitle>
                                      <ChartTrackArtist>
                                        {track.artist || 'Неизвестный исполнитель'}
                                      </ChartTrackArtist>
                                    </ChartInfoContainer>
                                    
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      ml: 'auto' 
                                    }}>
                                      <IconButton 
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLikeTrack(track.id);
                                        }}
                                        sx={{ 
                                          color: track.is_liked ? 'error.main' : 'text.secondary',
                                          transition: 'all 0.2s ease',
                                          '&:hover': {
                                            color: track.is_liked ? 'error.light' : '#ff6b6b',
                                            transform: 'scale(1.1)',
                                          }
                                        }}
                                      >
                                        {track.is_liked ? (
                                          <Favorite 
                                            fontSize="small" 
                                            sx={{ 
                                              animation: 'heartBeat 0.5s',
                                              '@keyframes heartBeat': {
                                                '0%': { transform: 'scale(1)' },
                                                '14%': { transform: 'scale(1.3)' },
                                                '28%': { transform: 'scale(1)' },
                                                '42%': { transform: 'scale(1.3)' },
                                                '70%': { transform: 'scale(1)' },
                                              }
                                            }}
                                          />
                                        ) : (
                                          <FavoriteBorder 
                                            fontSize="small"
                                            sx={{
                                              '&:hover': {
                                                animation: 'pulse 1.5s infinite',
                                                '@keyframes pulse': {
                                                  '0%': { opacity: 1 },
                                                  '50%': { opacity: 0.6 },
                                                  '100%': { opacity: 1 }
                                                }
                                              }
                                            }}
                                          />
                                        )}
                                      </IconButton>
                                    </Box>
                                  </ChartTrackItem>
                                ))}
                              </Box>
                            ) : (
                              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                Нет данных о новых релизах
                              </Typography>
                            )}
                          </Paper>
                        </Zoom>
                      </Grid>
                    </Grid>
                  )}
                </HeaderPaper>
                
                
                <HeaderPaper elevation={0}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2 
                  }}>
                    <Typography variant="h5" fontWeight="bold">
                      Плейлисты
                    </Typography>
                    <IconButton color="primary">
                      <Add />
                    </IconButton>
                  </Box>
                  
                  {playlistBannerOpen && (
                    <Alert 
                      severity="info" 
                      variant="filled"
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        backgroundColor: 'rgba(208, 188, 255, 0.2)',
                        border: '1px solid rgba(208, 188, 255, 0.3)',
                        '& .MuiAlert-icon': { color: 'rgb(208, 188, 255)' }
                      }}
                      onClose={() => setPlaylistBannerOpen(false)}
                    >
                      Плейлисты будут доступны совсем скоро!
                    </Alert>
                  )}
                  
                  {isPlaylistsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={30} />
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {playlists && playlists.length > 0 ? playlists.map((playlist, index) => (
                        <Grid item xs={6} sm={4} md={3} key={playlist.id}>
                          <Zoom in={true} style={{ transitionDelay: `${150 * (index % 8)}ms` }}>
                            <PlaylistTile>
                              <CardMedia
                                component="img"
                                height={140}
                                image={getCoverWithFallback(playlist.cover, "playlist")}
                                alt={playlist.title}
                              />
                              <CardContent sx={{ p: 1.5, pb: 2 }}>
                                <Typography variant="body2" fontWeight="500" noWrap>
                                  {playlist.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {playlist.tracks?.length || 0} {playlist.tracks?.length === 1 ? 'трек' : 
                                  playlist.tracks?.length > 1 && playlist.tracks?.length < 5 ? 'трека' : 'треков'}
                                </Typography>
                              </CardContent>
                            </PlaylistTile>
                          </Zoom>
                        </Grid>
                      )) : (
                        <Grid item xs={12}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            py: 4,
                            background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.05) 0%, rgba(255,255,255,0.03) 100%)',
                            borderRadius: 3,
                            border: '1px dashed rgba(208, 188, 255, 0.2)',
                          }}>
                            <QueueMusic sx={{ fontSize: 48, color: 'rgb(208, 188, 255)', opacity: 0.6, mb: 2 }} />
                            <Typography sx={{ color: 'rgb(208, 188, 255)', mb: 1, fontWeight: 500 }}>
                              Плейлисты уже очень скоро!
                            </Typography>
                            <Typography color="text.secondary" align="center" sx={{ maxWidth: 400, px: 2, mb: 2 }}>
                              Вы сможете создавать коллекции любимых треков и делиться ими с друзьями
                            </Typography>
                            <ActionButton 
                              color="primary" 
                              startIcon={<Add />}
                              sx={{ 
                                background: 'linear-gradient(45deg, rgba(191, 164, 255, 1) 30%, rgba(208, 188, 255, 1) 90%)',
                                boxShadow: '0 3px 12px rgba(208, 188, 255, 0.3)',
                              }}
                            >
                              Создать плейлист
                            </ActionButton>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </HeaderPaper>
                
                
                
              </Box>
            </Fade>
          )}
        
          
          {viewMode === 'tracks' && (
            <Fade in={true} timeout={500}>
              <Box sx={{ pt: 2 }}>
                <HeaderPaper elevation={0} sx={{ mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' }, 
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      mb: { xs: 2, md: 0 }
                    }}>
                      <CoverArtContainer 
                        sx={{ 
                          width: { xs: 120, sm: 150, md: 180 }, 
                          flexShrink: 0,
                          mr: { xs: 0, sm: 3 },
                          mb: { xs: 2, sm: 0 }
                        }}
                      >
                        <img 
                          src={getSectionData().cover}
                          alt={getSectionData().title}
                        />
                      </CoverArtContainer>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {getSectionData().type === "playlist" ? "Плейлист" : 
                          getSectionData().type === "radio" ? "Радио" : "Коллекция"}
                        </Typography>
                        
                        <Typography 
                          variant="h4" 
                          component="h1" 
                          fontWeight="bold" 
                          sx={{ 
                            mb: 1,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                          }}
                        >
                          {getSectionData().title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {getSectionData().subtitle}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <ActionButton 
                        color="primary" 
                        startIcon={<PlayArrow />}
                        onClick={() => {
                          if (getSectionData().tracks.length > 0) {
                            playTrack(getSectionData().tracks[0]);
                          }
                        }}
                        sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                        disabled={getSectionData().tracks.length === 0}
                      >
                        Слушать
                      </ActionButton>
                      
                      <ActionButton 
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                      >
                        {refreshing ? 'Обновление...' : 'Обновить'}
                      </ActionButton>
                    </Box>
                  </Box>
                </HeaderPaper>
                
                
                <Box sx={{ mb: 4 }}>
                  {effectiveLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress size={30} />
                    </Box>
                  ) : (
                    <>
                      <List sx={{ py: 0 }}>
                        {displayedTracks && displayedTracks.length > 0 ? (
                          displayedTracks.map((track, index) => (
                            <Grow
                              key={track.id}
                              in={true}
                              style={{ transformOrigin: '0 0 0' }}
                              timeout={300 + index % 15 * 30}
                            >
                              <TrackItem 
                                active={currentTrack && currentTrack.id === track.id}
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
                                      minWidth: { xs: 24, sm: 32 },
                                      mr: { xs: 1, sm: 2 },
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
                                      width: { xs: 32, sm: 40 }, 
                                      height: { xs: 32, sm: 40 }, 
                                      borderRadius: 1, 
                                      mr: { xs: 1, sm: 2 },
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
                                  
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    '& > button': { opacity: 0.7 },
                                    '& > button:hover': { opacity: 1 }
                                  }}>
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
                                        sx={{ 
                                          color: 'text.secondary', 
                                          mr: 1,
                                          display: { xs: 'none', sm: 'flex' }
                                        }}
                                      >
                                        <ContentCopy fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    
                                    <IconButton 
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeTrack(track.id);
                                      }}
                                      sx={{ 
                                        color: track.is_liked ? 'error.main' : 'text.secondary',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          color: track.is_liked ? 'error.light' : '#ff6b6b',
                                          transform: 'scale(1.1)',
                                        }
                                      }}
                                    >
                                      {track.is_liked ? (
                                        <Favorite 
                                          fontSize="small" 
                                          sx={{ 
                                            animation: 'heartBeat 0.5s',
                                            '@keyframes heartBeat': {
                                              '0%': { transform: 'scale(1)' },
                                              '14%': { transform: 'scale(1.3)' },
                                              '28%': { transform: 'scale(1)' },
                                              '42%': { transform: 'scale(1.3)' },
                                              '70%': { transform: 'scale(1)' },
                                            }
                                          }}
                                        />
                                      ) : (
                                        <FavoriteBorder 
                                          fontSize="small"
                                          sx={{
                                            '&:hover': {
                                              animation: 'pulse 1.5s infinite',
                                              '@keyframes pulse': {
                                                '0%': { opacity: 1 },
                                                '50%': { opacity: 0.6 },
                                                '100%': { opacity: 1 }
                                              }
                                            }
                                          }}
                                        />
                                      )}
                                    </IconButton>
                                  </Box>
                                </Box>
                              </TrackItem>
                            </Grow>
                          ))
                        ) : (
                          <Fade in={true} timeout={500}>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              py: 8
                            }}>
                              {tabValue === 0 ? (
                                <>
                                  <Favorite sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    У вас пока нет понравившихся треков
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                                    Нажмите на иконку сердечка у любого трека, чтобы добавить его в избранное
                                  </Typography>
                                </>
                              ) : tabValue === 1 ? (
                                <>
                                  <LibraryMusic sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Ваша музыкальная коллекция пуста
                                  </Typography>
                                  <ActionButton 
                                    color="primary" 
                                    startIcon={<Upload />}
                                    onClick={handleOpenUploadDialog}
                                  >
                                    Загрузить музыку
                                  </ActionButton>
                                </>
                              ) : (
                                <>
                                  <Shuffle sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Нет треков для случайного воспроизведения
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                                    Добавьте больше музыки, чтобы включить режим случайного воспроизведения
                                  </Typography>
                                </>
                              )}
                            </Box>
                          </Fade>
                        )}
                      </List>
                      
                      
                      {!searchQuery && hasMoreTracks && (
                        <Box 
                          ref={loaderRef} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            py: 3
                          }}
                        >
                          {isLoadingMore ? (
                            <Fade in={true} timeout={300}>
                              <CircularProgress size={24} sx={{ color: 'primary.main', opacity: 0.7 }} />
                            </Fade>
                          ) : (
                            <Fade in={true} timeout={300}>
                              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                                Прокрутите вниз для загрузки
                              </Typography>
                            </Fade>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Fade>
          )}
        </>
      ) : (
        // Результаты поиска
        <Fade in={true} timeout={500}>
          <Box sx={{ pt: 2, pb: 2 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Результаты поиска
            </Typography>
            
            {isSearching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress size={30} />
              </Box>
            ) : searchResults.length > 0 ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Найдено {searchResults.length} {
                    searchResults.length === 1 ? 'трек' : 
                    searchResults.length > 1 && searchResults.length < 5 ? 'трека' : 'треков'
                  } по запросу "{searchQuery}"
                </Typography>
                
                <List sx={{ width: '100%', p: 0 }}>
                  {searchResults.map((track, index) => (
                    <Grow 
                      key={track.id || index} 
                      in={true} 
                      style={{ transformOrigin: '0 0 0', transitionDelay: `${index * 30}ms` }}
                    >
                      <TrackItem
                        onClick={() => handleTrackClick(track)}
                        onContextMenu={(e) => handleContextMenu(e, track)}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            width: '100%',
                            alignItems: 'center'
                          }}
                        >
                          <Avatar
                            variant="rounded"
                            src={getCoverWithFallback(track.cover_path || '', "album")}
                            alt={track.title || ''}
                            sx={{ 
                              width: { xs: 32, sm: 40 }, 
                              height: { xs: 32, sm: 40 }, 
                              borderRadius: 1, 
                              mr: { xs: 1, sm: 2 }
                            }}
                          />
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                            <Typography 
                              variant="body2" 
                              noWrap
                              color={currentTrack && currentTrack.id === track.id ? 'primary.main' : 'text.primary'}
                            >
                              {track.title || 'Без названия'}
                            </Typography>
                            
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {track.artist || 'Неизвестный исполнитель'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            '& > button': { opacity: 0.7 },
                            '& > button:hover': { opacity: 1 }
                          }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                              {formatDuration(track.duration)}
                            </Typography>
                            
                            <IconButton 
                              size="small"
                              color={currentTrack && currentTrack.id === track.id && isPlaying ? "primary" : "default"}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackClick(track);
                              }}
                              sx={{ 
                                mr: 1,
                                color: currentTrack && currentTrack.id === track.id && isPlaying ? 'primary.main' : 'text.secondary'
                              }}
                            >
                              {currentTrack && currentTrack.id === track.id && isPlaying ? (
                                <Pause fontSize="small" />
                              ) : (
                                <PlayArrow fontSize="small" />
                              )}
                            </IconButton>
                            
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeTrack(track.id);
                              }}
                              sx={{ 
                                color: track.is_liked ? 'error.main' : 'text.secondary',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  color: track.is_liked ? 'error.light' : '#ff6b6b',
                                  transform: 'scale(1.1)',
                                }
                              }}
                            >
                              {track.is_liked ? (
                                <Favorite 
                                  fontSize="small" 
                                  sx={{ 
                                    animation: 'heartBeat 0.5s',
                                    '@keyframes heartBeat': {
                                      '0%': { transform: 'scale(1)' },
                                      '14%': { transform: 'scale(1.3)' },
                                      '28%': { transform: 'scale(1)' },
                                      '42%': { transform: 'scale(1.3)' },
                                      '70%': { transform: 'scale(1)' },
                                    }
                                  }}
                                />
                              ) : (
                                <FavoriteBorder 
                                  fontSize="small"
                                  sx={{
                                    '&:hover': {
                                      animation: 'pulse 1.5s infinite',
                                      '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.6 },
                                        '100%': { opacity: 1 }
                                      }
                                    }
                                  }}
                                />
                              )}
                            </IconButton>
                          </Box>
                        </Box>
                      </TrackItem>
                    </Grow>
                  ))}
                </List>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 8
              }}>
                <Search sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  Ничего не найдено по запросу "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Попробуйте изменить запрос или выбрать другую категорию
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      )}
      
      
      {isMobile && (
        <Slide direction="up" in={isMobileNavVisible} mountOnEnter unmountOnExit>
          <MobileNavigation 
            value={viewMode === 'categories' ? 0 : tabValue + 1}
            onChange={(e, newValue) => {
              if (newValue === 0) {
                setViewMode('categories');
              } else {
                setTabValue(newValue - 1);
                setViewMode('tracks');
              }
            }}
            showLabels
            sx={{ 
              height: 56,
              borderTop: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
              px: 1
            }}
          >
            <BottomNavigationAction 
              label="Главная" 
              icon={<Home sx={{ fontSize: '1.3rem' }} />} 
              sx={{ 
                minWidth: 0, 
                padding: 1,
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.625rem',
                  marginTop: 0.5
                }
              }}
            />
            <BottomNavigationAction 
              label="Любимые" 
              icon={<Favorite sx={{ fontSize: '1.3rem' }} />} 
              sx={{ 
                minWidth: 0, 
                padding: 1,
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.625rem',
                  marginTop: 0.5
                }
              }}
            />
            <BottomNavigationAction 
              label="Все" 
              icon={<LibraryMusic sx={{ fontSize: '1.3rem' }} />} 
              sx={{ 
                minWidth: 0, 
                padding: 1,
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.625rem',
                  marginTop: 0.5
                }
              }}
            />
          </MobileNavigation>
        </Slide>
      )}
      
      
      
      <FullScreenPlayer 
        open={fullScreenPlayerOpen} 
        onClose={handleCloseFullScreenPlayer} 
      />

      
      <MusicUploadDialog 
        open={uploadDialogOpen} 
        onClose={handleCloseUploadDialog} 
        onSuccess={() => {}} 
      />
      
      
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        elevation={3}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }
        }}
      >
        {selectedTrack && (
          <>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  variant="rounded"
                  src={getCoverWithFallback(selectedTrack?.cover_path || '', "album")}
                  alt={selectedTrack?.title || ''}
                  sx={{ width: 36, height: 36, borderRadius: 1, mr: 1.5 }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap fontWeight="500">
                    {selectedTrack?.title || 'Без названия'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {selectedTrack?.artist || 'Неизвестный исполнитель'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <MenuItem 
              onClick={() => handleTrackClick(selectedTrack)}
              sx={{ py: 1.5 }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <PlayArrow fontSize="small" />
              </ListItemAvatar>
              <ListItemText 
                primary="Воспроизвести" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            
            <MenuItem 
              onClick={(e) => copyTrackLink(selectedTrack, e)}
              sx={{ py: 1.5 }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <ContentCopy fontSize="small" />
              </ListItemAvatar>
              <ListItemText 
                primary="Копировать ссылку" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            
            <MenuItem 
              onClick={(e) => shareTrack(selectedTrack, e)}
              sx={{ py: 1.5 }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <Share fontSize="small" />
              </ListItemAvatar>
              <ListItemText 
                primary="Поделиться" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            
            <MenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleLikeTrack(selectedTrack?.id);
                handleCloseContextMenu();
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                {selectedTrack?.is_liked ? (
                  <Favorite 
                    fontSize="small" 
                    color="error" 
                    sx={{ 
                      animation: 'heartBeat 0.5s',
                      '@keyframes heartBeat': {
                        '0%': { transform: 'scale(1)' },
                        '14%': { transform: 'scale(1.3)' },
                        '28%': { transform: 'scale(1)' },
                        '42%': { transform: 'scale(1.3)' },
                        '70%': { transform: 'scale(1)' },
                      }
                    }}
                  />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
              </ListItemAvatar>
              <ListItemText 
                primary={selectedTrack?.is_liked ? "Убрать из понравившихся" : "Добавить в понравившиеся"} 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            
            <MenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleCloseContextMenu();
                // Здесь можно добавить логику для добавления в плейлист
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <QueueMusic fontSize="small" />
              </ListItemAvatar>
              <ListItemText 
                primary="Добавить в плейлист" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            
            <MenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleCloseContextMenu();
                // Здесь можно добавить логику для скачивания трека
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <Download fontSize="small" />
              </ListItemAvatar>
              <ListItemText 
                primary="Скачать" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
          </>
        )}
      </Menu>
      
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ 
          vertical: 'bottom', 
          horizontal: 'center' 
        }}
        sx={{
          mb: isMobile ? 7 : 1
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%',
            borderRadius: 3,
            '& .MuiAlert-icon': {
              fontSize: 20
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      
      <Zoom in={showBackToTop}>
        <Fab
          size="small"
          color="primary"
          aria-label="back to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 70 : 16,
            right: 16,
            opacity: 0.8,
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>

      
      {searchQuery.trim() && !searchLoading && displayedTracks.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 8
        }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            По запросу "{searchQuery}" ничего не найдено
          </Typography>
          <Button 
            variant="outlined" 
            onClick={clearSearch}
            startIcon={<Refresh />}
          >
            Очистить поиск
          </Button>
        </Box>
      )}
    </MusicPageContainer>
  );
});

export default MusicPage; 