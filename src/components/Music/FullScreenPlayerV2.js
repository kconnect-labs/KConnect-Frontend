import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import ReactDOM from 'react-dom';
import { 
  Dialog, 
  Box, 
  useMediaQuery, 
  useTheme, 
  IconButton, 
  Typography, 
  Slider,
  Avatar,
  CircularProgress,
  TextField,
  Button,
  Alert,
  Menu,
  MenuItem,
  Snackbar
} from '@mui/material';
import { 
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  QueueMusic as QueueMusicIcon,
  MusicNote as MusicNoteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  VolumeUp as VolumeUpIcon,
  VolumeDown as VolumeDownIcon,
  VolumeMute as VolumeMuteIcon,
  VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { extractDominantColor } from '../../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from '@emotion/styled';

// Remove complex AMLL imports for now and use simple solution
import { 
  PlayIcon, 
  PauseIcon, 
  BackwardIcon, 
  ForwardIcon, 
  ShuffleIcon, 
  RepeatIcon,
  CloseIcon,
  LyricsIcon,
  ContentCopy
} from '../icons/CustomIcons';

const defaultCover = '/static/uploads/system/album_placeholder.jpg';

// Функция для получения полного URL - вынесена из компонента для оптимизации
const getFullUrl = (path) => {
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost');
  
  if (isLocalhost && !path.startsWith('http')) {
    return `https://k-connect.ru${path}`;
  }
  
  return path;
};

// Оптимизированная функция getCoverPath - мемоизирована
const getCoverPath = (track) => {
  if (!track?.cover_path) return getFullUrl(defaultCover);
  
  let coverPath = track.cover_path;
  
  if (coverPath.startsWith('http')) {
    return coverPath;
  }
  
  if (!coverPath.startsWith('/static/')) {
    if (coverPath.startsWith('static/')) {
      coverPath = `/${coverPath}`;
    } else {
      coverPath = `/static/music/${coverPath}`;
    }
  }
  
  return getFullUrl(coverPath);
};

// Оптимизированная функция форматирования времени
const formatTime = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Стилизованные компоненты - оптимизированы для производительности
const PlayerContainer = memo(styled(Box)(({ theme, dominantColor, coverPath }) => ({
  position: 'relative',
  width: '100%',
  height: '100vh',
  background: dominantColor 
    ? `linear-gradient(135deg, ${dominantColor}15 0%, ${dominantColor}08 50%, rgba(0,0,0,0.95) 100%)`
    : 'linear-gradient(135deg, rgba(140,82,255,0.1) 0%, rgba(0,0,0,0.95) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${coverPath || getFullUrl(defaultCover)}) center/cover`,
    opacity: 0.55,
    filter: 'blur(40px)',
    zIndex: -1
  }
})));

const HeaderSection = memo(styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3, 4),
  position: 'relative',
  zIndex: 2
})));

const CloseButton = memo(styled(IconButton)(({ theme }) => ({
  color: 'rgba(255,255,255,0.8)',
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'scale(1.05)'
  },
  transition: 'all 0.2s ease'
})));

const AlbumArtContainer = memo(styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  position: 'relative'
})));

const AlbumArt = memo(styled.img(({ theme }) => ({
  width: 'min(70vw, 400px)',
  height: 'min(70vw, 400px)',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  objectFit: 'cover',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease',
  opacity: 0,
  transform: 'scale(0.4)',
  animation: 'albumArtFadeIn 0.6s ease forwards',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
  },
  '@keyframes albumArtFadeIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.4)'
    },
    '100%': {
      opacity: 1,
      transform: 'scale(0.9)'
    }
  }
})));

const TrackInfo = memo(styled(Box)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '600px',
  marginBottom: theme.spacing(2)
})));

const TrackTitle = memo(styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: 'white',
  marginBottom: theme.spacing(1),
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem'
  }
})));

const TrackArtist = memo(styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: 'rgba(255,255,255,0.8)',
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: 'white',
    textDecoration: 'underline'
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem'
  }
})));

const ProgressContainer = memo(styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
})));

const TimeDisplay = memo(styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '0.75rem',
  fontFamily: 'var(--FF_TITLE, inherit)',
  margin: '5px',
  userSelect: 'none'
})));

const MainControls = memo(styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2)
})));

// Apple Music style control button (без фона, бордеров, теней) - оптимизирован
const ControlButton = memo(styled(IconButton)(({ theme, active, play }) => ({
  background: 'none',
  border: 'none',
  boxShadow: 'none',
  borderRadius: 0,
  padding: play ? 8 : 4,
  margin: 0,
  color: active ? '#fff' : '#d3d3d3',
  transition: 'color 0.2s',
  '&:hover': {
    color: '#fff',
    background: 'none',
    boxShadow: 'none',
    border: 'none'
  },
  minWidth: 0,
  minHeight: 0
})));

const SecondaryControls = memo(styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2)
})));

const VolumeControl = memo(styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: '120px'
})));

// Мемоизированный хедер
const PlayerHeader = memo(({ onClose, onOpenLyricsEditor, showLyricsEditor, theme }) => (
  <HeaderSection>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <CloseButton onClick={onClose}>
        <KeyboardArrowDownIcon />
      </CloseButton>
      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
        Сейчас играет
      </Typography>
    </Box>
    
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton
        onClick={onOpenLyricsEditor}
        sx={{
          color: showLyricsEditor ? theme.palette.primary.main : 'rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
        }}
      >
        <EditIcon />
      </IconButton>
    </Box>
  </HeaderSection>
));

// Мемоизированная информация о треке
const PlayerTrackInfo = memo(({ currentTrack, onArtistClick }) => {
  // Разделяем артистов по запятой и очищаем от лишних пробелов
  const artists = useMemo(() => {
    if (!currentTrack.artist) return [];
    return currentTrack.artist.split(',').map(artist => artist.trim()).filter(artist => artist.length > 0);
  }, [currentTrack.artist]);

  return (
    <TrackInfo>
      <TrackTitle variant="h3">
        {currentTrack.title}
      </TrackTitle>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
        {artists.map((artist, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <TrackArtist 
              variant="h5" 
              onClick={() => onArtistClick(artist)}
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'white',
                  textDecoration: 'underline'
                },
                '@media (max-width: 768px)': {
                  fontSize: '1rem'
                },
                display: 'inline',
                marginBottom: 0
              }}
            >
              {artist}
            </TrackArtist>
            {index < artists.length - 1 && (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '1.2rem',
                  mx: 0.5,
                  cursor: 'default',
                  '@media (max-width: 768px)': {
                    fontSize: '1rem'
                  }
                }}
              >
                ,
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      {currentTrack.album && (
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem'
          }}
        >
          {currentTrack.album}
        </Typography>
      )}
    </TrackInfo>
  );
});

