import React from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Avatar,
  Typography,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';

const QuotedMessage = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '8px',
  padding: theme.spacing(1, 1.5),
  marginBottom: theme.spacing(1),
  borderLeft: '3px solid rgba(140, 82, 255, 0.5)'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(32, 32, 36, 0.6)',
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
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  position: 'relative',
  '& img': {
    width: '100%',
    maxHeight: '150px',
    objectFit: 'cover',
    borderRadius: '12px'
  }
}));

const ReplyForm = ({
  replyText,
  onReplyTextChange,
  onReplySubmit,
  onCancel,
  targetUser,
  targetContent,
  isSubmitting,
  disabled,
  replyFileInputRef,
  replyImagePreview,
  handleRemoveReplyImage,
  handleReplyImageChange,
  commentId,
  replyId,
}) => {
  return (
    <Box sx={{ 
      mt: 1, 
      pl: { xs: 0.5, sm: 2 },
      pr: { xs: 0.5, sm: 0 },
      position: 'relative',
      mb: 2
    }}>
      {/* Display the message being replied to */}
      <QuotedMessage>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Avatar 
            src={targetUser?.photo && targetUser.photo !== 'avatar.png'
              ? `/static/uploads/avatar/${targetUser.id}/${targetUser.photo}`
              : `/static/uploads/avatar/system/avatar.png`}
            alt={targetUser?.name}
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
            {targetUser?.name}
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
          {targetContent}
        </Typography>
      </QuotedMessage>

      {/* Reply input field */}
      <StyledTextField
        fullWidth
        size="small"
        placeholder="Написать ответ..."
        value={replyText || ''}
        onChange={(e) => typeof onReplyTextChange === 'function' ? onReplyTextChange(e.target.value) : null}
        disabled={isSubmitting || disabled}
        multiline
        maxRows={3}
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
                disabled={isSubmitting || disabled}
              />
              <IconButton
                size="small"
                component="label"
                htmlFor="reply-image-upload"
                sx={{ color: 'text.secondary' }}
                disabled={isSubmitting || disabled}
              >
                <ImageIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                onClick={() => typeof onReplySubmit === 'function' ? onReplySubmit(commentId, replyId) : null}
                disabled={(!(replyText && replyText.trim()) && !replyImagePreview) || isSubmitting || disabled}
              >
                {isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                size="small"
                onClick={typeof onCancel === 'function' ? onCancel : null}
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )
        }}
      />
      
      {/* Image preview */}
      {replyImagePreview && (
        <ImagePreview>
          <img 
            src={replyImagePreview} 
            alt="Preview" 
          />
          <IconButton
            size="small"
            onClick={handleRemoveReplyImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </ImagePreview>
      )}
    </Box>
  );
};

export default ReplyForm; 