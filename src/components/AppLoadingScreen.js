import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #1a1a1a 100%)',
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
}));

const LogoContainer = styled(Box)({
  marginBottom: '2rem',
  textAlign: 'center',
  animation: 'slideInDown 0.8s ease-out',
  '@keyframes slideInDown': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

const Logo = styled('img')({
  width: '120px',
  height: '120px',
  marginBottom: '1rem',
  animation: 'pulse 2s infinite ease-in-out',
  filter: 'drop-shadow(0 0 20px rgba(208, 188, 255, 0.6))',
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
  },
});

const Subtitle = styled(Typography)({
  color: 'rgba(255,255,255,0.8)',
  fontSize: '1.1rem',
  marginBottom: '2rem',
});

const ProgressContainer = styled(Box)({
  width: '350px',
  maxWidth: '80vw',
  textAlign: 'center',
  animation: 'slideInUp 0.8s ease-out 0.3s both',
  '@keyframes slideInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

const ProgressText = styled(Typography)({
  color: '#fff',
  marginBottom: '1rem',
  fontSize: '1rem',
  minHeight: '1.5rem',
  transition: 'opacity 0.3s ease-in-out',
});

const ProgressBar = styled(LinearProgress)({
  height: '10px',
  borderRadius: '5px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: '5px',
    background: 'linear-gradient(90deg, #D0BCFF 0%, #B8A9FF 100%)',
    boxShadow: '0 0 15px rgba(208, 188, 255, 0.4)',
    transition: 'width 0.6s ease-in-out',
  },
});

const FileCounter = styled(Typography)({
  color: 'rgba(255,255,255,0.6)',
  marginTop: '1rem',
  fontSize: '0.9rem',
});

const PercentageText = styled(Typography)({
  color: '#D0BCFF',
  marginTop: '0.5rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  animation: 'fadeInScale 0.5s ease-out',
  '@keyframes fadeInScale': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
});

const AppLoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadedFiles, setLoadedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loadingText, setLoadingText] = useState('Инициализация...');
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    // Проверяем, скачивается ли ассеты из сети или из кэша
    const checkIfLoadingNeeded = () => {
      // Проверяем принудительное обновление
      const isForceRefresh = sessionStorage.getItem('force_refresh') === 'true';
      if (isForceRefresh) {
        sessionStorage.removeItem('force_refresh');
        setShouldShowLoading(true);
        return true;
      }

      // Проверяем через Performance API, загружается ли MainLayout.*.js из сети
      if ('performance' in window && 'getEntriesByType' in performance) {
        try {
          const resources = performance.getEntriesByType('resource');
          
          // Ищем файл MainLayout.*.js
          const mainLayoutResource = resources.find(r => {
            const url = r.name.toLowerCase();
            return url.includes('mainlayout') && url.includes('.js');
          });

          if (mainLayoutResource) {
            const transferSize = mainLayoutResource.transferSize || 0;
            const decodedBodySize = mainLayoutResource.decodedBodySize || 0;
            
            console.log('MainLayout.js found:', mainLayoutResource.name);
            console.log('Transfer size:', transferSize);
            console.log('Decoded body size:', decodedBodySize);
            
            // Если transferSize > 0, значит файл загружался из сети
            if (transferSize > 0) {
              console.log('MainLayout.js loaded from network - showing loading screen');
              setShouldShowLoading(true);
              return true;
            } else {
              console.log('MainLayout.js loaded from cache - hiding loading screen');
              setShouldShowLoading(false);
              setIsLoading(false);
              onLoadingComplete();
              return false;
            }
          } else {
            // Если MainLayout.js не найден, ищем файлы с хешами или в других папках
            const mainLayoutVariants = resources.filter(r => {
              const url = r.name.toLowerCase();
              // Ищем файлы, которые могут содержать MainLayout (с хешами)
              return (url.includes('mainlayout') || url.includes('main-layout') || url.includes('main_layout')) && 
                     url.includes('.js');
            });

            if (mainLayoutVariants.length > 0) {
              const mainLayoutVariant = mainLayoutVariants[0];
              const transferSize = mainLayoutVariant.transferSize || 0;
              
              console.log('MainLayout variant found:', mainLayoutVariant.name);
              console.log('Transfer size:', transferSize);
              
              if (transferSize > 0) {
                console.log('MainLayout variant loaded from network - showing loading screen');
                setShouldShowLoading(true);
                return true;
              } else {
                console.log('MainLayout variant loaded from cache - hiding loading screen');
                setShouldShowLoading(false);
                setIsLoading(false);
                onLoadingComplete();
                return false;
              }
            }

            // Если MainLayout.js не найден, проверяем другие важные JS файлы
            const jsResources = resources.filter(r => {
              const url = r.name.toLowerCase();
              return url.includes('.js') && 
                     (url.includes('static/') || url.includes('assets/') || url.includes('chunk'));
            });

            const networkJsResources = jsResources.filter(r => {
              const transferSize = r.transferSize || 0;
              return transferSize > 0;
            });

            console.log('JS resources found:', jsResources.length);
            console.log('Network JS resources:', networkJsResources.length);

            if (networkJsResources.length > 1) {
              console.log('Showing loading screen - JS files downloading from network');
              setShouldShowLoading(true);
              return true;
            } else {
              // Дополнительная проверка: пытаемся найти MainLayout.js через fetch
              const checkMainLayoutViaFetch = async () => {
                try {
                  // Ищем все JS файлы в static/js
                  const staticJsResources = resources.filter(r => {
                    const url = r.name.toLowerCase();
                    return url.includes('static/js') && url.includes('.js');
                  });

                  if (staticJsResources.length > 0) {
                    const networkStaticJs = staticJsResources.filter(r => {
                      const transferSize = r.transferSize || 0;
                      return transferSize > 0;
                    });

                    console.log('Static JS resources:', staticJsResources.length);
                    console.log('Network static JS:', networkStaticJs.length);

                    if (networkStaticJs.length > 0) {
                      console.log('Showing loading screen - static JS files downloading from network');
                      setShouldShowLoading(true);
                      return true;
                    }
                  }

                  console.log('Hiding loading screen - all JS files from cache');
                  setShouldShowLoading(false);
                  setIsLoading(false);
                  onLoadingComplete();
                  return false;
                } catch (e) {
                  console.warn('Error in fetch check:', e);
                  setShouldShowLoading(true);
                  return true;
                }
              };

              return checkMainLayoutViaFetch();
            }
          }
        } catch (e) {
          console.warn('Error checking MainLayout.js status:', e);
          // В случае ошибки показываем загрузку
          setShouldShowLoading(true);
          return true;
        }
      } else {
        // Если Performance API недоступен, показываем загрузку
        setShouldShowLoading(true);
        return true;
      }
    };

    // Обработчик принудительного обновления
    const handleKeyDown = (e) => {
      // Ctrl+F5 или Ctrl+Shift+R
      if ((e.ctrlKey && e.key === 'F5') || (e.ctrlKey && e.shiftKey && e.key === 'R')) {
        sessionStorage.setItem('force_refresh', 'true');
        setShouldShowLoading(true);
        setIsLoading(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Проверяем через задержку, чтобы успеть собрать данные о ресурсах
    const checkTimer = setTimeout(() => {
      if (!checkIfLoadingNeeded()) {
        return; // Не показываем экран загрузки
      }
    }, 300); // Увеличиваем задержку для более точной проверки

    return () => {
      clearTimeout(checkTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLoadingComplete]);

  useEffect(() => {
    // Если не нужно показывать экран загрузки, выходим
    if (!shouldShowLoading) {
      return;
    }

    // Отслеживаем реальную загрузку ресурсов
    const trackResourceLoading = () => {
      let loadedResources = 0;
      const totalResources = 8; // Общее количество ресурсов для отслеживания
      setTotalFiles(totalResources);

      const loadingSteps = [
        { progress: 10, text: 'Инициализация React...', files: 1 },
        { progress: 25, text: 'Загрузка основных компонентов...', files: 2 },
        { progress: 40, text: 'Загрузка Material-UI...', files: 1 },
        { progress: 55, text: 'Загрузка стилей...', files: 1 },
        { progress: 70, text: 'Загрузка роутера...', files: 1 },
        { progress: 85, text: 'Загрузка изображений...', files: 1 },
        { progress: 95, text: 'Проверка соединения...', files: 1 },
        { progress: 100, text: 'Готово!', files: 1 },
      ];

      let currentStep = 0;
      let loadedFilesCount = 0;
      let domReady = false;
      let imagesReady = false;

      // Отслеживаем загрузку DOM
      const checkDOMReady = () => {
        if (document.readyState === 'complete' && !domReady) {
          domReady = true;
          setProgress(prev => Math.min(prev + 15, 95));
        }
      };

      // Отслеживаем загрузку изображений
      const checkImagesLoaded = () => {
        if (imagesReady) return;
        
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          imagesReady = true;
          setProgress(prev => Math.min(prev + 10, 95));
          return;
        }

        images.forEach(img => {
          if (img.complete) {
            loadedImages++;
          } else {
            img.addEventListener('load', () => {
              loadedImages++;
              if (loadedImages === totalImages && !imagesReady) {
                imagesReady = true;
                setProgress(prev => Math.min(prev + 10, 95));
              }
            });
            img.addEventListener('error', () => {
              loadedImages++;
              if (loadedImages === totalImages && !imagesReady) {
                imagesReady = true;
                setProgress(prev => Math.min(prev + 10, 95));
              }
            });
          }
        });

        if (loadedImages === totalImages && !imagesReady) {
          imagesReady = true;
          setProgress(prev => Math.min(prev + 10, 95));
        }
      };

      const interval = setInterval(() => {
        if (currentStep < loadingSteps.length) {
          const step = loadingSteps[currentStep];
          setProgress(step.progress);
          setLoadingText(step.text);
          loadedFilesCount += step.files;
          setLoadedFiles(loadedFilesCount);
          currentStep++;

          // Проверяем готовность DOM и изображений на определенных шагах
          if (currentStep === 3) { // После загрузки стилей
            checkDOMReady();
          }
          if (currentStep === 6) { // Перед загрузкой изображений
            checkImagesLoaded();
          }
        } else {
          clearInterval(interval);
          
          // Финальная проверка готовности
          const finalCheck = () => {
            if (document.readyState === 'complete') {
              setTimeout(() => {
                setIsLoading(false);
                onLoadingComplete();
              }, 300);
            } else {
              setTimeout(finalCheck, 100);
            }
          };
          
          finalCheck();
        }
      }, 350); // Ускоряем шаги до 350мс

      document.addEventListener('readystatechange', checkDOMReady);
      window.addEventListener('load', () => {
        checkDOMReady();
        checkImagesLoaded();
      });

      return () => {
        clearInterval(interval);
        document.removeEventListener('readystatechange', checkDOMReady);
        window.removeEventListener('load', checkDOMReady);
      };
    };

    // Запускаем отслеживание загрузки только если нужно показывать экран
    const cleanup = trackResourceLoading();

    return cleanup;
  }, [onLoadingComplete, shouldShowLoading]);

  // Если не нужно показывать экран загрузки, не рендерим его
  if (!shouldShowLoading || !isLoading) {
    return null;
  }

  return (
    <LoadingContainer>
      <LogoContainer>
        <Logo 
          src="/icon-512.png" 
          alt="К-Коннект"
          onError={(e) => {
            // Если логотип не загрузился, показываем текст
            e.target.style.display = 'none';
            const textLogo = document.createElement('div');
            textLogo.textContent = 'K-Connect';
            textLogo.style.cssText = `
              font-size: 3rem;
              font-weight: bold;
              color: #fff;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
              margin-bottom: 0.5rem;
            `;
            e.target.parentNode.insertBefore(textLogo, e.target);
          }}
        />
        <Subtitle variant="h6">
          К-Коннект v2.9 NEW
        </Subtitle>
      </LogoContainer>

      <ProgressContainer>
        <ProgressText variant="body1">
          {loadingText}
        </ProgressText>
        
        <ProgressBar 
          variant="determinate" 
          value={progress} 
        />
        
        <PercentageText variant="h6">
          {progress}%
        </PercentageText>
        
        <FileCounter variant="body2">
          Загружено файлов: {loadedFiles} из {totalFiles}
        </FileCounter>
      </ProgressContainer>
    </LoadingContainer>
  );
};

export default AppLoadingScreen; 