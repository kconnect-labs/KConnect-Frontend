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
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ImageGrid from '../../components/Post/ImageGrid';
import LightBox from '../../components/LightBox';
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
  setReplyImage
}) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [commentImageError, setCommentImageError] = useState(false);
  const [replyImageErrors, setReplyImageErrors] = useState({});
  const [replyImageFallbacks, setReplyImageFallbacks] = useState({});

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenImage = () => {
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handleCommentImageError = () => {
    console.error("Comment image failed to load:", comment.image);
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

  return (
    <Box>
      <Box 
        id={`comment-${comment.id}`}
        sx={{ 
        bgcolor: 'rgba(28, 28, 32, 0.4)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '14px', 
        p: { xs: 1.5, sm: 2 }, 
        border: '1px solid rgba(255, 255, 255, 0.03)', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12)',
          bgcolor: 'rgba(30, 30, 36, 0.5)'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 1.5 } }}>
          <Avatar 
            src={comment.user.photo && comment.user.photo !== 'avatar.png'
              ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
              : `/static/uploads/avatar/system/avatar.png`}
            alt={comment.user.name}
            component={Link}
            to={`/profile/${comment.user.username}`}
            sx={{ 
              width: { xs: 30, sm: 36 }, 
              height: { xs: 30, sm: 36 },
              border: '1px solid rgba(140, 82, 255, 0.2)', 
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
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  component={Link}
                  to={`/profile/${comment.user.username}`}
                  sx={{ 
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' } 
                  }}
                >
                  {comment.user.name}
                  {comment.user.verification && comment.user.verification.status > 0 && (
                    <CheckCircleIcon 
                      sx={{ 
                        ml: 0.5,
                        color: comment.user.verification.status === 1 ? '#9e9e9e' : 
                               comment.user.verification.status === 2 ? '#d67270' : 
                               comment.user.verification.status === 3 ? '#b39ddb' : 
                               'primary.main',
                        width: { xs: 12, sm: 14 },
                        height: { xs: 12, sm: 14 }
                      }}
                    />
                  )}
                  {comment.user.achievement && (
                    <Box 
                      component="img" 
                      sx={{ 
                        width: { xs: 14, sm: 16 }, 
                        height: { xs: 14, sm: 16 }, 
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
                  sx={{ ml: 1, fontSize: '0.65rem' }}
                >
                  {formatTimeAgo(comment.timestamp)}
                </Typography>
              </Box>
              {isCommentOwner && (
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0.25,
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' }
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )}
              <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(28, 28, 32, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    mt: 1
                  }
                }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    setReplyingToReply(null);
                    setReplyFormOpen(true);
                    setActiveComment(comment);
                  }}
                  sx={{
                    borderRadius: '8px',
                    mx: 0.5,
                    my: 0.2,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <ReplyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText primary="Ответить" />
                </MenuItem>
                {isCommentOwner && (
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      onDeleteComment(comment.id);
                    }}
                    sx={{ 
                      color: '#f44336', 
                      borderRadius: '8px',
                      mx: 0.5,
                      my: 0.2,
                      '&:hover': {
                        bgcolor: 'rgba(244, 67, 54, 0.08)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
                    </ListItemIcon>
                    <ListItemText primary="Удалить" />
                  </MenuItem>
                )}
              </Menu>
            </Box>
            
            <Typography variant="body2" sx={{ 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              color: 'text.primary',
              lineHeight: 1.4,
              mb: { xs: 1, sm: 1.5 },
              mt: 0.5,
              fontSize: { xs: '0.8rem', sm: '0.85rem' }
            }}>
              {comment.content}
            </Typography>
            
            {comment.image && (
              <Box sx={{ mt: 1, mb: { xs: 1, sm: 1.5 } }}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    display: 'inline-block', 
                    maxWidth: { xs: '240px', sm: '280px' }, 
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
                      src={comment.image}
                      alt="Comment" 
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '10px',
                        objectFit: 'contain', 
                        display: 'block', 
                        margin: '0 auto' 
                      }} 
                      onError={handleCommentImageError}
                    />
                  ) : (
                    <Box
                      sx={{
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        borderRadius: '8px',
                        padding: '10px',
                        margin: '10px 0',
                        color: '#f44336',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        wordBreak: 'break-all'
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Ошибка загрузки медиа
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {comment.image || 'URL недоступен'}
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
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <ZoomInIcon sx={{ fontSize: '1.2rem' }} />
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 0.5, 
              gap: { xs: 1, sm: 1.5 },
              flexWrap: 'wrap'
            }}>
              <Box 
                onClick={() => onLike(comment.id)}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: { xs: '3px 6px', sm: '4px 8px' },
                  borderRadius: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: comment.user_liked ? 'rgba(140, 82, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  '&:hover': {
                    backgroundColor: comment.user_liked ? 'rgba(140, 82, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {comment.user_liked ? (
                  <FavoriteIcon sx={{ color: '#8c52ff', fontSize: { xs: 14, sm: 16 } }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: '#757575', fontSize: { xs: 14, sm: 16 } }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 0.5,
                    color: comment.user_liked ? '#8c52ff' : 'text.secondary',
                    fontWeight: comment.user_liked ? 'medium' : 'normal',
                    fontSize: '0.7rem'
                  }}
                >
                  {comment.likes_count}
                </Typography>
              </Box>

              <Box 
                onClick={() => {
                  setReplyingToReply(null);
                  setReplyFormOpen(true);
                  setActiveComment(comment);
                }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: { xs: '3px 6px', sm: '4px 8px' },
                  borderRadius: '16px',
                  color: 'text.secondary',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: 'text.primary',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                  Ответить
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      
      {lightboxOpen && comment.image && !currentLightboxImage && (
        <LightBox
          isOpen={lightboxOpen}
          onClose={handleCloseLightbox}
          imageSrc={comment.image}
        />
      )}
      
      
      {lightboxOpen && currentLightboxImage && (
        <LightBox
          isOpen={lightboxOpen}
          onClose={() => {
            setLightboxOpen(false);
            setCurrentLightboxImage('');
          }}
          imageSrc={currentLightboxImage}
        />
      )}

      
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ 
          mt: 0.5, 
          ml: { xs: 0.5, sm: 4 }, 
          pl: { xs: 0.5, sm: 2 },
          borderLeft: '2px solid rgba(140, 82, 255, 0.2)',
          py: { xs: 0.5, sm: 1 }
        }}>
          {[...comment.replies]
            
            .sort((a, b) => {
              
              const dateA = a.created_at ? new Date(a.created_at) : a.timestamp ? new Date(a.timestamp) : new Date(0);
              const dateB = b.created_at ? new Date(b.created_at) : b.timestamp ? new Date(b.timestamp) : new Date(0);
              
              return dateA.getTime() - dateB.getTime();
            })
            .map(reply => {
              const isReplyOwner = user && (reply.user_id === user.id || user.is_admin);
              return (
                <Box 
                  key={reply.id}
                  sx={{ 
                    bgcolor: 'rgba(32, 32, 36, 0.4)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '14px',
                    p: { xs: 1.25, sm: 2 }, 
                    mb: 1, 
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12)',
                      bgcolor: 'rgba(35, 35, 40, 0.5)'
                    }
                  }}
                >
                  
                  {reply.parent_reply_id ? (
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        p: { xs: 1, sm: 1.5 }, 
                        mb: 1, 
                        borderLeft: '3px solid rgba(140, 82, 255, 0.5)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.photo && comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.photo !== 'avatar.png'
                            ? `/static/uploads/avatar/${comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.id}/${comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.photo}`
                            : `/static/uploads/avatar/system/avatar.png`}
                          alt={comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.name}
                          sx={{ width: 18, height: 18 }} 
                          onError={(e) => {
                            console.error("Reply avatar failed to load");
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
                            fontSize: '0.7rem'
                          }}
                        >
                          {comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.name}
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
                          fontSize: '0.7rem',
                          lineHeight: 1.3,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {comment.replies.find(r => r.id === reply.parent_reply_id)?.content}
                      </Typography>
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        p: { xs: 1, sm: 1.5 }, 
                        mb: 1, 
                        borderLeft: '3px solid rgba(140, 82, 255, 0.5)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={comment.user.photo && comment.user.photo !== 'avatar.png'
                            ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
                            : `/static/uploads/avatar/system/avatar.png`}
                          alt={comment.user.name}
                          sx={{ width: 18, height: 18 }} 
                          onError={(e) => {
                            console.error("Reply form avatar failed to load");
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
                            fontSize: '0.7rem'
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
                          fontSize: '0.7rem',
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

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Avatar 
                      src={reply.user.photo && reply.user.photo !== 'avatar.png'
                        ? `/static/uploads/avatar/${reply.user.id}/${reply.user.photo}`
                        : `/static/uploads/avatar/system/avatar.png`}
                      alt={reply.user.name}
                      component={Link}
                      to={`/profile/${reply.user.username}`}
                      sx={{ 
                        width: 26, 
                        height: 26,
                        border: '1px solid rgba(140, 82, 255, 0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
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
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            component={Link}
                            to={`/profile/${reply.user.username}`}
                            sx={{ 
                              fontWeight: 'bold',
                              textDecoration: 'none',
                              color: 'text.primary',
                              '&:hover': { color: 'primary.main' },
                              fontSize: '0.8rem'
                            }}
                          >
                            {reply.user.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ ml: 0.5, fontSize: '0.65rem' }}
                          >
                            {formatTimeAgo(reply.timestamp)}
                          </Typography>
                        </Box>
                        {isReplyOwner && (
                          <React.Fragment>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAnchorEl(e.currentTarget);
                              }}
                              sx={{ 
                                p: 0.25,
                                color: 'text.secondary',
                                '&:hover': { color: 'text.primary' }
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
                                  bgcolor: 'rgba(32, 32, 36, 0.9)',
                                  backdropFilter: 'blur(10px)',
                                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                                  borderRadius: '12px',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  mt: 1
                                }
                              }}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                            >
                              <MenuItem 
                                onClick={() => {
                                  handleMenuClose();
                                  setReplyingToReply(reply);
                                  setReplyFormOpen(true);
                                  setActiveComment(comment);
                                }}
                                sx={{
                                  borderRadius: '8px',
                                  mx: 0.5,
                                  my: 0.2,
                                  '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.05)'
                                  }
                                }}
                              >
                                <ListItemIcon>
                                  <ReplyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </ListItemIcon>
                                <ListItemText primary="Ответить" />
                              </MenuItem>
                              <MenuItem 
                                onClick={() => {
                                  handleMenuClose();
                                  onDeleteReply(comment.id, reply.id);
                                }}
                                sx={{ 
                                  color: '#f44336',
                                  borderRadius: '8px',
                                  mx: 0.5,
                                  my: 0.2,
                                  '&:hover': {
                                    bgcolor: 'rgba(244, 67, 54, 0.08)'
                                  }
                                }}
                              >
                                <ListItemIcon>
                                  <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
                                </ListItemIcon>
                                <ListItemText primary="Удалить" />
                              </MenuItem>
                            </Menu>
                          </React.Fragment>
                        )}
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        color: 'text.primary',
                        fontSize: '0.75rem',
                        lineHeight: 1.4,
                        mt: 0.5,
                        mb: 0.5,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {reply.content}
                      </Typography>
                      
                      
                      {reply.image ? (
                        <Box sx={{ mt: 1, mb: { xs: 1, sm: 1.5 } }}>
                          <Box
                            sx={{
                              position: 'relative',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                              cursor: 'pointer',
                              display: 'inline-block', 
                              maxWidth: { xs: '240px', sm: '280px' }, 
                              '&:hover': {
                                '& .zoom-icon': {
                                  opacity: 1
                                }
                              }
                            }}
                            onClick={() => {
                              if (!replyImageErrors[reply.id]) {
                                setLightboxOpen(true);
                                setCurrentLightboxImage(replyImageFallbacks[reply.id] || reply.image);
                              }
                            }}
                          >
                            {!replyImageErrors[reply.id] ? (
                              <img 
                                src={replyImageFallbacks[reply.id] || reply.image}
                                alt="Reply" 
                                style={{ 
                                  maxWidth: '100%',
                                  maxHeight: '200px',
                                  borderRadius: '10px',
                                  objectFit: 'contain', 
                                  display: 'block', 
                                  margin: '0 auto' 
                                }} 
                                onError={() => handleReplyImageError(reply.id, replyImageFallbacks[reply.id] || reply.image)}
                              />
                            ) : (
                              <Box
                                sx={{
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  border: '1px solid rgba(244, 67, 54, 0.3)',
                                  borderRadius: '8px',
                                  padding: '10px',
                                  color: '#f44336',
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                  width: '100%'
                                }}
                              >
                                <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                  Ошибка загрузки медиа
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', opacity: 0.8, wordBreak: 'break-all' }}>
                                  {reply.image || 'URL недоступен'}
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
                                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: 36,
                                  height: 36,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0,
                                  transition: 'opacity 0.2s ease',
                                  cursor: 'pointer'
                                }}
                              >
                                <ZoomInIcon sx={{ fontSize: '1.2rem' }} />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ) : null}
                      
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                        <Box 
                          onClick={() => onLikeReply(reply.id)}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '3px 6px',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            backgroundColor: reply.user_liked ? 'rgba(140, 82, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                            '&:hover': {
                              backgroundColor: reply.user_liked ? 'rgba(140, 82, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                              transform: 'translateY(-1px)'
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
                              fontWeight: reply.user_liked ? 'bold' : 'normal',
                              fontSize: '0.7rem'
                            }}
                          >
                            {reply.likes_count}
                          </Typography>
                        </Box>

                        <Box 
                          onClick={() => {
                            handleMenuClose();
                            setReplyingToReply(reply);
                            setReplyFormOpen(true);
                            setActiveComment(comment);
                          }}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '3px 6px',
                            borderRadius: '12px',
                            color: 'text.secondary',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: 'text.primary',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          <CommentOutlinedIcon sx={{ fontSize: 12 }} />
                          <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Ответить
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
        </Box>
      )}

      
      {isReplyFormOpen && activeCommentId === comment.id && (
        <Box sx={{ 
          mt: 1, 
          ml: { xs: 0.5, sm: 4 },
          pl: { xs: 0.5, sm: 2 },
          pr: { xs: 0.5, sm: 0 },
          position: 'relative'
        }}>
          
          <Box 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              p: { xs: 1, sm: 1.5 },
              mb: 1,
              borderLeft: '3px solid rgba(140, 82, 255, 0.5)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Avatar 
                src={replyingToReply 
                  ? (replyingToReply.user.photo && replyingToReply.user.photo !== 'avatar.png'
                    ? `/static/uploads/avatar/${replyingToReply.user.id}/${replyingToReply.user.photo}`
                    : `/static/uploads/avatar/system/avatar.png`)
                  : (comment.user.photo && comment.user.photo !== 'avatar.png'
                    ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
                    : `/static/uploads/avatar/system/avatar.png`)}
                alt={replyingToReply ? replyingToReply.user.name : comment.user.name}
                sx={{ width: 18, height: 18 }}
                onError={(e) => {
                  console.error("Reply form avatar failed to load");
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
                  fontSize: '0.7rem'
                }}
              >
                {replyingToReply ? replyingToReply.user.name : comment.user.name}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mt: 0.25,
              fontSize: '0.7rem',
              lineHeight: 1.3,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>
              {replyingToReply ? replyingToReply.content : comment.content}
            </Typography>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Написать ответ..."
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            disabled={isSubmittingComment || Date.now() < waitUntil}
            InputProps={{
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleReplyImageChange}
                    ref={replyFileInputRef}
                    style={{ display: 'none' }}
                    id="reply-image-upload"
                    disabled={isSubmittingComment || Date.now() < waitUntil}
                  />
                  <IconButton
                    size="small"
                    component="label"
                    htmlFor="reply-image-upload"
                    sx={{ color: 'text.secondary' }}
                    disabled={isSubmittingComment || Date.now() < waitUntil}
                  >
                    <ImageIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onReplySubmit(comment.id, replyingToReply?.id)}
                    disabled={(!replyText.trim() && !replyImage) || isSubmittingComment || Date.now() < waitUntil}
                  >
                    {isSubmittingComment ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendIcon fontSize="small" />
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
                    sx={{ color: 'text.secondary' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ),
              sx: { 
                bgcolor: 'rgba(32, 32, 36, 0.6)',
                backdropFilter: 'blur(5px)',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(140, 82, 255, 0.3)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(140, 82, 255, 0.5)'
                }
              }
            }}
          />
          
          
          {replyImagePreview && (
            <Box sx={{ mt: 1, position: 'relative' }}>
              <img 
                src={replyImagePreview} 
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
                onClick={handleRemoveReplyImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLightboxImage, setCurrentLightboxImage] = useState(''); 
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [lastCommentTime, setLastCommentTime] = useState(0);
  const [waitUntil, setWaitUntil] = useState(0);
  
  
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
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/${postId}`);
        setPost(response.data.post);
        setComments(response.data.comments);
        
        
        console.log("DEBUG - Post data received:", response.data);
        
        
        const hasReplyWithImage = response.data.comments.some(comment => 
          comment.replies && comment.replies.some(reply => reply.image)
        );
        console.log("DEBUG - Any replies with image field:", hasReplyWithImage);
        
        
        const replyWithImage = response.data.comments
          .flatMap(c => c.replies || [])
          .find(r => r.image);
        if (replyWithImage) {
          console.log("DEBUG - Example reply with image:", replyWithImage);
        }
        
        
        const totalReplies = response.data.comments.reduce(
          (sum, comment) => sum + (comment.replies ? comment.replies.length : 0), 
          0
        );
        console.log(`DEBUG - Total replies: ${totalReplies}`);
        
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

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

      
      setComments(prev => [response.data.comment, ...prev]);
      setCommentText('');
      setCommentImage(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setSnackbar({
        open: true,
        message: 'Комментарий добавлен',
        severity: 'success'
      });
      
      
      setLastCommentTime(Date.now());
    } catch (error) {
      console.error('Error adding comment:', error);
      
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = "Превышен лимит комментариев. ";
        
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
          errorMessage += "Пожалуйста, повторите попытку позже.";
          
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
        setCommentError('Ошибка при добавлении комментария');
        setSnackbar({
          open: true,
          message: 'Ошибка при добавлении комментария',
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

      console.log("Reply submitted successfully, response:", response.data);
      if (response.data.reply) {
        console.log("Reply data structure:", {
          id: response.data.reply.id,
          image: response.data.reply.image,
          has_image: !!response.data.reply.image,
          image_type: typeof response.data.reply.image
        });
      }

      
      setComments(prev => prev.map(comment => 
        comment.id === commentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), response.data.reply]
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
        message: 'Ответ добавлен',
        severity: 'success'
      });
      
      
      setLastCommentTime(Date.now());
    } catch (error) {
      console.error('Error adding reply:', error);
      
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = "Превышен лимит комментариев. ";
        
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
          errorMessage += "Пожалуйста, повторите попытку позже.";
          
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
        setCommentError('Ошибка при добавлении ответа');
        setSnackbar({
          open: true,
          message: 'Ошибка при добавлении ответа',
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

  const handleLikeReply = async (commentId, replyId) => {
    
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? {
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
            }
          : comment
      ));
      
      
      const response = await axios.post(`/api/replies/${replyId}/like`);
      
      
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, user_liked: response.data.liked, likes_count: response.data.likes_count }
                  : reply
              )
            }
          : comment
      ));
    } catch (error) {
      console.error('Error liking reply:', error);
      
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
      
      
      setComments(prev => prev.filter(comment => comment.id !== commentDeleteDialog.commentId));
      
      
      setCommentDeleteDialog(prev => ({ ...prev, deleted: true, deleting: false }));
      
      
      await axios.post(`/api/comments/${commentDeleteDialog.commentId}/delete`);
      
      
      setTimeout(() => {
        setCommentDeleteDialog(prev => ({ ...prev, open: false }));
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      
      
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении комментария',
        severity: 'error'
      });
    }
  };

  
  const handleDeleteReply = (commentId, replyId) => {
    
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
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
      
      
      setComments(prev => {
        const updatedComments = [...prev];
        
        
        const commentIndex = updatedComments.findIndex(c => c.id === replyDeleteDialog.commentId);
        
        if (commentIndex !== -1) {
          
          const updatedComment = {
            ...updatedComments[commentIndex],
            replies: updatedComments[commentIndex].replies.filter(reply => reply.id !== replyDeleteDialog.replyId)
          };
          
          
          updatedComments[commentIndex] = updatedComment;
        }
        
        return updatedComments;
      });
      
      
      setReplyDeleteDialog(prev => ({ ...prev, deleted: true, deleting: false }));
      
      
      await axios.post(`/api/replies/${replyDeleteDialog.replyId}/delete`);
      
      
      setTimeout(() => {
        setReplyDeleteDialog(prev => ({ ...prev, open: false }));
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting reply:', error);
      
      
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении ответа',
        severity: 'error'
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await axios.post(`/api/notifications/${notification.id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  
  const handleClose = () => {
    console.log("Closing post detail overlay");
    closePostDetail();
  };
  
  
  const renderContent = () => (
    <Container maxWidth="md" sx={{ pt: 2, pb: 10, px: { xs: 0, sm: 0 } }}> 
      
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
          <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Пост</Typography>
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

      
      <Box sx={{ px: { xs: 2, sm: 0 }, mb: { xs: 1, sm: 2 }, mt: { xs: 2, sm: 3 } }}>
        {user ? (
          <Box>
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
              placeholder="Написать комментарий..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmittingComment || Date.now() < waitUntil}
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', gap: 1 }}>
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
                    >
                      <ImageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleCommentSubmit}
                      disabled={(!commentText.trim() && !commentImage) || isSubmittingComment || Date.now() < waitUntil}
                    >
                      {isSubmittingComment ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SendIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                ),
                sx: { 
                  bgcolor: 'rgba(32, 32, 36, 0.6)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(140, 82, 255, 0.3)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(140, 82, 255, 0.5)'
                  }
                }
              }}
            />
            
            {imagePreview && (
              <Box sx={{ mt: 1, position: 'relative' }}>
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
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)'
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        ) : (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
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
              Войдите
            </MuiLink>
            , чтобы оставить комментарий
          </Typography>
        )}
      </Box>

      
      <Box sx={{ px: { xs: 2, sm: 0 }, mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: { xs: 1.5, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600,
            color: 'text.primary',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          Комментарии ({post?.total_comments_count || comments.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: { xs: 2, sm: 4 } }}>
            <CircularProgress />
          </Box>
        ) : comments.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 1.5, sm: 3 } 
          }}>
            {comments.map(comment => (
              <Comment 
                key={comment.id} 
                comment={comment} 
                onLike={handleLikeComment}
                onLikeReply={(replyId) => handleLikeReply(comment.id, replyId)}
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
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ 
            p: { xs: 2, sm: 4 }, 
            textAlign: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'text.secondary', mb: { xs: 1, sm: 2 }, opacity: 0.6 }} />
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Комментариев пока нет. Будьте первым!
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
                src={notification.sender_user?.photo && notification.sender_user?.photo !== 'avatar.png'
                  ? `/static/uploads/avatar/${notification.sender_user?.id}/${notification.sender_user?.photo}`
                  : `/static/uploads/avatar/system/avatar.png`}
                alt={notification.sender_user?.name || "User"}
                sx={{ width: 40, height: 40 }}
                onError={(e) => {
                  console.error("Notification avatar failed to load");
                  if (e.currentTarget && e.currentTarget.setAttribute) {
                    e.currentTarget.setAttribute('src', '/static/uploads/avatar/system/avatar.png');
                  }
                }}
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

      {lightboxOpen && (
        <LightBox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          imageSrc={post.images && post.images.length > 0 
            ? post.images[currentImageIndex] 
            : post.image}
          title={`Пост от ${post.user?.name || 'Пользователя'}`}
          caption={post.content?.substring(0, 100) || ''}
          liked={post.is_liked}
          likesCount={post.likes_count}
          onLike={() => {}}
          onComment={() => {}}
          onShare={() => {}}
          onNext={() => setCurrentImageIndex((prev) => (prev + 1) % (post.images?.length || 1))}
          onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + (post.images?.length || 1)) % (post.images?.length || 1))}
          totalImages={post.images?.length || 1}
          currentIndex={currentImageIndex}
        />
      )}

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
                  Комментарий удален
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Комментарий был успешно удален
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
                <DeleteIcon sx={{ mr: 1 }} /> Удаление комментария
              </Typography>
              <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить.
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
                  Отмена
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
                  {commentDeleteDialog.deleting ? 'Удаление...' : 'Удалить'}
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
                  Ответ удален
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Ответ был успешно удален
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
                <DeleteIcon sx={{ mr: 1 }} /> Удаление ответа
              </Typography>
              <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                Вы уверены, что хотите удалить этот ответ? Это действие нельзя отменить.
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
                  Отмена
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
                  endIcon={replyDeleteDialog.deleting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {replyDeleteDialog.deleting ? 'Удаление...' : 'Удалить'}
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
            width: { sm: '100%', md: '90%', lg: '80%' },
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
              Пост
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