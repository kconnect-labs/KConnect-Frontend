import React, { useContext, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const TelegramLogin = () => {
  const { updateUser, setIsAuthenticated } = useContext(AuthContext);
  const telegramBtnRef = useRef(null);

  // Функция для обработки авторизации через Telegram
  const handleTelegramAuth = (user) => {
    console.log('Telegram auth data:', user);
    
    axios.post('/api/auth/telegram', { 
      telegramUser: user,
      chat_id: user.id,
      username: user.username
    })
    .then(response => {
      if (response.data.success) {
        // Обновляем контекст авторизации
        updateUser(response.data.user);
        setIsAuthenticated(true);
        
        // Перенаправляем пользователя
        if (response.data.needsProfileSetup) {
          window.location.href = '/register-profile';
        } else {
          window.location.href = '/';
        }
      } else {
        console.error('Ошибка авторизации через Telegram:', response.data.error);
      }
    })
    .catch(error => {
      console.error('Ошибка запроса авторизации через Telegram:', error);
    });
  };

  useEffect(() => {
    // Определяем глобальную функцию для виджета Telegram
    window.onTelegramAuth = function(user) {
      handleTelegramAuth(user);
    };

    // Создаем скрытый div для Telegram виджета
    const telegramWidgetContainer = document.createElement('div');
    telegramWidgetContainer.id = 'telegram-login';
    telegramWidgetContainer.style.display = 'none';
    document.body.appendChild(telegramWidgetContainer);

    // Добавляем скрипт для виджета
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'KConnect');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    telegramWidgetContainer.appendChild(script);

    // Очистка при размонтировании
    return () => {
      if (document.body.contains(telegramWidgetContainer)) {
        document.body.removeChild(telegramWidgetContainer);
      }
      delete window.onTelegramAuth;
    };
  }, []);

  // Функция для клика по кнопке Telegram
  const handleTelegramClick = () => {
    // Ищем iframe и кликаем по нему
    setTimeout(() => {
      const telegramLoginIframe = document.querySelector('iframe[name^="telegram-login"]');
      
      if (telegramLoginIframe) {
        console.log('Кликаем на iframe Telegram');
        telegramLoginIframe.click();
      } else {
        // Ищем кнопку внутри виджета и кликаем по ней
        const telegramLoginButton = document.querySelector('#telegram-login .telegram-login-button');
        if (telegramLoginButton) {
          console.log('Кликаем на кнопку Telegram виджета');
          telegramLoginButton.click();
        } else {
          console.log('Не нашли элементы для клика, пробуем открыть напрямую');
          // Правильная ссылка с корректным bot_id и параметрами
          const currentUrl = window.location.origin;
          const redirectUrl = encodeURIComponent(currentUrl);
          window.open(`https://oauth.telegram.org/auth?bot_id=7669359470&origin=${redirectUrl}&embed=1&request_access=write&return_to=${redirectUrl}/login`, '_blank');
        }
      }
    }, 500); // Даем виджету время на инициализацию
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      onClick={handleTelegramClick}
      startIcon={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.376 0 0 5.376 0 12C0 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 12 0ZM17.568 8.16C17.388 10.056 16.608 14.868 16.212 16.944C16.044 17.808 15.708 18.084 15.396 18.12C14.7 18.192 14.172 17.664 13.5 17.232C12.42 16.548 11.844 16.14 10.788 15.468C9.564 14.7 10.332 14.28 11.016 13.572C11.196 13.392 14.388 10.548 14.46 10.284C14.46 10.26 14.472 10.164 14.4 10.104C14.34 10.044 14.244 10.068 14.172 10.08C14.076 10.104 12.384 11.232 9.072 13.464C8.592 13.788 8.16 13.956 7.776 13.944C7.356 13.932 6.552 13.704 5.952 13.5C5.22 13.26 4.644 13.128 4.704 12.708C4.728 12.492 5.028 12.264 5.58 12.048C9.096 10.392 11.448 9.276 12.624 8.7C15.936 7.044 16.692 6.78 17.22 6.78C17.328 6.78 17.568 6.804 17.712 6.924C17.832 7.02 17.856 7.152 17.868 7.248C17.844 7.512 17.844 7.884 17.568 8.16Z" fill="#27A6E5"/>
        </svg>
      }
      sx={{ 
        mt: 0.2, 
        mb: 2,
        borderColor: '#27A6E5',
        color: '#27A6E5',
        '&:hover': {
          backgroundColor: 'rgba(39, 166, 229, 0.04)'
        }
      }}
      ref={telegramBtnRef}
    >
      Войти через Telegram
    </Button>
  );
};

export default TelegramLogin; 