// Мемоизированная обертка диалога
const PlayerDialog = memo(({ open, onClose, children }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullScreen
    PaperProps={{
      sx: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'hidden'
      }
    }}
  >
    {children}
  </Dialog>
));

const FullScreenPlayerCore = memo(({ open, onClose, ...props }) => {
  const [dominantColor, setDominantColor] = useState(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showLyricsEditor, setShowLyricsEditor] = useState(false);
  const [showTimestampEditor, setShowTimestampEditor] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [lyricsData, setLyricsData] = useState(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [uploadingLyrics, setUploadingLyrics] = useState(false);
  const [lyricsError, setLyricsError] = useState(null);
  
  // New states for lyrics
  const [lyricsText, setLyricsText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const fileInputRef = useRef(null);
  
  // New state for lyrics display mode
  const [lyricsDisplayMode, setLyricsDisplayMode] = useState(false); // false = cover mode, true = lyrics mode

  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  const { 
    currentTrack,
    currentSection,
    playlistTracks,
    playTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    audioRef,
    currentTime: contextCurrentTime,
    duration: contextDuration,
    volume: contextVolume,
    setVolume: setContextVolume,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    likeTrack
  } = useMusic();

  // Мемоизированные значения для оптимизации
  const coverPath = useMemo(() => getCoverPath(currentTrack), [currentTrack?.cover_path]);
  
  const trackId = useMemo(() => currentTrack?.id, [currentTrack?.id]);
  
  const formattedCurrentTime = useMemo(() => formatTime(currentTime), [currentTime]);
  const formattedDuration = useMemo(() => formatTime(duration), [duration]);
  
  const volumePercentage = useMemo(() => Math.round((isMuted ? 0 : volume) * 100), [volume, isMuted]);

  // Синхронизация времени и громкости с контекстом - оптимизировано
  useEffect(() => {
    if (contextCurrentTime !== undefined) {
      setCurrentTime(contextCurrentTime);
    }
  }, [contextCurrentTime]);

  useEffect(() => {
    if (contextDuration !== undefined) {
      setDuration(contextDuration);
    }
  }, [contextDuration]);

  useEffect(() => {
    if (contextVolume !== undefined) {
      setVolume(contextVolume);
    }
  }, [contextVolume]);

  // Оптимизированное обновление времени для синхронизации текстов - уменьшенная частота обновлений
  useEffect(() => {
    if (!open || !lyricsData?.has_synced_lyrics) return;

    let rafId;
    let lastTime = 0;
    
    const updateTimeForLyrics = () => {
      if (audioRef?.current && !audioRef.current.paused) {
        const actualCurrentTime = audioRef.current.currentTime;
        // Обновляем только если изменение больше 0.1 секунды для оптимизации
        if (Math.abs(actualCurrentTime - lastTime) > 0.1) {
        setCurrentTime(actualCurrentTime);
          lastTime = actualCurrentTime;
      }
      }
      rafId = requestAnimationFrame(updateTimeForLyrics);
    };

    rafId = requestAnimationFrame(updateTimeForLyrics);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [open, lyricsData?.has_synced_lyrics, audioRef]);

  // Извлечение доминирующего цвета из обложки - мемоизировано
  useEffect(() => {
    if (currentTrack?.cover_path) {
      extractDominantColor(
        currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg',
        (color) => {
          setDominantColor(color);
        }
      );
    }
  }, [currentTrack?.cover_path]); // Только при изменении cover_path

  // Загрузка текстов песен - оптимизировано
  useEffect(() => {
    if (!trackId || !open) {
      setLyricsData(null);
      setLoadingLyrics(false);
      return;
    }
    
      setLoadingLyrics(true);
      
      if (currentTrack.lyricsData) {
        setLyricsData(currentTrack.lyricsData);
        setLoadingLyrics(false);
      } else {
      fetch(`/api/music/${trackId}/lyrics`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Lyrics not found');
            }
            return response.json();
          })
          .then(data => {
            setLyricsData(data);
            setLoadingLyrics(false);
            
            if (currentTrack) {
              currentTrack.lyricsData = data;
            }
          })
          .catch(error => {
            console.error('Error fetching lyrics:', error);
            setLyricsData(null);
            setLoadingLyrics(false);
          });
      }
  }, [trackId, open, currentTrack]);

  // Управление скроллом страницы - оптимизировано
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
    }
  }, [open]);

  // Обработчики
  const handleTimeChange = useCallback((event, newValue) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
      // Принудительно обновляем время в контексте
      if (setContextVolume && typeof newValue === 'number') {
        // Используем временный хак для обновления времени
        window.audioTiming = window.audioTiming || {};
        window.audioTiming.currentTime = newValue;
      }
    }
  }, [audioRef, setContextVolume]);

  const handleVolumeChange = useCallback((event, newValue) => {
    setVolume(newValue);
    setContextVolume(newValue);
    setIsMuted(newValue === 0);
  }, [setContextVolume]);

  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(1);
      setContextVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setContextVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, setContextVolume]);

  const handleToggleLike = useCallback(async () => {
    if (!trackId) return;
    
    try {
      await likeTrack(trackId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [trackId, likeTrack]);

  const handleCopyLink = useCallback(async () => {
    if (!trackId) return;
    
    const url = `https://k-connect.ru/music/track/${trackId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      console.log('Ссылка скопирована в буфер обмена');
    } catch (error) {
      console.error('Ошибка при копировании ссылки:', error);
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, [trackId]);

  const goToArtist = useCallback(async (artistName) => {
    if (!artistName || artistName.trim() === '') return;
    
    try {
      const response = await axios.get(`/api/search/artists?query=${encodeURIComponent(artistName)}`);
      
      if (response.data?.artists?.length > 0) {
        const exactMatch = response.data.artists.find(
          a => a.name.toLowerCase() === artistName.toLowerCase()
        );
        
        if (exactMatch) {
          navigate(`/artist/${exactMatch.id}`);
          onClose();
          return;
        }
        
        navigate(`/artist/${response.data.artists[0].id}`);
        onClose();
      }
    } catch (error) {
      console.error('Error searching artist:', error);
    }
  }, [navigate, onClose]);

  const handleUploadLyrics = useCallback(async () => {
    if (!trackId) return;
    
    setUploadingLyrics(true);
    setLyricsError(null);
    
    try {
      const response = await fetch(`/api/music/${trackId}/lyrics/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: `[ti:${currentTrack.title || 'Unknown Title'}]\n[ar:${currentTrack.artist || 'Unknown Artist'}]\n[al:${currentTrack.album || 'Unknown Album'}]\n[by:К-Коннект Авто-Генерация]\n\n[00:00.00]Текст песни будет добавлен здесь\n[00:05.00]Вы можете отредактировать этот шаблон\n[00:10.00]И добавить правильные временные метки`,
          source_url: 'manually_added'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Перезагружаем тексты после успешной загрузки
        const lyricsResponse = await fetch(`/api/music/${trackId}/lyrics`);
        if (lyricsResponse.ok) {
          const newLyricsData = await lyricsResponse.json();
          setLyricsData(newLyricsData);
          if (currentTrack) {
            currentTrack.lyricsData = newLyricsData;
          }
        }
        setShowLyrics(true);
      } else {
        setLyricsError(data.error || 'Не удалось загрузить текст песни');
      }
    } catch (error) {
      console.error('Error uploading lyrics:', error);
      setLyricsError('Ошибка при загрузке текста песни');
    } finally {
      setUploadingLyrics(false);
    }
  }, [trackId, currentTrack]);

  const handleOpenLyricsEditor = useCallback(() => {
    setShowLyricsEditor(true);
    setShowLyrics(false);
    setShowTimestampEditor(false);
    // Initialize lyrics text if available
    if (lyricsData?.has_lyrics && lyricsData.lyrics) {
      setLyricsText(lyricsData.lyrics);
    } else {
      setLyricsText('');
    }
  }, [lyricsData]);

  const handleOpenTimestampEditor = useCallback(() => {
    setShowTimestampEditor(true);
    setShowLyricsEditor(false);
    setShowLyrics(false);
  }, []);

  const handleLyricsChange = useCallback((e) => {
    setLyricsText(e.target.value);
  }, []);

  const handleSaveLyrics = useCallback(async () => {
    if (!trackId) {
      setLyricsError('Трек не выбран');
      return;
    }
    
    if (!lyricsText.trim()) {
      setLyricsError('Текст песни не может быть пустым');
      return;
    }
    
    setIsSaving(true);
    setLyricsError('');
    
    try {
      const response = await fetch(`/api/music/${trackId}/lyrics/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: lyricsText,
          source_url: 'manually_added'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Текст успешно сохранен',
          severity: 'success'
        });
        
        // Reload lyrics data
        const lyricsResponse = await fetch(`/api/music/${trackId}/lyrics`);
        if (lyricsResponse.ok) {
          const newLyricsData = await lyricsResponse.json();
          setLyricsData(newLyricsData);
          if (currentTrack) {
            currentTrack.lyricsData = newLyricsData;
          }
        }
        
        setShowLyricsEditor(false);
        setShowLyrics(true);
      } else {
        setLyricsError(data.error || 'Не удалось сохранить текст');
        
        if (data.warning) {
          setSnackbar({
            open: true,
            message: data.warning,
            severity: 'warning'
          });
        }
      }
    } catch (error) {
      console.error('Error saving lyrics:', error);
      setLyricsError('Ошибка при сохранении текста. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  }, [trackId, lyricsText, currentTrack]);

  const handleOpenMenu = useCallback((event) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Мемоизированные цветовые значения для оптимизации
  const activeColor = useMemo(() => {
    if (dominantColor) {
      return `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`;
    }
    return '#9a7ace';
  }, [dominantColor]);
  
  const buttonBackgroundColor = useMemo(() => {
    if (dominantColor) {
      return `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.15)`;
    }
    return 'rgba(255, 45, 85, 0.15)';
  }, [dominantColor]);

  // Оптимизированные дополнительные обработчики
  const handleDownloadLyricsForSync = useCallback(() => {
    if (!trackId || !lyricsText.trim()) {
      setLyricsError('Нет доступного текста для скачивания');
      return;
    }

    try {
      const lines = lyricsText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      let lrcContent = "[ti:" + (currentTrack.title || "Unknown Title") + "]\n";
      lrcContent += "[ar:" + (currentTrack.artist || "Unknown Artist") + "]\n";
      lrcContent += "[al:" + (currentTrack.album || "Unknown Album") + "]\n";
      lrcContent += "[by:К-Коннект Авто-Генерация LRC]\n\n";
      
      lines.forEach(line => {
        lrcContent += "[00:00.00]" + line + "\n";
      });
      
      const lrcBlob = new Blob([lrcContent], { type: 'text/plain' });
      const lrcUrl = URL.createObjectURL(lrcBlob);
      const lrcLink = document.createElement('a');
      lrcLink.href = lrcUrl;
      lrcLink.download = `${currentTrack.artist} - ${currentTrack.title}.lrc`;
      
      setSnackbar({
        open: true,
        message: 'Скачивание шаблона LRC для синхронизации',
        severity: 'info'
      });
      
      lrcLink.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(lrcUrl);
      }, 2000);
      
      handleCloseMenu();
    } catch (error) {
      console.error("Error generating download template:", error);
      setLyricsError('Ошибка при создании шаблона для синхронизации');
    }
  }, [trackId, lyricsText, currentTrack, handleCloseMenu]);

  const handleOpenFileSelector = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    handleCloseMenu();
  }, [handleCloseMenu]);

  const handleFileSelected = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    uploadSyncFile(file);
  }, []);

  const uploadSyncFile = useCallback(async (file) => {
    if (!file || !trackId) {
      setLyricsError('Нет файла для загрузки или трек не выбран');
      return;
    }
    
    setUploading(true);
    setLyricsError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/music/${trackId}/lyrics/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось загрузить файл синхронизации');
      }
      
      const result = await response.json();
      
      setSnackbar({
        open: true,
        message: 'Синхронизация успешно загружена',
        severity: 'success'
      });
      
      // Reload lyrics data
      const lyricsResponse = await fetch(`/api/music/${trackId}/lyrics`);
      if (lyricsResponse.ok) {
        const newLyricsData = await lyricsResponse.json();
        setLyricsData(newLyricsData);
        if (currentTrack) {
          currentTrack.lyricsData = newLyricsData;
        }
      }
      
      setShowLyricsEditor(false);
      setShowLyrics(true);
      
    } catch (error) {
      console.error("Error uploading sync file:", error);
      setLyricsError(`Ошибка при загрузке файла: ${error.message}`);
      
      setSnackbar({
        open: true,
        message: `Ошибка при загрузке синхронизации: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  }, [trackId, currentTrack]);

  const handleToggleLyricsDisplay = useCallback(() => {
    setLyricsDisplayMode(prev => !prev);
  }, []);

  // Мемоизированные строки для оптимизации с стабильными ключами
  const filteredLines = useMemo(() => {
    if (lyricsData?.has_synced_lyrics && Array.isArray(lyricsData.synced_lyrics)) {
      return lyricsData.synced_lyrics
        .filter(line => line && line.text !== undefined)
        .map((line, index) => ({
          ...line,
          key: `${index}-${line.text.slice(0, 10)}` // Стабильный ключ
        }));
    }
    if (lyricsData?.lyrics) {
      return lyricsData.lyrics
        .split('\n')
        .filter(line => line.trim())
        .map((line, index) => ({
          text: line,
          key: `static-${index}-${line.slice(0, 10)}` // Стабильный ключ
        }));
    }
    return [];
  }, [lyricsData]);

  if (!open || !currentTrack) return null;

  return (
    <PlayerDialog open={open} onClose={onClose}>
      <PlayerContainer dominantColor={dominantColor} coverPath={coverPath}>
        {/* Header */}
        <PlayerHeader onClose={onClose} onOpenLyricsEditor={handleOpenLyricsEditor} showLyricsEditor={showLyricsEditor} theme={theme} />

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: theme.spacing(0, 4)
        }}>
          {/* Album Art or Lyrics Display */}
          <AlbumArtLyricsContainer 
            lyricsDisplayMode={lyricsDisplayMode} 
                    lyricsData={lyricsData}
            loadingLyrics={loadingLyrics} 
                    currentTime={currentTime}
                    dominantColor={dominantColor}
                    theme={theme}
            coverPath={coverPath} 
            currentTrack={currentTrack}
            filteredLines={filteredLines}
          />

          {/* Track Info */}
          <PlayerTrackInfo currentTrack={currentTrack} onArtistClick={goToArtist} />

          {/* Progress Bar */}
          <ProgressSlider 
            currentTime={currentTime} 
            duration={duration} 
            onTimeChange={handleTimeChange} 
            formattedCurrentTime={formattedCurrentTime} 
            formattedDuration={formattedDuration}
          />

          {/* Main Controls */}
          <MainPlayControls 
            isShuffled={isShuffled} 
            toggleShuffle={toggleShuffle} 
            prevTrack={prevTrack} 
            isPlaying={isPlaying} 
            togglePlay={togglePlay} 
            nextTrack={nextTrack} 
            repeatMode={repeatMode} 
            toggleRepeat={toggleRepeat}
          />

          {/* Secondary Controls */}
          <SecondaryPlayControls 
            currentTrack={currentTrack} 
            onToggleLike={handleToggleLike} 
            lyricsData={lyricsData} 
            lyricsDisplayMode={lyricsDisplayMode} 
            onToggleLyricsDisplay={handleToggleLyricsDisplay} 
            onCopyLink={handleCopyLink}
          />

          {/* Desktop Volume Control */}
          {!isMobile && (
            <VolumeControls 
              isMuted={isMuted} 
              volume={volume} 
              volumePercentage={volumePercentage} 
              onToggleMute={handleToggleMute} 
              onVolumeChange={handleVolumeChange}
            />
          )}
        </Box>

        {/* Lyrics Panel - Only for Editor */}
          {showLyricsEditor && (
          <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '90%',
                background: dominantColor 
                  ? `linear-gradient(135deg, ${dominantColor}20 0%, ${dominantColor}10 50%, rgba(0,0,0,0.9) 100%)`
                  : 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(60px)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                padding: theme.spacing(3),
                overflow: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
              justifyContent: 'center',
              transform: 'translateY(0)',
              animation: 'slideUpModal 0.3s ease-out forwards',
              '@keyframes slideUpModal': {
                '0%': {
                  transform: 'translateY(100%)',
                },
                '100%': {
                  transform: 'translateY(0)',
                }
              }
              }}
            >
              <IconButton
                onClick={() => setShowLyricsEditor(false)}
                sx={{ 
                  position: 'absolute',
                  top: theme.spacing(1),
                  left: theme.spacing(3),
                  color: 'rgba(255,255,255,0.7)', 
                  '&:hover': { color: 'white' },
                  zIndex: 1
                }}
              >
                <CloseIcon size={24} color="rgba(255,255,255,0.7)" />
              </IconButton>
              
              <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', position: 'relative', mt: 2.5 }}>
                <LyricsEditorContent 
                  lyricsData={lyricsData}
                  currentTrack={currentTrack}
                  lyricsText={lyricsText}
                  lyricsError={lyricsError}
                  isSaving={isSaving}
                  uploading={uploading}
                  menuAnchorEl={menuAnchorEl}
                  fileInputRef={fileInputRef}
                  dominantColor={dominantColor}
                getActiveColor={activeColor}
                getButtonBackgroundColor={buttonBackgroundColor}
                  handleLyricsChange={handleLyricsChange}
                  handleSaveLyrics={handleSaveLyrics}
                  handleOpenMenu={handleOpenMenu}
                  handleCloseMenu={handleCloseMenu}
                  handleDownloadLyricsForSync={handleDownloadLyricsForSync}
                  handleOpenFileSelector={handleOpenFileSelector}
                  handleFileSelected={handleFileSelected}
                  onCancel={() => setShowLyricsEditor(false)}
                  onOpenTimestampEditor={handleOpenTimestampEditor}
                />
              </Box>
          </Box>
          )}

        {/* Playlist Panel */}
          {showPlaylist && (
          <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                backgroundColor: 'rgba(0,0,0,0.9)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                padding: theme.spacing(3),
              overflow: 'auto',
              transform: 'translateY(0)',
              animation: 'slideUpModal 0.3s ease-out forwards',
              '@keyframes slideUpModal': {
                '0%': {
                  transform: 'translateY(100%)',
                },
                '100%': {
                  transform: 'translateY(0)',
                }
              }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
                pb: 1,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
                  Плейлист ({playlistTracks[currentSection]?.length || 0})
                </Typography>
                <IconButton
                  onClick={() => setShowPlaylist(false)}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  <CloseIcon size={24} color="rgba(255,255,255,0.7)" />
                </IconButton>
              </Box>
              
              <Box sx={{ maxHeight: 'calc(100% - 80px)', overflow: 'auto' }}>
                {playlistTracks[currentSection]?.length > 0 ? (
                  playlistTracks[currentSection].map((track, index) => (
                    <Box
                      key={track.id}
                      onClick={() => playTrack(track, currentSection)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: theme.spacing(1.5),
                        borderRadius: 1,
                        marginBottom: 0.5,
                        backgroundColor: currentTrack?.id === track.id 
                          ? 'rgba(255,255,255,0.2)' 
                          : 'rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: currentTrack?.id === track.id 
                            ? 'rgba(255,255,255,0.3)' 
                            : 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      <Avatar 
                        src={getCoverPath(track)}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        <MusicNoteIcon />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            color: currentTrack?.id === track.id ? theme.palette.primary.main : 'white',
                            fontWeight: currentTrack?.id === track.id ? 600 : 400,
                            fontSize: '0.9rem'
                          }}
                        >
                          {track.title}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.8rem'
                          }}
                        >
                          {track.artist}
                        </Typography>
                      </Box>
                      {currentTrack?.id === track.id && (
                        <PlayIcon size={24} color={theme.palette.primary.main} />
                      )}
                    </Box>
                  ))
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    color: 'rgba(255,255,255,0.7)',
                    py: 4
                  }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Плейлист пуст
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Добавьте треки в плейлист
                    </Typography>
                  </Box>
                )}
              </Box>
          </Box>
          )}
      </PlayerContainer>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PlayerDialog>
  );
});

