import React, { useState, useEffect, useContext, useRef, useMemo, useCallback, Suspense, lazy } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Container, 
  Grid, 
  Avatar, 
  Paper, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Snackbar, 
  Alert, 
  TextField, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Link as MuiLink,
  ImageList,
  ImageListItem,
  Chip,
  InputBase,
  Badge,
  Skeleton,
  useTheme,
  Popover,
  ButtonBase,
  Collapse,
  SvgIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import PostService from '../../services/PostService';
import ReactMarkdown from 'react-markdown';
import 'react-medium-image-zoom/dist/styles.css';
import { ThemeSettingsContext } from '../../App';
import ImageGrid from '../../components/ImageGrid';
import { formatTimeAgo, getRussianWordForm, formatDate } from '../../utils/dateUtils';
import Post from '../../components/Post/Post'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RepostItem from '../../components/RepostItem';
import PostSkeleton from '../../components/Post/PostSkeleton';
import ContentLoader from '../../components/UI/ContentLoader';
import TabContentLoader from '../../components/UI/TabContentLoader';
import { UsernameCard } from '../../UIKIT';


import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FeedIcon from '@mui/icons-material/Feed';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import ImageIcon from '@mui/icons-material/Image';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CommentIcon from '@mui/icons-material/Comment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MusicSelectDialog from '../../components/Music/MusicSelectDialog';
import InfoIcon from '@mui/icons-material/Info';
import CakeIcon from '@mui/icons-material/Cake';
import TodayIcon from '@mui/icons-material/Today';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CollectionsIcon from '@mui/icons-material/Collections';
import DiamondIcon from '@mui/icons-material/Diamond';
import ChatIcon from '@mui/icons-material/Chat';
import BlockIcon from '@mui/icons-material/Block';
import WarningIcon from '@mui/icons-material/Warning';
import { 
  NavButton,
  ContextMenu
} from '../../UIKIT';
import { Icon } from '@iconify/react';


const ProfileHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '16px',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper
}));

const CoverPhoto = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('sm')]: {
    height: 250,
  },
  [theme.breakpoints.up('md')]: {
    height: 300,
  },
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

const AvatarWrap = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: -60,
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    marginTop: -80,
    marginBottom: 0,
    justifyContent: 'flex-start',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid rgba(26, 26, 26, 0.9)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.up('md')]: {
    width: 160,
    height: 160,
  },
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 1,
    maxWidth: '100%',
    marginLeft: 0,
  },
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  fontSize: '1.5rem',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
    textAlign: 'left',
  },
}));

const ProfileUsername = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

const ProfileBio = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

const ProfileStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-start',
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
  },
}));

const SocialLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-start',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: '20px',
  zIndex: 1,
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 2px 8px rgba(208, 188, 255, 0.25)',
  padding: theme.spacing(0.5, 2),
}));

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: 10,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
  cursor: 'pointer'
}));


const CreatePostCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)'
    : 'linear-gradient(145deg, rgba(245, 245, 245, 0.8) 0%, rgba(250, 250, 250, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.2)'
    : '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  marginBottom: theme.spacing(0),
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 25px rgba(0, 0, 0, 0.3)'
      : '0 6px 25px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)'
  }
}));


const PostInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.2)'
      : 'rgba(0, 0, 0, 0.03)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
    fontSize: '0.95rem',
    padding: theme.spacing(1, 1.5),
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: 'rgba(208, 188, 255, 0.3)',
      background: theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.25)'
        : 'rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      borderColor: 'rgba(208, 188, 255, 0.5)',
      boxShadow: '0 0 0 2px rgba(208, 188, 255, 0.1)'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  width: '100%'
}));


const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 0, 0),
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  marginTop: theme.spacing(1.5)
}));

const MediaPreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.2)'
    : 'rgba(0, 0, 0, 0.05)',
}));

const RemoveMediaButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const MarkdownContent = styled(Box)(({ theme }) => ({
  '& p': {
    margin: theme.spacing(1, 0),
    lineHeight: 1.6,
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
}));


const PublishButton = styled(Button)(({ theme }) => ({
  borderRadius: '18px',
  textTransform: 'none',
  fontSize: '0.6rem',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(124, 77, 255, 0.25)',
  padding: theme.spacing(0.4, 1.5),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, rgb(180 163 220) 0%, rgb(177 161 216) 100%)'
    : 'linear-gradient(90deg, rgb(124 77 255) 0%, rgb(148 108 255) 100%)',
  color: theme.palette.mode === 'dark' ? '#000' : '#fff',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.35)',
  },
  '&.Mui-disabled': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
    color: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.3)'
  }
}));


const VerificationBadge = ({ status, size }) => {
  if (!status) return null;
  
  const getColorAndTitle = (status) => {
    
    if (status === 'verified') {
      return { color: '#D0BCFF', title: 'Верифицирован' };
    }
    
    
    switch(Number(status)) {
      case 1:
        return { color: '#9e9e9e', title: 'Верифицирован' };
      case 2:
        return { color: '#d67270', title: 'Официальный аккаунт' };
      case 3:
        return { color: '#b39ddb', title: 'VIP аккаунт' };
      case 4:
        return { color: '#ff9800', title: 'Модератор' };
      case 5:
        return { color: '#4caf50', title: 'Поддержка' };
      case 6:
        return { color: '#1e88e5', title: 'Канал (Верифицированный)', isChannelVerified: true };
      case 7:
        return { color: '#7c4dff', title: 'Канал (Премиум)', isChannelPremium: true };
      default:
        return { color: '#D0BCFF', title: 'Верифицирован' };
    }
  };
  
  const { color, title, isChannelVerified, isChannelPremium } = getColorAndTitle(status);
  
  return (
    <Tooltip title={title} placement="top">
      {isChannelVerified ? (
        <Icon 
          icon="material-symbols:verified-rounded" 
          style={{ 
            fontSize: size === 'small' ? '26px' : '22px',
            color: '#1e88e5',
            marginLeft: '4px'
          }} 
        />
      ) : isChannelPremium ? (
        <Icon 
          icon="material-symbols:verified-user-rounded" 
          style={{ 
            fontSize: size === 'small' ? '26px' : '22px',
            color: '#7c4dff',
            marginLeft: '4px'
          }} 
        />
      ) : (
        <CheckCircleIcon 
          sx={{ 
            fontSize: size === 'small' ? 23 : 20,
            ml: 0.5,
            color
          }} 
        />
      )}
    </Tooltip>
  );
};


