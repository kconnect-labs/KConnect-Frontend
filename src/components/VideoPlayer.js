import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { Box, styled } from '@mui/material';
import { useContext } from 'react';
import { ThemeSettingsContext } from '../App';

const VideoContainer = styled(Box)({
  width: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  aspectRatio: '16/9',
  backgroundColor: '#11111C',
  cursor: 'pointer',
  '& .plyr': {
    width: '100%',
    height: '100%',
  },
  '& .plyr--video': {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  '& .plyr--video .plyr__controls': {
    background: 'rgba(0, 0, 0, 0.3) !important',
    backdropFilter: 'blur(10px) !important',
    padding: '5px !important',
    paddingTop: '0px !important',
  },
});


const VideoPlayer = ({ videoUrl, poster, options = {} }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { themeSettings } = useContext(ThemeSettingsContext);
  
  
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    
    const accentColor = themeSettings?.button_primary_border_color || '#D0BCFF';
    
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    
    const controlsForDevice = [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      ...(isMobile ? [] : ['volume']), 
      'settings',
      'captions',
      'fullscreen'
    ];
    
    const defaultOptions = {
      controls: controlsForDevice,
      displayDuration: true,
      invertTime: false,
      toggleInvert: false,
      tooltips: { controls: true, seek: true },
      keyboard: { focused: true, global: false },
      autoplay: false,
      muted: false,
      seekTime: 10,
      volume: 1,
      quality: { default: 720, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] },
    };
    
    
    playerRef.current = new Plyr(videoRef.current, {
      ...defaultOptions,
      ...options
    });
    
    
    const applyCustomColors = () => {
      const root = document.documentElement;
      root.style.setProperty('--plyr-color-main', accentColor);
      root.style.setProperty('--plyr-range-fill-background', accentColor);
      root.style.setProperty('--plyr-range-thumb-background', accentColor);
      root.style.setProperty('--plyr-range-thumb-shadow', `0 1px 1px rgba(0, 0, 0, .15), 0 0 0 1px rgba(${parseInt(accentColor.slice(1, 3), 16)}, ${parseInt(accentColor.slice(3, 5), 16)}, ${parseInt(accentColor.slice(5, 7), 16)}, .2)`);
      root.style.setProperty('--plyr-video-control-color', '#ffffff');
      root.style.setProperty('--plyr-video-control-color-hover', accentColor);
    };
    
    applyCustomColors();
    
    
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoRef, themeSettings]);
  
  
  const getSourceType = (url) => {
    if (!url) return 'video/mp4';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    } else if (url.endsWith('.mp4')) {
      return 'video/mp4';
    } else if (url.endsWith('.webm')) {
      return 'video/webm';
    } else if (url.endsWith('.ogg') || url.endsWith('.ogv')) {
      return 'video/ogg';
    } else {
      return 'video/mp4'; 
    }
  };
  
  const sourceType = getSourceType(videoUrl);
  
  
  if (sourceType === 'youtube' || sourceType === 'vimeo') {
    return (
      <VideoContainer onClick={handleContainerClick}>
        <div 
          ref={videoRef} 
          data-plyr-provider={sourceType} 
          data-plyr-embed-id={
            sourceType === 'youtube' 
              ? videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1] 
              : videoUrl.match(/vimeo\.com\/(?:.*\/)?([0-9]+)$/i)?.[1]
          }
        />
      </VideoContainer>
    );
  }
  
  
  return (
    <VideoContainer onClick={handleContainerClick}>
      <video 
        ref={videoRef} 
        controls 
        poster={poster}
        className="plyr-video"
      >
        <source src={videoUrl} type={sourceType} />
        Ваш браузер не поддерживает HTML5 видео.
      </video>
    </VideoContainer>
  );
};

export default VideoPlayer; 