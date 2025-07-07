import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography,
  Container,
  Card,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  styled,
  InputBase,
  Tooltip,
  Snackbar,
  useTheme,
  ImageList,
  ImageListItem,
  Alert,
  Dialog,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../services/axiosConfig';
import { handleImageError as safeImageError } from '../../utils/imageUtils';

import CloseIcon from '@mui/icons-material/Close';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Post } from '../../components/Post';
import RepostItem from '../../components/RepostItem';
import PostSkeleton from '../../components/Post/PostSkeleton';
import MusicSelectDialog from '../../components/Music/MusicSelectDialog';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { MusicContext } from '../../context/MusicContext';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


import TimerIcon from '@mui/icons-material/Timer';
import UpdateInfo from '../../components/Updates/UpdateInfo';
import UpdateService from '../../services/UpdateService';
import SimpleImageViewer from '../../components/SimpleImageViewer';
import DynamicIslandNotification from '../../components/DynamicIslandNotification';
import WarningIcon from '@mui/icons-material/Warning';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
// import TelegramIcon from '@mui/icons-material/Telegram';



const OnlineUsersCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : '1px solid rgba(0, 0, 0, 0.1)'
}));





const PostInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  '& .MuiInputBase-input': {
    padding: '8px',
  },
}));

const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
}));


const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(),
  width: '100%',
  maxWidth: '100%',
  overflow: { xs: 'hidden', md: 'visible' },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1), 
  },
}));

const LeftColumn = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  [theme.breakpoints.up('md')]: {
    width: '68%',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '5px', 
  },
}));

const RightColumn = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    width: '32%',
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1), 
  },
}));

const SupportBlock = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  overflow: 'hidden',
  position: 'relative',
}));