// Lyrics Editor Content Component - оптимизирован с memo
const LyricsEditorContent = memo(({
  lyricsData,
  currentTrack,
  lyricsText,
  lyricsError,
  isSaving,
  uploading,
  menuAnchorEl,
  fileInputRef,
  dominantColor,
  getActiveColor,
  getButtonBackgroundColor,
  handleLyricsChange,
  handleSaveLyrics,
  handleOpenMenu,
  handleCloseMenu,
  handleDownloadLyricsForSync,
  handleOpenFileSelector,
  handleFileSelected,
  onCancel,
  onOpenTimestampEditor
}) => {
  return (
    <Box sx={{ width: '100%', zIndex: 99000 }}>
      <Typography variant="h5" sx={{ 
        color: 'white', 
        mb: 3, 
        fontWeight: 600,
        textAlign: 'center'
      }}>
        Редактирование текста
      </Typography>

      {lyricsError && (
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ mb: 2 }}
        >
          {lyricsError}
        </Alert>
      )}
      
      <Alert 
        severity="info" 
        icon={<WarningIcon />}
        variant="outlined"
        sx={{ 
          mb: 3,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.9)'
        }}
      >
        Вы можете найти тексты песен на Genius или других сервисах. 
        Пожалуйста, соблюдайте авторские права при добавлении текстов.
      </Alert>
      
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={lyricsText}
        onChange={handleLyricsChange}
        placeholder="Введите текст песни здесь..."
        minRows={10}
        maxRows={20}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.15)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.3)',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${getActiveColor} !important`,
            borderWidth: '1px',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255,255,255,0.5)',
            opacity: 1
          }
        }}
      />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Button
          variant="outlined"
          onClick={handleOpenMenu}
          startIcon={<ScheduleIcon />}
          sx={{
            borderColor: getButtonBackgroundColor,
            color: getActiveColor,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: getButtonBackgroundColor,
              borderColor: getActiveColor
            }
          }}
        >
          Синхронизация
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={onCancel}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Отмена
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSaveLyrics}
            disabled={isSaving || uploading}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            sx={{ 
              backgroundColor: getActiveColor,
              boxShadow: dominantColor ? `0 4px 12px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.3)` : undefined,
              '&:hover': {
                backgroundColor: getActiveColor,
                filter: 'brightness(1.1)'
              }
            }}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>
      </Box>

      {/* LRC File handling menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(25, 25, 25, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            color: 'white',
            minWidth: '250px'
          }
        }}
      >
        <MenuItem 
          onClick={handleDownloadLyricsForSync}
          sx={{
            padding: '12px',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
          }}
        >
          <DownloadIcon sx={{ marginRight: '12px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }} />
          <Typography variant="body2">Скачать LRC шаблон для синхронизации</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={handleOpenFileSelector}
          sx={{
            padding: '12px',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
          }}
        >
          <UploadIcon sx={{ marginRight: '12px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }} />
          <Typography variant="body2">Загрузить синхронизацию (LRC/JSON)</Typography>
        </MenuItem>
      </Menu>
      
      {/* Hidden file input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept=".lrc,.json"
        style={{ display: 'none' }}
      />
    </Box>
  );
});

// Оптимизированный компонент для отдельной строки текста с анимациями
const LyricsLine = memo(({ 
  text, 
  isActive, 
  isPrevious, 
  isNext, 
  lineKey, // Добавляем ключ для анимации
  isMainDisplay 
}) => {
  const baseStyles = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    lineHeight: isActive ? 1.2 : 1.3,
    letterSpacing: isActive ? '-0.02em' : '-0.01em',
    textShadow: 'none',
    width: '100%',
    margin: '0 auto',
    wordBreak: 'break-word',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    transform: 'translateY(-50%)',
    zIndex: isActive ? 10 : 5,
    // Убираем transition чтобы не конфликтовать с animation
    willChange: 'opacity, transform, filter',
  };

  if (isActive) {
    return (
      <Box
        key={`active-${lineKey}`}
        className="lyrics-line"
        sx={{
          ...baseStyles,
          top: '70%',
          opacity: 1,
          filter: 'none',
          transform: 'translateY(-50%) scale(1)',
          // Упрощенная анимация появления активной строки
          animation: 'activeLineAppear 0.5s ease-out forwards',
          '@keyframes activeLineAppear': {
            '0%': {
              opacity: 0.5,
              transform: 'translateY(-40%) scale(0.92)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(-50%) scale(1)',
            }
          }
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontSize: isMainDisplay ? { xs: '2rem', sm: '2.4rem', md: '2.8rem' } : { xs: '1.6rem', sm: '1.8rem' },
            fontWeight: 600,
            ...baseStyles,
            maxWidth: isMainDisplay ? { xs: '95%', sm: '90%', md: '85%', lg: '80%' } : { xs: '98%', sm: '95%' },
            minHeight: isMainDisplay ? '3.5em' : '2.5em',
            position: 'static',
            textShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.1)',
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  }

  if (isPrevious) {
    return (
      <Box
        key={`prev-${lineKey}`}
        className="lyrics-line"
        sx={{
          ...baseStyles,
          top: '35%',
          opacity: 0.3,
          filter: 'blur(2.5px)',
          transform: 'translateY(-50%) scale(0.85)',
          // Упрощенная анимация ухода предыдущей строки
          animation: 'previousLineExit 0.4s ease-out forwards',
          '@keyframes previousLineExit': {
            '0%': {
              opacity: 0.6,
              transform: 'translateY(-50%) scale(0.92)',
            },
            '100%': {
              opacity: 0.3,
              transform: 'translateY(-50%) scale(0.85)',
            }
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: isMainDisplay ? { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' } : { xs: '1rem', sm: '1.2rem' },
            fontWeight: 400,
            ...baseStyles,
            maxWidth: isMainDisplay ? { xs: '92%', sm: '87%', md: '82%', lg: '75%' } : { xs: '96%', sm: '92%' },
            position: 'static',
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  }

  if (isNext) {
    return (
      <Box
        key={`next-${lineKey}`}
        className="lyrics-line"
        sx={{
          ...baseStyles,
          top: '80%',
          opacity: 0.25,
          filter: 'blur(3px)',
          transform: 'translateY(-50%) scale(0.8)',
          // Упрощенная анимация появления следующей строки
          animation: 'nextLineEnter 0.4s ease-out forwards',
          '@keyframes nextLineEnter': {
            '0%': {
              opacity: 0.1,
              transform: 'translateY(-60%) scale(0.75)',
            },
            '100%': {
              opacity: 0.25,
              transform: 'translateY(-50%) scale(0.8)',
            }
          }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.25)',
            fontSize: isMainDisplay ? { xs: '1rem', sm: '1.2rem', md: '1.4rem' } : { xs: '0.9rem', sm: '1rem' },
            fontWeight: 400,
            ...baseStyles,
            maxWidth: isMainDisplay ? { xs: '90%', sm: '85%', md: '80%', lg: '70%' } : { xs: '94%', sm: '90%' },
            position: 'static',
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  }

  return null;
}, (prevProps, nextProps) => {
  // Предотвращаем ненужные обновления во время анимаций
  return (
    prevProps.text === nextProps.text &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.isPrevious === nextProps.isPrevious &&
    prevProps.isNext === nextProps.isNext &&
    prevProps.lineKey === nextProps.lineKey &&
    prevProps.isMainDisplay === nextProps.isMainDisplay
  );
});

// Оптимизированный компонент прогресс-бара
const LyricsProgressDots = memo(({ total, current }) => (
  <Box sx={{
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    zIndex: 10
  }}>
    {Array.from({ length: Math.min(total, 15) }, (_, i) => (
      <Box
        key={i}
        sx={{
          width: i === current ? '16px' : '4px',
          height: '4px',
          borderRadius: '2px',
          backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.3)',
          transition: 'all 0.3s ease'
        }}
      />
    ))}
  </Box>
));

// Оптимизированный компонент для статических текстов
const StaticLyricsLine = memo(({ text, index, isMainDisplay }) => (
  <Typography
    variant="h5"
    className="lyrics-line"
    sx={{
      color: 'white',
      fontSize: isMainDisplay ? { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' } : { xs: '1.2rem', sm: '1.4rem' },
      fontWeight: 500,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      mb: 0,
      textShadow: '0 2px 8px rgba(0,0,0,0.2)',
      width: '100%',
      maxWidth: isMainDisplay ? { xs: '95%', sm: '90%', md: '85%', lg: '75%' } : { xs: '98%', sm: '95%' },
      margin: '0 auto',
      wordBreak: 'break-word',
      hyphens: 'auto',
      textAlign: 'left',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '0.8rem',
      opacity: 0,
      // Упрощенная анимация появления
      animation: `staticLineAppear 0.3s ease-out forwards`,
      animationDelay: `${index * 0.05}s`,
      '@keyframes staticLineAppear': {
        '0%': {
          opacity: 0,
          transform: 'translateY(20px)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)',
        }
      }
    }}
  >
    {text}
  </Typography>
));

// Ультра-оптимизированный компонент для отображения текстов - БЕЗ framer-motion
const LyricsModernView = memo(({ lyricsData, loading, currentTime, dominantColor, theme, filteredLines, isMainDisplay = false }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // УЛЬТРА-оптимизированное обновление строк - только при реальных изменениях
  const updateCurrentLine = useCallback((time) => {
    if (!lyricsData?.has_synced_lyrics || !filteredLines || filteredLines.length === 0) return;

    const currentTimeMs = time * 1000;
    
    // Бинарный поиск для оптимизации
    let left = 0;
    let right = filteredLines.length - 1;
    let newLineIndex = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (filteredLines[mid].startTimeMs <= currentTimeMs) {
        newLineIndex = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    if (newLineIndex !== currentLineIndex && newLineIndex >= 0) {
      setCurrentLineIndex(newLineIndex);
    }
  }, [lyricsData, filteredLines, currentLineIndex]);

  // Увеличенный дебаунс для меньшего количества обновлений
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateCurrentLine(currentTime);
    }, 300); // Компромисс между плавностью и отзывчивостью

    return () => clearTimeout(timeoutId);
  }, [currentTime, updateCurrentLine]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: isMainDisplay ? '100%' : 400,
        width: '100%'
      }}>
        <CircularProgress 
          size={46} 
          thickness={4} 
          sx={{ 
            color: dominantColor ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})` : theme.palette.primary.main 
          }} 
        />
      </Box>
    );
  }
  
  if (!lyricsData || !filteredLines || filteredLines.length === 0) {
    if (isMainDisplay) return null;
    return (
      <Box sx={{ 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.7)', 
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Нет текста песни для этого трека
        </Typography>
      </Box>
    );
  }

  // Синхронизированные тексты - БЕЗ AnimatePresence и motion.div
  if (lyricsData.has_synced_lyrics && filteredLines.length > 0) {
    return (
        <Box 
          className="lyrics-container"
          sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',

      }}>
        {/* Предыдущая строка */}
        {currentLineIndex > 0 && filteredLines[currentLineIndex - 1] && (
          <LyricsLine
            text={filteredLines[currentLineIndex - 1].text}
            isPrevious={true}
            isMainDisplay={isMainDisplay}
            lineKey={filteredLines[currentLineIndex - 1].key}
          />
        )}

        {/* Текущая строка */}
        {currentLineIndex >= 0 && currentLineIndex < filteredLines.length && filteredLines[currentLineIndex] && (
          <LyricsLine
            text={filteredLines[currentLineIndex].text}
            isActive={true}
            isMainDisplay={isMainDisplay}
            lineKey={filteredLines[currentLineIndex].key}
          />
        )}

        {/* Следующая строка */}
        {currentLineIndex < filteredLines.length - 1 && filteredLines[currentLineIndex + 1] && (
          <LyricsLine
            text={filteredLines[currentLineIndex + 1].text}
            isNext={true}
            isMainDisplay={isMainDisplay}
            lineKey={filteredLines[currentLineIndex + 1].key}
          />
        )}

        {/* Прогресс-бар */}
        <LyricsProgressDots 
          total={filteredLines.length} 
          current={currentLineIndex} 
        />
      </Box>
    );
  }

  // Статические тексты - упрощенная анимация через CSS
  if (lyricsData.lyrics && filteredLines.length > 0) {
    return (
      <Box 
        className="lyrics-container"
        sx={{
          width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'left',
        overflow: 'auto',
        padding: isMainDisplay ? '20px 0' : '10px 0',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        // Упрощенная анимация появления контейнера
        animation: 'containerFadeIn 0.3s ease-out forwards',
        '@keyframes containerFadeIn': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          }
        }
      }}>
        {filteredLines.map((line, index) => (
          <StaticLyricsLine
            key={line.key}
            text={line.text}
            index={index}
            isMainDisplay={isMainDisplay}
          />
        ))}
      </Box>
    );
  }
  
  return null;
}, (prevProps, nextProps) => {
  // Кастомное сравнение для компонента текстов
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.isMainDisplay === nextProps.isMainDisplay &&
    prevProps.lyricsData === nextProps.lyricsData &&
    prevProps.filteredLines === nextProps.filteredLines &&
    // Сравниваем время только с точностью до 500мс для текстов
    Math.floor(prevProps.currentTime * 2) === Math.floor(nextProps.currentTime * 2) &&
    prevProps.dominantColor === nextProps.dominantColor &&
    prevProps.theme === nextProps.theme
  );
});

