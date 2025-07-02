import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  styled,
  IconButton,
  Link as MuiLink,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import PostService from '../../services/PostService';
import ReactMarkdown from 'react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ImageGrid from '../../components/Post/ImageGrid';
import SimpleImageViewer from '../../components/SimpleImageViewer';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Post } from '../../components/Post';
import { formatTimeAgo, getRussianWordForm, debugDate, parseDate } from '../../utils/dateUtils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SEO from '../../components/SEO';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { ThemeSettingsContext } from '../../App';

import { requireAuth } from '../../utils/authUtils';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { usePostDetail } from '../../context/PostDetailContext';
import { VerificationBadge } from '../../UIKIT';
import { useLanguage } from '../../context/LanguageContext';


const MarkdownContent = styled(Box)(({ theme }) => ({
  '& p': { margin: theme.spacing(1, 0) },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  '& ul, & ol': { marginLeft: theme.spacing(2) },
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

const CommentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const CommentInput = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CommentBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
}));

const ReplyBox = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(6),
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
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


const sanitizeImagePath = (imagePath) => {
  if (!imagePath) return null;
  
  
  if (imagePath.includes('/static/uploads/') && 
      imagePath.indexOf('/static/uploads/') !== imagePath.lastIndexOf('/static/uploads/')) {
    
    return imagePath.substring(imagePath.lastIndexOf('/static/uploads/'));
  }
  
  return imagePath;
};

