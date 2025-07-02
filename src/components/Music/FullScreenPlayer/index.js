import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, Snackbar, Alert, Box, useMediaQuery, useTheme, IconButton, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LyricsIcon from '@mui/icons-material/MusicNote';
import Edit from '@mui/icons-material/Edit';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useMusic } from '../../../context/MusicContext';
import BackgroundLayer from './BackgroundLayer';
import TopControls from './TopControls';
import NowPlaying from './NowPlaying';
import PlayerControls from './PlayerControls';
import LyricsView from './LyricsView';
import LyricsEditor from './LyricsEditor';
import TimestampEditor from './TimestampEditor';
import { extractDominantColor } from '../../../utils/imageUtils';
import styles from './FullScreenPlayer.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import lyricsStyles from './LyricsView.module.scss';


const defaultCover = '/static/uploads/system/album_placeholder.jpg';

const FullScreenPlayer = ({ open, onClose, ...props }) => {
  const [dominantColor, setDominantColor] = useState(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showLyricsEditor, setShowLyricsEditor] = useState(false);
  const [showTimestampEditor, setShowTimestampEditor] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [lyricsData, setLyricsData] = useState(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [lyricsText, setLyricsText] = useState('');
  const theme = useTheme();
  const isDesktop = useMediaQuery('(min-width:960px)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { 
    currentTrack,
    currentSection,
    playlistTracks,
    playTrack
  } = useMusic();

  // Получаем треки текущего плейлиста
  const currentPlaylistTracks = useMemo(() => {
    if (!currentSection || !currentSection.startsWith('playlist_')) {
      return [];
    }
    return playlistTracks[currentSection] || [];
  }, [currentSection, playlistTracks]);

  const handleTogglePlaylist = useCallback(() => {
    setShowPlaylist(prev => !prev);
    setShowLyrics(false);
    setShowLyricsEditor(false);
    setShowTimestampEditor(false);
  }, []);

  // Обработчик нажатия на трек в плейлисте
  const handlePlayTrackFromPlaylist = useCallback((track) => {
    if (playTrack && currentSection) {
      playTrack(track, currentSection);
    }
  }, [playTrack, currentSection]);

  const goToArtist = async (artistName) => {
    if (!artistName || artistName.trim() === '') return;
    artistName = artistName.trim();
    
    try {

      const response = await axios.get(`/api/search/artists?query=${encodeURIComponent(artistName)}`);
      
      if (response.data && response.data.artists && response.data.artists.length > 0) {

        const exactMatch = response.data.artists.find(
          a => a.name.toLowerCase() === artistName.toLowerCase()
        );
        

        if (exactMatch) {
          navigate(`/artist/${exactMatch.id}`);
          return;
        }
        

        navigate(`/artist/${response.data.artists[0].id}`);
      } else {

        setSnackbar({
          open: true,
          message: `Артист "${artistName}" не найден`,
          severity: 'warning'
        });
      }
    } catch (error) {
      console.error('Ошибка при поиске артиста:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при поиске артиста',
        severity: 'error'
      });
    }
  };


  useEffect(() => {
    if (currentTrack?.cover_path) {
      extractDominantColor(
        currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg',
        (color) => {
          setDominantColor(color);
        }
      );
    }
  }, [currentTrack?.cover_path]);


  useEffect(() => {
    if (currentTrack?.id && open) {
      setLoadingLyrics(true);
      

      if (currentTrack.lyricsData) {
        setLyricsData(currentTrack.lyricsData);
        setLoadingLyrics(false);
        
        if (currentTrack.lyricsData.has_synced_lyrics || currentTrack.lyricsData.has_lyrics) {
          setShowLyrics(true);
        }
      } else {

        fetch(`/api/music/${currentTrack.id}/lyrics`)
          .then(response => response.json())
          .then(data => {
            setLyricsData(data);
            setLoadingLyrics(false);
            

            if (currentTrack) {
              currentTrack.lyricsData = data;
            }
            
            if (data.has_synced_lyrics || data.has_lyrics) {
              setShowLyrics(true);
            }
          })
          .catch(error => {
            console.error('Error fetching lyrics:', error);
            setLoadingLyrics(false);
          });
      }
    }
  }, [currentTrack, open]);


  useEffect(() => {
    if (!open) {
      setShowLyrics(false);
    }
  }, [open]);

  const handleToggleLyrics = useCallback(() => {
    setShowLyrics(prev => !prev);
    setShowLyricsEditor(false);
    setShowTimestampEditor(false);
    setShowPlaylist(false);
  }, []);

  const handleOpenLyricsEditor = useCallback(() => {
    setShowLyricsEditor(true);
    setShowTimestampEditor(false);
  }, []);

  const handleOpenTimestampEditor = useCallback(() => {
    setShowTimestampEditor(true);
    setShowLyricsEditor(false);
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  useEffect(() => {
    const enableScroll = () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('fullscreen-player-active');
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.classList.add('fullscreen-player-active');
    } else {
      enableScroll();
      setTimeout(enableScroll, 300);
    }
    
    return enableScroll;
  }, [open]);


  const MemoizedNowPlaying = useMemo(() => {
    return <NowPlaying track={currentTrack} dominantColor={dominantColor} />;
  }, [currentTrack, dominantColor]);

  const MemoizedTopControls = useMemo(() => {
    return (
      <TopControls 
        onClose={onClose}
        onToggleLyrics={handleToggleLyrics} 
        onOpenLyricsEditor={handleOpenLyricsEditor}
        showLyrics={showLyrics}
        showLyricsEditor={showLyricsEditor}
        dominantColor={dominantColor}
      />
    );
  }, [onClose, handleToggleLyrics, handleOpenLyricsEditor, showLyrics, showLyricsEditor, dominantColor]);

  const MemoizedPlayerControls = useMemo(() => {
    return <PlayerControls dominantColor={dominantColor} />;
  }, [dominantColor]);


  const renderContent = () => {
    if (showPlaylist) {
      return (
        <PlaylistView 
          tracks={currentPlaylistTracks}
          currentTrack={currentTrack}
          dominantColor={dominantColor}
          onPlayTrack={handlePlayTrackFromPlaylist}
        />
      );
    } else if (showLyrics && !showLyricsEditor && !showTimestampEditor) {
      return (
        <LyricsView 
          lyricsData={lyricsData} 
          loading={loadingLyrics}
          currentTrack={currentTrack}
          dominantColor={dominantColor}
          onOpenEditor={handleOpenLyricsEditor}
          onOpenTimestampEditor={handleOpenTimestampEditor}
        />
      );
    } else if (showLyricsEditor) {
      return (
        <LyricsEditor
          lyricsData={lyricsData}
          currentTrack={currentTrack}
          onCancel={() => setShowLyricsEditor(false)}
          dominantColor={dominantColor}
          onShowLyrics={() => {
            setShowLyricsEditor(false);
            setShowLyrics(true);
          }}
          onShowSnackbar={(message, severity) => {
            setSnackbar({
              open: true,
              message,
              severity
            });
          }}
          onOpenTimestampEditor={handleOpenTimestampEditor}
        />
      );
    } else if (showTimestampEditor) {
      return (
        <TimestampEditor
          lyricsData={lyricsData}
          currentTrack={currentTrack}
          lyricsText={lyricsText}
          onCancel={() => {
            setShowTimestampEditor(false);
            setShowLyricsEditor(true);
          }}
          dominantColor={dominantColor}
          onShowLyrics={() => {
            setShowTimestampEditor(false);
            setShowLyrics(true);
          }}
          onShowSnackbar={(message, severity) => {
            setSnackbar({
              open: true,
              message,
              severity
            });
          }}
        />
      );
    } else {
      return (
        <NowPlaying 
          track={currentTrack} 
          dominantColor={dominantColor} 
        />
      );
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose}>
        <DialogContent className={styles.dialogContent}>
          <BackgroundLayer 
            cover={currentTrack?.cover_path} 
            dominantColor={dominantColor} 
          />
          
          <Box className={styles.fadeGradientTop} />
          <Box className={styles.fadeGradientBottom} />
          
          <Box className={styles.contentContainer}>
            {isMobile ? (
              <>
                <Box className={styles.topControlsContainer}>
                  <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <IconButton onClick={onClose}>
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    <Box display="flex">
                      <IconButton 
                        onClick={handleOpenLyricsEditor}
                        sx={{
                          color: showLyricsEditor ? theme.palette.primary.main : 'inherit',
                          backgroundColor: showLyricsEditor ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                          mr: 1
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={handleToggleLyrics}
                        sx={{
                          color: showLyrics ? theme.palette.primary.main : 'inherit',
                          backgroundColor: showLyrics ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                          mr: 1
                        }}
                      >
                        <LyricsIcon />
                      </IconButton>
                      {currentPlaylistTracks.length > 0 && (
                        <IconButton 
                          onClick={handleTogglePlaylist}
                          sx={{
                            color: showPlaylist ? theme.palette.primary.main : 'inherit',
                            backgroundColor: showPlaylist ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                          }}
                        >
                          <QueueMusicIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Box>
                
                <Box className={styles.playerContainer} sx={{ pt: 8, pb: 20 }}>
                  {/* Album Cover */}
                  <Box
                    sx={{
                      padding: '0px 16px',
                      marginBottom: '0',
                      display: (showLyrics || showPlaylist) ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '75%',
                      width: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '80%',
                        maxWidth: '500px',
                        aspectRatio: '1/1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: dominantColor ? 
                          `0 10px 30px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.3), 0 30px 60px rgba(0,0,0,0.4)` : 
                          '0 10px 30px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.4)',
                        animation: 'appleMusicPulse 4s infinite alternate cubic-bezier(0.455, 0.03, 0.515, 0.955)',
                      }}
                    >
                      <img
                        src={currentTrack?.cover_path || defaultCover}
                        alt={currentTrack?.title || 'Album Cover'}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          aspectRatio: '1/1',
                        }}
                      />
                    </Box>
                    
                    <Box className={styles.belowCoverContainer}
                      sx={{
                        textAlign: 'center',
                        width: '100%',
                        animation: 'appleSlideUp 0.4s 0.2s ease-out forwards',
                      }}
                    >
                      <Typography variant="h6" className={styles.belowCoverTitle} 
                        sx={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          textAlign: 'center',
                          width: '100%',
                          letterSpacing: '-0.02em',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                        }}
                      >
                        {currentTrack?.title || 'Untitled'}
                      </Typography>
                      <Box className={styles.belowCoverArtists}
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          padding: '0 8px',
                          color: 'rgba(255,255,255,0.8)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                          fontWeight: 500,
                          fontSize: '18px',
                        }}
                      >
                        {currentTrack?.artist && currentTrack.artist.split(',').map((artist, index, array) => (
                          <React.Fragment key={index}>
                            <Typography 
                              component="span" 
                              sx={{
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  color: '#ffffff',
                                  textDecoration: 'underline'
                                },
                                px: 0.5,
                                py: 0.25,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                              }}
                              onClick={() => goToArtist(artist.trim())}
                            >
                              {artist.trim()}
                            </Typography>
                            {index < array.length - 1 && (
                              <Typography 
                                component="span" 
                                sx={{ 
                                  color: 'rgba(255,255,255,0.5)', 
                                  mx: 0.5,
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                                }}
                              >
                                ,
                              </Typography>
                            )}
                          </React.Fragment>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* Lyrics Container - absolute position to not affect layout */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: (showLyrics || showPlaylist) ? '10px' : '60px',
                      bottom: '140px',
                      overflow: 'hidden',
                      display: showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist ? 'flex' : 'none',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      pointerEvents: showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist ? 'auto' : 'none',
                      zIndex: 10,
                      paddingRight: '15px',
                      paddingLeft: '10px'
                    }}
                  >
                    {renderContent()}
                  </Box>
                </Box>
                
                <Box className={styles.bottomControlsContainer}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      pb: showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist ? 2 : 9.5,
                      transition: 'padding 0.3s ease-in-out',
                    }}
                  >
                    <PlayerControls />
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box 
                  className={`${styles.controlsSideContainer} ${!showLyrics && !showLyricsEditor && !showTimestampEditor && !showPlaylist ? styles.controlsSideContainerCentered : ''}`}
                  sx={{
                    transition: 'all 0.4s cubic-bezier(0.17, 0.67, 0.3, 0.98)'
                  }}
                >
                  {MemoizedNowPlaying}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <IconButton 
                      onClick={handleToggleLyrics}
                      sx={{
                        color: showLyrics ? theme.palette.primary.main : 'inherit',
                        backgroundColor: showLyrics ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                        mx: 1
                      }}
                    >
                      <LyricsIcon />
                    </IconButton>
                    <IconButton 
                      onClick={handleOpenLyricsEditor}
                      sx={{
                        color: showLyricsEditor ? theme.palette.primary.main : 'inherit',
                        backgroundColor: showLyricsEditor ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                        mx: 1
                      }}
                    >
                      <Edit />
                    </IconButton>
                    {currentPlaylistTracks.length > 0 && (
                      <IconButton 
                        onClick={handleTogglePlaylist}
                        sx={{
                          color: showPlaylist ? theme.palette.primary.main : 'inherit',
                          backgroundColor: showPlaylist ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                          mx: 1
                        }}
                      >
                        <QueueMusicIcon />
                      </IconButton>
                    )}
                  </Box>
                  {MemoizedPlayerControls}
                </Box>

                <Box 
                  className={`${styles.contentSideContainer} ${(showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist) ? 'animated-content-show' : 'animated-content-hide'}`}
                  sx={{ 
                    opacity: showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist ? 1 : 0,
                    maxWidth: showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist ? '60%' : '0%',
                    visibility: showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist ? 'visible' : 'hidden',
                    animation: showLyrics || showLyricsEditor || showTimestampEditor || showPlaylist
                      ? `${styles.contentShow} 0.4s cubic-bezier(0.17, 0.67, 0.3, 0.98) forwards` 
                      : `${styles.contentHide} 0.4s cubic-bezier(0.17, 0.67, 0.3, 0.98) forwards`
                  }}
                >
                  {renderContent()}
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Компонент для отображения списка треков плейлиста
const PlaylistView = ({ tracks = [], currentTrack, dominantColor, onPlayTrack }) => {
  const theme = useTheme();

  const isCurrentTrack = (track) => {
    return currentTrack && currentTrack.id === track.id;
  };

  if (!tracks || tracks.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: 3, 
        color: 'white'
      }}>
        <Typography variant="h6">
          В этом плейлисте нет треков
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: 'white',
          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}
      >
        Треки плейлиста
      </Typography>

      <List sx={{ 
        maxHeight: '70vh', 
        overflow: 'auto',
        pr: 2,
        pl: 1,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.primary.main,
          borderRadius: '4px',
        },
      }}>
        {tracks.map((track, index) => (
          <ListItem
            key={track.id}
            button
            onClick={() => onPlayTrack(track)}
            sx={{
              borderRadius: '8px',
              mb: 0.5,
              backgroundColor: isCurrentTrack(track) 
                ? `rgba(${dominantColor?.r || 0}, ${dominantColor?.g || 0}, ${dominantColor?.b || 0}, 0.4)` 
                : 'rgba(255,255,255,0.05)',
              '&:hover': {
                backgroundColor: isCurrentTrack(track) 
                  ? `rgba(${dominantColor?.r || 0}, ${dominantColor?.g || 0}, ${dominantColor?.b || 0}, 0.6)` 
                  : 'rgba(255,255,255,0.12)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '24px', mr: 1, flexShrink: 0 }}>
              {isCurrentTrack(track) ? (
                <PlayArrowIcon sx={{ color: theme.palette.primary.main }} />
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{index + 1}</Typography>
              )}
            </Box>
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar 
                variant="rounded" 
                sx={{ width: 32, height: 32 }}
                src={track.cover_path}
              >
                <MusicNoteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={track.title}
              secondary={track.artist}
              primaryTypographyProps={{
                noWrap: true,
                color: isCurrentTrack(track) ? theme.palette.primary.main : 'white',
                fontWeight: isCurrentTrack(track) ? 600 : 400,
              }}
              secondaryTypographyProps={{
                noWrap: true,
                color: 'rgba(255,255,255,0.7)',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FullScreenPlayer; 