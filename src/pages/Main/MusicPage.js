import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react';
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
  KeyboardArrowUp,
  VerifiedUser,
  Edit,
  Delete
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { useContext } from 'react';
import { ThemeSettingsContext } from '../../App';
import FullScreenPlayer from '../../components/Music';
import MobilePlayer from '../../components/Music/MobilePlayer';
import MusicUploadDialog from '../../components/Music/MusicUploadDialog';
import { getCoverWithFallback } from '../../utils/imageUtils';
import { useLocation, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO';
import { PlaylistModal, PlaylistGrid } from '../../UIKIT';
import PlaylistViewModal from '../../UIKIT/PlaylistViewModal';


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


const MusicPageContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(14),
  padding: theme.spacing(0, 1),
  [theme.breakpoints.up('md')]: {
    marginBottom: theme.spacing(16),
    padding: theme.spacing(0, 3),
  }
}));

const CategoryCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
  cursor: 'pointer',
  height: '100%',
  background: active ? 
    `linear-gradient(135deg, ${theme.palette.primary.main}33 0%, ${theme.palette.primary.main}1A 100%)` : 
    `linear-gradient(135deg, ${theme.palette.mode === 'dark' ? 'rgba(25,25,25,0.7)' : 'rgba(240,240,240,0.7)'} 0%, ${theme.palette.mode === 'dark' ? 'rgba(15,15,15,0.7)' : 'rgba(250,250,250,0.7)'} 100%)`,
  backdropFilter: 'blur(8px)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  transform: active ? 'scale(1.02)' : 'scale(1)',
  boxShadow: active ? 
    '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : 
    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  border: active ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    border: `1px solid ${theme.palette.primary.main}33`,
  }
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}33 0%, ${theme.palette.mode === 'dark' ? 'rgba(25,25,25,0.2)' : 'rgba(240,240,240,0.2)'} 100%)`,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
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
  backgroundColor: open 
    ? theme.palette.mode === 'dark' ? 'rgba(18,18,18,0.9)' : 'rgba(250,250,250,0.9)'  
    : theme.palette.mode === 'dark' ? 'rgba(18,18,18,0.6)' : 'rgba(250,250,250,0.6)',
  transition: 'all 0.3s ease',
  borderRadius: open ? 0 : '0 0 16px 16px',
  boxShadow: open ? 'none' : '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledSearchInput = styled(Box)(({ theme, focused }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  borderRadius: 24,
  backgroundColor: focused 
    ? theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' 
    : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  boxShadow: focused ? `0 0 0 2px ${theme.palette.primary.main}66` : 'none',
  '& input': {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: theme.palette.text.primary,
    fontSize: '16px',
    '&::placeholder': {
      color: theme.palette.text.secondary,
    }
  }
}));

const TrackItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: 8,
  cursor: 'pointer',
  marginBottom: 8,
  backgroundColor: active ? `${theme.palette.primary.main}1A` : 'transparent',
  transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
  border: active ? `1px solid ${theme.palette.primary.main}33` : '1px solid transparent',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  }
}));

const PlaylistTile = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(25,25,25,0.6)' : 'rgba(250,250,250,0.6)',
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


const HeaderPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(30,30,30,0.7) 0%, rgba(10,10,10,0.7) 100%)'
    : 'linear-gradient(135deg, rgba(250,250,250,0.7) 0%, rgba(240,240,240,0.7) 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
}));


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


const RecentTracksCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18,18,18,0.6)' : 'rgba(250,250,250,0.6)',
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
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
}));

const MobileSearchContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  width: '100%',
  height: 64, 
  padding: theme.spacing(0, 1.5),
  background: theme.palette.mode === 'dark' ? 'rgba(18,18,18,0.95)' : 'rgba(250,250,250,0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  display: 'flex',
  alignItems: 'center'
}));


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


const MusicPage = React.memo(() => {
  const [tabValue, setTabValue] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mainTab, setMainTab] = useState(1);
  const [playlists, setPlaylists] = useState([]);
  const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlistTracksDialogOpen, setPlaylistTracksDialogOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [viewMode, setViewMode] = useState('categories'); 
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Refs для управления поиском
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  const { section } = useParams();

  const [charts, setCharts] = useState({
    trending: [],
    most_played: [],
    most_liked: [],
    new_releases: []
  });
  const [chartsLoading, setChartsLoading] = useState(true);
  
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [popularArtists, setPopularArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [artistSearchQuery, setArtistSearchQuery] = useState('');
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [isArtistSearching, setIsArtistSearching] = useState(false);
  
  
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [playlistContextMenu, setPlaylistContextMenu] = useState({
    open: false,
    mouseX: null,
    mouseY: null
  });
  const [selectedPlaylistForMenu, setSelectedPlaylistForMenu] = useState(null);
  const [playlistBannerOpen, setPlaylistBannerOpen] = useState(true);

  
  const [playlistViewModalOpen, setPlaylistViewModalOpen] = useState(false);
  const [viewingPlaylist, setViewingPlaylist] = useState(null);
  const [playlistDetailsLoading, setPlaylistDetailsLoading] = useState(false);

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
  
  
  const musicContext = useMusic();
  const { 
    tracks, 
    likedTracks, 
    newTracks, 
    randomTracks,
    popularTracks, 
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
    setTracks,
    openFullScreenPlayer,
    closeFullScreenPlayer,
    isFullScreenPlayerOpen
  } = musicContext;

  
  const loadMoreTracks = musicContext.loadMoreTracks || (async () => console.warn('loadMoreTracks not implemented'));
  const [hasMoreTracks, setHasMoreTracks] = useState(musicContext.hasMoreTracks || false);

  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const prevTabValue = useRef(tabValue);
  
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      
      if (scrollTop > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
      
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setIsMobileNavVisible(false);
      } else {
        setIsMobileNavVisible(true);
      }
      
      setLastScrollTop(scrollTop);
      
      
      if (scrollTop > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);
  
  
  useEffect(() => {
    const loadInitialData = async () => {
      if (typeof setCurrentSection === 'function') {
        console.log('Инициализация страницы музыки');
        
        try {
          // Загружаем все треки
          console.log('Загрузка всех треков при открытии страницы музыки');
          setCurrentSection('all');
          if (musicContext.resetPagination) {
            await musicContext.resetPagination('all', true);
          }

          // Загружаем понравившиеся треки
          console.log('Загрузка понравившихся треков');
          setCurrentSection('liked');
          if (musicContext.resetPagination) {
            await musicContext.resetPagination('liked');
          }

          // Возвращаемся к начальной секции
          const initialSection = section || 'categories';
          setCurrentSection(initialSection === 'categories' ? 'all' : initialSection);
        } catch (error) {
          console.error('Ошибка при загрузке треков:', error);
        }
      }
    };
    
    loadInitialData();
    // Загружаем чарты и артистов только при монтировании
    fetchCharts();
    fetchPopularArtists();
  }, []); // Пустой массив зависимостей для выполнения только при монтировании
  
  
  const fetchCharts = useCallback(async () => {
    try {
      setChartsLoading(true);
      const response = await axios.get('/api/music/charts');
      if (response.data.success) {
        
        const receivedCharts = response.data.charts;
        
        
        if (receivedCharts) {
          
          const likedTrackIds = new Set(likedTracks.map(track => track.id));
          
          
          const syncLikes = (tracks) => {
            if (!tracks || !Array.isArray(tracks)) return tracks;
            
            return tracks.map(track => {
              if (!track || !track.id) return track;
              
              
              const isLiked = likedTrackIds.has(track.id);
              
              
              const existingTrack = 
                currentTrack?.id === track.id ? currentTrack :
                tracks.find(t => t.id === track.id) ||
                popularTracks.find(t => t.id === track.id) ||
                newTracks.find(t => t.id === track.id) ||
                randomTracks.find(t => t.id === track.id);
                
              if (existingTrack) {
                return { ...track, is_liked: existingTrack.is_liked };
              }
              
              
              return { ...track, is_liked: isLiked };
            });
          };
          
          
          const updatedCharts = {
            most_played: syncLikes(receivedCharts.most_played),
            trending: syncLikes(receivedCharts.trending),
            most_liked: syncLikes(receivedCharts.most_liked),
            new_releases: syncLikes(receivedCharts.new_releases)
          };
          
          
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
  }, [likedTracks]); // Нам нужны только likedTracks для проверки лайков
  
  
  useEffect(() => {
    const handleUrlSync = () => {
      const currentSection = section || 'categories';
      const targetSection = viewMode === 'categories' ? 'categories' : 
                          tabValue === 0 ? 'liked' : 'all';

      // Если текущий раздел совпадает с целевым, ничего не делаем
      if (currentSection === targetSection) return;

      // Если URL не соответствует состоянию, обновляем URL
      if (viewMode === 'categories' && currentSection !== 'categories') {
        navigate('/music/categories', { replace: true });
      } else if (viewMode === 'tracks') {
        const section = tabValue === 0 ? 'liked' : 'all';
        if (currentSection !== section) {
          navigate(`/music/${section}`, { replace: true });
        }
      }
    };

    handleUrlSync();
  }, [viewMode, tabValue, section, navigate]);

  
  
  const fetchPublicPlaylists = useCallback(async () => {
    try {
      console.log("Fetching public playlists");
      
      const response = await fetch('/api/music/playlists/public');
      
      if (!response.ok) {
        console.error("Error fetching public playlists:", response.statusText);
        return [];
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log("Public playlists fetched:", data.playlists.length);
        return data.playlists;
      } else {
        console.error("Error fetching public playlists:", data);
        return [];
      }
    } catch (error) {
      console.error("Exception fetching public playlists:", error);
      return [];
    }
  }, []);

  
  const fetchUserPlaylists = useCallback(async () => {
    try {
      setIsPlaylistsLoading(true);
      console.log("Fetching user playlists");
      
      const response = await fetch('/api/music/playlists');
      
      if (!response.ok) {
        console.error("Error fetching playlists:", response.statusText);
        setIsPlaylistsLoading(false);
        return;
      }
      
      const text = await response.text();
      console.log("Raw playlist response:", text);
      
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse playlists response as JSON", e);
        setIsPlaylistsLoading(false);
        return;
      }
      
      let userPlaylists = [];
      
      if (data.success) {
        console.log("User playlists fetched:", data.playlists.length);
        
        
        userPlaylists = await Promise.all(data.playlists.map(async playlist => {
          
          let previewTracks = [];
          try {
            const detailResponse = await fetch(`/api/music/playlists/${playlist.id}`);
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              if (detailData.success && detailData.playlist && detailData.playlist.tracks) {
                previewTracks = detailData.playlist.tracks.slice(0, 3).map(track => ({
                  id: track.id,
                  title: track.title,
                  artist: track.artist,
                  cover_path: track.cover_path
                }));
              }
            }
          } catch (error) {
            console.error(`Error fetching preview tracks for playlist ${playlist.id}:`, error);
          }
          
          return {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description || '',
            is_public: playlist.is_public,
            cover_image: playlist.cover_url || "/static/uploads/system/playlist_placeholder.jpg",
            tracks_count: playlist.track_count || 0,
            created_at: playlist.created_at,
            updated_at: playlist.updated_at,
            is_owner: true, 
            preview_tracks: previewTracks
          };
        }));
      } else {
        console.error("Error fetching user playlists:", data);
      }
      
      
      const publicPlaylists = await fetchPublicPlaylists();
      
      
      const mappedPublicPlaylists = publicPlaylists.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || '',
        is_public: true,
        cover_image: playlist.cover_url || playlist.cover_image || "/static/uploads/system/playlist_placeholder.jpg",
        tracks_count: playlist.tracks_count || 0,
        created_at: playlist.created_at,
        updated_at: playlist.updated_at,
        owner: playlist.owner,
        is_owner: false, 
        preview_tracks: playlist.preview_tracks || []
      }));
      
      
      const publicPlaylistIds = new Set(mappedPublicPlaylists.map(p => p.id));
      const uniqueUserPlaylists = userPlaylists.filter(p => !publicPlaylistIds.has(p.id) || p.is_owner);
      
      
      setPlaylists([...uniqueUserPlaylists, ...mappedPublicPlaylists]);
      
    } catch (error) {
      console.error("Exception fetching playlists:", error);
      setPlaylists([]);
    } finally {
      setIsPlaylistsLoading(false);
    }
  }, [fetchPublicPlaylists]);

  
  useEffect(() => {
    if (mainTab === 1) {
      fetchUserPlaylists();
    }
  }, [mainTab, fetchUserPlaylists]);

  
  
  const createPlaylist = async (playlistData) => {
    setLoading(true);
    try {
      console.log("Creating playlist with data:", playlistData);
      
      if (playlistData instanceof FormData) {
        console.log("FormData entries:");
        for (let [key, value] of playlistData.entries()) {
          console.log(key, value);
        }
      }
      
      const response = await fetch('/api/music/playlists', {
        method: 'POST',
        
        body: playlistData
      });
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON", e);
        setSnackbar({
          open: true,
          message: "Error creating playlist: Server returned invalid response",
          severity: 'error'
        });
        setLoading(false);
        return { success: false };
      }
      
      if (response.ok) {
        console.log("Playlist created:", data);
        setSnackbar({
          open: true,
          message: 'Playlist created successfully',
          severity: 'success'
        });
        fetchUserPlaylists();
        return { success: true, data };
      } else {
        console.error("Error creating playlist:", data);
        setSnackbar({
          open: true,
          message: `Error creating playlist: ${data.error || response.statusText}`,
          severity: 'error'
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Exception creating playlist:", error);
      setSnackbar({
        open: true,
        message: `Error creating playlist: ${error.message}`,
        severity: 'error'
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  
  
  const updatePlaylist = async (playlistData, playlistId) => {
    setLoading(true);
    try {
      console.log(`Updating playlist ${playlistId} with data:`, playlistData);
      
      if (playlistData instanceof FormData) {
        console.log("FormData entries:");
        for (let [key, value] of playlistData.entries()) {
          console.log(key, value);
        }
      }
      
      const response = await fetch(`/api/music/playlists/${playlistId}`, {
        method: 'PUT',
        body: playlistData
      });
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON", e);
        setSnackbar({
          open: true,
          message: "Error updating playlist: Server returned invalid response",
          severity: 'error'
        });
        setLoading(false);
        return { success: false };
      }
      
      if (response.ok) {
        console.log("Playlist updated:", data);
        setSnackbar({
          open: true,
          message: 'Playlist updated successfully',
          severity: 'success'
        });
        fetchUserPlaylists();
        return { success: true, data };
      } else {
        console.error("Error updating playlist:", data);
        setSnackbar({
          open: true,
          message: `Error updating playlist: ${data.error || response.statusText}`,
          severity: 'error'
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Exception updating playlist:", error);
      setSnackbar({
        open: true,
        message: `Error updating playlist: ${error.message}`,
        severity: 'error'
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  
  const deletePlaylist = async (playlistId) => {
    setLoading(true);
    try {
      console.log(`Deleting playlist ${playlistId}`);
      
      const response = await fetch(`/api/music/playlists/${playlistId}`, {
        method: 'DELETE'
      });
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON", e);
        setSnackbar({
          open: true,
          message: "Error deleting playlist: Server returned invalid response",
          severity: 'error'
        });
        setLoading(false);
        return { success: false };
      }
      
      if (response.ok) {
        console.log("Playlist deleted:", data);
        setSnackbar({
          open: true,
          message: 'Playlist deleted successfully',
          severity: 'success'
        });
        fetchUserPlaylists();
        return { success: true };
      } else {
        console.error("Error deleting playlist:", data);
        setSnackbar({
          open: true,
          message: `Error deleting playlist: ${data.error || response.statusText}`,
          severity: 'error'
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Exception deleting playlist:", error);
      setSnackbar({
        open: true,
        message: `Error deleting playlist: ${error.message}`,
        severity: 'error'
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  
  const addTrackToPlaylist = async (playlistId, trackId) => {
    setLoading(true);
    try {
      console.log(`Adding track ${trackId} to playlist ${playlistId}`);
      
      const response = await fetch(`/api/music/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ track_ids: [trackId] })
      });
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON", e);
        setSnackbar({
          open: true,
          message: "Error adding track: Server returned invalid response",
          severity: 'error'
        });
        setLoading(false);
        return { success: false };
      }
      
      if (response.ok) {
        console.log("Track added:", data);
        setSnackbar({
          open: true,
          message: 'Track added to playlist successfully',
          severity: 'success'
        });
        fetchUserPlaylists();
        return { success: true };
      } else {
        console.error("Error adding track:", data);
        setSnackbar({
          open: true,
          message: `Error adding track: ${data.error || response.statusText}`,
          severity: 'error'
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Exception adding track to playlist:", error);
      setSnackbar({
        open: true,
        message: `Error adding track: ${error.message}`,
        severity: 'error'
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  
  const removeTrackFromPlaylist = async (playlistId, trackId) => {
    setLoading(true);
    try {
      console.log(`Removing track ${trackId} from playlist ${playlistId}`);
      
      const response = await fetch(`/api/music/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE'
      });
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON", e);
        setSnackbar({
          open: true,
          message: "Error removing track: Server returned invalid response",
          severity: 'error'
        });
        setLoading(false);
        return { success: false };
      }
      
      if (response.ok) {
        console.log("Track removed:", data);
        setSnackbar({
          open: true,
          message: 'Track removed from playlist successfully',
          severity: 'success'
        });
        fetchUserPlaylists();
        return { success: true };
      } else {
        console.error("Error removing track:", data);
        setSnackbar({
          open: true,
          message: `Error removing track: ${data.error || response.statusText}`,
          severity: 'error'
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Exception removing track from playlist:", error);
      setSnackbar({
        open: true,
        message: `Error removing track: ${error.message}`,
        severity: 'error'
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  
  const playPlaylist = useCallback(async (playlistId) => {
    setLoading(true);
    try {
      console.log(`Getting playlist ${playlistId} for playback`);
      
      const response = await fetch(`/api/music/playlists/${playlistId}`);
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON", e);
        setSnackbar({
          open: true,
          message: "Error playing playlist: Server returned invalid response",
          severity: 'error'
        });
        setLoading(false);
        return { success: false };
      }
      
      if (response.ok && data.success && data.playlist.tracks.length > 0) {
        console.log("Playing playlist:", data.playlist);
        
        const playlistSection = `playlist_${playlistId}`;
        setCurrentSection(playlistSection);
        
        
        const firstTrack = data.playlist.tracks[0];
        playTrack(firstTrack, playlistSection);
        
        
        if (typeof musicContext.setPlaylistTracks === 'function') {
          musicContext.setPlaylistTracks(data.playlist.tracks, playlistSection);
        }
        
        return { success: true };
      } else if (data.success && data.playlist.tracks.length === 0) {
        setSnackbar({
          open: true,
          message: 'This playlist has no tracks',
          severity: 'info'
        });
        return { success: false };
      } else {
        console.error("Error playing playlist:", data);
        setSnackbar({
          open: true,
          message: `Error playing playlist: ${data.error || response.statusText}`,
          severity: 'error'
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Exception playing playlist:", error);
      setSnackbar({
        open: true,
        message: `Error playing playlist: ${error.message}`,
        severity: 'error'
      });
      return { success: false };
    } finally {
      setLoading(false);
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
        1: 'all'
      };
      
      const newType = tabToType[newValue] || 'all';
      
      
      setLocalLoading(true);
      
      
      console.log("Текущее состояние треков:");
      console.log(`- liked: ${likedTracks ? likedTracks.length : 0} треков`);
      console.log(`- all: ${tracks ? tracks.length : 0} треков`);
      
      
      if (musicContext.resetPagination) {
        console.log(`Сбрасываем пагинацию для типа ${newType}`);
        
        const randomize = newType === 'all';
        musicContext.resetPagination(newType, randomize).then(() => {
          
          setLocalLoading(false);
        }).catch(err => {
          console.error(`Ошибка при загрузке типа ${newType}:`, err);
          setLocalLoading(false);
        });
      } else {
        
        setTimeout(() => {
          setLocalLoading(false);
        }, 800);
      }
      
      
      if (musicContext.setCurrentSection) {
        console.log(`Устанавливаем секцию ${newType} в контексте`);
        musicContext.setCurrentSection(newType);
      }
    }
  }, [tabValue, searchQuery, musicContext.resetPagination, musicContext.setCurrentSection, 
      likedTracks, tracks, setLocalLoading]);

  const handleTrackClick = useCallback((track) => {
    // Определяем секцию на основе текущей вкладки
    let section = 'all';
    if (tabValue === 0) {
      section = 'liked';
    } else if (searchQuery.trim()) {
      section = 'search';
    }
    playTrack(track, section);
  }, [playTrack, tabValue, searchQuery]);

  const handleOpenFullScreenPlayer = useCallback(() => {
    openFullScreenPlayer();
  }, [openFullScreenPlayer]);

  const handleCloseFullScreenPlayer = useCallback(() => {
    closeFullScreenPlayer();
  }, [closeFullScreenPlayer]);

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
    if (searchQuery.trim()) return searchResults;
    if (tabValue === 0) return likedTracks || [];
    return tracks || [];
  }, [tabValue, tracks, likedTracks, searchQuery, searchResults]);

  
  // Стабильная функция поиска
  const performSearch = useCallback(async (query) => {
    // Отменяем предыдущий запрос если он еще выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Проверяем минимальную длину запроса
    if (!query.trim() || query.trim().length < 2) {
      console.log('[MusicPage] Запрос слишком короткий:', query);
      return;
    }
    
    console.log('[MusicPage] Выполняем поиск для:', query);
    setSearchLoading(true);
    
    // Создаем новый AbortController для этого запроса
    abortControllerRef.current = new AbortController();
    
    try {
      const results = await musicContext.searchTracks(query);
      console.log('[MusicPage] Результаты поиска:', results);
      
      if (results.length === 0) {
        setSnackbar({
          open: true,
          message: 'По вашему запросу ничего не найдено',
          severity: 'info'
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[MusicPage] Ошибка поиска:', error);
        setSnackbar({
          open: true,
          message: 'Ошибка при поиске. Попробуйте позже.',
          severity: 'error'
        });
      }
    } finally {
      setSearchLoading(false);
      abortControllerRef.current = null;
    }
  }, [musicContext.searchTracks, setSnackbar]);

  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    console.log('[MusicPage] Изменение поискового запроса:', query);
    
    // Отменяем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Если запрос пустой, очищаем поиск
    if (!query.trim()) {
      clearSearch();
      return;
    }
    
    // Отменяем активный поиск если запрос слишком короткий
    if (query.trim().length < 2) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setSearchLoading(false);
      }
      return;
    }
    
    // Устанавливаем новый таймер для debounce
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 1200); // 1.2 секунды debounce
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
    console.log('[MusicPage] Очистка поиска');
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    
    // Отменяем активный поиск
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setSearchLoading(false);
    }
    
    // Отменяем таймер debounce
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    
    const tabToType = {
      0: 'liked',
      1: 'all'
    };
    
    
    const currentType = tabToType[tabValue] || 'all';
    
    
    if (musicContext.resetPagination) {
      musicContext.resetPagination(currentType);
    }
  };

  
  const displayedTracks = useMemo(() => {
    return searchQuery.trim() ? searchResults : currentTracks;
  }, [searchQuery, searchResults, currentTracks]);

  
  const effectiveLoading = useMemo(() => {
    return isLoading || localLoading;
  }, [isLoading, localLoading]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      console.log('[MusicPage] Размонтирование - очищаем ресурсы поиска');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Очистка стилей body
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  
  useEffect(() => {
    console.log('[ScrollEffect] Инициализация эффекта бесконечной прокрутки', { 
      tabValue, 
      hasMoreTracks, 
      isLoadingMore,
      effectiveLoading,
      searchQuery
    });
    
    if (typeof loadMoreTracks !== 'function') {
      console.warn('[ScrollEffect] Infinite scroll functionality requires loadMoreTracks function');
      return;
    }

    
    const tabToType = {
      0: 'liked',
      1: 'all'
    };
    
    
    const currentType = tabToType[tabValue] || 'all';
    
    
    const currentHasMore = typeof musicContext.hasMoreByType === 'object' 
      ? musicContext.hasMoreByType[currentType] !== false 
      : hasMoreTracks;

    console.log(`[ScrollEffect] Настройка бесконечного скролла для вкладки ${tabValue}, тип: ${currentType}, есть еще треки: ${currentHasMore}`);
    console.log(`[ScrollEffect] Текущий статус для типа ${currentType}:`, {
      hasMoreTracks,
      hasMoreByType: musicContext.hasMoreByType,
      isLoadingMore,
      effectiveLoading,
      tracksCount: currentType === 'liked' ? likedTracks.length : tracks.length
    });

    
    let isLoadingData = false;

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        console.log(`[ScrollEffect] IntersectionObserver вызван, пересечение: ${entry.isIntersecting}`);
        
        
        if (entry.isIntersecting && !isLoadingMore && !isLoadingData && !effectiveLoading && currentHasMore) {
          console.log(`[ScrollEffect] Условие загрузки для типа ${currentType} выполнено, начинаем загрузку треков`);
          setIsLoadingMore(true);
          isLoadingData = true;
          
          try {
            console.log(`[ScrollEffect] Вызываем loadMoreTracks для типа ${currentType}`);
            const result = await loadMoreTracks(currentType);
            
            
            if (result === false) {
              console.log(`[ScrollEffect] loadMoreTracks вернул false, больше нет треков для типа: ${currentType}`);
              setHasMoreTracks(false);
            } else {
              console.log(`[ScrollEffect] loadMoreTracks вернул true, загружено больше треков для типа: ${currentType}`);
            }
          } catch (error) {
            console.error('[ScrollEffect] Ошибка при загрузке треков:', error);
            setHasMoreTracks(false);
          } finally {
            console.log(`[ScrollEffect] Завершаем загрузку для типа ${currentType}`);
            setIsLoadingMore(false);
            isLoadingData = false;
          }
        } else if (entry.isIntersecting) {
          console.log(`[ScrollEffect] Пересечение обнаружено, но условия не выполнены:`, {
            isLoadingMore,
            isLoadingData,
            effectiveLoading,
            currentHasMore
          });
        }
      },
      { threshold: 0.2 } 
    );

    
    if (loaderRef.current && currentHasMore && !effectiveLoading && !searchQuery) {
      console.log('[ScrollEffect] Подключаем IntersectionObserver к элементу загрузки:', currentType);
      observer.observe(loaderRef.current);
    } else {
      console.log('[ScrollEffect] Не удалось подключить IntersectionObserver:', {
        loaderExists: !!loaderRef.current,
        hasMore: currentHasMore,
        isLoading: effectiveLoading,
        hasSearchQuery: !!searchQuery
      });
    }

    return () => {
      console.log(`[ScrollEffect] Очистка эффекта бесконечной прокрутки для типа ${currentType}`);
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMoreTracks, isLoadingMore, loadMoreTracks, tabValue, musicContext.hasMoreByType, effectiveLoading, searchQuery, tracks.length, likedTracks.length]);

  
  useEffect(() => {
    if (prevTabValue.current !== tabValue) {
      prevTabValue.current = tabValue;
      
      
      window.scrollTo(0, 0);
      
      
      const tabToType = {
        0: 'liked',
        1: 'all'
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
    
    const trackLink = `${window.location.origin}/music/track/${track.id}`;
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
    const pathParts = location.pathname.split('/');
    const trackId = pathParts[pathParts.length - 2] === 'track' ? pathParts[pathParts.length - 1] : null;
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
            
            playTrack(data.track, 'url'); // Передаем секцию 'url' для треков из URL
            
            openFullScreenPlayer();
          }
        } catch (error) {
          console.error('Error playing track from URL:', error);
        }
      };
      
      playTrackFromUrl();
    }
  }, [searchParams]);

  
  const handleSwitchToTracks = useCallback((index) => {
    setTabValue(index);
    setViewMode('tracks');
    const section = index === 0 ? 'liked' : 'all';
    navigate(`/music/${section}`);
  }, [navigate]);
  
  const handleBackToCategories = useCallback(() => {
    setViewMode('categories');
    navigate('/music/categories');
  }, [navigate]);
  
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

  
  const handleLikeTrack = (trackId) => {
    likeTrack(trackId);
  };

  
  useEffect(() => {
    if (charts && likedTracks) {
      
      const likedTrackIds = new Set(likedTracks.map(track => track.id));
      
      
      const updateChartsWithLikes = () => {
        
        const updateLikedStatus = (chartTracks) => {
          if (!chartTracks || !Array.isArray(chartTracks)) return chartTracks;
          
          return chartTracks.map(track => {
            if (!track || !track.id) return track;
            
            return {
              ...track,
              is_liked: likedTrackIds.has(track.id)
            };
          });
        };
        
        
        setCharts(prevCharts => ({
          ...prevCharts,
          most_played: updateLikedStatus(prevCharts.most_played),
          new_releases: updateLikedStatus(prevCharts.new_releases),
          trending: updateLikedStatus(prevCharts.trending),
          most_liked: updateLikedStatus(prevCharts.most_liked)
        }));
      };
      
      
      updateChartsWithLikes();
    }
  }, [likedTracks]);

  const renderTrackItem = (track, index) => {
    const isActive = currentTrack && currentTrack.id === track.id;
    const isCurrentlyPlaying = isActive && isPlaying;
    
    const goToArtist = (e) => {
      e.stopPropagation();
      if (track.artist_info && track.artist_info.id) {
        navigate(`/artist/${track.artist_info.id}`);
      } else {
        console.warn('Artist ID not available');

      }
    };

    return (
      <TrackItem 
        key={track.id}
        active={isActive}
        onClick={() => handleTrackClick(track)}
        onContextMenu={(e) => handleContextMenu(e, track)}
      >
        <ListItemAvatar>
          <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
            <Avatar 
              variant="rounded" 
              src={track.cover_path || '/static/uploads/system/album_placeholder.jpg'} 
              alt={track.title}
              sx={{ 
                width: 50, 
                height: 50, 
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                bgcolor: 'rgba(0,0,0,0.2)'
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isCurrentlyPlaying ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }}
            >
              {isCurrentlyPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
            </Box>
            {track.is_verified && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box 
                  component="span"
                  sx={{
                    width: 12,
                    height: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    fontSize: 10
                  }}
                >
                  ✓
                </Box>
              </Box>
            )}
          </Box>
        </ListItemAvatar>
        
        <ListItemText 
          primary={
            <Typography 
              variant="body1" 
              noWrap 
              sx={{ 
                color: isActive ? theme.palette.primary.main : 'inherit',
                fontWeight: isActive ? 500 : 400
              }}
            >
              {track.title}
            </Typography>
          }
          secondary={
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {track.artist && track.artist.split(',').map((artist, idx, arr) => (
                <React.Fragment key={idx}>
                  <Typography 
                    component="span" 
                    variant="body2" 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToArtist(e);
                    }}
                    sx={{ 
                      cursor: track.artist_info && track.artist_info.id ? 'pointer' : 'default',
                      '&:hover': {
                        color: track.artist_info && track.artist_info.id ? theme.palette.primary.main : 'inherit',
                        textDecoration: track.artist_info && track.artist_info.id ? 'underline' : 'none'
                      }
                    }}
                  >
                    {artist.trim()}
                  </Typography>
                  {idx < arr.length - 1 && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      , 
                    </Typography>
                  )}
                </React.Fragment>
              ))}
              <Typography component="span" variant="body2" color="text.secondary" noWrap>
                {track.album ? ` • ${track.album} • ` : ' • '}
                {formatDuration(track.duration)}
              </Typography>
            </Box>
          }
          sx={{ overflowX: 'hidden' }}
        />
        
        <ListItemSecondaryAction>
          <IconButton 
            edge="end" 
            aria-label="like"
            onClick={(e) => {
              e.stopPropagation();
              handleLikeTrack(track.id);
            }}
            size="small"
          >
            {track.is_liked ? 
              <Favorite fontSize="small" color="error" /> : 
              <FavoriteBorder fontSize="small" />
            }
          </IconButton>
        </ListItemSecondaryAction>
      </TrackItem>
    );
  };


  const fetchPopularArtists = useCallback(async () => {
    try {
      setArtistsLoading(true);
      

      const response = await axios.get('/api/moderator/artists?page=1&per_page=6');
      
      if (response.data.success) {
        setPopularArtists(response.data.artists || []);
      } else {
        console.error('Ошибка при получении артистов:', response.data.error);
      }
    } catch (error) {
      console.error('Ошибка при получении артистов:', error);
    } finally {
      setArtistsLoading(false);
    }
  }, []);
  

  const searchArtists = async (query) => {
    if (!query || query.trim().length < 2) {
      setArtistSearchResults([]);
      return;
    }
    
    try {
      setIsArtistSearching(true);

      const searchEndpoint = `/api/search/artists?query=${encodeURIComponent(query.trim())}`;
      console.log('Searching artists with endpoint:', searchEndpoint);
      
      const response = await axios.get(searchEndpoint);
      console.log('Artist search response:', response.data);
      
      if (response.data.success) {
        setArtistSearchResults(response.data.artists || []);
        console.log('Found artists:', response.data.artists.length);
      } else {
        console.error('Ошибка при поиске артистов:', response.data.error);
        setArtistSearchResults([]);
        setSnackbar({
          open: true,
          message: `Ошибка при поиске артистов: ${response.data.error || 'Неизвестная ошибка'}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Ошибка при поиске артистов:', error);
      setArtistSearchResults([]);
      

      try {
        console.log('Trying fallback search with moderator API');
        const fallbackResponse = await axios.get(`/api/moderator/artists?search=${encodeURIComponent(query.trim())}&page=1&per_page=10`);
        
        if (fallbackResponse.data.success) {
          console.log('Fallback search successful:', fallbackResponse.data);
          setArtistSearchResults(fallbackResponse.data.artists || []);
        } else {
          setSnackbar({
            open: true,
            message: 'Ошибка при поиске артистов. Проверьте соединение.',
            severity: 'error'
          });
        }
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        setSnackbar({
          open: true,
          message: 'Ошибка при поиске артистов. Проверьте соединение.',
          severity: 'error'
        });
      }
    } finally {
      setIsArtistSearching(false);
    }
  };
  

  const debouncedArtistSearch = useCallback(
    debounce((query) => {
      if (query.trim().length >= 2) {
        searchArtists(query);
      } else {
        setArtistSearchResults([]);
      }
    }, 500),
    []
  );
  

  const handleArtistSearchChange = (e) => {
    const query = e.target.value;
    setArtistSearchQuery(query);
    debouncedArtistSearch(query);
  };
  

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  
  const handleOpenCreatePlaylist = useCallback(() => {
    setEditingPlaylist(null);
    setPlaylistModalOpen(true);
  }, []);
  
  
  const handleOpenEditPlaylist = useCallback((playlist) => {
    setEditingPlaylist(playlist);
    setPlaylistModalOpen(true);
  }, []);
  
  
  const handleClosePlaylistModal = useCallback(() => {
    setPlaylistModalOpen(false);
    setEditingPlaylist(null);
  }, []);
  
  
  const handleSavePlaylist = async (playlistData, playlistId) => {
    if (playlistId) {
      
      const result = await updatePlaylist(playlistData, playlistId);
      if (result.success) {
        setPlaylistModalOpen(false);
      }
    } else {
      
      const result = await createPlaylist(playlistData);
      if (result.success) {
        setPlaylistModalOpen(false);
      }
    }
  };
  
  
  const handleAddTracksToPlaylist = useCallback(async (playlistId, trackIds) => {
    setLocalLoading(true);
    
    try {
      
      const results = await Promise.all(
        trackIds.map(trackId => addTrackToPlaylist(playlistId, trackId))
      );
      
      const allSuccess = results.every(result => result === true);
      
      if (allSuccess) {
        setSnackbar({
          open: true,
          message: `${trackIds.length} ${trackIds.length === 1 ? 'трек добавлен' : 'треков добавлено'} в плейлист`,
          severity: 'success'
        });
        
        
        await fetchUserPlaylists();
        
        
        if (editingPlaylist && editingPlaylist.id === playlistId) {
          const response = await axios.get(`/api/music/playlists/${playlistId}`);
          if (response.data.success) {
            setEditingPlaylist(response.data.playlist);
          }
        }
      }
    } finally {
      setLocalLoading(false);
    }
  }, [addTrackToPlaylist, fetchUserPlaylists, editingPlaylist]);
  
  
  const handleRemoveTrackFromPlaylist = useCallback(async (playlistId, trackId) => {
    setLocalLoading(true);
    
    try {
      const success = await removeTrackFromPlaylist(playlistId, trackId);
      
      if (success) {
        
        await fetchUserPlaylists();
        
        
        if (editingPlaylist && editingPlaylist.id === playlistId) {
          const response = await axios.get(`/api/music/playlists/${playlistId}`);
          if (response.data.success) {
            setEditingPlaylist(response.data.playlist);
          }
        }
      }
    } finally {
      setLocalLoading(false);
    }
  }, [removeTrackFromPlaylist, fetchUserPlaylists, editingPlaylist]);
  
  
  const handleDeletePlaylist = useCallback(async (playlistId) => {
    setLocalLoading(true);
    
    try {
      const success = await deletePlaylist(playlistId);
      
      if (success) {
        setPlaylistModalOpen(false);
        setEditingPlaylist(null);
        await fetchUserPlaylists();
      }
    } finally {
      setLocalLoading(false);
    }
  }, [deletePlaylist, fetchUserPlaylists]);
  
  
  const handlePlaylistMoreClick = useCallback((event, playlist) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedPlaylistForMenu(playlist);
    setPlaylistContextMenu({
      open: true,
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  }, []);
  
  
  const handleClosePlaylistContextMenu = useCallback(() => {
    setPlaylistContextMenu({
      open: false,
      mouseX: null,
      mouseY: null
    });
  }, []);
  
  
  const fetchPlaylistDetails = useCallback(async (playlistId) => {
    setPlaylistDetailsLoading(true);
    try {
      const response = await fetch(`/api/music/playlists/${playlistId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log("Fetched playlist details:", data.playlist);
        return data.playlist;
      } else {
        console.error("Error fetching playlist:", data.error);
        setSnackbar({
          open: true,
          message: `Error fetching playlist: ${data.error}`,
          severity: 'error'
        });
        return null;
      }
    } catch (error) {
      console.error("Exception fetching playlist:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
      return null;
    } finally {
      setPlaylistDetailsLoading(false);
    }
  }, []);
  
  
  const handlePlaylistClick = useCallback(async (playlistId) => {
    const playlistDetailsFromCache = playlists.find(p => p.id === playlistId);
    
    
    setViewingPlaylist(playlistDetailsFromCache);
    setPlaylistViewModalOpen(true);
    
    
    try {
      const fullDetails = await fetchPlaylistDetails(playlistId);
      if (fullDetails) {
        setViewingPlaylist(fullDetails);
      }
    } catch (error) {
      console.error("Error loading playlist details:", error);
    }
  }, [playlists, fetchPlaylistDetails]);

  
  const handleEditFromView = useCallback((playlist) => {
    setEditingPlaylist(playlist);
    setPlaylistModalOpen(true);
  }, []);

  
  const handleAddTrackToPlaylistMenu = useCallback((trackId) => {
    if (!trackId) return;
    
    
    handleCloseContextMenu();
    
    
    if (playlists && playlists.length > 0) {
      
      
      const playlistId = playlists[0].id;
      addTrackToPlaylist(playlistId, trackId);
    } else {
      
      setSnackbar({
        open: true,
        message: 'У вас ещё нет плейлистов. Создайте плейлист сначала.',
        severity: 'info'
      });
      
      
      handleOpenCreatePlaylist();
    }
  }, [playlists, handleCloseContextMenu, addTrackToPlaylist, handleOpenCreatePlaylist]);

  
  const handlePlayTrackFromPlaylist = useCallback((track) => {
    if (viewingPlaylist) {
      
      const playlistSection = `playlist_${viewingPlaylist.id}`;
      setCurrentSection(playlistSection);
      
      
      playTrack(track, playlistSection);
      
      
      if (typeof musicContext.setPlaylistTracks === 'function' && viewingPlaylist.tracks) {
        musicContext.setPlaylistTracks(viewingPlaylist.tracks, playlistSection);
      }
    }
  }, [viewingPlaylist, setCurrentSection, playTrack, musicContext]);

  
  useEffect(() => {
    const playlistId = searchParams.get('playlist');
    if (playlistId) {
      
      const fetchPlaylist = async () => {
        try {
          const response = await fetch(`/api/music/playlists/${playlistId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch playlist');
          }
          
          const data = await response.json();
          if (data.success && data.playlist) {
            console.log('Opening playlist from URL parameter:', data.playlist);
            handleOpenPlaylistTracksDialog(data.playlist);
          }
        } catch (error) {
          console.error('Error opening playlist from URL:', error);
          setSnackbar({
            open: true,
            message: 'Не удалось открыть плейлист',
            severity: 'error'
          });
        }
      };
      
      fetchPlaylist();
    }
  }, [searchParams, handleOpenPlaylistTracksDialog]);

  

  
  const fetchPlaylists = useCallback(async () => {
    try {
      setPlaylistsLoading(true);
      const response = await axios.get('/api/music/playlists');
      if (response.data.success) {
        
        let playlists = response.data.playlists;
        if (mainTab === 1) { 
          playlists = playlists.filter(playlist => playlist.tracks_count > 0);
        }
        setPlaylists(playlists);
      }
      setPlaylistsLoading(false);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylistsLoading(false);
    }
  }, [mainTab]);

  // Начальная инициализация состояния из URL
  useEffect(() => {
    if (!section) return;

    // Устанавливаем начальное состояние только один раз при монтировании
    const initialSection = section;
    switch(initialSection) {
      case 'liked':
        setTabValue(0);
        setViewMode('tracks');
        break;
      case 'all':
        setTabValue(1);
        setViewMode('tracks');
        break;
      case 'categories':
        setViewMode('categories');
        break;
      default:
        navigate('/music/categories', { replace: true });
    }
  }, [section, navigate]); // Зависимости для правильной инициализации

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
                  style={{ fontSize: '16px' }}
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
                      Мои плейлисты
                    </Typography>
                    <IconButton 
                      color="primary" 
                      onClick={handleOpenCreatePlaylist}
                      aria-label="Создать плейлист"
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  
                  <PlaylistGrid
                    playlists={playlists.filter(p => p.is_owner)}
                    loading={isPlaylistsLoading}
                    skeletonCount={4}
                    onPlaylistClick={handlePlaylistClick}
                    onPlaylistPlay={playPlaylist}
                    onPlaylistMoreClick={handlePlaylistMoreClick}
                  />
                  
                  {!isPlaylistsLoading && playlists.filter(p => p.is_owner).length === 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      py: 4,
                      background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.05) 0%, rgba(0,0,0,0.1) 100%)',
                      borderRadius: 3,
                      border: '1px dashed rgba(208, 188, 255, 0.2)',
                    }}>
                      <QueueMusic sx={{ fontSize: 48, color: 'rgb(208, 188, 255)', opacity: 0.6, mb: 2 }} />
                      <Typography sx={{ color: 'rgb(208, 188, 255)', mb: 1, fontWeight: 500 }}>
                        У вас пока нет плейлистов
                      </Typography>
                      <Typography color="text.secondary" align="center" sx={{ maxWidth: 400, px: 2, mb: 2 }}>
                        Создавайте коллекции любимых треков и делитесь ими с друзьями
                      </Typography>
                      <ActionButton 
                        color="primary" 
                        startIcon={<Add />}
                        onClick={handleOpenCreatePlaylist}
                        sx={{ 
                          background: 'linear-gradient(45deg, rgba(191, 164, 255, 1) 30%, rgba(208, 188, 255, 1) 90%)',
                          boxShadow: '0 3px 12px rgba(208, 188, 255, 0.3)',
                        }}
                      >
                        Создать плейлист
                      </ActionButton>
                    </Box>
                  )}
                </HeaderPaper>
                
                {/* Public Playlists */}
                {playlists.filter(p => !p.is_owner).length > 0 && (
                  <HeaderPaper elevation={0}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2 
                    }}>
                      <Typography variant="h5" fontWeight="bold">
                        Публичные плейлисты
                      </Typography>
                    </Box>
                    
                    <PlaylistGrid
                      playlists={playlists.filter(p => !p.is_owner)}
                      loading={isPlaylistsLoading}
                      skeletonCount={4}
                      onPlaylistClick={handlePlaylistClick}
                      onPlaylistPlay={playPlaylist}
                      onPlaylistMoreClick={handlePlaylistMoreClick}
                    />
                  </HeaderPaper>
                )}
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
                              {renderTrackItem(track, index)}
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
                            py: 3,
                            minHeight: '80px',
                            width: '100%'
                          }}
                          data-testid="infinite-scroll-loader"
                        >
                          {isLoadingMore ? (
                            <Fade in={true} timeout={300}>
                              <CircularProgress size={24} sx={{ color: 'primary.main', opacity: 0.7 }} />
                            </Fade>
                          ) : (
                            <Fade in={true} timeout={300}>
                              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                                {tabValue === 0 ? 'Прокрутите вниз для загрузки понравившихся треков' : 'Прокрутите вниз для загрузки'}
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
        
          {/* Add new Artists section */}
          <HeaderPaper elevation={0}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Typography variant="h5" fontWeight="bold">
                Исполнители
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledSearchInput 
                  focused={artistSearchQuery.length > 0} 
                  sx={{ 
                    mr: 1, 
                    width: { xs: '150px', sm: '200px', md: '250px' },
                    height: '40px'
                  }}
                >
                  <Search sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                  <input
                    placeholder="Найти исполнителя"
                    value={artistSearchQuery}
                    onChange={handleArtistSearchChange}
                    style={{ fontSize: '16px' }}
                  />
                  {artistSearchQuery && (
                    <IconButton 
                      size="small" 
                      onClick={() => setArtistSearchQuery('')}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)', p: 0.5 }}
                    >
                      <Box sx={{ fontSize: 18, fontWeight: 'bold' }}>×</Box>
                    </IconButton>
                  )}
                </StyledSearchInput>
              </Box>
            </Box>
            
            {artistsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                {artistSearchQuery.length > 0 ? (
                  <Box>
                    {isArtistSearching ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={30} />
                      </Box>
                    ) : artistSearchResults.length > 0 ? (
                      <Grid container spacing={2}>
                        {artistSearchResults.map((artist, index) => (
                          <Grid item xs={6} sm={4} md={3} lg={2} key={artist.id || index}>
                            <Zoom in={true} style={{ transitionDelay: `${150 * (index % 8)}ms` }}>
                              <Card 
                                sx={{ 
                                  borderRadius: '16px',
                                  cursor: 'pointer',
                                  backgroundColor: 'rgba(18,18,18,0.6)',
                                  backdropFilter: 'blur(10px)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                  },
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                                onClick={() => handleArtistClick(artist.id)}
                              >
                                <Box 
                                  sx={{ 
                                    width: '100%', 
                                    paddingTop: '100%', 
                                    position: 'relative',
                                    borderRadius: '16px 16px 0 0',
                                    overflow: 'hidden'
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={artist.avatar_url || '/static/uploads/system/artist_placeholder.jpg'}
                                    alt={artist.name}
                                    sx={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      transition: 'transform 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.05)',
                                      },
                                    }}
                                  />
                                </Box>
                                <CardContent sx={{ p: 1.5, pb: 2, flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography 
                                      variant="body1" 
                                      fontWeight="500" 
                                      noWrap 
                                      sx={{ flexGrow: 1 }}
                                    >
                                      {artist.name}
                                    </Typography>
                                    {artist.verified && (
                                      <Tooltip title="Верифицированный артист">
                                        <VerifiedUser 
                                          sx={{ 
                                            fontSize: 16, 
                                            ml: 0.5, 
                                            color: theme.palette.primary.main 
                                          }} 
                                        />
                                      </Tooltip>
                                    )}
                                  </Box>
                                </CardContent>
                              </Card>
                            </Zoom>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        py: 4
                      }}>
                        <Typography color="text.secondary">
                          Артистов по запросу "{artistSearchQuery}" не найдено
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {popularArtists.length > 0 ? (
                      popularArtists.map((artist, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={artist.id || index}>
                          <Zoom in={true} style={{ transitionDelay: `${150 * (index % 8)}ms` }}>
                            <Card 
                              sx={{ 
                                borderRadius: '16px',
                                cursor: 'pointer',
                                backgroundColor: 'rgba(18,18,18,0.6)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                              onClick={() => handleArtistClick(artist.id)}
                            >
                              <Box 
                                sx={{ 
                                  width: '100%', 
                                  paddingTop: '100%', 
                                  position: 'relative',
                                  borderRadius: '16px 16px 0 0',
                                  overflow: 'hidden'
                                }}
                              >
                                <Box
                                  component="img"
                                  src={artist.avatar_url || '/static/uploads/system/artist_placeholder.jpg'}
                                  alt={artist.name}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                    },
                                  }}
                                />
                              </Box>
                              <CardContent sx={{ p: 1.5, pb: 2, flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography 
                                    variant="body1" 
                                    fontWeight="500" 
                                    noWrap 
                                    sx={{ flexGrow: 1 }}
                                  >
                                    {artist.name}
                                  </Typography>
                                  {artist.verified && (
                                    <Tooltip title="Верифицированный артист">
                                      <VerifiedUser 
                                        sx={{ 
                                          fontSize: 16, 
                                          ml: 0.5, 
                                          color: theme.palette.primary.main 
                                        }} 
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          </Zoom>
                        </Grid>
                      ))
                    ) : (
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
                          mx: 2
                        }}>
                          <Typography color="text.secondary" sx={{ mb: 1 }}>
                            Список исполнителей пуст
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                )}
              </>
            )}
          </HeaderPaper>
        </>
      ) : (
        
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
                      {renderTrackItem(track, index)}
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
        open={isFullScreenPlayerOpen} 
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
      
      {/* Playlist Modal for creating and editing playlists */}
      <PlaylistModal
        open={playlistModalOpen}
        onClose={handleClosePlaylistModal}
        playlist={editingPlaylist}
        onSave={handleSavePlaylist}
        onAddTracks={handleAddTracksToPlaylist}
        onRemoveTrack={handleRemoveTrackFromPlaylist}
        onDelete={handleDeletePlaylist}
        isLoading={localLoading}
        nowPlaying={currentTrack} 
      />
      
      {/* Playlist Context Menu */}
      <Menu
        open={playlistContextMenu.open}
        onClose={handleClosePlaylistContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          playlistContextMenu.mouseX !== null && playlistContextMenu.mouseY !== null
            ? { top: playlistContextMenu.mouseY, left: playlistContextMenu.mouseX }
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
        {selectedPlaylistForMenu && (
          <>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="body2" noWrap fontWeight="500">
                {selectedPlaylistForMenu.name || 'Плейлист'}
              </Typography>
            </Box>
            
            <MenuItem 
              onClick={() => {
                playPlaylist(selectedPlaylistForMenu.id);
                handleClosePlaylistContextMenu();
              }}
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
            
            {selectedPlaylistForMenu.isOwner && (
              <MenuItem 
                onClick={() => {
                  handleOpenEditPlaylist(selectedPlaylistForMenu);
                  handleClosePlaylistContextMenu();
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Edit fontSize="small" />
                </ListItemAvatar>
                <ListItemText 
                  primary="Редактировать" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            )}
            
            <MenuItem 
              onClick={() => {
                
                const playlistLink = `${window.location.origin}/music?playlist=${selectedPlaylistForMenu.id}`;
                navigator.clipboard.writeText(playlistLink)
                  .then(() => {
                    setSnackbar({
                      open: true,
                      message: 'Ссылка на плейлист скопирована в буфер обмена',
                      severity: 'success'
                    });
                  })
                  .catch(err => {
                    console.error('Не удалось скопировать ссылку:', err);
                  });
                handleClosePlaylistContextMenu();
              }}
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
              onClick={() => {
                
                const playlistLink = `${window.location.origin}/music?playlist=${selectedPlaylistForMenu.id}`;
                navigator.clipboard.writeText(playlistLink)
                  .then(() => {
                    setSnackbar({
                      open: true,
                      message: 'Ссылка на плейлист скопирована для публикации',
                      severity: 'success'
                    });
                  });
                handleClosePlaylistContextMenu();
              }}
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
            
            {selectedPlaylistForMenu.isOwner && (
              <MenuItem 
                onClick={() => {
                  handleDeletePlaylist(selectedPlaylistForMenu.id);
                  handleClosePlaylistContextMenu();
                }}
                sx={{ py: 1.5, color: 'error.main' }}
              >
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Delete fontSize="small" color="error" />
                </ListItemAvatar>
                <ListItemText 
                  primary="Удалить" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Add PlaylistViewModal near the end of the file, before PlaylistModal */}
      <PlaylistViewModal
        open={playlistViewModalOpen}
        onClose={() => setPlaylistViewModalOpen(false)}
        playlist={viewingPlaylist}
        onEdit={handleEditFromView}
        onPlayTrack={handlePlayTrackFromPlaylist}
        isLoading={playlistDetailsLoading}
        nowPlaying={currentTrack} 
      />
    </MusicPageContainer>
  );
});

export default MusicPage; 