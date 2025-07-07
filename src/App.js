import React, { useState, useEffect, useMemo, useContext, lazy, Suspense, useTransition, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppBottomNavigation from './components/BottomNavigation';
import { MusicProvider } from './context/MusicContext';
import { Box, CircularProgress, Typography, Button, Alert, GlobalStyles } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';
import { PostDetailProvider } from './context/PostDetailContext';
import RegisterChannel from './pages/Auth/RegisterChannel';
import { ErrorBoundary } from 'react-error-boundary';
import ChannelsPage from './pages/Main/ChannelsPage';
import MusicPlayerCore from './components/MusicPlayerCore';
import { setSessionContext } from './services/ProfileService';
import JoinGroupChat from './pages/Messenger/JoinGroupChat';
import CookiePage from './pages/Info/CookiesPage';
import { LanguageProvider } from './context/LanguageContext';
import { DefaultPropsProvider } from './context/DefaultPropsContext';
import { MessengerProvider } from './contexts/MessengerContext';
import axios from 'axios';

export const SessionContext = React.createContext({
  sessionActive: true,
  sessionExpired: false,
  lastFetchTime: null,
  broadcastUpdate: () => {},
  checkSessionStatus: () => true,
  refreshSession: () => {}
});

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  
  
  if (loading) {
    return null;
  }
  
  
  if (isAuthenticated) {
    return children;
  }
  
  
  return (
    <Navigate 
      to="/login" 
      state={{ from: location.pathname }} 
      replace 
    />
  );
};


const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const RegisterProfile = lazy(() => import('./pages/Auth/RegisterProfile'));
const EmailConfirmation = lazy(() => import('./pages/Auth/EmailConfirmation'));
const MainLayout = lazy(() => import('./components/Layout/MainLayout'));
const ProfilePage = lazy(() => import('./pages/User/ProfilePage'));
const MainPage = lazy(() => import('./pages/Main/MainPage'));
const PostDetailPage = lazy(() => import('./pages/Main/PostDetailPage'));
const SettingsPage = lazy(() => import('./pages/User/SettingsPage'));
const NotificationsPage = lazy(() => import('./pages/Info/NotificationsPage'));
const SearchPage = lazy(() => import('./pages/Main/SearchPage'));
const MusicPage = lazy(() => import('./pages/MusicPage/MusicPage.js'));
const ArtistPage = lazy(() => import('./pages/Main/ArtistPage'));
const MessengerPage = lazy(() => import('./pages/Messenger/MessengerPage'));
const SubscriptionsPage = lazy(() => import('./pages/Economic/SubscriptionsPage'));
const BugReportPage = lazy(() => import('./pages/BugPages/BugReportPage'));
const LeaderboardPage = lazy(() => import('./pages/Main/LeaderboardPage'));
const RulesPage = lazy(() => import('./pages/Info/RulesPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/Info/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/Info/TermsOfServicePage'));
const MorePage = lazy(() => import('./pages/Main/MorePage'));
const NotFound = lazy(() => import('./pages/Info/NotFound'));
const AdminPage = lazy(() => import('./pages/Admin/AdminPage'));
const ModeratorPage = lazy(() => import('./pages/Admin/ModeratorPage'));
const UpdatesPage = lazy(() => import('./pages/Main/UpdatesPage'));
const BadgeShopPage = lazy(() => import('./pages/Economic/BadgeShopPage'));
const BalancePage = lazy(() => import('./pages/Economic/BalancePage'));
const UsernameAuctionPage = lazy(() => import('./pages/Economic/UsernameAuctionPage'));
const InventoryPackPage = lazy(() => import('./pages/Economic/components/inventoryPack/InventoryPackPage'));
const InventoryPage = lazy(() => import('./pages/Economic/components/inventoryPack/InventoryPage'));
const MarketplacePage = lazy(() => import('./pages/Economic/components/marketplace/MarketplacePage'));
const GrantsPage = lazy(() => import('./pages/Economic/components/grantPage/GrantsPage'));
const SimpleApiDocsPage = lazy(() => import('./pages/Info/SimpleApiDocsPage'));
const SubPlanes = lazy(() => import('./pages/Economic/SubPlanes'));
const ClickerPage = lazy(() => import('./pages/MiniGames/ClickerPage'));

