import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';


const customStyles = `
  .yarl__container {
    transition: transform 0.3s ease, opacity 0.3s ease !important;
  }
  
  .yarl__container.swiping-down {
    transform: translateY(150px) !important;
    opacity: 0.7 !important;
  }
  
  .yarl__container.swiping-close {
    transform: translateY(100vh) !important;
    opacity: 0 !important;
  }
`;

/**
 * Простой просмотрщик изображений
 */
const SimpleImageViewer = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [isSwipingDown, setIsSwipingDown] = useState(false);
  const touchStartRef = useRef({ y: 0, x: 0 });
  const touchMoveRef = useRef({ y: 0, x: 0 });
  const containerRef = useRef(null);
  const scrollPosRef = useRef(0);
  
  
  const imageArray = Array.isArray(images) 
    ? images.filter(Boolean)
    : (typeof images === 'string' && images ? [images] : []);
  
  
  const slides = imageArray.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: 'Image' };
    } else if (image && typeof image === 'object') {
      return {
        src: image.img || image.src || '',
        alt: image.alt || image.title || 'Image'
      };
    }
    return null;
  }).filter(Boolean);

  
  const zoomConfig = {
    maxZoomPixelRatio: 3,
    zoomInMultiplier: 1.5,
    doubleTapDelay: 300,
    doubleClickDelay: 300,
    doubleClickMaxStops: 2,
    keyboardMoveDistance: 50,
    wheelZoomDistanceFactor: 100,
    pinchZoomDistanceFactor: 100,
    scrollToZoom: true
  };

  
  const thumbnailsConfig = {
    position: "bottom",
    width: 80,
    height: 60,
    border: 1,
    borderRadius: 4,
    padding: 4,
    gap: 8,
    showToggle: false
  };
  
  
  const handleClose = () => {
    
    const currentPos = window.scrollY;
    
    
    onClose();
    
    
    setTimeout(() => {
      window.scrollTo(0, currentPos);
    }, 50);
  };
  
  
  useEffect(() => {
    if (isOpen) {
      
      scrollPosRef.current = window.scrollY;
      
      
      const styleElement = document.createElement('style');
      styleElement.innerHTML = customStyles;
      document.head.appendChild(styleElement);
      
      
      const findContainer = () => {
        const container = document.querySelector('.yarl__container');
        if (container) {
          containerRef.current = container;
        }
      };
      
      
      setTimeout(findContainer, 100);
      
      
      const handleTouchStart = (e) => {
        touchStartRef.current = {
          y: e.touches[0].clientY,
          x: e.touches[0].clientX
        };
        touchMoveRef.current = { ...touchStartRef.current };
      };
      
      const handleTouchMove = (e) => {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        
        const deltaY = touchY - touchStartRef.current.y;
        const deltaX = touchX - touchStartRef.current.x;
        
        touchMoveRef.current = { y: touchY, x: touchX };
        
        
        const zoomElement = document.querySelector('.yarl__slide_image');
        const isZoomed = zoomElement && 
          window.getComputedStyle(zoomElement).transform !== 'none' && 
          window.getComputedStyle(zoomElement).transform !== 'matrix(1, 0, 0, 1, 0, 0)';
        
        
        if (deltaY > 20 && Math.abs(deltaY) > Math.abs(deltaX) && !isZoomed) {
          setIsSwipingDown(true);
          
          if (containerRef.current) {
            containerRef.current.classList.add('swiping-down');
          }
          
          e.preventDefault();
        }
      };
      
      const handleTouchEnd = () => {
        if (!isSwipingDown) return;
        
        const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
        
        
        if (deltaY > 80) {
          if (containerRef.current) {
            containerRef.current.classList.add('swiping-close');
          }
          
          setTimeout(() => {
            handleClose();
            setIsSwipingDown(false);
            
            if (containerRef.current) {
              containerRef.current.classList.remove('swiping-down', 'swiping-close');
            }
          }, 300);
        } else {
          if (containerRef.current) {
            containerRef.current.classList.remove('swiping-down');
          }
          setIsSwipingDown(false);
        }
      };
      
      
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        
        styleElement.remove();
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isOpen, isSwipingDown]);

  // Рендерим содержимое только если просмотрщик открыт
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <Lightbox
      open={isOpen}
      close={handleClose}
      slides={slides}
      index={initialIndex}
      plugins={[
        Zoom,
        Thumbnails
      ]}
      carousel={{
        finite: slides.length <= 1,
        preload: 2,
        padding: "0px",
        spacing: "1em",
        imageFit: "contain"
      }}
      animation={{
        fade: 300,
        swipe: 500,
        navigation: 250
      }}
      zoom={zoomConfig}
      thumbnails={thumbnailsConfig}
      render={{
        iconPrev: () => (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        ),
        iconNext: () => (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        )
      }}
      styles={{
        container: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(8px)"
        },
        slide: {
          width: "90%",
          maxWidth: "1200px",
          maxHeight: "85vh"
        },
        image: {
          objectFit: "contain",
          maxHeight: "85vh",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)"
        },
        button: {
          filter: "drop-shadow(0 0 1px rgba(0, 0, 0, 0.5))",
          color: "#fff"
        },
        buttonPrev: {
          background: "rgba(30, 30, 30, 0.6)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        buttonNext: {
          background: "rgba(30, 30, 30, 0.6)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        
        buttonClose: {
          background: "rgba(30, 30, 30, 0.8)",
          borderRadius: "50%",
          width: "44px", 
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "15px",
          marginRight: "15px"
        }
      }}
    />,
    document.body
  );
};

export default SimpleImageViewer; 