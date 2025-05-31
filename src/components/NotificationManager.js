import React, { useState, useEffect } from 'react';
import DynamicIslandNotification from './DynamicIslandNotification';

/**
 * NotificationManager listens for global notification events and displays
 * them using the Dynamic Island style notifications
 */
const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Listen for auth error notifications
    const handleAuthError = (event) => {
      const { message, shortMessage, notificationType, animationType } = event.detail;
      addNotification({
        id: Date.now(),
        message,
        shortMessage,
        notificationType: notificationType || 'auth',
        animationType: animationType || 'pill',
      });
    };
    
    // Listen for rate limit error notifications
    const handleRateLimitError = (event) => {
      const { message, shortMessage, notificationType, animationType } = event.detail;
      addNotification({
        id: Date.now(),
        message,
        shortMessage,
        notificationType: notificationType || 'warning',
        animationType: animationType || 'bounce',
      });
    };
    
    // Listen for network error notifications
    const handleNetworkError = (event) => {
      const { message, shortMessage, notificationType, animationType } = event.detail;
      addNotification({
        id: Date.now(),
        message,
        shortMessage,
        notificationType: notificationType || 'error',
        animationType: animationType || 'drop',
      });
    };
    
    // Listen for API retry notifications
    const handleApiRetry = (event) => {
      const { message, shortMessage, notificationType, animationType, attempt } = event.detail;
      addNotification({
        id: Date.now(),
        message: message || `Повторное подключение (${attempt})`,
        shortMessage: shortMessage || `Попытка ${attempt}`,
        notificationType: notificationType || 'info',
        animationType: animationType || 'pulse',
      });
    };
    
    // Listen for generic error notifications
    const handleShowError = (event) => {
      const { message, shortMessage, notificationType, animationType } = event.detail;
      addNotification({
        id: Date.now(),
        message,
        shortMessage,
        notificationType: notificationType || 'error',
        animationType: animationType || 'pill',
      });
    };
    
    // Add event listeners
    window.addEventListener('auth-error', handleAuthError);
    window.addEventListener('rate-limit-error', handleRateLimitError);
    window.addEventListener('network-error', handleNetworkError);
    window.addEventListener('api-retry', handleApiRetry);
    window.addEventListener('show-error', handleShowError);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
      window.removeEventListener('rate-limit-error', handleRateLimitError);
      window.removeEventListener('network-error', handleNetworkError);
      window.removeEventListener('api-retry', handleApiRetry);
      window.removeEventListener('show-error', handleShowError);
    };
  }, []);
  
  // Add new notification to the queue
  const addNotification = (notification) => {
    // Only allow one notification at a time for Dynamic Island style
    setNotifications([notification]);
  };
  
  // Remove notification from queue
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // No need to render anything if there are no notifications
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <>
      {notifications.map(notification => (
        <DynamicIslandNotification
          key={notification.id}
          open={true}
          message={notification.message}
          shortMessage={notification.shortMessage}
          notificationType={notification.notificationType}
          animationType={notification.animationType}
          autoHideDuration={notification.autoHideDuration || 3000}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};

export default NotificationManager; 