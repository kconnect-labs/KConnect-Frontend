import React, { useState, useEffect, useMemo, useContext, lazy, Suspense, useTransition } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProfileService from './services/ProfileService'; 
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppBottomNavigation from './components/BottomNavigation';
import { MusicProvider } from './context/MusicContext';
import { Box, CircularProgress } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';

const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const RegisterProfile = lazy(() => import('./pages/Auth/RegisterProfile'));
const EmailConfirmation = lazy(() => import('./pages/Auth/EmailConfirmation'));
const ElementAuth = lazy(() => import('./pages/Auth/ElementAuth'));

const MainLayout = lazy(() => import('./components/Layout/MainLayout'));
const ProfilePage = lazy(() => import('./pages/User/ProfilePage'));
const MainPage = lazy(() => import('./pages/Main/MainPage'));
const PostDetailPage = lazy(() => import('./pages/Main/PostDetailPage'));
const SettingsPage = lazy(() => import('./pages/User/SettingsPage'));
const NotificationsPage = lazy(() => import('./pages/Info/NotificationsPage'));
const SearchPage = lazy(() => import('./pages/Main/SearchPage'));
const MusicPage = lazy(() => import('./pages/Main/MusicPage'));
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

const SharePreviewTest = lazy(() => import('./components/SharePreviewTest'));
const BadgeShopPage = lazy(() => import('./pages/Economic/BadgeShopPage'));
const BalancePage = lazy(() => import('./pages/Economic/BalancePage'));
const SimpleApiDocsPage = lazy(() => import('./pages/Info/SimpleApiDocsPage'));
const SubPlanes = lazy(() => import('./pages/Economic/SubPlanes'));

const MiniGamesPage = lazy(() => import('./pages/MiniGames/MiniGamesPage'));
const CupsGamePage = lazy(() => import('./pages/MiniGames/CupsGamePage'));
const LuckyNumberGame = lazy(() => import('./pages/MiniGames/LuckyNumberGame'));