const AboutPage = lazy(() => import('./pages/Info/AboutPage'));
const LikedTracksPage = lazy(() => import('./pages/MusicPage/components/LikedTracksPage'));
const AllTracksPage = lazy(() => import('./pages/MusicPage/AllTracksPage'));
const PlaylistsPage = lazy(() => import('./pages/MusicPage/PlaylistsPage'));
const FriendsPage = lazy(() => import('./pages/User/FriendsPage'));
const StickerManagePage = lazy(() => import('./pages/Info/StickerManagePage'));
const StreetBlacklistPage = lazy(() => import('./pages/Collab/StreetBlacklistPage'));
const StreetBlacklistV1Page = lazy(() => import('./pages/Collab/StreetBlacklistV1Page'));


export const ThemeSettingsContext = React.createContext({
  themeSettings: {
    mode: 'dark',
    primaryColor: '#D0BCFF',
    secondaryColor: '#f28c9a'
  },
  updateThemeSettings: () => {},
  setProfileBackground: () => {},
  clearProfileBackground: () => {},
});


const SuspenseFallback = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      <CircularProgress 
        color="primary" 
        size={40} 
        thickness={4} 
        sx={{ 
          color: theme.palette.primary.main,
          filter: 'drop-shadow(0 0 8px rgba(208, 188, 255, 0.4))'
        }}
      />
    </Box>
  );
};


const PageTransition = ({ children }) => {
  return children;
};


const LoadingIndicator = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: theme.palette.background.default
      }}
    >
      <Box 
        sx={{
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.2)' },
          }
        }}
      >
        <Box 
          component="img" 
          src="/icon-512.png" 
          alt="K-Connect"
          sx={{ 
            width: 80, 
            height: 80,
            filter: 'drop-shadow(0 0 8px rgba(208, 188, 255, 0.4))'
          }} 
        />
      </Box>
    </Box>
  );
};


const isAboutSubdomain = () => {
  const hostname = window.location.hostname;
  return hostname === 'about.k-connect.ru';
};

const isShareSubdomain = () => {
  const hostname = window.location.hostname;
  return hostname === 'share.k-connect.ru';
};


const AboutRoute = () => {
  return <AboutPage />;
};


const ErrorFallback = ({ error, resetErrorBoundary }) => {
  useEffect(() => {
    if (
      error?.message?.includes('Failed to fetch') || 
      error?.name === 'TypeError' ||
      error?.message?.includes('Failed to fetch dynamically imported module')
    ) {
      window.location.reload();
      return;
    }
  }, [error]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      p: 3
    }}>
      <Typography variant="h5" gutterBottom>
        Что-то пошло не так
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Пожалуйста, попробуйте перезагрузить страницу
      </Typography>
      <Box sx={{ 
        mt: 2, 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 2,
        maxWidth: '600px',
        width: '100%',
        textAlign: 'left'
      }}>
        <Typography variant="subtitle2" color="error" gutterBottom>
          Детали ошибки:
        </Typography>
        <Typography 
          variant="body2" 
          component="pre" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: 'text.secondary',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}
        >
          {error?.message || 'Неизвестная ошибка'}
        </Typography>
        {error?.stack && (
          <Typography 
            variant="body2" 
            component="pre" 
            sx={{ 
              mt: 1,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: 'text.secondary',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              opacity: 0.7
            }}
          >
            {error.stack}
          </Typography>
        )}
      </Box>
      <Button 
        variant="contained" 
        onClick={resetErrorBoundary || (() => window.location.reload())}
        sx={{ mt: 3 }}
      >
        Перезагрузить
      </Button>
    </Box>
  );
};


const PublicPages = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const path = location.pathname;

  let PublicPage;
  if (path === '/rules') {
    PublicPage = RulesPage;
  } else if (path === '/privacy-policy') {
    PublicPage = PrivacyPolicyPage;
  } else if (path === '/terms-of-service') {
    PublicPage = TermsOfServicePage;
  } else if (path === '/about') {
    return <AboutPage />;
  } else if (path === '/cookies') {
    PublicPage = CookiePage;
  }

  const content = (
    <Box>
      <PublicPage />
    </Box>
  );

  return isAuthenticated ? (
    <MainLayout>
      {content}
    </MainLayout>
  ) : content;
};