// Мемоизированный контейнер для обложки/текстов с глубоким сравнением
const AlbumArtLyricsContainer = memo(({ 
  lyricsDisplayMode, 
  lyricsData, 
  loadingLyrics, 
  currentTime, 
  dominantColor, 
  theme, 
  coverPath, 
  currentTrack,
  filteredLines 
}) => (
  <AlbumArtContainer sx={{maxHeight:'390px', width: '100%'}}>
    {lyricsDisplayMode && (lyricsData?.has_synced_lyrics || lyricsData?.lyrics) ? (
      <Box
        key="lyrics-display"
              sx={{
                width: '100%',
          height: '100%',
                  display: 'flex',
                  alignItems: 'center',
          justifyContent: 'center', 
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <LyricsModernView
          lyricsData={lyricsData}
          loading={loadingLyrics}
          currentTime={currentTime}
          dominantColor={dominantColor}
          theme={theme}
          filteredLines={filteredLines}
          isMainDisplay={true}
        />
            </Box>
    ) : (
      <AlbumArt
        key="album-cover"
        src={coverPath}
        alt={currentTrack.title}
      />
    )}
  </AlbumArtContainer>
), (prevProps, nextProps) => {
  // Кастомное сравнение для предотвращения ререндеров
  return (
    prevProps.lyricsDisplayMode === nextProps.lyricsDisplayMode &&
    prevProps.loadingLyrics === nextProps.loadingLyrics &&
    prevProps.coverPath === nextProps.coverPath &&
    prevProps.currentTrack?.id === nextProps.currentTrack?.id &&
    // Сравниваем время только с точностью до секунды
    Math.floor(prevProps.currentTime) === Math.floor(nextProps.currentTime) &&
    prevProps.lyricsData === nextProps.lyricsData &&
    prevProps.filteredLines === nextProps.filteredLines
  );
});

// Мемоизированный компонент прогресс-бара с оптимизацией
const ProgressSlider = memo(({ 
  currentTime, 
  duration, 
  onTimeChange, 
  formattedCurrentTime, 
  formattedDuration 
}) => (
  <ProgressContainer>
    <Slider
      value={currentTime}
      max={duration}
      onChange={onTimeChange}
                  sx={{
                    color: 'white',
        '& .MuiSlider-track': {
          backgroundColor: 'white',
          height: 6,
          borderRadius: '2.5px'
        },
        '& .MuiSlider-rail': {
          backgroundColor: 'rgba(255,255,255,0.5)',
          height: 6,
          borderRadius: '2.5px'
        },
        '& .MuiSlider-thumb': {
          backgroundColor: 'white',
          width: 16,
          height: 16,
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(255,255,255,0.2)'
          }
        },
        '&:hover': {
          '& .MuiSlider-track': {
            height: 10,
            borderRadius: '10px'
          },
          '& .MuiSlider-rail': {
            height: 10,
            borderRadius: '10px'
          }
        },
      }}
    />
    <TimeDisplay>
      <span>{formattedCurrentTime}</span>
      <span>{formattedDuration}</span>
    </TimeDisplay>
  </ProgressContainer>
), (prevProps, nextProps) => {
  // Обновляем только если время изменилось значительно или функции поменялись
  return (
    Math.floor(prevProps.currentTime) === Math.floor(nextProps.currentTime) &&
    prevProps.duration === nextProps.duration &&
    prevProps.onTimeChange === nextProps.onTimeChange &&
    prevProps.formattedCurrentTime === nextProps.formattedCurrentTime &&
    prevProps.formattedDuration === nextProps.formattedDuration
  );
});

// Мемоизированные основные контролы с глубоким сравнением
const MainPlayControls = memo(({ 
  isShuffled, 
  toggleShuffle, 
  prevTrack, 
  isPlaying, 
  togglePlay, 
  nextTrack, 
  repeatMode, 
  toggleRepeat 
}) => (
  <MainControls>
    <ControlButton onClick={toggleShuffle} active={isShuffled ? 1 : 0}>
      <ShuffleIcon size={28} color={isShuffled ? '#fff' : '#d3d3d3'} />
    </ControlButton>
    
    <ControlButton onClick={prevTrack}>
      <BackwardIcon size={32} color="#d3d3d3" />
    </ControlButton>
    
    <ControlButton 
      onClick={togglePlay}
      play={1}
      sx={{ mx: 2 }}
    >
      {isPlaying
        ? <PauseIcon size={48} color="#fff" />
        : <PlayIcon size={48} color="#fff" />}
    </ControlButton>
    
    <ControlButton onClick={nextTrack}>
      <ForwardIcon size={32} color="#d3d3d3" />
    </ControlButton>
    
    <ControlButton onClick={toggleRepeat} active={repeatMode !== 'off' ? 1 : 0}>
      <RepeatIcon size={28} color={repeatMode !== 'off' ? '#fff' : '#d3d3d3'} />
    </ControlButton>
  </MainControls>
), (prevProps, nextProps) => {
  // Сравниваем только значимые изменения
  return (
    prevProps.isShuffled === nextProps.isShuffled &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.repeatMode === nextProps.repeatMode &&
    prevProps.toggleShuffle === nextProps.toggleShuffle &&
    prevProps.togglePlay === nextProps.togglePlay &&
    prevProps.prevTrack === nextProps.prevTrack &&
    prevProps.nextTrack === nextProps.nextTrack &&
    prevProps.toggleRepeat === nextProps.toggleRepeat
  );
});

// Мемоизированные вторичные контролы с глубоким сравнением
const SecondaryPlayControls = memo(({ 
  currentTrack, 
  onToggleLike, 
  lyricsData, 
  lyricsDisplayMode, 
  onToggleLyricsDisplay, 
  onCopyLink 
}) => (
  <SecondaryControls>
    <ControlButton
      onClick={onToggleLike}
      className="secondary"
              sx={{
        color: currentTrack?.is_liked ? '#ff2d55' : 'rgba(255,255,255,0.8)',
        '&:hover': { 
          color: currentTrack?.is_liked ? '#ff2d55' : 'white'
        }
      }}
    >
      {currentTrack?.is_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </ControlButton>
    
    {(lyricsData?.has_synced_lyrics || lyricsData?.lyrics) && (
      <ControlButton
        onClick={onToggleLyricsDisplay}
        className="secondary"
                sx={{
          color: lyricsDisplayMode ? '#9a7ace' : 'rgba(255,255,255,0.8)',
          '&:hover': { color: lyricsDisplayMode ? '#9a7ace' : 'white' }
        }}
      >
        <LyricsIcon />
      </ControlButton>
    )}
    
    <ControlButton
      onClick={onCopyLink}
      className="secondary"
      sx={{
        color: 'rgba(255,255,255,0.8)',
        '&:hover': { color: 'white' }
      }}
    >
      <ContentCopy size={24} color="rgb(255, 255, 255)" />
    </ControlButton>
  </SecondaryControls>
), (prevProps, nextProps) => {
  // Сравниваем только важные изменения
  return (
    prevProps.currentTrack?.id === nextProps.currentTrack?.id &&
    prevProps.currentTrack?.is_liked === nextProps.currentTrack?.is_liked &&
    prevProps.lyricsDisplayMode === nextProps.lyricsDisplayMode &&
    prevProps.lyricsData === nextProps.lyricsData &&
    prevProps.onToggleLike === nextProps.onToggleLike &&
    prevProps.onToggleLyricsDisplay === nextProps.onToggleLyricsDisplay &&
    prevProps.onCopyLink === nextProps.onCopyLink
  );
});

// Мемоизированный контрол громкости с оптимизацией
const VolumeControls = memo(({ 
  isMuted, 
  volume, 
  volumePercentage, 
  onToggleMute, 
  onVolumeChange 
}) => (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
    justifyContent: 'center',
    mt: 2,
    maxWidth: '500px',
    width: '100%'
          }}>
    <ControlButton
      onClick={onToggleMute}
                sx={{
        color: 'rgba(255,255,255,0.8)',
        '&:hover': { color: 'white' },
        mr: 1,
        transition: 'color 0.2s ease'
      }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
        transition: 'transform 0.15s ease',
        '&:hover': { transform: 'scale(1.1)' }
      }}>
        {isMuted || volume === 0 ? (
          <VolumeOffIcon sx={{ fontSize: 20 }} />
        ) : volume < 0.3 ? (
          <VolumeMuteIcon sx={{ fontSize: 20 }} />
        ) : volume < 0.7 ? (
          <VolumeDownIcon sx={{ fontSize: 20 }} />
        ) : (
          <VolumeUpIcon sx={{ fontSize: 20 }} />
        )}
      </Box>
    </ControlButton>
    
    <Slider
      value={isMuted ? 0 : volume}
      min={0}
      max={1}
      step={0.01}
      onChange={onVolumeChange}
                sx={{
                  color: 'white',
        flex: 1,
        mx: 2,
        '& .MuiSlider-track': {
          backgroundColor: 'white',
          height: 4,
          borderRadius: '2px',
          transition: 'height 0.2s ease'
        },
        '& .MuiSlider-rail': {
          backgroundColor: 'rgba(255,255,255,0.25)',
          height: 4,
          borderRadius: '2px',
          transition: 'height 0.2s ease'
        },
        '& .MuiSlider-thumb': {
          backgroundColor: 'white',
          width: 14,
          height: 14,
          border: 'none',
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(255,255,255,0.12)'
          },
          '&.Mui-focusVisible': {
            boxShadow: '0 0 0 8px rgba(255,255,255,0.12)'
          },
          '&:before': {
            display: 'none'
          }
        },
        '&:hover': {
          '& .MuiSlider-track': {
            height: 6,
            borderRadius: '3px'
          },
          '& .MuiSlider-rail': {
            height: 6,
            borderRadius: '3px'
          },
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16
          }
        }
      }}
    />
    
    <Typography 
      variant="caption" 
      sx={{ 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: '0.75rem',
        minWidth: '32px',
        textAlign: 'right',
        fontFamily: 'var(--FF_TITLE, inherit)',
        ml: 1
      }}
    >
      {volumePercentage}
              </Typography>
        </Box>
), (prevProps, nextProps) => {
  // Сравниваем только округленные значения громкости
  return (
    prevProps.isMuted === nextProps.isMuted &&
    Math.round(prevProps.volume * 100) === Math.round(nextProps.volume * 100) &&
    prevProps.volumePercentage === nextProps.volumePercentage &&
    prevProps.onToggleMute === nextProps.onToggleMute &&
    prevProps.onVolumeChange === nextProps.onVolumeChange
  );
});

