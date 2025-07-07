import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  EmojiEmotions as StickerIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useMessenger } from '../../contexts/MessengerContext';
import axios from 'axios';
import Lottie from 'lottie-react';
import pako from 'pako';

// API URL для мессенджера
const API_URL = 'https://k-connect.ru/apiMes';

// Функция для определения типа стикера
const getStickerType = (sticker) => {
  if (!sticker.url) return 'unknown';
  
  // Сначала проверяем данные стикера, если есть
  if (sticker.mime_type) {
    if (sticker.mime_type === 'application/x-tgsticker') return 'tgs';
    if (sticker.mime_type === 'video/webm') return 'webm';
    return 'static';
  }
  
  // Если данных нет, проверяем URL (менее надежно)
  const url = sticker.url.toLowerCase();
  if (url.includes('.tgs') || url.includes('tgsticker')) return 'tgs';
  if (url.includes('.webm')) return 'webm';
  
  // Для API эндпоинтов делаем асинхронную проверку
  if (url.includes('/api/messenger/stickers/')) {
    return 'api_check_needed';
  }
  
  return 'static'; // webp, png, jpeg
};

  // Компонент для TGS стикера с улучшенной загрузкой и кешированием
  const TGSSticker = React.memo(({ src, style, onClick, getCachedFile, setCachedFile }) => {
    const [animationData, setAnimationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isStatic, setIsStatic] = useState(true); // По умолчанию статичный режим

    useEffect(() => {
      const loadTGS = async () => {
        try {
          setLoading(true);
          setError(false);
          
          // Проверяем кеш
          const cachedData = getCachedFile?.(src);
          if (cachedData && cachedData.v && cachedData.fr) {
            // Проверяем, что кешированные данные валидны для Lottie
            setAnimationData(cachedData);
            setLoading(false);
            return;
          }
          
          const response = await fetch(src);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          
          // Проверяем, действительно ли это TGS файл
          if (contentType !== 'application/x-tgsticker') {
            console.log('Not a TGS file, falling back to image:', contentType);
            setError(true);
            return;
          }
          
          const arrayBuffer = await response.arrayBuffer();
          let jsonData;
          
          try {
            // Пробуем распаковать как gzip
            const decompressed = pako.inflate(arrayBuffer);
            const textDecoder = new TextDecoder();
            jsonData = JSON.parse(textDecoder.decode(decompressed));
          } catch (gzipError) {
            // Если не gzip, пробуем как обычный JSON
            const textDecoder = new TextDecoder();
            jsonData = JSON.parse(textDecoder.decode(arrayBuffer));
          }
          
          // Проверяем валидность данных для Lottie
          if (!jsonData || !jsonData.v || !jsonData.fr) {
            console.error('Invalid TGS data for Lottie:', jsonData);
            setError(true);
            return;
          }
          
          // Сохраняем в кеш только валидные данные
          setCachedFile?.(src, jsonData);
          setAnimationData(jsonData);
        } catch (error) {
          console.error('Error loading TGS:', error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      if (src) {
        loadTGS();
      }
    }, [src, getCachedFile, setCachedFile]);

  if (loading) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error || !animationData) {
    // Fallback to image if TGS loading failed
    return (
      <img
        src={src}
        style={style}
        onClick={onClick}
        alt="Стикер"
      />
    );
  }

  return (
    <div 
      style={style} 
      onClick={onClick}
      onMouseEnter={() => setIsStatic(false)} // Включаем анимацию при наведении
      onMouseLeave={() => setIsStatic(true)}  // Отключаем анимацию при уходе мыши
    >
      <Lottie
        animationData={animationData}
        loop={!isStatic} // Зацикливание только когда не статичный
        autoplay={!isStatic} // Автовоспроизведение только когда не статичный
        style={{ width: '100%', height: '100%' }}
        onError={(error) => {
          console.error('Lottie animation error:', error);
          setError(true);
        }}
      />
    </div>
  );
  });

// Компонент для асинхронной проверки типа стикера с кешированием
const AsyncStickerRenderer = React.memo(({ src, style, onClick, getCachedFile, setCachedFile }) => {
  const [stickerType, setStickerType] = useState('loading');
  const [animationData, setAnimationData] = useState(null);
  const [isStatic, setIsStatic] = useState(true); // По умолчанию статичный режим
  
  useEffect(() => {
    const checkStickerType = async () => {
      try {
        // Проверяем кеш для TGS файлов
        const cachedData = getCachedFile?.(src);
        if (cachedData && cachedData.v && cachedData.fr) {
          // Проверяем, что кешированные данные валидны для Lottie
          setAnimationData(cachedData);
          setStickerType('tgs');
          return;
        }
        
        // Сначала пробуем загрузить как TGS
        const response = await fetch(src);
        
        if (!response.ok) {
          setStickerType('static');
          return;
        }
        
        const contentType = response.headers.get('content-type');
        
        if (contentType === 'application/x-tgsticker') {
          // Это TGS файл, пробуем его загрузить
          try {
            const arrayBuffer = await response.arrayBuffer();
            let jsonData;
            
            try {
              // Пробуем распаковать как gzip
              const decompressed = pako.inflate(arrayBuffer);
              const textDecoder = new TextDecoder();
              jsonData = JSON.parse(textDecoder.decode(decompressed));
            } catch (gzipError) {
              // Если не gzip, пробуем как обычный JSON
              const textDecoder = new TextDecoder();
              jsonData = JSON.parse(textDecoder.decode(arrayBuffer));
            }
            
            // Проверяем валидность данных для Lottie
            if (!jsonData || !jsonData.v || !jsonData.fr) {
              console.error('Invalid TGS data for Lottie:', jsonData);
              setStickerType('static');
              return;
            }
            
            // Сохраняем в кеш только валидные данные
            setCachedFile?.(src, jsonData);
            setAnimationData(jsonData);
            setStickerType('tgs');
          } catch (error) {
            console.error('Error loading TGS data:', error);
            setStickerType('static');
          }
        } else if (contentType === 'video/webm') {
          setStickerType('webm');
        } else {
          setStickerType('static');
        }
      } catch (error) {
        console.error('Error checking sticker type:', error);
        setStickerType('static');
      }
    };
    
    checkStickerType();
  }, [src, getCachedFile, setCachedFile]);
  
  if (stickerType === 'loading') {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </div>
    );
  }
  
  if (stickerType === 'tgs' && animationData) {
    return (
      <div 
        style={style} 
        onClick={onClick}
        onMouseEnter={() => setIsStatic(false)} // Включаем анимацию при наведении
        onMouseLeave={() => setIsStatic(true)}  // Отключаем анимацию при уходе мыши
      >
        <Lottie
          animationData={animationData}
          loop={!isStatic} // Зацикливание только когда не статичный
          autoplay={!isStatic} // Автовоспроизведение только когда не статичный
          style={{ width: '100%', height: '100%' }}
          onError={(error) => {
            console.error('Lottie animation error:', error);
            setStickerType('static');
          }}
        />
      </div>
    );
  } else if (stickerType === 'webm') {
    return (
      <video
        src={src}
        style={style}
        onClick={onClick}
        autoPlay={false} // Отключаем автовоспроизведение
        loop={false} // Отключаем зацикливание
        muted
        playsInline
        onMouseEnter={(e) => e.target.play()} // Воспроизводим при наведении
        onMouseLeave={(e) => {
          e.target.pause();
          e.target.currentTime = 0; // Возвращаем к началу
        }}
      />
    );
  } else {
    return (
      <img
        src={src}
        style={style}
        onClick={onClick}
        alt="Стикер"
      />
    );
  }
  });

const StickerPicker = ({ onStickerSelect, onClose, isOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sessionKey } = useMessenger();
  
  const [stickerPacks, setStickerPacks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preloading, setPreloading] = useState(false);
  const stickerGridRef = useRef(null);
  
  // Кеш для стикерпаков
  const [cachedPacks, setCachedPacks] = useState([]);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 дней (месяц)
  
  // Кеш для файлов стикеров
  const stickerFileCache = useRef(new Map());
  const CACHE_KEY_PREFIX = 'sticker_file_';
  
  // Предзагрузка всех стикеров при загрузке стикерпаков
  const preloadStickers = useCallback(async (packs) => {
    if (!packs || packs.length === 0) return;
    
    console.log('StickerPicker: Preloading sticker files...');
    setPreloading(true);
    
    try {
      for (const pack of packs) {
        if (!pack.stickers) continue;
        
        for (const sticker of pack.stickers) {
          const cacheKey = `${CACHE_KEY_PREFIX}${sticker.url}`;
          
          // Проверяем, есть ли уже в кеше
          if (stickerFileCache.current.has(cacheKey)) {
            continue;
          }
          
          try {
            // Загружаем файл в фоне
            const response = await fetch(sticker.url);
            if (response.ok) {
              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);
              
              stickerFileCache.current.set(cacheKey, {
                data: objectUrl,
                timestamp: Date.now()
              });
            }
          } catch (error) {
            console.warn('Failed to preload sticker:', sticker.url, error);
          }
        }
      }
      
      console.log('StickerPicker: Preloading completed');
    } finally {
      setPreloading(false);
    }
  }, []);
  
  // Стили как в Телеграме
  const pickerStyles = {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    width: isMobile ? '100vw' : '320px',
    height: isMobile ? '50vh' : '400px',
    background: 'rgba(18, 18, 18, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: isMobile ? '16px 16px 0 0' : '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  // Загрузка стикерпаков с кешированием
  const loadStickerPacks = useCallback(async () => {
    if (!sessionKey) return;
    
    // Проверяем кеш
    const now = Date.now();
    if (cachedPacks.length > 0 && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('StickerPicker: Using cached sticker packs');
      setStickerPacks(cachedPacks);
      return;
    }
    
    try {
      setLoading(true);
      console.log('StickerPicker: Loading sticker packs from API');
      
      const response = await axios.get(`${API_URL}/messenger/sticker-packs/my`, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const packs = response.data.packs || [];
        setStickerPacks(packs);
        
        // Сохраняем в кеш
        setCachedPacks(packs);
        setCacheTimestamp(now);
        console.log('StickerPicker: Cached sticker packs');
        
        // Запускаем предзагрузку всех стикеров в фоне
        preloadStickers(packs);
      }
    } catch (error) {
      console.error('Error loading sticker packs:', error);
      
      // Если API недоступен, используем кеш (даже если он устарел)
      if (cachedPacks.length > 0) {
        console.log('StickerPicker: Using stale cache due to API error');
        setStickerPacks(cachedPacks);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionKey, cachedPacks, cacheTimestamp, CACHE_DURATION]);

  // Функции для работы с кешем файлов стикеров
  const getCachedStickerFile = useCallback((url) => {
    const cacheKey = `${CACHE_KEY_PREFIX}${url}`;
    const cached = stickerFileCache.current.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('StickerPicker: Using cached sticker file:', url);
      return cached.data;
    }
    
    // Если нет в кеше, возвращаем null для загрузки
    return null;
  }, [CACHE_DURATION]);

  const setCachedStickerFile = useCallback((url, data) => {
    // Проверяем валидность данных перед сохранением в кеш
    if (!data) {
      console.warn('StickerPicker: Attempting to cache invalid data for:', url);
      return;
    }
    
    const cacheKey = `${CACHE_KEY_PREFIX}${url}`;
    stickerFileCache.current.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    console.log('StickerPicker: Cached sticker file:', url);
  }, []);

  const clearStickerFileCache = useCallback(() => {
    stickerFileCache.current.clear();
    console.log('StickerPicker: Sticker file cache cleared');
  }, []);

  // Функция для очистки некорректных данных из кеша
  const cleanInvalidCache = useCallback(() => {
    const entriesToRemove = [];
    
    for (const [key, value] of stickerFileCache.current.entries()) {
      // Проверяем TGS файлы на валидность
      if (value.data && typeof value.data === 'object' && value.data.v !== undefined) {
        if (!value.data.v || !value.data.fr) {
          entriesToRemove.push(key);
        }
      }
    }
    
    entriesToRemove.forEach(key => {
      stickerFileCache.current.delete(key);
      console.log('StickerPicker: Removed invalid cache entry:', key);
    });
    
    if (entriesToRemove.length > 0) {
      console.log('StickerPicker: Cleaned invalid cache entries');
    }
  }, []);

  // Компонент для кешированных изображений
  const CachedImage = React.memo(({ src, alt, style, onClick }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        try {
          setLoading(true);
          
          // Проверяем кеш для изображений
          const cachedData = getCachedStickerFile(src);
          if (cachedData) {
            setImageSrc(cachedData);
            setLoading(false);
            return;
          }
          
          // Загружаем изображение
          const response = await fetch(src);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          // Сохраняем в кеш
          setCachedStickerFile(src, objectUrl);
          setImageSrc(objectUrl);
        } catch (error) {
          console.error('Error loading image:', error);
          setImageSrc(src); // Fallback к оригинальному URL
        } finally {
          setLoading(false);
        }
      };

      if (src) {
        loadImage();
      }
    }, [src, getCachedStickerFile, setCachedStickerFile]);

    if (loading) {
      return (
        <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </div>
      );
    }

    return (
      <img
        src={imageSrc || src}
        alt={alt}
        style={style}
        onClick={onClick}
      />
    );
  });

  // Компонент для кешированных видео
  const CachedVideo = React.memo(({ src, style, onClick, autoPlay = false, loop = false, muted = true, playsInline = true }) => {
    const [videoSrc, setVideoSrc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadVideo = async () => {
        try {
          setLoading(true);
          
          // Проверяем кеш для видео
          const cachedData = getCachedStickerFile(src);
          if (cachedData) {
            setVideoSrc(cachedData);
            setLoading(false);
            return;
          }
          
          // Загружаем видео
          const response = await fetch(src);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          // Сохраняем в кеш
          setCachedStickerFile(src, objectUrl);
          setVideoSrc(objectUrl);
        } catch (error) {
          console.error('Error loading video:', error);
          setVideoSrc(src); // Fallback к оригинальному URL
        } finally {
          setLoading(false);
        }
      };

      if (src) {
        loadVideo();
      }
    }, [src, getCachedStickerFile, setCachedStickerFile]);

    if (loading) {
      return (
        <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </div>
      );
    }

    return (
      <video
        src={videoSrc || src}
        style={style}
        onClick={onClick}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onMouseEnter={(e) => e.target.play()} // Воспроизводим при наведении
        onMouseLeave={(e) => {
          e.target.pause();
          e.target.currentTime = 0; // Возвращаем к началу
        }}
      />
    );
  });

  // Функция для принудительного обновления кеша
  const refreshStickerPacks = useCallback(async () => {
    if (!sessionKey) return;
    
    try {
      setLoading(true);
      console.log('StickerPicker: Force refreshing sticker packs');
      
      const response = await axios.get(`${API_URL}/messenger/sticker-packs/my`, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const packs = response.data.packs || [];
        setStickerPacks(packs);
        
        // Обновляем кеш
        setCachedPacks(packs);
        setCacheTimestamp(Date.now());
        console.log('StickerPicker: Cache refreshed');
        
        // Запускаем предзагрузку всех стикеров в фоне
        preloadStickers(packs);
      }
    } catch (error) {
      console.error('Error refreshing sticker packs:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionKey]);

  // Очистка кеша при смене пользователя
  useEffect(() => {
    if (sessionKey) {
      // Очищаем кеш при смене sessionKey
      setCachedPacks([]);
      setCacheTimestamp(null);
      clearStickerFileCache();
      setPreloading(false);
    }
  }, [sessionKey, clearStickerFileCache]);

  useEffect(() => {
    if (isOpen && sessionKey) {
      // Очищаем некорректные данные перед загрузкой
      cleanInvalidCache();
      loadStickerPacks();
    }
  }, [isOpen, sessionKey, loadStickerPacks, cleanInvalidCache]);

  // Обработка клика по стикеру
  const handleStickerClick = (pack, sticker) => {
    onStickerSelect({
      pack_id: pack.id,
      sticker_id: sticker.id,
      name: sticker.name,
      emoji: sticker.emoji
    });
    onClose();
  };

  // Рендерим содержимое только если пикер открыт
  if (!isOpen) {
    return null;
  }

  const activePack = stickerPacks[activeTab];

  return (
    <Box sx={pickerStyles}>
      {/* Заголовок */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
            Стикеры
          </Typography>

          {preloading && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              (загрузка...)
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={refreshStickerPacks}
            size="small"
            disabled={loading}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            title="Обновить стикеры"
          >
            <RefreshIcon />
          </IconButton>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Контент */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1 
          }}>
            <CircularProgress size={24} sx={{ color: 'white' }} />
          </Box>
        ) : stickerPacks.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1,
            gap: 2
          }}>
            <StickerIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              У вас пока нет стикерпаков
            </Typography>
          </Box>
        ) : (
          <>
            {/* Сетка стикеров */}
            <Box 
              ref={stickerGridRef}
              sx={{ 
                flex: 1, 
                overflowY: 'auto',
                p: 1,
                '&::-webkit-scrollbar': {
                  width: '4px'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px'
                }
              }}
            >
              {activePack && activePack.stickers && (
                <Grid container spacing={0.5}>
                  {activePack.stickers.map((sticker) => (
                    <Grid item xs={3} sm={2.4} key={sticker.id}>
                      <Box
                        sx={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            background: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        {(() => {
                          const stickerType = getStickerType(sticker);
                          const commonStyle = {
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          };

                          const handleClick = () => handleStickerClick(activePack, sticker);

                          // Для API эндпоинтов используем асинхронную проверку
                          if (stickerType === 'api_check_needed') {
                            return (
                              <AsyncStickerRenderer
                                src={sticker.url}
                                style={commonStyle}
                                onClick={handleClick}
                                getCachedFile={getCachedStickerFile}
                                setCachedFile={setCachedStickerFile}
                              />
                            );
                          }

                          // Для известных типов используем прямой рендеринг
                          if (stickerType === 'tgs') {
                            return (
                              <TGSSticker
                                src={sticker.url}
                                style={commonStyle}
                                onClick={handleClick}
                                getCachedFile={getCachedStickerFile}
                                setCachedFile={setCachedStickerFile}
                              />
                            );
                          } else if (stickerType === 'webm') {
                            return (
                              <CachedVideo
                                src={sticker.url}
                                style={commonStyle}
                                onClick={handleClick}
                                autoPlay={false}
                                loop={false}
                                muted
                                playsInline
                              />
                            );
                          } else {
                            // Статичные стикеры (webp, png, jpeg) с кешированием
                            return (
                              <CachedImage
                                src={sticker.url}
                                alt={sticker.name}
                                style={commonStyle}
                                onClick={handleClick}
                              />
                            );
                          }
                        })()}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            {/* Вкладки стикерпаков внизу */}
            <Box sx={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.3)'
            }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: isMobile ? '56px' : '48px',
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main'
                  },
                  '& .MuiTab-root': {
                    minWidth: isMobile ? '48px' : '40px',
                    minHeight: isMobile ? '56px' : '48px',
                    padding: '8px 12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-selected': {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                {stickerPacks.map((pack, index) => (
                  <Tab
                    key={pack.id}
                    icon={
                      <Tooltip title={pack.name} placement="top">
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '6px',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.1)'
                        }}>
                          {pack.stickers && pack.stickers[0] ? (() => {
                            const stickerType = getStickerType(pack.stickers[0]);
                            const commonStyle = {
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            };

                            // Для табов используем упрощенную логику - только статичные превью
                            // TGS и WEBM в табах могут быть ресурсозатратными
                            if (stickerType === 'api_check_needed') {
                              // Для API эндпоинтов показываем статичное изображение
                              return (
                                <CachedImage
                                  src={pack.stickers[0].url}
                                  alt="pack preview"
                                  style={commonStyle}
                                />
                              );
                            } else if (stickerType === 'tgs') {
                              // Для TGS в табах показываем иконку или первый кадр
                              return (
                                <TGSSticker
                                  src={pack.stickers[0].url}
                                  style={commonStyle}
                                  onClick={() => {}}
                                  getCachedFile={getCachedStickerFile}
                                  setCachedFile={setCachedStickerFile}
                                />
                              );
                            } else if (stickerType === 'webm') {
                              return (
                                <CachedVideo
                                  src={pack.stickers[0].url}
                                  style={commonStyle}
                                  muted
                                  playsInline
                                  loop={false}
                                  autoPlay={false}
                                />
                              );
                            } else {
                              return (
                                <CachedImage
                                  src={pack.stickers[0].url}
                                  alt="pack preview"
                                  style={commonStyle}
                                />
                              );
                            }
                          })() : (
                            <StickerIcon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.5)' }} />
                          )}
                        </Box>
                      </Tooltip>
                    }
                  />
                ))}
              </Tabs>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default StickerPicker; 