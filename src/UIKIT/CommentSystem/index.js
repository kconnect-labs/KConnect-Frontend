import React, { useState } from 'react';
import { 
  Box, 
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SimpleImageViewer from '../../components/SimpleImageViewer';
import { useLanguage } from '../../context/LanguageContext';

import CommentItem from './CommentItem';
import ReplyItem from './ReplyItem';
import CommentForm from './CommentForm';
import ReplyForm from './ReplyForm';

const CommentSectionHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: '1.25rem',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
    fontSize: '1rem'
  }
}));

const EmptyCommentsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '16px',
  border: '1px dashed rgba(255, 255, 255, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

const CommentsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5)
  }
}));

const RepliesContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  marginLeft: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  borderLeft: '2px solid rgba(140, 82, 255, 0.2)',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5)
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(32, 32, 36, 0.8)',
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
}));

const CommentSystem = ({ 
  comments = [], 
  user, 
  postId,
  onLikeComment = () => {},
  onLikeReply = () => {},
  onAddComment = () => {},
  onAddReply = () => {},
  onDeleteComment = () => {},
  onDeleteReply = () => {},
  commentText = '',
  setCommentText = () => {},
  commentImage = null,
  setCommentImage = () => {},
  imagePreview = '',
  setImagePreview = () => {},
  fileInputRef = React.createRef(),
  isSubmittingComment = false,
  commentError = '',
  setCommentError = () => {},
  waitUntil = 0,
  onViewImage,
  useParentDialogs = false,
  sanitizeImagePath = (imagePath) => imagePath
}) => {
  const { t } = useLanguage();
  const [replyText, setReplyText] = useState('');
  const [replyFormOpen, setReplyFormOpen] = useState(false);
  const [activeComment, setActiveComment] = useState(null);
  const [replyingToReply, setReplyingToReply] = useState(null);
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState('');
  const [replyFileInputRef, setReplyFileInputRef] = useState(React.createRef());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentLightboxImage, setCurrentLightboxImage] = useState('');
  
  
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (typeof setCommentImage === 'function') setCommentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && typeof setImagePreview === 'function') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (typeof setCommentImage === 'function') setCommentImage(null);
    if (typeof setImagePreview === 'function') setImagePreview('');
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCommentSubmit = () => {
    if (typeof onAddComment === 'function') onAddComment();
  };

  const handleReplySubmit = (commentId, replyId = null) => {
    if (typeof onAddReply === 'function') onAddReply(commentId, replyId);
    setReplyText('');
    setReplyFormOpen(false);
    setActiveComment(null);
    setReplyingToReply(null);
    setReplyImage(null);
    setReplyImagePreview('');
  };

  const handleDeleteComment = (commentId) => {
    if (useParentDialogs) {
      if (typeof onDeleteComment === 'function') onDeleteComment(commentId);
    } else {
      setCommentDeleteDialog({
        open: true,
        deleting: false,
        deleted: false,
        commentId
      });
    }
  };

  const confirmDeleteComment = () => {
    if (typeof onDeleteComment === 'function') onDeleteComment(commentDeleteDialog.commentId);
    setCommentDeleteDialog(prev => ({ ...prev, deleting: true }));
  };

  const handleDeleteReply = (commentId, replyId) => {
    if (useParentDialogs) {
      if (typeof onDeleteReply === 'function') onDeleteReply(commentId, replyId);
    } else {
      setReplyDeleteDialog({
        open: true,
        deleting: false,
        deleted: false,
        commentId,
        replyId
      });
    }
  };

  const confirmDeleteReply = () => {
    if (typeof onDeleteReply === 'function') onDeleteReply(replyDeleteDialog.commentId, replyDeleteDialog.replyId);
    setReplyDeleteDialog(prev => ({ ...prev, deleting: true }));
  };

  return (
    <Box>
      {/* Image lightbox is handled by parent when useParentDialogs is true */}

      {/* Comment form */}
      <Box sx={{ mb: 3 }}>
        <CommentForm 
          commentText={commentText}
          setCommentText={setCommentText}
          commentImage={commentImage}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          handleCommentSubmit={handleCommentSubmit}
          fileInputRef={fileInputRef}
          isSubmitting={isSubmittingComment}
          disabled={Date.now() < waitUntil}
          error={commentError}
        />
      </Box>
      
      <Divider sx={{ mb: 3, opacity: 0.1 }} />
      
      {/* Comments section header */}
      <CommentSectionHeader>
        <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        {t('comment.section.title')}
        <Box 
          component="span" 
          sx={{ 
            display: 'inline-flex',
            backgroundColor: 'rgba(140, 82, 255, 0.15)',
            color: 'primary.main',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            ml: 1
          }}
        >
          {comments.length}
        </Box>
      </CommentSectionHeader>
      
      {/* Comments list */}
      {comments.length > 0 ? (
        <CommentsContainer>
          {comments.map(comment => {
            const isCommentOwner = user && (comment.user_id === user.id || user.is_admin);
            
            return (
              <Box key={comment.id}>
                {/* Main comment */}
                <CommentItem
                  comment={comment}
                  onLike={onLikeComment}
                  onReply={() => {
                    setReplyingToReply(null);
                    setReplyFormOpen(true);
                    setActiveComment(comment);
                    setReplyText('');
                  }}
                  onDeleteComment={() => handleDeleteComment(comment.id)}
                  setLightboxOpen={setLightboxOpen}
                  setCurrentLightboxImage={setCurrentLightboxImage}
                  isCommentOwner={isCommentOwner}
                  onViewImage={onViewImage}
                  sanitizeImagePath={sanitizeImagePath}
                />
                
                {/* Replies to this comment */}
                {comment.replies && comment.replies.length > 0 && (
                  <RepliesContainer>
                    {[...comment.replies]
                      .sort((a, b) => {
                        try {
                          
                          const getDate = (obj) => {
                            if (obj.created_at) return new Date(obj.created_at);
                            if (obj.timestamp) return new Date(obj.timestamp);
                            if (obj.date) return new Date(obj.date);
                            if (obj.time) return new Date(obj.time);
                            if (obj.created) return new Date(obj.created);
                            
                            return new Date(0);
                          };
                          
                          const dateA = getDate(a);
                          const dateB = getDate(b);
                          return dateA.getTime() - dateB.getTime();
                        } catch (error) {
                          console.error('Error sorting replies:', error);
                          return 0; 
                        }
                      })
                      .map(reply => {
                        const isReplyOwner = user && (reply.user_id === user.id || user.is_admin);
                        const parentReply = reply.parent_reply_id 
                          ? comment.replies.find(r => r.id === reply.parent_reply_id) 
                          : null;
                        
                        return (
                          <ReplyItem
                            key={reply.id}
                            reply={reply}
                            comment={comment}
                            parentReply={parentReply}
                            onLike={() => onLikeReply(reply.id)}
                            onReply={(replyObj) => {
                              setReplyingToReply(replyObj);
                              setReplyFormOpen(true);
                              setActiveComment(comment);
                              setReplyText('');
                            }}
                            onDelete={() => handleDeleteReply(comment.id, reply.id)}
                            setLightboxOpen={setLightboxOpen}
                            setCurrentLightboxImage={setCurrentLightboxImage}
                            isReplyOwner={isReplyOwner}
                            onViewImage={onViewImage}
                            sanitizeImagePath={sanitizeImagePath}
                          />
                        );
                      })
                    }
                  </RepliesContainer>
                )}
                
                {/* Reply form for this comment */}
                {replyFormOpen && activeComment?.id === comment.id && (
                  <ReplyForm
                    replyText={replyText}
                    onReplyTextChange={setReplyText}
                    onReplySubmit={handleReplySubmit}
                    onCancel={() => {
                      setReplyFormOpen(false);
                      setActiveComment(null);
                      setReplyingToReply(null);
                      setReplyText('');
                      setReplyImage(null);
                      setReplyImagePreview('');
                    }}
                    targetUser={replyingToReply ? replyingToReply.user : comment.user}
                    targetContent={replyingToReply ? replyingToReply.content : comment.content}
                    isSubmitting={isSubmittingComment}
                    disabled={Date.now() < waitUntil}
                    replyFileInputRef={replyFileInputRef}
                    replyImagePreview={replyImagePreview}
                    handleRemoveReplyImage={handleRemoveReplyImage}
                    handleReplyImageChange={handleReplyImageChange}
                    commentId={comment.id}
                    replyId={replyingToReply?.id}
                  />
                )}
              </Box>
            );
          })}
        </CommentsContainer>
      ) : (
        <EmptyCommentsContainer>
          <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'text.secondary', mb: { xs: 1, sm: 2 }, opacity: 0.6 }} />
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {t('comment.section.empty')}
          </Typography>
        </EmptyCommentsContainer>
      )}
      
      {/* Comment delete confirmation dialog */}
      <StyledDialog
        open={commentDeleteDialog.open}
        onClose={() => !commentDeleteDialog.deleting && !commentDeleteDialog.deleted && 
                     setCommentDeleteDialog(prev => ({ ...prev, open: false }))}
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
                <DeleteIcon sx={{ mr: 1 }} /> {t('comment.dialog.delete.title')}
              </Typography>
              <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                {t('comment.dialog.delete.message')}
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
                  {t('comment.dialog.delete.cancel')}
                </Button>
                <Button 
                  onClick={confirmDeleteComment}
                  disabled={commentDeleteDialog.deleting}
                  variant="contained" 
                  color="error"
                  sx={{ 
                    borderRadius: '10px',
                    boxShadow: 'none',
                  }}
                >
                  {t('comment.dialog.delete.confirm')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </StyledDialog>
      
      {/* Reply delete confirmation dialog */}
      <StyledDialog
        open={replyDeleteDialog.open}
        onClose={() => !replyDeleteDialog.deleting && !replyDeleteDialog.deleted && 
                     setReplyDeleteDialog(prev => ({ ...prev, open: false }))}
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
      </StyledDialog>
      
    </Box>
  );
};

export default CommentSystem; 