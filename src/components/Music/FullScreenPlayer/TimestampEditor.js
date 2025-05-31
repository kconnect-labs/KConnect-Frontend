import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import styles from './TimestampEditor.module.scss';

const TimestampEditor = ({ 
  lyricsData, 
  currentTrack, 
  onCancel, 
  dominantColor, 
  onShowLyrics,
  onShowSnackbar 
}) => {
  
  const getActiveColor = () => {
    if (dominantColor) {
      return `rgb(${dominantColor})`;
    }
    return '#d0bcff';
  };
  
  const getButtonBackgroundColor = () => {
    if (dominantColor) {
      return `rgba(${dominantColor}, 0.15)`;
    }
    return 'rgba(255, 45, 85, 0.15)';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography className={styles.title}>
          Редактор таймкодов
        </Typography>
        <Typography className={styles.subtitle}>
          Создание синхронизированного текста для {currentTrack?.title}
        </Typography>
      </div>
      
      <Box className={styles.content}>
        <Typography className={styles.message}>
          Эта функция будет доступна в ближайшее время!
        </Typography>
        
        <Typography className={styles.description}>
          Синхронизированный текст позволяет подсвечивать строки в такт с музыкой,
          создавая эффект погружения как в Apple Music.
        </Typography>
      </Box>
      
      <div className={styles.actions}>
        <Button
          onClick={onCancel}
          startIcon={<ArrowBack />}
          className={styles.backButton}
          style={{
            color: getActiveColor(),
            borderColor: getButtonBackgroundColor(),
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          Вернуться к редактору текста
        </Button>
      </div>
    </div>
  );
};

export default TimestampEditor; 