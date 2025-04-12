import React from 'react';
import { Box, Typography, Paper, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const PreviewContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

const FilePreview = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  height: '100%',
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  padding: '4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const ImagePreview = styled('img')({
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
});

const VideoPreview = styled('video')({
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
});

const FileIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
}));

const FileNameText = styled(Typography)({
  fontSize: '0.75rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  textAlign: 'center',
  marginTop: '4px',
});

const FileUploadPreview = ({ files, onRemoveFile }) => {
  const getFilePreview = (file, index) => {
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name.length > 15 
      ? file.name.substring(0, 12) + '...' + file.name.substring(file.name.lastIndexOf('.')) 
      : file.name;

    if (file.type.startsWith('image/')) {
      return (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <FilePreview>
            <ImagePreview src={fileUrl} alt={fileName} />
            <FileNameText>{fileName}</FileNameText>
            <RemoveButton size="small" onClick={() => onRemoveFile(index)}>
              <CloseIcon fontSize="small" />
            </RemoveButton>
          </FilePreview>
        </Grid>
      );
    } 
    
    if (file.type.startsWith('video/')) {
      return (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <FilePreview>
            <VideoPreview controls>
              <source src={fileUrl} type={file.type} />
              Your browser does not support the video tag.
            </VideoPreview>
            <FileNameText>{fileName}</FileNameText>
            <RemoveButton size="small" onClick={() => onRemoveFile(index)}>
              <CloseIcon fontSize="small" />
            </RemoveButton>
          </FilePreview>
        </Grid>
      );
    }
    
    return (
      <Grid item xs={6} sm={4} md={3} key={index}>
        <FilePreview>
          <FileIcon>
            {file.type.includes('pdf') ? (
              <InsertDriveFileIcon color="error" sx={{ fontSize: 40 }} />
            ) : file.type.includes('word') || file.type.includes('document') ? (
              <InsertDriveFileIcon color="primary" sx={{ fontSize: 40 }} />
            ) : file.type.includes('video') ? (
              <VideoFileIcon color="success" sx={{ fontSize: 40 }} />
            ) : (
              <InsertDriveFileIcon sx={{ fontSize: 40 }} />
            )}
            <FileNameText>{fileName}</FileNameText>
          </FileIcon>
          <RemoveButton size="small" onClick={() => onRemoveFile(index)}>
            <CloseIcon fontSize="small" />
          </RemoveButton>
        </FilePreview>
      </Grid>
    );
  };
  
  if (!files || files.length === 0) {
    return null;
  }
  
  return (
    <PreviewContainer>
      <Grid container spacing={1}>
        {files.map((file, index) => getFilePreview(file, index))}
      </Grid>
    </PreviewContainer>
  );
};

export default FileUploadPreview; 