const AppRoutes = () => {
  const { user, isAuthenticated, loading, checkAuth, error, setUser } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  
  const background = location.state && location.state.background;
  
  
  const [isPending, startTransition] = useTransition();
  
  
  useEffect(() => {
    
    
    const isResetPasswordWithToken = location.pathname === '/reset-password' && 
                                   (location.search.includes('token=') || 
                                    window.location.hash.includes('/reset-password?token='));
    
    const isAuthPage = ['/login', '/register', '/register/profile', '/confirm-email', '/auth_elem', '/about', '/forgot-password'].some(
      path => location.pathname.startsWith(path)
    ) || location.pathname.startsWith('/reset-password');
    
    
    console.log('Current path:', location.pathname, 
                'Reset password with token:', isResetPasswordWithToken,
                'Search params:', location.search,
                'Hash:', window.location.hash);
    
    const hasSavedLoginError = !!localStorage.getItem('login_error');
    const authSuccessFlag = localStorage.getItem('auth_success') === 'true';
    
    
    if (authSuccessFlag && location.pathname === '/') {
      console.log('Обнаружен флаг успешной авторизации, применяем сессию');
      localStorage.removeItem('auth_success');
      
      startTransition(() => {
        checkAuth(true);
      });
      return;
    }
    
    if (!isAuthPage && !isResetPasswordWithToken && !error && !hasSavedLoginError) {
      console.log('Проверка авторизации при загрузке страницы...');
      const initAuth = async () => {
        
        startTransition(() => {
          checkAuth(true);
        });
      };
      
      initAuth();
    } else if (isAuthPage || isResetPasswordWithToken) {
      console.log('Пропускаем проверку авторизации на странице авторизации:', location.pathname, isResetPasswordWithToken ? '(сброс пароля с токеном)' : '');
    } else if (error) {
      console.log('Пропускаем проверку авторизации из-за наличия ошибки:', error);
    } else if (hasSavedLoginError) {
      console.log('Пропускаем проверку авторизации из-за наличия сохраненной ошибки входа');
    }
    
  }, [location.pathname, location.search, window.location.hash]); 
  
  
  
  const currentPath = location.pathname;
  const isLoginPage = currentPath === '/login';
  const isRegisterPage = currentPath === '/register';
  const isPasswordRecoveryPage = currentPath === '/forgot-password' || currentPath === '/reset-password';
  
  
  
  if (isLoginPage || isRegisterPage || isPasswordRecoveryPage) {
    return (
      <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes location={location}>
            <Route path="/login" element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            } />
            <Route path="/register" element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Register setUser={setUser} />
              )
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Box>
    );
  }
  
  
  return (
    <MainLayout>
      <PageTransition>
        <Routes location={background || location}>
          <Route path="/register/profile" element={<RegisterProfile setUser={setUser} />} />
          <Route path="/register/channel" element={<RegisterChannel />} />
          <Route path="/confirm-email/:token" element={<EmailConfirmation />} />                    
          <Route path="/" element={
            loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
              </Box>
            ) : isAuthenticated ? (
              <MainPage />
            ) : (
              <Navigate to="/login" replace state={{ from: location.pathname }} />
            )
          } />
          <Route path="/feed" element={<Navigate to="/" replace />} />
          <Route path="/main" element={<Navigate to="/" replace />} />                  
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/profile/:username/followers" element={isAuthenticated ? <SubscriptionsPage tabIndex={0} /> : <Navigate to="/login" replace />} />
          <Route path="/profile/:username/following" element={isAuthenticated ? <SubscriptionsPage tabIndex={1} /> : <Navigate to="/login" replace />} />
          <Route path="/subscriptions" element={isAuthenticated ? <SubscriptionsPage /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
          <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" replace />} />
          <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />} />
          <Route path="/music" element={isAuthenticated ? <MusicPage /> : <Navigate to="/login" replace />} />
          <Route path="/music/liked" element={isAuthenticated ? <LikedTracksPage onBack={() => window.history.back()} /> : <Navigate to="/login" replace />} />
          <Route path="/music/all" element={isAuthenticated ? <AllTracksPage /> : <Navigate to="/login" replace />} />
          <Route path="/music/playlists" element={isAuthenticated ? <PlaylistsPage /> : <Navigate to="/login" replace />} />
          <Route path="/music/:section" element={isAuthenticated ? <MusicPage /> : <Navigate to="/login" replace />} />
          <Route path="/music/track/:trackId" element={isAuthenticated ? <MusicPage /> : <Navigate to="/login" replace />} />
          <Route path="/artist/:artistParam" element={isAuthenticated ? <ArtistPage /> : <Navigate to="/login" replace />} />
          <Route path="/messenger" element={isAuthenticated ? <MessengerPage /> : <Navigate to="/login" replace />} />
          <Route path="/messenger/join/:inviteCode" element={isAuthenticated ? <JoinGroupChat /> : <Navigate to="/login" replace />} />
          <Route path="/bugs" element={<BugReportPage />} />
          <Route path="/leaderboard" element={<RequireAuth><LeaderboardPage /></RequireAuth>} />          
          <Route path="/more" element={isAuthenticated ? <MorePage /> : <Navigate to="/login" replace />} />
          <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" replace />} />
          <Route path="/moderator" element={isAuthenticated ? <ModeratorPage /> : <Navigate to="/login" replace />} />
          <Route path="/badge-shop" element={isAuthenticated ? <BadgeShopPage /> : <Navigate to="/login" replace />} />
          <Route path="/username-auction" element={isAuthenticated ? <UsernameAuctionPage /> : <Navigate to="/login" replace />} />         
          <Route path="/economic/packs" element={isAuthenticated ? <InventoryPackPage /> : <Navigate to="/login" replace />} />
          <Route path="/economic/inventory" element={isAuthenticated ? <InventoryPage /> : <Navigate to="/login" replace />} />
          <Route path="/minigames/clicker" element={isAuthenticated ? <ClickerPage /> : <Navigate to="/login" replace />} />

          <Route path="/balance" element={isAuthenticated ? <BalancePage /> : <Navigate to="/login" replace />} />
          <Route path="/documentapi" element={isAuthenticated ? <SimpleApiDocsPage /> : <Navigate to="/login" replace />} />
          <Route path="/sub-planes" element={isAuthenticated ? <SubPlanes /> : <Navigate to="/login" replace />} />
          <Route path="/channels" element={<RequireAuth><ChannelsPage /></RequireAuth>} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/cookies" element={<PublicPages />} />
          <Route path="/badge/:badgeId" element={<Navigate to="/badge-shop" replace state={{ openBadgeId: (location.pathname.match(/\/badge\/(\d+)/)?.[1] || null) }} />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/grant" element={isAuthenticated ? <GrantsPage /> : <Navigate to="/login" replace />} />
          <Route path="/item/:itemId" element={<ItemRedirectPage />} />
          <Route path="/friends/:username" element={<FriendsPage />} />
          <Route path="/friends" element={<FriendsRedirect />} />
          <Route path="/inform/sticker" element={isAuthenticated ? <StickerManagePage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>                
        {background && (
          <Routes>
            <Route 
              path="/post/:postId" 
              element={<PostDetailPage isOverlay={true} />} 
            />
          </Routes>
        )}
      </PageTransition>
      {/* Bottom navigation рендерится только на мобильных устройствах */}
      {isMobile && <AppBottomNavigation user={user} isMobile={isMobile} />}
    </MainLayout>
  );
};
const MemoizedAppRoutes = React.memo(AppRoutes);