export const ThemeSettingsContext = React.createContext({
  themeSettings: {
    mode: 'dark',
    primaryColor: '#D0BCFF',
    secondaryColor: '#f28c9a'
  },
  updateThemeSettings: () => {}
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

const AppRoutes = () => {
  const { user, isAuthenticated, loading, checkAuth, error, setUser } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  
  
  const [isPending, startTransition] = useTransition();
  
  
  useEffect(() => {
    
    const isAuthPage = ['/login', '/register', '/register/profile', '/confirm-email', '/auth_elem'].some(
      path => location.pathname.startsWith(path)
    );
    
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
    
    if (!isAuthPage && !error && !hasSavedLoginError) {
      console.log('Проверка авторизации при загрузке страницы...');
      const initAuth = async () => {
        
        startTransition(() => {
          checkAuth(true);
        });
      };
      
      initAuth();
    } else if (isAuthPage) {
      console.log('Пропускаем проверку авторизации на странице авторизации:', location.pathname);
    } else if (error) {
      console.log('Пропускаем проверку авторизации из-за наличия ошибки:', error);
    } else if (hasSavedLoginError) {
      console.log('Пропускаем проверку авторизации из-за наличия сохраненной ошибки входа');
    }
    
  }, [location.pathname]); 
  
  
  
  const currentPath = location.pathname;
  const isLoginPage = currentPath === '/login';
  const isRegisterPage = currentPath === '/register';
  const isElementAuthPage = currentPath.startsWith('/auth_elem') || currentPath === '/element-auth';
  
  
  
  if (isLoginPage || isRegisterPage) {
    return (
      <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Box>
    );
  }
  
  
  if (isElementAuthPage) {
    return (
      <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, display: 'flex', flexDirection: 'column' }}>
        <Routes location={location}>
          <Route path="/element-auth" element={<ElementAuth />} />
          <Route path="/auth_elem/:token" element={<ElementAuth />} />
          <Route path="/auth_elem/direct/:token" element={<ElementAuth />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    );
  }
  
  
  return (
    <MainLayout>
      <PageTransition>
        <Routes location={location}>
          <Route path="/register/profile" element={<RegisterProfile setUser={setUser} />} />
          <Route path="/confirm-email/:token" element={<EmailConfirmation />} />
          <Route path="/bugs" element={<BugReportPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/feed" element={<Navigate to="/" replace />} />
          <Route path="/main" element={<Navigate to="/" replace />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/profile/:username/followers" element={<SubscriptionsPage tabIndex={0} />} />
          <Route path="/profile/:username/following" element={<SubscriptionsPage tabIndex={1} />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/music" element={<MusicPage />} />
          {}
          <Route path="/share-preview-test" element={<SharePreviewTest />} />
          <Route path="/bugs" element={<BugReportPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/moderator" element={<ModeratorPage />} />
          <Route path="/badge-shop" element={<BadgeShopPage />} />
          {}
          <Route path="/minigames" element={<MiniGamesPage />} />
          <Route path="/minigames/cups" element={<CupsGamePage />} />
          <Route path="/minigames/lucky-number" element={<LuckyNumberGame />} />
          <Route path="/balance" element={<BalancePage />} />
          <Route path="/api-docs" element={<SimpleApiDocsPage />} />
          <Route path="/sub-planes" element={<SubPlanes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <AppBottomNavigation user={user} />
    </MainLayout>
  );
};

const MemoizedAppRoutes = React.memo(AppRoutes);

const preloadMusicImages = () => {
  
  const basePaths = [
    '/static/uploads/system',
    '/uploads/system'
  ];
  
  const imageFiles = [
    'like_playlist.jpg',
    'all_tracks.jpg',
    'random_tracks.jpg',
    'album_placeholder.jpg',
    'playlist_placeholder.jpg'
  ];
  
  
  basePaths.forEach(basePath => {
    imageFiles.forEach(file => {
      const path = `${basePath}/${file}`;
      const img = new Image();
      img.src = path;
      img.onerror = () => {
        console.warn(`Image not found: ${path}. Using gradient placeholder.`);
      };
    });
  });
};

const DefaultSEO = () => {
  return (
    <SEO 
      title="К-Коннект" 
      description="К-Коннект - социальная сеть от независимого разработчика с функциями для общения, публикации постов, музыки и многого другого."
      image="/icon-512.png"
      type="website"
      meta={{
        keywords: "социальная сеть, к-коннект, общение, музыка, лента, сообщения",
        viewport: "width=device-width, initial-scale=1, maximum-scale=5"
      }}
    />
  );
};

function App() {
  
  const [isPending, startTransition] = useTransition();
  const [themeSettings, setThemeSettings] = useState({
    mode: localStorage.getItem('theme') || 'dark',
    primaryColor: localStorage.getItem('primaryColor') || '#D0BCFF',
    secondaryColor: localStorage.getItem('secondaryColor') || '#f28c9a'
  });
  
  
  useEffect(() => {
    preloadMusicImages();
  }, []);

  
  const getContrastTextColor = (hexColor) => {
    
    const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
    
    
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  
  const loadThemeSettings = async (forceDefault = false) => {
    try {
      if (forceDefault) {
        
        const defaultSettings = {
          background_color: '#131313',
          container_color: '#1A1A1A',
          header_color: '#1A1A1A',
          bottom_nav_color: '#1A1A1A',
          content_color: '#1A1A1A',
          welcome_bubble_color: '#131313',
          avatar_border_color: '#D0BCFF'
        };
        applyThemeSettings(defaultSettings);
        return;
      }

      const response = await ProfileService.getSettings();
      if (response && response.success && response.settings) {
        applyThemeSettings(response.settings);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
      
      applyThemeSettings({
        background_color: '#131313',
        container_color: '#1A1A1A',
        header_color: '#1A1A1A',
        bottom_nav_color: '#1A1A1A',
        content_color: '#1A1A1A',
        welcome_bubble_color: '#131313',
        avatar_border_color: '#D0BCFF'
      });
    }
  };

  
  const applyThemeSettings = (settings) => {
    
    const backgroundColor = settings.background_color || '#131313';
    const containerColor = settings.container_color || '#1A1A1A';
    const headerColor = settings.header_color || settings.container_color || '#1A1A1A';
    const bottomNavColor = settings.bottom_nav_color || settings.container_color || '#1A1A1A';
    const contentColor = settings.content_color || settings.container_color || '#1A1A1A';
    const welcomeBubbleColor = settings.welcome_bubble_color || '#131313';
    const primaryColor = settings.avatar_border_color || '#D0BCFF';

    
    const backgroundTextColor = getContrastTextColor(backgroundColor);
    const containerTextColor = getContrastTextColor(containerColor);
    const headerTextColor = getContrastTextColor(headerColor);
    const contentTextColor = getContrastTextColor(contentColor);
    const bottomNavTextColor = getContrastTextColor(bottomNavColor);

    
    updateThemeSettings({
      backgroundColor: backgroundColor,
      paperColor: containerColor,
      headerColor: headerColor,
      bottomNavColor: bottomNavColor,
      contentColor: contentColor,
      primaryColor: primaryColor,
      textColor: containerTextColor
    });
    
    
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--container-color', containerColor);
    document.documentElement.style.setProperty('--header-color', headerColor);
    document.documentElement.style.setProperty('--bottom-nav-color', bottomNavColor);
    document.documentElement.style.setProperty('--content-color', contentColor);
    document.documentElement.style.setProperty('--welcome-bubble-color', welcomeBubbleColor);
    document.documentElement.style.setProperty('--avatar-border-color', primaryColor);
    
    
    document.documentElement.style.setProperty('--background-text-color', backgroundTextColor);
    document.documentElement.style.setProperty('--container-text-color', containerTextColor);
    document.documentElement.style.setProperty('--header-text-color', headerTextColor);
    document.documentElement.style.setProperty('--content-text-color', contentTextColor);
    document.documentElement.style.setProperty('--bottom-nav-text-color', bottomNavTextColor);
    
    
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--primary-light', primaryColor);
    document.documentElement.style.setProperty('--primary-dark', primaryColor);
  };
  
  
  const authContextValue = useContext(AuthContext) || {};
  
  
  useEffect(() => {
    if (authContextValue.isAuthenticated) {
      
      loadThemeSettings();
    } else if (!authContextValue.loading) {
      
      loadThemeSettings(true);
    }
  }, [authContextValue.isAuthenticated, authContextValue.loading]);
  
  
  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  
  const theme = useMemo(() => {
    const themeObj = createTheme({
      palette: {
        mode: themeSettings.mode === 'dark' ? 'dark' : 'light',
        primary: {
          main: themeSettings.primaryColor || '#D0BCFF',
          light: themeSettings.primaryColor || '#E9DDFF',
          dark: themeSettings.primaryColor || '#B69DF8',
        },
        secondary: {
          main: themeSettings.secondaryColor || '#f28c9a',
        },
        background: {
          default: themeSettings.backgroundColor || '#131313',
          paper: themeSettings.paperColor || '#1A1A1A',
        },
        text: {
          primary: themeSettings.textColor || '#FFFFFF',
          secondary: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        header: {
          main: themeSettings.headerColor || '#000000',
          contrastText: getContrastTextColor(themeSettings.headerColor || '#1A1A1A'),
        },
        bottomNav: {
          main: themeSettings.bottomNavColor || '#1A1A1A',
          contrastText: getContrastTextColor(themeSettings.bottomNavColor || '#1A1A1A'),
        },
        content: {
          main: themeSettings.contentColor || '#1A1A1A',
          contrastText: getContrastTextColor(themeSettings.contentColor || '#1A1A1A'),
        },
      },
      typography: {
        fontFamily: '"Roboto", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 700 },
        h3: { fontSize: '1.8rem', fontWeight: 600 },
        h4: { fontSize: '1.5rem', fontWeight: 600 },
        h5: { fontSize: '1.2rem', fontWeight: 500 },
        h6: { fontSize: '1rem', fontWeight: 500 },
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
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: '15px', 
              overflow: 'hidden',
              backgroundColor: themeSettings.contentColor || themeSettings.paperColor || '#1A1A1A',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: '12px', 
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: themeSettings.headerColor || themeSettings.paperColor || '#1A1A1A',
              color: getContrastTextColor(themeSettings.headerColor || themeSettings.paperColor || '#1A1A1A'),
            },
          },
        },
        MuiBottomNavigation: {
          styleOverrides: {
            root: {
              backgroundColor: themeSettings.bottomNavColor || themeSettings.paperColor || '#1A1A1A',
            },
          },
        },
        MuiBottomNavigationAction: {
          styleOverrides: {
            root: {
              color: getContrastTextColor(themeSettings.bottomNavColor || themeSettings.paperColor || '#1A1A1A'),
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px', 
                '& fieldset': {
                  borderColor: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: themeSettings.primaryColor || '#D0BCFF', 
                },
              },
              '& .MuiInputLabel-root': {
                color: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-focused': {
                  color: themeSettings.primaryColor || '#D0BCFF', 
                },
              },
            },
          },
        },
      },
    });
    return themeObj;
  }, [themeSettings]);

  
  const themeContextValue = useMemo(() => ({
    themeSettings,
    updateThemeSettings,
    loadThemeSettings
  }), [themeSettings]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeSettingsContext.Provider value={themeContextValue}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MusicProvider>
              <Suspense fallback={<LoadingIndicator />}>
                <DefaultSEO />
                <AppRoutes />
              </Suspense>
            </MusicProvider>
          </ThemeProvider>
        </ThemeSettingsContext.Provider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