const CreatePost = ({ onPostCreated, postType = 'post', recipientId = null }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [musicTracks, setMusicTracks] = useState([]);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  
  const { user } = useContext(AuthContext);
  const placeholderText = postType === 'stena' ? 'Че напишем?' : 'Что у вас нового?';
  
  
  useEffect(() => {
    if (error) setError('');
  }, [content, media, mediaPreview, musicTracks, error]);
  
  
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
  
  
  const processFiles = (files) => {
    if (!files || files.length === 0) {
      console.error('No files to process');
      return;
    }
    
    console.log(`processFiles: Processing ${files.length} files`);
    
    
    setMediaFiles([]);
    setMediaPreview([]);
    setMediaType('');
    setMusicTracks([]);
    
    
    if (files.length > 1) {
      
      const allImages = files.every(file => file.type.startsWith('image/'));
      
      if (allImages) {
        setMediaFiles(files);
        setMediaType('images');
        
        
        files.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setMediaPreview(prevPreviews => [...prevPreviews, reader.result]);
          };
          reader.readAsDataURL(file);
        });
        return;
      }
    }
    
    
    const file = files[0];
    
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (isImage || isVideo) {
      setMediaFiles([file]);
      setMedia(file);
      setMediaType(isImage ? 'image' : 'video');
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview([reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaChange = (e) => {
    e.preventDefault(); 
    
    
    if (!e.target.files || e.target.files.length === 0) {
      console.error('No files selected or invalid files');
      return;
    }
    
    const files = Array.from(e.target.files);
    console.log(`handleMediaChange: Selected ${files.length} files`, files);
    processFiles(files);
  };
  
  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaFiles([]);
    setMediaPreview([]);
    setMediaType('');
    setMusicTracks([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  
  const handleMusicSelect = (tracks) => {
    setMusicTracks(tracks);
  };
  
  
  const handleRemoveTrack = (trackId) => {
    setMusicTracks(prev => prev.filter(track => track.id !== trackId));
  };
  
  const handleSubmit = async () => {
    
    if (!content.trim() && mediaFiles.length === 0 && musicTracks.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      
      
      if (postType && postType !== 'post') {
        formData.append('type', postType);
      }
      
      if (recipientId) {
        formData.append('recipient_id', recipientId);
      }
      
      
      if (mediaType === 'images') {
        
        console.log(`Adding ${mediaFiles.length} images to FormData`);
        mediaFiles.forEach((file, index) => {
          console.log(`Adding image[${index}]:`, file.name, file.size);
          formData.append(`images[${index}]`, file);
        });
      } else if (mediaType === 'image') {
        
        console.log("Adding single image to FormData:", mediaFiles[0].name, mediaFiles[0].size);
        formData.append('image', mediaFiles[0]);
      } else if (mediaType === 'video') {
        
        console.log("Adding video to FormData:", mediaFiles[0].name, mediaFiles[0].size);
        formData.append('video', mediaFiles[0]);
      }
      
      
      if (musicTracks.length > 0) {
        console.log(`Adding ${musicTracks.length} music tracks to form data`);
        
        const trackData = musicTracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          file_path: track.file_path,
          cover_path: track.cover_path
        }));
        formData.append('music', JSON.stringify(trackData));
      }
      
      
      console.log('Creating post with form data:');
      for (const pair of Array.from(formData.entries())) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File ${pair[1].name} (${pair[1].size} bytes)`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      
      const response = await PostService.createPost(formData);
      console.log('Post created:', response);
      
      if (response && response.success) {
        
        setContent('');
        setMedia(null);
        setMediaFiles([]);
        setMediaPreview([]);
        setMediaType('');
        setMusicTracks([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        
        if (onPostCreated && response.post) {
          onPostCreated(response.post);
        }
        
        
        console.log('Post created successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = "Превышен лимит публикации постов. ";
        
        if (rateLimit && rateLimit.reset) {
          
          const resetTime = new Date(rateLimit.reset * 1000);
          const now = new Date();
          const diffSeconds = Math.round((resetTime - now) / 1000);
          
          if (diffSeconds > 60) {
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            errorMessage += `Следующий пост можно опубликовать через ${minutes} мин. ${seconds} сек.`;
          } else {
            errorMessage += `Следующий пост можно опубликовать через ${diffSeconds} сек.`;
          }
        } else {
          errorMessage += "Пожалуйста, повторите попытку позже.";
        }
        
        
        setError(errorMessage);
      } else if (error.response && error.response.data && error.response.data.error) {
        
        setError(error.response.data.error);
      } else {
        
        setError("Произошла ошибка при создании поста. Пожалуйста, попробуйте еще раз.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 0,
        borderRadius: '24px',
        backgroundColor: theme => theme.palette.mode === 'dark' ? '#1E1E1E' : theme.palette.background.paper,
        position: 'relative',
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
                Перетащите файлы сюда
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Avatar 
              src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : undefined}
              alt={user.name}
              sx={{ 
                mr: 1.5, 
                width: 40, 
                height: 40, 
                border: '2px solid rgba(208, 188, 255)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
                }
              }}
            />
            <PostInput 
              placeholder={placeholderText}
              multiline
              minRows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  transition: 'all 0.3s ease',
                  minHeight: '40px !important',
                  fontSize: '0.95rem'
                },
                '& textarea': {
                  lineHeight: '1.4 !important',
                }
              }}
            />
          </Box>
          
          
          {mediaPreview.length > 0 && (
            <Box sx={{ position: 'relative', mt: 1 }}>
              {mediaType === 'images' && mediaPreview.length > 1 ? (
                <ImageList 
                  sx={{ 
                    width: '100%', 
                    height: 'auto', 
                    maxHeight: 500,
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }} 
                  cols={mediaPreview.length > 3 ? 3 : 2} 
                  rowHeight={mediaPreview.length > 6 ? 120 : 164}
                >
                  {mediaPreview.map((preview, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <img
                  src={mediaPreview[0]}
                  alt="Preview"
                  style={{ 
                    width: '100%', 
                    borderRadius: '8px',
                    maxHeight: '300px',
                    objectFit: mediaType === 'image' ? 'contain' : 'cover'
                  }}
                />
              )}
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  padding: '4px',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                }}
                onClick={handleRemoveMedia}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
          
          
          {musicTracks.length > 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              {musicTracks.map(track => (
                <Box 
                  key={track.id}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 1, 
                    px: 2, 
                    mb: 1, 
                    borderRadius: '8px',
                    bgcolor: theme => theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                    border: theme => theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '4px', 
                      overflow: 'hidden',
                      mr: 1.5,
                      position: 'relative',
                      bgcolor: theme => theme.palette.mode === 'dark' 
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={track.cover_path.startsWith('/static/') ? track.cover_path : `/static/uploads/music/covers/${track.cover_path}`} 
                      alt={track.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/uploads/system/album_placeholder.jpg';
                      }}
                    />
                    <MusicNoteIcon 
                      sx={{ 
                        position: 'absolute', 
                        fontSize: 16, 
                        color: 'rgba(255, 255, 255, 0.7)'
                      }} 
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {track.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {track.artist}
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleRemoveTrack(track.id)}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
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
                onChange={handleMediaChange}
                multiple
                style={{ display: 'none' }}
                id="media-upload-profile"
              />
              <label htmlFor="media-upload-profile">
                <Button
                  component="span"
                  startIcon={<ImageOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: mediaFiles.length > 0 || musicTracks.length > 0 ? 'primary.main' : 'text.secondary',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    border: mediaFiles.length > 0 || musicTracks.length > 0 
                      ? '1px solid rgba(208, 188, 255, 0.5)'
                      : theme => theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid rgba(0, 0, 0, 0.12)',
                    padding: '4px 10px',
                    '&:hover': {
                      backgroundColor: 'rgba(208, 188, 255, 0.08)',
                      borderColor: 'rgba(208, 188, 255, 0.4)'
                    }
                  }}
                  size="small"
                >
                  {mediaFiles.length > 0 ? `Файлы (${mediaFiles.length})` : 'Медиа'}
                </Button>
              </label>
              
              
              <Button
                onClick={() => setShowMusicPicker(true)}
                startIcon={<MusicNoteIcon sx={{ fontSize: 18 }} />}
                sx={{
                  color: musicTracks.length > 0 ? 'primary.main' : 'text.secondary',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  padding: '4px 10px',
                  border: musicTracks.length > 0 
                    ? '1px solid rgba(208, 188, 255, 0.5)' 
                    : theme => theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.12)'
                      : '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(208, 188, 255, 0.08)',
                    borderColor: 'rgba(208, 188, 255, 0.4)'
                  }
                }}
                size="small"
              >
                {musicTracks.length > 0 ? `Музыка (${musicTracks.length})` : 'Музыка'}
              </Button>
            </Box>
            
            <PublishButton 
              variant="contained" 
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0 && musicTracks.length === 0)}
              endIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
              size="small"
            >
              Опубликовать
            </PublishButton>
          </PostActions>
          
          
          <MusicSelectDialog
            open={showMusicPicker}
            onClose={() => setShowMusicPicker(false)}
            onSelectTracks={handleMusicSelect}
            maxTracks={3}
          />
        </Box>
      </Box>
    </Paper>
  );
};


const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <TabContentLoader tabIndex={index}>
          <Box sx={{ pt: 0 }}>
            {children}
          </Box>
        </TabContentLoader>
      )}
    </div>
  );
};


const UserStatus = ({ statusText, statusColor }) => {
  if (!statusText) return null;
  
  
  const getContrastTextColor = (hexColor) => {
    
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  
  const createGradientColor = (hexColor) => {
    
    let r = parseInt(hexColor.substr(1, 2), 16);
    let g = parseInt(hexColor.substr(3, 2), 16);
    let b = parseInt(hexColor.substr(5, 2), 16);
    
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    
    if (brightness < 128) {
      
      r = Math.min(255, r + 30);
      g = Math.min(255, g + 30);
      b = Math.min(255, b + 30);
    } else {
      
      r = Math.max(0, r - 30);
      g = Math.max(0, g - 30);
      b = Math.max(0, b - 30);
    }
    
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  
  const gradientColor = createGradientColor(statusColor || '#D0BCFF');
  const textColor = getContrastTextColor(statusColor || '#D0BCFF');

  
  const parseStatusText = (text) => {
    
    const iconTagRegex = /\{(\w+)\}/;
    const match = text.match(iconTagRegex);
    
    
    const result = {
      text: text,
      iconName: null
    };
    
    if (match) {
      
      result.iconName = match[1].toLowerCase();
      
      result.text = text.replace(iconTagRegex, '').trim();
    }
    
    return result;
  };
  
  
  const parsedStatus = parseStatusText(statusText);
  
  
  const getIconByName = (iconName) => {
    switch (iconName) {
      case 'minion':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M402.667 518C367.33 518 332.786 507.523 303.405 487.89C274.023 468.257 251.123 440.353 237.6 407.707C224.077 375.06 220.539 339.137 227.433 304.478C234.327 269.82 251.343 237.984 276.33 212.997C301.317 188.01 333.153 170.994 367.81 164.1C402.47 157.206 438.393 160.744 471.04 174.267C503.687 187.79 531.59 210.69 551.223 240.072C570.853 269.453 581.333 303.997 581.333 339.333C581.333 362.797 576.713 386.03 567.733 407.707C558.753 429.383 545.593 449.08 529.003 465.67C512.413 482.26 492.717 495.42 471.04 504.4C449.363 513.38 426.13 518 402.667 518ZM402.667 210.667C377.22 210.667 352.343 218.213 331.183 232.351C310.024 246.489 293.533 266.584 283.794 290.095C274.056 313.606 271.508 339.477 276.472 364.437C281.437 389.393 293.691 412.32 311.686 430.313C329.68 448.31 352.607 460.563 377.567 465.527C402.523 470.493 428.393 467.943 451.907 458.207C475.417 448.467 495.51 431.977 509.65 410.817C523.787 389.657 531.333 364.78 531.333 339.333C531.333 305.209 517.777 272.482 493.647 248.353C469.517 224.223 436.79 210.667 402.667 210.667Z" fill="currentColor"/>
            <path d="M400 643.667C376.53 643.72 353.28 639.123 331.597 630.14C309.913 621.157 290.224 607.97 273.667 591.333C269.251 586.593 266.847 580.327 266.961 573.85C267.075 567.373 269.699 561.193 274.28 556.613C278.86 552.033 285.04 549.407 291.516 549.293C297.993 549.18 304.261 551.583 309 556C333.693 579.057 366.216 591.88 400 591.88C433.783 591.88 466.31 579.057 491 556C495.74 551.583 502.006 549.18 508.483 549.293C514.96 549.407 521.14 552.033 525.72 556.613C530.303 561.193 532.926 567.373 533.04 573.85C533.153 580.327 530.75 586.593 526.333 591.333C509.776 607.97 490.086 621.157 468.403 630.14C446.72 639.123 423.47 643.72 400 643.667Z" fill="currentColor"/>
            <path d="M402.667 400C436.173 400 463.333 372.837 463.333 339.333C463.333 305.828 436.173 278.666 402.667 278.666C369.163 278.666 342 305.828 342 339.333C342 372.837 369.163 400 402.667 400Z" fill="currentColor"/>
            <path d="M666.666 755.333C660.036 755.333 653.676 752.7 648.99 748.01C644.3 743.323 641.666 736.963 641.666 730.333V333.333C637.156 272.944 609.983 216.492 565.596 175.297C521.21 134.102 462.89 111.209 402.333 111.209C341.776 111.209 283.457 134.102 239.07 175.297C194.684 216.492 167.511 272.944 163 333.333V730.333C163 736.963 160.366 743.323 155.678 748.01C150.989 752.7 144.631 755.333 138 755.333C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333V333.333C115.55 258.166 147.202 186.929 201.278 134.656C255.354 82.3832 327.623 53.1636 402.833 53.1636C478.043 53.1636 550.313 82.3832 604.39 134.656C658.466 186.929 690.116 258.166 692.666 333.333V730.333C692.623 733.69 691.913 737.003 690.58 740.08C689.246 743.16 687.313 745.943 684.893 748.27C682.476 750.597 679.62 752.417 676.49 753.63C673.36 754.843 670.023 755.423 666.666 755.333Z" fill="currentColor"/>
            <path d="M666.666 755.333H138C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333C113 723.703 115.634 717.343 120.322 712.657C125.011 707.967 131.37 705.333 138 705.333H666.666C673.296 705.333 679.656 707.967 684.343 712.657C689.033 717.343 691.666 723.703 691.666 730.333C691.666 736.963 689.033 743.323 684.343 748.01C679.656 752.7 673.296 755.333 666.666 755.333Z" fill="currentColor"/>
            </svg>

          </SvgIcon>
        );
      case 'heart':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z"/>
            </svg>
          </SvgIcon>
        );
      case 'star':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"/>
            </svg>
          </SvgIcon>
        );
      case 'music':
        return <MusicNoteIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'location':
        return <LocationOnIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'cake':
        return <CakeIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'chat':
        return <ChatIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      default:
        
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
          </SvgIcon>
        );
    }
  };

  
  const StatusIcon = getIconByName(parsedStatus.iconName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        delay: 0.2
      }}
      style={{
        position: 'absolute',
        left: '100%',
        top: '60%',
        zIndex: 10
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'transparent',
          filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.2))`,
          maxWidth: '200px',
          transform: 'translateX(10px)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: -8,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 14px 14px 0',
            borderColor: `transparent ${statusColor || '#D0BCFF'} transparent transparent`,
            transform: 'rotate(40deg)',
            filter: 'drop-shadow(-3px 2px 2px rgba(0,0,0,0.1))',
            zIndex: 0
          }
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${statusColor || '#D0BCFF'} 0%, ${gradientColor} 100%)`,
            color: textColor,
            padding: '8px 12px',
            borderRadius: '18px',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxShadow: `inset 0 0 10px rgba(255,255,255,0.15), 
                        0 1px 1px rgba(0,0,0,0.1),
                        0 4px 10px rgba(0,0,0,0.15)`,
            backdropFilter: 'blur(4px)',
            border: `1px solid ${statusColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            position: 'relative'
          }}
        >
          {StatusIcon}
          <Box 
            sx={{ 
              overflow: 'hidden',
              maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
            }}
          >
            <Box
              className="scrolling-text"
              sx={{
                whiteSpace: 'nowrap',
                display: 'inline-block',
                animation: parsedStatus.text.length > 15 ? 'scrollText 10s linear infinite' : 'none',
                '@keyframes scrollText': {
                  '0%': { transform: 'translateX(0%)' },
                  '25%': { transform: 'translateX(0%)' },
                  '75%': { transform: parsedStatus.text.length > 15 ? 'translateX(-50%)' : 'translateX(0%)' },
                  '100%': { transform: 'translateX(0%)' }
                },
                '&::after': parsedStatus.text.length > 15 ? {
                  content: `" • ${parsedStatus.text} • "`,
                  paddingLeft: '10px'
                } : {}
              }}
            >
              {parsedStatus.text}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};


