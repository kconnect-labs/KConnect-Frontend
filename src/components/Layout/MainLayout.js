import React, { useState, useEffect, useContext, memo } from 'react';
import { Box, styled, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';
import { MobilePlayer, DesktopPlayer } from '../Music';
import { useMusic } from '../../context/MusicContext';

// Main container - занимает всю доступную ширину и устанавливает общий фон
const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  color: theme.palette.text.primary
}));

// Content wrapper - содержит в себе сайдбар и content
const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  paddingTop: 64, // фиксированная высота хедера для создания отступа
}));

// Sidebar container - фиксированной ширины на десктопе, на мобильном устройстве, как правило, скрыт
const SidebarContainer = styled(Box)(({ theme, open }) => ({
  flexShrink: 0,
  marginLeft: 'auto', // Выравнивание по правому краю
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer,
    right: open ? 0 : -280, // Сайдбар выдвигается справа, используем значение по умолчанию
    left: 'auto', // Отменяем левое позиционирование
    transition: theme.transitions.create('right', { // Изменяем анимацию на right
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  paddingBottom: theme.spacing(2),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: { xs: 0, md: 0 },
  maxWidth: '100%',
  color: theme.palette.text.primary,
  [theme.breakpoints.up('md')]: {
    maxWidth: '1050px', 
    paddingRight: '10px',
    paddingLeft: '10px',
    marginRight: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    padding: 0,
  },
}));

// Overlay for mobile sidebar
const Overlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: theme.zIndex.drawer - 1,
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.3s ease, visibility 0.3s ease',
  '&.active': {
    opacity: 1,
    visibility: 'visible',
  },
}));

// Мемоизированный хедер для предотвращения лишних ре-рендеров
const MemoizedHeader = memo(({ toggleSidebar, isMobile }) => (
  <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
));

// Мемоизированный сайдбар для предотвращения лишних ре-рендеров
const MemoizedSidebar = memo(({ open, onClose }) => (
  <Sidebar open={open} onClose={onClose} />
));

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const { user, isLoading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { currentTrack } = useMusic();
  
  // Фиксированная ширина сайдбара
  const sidebarWidth = 280;
  
  // Закрываем сайдбар при изменении маршрута (только на мобильных устройствах)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Проверяем, если это страница авторизации, не показываем шапку и сайдбар
  const authPages = ['/login', '/register', '/register/profile', '/confirm-email'];
  const isAuthPage = authPages.some(path => location.pathname.startsWith(path));
  
  // Показываем плееры только на странице музыки
  const isMusicPage = location.pathname.startsWith('/music');
  const hasBottomPlayer = isMobile && currentTrack && isMusicPage;
  const hasDesktopPlayer = !isMobile && currentTrack && isMusicPage;

  // Check if user is banned and on the ban page
  const isBanned = user && user.ban === 0;
  const isOnBanPage = location.pathname === '/ban';
  
  // Hide header and show simplified layout for banned users on ban page
  const shouldShowFullLayout = !isBanned || !isOnBanPage;

  // Для страниц авторизации возвращаем только контент без шапки и сайдбара
  if (isAuthPage) {
    return (
      <Box sx={{ 
        backgroundColor: themeSettings?.backgroundColor || theme.palette.background.default,
        color: themeSettings?.textColor || theme.palette.text.primary,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </Box>
    );
  }

  return (
    <MainContainer 
      sx={{
        backgroundColor: themeSettings?.backgroundColor || theme.palette.background.default,
        backgroundImage: themeSettings?.backgroundImage 
          ? `url(${themeSettings.backgroundImage})` 
          : 'none',
        color: themeSettings?.textColor || theme.palette.text.primary
      }}
    >
      <CssBaseline />
      {shouldShowFullLayout && <MemoizedHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />}
      
      <ContentWrapper>
        <Overlay 
          className={sidebarOpen ? 'active' : ''} 
          onClick={closeSidebar}
        />
        
        <SidebarContainer 
          open={sidebarOpen} 
          sx={{ width: sidebarWidth }}
        >
          <MemoizedSidebar open={sidebarOpen} onClose={closeSidebar} />
        </SidebarContainer>
        
        <ContentContainer 
          sx={{ 
            color: themeSettings?.textColor || theme.palette.text.primary,
            width: { md: `calc(100% - ${sidebarWidth}px)` },
            paddingBottom: {
              xs: hasBottomPlayer ? theme.spacing(12) : 0,
              sm: hasBottomPlayer ? theme.spacing(12) : 0,
              md: hasBottomPlayer ? theme.spacing(12) : theme.spacing(2)
            }
          }}
        >
          {children}
        </ContentContainer>
      </ContentWrapper>
      
      
      {hasBottomPlayer && <MobilePlayer />}
      {hasDesktopPlayer && <DesktopPlayer />}
    </MainContainer>
  );
};

export default memo(MainLayout); 