// Компонент портала для полноэкранного плеера
const FullScreenPlayerPortal = memo(({ open, onClose, ...props }) => {
  const [portalContainer, setPortalContainer] = useState(null);
  
  useEffect(() => {
    // Безопасно получаем контейнер портала
    let container = null;
    try {
      container = document.getElementById('fullscreen-player-portal');
      
      // Если контейнер не найден, создаем его
      if (!container) {
        container = document.createElement('div');
        container.id = 'fullscreen-player-portal';
        document.body.appendChild(container);
      }
      
      setPortalContainer(container);
    } catch (error) {
      console.error('Ошибка при создании портала:', error);
    }
  }, []);
  
  // Обновляем состояние контейнера при изменении открытия/закрытия
  useEffect(() => {
    if (portalContainer) {
      if (open) {
        portalContainer.classList.add('active');
        // Дополнительные проверки для мобильных устройств
        try {
          // Предотвращаем scroll на iOS
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            viewport.setAttribute('content', viewport.getAttribute('content') + ', user-scalable=no');
          }
        } catch (e) {
          console.warn('Не удалось обновить viewport meta:', e);
        }
      } else {
        portalContainer.classList.remove('active');
        // Восстанавливаем scroll на iOS
        try {
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            const content = viewport.getAttribute('content').replace(', user-scalable=no', '');
            viewport.setAttribute('content', content);
          }
        } catch (e) {
          console.warn('Не удалось восстановить viewport meta:', e);
        }
      }
    }
  }, [open, portalContainer]);
  
  if (!open || !portalContainer) return null;
  
  return ReactDOM.createPortal(
    <FullScreenPlayerCore open={open} onClose={onClose} {...props} />,
    portalContainer
  );
});

export default FullScreenPlayerPortal;