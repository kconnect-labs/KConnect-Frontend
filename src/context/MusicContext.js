import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import axios from 'axios';

// Функция для получения полного URL аудиофайла
const getAudioUrl = (filePath) => {
  if (!filePath) return '';
  
  // Если путь уже полный URL, возвращаем как есть
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Проверяем, работаем ли мы на localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost');
  
  // Если на localhost, добавляем полный URL
  if (isLocalhost) {
    return `https://k-connect.ru${filePath}`;
  }
  
  return filePath;
};

export const MusicContext = createContext({
  tracks: [],
  popularTracks: [],
  likedTracks: [],
  newTracks: [],
  randomTracks: [],
  myVibeTracks: [],
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isLoading: true,
  audioRef: null,
  hasMoreTracks: false,
  hasMoreByType: {},
  currentSection: 'all',
  isTrackLoading: false,
  isFullScreenPlayerOpen: false,
  setCurrentTrack: () => {},
  setCurrentSection: () => {},
  resetCurrentSection: () => {},
  setRandomTracks: () => {},
  playTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  likeTrack: () => {},
  uploadTrack: () => {},
  loadMoreTracks: () => Promise.resolve(),
  resetPagination: () => {},
  enableCrossfade: true,
  searchResults: [],
  isSearching: false,
  searchTracks: () => Promise.resolve([]),
  getCurrentTimeRaw: () => 0,
  getDurationRaw: () => 0,
  playlistTracks: {},
  setPlaylistTracks: () => {},
  openFullScreenPlayer: () => {},
  closeFullScreenPlayer: () => {},
});


