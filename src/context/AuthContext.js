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

// Вспомогательный хук для использования контекста аутентификации
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Загружаем начальное состояние из localStorage, если доступно
  const savedAuthState = JSON.parse(localStorage.getItem('k-connect-auth-state') || 'null');
  const savedUser = JSON.parse(localStorage.getItem('k-connect-user') || 'null');
  
  const [user, setUser] = useState(savedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedAuthState);
  const [loading, setLoading] = useState(!savedAuthState);
  const [error, setError] = useState(null);
  const [lastAuthCheck, setLastAuthCheck] = useState(savedAuthState?.lastCheck || 0);
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

  // Функция для сохранения состояния аутентификации в localStorage
  const persistAuthState = (authState, userData) => {
    if (authState) {
      localStorage.setItem('k-connect-auth-state', JSON.stringify({
        isAuthenticated: authState,
        lastCheck: Date.now()
      }));
      
      if (userData) {
        localStorage.setItem('k-connect-user', JSON.stringify(userData));
      }
    } else {
      // Удаляем данные при выходе
      localStorage.removeItem('k-connect-auth-state');
      localStorage.removeItem('k-connect-user');
    }
  };

  // Оптимизированная проверка авторизации с кэшированием
  const checkAuth = useCallback(async (force = false) => {
    try {
      // Если у нас уже есть сохраненные данные и не требуется принудительная проверка,
      // используем их и пропускаем запрос к серверу
      const now = Date.now();
      if (!force && isAuthenticated && user && now - lastAuthCheck < 30 * 60 * 1000) { // 30 минут
        console.log('Using cached authentication data from localStorage');
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
          
          // Сохраняем данные в localStorage
          persistAuthState(true, userData);
          
          window._authCheckInProgress = false;
          return userData;
        } else if (response.data.needsProfileSetup || response.data.hasSession) {
          // Пользователь аутентифицирован (сессия есть), но нужно настроить профиль
          console.log('User needs profile setup or has session but no profile');
          setUser(null);
          setIsAuthenticated(true); // Пользователь аутентифицирован, но профиль не настроен
          persistAuthState(true, null);
          
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
          persistAuthState(false);
          window._authCheckInProgress = false;
          
          // Страницы, доступные без авторизации
          const publicPages = [
            '/login',
            '/register',
            '/auth_elem',
            '/rules',
            '/privacy-policy',
            '/terms-of-service',
            '/about',
            '/post',
            '/profile'
          ];
          
          // Проверяем, находится ли пользователь на одной из публичных страниц
          const isPublicPage = publicPages.some(page => 
            window.location.pathname.includes(page)
          );
          
          // Если это принудительная проверка и мы находимся не на публичной странице, 
          // перенаправляем на страницу логина
          if (force && !isPublicPage) {
            console.log('Redirecting to login page');
            navigate('/login', { replace: true });
          }
        }
      } else {
        console.warn('Invalid response from auth check:', response);
        setUser(null);
        setIsAuthenticated(false);
        persistAuthState(false);
        window._authCheckInProgress = false;
      }
      
      return null;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      persistAuthState(false);
      window._authCheckInProgress = false;
    } finally {
      setLoading(false);
      window._authCheckInProgress = false;
    }
  }, [lastAuthCheck, user, navigate, isAuthenticated]);

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
        
        // Сохраняем состояние в localStorage
        persistAuthState(true, response.user);
        
        // Загружаем настройки темы
        if (themeContext && themeContext.loadThemeSettings) {
          themeContext.loadThemeSettings();
        }
        
        // Если не требуется предотвратить редирект (для тестирования)
        if (!credentials.preventRedirect) {
          console.log('Перезагружаем страницу для применения сессии...');
          // Вместо навигации к '/', перезагружаем страницу для применения сессионных cookie
          window.location.href = '/';
          return { success: true, user: response.user };
        }
        
        return { success: true, user: response.user };
      } else {
        // Проверяем информацию о бане
        if (response.ban_info) {
          console.log('User account is banned:', response.ban_info);
          setError({ 
            message: 'Аккаунт заблокирован', 
            ban_info: response.ban_info 
          });
          return { 
            success: false, 
            error: 'Аккаунт заблокирован', 
            ban_info: response.ban_info 
          };
        }
        
        // Обрабатываем ошибку аутентификации
        const errorMessage = response.error || 'Ошибка при входе в систему';
        setError({ message: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Проверяем, содержит ли ответ информацию о бане
      if (error.response?.data?.ban_info) {
        const banInfo = error.response.data.ban_info;
        setError({ 
          message: 'Аккаунт заблокирован', 
          ban_info: banInfo 
        });
        return { 
          success: false, 
          error: 'Аккаунт заблокирован', 
          ban_info: banInfo 
        };
      }
      
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
      persistAuthState(false);
      
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
      
    } catch (error) {
      console.error('Logout error:', error);
      // Даже в случае ошибки сбрасываем состояние на клиенте
      localStorage.removeItem('token');
      persistAuthState(false);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [navigate, themeContext]);

  // Регистрация профиля
  const registerProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await AuthService.registerProfile(profileData);
      
      if (response.success && response.user) {
        // Обновляем состояние
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Сохраняем в localStorage
        persistAuthState(true, response.user);
        
        // Редирект на главную страницу
        navigate('/', { replace: true });
        return { success: true };
      } else {
        const errorMessage = response.error || 'Ошибка при регистрации профиля';
        setError({ message: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Profile registration error:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка при регистрации профиля';
      setError({ message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // При первом рендере проверяем наличие активной сессии
  useEffect(() => {
    const initAuth = async () => {
      // Если у нас уже есть данные в localStorage, не делаем полную проверку сразу
      if (savedAuthState && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        setLoading(false);
        
        // Проверим актуальность данных в фоне, но не будем делать редирект
        setTimeout(() => {
          checkAuth(false).catch(console.error);
        }, 1000);
      } else {
        // Если нет сохраненных данных, выполняем проверку, но без редиректа
        try {
          await checkAuth(false);
        } catch (error) {
          console.error('Initial auth check failed:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    initAuth();
  }, []);

  // Устанавливаем обработчик ошибок авторизации
  useEffect(() => {
    // Инициализируем глобальные переменные для контроля запросов
    window._authCheckInProgress = false;
    
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
            persistAuthState(false);
            
            // Не перенаправляем сразу, а проверим разрешена ли текущая страница
            const currentPath = window.location.pathname;
            const publicPages = ['/login', '/register', '/rules', '/about', '/privacy-policy', '/terms-of-service'];
            const isPublicPage = publicPages.some(page => currentPath.includes(page));
            
            if (!isPublicPage) {
              navigate('/login', { replace: true });
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
  }, [isAuthenticated, navigate]);

  // Отладочный лог при изменении состояния аутентификации
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, loading, user });
    // При изменении состояния обновляем localStorage
    if (isAuthenticated && user) {
      persistAuthState(true, user);
    }
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