const OnlineUsers = () => {
  const { t } = useLanguage();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/online?limit=1200');
        
        if (Array.isArray(response.data)) {
          setOnlineUsers(response.data);
        } else if (response.data && Array.isArray(response.data.users)) {
          setOnlineUsers(response.data.users);
        } else {
          setOnlineUsers([]);
        }
      } catch (error) {
        console.error('Error fetching online users:', error);
        setOnlineUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOnlineUsers();
    
    
    const interval = setInterval(fetchOnlineUsers, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };
  
  if (loading) {
    return (
      <OnlineUsersCard sx={{ p: 1, minHeight: 56, display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={18} sx={{ mr: 1 }} />
        <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>{t('main_page.loading')}</Typography>
      </OnlineUsersCard>
    );
  }
  
  if (onlineUsers.length === 0) {
    return null;
  }
  
  return (
    <OnlineUsersCard sx={{ p: 1, minHeight: 56, display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
      <Box sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: 1,
        overflowX: 'auto',
        pb: 0,
        '&::-webkit-scrollbar': { height: '0px', display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: '12px',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            minWidth: 'fit-content',
            height: 36,
            mr: 0.5
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4caf50',
              boxShadow: '0 0 8px rgba(76, 175, 80, 0.5)'
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#4caf50'
            }}
          >
            {t('main_page.online_count', { count: onlineUsers.length })}
          </Typography>
        </Box>
        {onlineUsers.map(user => (
          <Box
            key={user.id}
            sx={{ position: 'relative', cursor: 'pointer', mx: 0.25 }}
            onClick={() => handleUserClick(user.username)}
          >
            <Avatar
              src={user.photo}
              alt={user.username}
              sx={{
                width: 36,
                height: 36,
                border: `2px solid ${theme.palette.background.paper}`,
                boxSizing: 'border-box',
                background: '#222',
              }}
              onError={safeImageError}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                border: `1.5px solid ${theme.palette.background.paper}`,
                boxSizing: 'border-box',
              }}
            />
          </Box>
        ))}
      </Box>
    </OnlineUsersCard>
  );
};


const UserRecommendation = ({ user }) => {
  const { t } = useLanguage();
  const [following, setFollowing] = useState(user.is_following || false);
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleFollow = async (e) => {
    e.stopPropagation();
    try {
      
      setFollowing(!following);
      
      const response = await axios.post(`/api/profile/follow`, {
        followed_id: user.id
      });
      
      
      if (response.data && response.data.success) {
        setFollowing(response.data.is_following);
      }
    } catch (error) {
      
      setFollowing(following);
      console.error('Error toggling follow:', error);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/profile/${user.username}`);
  };

  
  const getAvatarSrc = () => {
    if (!user.photo) return '/static/uploads/system/avatar.png';
    
    
    if (user.photo.startsWith('/') || user.photo.startsWith('http')) {
      return user.photo;
    }
    
    
    return `/static/uploads/avatar/${user.id}/${user.photo}`;
  };
  
  
  const isChannelAccount = currentUser && currentUser.account_type === 'channel';
  
  return (
    <Box 
      onClick={handleCardClick} 
      sx={{ 
        cursor: 'pointer',
        py: 2,
        px: 2.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar 
            src={getAvatarSrc()}
            alt={user.name || user.username}
            sx={{ 
              width: 42, 
              height: 42, 
              mr: 1.5,
              border: '2px solid rgba(208, 188, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            onError={safeImageError}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography 
              variant="body2" 
              fontWeight="500" 
              noWrap 
              sx={{ 
                color: theme => theme.palette.text.primary,
                letterSpacing: '0.1px'
              }}
            >
              {user.name || user.username}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.75
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                noWrap 
                sx={{ 
                  fontSize: '0.75rem',
                  color: '#a0a0a0'
                }}
              >
                @{user.username}
              </Typography>
              {user.is_verified && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 12,
                    height: 12,
                    bgcolor: '#8470FF',
                    borderRadius: '50%',
                    fontSize: '0.6rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  ✓
                </Box>
              )}
            </Box>
          </Box>
          
          {!isChannelAccount && (
            <Button
              variant={following ? "text" : "contained"}
              size="small"
              onClick={handleFollow}
              sx={{
                minWidth: 'auto',
                height: 32,
                borderRadius: '16px',
                textTransform: 'none',
                px: following ? 2 : 2,
                ml: 1,
                fontSize: '0.75rem',
                fontWeight: 500,
                ...(following && {
                  color: '#a0a0a0',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.04)',
                    color: '#ff5252',
                    borderColor: 'rgba(255, 82, 82, 0.2)'
                  }
                })
              }}
            >
              {following ? t('main_page.follow.unfollow') : t('main_page.follow.follow')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};


const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(MusicContext);
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaNotification, setMediaNotification] = useState({ open: false, message: '' });
  const [isNsfw, setIsNsfw] = useState(false);
  
  
  const [musicSelectOpen, setMusicSelectOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  
  
  const [rateLimitDialog, setRateLimitDialog] = useState({
    open: false,
    message: '',
    timeRemaining: 0
  });
  
  const [showSizeError, setShowSizeError] = useState(false);
  const [sizeErrorMessage, setSizeErrorMessage] = useState('');
  const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150MB in bytes
  const MAX_PHOTO_SIZE = 50 * 1024 * 1024;  // 50MB in bytes
  
  
  useEffect(() => {
    if (error) setError('');
  }, [content, mediaFiles, selectedTracks, error]);
  
  
  const dragCounter = useRef(0);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };
  
  const handleMediaChange = (event) => {
    event.preventDefault(); 
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };
  
  const processFiles = (files) => {
    if (!files.length) return;

    let hasInvalidSize = false;
    
    // Проверяем размеры файлов
    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        setSizeErrorMessage(t('main_page.media.video_size_error'));
        setShowSizeError(true);
        hasInvalidSize = true;
      }

      if (isImage && file.size > MAX_PHOTO_SIZE) {
        setSizeErrorMessage(t('main_page.media.image_size_error'));
        setShowSizeError(true);
        hasInvalidSize = true;
      }
    });

    if (hasInvalidSize) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'));

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      setMediaNotification({
        open: true,
        message: t('main_page.media.unsupported_format')
      });
      return;
    }

    // Если уже есть видео, не позволяем добавлять изображения
    if (mediaType === 'video' && imageFiles.length > 0) {
      setMediaNotification({
        open: true,
        message: t('main_page.media.mixed_content_error')
      });
      return;
    }

    // Если уже есть изображения, не позволяем добавлять видео
    if (mediaType === 'image' && videoFiles.length > 0) {
      setMediaNotification({
        open: true,
        message: t('main_page.media.mixed_content_error')
      });
      return;
    }

    // Обработка видео
    if (videoFiles.length > 0) {
      setMediaFiles([videoFiles[0]]);
      setMediaType('video');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview([reader.result]);
      };
      reader.readAsDataURL(videoFiles[0]);
      return;
    }

    // Обработка изображений
    if (imageFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...imageFiles]);
      setMediaType('image');
      
      // Создаем превью для всех изображений
      const newPreviews = [];
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === imageFiles.length) {
            setMediaPreview(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveMedia = () => {
    setMediaFiles([]);
    setMediaPreview([]);
    setMediaType('');
    setSelectedTracks([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  
  const handleMusicSelect = (tracks) => {
    setSelectedTracks(tracks);
  };
  
  
  const handleRemoveTrack = (trackId) => {
    setSelectedTracks(prev => prev.filter(track => track.id !== trackId));
  };
  
  const clearForm = () => {
    setContent('');
    setMediaFiles([]);
    setMediaPreview([]);
    setMediaType('');
    setSelectedTracks([]);
    setIsNsfw(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  
  const handleTrackPlay = (track, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay(); 
    } else {
      playTrack(track, 'main');
    }
  };
  
  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0 && selectedTracks.length === 0) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      console.log("Starting post submission...");
      
      const formData = new FormData();
      formData.append('content', content.trim());
      formData.append('is_nsfw', isNsfw.toString());
      
      console.log("Added content to FormData:", content.trim());
      
      if (mediaType === 'image') {
        // Отправляем все изображения с правильным форматом
        mediaFiles.forEach((file, index) => {
          console.log(`Adding image[${index}]:`, file.name, file.size);
          formData.append(`images[${index}]`, file); // Исправлено на правильный формат
        });
      } else if (mediaType === 'video') {
        console.log("Adding video to FormData:", mediaFiles[0].name, mediaFiles[0].size);
        formData.append('video', mediaFiles[0]);
      }
      
      if (selectedTracks.length > 0) {
        console.log(`Adding ${selectedTracks.length} music tracks to post`);
        
        const trackData = selectedTracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          file_path: track.file_path,
          cover_path: track.cover_path
        }));
        formData.append('music', JSON.stringify(trackData));
      }
      
      console.log("Sending post request to server...");
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Post created successfully!", response.data);
      
      clearForm();
      
      if (onPostCreated) {
        onPostCreated(response.data.post);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = "Превышен лимит публикации постов. ";
        let timeRemaining = 0;
        
        if (rateLimit && rateLimit.reset) {
          
          const resetTime = new Date(rateLimit.reset * 1000);
          const now = new Date();
          const diffSeconds = Math.round((resetTime - now) / 1000);
          timeRemaining = diffSeconds;
          
          if (diffSeconds > 60) {
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            errorMessage += `Следующий пост можно опубликовать через ${minutes} мин. ${seconds} сек.`;
          } else {
            errorMessage += `Следующий пост можно опубликовать через ${diffSeconds} сек.`;
          }
        } else {
          errorMessage += "Пожалуйста, повторите попытку позже.";
          timeRemaining = 60; 
        }
        
        setError(errorMessage);
        
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'warning'
        });
        
        
        setRateLimitDialog({
          open: true,
          message: errorMessage,
          timeRemaining: timeRemaining
        });
      } else if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        
        setSnackbar({
          open: true,
          message: error.response.data.error,
          severity: 'error'
        });
      } else {
        setError("Произошла ошибка при создании поста. Пожалуйста, попробуйте еще раз.");
        
        setSnackbar({
          open: true,
          message: "Произошла ошибка при создании поста. Пожалуйста, попробуйте еще раз.",
          severity: 'error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePaste = (e) => {
    const clipboardData = e.clipboardData;
    if (clipboardData.items) {
      const items = Array.from(clipboardData.items);
      const imageItems = items.filter(item => item.type.indexOf('image') !== -1);
      
      if (imageItems.length > 0) {
        e.preventDefault();
        
        // Если уже есть видео, не позволяем добавлять изображения
        if (mediaType === 'video') {
          setMediaNotification({
            open: true,
            message: 'Нельзя прикрепить фото и видео одновременно'
          });
          return;
        }

        const imageFiles = imageItems.map(item => item.getAsFile());
        processFiles(imageFiles);
      }
    }
  };
  
  if (!user) return null;
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderRadius: 1,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      
      <Dialog
        open={rateLimitDialog.open}
        onClose={() => setRateLimitDialog(prev => ({ ...prev, open: false }))}
        aria-labelledby="rate-limit-dialog-title"
        aria-describedby="rate-limit-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: '#1A1A1A',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography 
            id="rate-limit-dialog-title" 
            variant="h6" 
            component="h2" 
            sx={{ 
              mb: 2, 
              color: '#D0BCFF',
              fontWeight: 'medium',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TimerIcon sx={{ mr: 1 }} /> {t('main_page.post.create.error.title')}
          </Typography>
          <Typography id="rate-limit-dialog-description" sx={{ mb: 3, color: 'text.secondary' }}>
            {rateLimitDialog.message}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Button 
              onClick={() => setRateLimitDialog(prev => ({ ...prev, open: false }))} 
              variant="contained"
              sx={{
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 500,
                padding: '6px 16px'
              }}
            >
              {t('main_page.post.create.error.understand')}
            </Button>
          </Box>
        </Box>
      </Dialog>
      
      <Snackbar
        open={mediaNotification.open}
        autoHideDuration={3000}
        onClose={() => setMediaNotification({ ...mediaNotification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMediaNotification({ ...mediaNotification, open: false })} 
          severity="warning"
          sx={{ width: '100%' }}
        >
          {mediaNotification.message}
        </Alert>
      </Snackbar>
      
      <DynamicIslandNotification
        open={showSizeError}
        message={sizeErrorMessage}
        shortMessage={t('main_page.post.create.error.file_size')}
        notificationType="error"
        animationType="pill"
        autoHideDuration={5000}
        onClose={() => setShowSizeError(false)}
      />
      
      <Box 
        component="form" 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        sx={{ 
          position: 'relative',
          zIndex: 1 
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            borderRadius: '12px',
            border: isDragging ? '2px dashed #D0BCFF' : 'none',
            backgroundColor: isDragging ? 'rgba(208, 188, 255, 0.05)' : 'transparent',
            padding: isDragging ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
        >
          {isDragging && (
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: 'rgba(26, 26, 26, 0.7)',
                borderRadius: '12px',
                zIndex: 10,
                opacity: isDragging ? 1 : 0,
                transition: 'opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
            >
              <ImageOutlinedIcon sx={{ fontSize: 40, color: '#D0BCFF', mb: 1, filter: 'drop-shadow(0 0 8px rgba(208, 188, 255, 0.6))' }} />
              <Typography variant="body1" color="primary" sx={{ fontWeight: 'medium', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                {t('main_page.post.create.drag_files')}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0 }}>
            <Avatar 
              src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : undefined}
              alt={user.name}
              sx={{ mr: 1.5, width: 42, height: 42, border: '2px solid #D0BCFF' }}
            />
            <PostInput 
              placeholder={t('main_page.post.create.placeholder')}
              multiline
              maxRows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              fullWidth
            />
          </Box>
          
          
          {mediaPreview.length > 0 && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Box sx={{ 
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}>
                {mediaType === 'image' ? (
                  <ImageList 
                    sx={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: 500,
                      margin: 0,
                      padding: 1
                    }} 
                    cols={mediaPreview.length > 3 ? 3 : mediaPreview.length} 
                    rowHeight={164}
                    gap={8}
                  >
                    {mediaPreview.map((preview, index) => (
                      <ImageListItem 
                        key={index}
                        sx={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{ 
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%',
                            borderRadius: '8px'
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            setMediaFiles(prev => prev.filter((_, i) => i !== index));
                            setMediaPreview(prev => prev.filter((_, i) => i !== index));
                            if (mediaPreview.length === 1) {
                              setMediaType('');
                            }
                          }}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            padding: '4px',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            },
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <video
                    src={mediaPreview[0]}
                    controls
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px',
                      borderRadius: '12px'
                    }}
                  />
                )}
                {mediaType === 'video' && (
                  <IconButton
                    onClick={handleRemoveMedia}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                      padding: '8px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
          
          
          {selectedTracks.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              {selectedTracks.map(track => (
                <Box 
                  key={track.id}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 1, 
                    px: 1.5, 
                    mb: 1, 
                    borderRadius: '10px',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={(e) => handleTrackPlay(track, e)}
                >
                  <Box 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '6px', 
                      overflow: 'hidden',
                      mr: 1.5,
                      position: 'relative',
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <img 
                      src={
                        !track.cover_path ? '/uploads/system/album_placeholder.jpg' :
                        track.cover_path.startsWith('/static/') ? track.cover_path :
                        track.cover_path.startsWith('static/') ? `/${track.cover_path}` :
                        track.cover_path.startsWith('http') ? track.cover_path :
                        `/static/music/${track.cover_path}`
                      } 
                      alt={track.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/uploads/system/album_placeholder.jpg';
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {currentTrack && currentTrack.id === track.id && isPlaying ? (
                        <PauseIcon sx={{ color: 'white', fontSize: 16 }} />
                      ) : (
                        <MusicNoteIcon 
                          sx={{ 
                            fontSize: 14, 
                            color: 'rgba(255, 255, 255, 0.9)',
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: currentTrack && currentTrack.id === track.id ? 'medium' : 'normal',
                        color: currentTrack && currentTrack.id === track.id ? 'primary.main' : 'text.primary',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.85rem'
                      }}
                    >
                      {track.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.75rem'
                      }}
                    >
                      {track.artist}
                    </Typography>
                  </Box>
                  {currentTrack && currentTrack.id === track.id ? (
                    isPlaying ? (
                      <PauseIcon color="primary" fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
                    ) : (
                      <PlayArrowIcon color="primary" fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
                    )
                  ) : null}
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTrack(track.id);
                    }}
                    sx={{ 
                      ml: 'auto',
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.3)'
                      },
                      padding: '4px'
                    }}
                  >
                    <CloseIcon fontSize="small" sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          <PostActions>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
                style={{ display: 'none' }}
                id="media-upload-main"
              />
              <Button
                startIcon={<ImageOutlinedIcon />}
                sx={{
                  color: mediaFiles.length > 0 ? 'primary.main' : 'text.secondary',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '4px 8px',
                  border: mediaFiles.length > 0 
                    ? '1px solid rgba(208, 188, 255, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(208, 188, 255, 0.08)',
                    borderColor: 'rgba(208, 188, 255, 0.4)'
                  }
                }}
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                {mediaFiles.length ? t('main_page.post.create.media_count', { count: mediaFiles.length }) : t('main_page.post.create.media')}
              </Button>
              
              <Button
                onClick={() => setMusicSelectOpen(true)}
                startIcon={<MusicNoteIcon />}
                sx={{
                  color: selectedTracks.length > 0 ? 'primary.main' : 'text.secondary',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '4px 8px',
                  border: selectedTracks.length > 0 
                    ? '1px solid rgba(208, 188, 255, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(208, 188, 255, 0.08)',
                    borderColor: 'rgba(208, 188, 255, 0.4)'
                  }
                }}
                size="small"
              >
                {selectedTracks.length ? t('main_page.post.create.music_count', { count: selectedTracks.length }) : t('main_page.post.create.music')}
              </Button>
              
              {/* NSFW кнопка - показывается только при наличии медиа */}
              {(mediaFiles.length > 0 || selectedTracks.length > 0) && (
                <Tooltip title="Деликатный контент" placement="top">
                  <IconButton
                    onClick={() => setIsNsfw(!isNsfw)}
                    sx={{
                      color: isNsfw ? '#ff6b6b' : 'text.secondary',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      minWidth: 36,
                      minHeight: 36,
                      padding: 0,
                      border: isNsfw 
                        ? '1px solid rgba(255, 107, 107, 0.5)' 
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: isNsfw ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: isNsfw 
                          ? 'rgba(255, 107, 107, 0.2)' 
                          : 'rgba(255, 107, 107, 0.08)',
                        borderColor: 'rgba(255, 107, 107, 0.4)'
                      },
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                    size="small"
                  >
                    <WarningIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            
            <Button 
              variant="contained" 
              type="submit"
              disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0 && selectedTracks.length === 0)}
              endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 500,
                padding: '6px 16px'
              }}
            >
              {t('main_page.post.create.publish')}
            </Button>
          </PostActions>
          
          
          <MusicSelectDialog
            open={musicSelectOpen}
            onClose={() => setMusicSelectOpen(false)}
            onSelectTracks={handleMusicSelect}
            maxTracks={3}
          />
        </Box>
      </Box>
    </Paper>
  );
};


const MainPage = React.memo(() => {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [trendingBadges, setTrendingBadges] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState('all'); 
  const [requestId, setRequestId] = useState(0); 
  const isFirstRender = useRef(true); 
  const feedTypeChanged = useRef(false); 
  const navigate = useNavigate(); 
  const loadingMoreRef = useRef(false); 
  const loaderRef = useRef(null); 
  
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  const [latestUpdate, setLatestUpdate] = useState(null);
  
  useEffect(() => {
    const options = {
      root: null, 
      rootMargin: '0px',
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading && !loadingMoreRef.current && !feedTypeChanged.current) {
        loadMorePosts();
      }
    }, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, posts.length, feedType]);
  
  
  useEffect(() => {
    if (!isFirstRender.current) return; 
    
    const initialLoad = async () => {
      console.log("INITIAL MOUNT - ONE TIME LOAD");
      try {
        setLoading(true);
        setPosts([]);
        
        const params = {
          page: 1,
          per_page: 20,
          sort: feedType,
          include_all: feedType === 'all'
        };
        
        
        const currentRequestId = requestId + 1;
        setRequestId(currentRequestId);
        
        const response = await axios.get('/api/posts/feed', { params });
        
        
        if (requestId !== currentRequestId - 1) return;
        
        if (response.data && Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
          setHasMore(response.data.has_next === true);
          setPage(2);
        } else {
          setPosts([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading initial posts:', error);
        setPosts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        isFirstRender.current = false; 
      }
    };
    
    initialLoad();
    
    
  }, []);
  
  
  useEffect(() => {
    
    if (isFirstRender.current) return;
    
    
    feedTypeChanged.current = true;
    
    const loadFeedPosts = async () => {
      console.log(`FEED TYPE CHANGED TO: ${feedType} - LOADING NEW POSTS`);
      try {
        setLoading(true);
        setPosts([]);
        
        const params = {
          page: 1,
          per_page: 20,
          sort: feedType,
          include_all: feedType === 'all'
        };
        
        
        const currentRequestId = requestId + 1;
        setRequestId(currentRequestId);
        
        
        let response;
        try {
          response = await axios.get('/api/posts/feed', { params });
        } catch (apiError) {
          console.error(`Error in API call for ${feedType} feed:`, apiError);
          
          
          if (feedType === 'recommended') {
            
            setHasMore(false);
            setPosts([]);
            setLoading(false);
            feedTypeChanged.current = false;
            return;
          }
          
          
          throw apiError;
        }
        
        
        if (requestId !== currentRequestId - 1) return;
        
        if (response.data && Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
          setHasMore(response.data.has_next === true);
          setPage(2);
        } else {
          setPosts([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error(`Error loading ${feedType} posts:`, error);
        setPosts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        feedTypeChanged.current = false; 
      }
    };
    
    loadFeedPosts();
    
    
  }, [feedType]);
  
  
  useEffect(() => {
    
    if (!isFirstRender.current) return;
    
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        
        
        if (recommendations.length > 0) {
          setLoadingRecommendations(false);
          return;
        }
        
        
        try {
          const response = await axios.get('/api/users/recent-channels', { timeout: 5000 });
          if (Array.isArray(response.data)) {
            setRecommendations(response.data || []);
          } else {
            
            console.log('Unexpected response format:', response.data);
            setRecommendations([]);
          }
        } catch (error) {
          console.error('Error fetching recent channels:', error);
          
          setRecommendations([]);
        }
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
    
  }, []);


  
  const loadMorePosts = async () => {
    if (loading || !hasMore || feedTypeChanged.current || loadingMoreRef.current) return;
    
    try {
      loadingMoreRef.current = true;
      setLoading(true);
      
      const currentPage = page;
      
      const params = {
        page: currentPage,
        per_page: 10, 
        sort: feedType,
        include_all: feedType === 'all'
      };
      
      const currentRequestId = requestId + 1;
      setRequestId(currentRequestId);
      
      setPage(currentPage + 1);
      
      const response = await axios.get('/api/posts/feed', { params });
      
      if (requestId !== currentRequestId - 1) return;
      
      if (response.data && Array.isArray(response.data.posts)) {
        setPosts(prev => {
          const existingPostIds = new Set(prev.map(p => p.id));
          const newPosts = response.data.posts.filter(post => !existingPostIds.has(post.id));
          return [...prev, ...newPosts];
        });
        setHasMore(response.data.has_next === true && response.data.posts.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingMoreRef.current = false;
    }
  };
  
  const handlePostCreated = (newPost, deletedPostId = null) => {
    if (axios.cache) {
      axios.cache.clearPostsCache();
      axios.cache.clearByUrlPrefix('/api/posts/feed');
      axios.cache.clearByUrlPrefix('/api/profile/pinned_post');
    }
    
    if (deletedPostId) {
      setPosts(prevPosts => prevPosts.filter(p => p.id !== deletedPostId));
      return;
    }
    
    if (!newPost) {
      setPosts([]); 
      setPage(1); 
      
      const refreshFeed = async () => {
        try {
          setLoading(true);
          const params = {
            page: 1,
            per_page: 20,
            sort: feedType,
            include_all: feedType === 'all'
          };
          
          const currentRequestId = requestId + 1;
          setRequestId(currentRequestId);
          
          const response = await axios.get('/api/posts/feed', { 
            params,
            forceRefresh: true
          });
          
          if (requestId !== currentRequestId - 1) return;
          
          if (response.data && Array.isArray(response.data.posts)) {
            setPosts(response.data.posts);
            setHasMore(response.data.has_next === true);
            setPage(2);
          } else {
            setPosts([]);
            setHasMore(false);
          }
        } catch (error) {
          console.error(`Error refreshing ${feedType} posts:`, error);
          setPosts([]);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      };
      
      refreshFeed();
      return;
    }
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const handleFollow = async (userId, isFollowing) => {
    try {
      await axios.post('/api/profile/follow', { followed_id: userId });
    } catch (error) {
      console.error("Error following user:", error);
      setRecommendations(recommendations.map(rec => 
        rec.id === userId 
          ? { ...rec, isFollowing: !isFollowing } 
          : rec
      ));
    }
  };
  
  const handleOpenLightbox = (image, allImages, index) => {
    setCurrentImage(image);
    setLightboxImages(Array.isArray(allImages) ? allImages : [image]);
    setCurrentImageIndex(index || 0);
    setLightboxOpen(true);
  };
  
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % lightboxImages.length;
      setCurrentImage(lightboxImages[nextIndex]);
      return nextIndex;
    });
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + lightboxImages.length) % lightboxImages.length;
      setCurrentImage(lightboxImages[nextIndex]);
      return nextIndex;
    });
  };
  
  useEffect(() => {
    const update = UpdateService.getLatestUpdate();
    setLatestUpdate(update);
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ 
      mt: 2, 
      mb: 0,
      px: { xs: 0.5, sm: 0 },
      width: '100%',
      maxWidth: '100%',
      overflow: { xs: 'hidden', md: 'visible' },
      pb: { xs: '100px', sm: 0 }
    }}>
      <ContentContainer>
        <LeftColumn>
          <OnlineUsers />
          <CreatePost onPostCreated={handlePostCreated} />
          
          
          <Paper sx={{ 
            p: 1, 
            display: 'flex', 
            justifyContent: 'space-between',
            mb: 0,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Button 
              variant={feedType === 'all' ? 'contained' : 'text'} 
              onClick={() => setFeedType('all')}
              sx={{ flex: 1, mx: 0.5 }}
            >
              {t('main_page.feed.tabs.all')}
            </Button>
            <Button 
              variant={feedType === 'following' ? 'contained' : 'text'} 
              onClick={() => setFeedType('following')}
              sx={{ flex: 1, mx: 0.5 }}
            >
              {t('main_page.feed.tabs.following')}
            </Button>
            <Button 
              variant={feedType === 'recommended' ? 'contained' : 'text'} 
              onClick={() => setFeedType('recommended')}
              sx={{ flex: 1, mx: 0.5 }}
            >
              {t('main_page.feed.tabs.recommended')}
            </Button>
          </Paper>
          
          
          <Box sx={{ mt: 0 }}>
            {loading && posts.length === 0 ? (
              
              <>
                {[...Array(5)].map((_, index) => (
                  <PostSkeleton key={index} />
                ))}
              </>
            ) : posts.length > 0 ? (
              <Box sx={{ mt: 0 }}>
                {posts.map((post) => (
                  post.is_repost ? (
                    <RepostItem key={post.id} post={post} />
                  ) : (
                    <Post 
                      key={post.id} 
                      post={post} 
                      showPostDetails={false}
                      onOpenLightbox={handleOpenLightbox}
                    />
                  )
                ))}
                
                
                {hasMore && (
                  <Box 
                    ref={loaderRef}
                    sx={{ 
                      textAlign: 'center', 
                      py: 2, 
                      opacity: loading ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    {loading && (
                      <CircularProgress size={30} sx={{ color: 'primary.main' }} />
                    )}
                  </Box>
                )}
                
                
                {!hasMore && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 3,
                    opacity: 0.7
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('main_page.feed.end')}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                mt: 2
              }}>
                <Typography color="text.secondary">
                  {t('main_page.feed.empty')}
                </Typography>
              </Box>
            )}
          </Box>
        </LeftColumn>
        
        <RightColumn>
          
          <SupportBlock sx={{ display: { xs: 'none', sm: 'block' }, mb: '-5px' }}>
            <Box sx={{ p: 1.5, pt: 1.5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5,
                gap: 1
              }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.2), rgba(184, 169, 255, 0.15))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(208, 188, 255, 0.3)',
                  boxShadow: '0 2px 8px rgba(208, 188, 255, 0.15)'
                }}>
                  <FavoriteIcon sx={{ 
                    color: '#D0BCFF', 
                    fontSize: 20,
                    filter: 'drop-shadow(0 1px 2px rgba(208, 188, 255, 0.3))'
                  }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: '#D0BCFF',
                    fontSize: '1.1rem',
                    letterSpacing: '0.2px'
                  }}>
                    Поддержите проект
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    opacity: 0.8
                  }}>
                    Помогите развитию платформы
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                mb: 2,
                lineHeight: 1.5,
                fontSize: '0.85rem'
              }}>
                Ваша поддержка помогает нам создавать новые функции, улучшать производительность и развивать сообщество.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<StarIcon sx={{ fontSize: 16 }} />}
                  onClick={() => window.open('https://boosty.to/qsoul', '_blank')}
                  sx={{
                    flex: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    background: 'rgba(208, 188, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(208, 188, 255, 0.3)',
                    color: '#D0BCFF',
                    '&:hover': {
                      background: 'rgba(208, 188, 255, 0.25)',
                      borderColor: 'rgba(208, 188, 255, 0.5)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Подписаться
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FavoriteIcon sx={{ fontSize: 16 }} />}
                  onClick={() => window.open('https://boosty.to/qsoul', '_blank')}
                  sx={{
                    flex: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(208, 188, 255, 0.3)',
                    color: '#D0BCFF',
                    '&:hover': {
                      background: 'rgba(208, 188, 255, 0.1)',
                      borderColor: 'rgba(208, 188, 255, 0.5)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Донат
                </Button>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1.5,
                borderRadius: '8px',
                background: 'rgba(208, 188, 255, 0.05)',
                border: '1px solid rgba(208, 188, 255, 0.15)'
              }}>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50, #45A049)',
                  boxShadow: '0 0 6px rgba(76, 175, 80, 0.4)'
                }} />
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  fontWeight: 500
                }}>
                  Безопасные платежи через Boosty
                </Typography>
              </Box>
            </Box>
          </SupportBlock>
          
          <Box 
            component={Paper} 
            sx={{ 
              p: 0, 
              borderRadius: '12px', 
              mb: -0.625,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
              display: { xs: 'none', sm: 'block' } 
            }}
          >

            
            {loadingRecommendations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, px: 2 }}>
                <Box sx={{ 
                  width: '100%', 
                  height: 170,
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 }
                  }
                }}>
                  <Box sx={{ 
                    width: '100%', 
                    height: 50, 
                    borderRadius: '8px',
                    backgroundColor: '#292929',
                    mb: 1,
                    animation: 'pulse 2s infinite'
                  }} />
                  <Box sx={{ 
                    width: '100%', 
                    height: 50, 
                    borderRadius: '8px',
                    backgroundColor: '#292929',
                    mb: 1,
                    animation: 'pulse 2s infinite'
                  }} />
                  <Box sx={{ 
                    width: '100%', 
                    height: 50, 
                    borderRadius: '8px',
                    backgroundColor: '#292929',
                    animation: 'pulse 2s infinite'
                  }} />
                </Box>
              </Box>
            ) : recommendations.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 2,
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.03))'
              }}>
                <Avatar 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'rgba(208, 188, 255, 0.1)',
                    border: '1px solid rgba(208, 188, 255, 0.25)'
                  }}
                >
                  <PersonAddIcon sx={{ color: '#D0BCFF', fontSize: 26 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme => theme.palette.text.secondary }}>
                  {t('main_page.recommendations.empty.title')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, maxWidth: '80%', mx: 'auto', color: theme => theme.palette.text.disabled }}>
                  {t('main_page.recommendations.empty.description')}
                </Typography>
              </Box>
            ) : (
              <Box>
                {recommendations.map((channel, index) => (
                  <Box key={channel.id}>
                    <UserRecommendation user={channel} />
                    {index < recommendations.length - 1 && (
                      <Divider sx={{ opacity: 0.1, mx: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {latestUpdate && (
            <Box 
              sx={{ 
                mb: 2, 
                display: { xs: 'none', sm: 'block' },
                '&:hover': {
                  '& > *': { transform: 'translateY(-2px)' },
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate('/updates')}
            >
              <UpdateInfo 
                version={latestUpdate.version}
                date={latestUpdate.date}
                title={latestUpdate.title}
                updates={latestUpdate.updates}
                fixes={latestUpdate.fixes}
                hideHeader={true}
              />
            </Box>
          )}
        </RightColumn>
      </ContentContainer>
      
      
      <SimpleImageViewer 
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
        images={lightboxImages}
        initialIndex={currentImageIndex}
      />
    </Container>
  );
});

export default MainPage; 