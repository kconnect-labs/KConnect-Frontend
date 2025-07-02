import axios from 'axios';

const AuthService = {
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
      
      if (response.data && response.data.ban_info) {
        return {
          success: false,
          error: response.data.error || 'Аккаунт заблокирован',
          ban_info: response.data.ban_info
        };
      }
      
      if (response.data && response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
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
      if (error.response?.data?.ban_info) {
        return {
          success: false,
          error: error.response.data.error || 'Аккаунт заблокирован',
          ban_info: error.response.data.ban_info
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Ошибка при входе в систему'
      };
    }
  },

  register: async (username, email, password) => {
    try {
      const userData = {
        username: username,
        email: email,
        password: password
      };
      
      console.log('Отправляемые данные для регистрации:', {
        ...userData,
        password: '[HIDDEN]'
      });
      
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

  checkAuth: async () => {
    try {
      console.log('Checking authentication status...');
      
      try {
        const response = await axios.get('/api/auth/check', {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        console.log('Auth check response:', response.data);
        
        if (response.data && response.data.sessionExists && !response.data.user) {
          response.data.hasSession = true;
        }
        
        window._lastAuthCheckResponse = response;
        return response;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Primary auth endpoint not found, trying fallback...');
          const fallbackResponse = await axios.get('/api/check-auth', {
            withCredentials: true,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          console.log('Fallback auth check response:', fallbackResponse.data);
          
          if (fallbackResponse.data && fallbackResponse.data.sessionExists && !fallbackResponse.data.user) {
            fallbackResponse.data.hasSession = true;
          }
          
          window._lastAuthCheckResponse = fallbackResponse;
          return fallbackResponse;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
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

  logout: async () => {
    try {
      const response = await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      localStorage.removeItem('token');
      
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      
      throw error;
    }
  },

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
