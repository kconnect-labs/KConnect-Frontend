import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { CircularProgress, Typography, Button, useMediaQuery, useTheme, Box } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import { useMusic } from '../../../context/MusicContext';
import styles from './LyricsView.module.scss';


const SyncedLyricsUpdater = memo(({ lyricsData, getCurrentTimeRaw, onUpdateLyric }) => {
  const animationFrameRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const currentLyricIndexRef = useRef(-1);

  useEffect(() => {
    if (!lyricsData?.has_synced_lyrics || !lyricsData?.synced_lyrics || !Array.isArray(lyricsData.synced_lyrics)) {
      return;
    }

    const updateCurrentLyric = () => {
      try {
        const syncedLyrics = lyricsData.synced_lyrics;

        const rawCurrentTime = getCurrentTimeRaw();
        const currentTimeMs = rawCurrentTime * 1000;
        

        const timeWithOffset = currentTimeMs + 800;
        

        const sortedLyrics = [...syncedLyrics]
          .filter(line => line?.startTimeMs !== undefined && line?.text !== undefined)
          .sort((a, b) => a.startTimeMs - b.startTimeMs);

        if (sortedLyrics.length === 0) {
          animationFrameRef.current = requestAnimationFrame(updateCurrentLyric);
          return;
        }


        let activeIndex = -1;
        

        let start = 0;
        let end = sortedLyrics.length - 1;
        
        while (start <= end) {
          const mid = Math.floor((start + end) / 2);
          
          if (sortedLyrics[mid].startTimeMs <= timeWithOffset) {

            activeIndex = mid;
            start = mid + 1;
          } else {
            end = mid - 1;
          }
        }


        if (activeIndex === -1 && sortedLyrics.length > 0) {
          if (sortedLyrics[0].startTimeMs > timeWithOffset) {
            activeIndex = -1;
          } else {
            activeIndex = 0;
          }
        }


        if (activeIndex !== -1) {
          const activeLyric = sortedLyrics[activeIndex];
          const originalIndex = syncedLyrics.findIndex(
            l => l.lineId === activeLyric.lineId || 
                (l.text === activeLyric.text && l.startTimeMs === activeLyric.startTimeMs)
          );
          

          if (originalIndex !== -1 && originalIndex !== currentLyricIndexRef.current) {
            const prevIndex = currentLyricIndexRef.current;
            currentLyricIndexRef.current = originalIndex;
            

            onUpdateLyric(originalIndex, prevIndex);
          }
        }

        animationFrameRef.current = requestAnimationFrame(updateCurrentLyric);
      } catch (error) {
        console.error("Error updating current lyric:", error);
        animationFrameRef.current = requestAnimationFrame(updateCurrentLyric);
      }
    };
    

    animationFrameRef.current = requestAnimationFrame(updateCurrentLyric);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [lyricsData, getCurrentTimeRaw, onUpdateLyric]);

  return null;
});

const LyricsView = ({ 
  lyricsData, 
  loading, 
  currentTrack, 
  dominantColor,
  onOpenEditor,
  onOpenTimestampEditor
}) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [previousLyricIndex, setPreviousLyricIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lyricsContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery('(min-width:960px)');
  const isLargeScreen = useMediaQuery('(min-width:1200px)');
  

  const { getCurrentTimeRaw } = useMusic();
  

  const numUpcomingLines = isLargeScreen ? 6 : (isDesktop ? 4 : 3);
  const prevIndex = previousLyricIndex;


  const handleLyricUpdate = useCallback((newIndex, prevIndex) => {
    setPreviousLyricIndex(prevIndex);
    setCurrentLyricIndex(newIndex);
    setIsTransitioning(true);
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  }, []);


  const getValidLyrics = useCallback(() => {
    if (!lyricsData?.synced_lyrics || !Array.isArray(lyricsData.synced_lyrics)) {
      return [];
    }
    return lyricsData.synced_lyrics.filter(line => line && line.text?.trim());
  }, [lyricsData]);


  const getActiveColor = () => {

    return '#ffffff';
  };
  
  const getButtonStyles = () => {
    if (dominantColor) {
      return {
        backgroundColor: `rgba(${dominantColor}, 0.2)`,
        color: `rgb(${dominantColor})`,
        '&:hover': {
          backgroundColor: `rgba(${dominantColor}, 0.3)`,
        }
      };
    }
    return {};
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress 
          size={36} 
          thickness={4}
          style={{color: getActiveColor()}}
        />
        <Typography className={styles.loadingText}>
          Загрузка текста песни...
        </Typography>
      </div>
    );
  }

  if (!lyricsData) {
    return (
      <div className={styles.emptyContainer}>
        <Typography className={styles.emptyText}>
          Нет текста песни для этого трека
        </Typography>
        <Button
          className={styles.addLyricsButton}
          onClick={onOpenEditor}
        >
          Добавить текст
        </Button>
      </div>
    );
  }


  if (lyricsData.has_synced_lyrics && lyricsData.synced_lyrics && Array.isArray(lyricsData.synced_lyrics)) {

    const validLyrics = getValidLyrics();
    
    if (validLyrics.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          <Typography className={styles.emptyText}>
            Синхронизированный текст не содержит строк
          </Typography>
          <Button
            className={styles.addLyricsButton}
            onClick={onOpenEditor}
          >
            Редактировать текст
          </Button>
        </div>
      );
    }
    

    let currentIndex = -1;
    if (currentLyricIndex >= 0) {
      const currentLineId = lyricsData.synced_lyrics[currentLyricIndex]?.lineId;
      currentIndex = validLyrics.findIndex(line => line.lineId === currentLineId);
    }
    

    if (currentIndex === -1) {
      currentIndex = 0;
    }



    const visibleBefore = 2;
    const visibleAfter = 6;
    const startIdx = Math.max(0, currentIndex - visibleBefore);
    const endIdx = Math.min(validLyrics.length, currentIndex + visibleAfter + 1);
    

    const getMaxFontSize = (text, isMain) => {

      const baseSize = isMain 
        ? (isLargeScreen ? 3.2 : (isDesktop ? 2.8 : 2.2)) 
        : (isLargeScreen ? 2.0 : (isDesktop ? 1.8 : 1.4));
      
      if (!text) return `${baseSize}rem`;
      
      const length = text.length;
      

      if (length > 60) return `${baseSize * 0.65}rem`;
      if (length > 50) return `${baseSize * 0.7}rem`;
      if (length > 40) return `${baseSize * 0.75}rem`;
      if (length > 30) return `${baseSize * 0.8}rem`;
      
      return `${baseSize}rem`;
    };


    const getShouldWrapText = (text) => {
      if (!text) return false;
      return text.length > 40;
    };


    const formatLyricText = (text) => {
      if (!text) return '';
      

      if (text.length <= 40) return text;
      

      

      const commaIndex = text.indexOf(',');
      const midPoint = Math.floor(text.length / 2);
      


      if (commaIndex > 0 && commaIndex >= text.length * 0.3 && commaIndex <= text.length * 0.7) {

        const firstPart = text.substring(0, commaIndex + 1);
        const secondPart = text.substring(commaIndex + 1).trim();
        
        return (
          <>
            {firstPart}<br />{secondPart}
          </>
        );
      }
      


      let spaceBeforeMid = text.lastIndexOf(' ', midPoint);

      let spaceAfterMid = text.indexOf(' ', midPoint);
      

      let breakIndex;
      if (spaceBeforeMid === -1 && spaceAfterMid === -1) {

        return text;
      } else if (spaceBeforeMid === -1) {
        breakIndex = spaceAfterMid;
      } else if (spaceAfterMid === -1) {
        breakIndex = spaceBeforeMid;
      } else {

        breakIndex = (midPoint - spaceBeforeMid < spaceAfterMid - midPoint) ? 
                      spaceBeforeMid : spaceAfterMid;
      }
      

      const firstPart = text.substring(0, breakIndex);
      const secondPart = text.substring(breakIndex).trim();
      
      return (
        <>
          {firstPart}<br />{secondPart}
        </>
      );
    };

    return (
      <Box 
        className={styles.lyricsFlow}
        sx={{
          position: 'relative',
          height: '100%',
          padding: '100px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Invisible component that handles lyrics timing updates */}
        <SyncedLyricsUpdater 
          lyricsData={lyricsData} 
          getCurrentTimeRaw={getCurrentTimeRaw}
          onUpdateLyric={handleLyricUpdate}
        />
        
        {/* Контейнер с ограниченной шириной и выравниванием по правому краю */}
        <Box
          sx={{
            width: '100%',
            maxWidth: isLargeScreen ? '100%' : (isDesktop ? '100%' : '100%'),
            marginLeft: 'auto',
            marginRight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Отображаем только необходимые строки */}
          {validLyrics.slice(startIdx, endIdx).map((line, idx) => {

            const actualIndex = startIdx + idx;
            const relPosition = actualIndex - currentIndex;
            

            let className = styles.flowLine;
            if (relPosition === 0) className += ` ${styles.currentFlowLine}`;
            else if (relPosition < 0) className += ` ${styles.previousFlowLine}`;
            else className += ` ${styles.upcomingFlowLine}`;
            


            const offsetY = relPosition === 0 ? 0 : 
                            relPosition > 0 ? 35 + (relPosition - 1) * 40 :
                                            -35 * Math.abs(relPosition);
            

            const isMainLine = relPosition === 0;
            const dynamicFontSize = getMaxFontSize(line.text, isMainLine);
            
            const opacity = relPosition === 0
              ? 1
              : Math.max(0.3, 0.95 - Math.abs(relPosition) * 0.15);
            

            const needsWrapping = getShouldWrapText(line.text);
            
            return (
              <div 
                key={`line-${line.lineId || actualIndex}`}
                className={className}
                style={{
                  transform: `translateY(${offsetY}px)`,
                  opacity,
                  transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)', 
                  marginBottom: relPosition === 0 ? '20px' : '10px', 
                  width: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'visible',
                  maxWidth: '100%'
                }}
              >
                <Typography 
                  variant={relPosition === 0 ? "h2" : "h3"}
                  component="div"
                  sx={{
                    fontSize: dynamicFontSize,
                    fontWeight: relPosition === 0 ? 700 : (relPosition === 1 ? 600 : 500),
                    color: relPosition === 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                    whiteSpace: needsWrapping ? 'normal' : 'nowrap',
                    wordWrap: 'break-word',
                    wordBreak: 'keep-all',
                    textAlign: 'center',
                    width: '100%',
                    lineHeight: 1.2,
                    textShadow: relPosition === 0 ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
                    transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',

                    display: needsWrapping ? '-webkit-box' : null,
                    WebkitLineClamp: needsWrapping ? 2 : null,
                    WebkitBoxOrient: needsWrapping ? 'vertical' : null,
                    overflow: needsWrapping ? 'hidden' : null,
                    padding: '0 10px'
                  }}
                >
                  {needsWrapping ? formatLyricText(line.text) : line.text}
                </Typography>
              </div>
            );
          })}
        </Box>
      </Box>
    );
  }


  return (
    <Box 
      className={styles.lyricsContainer} 
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        pointerEvents: 'auto'
      }}
    >
      <Box
        sx={{
          maxWidth: isLargeScreen ? '70%' : (isDesktop ? '80%' : '90%'),
          padding: isLargeScreen ? '0 40px 0 0' : '0 10px',
          textAlign: 'center'
        }}
      >
        {/* Show a message if no lyrics are available */}
        {!lyricsData.has_synced_lyrics && (
          <Typography 
            variant="h5" 
            className={styles.noLyrics}
            style={{
              pointerEvents: 'auto'
            }}
          >
            {currentTrack?.lyrics ? 'Текст песни доступен' : 'Нет синхронизированного текста'}
          </Typography>
        )}

        {/* Display synced lyrics */}
        {lyricsData.has_synced_lyrics && lyricsData.synced_lyrics && Array.isArray(lyricsData.synced_lyrics) && (
          <>
            {/* Current line */}
            <Typography 
              className={styles.currentLine}
              style={{
                color: getActiveColor(),
                textAlign: 'center'
              }}
            >
              {validLyrics[currentIndex]?.text ? 
                (getShouldWrapText(validLyrics[currentIndex].text) ? 
                  formatLyricText(validLyrics[currentIndex].text) : 
                  validLyrics[currentIndex].text) : 
                ''}
            </Typography>

            {/* Upcoming lines */}
            <Box className={styles.upcomingLines}>
              {Array.from({ length: numUpcomingLines }).map((_, i) => {
                const lineIndex = currentIndex + i + 1;
                if (lineIndex < validLyrics.length) {

                  const isNextUp = i === 0;
                  const wasActive = prevIndex === lineIndex;
                  const isEntering = isTransitioning && !wasActive;
                  

                  const opacityReduction = 0.15 * i;
                  const opacity = 0.9 - opacityReduction;
                  

                  const text = validLyrics[lineIndex]?.text || '';
                  const needsWrapping = getShouldWrapText(text);
                  
                  return (
                    <Typography 
                      key={`next-${i}`} 
                      className={styles.upcomingLine}
                      sx={{
                        opacity: Math.max(0.3, opacity),
                        transform: `translateY(${i * 8}px) scale(${1 - i * 0.05})`,
                        textAlign: 'center',
                        padding: '0 10px'
                      }}
                    >
                      {needsWrapping ? formatLyricText(text) : text}
                    </Typography>
                  );
                }
                return null;
              })}
            </Box>
          </>
        )}

        {/* Static lyrics, shown when no synced lyrics available */}
        {lyricsData.lyrics && !lyricsData.has_synced_lyrics && (
          <Box className={styles.staticLyrics} style={{ pointerEvents: 'auto', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              {lyricsData.lyrics.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default memo(LyricsView); 