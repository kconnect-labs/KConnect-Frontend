import React, { memo, useRef, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';


window.audioTiming = {
  currentTime: 0,
  duration: 0,
  progress: 0,
  formattedCurrentTime: '0:00',
  formattedDuration: '0:00',
  audioRef: null
};

const MusicPlayerCore = memo(() => {
  const { 
    audioRef, 
    currentTrack, 
    getCurrentTimeRaw, 
    getDurationRaw,
    isPlaying,
    setCurrentTime,
    setDuration 
  } = useMusic();
  
  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const currentTimeDisplayRef = useRef(null);
  const durationDisplayRef = useRef(null);
  const progressBarRef = useRef(null);
  
  
  useEffect(() => {
    
    window.audioTiming.audioRef = audioRef.current;
    
    
    const updateGlobalTiming = () => {
      if (!audioRef.current) return;
      
      const currentTime = audioRef.current.currentTime || 0;
      const duration = audioRef.current.duration || 0;
      
      
      window.audioTiming.currentTime = currentTime;
      window.audioTiming.duration = duration;
      window.audioTiming.progress = duration > 0 ? (currentTime / duration) * 100 : 0;
      window.audioTiming.formattedCurrentTime = formatTime(currentTime);
      window.audioTiming.formattedDuration = formatTime(duration);
      
      
      if (typeof setCurrentTime === 'function') {
        setCurrentTime(currentTime);
      }
      
      if (typeof setDuration === 'function') {
        setDuration(duration);
      }
    };
    
    
    let rafId;
    const frameLoop = () => {
      updateGlobalTiming();
      rafId = requestAnimationFrame(frameLoop);
    };
    
    if (audioRef.current) {
      
      rafId = requestAnimationFrame(frameLoop);
      
      
      audioRef.current.addEventListener('timeupdate', updateGlobalTiming);
    }
    
    return () => {
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateGlobalTiming);
      }
    };
  }, [audioRef, setCurrentTime, setDuration]);
  
  return null; 
});

export default MusicPlayerCore; 