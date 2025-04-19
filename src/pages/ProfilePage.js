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
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostService from '../services/PostService';
import ReactMarkdown from 'react-markdown';
import 'react-medium-image-zoom/dist/styles.css';
import { ThemeSettingsContext } from '../App';
import ImageGrid from '../components/ImageGrid';
import { formatTimeAgo, getRussianWordForm, formatDate } from '../utils/dateUtils';
import Post from '../components/Post/Post'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RepostItem from '../components/RepostItem';
import PostSkeleton from '../components/Post/PostSkeleton';
import ContentLoader from '../components/UI/ContentLoader';
import TabContentLoader from '../components/UI/TabContentLoader';


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
import MusicSelectDialog from '../components/Music/MusicSelectDialog';
import InfoIcon from '@mui/icons-material/Info';
import CakeIcon from '@mui/icons-material/Cake';
import TodayIcon from '@mui/icons-material/Today';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CollectionsIcon from '@mui/icons-material/Collections';
import DiamondIcon from '@mui/icons-material/Diamond';


const ProfileHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '16px',
  marginBottom: theme.spacing(2)
}));

const CoverPhoto = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#1A1A1A',
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
  background: '#1A1A1A',
  cursor: 'pointer'
}));


const CreatePostCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  borderRadius: '10px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  marginBottom: theme.spacing(0),
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.3)',
    transform: 'translateY(-2px)'
  }
}));


const PostInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '0.95rem',
    padding: theme.spacing(1, 1.5),
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: 'rgba(208, 188, 255, 0.3)',
      background: 'rgba(0, 0, 0, 0.25)',
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
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
  fontSize: '0.8rem',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(124, 77, 255, 0.25)',
  padding: theme.spacing(0.4, 1.5),
  background: 'linear-gradient(90deg, rgb(180 163 220) 0%, rgb(177 161 216) 100%)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.35)',
  },
  '&.Mui-disabled': {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.3)'
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
      default:
        return { color: '#D0BCFF', title: 'Верифицирован' };
    }
  };
  
  const { color, title } = getColorAndTitle(status);
  
  return (
    <Tooltip title={title} placement="top">
      <CheckCircleIcon 
        sx={{ 
          fontSize: size === 'small' ? 23 : 20,
          ml: 0.5,
          color
        }} 
      />
    </Tooltip>
  );
};


