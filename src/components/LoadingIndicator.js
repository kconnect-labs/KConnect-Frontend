import React, { useEffect, useState } from 'react';
import { useApiLoadingStatus } from '../hooks/useApi';

/**
 * Глобальный индикатор загрузки, отображаемый при активных API-запросах
 */
const LoadingIndicator = () => {
  const { isLoading, activeRequests } = useApiLoadingStatus();
  const [visible, setVisible] = useState(false);
  
  // Добавляем небольшую задержку перед отображением индикатора
  // чтобы не мерцать при быстрых запросах
  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setVisible(true);
      }, 300); // 300мс задержки
    } else {
      setVisible(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);
  
  // Если нет активных запросов, не отображаем индикатор
  if (!visible) return null;
  
  return (
    <div className="global-loading-indicator">
      <div className="loading-spinner"></div>
      <style jsx>{`
        .global-loading-indicator {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          z-index: 9999;
          background-color: rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .loading-spinner {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(to right, #2196F3, #4CAF50, #FFC107);
          width: 20%;
          animation: loadingAnimation 1.5s infinite ease-in-out;
        }
        
        @keyframes loadingAnimation {
          0% {
            left: -20%;
          }
          50% {
            left: 40%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator; 