import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box,
  Fade,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
  Paper
} from '@mui/material';


import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';


import { optimizeImage } from '../utils/imageUtils';

/**
 * Enhanced LightBox component with navigation, zoom controls and mobile gestures
 */
const LightBox = ({ 
  isOpen, 
  onClose, 
  imageSrc,
  onNext,
  onPrev,
  caption,
  title,
  hasNext = false,
  hasPrev = false,
  totalImages = 1,
  currentIndex = 0
}) => {
  
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [optimizedImage, setOptimizedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  
  const [touchStartDistance, setTouchStartDistance] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  
  const isMounted = useRef(true);
  
  
  const [touchData, setTouchData] = useState({
    startX: 0,
    startY: 0,
    initialDistance: 0,
    initialZoom: 1
  });
  
  
  const containerRef = useRef(null);
  
  
  useEffect(() => {
    if (!imageSrc) return;
    
    const loadOptimizedImage = async () => {
      setImageLoading(true);
      try {
        const optimized = await optimizeImage(imageSrc, {
          quality: 0.9, 
          maxWidth: window.innerWidth > 1920 ? 1920 : window.innerWidth, 
          cacheResults: true
        });
        
        
        if (isMounted.current) {
          setOptimizedImage(optimized);
          setImageLoading(false);
        }
      } catch (error) {
        console.error('Error optimizing lightbox image:', error);
        
        if (isMounted.current) {
          setOptimizedImage({ src: imageSrc, originalSrc: imageSrc });
          setImageLoading(false);
        }
      }
    };
    
    loadOptimizedImage();
    
    
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    
    
    return () => {
      isMounted.current = false;
    };
  }, [imageSrc]);
  
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNext, onPrev, hasNext, hasPrev, onClose]);
  
  
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    } else {
      
      if (e.detail === 2) {
        setZoom(prevZoom => Math.min(prevZoom + 1, 3));
      }
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      
      setZoom(prevZoom => Math.min(prevZoom + 0.5, 3));
    } else {
      
      setZoom(prevZoom => Math.max(prevZoom - 0.5, 1));
      if (zoom - 0.5 <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };
  
  
  const handleTouchStart = (e) => {
    
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      }
    }
    
    
  };
  
  const handleTouchMove = (e) => {
    
    
    
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };
  
  const handleTouchEnd = (e) => {
    
    if (touchStartX !== null && zoom === 1 && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && hasPrev && onPrev) {
          
          onPrev();
        } else if (diffX < 0 && hasNext && onNext) {
          
          onNext();
        }
      }
    }
    
    setIsDragging(false);
    setTouchStartDistance(null);
    setTouchStartX(null);
  };
  
  
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.5, 3));
  };
  
  
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.5, 1));
    if (zoom - 0.5 <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };
  
  
  const handleDownload = () => {
    if (!optimizedImage) return;
    
    
    const link = document.createElement('a');
    
    
    link.href = optimizedImage.originalSrc;
    link.download = `image_${Date.now()}.jpg`; 
    
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  const showBackgroundBlur = !imageLoading && optimizedImage;
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    
    const touchStartHandler = (e) => {
      e.preventDefault(); 
      
      
      if (e.touches.length === 1) {
        setTouchData(prev => ({
          ...prev,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY
        }));
        
        if (zoom > 1) {
          setIsDragging(true);
          setDragStart({
            x: e.touches[0].clientX - position.x,
            y: e.touches[0].clientY - position.y
          });
        }
      }
      
      
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        setTouchData(prev => ({
          ...prev,
          initialDistance: distance,
          initialZoom: zoom
        }));
      }
    };
    
    
    const touchMoveHandler = (e) => {
      e.preventDefault(); 
      
      
      if (e.touches.length === 1 && zoom > 1) {
        
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      }
      
      
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        
        let newZoom = (distance / touchData.initialDistance) * touchData.initialZoom;
        
        
        newZoom = Math.min(Math.max(newZoom, 1), 3);
        
        
        setZoom(newZoom);
      }
    };
    
    
    const touchEndHandler = (e) => {
      
      if (zoom === 1 && e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchData.startX;
        
        
        if (Math.abs(diffX) > 50) {
          if (diffX > 0 && hasPrev && onPrev) {
            
            onPrev();
          } else if (diffX < 0 && hasNext && onNext) {
            
            onNext();
          }
        }
      }
      
      
      setIsDragging(false);
    };
    
    
    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler);
    
    
    return () => {
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, [zoom, position, dragStart, hasNext, hasPrev, onNext, onPrev, touchData]);
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'none',
          borderRadius: 0,
          height: '100vh',
          width: '100vw',
          m: 0,
          p: 0,
          overflow: 'hidden',
          zIndex: 1000000000 
        }
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          m: 0,
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)'
            },
            width: 40,
            height: 40,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 3
          }}
        >
          <CloseIcon />
        </IconButton>

        
        <Box
          component="div"
          ref={containerRef}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
            visibility: imageLoading ? 'hidden' : 'visible',
            touchAction: 'none', 
            WebkitOverflowScrolling: 'touch', 
            msContentZooming: 'none', 
            msOverflowStyle: 'none' 
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {showBackgroundBlur && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${optimizedImage.originalSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(30px)',
                opacity: 0.3,
                zIndex: 0
              }}
            />
          )}
          
          {!imageLoading && optimizedImage && (
            <picture
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {optimizedImage.type === 'image/webp' && (
                <source srcSet={optimizedImage.src} type="image/webp" />
              )}
              <img
                src={optimizedImage.originalSrc}
                alt="Image"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  maxHeight: zoom === 1 ? '100vh' : 'none', 
                  maxWidth: zoom === 1 ? '100vw' : 'none', 
                  width: zoom === 1 ? 'auto' : 'auto', 
                  height: zoom === 1 ? 'auto' : 'auto', 
                  objectFit: 'contain',
                  transition: isDragging ? 'none' : 'transform 0.3s ease',
                  zIndex: 1
                }}
                draggable={false}
              />
            </picture>
          )}
        </Box>
        
        
        {hasPrev && (
          <IconButton 
            onClick={onPrev}
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              },
              width: isMobile ? 40 : 50,
              height: isMobile ? 40 : 50,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 2
            }}
          >
            <NavigateBeforeIcon fontSize={isMobile ? 'medium' : 'large'} />
          </IconButton>
        )}
        
        {hasNext && (
          <IconButton 
            onClick={onNext}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              },
              width: isMobile ? 40 : 50,
              height: isMobile ? 40 : 50,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 2
            }}
          >
            <NavigateNextIcon fontSize={isMobile ? 'medium' : 'large'} />
          </IconButton>
        )}
        
        
        {!isMobile && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              display: 'flex',
              gap: 1,
              zIndex: 2
            }}
          >
            <IconButton
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                },
                '&.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                },
                width: 40,
                height: 40,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              <ZoomOutIcon />
            </IconButton>
            
            <IconButton
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                },
                '&.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                },
                width: 40,
                height: 40,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              <ZoomInIcon />
            </IconButton>
          </Box>
        )}
        
        
        <IconButton
          onClick={handleDownload}
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)'
            },
            width: 40,
            height: 40,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 2
          }}
        >
          <DownloadIcon />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default LightBox; 