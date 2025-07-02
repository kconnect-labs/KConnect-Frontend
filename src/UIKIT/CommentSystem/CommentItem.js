import React, { useState } from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { VerificationBadge } from '../../UIKIT';
import { formatTimeAgo } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';

const StyledCommentCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(28, 28, 32, 0.4)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.03)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'rgba(30, 30, 36, 0.5)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  }
}));

const ActionButton = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '4px 10px',
  borderRadius: '20px',
  transition: 'all 0.2s ease',
  backgroundColor: active ? 'rgba(140, 82, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
  '&:hover': {
    backgroundColor: active ? 'rgba(140, 82, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
    transform: 'translateY(-1px)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: '3px 8px',
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  display: 'inline-block',
  maxWidth: '280px',
  '&:hover': {
    '& .zoom-icon': {
      opacity: 1
    }
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '240px',
  }
}));

const CommentContent = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  marginBottom: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  fontSize: '0.9rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
  }
}));

const CommentItem = ({ 
  comment, 
  onLike, 
  onReply, 
  onDeleteComment, 
  setLightboxOpen, 
  setCurrentLightboxImage,
  isCommentOwner,
  onViewImage,
  sanitizeImagePath = (imagePath) => imagePath
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const menuOpen = Boolean(menuAnchorEl);
  const { t } = useLanguage();

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenImage = (event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (onViewImage) {
      onViewImage(sanitizeImagePath(comment.image));
    } else {
      setLightboxOpen(true);
      setCurrentLightboxImage(sanitizeImagePath(comment.image));
    }
  };

  const handleImageError = () => {
    console.error("Comment image failed to load:", comment.image);
    
    if (comment.image && comment.image.includes('/static/uploads/') && 
        (comment.image.indexOf('/static/uploads/') !== comment.image.lastIndexOf('/static/uploads/'))) {
      
      comment.image = comment.image.substring(comment.image.lastIndexOf('/static/uploads/'));
      setImageError(false);
      return;
    }
    
    setImageError(true);
  };
  
  return (
    <StyledCommentCard id={`comment-${comment.id}`}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Avatar 
          src={comment.user.photo && comment.user.photo !== 'avatar.png'
            ? `/static/uploads/avatar/${comment.user.id}/${comment.user.photo}`
            : `/static/uploads/avatar/system/avatar.png`}
          alt={comment.user.name}
          component={Link}
          to={`/profile/${comment.user.username}`}
          sx={{ 
            width: { xs: 36, sm: 40 }, 
            height: { xs: 36, sm: 40 },
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
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography 
                component={Link}
                to={`/profile/${comment.user.username}`}
                sx={{ 
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' },
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
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
              <Tooltip title={new Date(comment.timestamp).toLocaleString()} placement="top">
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ ml: 1, fontSize: '0.75rem' }}
                >
                  {formatTimeAgo(comment.timestamp)}
                </Typography>
              </Tooltip>
            </Box>
            
            {isCommentOwner && (
              <>
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
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      onReply();
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
                    <ListItemText primary={t('comment.menu.reply')} />
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      onDeleteComment();
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
                    <ListItemText primary={t('comment.menu.delete')} />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
          
          <CommentContent>
            {comment.content}
          </CommentContent>
          
          {comment.image && !imageError && (
            <Box sx={{ mt: 1, mb: 1.5 }}>
              <ImageContainer onClick={handleOpenImage}>
                <img 
                  src={sanitizeImagePath(comment.image)}
                  alt="Comment" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '10px',
                    objectFit: 'contain', 
                    display: 'block', 
                    margin: '0 auto' 
                  }} 
                  onError={handleImageError}
                />
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
              </ImageContainer>
            </Box>
          )}
          
          {comment.image && imageError && (
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
                {t('comment.media.error')}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {comment.image && comment.image.includes('/static/uploads/') && 
                 comment.image.indexOf('/static/uploads/') !== comment.image.lastIndexOf('/static/uploads/') 
                  ? t('comment.media.duplicate_path') 
                  : comment.image || t('comment.media.url_unavailable')}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 1, 
            gap: 1.5,
          }}>
            <ActionButton 
              active={comment.user_liked} 
              onClick={() => onLike(comment.id)}
            >
              {comment.user_liked ? (
                <FavoriteIcon sx={{ color: '#8c52ff', fontSize: { xs: 16, sm: 18 } }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: '#757575', fontSize: { xs: 16, sm: 18 } }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  ml: 0.5,
                  color: comment.user_liked ? '#8c52ff' : 'text.secondary',
                  fontWeight: comment.user_liked ? 'medium' : 'normal',
                  fontSize: '0.75rem'
                }}
              >
                {comment.likes_count}
              </Typography>
            </ActionButton>

            <ActionButton onClick={onReply}>
              <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
                {t('comment.menu.reply')}
              </Typography>
            </ActionButton>
          </Box>
        </Box>
      </Box>
    </StyledCommentCard>
  );
};

export default CommentItem; 