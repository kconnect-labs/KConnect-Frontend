import React, { useState, useContext } from 'react';
import { Box, IconButton, Typography, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { requireAuth } from '../../utils/authUtils';

const PostActions = ({ 
  post, 
  liked, 
  likes, 
  comments,
  onLike, 
  onComment, 
  onShare,
  reposted,
  onRepost,
  showNumbers = true,
  color="primary",
  size="medium",
  sx
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShareLink(`${window.location.origin}/post/${post.id}`);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    handleShareClose();
    if (onShare) onShare('копирование');
  };

  const handleLikeClick = async () => {
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      await axios.post(`/api/posts/${post.id}/like`);
      if (onLike) onLike();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentClick = () => {
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    if (onComment) onComment();
    else navigate(`/post/${post.id}`);
  };

  const handleRepostClick = async () => {
    if (!requireAuth(user, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      await axios.post(`/api/posts/${post.id}/repost`);
      if (onRepost) onRepost();
    } catch (error) {
      console.error('Error reposting:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={liked ? "Убрать лайк" : "Лайк"}>
          <IconButton 
            color={liked ? color : "default"} 
            onClick={handleLikeClick}
            size={size}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
        {showNumbers && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mr: 2 }}
          >
            {likes}
          </Typography>
        )}
        
        <Tooltip title="Комментировать">
          <IconButton 
            color="default"
            onClick={handleCommentClick}
            size={size}
          >
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Tooltip>
        {showNumbers && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mr: 2 }}
          >
            {comments}
          </Typography>
        )}
        
        <Tooltip title={reposted ? "Отменить репост" : "Репост"}>
          <IconButton 
            color={reposted ? color : "default"}
            onClick={handleRepostClick}
            size={size}
          >
            <RepeatIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Tooltip title="Поделиться">
        <IconButton 
          color="default" 
          onClick={handleShareClick}
          size={size}
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleShareClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Копировать ссылку</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PostActions; 