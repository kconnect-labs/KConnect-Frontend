import React, { memo, useState } from 'react';
import { useMusic } from '../../../context/MusicContext';
import styles from './NowPlaying.module.scss';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const NowPlaying = ({ track, dominantColor }) => {
  const { isPlaying } = useMusic();
  const defaultCover = '/static/uploads/system/album_placeholder.jpg';
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width:960px)');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const goToArtist = async (artistName) => {
    if (!artistName || artistName.trim() === '') return;
    artistName = artistName.trim();
    
    try {
      const response = await axios.get(`/api/search/artists?query=${encodeURIComponent(artistName)}`);
      
      if (response.data && response.data.artists && response.data.artists.length > 0) {
        const exactMatch = response.data.artists.find(
          a => a.name.toLowerCase() === artistName.toLowerCase()
        );

        if (exactMatch) {
          navigate(`/artist/${exactMatch.id}`);
          return;
        }

        navigate(`/artist/${response.data.artists[0].id}`);
      } else {
        setNotification({
          open: true,
          message: `Артист "${artistName}" не найден`,
          severity: 'warning'
        });
      }
    } catch (error) {
      console.error('Ошибка при поиске артиста:', error);
      setNotification({
        open: true,
        message: 'Ошибка при поиске артиста',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const renderArtists = () => {
    if (!track.artist) return <span className={styles.artistName}>Unknown Artist</span>;
    
    const artists = track.artist.split(',');
    
    return (
      <Box className={styles.artistsContainer}>
        {artists.map((artist, index) => (
          <React.Fragment key={index}>
            <span 
              className={`${styles.artistName} ${styles.clickable}`} 
              onClick={() => goToArtist(artist)}
              title={`View artist: ${artist.trim()}`}
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: dominantColor ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})` : 'white'
                }
              }}
            >
              {artist.trim()}
            </span>
            {index < artists.length - 1 && <span className={styles.artistSeparator}>, </span>}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  return (
    <>
      <div className={`${styles.container} ${isDesktop ? styles.desktopContainer : ''}`}>
        <div 
          className={`${styles.coverArtContainer} ${isPlaying ? styles.playing : ''}`}
          style={{
            boxShadow: dominantColor ? 
              `0 10px 30px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.3), 0 30px 60px rgba(0,0,0,0.4)` : 
              '0 10px 30px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.4)'
          }}
        >
          <img 
            src={track.cover_path || defaultCover}
            alt={track.title}
            className={styles.coverArt}
          />
        </div>
        
        <div className={`${styles.trackInfo} ${isDesktop ? styles.desktopTrackInfo : ''}`}>
          <Typography 
            variant="h1" 
            className={styles.trackTitle}
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {track.title}
          </Typography>
          
          <div className={styles.trackDetails}>
            {renderArtists()}
            {track.album && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.albumName}>{track.album}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default memo(NowPlaying); 