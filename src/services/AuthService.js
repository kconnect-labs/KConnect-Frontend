import axios from 'axios';

// Сервис для работы с авторизацией
const AuthService = {
  // Авторизация пользователя
  login: async (credentials) => {
    try {
      const { usernameOrEmail, password } = credentials;
      const response = await axios.post('/api/auth/login', { 
        username: usernameOrEmail, 
        password 
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        // Сохраняем токен, если он есть в ответе
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        // Возвращаем успешный результат
        return {
          success: true,
          user: response.data.user || null,
          token: response.data.token || null
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Неизвестная ошибка при входе'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Ошибка при входе в систему'
      };
    }
  },

  // Регистрация пользователя
  register: async (username, email, password) => {
    try {
      // Убедимся, что отправляем правильный формат данных
      const userData = {
        username: username,
        email: email,
        password: password
      };
      
      console.log('Отправляемые данные для регистрации:', {
        ...userData,
        password: '[HIDDEN]'
      });
      
      // Добавим правильные заголовки
      const response = await axios.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Ответ сервера при регистрации:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      if (error.response) {
        console.error('Данные ответа:', error.response.data);
        console.error('Статус ответа:', error.response.status);
        console.error('Заголовки ответа:', error.response.headers);
      }
      throw error;
    }
  },

  // Проверка авторизации
  checkAuth: async () => {
    try {
      // Убираем ограничение на параллельные запросы
      console.log('Checking authentication status...');
      
      try {
        // Сначала пробуем основной эндпоинт с явным withCredentials
        const response = await axios.get('/api/auth/check', {
          withCredentials: true,  // Явно указываем отправку куки
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        console.log('Auth check response:', response.data);
        
        // Проверяем, есть ли сессия, но нет аккаунта
        if (response.data && response.data.sessionExists && !response.data.user) {
          response.data.hasSession = true;
        }
        
        // Кэшируем результат
        window._lastAuthCheckResponse = response;
        return response;
      } catch (error) {
        // Если получили 404, пробуем альтернативный эндпоинт
        if (error.response && error.response.status === 404) {
          console.log('Primary auth endpoint not found, trying fallback...');
          const fallbackResponse = await axios.get('/api/check-auth', {
            withCredentials: true,  // Явно указываем отправку куки
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          console.log('Fallback auth check response:', fallbackResponse.data);
          
          // Проверяем, есть ли сессия, но нет аккаунта
          if (fallbackResponse.data && fallbackResponse.data.sessionExists && !fallbackResponse.data.user) {
            fallbackResponse.data.hasSession = true;
          }
          
          // Кэшируем результат
          window._lastAuthCheckResponse = fallbackResponse;
          return fallbackResponse;
        }
        // Если другая ошибка - выбрасываем её дальше
        throw error;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // В случае ошибки аутентификации, возвращаем объект с isAuthenticated: false
      const errorResponse = {
        data: {
          isAuthenticated: false,
          user: null,
          error: error.response?.data?.error || error.message
        }
      };
      window._lastAuthCheckResponse = errorResponse;
      return errorResponse;
    }
  },

  // Выход из системы
  logout: async () => {
    try {
      // Делаем запрос к API
      const response = await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Очищаем локальные данные независимо от результата
      localStorage.removeItem('token');
      
      // Возвращаем результат от сервера
      return response.data;
    } catch (error) {
      // Даже при ошибке очищаем локальные данные
      localStorage.removeItem('token');
      
      // Пробрасываем ошибку дальше
      throw error;
    }
  },

  // Регистрация профиля пользователя
  registerProfile: async (profileData) => {
    try {
      console.log('Отправляемые данные профиля:', profileData);
      
      const response = await axios.post('/api/auth/register-profile', profileData, {
        withCredentials: true,
        headers: {
          'Content-Type': profileData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      });
      
      console.log('Ответ сервера при регистрации профиля:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при регистрации профиля:', error);
      if (error.response) {
        console.error('Данные ответа:', error.response.data);
      }
      throw error;
    }
  }
};

export default AuthService;
