import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Slider, 
  Dialog, 
  DialogContent,
  Fade,
  useTheme,
  Button,
  useMediaQuery,
  alpha,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Paper,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipNext, 
  SkipPrevious, 
  Close, 
  VolumeUp, 
  VolumeOff,
  VolumeDown,
  Favorite,
  FavoriteBorder,
  RepeatOne,
  Repeat,
  Shuffle,
  Share,
  Lyrics,
  Edit,
  Save,
  Add,
  Delete,
  ContentCopy,
  MoreVert,
  ModeEdit,
  Schedule,
  Warning
} from '@mui/icons-material';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import { ThemeSettingsContext } from '../../App';
import { useContext } from 'react';


const getColorFromImage = (imgSrc, callback) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    
    context.drawImage(img, 0, 0);
    
    
    const centerX = img.width / 2;
    const centerY = img.height / 2;
    const data = context.getImageData(centerX, centerY, 1, 1).data;
    
    
    callback(`${data[0]}, ${data[1]}, ${data[2]}`);
  };
  
  img.onerror = () => {
    callback(null);
  };
  
  img.src = imgSrc;
};

const FullScreenPlayer = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { themeSettings } = useContext(ThemeSettingsContext);
  const [seekPosition, setSeekPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); 
  const [shuffleMode, setShuffleMode] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  const progressRef = useRef(null);
  
  const [shareSnackbar, setShareSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsData, setLyricsData] = useState(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const lyricsContainerRef = useRef(null);
  const [showLyricsEditor, setShowLyricsEditor] = useState(false);
  const [lyricsText, setLyricsText] = useState('');
  const [showTimestampEditor, setShowTimestampEditor] = useState(false);
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const [lyricsEditorMenuAnchor, setLyricsEditorMenuAnchor] = useState(null);
  const [savingLyrics, setSavingLyrics] = useState(false);
  const [lyricsEditorError, setLyricsEditorError] = useState('');
  const isDesktop = useMediaQuery('(min-width:960px)');

  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    currentTime,
    duration,
    seekTo,
    likeTrack,
    audioRef
  } = useMusic();

  
  useEffect(() => {
    if (currentTrack?.cover_path) {
      getColorFromImage(
        currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg',
        (color) => {
          setDominantColor(color);
        }
      );
    }
  }, [currentTrack]);

  
  useEffect(() => {
    const enableScroll = () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      
      enableScroll();
      
      setTimeout(enableScroll, 300);
    }

    
    return enableScroll;
  }, [open]);

  
  useEffect(() => {
    
    const updateDisplays = () => {
      
      if (isSeeking) return;
      
      
      if (window.audioTiming) {
        setSeekPosition(window.audioTiming.progress);
      }
      
      
      requestAnimationFrame(updateDisplays);
    };
    
    
    const animationId = requestAnimationFrame(updateDisplays);
    
    
    return () => cancelAnimationFrame(animationId);
  }, [isSeeking]);

  
  useEffect(() => {
    if (currentTrack?.id && open) {
      setLoadingLyrics(true);
      fetch(`/api/music/${currentTrack.id}/lyrics`)
        .then(response => response.json())
        .then(data => {
          setLyricsData(data);
          setLoadingLyrics(false);
          
          if (data.has_synced_lyrics) {
            setShowLyrics(true);
          }
        })
        .catch(error => {
          console.error('Error fetching lyrics:', error);
          setLoadingLyrics(false);
        });
    }
  }, [currentTrack, open]);

  
  useEffect(() => {
    if (!showLyrics || !lyricsData?.has_synced_lyrics || !lyricsData.synced_lyrics) {
      return;
    }

    
    const updateCurrentLyric = () => {
      const syncedLyrics = lyricsData.synced_lyrics;
      
      const currentTimeMs = (window.audioTiming?.currentTime || currentTime) * 1000;
      
      
      let start = 0;
      let end = syncedLyrics.length - 1;
      let foundIndex = -1;
      
      while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const midTime = syncedLyrics[mid].startTimeMs;
        const nextTime = mid < syncedLyrics.length - 1 ? syncedLyrics[mid + 1].startTimeMs : Infinity;
        
        if (currentTimeMs >= midTime && currentTimeMs < nextTime) {
          foundIndex = mid;
          break;
        } else if (currentTimeMs < midTime) {
          end = mid - 1;
        } else {
          start = mid + 1;
        }
      }
      
      
      if (foundIndex === -1 && syncedLyrics.length > 0) {
        for (let i = syncedLyrics.length - 1; i >= 0; i--) {
          if (syncedLyrics[i].startTimeMs <= currentTimeMs) {
            foundIndex = i;
            break;
          }
        }
      }
      
      
      if (foundIndex !== -1 && foundIndex !== currentLyricIndex && syncedLyrics[foundIndex].text.trim() !== '') {
        setCurrentLyricIndex(foundIndex);
        
        
        if (lyricsContainerRef.current) {
          const lyricElements = lyricsContainerRef.current.querySelectorAll('.lyric-line');
          if (lyricElements[foundIndex]) {
            lyricElements[foundIndex].scrollIntoView({
              behavior: 'auto',
              block: 'center'
            });
          }
        }
      }
      
      
      animationFrameRef.current = requestAnimationFrame(updateCurrentLyric);
    };
    
    
    const animationFrameRef = { current: null };
    animationFrameRef.current = requestAnimationFrame(updateCurrentLyric);
    
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showLyrics, lyricsData, currentLyricIndex, lyricsContainerRef]);

  
  useEffect(() => {
    if (!open) {
      setShowLyrics(false);
      setCurrentLyricIndex(-1);
    }
  }, [open]);

  
  useEffect(() => {
    if (showLyricsEditor && lyricsData?.has_lyrics) {
      setLyricsText(lyricsData.lyrics || '');
    }
    if (showLyricsEditor && !lyricsData?.has_lyrics) {
      setLyricsText('');
    }
  }, [showLyricsEditor, lyricsData]);

  
  useEffect(() => {
    if (showTimestampEditor && lyricsText) {
      
      const lines = lyricsText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      
      const initialParsedLyrics = lines.map((text, index) => ({
        startTimeMs: 0,
        text,
        index
      }));
      
      
      initialParsedLyrics.unshift({ startTimeMs: 0, text: "", index: -1 });
      initialParsedLyrics.push({ startTimeMs: 0, text: "", index: lines.length });
      
      setParsedLyrics(initialParsedLyrics);
    }
  }, [showTimestampEditor, lyricsText]);

  
  useEffect(() => {
    
    if (duration > 0 && currentTime >= duration - 0.1 && isPlaying) {
      
      togglePlay();
      
      seekTo(0);
    }
  }, [currentTime, duration, isPlaying, togglePlay, seekTo]);

  if (!currentTrack) {
    return null;
  }

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue / 100);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (event, newValue) => {
    setSeekPosition(newValue);
  };

  const handleSeekEnd = (event, newValue) => {
    seekTo((newValue * duration) / 100);
    setIsSeeking(false);
  };

  const handleClickProgress = (event) => {
    if (progressRef.current && duration) {
      const rect = progressRef.current.getBoundingClientRect();
      const position = ((event.clientX - rect.left) / rect.width) * 100;
      const clampedPosition = Math.min(Math.max(position, 0), 100);
      setSeekPosition(clampedPosition);
      seekTo((clampedPosition * duration) / 100);
    }
  };

  const handleRepeatClick = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const handleShuffleClick = () => {
    setShuffleMode(!shuffleMode);
  };

  const toggleLikeTrack = (e) => {
    
    if (e) {
      e.stopPropagation();
    }
    
    if (currentTrack?.id) {
      try {
        
        const likeButton = e.currentTarget;
        likeButton.style.transform = 'scale(1.3)';
        setTimeout(() => {
          likeButton.style.transform = 'scale(1)';
        }, 150);
        
        likeTrack(currentTrack.id)
          .then(result => {
            console.log("Like result:", result);
            
          })
          .catch(error => {
            console.error("Error liking track:", error);
          });
      } catch (error) {
        console.error("Error liking track:", error);
      }
    }
  };
  
  
  const handleShare = () => {
    if (!currentTrack) return;
    
    const trackLink = `${window.location.origin}/music?track=${currentTrack.id}`;
    
    
    copyToClipboard(trackLink);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareSnackbar({
          open: true,
          message: 'Ссылка на трек скопирована в буфер обмена',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
        setShareSnackbar({
          open: true,
          message: 'Не удалось скопировать ссылку',
          severity: 'error'
        });
      });
  };
  
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShareSnackbar({...shareSnackbar, open: false});
  };

  const toggleLyrics = () => {
    setShowLyrics(prev => !prev);
  };

  const openLyricsEditor = () => {
    
    
    
    
    setLyricsEditorError('');
    setShowLyricsEditor(true);
    setShowLyrics(false);
  };

  const handleLyricsEditorChange = (e) => {
    setLyricsText(e.target.value);
  };

  const handleOpenLyricsEditorMenu = (event) => {
    setLyricsEditorMenuAnchor(event.currentTarget);
  };

  const handleCloseLyricsEditorMenu = () => {
    setLyricsEditorMenuAnchor(null);
  };

  const handleTimestampEditorOpen = () => {
    if (!lyricsText.trim()) {
      setLyricsEditorError('Сначала добавьте текст песни');
      return;
    }
    handleCloseLyricsEditorMenu();
    setShowTimestampEditor(true);
    setShowLyricsEditor(false);
  };

  const handleSavePlainLyrics = async () => {
    if (!lyricsText.trim()) {
      setLyricsEditorError('Текст песни не может быть пустым');
      return;
    }
    
    handleCloseLyricsEditorMenu();
    setSavingLyrics(true);
    
    try {
      const response = await fetch(`/api/music/${currentTrack.id}/lyrics/upload`, {
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
        
        const updatedLyricsResponse = await fetch(`/api/music/${currentTrack.id}/lyrics`);
        const updatedLyricsData = await updatedLyricsResponse.json();
        setLyricsData(updatedLyricsData);
        
        
        setShowLyricsEditor(false);
        setShowLyrics(true);
        
        setShareSnackbar({
          open: true,
          message: 'Текст песни успешно сохранен',
          severity: 'success'
        });
        
        
        if (data.copyright_notice) {
          setTimeout(() => {
            setShareSnackbar({
              open: true,
              message: data.copyright_notice,
              severity: 'warning'
            });
          }, 3000);
        }
      } else {
        setLyricsEditorError(data.error || 'Ошибка при сохранении текста');
        
        
        if (data.warning) {
          setTimeout(() => {
            setShareSnackbar({
              open: true,
              message: data.warning,
              severity: 'warning'
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error saving lyrics:', error);
      setLyricsEditorError('Ошибка при сохранении текста');
    } finally {
      setSavingLyrics(false);
    }
  };

  const handleSetTimestamp = (index) => {
    if (!window.audioTiming || window.audioTiming.currentTime <= 0) return;
    
    const updatedLyrics = [...parsedLyrics];
    updatedLyrics[index].startTimeMs = Math.round((window.audioTiming.currentTime || currentTime) * 1000);
    setParsedLyrics(updatedLyrics);
    
    
    if (index < parsedLyrics.length - 1) {
      
      const listItems = document.querySelectorAll('.timestamp-list-item');
      if (listItems && listItems[index + 1]) {
        listItems[index + 1].scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
  };

  const handleSaveSyncedLyrics = async () => {
    
    const hasInvalidTimestamps = parsedLyrics.slice(1, -1).some(line => line.startTimeMs === 0);
    
    if (hasInvalidTimestamps) {
      setLyricsEditorError('Не все строки имеют временные метки');
      return;
    }
    
    setSavingLyrics(true);
    
    try {
      
      const syncedLyricsData = parsedLyrics.map(({ startTimeMs, text }) => ({ 
        startTimeMs, 
        text 
      }));
      
      const response = await fetch(`/api/music/${currentTrack.id}/lyrics/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          synced_lyrics: syncedLyricsData
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        
        const updatedLyricsResponse = await fetch(`/api/music/${currentTrack.id}/lyrics`);
        const updatedLyricsData = await updatedLyricsResponse.json();
        setLyricsData(updatedLyricsData);
        
        
        setShowTimestampEditor(false);
        setShowLyrics(true);
        
        setShareSnackbar({
          open: true,
          message: 'Синхронизированный текст успешно сохранен',
          severity: 'success'
        });
        
        
        if (data.copyright_notice) {
          setTimeout(() => {
            setShareSnackbar({
              open: true,
              message: data.copyright_notice,
              severity: 'warning'
            });
          }, 3000);
        }
      } else {
        setLyricsEditorError(data.error || 'Ошибка при сохранении текста');
        
        
        if (data.warning) {
          setTimeout(() => {
            setShareSnackbar({
              open: true,
              message: data.warning,
              severity: 'warning'
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error saving synced lyrics:', error);
      setLyricsEditorError('Ошибка при сохранении синхронизированного текста');
    } finally {
      setSavingLyrics(false);
    }
  };

  
  const handleCancelTimestampEditor = () => {
    setShowTimestampEditor(false);
    setShowLyricsEditor(true);
  };

  
  const handleCancelLyricsEditor = () => {
    setShowLyricsEditor(false);
    setLyricsText('');
    setLyricsEditorError('');
  };

  
  const handleCopyGeniusSearchUrl = () => {
    const searchQuery = encodeURIComponent(`${currentTrack.artist} ${currentTrack.title}`);
    const geniusUrl = `https://genius.com/search?q=${searchQuery}`;
    
    navigator.clipboard.writeText(geniusUrl)
      .then(() => {
        setShareSnackbar({
          open: true,
          message: 'Ссылка для поиска в Genius скопирована',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
      });
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      transitionDuration={200}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(18, 18, 18, 0.98)',
          backgroundImage: 'none',
          boxShadow: 'none',
          overflow: 'hidden',
          margin: 0,
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          maxWidth: '100vw',
          borderRadius: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 12000
        }
      }}
      sx={{
        zIndex: 12000,
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center' 
        }
      }}
    >
      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        
        <IconButton 
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            top: isMobile ? 16 : 24, 
            right: isMobile ? 16 : 24, 
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            '&:hover': { 
              bgcolor: 'rgba(0,0,0,0.7)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s',
            zIndex: 100,
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40
          }}
        >
          <Close sx={{ fontSize: isMobile ? 18 : 24 }} />
        </IconButton>
        
        <IconButton 
          onClick={handleShare}
          sx={{ 
            position: 'absolute',
            top: isMobile ? 16 : 24,
            left: isMobile ? 16 : 24,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            '&:hover': { 
              bgcolor: 'rgba(0,0,0,0.7)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s',
            zIndex: 100,
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40
          }}
        >
          <Share sx={{ fontSize: isMobile ? 18 : 24 }} />
        </IconButton>

        <IconButton 
          onClick={toggleLyrics}
              sx={{ 
            position: 'absolute',
            top: isMobile ? 16 : 24,
            left: isMobile ? (16 + 40) : (24 + 50),
            color: showLyrics ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
                '&:hover': {
              bgcolor: 'rgba(0,0,0,0.7)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s',
            zIndex: 100,
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40
          }}
        >
          <Lyrics sx={{ fontSize: isMobile ? 18 : 24 }} />
        </IconButton>
        
        <IconButton 
          onClick={openLyricsEditor}
          sx={{ 
            position: 'absolute',
            top: isMobile ? 16 : 24,
            left: isMobile ? (16 + 80) : (24 + 100),
            color: showLyricsEditor ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            '&:hover': { 
              bgcolor: 'rgba(0,0,0,0.7)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s',
            zIndex: 100,
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            display: 'flex'
          }}
        >
          <Edit sx={{ fontSize: isMobile ? 18 : 24 }} />
        </IconButton>
        
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(80px) saturate(180%)',
            WebkitBackdropFilter: 'blur(80px) saturate(180%)',
            background: dominantColor ? 
              `linear-gradient(to bottom, rgba(${dominantColor}, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)` : 
              'linear-gradient(to bottom, rgba(60, 60, 60, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)',
            zIndex: 1
          }
        }} />

        <Box sx={{ 
          position: 'relative',
          width: '100%',
          maxWidth: isMobile ? '85%' : '550px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '8px' : '24px',
          zIndex: 10
        }}>
          
          {showLyricsEditor ? (
          <Box sx={{ 
            width: '100%',
              height: isMobile ? '300px' : '400px',
              mb: 4,
              bgcolor: 'rgba(0,0,0,0.5)',
              borderRadius: '12px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Редактор текста песни
                </Typography>
                <Box>
                  <Tooltip title="Инструменты">
                    <IconButton 
                      onClick={handleOpenLyricsEditorMenu}
                      sx={{ color: 'white', mr: 1 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={lyricsEditorMenuAnchor}
                    open={Boolean(lyricsEditorMenuAnchor)}
                    onClose={handleCloseLyricsEditorMenu}
                    sx={{
                      zIndex: 13000,
                      '& .MuiPaper-root': {
                        backgroundColor: 'rgba(30, 30, 30, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        minWidth: '250px'
                      }
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={handleTimestampEditorOpen}>
                      <Schedule sx={{ mr: 1 }} />
                      Создать синхронизированный текст
                    </MenuItem>
                  </Menu>
                  
                  <Tooltip title="Сохранить">
                    <IconButton 
                      onClick={handleSavePlainLyrics}
                      disabled={savingLyrics}
                      sx={{ 
                        color: savingLyrics ? 'gray.400' : 'white',
                        backgroundColor: dominantColor ? `rgba(${dominantColor}, 0.5)` : theme.palette.primary.main,
                        '&:hover': { 
                          backgroundColor: dominantColor ? `rgba(${dominantColor}, 0.7)` : theme.palette.primary.dark,
                        },
                        mr: 1
                      }}
                    >
                      {savingLyrics ? <CircularProgress size={24} color="inherit" /> : <Save />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Отмена">
                    <IconButton 
                      onClick={handleCancelLyricsEditor}
                      sx={{ color: 'white' }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              {lyricsEditorError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {lyricsEditorError}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Alert severity="info" icon={<Warning />} sx={{ width: '100%' }}>
                  Вы можете найти текст песни на Genius и скопировать его сюда. 
                  Убедитесь, что вы не нарушаете авторские права.
                </Alert>
              </Box>
              
              <TextField
                multiline
                fullWidth
                variant="outlined"
                value={lyricsText}
                onChange={handleLyricsEditorChange}
                placeholder="Вставьте текст песни сюда..."
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    height: '100%',
                    '& textarea': {
                      height: '100% !important'
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  }
                }}
              />
            </Box>
          ) : showTimestampEditor ? (
            <Box sx={{ 
              width: '100%',
              height: isMobile ? '400px' : '600px',
              mb: 4,
              bgcolor: 'rgba(0,0,0,0.5)',
              borderRadius: '12px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Создание синхронизированного текста
                </Typography>
                <Box>
                  <Tooltip title="Сохранить">
                    <IconButton 
                      onClick={handleSaveSyncedLyrics}
                      disabled={savingLyrics}
                      sx={{ 
                        color: savingLyrics ? 'gray.400' : 'white',
                        backgroundColor: dominantColor ? `rgba(${dominantColor}, 0.5)` : theme.palette.primary.main,
                        '&:hover': { 
                          backgroundColor: dominantColor ? `rgba(${dominantColor}, 0.7)` : theme.palette.primary.dark,
                        },
                        mr: 1
                      }}
                    >
                      {savingLyrics ? <CircularProgress size={24} color="inherit" /> : <Save />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Назад">
                    <IconButton 
                      onClick={handleCancelTimestampEditor}
                      sx={{ color: 'white' }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              {lyricsEditorError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {lyricsEditorError}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Alert severity="info" sx={{ width: '100%' }}>
                  Воспроизведите трек и нажимайте кнопку с иконкой часов рядом с каждой строкой в нужный момент. После установки метки автоматически прокрутится к следующей строке.
                </Alert>
              </Box>
              
              <Box 
                sx={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  maxHeight: 'calc(100% - 130px)',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: dominantColor ? `rgba(${dominantColor}, 0.7)` : theme.palette.primary.main,
                    borderRadius: '4px',
                  } 
                }}
              >
                <List sx={{ width: '100%' }}>
                  {parsedLyrics.map((line, idx) => (
                    <ListItem 
                      key={idx}
                      className="timestamp-list-item"
                      sx={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        py: 1,
                        px: 2, 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ 
                        flexGrow: 1, 
                        overflow: 'hidden', 
                        mr: 2,
                        maxWidth: 'calc(100% - 64px)'
                      }}>
                        <Typography
                          sx={{
                            color: 'white',
                            opacity: line.text ? 1 : 0.5,
                            fontStyle: line.text ? 'normal' : 'italic',
                            fontSize: isMobile ? '0.875rem' : '1rem',
                            fontWeight: 400,
                            wordBreak: 'break-word',
                            lineHeight: 1.8
                          }}
                        >
                          {line.text || "(Пустая строка)"}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'white',
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            mt: 0.5,
                            fontWeight: line.startTimeMs > 0 ? 600 : 400
                          }}
                        >
                          {line.startTimeMs > 0 ? formatDuration(line.startTimeMs/1000) : 'Нет метки'}
                        </Typography>
                      </Box>
                      
                      <IconButton
                        onClick={() => handleSetTimestamp(idx)}
                        disabled={!isPlaying}
                        sx={{
                          backgroundColor: line.startTimeMs > 0 ? 
                            (dominantColor ? `rgba(${dominantColor}, 0.7)` : theme.palette.primary.main) : 
                            'rgba(255,255,255,0.15)',
                          color: 'white',
                          width: '48px',
                          height: '48px',
                          minWidth: '48px',
                          p: 0,
                          flexShrink: 0
                        }}
                      >
                        <Schedule />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          ) : !showLyrics ? (
            <Box sx={{ 
              width: '100%',
              maxWidth: isMobile ? '230px' : '350px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              mb: isMobile ? 2 : 4,
            aspectRatio: '1/1',
            position: 'relative',
            margin: '0 auto',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
              zIndex: 1
            }
          }}>
            <img 
              src={currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'} 
              alt={currentTrack.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          </Box>
          ) : (
            <Box 
              ref={lyricsContainerRef}
              sx={{ 
                width: '100%',
                height: isMobile ? '300px' : '400px',
                overflowY: 'auto',
                mb: isMobile ? 2 : 4,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '12px',
                p: isMobile ? 2 : 3,
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  width: '0',
                  display: 'none'
                },
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              }}
            >
              {loadingLyrics ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress size={40} sx={{ color: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main }} />
                </Box>
              ) : lyricsData?.has_synced_lyrics ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  {lyricsData.synced_lyrics.map((line, index) => (
                    <Typography 
                      key={index}
                      variant="body1"
                      className="lyric-line"
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 400,
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        lineHeight: 1.8,
                        mb: 2,
                        textAlign: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: Math.abs(index - currentLyricIndex) > 8 ? 0 : 
                                Math.abs(index - currentLyricIndex) > 4 ? 0.3 : 
                                index === currentLyricIndex ? 1 : 0.6,
                        transform: index === currentLyricIndex ? 
                                   'scale(1.05) translateY(0)' : 
                                   index < currentLyricIndex ? 
                                   `scale(0.95) translateY(${Math.min(Math.abs(index - currentLyricIndex) * 8, 30)}px)` : 
                                   `scale(0.95) translateY(-${Math.min(Math.abs(index - currentLyricIndex) * 8, 30)}px)`,
                        filter: index === currentLyricIndex ? 'brightness(1.5)' : 'brightness(1)',
                        textShadow: index === currentLyricIndex ? 
                                    `0 0 10px rgba(${dominantColor || '255, 255, 255'}, 0.5)` : 'none',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        userSelect: 'none',
                        pointerEvents: 'none',
                        willChange: 'transform, opacity',
                        '&::after': index === currentLyricIndex ? {
                          content: '""',
                          position: 'absolute',
                          left: '50%',
                          bottom: '-2px',
                          width: '30px',
                          height: '2px',
                          backgroundColor: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main,
                          transform: 'translateX(-50%)',
                          borderRadius: '1px',
                          transition: 'width 0.3s ease'
                        } : {}
                      }}
                    >
                      {line.text || ' '}
                    </Typography>
                  ))}
                </Box>
              ) : lyricsData?.has_lyrics ? (
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                    lineHeight: 1.8
                  }}
                >
                  {lyricsData.lyrics}
                </Typography>
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    textAlign: 'center',
                    mt: 4
                  }}
                >
                  Текст песни не найден
                </Typography>
              )}
            </Box>
          )}

          {/* Track title area with like button integration */}
          <Box sx={{ width: '100%', mb: isMobile ? 2 : 4, textAlign: 'center', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              mx: 'auto',
              maxWidth: isMobile ? '80%' : '70%' 
            }}>
            <Typography 
              variant="h4" 
              fontWeight="600" 
                noWrap
              sx={{ 
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 1,
                  fontSize: isMobile ? '1.3rem' : '2.125rem',
                letterSpacing: '-0.02em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  maxWidth: '100%',
                  textOverflow: 'ellipsis',
              }}
            >
              {currentTrack.title}
            </Typography>
              <IconButton 
                onClick={(e) => toggleLikeTrack(e)}
                sx={{ 
                  color: currentTrack.is_liked ? 'error.main' : 'rgba(255,255,255,0.6)',
                  '&:hover': {
                    color: currentTrack.is_liked ? 'error.light' : '#ff6b6b',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  ml: 1.5,
                  width: isMobile ? '32px' : '40px',
                  height: isMobile ? '32px' : '40px',
                  position: 'absolute',
                  right: isMobile ? -40 : -48
                }}
              >
                {currentTrack.is_liked ? (
                  <Favorite 
                    sx={{ 
                      fontSize: isMobile ? 20 : 24,
                      animation: 'heartPop 0.6s ease-out',
                      '@keyframes heartPop': {
                        '0%': { transform: 'scale(1)' },
                        '10%': { transform: 'scale(0.8)' },
                        '30%': { transform: 'scale(1.5)', filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.6))' },
                        '50%': { transform: 'scale(1.2)', filter: 'drop-shadow(0 0 5px rgba(255,0,0,0.4))' },
                        '70%': { transform: 'scale(1.3)', filter: 'drop-shadow(0 0 3px rgba(255,0,0,0.2))' },
                        '100%': { transform: 'scale(1)' }
                      }
                    }} 
                  />
                ) : (
                  <FavoriteBorder 
                    sx={{
                      fontSize: isMobile ? 20 : 24,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        animation: 'heartbeatHover 1.5s infinite',
                        '@keyframes heartbeatHover': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '25%': { transform: 'scale(1.1)', opacity: 0.8 },
                          '50%': { transform: 'scale(1)', opacity: 1 },
                          '75%': { transform: 'scale(1.1)', opacity: 0.8 },
                          '100%': { transform: 'scale(1)', opacity: 1 }
                        }
                      }
                    }}
                  />
                )}
              </IconButton>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '400',
                fontSize: isMobile ? '0.9rem' : '1.25rem',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}
            >
              {currentTrack.artist} {currentTrack.album && `• ${currentTrack.album}`}
            </Typography>
          </Box>

          {/* Audio visualization bars - slightly adjusted */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mt: -1, 
            mb: isMobile ? 1 : 2,
            gap: 0.5,
            height: isMobile ? 16 : 24
          }}>
            {isPlaying && (
              <>
                {[0, 1, 2, 3].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: isMobile ? 2 : 3,
                      height: index % 2 === 0 ? (isMobile ? 8 : 12) : (isMobile ? 12 : 16),
                      borderRadius: 4,
                      backgroundColor: dominantColor 
                        ? `rgba(${dominantColor}, 0.9)` 
                        : theme.palette.primary.main,
                      mx: 0.5
                    }}
                  />
                ))}
              </>
            )}
          </Box>

          {/* Playback progress slider - unchanged */}
          <Box sx={{ width: '100%', mb: isMobile ? 2 : 3, px: isMobile ? 0 : 1 }} ref={progressRef} onClick={handleClickProgress}>
            <Slider
              value={seekPosition}
              onChange={handleSeekChange}
              onChangeCommitted={handleSeekEnd}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              aria-labelledby="track-progress"
              sx={{
                color: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main,
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 0,
                  height: 0,
                  opacity: 0,
                  transition: 'all 0.2s ease',
                  '&:hover, &.Mui-active': {
                    boxShadow: `0 0 0 8px ${alpha(dominantColor ? `rgb(${dominantColor})` : theme.palette.primary.main, 0.2)}`,
                    width: 16,
                    height: 16,
                    opacity: 1
                  }
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  backgroundColor: 'rgba(255,255,255,0.3)'
                },
                '&:hover .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  opacity: 1
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {window.audioTiming?.formattedCurrentTime || formatDuration(currentTime)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {window.audioTiming?.formattedDuration || formatDuration(duration)}
              </Typography>
            </Box>
          </Box>

          {/* Playback controls - centered like Yandex Music and larger */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: isMobile ? 3 : 4 }}>
            {/* Main playback controls - centered */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '100%',
              mb: 2
            }}>
              <IconButton 
                onClick={prevTrack}
                sx={{ 
                  color: 'white',
                  mx: isMobile ? 2 : 3,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  },
                  width: isMobile ? '48px' : '56px',
                  height: isMobile ? '48px' : '56px'
                }}
              >
                <SkipPrevious sx={{ fontSize: isMobile ? 30 : 40 }} />
              </IconButton>
              
              <IconButton
                onClick={togglePlay}
                sx={{ 
                  mx: isMobile ? 2 : 3, 
                  bgcolor: dominantColor ? `rgba(${dominantColor}, 0.9)` : theme.palette.primary.main,
                  color: 'white',
                  p: isMobile ? 0.8 : 2,
                  boxShadow: `0 4px 20px ${alpha(dominantColor ? `rgb(${dominantColor})` : theme.palette.primary.main, 0.5)}`,
                  '&:hover': {
                    bgcolor: dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.light,
                    boxShadow: `0 6px 25px ${alpha(dominantColor ? `rgb(${dominantColor})` : theme.palette.primary.main, 0.6)}`,
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s',
                  width: isMobile ? '64px' : '80px',
                  height: isMobile ? '64px' : '80px'
                }}
              >
                {isPlaying ? 
                  <Pause sx={{ fontSize: isMobile ? 38 : 48 }} /> : 
                  <PlayArrow sx={{ fontSize: isMobile ? 38 : 48 }} />
                }
              </IconButton>
              
              <IconButton 
                onClick={nextTrack}
                sx={{ 
                  color: 'white',
                  mx: isMobile ? 2 : 3,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  },
                  width: isMobile ? '48px' : '56px',
                  height: isMobile ? '48px' : '56px'
                }}
              >
                <SkipNext sx={{ fontSize: isMobile ? 30 : 40 }} />
              </IconButton>
            </Box>
            
            {/* Secondary controls - shuffle and repeat */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: isMobile ? 4 : 6
            }}>
            <IconButton 
                onClick={handleShuffleClick}
              sx={{ 
                  color: shuffleMode ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'rgba(255,255,255,0.6)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  width: isMobile ? '36px' : '44px',
                  height: isMobile ? '36px' : '44px'
              }}
            >
                <Shuffle sx={{ fontSize: isMobile ? 20 : 24 }} />
            </IconButton>
            
            <IconButton 
              onClick={handleRepeatClick}
              sx={{ 
                color: repeatMode !== 'off' ? (dominantColor ? `rgba(${dominantColor}, 1)` : theme.palette.primary.main) : 'rgba(255,255,255,0.6)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                width: isMobile ? '36px' : '44px',
                height: isMobile ? '36px' : '44px'
              }}
            >
              {repeatMode === 'off' ? <RepeatOne /> : repeatMode === 'one' ? <Repeat /> : <Repeat />}
            </IconButton>
          </Box>
        </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenPlayer; 