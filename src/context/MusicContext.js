import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import axios from 'axios';

// Создаем контекст
export const MusicContext = createContext({
  tracks: [],
  popularTracks: [],
  likedTracks: [],
  newTracks: [],
  randomTracks: [],
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
  setCurrentTrack: () => {},
  setCurrentSection: () => {},
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
});

// Создаем провайдер
export const MusicProvider = ({ children }) => {
  // Состояния для основных данных
  const [tracks, setTracks] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [newTracks, setNewTracks] = useState([]);
  const [randomTracks, setRandomTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // 0-1
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
    random: 1
  });
  const [enableCrossfade, setEnableCrossfade] = useState(true); // Добавляем состояние для кроссфейда
  const [currentSection, setCurrentSection] = useState('all'); // Добавляем текущую секцию/плейлист
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isTrackLoading, setIsTrackLoading] = useState(false); // Add track loading state
  
  // Refs для аудио элементов
  const audioRef = useRef(new Audio());
  const nextAudioRef = useRef(new Audio()); // Дополнительный аудио элемент для кроссфейда
  const initialMount = useRef(true);
  const crossfadeTimeoutRef = useRef(null); // Реф для таймаута кроссфейда
  const isLoadingRef = useRef(true); // Отслеживаем статус загрузки
  const isLoadingMoreRef = useRef(false); // Add loading state for more tracks
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Add loading state for more tracks
  const preloadTimeRef = useRef({}); // Add ref to track preload times

  // Загрузка треков при инициализации или изменении секции
  useEffect(() => {
    let isMounted = true;
    
    // Загружаем треки для текущей секции
    const fetchTracks = async () => {
      // Если уже идет загрузка, не запускаем еще один запрос
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
      
      console.log(`Загрузка треков. isLoadingRef.current=${isLoadingRef.current}`);
      isLoadingRef.current = true;
      setIsLoading(true);
      
      try {
        console.log(`Загружаем треки для секции: ${currentSection}`);
        
        // Формируем URL и параметры в зависимости от типа
        let url = '/api/music';
        let params = { page: 1, per_page: 40 };
        
        if (currentSection === 'liked') {
          url = '/api/music/liked';
          // Добавляем заголовки для предотвращения кэширования запроса
          // Это поможет всегда получать актуальный список понравившихся треков
          const response = await axios.get(url, {
            params,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            withCredentials: true
          });
          
          if (!isMounted) return;
          
          if (response.data && response.data.tracks) {
            const receivedTracks = response.data.tracks;
            console.log(`Получено ${receivedTracks.length} понравившихся треков`);
            setLikedTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 40);
            setHasMoreByType(prev => ({ ...prev, liked: receivedTracks.length >= 40 }));
          } else {
            // Если треков нет, устанавливаем пустой массив
            console.log('Понравившиеся треки не найдены');
            setLikedTracks([]);
            setHasMoreTracks(false);
            setHasMoreByType(prev => ({ ...prev, liked: false }));
          }
          
          isLoadingRef.current = false;
          setIsLoading(false);
          return; // Выходим, так как уже обработали этот запрос
        } else if (currentSection === 'popular') {
          params.sort = 'popular';
        } else if (currentSection === 'new') {
          params.sort = 'date';
        } else if (currentSection === 'random') {
          params.random = true;
          // Добавляем случайный параметр, чтобы избежать кеширования запроса
          params.nocache = Math.random();
        }
        
        // Запрашиваем треки с сервера для текущей секции
        const response = await axios.get(url, { params });
        if (!isMounted) return;
        
        if (response.data && response.data.tracks) {
          const receivedTracks = response.data.tracks;
          
          // Обновляем состояние в зависимости от типа
          if (currentSection === 'all') {
            setTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 40);
            setHasMoreByType(prev => ({ ...prev, all: receivedTracks.length >= 40 }));
          } else if (currentSection === 'popular') {
            setPopularTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 40);
            setHasMoreByType(prev => ({ ...prev, popular: receivedTracks.length >= 40 }));
          } else if (currentSection === 'new') {
            setNewTracks(receivedTracks);
            setHasMoreTracks(receivedTracks.length >= 40);
            setHasMoreByType(prev => ({ ...prev, new: receivedTracks.length >= 40 }));
          } else if (currentSection === 'random') {
            // Для случайных треков дополнительно перемешиваем на клиенте
            const shuffledTracks = [...receivedTracks].sort(() => Math.random() - 0.5);
            setRandomTracks(shuffledTracks);
            setHasMoreTracks(receivedTracks.length >= 40);
            setHasMoreByType(prev => ({ ...prev, random: receivedTracks.length >= 40 }));
            console.log('Загружены и перемешаны случайные треки:', shuffledTracks.length);
          }
          
          // Предзагружаем следующую порцию треков для плавного скроллинга
          setTimeout(() => {
            // Проверяем, достаточно ли загружено треков и можно ли загружать еще
            if (receivedTracks.length >= 40 && hasMoreByType[currentSection] !== false) {
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
      }
    };
    
    // Запускаем загрузку треков при изменении секции или первой загрузке
    fetchTracks();
    
    return () => {
      isMounted = false;
    };
  }, [currentSection, hasMoreByType, tracks.length, likedTracks.length, popularTracks.length, newTracks.length, randomTracks.length]);
  
  // Обработка аудио событий в отдельном useEffect для доступа к актуальным состояниям
  useEffect(() => {
    let isMounted = true;
    
    // Слушатели событий для audio
    const handleTimeUpdate = () => {
      if (isMounted) {
        const audio = audioRef.current;
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        
        // Обновляем состояние MediaSession при воспроизведении
        if ('mediaSession' in navigator && audio.duration) {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            position: audio.currentTime,
            playbackRate: audio.playbackRate
          });
        }
        
        // Логика кроссфейда: если до конца трека осталось меньше 3 секунд и кроссфейд включен
        if (enableCrossfade && isPlaying && audio.duration > 0) {
          const timeRemaining = audio.duration - audio.currentTime;
          
          // Если до конца трека осталось 3 секунды, начинаем кроссфейд
          if (timeRemaining <= 3 && timeRemaining > 0 && !crossfadeTimeoutRef.current) {
            console.log('Starting crossfade...');
            
            // Предзагружаем следующий трек
            getNextTrack().then(nextTrackToPlay => {
              if (nextTrackToPlay) {
                // Подготавливаем следующий трек
                nextAudioRef.current.src = nextTrackToPlay.file_path;
                nextAudioRef.current.volume = 0; // Начинаем с нулевой громкости
                
                // Стартуем воспроизведение следующего трека
                const playPromise = nextAudioRef.current.play();
                if (playPromise !== undefined) {
                  playPromise.catch(error => {
                    console.error("Error playing next track during crossfade:", error);
                  });
                }
                
                // Постепенно увеличиваем громкость следующего трека и уменьшаем громкость текущего
                const fadeInterval = setInterval(() => {
                  // Если текущий трек все еще играет
                  if (audioRef.current.paused === false) {
                    // Уменьшаем громкость текущего трека
                    if (audioRef.current.volume > 0.1) {
                      audioRef.current.volume -= 0.1;
                    } else {
                      audioRef.current.volume = 0;
                    }
                    
                    // Увеличиваем громкость следующего трека
                    if (nextAudioRef.current.volume < volume - 0.1) {
                      nextAudioRef.current.volume += 0.1;
                    } else {
                      nextAudioRef.current.volume = volume;
                      
                      // Останавливаем текущий трек
                      audioRef.current.pause();
                      
                      // Останавливаем интервал
                      clearInterval(fadeInterval);
                      
                      // Меняем треки местами
                      [audioRef.current, nextAudioRef.current] = [nextAudioRef.current, audioRef.current];
                      
                      // Обновляем текущий трек
                      setCurrentTrack(nextTrackToPlay);
                      
                      // Сбрасываем таймаут
                      crossfadeTimeoutRef.current = null;
                    }
                  } else {
                    // Если текущий трек уже остановлен, останавливаем интервал
                    clearInterval(fadeInterval);
                  }
                }, 100);
                
                // Сохраняем ссылку на интервал для возможной отмены
                crossfadeTimeoutRef.current = fadeInterval;
              }
            });
          }
          
          // Если до конца трека осталось 10 секунд, начинаем предзагрузку следующего трека
          // даже если кроссфейд отключен
          if (timeRemaining <= 10 && timeRemaining > 3) {
            // Предзагружаем следующий трек, но не запускаем воспроизведение
            getNextTrack().then(nextTrackToLoad => {
              if (nextTrackToLoad && nextAudioRef.current) {
                console.log('Preloading next track:', nextTrackToLoad.title);
                nextAudioRef.current.src = nextTrackToLoad.file_path;
                nextAudioRef.current.load(); // Просто загружаем без воспроизведения
              }
            });
          }
        }
      }
    };
    
    const handleEnded = () => {
      if (isMounted) {
        // Если кроссфейд включен и уже запущен, то просто останавливаем текущий трек
        if (enableCrossfade && crossfadeTimeoutRef.current) {
          // Очищаем интервал, если он есть
          clearInterval(crossfadeTimeoutRef.current);
          crossfadeTimeoutRef.current = null;
          
          // Останавливаем текущий трек
          audioRef.current.pause();
          
          // Переключаем аудио элементы
          const tempAudio = audioRef.current;
          audioRef.current = nextAudioRef.current;
          nextAudioRef.current = tempAudio;
          
          // Обновляем трек
          getNextTrack().then(nextTrackToPlay => {
            if (nextTrackToPlay) {
              setCurrentTrack(nextTrackToPlay);
              localStorage.setItem('currentTrack', JSON.stringify(nextTrackToPlay));
            }
          }).catch(error => {
            console.error("Error getting next track after track ended:", error);
            // В случае ошибки, пробуем обычный nextTrack
            nextTrack();
          });
        } else {
          // Если кроссфейд выключен, просто проигрываем следующий трек
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
      
      // Очищаем интервал кроссфейда при размонтировании
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
    randomTracks
  ]);

  // Обновляем функцию playTrack, чтобы учитывать загрузку
  const playTrack = (track, section = currentSection) => {
    // Если уже идет загрузка трека, игнорируем повторные вызовы
    if (isTrackLoading) {
      console.log('Track is already loading, ignoring duplicate request');
      return;
    }
    
    setIsTrackLoading(true);
    
    try {
      // Останавливаем кроссфейд, если он был в процессе
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = null;
      }
      
      // Если трек тот же самый, просто переключаем воспроизведение
      if (currentTrack && track.id === currentTrack.id) {
        togglePlay();
        setIsTrackLoading(false);
        return;
      }
      
      // Устанавливаем новый трек
      console.log(`Начинаем воспроизведение трека: ${track.title} - ${track.artist}`);
      
      // Останавливаем все текущие воспроизведения
      audioRef.current.pause();
      nextAudioRef.current.pause();
      
      // Очищаем src для предотвращения автоматической загрузки
      audioRef.current.src = '';
      nextAudioRef.current.src = '';
      
      // Устанавливаем данные в состояние перед началом загрузки аудио
      setCurrentTrack(track);
      setCurrentSection(section);
      setCurrentTime(0);
      setDuration(0);
      
      // Сохраняем в localStorage
      try {
        localStorage.setItem('currentTrack', JSON.stringify(track));
        localStorage.setItem('currentSection', section);
      } catch (error) {
        console.error('Ошибка при сохранении трека в localStorage:', error);
      }
      
      // Предварительно загружаем трек перед воспроизведением
      audioRef.current = new Audio();
      
      // Настраиваем обработчики событий
      const handleCanPlayThrough = () => {
        console.log('Трек загружен и готов к воспроизведению');
        setIsTrackLoading(false);
        
        // Устанавливаем громкость
        audioRef.current.volume = isMuted ? 0 : volume;
        
        // Начинаем воспроизведение
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              
              // Отправляем данные о воспроизведении на сервер
              try {
                axios.post(`/api/music/${track.id}/play`, {}, { withCredentials: true })
                  .catch(error => console.error('Ошибка при отправке статистики воспроизведения:', error));
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
      
      // Добавляем обработчики событий для отслеживания загрузки
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('error', handleError);
      
      // Устанавливаем путь к файлу
      audioRef.current.src = track.file_path;
      audioRef.current.load(); // Запускаем загрузку аудио
      
      // Очистка обработчиков событий при выходе из функции
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

  // Обновляем функцию togglePlay, чтобы учитывать загрузку
  const togglePlay = () => {
    if (isTrackLoading) {
      console.log('Track is still loading, ignoring play/pause request');
      return;
    }
    
    try {
      const audio = audioRef.current;
      
      if (!audio.src) {
        // Если источник не установлен и есть текущий трек, устанавливаем источник
        if (currentTrack) {
          audio.src = currentTrack.file_path;
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

  // Исправляем функцию nextTrack для гарантии правильного порядка воспроизведения
  const nextTrack = async () => {
    if (isTrackLoading) {
      console.log('Track is still loading, ignoring next track request');
      return;
    }
    
    setIsTrackLoading(true);
    
    try {
      const nextTrackItem = await getNextTrack();
      if (nextTrackItem) {
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

  // Исправляем функцию prevTrack для гарантии правильного порядка воспроизведения
  const prevTrack = async () => {
    if (isTrackLoading) {
      console.log('Track is still loading, ignoring previous track request');
      return;
    }
    
    setIsTrackLoading(true);
    
    try {
      // Если текущее время меньше 3 секунд, то переходим к предыдущему треку
      // Если больше, то просто перематываем текущий трек на начало
      if (currentTime < 3) {
        const prevTrackItem = await getPreviousTrack();
        if (prevTrackItem) {
          playTrack(prevTrackItem, currentSection);
        } else {
          // Если предыдущего трека нет, просто перемотаем на начало
          audioRef.current.currentTime = 0;
          setIsTrackLoading(false);
        }
      } else {
        // Перематываем на начало текущего трека
        audioRef.current.currentTime = 0;
        setIsTrackLoading(false);
      }
    } catch (error) {
      console.error('Error playing previous track:', error);
      setIsTrackLoading(false);
    }
  };

  // Восстанавливаем функцию getNextTrack для автоматического перехода к следующему треку
  const getNextTrack = async () => {
    try {
      if (!currentTrack) return null;
      
      // Определяем список треков в зависимости от текущей секции
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
        default:
          trackList = tracks;
      }
      
      if (!trackList || trackList.length === 0) {
        return null;
      }
      
      // Находим индекс текущего трека
      const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
      
      if (currentIndex === -1) {
        // Если трек не найден в текущем списке, возвращаем первый трек
        return trackList[0];
      }
      
      // Проверяем 2 условия для загрузки треков:
      // 1. Если мы подходим к концу списка треков (осталось 3 или меньше)
      // 2. Если текущий индекс приближается к числам, кратным 15 (15, 30, 45 и т.д.)
      const isNearingEnd = currentIndex >= trackList.length - 3;
      const isNearing15Increment = (currentIndex + 1) % 15 >= 12 || (currentIndex + 1) % 15 === 0;
      
      if ((isNearingEnd || isNearing15Increment) && hasMoreByType[currentSection]) {
        console.log(`Trigger pagination: ${isNearingEnd ? 'nearing end of list' : 'approaching track at multiple of 15'}`);
        console.log(`Current index: ${currentIndex}, Total tracks in list: ${trackList.length}`);
        // Загружаем дополнительные треки для текущей секции
        loadMoreTracks(currentSection);
      }
      
      // Возвращаем следующий трек, учитывая зацикливание
      if (currentIndex < trackList.length - 1) {
        return trackList[currentIndex + 1];
      } else {
        // Если мы на последнем треке списка и возможно загрузить еще треки,
        // пытаемся загрузить следующую страницу и подождать результат
        if (hasMoreByType[currentSection]) {
          console.log("Reached last track, attempting to load more before looping");
          const loaded = await loadMoreTracks(currentSection);
          
          // Если успешно загрузили новые треки, получаем обновленный список
          if (loaded) {
            // Получаем обновленный список треков
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
              default:
                updatedTrackList = tracks;
            }
            
            // Если список обновился и стал длиннее, возвращаем новый трек
            if (updatedTrackList.length > trackList.length) {
              console.log("New tracks loaded, returning the first new track");
              return updatedTrackList[trackList.length]; // Первый трек из новых загруженных
            }
          }
        }
        
        // Зацикливаем на первый трек
        return trackList[0];
      }
    } catch (error) {
      console.error('Error getting next track:', error);
      return null;
    }
  };

  // Добавляем функцию getPreviousTrack для поддержки навигации к предыдущему треку
  const getPreviousTrack = async () => {
    try {
      if (!currentTrack) return null;
      
      // Определяем список треков в зависимости от текущей секции
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
        default:
          trackList = tracks;
      }
      
      if (!trackList || trackList.length === 0) {
        return null;
      }
      
      // Находим индекс текущего трека
      const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
      
      if (currentIndex === -1) {
        // Если трек не найден в текущем списке, возвращаем последний трек
        return trackList[trackList.length - 1];
      }
      
      // Проверяем 2 условия для загрузки треков:
      // 1. Если мы близко к началу списка (первые 3 трека)
      // 2. Если текущий индекс приближается к числам, кратным 15 (15, 30, 45 и т.д.)
      const isNearingStart = currentIndex <= 2;
      const isNearing15Increment = currentIndex % 15 <= 2 || currentIndex % 15 === 14;
      
      if ((isNearingStart || isNearing15Increment) && hasMoreByType[currentSection]) {
        console.log(`Trigger pagination backward: ${isNearingStart ? 'nearing start of list' : 'approaching track at multiple of 15'}`);
        console.log(`Current index: ${currentIndex}, Total tracks in list: ${trackList.length}`);
        // Загружаем дополнительные треки для текущей секции
        loadMoreTracks(currentSection);
      }
      
      // Если это не первый трек в списке, просто возвращаем предыдущий трек
      if (currentIndex > 0) {
        return trackList[currentIndex - 1];
      }
      
      // Если мы на первом треке, возвращаем последний трек из текущего списка
      return trackList[trackList.length - 1];
    } catch (error) {
      console.error('Error getting previous track:', error);
      return null;
    }
  };

  // Обработка события окончания трека - восстанавливаем автопереход к следующему треку
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = async () => {
      // Если финальный кроссфейд активен, не делаем ничего - кроссфейд сам запустит следующий трек
      if (crossfadeTimeoutRef.current) {
        console.log('Crossfade is active, letting it handle the transition');
        return;
      }
      
      console.log('Track ended, playing next track');
      
      // Играем следующий трек
      try {
        const nextTrackItem = await getNextTrack();
        if (nextTrackItem) {
          playTrack(nextTrackItem, currentSection);
        } else {
          console.log('No next track available after current track ended');
        }
      } catch (error) {
        console.error('Error auto-playing next track:', error);
      }
    };
    
    // Добавляем слушатель события ended
    audio.addEventListener('ended', handleEnded);
    
    // Очищаем слушатель при размонтировании
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, currentSection]);

  // Установка громкости
  const setVolumeHandler = (newVolume) => {
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Переключение отключения звука
  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Перемотка к определенному времени
  const seekTo = (time) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Лайк трека
  const likeTrack = async (trackId) => {
    try {
      console.log('Отправка запроса на лайк трека:', trackId);
      
      const response = await axios.post(`/api/music/${trackId}/like`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Ответ на запрос лайка:', response.data);
      
      if (response.data.success) {
        // Находим трек в основном списке
        const track = tracks.find(t => t.id === trackId);
        if (!track) return;
        
        // Определяем новое состояние лайка и количество лайков
        const newIsLiked = !track.is_liked;
        const newLikesCount = response.data.likes_count || (track.likes_count + (newIsLiked ? 1 : -1));
        
        // Функция для обновления трека в любом списке
        const updateTrackInList = (list) => {
          return list.map(t => 
            t.id === trackId 
              ? { ...t, likes_count: newLikesCount, is_liked: newIsLiked }
              : t
          );
        };
        
        // Обновляем все списки
        setTracks(updateTrackInList(tracks));
        setPopularTracks(updateTrackInList(popularTracks));
        setNewTracks(updateTrackInList(newTracks));
        setRandomTracks(updateTrackInList(randomTracks));
        
        // Специальная обработка для списка лайкнутых треков
        if (newIsLiked) {
          // Если трек лайкнут, добавляем его в лайкнутые, если его там еще нет
          const updatedTrack = { ...track, likes_count: newLikesCount, is_liked: true };
          if (!likedTracks.some(t => t.id === trackId)) {
            setLikedTracks(prev => [updatedTrack, ...prev]);
          } else {
            setLikedTracks(updateTrackInList(likedTracks));
          }
        } else {
          // Если лайк отменен, удаляем трек из лайкнутых
          setLikedTracks(prev => prev.filter(t => t.id !== trackId));
        }
        
        // Обновляем текущий трек если он лайкнут
        if (currentTrack && currentTrack.id === trackId) {
          setCurrentTrack({
            ...currentTrack,
            likes_count: newLikesCount,
            is_liked: newIsLiked
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при лайке трека:', error);
      console.log('Детали ошибки:', error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      } : 'Нет ответа от сервера');
      console.log('Cookies при ошибке:', document.cookie);
    }
  };

  // Функция для загрузки файла и извлечения метаданных
  const uploadTrack = async (file, trackInfo) => {
    try {
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('audio', file);
      
      // Если у нас есть информация о треке, добавляем её
      if (trackInfo) {
        formData.append('title', trackInfo.title || '');
        formData.append('artist', trackInfo.artist || '');
        formData.append('album', trackInfo.album || '');
      }
      
      // Используем jsmediatags для извлечения метаданных из аудиофайла
      try {
        // Создаем промис для чтения метаданных
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
                
                // Извлекаем метаданные
                const tags = tag.tags || {};
                const title = tags.title || '';
                const artist = tags.artist || '';
                const album = tags.album || '';
                
                // Если у нас есть обложка в метаданных, извлекаем её
                let pictureData = null;
                if (tags.picture) {
                  const { data, format } = tags.picture;
                  const base64String = data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                  pictureData = `data:${format};base64,${window.btoa(base64String)}`;
                }
                
                // Возвращаем метаданные
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
        
        // Извлекаем метаданные
        const metadata = await extractMetadata();
        
        if (metadata) {
          // Если удалось извлечь метаданные, используем их
          if (metadata.title) formData.append('title', metadata.title);
          if (metadata.artist) formData.append('artist', metadata.artist);
          if (metadata.album) formData.append('album', metadata.album);
          
          // Если есть обложка, добавляем её
          if (metadata.pictureData) {
            // Конвертируем Data URL в Blob
            const fetchResponse = await fetch(metadata.pictureData);
            const blob = await fetchResponse.blob();
            
            // Создаем файл из blob
            const coverFile = new File([blob], 'cover.jpg', { type: blob.type });
            formData.append('cover', coverFile);
          }
        }
      } catch (error) {
        console.error('Ошибка при извлечении метаданных:', error);
      }
      
      // Отправляем файл на сервер
      const response = await axios.post('/api/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Обновляем список треков
        const updatedTracks = [response.data.track, ...tracks];
        setTracks(updatedTracks);
        
        // Обновляем список новых треков
        const newTracksList = [response.data.track, ...newTracks].slice(0, 10);
        setNewTracks(newTracksList);
        
        return response.data.track;
      }
      
      return null;
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      return null;
    }
  };

  // Обновление MediaSession для управления воспроизведением на экране блокировки и в уведомлениях
  useEffect(() => {
    if (!currentTrack) return;
    
    // Проверяем поддержку Media Session API
    if ('mediaSession' in navigator) {
      // Настройка метаданных для отображения в уведомлениях и на экране блокировки
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
      
      // Обновляем статус воспроизведения
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      
      // Устанавливаем обработчики для кнопок управления
      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      
      // Добавляем поддержку перемотки
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime) {
          seekTo(details.seekTime);
        }
      });
      
      // Специальная поддержка для iOS
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // Синхронизируем состояние, когда вкладка становится видимой снова
          navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
      });
      
      // Фикс для iOS Safari - удостоверимся, что обработчики событий назначены правильно
      // для устройств Apple
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        console.log("iOS device detected, applying special handling for media controls");
        
        // На iOS важно переустановить метаданные при каждом событии воспроизведения
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

  // Функция для загрузки дополнительных треков
  const loadMoreTracks = useCallback(async (type = 'all') => {
    // Проверяем, загружаются ли уже треки или нет больше треков для этого типа
    if (isLoadingMoreRef.current) {
      console.log(`Пропускаем загрузку для ${type}: уже идет загрузка`);
      return false;
    }
    
    // Проверяем наличие треков для загрузки по типу
    const hasMoreForType = hasMoreByType[type] !== false;
    if (!hasMoreForType) {
      console.log(`Пропускаем загрузку для ${type}: больше нет треков`);
      return false;
    }
    
    // Проверяем номер страницы - если равен 1, значит была сброшена пагинация
    // и нам нужно сначала дождаться загрузки первой страницы
    if (pageByType[type] === 1 && (
      (type === 'all' && tracks.length === 0) ||
      (type === 'liked' && likedTracks.length === 0) ||
      (type === 'random' && randomTracks.length === 0) ||
      (type === 'popular' && popularTracks.length === 0) ||
      (type === 'new' && newTracks.length === 0)
    )) {
      console.log(`Пропускаем загрузку для ${type}: ожидается загрузка первой страницы`);
      return false;
    }
    
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    
    try {
      // Получаем текущую страницу для данного типа
      let nextPage = pageByType[type] + 1;
      let endpoint = '/api/music';
      let params = { page: nextPage, per_page: 20 };
      
      // Определяем тип загружаемых треков
      if (type === 'liked') {
        endpoint = '/api/music/liked';
        params = {};
        // Добавляем заголовки для предотвращения кэширования
        const config = {
          params,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          withCredentials: true
        };
        
        const response = await axios.get(endpoint, config);
        
        // Обрабатываем результат
        // Продолжаем с обработкой уже существующей
        
      } else if (type === 'popular') {
        params.sort = 'popular';
      } else if (type === 'new') {
        params.sort = 'date';
      } else if (type === 'random') {
        params.random = true;
        // Добавляем случайный параметр для избежания кэширования
        params.nocache = Math.random();
      }
      
      console.log(`Загружаем треки для типа "${type}" со страницы ${nextPage}`);
      
      // Добавляем задержку для имитации загрузки и более плавного UI
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Выполняем запрос (только если это не liked, который уже обработан)
      let response;
      if (type !== 'liked') {
        response = await axios.get(endpoint, { params });
      }
      
      // Проверяем формат ответа API и наличие треков
      let newTracks = [];
      let has_more = false;
      
      // Обрабатываем разные форматы ответа от API 
      if (response && response.data && response.data.tracks) {
        newTracks = response.data.tracks;
        has_more = newTracks.length >= 20; // Предполагаем, что есть еще треки, если получили полную страницу
        
        if (response.data.has_more !== undefined) {
          has_more = response.data.has_more;
        } else if (response.data.pages !== undefined) {
          has_more = nextPage < response.data.pages;
        }
      } else if (response && Array.isArray(response.data)) {
        // Некоторые эндпоинты могут возвращать массив напрямую
        newTracks = response.data;
        has_more = newTracks.length >= 20;
      } else if (type !== 'liked') {
        console.warn(`Странный формат ответа API для типа ${type}:`, response ? response.data : 'Нет ответа');
      }
      
      // Если треков нет - пагинация закончилась
      if (newTracks.length === 0) {
        has_more = false;
      }
      
      console.log(`Получено ${newTracks.length} треков для типа ${type}, есть еще: ${has_more}`);
      
      // Обновляем состояние в зависимости от типа
      if (type === 'all') {
        setTracks(prevTracks => [...prevTracks, ...newTracks]);
      } else if (type === 'liked') {
        // Для лайкнутых возвращаем полный список из ответа API
        if (response && response.data && response.data.tracks) {
          setLikedTracks(response.data.tracks);
        } else {
          setLikedTracks(prevTracks => [...prevTracks, ...newTracks]);
        }
      } else if (type === 'popular') {
        setPopularTracks(prevTracks => [...prevTracks, ...newTracks]);
      } else if (type === 'new') {
        setNewTracks(prevTracks => [...prevTracks, ...newTracks]);
      } else if (type === 'random') {
        // Для случайных перемешиваем перед добавлением
        const shuffledNewTracks = [...newTracks].sort(() => Math.random() - 0.5);
        setRandomTracks(prevTracks => [...prevTracks, ...shuffledNewTracks]);
        console.log('Добавлены и перемешаны случайные треки:', shuffledNewTracks.length);
      }
      
      // Обновляем страницу для конкретного типа
      setPageByType(prev => ({
        ...prev,
        [type]: nextPage
      }));
      
      // Обновляем флаг наличия треков для конкретного типа
      setHasMoreByType(prev => ({
        ...prev,
        [type]: has_more
      }));
      
      // Если текущий тип совпадает с активной вкладкой, обновляем общий флаг
      if (currentSection === type) {
        setHasMoreTracks(has_more);
      }
      
      // Если есть еще треки, предзагружаем следующую страницу
      if (has_more) {
        setTimeout(() => {
          preloadNextPage(nextPage + 1, type);
        }, 1000);
      }
      
      return true;
    } catch (error) {
      console.error('Error loading more tracks:', error);
      
      // Если получили 404 для типа, отмечаем что больше треков нет
      if (error.response && error.response.status === 404) {
        setHasMoreByType(prev => ({ ...prev, [type]: false }));
        if (currentSection === type) {
          setHasMoreTracks(false);
        }
      }
      
      return false;
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [pageByType, hasMoreByType, tracks.length, likedTracks.length, randomTracks.length, popularTracks.length, newTracks.length, currentSection]);
  
  // Функция для предзагрузки следующей страницы треков
  const preloadNextPage = useCallback(async (nextPage, type = 'all') => {
    try {
      // Добавим защиту от слишком частых запросов - запоминаем когда последний раз запрашивали данный тип
      const now = Date.now();
      const lastPreloadTime = preloadTimeRef.current?.[type] || 0;
      
      // Если прошло менее 30 секунд с последнего запроса этого типа, не делаем новый запрос
      if (now - lastPreloadTime < 30000) {
        console.log(`Пропускаем предзагрузку для ${type}: прошло менее 30 секунд с последнего запроса`);
        return;
      }
      
      // Запоминаем время запроса
      preloadTimeRef.current = {
        ...(preloadTimeRef.current || {}),
        [type]: now
      };
      
      // Не делаем предзагрузку для liked - так как они загружаются целиком
      if (type === 'liked') {
        return;
      }
      
      let endpoint = '/api/music';
      let params = { page: nextPage, per_page: 20 };
      
      // Определяем тип загружаемых треков
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
          'Cache-Control': 'max-age=300'  // Разрешаем кэшировать на 5 минут
        }
      });
      console.log(`Предзагружено ${response.data.tracks.length} треков для страницы ${nextPage} (тип: ${type})`);
    } catch (error) {
      console.error('Ошибка при предзагрузке треков:', error);
    }
  }, []);

  // Search tracks in database
  const searchTracks = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return [];
    }
    
    try {
      setIsSearching(true);
      const response = await fetch(`/api/music/search?query=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const tracks = await response.json();
      console.log("Search results:", tracks);
      
      // Process the tracks to ensure proper format
      const processedTracks = Array.isArray(tracks) ? tracks.map(track => {
        return {
          ...track,
          // Make sure is_liked property exists
          is_liked: typeof track.is_liked === 'boolean' ? track.is_liked : 
                    Boolean(likedTracks.find(lt => lt.id === track.id))
        };
      }) : [];
      
      setSearchResults(processedTracks);
      return processedTracks;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  // Функция для сброса пагинации для конкретного типа
  const resetPagination = useCallback((type = 'all') => {
    console.log(`Сбрасываем пагинацию для типа: ${type}`);
    
    // Сбрасываем номер страницы для выбранного типа
    setPageByType(prev => ({
      ...prev,
      [type]: 1
    }));
    
    // Сбрасываем флаг наличия дополнительных треков для типа
    setHasMoreByType(prev => ({
      ...prev,
      [type]: true // Предполагаем, что треки есть, пока не доказано обратное
    }));
    
    // Очищаем списки треков для данного типа, чтобы избежать путаницы
    if (type === 'all') {
      setTracks([]);
    } else if (type === 'liked') {
      setLikedTracks([]);
    } else if (type === 'popular') {
      setPopularTracks([]);
    } else if (type === 'new') {
      setNewTracks([]);
    } else if (type === 'random') {
      setRandomTracks([]);
    }
    
    // Если это текущий активный тип, обновляем общий флаг
    if (currentSection === type) {
      setHasMoreTracks(true);
    }
    
    // Устанавливаем flag, что нужно загрузить треки
    isLoadingRef.current = true;
    
    // Устанавливаем статус загрузки для UI
    setIsLoading(true);
    
    // Запускаем таймер для имитации загрузки, если треки не загрузятся автоматически
    // Это предотвратит бесконечную загрузку в случае проблем
    setTimeout(() => {
      if (isLoadingRef.current) {
        console.log(`Принудительный сброс флага загрузки для типа ${type} после таймаута`);
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    }, 5000);
  }, [currentSection]);

  // Восстанавливаем последний трек из localStorage
  useEffect(() => {
    // Выполняем восстановление только при первом монтировании
    if (initialMount.current) {
      try {
        const savedTrack = localStorage.getItem('currentTrack');
        const savedSection = localStorage.getItem('currentSection') || 'all';
        
        if (savedTrack) {
          const parsedTrack = JSON.parse(savedTrack);
          setCurrentTrack(parsedTrack);
          // Восстанавливаем текущую секцию
          setCurrentSection(savedSection);
          // Не запускаем автоматически при восстановлении
          audioRef.current.src = parsedTrack.file_path;
          audioRef.current.volume = volume;
          setIsPlaying(false);
          
          console.log('Восстановлен последний трек из localStorage:', parsedTrack.title);
        }
      } catch (error) {
        console.error('Ошибка при восстановлении трека:', error);
      }
      
      initialMount.current = false;
    }
  }, [volume]);

  // Создаем объект контекста
  const musicContextValue = {
    tracks,
    popularTracks,
    likedTracks,
    newTracks,
    randomTracks,
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
    setCurrentTrack,
    setCurrentSection,
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
  };

  return (
    <MusicContext.Provider value={musicContextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Хук для использования контекста музыки
export const useMusic = () => useContext(MusicContext); 