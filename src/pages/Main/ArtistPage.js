import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid,
  Avatar,
  IconButton,
  Button,
  Divider,
  useTheme,
  CircularProgress,
  Paper,
  List,
  styled,
  Chip,
  Fade,
  useMediaQuery,
  Skeleton,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  VerifiedUser,
  Twitter,
  Facebook,
  Instagram,
  Language,
  ArrowBack,
  FavoriteBorder,
  Favorite,
  Share,
  MoreHoriz,
  Error as ErrorIcon,
  HelpOutline,
  MusicOff,
  Album
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../../context/MusicContext';
import { formatDuration } from '../../utils/formatters';
import SEO from '../../components/SEO';
import { useSnackbar } from 'notistack';
import FullScreenPlayer from '../../components/Music';
import MobilePlayer from '../../components/Music/MobilePlayer';
import DesktopPlayer from '../../components/Music/DesktopPlayer';


const ArtistContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(14),
  padding: theme.spacing(0, 1),
  [theme.breakpoints.up('md')]: {
    marginBottom: theme.spacing(16),
    padding: theme.spacing(0, 3),
  }
}));

const ArtistHeaderCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, rgba(30,30,30,0.7) 0%, rgba(10,10,10,0.7) 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.05)',
  marginBottom: theme.spacing(3),
  position: 'relative',
}));

const ArtistHeaderBackground = styled(Box)(({ theme, image }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '150px',
  backgroundImage: image ? `linear-gradient(rgba(0,0,0,0.3), rgba(10,10,10,0.8)), url(${image})` : 'linear-gradient(45deg, #1a1a1a 0%, #0a0a0a 100%)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.7,
  zIndex: 0,
  filter: 'blur(2px)',
}));

const ArtistContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));

const ArtistAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '3px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(2),
  flexShrink: 0,
  [theme.breakpoints.up('sm')]: {
    marginBottom: 0,
  },
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const TrackItem = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 8,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: active ? 'rgba(208, 188, 255, 0.1)' : 'transparent',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.05)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  }
}));

const TrackCover = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 4,
  overflow: 'hidden',
  marginRight: theme.spacing(2),
  flexShrink: 0,
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  backgroundColor: 'rgba(255,255,255,0.05)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'scale(1.1)',
  },
  transition: 'transform 0.2s ease'
}));

const VerifiedBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#000',
  fontWeight: 'bold',
  height: 24,
  marginLeft: theme.spacing(1),
  '& .MuiChip-icon': {
    color: '#000',
  }
}));

const TruncatedTypography = styled(Typography)(({ theme, lines = 1 }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  wordBreak: 'break-word',
  maxWidth: '100%'
}));

const BiographyContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxHeight: theme.spacing(30),
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50px',
    pointerEvents: 'none'
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5, 2),
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const GenreChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'translateY(-2px)'
  },
  maxWidth: 150
}));

const TrackInfoContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'hidden',
  paddingRight: theme.spacing(1),
  width: 0,
}));

const TrackNumber = styled(Typography)(({ theme }) => ({
  width: 30,
  textAlign: 'right',
  marginRight: theme.spacing(2),
  flexShrink: 0
}));

const TrackActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  flexShrink: 0
}));


const NotFoundCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: 'rgba(30,30,30,0.5)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.05)',
  textAlign: 'center'
}));

const NotFoundIconContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2)
}));

