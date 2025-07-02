import React, { Component } from 'react';
import DynamicIslandNotification from './DynamicIslandNotification';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      notifications: []
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error in component:', error, errorInfo);
    this.setState({ errorInfo });
  }

  componentDidMount() {
    // Listen for error events from API
    window.addEventListener('auth-error', this.handleAuthError);
    window.addEventListener('network-error', this.handleNetworkError);
    window.addEventListener('rate-limit-error', this.handleRateLimitError);
    window.addEventListener('show-error', this.handleShowError);
    window.addEventListener('api-retry', this.handleApiRetry);
  }

  componentWillUnmount() {
    // Remove event listeners on unmount
    window.removeEventListener('auth-error', this.handleAuthError);
    window.removeEventListener('network-error', this.handleNetworkError);
    window.removeEventListener('rate-limit-error', this.handleRateLimitError);
    window.removeEventListener('show-error', this.handleShowError);
    window.removeEventListener('api-retry', this.handleApiRetry);
  }

  // Handle auth error event
  handleAuthError = (event) => {
    const { message, shortMessage = "Session expired", notificationType = "auth", animationType = "pill" } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'error',
      message: message || "Session expired, please log in again",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      action: 'redirect',
      actionLabel: 'Login',
      actionUrl: '/login'
    });
  }

  // Handle network error event
  handleNetworkError = (event) => {
    const { message, shortMessage = "No network", notificationType = "error", animationType = "drop" } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'warning',
      message: message || "Problem connecting to server",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      action: 'retry',
      actionLabel: 'Retry'
    });
  }

  // Handle rate limit error event
  handleRateLimitError = (event) => {
    const { message, shortMessage = "Please wait", notificationType = "warning", animationType = "bounce", retryAfter } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'info',
      message: message || "Too many requests, please wait",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      autoHide: true,
      hideAfter: 5000
    });
  }

  // Handle show error event
  handleShowError = (event) => {
    const { message, shortMessage = "Error", notificationType = "error", animationType = "pill" } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'error',
      message: message || "An error occurred",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      autoHide: true,
      hideAfter: 5000
    });
  }

  // Handle API retry event
  handleApiRetry = (event) => {
    const { url, attempt, delay, message, shortMessage = `Attempt ${attempt || 1}`, notificationType = "info", animationType = "pulse" } = event.detail;
    
    // Show dynamic notification for retry attempt
    this.addNotification({
      id: Date.now(),
      type: 'info',
      message: message || `Retry attempt ${attempt || 1}`,
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      autoHide: true,
      hideAfter: 3000
    });
  }

  // Add notification to list
  addNotification = (notification) => {
    this.setState(prevState => ({
      notifications: [...prevState.notifications, notification]
    }));

    // If notification should auto-hide
    if (notification.autoHide) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.hideAfter || 5000);
    }
  }

  // Remove notification from list
  removeNotification = (id) => {
    this.setState(prevState => ({
      notifications: prevState.notifications.filter(n => n.id !== id)
    }));
  }

  // Handle notification action
  handleNotificationAction = (notification) => {
    if (notification.action === 'redirect' && notification.actionUrl) {
      window.location.href = notification.actionUrl;
    } else if (notification.action === 'retry') {
      window.location.reload();
    } else if (notification.onAction) {
      notification.onAction();
    }
    
    this.removeNotification(notification.id);
  }

  render() {
    const { hasError, error, errorInfo, notifications } = this.state;
    const { children, fallback } = this.props;

    // If there's an error and a fallback UI is provided, show it
    if (hasError && fallback) {
      return fallback(error, errorInfo);
    }

    // If there's an error and no fallback UI, show default message
    if (hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong :(</h2>
          <p>An error occurred while displaying this section.</p>
          <button 
            onClick={() => window.location.reload()}
            className="error-boundary-button"
          >
            Refresh page
          </button>
          
          {/* Show error details in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Error details</summary>
              <pre>{error && error.toString()}</pre>
              <pre>{errorInfo && errorInfo.componentStack}</pre>
            </details>
          )}
          
          <style jsx>{`
            .error-boundary {
              padding: 20px;
              margin: 20px;
              border: 1px solid #f5c6cb;
              border-radius: 4px;
              background-color: #f8d7da;
              color: #721c24;
              text-align: center;
            }
            
            .error-boundary-button {
              padding: 8px 16px;
              background-color: #dc3545;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 10px;
            }
            
            .error-details {
              margin-top: 20px;
              text-align: left;
              background-color: #f8f9fa;
              padding: 10px;
              border-radius: 4px;
            }
            
            .error-details pre {
              overflow: auto;
              margin: 10px 0;
              padding: 10px;
              background-color: #f1f1f1;
              border-radius: 4px;
              font-size: 12px;
            }
          `}</style>
        </div>
      );
    }

    // Show notification components if any, using Dynamic Island style
    return (
      <>
        {children}
        
        {/* Show dynamic iOS notifications */}
        {notifications.length > 0 && (
          <>
            {notifications.map((notification, index) => (
              <DynamicIslandNotification
                key={notification.id}
                open={true}
                message={notification.message}
                shortMessage={notification.shortMessage}
                notificationType={notification.notificationType}
                animationType={notification.animationType}
                autoHideDuration={notification.hideAfter || 5000}
                onClose={() => {
                  // If there's an action, handle it
                  if (notification.action) {
                    this.handleNotificationAction(notification);
                  } else {
                    this.removeNotification(notification.id);
                  }
                }}
                notificationData={null} // Don't use translation features when language context might not be available
              />
            ))}
          </>
        )}
      </>
    );
  }
}

export default ErrorBoundary; 