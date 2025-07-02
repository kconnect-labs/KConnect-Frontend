import React, { useState, useEffect, useContext, memo } from 'react';
import { Box, styled, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';
import { MobilePlayer, DesktopPlayer } from '../Music';
import { useMusic } from '../../context/MusicContext';
import LanguageSwitcher from '../LanguageSwitcher';


const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  color: theme.palette.text.primary,
  overflow: 'auto'
}));


const ContentWrapper = styled(Box)(({ theme, isMusicPage, isMobile }) => ({
  display: 'flex',
  flexGrow: 1,
  paddingTop: isMusicPage && isMobile ? 0 : 40, 
}));


const SidebarContainer = styled(Box)(({ theme, open }) => ({
  flexShrink: 0,
  marginLeft: 'auto', 
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer,
    right: open ? 0 : -280, 
    left: 'auto', 
    transition: theme.transitions.create('right', { 
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
  const theme = useTheme();
  const { themeSettings, profileBackground } = useContext(ThemeSettingsContext);
  const { user, isLoading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  
  const isBanned = user && user.ban === 1;
  const isOnBanPage = location.pathname === '/ban';
  
  const shouldShowFullLayout = !isBanned && !isOnBanPage;

  if (isAuthPage) {
    return (
      <Box sx={{ 
        backgroundColor: themeSettings?.backgroundColor || theme.palette.background.default,
        color: themeSettings?.textColor || theme.palette.text.primary,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        {children}
      </Box>
    );
  }

  return (
    <MainContainer 
      sx={{
        backgroundColor: themeSettings?.backgroundColor || theme.palette.background.default,
        backgroundImage: profileBackground
          ? `url(${profileBackground})`
          : (themeSettings?.backgroundImage 
            ? `url(${themeSettings.backgroundImage})` 
            : 'none'),
        color: themeSettings?.textColor || theme.palette.text.primary
      }}
    >
      <CssBaseline />
      {shouldShowFullLayout && <MemoizedHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />}
      
      <ContentWrapper isMusicPage={isMusicPage} isMobile={isMobile}>
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