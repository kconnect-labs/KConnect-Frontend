import React, { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import { optimizeImage } from '../../utils/imageUtils';
import SimpleImageViewer from '../SimpleImageViewer';

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
  maxWidth: '100%',
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

const Image = styled('img')(({ isSingle }) => ({
  maxWidth: '100%',
  maxHeight: isSingle ? '300px' : '100%',
  width: 'auto',
  height: isSingle ? '100%' : 'auto',
  objectFit: isSingle ? 'contain' : 'contain',
  position: 'relative',
  zIndex: 2,
  display: 'block',
}));

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

const ImageGrid = ({ images, selectedImage = null, onImageClick, hideOverlay = false, miniMode = false, maxHeight = 400 }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [optimizedImages, setOptimizedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const imageArray = Array.isArray(images) 
    ? images.filter(Boolean) 
    : (typeof images === 'string' && images ? [images] : []);
  
  const limitedImages = imageArray.slice(0, 9);
  const remainingCount = imageArray.length - 9;
  
  if (limitedImages.length === 0) {
    return null;
  }
  
  const getGridLayout = (count) => {
    switch (count) {
      case 1:
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto',
          maxHeight: '300px',
          height: 'auto'
        };
      case 2:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '350px',
          maxHeight: '350px'
        };
      case 3:
        return {
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '200px 200px',
          gridTemplateAreas: '"img1 img2" "img1 img3"',
          maxHeight: '400px'
        };
      case 4:
        return {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 200px)',
          gridTemplateAreas: '"img1 img2" "img3 img4"',
          maxHeight: '400px'
        };
      case 5:
        return {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: '200px 200px',
          gridTemplateAreas: '"img1 img1 img2" "img3 img4 img5"',
          maxHeight: '400px'
        };
      case 6:
        return {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: '180px 180px',
          gridTemplateAreas: '"img1 img2 img3" "img4 img5 img6"',
          maxHeight: '360px'
        };
      case 7:
        return {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 160px)',
          gridTemplateAreas: '"img1 img1 img2" "img3 img4 img5" "img6 img7 img7"',
          maxHeight: '480px'
        };
      case 8:
        return {
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 180px)',
          gridTemplateAreas: '"img1 img2 img3 img4" "img5 img6 img7 img8"',
          maxHeight: '360px'
        };
      case 9:
        return {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 140px)',
          gridTemplateAreas: '"img1 img2 img3" "img4 img5 img6" "img7 img8 img9"',
          maxHeight: '420px'
        };
      default:
        if (count > 9) {
          const columns = count >= 12 ? 4 : 3;
          const rows = Math.ceil(count / columns);
          return {
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, ${500 / rows}px)`,
            maxHeight: `${rows * (500 / rows)}px`
          };
        }
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: '300px',
          maxHeight: '300px'
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

  const openLightbox = (index) => {
    setSelectedIndex(index);
    
    if (onImageClick && typeof onImageClick === 'function') {
      onImageClick(index);
      return;
    }
    
    setLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const getCellGridArea = (index, count) => {
    if (count === 1) return '';
    
    if (count === 2) {
      return index === 0 ? 'span 1 / span 1 / auto / auto' : 'span 1 / span 1 / auto / auto';
    }
    
    if (count === 3) {
      if (index === 0) return 'span 2 / span 1 / auto / auto';
      return 'span 1 / span 1 / auto / auto';
    }
    
    if (count === 4) {
      return 'span 1 / span 1 / auto / auto';
    }
    
    if (count === 5) {
      if (index === 0) return 'span 1 / span 2 / auto / auto';
      return 'span 1 / span 1 / auto / auto';
    }
    
    if (count === 6) {
      return 'span 1 / span 1 / auto / auto';
    }
    
    if (count === 7) {
      if (index === 0) return 'span 1 / span 2 / auto / auto';
      if (index === 6) return 'span 1 / span 2 / auto / auto';
      return 'span 1 / span 1 / auto / auto';
    }
    
    if (count === 8) {
      return 'span 1 / span 1 / auto / auto';
    }
    
    if (count === 9) {
      return 'span 1 / span 1 / auto / auto';
    }
    
    return '';
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
              gridArea: getCellGridArea(index, limitedImages.length)
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          ...getGridLayout(limitedImages.length),
          maxWidth: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        {optimizedImages.map((image, index) => {
          const isLastWithMore = index === optimizedImages.length - 1 && remainingCount > 0;
          const originalUrl = formatImageUrl(limitedImages[index]);
          const isSingle = limitedImages.length === 1;
          
          return (
            <ImageContainer
              key={index}
              onClick={(e) => openLightbox(index)}
              sx={{
                gridArea: getCellGridArea(index, limitedImages.length),
                aspectRatio: isSingle ? 'auto' : '1/1',
                height: isSingle ? 'auto' : '100%',
                minHeight: isSingle ? 'auto' : '100%',
                maxHeight: isSingle ? '300px' : '100%',
              }}
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
                  isSingle={isSingle}
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
      
      {!onImageClick && (
        <SimpleImageViewer 
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          images={images.map(img => img.url || img)}
          initialIndex={selectedIndex || 0}
        />
      )}
    </>
  );
};

export default ImageGrid;