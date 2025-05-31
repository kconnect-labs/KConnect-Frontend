import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Box, Typography, Button, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import { useMusic } from '../../../context/MusicContext';
import { styled } from '@mui/system';
import { Lrc, useRecoverAutoScrollImmediately } from 'react-lrc';
import styles from './LyricsView.module.scss';

const LyricsContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
}));

const LyricsView = ({ 
  lyricsData, 
  loading, 
  currentTrack,
  dominantColor,
  onOpenEditor,
  onOpenTimestampEditor
}) => {
  const { getCurrentTimeRaw } = useMusic();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1200px)');
  const { signal, recoverAutoScrollImmediately } = useRecoverAutoScrollImmediately();
  const lyricsContainerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate viewport height when component mounts or resizes
  useEffect(() => {
    const updateHeight = () => {
      if (lyricsContainerRef.current) {
        setContainerHeight(lyricsContainerRef.current.clientHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Calculate highlight color from dominantColor with increased brightness
  const highlightColor = dominantColor 
    ? `rgba(${Math.min(255, dominantColor.r + 50)}, ${Math.min(255, dominantColor.g + 50)}, ${Math.min(255, dominantColor.b + 50)}, 1)`
    : '#ffffff';

  if (loading) {
    return (
      <Box 
        className={styles.lyricsTransitionContainer}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress 
          size={46} 
          thickness={4} 
          sx={{ 
            color: highlightColor,
            boxShadow: '0 0 20px rgba(0,0,0,0.2)'
          }} 
        />
      </Box>
    );
  }

  if (!lyricsData) {
    return (
      <Box 
        className={styles.lyricsTransitionContainer}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '0 20px',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            mb: 3,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
            fontWeight: 600,
            fontSize: '1.3rem',
            letterSpacing: '-0.01em'
          }}
        >
          Нет текста песни для этого трека
        </Typography>
        <Button 
          variant="outlined" 
          className={styles.addLyricsButton}
          onClick={onOpenEditor}
          sx={{
            color: '#fff',
            '&:hover': {
              borderColor: highlightColor,
            }
          }}
        >
          Добавить текст
        </Button>
      </Box>
    );
  }

  if (lyricsData.has_synced_lyrics && lyricsData.synced_lyrics && Array.isArray(lyricsData.synced_lyrics)) {
    const validLyrics = lyricsData.synced_lyrics.filter(line => 
      line && line.text?.trim() && line.startTimeMs !== undefined
    );

    if (validLyrics.length === 0) {
      return (
        <Box 
          className={styles.lyricsTransitionContainer}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '0 20px',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              mb: 3,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              fontWeight: 600,
              fontSize: '1.3rem',
              letterSpacing: '-0.01em'
            }}
          >
            Синхронизированный текст не содержит строк
          </Typography>
          <Button 
            variant="outlined" 
            className={styles.addLyricsButton}
            onClick={onOpenEditor}
            sx={{
              color: '#fff',
              '&:hover': {
                borderColor: highlightColor,
              }
            }}
          >
            Редактировать текст
          </Button>
        </Box>
      );
    }

    // Modified lrcContent format to include unique identifiers for each line
    const { lrcContent, linesMap } = generateLrcContentWithIds(validLyrics);

    // Calculate vertical space needed for centering
    const verticalSpace = containerHeight ? Math.floor(containerHeight / 2) : 300;

    const lineRenderer = ({ index, active, line }) => {
      // Extract the unique ID from the line content if it exists
      const lineIdMatch = line.content.match(/\[id:(\d+)\](.*)/);
      const lineId = lineIdMatch ? parseInt(lineIdMatch[1]) : null;
      const actualContent = lineIdMatch ? lineIdMatch[2] : line.content;
      
      // Get current time in milliseconds
      const currentTimeMs = getCurrentTimeRaw() * 1000;
      
      // Find the active line based on the current time
      let activeLineIndex = -1;
      let activeLineId = null;
      
      // Find the active line by checking the timestamps
      for (const [id, lineData] of Object.entries(linesMap)) {
        if (lineData.startTimeMs <= currentTimeMs) {
          activeLineId = parseInt(id);
          activeLineIndex = lineData.index;
        }
      }
      
      // If this is the active line based on ID
      const isActiveLine = lineId === activeLineId;
      
      // Override the active prop from react-lrc with our custom active state
      const isActive = isActiveLine;
      
      // Calculate distance from active line (for visual effects)
      let distance = 0;
      if (lineId !== null && activeLineId !== null) {
        const thisIndex = linesMap[lineId]?.index || index;
        const activeIndex = linesMap[activeLineId]?.index || activeLineIndex;
        distance = Math.abs(thisIndex - activeIndex);
      } else {
        // Fallback to index-based calculation if IDs aren't available
        distance = Math.abs(index - activeLineIndex);
      }
      
      // Apply smoother visual effects based on distance
      const blurAmount = Math.min(4, distance * 0.8);
      const opacity = Math.max(0.4, 1 - distance * 0.12);
      
      // Adjusted scale calculation for smoother transitions
      const baseScale = isActive ? 1 : 0.94;
      const scaleAdjust = isActive ? 0 : (Math.min(0.06, distance * 0.012));
      const scale = baseScale - scaleAdjust;
      
      // Common transition settings for consistency
      const transitionCurve = 'cubic-bezier(0.19, 1, 0.22, 1)';
      const transitionDuration = '1.2s';

      return (
        <Typography
          variant={isActive ? "h4" : "h5"}
          className={`${styles.lrcLine} ${isActive ? styles.active : ''}`}
          sx={{
            fontSize: isActive 
              ? (isLargeScreen ? '2rem' : '1.8rem') 
              : (isLargeScreen ? '1.4rem' : '1.3rem'),
            fontWeight: isActive ? 700 : 500,
            color: isActive ? highlightColor : '#ffffff',
            opacity: opacity,
            transition: `all ${transitionDuration} ${transitionCurve}`,
            textAlign: 'left',
            letterSpacing: isActive ? '-0.02em' : '-0.01em',
            lineHeight: 1.3,
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${scale})`,
            transformOrigin: 'left center',
            whiteSpace: 'pre-line',
            padding: '8px 0',
            textShadow: isActive ? `0 2px 10px rgba(${dominantColor?.r || 0}, ${dominantColor?.g || 0}, ${dominantColor?.b || 0}, 0.3)` : 'none'
          }}
        >
          {actualContent}
        </Typography>
      );
    };

    const lrcStyle = {
      height: '100%',
      width: '100%',
      overflow: 'auto',
      padding: 0,
      paddingLeft: '10px',
      textAlign: 'left',
      '::-webkit-scrollbar': { width: 0 },
      scrollbarWidth: 'none',
      willChange: 'transform',
      scrollBehavior: 'smooth',
      '--vertical-space': `${verticalSpace}px`,
    };

    return (
      <LyricsContainer 
        className={styles.lyricsTransitionContainer}
        ref={lyricsContainerRef}
      >
        <Lrc
          lrc={lrcContent}
          lineRenderer={lineRenderer}
          currentMillisecond={(getCurrentTimeRaw() * 1000)}
          recoverAutoScrollInterval={3000}
          recoverAutoScrollSingal={signal}
          verticalSpace={verticalSpace}
          style={lrcStyle}
          className={styles.lrcContainer}
        />
      </LyricsContainer>
    );
  }

  // Fallback to regular lyrics if no synchronized lyrics
  return (
    <Box 
      className={styles.lyricsTransitionContainer}
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '20px 30px',
        overflowY: 'auto',
        '::-webkit-scrollbar': { width: 0 },
        scrollbarWidth: 'none',
      }}
    >
      {!lyricsData.has_synced_lyrics && (
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            textAlign: 'left', 
            mb: 2,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
            fontWeight: 700,
            fontSize: '1.6rem',
            letterSpacing: '-0.02em',
          }}
        >
          {currentTrack?.lyrics ? 'Текст песни' : 'Нет синхронизированного текста'}
        </Typography>
      )}

      {lyricsData.lyrics && !lyricsData.has_synced_lyrics && (
        <Box sx={{ width: '100%', maxWidth: '95%' }}>
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-line',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'left',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              fontWeight: 500
            }}
          >
            {lyricsData.lyrics}
          </Typography>
        </Box>
      )}
      
      {(!lyricsData.lyrics && !lyricsData.has_synced_lyrics) && (
        <Box sx={{ textAlign: 'center', width: '100%', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onOpenEditor}
            className={styles.addLyricsButton}
            sx={{
              mt: 2,
              color: '#fff',
              '&:hover': {
                borderColor: highlightColor,
              }
            }}
          >
            Добавить текст
          </Button>
        </Box>
      )}

      {lyricsData.lyrics && !lyricsData.has_synced_lyrics && (
        <Box sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={onOpenTimestampEditor}
              startIcon={<Schedule />}
              className={styles.syncButton}
              sx={{ 
                color: '#fff',
                '&:hover': {
                borderColor: highlightColor,
                }
              }}
            >
            Добавить синхронизацию
            </Button>
        </Box>
      )}
    </Box>
  );
};

// Helper function to generate LRC content with unique IDs for each line
const generateLrcContentWithIds = (syncedLyrics) => {
  let lrcContent = '';
  const linesMap = {};
  
  // Sort by start time
  const sortedLyrics = [...syncedLyrics].sort((a, b) => a.startTimeMs - b.startTimeMs);

  sortedLyrics.forEach((line, index) => {
    if (line.startTimeMs !== undefined && line.text) {
      const timeMs = line.startTimeMs;
      const minutes = Math.floor(timeMs / 60000);
      const seconds = Math.floor((timeMs % 60000) / 1000);
      const ms = Math.floor((timeMs % 1000) / 10);

      // Create unique ID for this line
      const lineId = index;
      
      // Format timestamp
      const formattedTime = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}]`;

      // Add line to content with unique ID embedded
      lrcContent += `${formattedTime}[id:${lineId}]${line.text}\n`;
      
      // Store line info in map for quick lookup
      linesMap[lineId] = {
        startTimeMs: line.startTimeMs,
        text: line.text,
        index: index
      };
    }
  });

  return { lrcContent, linesMap };
};

export default memo(LyricsView);