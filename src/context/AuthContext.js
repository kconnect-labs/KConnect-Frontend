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

  
  const checkAuth = useCallback(async (force = false) => {
    try {
      
      const now = Date.now();
      if (!force && now - lastAuthCheck < 5 * 60 * 1000 && user) {
        console.log('Using cached authentication data');
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
          window._authCheckInProgress = false;
          return userData;
        } else if (response.data.needsProfileSetup || response.data.hasSession) {
          
          console.log('User needs profile setup or has session but no profile');
          setUser(null);
          setIsAuthenticated(true); 
          
          
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
          
          
          const publicPages = [
            '/login',
            '/register',
            '/auth_elem',
            '/rules',
            '/privacy-policy',
            '/terms-of-service',
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

  
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      
      if (response.success) {
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        
        if (themeContext && themeContext.loadThemeSettings) {
          themeContext.loadThemeSettings();
        }
        
        
        localStorage.setItem('auth_success', 'true');
        
        
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
      localStorage.removeItem('k-connect-auth-state');
      localStorage.removeItem('k-connect-user');
      
      
      setUser(null);
      setIsAuthenticated(false);
      setLastAuthCheck(0);
      
      
      if (themeContext && themeContext.loadThemeSettings) {
        themeContext.loadThemeSettings(true);
      }
      
      
      navigate('/login', { replace: true });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      
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

  
  const registerProfile = async (profileData) => {
    console.log('Registering profile:', profileData);
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProfileService.createProfile(profileData);
      console.log('Profile registration response:', response);
      
      
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

  
  useEffect(() => {
    
    if (typeof window._authInitialized === 'undefined') {
      window._authInitialized = true;
      window._lastGlobalAuthCheck = 0;
      window._authCheckInProgress = false;
      window._authServiceCheckInProgress = false;
      window._lastAuthCheckResponse = null;
      console.log("Initialized auth control variables");
    }
    
    
    const forceCheck = !window._initialAuthCheckDone;
    checkAuth(forceCheck);
    window._initialAuthCheckDone = true;
    
    
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        
        if (error.response && error.response.status === 401) {
          
          
          if (isAuthenticated) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('k-connect-auth-state');
            localStorage.removeItem('k-connect-user');
            
            
            
            
            
            if (!window.location.pathname.includes('/login')) {
              navigate('/', { replace: true });
            }
          }
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      
      axios.interceptors.response.eject(interceptor);
    };
  }, [checkAuth, isAuthenticated, navigate]);

  
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, loading, user });
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