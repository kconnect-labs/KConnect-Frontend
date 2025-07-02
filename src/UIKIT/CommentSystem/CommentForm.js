import React from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  CircularProgress, 
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { useLanguage } from '../../context/LanguageContext';

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

const CommentForm = ({
  commentText,
  setCommentText,
  commentImage,
  imagePreview,
  handleImageChange,
  handleRemoveImage,
  handleCommentSubmit,
  fileInputRef,
  isSubmitting,
  disabled,
  error
}) => {
  const { t } = useLanguage();
  return (
    <Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => {}}
        >
          {error}
        </Alert>
      )}
      
      <StyledTextField
        inputRef={fileInputRef}
        fullWidth
        size="small"
        placeholder={t('comment.form.placeholder')}
        value={commentText || ''}
        onChange={(e) => typeof setCommentText === 'function' ? setCommentText(e.target.value) : null}
        disabled={isSubmitting || disabled}
        multiline
        maxRows={4}
        InputProps={{
          endAdornment: (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                disabled={isSubmitting || disabled}
                id="comment-image-upload"
              />
              <IconButton 
                size="small"
                component="label"
                htmlFor="comment-image-upload"
                disabled={isSubmitting || disabled}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <ImageIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                onClick={handleCommentSubmit}
                disabled={(!(commentText && commentText.trim()) && !commentImage) || isSubmitting || disabled}
              >
                {isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          )
        }}
      />
      
      {imagePreview && (
        <ImagePreview>
          <img 
            src={imagePreview} 
            alt="Preview" 
          />
          <IconButton
            size="small"
            onClick={handleRemoveImage}
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

export default CommentForm; 