const DefaultSEO = () => {
  
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href
    : 'https://k-connect.ru';
    
  
  const getPageType = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/post/')) return 'article';
      if (path.includes('/profile/')) return 'profile';
      if (path.includes('/music/')) return 'music';
    }
    return 'website';
  };
  
  return (
    <SEO 
      title="К-Коннект" 
      description="К-Коннект - социальная сеть от независимого разработчика с функциями для общения, публикации постов, музыки и многого другого."
      image="/icon-512.png"
      url={currentUrl}
      type={getPageType()}
      meta={{
        keywords: "социальная сеть, к-коннект, общение, музыка, лента, сообщения",
        viewport: "width=device-width, initial-scale=1, maximum-scale=5"
      }}
    />
  );
};
const SessionProvider = ({ children }) => {
  const [sessionActive, setSessionActive] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const sessionStartTime = useRef(Date.now());
  const lastFetchTime = useRef(null);
  const broadcastChannel = useRef(null);
  const SESSION_TIMEOUT = 60 * 60 * 1000;
  const MIN_UPDATE_INTERVAL = 15000;

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        broadcastChannel.current = new BroadcastChannel('k_connect_app_channel');
        
        broadcastChannel.current.onmessage = (event) => {
          const { type, data, timestamp } = event.data;
          
          if (type === 'session_refresh') {
            sessionStartTime.current = timestamp;
            setSessionActive(true);
            setSessionExpired(false);
          } else if (type === 'last_fetch_update' && timestamp > (lastFetchTime.current || 0)) {
            lastFetchTime.current = timestamp;
          }
        };
      } catch (error) {
        console.error('BroadcastChannel initialization error:', error);
      }
    }    
    return () => {
      if (broadcastChannel.current) {
        try {
          broadcastChannel.current.close();
        } catch (error) {
          console.error('Error closing BroadcastChannel:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const checkSessionExpiration = () => {
      const currentTime = Date.now();
      const sessionDuration = currentTime - sessionStartTime.current;
      
      if (sessionDuration >= SESSION_TIMEOUT && !sessionExpired) {
        setSessionExpired(true);
        setSessionActive(false);
      }
    };    
    const expirationInterval = setInterval(checkSessionExpiration, 60000);    
    return () => clearInterval(expirationInterval);
  }, [sessionExpired]);

  const broadcastUpdate = (type, data) => {
    if (broadcastChannel.current) {
      try {
        const message = {
          type,
          data,
          timestamp: Date.now()
        };
        broadcastChannel.current.postMessage(message);
      } catch (error) {
        console.error('Error broadcasting update:', error);
      }
    }
  };
  const checkSessionStatus = () => {
    if (sessionExpired) return false;
    
    const currentTime = Date.now();
    if (lastFetchTime.current && (currentTime - lastFetchTime.current) < MIN_UPDATE_INTERVAL) {
      return false;
    }
    
    lastFetchTime.current = currentTime;
    broadcastUpdate('last_fetch_update', null);
    
    return true;
  };

  const refreshSession = () => {
    const currentTime = Date.now();
    sessionStartTime.current = currentTime;
    setSessionActive(true);
    setSessionExpired(false);
    broadcastUpdate('session_refresh', { newStartTime: currentTime });
  };

  const contextValue = {
    sessionActive,
    sessionExpired,
    lastFetchTime: lastFetchTime.current,
    broadcastUpdate,
    checkSessionStatus,
    refreshSession
  };

  useEffect(() => {
    setSessionContext({
      checkSessionStatus,
      sessionActive,
      sessionExpired,
      lastFetchTime: lastFetchTime.current,
      refreshSession
    });
  }, [sessionActive, sessionExpired]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentTime = Date.now();
        lastFetchTime.current = currentTime;
        broadcastUpdate('last_fetch_update', null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};


function App() {
  const [isPending, startTransition] = useTransition();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [themeSettings, setThemeSettings] = useState(() => {
    const savedThemeMode = localStorage.getItem('theme') || localStorage.getItem('themeMode') || 'default';
    const savedPrimaryColor = localStorage.getItem('primaryColor') || '#D0BCFF';
    
    // Упрощенные настройки для 3 тем
    const getThemeColors = (mode) => {
      switch (mode) {
        case 'light':
          return {
            backgroundColor: '#ffffff',
            textColor: '#000000'
          };
        case 'contrast':
          return {
            backgroundColor: '#000000',
            textColor: '#FFFFFF'
          };
        default: // default theme
          return {
            backgroundColor: '#131313', //НЕ ЗАБУДЬ ВЕРНУТЬ 131313
            textColor: '#FFFFFF'
          };
      }
    };
    
    const colors = getThemeColors(savedThemeMode);
    
    return {
      mode: savedThemeMode,
      backgroundColor: colors.backgroundColor,
      textColor: colors.textColor,
      primaryColor: savedPrimaryColor
    };
  });
  
  
  const onAboutSubdomain = useMemo(() => isAboutSubdomain(), []);
  const onShareSubdomain = useMemo(() => isShareSubdomain(), []);
  
  useEffect(() => {
    if (onShareSubdomain) {
      console.log('Share subdomain detected, user will be redirected via share.html');
    }
  }, [onShareSubdomain]);

  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => {
      // Проверяем, действительно ли изменились настройки
      const hasChanges = Object.keys(newSettings).some(key => 
        prev[key] !== newSettings[key]
      );
      
      if (!hasChanges) {
        return prev; // Возвращаем предыдущее состояние без изменений
      }
      
      const updated = { ...prev, ...newSettings };
      
      // Сохраняем только основные настройки
      if (newSettings.mode) {
        localStorage.setItem('theme', newSettings.mode);
        localStorage.setItem('themeMode', newSettings.mode);
      }
      if (newSettings.backgroundColor) {
        localStorage.setItem('backgroundColor', newSettings.backgroundColor);
      }
      if (newSettings.textColor) {
        localStorage.setItem('textColor', newSettings.textColor);
      }
      if (newSettings.primaryColor) {
        localStorage.setItem('primaryColor', newSettings.primaryColor);
      }
      
      return updated;
    });
  };
  
  
  const { isAuthenticated } = useContext(AuthContext) || {};
  const prevAuthState = useRef({ isAuthenticated: null, loading: null });
  
  useEffect(() => {
    const currentAuthState = {
      isAuthenticated: isAuthenticated,
      loading: false
    };
    
    // Проверяем, действительно ли изменилось состояние
    if (
      prevAuthState.current.isAuthenticated !== currentAuthState.isAuthenticated ||
      prevAuthState.current.loading !== currentAuthState.loading
    ) {
      if (currentAuthState.isAuthenticated) {
        // Только если тема не 'default', устанавливаем её
        if (themeSettings.mode !== 'default') {
          updateThemeSettings({ mode: themeSettings.mode });
        }
      } else if (!currentAuthState.loading) {
        // Только если тема не 'default', устанавливаем 'default'
        if (themeSettings.mode !== 'default') {
          updateThemeSettings({ mode: 'default' });
        }
      }
      
      // Обновляем предыдущее состояние
      prevAuthState.current = currentAuthState;
    }
  }, [isAuthenticated, themeSettings.mode]);
  
  
  const theme = useMemo(() => {
    const themeObj = createTheme({
      palette: {
        mode: themeSettings.mode === 'light' ? 'light' : 'dark',
        primary: {
          main: themeSettings.primaryColor || '#D0BCFF',
        },
        secondary: {
          main: '#f28c9a',
        },
        background: {
          default: themeSettings.backgroundColor || '#131313',
          paper: themeSettings.backgroundColor || '#131313',
        },
        text: {
          primary: themeSettings.textColor || '#FFFFFF',
          secondary: themeSettings.mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        },
      },
      typography: {
        fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: themeSettings.backgroundColor || '#131313',
              color: themeSettings.textColor || '#FFFFFF',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: '15px',
              overflow: 'hidden',
              backgroundColor: themeSettings.backgroundColor || '#131313',
              color: themeSettings.textColor || '#FFFFFF',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              backgroundColor: themeSettings.backgroundColor || '#131313',
              color: themeSettings.textColor || '#FFFFFF',
            },
          },
        },
      },
    });
    return themeObj;
  }, [themeSettings]);

  
  const [profileBackground, setProfileBackgroundState] = useState(null);
  const setProfileBackground = (url) => setProfileBackgroundState(url);
  const clearProfileBackground = () => setProfileBackgroundState(null);

  useEffect(() => {
    if (profileBackground) {
      document.body.style.backgroundImage = `url(${profileBackground})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.height = '100vh';
      document.body.style.overflow = 'auto';
      document.body.classList.add('profile-background-active');
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.classList.remove('profile-background-active');
    }
  }, [profileBackground]);

  const [globalProfileBackgroundEnabled, setGlobalProfileBackgroundEnabled] = useState(false);

  useEffect(() => {
    // Проверка и применение фона при старте и при изменении переключателя
    const applyProfileBackground = (enabled) => {
      if (enabled) {
        let myBg = localStorage.getItem('myProfileBackgroundUrl');
        if (!myBg) {
          const match = document.cookie.match(/(?:^|; )myProfileBackgroundUrl=([^;]*)/);
          if (match) myBg = decodeURIComponent(match[1]);
        }
        if (myBg) setProfileBackground(myBg);
        else clearProfileBackground();
      } else {
        clearProfileBackground();
      }
    };

    // При старте — запрос к API и применение (только для авторизованных пользователей)
    // Проверяем наличие токена в localStorage/cookies
    const hasAuthToken = localStorage.getItem('authToken') || 
                        document.cookie.includes('authToken') ||
                        localStorage.getItem('user_id') ||
                        document.cookie.includes('user_id');
    
    if (hasAuthToken) {
      axios.get('/api/user/settings/global-profile-bg').then(res => {
        if (res.data && res.data.success) {
          setGlobalProfileBackgroundEnabled(res.data.enabled);
          applyProfileBackground(res.data.enabled);
        }
      }).catch(error => {
        console.log('Не удалось загрузить настройки фона профиля:', error);
      });
    }
  }, []);

  useEffect(() => {
    // Следить за изменением переключателя и применять фон
    if (globalProfileBackgroundEnabled) {
      let myBg = localStorage.getItem('myProfileBackgroundUrl');
      if (!myBg) {
        const match = document.cookie.match(/(?:^|; )myProfileBackgroundUrl=([^;]*)/);
        if (match) myBg = decodeURIComponent(match[1]);
      }
      if (myBg) setProfileBackground(myBg);
      else clearProfileBackground();
    } else {
      clearProfileBackground();
    }
  }, [globalProfileBackgroundEnabled]);

  const themeContextValue = useMemo(() => ({
    themeSettings,
    updateThemeSettings,
    setProfileBackground,
    clearProfileBackground,
    profileBackground,
    globalProfileBackgroundEnabled,
    setGlobalProfileBackgroundEnabled,
  }), [themeSettings, profileBackground, globalProfileBackgroundEnabled]);

  
  const location = useLocation();
  const currentPath = location.pathname;
  
  
  if (onShareSubdomain) {
    return null;
  }
  
  
  if (onAboutSubdomain) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}>
            <Suspense fallback={<LoadingIndicator />}>
              <SEO 
                title="О K-Connect" 
                description="Информация о платформе K-Connect - современной социальной сети с функциями для общения, публикации постов, музыки и многого другого."
                image="/icon-512.png"
                type="website"
              />
              <AboutPage />
            </Suspense>
          </Box>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  
  const isInitialized = useRef(false);
  
  useEffect(() => {
    localStorage.setItem('themeMode', themeSettings.mode);
  }, [themeSettings.mode]);

  
  useEffect(() => {
    if (isInitialized.current) return; // Предотвращаем повторное выполнение
    
    const savedThemeMode = localStorage.getItem('themeMode');
    
    if (savedThemeMode && savedThemeMode !== themeSettings.mode) {
      console.log('Theme mode mismatch, restoring from localStorage');
      updateThemeSettings({ mode: savedThemeMode });
    }
    
    isInitialized.current = true;
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key && (
          event.key === 'theme' ||
          event.key === 'themeMode' ||
          event.key === 'backgroundColor' ||
          event.key === 'textColor' ||
          event.key === 'primaryColor'
        )) {
        console.log(`Storage change detected for ${event.key}:`, event.newValue);
        
        // Проверяем, действительно ли изменилось значение
        const currentValue = event.key === 'theme' || event.key === 'themeMode' 
          ? themeSettings.mode 
          : themeSettings[event.key];
        
        if (currentValue === event.newValue) {
          return; // Значение не изменилось, пропускаем обновление
        }
        
        const settingUpdate = {};
        
        if (event.key === 'theme' || event.key === 'themeMode') {
          settingUpdate.mode = event.newValue;
        } else {
          settingUpdate[event.key] = event.newValue;
        }
        
        updateThemeSettings(settingUpdate);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [themeSettings]);

  // --- ДОБАВЛЯЕМ useEffect для загрузки темы пользователя ---
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const response = await fetch('/api/profile/settings');
        const data = await response.json();
        if (data && data.success && data.settings) {
          // Применяем настройки темы
          setThemeSettings(prev => ({
            ...prev,
            primaryColor: data.settings.primary_color || '#D0BCFF',
            mode: data.settings.theme || 'dark',
          }));
          localStorage.setItem('primaryColor', data.settings.primary_color || '#D0BCFF');
          localStorage.setItem('theme', data.settings.theme || 'dark');
          console.log('Настройки пользователя загружены:', data.settings);
        }
      } catch (e) {
        console.error('Ошибка загрузки настроек:', e);
        // fallback: дефолт
        setThemeSettings(prev => ({ ...prev, primaryColor: '#D0BCFF', mode: 'dark' }));
      }
    };

    // Загружаем настройки при инициализации приложения
    loadUserSettings();
  }, []);
  // --- КОНЕЦ ДОБАВЛЕНИЯ ---

  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeSettingsContext.Provider value={themeContextValue}>
          <ThemeProvider theme={theme}>
            <DefaultPropsProvider>
              <CssBaseline />
              {themeSettings.mode === 'contrast' && (
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .MuiListItemText-primary, 
                    .MuiListItemText-secondary,
                    .MuiTypography-root,
                    .MuiInputBase-input,
                    .MuiInputLabel-root,
                    .MuiFormHelperText-root,
                    .MuiMenuItem-root,
                    .MuiButton-root,
                    .MuiLink-root:not(a),
                    .MuiChip-label,
                    .MuiTab-root,
                    .MuiTableCell-root,
                    [class*="css-"],
                    /* Additional text selectors */
                    span:not(.MuiIcon-root):not(.material-icons),
                    p,
                    h1, h2, h3, h4, h5, h6,
                    label,
                    div:not(.MuiAvatar-root):not(.MuiSwitch-thumb):not(.MuiSwitch-track):not([role="progressbar"]) {
                      color: #FFFFFF !important;
                    }
                    
                    .MuiChip-root.status-online *,
                    .MuiChip-root[color="success"] *,
                    .MuiChip-root[color="error"] *,
                    .MuiChip-root[color="warning"] *,
                    .MuiChip-root[color="info"] *,
                    a.MuiLink-root,
                    .MuiButton-containedPrimary,
                    .Mui-selected,
                    .MuiSwitch-thumb,
                    .MuiSwitch-track,
                    .MuiIcon-root,
                    .material-icons,
                    svg,
                    .MuiAvatar-root *,
                    img,
                    [role="progressbar"] * {
                      color: inherit !important;
                    }
                  `
                }}/>
              )}
              <Routes>
                <Route path="/street/blacklist" element={
                  <SessionProvider>
                    <LanguageProvider>
                      <MusicProvider>
                        <PostDetailProvider>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            minHeight: '100vh',
                            bgcolor: 'background.default'
                          }}>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                              <Suspense fallback={<LoadingIndicator />}>
                                <DefaultSEO />
                                <StreetBlacklistPage />
                                <MusicPlayerCore />
                              </Suspense>
                            </ErrorBoundary>
                          </Box>
                        </PostDetailProvider>
                      </MusicProvider>
                    </LanguageProvider>
                  </SessionProvider>
                } />
                <Route path="/street/blacklist/v1" element={
                  <SessionProvider>
                    <LanguageProvider>
                      <MusicProvider>
                        <PostDetailProvider>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            minHeight: '100vh',
                            bgcolor: 'background.default'
                          }}>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                              <Suspense fallback={<LoadingIndicator />}>
                                <DefaultSEO />
                                <StreetBlacklistV1Page />
                                <MusicPlayerCore />
                              </Suspense>
                            </ErrorBoundary>
                          </Box>
                        </PostDetailProvider>
                      </MusicProvider>
                    </LanguageProvider>
                  </SessionProvider>
                } />
                <Route path="*" element={
                  <SessionProvider>
                  <MessengerProvider>
                    <LanguageProvider>
                      <MusicProvider>
                        <PostDetailProvider>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              minHeight: '100vh',
                              bgcolor: 'background.default'
                            }}>
                              <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <Suspense fallback={<LoadingIndicator />}>
                                  <DefaultSEO />
                                  <Routes>
                                    <Route path="/rules" element={<PublicPages />} />
                                    <Route path="/privacy-policy" element={<PublicPages />} />
                                    <Route path="/terms-of-service" element={<PublicPages />} />
                                    <Route path="/about" element={<PublicPages />} />
                                    <Route path="/cookies" element={<PublicPages />} />
                                    <Route path="*" element={<AppRoutes />} />
                                  </Routes>
                                  <MusicPlayerCore />
                                </Suspense>
                              </ErrorBoundary>
                            </Box>
                        </PostDetailProvider>
                      </MusicProvider>
                    </LanguageProvider>
                    </MessengerProvider>
                  </SessionProvider>
                } />
              </Routes>
            </DefaultPropsProvider>
            {/* <CookieBanner /> */}
          </ThemeProvider>
        </ThemeSettingsContext.Provider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession Используйте SessionProvider для доступа к сессии');
  }
  return context;
};

