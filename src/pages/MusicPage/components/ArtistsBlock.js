import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  styled,
  Zoom
} from '@mui/material';
import { 
  Search,
  VerifiedUser
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Стили из старого файла
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

const ArtistsBlock = () => {
  const navigate = useNavigate();
  const [popularArtists, setPopularArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [artistSearchQuery, setArtistSearchQuery] = useState('');
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [isArtistSearching, setIsArtistSearching] = useState(false);

  // Refs для управления поиском
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Загрузка популярных артистов
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

  // Поиск артистов
  const searchArtists = async (query) => {
    if (!query || query.trim().length < 2) {
      setArtistSearchResults([]);
      return;
    }
    
    // Отменяем предыдущий запрос если он еще выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Создаем новый AbortController для этого запроса
    abortControllerRef.current = new AbortController();
    
    try {
      setIsArtistSearching(true);
      console.log('[ArtistsBlock] Выполняем поиск артистов для:', query);
      
      const searchEndpoint = `/api/search/artists?query=${encodeURIComponent(query.trim())}`;
      
      const response = await axios.get(searchEndpoint, {
        signal: abortControllerRef.current.signal
      });
      
      if (response.data.success) {
        setArtistSearchResults(response.data.artists || []);
        console.log('[ArtistsBlock] Результаты поиска артистов:', response.data.artists);
      } else {
        console.error('Ошибка при поиске артистов:', response.data.error);
        setArtistSearchResults([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
        console.error('Ошибка при поиске артистов:', error);
        setArtistSearchResults([]);
        
        // Fallback поиск
        try {
          const fallbackResponse = await axios.get(`/api/moderator/artists?search=${encodeURIComponent(query.trim())}&page=1&per_page=10`, {
            signal: abortControllerRef.current.signal
          });
          
          if (fallbackResponse.data.success) {
            setArtistSearchResults(fallbackResponse.data.artists || []);
          }
        } catch (fallbackError) {
          if (fallbackError.name !== 'AbortError' && fallbackError.name !== 'CanceledError') {
            console.error('Fallback search also failed:', fallbackError);
          }
        }
      }
    } finally {
      setIsArtistSearching(false);
      abortControllerRef.current = null;
    }
  };

  // Обработчик изменения поиска
  const handleArtistSearchChange = (e) => {
    const query = e.target.value;
    setArtistSearchQuery(query);
    
    console.log('[ArtistsBlock] Изменение поискового запроса:', query);
    
    // Отменяем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Отменяем активный поиск если запрос слишком короткий
    if (query.trim().length < 2) {
      setArtistSearchResults([]);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }
    
    // Устанавливаем новый таймер для debounce
    searchTimeoutRef.current = setTimeout(() => {
      searchArtists(query);
    }, 1200); // 1.2 секунды debounce
  };

  // Очистка поиска
  const clearArtistSearch = () => {
    console.log('[ArtistsBlock] Очистка поиска');
    setArtistSearchQuery('');
    setArtistSearchResults([]);
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

  // Клик по артисту
  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  // Загрузка при монтировании
  useEffect(() => {
    fetchPopularArtists();
  }, [fetchPopularArtists]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      console.log('[ArtistsBlock] Размонтирование - очищаем ресурсы');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ 
      padding: 1,
      marginBottom: 0.5,
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    }}>
      {/* Заголовок и поиск */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
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
            <Search sx={{ fontSize: 18, mr: 0.5, color: 'rgba(255, 255, 255, 0.7)' }} />
            <input
              placeholder="Найти исполнителя"
              value={artistSearchQuery}
              onChange={handleArtistSearchChange}
              style={{ fontSize: '16px' }}
            />
            {artistSearchQuery && (
              <IconButton 
                size="small" 
                onClick={clearArtistSearch}
                sx={{ color: 'rgba(255, 255, 255, 0.7)', p: 0.5 }}
              >
                <Box sx={{ fontSize: 18, fontWeight: 'bold' }}>×</Box>
              </IconButton>
            )}
          </StyledSearchInput>
        </Box>
      </Box>
      
      {/* Контент */}
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
                                sx={{ flexGrow: 1, color: '#fff' }}
                              >
                                {artist.name}
                              </Typography>
                              {artist.verified && (
                                <Tooltip title="Верифицированный артист">
                                  <VerifiedUser 
                                    sx={{ 
                                      fontSize: 16, 
                                      ml: 0.5, 
                                      color: '#D0BCFF'
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
                  <Typography color="rgba(255, 255, 255, 0.7)">
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
                              sx={{ flexGrow: 1, color: '#fff' }}
                            >
                              {artist.name}
                            </Typography>
                            {artist.verified && (
                              <Tooltip title="Верифицированный артист">
                                <VerifiedUser 
                                  sx={{ 
                                    fontSize: 16, 
                                    ml: 0.5, 
                                    color: '#D0BCFF'
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
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 4,
                  width: '100%'
                }}>
                  <Typography color="rgba(255, 255, 255, 0.7)">
                    Артисты не найдены
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default ArtistsBlock; 