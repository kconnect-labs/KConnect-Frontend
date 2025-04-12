import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Card,
  CardContent,
  styled,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { MusicContext } from '../../context/MusicContext';
import ReactMarkdown from 'react-markdown';
import { formatTimeAgo, getRussianWordForm } from '../../utils/dateUtils';
import LightBox from '../LightBox';
import VideoPlayer from '../VideoPlayer';
import { optimizeImage } from '../../utils/imageUtils';
import { linkRenderers, URL_REGEX, USERNAME_MENTION_REGEX, processTextWithLinks } from '../../utils/LinkUtils';

// Material UI Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import ImageGrid from './ImageGrid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Styled components
const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: 10,
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  background: '#1A1A1A',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    boxShadow: 'none',
    marginBottom: 2,
    width: '100%'
  }
}));

// Define the MarkdownContent component with height limits
const MarkdownContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isExpanded'
})(({ theme, isExpanded }) => ({
  '& p': {
    margin: theme.spacing(0.5, 0),
    lineHeight: 1.2,
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& ul, & ol': {
    marginLeft: theme.spacing(2),
  },
  '& code': {
    fontFamily: 'monospace',
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(0.3, 0.6),
    borderRadius: 3,
  },
  '& pre': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  maxHeight: isExpanded ? 'none' : '450px',
  overflow: isExpanded ? 'visible' : 'hidden',
  position: 'relative',
  transition: 'max-height 0.3s ease',
}));

// Show More button component
const ShowMoreButton = styled(Button)(({ theme }) => ({
  margin: '8px auto 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.8) 30%, rgba(26,26,26,1) 100%)',
  color: theme.palette.primary.main,
  borderRadius: '0 0 10px 10px',
  textTransform: 'none',
  fontWeight: 'normal',
  padding: '8px',
  width: '100%',
  position: 'absolute',
  bottom: 0,
  left: 0,
  '&:hover': {
    background: 'linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.9) 30%, rgba(26,26,26,1) 100%)',
  }
}));

// Custom styled action button
const ActionButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active, position }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: active ? 'rgba(140, 82, 255, 0.08)' : 'transparent',
  '&:hover': {
    backgroundColor: active ? 'rgba(140, 82, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
  },
  borderRadius: position === 'left' ? '20px 0 0 20px' : position === 'right' ? '0 20px 20px 0' : '20px',
  borderRight: position === 'left' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
}));

// Action button container for pill style
const ActionButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  marginRight: theme.spacing(1),
}));

// Music track component
const MusicTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1.5),
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  marginBottom: theme.spacing(0.3),
  border: '1px solid rgba(255, 255, 255, 0.07)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
  }
}));

