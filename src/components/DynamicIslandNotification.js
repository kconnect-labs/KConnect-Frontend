import React, { useState, useEffect } from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import LockIcon from '@mui/icons-material/Lock';

// Keyframes animations for different notification types
const pillExpand = keyframes`
  0% { width: 100px; border-radius: 50px; opacity: 0; transform: translateY(-20px) scale(0.8); }
  20% { opacity: 1; transform: translateY(0) scale(1); }
  80% { width: 300px; border-radius: 24px; }
  100% { width: 300px; border-radius: 24px; }
`;

const pillContract = keyframes`
  0% { width: 300px; border-radius: 24px; opacity: 1; }
  20% { width: 250px; border-radius: 30px; opacity: 0.9; }
  80% { width: 100px; border-radius: 50px; opacity: 0.3; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px) scale(0.8); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const dropAnimation = keyframes`
  0% { transform: translateY(-50px); opacity: 0; }
  50% { transform: translateY(10px); opacity: 1; }
  70% { transform: translateY(-5px); }
  100% { transform: translateY(0); opacity: 1; }
`;

// Styled components for the notification
const NotificationContainer = styled(Box)(({ theme, isVisible, animationType }) => {
  const animation = isVisible 
    ? `${pillExpand} 0.5s forwards`
    : `${pillContract} 0.5s forwards`;
  
  const pulseAnim = `${pulseAnimation} 2s infinite`;
  const bounceAnim = `${bounceAnimation} 2s infinite`;
  const dropAnim = `${dropAnimation} 0.5s forwards`;
  
  // Select the right animation based on type
  let additionalAnimation = '';
  if (animationType === 'pulse') additionalAnimation = pulseAnim;
  if (animationType === 'bounce') additionalAnimation = bounceAnim;
  if (animationType === 'drop') additionalAnimation = dropAnim;
  
  return {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(20, 20, 22, 0.95)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
    animation: animation,
    overflow: 'hidden',
    width: '300px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '& .animation-wrapper': {
      animation: additionalAnimation
    }
  };
});

const IconContainer = styled(Box)(({ theme, notificationType }) => {
  // Colors based on notification type
  const colors = {
    success: '#4caf50',
    error: '#ff5252',
    warning: '#fb8c00',
    info: '#2196f3',
  };
  
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    color: colors[notificationType] || colors.info,
  };
});

const MessageContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Dynamic Island style notification component
 */
const DynamicIslandNotification = ({ 
  open = false,
  message = "",
  shortMessage = "",
  notificationType = "info", // success, error, warning, info
  animationType = "pill", // pill, pulse, bounce, drop
  autoHideDuration = 3000,
  onClose = () => {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle visibility with animation timing
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        
        // Additional delay to allow exit animation to complete
        setTimeout(() => {
          onClose();
        }, 500);
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);
  
  // Select the right icon based on notification type
  const getIcon = () => {
    switch (notificationType) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return notificationType === 'network' ? <WifiOffIcon /> : <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'auth':
        return <LockIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };
  
  // Bail out if not open
  if (!open && !isVisible) return null;
  
  return (
    <NotificationContainer isVisible={isVisible} animationType={animationType}>
      <div className="animation-wrapper" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <IconContainer notificationType={notificationType}>
          {getIcon()}
        </IconContainer>
        
        {isVisible && (
          <MessageContainer>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {shortMessage || message}
            </Typography>
            {shortMessage && message && shortMessage !== message && (
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {message}
              </Typography>
            )}
          </MessageContainer>
        )}
      </div>
    </NotificationContainer>
  );
};

export default DynamicIslandNotification; 