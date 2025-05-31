import React from 'react';
import { Box, styled, Typography } from '@mui/material';

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#11111C',
  '&:hover': {
    '& .overlay': {
      opacity: 1,
    },
  },
}));

const BackgroundImage = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(12px)',
  opacity: 0.5,
  transform: 'scale(1.2)', 
});

const Image = styled('img')(({ isCenter }) => ({
  maxWidth: isCenter ? '90%' : '100%',
  maxHeight: isCenter ? '100%' : '100%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
  position: 'relative',
  zIndex: 2,
  display: 'block',
  borderRadius: '4px',
}));

const MoreImagesOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  zIndex: 3,
}));

const LastImageOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(2px)',
  zIndex: 2,
});

/**
 * A specialized image grid for reposts with blurred backgrounds and limited display
 * Shows maximum 2 images by default, or a 3-grid with +N indicator
 */
const RepostImageGrid = ({ images, onImageClick }) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  
  const validImages = images.filter(Boolean);
  
  if (validImages.length === 0) {
    return null;
  }

  
  const displayImages = validImages.slice(0, 3);
  const remainingCount = validImages.length - 3;
  const hasMoreImages = remainingCount > 0;

  
  if (displayImages.length === 1) {
    return (
      <Box sx={{ position: 'relative', width: '100%', height: '250px', borderRadius: '8px', overflow: 'hidden' }}>
        <ImageContainer 
          onClick={() => onImageClick && onImageClick(0)}
          sx={{ height: '250px' }}
        >
          <BackgroundImage style={{ backgroundImage: `url(${displayImages[0]})` }} />
          <Image 
            src={displayImages[0]} 
            alt="Repost image"
            isCenter={true}
          />
        </ImageContainer>
      </Box>
    );
  }

  
  if (displayImages.length === 2) {
    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 1, 
        width: '100%', 
        height: '200px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {displayImages.map((image, index) => (
          <ImageContainer 
            key={`repost-img-${index}`}
            onClick={() => onImageClick && onImageClick(index)}
          >
            <BackgroundImage style={{ backgroundImage: `url(${image})` }} />
            <Image 
              src={image} 
              alt={`Repost image ${index + 1}`}
              isCenter={true}
            />
          </ImageContainer>
        ))}
      </Box>
    );
  }

  
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: '2fr 1fr', 
      gridTemplateRows: '100px 100px',
      gridTemplateAreas: '"img1 img2" "img1 img3"',
      gap: 1, 
      width: '100%', 
      height: '200px'
    }}>
      {displayImages.map((image, index) => (
        <Box
          key={`repost-img-${index}`}
          sx={{
            position: 'relative',
            gridArea: index === 0 ? 'img1' : index === 1 ? 'img2' : 'img3',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <ImageContainer onClick={() => onImageClick && onImageClick(index)}>
            <BackgroundImage style={{ backgroundImage: `url(${image})` }} />
            <Image 
              src={image} 
              alt={`Repost image ${index + 1}`}
              isCenter={true}
            />
            
            {/* Show +N on the last visible image if there are more */}
            {index === 2 && hasMoreImages && (
              <>
                <LastImageOverlay />
                <MoreImagesOverlay>
                  +{remainingCount}
                </MoreImagesOverlay>
              </>
            )}
          </ImageContainer>
        </Box>
      ))}
    </Box>
  );
};

export default RepostImageGrid; 