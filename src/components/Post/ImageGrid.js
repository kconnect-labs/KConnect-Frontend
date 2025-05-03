import React, { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import { optimizeImage } from '../../utils/imageUtils';

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
  filter: 'blur(10px)',
  opacity: 0.5,
  transform: 'scale(1.1)', 
});

const Image = styled('img')({
  maxWidth: '100%',
  maxHeight: '300px', 
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
  position: 'relative',
  zIndex: 2,
});

const ImageOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3,
  className: 'overlay',
});

const ImageGrid = ({ images, onImageClick }) => {
  
  const imageArray = Array.isArray(images) 
    ? images.filter(Boolean) 
    : (typeof images === 'string' && images ? [images] : []);
  
  
  const limitedImages = imageArray.slice(0, 6);
  const remainingCount = imageArray.length - 6;
  
  
  if (limitedImages.length === 0) {
    return null;
  }
  
  
  const [optimizedImages, setOptimizedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const getGridLayout = (count) => {
    switch (count) {
      case 1:
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'minmax(auto, 300px)', 
        };
      case 2:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'minmax(auto, 300px)', 
        };
      case 3:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'minmax(auto, 300px) minmax(auto, 300px)', 
          gridTemplateAreas: '"img1 img2" "img1 img3"',
        };
      case 4:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'minmax(auto, 300px) minmax(auto, 300px)', 
        };
      case 5:
      case 6:
        return {
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'minmax(auto, 300px) minmax(auto, 300px)', 
        };
      default:
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'minmax(auto, 300px)', 
        };
    }
  };

  
  const formatImageUrl = (url) => {
    if (!url) return '';
    
    
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    
    
    if (url.includes('post/')) {
      return `/static/uploads/${url}`;
    }
    
    return url;
  };
  
  
  const supportsWebP = () => {
    try {
      return (
        'imageRendering' in document.documentElement.style && 
        !navigator.userAgent.includes('Safari') && 
        !navigator.userAgent.includes('Edge/')
      ) || 
      document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  };
  
  
  const addFormatParam = (url, format = 'webp') => {
    if (!url || !url.startsWith('/')) return url;
    return `${url}${url.includes('?') ? '&' : '?'}format=${format}`;
  };

  
  useEffect(() => {
    const loadOptimizedImages = async () => {
      if (!images || images.length === 0) {
        setOptimizedImages([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        
        const webpSupported = supportsWebP();
        console.log('WebP support detected:', webpSupported);
        
        const optimizedResults = await Promise.all(
          limitedImages.map(async (imageUrl) => {
            
            let formattedUrl = formatImageUrl(imageUrl);
            
            
            if (webpSupported && formattedUrl.startsWith('/static/')) {
              formattedUrl = addFormatParam(formattedUrl, 'webp');
            }
            
            
            const optimized = await optimizeImage(formattedUrl, {
              quality: 0.85,
              maxWidth: 1200,
              cacheResults: true,
              preferWebP: webpSupported
            });
            
            
            return {
              ...optimized,
              originalSrc: formatImageUrl(imageUrl)
            };
          })
        );
        
        setOptimizedImages(optimizedResults);
      } catch (error) {
        console.error('Error optimizing images:', error);
        
        setOptimizedImages(limitedImages.map(url => ({
          src: formatImageUrl(url),
          originalSrc: formatImageUrl(url)
        })));
      } finally {
        setLoading(false);
      }
    };
    
    loadOptimizedImages();
  }, [images]);

  
  const handleImageClick = (e, index) => {
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(index);
    }
  };

  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          ...getGridLayout(limitedImages.length),
          opacity: 0.7,
        }}
      >
        {limitedImages.map((_, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              ...(index === 0 && limitedImages.length === 3 ? { gridArea: 'img1' } : {}),
              ...(index === 1 && limitedImages.length === 3 ? { gridArea: 'img2' } : {}),
              ...(index === 2 && limitedImages.length === 3 ? { gridArea: 'img3' } : {})
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        ...getGridLayout(limitedImages.length),
      }}
    >
      {optimizedImages.map((image, index) => {
        const isLastWithMore = index === 5 && remainingCount > 0;
        const originalUrl = formatImageUrl(limitedImages[index]);
        
        return (
          <ImageContainer
            key={index}
            onClick={(e) => handleImageClick(e, index)}
            sx={index === 0 && limitedImages.length === 3 ? { gridArea: 'img1' } : 
               index === 1 && limitedImages.length === 3 ? { gridArea: 'img2' } : 
               index === 2 && limitedImages.length === 3 ? { gridArea: 'img3' } : {}}
          >
            <BackgroundImage 
              style={{ 
                backgroundImage: `url(${originalUrl})` 
              }} 
            />
            <picture>
              {image.type === 'image/webp' && (
                <source srcSet={image.src} type="image/webp" />
              )}
              <Image
                src={image.originalSrc || originalUrl}
                alt={`Image ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  console.error(`Failed to load image: ${originalUrl}`);
                  if (e.target && e.target instanceof HTMLImageElement) {
                    e.target.src = '/static/uploads/system/image_placeholder.jpg';
                  }
                }}
              />
            </picture>
            <ImageOverlay className="overlay">
              {isLastWithMore && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  +{remainingCount}
                </Box>
              )}
            </ImageOverlay>
          </ImageContainer>
        );
      })}
    </Box>
  );
};

export default ImageGrid; 