import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Box,
  Typography,
  Fade,
  Slide
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';

// Import our imageUtils for WebP optimization
import { optimizeImage } from '../utils/imageUtils';

/**
 * LightBox component for displaying images with navigation and actions
 */
const LightBox = ({ 
  isOpen, 
  onClose, 
  imageSrc, 
  title,
  caption,
  liked,
  likesCount,
  onLike,
  onComment,
  onShare,
  onNext,
  onPrev,
  totalImages,
  currentIndex
}) => {
  // State for zoom and position
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [optimizedImage, setOptimizedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Ref for tracking if component is mounted
  const isMounted = useRef(true);
  
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
  
  // Function to handle zoom in
  const handleZoomIn = () => {
    if (zoom < 3) {
      setZoom(prevZoom => Math.min(prevZoom + 0.5, 3));
    }
  };
  
  // Function to handle zoom out
  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(prevZoom => Math.max(prevZoom - 0.5, 1));
      if (zoom - 0.5 <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };
  
  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
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
  
  // Function to handle key presses
  const handleKeyDown = (e) => {
    if (isOpen) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    }
  };
  
  // Add event listener for key presses
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNext, onPrev]);
  
  // Determine if we should show the background blur
  const showBackgroundBlur = !imageLoading && optimizedImage;
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'none',
          borderRadius: 0,
          height: '100%',
          m: 0
        }
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          height: '100%',
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
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            zIndex: 10,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {/* Zoom controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: 'flex',
            gap: 1,
            zIndex: 10
          }}
        >
          <IconButton
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
                bgcolor: 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
                bgcolor: 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <ZoomInIcon />
          </IconButton>
        </Box>
        
        {/* Navigation buttons for multiple images */}
        {totalImages > 1 && (
          <>
            <IconButton
              onClick={onPrev}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                }
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={onNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                }
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </>
        )}
        
        {/* Image counter */}
        {totalImages > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '12px',
              px: 1.5,
              py: 0.5,
              zIndex: 10
            }}
          >
            <Typography variant="body2" color="white">
              {currentIndex + 1} / {totalImages}
            </Typography>
          </Box>
        )}

        {/* Loading indicator */}
        {imageLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <Typography>Loading...</Typography>
          </Box>
        )}

        {/* Image */}
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
            position: 'relative',
            visibility: imageLoading ? 'hidden' : 'visible'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
            <picture>
              {optimizedImage.type === 'image/webp' && (
                <source srcSet={optimizedImage.src} type="image/webp" />
              )}
              <img
                src={optimizedImage.originalSrc}
                alt={caption || "Image"}
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  maxHeight: zoom === 1 ? 'calc(100% - 100px)' : 'none',
                  maxWidth: zoom === 1 ? '100%' : 'none',
                  transition: isDragging ? 'none' : 'transform 0.3s ease',
                  objectFit: 'contain',
                  zIndex: 1
                }}
                draggable={false}
              />
            </picture>
          )}
        </Box>

        {/* Info and action bar */}
        {(title || caption || onLike || onComment || onShare) && (
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                zIndex: 5
              }}
            >
              {title && (
                <Typography variant="h6" color="white" fontWeight="bold">
                  {title}
                </Typography>
              )}
              {caption && (
                <Typography variant="body2" color="white">
                  {caption}
                </Typography>
              )}
              {(onLike || onComment || onShare) && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {onLike && (
                    <IconButton
                      onClick={onLike}
                      sx={{ color: liked ? 'error.main' : 'white' }}
                    >
                      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  )}
                  {likesCount > 0 && (
                    <Typography variant="body2" color="white">
                      {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                    </Typography>
                  )}
                  {onComment && (
                    <IconButton onClick={onComment} sx={{ color: 'white' }}>
                      <CommentIcon />
                    </IconButton>
                  )}
                  {onShare && (
                    <IconButton onClick={onShare} sx={{ color: 'white' }}>
                      <ShareIcon />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          </Slide>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LightBox; 