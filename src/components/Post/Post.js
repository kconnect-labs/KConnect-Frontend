import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Card,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,

  Alert,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,

  Chip,

  Tooltip,

  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { MusicContext } from '../../context/MusicContext';
import { useLanguage } from '../../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import { formatTimeAgo, getRussianWordForm } from '../../utils/dateUtils';
import SimpleImageViewer from '../SimpleImageViewer';
import VideoPlayer from '../VideoPlayer';
import { optimizeImage, handleImageError as safeImageError } from '../../utils/imageUtils';
import { linkRenderers, URL_REGEX, USERNAME_MENTION_REGEX, HASHTAG_REGEX, processTextWithLinks, LinkPreview } from '../../utils/LinkUtils';
import { Icon } from '@iconify/react';
import Lottie from 'lottie-react'; 
import { MessageCircle, Repeat2, Link2, Heart } from 'lucide-react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import ImageGrid from './ImageGrid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EditIcon from '@mui/icons-material/Edit';
import PhotoIcon from '@mui/icons-material/Photo';
import VideocamIcon from '@mui/icons-material/Videocam';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { usePostDetail } from '../../context/PostDetailContext';

import { ContextMenu, useContextMenu } from '../../UIKIT';
import RepostImageGrid from './RepostImageGrid';  
import MusicTrack from './MusicTrack';
import { VerificationBadge } from '../../UIKIT';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import FactModal from './FactModal';

const PostCard = styled(Card)(({ theme, isPinned, statusColor }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'box-shadow 0.3s ease-in-out',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: isPinned 
    ? `1px solid ${statusColor ? `${statusColor}33` : 'rgba(140, 82, 255, 0.2)'}` 
    : '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
}));

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
    lineHeight: 1,
  },
  '& li': {
    lineHeight: 1,
  },
  '& code': {
    fontFamily: 'monospace',
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(0, 0.6),
    borderRadius: 3,
    fontSize: '0.85rem',
  },
  '& pre': {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
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

const BlurredMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'linear-gradient(135deg, rgb(19 19 19 / 51%) 0%, rgb(25 24 24 / 39%) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    '& .MuiMenuItem-root': {
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    }
  }
}));

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

const ChannelTag = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  color: 'rgba(255, 255, 255, 0.8)',
  height: 24,
  borderRadius: 12,
  fontSize: '0.75rem',
  fontWeight: 500,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiChip-label': {
    padding: '0 8px',
  }
}));


const HeartAnimation = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  '& svg': {
    filter: 'drop-shadow(0 0 5px rgba(224, 187, 255, 0.7))',
    color: 'transparent',
    fill: 'url(#heartGradient)',
  },
  zIndex: 100,
  pointerEvents: 'none',
}));


const MediaErrorContainer = styled(Box)(({ theme }) => ({
  height: '220px',
  position: 'relative',
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: '24px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(327deg, rgb(206 188 255 / 77%) 0%, rgb(97 76 147) 100%)',
  backdropFilter: 'blur(20px)',
  boxShadow: 'inset 0 0 0 1px rgba(206, 188, 255, 0.2)',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: 'rgba(255, 255, 255, 0.9)',
}));

const LottieWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '150px', 
  height: '150px', 
  marginBottom: theme.spacing(1),
  opacity: 0.8,
}));




