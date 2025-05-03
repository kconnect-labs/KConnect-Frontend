import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeSettingsContext } from '../App';


import AuthService from '../services/AuthService';
import ProfileService from '../services/ProfileService';


export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  checkAuth: () => {},
  login: () => {},
  logout: () => {},
  setUser: () => {}
});


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  
  const savedAuthState = JSON.parse(localStorage.getItem('k-connect-auth-state') || 'null');
  const savedUser = JSON.parse(localStorage.getItem('k-connect-user') || 'null');
  
  const [user, setUser] = useState(savedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedAuthState);
  const [loading, setLoading] = useState(!savedAuthState);
  const [error, setError] = useState(null);
  const [lastAuthCheck, setLastAuthCheck] = useState(savedAuthState?.lastCheck || 0);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeSettingsContext) || {};

  
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
      
      localStorage.removeItem('k-connect-auth-state');
      localStorage.removeItem('k-connect-user');
    }
  };

  
  const checkAuth = useCallback(async (force = false) => {
    try {
      
      
      const now = Date.now();
      if (!force && isAuthenticated && user && now - lastAuthCheck < 30 * 60 * 1000) { 
        console.log('Using cached authentication data from localStorage');
        return user;
      }
      
      
      if (window._authCheckInProgress) {
        console.log('Auth check already in progress, skipping duplicate check');
        return user;
      }
      
      
      window._authCheckInProgress = true;
      
      setLoading(true);
      console.log('Checking authentication...');
      
      
      const response = await AuthService.checkAuth();
      console.log('Auth check response:', response);
      
      
      if (response && response.data) {
        if (response.data.isAuthenticated && response.data.user) {
          const userData = response.data.user;
          console.log('User authenticated:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          setLastAuthCheck(now); 
          
          
          persistAuthState(true, userData);
          
          window._authCheckInProgress = false;
          return userData;
        } else if (response.data.needsProfileSetup || response.data.hasSession) {
          
          console.log('User needs profile setup or has session but no profile');
          setUser(null);
          setIsAuthenticated(true); 
          persistAuthState(true, null);
          
          
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
          
          
          const isPublicPage = publicPages.some(page => 
            window.location.pathname.includes(page)
          );
          
          
          
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

  
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      
      if (response.success) {
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        
        persistAuthState(true, response.user);
        
        
        if (themeContext && themeContext.loadThemeSettings) {
          themeContext.loadThemeSettings();
        }
        
        
        if (!credentials.preventRedirect) {
          console.log('Перезагружаем страницу для применения сессии...');
          
          window.location.href = '/';
          return { success: true, user: response.user };
        }
        
        return { success: true, user: response.user };
      } else {
        
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
        
        
        const errorMessage = response.error || 'Ошибка при входе в систему';
        setError({ message: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      
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

  
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      
      await AuthService.logout();
      
      
      localStorage.removeItem('token');
      persistAuthState(false);
      
      
      setUser(null);
      setIsAuthenticated(false);
      setLastAuthCheck(0);
      
      
      if (themeContext && themeContext.loadThemeSettings) {
        themeContext.loadThemeSettings(true);
      }
      
      
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      
      localStorage.removeItem('token');
      persistAuthState(false);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [navigate, themeContext]);

  
  const registerProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await AuthService.registerProfile(profileData);
      
      if (response.success && response.user) {
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        
        persistAuthState(true, response.user);
        
        
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

  
  useEffect(() => {
    const initAuth = async () => {
      
      if (savedAuthState && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        setLoading(false);
        
        
        setTimeout(() => {
          checkAuth(false).catch(console.error);
        }, 1000);
      } else {
        
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

  
  useEffect(() => {
    
    window._authCheckInProgress = false;
    
    
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        
        if (error.response && error.response.status === 401) {
          
          
          if (isAuthenticated) {
            setUser(null);
            setIsAuthenticated(false);
            persistAuthState(false);
            
            
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
      
      axios.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated, navigate]);

  
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, loading, user });
    
    if (isAuthenticated && user) {
      persistAuthState(true, user);
    }
  }, [isAuthenticated, loading, user]);

  
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