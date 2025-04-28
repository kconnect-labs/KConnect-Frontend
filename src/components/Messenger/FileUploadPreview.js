import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
  width: '120px',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const PreviewInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  padding: theme.spacing(0.5, 1),
  fontSize: '0.7rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));

const FileTypeIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(0.5),
  },
}));

const FileUploadPreview = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setLoading(false);
    }

    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const getFileName = (name) => {
    if (name.length > 20) {
      return name.substring(0, 17) + '...';
    }
    return name;
  };

  const renderPreview = () => {
    if (loading) {
      return <CircularProgress size={30} />;
    }

    if (file.type.startsWith('image/') && previewUrl) {
      return <PreviewImage src={previewUrl} alt={file.name} />;
    } else if (file.type.startsWith('video/')) {
      return (
        <FileTypeIcon>
          <VideoFileIcon />
          <Typography variant="caption" noWrap>
            {getFileName(file.name)}
          </Typography>
        </FileTypeIcon>
      );
    } else if (file.type.startsWith('audio/')) {
      return (
        <FileTypeIcon>
          <AudioFileIcon />
          <Typography variant="caption" noWrap>
            {getFileName(file.name)}
          </Typography>
        </FileTypeIcon>
      );
    } else {
      return (
        <FileTypeIcon>
          <InsertDriveFileIcon />
          <Typography variant="caption" noWrap>
            {getFileName(file.name)}
          </Typography>
        </FileTypeIcon>
      );
    }
  };

  if (!file) return null;

  return (
    <PreviewContainer>
      {renderPreview()}
      <RemoveButton size="small" onClick={onRemove}>
        <CloseIcon fontSize="small" />
      </RemoveButton>
      <PreviewInfo>
        {formatFileSize(file.size)}
      </PreviewInfo>
    </PreviewContainer>
  );
};

export default FileUploadPreview; 