const Post = ({ post, onDelete, onOpenLightbox }) => {
  // Защита от отсутствия данных
  if (!post || typeof post !== 'object') {
    console.error('Post component received invalid post data:', post);
    return null;
  }
  
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post?.user_liked || post?.is_liked || false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [viewsCount, setViewsCount] = useState(post?.views_count || 0);
  const { user: currentUser } = useContext(AuthContext);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(MusicContext);
  const isCurrentUserPost = currentUser && post?.user && currentUser.id === post.user.id;
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Ссылка скопирована в буфер обмена");
  const [lastLikedUsers, setLastLikedUsers] = useState([]);
  
  // State for music player
  const [musicTracks, setMusicTracks] = useState([]);
  
  // State for showing full content
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpandButton, setNeedsExpandButton] = useState(false);
  const contentRef = useRef(null);
  
  // Состояние для модального окна репоста
  const [repostModalOpen, setRepostModalOpen] = useState(false);
  const [repostText, setRepostText] = useState('');
  const [isReposting, setIsReposting] = useState(false);
  
  // State for the processed content with clickable @username mentions
  const [processedContent, setProcessedContent] = useState('');
  
  // Update state when post prop changes
  useEffect(() => {
    if (post) {
      setLiked(post.user_liked || post.is_liked || false);
      setLikesCount(post.likes_count || 0);
      setViewsCount(post.views_count || 0);
      
      // Reset expanded state when post changes
      setIsExpanded(false);
      
      // Process post content to make @username mentions clickable
      if (post.content) {
        // Replace @username with markdown links
        let content = post.content;
        // Reset the regex lastIndex to ensure it starts from the beginning
        USERNAME_MENTION_REGEX.lastIndex = 0;
        
        // Replace all @username mentions with markdown links
        content = content.replace(USERNAME_MENTION_REGEX, (match, username) => {
          return `[${match}](/profile/${username})`;
        });
        
        setProcessedContent(content);
      } else {
        setProcessedContent('');
      }
      
      // Проверка на лайки с использованием кэша
      if (post.id && post.likes_count > 0) {
        // Проверяем кэш перед запросом
        const postLikesCache = window._postLikesCache || {};
        const cachedData = postLikesCache[post.id];
        const now = Date.now();
        
        if (cachedData && cachedData.timestamp && (now - cachedData.timestamp < 5 * 60 * 1000)) {
          // Используем кэшированные данные
          console.log(`Using cached likes data for post ${post.id} (from useEffect)`);
          setLastLikedUsers(cachedData.users);
        } else {
          // Кэш отсутствует или устарел - делаем запрос
          fetchLastLikedUsers(post.id);
        }
      }
      
      // Parse music tracks if available
      try {
        if (post.music) {
          console.log('Processing music data:', post.music);
          let parsedTracks;
          
          if (typeof post.music === 'string') {
            try {
              parsedTracks = JSON.parse(post.music);
            } catch (parseError) {
              console.error('Failed to parse music JSON:', parseError);
              parsedTracks = [];
            }
          } else if (Array.isArray(post.music)) {
            parsedTracks = post.music;
          } else {
            parsedTracks = [];
          }
          
          console.log('Parsed music tracks:', parsedTracks);
          setMusicTracks(Array.isArray(parsedTracks) ? parsedTracks : []);
        } else {
          setMusicTracks([]);
        }
      } catch (musicError) {
        console.error('Error processing music data:', musicError);
        setMusicTracks([]);
      }
    }
  }, [post]);
  
  // Get cover path with fallback
  const getCoverPath = (track) => {
    if (!track || !track.cover_path) {
      return '/uploads/system/album_placeholder.jpg';
    }
    
    // If the path already includes /static/, use it directly as it might be a complete path
    if (track.cover_path.startsWith('/static/')) {
      return track.cover_path;
    }
    
    // Handle paths that don't start with slash
    if (track.cover_path.startsWith('static/')) {
      return `/${track.cover_path}`;
    }
    
    // Direct URL paths
    if (track.cover_path.startsWith('http')) {
      return track.cover_path;
    }
    
    // Legacy path format
    return `/static/music/${track.cover_path}`;
  };
  
  // Format track duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause for a specific track using the music context
  const handleTrackPlay = (track, event) => {
    if (event) event.stopPropagation(); // Prevent post click event
    
    // Check if this is the currently playing track
    const isCurrentlyPlaying = currentTrack && currentTrack.id === track.id;
    
    if (isCurrentlyPlaying) {
      // Toggle play/pause state
      togglePlay();
    } else {
      // Play the new track
      playTrack(track, 'post');
    }
  };
  
  // Check if content needs "Show more" button
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has updated
    const checkHeight = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setNeedsExpandButton(contentHeight > 450);
      }
    };
    
    // Allow time for React Markdown to render
    const timeoutId = setTimeout(() => {
      checkHeight();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [post?.content]);

  // Fetch last liked users
  const fetchLastLikedUsers = async (postId) => {
    try {
      // Абсолютный запрет частых запросов (не чаще чем раз в 3 секунды глобально)
      if (window._globalLastLikesFetch && Date.now() - window._globalLastLikesFetch < 3000) {
        console.log(`Global likes fetch rate limit in effect, skipping fetch for post ${postId}`);
        return;
      }
      
      // Создаем глобальный кэш лайков, если он еще не существует
      if (!window._postLikesCache) {
        window._postLikesCache = {};
      }
      
      // Проверяем, есть ли данные в кэше и не устарели ли они (кэш на 5 минут)
      const now = Date.now();
      if (
        window._postLikesCache[postId] && 
        window._postLikesCache[postId].timestamp &&
        now - window._postLikesCache[postId].timestamp < 5 * 60 * 1000
      ) {
        console.log(`Using cached likes data for post ${postId}`);
        setLastLikedUsers(window._postLikesCache[postId].users);
        return;
      }
      
      // Проверяем, не выполняется ли уже запрос для этого поста
      if (window._postLikesFetching && window._postLikesFetching[postId]) {
        console.log(`Likes fetch already in progress for post ${postId}`);
        return;
      }
      
      // Устанавливаем флаг запроса
      if (!window._postLikesFetching) {
        window._postLikesFetching = {};
      }
      window._postLikesFetching[postId] = true;
      window._globalLastLikesFetch = now; // Устанавливаем время последнего запроса глобально
      
      const response = await axios.get(`/api/posts/${postId}/likes?limit=3`);
      if (response.data && Array.isArray(response.data.users)) {
        console.log(`Received like data for post ${postId}:`, response.data.users);
        
        // Сохраняем данные в кэше
        window._postLikesCache[postId] = {
          users: response.data.users,
          timestamp: now
        };
        
        setLastLikedUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching liked users:', error);
    } finally {
      // Снимаем флаг запроса
      if (window._postLikesFetching) {
        window._postLikesFetching[postId] = false;
      }
    }
  };

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Process images for the post
  const processImages = () => {
    // If post has an images array, use it
    if (post?.images && Array.isArray(post.images) && post.images.length > 0) {
      return post.images;
    }
    
    // If post has a single image string that contains delimiters
    if (post?.image && typeof post.image === 'string') {
      if (post.image.includes('||') || post.image.includes(',')) {
        // Split by || or , and filter out empty strings
        return post.image.split(/[||,]/).map(url => url.trim()).filter(Boolean);
      }
      // Single image
      return [post.image];
    }
    
    return [];
  };
  
  // Check if post has a video
  const hasVideo = () => {
    return post?.video && typeof post.video === 'string' && post.video.trim() !== '';
  };
  
  // Format video URL
  const formatVideoUrl = (url) => {
    if (!url) return '';
    
    // If the URL is already absolute, return it as is
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    
    // Если URL уже содержит /static/uploads/post/, не добавляем этот путь снова
    if (url.startsWith('/static/uploads/post/')) {
      return url;
    }
    
    // For relative paths, add the proper base path
    return `/static/uploads/post/${post.id}/${url}`;
  };
  
  const images = processImages();
  const videoUrl = hasVideo() ? formatVideoUrl(post.video) : null;
  
  // Функция для открытия изображения через лайтбокс с WebP оптимизацией
  const handleOpenImage = async (index) => {
    const allImages = processImages();
    if (allImages.length > 0) {
      try {
        // Оптимизируем выбранное изображение перед показом
        const currentImageUrl = allImages[index];
        const optimizedImage = await optimizeImage(currentImageUrl, {
          quality: 0.9, // Высокое качество для просмотра
          maxWidth: 1920 // Ограничение максимальной ширины
        });
        
        setCurrentImageIndex(index);
        // Сохраняем исходное и оптимизированное изображение для лайтбокса
        setLightboxOpen(true);
      } catch (error) {
        console.error('Error optimizing image for lightbox:', error);
        // Запасной вариант если оптимизация не сработала
        setCurrentImageIndex(index);
        setLightboxOpen(true);
      }
    }
  };
  
  // Закрытие лайтбокса
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };
  
  // Переход к следующему изображению
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  // Переход к предыдущему изображению
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const handleLike = async (e) => {
    e.stopPropagation();
    
    // Сохраняем текущее состояние перед обновлением
    const wasLiked = liked;
    const prevCount = likesCount;
    
    try {
      // Сначала обновляем UI для моментальной реакции
      setLiked(!wasLiked);
      setLikesCount(wasLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
      
      // Затем делаем запрос к API
      const response = await axios.post(`/api/posts/${post.id}/like`);
      if (response.data) {
        // Обновляем UI данными с сервера
        setLiked(response.data.liked);
        setLikesCount(response.data.likes_count);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Откатываем изменения при ошибке
      setLiked(wasLiked);
      setLikesCount(prevCount);
    }
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = async () => {
    handleMenuClose();
    
    try {
      const response = await axios.delete(`/api/posts/${post.id}`);
      if (response.data && response.data.success) {
        if (onDelete) {
          onDelete(post.id);
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  const handleRepostClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      // Перенаправляем на логин если юзер не авторизован
      navigate('/login');
      return;
    }
    
    setRepostText('');
    setRepostModalOpen(true);
  };
  
  // Для диалога репоста
  const handleOpenRepostModal = (e) => {
    e.stopPropagation();
    setRepostModalOpen(true);
  };
  
  const handleCloseRepostModal = () => {
    setRepostModalOpen(false);
  };
  
  // Подсветка упоминаний в тексте репоста
  const renderRepostInputWithMentions = () => {
    // Пропускаем обработку если текст пустой
    if (!repostText) return null;
    
    // Ищем все @упоминания в тексте
    const parts = [];
    let lastIndex = 0;
    
    // Сбрасываем состояние регулярки
    USERNAME_MENTION_REGEX.lastIndex = 0;
    
    // Ищем все совпадения
    let match;
    while ((match = USERNAME_MENTION_REGEX.exec(repostText)) !== null) {
      // Добавляем текст до текущего совпадения
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{repostText.substring(lastIndex, match.index)}</span>);
      }
      
      // Добавляем подсвеченное упоминание
      parts.push(
        <span 
          key={`mention-${match.index}`}
          style={{ 
            color: '#7B68EE', 
            fontWeight: 'bold',
            background: 'rgba(123, 104, 238, 0.08)',
            padding: '0 4px',
            borderRadius: '4px'
          }}
        >
          {match[0]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Добавляем оставшийся текст после последнего совпадения
    if (lastIndex < repostText.length) {
      parts.push(<span key={`text-end`}>{repostText.substring(lastIndex)}</span>);
    }
    
    return (
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        padding: '16.5px 14px',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.95rem',
        pointerEvents: 'none', // Пропускаем клики до реального поля ввода
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start'
      }}>
        {parts}
      </Box>
    );
  };
  
  // Создание репоста
  const handleCreateRepost = async () => {
    // Блокируем повторную отправку
    if (isReposting) return;
    
    try {
      setIsReposting(true);
      
      const response = await axios.post(`/api/posts/${post.id}/repost`, {
        text: repostText
      });
      
      // Проверяем ответ
      if (response.data.success) {
        // Показываем уведомление об успехе
        setSnackbarMessage('Пост успешно добавлен в вашу ленту');
        setSnackbarOpen(true);
        
        // Закрываем модальное окно и сбрасываем форму
        setRepostModalOpen(false);
        setRepostText('');
      } else {
        // Показываем сообщение об ошибке
        setSnackbarMessage(response.data.error || 'Произошла ошибка при репосте');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error creating repost:', error);
      // Показываем сообщение об ошибке от сервера или общей ошибке
      setSnackbarMessage(
        error.response?.data?.error || 'Произошла ошибка при репосте'
      );
      setSnackbarOpen(true);
    } finally {
      setIsReposting(false);
    }}

  // Handle comment button click to navigate to post detail
  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };

  // Toggle expanded state
  const toggleExpanded = (e) => {
    e.stopPropagation(); // Prevent post click event
    setIsExpanded(!isExpanded);
  };

  // Make sure music tracks are received
  useEffect(() => {
    if (post && post.id) {
      console.log(`Post ${post.id} music data:`, post.music);
    }
  }, [post]);
  
  // Explicitly log when a post with music is rendered
  useEffect(() => {
    if (musicTracks.length > 0) {
      console.log(`Rendering post ${post.id} with ${musicTracks.length} music tracks:`, musicTracks);
    }
  }, [musicTracks, post.id]);

  // Add the getOptimizedImageUrl function
  const getOptimizedImageUrl = (url) => {
    if (!url) return '/static/uploads/avatar/system/avatar.png';
    
    // Если URL уже содержит параметр format=webp, не модифицируем
    if (url.includes('format=webp')) {
      return url;
    }
    
    // Проверяем поддержку WebP в браузере
    const supportsWebP = 'imageRendering' in document.documentElement.style;
    
    // Если браузер поддерживает WebP и URL указывает на наш сервер, добавляем параметр
    if (supportsWebP && (url.startsWith('/static/') || url.startsWith('/uploads/'))) {
      return `${url}${url.includes('?') ? '&' : '?'}format=webp`;
    }
    
    return url;
  };

  // Функция для увеличения счетчика просмотров при просмотре поста
  const incrementViewCount = async () => {
    // Проверяем, есть ли у поста ID, и что пост был открыт
    if (post && post.id) {
      try {
        // Защита от повторных вызовов на данной странице
        const viewKey = `post_viewed_${post.id}`;
        if (sessionStorage.getItem(viewKey)) {
          return;
        }

        // Устанавливаем флаг просмотра в sessionStorage чтобы избежать повторных запросов
        sessionStorage.setItem(viewKey, 'true');

        // Функция для выполнения запроса с повторными попытками
        const attemptViewCount = async (retries = 3) => {
          try {
            // Делаем запрос на увеличение счетчика просмотров
            const response = await axios.post(`/api/posts/${post.id}/view`);
            if (response.data && response.data.success) {
              // Обновляем счетчик просмотров в состоянии только если получили ответ
              setViewsCount(response.data.views_count);
            }
          } catch (error) {
            console.error(`Error incrementing view count (attempt ${4-retries}/3):`, error);
            // Повторяем попытку, если еще есть доступные попытки
            if (retries > 1) {
              setTimeout(() => attemptViewCount(retries - 1), 1000); // Пауза 1 секунда перед следующей попыткой
            }
          }
        };

        // Запускаем функцию с повторными попытками
        attemptViewCount();
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    }
  };

  // Используем Intersection Observer для отслеживания видимости поста
  const postRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Пост стал видимым в viewport, увеличиваем счетчик просмотров
          incrementViewCount();
          // Отключаем отслеживание этого поста после одного срабатывания
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 } // Пост должен быть виден как минимум на 50% для срабатывания
    );

    // Начинаем отслеживать пост
    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      // Очищаем observer при размонтировании компонента
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, [post?.id]); // Пересоздаем observer при изменении ID поста

  return (
    <React.Fragment>
      <PostCard 
        ref={postRef}
        sx={{ mb: 0.5 }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
          {/* Header with avatar and name */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={post.user ? getOptimizedImageUrl(post.user?.avatar_url || `/static/uploads/avatar/${post.user?.id}/${post.user?.photo}`) : '/static/uploads/avatar/system/avatar.png'} 
              alt={post.user?.name || 'User'}
              component={Link}
              to={`/profile/${post.user?.username || 'unknown'}`}
              onClick={(e) => e.stopPropagation()}
              sx={{ 
                width: 40, 
                height: 40,
                mr: 1.5,
                border: '2px solid #D0BCFF'
              }}
            />
            <Box sx={{ flex: 1 , whiteSpace: 'nowrap' }}>
              <Typography 
                variant="subtitle1"
                component={Link}
                to={`/profile/${post.user?.username}`}
                onClick={(e) => e.stopPropagation()}
                sx={{ 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: 'text.primary',
                  '&:hover': {
                    color: 'primary.main'
                  },
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {post.user?.name}
                {post.user?.verification && post.user?.verification.status > 0 && (
                  <CheckCircleIcon 
                    sx={{ 
                      color: post.user.verification.status === 1 ? '#9e9e9e' : 
                             post.user.verification.status === 2 ? '#d67270' : 
                             post.user.verification.status === 3 ? '#b39ddb' :
                             post.user.verification.status === 4 ? '#ff9800' : 
                             post.user.verification.status === 5 ? '#4caf50' :
                             'primary.main',
                      ml: 0.5,
                      width: 20,
                      height: 20
                    }} 
                  />
                )}
                {post.user?.achievement && (
                  <Box 
                    component="img" 
                    sx={{ 
                      width: 'auto', 
                      height: 20,  
                      ml: 0.5
                    }} 
                    src={`/static/images/bages/${post.user.achievement.image_path}`} 
                    alt={post.user.achievement.bage}
                    onError={(e) => {
                      console.error("Achievement badge failed to load:", e);
                      if (e.target && e.target instanceof HTMLImageElement) {
                        e.target.style.display = 'none';
                      }
                    }}
                  />
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                {formatTimeAgo(post.timestamp)}
              </Typography>
            </Box>
            
            {isCurrentUserPost && (
              <React.Fragment>
                <IconButton 
                  size="small"
                  aria-label="Действия с постом"
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0.5, 
                    bgcolor: 'rgba(255, 255, 255, 0.05)', 
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  onClick={(e) => e.stopPropagation()}
                  PaperProps={{
                    sx: {
                      bgcolor: '#1E1E1E',
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                      mt: 1
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleDelete} sx={{ color: '#f44336' }}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
                    </ListItemIcon>
                    <ListItemText primary="Удалить" />
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </Box>

          <Box sx={{ position: 'relative' }}>
            <MarkdownContent 
              ref={contentRef}
              isExpanded={isExpanded}
              sx={{ 
                mb: 2, 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {/* Process plain text content first, then pass to ReactMarkdown */}
              {processedContent && (
                <ReactMarkdown 
                  components={linkRenderers}
                  skipHtml={false}
                  transformLinkUri={null} // Don't transform or escape URIs
                  remarkPlugins={[]}
                  rehypePlugins={[]}
                >
                  {processedContent}
                </ReactMarkdown>
              )}
            </MarkdownContent>
            
            {needsExpandButton && !isExpanded && (
              <ShowMoreButton onClick={toggleExpanded}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Показать полностью
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" />
              </ShowMoreButton>
            )}
            
            {isExpanded && (
              <Button
                variant="text"
                size="small"
                onClick={toggleExpanded}
                startIcon={<KeyboardArrowUpIcon />}
                sx={{ 
                  display: 'flex',
                  mt: 1,
                  color: 'primary.main',
                  textTransform: 'none'
                }}
              >
                Свернуть
              </Button>
            )}
          </Box>
          
          {/* Post media - Video */}
          {videoUrl && (
            <Box sx={{ mb: 2 }}>
              <VideoPlayer 
                videoUrl={videoUrl} 
                poster={images.length > 0 ? formatVideoUrl(images[0]) : undefined}
              />
            </Box>
          )}
          
          {/* Post media - Images */}
          {images.length > 0 && (
            <Box sx={{ px: { xs: 1.5, sm: 2 }, mb: 2 }}>
              <ImageGrid 
                images={images} 
                onImageClick={(index) => handleOpenImage(index)}
              />
            </Box>
          )}
          
          {/* Post media - Music */}
          {musicTracks.length > 0 && (
            <Box sx={{ mt: 0, mb: 0 }}>
              {musicTracks.map((track, index) => (
                <MusicTrack key={`track-${index}`} onClick={(e) => handleTrackPlay(track, e)}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      position: 'relative',
                      mr: 2,
                      flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={getCoverPath(track)} 
                      alt={track.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
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
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {currentTrack && currentTrack.id === track.id && isPlaying ? (
                        <PauseIcon sx={{ color: 'white', fontSize: 18, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
                      ) : (
                        <PlayArrowIcon sx={{ color: 'white', fontSize: 18, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ 
                      fontWeight: currentTrack && currentTrack.id === track.id ? 'medium' : 'normal',
                      color: currentTrack && currentTrack.id === track.id ? 'primary.main' : 'text.primary',
                      fontSize: '0.85rem'
                    }}>
                      {track.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {track.artist}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    py: 0.4,
                    px: 1,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.7rem',
                    ml: 1
                  }}>
                    {formatDuration(track.duration)}
                  </Typography>
                </MusicTrack>
              ))}
            </Box>
          )}
          
          {/* Post actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, px: 1 }}>
            <ActionButtonContainer>
              {/* Like Button */}
              <ActionButton active={liked} onClick={handleLike} position="left">
                {liked ? (
                  <FavoriteIcon fontSize="small" color="primary" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                  {lastLikedUsers.length > 0 && (
                    <AvatarGroup 
                      max={3}
                      sx={{ 
                        mr: 0.5,
                        '& .MuiAvatar-root': { 
                          width: 18, 
                          height: 18, 
                          fontSize: '0.65rem',
                          border: '1px solid #1A1A1A'
                        } 
                      }}
                    >
                      {lastLikedUsers.map(user => {
                        // Правильно сформируем URL аватарки
                        let avatarUrl = user.avatar || user.photo || '';
                        
                        // Если URL не начинается с http или slash, добавляем путь
                        if (avatarUrl && !avatarUrl.startsWith('/') && !avatarUrl.startsWith('http')) {
                          avatarUrl = `/static/uploads/avatar/${user.id}/${avatarUrl}`;
                        }
                        
                        // Добавляем параметр webp для оптимизации если браузер поддерживает
                        if (avatarUrl && !avatarUrl.includes('format=webp') && 'imageRendering' in document.documentElement.style) {
                          // Добавляем параметр только если это URL нашего сервера
                          if (avatarUrl.startsWith('/static/')) {
                            avatarUrl = `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}format=webp`;
                          }
                        }
                        
                        return (
                          <Avatar 
                            key={user.id} 
                            src={avatarUrl}
                            alt={user.name}
                            sx={{ width: 18, height: 18 }}
                            onError={(e) => {
                              console.log(`Error loading avatar for user ${user.id}`);
                              e.target.onerror = null; // Предотвращаем рекурсию
                              e.target.src = `/static/uploads/avatar/system/avatar.png`;
                            }}
                          >
                            {user.name ? user.name[0] : '?'}
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>
                  )}
                  <Typography 
                    variant="body2" 
                    color={liked ? 'primary' : 'text.secondary'}
                  >
                    {likesCount > 0 ? likesCount : ''}
                  </Typography>
                </Box>
              </ActionButton>
              
              {/* Comment Button - Use handleCommentClick to navigate to post detail */}
              <ActionButton onClick={handleCommentClick} position="right">
                <ChatBubbleOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {post?.comments_count > 0 ? post.comments_count : ''}
                </Typography>
              </ActionButton>
            </ActionButtonContainer>
            
            {/* Views Counter */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                ml: 'auto', 
                color: 'text.secondary',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                padding: '3px 8px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
              title="Количество просмотров"
            >
              <VisibilityIcon sx={{ fontSize: '0.9rem', mr: 0.5, opacity: 0.7 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                {viewsCount}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </PostCard>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      
      {/* Модальное окно для репоста */}
      <Dialog
        open={repostModalOpen}
        onClose={handleCloseRepostModal}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(32, 32, 36, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '16px',
            border: '1px solid rgba(100, 90, 140, 0.1)',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '16px',
              background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.6), rgba(20, 20, 20, 0.75))',
              backdropFilter: 'blur(30px)',
              zIndex: -1
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(100, 90, 140, 0.1)',
          px: 3,
          py: 2,
          color: 'white',
          fontWeight: 500,
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          '&:before': {
            content: '""',
            display: 'inline-block',
            width: '18px',
            height: '18px',
            marginRight: '10px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237B68EE'%3E%3Cpath d='M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }
        }}>
          Поделиться постом
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              autoFocus
              multiline
              rows={3}
              fullWidth
              placeholder="Добавьте комментарий к репосту (необязательно)"
              value={repostText}
              onChange={(e) => setRepostText(e.target.value)}
              variant="outlined"
              helperText="Вы можете упомянуть пользователей с помощью @username"
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(100, 90, 140, 0.3)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7B68EE',
                    borderWidth: '1px'
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '0.95rem',
                    color: 'transparent',  // Make the actual input text transparent
                    caretColor: 'rgba(255, 255, 255, 0.9)'  // Keep the cursor visible
                  }
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.75rem',
                  marginTop: '4px'
                }
              }}
            />
            {renderRepostInputWithMentions()}
          </Box>
          
          {/* Предпросмотр оригинального поста */}
          <Box 
            sx={{ 
              p: 2.5, 
              border: '1px solid rgba(255, 255, 255, 0.09)', 
              borderRadius: '12px',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(5px)',
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(100, 90, 140, 0.02)',
                backdropFilter: 'blur(5px)',
                borderRadius: '12px',
                zIndex: 0
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              position: 'relative',
              zIndex: 1
            }}>
              <Avatar 
                src={post?.user?.avatar_url} 
                alt={post?.user?.name}
                sx={{ 
                  width: 35, 
                  height: 35, 
                  mr: 1.5,
                  border: '2px solid rgba(100, 90, 140, 0.4)'
                }}
              >
                {post?.user?.name ? post?.user?.name[0] : '?'}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ 
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.2
                }}>
                  {post?.user?.name}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.7rem',
                  display: 'block'
                }}>
                  {formatTimeAgo(post?.timestamp)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ 
              mb: 1, 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              color: 'rgba(255, 255, 255, 0.85)',
              position: 'relative',
              zIndex: 1,
              fontSize: '0.9rem',
              lineHeight: 1.5 
            }}>
              {post?.content}
            </Typography>
            {post?.image && (
              <Box 
                component="img" 
                src={post.image} 
                alt="Изображение поста"
                sx={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  mt: 1,
                  opacity: 0.9,
                  position: 'relative',
                  zIndex: 1
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 1.5, justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCloseRepostModal} 
            sx={{ 
              borderRadius: '10px', 
              color: 'rgba(255, 255, 255, 0.7)',
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleCreateRepost} 
            variant="contained" 
            disabled={isReposting}
            sx={{ 
              borderRadius: '10px',
              bgcolor: '#7B68EE',
              boxShadow: 'none',
              px: 3,
              '&:hover': {
                bgcolor: '#8778F0',
                boxShadow: 'none'
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(100, 90, 140, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
            endIcon={isReposting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Репостнуть
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Lightbox for displaying images */}
      {lightboxOpen && (
        <LightBox
          isOpen={lightboxOpen}
          onClose={handleCloseLightbox}
          imageSrc={images[currentImageIndex]}
          caption={post?.content}
          title={post?.user?.name}
          liked={liked}
          likesCount={likesCount}
          onLike={handleLike}
          onComment={handleCommentClick}
          onShare={handleRepostClick}
          onNext={images.length > 1 ? handleNextImage : undefined}
          onPrev={images.length > 1 ? handlePrevImage : undefined}
          totalImages={images.length}
          currentIndex={currentImageIndex}
        />
      )}
    </React.Fragment>
  );
};

export default Post; 