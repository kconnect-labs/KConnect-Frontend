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
    const { message, shortMessage = "Сессия истекла", notificationType = "auth", animationType = "pill" } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'error',
      message: message || "Сессия истекла, пожалуйста, войдите снова",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      action: 'redirect',
      actionLabel: 'Войти',
      actionUrl: '/login'
    });
  }

  // Обработчик события ошибки сети
  handleNetworkError = (event) => {
    const { message, shortMessage = "Нет сети", notificationType = "error", animationType = "drop" } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'warning',
      message: message || "Проблема с подключением к серверу",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      action: 'retry',
      actionLabel: 'Повторить'
    });
  }

  // Обработчик события превышения лимита запросов
  handleRateLimitError = (event) => {
    const { message, shortMessage = "Подождите", notificationType = "warning", animationType = "bounce", retryAfter } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'info',
      message: message || "Слишком много запросов, пожалуйста, подождите",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      autoHide: true,
      hideAfter: 5000
    });
  }

  // Обработчик события отображения ошибки
  handleShowError = (event) => {
    const { message, shortMessage = "Ошибка", notificationType = "error", animationType = "pill" } = event.detail;
    
    this.addNotification({
      id: Date.now(),
      type: 'error',
      message: message || "Произошла ошибка",
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      autoHide: true,
      hideAfter: 5000
    });
  }

  // Обработчик события повторной попытки запроса
  handleApiRetry = (event) => {
    const { url, attempt, delay, message, shortMessage = `Попытка ${attempt || 1}`, notificationType = "info", animationType = "pulse" } = event.detail;
    
    // Показываем динамическое уведомление о повторной попытке
    this.addNotification({
      id: Date.now(),
      type: 'info',
      message: message || `Повторная попытка ${attempt || 1}`,
      shortMessage: shortMessage,
      notificationType: notificationType,
      animationType: animationType,
      autoHide: true,
      hideAfter: 3000
    });
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

    // Показываем компоненты уведомлений, если они есть, используя Dynamic Island стиль
    return (
      <>
        {children}
        
        {/* Показываем динамические iOS уведомления */}
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
                  // Если есть действие, выполняем его
                  if (notification.action) {
                    this.handleNotificationAction(notification);
                  } else {
                    this.removeNotification(notification.id);
                  }
                }}
              />
            ))}
          </>
        )}
      </>
    );
  }
}

export default ErrorBoundary; 