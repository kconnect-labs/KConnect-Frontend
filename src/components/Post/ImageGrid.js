import React, { useState, useEffect } from 'react';
import { Box, styled, useTheme, useMediaQuery } from '@mui/material';
import { optimizeImage } from '../../utils/imageUtils';
import SimpleImageViewer from '../SimpleImageViewer';

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  cursor: 'zoom-in',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#11111C',
  maxWidth: '100%',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.015)',
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

const Image = styled('img')(({ isSingle, isMobile }) => ({
  maxWidth: '100%',
  maxHeight: isSingle ? (isMobile ? '600px' : '450px') : '100%',
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
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  opacity: 0,
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3,
  className: 'overlay',
  '&::after': {
    content: '"🔍"',
    fontSize: '24px',
    opacity: 0.85,
    filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.5))',
    transform: 'scale(0.8)',
    transition: 'transform 0.2s ease',
  },
  '&:hover::after': {
    transform: 'scale(1.0)',
  }
});

const ImageGrid = ({ images, selectedImage = null, onImageClick, onImageError, hideOverlay = false, miniMode = false, maxHeight = 400 }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [optimizedImages, setOptimizedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorImages, setErrorImages] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const imageArray = Array.isArray(images) 
    ? images.filter(Boolean) 
    : (typeof images === 'string' && images ? [images] : []);
  
  const limitedImages = imageArray.slice(0, 9);
  const remainingCount = imageArray.length - 9;
  
  if (limitedImages.length === 0) {
    return null;
  }
  
  const getGridLayout = (count, isMobile = false) => {
    switch (count) {
      case 1:
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto',
          maxHeight: isMobile ? '600px' : '450px',
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
          maxHeight: isMobile ? '600px' : '450px'
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

  const getOptimizedImageUrl = (url, isSingle = false) => {
    const width = isSingle ? 1200 : 600;
    const height = isSingle ? 900 : 600;
    
    if (url.startsWith('http')) {
      return url;
    }
    
    if (url.includes('/static/uploads/')) {
      return `${url}?width=${width}&height=${height}&optimize=true`;
    }
    
    return url;
  };

  const openLightbox = (index, event) => {
    
    if (event) {
      event.stopPropagation();
    }
    
    setSelectedIndex(index);
    setLightboxOpen(true);
    
    if (onImageClick && typeof onImageClick === 'function') {
      onImageClick(index);
    }
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

  const handleImageError = (url, index) => {
    setErrorImages(prev => ({
      ...prev,
      [url]: true
    }));
    
    if (onImageError && typeof onImageError === 'function') {
      onImageError(url, index);
    }
  };

  const renderImage = (image, index, isSingle) => {
    const imageUrl = formatImageUrl(image);
    const optimizedUrl = getOptimizedImageUrl(imageUrl, isSingle);
    
    const hasError = errorImages[imageUrl];
    
    if (hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            padding: '10px',
            textAlign: 'center'
          }}
        >
          Ошибка при загрузке изображения
        </Box>
      );
    }
    
    return (
      <React.Fragment>
        <BackgroundImage
          style={{ backgroundImage: `url(${optimizedUrl})` }}
        />
        <Image
          src={optimizedUrl}
          alt={`Изображение ${index + 1}`}
          loading="lazy"
          isSingle={isSingle}
          isMobile={isMobile}
          onError={() => handleImageError(imageUrl, index)}
        />
        {!hideOverlay && (
          <ImageOverlay />
        )}
      </React.Fragment>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          ...getGridLayout(limitedImages.length, isMobile),
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

  if (limitedImages.length === 1) {
    const singleImage = limitedImages[0];
    return (
      <Box sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', mb: 1 }}>
        <ImageContainer
          onClick={(event) => openLightbox(0, event)}
          sx={{
            height: miniMode ? '150px' : 'auto',
            maxHeight: miniMode ? '150px' : maxHeight,
          }}
        >
          {renderImage(singleImage, 0, true)}
        </ImageContainer>
        
        {lightboxOpen && (
          <SimpleImageViewer
            src={formatImageUrl(limitedImages[selectedIndex])}
            onClose={closeLightbox}
            alt="Полноразмерное изображение"
          />
        )}
      </Box>
    );
  }

  const layoutProps = getGridLayout(limitedImages.length, isMobile);
  
  return (
    <Box sx={{ mb: 1 }}>
      <Box
        sx={{
          display: 'grid',
          gap: '4px',
          ...layoutProps,
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {limitedImages.map((image, index) => (
          <ImageContainer
            key={`image-${index}`}
            onClick={(event) => openLightbox(index, event)}
            sx={{
              gridArea: getCellGridArea(index, limitedImages.length),
              cursor: 'pointer',
              height: '100%',
            }}
          >
            {renderImage(image, index, false)}
          </ImageContainer>
        ))}
        
        {remainingCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '8px 0 0 0',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            +{remainingCount}
          </Box>
        )}
      </Box>
      
      {lightboxOpen && (
        <SimpleImageViewer
          src={formatImageUrl(limitedImages[selectedIndex])}
          onClose={closeLightbox}
          alt="Полноразмерное изображение"
        />
      )}
    </Box>
  );
};

export default ImageGrid;