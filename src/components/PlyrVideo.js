import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const PlyrVideo = ({ src, poster }) => {
  const videoRef = useRef(null);
  const plyrInstance = useRef(null);

  useEffect(() => {
    if (videoRef.current && !plyrInstance.current) {
      // Инициализация Plyr с нужными настройками
      plyrInstance.current = new Plyr(videoRef.current, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        hideControls: false,
        fullscreen: { enabled: true, fallback: true, iosNative: true },
        autoplay: false,
        clickToPlay: true,
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
        disableContextMenu: false,
        invertTime: false,
        resetOnEnd: true,
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        i18n: {
          play: 'Воспроизвести',
          pause: 'Пауза',
          mute: 'Выключить звук',
          unmute: 'Включить звук',
          enterFullscreen: 'На весь экран',
          exitFullscreen: 'Выйти из полноэкранного режима',
          speed: 'Скорость',
          normal: 'Обычная'
        }
      });
      
      // Установка акцентного цвета
      const root = document.documentElement;
      root.style.setProperty('--plyr-color-main', '#8c54ff');
    }

    return () => {
      // Очистка при размонтировании компонента
      if (plyrInstance.current) {
        plyrInstance.current.destroy();
        plyrInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="plyr__video-wrapper" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <video 
        ref={videoRef}
        poster={poster}
        controls
        crossOrigin="anonymous"
        playsInline
        style={{ width: '100%', borderRadius: '8px' }}
      >
        <source src={src} type="video/mp4" />
        Ваш браузер не поддерживает HTML5 видео
      </video>
    </div>
  );
};

export default PlyrVideo; 