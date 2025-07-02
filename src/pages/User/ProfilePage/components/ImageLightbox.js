import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageLightbox = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <img 
        src={imageUrl} 
        alt="Full size" 
        style={{ 
          maxWidth: '90%', 
          maxHeight: '90%', 
          objectFit: 'contain' 
        }} 
        onClick={(e) => e.stopPropagation()}
      />
      <IconButton
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
};

export default ImageLightbox; 