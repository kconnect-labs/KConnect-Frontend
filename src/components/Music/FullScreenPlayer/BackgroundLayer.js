import React, { memo } from 'react';
import { Box } from '@mui/material';
import styles from './BackgroundLayer.module.scss';

const BackgroundLayer = ({ cover, dominantColor }) => {
  const defaultCover = '/static/uploads/system/album_placeholder.jpg';
  
  return (
    <div className={styles.backgroundContainer}>
      {/* Main blurred album artwork */}
      <div 
        className={styles.albumBackground}
        style={{ 
          backgroundImage: `url(${cover || defaultCover})`
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className={styles.gradientOverlay} 
        style={{
          background: dominantColor
            ? `linear-gradient(145deg, rgba(${dominantColor}, 0.1) 0%, rgba(16, 16, 16, 0.85) 70%, rgba(10, 10, 10, 0.95) 100%)`
            : 'linear-gradient(145deg, rgba(45, 45, 45, 0.1) 0%, rgba(16, 16, 16, 0.85) 70%, rgba(10, 10, 10, 0.95) 100%)'
        }}
      />
      
      {/* Apple Music has a subtle noise texture */}
      <div className={styles.noiseTexture} />
    </div>
  );
};

export default memo(BackgroundLayer); 