const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [mediaPreview, setMediaPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  
  
  const [musicSelectOpen, setMusicSelectOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);

  
  useEffect(() => {
    if (error) setError('');
  }, [content, selectedFiles, selectedTracks, error]);

  
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
    
    if (files.length > 0) {
      
      setSelectedFiles([]);
      setPreviewUrls([]);
      setMediaFile(null);
      setMediaPreview('');
      
      
      setSelectedFiles(files);
      
      
      if (files.length === 1) {
        setMediaFile(files[0]);
        setMediaType(files[0].type.startsWith('image/') ? 'image' : 'video');
        
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
      
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
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
    setMediaFile(null);
    setMediaPreview('');
    setMediaType('');
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
  
  const handleSubmit = async () => {
    
    if (!content.trim() && selectedFiles.length === 0 && selectedTracks.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      
      
      if (selectedFiles.length > 1) {
        console.log(`Adding ${selectedFiles.length} images to form data`);
        selectedFiles.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      } 
      
      else if (selectedFiles.length === 1) {
        console.log('Adding single file to form data');
        if (mediaType) {
          formData.append(mediaType, selectedFiles[0]);
        } else {
          
          const fileType = selectedFiles[0].type.startsWith('image/') ? 'image' : 'video';
          formData.append(fileType, selectedFiles[0]);
        }
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
        setMediaFile(null);
        setMediaPreview('');
        setMediaType('');
        setSelectedFiles([]);
        setPreviewUrls([]);
        setSelectedTracks([]);
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
        mb: 2,
        borderRadius: '10px',
        backgroundColor: themeSettings?.postBackgroundColor || '#1E1E1E',
        position: 'relative'
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            borderRadius: '10px',
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
            border: '2px solid rgba(208, 188, 255, 0.6)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
            }
          }}
        />
        <PostInput 
          placeholder="Что у вас нового?"
          multiline
          minRows={1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {

          }}
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
      
      {}
      {mediaPreview ? (
        <Box sx={{ position: 'relative', mt: 1 }}>
          <img
            src={mediaPreview}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: '300px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
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
            onClick={() => {
              setMediaPreview('');
              setMediaFile(null);
              setMediaType('');
              setSelectedFiles([]);
              setPreviewUrls([]);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ) : previewUrls.length > 1 ? (
        <Box sx={{ position: 'relative', mt: 2 }}>
          <ImageList 
            sx={{ width: '100%', maxHeight: 300, borderRadius: '8px', overflow: 'hidden' }}
            cols={previewUrls.length > 3 ? 3 : previewUrls.length}
            rowHeight={previewUrls.length > 3 ? 120 : 200}
          >
            {previewUrls.map((preview, index) => (
              <ImageListItem key={index}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
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
            onClick={() => {
              setPreviewUrls([]);
              setSelectedFiles([]);
              setMediaPreview('');
              setMediaFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ) : null}
      
      {}
      {selectedTracks.length > 0 && (
        <Box sx={{ mt: 2, mb: 1 }}>
          {selectedTracks.map(track => (
            <Box 
              key={track.id}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                py: 1, 
                px: 2, 
                mb: 1, 
                borderRadius: '8px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
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
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
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
            accept="image}
          <Button
            onClick={() => setMusicSelectOpen(true)}
            startIcon={<MusicNoteIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: selectedTracks.length > 0 ? 'primary.main' : 'text.secondary',
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 500,
              padding: '4px 10px',
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
            {selectedTracks.length ? `Музыка (${selectedTracks.length})` : 'Музыка'}
          </Button>
        </Box>
        
        <PublishButton 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting || (!content.trim() && !mediaFile && selectedFiles.length === 0 && selectedTracks.length === 0)}
          endIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
          size="small"
        >
          Опубликовать
        </PublishButton>
      </PostActions>
      
      {}
      <MusicSelectDialog
        open={musicSelectOpen}
        onClose={() => setMusicSelectOpen(false)}
        onSelectTracks={handleMusicSelect}
        maxTracks={3}
      />
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
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
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
    if (newPost && newPost.id) {
      
      if (newPost.user_id === user.id || 
          (newPost.user && newPost.user.id === user.id)) {
        
        
        const existingPostIndex = posts.findIndex(p => p && p.id === newPost.id);
        
        if (existingPostIndex !== -1) {
          
          setPosts(current => {
            const newPosts = [...current];
            newPosts[existingPostIndex] = newPost;
            return newPosts;
          });
        } else {
          
          setPosts(current => [newPost, ...current.filter(p => p && p.id)]);
          
          
          setPostsCount(prev => prev + 1);
        }
      }
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

  
  const PostsTab = () => {
    return (
      <ContentLoader loading={loadingPosts} skeletonCount={3} height="120px">
        {posts.length > 0 ? (
          <Box sx={{ mt: 0.5 }}>
            {posts.map(post => (
              post.is_repost ? (
                <RepostItem key={post.id} post={post} onDelete={handleDeletePost} />
              ) : (
                <Post key={post.id} post={post} onDelete={handleDeletePost} showActions />
              )
            ))}
            
            {}
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
        {}
        <Grid item xs={12} md={5}>
          {}
          <Paper sx={{ 
            p: 0, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #232526 0%, #121212 100%)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            mb: { xs: 1, md: 0 },
            overflow: 'hidden',
            position: { xs: 'relative', md: 'sticky' },
            top: { md: '80px' },
            zIndex: 1,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 14px 35px rgba(0, 0, 0, 0.35)',
              transform: 'translateY(-2px)'
            },
            
            ...(user?.subscription && {
              border: user.subscription.type === 'premium' 
                ? '1px solid rgba(186, 104, 200, 0.3)' 
                : user.subscription.type === 'pick-me'
                  ? '1px solid rgba(208, 188, 255, 0.3)'
                  : user.subscription.type === 'ultimate' 
                    ? '1px solid rgba(124, 77, 255, 0.3)' 
                    : '1px solid rgba(66, 165, 245, 0.3)',
              boxShadow: user.subscription.type === 'premium' 
                ? '0 0 15px rgba(186, 104, 200, 0.2)' 
                : user.subscription.type === 'pick-me'
                  ? '0 0 15px rgba(208, 188, 255, 0.2)'
                  : user.subscription.type === 'ultimate' 
                    ? '0 0 15px rgba(124, 77, 255, 0.2)' 
                    : '0 0 15px rgba(66, 165, 245, 0.2)',
              '&:hover': {
                boxShadow: user.subscription.type === 'premium' 
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
            {}
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
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(18,18,18,0.45) 100%)'
                }
              }}>
                {}
                {}
              </Box>
            ) : (
              <Box sx={{ 
                width: '100%',
                height: { xs: 100, sm: 120 },
                background: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http:
                  opacity: 0.4
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(18,18,18,0.9) 100%)'
                }
              }}>
                {}
                {}
              </Box>
            )}
            
            {}
            <Box sx={{ px: 3, pb: 3, pt: 0, mt: -7 }}>
              {}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                {}
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={user?.avatar_url} 
                    alt={user?.name}
                    sx={{ 
                      width: { xs: 110, sm: 130 }, 
                      height: { xs: 110, sm: 130 }, 
                      border: user?.subscription ? 
                        `4px solid ${
                          user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.6)' :
                          user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.6)' : 
                          user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.6)' : 
                          'rgba(66, 165, 245, 0.6)'
                        }` : 
                        '4px solid #121212',
                      boxShadow: user?.subscription ?
                        (user.subscription.type === 'premium' ? 
                          '0 0 15px rgba(186, 104, 200, 0.5)' :
                          user.subscription.type === 'pick-me' ? 
                          '0 0 15px rgba(208, 188, 255, 0.5)' : 
                          user.subscription.type === 'ultimate' ? 
                          '0 0 15px rgba(124, 77, 255, 0.5)' : 
                          '0 0 15px rgba(66, 165, 245, 0.5)') :
                        '0 8px 20px rgba(0, 0, 0, 0.25)',
                      bgcolor: 'primary.dark',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: user?.subscription ?
                          (user.subscription.type === 'premium' ? 
                            '0 0 20px rgba(186, 104, 200, 0.7)' :
                            user.subscription.type === 'pick-me' ? 
                            '0 0 20px rgba(208, 188, 255, 0.7)' : 
                            user.subscription.type === 'ultimate' ? 
                            '0 0 20px rgba(124, 77, 255, 0.7)' : 
                            '0 0 20px rgba(66, 165, 245, 0.7)') :
                          '0 10px 25px rgba(0, 0, 0, 0.35)',
                        border: user?.subscription ? 
                          `4px solid ${
                            user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.8)' :
                            user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.8)' : 
                            user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.8)' : 
                            'rgba(66, 165, 245, 0.8)'
                          }` : 
                          '4px solid rgba(208, 188, 255, 0.4)'
                      }
                    }}
                    onError={(e) => {
                      if (user?.id) {
                        e.currentTarget.src = `/static/uploads/avatar/${user.id}/${user.photo || 'default.png'}`;
                      }
                    }}
                  />
                  
                  {}
                  {isOnline && (
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#4caf50',
                        border: '2px solid #121212',
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
                </Box>
                
                {}
                {!isCurrentUser && (
                  <Box sx={{ mt: 8, display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={following ? <PersonRemoveIcon /> : <PersonAddIcon />}
                      onClick={handleFollow}
                      sx={{ 
                        borderRadius: 6,
                        py: 0.7,
                        px: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(208, 188, 255, 0.25)',
                        backgroundColor: following ? 'rgba(255, 255, 255, 0.1)' : 'primary.main',
                        color: following ? 'text.primary' : '#fff',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: following ? 'rgba(255, 255, 255, 0.15)' : 'primary.dark',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(208, 188, 255, 0.4)'
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
              
              {}
              <Box sx={{ mt: 2, whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
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
                                    {}

                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    @{user?.username || 'username'}
                  </Typography>
                  

                  {isOnline ? (
                    <Typography 
                      variant="caption" 
                      sx={{
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'success.light',
                        fontWeight: 500,
                        background: 'rgba(46, 125, 50, 0.1)',
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
                  ) : (
                    <Typography 
                      variant="caption" 
                      sx={{
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'text.secondary',
                        fontWeight: 500,
                        background: 'rgba(255,255,255,0.03)',
                        px: 1,
                        py: 0.3,
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5, opacity: 0.7 }} />
                      {lastActive ? `${lastActive}` : "не в сети"}
                    </Typography>
                  )}
                                    {user?.subscription && (
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
                              boxShadow: '0 0 0 0 rgba(124, 77, 255, 0.4)'
                            },
                            '70%': {
                              boxShadow: '0 0 0 6px rgba(124, 77, 255, 0)'
                            },
                            '100%': {
                              boxShadow: '0 0 0 0 rgba(124, 77, 255, 0)'
                            }
                          }
                        }}
                      />
                    </Tooltip>
                  )}
                  
                </Box>
                  
                {}
                {ownedUsernames.length > 0 && (
                  <Box sx={{ 
                    display: 'flex',
                    mt: 1,
                    width: '100%'
                  }}>
                    <Box 
                      sx={{ 
                        color: 'rgba(255,255,255,0.6)',
                        backgroundColor: 'rgba(208, 188, 255, 0.1)',
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 4,
                        border: '1px solid rgba(208, 188, 255, 0.2)',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        maxWidth: '100%',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mr: 0.5 }}>
                        А также:
                      </Typography>
                      {ownedUsernames.slice(0, 3).map((username, idx) => (
                        <React.Fragment key={idx}>
                          <Typography 
                            variant="caption" 
                            component="span" 
                            sx={{ 
                              color: '#d0bcff', 
                              fontWeight: 500
                            }}
                          >
                            @{username}
                          </Typography>
                          {idx < Math.min(ownedUsernames.length, 3) - 1 && (
                            <Typography variant="caption" component="span" sx={{ mx: 0.5, color: 'rgba(255,255,255,0.4)' }}>
                              ,
                            </Typography>
                          )}
                        </React.Fragment>
                      ))}
                      {ownedUsernames.length > 3 && (
                        <Typography variant="caption" component="span" sx={{ ml: 0.5, color: 'rgba(255,255,255,0.4)' }}>
                          и ещё {ownedUsernames.length - 3}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                
                {}
                {user?.about && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1, 
                      lineHeight: 1.5,
                      color: 'rgba(255,255,255,0.8)',
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    {user.about}
                  </Typography>
                )}
                
                
                {}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: 1, 
                  mt: 1 
                }}>
                  {}
                  <Paper sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.07)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      {postsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      публикаций
                    </Typography>
                  </Paper>
                  
                  {}
                  <Paper 
                    component={Link}
                    to={`/profile/${user?.username}/followers`}
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.07)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      {followersCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      подписчиков
                    </Typography>
                  </Paper>
                  
                  {}
                  <Paper 
                    component={Link}
                    to={`/profile/${user?.username}/following`}
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.07)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      {followingCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      подписок
                    </Typography>
                  </Paper>
                </Box>
                
                {}
                <Grid container spacing={1} sx={{ mt: 1 }}> {}
                  {}
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Подписчики
                      </Typography>
                      
                      {}
                      {loadingFollowers ? (
                        <CircularProgress size={20} />
                      ) : followers.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {followers.slice(0, 3).map(follower => (
                            <Tooltip key={follower.id} title={follower.name} arrow>
                              <Avatar 
                                src={follower.photo} 
                                alt={follower.name}
                                component={Link}
                                to={`/profile/${follower.username}`}
                                sx={{ width: 32, height: 32, border: '1px solid #D0BCFF', flexShrink: 0 }}
                                onError={(e) => {
                                  console.error(`Failed to load follower avatar for ${follower.username}`);
                                  if (follower.id) {
                                    e.target.src = `/static/uploads/avatar/${follower.id}/${follower.photo || 'avatar.png'}`;
                                  }
                                }}
                              />
                            </Tooltip>
                          ))}
                          {followersCount > 3 && (
                            <Tooltip title="Показать всех" arrow>
                              <Avatar 
                                component={Link}
                                to={`/profile/${user?.username}/followers`}
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  bgcolor: 'rgba(208, 188, 255, 0.15)', 
                                  fontSize: '0.75rem',
                                  color: '#D0BCFF',
                                  flexShrink: 0 
                                }}
                              >
                                +{followersCount - 3}
                              </Avatar>
                            </Tooltip>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Нет подписчиков
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  {}
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Подписки
                      </Typography>
                      
                      {}
                      {loadingFollowing ? (
                        <CircularProgress size={20} />
                      ) : followingList.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {followingList.slice(0, 3).map(following => (
                            <Tooltip key={following.id} title={following.name} arrow>
                              <Avatar 
                                src={following.photo} 
                                alt={following.name}
                                component={Link}
                                to={`/profile/${following.username}`}
                                sx={{ width: 32, height: 32, border: '1px solid #D0BCFF', flexShrink: 0 }}
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
                                  bgcolor: 'rgba(208, 188, 255, 0.15)', 
                                  fontSize: '0.75rem',
                                  color: '#D0BCFF',
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
                          Нет подписок
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                
                {}
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
                            color: social.color || 'primary.main',
                            padding: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.07)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.12)',
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
                                <svg xmlns="http:
                              : social.name?.toLowerCase().includes('facebook') ?
                                <svg xmlns="http:
                              : social.name?.toLowerCase().includes('twitter') || social.name?.toLowerCase().includes('x') ?
                                <svg xmlns="http:
                              : social.name?.toLowerCase().includes('vk') ?
                                <svg xmlns="http:
                              : social.name?.toLowerCase().includes('youtube') ?
                                <svg xmlns="http:
                              : social.name?.toLowerCase().includes('telegram') ?
                                <svg xmlns="http:
                              : social.name?.toLowerCase().includes('element') ?
                                <svg xmlns="http:
                                  <path d="M 4.9717204,2.3834823 A 5.0230292,5.0230292 0 0 0 0.59994682,7.3615548 5.0230292,5.0230292 0 0 0 5.6228197,12.384429 5.0230292,5.0230292 0 0 0 10.645693,7.3615548 5.0230292,5.0230292 0 0 0 10.630013,6.9628311 3.8648402,3.8648402 0 0 1 8.6139939,7.532543 3.8648402,3.8648402 0 0 1 4.7492118,3.6677608 3.8648402,3.8648402 0 0 1 4.9717204,2.3834823 Z" />
                                  <circle cx="8.6142359" cy="3.6677198" r="3.5209935" />
                                </svg>
                              : 
                                <svg xmlns="http:
                              }
                            </Box>
                          )}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                )}
                
                {}
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {}
        <Grid item xs={12} md={7} sx={{ pt: 0, ml: { xs: 0, md: '5px' }, mb: '100px' }}>
        {}
          <Paper sx={{ 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #232526 0%, #121212 100%)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            mb: 1
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
              <Tab label="Публикации" />
              <Tab label="Информация" />
            </Tabs>
          </Paper>
          
          {}
          <TabPanel value={tabValue} index={0} sx={{ p: 0, mt: 1 }}>
            {isCurrentUser && (
              <CreatePost onPostCreated={handlePostCreated} />
            )}
            
            <PostsTab />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1} sx={{ p: 0, mt: 1 }}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #232526 0%, #121212 100%)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Информация о пользователе
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
                            {user.website.replace(/^https?:\/\
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
                        {user?.created_at ? formatDate(user.created_at) : 'Недоступно'}
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
                          {}
                          {user.purchased_usernames.map((username, idx) => (
                            <Chip 
                              key={idx}
                              label={username.username}
                              size="small"
                              sx={{ 
                                bgcolor: username.is_active ? 'primary.dark' : 'background.paper',
                                border: '1px solid',
                                borderColor: username.is_active ? 'primary.main' : 'divider',
                                '&:hover': {
                                  bgcolor: username.is_active ? 'primary.main' : 'rgba(208, 188, 255, 0.1)',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                },
                                transition: 'all 0.2s'
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
      
      {}
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
            bgcolor: '#1E1E1E',
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
    </Container>
  );
};

export default ProfilePage; 