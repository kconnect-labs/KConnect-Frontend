import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeSettingsContext } from '../App';

// Импорт сервисов
import AuthService from '../services/AuthService';
import ProfileService from '../services/ProfileService';

// Создаем контекст для аутентификации
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  checkAuth: () => {},
  login: () => {},
  logout: () => {},
  setUser: () => {}
});

// Хук для удобного доступа к контексту
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastAuthCheck, setLastAuthCheck] = useState(0);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeSettingsContext) || {};

  // Функция для логирования состояния сессии
  const logSessionState = () => {
    console.log('Auth state:', { isAuthenticated, user });
    console.log('Cookies:', document.cookie);
    const authCookies = document.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .filter(cookie => 
        cookie.startsWith('connect.sid=') || 
        cookie.startsWith('jwt=') || 
        cookie.startsWith('auth=')
      );
    console.log('Auth cookies:', authCookies);
  };

  // Оптимизированная проверка авторизации с кэшированием
  const checkAuth = useCallback(async (force = false) => {
    try {
      // Используем только кэширование на 5 минут если не форсируем
      const now = Date.now();
      if (!force && now - lastAuthCheck < 5 * 60 * 1000 && user) {
        console.log('Using cached authentication data');
        return user;
      }
      
      // Добавляем блокировку для предотвращения параллельных запросов
      if (window._authCheckInProgress) {
        console.log('Auth check already in progress, skipping duplicate check');
        return user;
      }
      
      // Устанавливаем флаг блокировки
      window._authCheckInProgress = true;
      
      setLoading(true);
      console.log('Checking authentication...');
      
      // Получаем ответ от сервера
      const response = await AuthService.checkAuth();
      console.log('Auth check response:', response);
      
      // Правильно обрабатываем структуру ответа от сервера
      if (response && response.data) {
        if (response.data.isAuthenticated && response.data.user) {
          const userData = response.data.user;
          console.log('User authenticated:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          setLastAuthCheck(now); // Update timestamp
          window._authCheckInProgress = false;
          return userData;
        } else if (response.data.needsProfileSetup || response.data.hasSession) {
          // Пользователь аутентифицирован (сессия есть), но нужно настроить профиль
          console.log('User needs profile setup or has session but no profile');
          setUser(null);
          setIsAuthenticated(true); // Пользователь аутентифицирован, но профиль не настроен
          
          // Перенаправляем на страницу настройки профиля, только если не находимся там
          if (!window.location.pathname.includes('/register/profile')) {
            console.log('Redirecting to profile registration page');
            navigate('/register/profile', { replace: true });
          }
          
          window._authCheckInProgress = false;
          return null;
        } else {
          console.log('User not authenticated');
          setUser(null);
          setIsAuthenticated(false);
          window._authCheckInProgress = false;
          
          // Если это принудительная проверка и мы находимся не на странице логина или регистрации,
          // перенаправляем на страницу логина
          if (force && 
              !window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register') &&
              !window.location.pathname.includes('/auth_elem')) {
            console.log('Redirecting to login page');
            navigate('/login', { replace: true });
          }
        }
      } else {
        console.warn('Invalid response from auth check:', response);
        setUser(null);
        setIsAuthenticated(false);
        window._authCheckInProgress = false;
      }
      
      return null;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      window._authCheckInProgress = false;
    } finally {
      setLoading(false);
      window._authCheckInProgress = false;
    }
  }, [lastAuthCheck, user, navigate]);

  // Авторизация пользователя
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      
      if (response.success) {
        // Обновляем состояние авторизации
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Загружаем настройки темы
        if (themeContext && themeContext.loadThemeSettings) {
          themeContext.loadThemeSettings();
        }
        
        // Сохраняем флаг успешной авторизации для проверки после перезагрузки
        localStorage.setItem('auth_success', 'true');
        
        // Если не требуется предотвратить редирект (для тестирования)
        if (!credentials.preventRedirect) {
          console.log('Перезагружаем страницу для применения сессии...');
          // Вместо навигации к '/', перезагружаем страницу для применения сессионных cookie
          window.location.href = '/';
          return { success: true, user: response.user };
        }
        
        return { success: true, user: response.user };
      } else {
        // Обрабатываем ошибку аутентификации
        const errorMessage = response.error || 'Ошибка при входе в систему';
        setError({ message: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Ошибка при входе в систему';
      setError({ message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate, themeContext]);

  // Выход пользователя
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Вызываем API для выхода
      await AuthService.logout();
      
      // Очищаем состояния на клиенте
      localStorage.removeItem('token');
      localStorage.removeItem('k-connect-auth-state');
      localStorage.removeItem('k-connect-user');
      
      // Сбрасываем состояние авторизации
      setUser(null);
      setIsAuthenticated(false);
      setLastAuthCheck(0);
      
      // Сбрасываем настройки темы
      if (themeContext && themeContext.loadThemeSettings) {
        themeContext.loadThemeSettings(true);
      }
      
      // Редирект на страницу входа
      navigate('/login', { replace: true });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Даже при ошибке на сервере, очищаем локальные данные
      localStorage.removeItem('token');
      localStorage.removeItem('k-connect-auth-state');
      localStorage.removeItem('k-connect-user');
      
      setUser(null);
      setIsAuthenticated(false);
      setLastAuthCheck(0);
      
      navigate('/login', { replace: true });
      
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [navigate, themeContext]);

  // Регистрация профиля пользователя
  const registerProfile = async (profileData) => {
    console.log('Registering profile:', profileData);
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProfileService.createProfile(profileData);
      console.log('Profile registration response:', response);
      
      // Обновление данных пользователя после успешной регистрации профиля
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        return response.data;
      }
      
      return response;
    } catch (err) {
      console.error('Profile registration error:', err);
      console.log('Error response:', err.response ? {
        status: err.response.status,
        data: err.response.data
      } : 'No response');
      
      setError({
        message: 'Ошибка при регистрации профиля',
        details: err.response?.data?.message || err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Проверка аутентификации при загрузке приложения
  useEffect(() => {
    // Инициализируем глобальные переменные для контроля запросов
    if (typeof window._authInitialized === 'undefined') {
      window._authInitialized = true;
      window._lastGlobalAuthCheck = 0;
      window._authCheckInProgress = false;
      window._authServiceCheckInProgress = false;
      window._lastAuthCheckResponse = null;
      console.log("Initialized auth control variables");
    }
    
    // Check authentication on mount - с принудительной проверкой только при первой загрузке
    const forceCheck = !window._initialAuthCheckDone;
    checkAuth(forceCheck);
    window._initialAuthCheckDone = true;
    
    // Setup axios interceptor for auth errors
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Перехват 401 ошибки (Unauthorized)
        if (error.response && error.response.status === 401) {
          // Если мы считаем, что пользователь авторизован, но сервер говорит обратное,
          // значит, сессия истекла, и нужно разлогинить пользователя
          if (isAuthenticated) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('k-connect-auth-state');
            localStorage.removeItem('k-connect-user');
            
            // Не очищаем сессионный cookie, это произойдет только при явном выходе из системы
            
            // Если не на странице входа, перенаправляем на главную, а не на логин
            // Корневой маршрут перенаправит на логин, если сессия действительно недействительна
            if (!window.location.pathname.includes('/login')) {
              navigate('/', { replace: true });
            }
          }
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      // Cleanup interceptor on unmount
      axios.interceptors.response.eject(interceptor);
    };
  }, [checkAuth, isAuthenticated, navigate]);

  // Отладочный лог при изменении состояния аутентификации
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, loading, user });
  }, [isAuthenticated, loading, user]);

  // Предоставляем контекст с функциями и данными
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
    registerProfile,
    setUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 