import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  CardActions, 
  Divider,
  Avatar,
  Skeleton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { formatDate } from '../../utils/dateUtils';


const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(2),
  width: 50,
  height: 50,
  border: `2px solid ${theme.palette.primary.main}`,
}));

const PostContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const PostMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', 
}));

const PostActions = styled(CardActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  padding: theme.spacing(1),
}));

const ActionButton = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
}));

const MarkdownContent = styled('div')(({ theme }) => ({
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& p, & h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  '& code': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
  },
  '& pre': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
  },
}));


const PostSkeleton = () => (
  <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <Skeleton variant="circular" width={50} height={50} />
      <Box sx={{ ml: 2 }}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={80} height={20} />
      </Box>
    </Box>
    <Skeleton variant="rectangular" height={200} />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" height={100} />
    </Box>
    <Divider />
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-around' }}>
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
  </Card>
);


const PostsList = ({ posts, loading, userAvatar, userName, userId, isCurrentUser, onPostsUpdate }) => {
  const [localPosts, setLocalPosts] = useState(posts || []);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  
  React.useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  
  const handleLikeClick = async (postId, isLiked) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      if (response.data) {
        
        const updatedPosts = localPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1,
              user_liked: !isLiked
            };
          }
          return post;
        });
        setLocalPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  
  const handleShareClick = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        alert('Ссылка на пост скопирована в буфер обмена!');
      })
      .catch(err => {
        console.error('Не удалось скопировать:', err);
      });
  };

  
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      await axios.delete(`/api/posts/${postToDelete.id}`);
      
      
      const updatedPosts = localPosts.filter(post => post.id !== postToDelete.id);
      setLocalPosts(updatedPosts);
      
      
      if (onPostsUpdate) {
        onPostsUpdate();
      }
      
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((item) => (
          <PostSkeleton key={item} />
        ))}
      </Box>
    );
  }

  if (!localPosts || localPosts.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center', 
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Typography variant="h6" color="text.secondary">
          Пока нет публикаций
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {localPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <PostCard>
            <PostHeader>
              <UserAvatar src={userAvatar} alt={userName} />
              <Box>
                <Typography variant="h6">{userName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(post.timestamp)}
                </Typography>
              </Box>
            </PostHeader>
            
            <PostContent>
              <MarkdownContent>
                <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.5, mb: 1, overflow: 'hidden' }}>
                  <ReactMarkdown transformLinkUri={null}>{post.content}</ReactMarkdown>
                </Typography>
              </MarkdownContent>
            </PostContent>
            
            {post.image && (
              <CardMedia
                component="img"
                image={`/static/uploads/post/${post.id}/${post.image}`}
                title="Изображение поста"
                sx={{ 
                  maxHeight: 500,
                  objectFit: 'contain',
                  backgroundColor: 'black'
                }}
              />
            )}
            
            {post.video && (
              <Box sx={{ p: 0 }}>
                <video 
                  controls 
                  width="100%" 
                  preload="metadata"
                  style={{ 
                    maxHeight: 500,
                    backgroundColor: 'black' 
                  }}
                >
                  <source src={`/static/uploads/post/${post.id}/${post.video}`} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </Box>
            )}
            
            <Divider />
            
            <PostActions>
              <Tooltip title={post.user_liked ? "Убрать лайк" : "Поставить лайк"}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ActionButton 
                    aria-label="like"
                    onClick={() => handleLikeClick(post.id, post.user_liked)}
                    color={post.user_liked ? "primary" : "default"}
                  >
                    {post.user_liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
                  </ActionButton>
                  <Typography variant="body2">{post.likes_count}</Typography>
                </Box>
              </Tooltip>
              
              <Tooltip title="Комментарии">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ActionButton 
                    aria-label="comment"
                    href={`/post/${post.id}`}
                  >
                    <ChatBubbleOutlineIcon />
                  </ActionButton>
                  <Typography variant="body2">{post.comments_count}</Typography>
                </Box>
              </Tooltip>
              
              <Tooltip title="Скопировать ссылку">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ActionButton 
                    aria-label="share"
                    onClick={() => handleShareClick(post.id)}
                  >
                    <ContentCopyIcon />
                  </ActionButton>
                </Box>
              </Tooltip>
              
              {isCurrentUser && (
                <Tooltip title="Удалить пост">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ActionButton 
                      aria-label="delete"
                      onClick={() => handleDeleteClick(post)}
                      color="error"
                    >
                      <DeleteIcon />
                    </ActionButton>
                  </Box>
                </Tooltip>
              )}
            </PostActions>
          </PostCard>
        </motion.div>
      ))}
      
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Удаление поста</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить этот пост? Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsList; 