const NotFoundIcon = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const ArtistPage = () => {
  const { artistParam } = useParams();
  const [artistData, setArtistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [mostListenedTracks, setMostListenedTracks] = useState([]);
  const [newestTracks, setNewestTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreTracks, setHasMoreTracks] = useState(true);
  const [loadingMoreTracks, setLoadingMoreTracks] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    likeTrack,
    setCurrentSection,
    openFullScreenPlayer,
    closeFullScreenPlayer,
    isFullScreenPlayerOpen
  } = useMusic();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const tracksContainerRef = useRef(null);
  const lastTrackElementRef = useRef(null);


  const observer = useRef();
  const lastTrackRef = useCallback((node) => {
    if (loadingMoreTracks) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreTracks) {
        loadMoreTracks();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMoreTracks, hasMoreTracks]);

  useEffect(() => {
    fetchArtistData();
  }, [artistParam]);

  useEffect(() => {
    if (artistData) {

      prepareMostListenedTracks();
      prepareNewestTracks();
    }
  }, [tracks]);

  const fetchArtistData = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setLoadingMoreTracks(true);
      }
      

      const response = await axios.get(`/api/music/artist?id=${artistParam}&page=${page}&per_page=40`);
      
      if (response.data.success) {
        const { artist } = response.data;
        setArtistData(artist);
        
        if (append) {
          setTracks(prev => [...prev, ...artist.tracks]);
        } else {
          setTracks(artist.tracks);
        }
        

        setHasMoreTracks(page < artist.tracks_pages);
        setCurrentPage(page);
      } else {
        setError('Не удалось загрузить данные об исполнителе');
      }
    } catch (err) {
      setError('Произошла ошибка при загрузке данных');
      console.error('Error fetching artist data:', err);
    } finally {
      setIsLoading(false);
      setLoadingMoreTracks(false);
    }
  };

  const loadMoreTracks = () => {
    if (!loadingMoreTracks && hasMoreTracks) {
      const nextPage = currentPage + 1;
      fetchArtistData(nextPage, true);
    }
  };

  const prepareMostListenedTracks = () => {

    const sorted = [...tracks].sort((a, b) => b.plays_count - a.plays_count).slice(0, 5);
    setMostListenedTracks(sorted);
  };

  const prepareNewestTracks = () => {

    const sorted = [...tracks].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
    setNewestTracks(sorted);
  };

  const handleOpenFullScreenPlayer = useCallback(() => {
    openFullScreenPlayer();
  }, [openFullScreenPlayer]);

  const handleCloseFullScreenPlayer = useCallback(() => {
    closeFullScreenPlayer();
    
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }, [closeFullScreenPlayer]);

  const handleTrackClick = (track) => {
    handlePlayTrack(track, 'artist');
  };

  const handlePlayTrack = (track) => {
    playTrack(track, 'artist');
    if (isMobile) {

      handleOpenFullScreenPlayer();
    }
  };

  const handleLikeTrack = async (trackId) => {
    await likeTrack(trackId);
  };

  const handleTogglePlay = (track) => {
    togglePlay(track);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const shareArtist = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artistData.name} - Музыкальная платформа`,
        text: `Послушайте треки исполнителя ${artistData.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  const renderTrackItem = (track, index, isLast = false) => {
    const isCurrentTrack = currentTrack && currentTrack.id === track.id;
    const isCurrentlyPlaying = isCurrentTrack && isPlaying;

    return (
      <ListItem 
        key={track.id}
        ref={isLast ? lastTrackRef : null}
        onClick={() => isCurrentTrack ? handleTogglePlay(track) : handleTrackClick(track)}
        sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transform: 'translateY(-2px)'
          },
          backgroundColor: isCurrentTrack ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: '8px',
          mb: 0.5,
          py: 1,
          cursor: 'pointer'
        }}
        button
      >
        <ListItemAvatar sx={{ minWidth: 70 }}>
          <Box position="relative">
            <Avatar 
              variant="rounded" 
              src={track.cover_path} 
              sx={{ 
                width: 56, 
                height: 56,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              <Album />
            </Avatar>
            {isCurrentlyPlaying && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: 1
                }}
              >
                <Pause fontSize="small" />
              </Box>
            )}
          </Box>
        </ListItemAvatar>
        
        <ListItemText 
          primary={
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: isCurrentTrack ? 600 : 400,
                color: isCurrentTrack ? theme.palette.primary.main : 'inherit',
                ml: 1
              }}
            >
              {track.title}
            </Typography>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              {track.album && (
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                  {track.album} •
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {formatDuration(track.duration)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {track.plays_count.toLocaleString()} прослушиваний
              </Typography>
            </Box>
          }
        />
        <ListItemSecondaryAction onClick={(e) => e.stopPropagation()}>
          <IconButton edge="end" onClick={(e) => {
            e.stopPropagation();
            handleLikeTrack(track.id);
          }}>
            {track.is_liked ? <Favorite color="primary" /> : <FavoriteBorder />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  const renderFeaturedTrackItem = (track, index) => {
    const isCurrentTrack = currentTrack && currentTrack.id === track.id;
    const isCurrentlyPlaying = isCurrentTrack && isPlaying;

    return (
      <Grid item xs={6} sm={4} md={3} lg={2} key={track.id}>
        <Box
          sx={{
            position: 'relative',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
            cursor: 'pointer',
          }}
          onClick={() => isCurrentTrack ? handleTogglePlay(track) : handleTrackClick(track)}
        >
          <Box 
            position="relative" 
            sx={{ 
              aspectRatio: '1/1',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              mb: 1,
              backgroundColor: '#121212',
            }}
          >
            <img
              src={track.cover_path || '/static/uploads/system/album_placeholder.jpg'}
              alt={track.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {isCurrentlyPlaying && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                }}
              >
                <Pause sx={{ fontSize: 40, color: '#fff' }} />
              </Box>
            )}
            {!isCurrentlyPlaying && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0)',
                  opacity: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    opacity: 1,
                  },
                }}
              >
                <PlayArrow sx={{ fontSize: 40, color: '#fff' }} />
              </Box>
            )}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                m: 1,
                p: 0.5,
                backgroundColor: isCurrentTrack ? theme.palette.primary.main : 'rgba(0,0,0,0.7)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: isCurrentTrack ? '#000' : '#fff', px: 0.5 }}>
                {formatDuration(track.duration)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ px: 0.5 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: isCurrentTrack ? 600 : 500,
                color: isCurrentTrack ? theme.palette.primary.main : 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              {track.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                {track.plays_count.toLocaleString()}
              </Typography>
              
              <IconButton 
                size="small" 
                sx={{ p: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeTrack(track.id);
                }}
              >
                {track.is_liked ? 
                  <Favorite color="primary" sx={{ fontSize: 16 }} /> : 
                  <FavoriteBorder sx={{ fontSize: 16, color: 'text.secondary' }} />
                }
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Grid>
    );
  };

  const renderTrackSection = (title, tracksArray, featured = false) => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
        {title}
      </Typography>

      {featured ? (
        <Grid container spacing={2}>
          {tracksArray.map((track, index) => renderFeaturedTrackItem(track, index))}
        </Grid>
      ) : (
        <Paper sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }}>
          <List>
            {tracksArray.map((track, index) => renderTrackItem(track, index))}
          </List>
        </Paper>
      )}
    </Box>
  );

  if (isLoading && !artistData) {
    return (
      <ArtistContainer maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={40} thickness={4} />
        </Box>
      </ArtistContainer>
    );
  }

  if (error || !artistData) {
    return (
      <ArtistContainer maxWidth="lg">
        <Box textAlign="center" p={3}>
          <Typography variant="h5" gutterBottom>
            {error || 'Исполнитель не найден'}
          </Typography>
          <ActionButton 
            variant="contained" 
            color="primary" 
            onClick={handleBackClick} 
            startIcon={<ArrowBack />}
          >
            Назад
          </ActionButton>
        </Box>
      </ArtistContainer>
    );
  }


  const noTracksAndNotVerified = 
    (!tracks || tracks.length === 0) && 
    !artistData.verified;

  return (
    <ArtistContainer maxWidth="lg">
      <SEO 
        title={`${artistData.name} - K-Connect Music`}
        description={`Слушайте треки ${artistData.name} на K-Connect Music`}
        image={artistData.avatar_url || '/static/uploads/system/album_placeholder.jpg'}
      />
      
      {/* Back button */}
      <Box mb={2}>
        <ActionButton 
          startIcon={<ArrowBack />} 
          onClick={handleBackClick}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': { color: theme.palette.text.primary }
          }}
        >
          Назад
        </ActionButton>
      </Box>
      
      {noTracksAndNotVerified ? (

        <NotFoundCard>
          <CardContent>
            <NotFoundIconContainer>
              <NotFoundIcon>
                <MusicOff sx={{ fontSize: 60, opacity: 0.6 }} />
              </NotFoundIcon>
            </NotFoundIconContainer>
            
            <Typography variant="h5" gutterBottom>
              Исполнитель не подтвержден
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              У нас нет информации о треках исполнителя «{artistData.name}». 
              Возможно, это связано с проблемами в написании имени или исполнитель еще не добавлен в нашу базу данных.
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Попробуйте проверить написание имени исполнителя или вернитесь позже.
            </Typography>
            
            <ActionButton
              variant="contained"
              color="primary"
              onClick={() => navigate('/music')}
              sx={{ mt: 2, mb: 1 }}
            >
              Перейти к музыкe
            </ActionButton>
          </CardContent>
        </NotFoundCard>
      ) : (

        <>
          {/* Artist header */}
          <ArtistHeaderCard elevation={3}>
            <ArtistHeaderBackground image={artistData.avatar_url} />
            <ArtistContent>
              <ArtistAvatar 
                src={artistData.avatar_url || '/static/uploads/system/album_placeholder.jpg'} 
                alt={artistData.name}
              />
              
              <Box flex={1} overflow="hidden">
                <Box display="flex" alignItems="center" mb={1} overflow="hidden">
                  <Tooltip title={artistData.name}>
                    <TruncatedTypography variant="h4" component="h1" sx={{ maxWidth: '70%' }}>
                      {artistData.name}
                    </TruncatedTypography>
                  </Tooltip>
                  
                  {artistData.verified && (
                    <Fade in={true}>
                      <VerifiedBadge 
                        size="small" 
                        icon={<VerifiedUser fontSize="small" />} 
                        label="Проверено" 
                      />
                    </Fade>
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {tracks.length} {tracks.length === 1 ? 'трек' : 
                    tracks.length > 1 && tracks.length < 5 ? 'трека' : 'треков'}
                </Typography>
                
                {artistData.genres && artistData.genres.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gap={1} mb={1} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                    {artistData.genres.slice(0, 3).map((genre, index) => (
                      <Tooltip key={index} title={genre}>
                        <GenreChip 
                          label={genre.length > 20 ? `${genre.slice(0, 17)}...` : genre} 
                          size="small"
                        />
                      </Tooltip>
                    ))}
                    {artistData.genres.length > 3 && (
                      <Tooltip title={`Ещё ${artistData.genres.length - 3} жанров`}>
                        <GenreChip 
                          label={`+${artistData.genres.length - 3}`}
                          size="small"
                        />
                      </Tooltip>
                    )}
                  </Box>
                )}
                
                <Box mt={2} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                  {artistData.instagram && (
                    <SocialButton 
                      size="small" 
                      aria-label="Instagram" 
                      onClick={() => window.open(artistData.instagram, '_blank')}
                    >
                      <Instagram fontSize="small" />
                    </SocialButton>
                  )}
                  
                  {artistData.twitter && (
                    <SocialButton 
                      size="small" 
                      aria-label="Twitter" 
                      onClick={() => window.open(artistData.twitter, '_blank')}
                    >
                      <Twitter fontSize="small" />
                    </SocialButton>
                  )}
                  
                  {artistData.facebook && (
                    <SocialButton 
                      size="small" 
                      aria-label="Facebook" 
                      onClick={() => window.open(artistData.facebook, '_blank')}
                    >
                      <Facebook fontSize="small" />
                    </SocialButton>
                  )}
                  
                  {artistData.website && (
                    <SocialButton 
                      size="small" 
                      aria-label="Веб-сайт" 
                      onClick={() => window.open(artistData.website, '_blank')}
                    >
                      <Language fontSize="small" />
                    </SocialButton>
                  )}
                  
                  <Box flexGrow={1} />
                  
                  <ActionButton
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Share />}
                    onClick={shareArtist}
                    sx={{ mr: 1 }}
                  >
                    Поделиться
                  </ActionButton>
                  
                  {tracks && tracks.length > 0 && (
                    <ActionButton
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<PlayArrow />}
                      onClick={() => handleTrackClick(tracks[0])}
                    >
                      Слушать
                    </ActionButton>
                  )}
                </Box>
              </Box>
            </ArtistContent>
          </ArtistHeaderCard>
          
          {/* Artist biography */}
          {artistData.bio && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: '16px',
                bgcolor: '#121212',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Биография
              </Typography>
              
              <BiographyContainer>
                <TruncatedTypography 
                  variant="body2" 
                  lines={isMobile ? 10 : 15} 
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {artistData.bio}
                </TruncatedTypography>
              </BiographyContainer>
              
              {artistData.bio && artistData.bio.length > 300 && (
                <Box textAlign="center" mt={2}>
                  <ActionButton 
                    size="small" 
                    color="primary"
                    onClick={() => {

                    }}
                  >
                    Читать полностью
                  </ActionButton>
                </Box>
              )}
            </Paper>
          )}
          
          {/* Most listened tracks */}
          {mostListenedTracks && mostListenedTracks.length > 0 && renderTrackSection('Самые прослушиваемые треки', mostListenedTracks, true)}
          
          {/* Newest tracks */}
          {newestTracks && newestTracks.length > 0 && renderTrackSection('Новые треки', newestTracks, true)}
          
          {/* All tracks section */}
          <Box mb={4}>
            <Typography variant="h5" gutterBottom>
              Все треки
            </Typography>
            
            {tracks && tracks.length > 0 ? (
              <List disablePadding>
                {tracks.map((track, index) => renderTrackItem(
                  track, 
                  index, 
                  index === tracks.length - 1 && hasMoreTracks
                ))}
                
                {/* Loading indicator and reference for infinite scrolling */}
                <div ref={tracksContainerRef}>
                  {loadingMoreTracks && (
                    <Box textAlign="center" py={2}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </div>
              </List>
            ) : (
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(18,18,18,0.4)'
                }}
              >
                <Typography color="text.secondary">
                  Треки не найдены
                </Typography>
              </Paper>
            )}
          </Box>
        </>
      )}

      {/* Music Players */}
      {isMobile && currentTrack && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
          }}
        >
          <MobilePlayer onExpandClick={handleOpenFullScreenPlayer} />
        </Box>
      )}
      
      {/* Desktop Player */}
      {!isMobile && currentTrack && (
        <DesktopPlayer />
      )}
      
      {/* Full Screen Player */}
      <FullScreenPlayer 
        open={isFullScreenPlayerOpen} 
        onClose={handleCloseFullScreenPlayer} 
      />
    </ArtistContainer>
  );
};

export default ArtistPage; 