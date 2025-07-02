import React, { useEffect, useState } from 'react';
import { useApiLoadingStatus } from '../hooks/useApi';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

const loadingAnimation = keyframes`
  0% {
    left: -20%;
  }
  50% {
    left: 40%;
  }
  100% {
    left: 100%;
  }
`;

const LoadingIndicatorContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '3px',
  zIndex: 9999,
  backgroundColor: 'rgba(199, 95, 255, 0.47)',
  overflow: 'hidden',
});

const LoadingSpinner = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  width: '20%',
  animation: `${loadingAnimation} 1.5s infinite ease-in-out`,
}));

/**
 * Глобальный индикатор загрузки, отображаемый при активных API-запросах
 */
const LoadingIndicator = () => {
  const { isLoading } = useApiLoadingStatus();
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

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
  
  if (!visible) return null;
  
  return (
    <LoadingIndicatorContainer>
      <LoadingSpinner theme={theme} />
    </LoadingIndicatorContainer>
  );
};

export default LoadingIndicator; 