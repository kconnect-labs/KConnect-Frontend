import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Paper, 
  Avatar, 
  Snackbar, 
  Alert, 
  TextField, 
  IconButton, 
  ImageList,
  ImageListItem,
  Typography,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../../../context/AuthContext';
import { MusicContext } from '../../../../context/MusicContext';
import { useLanguage } from '../../../../context/LanguageContext';
import PostService from '../../../../services/PostService';
import MusicSelectDialog from '../../../../components/Music/MusicSelectDialog';
import DynamicIslandNotification from '../../../../components/DynamicIslandNotification';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { handleImageError as safeImageError } from '../../../../utils/imageUtils';

// Стилизованные компоненты
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

const CreatePost = ({ onPostCreated, postType = 'post', recipientId = null }) => {
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);
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
  const [isNsfw, setIsNsfw] = useState(false);

  // Константы
  const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150MB in bytes
  const MAX_PHOTO_SIZE = 50 * 1024 * 1024;  // 50MB in bytes
  const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif'
  ];
  const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ];

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
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files.length) return;

    let hasInvalidSize = false;

    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        setSizeErrorMessage(`Размер видео превышает лимит в 150МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }

      if (isImage && file.size > MAX_PHOTO_SIZE) {
        setSizeErrorMessage(`Размер изображения превышает лимит в 50МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }
    });

    if (hasInvalidSize) return;

    processFiles(files);
  };

  const handleMediaChange = (event) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files.length) return;

    let hasInvalidSize = false;
    
    // Проверяем размер после выбора
    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        setSizeErrorMessage(`Размер видео превышает лимит в 150МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }

      if (isImage && file.size > MAX_PHOTO_SIZE) {
        setSizeErrorMessage(`Размер изображения превышает лимит в 50МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }
    });

    if (hasInvalidSize) {
      event.target.value = '';
      return;
    }

    processFiles(files);
  };

  // Обновляем processFiles для работы с уже проверенными файлами
  const processFiles = (files) => {
    if (!files.length) return;

    // Проверяем MIME-типы файлов
    const allFiles = Array.from(files);
    const validTypeFiles = allFiles.filter(file => {
      const isValidImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isValidVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isValidImage && !isValidVideo) {
        window.dispatchEvent(new CustomEvent('showError', {
          detail: {
            message: `Неподдерживаемый формат файла: ${file.name}. Разрешены только изображения (JPEG, PNG, GIF, WEBP) и видео (MP4, WEBM, MOV, AVI, MKV)`,
            severity: 'error'
          }
        }));
        return false;
      }
      return true;
    });

    if (validTypeFiles.length === 0) {
      return;
    }

    const imageFiles = validTypeFiles.filter(file => ALLOWED_IMAGE_TYPES.includes(file.type));
    const videoFiles = validTypeFiles.filter(file => ALLOWED_VIDEO_TYPES.includes(file.type));

    // Если уже есть видео, не позволяем добавлять изображения
    if (mediaType === 'video' && imageFiles.length > 0) {
      setMediaNotification({
        open: true,
        message: 'Нельзя прикрепить фото и видео одновременно'
      });
      return;
    }

    // Если уже есть изображения, не позволяем добавлять видео
    if (mediaType === 'image' && videoFiles.length > 0) {
      setMediaNotification({
        open: true,
        message: 'Нельзя прикрепить фото и видео одновременно'
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
    event.stopPropagation();
    
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay(); 
    } else {
      playTrack(track, 'create-post');
    }
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData;
    if (clipboardData.items) {
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();  
          const file = items[i].getAsFile();
          if (file) {
            if (mediaType && mediaType === 'video') {
              setMediaNotification({
                open: true,
                message: 'Нельзя прикрепить фото и видео одновременно'
              });
              return;
            }

            // Обновляем тип медиа на 'images' для множественной загрузки
            setMediaType('images');
            setMediaFiles(prev => [...prev, file]);
            
            const reader = new FileReader();
            reader.onloadend = () => {
              setMediaPreview(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
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
      
      if (postType && postType !== 'post') {
        formData.append('type', postType);
      }
      
      if (recipientId) {
        formData.append('recipient_id', recipientId);
      }
      
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
      const response = await PostService.createPost(formData);
      console.log('Post created:', response);
      
      if (response && response.success) {
        clearForm();
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
        borderRadius: 1,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
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
              placeholder={postType === 'wall' ? t('profile.create_post.wall_placeholder') : t('profile.create_post.placeholder')}
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
                          onError={safeImageError}
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
                      onError={safeImageError}
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
                    color: mediaFiles.length > 0 || selectedTracks.length > 0 ? 'primary.main' : 'text.secondary',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    border: mediaFiles.length > 0 || selectedTracks.length > 0 
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
                  {mediaFiles.length > 0 ? t('profile.create_post.files_count', { count: mediaFiles.length }) : t('profile.create_post.media')}
                </Button>
              </label>
              
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
                {selectedTracks.length > 0 ? t('profile.create_post.music_count', { count: selectedTracks.length }) : t('profile.create_post.music')}
              </Button>
              
              {/* NSFW кнопка - показывается только при наличии медиа */}
              {(mediaFiles.length > 0 || selectedTracks.length > 0) && (
                <Tooltip title="Деликатный контент" placement="top">
                  <IconButton
                    onClick={() => setIsNsfw(!isNsfw)}
                    sx={{
                      color: isNsfw ? '#ff6b6b' : 'text.secondary',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      minWidth: 32,
                      minHeight: 32,
                      padding: 0,
                      border: isNsfw 
                        ? '1px solid rgba(255, 107, 107, 0.5)' 
                        : theme => theme.palette.mode === 'dark'
                          ? '1px solid rgba(255, 255, 255, 0.12)'
                          : '1px solid rgba(0, 0, 0, 0.12)',
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
            
            <PublishButton 
              variant="contained" 
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0 && selectedTracks.length === 0)}
              endIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
              size="small"
            >
              {t('profile.create_post.publish')}
            </PublishButton>
          </PostActions>
          
          <MusicSelectDialog
            open={musicSelectOpen}
            onClose={() => setMusicSelectOpen(false)}
            onSelectTracks={handleMusicSelect}
            maxTracks={3}
          />
        </Box>
      </Box>
      
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
        shortMessage="Ошибка размера файла"
        notificationType="error"
        animationType="pill"
        autoHideDuration={5000}
        onClose={() => setShowSizeError(false)}
      />
    </Paper>
  );
};

export default CreatePost; 