const Comment = ({ 
  comment, 
  onLike, 
  onLikeReply,
  onReply,
  isReplyFormOpen,
  activeCommentId,
  replyText,
  onReplyTextChange,
  onReplySubmit,
  replyingToReply,
  setReplyingToReply,
  setReplyFormOpen,
  setActiveComment,
  onDeleteComment,
  onDeleteReply,
  isSubmittingComment,
  waitUntil,
  handleReplyImageChange,
  currentLightboxImage,
  setCurrentLightboxImage,
  replyFileInputRef,
  handleRemoveReplyImage,
  replyImage,
  replyImagePreview,
  setReplyImage,
  setLightboxOpen
}) => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageFallback, setImageFallback] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [commentImageError, setCommentImageError] = useState(false);
  const [replyImageErrors, setReplyImageErrors] = useState({});
  const [replyImageFallbacks, setReplyImageFallbacks] = useState({});

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenImage = (event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (comment.image) {
      const sanitizedPath = sanitizeImagePath(comment.image);
      console.log('Opening comment image:', sanitizedPath);
      setCurrentLightboxImage(sanitizedPath);
      setLightboxOpen(true);
    }
  };

  const handleCommentImageError = () => {
    console.error("Comment image failed to load:", comment.image);
    
    
    if (comment.image && comment.image.includes('/static/uploads/') && 
        (comment.image.indexOf('/static/uploads/') !== comment.image.lastIndexOf('/static/uploads/'))) {
      
      const fixedUrl = comment.image.substring(comment.image.lastIndexOf('/static/uploads/'));
      console.log("Fixing duplicated image path:", comment.image, "->", fixedUrl);
      
      
      comment.image = fixedUrl;
      
      
      setCommentImageError(false);
      return;
    }
    
    setCommentImageError(true);
  };

  
  const getReplyImageFallback = (originalUrl) => {
    if (!originalUrl) return null;
    
    
    if (!originalUrl.includes('_fallback')) {
      
      if (originalUrl.includes('/static/uploads/reply/')) {
        return originalUrl.replace('/static/uploads/reply/', '/static/uploads/replies/') + '_fallback1';
      }
      
      
      if (!originalUrl.startsWith('/')) {
        return '/' + originalUrl + '_fallback2';
      }
    } 
    
    else if (originalUrl.includes('_fallback1')) {
      const baseUrl = originalUrl.replace('_fallback1', '');
      return baseUrl.replace('/static/uploads/replies/', '/static/uploads/images/replies/') + '_fallback2';
    }
    
    else if (originalUrl.includes('_fallback2')) {
      const baseUrl = originalUrl.replace('_fallback2', '');
      
      const filename = baseUrl.split('/').pop();
      return `/static/uploads/reply/${filename}` + '_fallback3';
    }
    
    
    return null;
  };

  const handleReplyImageError = (replyId, imageUrl) => {
    console.error("Reply image failed to load:", imageUrl);
    
    
    if (imageUrl && imageUrl.includes('/static/uploads/') && 
        (imageUrl.indexOf('/static/uploads/') !== imageUrl.lastIndexOf('/static/uploads/'))) {
      
      const fixedUrl = imageUrl.substring(imageUrl.lastIndexOf('/static/uploads/'));
      console.log("Fixing duplicated reply image path:", imageUrl, "->", fixedUrl);
      
      
      setReplyImageFallbacks(prev => ({
        ...prev,
        [replyId]: fixedUrl
      }));
      return;
    }
    
    
    console.log("Reply image details:", {
      replyId: replyId,
      url: imageUrl,
      urlType: typeof imageUrl,
      urlLength: imageUrl ? imageUrl.length : 0
    });
    
    
    const fallbackUrl = getReplyImageFallback(imageUrl);
    
    if (fallbackUrl) {
      console.log(`Trying fallback URL for reply ${replyId}:`, fallbackUrl);
      setReplyImageFallbacks(prev => ({
        ...prev,
        [replyId]: fallbackUrl
      }));
      return;
    }
    
    
    setReplyImageErrors(prev => ({
      ...prev,
      [replyId]: true
    }));
  };

  
  const isCommentOwner = user && (comment.user_id === user.id || user.is_admin);
  const isOwnComment = user && comment.user_id === user.id;

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box 
        id={`comment-${comment.id}`}
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, px: 0.5 }}>
          <Avatar 
            src={comment.user.photo && comment.user.photo !== 'avatar.png'
              ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
              : `/static/uploads/avatar/system/avatar.png`}
            alt={comment.user.name}
            component={Link}
            to={`/profile/${comment.user.username}`}
            sx={{ 
              width: 40, 
              height: 40,
              border: '1px solid rgba(140, 82, 255, 0.15)', 
              mr: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'scale(1.05)'
              }
            }}
            onError={(e) => {
              console.error("Comment avatar failed to load");
              if (e.currentTarget && e.currentTarget.setAttribute) {
                e.currentTarget.setAttribute('src', '/static/uploads/avatar/system/avatar.png');
              }
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: 'calc(100% - 40px)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                component={Link}
                to={`/profile/${comment.user.username}`}
                sx={{ 
                  textDecoration: 'none',
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' },
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  mr: 0.75
                }}
              >
                {comment.user.name}
                {comment.user.verification && comment.user.verification.status > 0 && (
                  <VerificationBadge 
                    status={comment.user.verification.status} 
                    size="small" 
                  />
                )}
                {comment.user.achievement && (
                  <Box 
                    component="img" 
                    sx={{ 
                      width: 12,
                      height: 12,
                      ml: 0.5 
                    }} 
                    src={`/static/images/bages/${comment.user.achievement.image_path}`} 
                    alt={comment.user.achievement.bage}
                    onError={(e) => {
                      console.error("Achievement badge failed to load:", e);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.6rem' }}
              >
                {formatTimeAgo(comment.timestamp)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              bgcolor: 'rgba(45, 45, 50, 0.5)',
              p: 1.25,
              borderRadius: '18px',
              borderTopLeftRadius: '4px',
              maxWidth: '100%',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}>
              <Typography variant="body2" sx={{ 
                color: 'text.primary',
                fontSize: '0.85rem',
                lineHeight: 1.3,
                width: '100%',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}>
                {comment.content}
              </Typography>
              
              {comment.image && (
                <Box sx={{ mt: 1, width: '100%' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      width: '100%',
                      '&:hover': {
                        '& .zoom-icon': {
                          opacity: 1
                        }
                      }
                    }}
                    onClick={handleOpenImage}
                  >
                    {!commentImageError ? (
                      <img 
                        src={sanitizeImagePath(comment.image)}
                        alt="Comment" 
                        style={{ 
                          width: '100%',
                          maxHeight: '160px',
                          borderRadius: '10px',
                          objectFit: 'cover'
                        }} 
                        onError={handleCommentImageError}
                      />
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: '#f44336',
                          fontSize: '0.7rem',
                          textAlign: 'center'
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold', mb: 0.25, fontSize: '0.65rem' }}>
                          Ошибка загрузки медиа
                        </Typography>
                      </Box>
                    )}
                    {!commentImageError && (
                      <Box 
                        className="zoom-icon"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          cursor: 'pointer'
                        }}
                      >
                        <ZoomInIcon sx={{ fontSize: '0.9rem' }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{
              display: 'flex',
              mt: 0.5,
              alignItems: 'center',
              ml: 1
            }}>
              <Box 
                onClick={() => onLike(comment.id)}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: '2px 4px',
                  borderRadius: '12px',
                  transition: 'all 0.15s ease',
                  mr: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(140, 82, 255, 0.08)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {comment.user_liked ? (
                  <FavoriteIcon sx={{ color: '#8c52ff', fontSize: 12 }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: '#757575', fontSize: 12 }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 0.5,
                    color: comment.user_liked ? '#8c52ff' : 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  {comment.likes_count}
                </Typography>
              </Box>

              <Box 
                onClick={() => {
                  handleMenuClose();
                  setReplyFormOpen(true);
                  setActiveComment(comment);
                  setReplyingToReply(null);
                }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: '2px 4px',
                  borderRadius: '12px',
                  color: 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.primary',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <ReplyIcon sx={{ fontSize: 12, transform: 'scaleX(-1)' }} />
                <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.65rem' }}>
                  {t('comment.menu.reply')}
                </Typography>
              </Box>
              
              {isCommentOwner && (
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuAnchorEl(event.currentTarget);
                    
                    setMenuAnchorEl({
                      element: event.currentTarget,
                      replyId: null,
                      commentId: comment.id
                    });
                  }}
                  sx={{ 
                    p: 0.25,
                    ml: 'auto',
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' }
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: '0.85rem' }} />
                </IconButton>
              )}
              
              <Menu
                anchorEl={menuAnchorEl ? menuAnchorEl.element : null}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                PaperProps={{
                  sx: {
                    background: 'linear-gradient(135deg, rgb(19 19 19 / 51%) 0%, rgb(25 24 24 / 39%) 100%)',
                    backdropFilter: 'blur(10px)',
                    minWidth: 120,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }
                }}
                MenuListProps={{
                  sx: {
                    padding: 0
                  }
                }}
              >
                {menuAnchorEl && menuAnchorEl.replyId ? (
                  
                  <MenuItem 
                    onClick={() => {
                      setMenuAnchorEl(null);
                      onDeleteReply(menuAnchorEl.commentId, menuAnchorEl.replyId);
                    }}
                    sx={{ 
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.08)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DeleteIcon sx={{ color: '#f44336', fontSize: '0.9rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('comment.menu.delete')} 
                      primaryTypographyProps={{ 
                        sx: { 
                          color: '#f44336',
                          fontSize: '0.8rem'
                        }
                      }} 
                    />
                  </MenuItem>
                ) : (
                  
                  <MenuItem 
                    onClick={() => {
                      setMenuAnchorEl(null);
                      onDeleteComment(comment.id);
                    }}
                    sx={{ 
                      py: 1,
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.08)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DeleteIcon sx={{ color: '#f44336', fontSize: '0.9rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('comment.menu.delete')} 
                      primaryTypographyProps={{ 
                        sx: { 
                          color: '#f44336',
                          fontSize: '0.8rem'
                        }
                      }} 
                    />
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Box>
        </Box>

        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 0.5, pl: { xs: 3, sm: 4 } }}>
            {comment.replies.map(reply => {
              const isReplyOwner = user && (reply.user_id === user.id || user.is_admin);
              
              return (
                <Box 
                  key={reply.id}
                  sx={{ 
                    mb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    <Avatar 
                      src={reply.user.photo && reply.user.photo !== 'avatar.png'
                        ? `/static/uploads/avatar/${reply.user.id}/${reply.user.photo}`
                        : `/static/uploads/avatar/system/avatar.png`}
                      alt={reply.user.name}
                      component={Link}
                      to={`/profile/${reply.user.username}`}
                      sx={{ 
                        width: 35, 
                        height: 35,
                        mr: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      onError={(e) => {
                        console.error("Reply avatar failed to load");
                        if (e.currentTarget && e.currentTarget.setAttribute) {
                          e.currentTarget.setAttribute('src', '/static/uploads/avatar/system/avatar.png');
                        }
                      }}
                    />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      maxWidth: 'calc(100% - 30px)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          component={Link}
                          to={`/profile/${reply.user.username}`}
                          sx={{ 
                            textDecoration: 'none',
                            color: 'text.primary',
                            '&:hover': { color: 'primary.main' },
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            mr: 0.75
                          }}
                        >
                          {reply.user.name}
                          {reply.user.verification && reply.user.verification.status > 0 && (
                            <VerificationBadge 
                              status={reply.user.verification.status} 
                              size="small" 
                            />
                          )}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: '0.6rem' }}
                        >
                          {formatTimeAgo(reply.timestamp)}
                        </Typography>
                      </Box>
                      
                      {reply.parent_reply_id && !reply.parent_reply && (
                        <Box 
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '8px',
                            p: 1, 
                            mb: 0.75, 
                            borderLeft: '2px solid rgba(140, 82, 255, 0.5)',
                            width: '100%'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Avatar 
                              src={comment.user.photo && comment.user.photo !== 'avatar.png'
                                ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
                                : `/static/uploads/avatar/system/avatar.png`}
                              alt={comment.user.name}
                              sx={{ width: 16, height: 16 }} 
                              onError={(e) => {
                                console.error("Reply parent avatar failed to load");
                                if (e.currentTarget && e.currentTarget.setAttribute) {
                                  e.currentTarget.setAttribute('src', '/static/uploads/avatar/system/avatar.png');
                                }
                              }}
                            />
                            <Typography 
                              variant="caption"
                              sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                fontSize: '0.65rem'
                              }}
                            >
                              {comment.user.name}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 1, 
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mt: 0.25,
                              fontSize: '0.65rem',
                              lineHeight: 1.3,
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {comment.content}
                          </Typography>
                        </Box>
                      )}
                      
                      {reply.parent_reply_id && reply.parent_reply && (
                        <Box 
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '8px',
                            p: 1, 
                            mb: 0.75, 
                            borderLeft: '2px solid rgba(140, 82, 255, 0.5)',
                            width: '100%'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Avatar 
                              src={reply.parent_reply.user.photo && reply.parent_reply.user.photo !== 'avatar.png'
                                ? `/static/uploads/avatar/${reply.parent_reply.user.id}/${reply.parent_reply.user.photo}`
                                : `/static/uploads/avatar/system/avatar.png`}
                              alt={reply.parent_reply.user.name}
                              sx={{ width: 16, height: 16 }} 
                              onError={(e) => {
                                console.error("Reply parent avatar failed to load");
                                if (e.currentTarget && e.currentTarget.setAttribute) {
                                  e.currentTarget.setAttribute('src', '/static/uploads/avatar/system/avatar.png');
                                }
                              }}
                            />
                            <Typography 
                              variant="caption"
                              sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                fontSize: '0.65rem'
                              }}
                            >
                              {reply.parent_reply.user.name}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 1, 
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mt: 0.25,
                              fontSize: '0.65rem',
                              lineHeight: 1.3,
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {reply.parent_reply.content}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        bgcolor: 'rgba(45, 45, 50, 0.5)',
                        p: 1.25,
                        borderRadius: '18px',
                        borderTopLeftRadius: '4px',
                        maxWidth: '100%',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: 'text.primary',
                          fontSize: '0.85rem',
                          lineHeight: 1.3,
                          width: '100%',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}>
                          {reply.content}
                        </Typography>
                        
                        {reply.image ? (
                          <Box sx={{ mt: 1, width: '100%' }}>
                            <Box
                              sx={{
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                width: '100%',
                                '&:hover': {
                                  '& .zoom-icon': {
                                    opacity: 1
                                  }
                                }
                              }}
                              onClick={(event) => {
                                if (!replyImageErrors[reply.id]) {
                                  event.stopPropagation();
                                  setLightboxOpen(true);
                                  setCurrentLightboxImage(sanitizeImagePath(replyImageFallbacks[reply.id] || reply.image));
                                }
                              }}
                            >
                              {!replyImageErrors[reply.id] ? (
                                <img 
                                  src={sanitizeImagePath(replyImageFallbacks[reply.id] || reply.image)}
                                  alt="Reply" 
                                  style={{ 
                                    width: '100%',
                                    maxHeight: '160px',
                                    borderRadius: '10px',
                                    objectFit: 'cover'
                                  }} 
                                  onError={() => handleReplyImageError(reply.id, replyImageFallbacks[reply.id] || reply.image)}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    border: '1px solid rgba(244, 67, 54, 0.3)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    color: '#f44336',
                                    fontSize: '0.7rem',
                                    textAlign: 'center'
                                  }}
                                >
                                  <Typography sx={{ fontWeight: 'bold', mb: 0.25, fontSize: '0.65rem' }}>
                                    Ошибка загрузки медиа
                                  </Typography>
                                </Box>
                              )}
                              {!replyImageErrors[reply.id] && (
                                <Box 
                                  className="zoom-icon"
                                  sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 28,
                                    height: 28,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.2s ease',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <ZoomInIcon sx={{ fontSize: '0.9rem' }} />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        ) : null}
                      </Box>

                      <Box sx={{
                        display: 'flex',
                        mt: 0.5,
                        alignItems: 'center',
                        ml: 1
                      }}>
                        <Box 
                          onClick={() => onLikeReply(reply.id)}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            p: '2px 4px',
                            borderRadius: '12px',
                            transition: 'all 0.15s ease',
                            mr: 1.5,
                            '&:hover': {
                              backgroundColor: 'rgba(140, 82, 255, 0.08)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          {reply.user_liked ? (
                            <FavoriteIcon sx={{ color: '#8c52ff', fontSize: 12 }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ color: '#757575', fontSize: 12 }} />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              ml: 0.5,
                              color: reply.user_liked ? '#8c52ff' : 'text.secondary',
                              fontSize: '0.75rem'
                            }}
                          >
                            {reply.likes_count}
                          </Typography>
                        </Box>

                        <Box 
                          onClick={() => {
                            handleMenuClose();
                            setReplyFormOpen(true);
                            setActiveComment(comment);
                            setReplyingToReply(reply);
                          }}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            p: '2px 4px',
                            borderRadius: '12px',
                            color: 'text.secondary',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: 'text.primary',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <ReplyIcon sx={{ fontSize: 12, transform: 'scaleX(-1)' }} />
                          <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.65rem' }}>
                            {t('comment.menu.reply')}
                          </Typography>
                        </Box>
                        
                        {isReplyOwner && (
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              setMenuAnchorEl(event.currentTarget);
                              
                              setMenuAnchorEl({
                                element: event.currentTarget,
                                replyId: reply.id,
                                commentId: comment.id
                              });
                            }}
                            sx={{ 
                              p: 0.25,
                              ml: 'auto',
                              color: 'text.secondary',
                              '&:hover': { color: 'text.primary' }
                            }}
                          >
                            <MoreVertIcon sx={{ fontSize: '0.85rem' }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      
      {isReplyFormOpen && activeCommentId === comment.id && (
        <Box sx={{ 
          mt: 1, 
          ml: { xs: 0.5, sm: 4 },
          pl: { xs: 0.5, sm: 2 },
          pr: { xs: 0.5, sm: 0 },
          position: 'relative'
        }}>
          {replyingToReply || !user?.id || comment.user_id !== user?.id ? (
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                pl: 0.5
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'rgba(140, 82, 255, 0.08)',
                  borderRadius: '8px',
                  py: 0.75,
                  px: 1,
                  fontSize: '0.7rem',
                  color: 'primary.main',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '100%'
                }}
              >
                <ReplyIcon sx={{ fontSize: 14, mr: 0.5, transform: 'scaleX(-1)' }} />
                <Box component="span" sx={{ 
                  display: 'inline-flex', 
                  fontWeight: 'medium',
                  whiteSpace: 'nowrap'
                }}>
                  Ответ для {replyingToReply 
                    ? replyingToReply.user.name
                    : comment.user.name}
                </Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    setReplyingToReply(null);
                  }}
                  sx={{ 
                    p: 0.25,
                    ml: 0.5,
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' }
                  }}
                >
                  <CloseIcon sx={{ fontSize: '0.7rem' }} />
                </IconButton>
              </Box>
            </Box>
          ) : null}

          <TextField
            fullWidth
            size="small"
            placeholder="Написать ответ..."
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            disabled={isSubmittingComment || Date.now() < waitUntil}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 0.75 }}>
                  <Avatar 
                    src={user?.photo && user.photo !== 'avatar.png'
                      ? `/static/uploads/avatar/${user.id}/${user.photo}`
                      : `/static/uploads/avatar/system/avatar.png`}
                    alt={user?.name}
                    sx={{ width: 30, height: 30 }}
                  />
                </Box>
              ),
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <input 
                    ref={replyFileInputRef}
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={handleReplyImageChange}
                    disabled={isSubmittingComment || Date.now() < waitUntil}
                  />
                  <IconButton
                    size="small"
                    onClick={() => replyFileInputRef.current.click()}
                    disabled={isSubmittingComment || Date.now() < waitUntil}
                    sx={{ padding: '4px' }}
                  >
                    <ImageIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onReplySubmit(comment.id, replyingToReply?.id)}
                    disabled={(!replyText.trim() && !replyImage) || isSubmittingComment || Date.now() < waitUntil}
                    sx={{ padding: '4px' }}
                  >
                    {isSubmittingComment ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setReplyFormOpen(false);
                      setActiveComment(null);
                      setReplyingToReply(null);
                      setReplyText('');
                      setReplyImage(null);
                      setReplyImagePreview('');
                    }}
                    sx={{ color: 'text.secondary', padding: '4px' }}
                  >
                    <CloseIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                  </IconButton>
                </Box>
              ),
              sx: { 
                bgcolor: 'rgba(28, 28, 32, 0.3)',
                backdropFilter: 'blur(5px)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(140, 82, 255, 0.2)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(140, 82, 255, 0.4)'
                },
                '& input': {
                  padding: '12px 5px',
                  fontSize: '0.9rem'
                }
              }
            }}
          />
          
          {replyImagePreview && (
            <Box sx={{ mt: 1, position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
              <img 
                src={replyImagePreview} 
                alt="Preview" 
                style={{ 
                  width: '100%', 
                  maxHeight: '120px', 
                  objectFit: 'cover'
                }} 
              />
              <IconButton
                size="small"
                onClick={handleRemoveReplyImage}
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  padding: '3px',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)'
                  }
                }}
              >
                <CloseIcon fontSize="small" sx={{ fontSize: '0.8rem', color: 'white' }} />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const PostDetailPage = ({ isOverlay = false }) => {
  const { postId } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Добавляем состояния для пагинации комментариев
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [commentsPagination, setCommentsPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });
  
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentImage, setCommentImage] = useState(null);
  const [replyImage, setReplyImage] = useState(null); 
  const [replyImagePreview, setReplyImagePreview] = useState(''); 
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const replyFileInputRef = useRef(null); 
  const commentInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [postMenuAnchorEl, setPostMenuAnchorEl] = useState(null);
  const [replyFormOpen, setReplyFormOpen] = useState(false);
  const [activeComment, setActiveComment] = useState(null);
  const [replyingToReply, setReplyingToReply] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLightboxImage, setCurrentLightboxImage] = useState(''); 
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [lastCommentTime, setLastCommentTime] = useState(0);
  const [waitUntil, setWaitUntil] = useState(0);
  
  // Минимальный интервал между комментариями
  const MIN_COMMENT_INTERVAL = 3000;
  
  const [commentDeleteDialog, setCommentDeleteDialog] = useState({
    open: false,
    deleting: false,
    deleted: false,
    commentId: null
  });

  const [replyDeleteDialog, setReplyDeleteDialog] = useState({
    open: false,
    deleting: false,
    deleted: false,
    commentId: null,
    replyId: null
  });

  const { overlayOpen, closePostDetail } = usePostDetail();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const viewCounted = useRef(false);
  
  const { t } = useLanguage();
  
  const loadComments = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setCommentsLoading(true);
      }
      
      const response = await axios.get(`/api/posts/${postId}/comments`, {
        params: {
          page: page,
          limit: 20
        }
      });
      
      if (response.data.comments) {
        const sanitizedComments = response.data.comments.map(comment => {
          if (comment.image) {
            comment.image = sanitizeImagePath(comment.image);
          }
          
          if (comment.replies && comment.replies.length > 0) {
            comment.replies = comment.replies.map(reply => {
              if (reply.image) {
                reply.image = sanitizeImagePath(reply.image);
              }
              return reply;
            });
          }
          
          return comment;
        });
        
        if (append) {
          setComments(prev => [...prev, ...sanitizedComments]);
        } else {
          setComments(sanitizedComments);
        }
        
        setCommentsPagination(response.data.pagination);
        setHasMoreComments(response.data.pagination.has_next);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при загрузке комментариев',
        severity: 'error'
      });
    } finally {
      setCommentsLoading(false);
    }
  };
  
  const loadMoreComments = async () => {
    if (!hasMoreComments || commentsLoading) return;
    
    const nextPage = commentsPagination.page + 1;
    await loadComments(nextPage, true);
  };
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Загружаем пост БЕЗ комментариев (include_comments=false по умолчанию)
        const response = await axios.get(`/api/posts/${postId}`);
        setPost(response.data.post);
        
        // Загружаем первую страницу комментариев отдельно
        await loadComments(1, false);
        
        setLoading(false);
        
        if (!viewCounted.current) {
          incrementViewCount(postId);
          viewCounted.current = true;
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const incrementViewCount = async (postId) => {
    try {
      
      const viewKey = `post_viewed_${postId}`;
      
      if (sessionStorage.getItem(viewKey)) {
        console.log(`Post ${postId} already viewed in this session (detail page)`);
        return;
      }
      
      
      sessionStorage.setItem(viewKey, 'true');
      console.log(`Setting view flag for post ${postId} (detail page)`);
      
      console.log(`Incrementing view count for post ${postId} (detail page)`);
      const response = await axios.post(`/api/posts/${postId}/view`);
      
      
      if (response.data && response.data.success) {
        console.log(`View count incremented successfully: ${response.data.views_count} (detail page)`);
        setPost(prevPost => {
          if (!prevPost) return null;
          
          return {
            ...prevPost,
            views_count: response.data.views_count
          };
        });
      }
    } catch (error) {
      console.error("Error incrementing view count (detail page):", error);
      
      const retryViewCount = async (retries = 2) => {
        if (retries <= 0) return;
        
        try {
          console.log(`Retrying view count increment (${retries} attempts left) (detail page)`);
          const response = await axios.post(`/api/posts/${postId}/view`);
          
          if (response.data && response.data.success) {
            console.log(`View count incremented on retry: ${response.data.views_count} (detail page)`);
            setPost(prevPost => {
              if (!prevPost) return null;
              return {
                ...prevPost,
                views_count: response.data.views_count
              };
            });
          }
        } catch (retryError) {
          console.error("Error on retry (detail page):", retryError);
          setTimeout(() => retryViewCount(retries - 1), 1000);
        }
      };
      
      
      setTimeout(() => retryViewCount(), 1000);
    }
  };



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCommentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCommentImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  
  const handleReplyImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setReplyImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        
        if (typeof reader.result === 'string') {
          setReplyImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleRemoveReplyImage = () => {
    setReplyImage(null);
    setReplyImagePreview('');
    if (replyFileInputRef.current) {
      replyFileInputRef.current.value = '';
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() && !commentImage) return;
    
    
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    
    const now = Date.now();
    if (now < waitUntil) {
      const secondsRemaining = Math.ceil((waitUntil - now) / 1000);
      setCommentError(`Пожалуйста, подождите ${secondsRemaining} сек. перед отправкой нового комментария`);
      setSnackbar({
        open: true,
        message: `Слишком частая отправка комментариев. Подождите ${secondsRemaining} сек.`,
        severity: 'warning'
      });
      return;
    }
    
    
    if (now - lastCommentTime < MIN_COMMENT_INTERVAL) {
      setCommentError("Пожалуйста, не отправляйте комментарии слишком часто");
      setSnackbar({
        open: true,
        message: "Не отправляйте комментарии слишком часто",
        severity: 'warning'
      });
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentError('');
      
      let response;
      if (commentImage) {
        const formData = new FormData();
        formData.append('content', commentText.trim());
        formData.append('image', commentImage);
        response = await axios.post(`/api/posts/${postId}/comments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`/api/posts/${postId}/comments`, {
          content: commentText.trim()
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      
      
      const newComment = response.data.comment;
      if (newComment && newComment.image) {
        newComment.image = sanitizeImagePath(newComment.image);
      }
      
      
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      setCommentImage(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setSnackbar({
        open: true,
        message: t('post.added'),
        severity: 'success'
      });
      
      
      setLastCommentTime(Date.now());
    } catch (error) {
      console.error('Error adding comment:', error);
      
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = t('post.errorTooFrequent');
        
        if (rateLimit && rateLimit.reset) {
          
          const resetTime = new Date(rateLimit.reset * 1000);
          const now = new Date();
          const diffSeconds = Math.round((resetTime - now) / 1000);
          
          if (diffSeconds > 60) {
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            errorMessage += `Следующий комментарий можно отправить через ${minutes} мин. ${seconds} сек.`;
          } else {
            errorMessage += `Следующий комментарий можно отправить через ${diffSeconds} сек.`;
          }
          
          
          setWaitUntil(now.getTime() + (diffSeconds * 1000));
        } else {
          errorMessage += t('post.wait');
          
          setWaitUntil(Date.now() + 30000);
        }
        
        setCommentError(errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } else if (error.response && error.response.data && error.response.data.error) {
        setCommentError(error.response.data.error);
        setSnackbar({
          open: true,
          message: error.response.data.error,
          severity: 'error'
        });
      } else {
        setCommentError(t('post.errorAddComment'));
        setSnackbar({
          open: true,
          message: t('post.errorAddComment'),
          severity: 'error'
        });
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (commentId, parentReplyId = null) => {
    if (!replyText.trim() && !replyImage) return;

    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }

    const now = Date.now();
    if (now < waitUntil) {
      const secondsRemaining = Math.ceil((waitUntil - now) / 1000);
      setCommentError(`Пожалуйста, подождите ${secondsRemaining} сек. перед отправкой нового комментария`);
      setSnackbar({
        open: true,
        message: `Слишком частая отправка комментариев. Подождите ${secondsRemaining} сек.`,
        severity: 'warning'
      });
      return;
    }
    
    if (now - lastCommentTime < MIN_COMMENT_INTERVAL) {
      setCommentError("Пожалуйста, не отправляйте комментарии слишком часто");
      setSnackbar({
        open: true,
        message: "Не отправляйте комментарии слишком часто",
        severity: 'warning'
      });
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentError('');
      
      let response;
      if (replyImage) {
        console.log("Submitting reply with image", replyImage);
        const formData = new FormData();
        formData.append('content', replyText.trim());
        formData.append('image', replyImage);
        if (parentReplyId) {
          formData.append('parent_reply_id', parentReplyId);
        }
        response = await axios.post(`/api/comments/${commentId}/replies`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`/api/comments/${commentId}/replies`, {
          content: replyText.trim(),
          parent_reply_id: parentReplyId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data.reply && response.data.reply.image) {
        response.data.reply.image = sanitizeImagePath(response.data.reply.image);
      }

      console.log("Reply submitted successfully, response:", response.data);
      if (response.data.reply) {
        console.log("Reply data structure:", {
          id: response.data.reply.id,
          image: response.data.reply.image,
          has_image: !!response.data.reply.image,
          image_type: typeof response.data.reply.image
        });
      }

      // Обновляем комментарии, добавляя новый ответ
      setComments(prev => prev.map(comment => 
        comment.id === commentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), response.data.reply],
              replies_count: (comment.replies_count || 0) + 1
            }
          : comment
      ));

      setReplyText('');
      setReplyFormOpen(false);
      setActiveComment(null);
      setReplyingToReply(null);
      setReplyImage(null);
      setReplyImagePreview('');
      if (replyFileInputRef.current) {
        replyFileInputRef.current.value = '';
      }
      
      setSnackbar({
        open: true,
        message: t('post.replyAdded'),
        severity: 'success'
      });
      
      setLastCommentTime(Date.now());
    } catch (error) {
      console.error('Error adding reply:', error);
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = t('post.errorTooFrequent');
        
        if (rateLimit && rateLimit.reset) {
          const resetTime = new Date(rateLimit.reset * 1000);
          const now = new Date();
          const diffSeconds = Math.round((resetTime - now) / 1000);
          
          if (diffSeconds > 60) {
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            errorMessage += `Следующий комментарий можно отправить через ${minutes} мин. ${seconds} сек.`;
          } else {
            errorMessage += `Следующий комментарий можно отправить через ${diffSeconds} сек.`;
          }
          
          setWaitUntil(now.getTime() + (diffSeconds * 1000));
        } else {
          errorMessage += t('post.wait');
          setWaitUntil(Date.now() + 30000);
        }
        
        setCommentError(errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } else if (error.response && error.response.data && error.response.data.error) {
        setCommentError(error.response.data.error);
        setSnackbar({
          open: true,
          message: error.response.data.error,
          severity: 'error'
        });
      } else {
        setCommentError(t('post.errorAddReply'));
        setSnackbar({
          open: true,
          message: t('post.errorAddReply'),
          severity: 'error'
        });
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { 
              ...comment, 
              user_liked: !comment.user_liked, 
              likes_count: comment.user_liked ? Math.max(0, comment.likes_count - 1) : comment.likes_count + 1 
            }
          : comment
      ));
      
      
      const response = await axios.post(`/api/comments/${commentId}/like`);
      
      
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, user_liked: response.data.liked, likes_count: response.data.likes_count }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
      
      setComments(prev => [...prev]);
    }
  };

  const handleLikeReply = async (replyId) => {
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      // Оптимистичное обновление UI
      setComments(prev => prev.map(comment => {
        // Находим комментарий, содержащий этот ответ
        if (!comment.replies || !comment.replies.some(reply => reply.id === replyId)) {
          return comment;
        }
        
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === replyId
              ? { 
                  ...reply, 
                  user_liked: !reply.user_liked, 
                  likes_count: reply.user_liked ? Math.max(0, reply.likes_count - 1) : reply.likes_count + 1 
                }
              : reply
          )
        };
      }));
      
      // Отправляем запрос на сервер
      const response = await axios.post(`/api/replies/${replyId}/like`);
      
      // Обновляем UI с реальными данными с сервера
      setComments(prev => prev.map(comment => {
        if (!comment.replies || !comment.replies.some(reply => reply.id === replyId)) {
          return comment;
        }
        
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === replyId
              ? { ...reply, user_liked: response.data.liked, likes_count: response.data.likes_count }
              : reply
          )
        };
      }));
    } catch (error) {
      console.error('Error liking reply:', error);
      // В случае ошибки возвращаем предыдущее состояние
      setComments(prev => [...prev]);
    }
  };

  const handlePostMenuOpen = () => {
    setPostMenuAnchorEl(true);
  };

  
  const handleDeleteComment = (commentId) => {
    
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    setCommentDeleteDialog({
      open: true,
      deleting: false,
      deleted: false,
      commentId
    });
  };

  
  const confirmDeleteComment = async () => {
    try {
      setCommentDeleteDialog(prev => ({ ...prev, deleting: true }));
      
      // Удаляем комментарий из локального состояния
      const updatedComments = comments.filter(comment => comment.id !== commentDeleteDialog.commentId);
      setComments(updatedComments);
      
      // Обновляем счетчик общего количества комментариев
      setCommentsPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
      
      setCommentDeleteDialog(prev => ({ ...prev, deleted: true, deleting: false }));
      
      // Отправляем запрос на сервер для фактического удаления
      await axios.post(`/api/comments/${commentDeleteDialog.commentId}/delete`);
      
      setTimeout(() => {
        setCommentDeleteDialog(prev => ({ ...prev, open: false }));
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      
      // В случае ошибки перезагружаем комментарии
      setSnackbar({
        open: true,
        message: t('post.errorDeleteComment'),
        severity: 'error'
      });
      
      // Перезагружаем первую страницу комментариев
      await loadComments(1, false);
    }
  };

  
  const handleDeleteReply = (commentId, replyId) => {
    
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    console.log("Deleting reply:", replyId, "from comment:", commentId);
    console.log("Current comments structure:", JSON.stringify(comments.map(c => ({ 
      id: c.id, 
      content: c.content.substring(0, 20) + "...", 
      replies_count: c.replies?.length 
    }))));
    
    setReplyDeleteDialog({
      open: true,
      deleting: false,
      deleted: false,
      commentId,
      replyId
    });
  };

  
  const confirmDeleteReply = async () => {
    try {
      setReplyDeleteDialog(prev => ({ ...prev, deleting: true }));
      
      console.log("Before deletion - Comment ID:", replyDeleteDialog.commentId, "Reply ID:", replyDeleteDialog.replyId);
      console.log("Comments count:", comments.length);
      
      // Обновляем комментарии, удаляя ответ
      const newComments = comments.map(comment => {
        if (comment.id !== replyDeleteDialog.commentId) {
          return {...comment};
        }
        
        return {
          ...comment,
          replies: comment.replies.filter(reply => reply.id !== replyDeleteDialog.replyId),
          replies_count: Math.max(0, (comment.replies_count || 0) - 1)
        };
      });
      
      console.log("After filtering - Comments count:", newComments.length);
      
      setComments(newComments);
      
      setReplyDeleteDialog(prev => ({ ...prev, deleted: true, deleting: false }));
      
      // Отправляем запрос на сервер для фактического удаления
      await axios.post(`/api/replies/${replyDeleteDialog.replyId}/delete`);
      
      setTimeout(() => {
        setReplyDeleteDialog(prev => ({ ...prev, open: false }));
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting reply:', error);
      
      setSnackbar({
        open: true,
        message: t('post.errorDeleteReply'),
        severity: 'error'
      });
      
      // В случае ошибки перезагружаем комментарии
      try {
        console.log("Reloading comments after error");
        await loadComments(commentsPagination.page, false);
      } catch (refreshError) {
        console.error('Error refreshing comments after delete error:', refreshError);
      }
    }
  };


  
  const handleClose = () => {
    console.log("Closing post detail overlay");
    closePostDetail();
  };
  
  
  const renderContent = () => (
    <Container maxWidth="md" sx={{ pt: 2, pb: 10, px: { xs: 0, sm: 0 } }}> 
    {/* Image lightbox */}
    {lightboxOpen && (
        <SimpleImageViewer
          isOpen={lightboxOpen}
          onClose={() => {
            setLightboxOpen(false);
            setCurrentLightboxImage(null);
          }}
          images={currentLightboxImage ? [currentLightboxImage] : (post?.images || [])}
          initialIndex={0}
        />
      )}
      {post && (
        <SEO
          title={`${post.user?.name || 'Пользователь'} - ${post.content.substring(0, 60)}${post.content.length > 60 ? '...' : ''}`}
          description={post.content.substring(0, 160)}
          image={post.images && Array.isArray(post.images) && post.images.length > 0 
            ? (typeof post.images[0] === 'string' && post.images[0].startsWith('http')
              ? post.images[0] 
              : `/static/uploads/posts/${post.images[0]}`)
            : null}
          type="article"
          meta={{
            author: post.user?.name,
            publishedTime: post.created_at,
            modifiedTime: post.updated_at,
          }}
        />
      )}
      
      {!isOverlay && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 }, px: { xs: 2, sm: 0 } }}>
          <IconButton 
            component={Link} 
            to="/"
            sx={{ mr: 1 }}
            aria-label="Назад"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>{t('post.post')}</Typography>
        </Box>
      )}

      {post && (
        <Post 
          post={post}
          onDelete={() => navigate('/')}
          onOpenLightbox={(imageUrl) => {
            setLightboxOpen(true);
            
            if (Array.isArray(post.images)) {
              const index = post.images.indexOf(imageUrl);
              if (index !== -1) {
                setCurrentImageIndex(index);
              }
            }
          }}
        />
      )}

      {/* Comments Section */}
      <Box sx={{ px: { xs: 2, sm: 0 }, mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: { xs: 2, sm: 2.5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 600,
            color: 'text.primary',
            fontSize: { xs: '0.95rem', sm: '1.1rem' },
            letterSpacing: '0.01em'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            {t('post.comments')} ({commentsPagination.total || 0})
          </Box>
        </Typography>

        {user ? (
          <Box sx={{ mb: 3 }}>
            {commentError && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setCommentError('')}
              >
                {commentError}
              </Alert>
            )}
            <TextField
              ref={commentInputRef}
              fullWidth
              size="small"
              placeholder={t('post.writeComment')}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmittingComment || Date.now() < waitUntil}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 0.75 }}>
                    <Avatar 
                      src={user?.photo && user.photo !== 'avatar.png'
                        ? `/static/uploads/avatar/${user.id}/${user.photo}`
                        : `/static/uploads/avatar/system/avatar.png`}
                      alt={user?.name}
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>
                ),
                endAdornment: (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                      disabled={isSubmittingComment || Date.now() < waitUntil}
                    />
                    <IconButton 
                      size="small"
                      onClick={() => fileInputRef.current.click()}
                      disabled={isSubmittingComment || Date.now() < waitUntil}
                      sx={{ padding: '4px' }}
                    >
                      <ImageIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleCommentSubmit}
                      disabled={(!commentText.trim() && !commentImage) || isSubmittingComment || Date.now() < waitUntil}
                      sx={{ padding: '4px' }}
                    >
                      {isSubmittingComment ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SendIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                      )}
                    </IconButton>
                  </Box>
                ),
                sx: { 
                  bgcolor: 'rgba(28, 28, 32, 0.3)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(140, 82, 255, 0.2)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(140, 82, 255, 0.4)'
                  },
                  '& input': {
                    padding: '12px 5px',
                    fontSize: '0.9rem'
                  }
                }
              }}
            />
            
            {imagePreview && (
              <Box sx={{ mt: 1, position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '150px', 
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }} 
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    padding: '3px',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                >
                  <CloseIcon fontSize="small" sx={{ fontSize: '0.8rem', color: 'white' }} />
                </IconButton>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{ 
                py: 2, 
                bgcolor: 'rgba(28, 28, 32, 0.3)', 
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.03)'
              }}
            >
              <MuiLink 
                component={Link} 
                to="/login" 
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {t('post.loginToComment')}
              </MuiLink>
              , чтобы оставить комментарий
            </Typography>
          </Box>
        )}

        {loading || commentsLoading && commentsPagination.page === 1 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: { xs: 2, sm: 3 } }}>
            <CircularProgress size={30} thickness={4} />
          </Box>
        ) : (comments && comments.length > 0) ? (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 0.5, sm: 0.5 } 
            }}>
              {comments.map(comment => (
                <Comment 
                  key={comment.id} 
                  comment={comment} 
                  onLike={handleLikeComment}
                  onLikeReply={(replyId) => handleLikeReply(replyId)}
                  onReply={(replyOrComment, commentId) => {
                    setActiveComment(commentId ? { id: commentId } : replyOrComment);
                    setReplyFormOpen(true);
                    setReplyText('');
                    setReplyingToReply(replyOrComment.id !== comment.id ? replyOrComment : null);
                  }}
                  isReplyFormOpen={replyFormOpen}
                  activeCommentId={activeComment?.id}
                  replyText={replyText}
                  onReplyTextChange={setReplyText}
                  onReplySubmit={handleReplySubmit}
                  replyingToReply={replyingToReply}
                  setReplyingToReply={setReplyingToReply}
                  setReplyFormOpen={setReplyFormOpen}
                  setActiveComment={setActiveComment}
                  onDeleteComment={handleDeleteComment}
                  onDeleteReply={handleDeleteReply}
                  isSubmittingComment={isSubmittingComment}
                  waitUntil={waitUntil}
                  handleReplyImageChange={handleReplyImageChange}
                  currentLightboxImage={currentLightboxImage}
                  setCurrentLightboxImage={setCurrentLightboxImage}
                  replyFileInputRef={replyFileInputRef}
                  handleRemoveReplyImage={handleRemoveReplyImage}
                  replyImage={replyImage}
                  replyImagePreview={replyImagePreview}
                  setReplyImage={setReplyImage}
                  setLightboxOpen={setLightboxOpen}
                />
              ))}
            </Box>
            
            {/* Load More Comments Button */}
            {hasMoreComments && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 3,
                mb: 2
              }}>
                <Button
                  variant="outlined"
                  onClick={loadMoreComments}
                  disabled={commentsLoading}
                  startIcon={commentsLoading ? <CircularProgress size={16} /> : <ChatBubbleOutlineIcon />}
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    borderColor: 'rgba(140, 82, 255, 0.3)',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(140, 82, 255, 0.05)'
                    }
                  }}
                >
                  {commentsLoading 
                    ? 'Загрузка...' 
                    : `Загрузить еще (${commentsPagination.total - comments.length})`
                  }
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ 
            p: { xs: 3, sm: 4 }, 
            textAlign: 'center',
            bgcolor: 'rgba(28, 28, 32, 0.3)',
            borderRadius: '20px',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)'
          }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: 'text.secondary', mb: { xs: 1, sm: 1.5 }, opacity: 0.5 }} />
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
              {t('post.noComments')}
            </Typography>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={(snackbar.severity === 'success' || snackbar.severity === 'error' || 
                   snackbar.severity === 'warning' || snackbar.severity === 'info') 
                   ? snackbar.severity : 'success'}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={commentDeleteDialog.open}
        onClose={() => !commentDeleteDialog.deleting && !commentDeleteDialog.deleted && setCommentDeleteDialog(prev => ({ ...prev, open: false }))}
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
          {commentDeleteDialog.deleted ? (
            <>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 56, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                  {t('post.commentDeleted')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {t('post.commentDeleted')}
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
                <DeleteIcon sx={{ mr: 1 }} /> {t('post.confirmDelete')}
              </Typography>
              <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                {t('post.sureDelete')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  onClick={() => setCommentDeleteDialog(prev => ({ ...prev, open: false }))}
                  disabled={commentDeleteDialog.deleting}
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
                  {t('post.cancel')}
                </Button>
                <Button 
                  onClick={confirmDeleteComment}
                  disabled={commentDeleteDialog.deleting}
                  variant="contained" 
                  color="error"
                  sx={{ 
                    borderRadius: '10px',
                    boxShadow: 'none',
                    px: 2
                  }}
                  endIcon={commentDeleteDialog.deleting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {commentDeleteDialog.deleting ? t('post.deleteInProgress') : t('post.confirmDelete')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Dialog>

      <Dialog
        open={replyDeleteDialog.open}
        onClose={() => !replyDeleteDialog.deleting && !replyDeleteDialog.deleted && setReplyDeleteDialog(prev => ({ ...prev, open: false }))}
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
          {replyDeleteDialog.deleted ? (
            <>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 56, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                  {t('post.replyDeleted')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {t('post.replyDeleted')}
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
                  <DeleteIcon sx={{ mr: 1 }} /> {t('comment.dialog.delete_reply.title')}
                </Typography>
                <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                  {t('comment.dialog.delete_reply.message')}
                </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                  <Button 
                    onClick={() => setReplyDeleteDialog(prev => ({ ...prev, open: false }))}
                    disabled={replyDeleteDialog.deleting}
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
                    {t('comment.dialog.delete_reply.cancel')}
                  </Button>
                  <Button 
                    onClick={confirmDeleteReply}
                    disabled={replyDeleteDialog.deleting}
                    variant="contained" 
                    color="error"
                    sx={{ 
                      borderRadius: '10px',
                      boxShadow: 'none',
                      px: 2
                    }}
                  >
                    {t('comment.dialog.delete_reply.confirm')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </Container>
  );
  
  
  if (isOverlay) {
    return (
      <Dialog
        fullScreen={fullScreen}
        open={true} 
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted={false}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)', 
            backgroundImage: 'none', 
          }
        }}
        PaperProps={{
          sx: {
            bgcolor: '#0a0a0a', 
            backgroundImage: 'none', 
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: { xs: 0, sm: 2 }
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            width: { sm: '100%', md: '90%', lg: '55%' },
            height: { xs: '100%', sm: '90vh' },
            maxWidth: 1000,
            m: { xs: 0, sm: 2 },
            backgroundColor: '#0a0a0a', 
            backgroundImage: 'none !important', 
          },
          '& .MuiBackdrop-root': {
            backgroundColor: '#000000 !important', 
            backgroundImage: 'none !important', 
            opacity: '0.95 !important', 
          },
          
          '& .MuiModal-backdrop': {
            backgroundColor: '#000000 !important',
            backgroundImage: 'none !important',
          }
        }}
      >
        <AppBar 
          sx={{ 
            position: 'relative',
            backgroundColor: '#0a0a0a', 
            backgroundImage: 'none', 
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              {fullScreen ? <ArrowBackIcon /> : <CloseIcon />}
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {t('post.post')}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box 
          sx={{ 
            overflow: 'auto', 
            height: '100%', 
            px: 0,
            backgroundColor: '#0a0a0a', 
            backgroundImage: 'none', 
          }}
        > 
          {renderContent()}
        </Box>
      </Dialog>
    );
  }
  
  
  return renderContent();
};

export default PostDetailPage;