const Post = ({ post, onDelete, onOpenLightbox, isPinned: isPinnedPost, statusColor }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: currentUser } = useContext(AuthContext);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(MusicContext);
  const { setPostDetail, openPostDetail } = usePostDetail();
  const { show: showContextMenu } = useContextMenu();
  
  const [liked, setLiked] = useState(post?.user_liked || post?.is_liked || false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [viewsCount, setViewsCount] = useState(post?.views_count || 0);
  const [lastLikedUsers, setLastLikedUsers] = useState([]);
  const [clickTimer, setClickTimer] = useState(null); 
  const isCurrentUserPost = currentUser && post?.user && currentUser.id === post.user.id;
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [reposted, setReposted] = useState(post?.is_reposted || false);
  const [repostModalOpen, setRepostModalOpen] = useState(false);
  const [repostContent, setRepostContent] = useState('');
  const [repostLoading, setRepostLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(isPinnedPost || false);
  const [editDialog, setEditDialog] = useState({
    open: false,
    content: post?.content || '',
    loading: false,
    previews: [],
    deleteImages: false,
    deleteVideo: false,
    deleteMusic: false
  });
  
  const [musicTracks, setMusicTracks] = useState([]);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpandButton, setNeedsExpandButton] = useState(false);
  const contentRef = useRef(null);
  
  const [processedContent, setProcessedContent] = useState('');
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    deleting: false,
    deleted: false
  });
  
  const [reportDialog, setReportDialog] = useState({
    open: false,
    reason: '',
    submitting: false,
    submitted: false,
    error: null
  });
  const [mediaError, setMediaError] = useState({ type: null, url: null }); 
  
  const [showSensitive, setShowSensitive] = useState(false);
  
  const [factModal, setFactModal] = useState({
    open: false,
    loading: false,
    error: null
  });
  
  const reportReasons = [
    t('post.report.reasons.spam'),
    t('post.report.reasons.insult'),
    t('post.report.reasons.inappropriate_content'),
    t('post.report.reasons.violation'),
    t('post.report.reasons.misinformation'),
    t('post.report.reasons.harmful_content'),
    t('post.report.reasons.other')
  ];
  
  const isMobile = useMediaQuery('(max-width:600px)');
  
  useEffect(() => {
    if (post) {
      setLiked(post.user_liked || post.is_liked || false);
      setLikesCount(post.likes_count || 0);
      setViewsCount(post.views_count || 0);
      setReposted(post.is_reposted || false);
      
      setIsExpanded(false);
      
      setEditDialog(prev => ({
        ...prev,
        content: post.content || ''
      }));
      
      if (post.content) {
        let content = post.content;
        USERNAME_MENTION_REGEX.lastIndex = 0;
        HASHTAG_REGEX.lastIndex = 0;
        URL_REGEX.lastIndex = 0;
        
        // Обработка обычных ссылок
        content = content.replace(URL_REGEX, (match) => {
          return `[${match}](${match.startsWith('http') ? match : `https://${match}`})`;
        });

        // Обработка упоминаний пользователей
        content = content.replace(USERNAME_MENTION_REGEX, (match, prefix, username) => {
          const adjustedMatch = prefix ? match.substring(prefix.length) : match;
          return `${prefix || ''}[${adjustedMatch}](/profile/${username})`;
        });
        
        // Обработка хештегов
        content = content.replace(HASHTAG_REGEX, (match, hashtag) => {
          return `[${match}](https://k-connect.ru/search?q=${encodeURIComponent(hashtag)}&type=posts)`;
        });
        
        setProcessedContent(content);
      } else {
        setProcessedContent('');
      }
      
      if (post.id && post.likes_count > 0) {
        const postLikesCache = window._postLikesCache || {};
        const cachedData = postLikesCache[post.id];
        const now = Date.now();
        
        if (cachedData && cachedData.timestamp && (now - cachedData.timestamp < 5 * 60 * 1000)) {
          console.log(`Using cached likes data for post ${post.id} (from useEffect)`);
          setLastLikedUsers(cachedData.users);
        } else {
          fetchLastLikedUsers(post.id);
        }
      }
      
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
  
  const getCoverPath = (track) => {
    if (!track || !track.cover_path) {
      return '/uploads/system/album_placeholder.jpg';
    }
    
    if (track.cover_path.startsWith('/static/')) {
      return track.cover_path;
    }
    
    if (track.cover_path.startsWith('static/')) {
      return `/${track.cover_path}`;
    }
    
    if (track.cover_path.startsWith('http')) {
      return track.cover_path;
    }
    
    return `/static/music/${track.cover_path}`;
  };
  
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  
  const truncateText = (text, maxLength = 500) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  const handleTrackPlay = (track, event) => {
    if (event) event.stopPropagation(); 
    
    const isCurrentlyPlaying = currentTrack && currentTrack.id === track.id;
    
    if (isCurrentlyPlaying) {
      togglePlay();
    } else {
      
      playTrack(track, 'post');
    }
  };
  
  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setNeedsExpandButton(contentHeight > 450);
      }
    };
    
    const timeoutId = setTimeout(() => {
      checkHeight();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [post?.content]);

  const fetchLastLikedUsers = async (postId) => {
    try {
      const response = await axios.get(`/api/posts/${postId}/likes`, {
        params: { limit: 3 },
        forceRefresh: true
      });
      
      if (response.data && Array.isArray(response.data.users)) {
        setLastLikedUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching last liked users:', error);
    }
  };

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const processImages = () => {
    if (mediaError.type === 'image') {
      return []; 
    }
    
    if (post?.images && Array.isArray(post.images) && post.images.length > 0) {
      return post.images;
    }
    
    if (post?.image && typeof post.image === 'string') {
      if (post.image.includes('||') || post.image.includes(',')) {
        return post.image.split(/[||,]/).map(url => url.trim()).filter(Boolean);
      }
      return [post.image];
    }
    
    return [];
  };
  
  const hasVideo = () => {
    return post?.video && typeof post.video === 'string' && post.video.trim() !== '';
  };
  
  const formatVideoUrl = (url) => {
    if (!url) return '';
    
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    
    if (url.startsWith('/static/uploads/post/')) {
      return url;
    }
    
    return `/static/uploads/post/${post.id}/${url}`;
  };
  
  const images = processImages();
  const videoUrl = hasVideo() ? formatVideoUrl(post.video) : null;
  
  const handleOpenImage = async (index) => {
    
    if (window.event) {
      window.event.stopPropagation();
    }

    
    if (onOpenLightbox && typeof onOpenLightbox === 'function') {
      const allImages = processImages();
      if (allImages.length > 0) {
        onOpenLightbox(allImages[index], allImages, index);
      }
      return;
    }
    
    
    const allImages = processImages();
    if (allImages.length > 0) {
      try {
        const currentImageUrl = allImages[index];
        setCurrentImageIndex(index);
        setLightboxOpen(true);
      } catch (error) {
        console.error('Error opening lightbox:', error);
        setCurrentImageIndex(index);
        setLightboxOpen(true);
      }
    }
  };
  
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const handleLike = async (e) => {
    if (e) e.stopPropagation();
    
    const wasLiked = liked;
    const prevCount = likesCount;
    
    try {
      setLiked(!wasLiked);
      setLikesCount(wasLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
      
      const response = await axios.post(`/api/posts/${post.id}/like`);
      if (response.data) {
        setLiked(response.data.liked);
        setLikesCount(response.data.likes_count);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setLiked(wasLiked);
      setLikesCount(prevCount);
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = error.response.data.error || "Слишком много лайков. ";
        
        if (rateLimit && rateLimit.reset) {
          const resetTime = new Date(rateLimit.reset * 1000);
          const now = new Date();
          const diffSeconds = Math.round((resetTime - now) / 1000);
          
          if (!errorMessage.includes("подождите")) {
            if (diffSeconds > 60) {
              const minutes = Math.floor(diffSeconds / 60);
              const seconds = diffSeconds % 60;
              errorMessage += ` Пожалуйста, подождите ${minutes} мин. ${seconds} сек.`;
            } else {
              errorMessage += ` Пожалуйста, подождите ${diffSeconds} сек.`;
            }
          }
        }
        
        
        window.dispatchEvent(new CustomEvent('rate-limit-error', { 
          detail: { 
            message: errorMessage,
            shortMessage: "Лимит лайков",
            notificationType: "warning",
            animationType: "bounce", 
            retryAfter: rateLimit?.reset ? Math.round((new Date(rateLimit.reset * 1000) - new Date()) / 1000) : 60
          } 
        }));
      }
    }
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialog({ ...deleteDialog, open: true });
  };

  const handleEdit = () => {
    handleMenuClose();
    if (!isPostEditable()) {
      setSnackbar({
        open: true,
        message: "Редактирование доступно только в течение 3 часов после публикации",
        severity: 'warning'
      });
      return;
    }
    
    setEditDialog({
      ...editDialog,
      open: true,
      content: post.content || '',
      deleteImages: false,
      deleteVideo: false,
      deleteMusic: false,
      newImages: [],
      newVideo: null,
      previews: [],
      error: null
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      ...editDialog,
      open: false,
      error: null,
      previews: []
    });
  };

  const handleEditContentChange = (e) => {
    setEditDialog({
      ...editDialog,
      content: e.target.value
    });
  };

  const handleEditImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const fileObjects = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setEditDialog({
      ...editDialog,
      newImages: [...editDialog.newImages, ...files],
      previews: [...editDialog.previews, ...fileObjects.map(fo => fo.preview)]
    });
  };

  const handleEditVideoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setEditDialog({
        ...editDialog,
        newVideo: file
      });
    }
  };

  const handleToggleDeleteImages = () => {
    setEditDialog({
      ...editDialog,
      deleteImages: !editDialog.deleteImages
    });
  };

  const handleToggleDeleteVideo = () => {
    setEditDialog({
      ...editDialog,
      deleteVideo: !editDialog.deleteVideo
    });
  };

  const handleToggleDeleteMusic = () => {
    setEditDialog({
      ...editDialog,
      deleteMusic: !editDialog.deleteMusic
    });
  };

  const handleSubmitEdit = async () => {
    try {
      if (!isPostEditable()) {
        setEditDialog({ 
          ...editDialog, 
          error: "Время редактирования истекло. Посты можно редактировать только в течение 3 часов после публикации." 
        });
        return;
      }

      setEditDialog({ ...editDialog, submitting: true, error: null });
      
      const formData = new FormData();
      formData.append('content', editDialog.content);
      
      formData.append('delete_images', editDialog.deleteImages);
      formData.append('delete_video', editDialog.deleteVideo);
      formData.append('delete_music', editDialog.deleteMusic);
      
      editDialog.newImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      
      if (editDialog.newVideo) {
        formData.append('video', editDialog.newVideo);
      }
      
      const response = await axios.post(`/api/posts/${post.id}/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const updatedPost = response.data.post;
        
        if (onDelete) {
          onDelete(post.id, updatedPost);
        } else {
          window.location.reload();
        }
        
        setEditDialog({
          open: false,
          content: '',
          submitting: false,
          deleteImages: false,
          deleteVideo: false,
          deleteMusic: false,
          newImages: [],
          newVideo: null,
          previews: [],
          error: null
        });
        
        setSnackbar({
          open: true,
          message: "Пост успешно обновлен",
          severity: 'success'
        });
      } else {
        throw new Error(response.data.error || 'Ошибка при обновлении поста');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setEditDialog({
        ...editDialog,
        submitting: false,
        error: error.response?.data?.error || error.message || 'Ошибка при обновлении поста'
      });
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteDialog({ ...deleteDialog, deleting: true });
      
      // Сразу удаляем пост из UI
      if (onDelete) {
        onDelete(post.id);
      }
      
      // Очищаем кеш
      if (axios.cache) {
        axios.cache.clearPostsCache();
        axios.cache.clearByUrlPrefix(`/api/profile/pinned_post`);
        axios.cache.clearByUrlPrefix(`/api/posts/${post.id}`);
      }
      
      // Отправляем запрос на удаление
      await axios.delete(`/api/posts/${post.id}`);
      
      // Закрываем диалог
      setDeleteDialog({ open: false, deleting: false, deleted: false });
      
    } catch (error) {
      console.error('Error deleting post:', error);
      setDeleteDialog({ open: false, deleting: false, deleted: false });
      
      // Показываем ошибку
      setSnackbar({
        open: true,
        message: "Не удалось удалить пост. Попробуйте позже.",
        severity: 'error'
      });
    }
  };
  
  const handleRepostClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setRepostContent('');
    setRepostModalOpen(true);
  };
  
  
  const handleOpenRepostModal = (e) => {
    e.stopPropagation();
    setRepostModalOpen(true);
  };
  
  const handleCloseRepostModal = () => {
    setRepostModalOpen(false);
  };
  
  
  const renderRepostInputWithMentions = () => {
    if (!repostContent) return null;
    
    const parts = [];
    let lastIndex = 0;
    
    USERNAME_MENTION_REGEX.lastIndex = 0;
    
    let match;
    while ((match = USERNAME_MENTION_REGEX.exec(repostContent)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{repostContent.substring(lastIndex, match.index)}</span>);
      }
      
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
    
    if (lastIndex < repostContent.length) {
      parts.push(<span key={`text-end`}>{repostContent.substring(lastIndex)}</span>);
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
        pointerEvents: 'none', 
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start'
      }}>
        {parts}
      </Box>
    );
  };

  
  const handleCreateRepost = async () => {
    
    if (repostLoading) return;
    
    try {
      setRepostLoading(true);
      
      const response = await axios.post(`/api/posts/${post.id}/repost`, {
        text: repostContent
      });
      
      
      if (response.data.success) {
        
        setRepostModalOpen(false);
        setReposted(true);
        
        
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { 
            message: 'Пост успешно добавлен в вашу ленту',
            shortMessage: "Репост создан",
            notificationType: "success",
            animationType: "pill"
          } 
        }));
        
        if (onDelete) {
          onDelete(post.id, null, 'repost');
        }
      } else {
        
        setSnackbarMessage(response.data.error || 'Произошла ошибка при репосте');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error creating repost:', error);
      
      setSnackbarMessage(
        error.response?.data?.error || 'Произошла ошибка при репосте'
      );
      setSnackbarOpen(true);
    } finally {
      setRepostLoading(false);
    }}

  
  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Comment button clicked, opening overlay for post ID:", post.id);
    openPostDetail(post.id, e);
  };
  
  
  const handleShare = (e) => {
    e.stopPropagation();
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { 
            message: "Ссылка скопирована в буфер обмена",
            shortMessage: "Ссылка скопирована",
            notificationType: "success",
            animationType: "pill"
          } 
        }));
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { 
            message: "Не удалось скопировать ссылку",
            shortMessage: "Ошибка",
            notificationType: "error",
            animationType: "pill"
          } 
        }));
      });
  };

  
  const handleCopyLink = () => {
    try {
      const linkToCopy = `https://k-connect.ru/post/${post.id}`;
      navigator.clipboard.writeText(linkToCopy);
      
      
      window.dispatchEvent(new CustomEvent('show-error', { 
        detail: { 
          message: "Ссылка скопирована в буфер обмена",
          shortMessage: "Ссылка скопирована",
          notificationType: "success",
          animationType: "pill"
        } 
      }));
      
    } catch (error) {
      console.error('Ошибка при копировании ссылки:', error);
      
      
      window.dispatchEvent(new CustomEvent('show-error', { 
        detail: { 
          message: "Не удалось скопировать ссылку",
          shortMessage: "Ошибка копирования",
          notificationType: "error",
          animationType: "pill"
        } 
      }));
    }
  };

  
  const handleOpenPostFromMenu = () => {
    console.log("Opening post comments from context menu, ID:", post.id);
    
    
    setPostDetail(post.id);
  };

  
  const toggleExpanded = (e) => {
    e.stopPropagation(); 
    setIsExpanded(!isExpanded);
  };

  
  useEffect(() => {
    if (post && post.id) {
      console.log(`Post ${post.id} music data:`, post.music);
    }
  }, [post]);
  
  
  useEffect(() => {
    if (musicTracks.length > 0) {
      console.log(`Rendering post ${post.id} with ${musicTracks.length} music tracks:`, musicTracks);
    }
  }, [musicTracks, post.id]);

  
  const getOptimizedImageUrl = (url) => {
    if (!url) return '/static/uploads/avatar/system/avatar.png';
    
    
    if (url.includes('format=webp')) {
      return url;
    }
    
    
    const supportsWebP = 'imageRendering' in document.documentElement.style;
    
    
    if (supportsWebP && (url.startsWith('/static/') || url.startsWith('/uploads/'))) {
      return `${url}${url.includes('?') ? '&' : '?'}format=webp`;
    }
    
    return url;
  };

  
  const isPostEditable = () => {
    if (!post?.timestamp) return false;
    
    const postTime = new Date(post.timestamp);
    const currentTime = new Date();
    const timeDifference = (currentTime - postTime) / (1000 * 60 * 60); 
    
    return timeDifference <= 3;
  };

  
  const incrementViewCount = async () => {
    
    if (post && post.id) {
      try {
        
        const viewKey = `post_viewed_${post.id}`;
        if (sessionStorage.getItem(viewKey)) {
          console.log(`Post ${post.id} already viewed in this session`);
          return;
        }

        
        sessionStorage.setItem(viewKey, 'true');
        console.log(`Setting view flag for post ${post.id}`);

        
        const attemptViewCount = async (retries = 3) => {
          try {
            
            console.log(`Incrementing view count for post ${post.id}`);
            const response = await axios.post(`/api/posts/${post.id}/view`);
            if (response.data && response.data.success) {
              
              console.log(`View count updated for post ${post.id} to ${response.data.views_count}`);
              setViewsCount(response.data.views_count);
            }
          } catch (error) {
            console.error(`Error incrementing view count (attempt ${4-retries}/3):`, error);
            
            if (retries > 1) {
              setTimeout(() => attemptViewCount(retries - 1), 1000); 
            }
          }
        };

        
        attemptViewCount();
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    }
  };

  
  const postRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          console.log(`Post ${post.id} is more than 50% visible, triggering view count`);
          
          incrementViewCount();
          
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 } 
    );

    
    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, [post?.id]); 

  
  const handleReportSubmit = async () => {
    if (!reportDialog.reason) {
      setReportDialog({...reportDialog, error: t('post.report_dialog.select_reason')});
      return;
    }
    
    setReportDialog({...reportDialog, submitting: true, error: null});
    
    try {
      
      const reportMessage = `🚨 *ЖАЛОБА НА ПОСТ*\n\n` +
        `📝 *ID поста*: ${post.id}\n` +
        `👤 *Автор*: ${post.user?.name} (@${post.user?.username})\n` +
        `🚩 *Причина*: ${reportDialog.reason}\n` +
        `👮 *Отправитель*: ${currentUser?.name} (@${currentUser?.username})\n` +
        `⏰ *Время*: ${new Date().toLocaleString()}` +
        (post.content ? `\n\n📄 *Текст поста*:\n${post.content?.substring(0, 300)}${post.content?.length > 300 ? '...' : ''}` : `\n\n📄 *Пост содержит медиа-контент без текста*`);
      
      
      const response = await axios.post('/api/report/send-to-telegram', {
        message: reportMessage,
        post_id: post.id,
        reason: reportDialog.reason,
        post_author: post.user?.username,
        reporter: currentUser?.username
      });
      
      if (response.data && response.data.success) {
        setReportDialog({...reportDialog, submitting: false, submitted: true});
        
        setTimeout(() => {
          setReportDialog({open: false, reason: '', submitting: false, submitted: false, error: null});
        }, 2000);
      } else {
        throw new Error(response.data?.error || t('post.report_dialog.error'));
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setReportDialog({
        ...reportDialog, 
        submitting: false, 
        error: error.response?.data?.error || t('post.report_dialog.error')
      });
    }
  };
  
  
  const handleReportClick = () => {
    handleMenuClose();
    setReportDialog({...reportDialog, open: true});
  };

  const handleFactsClick = () => {
    handleMenuClose();
    setFactModal({ ...factModal, open: true });
  };

  const handleFactModalClose = () => {
    setFactModal({ open: false, loading: false, error: null });
  };

  const handleFactSubmit = async (factData) => {
    setFactModal({ ...factModal, loading: true, error: null });
    
    try {
      if (post.fact) {
        // Обновляем существующий факт
        await axios.put(`/api/facts/${post.fact.id}`, factData);
      } else {
        // Создаем новый факт и привязываем к посту
        const factResponse = await axios.post('/api/facts', factData);
        const factId = factResponse.data.fact.id;
        await axios.post(`/api/posts/${post.id}/attach-fact`, { fact_id: factId });
      }
      
      // Перезагружаем страницу для обновления данных
      window.location.reload();
    } catch (error) {
      console.error('Error submitting fact:', error);
      setFactModal({ 
        ...factModal, 
        loading: false, 
        error: error.response?.data?.error || 'Ошибка при сохранении факта' 
      });
    }
  };

  const handleFactDelete = async () => {
    setFactModal({ ...factModal, loading: true, error: null });
    
    try {
      // Отвязываем факт от поста
      await axios.delete(`/api/posts/${post.id}/detach-fact`);
      
      // Перезагружаем страницу для обновления данных
      window.location.reload();
    } catch (error) {
      console.error('Error deleting fact:', error);
      setFactModal({ 
        ...factModal, 
        loading: false, 
        error: error.response?.data?.error || 'Ошибка при удалении факта' 
      });
    }
  };

  const handlePostClick = (e) => {
    if (e.target.closest('a, button')) return; 
    incrementViewCount();
  };
  
  const { contextMenuState, handleContextMenu, closeContextMenu } = useContextMenu();
  
  const handlePostContextMenu = (e) => {
    
    e.stopPropagation();
    
    
    handleContextMenu(e, { postId: post.id });
  };
  
  
  const getContextMenuItems = () => {
    const items = [];
    
    items.push({
      id: 'share',
      label: t('post.context_menu.copy_link'),
      icon: <Link2 size={16} />,
      onClick: handleCopyLink 
    });
    
    items.push({
      id: 'comment',
      label: t('post.context_menu.comment'),
      icon: <MessageCircle size={16} />,
      onClick: handleOpenPostFromMenu 
    });
    
    // Добавляем кнопку "Факты" для пользователя с ID 3
    if (currentUser && currentUser.id === 3) {
      items.push({
        id: 'facts',
        label: 'Факты',
        icon: <FactCheckIcon fontSize="small" />,
        onClick: handleFactsClick
      });
    }
    
    if (isCurrentUserPost) {
      if (isPostEditable()) {
        items.push({
          id: 'edit',
          label: t('post.context_menu.edit'),
          icon: <EditIcon fontSize="small" />,
          onClick: () => handleEdit()
        });
      }
      
      items.push({
        id: 'delete',
        label: t('post.context_menu.delete'),
        icon: <DeleteIcon fontSize="small" />,
        onClick: () => handleDelete()
      });
    } else {
      items.push({
        id: 'report',
        label: t('post.context_menu.report'),
        icon: <FlagIcon fontSize="small" />,
        onClick: () => handleReportClick()
      });
    }
    
    return items;
  };
  
  
  const [hearts, setHearts] = useState([]);
  
  
  const [lastTap, setLastTap] = useState({ time: 0, x: 0, y: 0 });
  
  
  const getRandomRotation = () => {
    const possibleAngles = [
      -60, -50, -45, -40, -35, 
      35, 40, 45, 50, 60
    ];
    
    return possibleAngles[Math.floor(Math.random() * possibleAngles.length)];
  };
  
  
  const getRandomSize = () => {
    return Math.floor(Math.random() * 40) + 60;
  };
  
  
  const addHeart = (x, y) => {
    const newHeart = {
      id: Date.now() + Math.random(),
      x,
      y,
      rotation: getRandomRotation(),
      size: getRandomSize()
    };
    
    setHearts(prevHearts => [...prevHearts, newHeart]);
    
    setTimeout(() => {
      setHearts(prevHearts => prevHearts.filter(heart => heart.id !== newHeart.id));
    }, 1000);
  };
  
  
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    
    
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
    }
    
    if (
      e.target.closest('[data-no-navigate]') ||
      e.target.closest('.MuiMenu-root') ||
      e.target.closest('.MuiMenuItem-root') ||
      e.target.closest('.MuiDialog-root') ||
      e.target.closest('.post-action-button') ||
      e.target.closest('.lightbox-trigger') ||
      e.target.closest('a') ||
      e.target.closest('button')
    ) {
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addHeart(x, y);
    
    if (!liked) {
      handleLike(e);
    }
  };

  
  const handleTouchStart = (e) => {
    if (
      e.target.closest('[data-no-navigate]') ||
      e.target.closest('.MuiMenu-root') ||
      e.target.closest('.MuiMenuItem-root') ||
      e.target.closest('.MuiDialog-root') ||
      e.target.closest('.post-action-button') ||
      e.target.closest('.lightbox-trigger') ||
      e.target.closest('a') ||
      e.target.closest('button')
    ) {
      return;
    }
    
    const touch = e.touches[0];
    const now = new Date().getTime();
    const timeDiff = now - lastTap.time;
    
    if (timeDiff < 300) {
      
      if (clickTimer) {
        clearTimeout(clickTimer);
        setClickTimer(null);
      }
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const xDiff = Math.abs(x - lastTap.x);
      const yDiff = Math.abs(y - lastTap.y);
      
      if (xDiff < 30 && yDiff < 30) {
        e.preventDefault();
        
        addHeart(x, y);
        
        if (!liked) {
          handleLike();
        }
      }
    }
    
    setLastTap({
      time: now,
      x: touch.clientX - e.currentTarget.getBoundingClientRect().left,
      y: touch.clientY - e.currentTarget.getBoundingClientRect().top
    });
  };
  
  
  const handleClick = (e) => {
    if (hearts.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      addHeart(x, y);
    }
  };
  
  
  
  const handleImageError = (url) => {
    console.log('Ошибка загрузки изображения:', url);
    setMediaError({ type: 'image', url });
  };

  
  const handleVideoError = (url) => {
    console.log('Ошибка загрузки видео:', url);
    setMediaError({ type: 'video', url });
  };

  
  const MediaErrorDisplay = ({ type }) => {
    const [spiderAnimation, setSpiderAnimation] = useState(null);
    
    useEffect(() => {
      
      const loadSpiderAnimation = async () => {
        try {
          const response = await fetch('https://k-connect.ru/static/json/error/spider.json');
          const animationData = await response.json();
          setSpiderAnimation(animationData);
        } catch (error) {
          console.error(t('post.media_error.animation_load_error'), error);
        }
      };
      
      loadSpiderAnimation();
    }, []);
    
    return (
      <MediaErrorContainer>
        {spiderAnimation && (
          <LottieWrapper>
            <Lottie 
              animationData={spiderAnimation} 
              loop 
              autoplay
            />
          </LottieWrapper>
        )}
        <Typography variant="h6" gutterBottom>
          {type === 'image' ? t('post.media_error.image_load_error') : t('post.media_error.video_load_error')}
        </Typography>
        <Typography variant="body2">
          {type === 'image' 
            ? t('post.media_error.image_deleted')
            : t('post.media_error.video_format')}
        </Typography>
      </MediaErrorContainer>
    );
  };
  
  // Add pin post handler
  const handlePinPost = async () => {
    try {
      if (isPinned) {
        await axios.post('/api/profile/unpin_post', {}, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        setIsPinned(false);
        window.dispatchEvent(new CustomEvent('show-error', {
          detail: {
            message: t('post.pin.unpinned'),
            shortMessage: t('post.pin.unpinned_short'),
            notificationType: 'info',
            animationType: 'pill'
          }
        }));
        window.dispatchEvent(new CustomEvent('post-pinned-state-changed', {
          detail: { postId: post.id, isPinned: false }
        }));
      } else {
        await axios.post(`/api/profile/pin_post/${post.id}`, {}, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        setIsPinned(true);
        window.dispatchEvent(new CustomEvent('show-error', {
          detail: {
            message: t('post.pin.pinned'),
            shortMessage: t('post.pin.pinned_short'),
            notificationType: 'success',
            animationType: 'pill'
          }
        }));
        window.dispatchEvent(new CustomEvent('post-pinned-state-changed', {
          detail: { postId: post.id, isPinned: true }
        }));
      }
    } catch (error) {
      console.error(t('post.pin.pin_error'), error);
      window.dispatchEvent(new CustomEvent('show-error', {
        detail: {
          message: t('post.pin.error'),
          shortMessage: t('post.pin.error_short'),
          notificationType: 'error'
        }
      }));
    }
  };

  const markdownComponents = {
    ...linkRenderers,
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            backgroundColor: 'transparent'
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  // NSFW Overlay (монотонный стиль)
  const NSFWOverlay = (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 2 : 4,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: isMobile ? 1 : 2 }}>
        <ShieldOutlinedIcon sx={{ fontSize: isMobile ? 48 : 72, color: '#bdbdbd' }} />
        <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -54%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: isMobile ? 8 : 14,
            letterSpacing: 0.5,
            userSelect: 'none',
            pointerEvents: 'none',
            textShadow: '0 1px 2px rgba(0,0,0,0.18)'
          }}
        >
          18+
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: isMobile ? 1 : 2, color: '#fff', fontSize: isMobile ? '1rem' : '1.25rem' }}>
        Деликатный контент
      </Typography>
      <Button
        variant="contained"
        disableElevation
        sx={{
          borderRadius: '8px',
          fontWeight: 500,
          mb: isMobile ? 1 : 2,
          background: '#5c5b5e',
          color: '#fff',
          boxShadow: 'none',
          fontSize: isMobile ? '0.75rem' : '0.85rem',
          px: isMobile ? 0.5 : 1,
          py: isMobile ? 0.25 : 0.5,
        }}
        onClick={() => setShowSensitive(true)}
      >
        Посмотреть
      </Button>
      <Typography variant="caption" sx={{ color: '#bdbdbd', opacity: 0.7, mt: isMobile ? 1 : 2, fontSize: isMobile ? '0.75rem' : '0.9rem', wordBreak: 'break-word', maxWidth: '100%' }}>
        Тут может быть шокирующий контент
      </Typography>
    </Box>
  );

  // Добавляем эффект для hover-появления аватарок
  useEffect(() => {
    const likeBox = document.querySelectorAll('.like-avatars');
    const parentBox = document.querySelectorAll('[data-like-parent]');
    parentBox.forEach((el, idx) => {
      el.onmouseenter = () => {
        if (likeBox[idx]) {
          likeBox[idx].style.opacity = 1;
          likeBox[idx].style.pointerEvents = 'auto';
          likeBox[idx].style.transform = 'translateY(-50%) translateX(8px)';
        }
      };
      el.onmouseleave = () => {
        if (likeBox[idx]) {
          likeBox[idx].style.opacity = 0;
          likeBox[idx].style.pointerEvents = 'none';
          likeBox[idx].style.transform = 'translateY(-50%)';
        }
      };
    });
    return () => {
      parentBox.forEach((el, idx) => {
        el.onmouseenter = null;
        el.onmouseleave = null;
      });
    };
  }, [lastLikedUsers, isMobile]);

  const FactCard = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      backgroundColor: '#FFA726',
      borderRadius: '2px 0 0 2px',
    }
  }));

  const FactHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
    gap: theme.spacing(0.5),
  }));

  const FactTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.9)',
  }));

  const FactText = styled(Typography)(({ theme }) => ({
    fontSize: '0.85rem',
    lineHeight: 1.5,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing(1.5),
  }));

  const FactFooter = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  }));

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0bbff" />
            <stop offset="50%" stopColor="#d1aaff" />
            <stop offset="100%" stopColor="#c299ff" />
          </linearGradient>
        </defs>
      </svg>
      
      <PostCard
        isPinned={isPinned}
        statusColor={statusColor}
        onClick={handlePostClick}
        onContextMenu={handlePostContextMenu}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        ref={postRef}
        elevation={0} 
        sx={{
          overflow: 'visible',
          mb: 1,
          borderRadius: 1,
          border: isPinned 
            ? `1px solid ${statusColor ? `${statusColor}33` : 'rgba(140, 82, 255, 0.2)'}` 
            : '1px solid rgba(255, 255, 255, 0.1)',
          borderColor: isPinned ? (statusColor || 'primary.main') : 'divider',
          cursor: 'auto',
          position: 'relative',
        }}
      >
        <AnimatePresence>
          {hearts.map(heart => (
            <HeartAnimation
              key={heart.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0, 1.2, 1.5, 0.8],
                y: [0, -10, -20]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1, times: [0, 0.2, 0.8, 1] }}
              style={{ 
                left: `${heart.x - (heart.size/2)}px`, 
                top: `${heart.y - (heart.size/2)}px`,
                transform: `rotate(${heart.rotation}deg)`
              }}
            >
              <Heart size={heart.size} />
            </HeartAnimation>
          ))}
        </AnimatePresence>
        
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  
                  {isPinned && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <Tooltip title={t('post.pin.tooltip')}>
                        <PushPinIcon sx={{ 
                          fontSize: 16, 
                          color: statusColor || 'primary.main'
                        }} />
                      </Tooltip>
                    </Box>
                  )}
                  
                  {(post.user?.account_type === 'channel' || post.user?.is_channel === true) && (
                    <ChannelTag 
                      label={t('post.channel.label')}
                      size="small"
                      sx={{ ml: 1, height: 20 }}
                    />
                  )}
                  
                  {post.user?.verification && post.user?.verification.status > 0 && (
                    post.user.verification.status === 6 ? (
                      <Icon 
                        icon="material-symbols:verified-rounded" 
                        style={{ 
                          fontSize: '24px',
                          color: '#1e88e5',
                          marginLeft: '4px' 
                        }} 
                      />
                    ) : post.user.verification.status === 7 ? (
                      <Icon 
                        icon="material-symbols:verified-user-rounded" 
                        style={{ 
                          fontSize: '24px',
                          color: '#7c4dff',
                          marginLeft: '4px' 
                        }} 
                      />
                    ) : (
                      <VerificationBadge 
                        status={post.user.verification.status} 
                        size="small" 
                      />
                    )
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
                      onError={safeImageError}
                    />
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                  {formatTimeAgo(post.timestamp)}
                </Typography>
              </Box>
            </Box>
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
              
              {processedContent && (
                <ReactMarkdown 
                  components={markdownComponents}
                  skipHtml={false}
                  transformLinkUri={null} 
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
                <Icon icon="solar:alt-arrow-down-bold" width="20" height="20" />
              </ShowMoreButton>
            )}
            
            {isExpanded && (
              <Button
                variant="text"
                size="small"
                onClick={toggleExpanded}
                startIcon={<Icon icon="solar:alt-arrow-up-bold" width="20" height="20" />}
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
          
          {/* Отображение репоста (пост внутри поста) */}
          {post.type === 'repost' && post.original_post && (
            <Box 
              sx={{ 
                mb: 2, 
                mt: 1,
                px: 2, 
                py: 1.5, 
                borderRadius: '12px', 
                border: theme => `1px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.12)'}`,
                backgroundColor: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.03)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                  borderColor: theme => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              {/* Заголовок с информацией о репосте */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Repeat2 size={16} color={theme.palette.primary.main} style={{ marginRight: '4px' }} />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  component={Link}
                  to={`/profile/${post.original_post.user?.username}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Репост от
                </Typography>
                <Avatar
                  src={post.original_post.user?.photo && post.original_post.user?.photo !== 'avatar.png'
                    ? post.original_post.user?.avatar_url
                    : `/static/uploads/avatar/system/avatar.png`}
                  alt={post.original_post.user?.name || "User"}
                  component={Link}
                  to={`/profile/${post.original_post.user?.username}`}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ 
                    width: 18, 
                    height: 18, 
                    ml: 0.5,
                    mr: 0.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
                <Typography 
                  variant="caption" 
                  color="text.primary"
                  component={Link}
                  to={`/profile/${post.original_post.user?.username}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{ 
                    fontWeight: 'medium',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {post.original_post.user?.name || 'Unknown'}
                  {post.original_post.user?.verification && post.original_post.user?.verification.status > 0 && (
                    <VerificationBadge 
                      status={post.original_post.user?.verification.status} 
                      size="small" 
                    />
                  )}
                </Typography>
              </Box>
              
              {/* Контент оригинального поста */}
              <Box 
                onClick={(e) => {
                  e.stopPropagation();
                  
                  openPostDetail(post.original_post.id);
                }}
                sx={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.03)'
                  }
                }}
              >
                {post.original_post.content && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                      {truncateText(post.original_post.content, 500)}
                      {post.original_post.content.length > 500 && (
                        <Box 
                          component="span" 
                          sx={{ 
                            color: 'primary.main', 
                            cursor: 'pointer',
                            display: 'inline-block',
                            fontSize: '0.85rem',
                            ml: 0.5
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openPostDetail(post.original_post.id);
                          }}
                        >
                          Читать далее
                        </Box>
                      )}
                    </Typography>
                    
                    {/* Отображение ссылок для репоста */}
                    {(() => {
                      const { urls } = processTextWithLinks(truncateText(post.original_post.content, 500), theme);
                      return urls.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {urls.map((url, index) => (
                            <LinkPreview key={`repost-link-${index}`} url={url} />
                          ))}
                        </Box>
                      );
                    })()}
                  </Box>
                )}
                
                {/* Replacing the single image with our new RepostImageGrid component */}
                {post.original_post.image && (
                  <Box sx={{ mb: 1 }}>
                    <RepostImageGrid 
                      images={post.original_post.images || [post.original_post.image]} 
                      onImageClick={(index) => {
                        setCurrentImageIndex(index);
                        setLightboxImages(post.original_post.images || [post.original_post.image]);
                        setLightboxOpen(true);
                      }}
                    />
                  </Box>
                )}
                
                {/* Видео оригинального поста (если есть) */}
                {post.original_post.video && (
                  <Box sx={{ mt: 1 }}>
                    <VideoPlayer 
                      videoUrl={post.original_post.video} 
                      sx={{ maxHeight: '200px' }}
                      onError={() => {
                        console.error("Repost video failed to load:", post.original_post.video);
                      }}
                    />
                  </Box>
                )}
                
                {/* Блок фактов оригинального поста в репосте */}
                {post.original_post.fact && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '8px',
                        height: '100%',
                        backgroundColor: '#6e5a9d',
                        borderRadius: '8px 0 0 8px',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Проверка фактов
                      </Typography>
                      <Tooltip 
                        title="Это разъяснение было предоставлено организацией"
                        placement="top"
                        arrow
                        sx={{
                          '& .MuiTooltip-tooltip': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '0.7rem',
                            maxWidth: 180,
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'help',
                            fontSize: '0.65rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            }
                          }}
                        >
                          ?
                        </Box>
                      </Tooltip>
                    </Box>
                    
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        lineHeight: 1.4,
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {post.original_post.fact.explanation_text}
                    </Typography>
                    
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontStyle: 'italic',
                      }}
                    >
                      Предоставлено {post.original_post.fact.who_provided}
                    </Typography>
                  </Box>
                )}
                
                {/* Статистика оригинального поста */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mt: 1,
                  pt: 1,
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  opacity: 0.7
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatTimeAgo(post.original_post.timestamp)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Heart size={12} color="text.secondary" style={{ marginRight: '4px' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {post.original_post.likes_count || 0}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MessageCircle size={12} color="text.secondary" style={{ marginRight: '4px' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {post.original_post.comments_count || 0}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VisibilityIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {post.original_post.views_count || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          
          {videoUrl && mediaError.type !== 'video' ? (
            <Box sx={{ mb: 2, position: 'relative', borderRadius: '12px', overflow: 'hidden' }} data-no-navigate>
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <Box sx={{ filter: post.is_nsfw && !showSensitive ? 'blur(16px)' : 'none', transition: 'filter 0.3s', pointerEvents: post.is_nsfw && !showSensitive ? 'none' : 'auto', width: '100%', height: '100%' }}>
                  <VideoPlayer videoUrl={videoUrl} poster={images.length > 0 ? formatVideoUrl(images[0]) : undefined} onError={() => handleVideoError(videoUrl)} />
                </Box>
                {post.is_nsfw && !showSensitive && NSFWOverlay}
              </Box>
            </Box>
          ) : mediaError.type === 'video' && (
            <Box sx={{ mb: 2 }}>
              <MediaErrorDisplay type="video" />
            </Box>
          )}
          
          
          {images.length > 0 && mediaError.type !== 'image' ? (
            <Box sx={{ mb: 2, width: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden' }} data-no-navigate>
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <Box sx={{ filter: post.is_nsfw && !showSensitive ? 'blur(16px)' : 'none', transition: 'filter 0.3s', pointerEvents: post.is_nsfw && !showSensitive ? 'none' : 'auto', width: '100%', height: '100%' }}>
                  <ImageGrid images={images} onImageClick={handleOpenImage} onImageError={handleImageError} />
                </Box>
                {post.is_nsfw && !showSensitive && NSFWOverlay}
              </Box>
            </Box>
          ) : mediaError.type === 'image' && (
            <Box sx={{ mb: 2 }}>
              <MediaErrorDisplay type="image" />
            </Box>
          )}
          
          
          {musicTracks.length > 0 && (
            <Box sx={{ mt: 0, mb: 0 }}>
              {musicTracks.map((track, index) => (
                <MusicTrack key={`track-${index}`} onClick={(e) => handleTrackPlay(track, e)}>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
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
                      onError={safeImageError}
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
          
          {/* Блок фактов */}
          {post?.fact && (
            <Box
              sx={{
                mt: 1,
                mb: 1,
                p: 2,
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(50px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '8px',
                  height: '100%',
                  backgroundColor: '#6e5a9d',
                  borderRadius: '8px 0 0 8px',
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  gap: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Проверка фактов
                </Typography>
                <Tooltip 
                  title="Это разъяснение было предоставлено организацией"
                  placement="top"
                  arrow
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.75rem',
                      maxWidth: 200,
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'help',
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}
                  >
                    ?
                  </Box>
                </Tooltip>
              </Box>
              
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 1.5,
                }}
              >
                {post.fact.explanation_text}
              </Typography>
              
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontStyle: 'italic',
                }}
              >
                Это разъяснение было предоставлено {post.fact.who_provided}
              </Typography>
            </Box>
          )}
          
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            gap: 1.7 // уменьшено с 2
          }}>
            {/* Левая группа: лайк, коммент, репост, поделиться */}
            <Box sx={{
              display: 'flex',
              gap: 1.7, // уменьшено с 2
              background: 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(40px)',
              border: '1px solid #333',
              borderRadius: '10px', // было 12px
              px: 2.5, // было 3
              py: 0.85, // было 1
              alignItems: 'center',
              minWidth: 185 // было 220
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.85, cursor: 'pointer', position: 'relative' }} onClick={handleLike} data-like-parent>
                {liked ? <Heart size={21} color={theme.palette.primary.main} fill={theme.palette.primary.main} /> : <Heart size={21} color="#fff" />}
                <Typography sx={{ color: '#fff', fontSize: '0.85rem', ml: 0.4 }}>{likesCount > 0 ? likesCount : ''}</Typography>
                {/* Аватарки последних лайкнувших — появляются при наведении */}
                {!isMobile && lastLikedUsers.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '110%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.25s cubic-bezier(.4,2,.6,1), transform 0.25s cubic-bezier(.4,2,.6,1)',
                      zIndex: 20,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    }}
                    className="like-avatars"
                  >
                    {lastLikedUsers.slice(0, 3).map((user, index) => {
                      const avatarUrl = user.avatar_url || (user.avatar ? `/static/uploads${user.avatar}` : null) || `/static/uploads/avatar/${user.id}/${user.photo || 'avatar.png'}`;
                      return (
                        <Avatar
                          key={user.id}
                          src={avatarUrl}
                          alt={user.name}
                          sx={{
                            width: 22,
                            height: 22,
                            border: '1.5px solid #fff',
                            ml: index > 0 ? -0.7 : 0,
                            zIndex: 3 - index,
                            background: '#eee',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.10)',
                            transition: 'transform 0.18s',
                            '&:hover': {
                              transform: 'scale(1.13)',
                              zIndex: 10
                            }
                          }}
                          onError={safeImageError}
                        />
                      );
                    })}
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.85, cursor: 'pointer' }} onClick={handleCommentClick}>
                <MessageCircle size={21} color="#fff" />
                <Typography sx={{ color: '#fff', fontSize: '0.85rem', ml: 0.4 }}>{(post?.total_comments_count || post?.comments_count) > 0 ? (post?.total_comments_count || post?.comments_count) : ''}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.85, cursor: 'pointer' }} onClick={handleRepostClick}>
                <Repeat2 size={21} color="#fff" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.85, cursor: 'pointer' }} onClick={handleShare}>
                <Link2 size={21} color="#fff" />
              </Box>
            </Box>

            {/* Правая группа: просмотры и меню */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(40px)',
              border: '1px solid #333',
              borderRadius: '10px', // было 12px
              px: 1.7, // было 2
              py: 0.85, // было 1
              minWidth: 68, // было 80
              justifyContent: 'center',
              gap: 0.85 // было 1
            }}>
              <VisibilityIcon sx={{ color: '#fff', mr: 0.85, fontSize: 21 }} />
              <Typography sx={{ color: '#fff', fontSize: '0.85rem', mr: 1.7 }}>{viewsCount}</Typography>
              <MoreVertIcon sx={{ color: '#fff', cursor: 'pointer', fontSize: 21 }} onClick={handleMenuOpen} data-no-navigate />
            </Box>
          </Box>
        </Box>
      </PostCard>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <BlurredMenu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {currentUser && currentUser.id === 3 && (
          <MenuItem onClick={handleFactsClick}>
            <ListItemIcon>
              <FactCheckIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Факты</ListItemText>
          </MenuItem>
        )}
        {isCurrentUserPost && (
          <>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('post.menu_actions.edit')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('post.menu_actions.delete')}</ListItemText>
            </MenuItem>
          </>
        )}
        {isCurrentUserPost && (
          <MenuItem onClick={handlePinPost}>
            <ListItemIcon>
              {isPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{isPinned ? t('post.menu_actions.unpin') : t('post.menu_actions.pin')}</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <Link2 size={16} />
          </ListItemIcon>
          <ListItemText>{t('post.menu_actions.copy_link')}</ListItemText>
        </MenuItem>
        {!isCurrentUserPost && (
          <MenuItem onClick={handleReportClick}>
            <ListItemIcon>
              <FlagIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('post.menu_actions.report')}</ListItemText>
          </MenuItem>
        )}
      </BlurredMenu>
      
      
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
            {t('post.repost_dialog.title')}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3 }}>
          {post.type === 'repost' && (
            <Box sx={{ 
              mb: 2,
              p: 1.5, 
              borderRadius: '8px',
              bgcolor: 'rgba(123, 104, 238, 0.08)',
              border: '1px solid rgba(123, 104, 238, 0.15)',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <Repeat2 size={18} color="#7B68EE" style={{ marginRight: '8px', marginTop: '2px' }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {t('post.repost_dialog.original_post_notice')}
              </Typography>
            </Box>
          )}
          <Box sx={{ position: 'relative' }}>
            <TextField
              autoFocus
              multiline
              rows={3}
              fullWidth
              placeholder={t('post.repost_dialog.comment_placeholder')}
              value={repostContent}
              onChange={(e) => setRepostContent(e.target.value)}
              variant="outlined"
              helperText={t('post.repost_dialog.mention_helper')}
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
                    color: 'transparent',  
                    caretColor: 'rgba(255, 255, 255, 0.9)'  
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
                alt={t('post.media.post_image_alt')}
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
            {t('post.dialog.cancel')}
          </Button>
          <Button 
            onClick={handleCreateRepost} 
            variant="contained" 
            disabled={repostLoading}
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
            endIcon={repostLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {t('post.repost_dialog.repost_button')}
          </Button>
        </DialogActions>
      </Dialog>
      
      
      {lightboxOpen && !onOpenLightbox && (
        <SimpleImageViewer
          isOpen={lightboxOpen}
          onClose={handleCloseLightbox}
          images={images}
          initialIndex={currentImageIndex}
        />
      )}
      
      
      <Dialog
        open={deleteDialog.open}
        onClose={() => !deleteDialog.deleting && !deleteDialog.deleted && setDeleteDialog({ ...deleteDialog, open: false })}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(32, 32, 36, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '400px',
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
        <Box sx={{ p: 3 }}>
          {deleteDialog.deleted ? (
            <>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 56, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                  {t('post.delete_dialog.success_title')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {t('post.delete_dialog.success_message')}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: '#f44336',
                  fontWeight: 'medium',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <DeleteIcon sx={{ mr: 1 }} /> {t('post.delete_dialog.title')}
              </Typography>
              <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                {t('post.delete_dialog.confirmation')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
                  disabled={deleteDialog.deleting}
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
                  {t('post.delete_dialog.cancel')}
                </Button>
                <Button 
                  onClick={confirmDelete}
                  disabled={deleteDialog.deleting}
                  variant="contained" 
                  color="error"
                  sx={{ 
                    borderRadius: '10px',
                    boxShadow: 'none',
                    px: 2
                  }}
                  endIcon={deleteDialog.deleting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {deleteDialog.deleting ? t('post.delete_dialog.deleting') : t('post.delete_dialog.delete')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
      
      
      <Dialog
        open={reportDialog.open}
        onClose={() => !reportDialog.submitting && !reportDialog.submitted && setReportDialog({...reportDialog, open: false})}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(32, 32, 36, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '450px',
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF9800'%3E%3Cpath d='M14.4 6l-.24-1.2c-.09-.46-.5-.8-.98-.8H6c-.55 0-1 .45-1 1v15c0 .55.45 1 1 1s1-.45 1-1v-6h5.6l.24 1.2c.09.47.5.8.98.8H19c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1h-4.6z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }
        }}>
          {t('post.report_dialog.title')}
        </DialogTitle>
        
        {reportDialog.submitted ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 56, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
              {t('post.report_dialog.success_title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('post.report_dialog.success_message')}
            </Typography>
          </Box>
        ) : (
          <>
            <DialogContent sx={{ pt: 3, px: 3 }}>
              <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                {t('post.report_dialog.description')}
              </Typography>
              
              {reportDialog.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {reportDialog.error}
                </Alert>
              )}
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.5,
                  mb: 2
                }}
              >
                {reportReasons.map(reason => (
                  <Button
                    key={reason}
                    variant={reportDialog.reason === reason ? "contained" : "outlined"}
                    color={reportDialog.reason === reason ? "warning" : "inherit"}
                    onClick={() => setReportDialog({...reportDialog, reason, error: null})}
                    sx={{
                      borderRadius: '10px',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1,
                      backgroundColor: reportDialog.reason === reason ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: reportDialog.reason === reason ? 'rgba(255, 152, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: reportDialog.reason === reason ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                        borderColor: reportDialog.reason === reason ? 'rgba(255, 152, 0, 0.6)' : 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    {reason}
                  </Button>
                ))}
              </Box>
              
              {reportDialog.reason === t('post.report.reasons.other') && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={t('post.report.placeholder')}
                  variant="outlined"
                  value={reportDialog.customReason || ''}
                  onChange={(e) => setReportDialog({...reportDialog, customReason: e.target.value})}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 152, 0, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff9800',
                        borderWidth: '1px'
                      }
                    }
                  }}
                />
              )}
              
              
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid rgba(255, 152, 0, 0.3)', 
                  borderRadius: '10px',
                  bgcolor: 'rgba(255, 152, 0, 0.05)',
                }}
              >
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.5)', mb: 1 }}>
                  {t('post.report_dialog.post_by_user', { username: post?.user?.name })}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: '0.8rem'
                  }}
                >
                  {post?.content}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Button 
                onClick={() => setReportDialog({...reportDialog, open: false})}
                disabled={reportDialog.submitting}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                {t('post.report_dialog.cancel')}
              </Button>
              <Button 
                onClick={handleReportSubmit}
                disabled={reportDialog.submitting || !reportDialog.reason}
                variant="contained" 
                color="warning"
                startIcon={reportDialog.submitting ? <CircularProgress size={16} color="inherit" /> : <ReportProblemIcon />}
                sx={{ 
                  bgcolor: '#ff9800',
                  '&:hover': {
                    bgcolor: '#f57c00'
                  }
                }}
              >
                {reportDialog.submitting ? t('post.report_dialog.submitting') : t('post.report_dialog.submit')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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
        open={editDialog.open}
        onClose={() => !editDialog.submitting && handleCloseEditDialog()}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            bgcolor: 'rgba(32, 32, 36, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            width: '95%',
            maxWidth: '600px',
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
        fullWidth
        maxWidth="md"
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232196f3'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }
        }}>
          {t('post.edit_dialog.title')}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3 }}>
          <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
            {t('post.edit_dialog.time_limit')}
          </Typography>
          
          {editDialog.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editDialog.error}
            </Alert>
          )}
          
          
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={8}
            label={t('post.edit_dialog.post_text')}
            value={editDialog.content}
            onChange={handleEditContentChange}
            margin="normal"
            disabled={editDialog.submitting}
            sx={{
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
                  borderColor: '#2196f3',
                  borderWidth: '1px'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '& .MuiInputBase-input': {
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          />
          
          
          {(post.images?.length > 0 || post.image) && !editDialog.deleteImages && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('post.edit_dialog.current_images')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {post.images ? post.images.map((img, idx) => (
                  <Box 
                    key={`current-img-${idx}`}
                    component="img"
                    src={img}
                    alt={t('post.edit_dialog.image_alt', { number: idx + 1 })}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )) : post.image && (
                  <Box 
                    component="img"
                    src={post.image}
                    alt={t('post.edit_dialog.post_image_alt')}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )}
              </Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editDialog.deleteImages}
                    onChange={handleToggleDeleteImages}
                    disabled={editDialog.submitting}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      }
                    }}
                  />
                }
                label={t('post.edit_dialog.delete_current_images')}
                sx={{ 
                  mt: 1,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9rem'
                  }
                }}
              />
            </Box>
          )}
          
          
          {post.video && !editDialog.deleteVideo && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('post.edit_dialog.current_video')}
              </Typography>
              <Box 
                component="video"
                src={post.video}
                controls
                sx={{ 
                  maxWidth: '100%',
                  height: 120,
                  borderRadius: 1
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editDialog.deleteVideo}
                    onChange={handleToggleDeleteVideo}
                    disabled={editDialog.submitting}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      }
                    }}
                  />
                }
                label={t('post.edit_dialog.delete_current_video')}
                sx={{ 
                  mt: 1, 
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.8)',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9rem'
                  }
                }}
              />
            </Box>
          )}
          
          
          {post.music && post.music.length > 0 && !editDialog.deleteMusic && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('post.edit_dialog.current_audio')}
              </Typography>
              <List dense>
                {post.music.map((track, idx) => (
                  <ListItem key={`music-${idx}`} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MusicNoteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={track.title} 
                      secondary={track.artist}
                      primaryTypographyProps={{ noWrap: true, variant: 'body2' }}
                      secondaryTypographyProps={{ noWrap: true, variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editDialog.deleteMusic}
                    onChange={handleToggleDeleteMusic}
                    disabled={editDialog.submitting}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      }
                    }}
                  />
                }
                label={t('post.edit_dialog.delete_music')}
                sx={{ 
                  mt: 0.5,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9rem'
                  }
                }}
              />
            </Box>
          )}
          
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoIcon />}
              disabled={editDialog.submitting}
              sx={{ 
                mr: 1, 
                mb: 1,
                borderRadius: '10px',
                backdropFilter: 'blur(5px)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {t('post.edit_dialog.add_images')}
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleEditImageSelect}
              />
            </Button>
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<VideocamIcon />}
              disabled={editDialog.submitting || (post.video && !editDialog.deleteVideo)}
              sx={{ 
                mb: 1,
                borderRadius: '10px',
                backdropFilter: 'blur(5px)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {post.video && !editDialog.deleteVideo ? t('post.edit_dialog.delete_current_video') : t('post.edit_dialog.add_video')}
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleEditVideoSelect}
                disabled={post.video && !editDialog.deleteVideo}
              />
            </Button>
          </Box>
          
          
          {editDialog.previews.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {editDialog.previews.map((preview, idx) => (
                <Box
                  key={`preview-${idx}`}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
          
          
          {editDialog.newVideo && (
            <Box sx={{ 
              mt: 2,
              p: 1.5,
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                {t('post.edit_dialog.new_video_selected', { name: editDialog.newVideo.name })}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            variant="outlined" 
            color="primary"
            disabled={editDialog.submitting}
            sx={{
              borderRadius: '10px',
              borderColor: 'rgba(33, 150, 243, 0.3)',
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                borderColor: 'rgba(33, 150, 243, 0.5)',
                backgroundColor: 'rgba(33, 150, 243, 0.05)'
              }
            }}
          >
            {t('post.edit_dialog.cancel')}
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained" 
            color="primary"
            disabled={editDialog.submitting}
            startIcon={editDialog.submitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              borderRadius: '10px',
              backgroundColor: '#2196f3',
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            {editDialog.submitting ? t('post.edit_dialog.saving') : t('post.edit_dialog.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <ContextMenu
        items={getContextMenuItems()}
        x={contextMenuState.x}
        y={contextMenuState.y}
        show={contextMenuState.show && contextMenuState.data?.postId === post.id}
        onClose={closeContextMenu}
      />
      
      {/* Модалка для работы с фактами */}
      <FactModal
        open={factModal.open}
        onClose={handleFactModalClose}
        onSubmit={handleFactSubmit}
        onDelete={handleFactDelete}
        loading={factModal.loading}
        error={factModal.error}
        existingFact={post?.fact}
        postId={post?.id}
      />
    </>
  );
};

export default Post; 