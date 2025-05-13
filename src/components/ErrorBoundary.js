import React, { Component } from 'react';

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
    // Обновляем состояние, чтобы следующий рендер показал запасной UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Можно также отправить отчет об ошибке в сервис аналитики
    console.error('Ошибка в компоненте:', error, errorInfo);
    this.setState({ errorInfo });
  }

  componentDidMount() {
    // Слушаем события ошибок от API
    window.addEventListener('auth-error', this.handleAuthError);
    window.addEventListener('network-error', this.handleNetworkError);
    window.addEventListener('rate-limit-error', this.handleRateLimitError);
    window.addEventListener('show-error', this.handleShowError);
    window.addEventListener('api-retry', this.handleApiRetry);
  }

  componentWillUnmount() {
    // Убираем слушатели событий при размонтировании
    window.removeEventListener('auth-error', this.handleAuthError);
    window.removeEventListener('network-error', this.handleNetworkError);
    window.removeEventListener('rate-limit-error', this.handleRateLimitError);
    window.removeEventListener('show-error', this.handleShowError);
    window.removeEventListener('api-retry', this.handleApiRetry);
  }

  // Обработчик события истекшей авторизации
  handleAuthError = (event) => {
    // Обработка ошибки авторизации
    this.addNotification({
      id: Date.now(),
      type: 'error',
      message: event.detail.message,
      action: 'redirect',
      actionLabel: 'Войти',
      actionUrl: '/login'
    });
  }

  // Обработчик события ошибки сети
  handleNetworkError = (event) => {
    this.addNotification({
      id: Date.now(),
      type: 'warning',
      message: event.detail.message,
      action: 'retry',
      actionLabel: 'Повторить'
    });
  }

  // Обработчик события превышения лимита запросов
  handleRateLimitError = (event) => {
    const { message, retryAfter } = event.detail;
    
    // Конвертируем retryAfter в человекочитаемый формат
    let waitTime = 'некоторое время';
    if (retryAfter) {
      const seconds = parseInt(retryAfter, 10);
      if (seconds < 60) {
        waitTime = `${seconds} секунд`;
      } else {
        waitTime = `${Math.ceil(seconds / 60)} минут`;
      }
    }
    
    this.addNotification({
      id: Date.now(),
      type: 'info',
      message: `${message} Пожалуйста, подождите ${waitTime} и попробуйте снова.`,
      autoHide: true,
      hideAfter: 8000
    });
  }

  // Обработчик события отображения ошибки
  handleShowError = (event) => {
    this.addNotification({
      id: Date.now(),
      type: 'error',
      message: event.detail.message,
      autoHide: true,
      hideAfter: 5000
    });
  }

  // Обработчик события повторной попытки запроса
  handleApiRetry = (event) => {
    const { url, attempt, delay } = event.detail;
    
    // Только для разработки показываем информацию о повторной попытке
    if (process.env.NODE_ENV === 'development') {
      console.log(`Повторная попытка ${attempt} для ${url} через ${delay}мс`);
    }
  }

  // Добавление уведомления в список
  addNotification = (notification) => {
    this.setState(prevState => ({
      notifications: [...prevState.notifications, notification]
    }));

    // Если уведомление должно автоматически скрываться
    if (notification.autoHide) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.hideAfter || 5000);
    }
  }

  // Удаление уведомления из списка
  removeNotification = (id) => {
    this.setState(prevState => ({
      notifications: prevState.notifications.filter(n => n.id !== id)
    }));
  }

  // Обработка действия уведомления
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

    // Если произошла ошибка и есть запасной UI, показываем его
    if (hasError && fallback) {
      return fallback(error, errorInfo);
    }

    // Если произошла ошибка и нет запасного UI, показываем стандартное сообщение
    if (hasError) {
      return (
        <div className="error-boundary">
          <h2>Что-то пошло не так :(</h2>
          <p>Произошла ошибка при отображении этого раздела.</p>
          <button 
            onClick={() => window.location.reload()}
            className="error-boundary-button"
          >
            Обновить страницу
          </button>
          
          {/* В режиме разработки показываем детали ошибки */}
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Детали ошибки</summary>
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

    // Показываем компоненты уведомлений, если они есть
    return (
      <>
        {children}
        
        {/* Список уведомлений */}
        {notifications.length > 0 && (
          <div className="notifications-container">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification notification-${notification.type}`}
              >
                <div className="notification-message">
                  {notification.message}
                </div>
                
                {notification.action && (
                  <button
                    className="notification-action"
                    onClick={() => this.handleNotificationAction(notification)}
                  >
                    {notification.actionLabel || 'Действие'}
                  </button>
                )}
                
                <button
                  className="notification-close"
                  onClick={() => this.removeNotification(notification.id)}
                >
                  &times;
                </button>
              </div>
            ))}
            
            <style jsx>{`
              .notifications-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                max-width: 350px;
                z-index: 9999;
              }
              
              .notification {
                margin-top: 10px;
                padding: 12px;
                border-radius: 4px;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                display: flex;
                align-items: center;
                animation: slide-in 0.3s ease-out;
              }
              
              @keyframes slide-in {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              
              .notification-error {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
              }
              
              .notification-warning {
                background-color: #fff3cd;
                border: 1px solid #ffeeba;
                color: #856404;
              }
              
              .notification-info {
                background-color: #d1ecf1;
                border: 1px solid #bee5eb;
                color: #0c5460;
              }
              
              .notification-message {
                flex: 1;
                margin-right: 10px;
              }
              
              .notification-action {
                background-color: rgba(0, 0, 0, 0.1);
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                margin-right: 10px;
                font-size: 12px;
              }
              
              .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.5;
              }
              
              .notification-close:hover {
                opacity: 1;
              }
            `}</style>
          </div>
        )}
      </>
    );
  }
}

export default ErrorBoundary; 