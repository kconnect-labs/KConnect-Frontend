import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionKey, setSessionKey] = useState(localStorage.getItem('sessionKey') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const checkAuth = async () => {
      const savedSessionKey = localStorage.getItem('sessionKey');
      
      if (savedSessionKey) {
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionKey: savedSessionKey })
          });
          
          const data = await response.json();
          
          if (data.success && data.user) {
            setUser(data.user);
            setSessionKey(savedSessionKey);
          } else {
            
            localStorage.removeItem('sessionKey');
            setSessionKey('');
            setUser(null);
          }
        } catch (err) {
          console.error('Error verifying auth:', err);
          setError('Ошибка проверки авторизации');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  
  const login = async (username, password) => {
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setSessionKey(data.sessionKey);
        localStorage.setItem('sessionKey', data.sessionKey);
        return true;
      } else {
        setError(data.error || 'Неверное имя пользователя или пароль');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка авторизации');
      return false;
    }
  };
  
  
  const logout = async () => {
    try {
      
      if (sessionKey) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionKey}`
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      
      localStorage.removeItem('sessionKey');
      setSessionKey('');
      setUser(null);
    }
  };
  
  
  const useTestSession = async () => {
    setError(null);
    
    try {
      const response = await fetch('/api/test-auth');
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        const testKey = "86b847dc8f8649e7b89773dccca2d6b336de23de8e1c7199f611f6758831f03d";
        setSessionKey(testKey);
        localStorage.setItem('sessionKey', testKey);
        return true;
      } else {
        setError(data.error || 'Ошибка тестовой авторизации');
        return false;
      }
    } catch (err) {
      console.error('Test auth error:', err);
      setError('Ошибка тестовой авторизации');
      return false;
    }
  };
  
  
  const isAuthenticated = !!user && !!sessionKey;
  
  
  const value = {
    user,
    sessionKey,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    useTestSession
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 