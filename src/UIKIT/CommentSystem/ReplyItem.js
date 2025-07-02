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
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { formatTimeAgo } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';

const StyledReplyCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(32, 32, 36, 0.4)',
  backdropFilter: 'blur(5px)',
  borderRadius: '14px',
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1), 
  border: '1px solid rgba(255, 255, 255, 0.03)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'rgba(35, 35, 40, 0.5)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25),
  }
}));

const QuotedMessage = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '8px',
  padding: theme.spacing(1, 1.5),
  marginBottom: theme.spacing(1),
  borderLeft: '3px solid rgba(140, 82, 255, 0.5)'
}));

const ActionButton = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '3px 8px',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  backgroundColor: active ? 'rgba(140, 82, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
  '&:hover': {
    backgroundColor: active ? 'rgba(140, 82, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-1px)'
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '10px',
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

const ReplyItem = ({ 
  reply, 
  comment,
  parentReply, 
  onLike, 
  onReply, 
  onDelete,
  setLightboxOpen,
  setCurrentLightboxImage,
  isReplyOwner,
  onViewImage,
  sanitizeImagePath = (imagePath) => imagePath
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageFallback, setImageFallback] = useState(null);
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
      onViewImage(sanitizeImagePath(reply.image));
    } else {
      setLightboxOpen(true);
      setCurrentLightboxImage(sanitizeImagePath(reply.image));
    }
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

  const handleImageError = () => {
    console.error("Reply image failed to load:", reply.image);
    
    if (reply.image && reply.image.includes('/static/uploads/') && 
        (reply.image.indexOf('/static/uploads/') !== reply.image.lastIndexOf('/static/uploads/'))) {
      const fixedUrl = reply.image.substring(reply.image.lastIndexOf('/static/uploads/'));
      console.log("Fixing duplicated reply image path:", reply.image, "->", fixedUrl);
      
      setImageFallback(fixedUrl);
      return;
    }
    
    const fallbackUrl = getReplyImageFallback(imageFallback || reply.image);
    
    if (fallbackUrl) {
      console.log(`Trying fallback URL for reply ${reply.id}:`, fallbackUrl);
      setImageFallback(fallbackUrl);
      return;
    }
    
    setImageError(true);
  };

  
  const quotedUser = parentReply ? parentReply.user : comment.user;
  const quotedContent = parentReply ? parentReply.content : comment.content;

  return (
    <StyledReplyCard>
      {/* Quoted message */}
      <QuotedMessage>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            src={quotedUser.photo && quotedUser.photo !== 'avatar.png'
              ? `/static/uploads/avatar/${quotedUser.id}/${quotedUser.photo}`
              : `/static/uploads/avatar/system/avatar.png`}
            alt={quotedUser.name}
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
            {quotedUser.name}
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
          {quotedContent}
        </Typography>
      </QuotedMessage>

      {/* Reply content */}
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
              <Tooltip title={new Date(reply.timestamp).toLocaleString()} placement="top">
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ ml: 0.5, fontSize: '0.65rem' }}
                >
                  {formatTimeAgo(reply.timestamp)}
                </Typography>
              </Tooltip>
            </Box>
            
            {isReplyOwner && (
              <>
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
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      onReply(reply);
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
                      onDelete();
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
          
          {reply.image && !imageError && (
            <Box sx={{ mt: 1, mb: 1.5 }}>
              <ImageContainer onClick={handleOpenImage}>
                <img 
                  src={sanitizeImagePath(imageFallback || reply.image)}
                  alt="Reply" 
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
          
          {reply.image && imageError && (
            <Box
              sx={{
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                color: '#f44336',
                fontSize: '0.85rem',
                textAlign: 'center',
                width: '100%',
                mt: 1, 
                mb: 1.5
              }}
            >
              <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {t('comment.media.error')}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', opacity: 0.8, wordBreak: 'break-all' }}>
                {reply.image && reply.image.includes('/static/uploads/') && 
                 reply.image.indexOf('/static/uploads/') !== reply.image.lastIndexOf('/static/uploads/') 
                  ? t('comment.media.duplicate_path') 
                  : reply.image || t('comment.media.url_unavailable')}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
            <ActionButton 
              active={reply.user_liked} 
              onClick={() => onLike()}
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
            </ActionButton>

            <ActionButton onClick={() => onReply(reply)}>
              <CommentOutlinedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem', color: 'text.secondary' }}>
                {t('comment.menu.reply')}
              </Typography>
            </ActionButton>
          </Box>
        </Box>
      </Box>
    </StyledReplyCard>
  );
};

export default ReplyItem; 