import React from 'react';
import styles from './BackgroundLayer.module.scss';

const BackgroundLayer = ({ cover, dominantColor }) => {
  const backgroundColor = dominantColor 
    ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`
    : 'rgb(25, 20, 20)';
  
  const gradientOverlay = `linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.7) 100%
  )`;
  
  return (
    <div className={styles.container}>
      {/* Primary background color based on album art */}
      <div 
        className={styles.baseBackground}
        style={{ backgroundColor }}
      />
      
      {/* Image layer - blurred album art */}
      {cover && (
        <div className={styles.imageContainer}>
          <div 
            className={styles.imageLayer}
            style={{ 
              backgroundImage: `url(${cover})`,
            }}
          />
      <div 
            className={styles.imageOverlay}
        style={{
              backgroundImage: gradientOverlay 
        }}
      />
        </div>
      )}
      
      {/* Glass effect overlay */}
      <div className={styles.glassOverlay} />
    </div>
  );
};

export default BackgroundLayer; 