const setCookie = (name, value, days = 365) => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (error) {
    console.error(`Ошибка при установке cookie ${name}:`, error);
  }
};

const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  } catch (error) {
    console.error(`Ошибка при получении cookie ${name}:`, error);
  }
  return null;
};

// Компонент для редиректа с /item/:itemId
function ItemRedirectPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!itemId) return;
    axios.get(`/api/inventory/item/${itemId}`)
      .then(res => {
        if (res.data && res.data.success && res.data.item && res.data.item.user && res.data.item.user.username) {
          navigate(`/profile/${res.data.item.user.username}?item=${itemId}`, { replace: true });
        } else {
          setError('Владелец предмета не найден');
        }
      })
      .catch(() => setError('Ошибка при получении информации о предмете'));
  }, [itemId, navigate]);

  if (error) {
    return <div style={{textAlign:'center',marginTop:40}}><h2>Ошибка</h2><p>{error}</p></div>;
  }
  return <div style={{textAlign:'center',marginTop:40}}><h2>Загрузка...</h2></div>;
}

function FriendsRedirect() {
  const { user } = useContext(AuthContext);
  if (user && user.username) {
    window.location.replace(`/friends/${user.username}`);
    return null;
  }
  // If not logged in, redirect to login or show error
  window.location.replace('/login');
  return null;
}
