import React, { useState, useEffect, useContext, useRef } from 'react';
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
  Badge
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import PostService from '../services/PostService';
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
import ImageGrid from '../components/Post/ImageGrid';
import LightBox from '../components/LightBox';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Post } from '../components/Post';
import { formatTimeAgo, getRussianWordForm, debugDate, parseDate } from '../utils/dateUtils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SEO from '../components/SEO';

// Styled components
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

// Comment component
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
  onDeleteReply
}) => {
  const { user } = useContext(AuthContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  // Добавляем отладочные логи
  console.log('Comment data:', comment);
  console.log('Current user:', user);
  console.log('Comment user_id:', comment.user_id);
  console.log('Current user id:', user?.id);
  console.log('Is comment owner:', user && (comment.user_id === user.id || user.is_admin));

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Проверяем, является ли текущий пользователь владельцем комментария
  const isCommentOwner = user && (comment.user_id === user.id || user.is_admin);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        bgcolor: '#1A1A1A',
        borderRadius: 2,
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src={comment.user.photo && comment.user.photo !== 'avatar.png'
              ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
              : `/static/uploads/avatar/system/avatar.png`}
            alt={comment.user.name}
            component={Link}
            to={`/profile/${comment.user.username}`}
            sx={{ width: 40, height: 40 }}
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
                    alignItems: 'center'
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
                        width: 20,
                        height: 20
                      }}
                    />
                  )}
                  {comment.user.achievement && (
                    <Box 
                      component="img" 
                      sx={{ 
                        width: 20, 
                        height: 20, 
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
                  sx={{ ml: 1 }}
                >
                  {/* Debug logging done properly outside the JSX */}
                  {formatTimeAgo(comment.timestamp)}
                </Typography>
              </Box>
              {isCommentOwner && (
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0.5,
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
                    bgcolor: '#1E1E1E',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
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
                    sx={{ color: '#f44336' }}
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
              overflowWrap: 'break-word'
            }}>
              {comment.content}
            </Typography>
            
            {comment.image && (
              <Box sx={{ mt: 1 }}>
                <img 
                  src={comment.image.startsWith('/static') ? comment.image : `/static/uploads/comment/${comment.id}/${comment.image}`}
                  alt="Comment" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: 8,
                    objectFit: 'contain'
                  }} 
                />
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
              <Box 
                onClick={() => onLike(comment.id)}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  backgroundColor: comment.user_liked ? 'rgba(140, 82, 255, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: comment.user_liked ? 'rgba(140, 82, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)'
                  }
                }}
              >
                {comment.user_liked ? (
                  <FavoriteIcon sx={{ color: '#8c52ff', fontSize: 18 }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: '#757575', fontSize: 18 }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 0.5,
                    color: comment.user_liked ? '#8c52ff' : 'text.secondary',
                    fontWeight: comment.user_liked ? 'bold' : 'normal'
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
                  padding: '4px 8px',
                  borderRadius: '12px',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: 'text.primary'
                  }
                }}
              >
                <ReplyIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                  Ответить
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Replies section */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {[...comment.replies]
            // Ensure we use the correct timestamp field and handle both formats
            .sort((a, b) => {
              // Try to use created_at first, timestamp as fallback
              const dateA = a.created_at ? new Date(a.created_at) : a.timestamp ? new Date(a.timestamp) : new Date(0);
              const dateB = b.created_at ? new Date(b.created_at) : b.timestamp ? new Date(b.timestamp) : new Date(0);
              // Sort in ascending order (oldest first)
              return dateA.getTime() - dateB.getTime();
            })
            .map(reply => {
              const isReplyOwner = user && (reply.user_id === user.id || user.is_admin);
              return (
                <Box 
                  key={reply.id}
                  sx={{ 
                    bgcolor: '#1A1A1A',
                    borderRadius: 2,
                    p: 1.5,
                    mb: 1
                  }}
                >
                  {/* Show parent reply if exists */}
                  {reply.parent_reply_id ? (
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 1,
                        p: 1,
                        mb: 1,
                        borderLeft: '2px solid #8c52ff'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.photo && comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.photo !== 'avatar.png'
                            ? `/static/uploads/avatar/${comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.id}/${comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.photo}`
                            : `/static/uploads/avatar/system/avatar.png`}
                          alt={comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.name}
                          sx={{ width: 20, height: 20 }}
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
                            color: 'text.primary'
                          }}
                        >
                          {comment.replies.find(r => r.id === reply.parent_reply_id)?.user?.name}
                        </Typography>
                        <ReplyIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                      </Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mt: 0.5,
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
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
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 1,
                        p: 1,
                        mb: 1,
                        borderLeft: '2px solid #8c52ff'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={comment.user.photo && comment.user.photo !== 'avatar.png'
                            ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
                            : `/static/uploads/avatar/system/avatar.png`}
                          alt={comment.user.name}
                          sx={{ width: 20, height: 20 }}
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
                            color: 'text.primary'
                          }}
                        >
                          {comment.user.name}
                        </Typography>
                        <ReplyIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                      </Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mt: 0.5,
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
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
                      sx={{ width: 32, height: 32 }}
                      onError={(e) => {
                        console.error("Reply avatar failed to load");
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
                            to={`/profile/${reply.user.username}`}
                            sx={{ 
                              fontWeight: 'bold',
                              textDecoration: 'none',
                              color: 'text.primary',
                              '&:hover': { color: 'primary.main' }
                            }}
                          >
                            {reply.user.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ ml: 1 }}
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
                                p: 0.5,
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
                                  bgcolor: '#1E1E1E',
                                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
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
                                sx={{ color: '#f44336' }}
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
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          fontSize: '0.9rem'
                        }}
                      >
                        {reply.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                        <Box 
                          onClick={() => onLikeReply(reply.id)}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            backgroundColor: reply.user_liked ? 'rgba(140, 82, 255, 0.08)' : 'transparent',
                            '&:hover': {
                              backgroundColor: reply.user_liked ? 'rgba(140, 82, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)'
                            }
                          }}
                        >
                          {reply.user_liked ? (
                            <FavoriteIcon sx={{ color: '#8c52ff', fontSize: 16 }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ color: '#757575', fontSize: 16 }} />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              ml: 0.5,
                              color: reply.user_liked ? '#8c52ff' : 'text.secondary',
                              fontWeight: reply.user_liked ? 'bold' : 'normal',
                              fontSize: '0.75rem'
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
                            padding: '2px 6px',
                            borderRadius: '12px',
                            color: 'text.secondary',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              color: 'text.primary'
                            }
                          }}
                        >
                          <ReplyIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
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

      {/* Reply form */}
      {isReplyFormOpen && activeCommentId === comment.id && (
        <Box sx={{ mt: 1 }}>
          {/* Quote block */}
          <Box 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              p: 1,
              mb: 1,
              borderLeft: '2px solid #8c52ff'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                src={replyingToReply 
                  ? (replyingToReply.user.photo && replyingToReply.user.photo !== 'avatar.png'
                    ? `/static/uploads/avatar/${replyingToReply.user.id}/${replyingToReply.user.photo}`
                    : `/static/uploads/avatar/system/avatar.png`)
                  : (comment.user.photo && comment.user.photo !== 'avatar.png'
                    ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
                    : `/static/uploads/avatar/system/avatar.png`)}
                alt={replyingToReply ? replyingToReply.user.name : comment.user.name}
                sx={{ width: 20, height: 20 }}
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
                  color: 'text.primary'
                }}
              >
                {replyingToReply ? replyingToReply.user.name : comment.user.name}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mt: 0.5,
              fontSize: '0.75rem',
              lineHeight: 1.2,
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
            InputProps={{
              endAdornment: (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onReplySubmit(comment.id, replyingToReply?.id)}
                  disabled={!replyText.trim()}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              ),
              sx: { 
                bgcolor: '#1A1A1A',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

// PostDetailPage component
const PostDetailPage = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentImage, setCommentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
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
  const [lightboxOpen, setLightboxOpen] = useState(false);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(`Fetching post with ID: ${postId}`);
        const response = await axios.get(`/api/posts/${postId}`);
        console.log('Post data received:', response.data);
        
        // Log timestamp formats for debugging
        if (response.data.post) {
          console.log('Post timestamp format:', response.data.post.timestamp);
        }
        
        if (response.data.comments && response.data.comments.length > 0) {
          console.log('First comment timestamp format:', response.data.comments[0].timestamp);
          
          if (response.data.comments[0].replies && response.data.comments[0].replies.length > 0) {
            console.log('First reply timestamp format:', response.data.comments[0].replies[0].timestamp);
          }
        }
        
        // Log comment likes information for debugging
        if (response.data.comments && response.data.comments.length > 0) {
          console.log('First comment likes info:', {
            likes_count: response.data.comments[0].likes_count,
            user_liked: response.data.comments[0].user_liked
          });
          
          if (response.data.comments[0].replies && response.data.comments[0].replies.length > 0) {
            console.log('First reply likes info:', {
              likes_count: response.data.comments[0].replies[0].likes_count,
              user_liked: response.data.comments[0].replies[0].user_liked
            });
          }
        }
        
        setPost(response.data.post);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error(`Error fetching post with ID ${postId}:`, error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

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
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCommentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Check if result is a string before setting it
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

  const handleCommentSubmit = async () => {
    if (!commentText.trim() && !commentImage) return;

    try {
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
    } catch (error) {
      console.error('Error adding comment:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при добавлении комментария',
        severity: 'error'
      });
    }
  };

  const handleReplySubmit = async (commentId, parentReplyId = null) => {
    if (!replyText.trim()) return;

    try {
      const response = await axios.post(`/api/comments/${commentId}/replies`, {
        content: replyText.trim(),
        parent_reply_id: parentReplyId
      });

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
      
      setSnackbar({
        open: true,
        message: 'Ответ добавлен',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при добавлении ответа',
        severity: 'error'
      });
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      // Immediately update UI optimistically
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { 
              ...comment, 
              user_liked: !comment.user_liked, 
              likes_count: comment.user_liked ? Math.max(0, comment.likes_count - 1) : comment.likes_count + 1 
            }
          : comment
      ));
      
      // Then make API call
      const response = await axios.post(`/api/comments/${commentId}/like`);
      
      // Update with actual value from server
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, user_liked: response.data.liked, likes_count: response.data.likes_count }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
      // Revert on error
      setComments(prev => [...prev]);
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    try {
      // Immediately update UI optimistically
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
      
      // Then make API call
      const response = await axios.post(`/api/replies/${replyId}/like`);
      
      // Update with actual value from server
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
      // Revert on error
      setComments(prev => [...prev]);
    }
  };

  const handlePostMenuOpen = () => {
    setPostMenuAnchorEl(true);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.post(`/api/comments/${commentId}/delete`);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setSnackbar({
        open: true,
        message: 'Комментарий удален',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении комментария',
        severity: 'error'
      });
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      console.log(`Deleting reply with ID ${replyId} from comment ${commentId}`);
      // API endpoint should be /api/replies/delete not /api/replies/replyId/delete
      await axios.post(`/api/replies/${replyId}/delete`);

      // Update state to remove only this specific reply from the comment
      setComments(prev => {
        const updatedComments = [...prev];
        
        // Find the comment containing this reply
        const commentIndex = updatedComments.findIndex(c => c.id === commentId);
        
        if (commentIndex !== -1) {
          // Make a deep copy of the comment to avoid direct state mutation
          const updatedComment = {
            ...updatedComments[commentIndex],
            replies: updatedComments[commentIndex].replies.filter(reply => reply.id !== replyId)
          };
          
          // Replace the old comment with the updated one
          updatedComments[commentIndex] = updatedComment;
        }
        
        return updatedComments;
      });

      setSnackbar({
        open: true,
        message: 'Ответ удален',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting reply:', error);
      console.error('Error details:', error.response?.data);
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


  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Пост не найден</Typography>
          <Button variant="contained" component={Link} to="/" startIcon={<ArrowBackIcon />}>
            Вернуться на главную
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: 4, 
        mb: 8,
        px: { xs: 0, sm: 2 }, // Zero padding on mobile
        width: '100%'
      }}
    >
      {/* SEO компонент для предпросмотра */}
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
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: { xs: 2, sm: 0 } }}>
        <IconButton 
          component={Link} 
          to="/"
          sx={{ mr: 2 }}
          aria-label="Назад"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Пост</Typography>
      </Box>

      {post && (
        <Post 
          post={post}
          onDelete={() => navigate('/')}
          onOpenLightbox={(imageUrl) => {
            setLightboxOpen(true);
            // Найти индекс изображения в массиве
            if (Array.isArray(post.images)) {
              const index = post.images.indexOf(imageUrl);
              if (index !== -1) {
                setCurrentImageIndex(index);
              }
            }
          }}
        />
      )}

      {/* Comment form */}
      <Box sx={{ px: { xs: 2, sm: 0 }, mb: 2, mt: 3 }}>
        {user ? (
          <Box>
            <TextField
              ref={commentInputRef}
              fullWidth
              size="small"
              placeholder="Написать комментарий..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <IconButton 
                      size="small"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <ImageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim() && !commentImage}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ),
                sx: { 
                  bgcolor: '#1A1A1A',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
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
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
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

      {/* Comments section */}
      <Box sx={{ px: { xs: 2, sm: 0 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 22 }} />
          Комментарии ({post.total_comments_count || comments.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        ) : comments.length > 0 ? (
          comments.map(comment => (
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
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Комментариев пока нет. Будьте первым!
          </Typography>
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
    </Container>
  );
};

export default PostDetailPage;