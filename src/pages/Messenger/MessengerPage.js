import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { MessengerProvider } from '../../contexts/MessengerContext';
import { AuthContext } from '../../context/AuthContext';
import ChatList from '../../components/messenger/ChatList';
import ChatWindow from '../../components/messenger/ChatWindow';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SEO from '../../components/SEO';
import '../../styles/messenger.css';
import axios from 'axios';

const MessengerPage = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [slideIn, setSlideIn] = React.useState(false);
  const [forcedSessionKey, setForcedSessionKey] = useState(null);
  const [isLoadingSessionKey, setIsLoadingSessionKey] = useState(false);
  
  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  
  const sessionKeyCookie = getCookie('session_key') || getCookie('jwt') || getCookie('token');
  const jwtToken = localStorage.getItem('token') || sessionKeyCookie;
  
  
  const sessionKey = authContext.sessionKey || authContext.session_key || 
                    localStorage.getItem('session_key') || sessionKeyCookie || 
                    forcedSessionKey || jwtToken;
  
  
  const API_URL = `${window.location.protocol}//${window.location.host}/apiMes`;
  
  
  useEffect(() => {
    if (!sessionKey && authContext.isAuthenticated && authContext.user && !isLoadingSessionKey) {
      console.log("Запрашиваем session_key с сервера напрямую...");
      setIsLoadingSessionKey(true);
      
      (async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/get-session-key`, {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Cache-Control': 'no-cache'
            }
          });
          
          if (response.data?.session_key) {
            console.log("Получили session_key от сервера:", response.data.session_key);
            localStorage.setItem('session_key', response.data.session_key);
            setForcedSessionKey(response.data.session_key);
          }
        } catch (err) {
          console.error("Ошибка получения session_key:", err);
          
          
          if (jwtToken && !localStorage.getItem('session_key')) {
            console.log("Используем JWT как session_key");
            localStorage.setItem('session_key', jwtToken);
            setForcedSessionKey(jwtToken);
          }
        } finally {
          setIsLoadingSessionKey(false);
        }
      })();
    }
  }, [authContext.isAuthenticated, authContext.user, jwtToken, sessionKey, isLoadingSessionKey, API_URL]);
  
  
  useEffect(() => {
    if (sessionKeyCookie && !localStorage.getItem('session_key')) {
      localStorage.setItem('session_key', sessionKeyCookie);
      console.log('MessengerPage: Saved session key from cookie to localStorage');
    }
  }, [sessionKeyCookie]);
  
  
  const isChannel = authContext.user?.type === 'channel';
  
  
  useEffect(() => {
    console.log('Auth Context:', authContext);
    console.log('User Type:', authContext.user?.type);
    console.log('Session Key from Auth Context:', authContext.sessionKey || authContext.session_key);
    console.log('Session Key from localStorage:', localStorage.getItem('session_key'));
    console.log('Session Key from cookie:', sessionKeyCookie);
    console.log('JWT Token:', jwtToken);
    console.log('Forced Session Key:', forcedSessionKey);
    console.log('Final Session Key:', sessionKey);
    console.log('API URL:', API_URL);
  }, [authContext, sessionKey, sessionKeyCookie, jwtToken, forcedSessionKey, API_URL]);
  
  
  if (authContext.loading || isLoadingSessionKey) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  
  if (isChannel) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh'
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Функция недоступна
        </Typography>
        <Typography variant="body1">
          Каналы не могут использовать мессенджер. Мессенджер доступен только для обычных пользователей.
        </Typography>
      </Box>
    );
  }
  
  
  if (!sessionKey) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh'
      }}>
        <Typography variant="h6" gutterBottom>
          Ошибка авторизации
        </Typography>
        <Typography variant="body1" mb={2}>
          Для доступа к мессенджеру необходимо авторизоваться
        </Typography>
        
      </Box>
    );
  }

  
  const handleChatSelect = () => {
    if (isMobile) {
      console.log('Handling chat selection - setting slideIn to TRUE');
      
      setSlideIn(true);
      
      setTimeout(() => {
        setShowSidebar(false);
      }, 50); 
    }
  };
  
  const handleBackToList = () => {
    if (isMobile) {
      
      setSlideIn(false);
      
      setTimeout(() => {
        setShowSidebar(true);
      }, 300); 
    }
  };
  
  return (
    <Box sx={{ mt: 2.5 }}>
      <SEO 
        title="Мессенджер" 
        description="Обмен сообщениями и чаты на платформе К-Коннект"
      />
      
      <MessengerProvider>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          height: { xs: 'calc(100vh - 120px)', md: 'calc(100vh - 104px)' },
          maxWidth: '1400px',
          mx: 'auto',
          mt: 1,
          mb: 2, 
          overflow: 'hidden',
          bgcolor: 'content.main',
          borderRadius: 2,
          position: 'relative'
        }}>
          {/* Боковая панель со списком чатов */}
          <Box sx={{ 
            width: { xs: '100%', md: '350px' },
            borderRight: { md: `1px solid ${theme.palette.divider}` },
            display: isMobile && !showSidebar ? 'none' : 'block',
            height: '100%',
            overflow: 'hidden'
          }}>
            {/* Явно передаем обработчик выбора чата */}
            <ChatList onSelectChat={handleChatSelect} />
          </Box>
          
          {/* Основная область с чатом */}
          {isMobile ? (
            <Box 
              id="mobile-chat-container"
              className={`messenger-main ${slideIn ? 'slide-in' : 'slide-out'}`}
              sx={{ 
                display: 'block',
                
                transform: slideIn ? 'translateX(0%) !important' : 'translateX(100%) !important',
                transition: 'transform 0.3s ease-in-out',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100vh',
                zIndex: 1300,
                backgroundColor: theme.palette.background.paper,
                overflowX: 'hidden',  
                maxWidth: '100vw',      
                WebkitOverflowScrolling: 'touch', 
                touchAction: 'manipulation',
              }}
            >
              <ChatWindow backAction={handleBackToList} isMobile={isMobile} />
            </Box>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden'
            }}>
              <ChatWindow />
            </Box>
          )}
        </Box>
      </MessengerProvider>
    </Box>
  );
};

export default MessengerPage; 