import React, { useState, useEffect, useContext, memo } from 'react';
import { Box, styled, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';
import { MobilePlayer, DesktopPlayer } from '../Music';
import { useMusic } from '../../context/MusicContext';

const MainContainer = styled(Box)(({ theme, themeSettings }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: themeSettings?.backgroundColor || theme.palette.background.default,
  backgroundImage: themeSettings?.backgroundImage 
    ? `url(${themeSettings.backgroundImage})` 
    : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  paddingTop: 64, 
}));

const SidebarContainer = styled(Box)(({ theme, open, sidebarWidth }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  marginLeft: 'auto', 
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer,
    right: open ? 0 : -sidebarWidth, 
    left: 'auto', 
    transition: theme.transitions.create('right', { 
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const ContentContainer = styled(Box)(({ theme, themeSettings, sidebarWidth, hasBottomPlayer }) => ({
  flexGrow: 1,
  paddingBottom: hasBottomPlayer ? theme.spacing(12) : theme.spacing(2),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: { xs: 0, md: 0 },
  maxWidth: '100%',
  [theme.breakpoints.up('md')]: {
    width: `calc(100% - ${sidebarWidth}px)`,
    maxWidth: '1050px', 
    paddingRight: '10px',
    paddingLeft: '10px',

    marginRight: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    paddingBottom: hasBottomPlayer ? theme.spacing(12) : 0,
  },
}));

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

const MemoizedHeader = memo(({ toggleSidebar, isMobile }) => (
  <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
));

const MemoizedSidebar = memo(({ open, onClose }) => (
  <Sidebar open={open} onClose={onClose} />
));

const MainLayout = ({ children }) => {
  const { themeSettings } = useContext(ThemeSettingsContext);
  const { user, isLoading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { currentTrack } = useMusic();
  
  
  const sidebarWidth = 280;
  
  
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

  
  const authPages = ['/login', '/register', '/register/profile', '/confirm-email'];
  const isAuthPage = authPages.some(path => location.pathname.startsWith(path));
  
  
  const isMusicPage = location.pathname.startsWith('/music');
  const hasBottomPlayer = isMobile && currentTrack && isMusicPage;
  const hasDesktopPlayer = !isMobile && currentTrack && isMusicPage;

  
  const isBanned = user && user.ban === 0;
  const isOnBanPage = location.pathname === '/ban';
  
  
  const shouldShowFullLayout = !isBanned || !isOnBanPage;

  
  if (isAuthPage) {
    return (
      <Box sx={{ 
        backgroundColor: themeSettings?.backgroundColor || theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </Box>
    );
  }

  return (
    <MainContainer themeSettings={themeSettings}>
      <CssBaseline />
      {shouldShowFullLayout && <MemoizedHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />}
      
      <ContentWrapper>
        <Overlay 
          className={sidebarOpen ? 'active' : ''} 
          onClick={closeSidebar}
        />
        
        <SidebarContainer 
          open={sidebarOpen} 
          sidebarWidth={sidebarWidth}
        >
          <MemoizedSidebar open={sidebarOpen} onClose={closeSidebar} />
        </SidebarContainer>
        
        <ContentContainer 
          themeSettings={themeSettings} 
          sidebarWidth={sidebarWidth}
          hasBottomPlayer={hasBottomPlayer}
        >
          {children}
        </ContentContainer>
      </ContentWrapper>
      
      {}
      {hasBottomPlayer && <MobilePlayer />}
      {hasDesktopPlayer && <DesktopPlayer />}
    </MainContainer>
  );
};

export default memo(MainLayout); 