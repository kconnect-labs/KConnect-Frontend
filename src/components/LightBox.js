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

// Import icons
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

// Import our imageUtils for WebP optimization
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
  // State for zoom and position
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [optimizedImage, setOptimizedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  // For touch gestures
  const [touchStartDistance, setTouchStartDistance] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  
  // Theme and media queries
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Ref for tracking if component is mounted
  const isMounted = useRef(true);
  
  // Touch gesture handlers for mobile devices
  const [touchData, setTouchData] = useState({
    startX: 0,
    startY: 0,
    initialDistance: 0,
    initialZoom: 1
  });
  
  // Container ref for handling touch events properly
  const containerRef = useRef(null);
  
  // Optimize image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    
    const loadOptimizedImage = async () => {
      setImageLoading(true);
      try {
        const optimized = await optimizeImage(imageSrc, {
          quality: 0.9, // Higher quality for lightbox
          maxWidth: window.innerWidth > 1920 ? 1920 : window.innerWidth, // Limit to screen width
          cacheResults: true
        });
        
        // Only update state if component is still mounted
        if (isMounted.current) {
          setOptimizedImage(optimized);
          setImageLoading(false);
        }
      } catch (error) {
        console.error('Error optimizing lightbox image:', error);
        // Fallback to original image
        if (isMounted.current) {
          setOptimizedImage({ src: imageSrc, originalSrc: imageSrc });
          setImageLoading(false);
        }
      }
    };
    
    loadOptimizedImage();
    
    // Reset zoom and position when image changes
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [imageSrc]);
  
  // Set isMounted to false when unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Add keyboard navigation support
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
  
  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    } else {
      // Double click to zoom in
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
  
  // Function to handle wheel events for zooming
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setZoom(prevZoom => Math.min(prevZoom + 0.5, 3));
    } else {
      // Zoom out
      setZoom(prevZoom => Math.max(prevZoom - 0.5, 1));
      if (zoom - 0.5 <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };
  
  // Touch event handlers for mobile gestures
  const handleTouchStart = (e) => {
    // For swipe navigation
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
    
    // Don't try to prevent default for touch events as browsers make them passive
  };
  
  const handleTouchMove = (e) => {
    // Don't try to call preventDefault as it won't work in passive listeners
    
    // Only handle single touch for dragging when zoomed
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Dragging when zoomed in
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };
  
  const handleTouchEnd = (e) => {
    // Handle swipe gesture for navigation
    if (touchStartX !== null && zoom === 1 && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      
      // Threshold for swipe gesture
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && hasPrev && onPrev) {
          // Swipe right - go to previous
          onPrev();
        } else if (diffX < 0 && hasNext && onNext) {
          // Swipe left - go to next
          onNext();
        }
      }
    }
    
    setIsDragging(false);
    setTouchStartDistance(null);
    setTouchStartX(null);
  };
  
  // Handle zoom in button click
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.5, 3));
  };
  
  // Handle zoom out button click
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.5, 1));
    if (zoom - 0.5 <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };
  
  // Handle download button click
  const handleDownload = () => {
    if (!optimizedImage) return;
    
    // Create a link element
    const link = document.createElement('a');
    
    // Set link properties
    link.href = optimizedImage.originalSrc;
    link.download = `image_${Date.now()}.jpg`; // Default filename
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Determine if we should show the background blur
  const showBackgroundBlur = !imageLoading && optimizedImage;
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Handle touch start
    const touchStartHandler = (e) => {
      e.preventDefault(); // Works because we're using direct DOM API with passive: false
      
      // Single touch for moving/panning
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
      
      // Two touches for pinch zoom
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
    
    // Handle touch move
    const touchMoveHandler = (e) => {
      e.preventDefault(); // Works because we're using direct DOM API with passive: false
      
      // Handle dragging (panning) with one finger when zoomed in
      if (e.touches.length === 1 && zoom > 1) {
        // Dragging when zoomed in
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      }
      
      // Handle pinch zoom with two fingers
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate new zoom based on pinch gesture
        let newZoom = (distance / touchData.initialDistance) * touchData.initialZoom;
        
        // Limit zoom levels
        newZoom = Math.min(Math.max(newZoom, 1), 3);
        
        // Apply new zoom
        setZoom(newZoom);
      }
    };
    
    // Handle touch end
    const touchEndHandler = (e) => {
      // Handle swipe gesture for navigation
      if (zoom === 1 && e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchData.startX;
        
        // Threshold for swipe gesture
        if (Math.abs(diffX) > 50) {
          if (diffX > 0 && hasPrev && onPrev) {
            // Swipe right - go to previous
            onPrev();
          } else if (diffX < 0 && hasNext && onNext) {
            // Swipe left - go to next
            onNext();
          }
        }
      }
      
      // Reset states
      setIsDragging(false);
    };
    
    // Add event listeners with passive: false option
    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler);
    
    // Clean up
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
          zIndex: 1000000000 // Very high z-index as requested
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
            touchAction: 'none', // Disable browser default touch actions
            WebkitOverflowScrolling: 'touch', // Improve scrolling performance
            msContentZooming: 'none', // Disable zooming in IE/Edge
            msOverflowStyle: 'none' // Hide scrollbars in IE/Edge
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
                  maxHeight: zoom === 1 ? '100vh' : 'none', // Full viewport height
                  maxWidth: zoom === 1 ? '100vw' : 'none', // Full viewport width 
                  width: zoom === 1 ? 'auto' : 'auto', // Auto to maintain aspect ratio
                  height: zoom === 1 ? 'auto' : 'auto', // Auto to maintain aspect ratio
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