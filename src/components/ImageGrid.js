import React from 'react';
import { Box } from '@mui/material';

/**
 * Component for displaying multiple images in a grid layout
 */
const ImageGrid = ({ images, maxImages = 4, onImageClick }) => {
  // Normalize image URLs 
  const normalizedImages = images.filter(Boolean).slice(0, maxImages);
  const totalImages = images.length;
  const hasMoreImages = totalImages > maxImages;

  // Configure grid based on number of images
  const getGridConfig = () => {
    switch (normalizedImages.length) {
      case 1:
        return { columns: '1fr', rows: '1fr' };
      case 2:
        return { columns: '1fr 1fr', rows: '1fr' };
      case 3:
        return { columns: '1fr 1fr', rows: '1fr 1fr', areas: ['one one', 'two three'] };
      default:
        return { columns: '1fr 1fr', rows: '1fr 1fr' };
    }
  };

  const gridConfig = getGridConfig();

  // Single image display
  if (normalizedImages.length === 1) {
    return (
      <Box 
        onClick={() => onImageClick && onImageClick(0)}
        sx={{ 
          width: '100%', 
          height: 'auto', 
          maxHeight: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        <img 
          src={normalizedImages[0]} 
          alt="Post"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '500px',
            objectFit: 'contain',
          }} 
        />
      </Box>
    );
  }

  // Grid display for multiple images
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: gridConfig.columns,
        gridTemplateRows: gridConfig.rows,
        gap: 1,
        width: '100%',
        aspectRatio: normalizedImages.length <= 2 ? '2/1' : '1/1',
      }}
    >
      {normalizedImages.map((image, index) => (
        <Box
          key={index}
          onClick={() => onImageClick && onImageClick(index)}
          sx={{
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px',
            position: 'relative',
            cursor: 'pointer',
            gridArea: normalizedImages.length === 3 && index === 0 ? 'one' : 
                     normalizedImages.length === 3 && index === 1 ? 'two' : 
                     normalizedImages.length === 3 && index === 2 ? 'three' : 'auto',
          }}
        >
          <img
            src={image}
            alt={`Post ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
          
          
          {index === normalizedImages.length - 1 && hasMoreImages && (
            <Box sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}>
              +{totalImages - maxImages + 1}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ImageGrid; 