import React, { useState, useCallback, memo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Share, Lyrics, Edit, Close, ContentCopy } from '@mui/icons-material';
import { useMusic } from '../../../context/MusicContext';
import styles from './TopControls.module.scss';

const TopControls = ({ 
  onClose, 
  onToggleLyrics, 
  onOpenLyricsEditor,
  showLyrics,
  showLyricsEditor,
  dominantColor 
}) => {
  const [copied, setCopied] = useState(false);
  const { currentTrack } = useMusic();
  
  const handleShare = useCallback(() => {
    if (!currentTrack) return;
    
    const trackLink = `${window.location.origin}/music?track=${currentTrack.id}`;
    
    navigator.clipboard.writeText(trackLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  }, [currentTrack]);


  const getActiveColor = (isActive) => {
    if (!isActive) return 'rgba(255, 255, 255, 0.9)';
    
    if (dominantColor) {
      return `rgb(${dominantColor})`;
    }
    return '#ff2d55';
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftControls}>
        <Tooltip title={copied ? "Скопировано!" : "Поделиться"}>
          <IconButton 
            onClick={handleShare}
            className={`${styles.controlButton} apple-music-btn`}
          >
            {copied ? <ContentCopy fontSize="small" /> : <Share fontSize="small" />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={showLyrics ? "Скрыть текст" : "Показать текст"}>
          <IconButton 
            onClick={onToggleLyrics}
            className={`${styles.controlButton} apple-music-btn ${showLyrics ? styles.active : ''}`}
            style={{ color: getActiveColor(showLyrics) }}
          >
            <Lyrics fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      
      <div className={styles.rightControls}>
        <Tooltip title="Редактировать текст">
          <IconButton 
            onClick={onOpenLyricsEditor}
            className={`${styles.controlButton} apple-music-btn ${showLyricsEditor ? styles.active : ''}`}
            style={{ color: getActiveColor(showLyricsEditor) }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Закрыть">
          <IconButton 
            onClick={onClose}
            className={`${styles.controlButton} apple-music-btn`}
          >
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default memo(TopControls); 