const requireAuth = (user, isAuthenticated, navigate) => {
  if (!isAuthenticated || !user) {
    
    navigate('/login', { 
      state: { 
        from: window.location.pathname,
        message: 'Для выполнения этого действия необходима авторизация'
      } 
    });
    return false;
  }
  return true;
};


const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [ownedUsernames, setOwnedUsernames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [socials, setSocials] = useState([]);
  const [page, setPage] = useState(1);
  const [photoPage, setPhotoPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [loadingMorePhotos, setLoadingMorePhotos] = useState(false);
  const [loadingMoreVideos, setLoadingMoreVideos] = useState(false);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const [notifications, setNotifications] = useState([]);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState(null);
  
  const [fallbackAvatarUrl, setFallbackAvatarUrl] = useState('');
  

  const [selectedUsername, setSelectedUsername] = useState(null);
  const [usernameCardAnchor, setUsernameCardAnchor] = useState(null);
  const [usernameCardOpen, setUsernameCardOpen] = useState(false);
  

  const [userBanInfo, setUserBanInfo] = useState(null);
  

  const [isCurrentUserModerator, setIsCurrentUserModerator] = useState(false);
  
  
  const openLightbox = (imageUrl) => {
    console.log("Opening lightbox for image:", imageUrl);
    if (typeof imageUrl === 'string') {
      setCurrentImage(imageUrl);
      setLightboxIsOpen(true);
    } else {
      console.error("Invalid image URL provided to lightbox:", imageUrl);
    }
  };
  
  
  const closeLightbox = () => {
    setLightboxIsOpen(false);
  };
  
  
  const showNotification = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  
  const handleTabClick = (index) => {
    setTabValue(index);
  };
  
  const handleFollow = async () => {
    
    if (!requireAuth(currentUser, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      const response = await axios.post('/api/profile/follow', {
        followed_id: user.id
      });
      
      if (response.data.success) {
        setFollowing(response.data.is_following);
        setFollowersCount(prev => response.data.is_following ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };
  
  const handlePostCreated = (newPost) => {
    if (newPost) {
      
      if (tabValue === 0 && (!newPost.type || newPost.type === 'post')) {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
      
      
      if (newPost.type === 'stena') {
        const event = new CustomEvent('post_created', { detail: newPost });
        window.dispatchEvent(event);
      }

      
      setSnackbar({
        open: true,
        message: "Пост успешно создан",
        severity: "success"
      });
    }
  };

  const handleDeletePost = async (postId, updatedPost) => {
    
    if (!requireAuth(currentUser, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      
      if (updatedPost) {
        console.log('Updating post with ID:', postId, 'New data:', updatedPost);
        
        
        setPosts(prevPosts => prevPosts.map(post => 
          post.id.toString() === postId.toString() ? updatedPost : post
        ));
        
        
        showNotification('success', 'Пост успешно обновлен');
        return;
      }
      
      console.log('Deleting post/repost with ID:', postId);
      let response;
      
      
      const isRepost = postId.toString().startsWith('repost-');
      
      if (isRepost) {
        
        const repostId = postId.substring(7);
        console.log('Deleting repost with ID:', repostId);
        response = await axios.delete(`/api/reposts/${repostId}`);
      } else {
        console.log('Deleting regular post with ID:', postId);
        response = await axios.delete(`/api/posts/${postId}`);
      }
      
      if (response.data && response.data.success) {
        
        setPosts(prevPosts => prevPosts.filter(post => {
          if (isRepost) {
            
            return `repost-${post.id}` !== postId;
          }
          
          return post.id.toString() !== postId.toString();
        }));
        
        
        showNotification('success', isRepost ? 'Репост успешно удален' : 'Пост успешно удален');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('error', 'Не удалось удалить пост. Попробуйте позже');
    }
  };
  
  
  const loadMorePosts = async () => {
    if (loadingPosts || !hasMorePosts) return;
    
    try {
      setLoadingPosts(true);
      
      
      const nextPage = page + 1;
      setPage(nextPage);
      
      const response = await axios.get(`/api/profile/${username}/posts`, {
        params: {
          page: nextPage,
          per_page: 10
        }
      });
      
      if (response.data.posts && Array.isArray(response.data.posts)) {
        const newPosts = response.data.posts;
        setPosts(prev => {
          
          const prevArray = Array.isArray(prev) ? prev : [];
          return [...prevArray, ...newPosts];
        });
        setHasMorePosts(response.data.has_next);
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };
  
  const loadMorePhotos = async () => {
    if (loadingPhotos || !hasMorePhotos) return;
    
    try {
      setLoadingPhotos(true);
      
      
      const nextPage = photoPage + 1;
      setPhotoPage(nextPage);
      
      const response = await axios.get(`/api/profile/${username}/photos`, {
        params: {
          page: nextPage,
          per_page: 12
        }
      });
      
      if (response.data.media && Array.isArray(response.data.media)) {
        const newPhotos = response.data.media;
        setPhotos(prev => {
          
          const prevArray = Array.isArray(prev) ? prev : [];
          return [...prevArray, ...newPhotos];
        });
        setHasMorePhotos(response.data.has_next);
      } else {
        setHasMorePhotos(false);
      }
    } catch (error) {
      console.error('Error loading more photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };
  
  const loadMoreVideos = async () => {
    if (loadingVideos || !hasMoreVideos) return;
    
    try {
      setLoadingVideos(true);
      
      
      const nextPage = videoPage + 1;
      setVideoPage(nextPage);
      
      const response = await axios.get(`/api/profile/${username}/videos`, {
        params: {
          page: nextPage,
          per_page: 8
        }
      });
      
      if (response.data.media && Array.isArray(response.data.media)) {
        const newVideos = response.data.media;
        setVideos(prev => {
          
          const prevArray = Array.isArray(prev) ? prev : [];
          return [...prevArray, ...newVideos];
        });
        setHasMoreVideos(response.data.has_next);
      } else {
        setHasMoreVideos(false);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
    } finally {
      setLoadingVideos(false);
    }
  };
  
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log(`Fetching profile for username: ${username}`);
        
        const response = await axios.get(`/api/profile/${username}`);
        console.log("Profile API response:", response.data);
        
        
        console.log("Profile achievement data:", {
          rootAchievement: response.data.achievement_data,
          userAchievement: response.data.user?.achievement
        });
        
        
        if (response.data.user) {
          
          if (response.data.user.verification_status === undefined && response.data.verification) {
            response.data.user.verification_status = response.data.verification.status || null;
          }
          
          
          
          if (response.data.achievement) {
            response.data.user.achievement = response.data.achievement;
            console.log('Copied achievement data from root to user object:', response.data.achievement);
          }
          
          setUser(response.data.user);
          
          
          if (response.data.user.total_likes !== undefined) {
            setTotalLikes(response.data.user.total_likes);
          }
          
          
          if (response.data.subscription) {
            response.data.user.subscription = response.data.subscription;
            console.log('Subscription data found:', response.data.subscription);
          } else if (response.data.user.subscription) {
            console.log('Subscription data found in user object:', response.data.user.subscription);
          } else {
            console.log('No subscription data found in API response');
            console.log('Full API response:', response.data);
          }
          
          if (response.data.user.posts) {
            
            const postsData = Array.isArray(response.data.user.posts) ? response.data.user.posts : [];
            setPosts(postsData);
            setHasMorePosts(postsData.length >= 10);
          } else {
            setPosts([]);
          }
          
          if (response.data.user.photos) {
            
            const photosData = Array.isArray(response.data.user.photos) ? response.data.user.photos : [];
            setPhotos(photosData);
            setHasMorePhotos(photosData.length >= 12);
          } else {
            setPhotos([]);
          }
          
          if (response.data.user.videos) {
            
            const videosData = Array.isArray(response.data.user.videos) ? response.data.user.videos : [];
            setVideos(videosData);
            setHasMoreVideos(videosData.length >= 8);
          } else {
            setVideos([]);
          }
          
          
          if (response.data.user.followers_count !== undefined) {
            setFollowersCount(response.data.user.followers_count);
          }
          
          if (response.data.user.following_count !== undefined) {
            setFollowingCount(response.data.user.following_count);
          }
          
          
          if (response.data.user.is_following !== undefined) {
            setFollowing(response.data.user.is_following);
          } else if (response.data.is_following !== undefined) {
            setFollowing(response.data.is_following);
          }
          
          if (response.data.user.posts_count !== undefined) {
            setPostsCount(response.data.user.posts_count);
          } else if (response.data.posts_count !== undefined) {
            setPostsCount(response.data.posts_count);
          }
          
          
          if (response.data.socials) {
            setSocials(response.data.socials);
          }
          
          
          try {
            const usernamesResponse = await axios.get(`/api/username/purchased/${response.data.user.id}`);
            if (usernamesResponse.data.success) {
              const otherUsernames = usernamesResponse.data.usernames
                .filter(item => !item.is_active && item.username !== response.data.user.username)
                .map(item => item.username);
              
              setOwnedUsernames(otherUsernames);
            }
          } catch (error) {
            console.error('Error fetching owned usernames:', error);
            setOwnedUsernames([]);
          }
          

          if (response.data.user.ban || response.data.ban) {
            setUserBanInfo(response.data.user.ban || response.data.ban);
          } else {
            setUserBanInfo(null);
          }
          

          if (response.data.current_user_is_moderator !== undefined) {
            setIsCurrentUserModerator(response.data.current_user_is_moderator);
          }
        } else {
          console.error('User data not found in response', response.data);
          setUser(null); 
        }
      } catch (error) {
        console.error('Error fetching profile', error);
        if (error.response && error.response.status === 404) {
          
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchUserProfile();
  }, [username, setLoading, setUser, setPosts, setHasMorePosts, setPhotos, setHasMorePhotos, setVideos, setHasMoreVideos, setFollowersCount, setFollowingCount, setFollowing, setPostsCount, setSocials, setTotalLikes]);
  
  
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      
      try {
        setLoadingPosts(true);
        const profileUsername = username || (user && user.username);
        if (!profileUsername) return;
        
        
        setPage(1);
        
        const response = await axios.get(`/api/profile/${profileUsername}/posts?page=1`);
        setPosts(response.data.posts);
        setHasMorePosts(response.data.has_next);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };
    
    if (tabValue === 0) {
      fetchUserPosts();
    }
  }, [username, user, tabValue]);
  
  
  useEffect(() => {
    const fetchUserPhotos = async () => {
      if (!user) return;
      
      try {
        setLoadingPhotos(true);
        const profileUsername = username || (user && user.username);
        if (!profileUsername) return;
        
        
        setPhotoPage(1);
        
        const response = await axios.get(`/api/profile/${profileUsername}/photos?page=1`);
        
        if (response.data.media) {
          setPhotos(response.data.media);
          setHasMorePhotos(response.data.has_next);
        }
      } catch (error) {
        console.error('Error fetching user photos:', error);
      } finally {
        setLoadingPhotos(false);
      }
    };
    
    if (tabValue === 1) {
      fetchUserPhotos();
    }
  }, [username, user, tabValue]);
  
  
  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!user) return;
      
      try {
        setLoadingVideos(true);
        const profileUsername = username || (user && user.username);
        if (!profileUsername) return;
        
        
        setVideoPage(1);
        
        const response = await axios.get(`/api/profile/${profileUsername}/videos?page=1`);
        
        if (response.data.media) {
          setVideos(response.data.media);
          setHasMoreVideos(response.data.has_next);
        }
      } catch (error) {
        console.error('Error fetching user videos:', error);
      } finally {
        setLoadingVideos(false);
      }
    };
    
    if (tabValue === 2) {
      fetchUserVideos();
    }
  }, [username, user, tabValue]);

  
  useEffect(() => {
    
    if (user && user.id) {
      setLoadingFollowers(true);
      setLoadingFollowing(true);
      setLoadingFriends(true);
      
      console.log(`Загрузка подписчиков для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/followers`)
        .then(response => {
          console.log('Ответ API подписчиков:', response.data);
          if (response.data && response.data.followers) {
            
            const followersData = Array.isArray(response.data.followers) 
              ? response.data.followers.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${followersData.length} подписчиков`);
            setFollowers(followersData);
          } else {
            
            console.warn('Нет данных о подписчиках в ответе API');
            setFollowers([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки подписчиков:', error);
          setFollowers([]); 
        })
        .finally(() => {
          setLoadingFollowers(false);
        });
      
      console.log(`Загрузка подписок для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/following`)
        .then(response => {
          console.log('Ответ API подписок:', response.data);
          if (response.data && response.data.following) {
            
            const followingData = Array.isArray(response.data.following) 
              ? response.data.following.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${followingData.length} подписок`);
            setFollowingList(followingData);
          } else {
            
            console.warn('Нет данных о подписках в ответе API');
            setFollowingList([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки подписок:', error);
          setFollowingList([]); 
        })
        .finally(() => {
          setLoadingFollowing(false);
        });
        
      console.log(`Загрузка друзей для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/friends`)
        .then(response => {
          console.log('Ответ API друзей:', response.data);
          if (response.data && response.data.friends) {
            
            const friendsData = Array.isArray(response.data.friends) 
              ? response.data.friends.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${friendsData.length} друзей`);
            setFriends(friendsData);
          } else {
            
            console.warn('Нет данных о друзьях в ответе API');
            setFriends([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки друзей:', error);
          setFriends([]); 
        })
        .finally(() => {
          setLoadingFriends(false);
        });
    }
  }, [user]);

  
  useEffect(() => {
    const handleScroll = () => {
      
      if (tabValue !== 0) return;
      
      
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >= 
        document.documentElement.offsetHeight
      ) {
        loadMorePosts();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabValue, loadMorePosts]);

  
  useEffect(() => {
    const handleScroll = () => {
      
      if (tabValue === 1) { 
        if (
          window.innerHeight + document.documentElement.scrollTop + 200 >= 
          document.documentElement.offsetHeight
        ) {
          loadMorePhotos();
        }
      } else if (tabValue === 2) { 
        if (
          window.innerHeight + document.documentElement.scrollTop + 200 >= 
          document.documentElement.offsetHeight
        ) {
          loadMoreVideos();
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabValue, loadMorePhotos, loadMoreVideos]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.post(`/api/notifications/${notification.id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  
  useEffect(() => {
    if (posts && posts.length > 0) {
      
      let likesCount = 0;
      posts.forEach(post => {
        if (post && post.likes_count) {
          likesCount += parseInt(post.likes_count) || 0;
        }
      });
      
      
      const fetchTotalLikes = async () => {
        try {
          if (user && user.id) {
            const response = await axios.get(`/api/profile/${user.id}/stats`);
            if (response.data && response.data.total_likes !== undefined) {
              setTotalLikes(response.data.total_likes);
            } else {
              setTotalLikes(likesCount);
            }
          }
        } catch (error) {
          console.error('Error fetching total likes:', error);
          setTotalLikes(likesCount);
        }
      };
      
      fetchTotalLikes();
    }
  }, [posts, user]);

  
  const fetchOnlineStatus = async () => {
    try {
      if (!username) return;
      
      const response = await axios.get(`/api/profile/${username}/online_status`);
      
      if (response.data.success) {
        setIsOnline(response.data.is_online);
        setLastActive(response.data.last_active);
      }
    } catch (error) {
      console.error('Error fetching online status:', error);
    }
  };
  
  
  useEffect(() => {
    if (username) {
      fetchOnlineStatus();
      
      
      const interval = setInterval(fetchOnlineStatus, 30000);
      
      return () => clearInterval(interval);
    }
  }, [username]);

  
  useEffect(() => {
    if (user) {
      console.log('User state after setting:', {
        name: user.name,
        achievement: user.achievement,
        verification_status: user.verification_status
      });
    }
  }, [user]);


  const handleUsernameClick = (event, username) => {
    event.preventDefault();
    setSelectedUsername(username);
    setUsernameCardOpen(true);
  };
  
  const handleCloseUsernameCard = () => {
    setUsernameCardOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h5">Пользователь не найден</Typography>
        <Button 
            component={Link} 
            to="/" 
          variant="contained" 
          color="primary" 
            sx={{ mt: 2, borderRadius: 20, textTransform: 'none' }}
        >
          Вернуться на главную
        </Button>
        </Box>
      </Container>
    );
  }
  
  const isCurrentUser = currentUser && currentUser.username === user.username;

  
  const PhotosGrid = () => {
    return (
      <ContentLoader loading={loadingPhotos} skeletonCount={1} height="300px">
        {photos.length > 0 ? (
          <Box sx={{ mt: 0.5 }}>
            <Grid container spacing={0.5}>
              {photos.map((photo, index) => {
                
                if (!photo || typeof photo !== 'object' || !photo.url) {
                  return null;
                }
                
                
                const imageUrl = photo.url || '';
                
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={`photo-${index}`}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        paddingTop: '100%', 
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                        },
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => openLightbox(imageUrl)}
                    >
                      <Box
                        component="img"
                        src={imageUrl}
                        alt={photo.content || `Фото ${index + 1}`}
                        onError={(e) => {
                          
                          console.error(`Failed to load image: ${imageUrl}`);
                          e.currentTarget.src = '/static/uploads/system/image_placeholder.jpg';
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            
            {loadingMorePhotos && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.5 }}>
                <CircularProgress size={30} />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 0.5
          }}>
            <Typography color="text.secondary">
              Нет фотографий для отображения
            </Typography>
          </Box>
        )}
      </ContentLoader>
    );
  };
  
  
  const VideosGrid = () => {
    return (
      <ContentLoader loading={loadingVideos} skeletonCount={1} height="300px">
        {videos.length > 0 ? (
          <Box sx={{ mt: 0.5 }}>
            <Grid container spacing={0.5}>
              {videos.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} key={`video-${index}`}>
                  <Box sx={{ 
                    borderRadius: '10px', 
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    height: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative'
                  }}>
                    <video 
                      src={video.url} 
                      controls
                      style={{ 
                        width: '100%',
                        borderRadius: '10px 10px 0 0',
                        backgroundColor: '#111',
                      }} 
                      onError={(e) => {
                        console.error("Failed to load video");
                        const videoId = video.id || video.url.split('/').pop().split('.')[0];
                        if (videoId) {
                          e.currentTarget.src = `/static/uploads/post/${videoId}/${video.url.split('/').pop()}`;
                        }
                      }}
                    />
                    
                    {video.content && (
                      <Box sx={{ p: 0.5, backgroundColor: 'rgba(26, 26, 26, 0.9)' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          {video.content}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            {loadingMoreVideos && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.5 }}>
                <CircularProgress size={30} />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 0.5
          }}>
            <Typography color="text.secondary">
              Нет видео для отображения
            </Typography>
          </Box>
        )}
      </ContentLoader>
    );
  };

  
  const WallPostsTab = ({ userId }) => {
    const [wallPosts, setWallPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMorePosts, setLoadingMorePosts] = useState(false);
    const observerRef = useRef(null);
    const loaderRef = useRef(null); 
    const isMounted = useRef(true);
    const loadLock = useRef(false);

    useEffect(() => {
      
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    
    const fetchWallPosts = useCallback(async (pageNum = 1, initialLoad = false) => {
      
      if (loadLock.current && !initialLoad) return;
      
      try {
        initialLoad ? setLoading(true) : setLoadingMorePosts(true);
        loadLock.current = true;
        
        const response = await axios.get(`/api/profile/${userId}/wall`, {
          params: {
            page: pageNum,
            per_page: 10
          }
        });
        
        if (!isMounted.current) return;
        
        if (response.data.posts && Array.isArray(response.data.posts)) {
          if (initialLoad) {
            setWallPosts(response.data.posts);
          } else {
            setWallPosts(prev => [...prev, ...response.data.posts]);
          }
          setHasMorePosts(response.data.has_next);
        } else {
          if (initialLoad) setWallPosts([]);
          setHasMorePosts(false);
        }
      } catch (error) {
        console.error('Error fetching wall posts:', error);
        if (initialLoad) setWallPosts([]);
      } finally {
        if (isMounted.current) {
          initialLoad ? setLoading(false) : setLoadingMorePosts(false);
          
          
          setTimeout(() => {
            loadLock.current = false;
          }, 300);
        }
      }
    }, [userId]);
    
    
    useEffect(() => {
      if (userId) {
        setPage(1);
        fetchWallPosts(1, true);
      }
      
      return () => {
        
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, [userId, fetchWallPosts]);
    
    
    useEffect(() => {
      const handleObserver = (entries) => {
        const [entry] = entries;
        
        
        if (entry.isIntersecting && hasMorePosts && !loadingMorePosts && !loadLock.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchWallPosts(nextPage, false);
        }
      };
      
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      
      observerRef.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '0px', 
        threshold: 0.5     
      });
      
      
      if (loaderRef.current && hasMorePosts) {
        observerRef.current.observe(loaderRef.current);
      }
      
    }, [hasMorePosts, page, loadingMorePosts, fetchWallPosts]);

    
    const handleDeletePost = (postId, updatedPost) => {
      if (updatedPost) {
        
        setWallPosts(prevPosts => prevPosts.map(post => 
          post.id.toString() === postId.toString() ? updatedPost : post
        ));
      } else {
        
        setWallPosts(prevPosts => prevPosts.filter(post => 
          post.id.toString() !== postId.toString()
        ));
      }
    };
    
    
    useEffect(() => {
      const handleGlobalPostCreated = (event) => {
        const newPost = event.detail;
        
        if (newPost.type === 'stena' && newPost.recipient_id === parseInt(userId)) {
          setWallPosts(prevPosts => [newPost, ...prevPosts]);
        }
      };
      
      
      window.addEventListener('post_created', handleGlobalPostCreated);
      
      
      return () => {
        window.removeEventListener('post_created', handleGlobalPostCreated);
      };
    }, [userId]);

    return (
      <ContentLoader loading={loading} skeletonCount={3} height="120px">
        {wallPosts.length > 0 ? (
          <Box sx={{ mt: 0.5 }}>
            {/* Отображаем все посты на стене */}
            {wallPosts.map((post, index) => (
              <Box key={post.id}>
                <Post post={post} onDelete={handleDeletePost} showActions />
              </Box>
            ))}
            
            {/* Элемент-сентинель для бесконечной прокрутки */}
            {hasMorePosts && (
              <Box 
                ref={loaderRef} 
                sx={{ 
                  width: '100%', 
                  height: '50px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  my: 1
                }}
              >
                {loadingMorePosts && <CircularProgress size={24} />}
              </Box>
            )}
            
            {/* Сообщение, когда постов больше нет */}
            {!hasMorePosts && wallPosts.length > 5 && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Больше записей нет
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 0.5
          }}>
            <Typography color="text.secondary">
              На стене нет записей
            </Typography>
          </Box>
        )}
      </ContentLoader>
    );
  };

  
  const PostsTab = () => {
    
    const filteredPosts = posts.filter(post => !post.type || post.type !== 'stena');
    
    return (
      <ContentLoader loading={loadingPosts} skeletonCount={3} height="120px">
        {filteredPosts.length > 0 ? (
          <Box sx={{ mt: 0.5 }}>
            {filteredPosts.map(post => (
              post.is_repost ? (
                <RepostItem key={post.id} post={post} onDelete={handleDeletePost} />
              ) : (
                <Post key={post.id} post={post} onDelete={handleDeletePost} showActions />
              )
            ))}
            
            
            <Box sx={{ textAlign: 'center', mt: 0.5, mb: 0.5 }}>
              {hasMorePosts ? (
                <Button 
                  variant="outlined" 
                  onClick={loadMorePosts}
                  disabled={loadingMorePosts}
                  startIcon={loadingMorePosts ? <CircularProgress size={16} /> : null}
                  sx={{ 
                    py: 1,
                    px: 3, 
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {loadingMorePosts ? 'Загрузка...' : 'Загрузить еще'}
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Больше постов нет
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            padding: 4,
            mt: 2
          }}>
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: 'rgba(208, 188, 255, 0.1)',
                mb: 2
              }}
            >
              <ArticleOutlinedIcon sx={{ fontSize: 40, color: 'rgba(208, 188, 255, 0.6)' }} />
            </Box>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'medium' }}>
              Нет публикаций
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
              Пользователь еще не опубликовал ни одного поста. Публикации будут отображаться здесь, когда они появятся.
            </Typography>
          </Box>
        )}
      </ContentLoader>
    );
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: 0, 
        pb: 4, 
        px: { xs: 0.5, sm: 1 },
        width: '100%',
        marginRight: 'auto',
        marginLeft: '0!important',
        paddingTop: '24px',
        paddingBottom: '40px',
        paddingLeft: '0',
        paddingRight: '0',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Grid 
        container 
        spacing={0.5}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: { xs: 'nowrap', md: 'nowrap' }
        }}
      >
        
        <Grid item xs={12} md={5}>
          
          <Paper sx={{ 
            p: 0, 
            borderRadius: '16px', 
            background: theme => {
              
              const currentTheme = localStorage.getItem('theme');
              if (currentTheme === 'amoled') {
                return 'linear-gradient(135deg, #000000 0%, #000000 100%)';
              }
              return theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #232526 0%, #121212 100%)'
                : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)';
            },
            boxShadow: theme => {
              
              const currentTheme = localStorage.getItem('theme');
              if (currentTheme === 'amoled') {
                return '0 10px 30px rgba(0, 0, 0, 0.5)';
              }
              return theme.palette.mode === 'dark'
                ? '0 10px 30px rgba(0, 0, 0, 0.25)'
                : '0 10px 30px rgba(0, 0, 0, 0.1)';
            },
            mb: { xs: 1, md: 0 },
            overflow: 'hidden',
            position: { xs: 'relative', md: 'sticky' },
            top: { md: '80px' },
            zIndex: 1,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 14px 35px rgba(0, 0, 0, 0.35)'
                : '0 14px 35px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)'
            },
            
            ...(user?.subscription && {
              border: (user.status_color && user.status_text && user.subscription) 
                ? `4px solid ${user.status_color}` 
                : user?.subscription 
                  ? `4px solid ${user.subscription.type === 'premium' ? 'rgba(186, 104, 200)' : user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255)' : user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255)' : 'rgba(66, 165, 245)'}` 
                  : theme => theme.palette.mode === 'dark'
                    ? '4px solid #121212'
                    : '4px solid #ffffff',
              boxShadow: (user.status_color && user.status_text && user.subscription)
                ? `0 0 15px ${user.status_color}33`  
                : user.subscription.type === 'premium' 
                  ? '0 0 15px rgba(186, 104, 200, 0.2)' 
                  : user.subscription.type === 'pick-me'
                    ? '0 0 15px rgba(208, 188, 255, 0.2)'
                    : user.subscription.type === 'ultimate' 
                      ? '0 0 15px rgba(124, 77, 255, 0.2)' 
                      : '0 0 15px rgba(66, 165, 245, 0.2)',
              '&:hover': {
                boxShadow: (user.status_color && user.status_text && user.subscription)
                  ? `0 0 20px ${user.status_color}4D`  
                  : user.subscription.type === 'premium' 
                    ? '0 0 20px rgba(186, 104, 200, 0.3)' 
                    : user.subscription.type === 'pick-me'
                      ? '0 0 20px rgba(208, 188, 255, 0.3)'
                      : user.subscription.type === 'ultimate' 
                        ? '0 0 20px rgba(124, 77, 255, 0.3)' 
                        : '0 0 20px rgba(66, 165, 245, 0.3)',
                transform: 'translateY(-2px)'
              }
            })
          }}>
            
            {user?.banner_url ? (
              <Box sx={{ 
                width: '100%',
                height: { xs: 150, sm: 200 },
                backgroundImage: `url(${user.banner_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: theme => theme.palette.mode === 'dark'
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(18,18,18,0.45) 100%)'
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 100%)'
                }
              }}>
                
                
              </Box>
            ) : (
              <Box sx={{ 
                width: '100%',
                height: { xs: 100, sm: 120 },
                background: theme => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)'
                  : 'linear-gradient(135deg, #7c4dff 0%, #b388ff 100%)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                  opacity: 0.4
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: theme => theme.palette.mode === 'dark'
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(18,18,18,0.9) 100%)'
                    : 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)'
                }
              }}>
                
                
              </Box>
            )}
            
            
            <Box sx={{ px: 3, pb: 3, pt: 0, mt: -7 }}>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                
                <Box sx={{ position: 'relative' }}>
                  <Tooltip title="Открыть аватар" arrow placement="top">
                    <Avatar 
                      src={user?.avatar_url} 
                      alt={user?.name}
                      onClick={() => {
                        const imageUrl = user?.avatar_url || fallbackAvatarUrl;
                        if (imageUrl) openLightbox(imageUrl);
                      }}
                      sx={{ 
                        width: { xs: 110, sm: 130 }, 
                        height: { xs: 110, sm: 130 }, 
                        border: (user?.status_color && user?.status_text && user?.subscription) 
                          ? `4px solid ${user.status_color}` 
                          : user?.subscription 
                            ? `4px solid ${user.subscription.type === 'premium' ? 'rgba(186, 104, 200)' : user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255)' : user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255)' : 'rgba(66, 165, 245)'}` 
                            : theme => theme.palette.mode === 'dark'
                              ? '4px solid #121212'
                              : '4px solid #ffffff',
                        boxShadow: (user?.status_color && user?.status_text && user?.subscription) 
                          ? `0 0 15px ${user.status_color}80` 
                          : user?.subscription 
                            ? (user.subscription.type === 'premium' ? '0 0 15px rgba(186, 104, 200, 0.5)' : user.subscription.type === 'pick-me' ? '0 0 15px rgba(208, 188, 255, 0.5)' : user.subscription.type === 'ultimate' ? '0 0 15px rgba(124, 77, 255, 0.5)' : '0 0 15px rgba(66, 165, 245, 0.5)') 
                            : '0 8px 20px rgba(0, 0, 0, 0.25)',
                        bgcolor: 'primary.dark',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: (user?.status_color && user?.status_text && user?.subscription) 
                            ? `0 0 20px ${user.status_color}B3` 
                            : user?.subscription 
                              ? (user.subscription.type === 'premium' ? '0 0 20px rgba(186, 104, 200, 0.7)' : user.subscription.type === 'pick-me' ? '0 0 20px rgba(208, 188, 255, 0.7)' : user.subscription.type === 'ultimate' ? '0 0 20px rgba(124, 77, 255, 0.7)' : '0 0 20px rgba(66, 165, 245, 0.7)') 
                              : '0 10px 25px rgba(0, 0, 0, 0.35)',
                          border: (user?.status_color && user?.status_text && user?.subscription) 
                            ? `4px solid ${user.status_color}CC` 
                            : user?.subscription 
                              ? `4px solid ${user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.8)' : user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.8)' : user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.8)' : 'rgba(66, 165, 245, 0.8)'}`
                              : '4px solid rgba(208, 188, 255, 0.4)'
                        }
                      }}
                      onError={(e) => {
                        if (user?.id) {
                          const fallbackSrc = `/static/uploads/avatar/${user.id}/${user.photo || 'default.png'}`;
                          e.currentTarget.src = fallbackSrc;
                          setFallbackAvatarUrl(fallbackSrc);
                        }
                      }}
                    />
                  </Tooltip>
                  
                  
                  {isOnline && user?.subscription?.type !== 'channel' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#4caf50',
                        border: theme => theme.palette.mode === 'dark'
                          ? '2px solid #121212'
                          : '2px solid #ffffff',
                        bottom: 5,
                        right: 15,
                        boxShadow: '0 0 8px rgba(76, 175, 80, 0.9)',
                        zIndex: 2,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)'
                          },
                          '70%': {
                            boxShadow: '0 0 0 6px rgba(76, 175, 80, 0)'
                          },
                          '100%': {
                            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
                          }
                        }
                      }}
                    />
                  )}
                  
                  
                  <UserStatus statusText={user?.status_text} statusColor={user?.status_color} />
                </Box>
                

              </Box>
              
              
              <Box sx={{ mt: 2, whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        background: theme => theme.palette.mode === 'dark' 
                          ? 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)'
                          : 'linear-gradient(90deg, #000 0%, rgba(0,0,0,0.8) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                      {user?.name || 'Пользователь'}
                    </Typography>
                    <VerificationBadge status={user?.verification_status} size="small" />
                    

                    {user?.achievement && (
                      <Box 
                        component="img" 
                        sx={{ 
                          width: 'auto', 
                          height: 25, 
                          ml: 0.5
                        }} 
                        src={`/static/images/bages/${user.achievement.image_path}`} 
                        alt={user.achievement.bage}
                        onError={(e) => {
                          console.error("Achievement badge failed to load:", e);
                          if (e.target && e.target instanceof HTMLImageElement) {
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                    )}
                  </Box>


                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: theme => theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 4,
                      border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    @{user?.username || 'username'}
                  </Typography>
                  

                  {userBanInfo ? (
                    <Tooltip 
                      title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Аккаунт заблокирован</Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>Причина: {userBanInfo.reason}</Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>До: {userBanInfo.end_date}</Typography>
                          {userBanInfo.remaining_days > 0 && (
                            <Typography variant="body2">
                              Осталось дней: {userBanInfo.remaining_days}
                            </Typography>
                          )}
                        </Box>
                      } 
                      arrow 
                      placement="top"
                    >
                      <Typography 
                        variant="caption" 
                        sx={{
                          display: 'flex', 
                          alignItems: 'center',
                          color: '#fff',
                          fontWeight: 500,
                          background: 'rgba(211, 47, 47, 0.2)',
                          px: 1,
                          py: 0.3,
                          borderRadius: 4,
                          border: '1px solid rgba(211, 47, 47, 0.4)',
                          '&:hover': {
                            background: 'rgba(211, 47, 47, 0.3)',
                          },
                          animation: 'pulse-red 2s infinite',
                          '@keyframes pulse-red': {
                            '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
                            '70%': { boxShadow: '0 0 0 6px rgba(211, 47, 47, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
                          }
                        }}
                      >
                        <BlockIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.9 }} />
                        <Box component="span">В бане</Box>
                      </Typography>
                    </Tooltip>
                  ) : isOnline && user?.subscription?.type !== 'channel' ? (
                    <Typography 
                      variant="caption" 
                      sx={{
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'success.light',
                        fontWeight: 500,
                        background: theme => theme.palette.mode === 'dark' 
                          ? 'rgba(46, 125, 50, 0.1)' 
                          : 'rgba(46, 125, 50, 0.15)',
                        px: 1,
                        py: 0.3,
                        borderRadius: 4,
                        border: '1px solid rgba(46, 125, 50, 0.2)'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: '8px', 
                          height: '8px', 
                          bgcolor: 'success.main', 
                          borderRadius: '50%',
                          mr: 0.5,
                          boxShadow: '0 0 4px rgba(76, 175, 80, 0.6)'
                        }} 
                      />
                      онлайн
                    </Typography>
                  ) : !isOnline && user?.subscription?.type !== 'channel' ? (
                    <Typography 
                      variant="caption" 
                      sx={{
                        display: 'flex', 
                        alignItems: 'center',
                        color: theme => theme.palette.text.secondary,
                        fontWeight: 500,
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        px: 1,
                        py: 0.3,
                        borderRadius: 4,
                        border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5, opacity: 0.7 }} />
                      {lastActive ? `${lastActive}` : "не в сети"}
                    </Typography>
                  ) : null}
                                    {user?.subscription && (
                    user.subscription.type === 'channel' ? (
                      <Chip
                        icon={<ChatIcon fontSize="small" />}
                        label="Канал"
                        size="small"
                        sx={{
                          bgcolor: (user.status_color) 
                            ? `${user.status_color}26` 
                            : theme => theme.palette.mode === 'dark'
                              ? 'rgba(208, 188, 255, 0.15)' 
                              : 'rgba(124, 77, 255, 0.15)',
                          color: (user.status_color) 
                            ? user.status_color 
                            : theme => theme.palette.mode === 'dark'
                              ? '#d0bcff'
                              : '#7c4dff',
                          fontWeight: 'bold',
                          border: '1px solid',
                          borderColor: (user.status_color) 
                            ? `${user.status_color}4D` 
                            : theme => theme.palette.mode === 'dark'
                              ? 'rgba(208, 188, 255, 0.3)'
                              : 'rgba(124, 77, 255, 0.3)',
                          '& .MuiChip-icon': {
                            color: 'inherit'
                          },
                          
                          animation: 'pulse-light 2s infinite',
                          '@keyframes pulse-light': {
                            '0%': {
                              boxShadow: (user.status_color) ? 
                                `0 0 0 0 ${user.status_color}66` : 
                                '0 0 0 0 rgba(124, 77, 255, 0.4)'
                            },
                            '70%': {
                              boxShadow: (user.status_color) ? 
                                `0 0 0 6px ${user.status_color}00` : 
                                '0 0 0 6px rgba(124, 77, 255, 0)'
                            },
                            '100%': {
                              boxShadow: (user.status_color) ? 
                                `0 0 0 0 ${user.status_color}00` : 
                                '0 0 0 0 rgba(124, 77, 255, 0)'
                            }
                          }
                        }}
                      />
                    ) : (
                      <Tooltip title={`Подписка ${user.subscription.type === 'pick-me' ? 'Пикми' : user.subscription.type} активна до ${new Date(user.subscription.expires_at).toLocaleDateString()}`}>
                        <Chip
                          icon={<DiamondIcon fontSize="small" />}
                          label={user.subscription.type === 'pick-me' ? 'Пикми' : 
                                user.subscription.type.charAt(0).toUpperCase() + user.subscription.type.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.15)' : 
                                    user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.15)' :
                                    user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.15)' : 
                                    'rgba(66, 165, 245, 0.15)',
                            color: user.subscription.type === 'premium' ? '#ba68c8' : 
                                  user.subscription.type === 'ultimate' ? '#7c4dff' : 
                                  user.subscription.type === 'pick-me' ? 'rgb(208, 188, 255)' :
                                  '#42a5f5',
                            fontWeight: 'bold',
                            border: '1px solid',
                            borderColor: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.3)' : 
                                        user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.3)' :
                                        user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.3)' :
                                        'rgba(66, 165, 245, 0.3)',
                            '& .MuiChip-icon': {
                              color: 'inherit'
                            },
                            
                            animation: 'pulse-light 2s infinite',
                            '@keyframes pulse-light': {
                              '0%': {
                                boxShadow: (user.status_color && user.status_text) ? 
                                  `0 0 0 0 ${user.status_color}66` : 
                                  '0 0 0 0 rgba(124, 77, 255, 0.4)'
                              },
                              '70%': {
                                boxShadow: (user.status_color && user.status_text) ? 
                                  `0 0 0 6px ${user.status_color}00` : 
                                  '0 0 0 6px rgba(124, 77, 255, 0)'
                              },
                              '100%': {
                                boxShadow: (user.status_color && user.status_text) ? 
                                  `0 0 0 0 ${user.status_color}00` : 
                                  '0 0 0 0 rgba(124, 77, 255, 0)'
                              }
                            }
                          }}
                        />
                      </Tooltip>
                    )
                  )}
                  
                </Box>
                  
                {ownedUsernames.length > 0 && (
                  <Box sx={{ 
                    display: 'flex',
                    mt: 1,
                    width: '100%'
                  }}>
                    <Box 
                      sx={{ 
                        color: theme => theme.palette.text.secondary,
                        backgroundColor: (user.status_color && user.status_text && user.subscription) ? 
                          `${user.status_color}1A` : 
                          theme => theme.palette.mode === 'dark' ? 'rgba(208, 188, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 4,
                        border: (user.status_color && user.status_text && user.subscription) ? 
                          `1px solid ${user.status_color}33` : 
                          theme => theme.palette.mode === 'dark' ? '1px solid rgba(208, 188, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        maxWidth: '100%',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: theme => theme.palette.text.secondary, mr: 0.5 }}>
                        А также:
                      </Typography>
                      {ownedUsernames.slice(0, 3).map((usernameItem, idx) => (
                        <React.Fragment key={idx}>
                          <Typography 
                            variant="caption" 
                            component="span" 
                            sx={{ 
                              color: (user.status_color && user.status_text && user.subscription) ? 
                                user.status_color : 
                                theme => theme.palette.mode === 'dark' ? '#d0bcff' : '#7c4dff',
                              fontWeight: 500,
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                            onClick={(e) => handleUsernameClick(e, usernameItem)}
                          >
                            @{usernameItem}
                          </Typography>
                          {idx < Math.min(ownedUsernames.length, 3) - 1 && (
                            <Typography variant="caption" component="span" sx={{ mx: 0.5, color: theme => theme.palette.text.disabled }}>
                              ,
                            </Typography>
                          )}
                        </React.Fragment>
                      ))}
                      {ownedUsernames.length > 3 && (
                        <Typography variant="caption" component="span" sx={{ ml: 0.5, color: theme => theme.palette.text.disabled }}>
                          и ещё {ownedUsernames.length - 3}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                
                {userBanInfo && (isCurrentUserModerator || (currentUser && currentUser.id === 3)) && (
                  <Box sx={{ 
                    mt: 2,
                    p: 1.5,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    border: '1px solid rgba(211, 47, 47, 0.3)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5
                  }}>
                    <WarningIcon color="error" sx={{ fontSize: 22, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
                        Аккаунт заблокирован
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Причина: {userBanInfo.reason}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        До {userBanInfo.end_date} 
                        {userBanInfo.remaining_days > 0 && ` (осталось ${userBanInfo.remaining_days} дн.)`}
                      </Typography>
                      
                      {currentUser && currentUser.id === 3 && (
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed rgba(211, 47, 47, 0.3)' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                            {userBanInfo.is_auto_ban ? 'Автоматический бан системой' : (
                              userBanInfo.admin ? `Бан выдал: ${userBanInfo.admin.name} (@${userBanInfo.admin.username})` : 'Бан выдан администрацией'
                            )}
                          </Typography>
                          {userBanInfo.start_date && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                              Начало бана: {userBanInfo.start_date}
                            </Typography>
                          )}
                          {userBanInfo.details && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                              Детали: {userBanInfo.details}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                
                {/* Блок с информацией о пользователе */}
                {user?.about && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1,
                      lineHeight: 1.5,
                      color: theme => theme.palette.text.primary,
                      p: 1.5,
                      borderRadius: 2,
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      backdropFilter: 'blur(10px)',
                      border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {user.about}
                  </Typography>

                )}
                
                
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: user?.subscription?.type === 'channel' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                  gap: 1, 
                  mt: 1 
                }}>
                  
                  <Paper sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    textAlign: 'center',
                    background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    backdropFilter: 'blur(5px)',
                    border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: (user.status_color && user.status_text && user.subscription) ? 
                          user.status_color : 
                          'primary.main'
                      }}
                    >
                      {postsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      публикаций
                    </Typography>
                  </Paper>
                  
                  
                  <Paper 
                    component={Link}
                    to={`/profile/${user?.username}/followers`}
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      textAlign: 'center',
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      backdropFilter: 'blur(5px)',
                      border: (user.status_color && user.status_text && user.subscription) ? 
                        `1px solid ${user.status_color}33` : 
                        theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                        transform: 'translateY(-2px)',
                        boxShadow: (user.status_color && user.status_text && user.subscription) ? 
                          `0 4px 15px ${user.status_color}33` : 
                          '0 4px 15px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: (user.status_color && user.status_text && user.subscription) ? 
                          user.status_color : 
                          'primary.main'
                      }}
                    >
                      {user?.subscription?.type === 'channel' ? 
                        (followersCount || 0) : 
                        (user?.friends_count || 0)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.subscription?.type === 'channel' ? 'подписчиков' : 'друзей'}
                    </Typography>
                  </Paper>
                  
                  
                  {(!user?.subscription || user.subscription.type !== 'channel') && (
                    <Paper 
                      component={Link}
                      to={`/profile/${user?.username}/following`}
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        textAlign: 'center',
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        backdropFilter: 'blur(5px)',
                        border: (user.status_color && user.status_text && user.subscription) ? 
                          `1px solid ${user.status_color}33` : 
                          theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                          transform: 'translateY(-2px)',
                          boxShadow: (user.status_color && user.status_text && user.subscription) ? 
                            `0 4px 15px ${user.status_color}33` : 
                            '0 4px 15px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: (user.status_color && user.status_text && user.subscription) ? 
                            user.status_color : 
                            'primary.main'
                        }}
                      >
                        {followingCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        подписок
                      </Typography>
                    </Paper>
                  )}
                </Box>
                
                
                {(!user?.subscription || user.subscription.type !== 'channel') && (
                  <Grid container spacing={1} sx={{ mt: 1 }}> 
                    
                    
                    {(!user?.subscription || user.subscription.type !== 'channel') ? (
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            Друзья
                          </Typography>
                          
                          
                          {loadingFriends ? (
                            <CircularProgress size={20} />
                          ) : friends && friends.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {friends.slice(0, 3).map(friend => (
                                <Tooltip key={friend.id} title={friend.name} arrow>
                                  <Avatar 
                                    src={friend.avatar_url} 
                                    alt={friend.name}
                                    component={Link}
                                    to={`/profile/${friend.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      border: (user.status_color && user.status_text && user.subscription) ? 
                                        `1px solid ${user.status_color}` : 
                                        '1px solid #D0BCFF', 
                                      flexShrink: 0 
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load friend avatar for ${friend.username}`);
                                      if (friend.id) {
                                        e.target.src = `/static/uploads/avatar/${friend.id}/${friend.photo || 'avatar.png'}`;
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {user?.friends_count > 3 && (
                                <Tooltip title="Показать всех друзей" arrow>
                                  <Avatar 
                                    component={Link}
                                    to={`/profile/${user?.username}/friends`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                        `${user.status_color}26` : 
                                        'rgba(208, 188, 255, 0.15)', 
                                      fontSize: '0.75rem',
                                      color: (user.status_color && user.status_text && user.subscription) ? 
                                        user.status_color : 
                                        '#D0BCFF',
                                      flexShrink: 0 
                                    }}
                                  >
                                    +{user?.friends_count - 3}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Нет друзей
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ) : (
                      
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            Подписчики
                          </Typography>
                          <Typography variant="body2">
                            {followersCount || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    
                    
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Подписки
                        </Typography>
                        
                        
                        {user?.subscription && user.subscription.type === 'channel' ? (
                          <Typography variant="body2">
                            {followingCount || 0}
                          </Typography>
                        ) : (
                          loadingFollowing ? (
                            <CircularProgress size={20} />
                          ) : followingList.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {followingList.slice(0, 3).map(following => (
                                <Tooltip key={following.id} title={following.name} arrow>
                                  <Avatar 
                                    src={following.avatar_url} 
                                    alt={following.name}
                                    component={Link}
                                    to={`/profile/${following.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      border: (user.status_color && user.status_text && user.subscription) ? 
                                        `1px solid ${user.status_color}` : 
                                        '1px solid #D0BCFF', 
                                      flexShrink: 0 
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load following avatar for ${following.username}`);
                                      if (following.id) {
                                        e.target.src = `/static/uploads/avatar/${following.id}/${following.photo || 'avatar.png'}`;
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {followingCount > 3 && (
                                <Tooltip title="Показать всех" arrow>
                                  <Avatar 
                                    component={Link}
                                    to={`/profile/${user?.username}/following`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                        `${user.status_color}26` : 
                                        'rgba(208, 188, 255, 0.15)', 
                                      fontSize: '0.75rem',
                                      color: (user.status_color && user.status_text && user.subscription) ? 
                                        user.status_color : 
                                        '#D0BCFF',
                                      flexShrink: 0 
                                    }}
                                  >
                                    +{followingCount - 3}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {user?.subscription && user.subscription.type === 'channel' ? 'Нет подписчиков' : 'Нет друзей'}
                            </Typography>
                          )
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                )}
                
                
                {socials && socials.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {socials.map((social, index) => (
                      <Tooltip key={index} title={social.title || social.name} arrow>
                        <IconButton 
                          component="a" 
                          href={social.url || social.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          size="small"
                          sx={{ 
                            color: (user.status_color && user.status_text && user.subscription) ? 
                              user.status_color :
                              social.color || 'primary.main',
                            padding: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.07)',
                            '&:hover': {
                              bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                `${user.status_color}15` : 
                                'rgba(255, 255, 255, 0.12)',
                              transform: 'translateY(-2px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          {social.icon ? (
                            <Box component="img" src={social.icon} alt={social.title || social.name} sx={{ width: 20, height: 20 }} />
                          ) : (
                            <Box component="div" sx={{ width: 20, height: 20, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {social.name?.toLowerCase().includes('instagram') ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              : social.name?.toLowerCase().includes('facebook') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5 1.583-5 4.615v3.385z"/></svg>
                              : social.name?.toLowerCase().includes('twitter') || social.name?.toLowerCase().includes('x') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                              : social.name?.toLowerCase().includes('vk') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/></svg>
                              : social.name?.toLowerCase().includes('youtube') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                              : social.name?.toLowerCase().includes('telegram') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.5 5.97-4.1-1.34c-.88-.28-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                              : social.name?.toLowerCase().includes('element') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12.7 12.7" fill="currentColor">
                                  <path d="M 4.9717204,2.3834823 A 5.0230292,5.0230292 0 0 0 0.59994682,7.3615548 5.0230292,5.0230292 0 0 0 5.6228197,12.384429 5.0230292,5.0230292 0 0 0 10.645693,7.3615548 5.0230292,5.0230292 0 0 0 10.630013,6.9628311 3.8648402,3.8648402 0 0 1 8.6139939,7.532543 3.8648402,3.8648402 0 0 1 4.7492118,3.6677608 3.8648402,3.8648402 0 0 1 4.9717204,2.3834823 Z" />
                                  <circle cx="8.6142359" cy="3.6677198" r="3.5209935" />
                                </svg>
                              : 
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/></svg>
                              }
                            </Box>
                          )}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                )}
                
                
                {!isCurrentUser && (!currentUser?.account_type || currentUser.account_type !== 'channel') && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mt: 2,
                    justifyContent: 'center'
                  }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={following ? <PersonRemoveIcon /> : <PersonAddIcon />}
                      onClick={handleFollow}
                      fullWidth
                      sx={{ 
                        borderRadius: 6,
                        py: 0.7,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: (user.status_color && user.status_text && user.subscription) ?
                          `0 2px 8px ${user.status_color}40` : 
                          '0 2px 8px rgba(208, 188, 255, 0.25)',
                        backgroundColor: following ? 
                          'rgba(255, 255, 255, 0.1)' : 
                          (user.status_color && user.status_text && user.subscription) ?
                            user.status_color :
                            'primary.main',
                        color: following ? 'text.primary' : '#fff',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: following ? 
                            'rgba(255, 255, 255, 0.15)' : 
                            (user.status_color && user.status_text && user.subscription) ?
                              `${user.status_color}E6` : 
                              'primary.dark',
                          transform: 'translateY(-2px)',
                          boxShadow: (user.status_color && user.status_text && user.subscription) ?
                            `0 4px 12px ${user.status_color}66` : 
                            '0 4px 12px rgba(208, 188, 255, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      {following ? 'Отписаться' : 'Подписаться'}
                    </Button>
                  </Box>
                )}
                
                
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        
        <Grid item xs={12} md={7} sx={{ pt: 0, ml: { xs: 0, md: '5px' }, mb: '100px' }}>
        
          <Paper sx={{ 
            borderRadius: '16px', 
            backgroundColor: theme => theme.palette.mode === 'dark' ? '#1E1E1E' : theme.palette.background.paper,
            backgroundImage: 'unset',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            mb: '5px',
            border: '1px solid rgba(255, 255, 255, 0.1)'

          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3
                },
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  py: 1.5,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 700
                  }
                }
              }}
            >
              <Tab label="Посты" />
              <Tab label="Стена" />
              <Tab label="Профиль" />
            </Tabs>
          </Paper>
          
          
          <TabPanel value={tabValue} index={0} sx={{ p: 0, mt: 1 }}>
            {isCurrentUser && (
              <CreatePost onPostCreated={handlePostCreated} />
            )}
            
            <PostsTab />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1} sx={{ p: 0, mt: 1 }}>
            {currentUser && (!currentUser.subscription || currentUser.subscription.type !== 'channel') && (
              <CreatePost 
                onPostCreated={handlePostCreated} 
                postType="stena" 
                recipientId={user.id} 
              />
            )}
            
            <WallPostsTab userId={user.id} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2} sx={{ p: 0, mt: 1 }}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #232526 0%, #121212 100%)' 
                : theme.palette.background.paper,
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Информация о профиле
              </Typography>
              
              <Grid container spacing={3}>
                {user?.about && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 1.5,
                      pb: 2,
                      borderBottom: '1px solid rgba(255,255,255,0.07)'
                    }}>
                      <InfoIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Обо мне
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          whiteSpace: 'pre-line',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          {user.about}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {user?.location && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Местоположение
                        </Typography>
                        <Typography variant="body2">
                          {user.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {user?.website && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <LinkIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Веб-сайт
                        </Typography>
                        <Typography variant="body2">
                          <Link href={user.website} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                            {user.website.replace(/^https?:\/\//, '')}
                          </Link>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {user?.birthday && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <CakeIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Дата рождения
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(user.birthday)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <TodayIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Дата регистрации
                      </Typography>
                      <Typography variant="body2">
                        {user?.registration_date ? new Date(user.registration_date).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Недоступно'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {user?.purchased_usernames && user.purchased_usernames.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <AlternateEmailIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Юзернеймы
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          
                          {user.purchased_usernames.map((usernameObj, idx) => (
                            <Chip 
                              key={idx}
                              label={usernameObj.username}
                              size="small"
                              variant={usernameObj.is_active ? "filled" : "outlined"}
                              color={usernameObj.is_active ? "primary" : "default"}
                              onClick={(e) => handleUsernameClick(e, usernameObj.username)}
                              sx={{ 
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </TabPanel>
        </Grid>
      </Grid>
      {loadingMorePosts && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={30} />
          </Box>
        )}
      
      
      {lightboxIsOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={closeLightbox}
        >
          <img 
            src={currentImage} 
            alt="Full size" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain' 
            }} 
            onClick={(e) => e.stopPropagation()}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
            onClick={closeLightbox}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={() => setNotificationMenuAnchor(null)}
        PaperProps={{
          sx: {
            bgcolor: theme => theme.palette.mode === 'dark' ? '#1E1E1E' : theme.palette.background.paper,
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            mt: 1,
            maxHeight: 400,
            width: 360
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6">Уведомления</Typography>
        </Box>
        
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              <Avatar
                src={notification.sender_user?.avatar_url}
                alt={notification.sender_user?.name}
                sx={{ width: 40, height: 40 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTimeAgo(notification.created_at)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">Нет новых уведомлений</Typography>
          </Box>
        )}
      </Menu>
      
      {/* Карточка с информацией об юзернейме */}
      <AnimatePresence>
        {selectedUsername && (
          <UsernameCard 
            username={selectedUsername}
            onClose={handleCloseUsernameCard}
            open={usernameCardOpen}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProfilePage; 