export const MusicProvider = ({ children }) => {
  
  const [tracks, setTracks] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [newTracks, setNewTracks] = useState([]);
  const [randomTracks, setRandomTracks] = useState([]);
  const [myVibeTracks, setMyVibeTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); 
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreTracks, setHasMoreTracks] = useState(true);
  const [hasMoreByType, setHasMoreByType] = useState({});
  const [page, setPage] = useState(1);
  const [pageByType, setPageByType] = useState({
    all: 1,
    popular: 1,
    liked: 1,
    new: 1,
    random: 1,
    'my-vibe': 1
  });
  const [enableCrossfade, setEnableCrossfade] = useState(true); 
  const [currentSection, setCurrentSection] = useState('all'); 
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isTrackLoading, setIsTrackLoading] = useState(false); 
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
  
  
  const audioRef = useRef(new Audio());
  const nextAudioRef = useRef(new Audio()); 
  const initialMount = useRef(true);
  const crossfadeTimeoutRef = useRef(null); 
  const isLoadingRef = useRef(true); 
  const isLoadingMoreRef = useRef(false); 
  const [isLoadingMore, setIsLoadingMore] = useState(false); 
  const preloadTimeRef = useRef({}); 
  
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const timeUpdateThrottleRef = useRef(null);
  const lastTimeUpdateRef = useRef(0);

  
  const likedTracksLastLoadedRef = useRef(null);
  
  const isLoadingLikedTracksRef = useRef(false);
  
  const hasCheckedLikedTracksRef = useRef(false);

  
  const [playlistTracks, setPlaylistTracksState] = useState({});
  
  useEffect(() => {
    let isMounted = true;
    
    
    const fetchTracks = async () => {
      const currentPath = window.location.pathname;
      const isMusicPage = currentPath.startsWith('/music');
      
      if (!isMusicPage) {
        console.log('Не на музыкальной странице, пропускаем загрузку треков');
        return;
      }
      
      
      if (isLoadingRef.current === false && (
        (currentSection === 'all' && tracks.length > 0) ||
        (currentSection === 'liked' && likedTracks.length > 0) ||
        (currentSection === 'popular' && popularTracks.length > 0) ||
        (currentSection === 'new' && newTracks.length > 0) ||
        (currentSection === 'random' && randomTracks.length > 0)
      )) {
        console.log(`Уже есть загруженные треки для секции: ${currentSection}, пропускаем загрузку`);
        return;
      }
      
      
      if (currentSection === 'liked' && hasCheckedLikedTracksRef.current && likedTracksLastLoadedRef.current) {
        const now = Date.now();
        const cacheAge = now - likedTracksLastLoadedRef.current;
        
        if (likedTracks.length === 0 && cacheAge < 15 * 60 * 1000) {
          console.log('Уже проверили, что нет лайкнутых треков, пропускаем запрос (кеш действителен 15 минут)');
          return;
        }
        
        if (likedTracks.length > 0 && cacheAge < 5 * 60 * 1000) {
          console.log('Используем кешированные лайкнутые треки (кеш действителен 5 минут)');
          return;
        }
      }
      
      console.log(`Загрузка треков. isLoadingRef.current=${isLoadingRef.current}`);
      isLoadingRef.current = true;
      setIsLoading(true);
      
      try {
        console.log(`Загружаем треки для секции: ${currentSection}`);
        
        
        let url = '/api/music';
        let params = { page: 1, per_page: 50 };
        
        if (currentSection === 'liked') {
          url = '/api/music/liked';
          
          
          if (isLoadingLikedTracksRef.current) {
            console.log('Загрузка понравившихся треков уже идет, пропускаем повторный запрос');
            isLoadingRef.current = false;
            setIsLoading(false);
            return;
          }
          
          console.log('Загружаем понравившиеся треки с сервера');
          
          isLoadingLikedTracksRef.current = true;
          
          try {
            
            
            const response = await axios.get(url, {
              params: { ...params, _t: Date.now() }, 
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
              },
              withCredentials: true
            });
            
            if (!isMounted) {
              isLoadingLikedTracksRef.current = false;
              isLoadingRef.current = false;
              return;
            }
            
            if (response.data && response.data.tracks) {
              const receivedTracks = response.data.tracks;
              console.log(`Получено ${receivedTracks.length} понравившихся треков`);
              setLikedTracks(receivedTracks);
              setHasMoreTracks(receivedTracks.length >= 50);
              setHasMoreByType(prev => ({ ...prev, liked: receivedTracks.length >= 50 }));
              
              
              likedTracksLastLoadedRef.current = Date.now();
              
              hasCheckedLikedTracksRef.current = true;
            } else {
              
              console.log('Понравившиеся треки не найдены');
              setLikedTracks([]);
              setHasMoreTracks(false);
              setHasMoreByType(prev => ({ ...prev, liked: false }));
              
              
              likedTracksLastLoadedRef.current = Date.now();
              
              hasCheckedLikedTracksRef.current = true;
            }
          } catch (error) {
            console.error('Ошибка при загрузке понравившихся треков:', error);
          } finally {
            
            isLoadingLikedTracksRef.current = false;
            isLoadingRef.current = false;
            setIsLoading(false);
          }
          
          return; 
        } else if (currentSection === 'my-vibe') {
          url = '/api/music/my-vibe';
          console.log('Загружаем "Мой вайб" с сервера');
          
          try {
            const response = await axios.get(url, {
              params: { ...params, _t: Date.now() }, 
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
              },
              withCredentials: true
            });
            
            if (!isMounted) {
              isLoadingRef.current = false;
              return;
            }
            
            if (response.data && response.data.tracks) {
              const receivedTracks = response.data.tracks;
              console.log(`Получено ${receivedTracks.length} треков для "Мой вайб"`);
              
              // Для "Мой вайб" используем специальный список
              setMyVibeTracks(receivedTracks);
              setHasMoreTracks(false); // "Мой вайб" обычно не имеет пагинации
              setHasMoreByType(prev => ({ ...prev, 'my-vibe': false }));
            } else {
              console.log('Треки для "Мой вайб" не найдены');
              setMyVibeTracks([]);
              setHasMoreTracks(false);
              setHasMoreByType(prev => ({ ...prev, 'my-vibe': false }));
            }
          } catch (error) {
            console.error('Ошибка при загрузке "Мой вайб":', error);
          } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
          }
          
          return;
        } else if (currentSection === 'popular') {
          params.sort = 'popular';
        } else if (currentSection === 'new') {
          params.sort = 'date';
        } else if (currentSection === 'random') {
          params.random = true;
          
          params.nocache = Math.random();
        }
        
        
        const response = await axios.get(url, { params });
        if (!isMounted) return;
        
        if (response.data && response.data.tracks) {
          const receivedTracks = response.data.tracks;
          

          if (receivedTracks.length > 0) {
            
            // Only prefetch lyrics if user is actively playing music
            // or has played music in this session
            if (isPlaying || currentTrack) {
              const prefetchCount = Math.min(3, receivedTracks.length);
              console.log(`Pre-fetching lyrics for first ${prefetchCount} tracks...`);
              
              Promise.all(
                receivedTracks.slice(0, prefetchCount).map(async (track) => {
                  try {
                    const lyricsData = await fetchLyricsForTrack(track.id);
                    if (lyricsData) {
                      track.lyricsData = lyricsData;
                    }
                  } catch (err) {
                    console.error(`Error pre-fetching lyrics for track ${track.id}:`, err);
                  }
                })
              ).catch(err => console.error('Error in lyrics pre-fetch batch:', err));
            } else {
              console.log('Skipping lyrics prefetch since no music is playing');
            }
          }
          
          if (currentSection === 'all') {
            setTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, all: receivedTracks.length >= 50 }));
          } else if (currentSection === 'popular') {
            setPopularTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, popular: receivedTracks.length >= 50 }));
          } else if (currentSection === 'new') {
            setNewTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, new: receivedTracks.length >= 50 }));
          } else if (currentSection === 'random') {
            
            const shuffledTracks = [...receivedTracks].sort(() => Math.random() - 0.5);
            setRandomTracks(shuffledTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, random: receivedTracks.length >= 50 }));
            console.log('Загружены и перемешаны случайные треки:', shuffledTracks.length);
          }
          
          
          setTimeout(() => {
            
            if (receivedTracks.length >= 50 && hasMoreByType[currentSection] !== false) {
              console.log(`Предзагрузка следующей порции треков для секции ${currentSection}...`);
              loadMoreTracks(currentSection).catch(error => 
                console.error('Ошибка при предзагрузке треков:', error)
              );
            }
          }, 2000);
        }
        
        isLoadingRef.current = false;
        setIsLoading(false);
      } catch (error) {
        console.error(`Ошибка при загрузке треков для секции ${currentSection}:`, error);
        if (isMounted) {
          setIsLoading(false);
          isLoadingRef.current = false;
        }
        if (currentSection === 'liked') {
          isLoadingLikedTracksRef.current = false;
        }
      }
    };
    
    
    fetchTracks();
    
    return () => {
      isMounted = false;
    };
  }, [currentSection, hasMoreByType, tracks.length, likedTracks.length, popularTracks.length, newTracks.length, randomTracks.length]);
  
  
  useEffect(() => {
    let isMounted = true;
    
    
    const handleTimeUpdate = () => {
      if (isMounted) {
        const audio = audioRef.current;
        

        currentTimeRef.current = audio.currentTime;
        durationRef.current = audio.duration;
        

        if ('mediaSession' in navigator && audio.duration) {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            position: audio.currentTime,
            playbackRate: audio.playbackRate
          });
        }
        


        const now = Date.now();
        if (now - lastTimeUpdateRef.current > 1000) {
          setCurrentTime(audio.currentTime);
          setDuration(audio.duration);
          lastTimeUpdateRef.current = now;
        }
        

        if (enableCrossfade && isPlaying && audio.duration > 0) {
          const timeRemaining = audio.duration - audio.currentTime;
          
          
          if (timeRemaining <= 3 && timeRemaining > 0 && !crossfadeTimeoutRef.current) {
            console.log('Starting crossfade...');
            
            
            getNextTrack().then(nextTrackToPlay => {
              if (nextTrackToPlay) {
                
                nextAudioRef.current.src = nextTrackToPlay.file_path;
                nextAudioRef.current.volume = 0; 
                
                
                const playPromise = nextAudioRef.current.play();
                if (playPromise !== undefined) {
                  playPromise.catch(error => {
                    console.error("Error playing next track during crossfade:", error);
                  });
                }
                
                
                const fadeInterval = setInterval(() => {
                  
                  if (audioRef.current.paused === false) {
                    
                    if (audioRef.current.volume > 0.1) {
                      audioRef.current.volume -= 0.1;
                    } else {
                      audioRef.current.volume = 0;
                    }
                    
                    
                    if (nextAudioRef.current.volume < volume - 0.1) {
                      nextAudioRef.current.volume += 0.1;
                    } else {
                      nextAudioRef.current.volume = volume;
                      
                      
                      audioRef.current.pause();
                      
                      
                      clearInterval(fadeInterval);
                      
                      
                      [audioRef.current, nextAudioRef.current] = [nextAudioRef.current, audioRef.current];
                      
                      
                      setCurrentTrack(nextTrackToPlay);
                      
                      // Сохраняем текущую секцию вместо автоматического определения
                      setCurrentSectionHandler(currentSection);
                      
                      
                      crossfadeTimeoutRef.current = null;
                    }
                  } else {
                    
                    clearInterval(fadeInterval);
                  }
                }, 100);
                
                
                crossfadeTimeoutRef.current = fadeInterval;
              }
            });
          }
          
          
          
          if (timeRemaining <= 10 && timeRemaining > 3) {
            
            getNextTrack().then(nextTrackToLoad => {
              if (nextTrackToLoad && nextAudioRef.current) {
                console.log('Preloading next track:', nextTrackToLoad.title);
                nextAudioRef.current.src = nextTrackToLoad.file_path;
                nextAudioRef.current.load(); 
              }
            });
          }
        }
      }
    };
    
    const handleEnded = () => {
      if (isMounted) {
        
        if (enableCrossfade && crossfadeTimeoutRef.current) {
          
          clearInterval(crossfadeTimeoutRef.current);
          crossfadeTimeoutRef.current = null;
          
          
          audioRef.current.pause();
          
          
          const tempAudio = audioRef.current;
          audioRef.current = nextAudioRef.current;
          nextAudioRef.current = tempAudio;
          
          
          getNextTrack().then(nextTrackToPlay => {
            if (nextTrackToPlay) {
              setCurrentTrack(nextTrackToPlay);
              
              // Сохраняем текущую секцию вместо автоматического определения
              setCurrentSectionHandler(currentSection);
              
              localStorage.setItem('currentTrack', JSON.stringify(nextTrackToPlay));
            }
          }).catch(error => {
            console.error("Error getting next track after track ended:", error);
            
            nextTrack();
          });
        } else {
          
          nextTrack();
        }
      }
    };
    
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleTimeUpdate);
    
    return () => {
      isMounted = false;
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleTimeUpdate);
      
      
      if (timeUpdateThrottleRef.current) {
        clearTimeout(timeUpdateThrottleRef.current);
        timeUpdateThrottleRef.current = null;
      }
      
      
      if (crossfadeTimeoutRef.current) {
        clearInterval(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = null;
      }
    };
  }, [
    enableCrossfade, 
    isPlaying, 
    volume, 
    currentTrack,
    tracks,
    likedTracks,
    popularTracks,
    newTracks,
    randomTracks,
    myVibeTracks,
    searchResults,
    playlistTracks
  ]);

  
  const fetchLyricsForTrack = async (trackId) => {
    try {
      const response = await fetch(`/api/music/${trackId}/lyrics`);
      if (!response.ok) {
        console.error('Failed to fetch lyrics for track', trackId);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lyrics data:', error);
      return null;
    }
  };

  
  const playTrack = (track, section = null) => {
    
    if (isTrackLoading) {
      console.log('Track is already loading, ignoring duplicate request');
      return;
    }
    
    setIsTrackLoading(true);
    
    try {
      
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = null;
      }
      
      
      if (currentTrack && track.id === currentTrack.id) {
        togglePlay();
        setIsTrackLoading(false);
        return;
      }

      // Автоматически определяем секцию, если она не указана
      let trackSection = section || determineSectionFromTrack(track);
      
      // Нормализуем секцию 'all-tracks' в 'all'
      if (trackSection === 'all-tracks') {
        trackSection = 'all';
      }
      
      console.log(`[playTrack] Автоматически определена секция для трека ${track.title}: ${trackSection}`);

      if (!track.lyricsData) {
        fetchLyricsForTrack(track.id)
          .then(lyricsData => {
            if (lyricsData) {
              track.lyricsData = lyricsData;

              if (currentTrack && track.id === currentTrack.id) {
                setCurrentTrack({...track});
              }
            }
          })
          .catch(err => console.error('Error fetching lyrics for track:', err));
      }
      
      console.log(`[playTrack] Начинаем воспроизведение трека: ${track.title} - ${track.artist} в секции: ${trackSection}`);
      
      
      audioRef.current.pause();
      nextAudioRef.current.pause();
      
      
      audioRef.current.src = '';
      nextAudioRef.current.src = '';
      
      
      setCurrentTrack(track);
      setCurrentSectionHandler(trackSection);
      setCurrentTime(0);
      setDuration(0);
      
      
      try {
        localStorage.setItem('currentTrack', JSON.stringify(track));
        localStorage.setItem('currentSection', trackSection);
        console.log(`[playTrack] Сохранен трек и секция в localStorage: ${trackSection}`);
      } catch (error) {
        console.error('Ошибка при сохранении трека в localStorage:', error);
      }
      
      
      audioRef.current = new Audio();
      
      
      const handleCanPlayThrough = () => {
        console.log('Трек загружен и готов к воспроизведению');
        setIsTrackLoading(false);
        
        
        audioRef.current.volume = isMuted ? 0 : volume;
        
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              
              
              try {
                axios.post(`/api/music/${track.id}/play`, {}, { withCredentials: true })
                  .catch(error => console.error('Ошибка при отправке статистики воспроизведения:', error));
                
                
                axios.post('/api/user/now-playing', { 
                  track_id: track.id,
                  artist: track.artist,
                  title: track.title
                }, { withCredentials: true })
                  .catch(error => console.error('Ошибка при установке статуса now playing:', error));
              } catch (error) {
                console.error('Ошибка при отправке статистики воспроизведения:', error);
              }
            })
            .catch(error => {
              console.error('Ошибка при воспроизведении трека:', error);
              setIsPlaying(false);
              setIsTrackLoading(false);
            });
        }
      };
      
      const handleLoadStart = () => {
        console.log('Начало загрузки трека');
      };
      
      const handleError = (error) => {
        console.error('Ошибка при загрузке трека:', error);
        setIsTrackLoading(false);
      };
      
      
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('error', handleError);
      
      
      audioRef.current.src = getAudioUrl(track.file_path);
      audioRef.current.load(); 
      
      
      return () => {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current.removeEventListener('loadstart', handleLoadStart);
        audioRef.current.removeEventListener('error', handleError);
      };
    } catch (error) {
      console.error('Ошибка при воспроизведении трека:', error);
      setIsTrackLoading(false);
    }
  };

  
  const togglePlay = () => {
    if (isTrackLoading) {
      console.log('Track is still loading, ignoring play/pause request');
      return;
    }
    
    try {
      const audio = audioRef.current;
      
      if (!audio.src) {
        
        if (currentTrack) {
          audio.src = getAudioUrl(currentTrack.file_path);
          audio.load();
        } else {
          console.log('No track to play');
          return;
        }
      }
      
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              
              if (currentTrack) {
                axios.post('/api/user/now-playing', { 
                  track_id: currentTrack.id,
                  artist: currentTrack.artist,
                  title: currentTrack.title
                }, { withCredentials: true })
                  .catch(error => console.error('Ошибка при обновлении статуса now playing:', error));
              }
            })
            .catch(error => {
              console.error('Ошибка при воспроизведении:', error);
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error('Ошибка при переключении воспроизведения:', error);
    }
  };

  
  const nextTrack = async () => {
    if (isTrackLoading) {
      console.log('Track is still loading, ignoring next track request');
      return;
    }
    
    setIsTrackLoading(true);
    
    try {
      const nextTrackItem = await getNextTrack();
      if (nextTrackItem) {
        // Передаем текущую секцию, чтобы сохранить контекст
        playTrack(nextTrackItem, currentSection);
      } else {
        console.log('No next track available');
        setIsTrackLoading(false);
      }
    } catch (error) {
      console.error('Error playing next track:', error);
      setIsTrackLoading(false);
    }
  };

  
  const prevTrack = async () => {
    if (isTrackLoading) {
      console.log('Track is still loading, ignoring previous track request');
      return;
    }
    
    setIsTrackLoading(true);
    
    try {
      
      
      if (currentTime < 3) {
        const prevTrackItem = await getPreviousTrack();
        if (prevTrackItem) {
          // Передаем текущую секцию, чтобы сохранить контекст
          playTrack(prevTrackItem, currentSection);
        } else {
          
          audioRef.current.currentTime = 0;
          setIsTrackLoading(false);
        }
      } else {
        
        audioRef.current.currentTime = 0;
        setIsTrackLoading(false);
      }
    } catch (error) {
      console.error('Error playing previous track:', error);
      setIsTrackLoading(false);
    }
  };

  
  const getNextTrack = async () => {
    try {
      if (!currentTrack) return null;
      
      // Для секций artist и playlist_ делаем запрос к бэкенду
      if (currentSection === 'artist' || currentSection.startsWith('playlist_')) {
        try {
          const response = await axios.get('/api/music/next', {
            params: {
              current_id: currentTrack.id,
              context: currentSection
            },
            withCredentials: true
          });
          
          if (response.data.success && response.data.track) {
            console.log(`Получен следующий трек из бэкенда для секции ${currentSection}:`, response.data.track.title);
            return response.data.track;
          } else {
            console.log('Бэкенд не вернул следующий трек');
            return null;
          }
        } catch (error) {
          console.error('Ошибка при запросе следующего трека к бэкенду:', error);
          return null;
        }
      }
      
      // Для остальных секций используем локальные списки
      let trackList;
      switch (currentSection) {
        case 'popular':
          trackList = popularTracks;
          break;
        case 'liked':
          trackList = likedTracks;
          break;
        case 'new':
          trackList = newTracks;
          break;
        case 'random':
          trackList = randomTracks;
          break;
        case 'search':
          trackList = searchResults;
          break;
        case 'my-vibe':
          trackList = myVibeTracks;
          break;
        default:
          trackList = tracks;
      }
      
      if (!trackList || trackList.length === 0) {
        return null;
      }
      
      // Находим текущую позицию в списке
      const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
      
      if (currentIndex === -1) {
        // Если текущий трек не найден в списке, возвращаем первый
        return trackList[0];
      }
      
      // Проверяем, нужно ли загрузить больше треков
      const isNearingEnd = currentIndex >= trackList.length - 3;
      const isNearing15Increment = (currentIndex + 1) % 15 >= 12 || (currentIndex + 1) % 15 === 0;
      
      if ((isNearingEnd || isNearing15Increment) && hasMoreByType[currentSection]) {
        console.log(`Trigger pagination: ${isNearingEnd ? 'nearing end of list' : 'approaching track at multiple of 15'}`);
        console.log(`Current index: ${currentIndex}, Total tracks in list: ${trackList.length}`);
        
        loadMoreTracks(currentSection);
      }
      
      // Возвращаем следующий трек
      if (currentIndex < trackList.length - 1) {
        return trackList[currentIndex + 1];
      } else {
        // Если это последний трек, пытаемся загрузить больше
        if (hasMoreByType[currentSection]) {
          console.log("Reached last track, attempting to load more before looping");
          const loaded = await loadMoreTracks(currentSection);
          
          if (loaded) {
            let updatedTrackList;
            switch (currentSection) {
              case 'popular':
                updatedTrackList = popularTracks;
                break;
              case 'liked':
                updatedTrackList = likedTracks;
                break;
              case 'new':
                updatedTrackList = newTracks;
                break;
              case 'random':
                updatedTrackList = randomTracks;
                break;
              case 'search':
                updatedTrackList = searchResults;
                break;
              case 'my-vibe':
                updatedTrackList = myVibeTracks;
                break;
              default:
                updatedTrackList = tracks;
            }
            
            if (updatedTrackList.length > trackList.length) {
              console.log("New tracks loaded, returning the first new track");
              return updatedTrackList[trackList.length]; 
            }
          }
        }
        
        // Зацикливаемся на первый трек
        return trackList[0];
      }
    } catch (error) {
      console.error('Error getting next track:', error);
      return null;
    }
  };

  
  const getPreviousTrack = async () => {
    try {
      if (!currentTrack) return null;
      
      // Для секций artist и playlist_ делаем запрос к бэкенду
      if (currentSection === 'artist' || currentSection.startsWith('playlist_')) {
        try {
          const response = await axios.get('/api/music/previous', {
            params: {
              current_id: currentTrack.id,
              context: currentSection
            },
            withCredentials: true
          });
          
          if (response.data.success && response.data.track) {
            console.log(`Получен предыдущий трек из бэкенда для секции ${currentSection}:`, response.data.track.title);
            return response.data.track;
          } else {
            console.log('Бэкенд не вернул предыдущий трек');
            return null;
          }
        } catch (error) {
          console.error('Ошибка при запросе предыдущего трека к бэкенду:', error);
          return null;
        }
      }
      
      // Для остальных секций используем локальные списки
      let trackList;
      switch (currentSection) {
        case 'popular':
          trackList = popularTracks;
          break;
        case 'liked':
          trackList = likedTracks;
          break;
        case 'new':
          trackList = newTracks;
          break;
        case 'random':
          trackList = randomTracks;
          break;
        case 'search':
          trackList = searchResults;
          break;
        case 'my-vibe':
          trackList = myVibeTracks;
          break;
        default:
          trackList = tracks;
      }
      
      if (!trackList || trackList.length === 0) {
        return null;
      }
      
      // Находим текущую позицию в списке
      const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
      
      if (currentIndex === -1) {
        // Если текущий трек не найден в списке, возвращаем последний
        return trackList[trackList.length - 1];
      }
      
      // Проверяем, нужно ли загрузить больше треков
      const isNearingStart = currentIndex <= 2;
      const isNearing15Increment = (currentIndex + 1) % 15 <= 3 || (currentIndex + 1) % 15 === 0;
      
      if ((isNearingStart || isNearing15Increment) && hasMoreByType[currentSection]) {
        console.log(`Trigger pagination: ${isNearingStart ? 'nearing start of list' : 'approaching track at multiple of 15'}`);
        console.log(`Current index: ${currentIndex}, Total tracks in list: ${trackList.length}`);
        
        loadMoreTracks(currentSection);
      }
      
      // Возвращаем предыдущий трек
      if (currentIndex > 0) {
        return trackList[currentIndex - 1];
      } else {
        // Если это первый трек, пытаемся загрузить больше
        if (hasMoreByType[currentSection]) {
          console.log("Reached first track, attempting to load more before looping");
          const loaded = await loadMoreTracks(currentSection);
          
          if (loaded) {
            let updatedTrackList;
            switch (currentSection) {
              case 'popular':
                updatedTrackList = popularTracks;
                break;
              case 'liked':
                updatedTrackList = likedTracks;
                break;
              case 'new':
                updatedTrackList = newTracks;
                break;
              case 'random':
                updatedTrackList = randomTracks;
                break;
              case 'search':
                updatedTrackList = searchResults;
                break;
              case 'my-vibe':
                updatedTrackList = myVibeTracks;
                break;
              default:
                updatedTrackList = tracks;
            }
            
            if (updatedTrackList.length > trackList.length) {
              console.log("New tracks loaded, returning the last new track");
              return updatedTrackList[updatedTrackList.length - 1]; 
            }
          }
        }
        
        // Зацикливаемся на последний трек
        return trackList[trackList.length - 1];
      }
    } catch (error) {
      console.error('Error getting previous track:', error);
      return null;
    }
  };

  
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = async () => {
      
      if (crossfadeTimeoutRef.current) {
        console.log('Crossfade is active, letting it handle the transition');
        return;
      }
      
      console.log('Track ended, playing next track');
      
      
      try {
        const nextTrackItem = await getNextTrack();
        if (nextTrackItem) {
          // Передаем текущую секцию, чтобы сохранить контекст
          playTrack(nextTrackItem, currentSection);
        } else {
          console.log('No next track available after current track ended');
        }
      } catch (error) {
        console.error('Error auto-playing next track:', error);
      }
    };
    
    
    audio.addEventListener('ended', handleEnded);
    
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, currentSection]);

  
  const setVolumeHandler = (newVolume) => {
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  
  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  
  const seekTo = (time) => {
    if (audioRef.current) {

      audioRef.current.currentTime = time;
      

      setCurrentTime(time);
      

      currentTimeRef.current = time;
    }
  };

  
  const likeTrack = async (trackId) => {
    try {
      console.log(`Attempting to like/unlike track with ID: ${trackId}`);
      
      
      const trackToUpdate = currentTrack && currentTrack.id === trackId 
        ? currentTrack 
        : tracks.find(t => t.id === trackId) || 
          popularTracks.find(t => t.id === trackId) || 
          newTracks.find(t => t.id === trackId) || 
          randomTracks.find(t => t.id === trackId) || 
          likedTracks.find(t => t.id === trackId);
      
      if (trackToUpdate) {
        
        const newIsLiked = !trackToUpdate.is_liked;
        
        
        if (currentTrack && currentTrack.id === trackId) {
          setCurrentTrack({
            ...currentTrack,
            is_liked: newIsLiked,
            likes_count: newIsLiked 
              ? (currentTrack.likes_count || 0) + 1 
              : Math.max(0, (currentTrack.likes_count || 0) - 1)
          });
        }
        
        
        const updateTrackInList = (list) => {
          return list.map(track => {
            if (track.id === trackId) {
              return {
                ...track,
                is_liked: newIsLiked,
                likes_count: newIsLiked 
                  ? (track.likes_count || 0) + 1 
                  : Math.max(0, (track.likes_count || 0) - 1)
              };
            }
            return track;
          });
        };
        
        
        setTracks(updateTrackInList(tracks));
        setPopularTracks(updateTrackInList(popularTracks));
        setNewTracks(updateTrackInList(newTracks));
        setRandomTracks(updateTrackInList(randomTracks));
        setMyVibeTracks(updateTrackInList(myVibeTracks));
        
        
        if (newIsLiked) {
          
          if (likedTracks.findIndex(track => track.id === trackId) === -1) {
            const updatedTrack = { ...trackToUpdate, is_liked: true };
            setLikedTracks([updatedTrack, ...likedTracks]);
          }
        } else {
          
          setLikedTracks(likedTracks.filter(track => track.id !== trackId));
        }
      }
      
      
      const response = await axios.post(`/api/music/${trackId}/like`, {}, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      
      console.log(`API response:`, response.data);
      
      if (response.data.success) {
        const isLiked = response.data.is_liked;
        console.log(`Track ${trackId} ${isLiked ? 'liked' : 'unliked'} successfully`);
        
        
        if (trackToUpdate && trackToUpdate.is_liked !== isLiked) {
          console.log('Server state different from local, updating again');
          
          
          const updateTrackInList = (list) => {
            return list.map(track => {
              if (track.id === trackId) {
                return {
                  ...track,
                  is_liked: isLiked,
                  likes_count: isLiked 
                    ? (track.likes_count || 0) + 1 
                    : Math.max(0, (track.likes_count || 0) - 1)
                };
              }
              return track;
            });
          };
          
          
          setTracks(updateTrackInList(tracks));
          setPopularTracks(updateTrackInList(popularTracks));
          setNewTracks(updateTrackInList(newTracks));
          setRandomTracks(updateTrackInList(randomTracks));
          setMyVibeTracks(updateTrackInList(myVibeTracks));
          
          
          if (!isLiked) {
            setLikedTracks(likedTracks.filter(track => track.id !== trackId));
          } else if (likedTracks.findIndex(track => track.id === trackId) === -1) {
            const trackToAdd = 
              tracks.find(track => track.id === trackId) ||
              popularTracks.find(track => track.id === trackId) ||
              newTracks.find(track => track.id === trackId) ||
              randomTracks.find(track => track.id === trackId);
              
            if (trackToAdd) {
              const updatedTrack = { ...trackToAdd, is_liked: true };
              setLikedTracks([updatedTrack, ...likedTracks]);
            }
          }
        }
        
        
        likedTracksLastLoadedRef.current = Date.now();
        
        return { success: true, is_liked: isLiked };
      } else {
        console.error('Ошибка при лайке/анлайке трека:', response.data.message);
        
        
        if (trackToUpdate) {
          const isLiked = trackToUpdate.is_liked; 
          
          
          const updateTrackInList = (list) => {
            return list.map(track => {
              if (track.id === trackId) {
                return {
                  ...track,
                  is_liked: isLiked,
                  likes_count: isLiked 
                    ? (track.likes_count || 0) 
                    : Math.max(0, (track.likes_count || 0))
                };
              }
              return track;
            });
          };
          
          
          setTracks(updateTrackInList(tracks));
          setPopularTracks(updateTrackInList(popularTracks));
          setNewTracks(updateTrackInList(newTracks));
          setRandomTracks(updateTrackInList(randomTracks));
          setMyVibeTracks(updateTrackInList(myVibeTracks));
          
          
          if (currentTrack && currentTrack.id === trackId) {
            setCurrentTrack({
              ...currentTrack,
              is_liked: isLiked
            });
          }
        }
        
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Ошибка при лайке/анлайке трека:', error);
      
      
      if (currentTrack && currentTrack.id === trackId) {
        
        setCurrentTrack({...currentTrack});
      }
      
      return { success: false, message: 'Произошла ошибка при обновлении статуса лайка' };
    }
  };

  
  const uploadTrack = async (file, trackInfo) => {
    try {
      
      const formData = new FormData();
      formData.append('audio', file);
      
      
      if (trackInfo) {
        formData.append('title', trackInfo.title || '');
        formData.append('artist', trackInfo.artist || '');
        formData.append('album', trackInfo.album || '');
      }
      
      
      try {
        
        const extractMetadata = () => {
          return new Promise((resolve, reject) => {
            if (typeof window.jsmediatags === 'undefined') {
              console.log('jsmediatags не загружен, пропускаем извлечение метаданных');
              resolve(null);
              return;
            }
            
            window.jsmediatags.read(file, {
              onSuccess: function(tag) {
                console.log("Метаданные успешно извлечены:", tag);
                
                
                const tags = tag.tags || {};
                const title = tags.title || '';
                const artist = tags.artist || '';
                const album = tags.album || '';
                
                
                let pictureData = null;
                if (tags.picture) {
                  const { data, format } = tags.picture;
                  const base64String = data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                  pictureData = `data:${format};base64,${window.btoa(base64String)}`;
                }
                
                
                resolve({
                  title: title || trackInfo?.title || '',
                  artist: artist || trackInfo?.artist || '',
                  album: album || trackInfo?.album || '',
                  pictureData
                });
              },
              onError: function(error) {
                console.warn("Ошибка при извлечении метаданных:", error);
                resolve(null);
              }
            });
          });
        };
        
        
        const metadata = await extractMetadata();
        
        if (metadata) {
          
          if (metadata.title) formData.append('title', metadata.title);
          if (metadata.artist) formData.append('artist', metadata.artist);
          if (metadata.album) formData.append('album', metadata.album);
          
          
          if (metadata.pictureData) {
            
            const fetchResponse = await fetch(metadata.pictureData);
            const blob = await fetchResponse.blob();
            
            
            const coverFile = new File([blob], 'cover.jpg', { type: blob.type });
            formData.append('cover', coverFile);
          }
        }
      } catch (error) {
        console.error('Ошибка при извлечении метаданных:', error);
      }
      
      
      const response = await axios.post('/api/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        
        const updatedTracks = [response.data.track, ...tracks];
        setTracks(updatedTracks);
        
        
        const newTracksList = [response.data.track, ...newTracks].slice(0, 10);
        setNewTracks(newTracksList);
        
        // Обновляем "Мой вайб" если он содержит треки
        if (myVibeTracks.length > 0) {
          const updatedMyVibeTracks = [response.data.track, ...myVibeTracks].slice(0, 30);
          setMyVibeTracks(updatedMyVibeTracks);
        }
        
        return response.data.track;
      }
      
      return null;
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      return null;
    }
  };

  
  useEffect(() => {
    if (!currentTrack) return;
    
    
    if ('mediaSession' in navigator) {
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || '',
        artwork: [
          {
            src: currentTrack.cover_path || '/uploads/system/album_placeholder.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      });
      
      
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      
      
      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      
      
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime) {
          seekTo(details.seekTime);
        }
      });
      
      
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          
          navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
      });
      
      
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        console.log("iOS device detected, applying special handling for media controls");
        
        
        const audioElement = audioRef.current;
        
        const iosPlayHandler = () => {
          navigator.mediaSession.playbackState = 'playing';
          navigator.mediaSession.metadata = navigator.mediaSession.metadata;
        };
        
        const iosPauseHandler = () => {
          navigator.mediaSession.playbackState = 'paused';
          navigator.mediaSession.metadata = navigator.mediaSession.metadata;
        };
        
        audioElement.addEventListener('play', iosPlayHandler);
        audioElement.addEventListener('pause', iosPauseHandler);
        
        return () => {
          audioElement.removeEventListener('play', iosPlayHandler);
          audioElement.removeEventListener('pause', iosPauseHandler);
        };
      }
    }
  }, [currentTrack, isPlaying]);

  
  const loadMoreTracks = useCallback(async (type = 'all') => {
    console.log(`[loadMoreTracks] Начало загрузки типа: ${type}`);
    
    if (isLoadingMoreRef.current) {
      console.log(`[loadMoreTracks] Пропускаем загрузку для ${type}: уже идет загрузка`);
      return false;
    }
    
    
    const hasMoreForType = hasMoreByType[type] !== false;
    if (!hasMoreForType) {
      console.log(`[loadMoreTracks] Пропускаем загрузку для ${type}: больше нет треков (hasMoreByType = ${hasMoreByType[type]})`);
      return false;
    }
    
    
    
    if (pageByType[type] === 1 && (
      (type === 'all' && tracks.length === 0) ||
      (type === 'liked' && likedTracks.length === 0) ||
      (type === 'random' && randomTracks.length === 0) ||
      (type === 'popular' && popularTracks.length === 0) ||
      (type === 'new' && newTracks.length === 0)
    )) {
      console.log(`[loadMoreTracks] Пропускаем загрузку для ${type}: ожидается загрузка первой страницы`);
      return false;
    }
    
    console.log(`[loadMoreTracks] Устанавливаем флаги загрузки для типа: ${type}`);
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    
    try {
      
      let nextPage = pageByType[type] + 1;
      console.log(`[loadMoreTracks] Загрузка страницы ${nextPage} для типа: ${type}`);
      
      let endpoint = '/api/music';
      let params = { page: nextPage, per_page: 50 };
      
      let response;
      
      if (type === 'liked') {
        endpoint = '/api/music/liked';
        params = { page: nextPage, per_page: 50 };
        
        console.log(`[loadMoreTracks] Запрос для понравившихся треков: ${endpoint}`, params);
        
        const config = {
          params,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          withCredentials: true
        };
        
        response = await axios.get(endpoint, config);
        console.log(`[loadMoreTracks] Получен ответ для liked треков:`, {
          status: response.status,
          hasData: !!response.data,
          hasTracks: !!(response.data && response.data.tracks),
          tracksCount: response.data && response.data.tracks ? response.data.tracks.length : 0
        });
      } else if (type === 'my-vibe') {
        endpoint = '/api/music/my-vibe';
        params = { page: nextPage, per_page: 50 };
        
        console.log(`[loadMoreTracks] Запрос для "Мой вайб": ${endpoint}`, params);
        
        const config = {
          params,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          withCredentials: true
        };
        
        response = await axios.get(endpoint, config);
        console.log(`[loadMoreTracks] Получен ответ для "Мой вайб":`, {
          status: response.status,
          hasData: !!response.data,
          hasTracks: !!(response.data && response.data.tracks),
          tracksCount: response.data && response.data.tracks ? response.data.tracks.length : 0
        });
      } else if (type === 'popular') {
        params.sort = 'popular';
      } else if (type === 'new') {
        params.sort = 'date';
      } else if (type === 'random') {
        params.random = true;
        
        params.nocache = Math.random();
      }
      
      console.log(`[loadMoreTracks] Загружаем треки для типа "${type}" со страницы ${nextPage}`);
      
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      
      if (type !== 'liked') {
        response = await axios.get(endpoint, { params });
      }
      
      
      let newTracks = [];
      let has_more = false;
      
      
      if (response && response.data && response.data.tracks) {
        newTracks = response.data.tracks;
        has_more = newTracks.length >= 50; 
        
        if (response.data.has_more !== undefined) {
          has_more = response.data.has_more;
        } else if (response.data.pages !== undefined) {
          has_more = nextPage < response.data.pages;
        }
        
        console.log(`[loadMoreTracks] Данные получены в формате { tracks: [...] }, количество: ${newTracks.length}, has_more: ${has_more}`);
        

        if (newTracks.length > 0) {

          const prefetchCount = Math.min(2, newTracks.length);
          console.log(`[loadMoreTracks] Pre-fetching lyrics for first ${prefetchCount} tracks in this batch...`);
          

          Promise.all(
            newTracks.slice(0, prefetchCount).map(async (track) => {
              if (!track.lyricsData) {
                try {
                  const lyricsData = await fetchLyricsForTrack(track.id);
                  if (lyricsData) {
                    track.lyricsData = lyricsData;
                  }
                } catch (err) {
                  console.error(`[loadMoreTracks] Error pre-fetching lyrics for track ${track.id}:`, err);
                }
              }
            })
          ).catch(err => console.error('[loadMoreTracks] Error in lyrics pre-fetch batch:', err));
        }
      } else if (response && Array.isArray(response.data)) {
        
        newTracks = response.data;
        has_more = newTracks.length >= 50;
        console.log(`[loadMoreTracks] Данные получены в формате массива, количество: ${newTracks.length}, has_more: ${has_more}`);
      } else if (type !== 'liked') {
        console.warn(`[loadMoreTracks] Странный формат ответа API для типа ${type}:`, response ? response.data : 'Нет ответа');
      }
      
      
      if (newTracks.length === 0) {
        has_more = false;
        console.log(`[loadMoreTracks] Не получено новых треков, устанавливаем has_more = false`);
      }
      
      console.log(`[loadMoreTracks] Получено ${newTracks.length} треков для типа ${type}, есть еще: ${has_more}`);
      
      
      if (type === 'all') {
        setTracks(prevTracks => [...prevTracks, ...newTracks]);
      } else if (type === 'liked') {
        
        if (response && response.data && response.data.tracks) {
          console.log(`[loadMoreTracks] Добавляем ${response.data.tracks.length} понравившихся треков к существующим ${likedTracks.length}`);
          setLikedTracks(prevTracks => [...prevTracks, ...response.data.tracks]);
        } else {
          console.log(`[loadMoreTracks] Добавляем ${newTracks.length} понравившихся треков к существующим ${likedTracks.length}`);
          setLikedTracks(prevTracks => [...prevTracks, ...newTracks]);
        }
      } else if (type === 'my-vibe') {
        
        if (response && response.data && response.data.tracks) {
          console.log(`[loadMoreTracks] Добавляем ${response.data.tracks.length} треков "Мой вайб" к существующим ${myVibeTracks.length}`);
          setMyVibeTracks(prevTracks => [...prevTracks, ...response.data.tracks]);
        } else {
          console.log(`[loadMoreTracks] Добавляем ${newTracks.length} треков "Мой вайб" к существующим ${myVibeTracks.length}`);
          setMyVibeTracks(prevTracks => [...prevTracks, ...newTracks]);
        }
      } else if (type === 'popular') {
        setPopularTracks(prevTracks => [...prevTracks, ...newTracks]);
      } else if (type === 'new') {
        setNewTracks(prevTracks => [...prevTracks, ...newTracks]);
      } else if (type === 'random') {
        
        const shuffledNewTracks = [...newTracks].sort(() => Math.random() - 0.5);
        setRandomTracks(prevTracks => [...prevTracks, ...shuffledNewTracks]);
        console.log('[loadMoreTracks] Добавлены и перемешаны случайные треки:', shuffledNewTracks.length);
      }
      
      
      setPageByType(prev => ({
        ...prev,
        [type]: nextPage
      }));
      console.log(`[loadMoreTracks] Обновлена страница для типа ${type} на ${nextPage}`);
      
      
      setHasMoreByType(prev => ({
        ...prev,
        [type]: has_more
      }));
      console.log(`[loadMoreTracks] Обновлен флаг hasMoreByType[${type}] = ${has_more}`);
      
      
      if (currentSection === type) {
        setHasMoreTracks(has_more);
        console.log(`[loadMoreTracks] Обновлен основной флаг hasMoreTracks = ${has_more}`);
      }
      
      
      if (has_more) {
        setTimeout(() => {
          preloadNextPage(nextPage + 1, type);
        }, 1000);
        console.log(`[loadMoreTracks] Запланирована предзагрузка следующей страницы ${nextPage + 1} для типа ${type}`);
      }
      
      console.log(`[loadMoreTracks] Успешно завершена загрузка для типа ${type}`);
      return true;
    } catch (error) {
      console.error('[loadMoreTracks] Ошибка при загрузке треков:', error);
      
      
      if (error.response && error.response.status === 404) {
        setHasMoreByType(prev => ({ ...prev, [type]: false }));
        if (currentSection === type) {
          setHasMoreTracks(false);
        }
        console.log(`[loadMoreTracks] Получен 404, устанавливаем hasMoreByType[${type}] = false`);
      }
      
      return false;
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
      console.log(`[loadMoreTracks] Сброшены флаги загрузки для типа ${type}`);
    }
  }, [pageByType, hasMoreByType, tracks.length, likedTracks.length, randomTracks.length, popularTracks.length, newTracks.length, currentSection]);
  
  
  const preloadNextPage = useCallback(async (nextPage, type = 'all') => {
    try {
      
      const now = Date.now();
      const lastPreloadTime = preloadTimeRef.current?.[type] || 0;
      
      
      if (now - lastPreloadTime < 30000) {
        console.log(`Пропускаем предзагрузку для ${type}: прошло менее 30 секунд с последнего запроса`);
        return;
      }
      
      
      preloadTimeRef.current = {
        ...(preloadTimeRef.current || {}),
        [type]: now
      };
      
      
      if (type === 'liked') {
        let endpoint = '/api/music/liked';
        let params = { page: nextPage, per_page: 50 };
        
        try {
          const response = await axios.get(endpoint, { 
            params,
            headers: {
              'Cache-Control': 'max-age=300'  
            }
          });
          console.log(`Предзагружено ${response.data.tracks?.length || 0} понравившихся треков для страницы ${nextPage}`);
        } catch (error) {
          console.error('Ошибка при предзагрузке понравившихся треков:', error);
        }
        return;
      }
      
      if (type === 'my-vibe') {
        let endpoint = '/api/music/my-vibe';
        let params = { page: nextPage, per_page: 50 };
        
        try {
          const response = await axios.get(endpoint, { 
            params,
            headers: {
              'Cache-Control': 'max-age=300'  
            }
          });
          console.log(`Предзагружено ${response.data.tracks?.length || 0} треков "Мой вайб" для страницы ${nextPage}`);
        } catch (error) {
          console.error('Ошибка при предзагрузке "Мой вайб":', error);
        }
        return;
      }
      
      let endpoint = '/api/music';
      let params = { page: nextPage, per_page: 50 };
      
      
      if (type === 'popular') {
        params.sort = 'popular';
      } else if (type === 'new') {
        params.sort = 'date';
      } else if (type === 'random') {
        params.random = true;
      }
      
      const response = await axios.get(endpoint, { 
        params,
        headers: {
          'Cache-Control': 'max-age=300'  
        }
      });
      console.log(`Предзагружено ${response.data.tracks.length} треков для страницы ${nextPage} (тип: ${type})`);
    } catch (error) {
      console.error('Ошибка при предзагрузке треков:', error);
    }
  }, []);

  
  const searchTracks = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return [];
    }
    
    try {
      console.log('[SEARCH] Начинаем поиск для:', query);
      setIsSearching(true);
      
      const response = await axios.get('/api/music/search', {
        params: { query: query.trim() },
        timeout: 10000, 
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        withCredentials: true // Важно для аутентификации!
      });
      
      console.log('[SEARCH] Полный ответ сервера:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        length: Array.isArray(response.data) ? response.data.length : 'N/A'
      });
      
      const tracks = response.data;
      
      // Детальная проверка данных
      if (!Array.isArray(tracks)) {
        console.warn('[SEARCH] Ответ сервера не является массивом:', tracks);
        setSearchResults([]);
        return [];
      }
      
      if (tracks.length === 0) {
        console.log('[SEARCH] Сервер вернул пустой массив для запроса:', query);
        setSearchResults([]);
        return [];
      }
      
      console.log('[SEARCH] Получено треков:', tracks.length);
      
      // Обработка результатов поиска
      const processedTracks = tracks.map((track, index) => {
        console.log(`[SEARCH] Обрабатываем трек ${index + 1}:`, {
          id: track.id,
          title: track.title,
          artist: track.artist,
          file_path: track.file_path,
          cover_path: track.cover_path
        });
        
        return {
          ...track,
          // Проверяем статус лайка
          is_liked: typeof track.is_liked === 'boolean' ? track.is_liked : 
                    Boolean(likedTracks.find(lt => lt.id === track.id)),
          // Добавляем дефолтные пути если отсутствуют
          file_path: track.file_path || "/static/uploads/system/audio_placeholder.mp3",
          cover_path: track.cover_path || "/static/uploads/system/album_placeholder.jpg"
        };
      });
      
      console.log('[SEARCH] Обработанные треки:', processedTracks);
      setSearchResults(processedTracks);
      return processedTracks;
    } catch (error) {
      console.error('[SEARCH] Подробная ошибка при поиске треков:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'Нет ответа',
        request: error.request ? 'Запрос был отправлен' : 'Запрос не был отправлен',
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          params: error.config.params
        } : 'Нет конфига'
      });
      
      // Подробная обработка ошибок
      if (error.response) {
        // Сервер ответил с ошибкой
        if (error.response.status === 401) {
          console.error('[SEARCH] Требуется аутентификация для поиска');
        } else if (error.response.status === 403) {
          console.error('[SEARCH] Доступ запрещен');
        } else if (error.response.status === 404) {
          console.error('[SEARCH] Эндпоинт поиска не найден');
        } else {
          console.error(`[SEARCH] Ошибка сервера: ${error.response.status} - ${error.response.data?.error || 'Неизвестная ошибка'}`);
        }
      } else if (error.request) {
        // Запрос был отправлен, но ответа не получено
        console.error('[SEARCH] Нет ответа от сервера при поиске');
      } else {
        // Ошибка при настройке запроса
        console.error('[SEARCH] Ошибка при настройке запроса:', error.message);
      }
      
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  
  const resetPagination = useCallback(async (type, randomize = false) => {
    console.log(`[resetPagination] Сброс пагинации для типа: ${type}, randomize: ${randomize ? 'true' : 'false'}`);
    
    
    setPageByType(prev => ({
      ...prev,
      [type]: 1
    }));
    
    
    return new Promise(async (resolve, reject) => {
      try {
        
        let url = '/api/music';
        let params = { page: 1, per_page: 50 };
        
        if (type === 'liked') {
          url = '/api/music/liked';
          
          
          try {
            const config = {
              params,
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
              },
              withCredentials: true
            };
            
            console.log('[resetPagination] Запрашиваем понравившиеся треки', config);
            const response = await axios.get(url, config);
            
            if (response.data && response.data.tracks) {
              const receivedTracks = response.data.tracks;
              console.log(`[resetPagination] Получено ${receivedTracks.length} понравившихся треков`);
              
              
              const hasMore = receivedTracks.length >= params.per_page;
              console.log(`[resetPagination] Устанавливаем hasMoreByType[liked] = ${hasMore}`);
              
              setLikedTracks(receivedTracks);
              setHasMoreByType(prev => ({ ...prev, liked: hasMore }));
              
              if (currentSection === 'liked') {
                setHasMoreTracks(hasMore);
              }
              
              resolve(true);
              return;
            } else {
              console.log('[resetPagination] В ответе нет понравившихся треков');
              setLikedTracks([]);
              setHasMoreByType(prev => ({ ...prev, liked: false }));
              
              if (currentSection === 'liked') {
                setHasMoreTracks(false);
              }
              
              resolve(false);
              return;
            }
          } catch (error) {
            console.error('[resetPagination] Ошибка при загрузке понравившихся треков:', error);
            setHasMoreByType(prev => ({ ...prev, liked: false }));
            
            if (currentSection === 'liked') {
              setHasMoreTracks(false);
            }
            
            reject(error);
            return;
          }
        } else if (type === 'my-vibe') {
          url = '/api/music/my-vibe';
          
          
          try {
            const config = {
              params,
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
              },
              withCredentials: true
            };
            
            console.log('[resetPagination] Запрашиваем "Мой вайб"', config);
            const response = await axios.get(url, config);
            
            if (response.data && response.data.tracks) {
              const receivedTracks = response.data.tracks;
              console.log(`[resetPagination] Получено ${receivedTracks.length} треков для "Мой вайб"`);
              
              
              const hasMore = receivedTracks.length >= params.per_page;
              console.log(`[resetPagination] Устанавливаем hasMoreByType[my-vibe] = ${hasMore}`);
              
              setMyVibeTracks(receivedTracks);
              setHasMoreByType(prev => ({ ...prev, 'my-vibe': hasMore }));
              
              if (currentSection === 'my-vibe') {
                setHasMoreTracks(hasMore);
              }
              
              resolve(true);
              return;
            } else {
              console.log('[resetPagination] В ответе нет треков для "Мой вайб"');
              setMyVibeTracks([]);
              setHasMoreByType(prev => ({ ...prev, 'my-vibe': false }));
              
              if (currentSection === 'my-vibe') {
                setHasMoreTracks(false);
              }
              
              resolve(false);
              return;
            }
          } catch (error) {
            console.error('[resetPagination] Ошибка при загрузке "Мой вайб":', error);
            setHasMoreByType(prev => ({ ...prev, 'my-vibe': false }));
            
            if (currentSection === 'my-vibe') {
              setHasMoreTracks(false);
            }
            
            reject(error);
            return;
          }
        } else if (type === 'popular') {
          params.sort = 'popular';
        } else if (type === 'new') {
          params.sort = 'date';
        }
        
        
        if (randomize) {
          params.random = true;
          
          params.nocache = Math.random();
        }
        
        
        const response = await axios.get(url, { params });
        
        if (response.data && response.data.tracks) {
          const receivedTracks = response.data.tracks;
          
          
          if (type === 'all') {
            setTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, all: receivedTracks.length >= 50 }));
          } else if (type === 'liked') {
            setLikedTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, liked: receivedTracks.length >= 50 }));
          } else if (type === 'my-vibe') {
            setMyVibeTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, 'my-vibe': receivedTracks.length >= 50 }));
          } else if (type === 'popular') {
            setPopularTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, popular: receivedTracks.length >= 50 }));
          } else if (type === 'new') {
            setNewTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 50);
            setHasMoreByType(prev => ({ ...prev, new: receivedTracks.length >= 50 }));
          }
          
          
          resolve(true);
        } else {
          
          reject(new Error('Не удалось загрузить треки'));
        }
      } catch (error) {
        console.error(`Ошибка при сбросе пагинации для типа ${type}:`, error);
        reject(error);
      }
    });
  }, []);

  
  useEffect(() => {
    
    if (initialMount.current) {
      try {
        const savedTrack = localStorage.getItem('currentTrack');
        const savedSection = localStorage.getItem('currentSection') || 'all';
        
        // Проверяем, что сохраненная секция валидна
        const validSections = ['all', 'popular', 'liked', 'new', 'random', 'my-vibe'];
        const isValidSection = validSections.includes(savedSection) || savedSection.startsWith('playlist_');
        
        if (savedTrack) {
          const parsedTrack = JSON.parse(savedTrack);
          setCurrentTrack(parsedTrack);
          
          // Устанавливаем секцию только если она валидна
          if (isValidSection) {
            setCurrentSectionHandler(savedSection);
          } else {
            console.log('[useEffect] Невалидная секция в localStorage, сбрасываем на "all"');
            setCurrentSectionHandler('all');
          }
          
          audioRef.current.src = parsedTrack.file_path;
          audioRef.current.volume = volume;
          setIsPlaying(false);
          
          console.log('Восстановлен последний трек из localStorage:', parsedTrack.title);
        } else {
          // Если нет сохраненного трека, сбрасываем секцию на "all"
          setCurrentSectionHandler('all');
        }
      } catch (error) {
        console.error('Ошибка при восстановлении трека:', error);
        // При ошибке сбрасываем секцию на "all"
        setCurrentSectionHandler('all');
      }
      
      initialMount.current = false;
    }
  }, [volume]);

  
  
  useEffect(() => {
    let inactivityTimer = null;
    let lastClearTime = Date.now();
    const throttleTime = 15000; 
    
    
    const clearNowPlayingStatus = () => {
      const now = Date.now();
      
      if (now - lastClearTime > throttleTime) {
        lastClearTime = now;
        axios.post('/api/user/clear-now-playing', {}, { withCredentials: true })
          .then(response => {
            console.log('Статус now playing очищен', response.data);
          })
          .catch(error => {
            console.error('Ошибка при очистке статуса now playing:', error);
          });
      }
    };
    
    
    if (isPlaying && currentTrack) {
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      
      inactivityTimer = setTimeout(() => {
        
        clearNowPlayingStatus();
      }, 5 * 60 * 1000); 
    } else if (!isPlaying && currentTrack) {
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      inactivityTimer = setTimeout(() => {
        clearNowPlayingStatus();
      }, 5 * 60 * 1000); 
    }
    
    
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      clearNowPlayingStatus();
    };
  }, [isPlaying, currentTrack]);

  
  const getCurrentTimeRaw = useCallback(() => {
    const audio = audioRef.current;

    if (audio && !isNaN(audio.currentTime)) {
      return audio.currentTime;
    }
    return currentTimeRef.current || 0;
  }, []);

  
  const getDurationRaw = useCallback(() => {
    const audio = audioRef.current;

    if (audio && !isNaN(audio.duration)) {
      return audio.duration;
    }
    return durationRef.current || 0;
  }, []);

  
  const setPlaylistTracks = useCallback((tracks, playlistId) => {
    console.log(`Setting ${tracks.length} tracks for playlist ${playlistId}`);
    setPlaylistTracksState(prevState => ({
      ...prevState,
      [playlistId]: tracks
    }));
  }, []);

  // Функция для автоматического определения секции по треку
  const determineSectionFromTrack = (track) => {
    // Сначала проверяем, есть ли явно указанная секция в URL или контексте
    const currentPath = window.location.pathname;
    
    // Проверяем URL для определения текущей страницы
    if (currentPath.includes('/music/liked') || currentPath.includes('/liked')) {
      return 'liked';
    }
    if (currentPath.includes('/music/popular') || currentPath.includes('/popular')) {
      return 'popular';
    }
    if (currentPath.includes('/music/new') || currentPath.includes('/new')) {
      return 'new';
    }
    if (currentPath.includes('/music/random') || currentPath.includes('/random')) {
      return 'random';
    }
    if (currentPath.includes('/music/my-vibe') || currentPath.includes('/my-vibe')) {
      return 'my-vibe';
    }
    if (currentPath.includes('/music/all') || currentPath.includes('/all-tracks')) {
      return 'all';
    }
    
    // Если URL не помогает, проверяем треки в списках
    if (likedTracks.find(t => t.id === track.id)) {
      return 'liked';
    }
    if (popularTracks.find(t => t.id === track.id)) {
      return 'popular';
    }
    if (newTracks.find(t => t.id === track.id)) {
      return 'new';
    }
    if (randomTracks.find(t => t.id === track.id)) {
      return 'random';
    }
    if (myVibeTracks.find(t => t.id === track.id)) {
      return 'my-vibe';
    }
    if (searchResults.find(t => t.id === track.id)) {
      return 'search';
    }
    // Проверяем плейлисты
    for (const [playlistId, tracks] of Object.entries(playlistTracks)) {
      if (tracks.find(t => t.id === track.id)) {
        return `playlist_${playlistId}`;
      }
    }
    // По умолчанию возвращаем "all"
    return 'all';
  };

  // Функции для управления секцией
  const setCurrentSectionHandler = (section) => {
    console.log(`[setCurrentSection] Устанавливаем секцию: ${section}`);
    setCurrentSection(section);
    
    // Сохраняем секцию в localStorage только если это не временная секция
    if (section && !section.startsWith('playlist_') && section !== 'search') {
      try {
        localStorage.setItem('currentSection', section);
        console.log(`[setCurrentSection] Сохранена секция в localStorage: ${section}`);
      } catch (error) {
        console.error('Ошибка при сохранении секции в localStorage:', error);
      }
    }
  };

  const resetCurrentSection = () => {
    console.log('[resetCurrentSection] Сбрасываем текущую секцию');
    setCurrentSection('all');
    
    try {
      localStorage.removeItem('currentSection');
      console.log('[resetCurrentSection] Удалена секция из localStorage');
    } catch (error) {
      console.error('Ошибка при удалении секции из localStorage:', error);
    }
  };

  // Функции для управления полноэкранным плеером
  const openFullScreenPlayer = useCallback(() => {
    console.log('[FullScreen] Открытие полноэкранного плеера');
    setIsFullScreenPlayerOpen(true);
    
    // Проверяем, работаем ли мы на iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent);
    
    // Более безопасный способ скрытия для мобильных устройств
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (isIOS || isSafari) {
        // Для iOS/Safari используем transform
        rootElement.style.transform = 'translateX(-100vw)';
        rootElement.style.position = 'fixed';
        rootElement.style.visibility = 'hidden';
        rootElement.style.opacity = '0';
      } else {
        // Для других браузеров используем обычные стили
        rootElement.style.visibility = 'hidden';
        rootElement.style.position = 'fixed';
        rootElement.style.top = '-9999px';
        rootElement.style.left = '-9999px';
        rootElement.style.zIndex = '-1';
        rootElement.style.opacity = '0';
        rootElement.style.pointerEvents = 'none';
      }
    }
    
    // Предотвращаем скролл на мобильных устройствах
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = 'hidden';
      if (isIOS) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100vh';
      }
    }
  }, []);

  const closeFullScreenPlayer = useCallback(() => {
    console.log('[FullScreen] Закрытие полноэкранного плеера');
    setIsFullScreenPlayerOpen(false);
    
    // Проверяем, работаем ли мы на iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent);
    
    // Восстанавливаем основное приложение
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (isIOS || isSafari) {
        // Для iOS/Safari восстанавливаем transform
        rootElement.style.transform = '';
        rootElement.style.position = '';
        rootElement.style.visibility = '';
        rootElement.style.opacity = '';
        rootElement.style.pointerEvents = '';
      } else {
        // Для других браузеров восстанавливаем обычные стили
        rootElement.style.visibility = '';
        rootElement.style.position = '';
        rootElement.style.top = '';
        rootElement.style.left = '';
        rootElement.style.zIndex = '';
        rootElement.style.opacity = '';
        rootElement.style.pointerEvents = '';
      }
    }
    
    // Восстанавливаем скролл
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
  }, []);

  // Функция для принудительной загрузки треков (для вызова при переходе на музыкальную страницу)
  const forceLoadTracks = useCallback(async (section = null) => {
    console.log('Принудительная загрузка треков для секции:', section || currentSection);
    
    const targetSection = section || currentSection;
    
    // Сбрасываем состояние загрузки
    isLoadingRef.current = false;
    
    // Принудительно загружаем треки
    try {
      let url = '/api/music';
      let params = { page: 1, per_page: 50 };
      
      if (targetSection === 'liked') {
        url = '/api/music/liked';
        isLoadingLikedTracksRef.current = false; // Сбрасываем флаг
      } else if (targetSection === 'my-vibe') {
        url = '/api/music/my-vibe';
      } else if (targetSection === 'popular') {
        params.sort = 'popular';
      } else if (targetSection === 'new') {
        params.sort = 'date';
      } else if (targetSection === 'random') {
        params.random = true;
        params.nocache = Math.random();
      }
      
      setIsLoading(true);
      isLoadingRef.current = true;
      
      const response = await axios.get(url, { params });
      
      if (response.data && response.data.tracks) {
        const receivedTracks = response.data.tracks;
        
        if (targetSection === 'all') {
          setTracks(receivedTracks);
        } else if (targetSection === 'popular') {
          setPopularTracks(receivedTracks);
        } else if (targetSection === 'liked') {
          setLikedTracks(receivedTracks);
        } else if (targetSection === 'new') {
          setNewTracks(receivedTracks);
        } else if (targetSection === 'random') {
          const shuffledTracks = [...receivedTracks].sort(() => Math.random() - 0.5);
          setRandomTracks(shuffledTracks);
        } else if (targetSection === 'my-vibe') {
          setMyVibeTracks(receivedTracks);
        }
        
        setHasMoreTracks(receivedTracks.length >= 50);
        setHasMoreByType(prev => ({ ...prev, [targetSection]: receivedTracks.length >= 50 }));
        
        console.log(`Принудительно загружено ${receivedTracks.length} треков для секции: ${targetSection}`);
      }
    } catch (error) {
      console.error('Ошибка при принудительной загрузке треков:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentSection]);
  
  
  const musicContextValue = {
    tracks,
    popularTracks,
    likedTracks,
    newTracks,
    randomTracks,
    myVibeTracks,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    isLoading,
    audioRef,
    hasMoreTracks,
    hasMoreByType,
    currentSection,
    isTrackLoading,
    isFullScreenPlayerOpen,
    setCurrentTrack,
    setCurrentSection: setCurrentSectionHandler,
    resetCurrentSection,
    setRandomTracks,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume: setVolumeHandler,
    toggleMute,
    seekTo,
    likeTrack,
    uploadTrack,
    loadMoreTracks,
    resetPagination,
    enableCrossfade,
    setEnableCrossfade,
    searchResults,
    isSearching,
    searchTracks,
    getCurrentTimeRaw,
    getDurationRaw,
    playlistTracks,
    setPlaylistTracks,
    openFullScreenPlayer,
    closeFullScreenPlayer,
    forceLoadTracks,
  };

  return (
    <MusicContext.Provider value={musicContextValue}>
      {children}
    </MusicContext.Provider>
  );
};


export const useMusic = () => useContext(MusicContext); 