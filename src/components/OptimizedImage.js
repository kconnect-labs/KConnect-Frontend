import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import inventoryImageService from '../services/InventoryImageService';
import { imageCache, createImageProps } from '../utils/imageUtils';

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
}));

const StyledImage = styled('img')(({ theme, loaded, error }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  transition: 'opacity 0.3s ease',
  opacity: loaded && !error ? 1 : 0,
  filter: error ? 'grayscale(100%)' : 'none',
}));

const FallbackBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px dashed rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 500,
}));

const OptimizedImage = ({ 
  src, 
  alt, 
  width = '100%', 
  height = '100%', 
  fallbackText = 'Изображение недоступно',
  showSkeleton = true,
  lazy = true,
  onLoad,
  onError,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageExists, setImageExists] = useState(null);
  const imgRef = useRef(null);

  // Проверяем существование изображения в кеше
  useEffect(() => {
    const checkImageExists = async () => {
      if (!src) {
        setImageExists(false);
        return;
      }

      // Проверяем кэш изображений 💀
      const cachedImage = imageCache.get(src);
      if (cachedImage) {
        setImageExists(true);
        return;
      }

      // Извлекаем информацию из URL
      const urlParts = src.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      
      if (src.includes('/inventory/') && !src.includes('/pack/')) {
        // URL вида /inventory/123
        const itemId = parseInt(lastPart);
        if (!isNaN(itemId)) {
          const result = await inventoryImageService.checkImagesBatch([{ item_id: itemId }]);
          setImageExists(result[0]?.exists || false);
        }
      } else if (src.includes('/inventory/pack/')) {
        // URL вида /inventory/pack/1/black
        const packId = parseInt(urlParts[urlParts.length - 2]);
        const itemName = lastPart;
        if (!isNaN(packId) && itemName) {
          const result = await inventoryImageService.checkImagesBatch([{ 
            pack_id: packId, 
            item_name: itemName 
          }]);
          setImageExists(result[0]?.exists || false);
        }
      } else {
        // Для других URL считаем, что изображение существует
        setImageExists(true);
      }
    };

    checkImageExists();
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
    // Сохраняем в кэш
    imageCache.set(src, { loaded: true, timestamp: Date.now() });
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    setLoaded(false);
    if (onError) onError();
  };

  // Если изображение не существует в кеше, показываем fallback
  if (imageExists === false) {
    return (
      <ImageContainer sx={{ width, height }}>
        <FallbackBox sx={{ width: '100%', height: '100%' }}>
          {fallbackText}
        </FallbackBox>
      </ImageContainer>
    );
  }

  const imageProps = createImageProps(src, {
    lazy,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    style: { display: loaded || error ? 'block' : 'none' },
    ...props
  });

  return (
    <ImageContainer sx={{ width, height }}>
      {showSkeleton && !loaded && !error && imageExists !== false && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
          sx={{ 
            borderRadius: 1,
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        />
      )}
      
      <StyledImage
        ref={imgRef}
        {...imageProps}
        loaded={loaded}
        error={error}
      />
      
      {error && (
        <FallbackBox sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%' 
        }}>
          {fallbackText}
        </FallbackBox>
      )}
    </ImageContainer>
  );
};

export default OptimizedImage; 