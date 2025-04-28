import React, { useState, useEffect, useMemo, useContext, lazy, Suspense, useTransition } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProfileService from './services/ProfileService'; 
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppBottomNavigation from './components/BottomNavigation';
import { MusicProvider } from './context/MusicContext';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';
import { PostDetailProvider } from './context/PostDetailContext';
import RegisterChannel from './pages/Auth/RegisterChannel';
import { ErrorBoundary } from 'react-error-boundary';
import ChannelsPage from './pages/Main/ChannelsPage';

// RequireAuth component for protected routes
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  
  // If still loading auth state, show nothing to prevent flash of redirect
  if (loading) {
    return null;
  }
  
  // If authenticated, render the protected route
  if (isAuthenticated) {
    return children;
  }
  
  // If not authenticated, redirect to login with return path
  return (
    <Navigate 
      to="/login" 
      state={{ from: location.pathname }} 
      replace 
    />
  );
};

// Страницы с ленивой загрузкой для оптимизации производительности
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const RegisterProfile = lazy(() => import('./pages/Auth/RegisterProfile'));
const EmailConfirmation = lazy(() => import('./pages/Auth/EmailConfirmation'));
const ElementAuth = lazy(() => import('./pages/Auth/ElementAuth'));

// Ленивая загрузка основных компонентов
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
// const MessengerPage = lazy(() => import('./pages/Messenger/MessengerPage'));
const SharePreviewTest = lazy(() => import('./components/SharePreviewTest'));
const BadgeShopPage = lazy(() => import('./pages/Economic/BadgeShopPage'));
const BalancePage = lazy(() => import('./pages/Economic/BalancePage'));
const SimpleApiDocsPage = lazy(() => import('./pages/Info/SimpleApiDocsPage'));
const SubPlanes = lazy(() => import('./pages/Economic/SubPlanes'));
// const ClickerPage = lazy(() => import('./pages/MiniGames/ClickerPage'));
const MiniGamesPage = lazy(() => import('./pages/MiniGames/MiniGamesPage'));
const CupsGamePage = lazy(() => import('./pages/MiniGames/CupsGamePage'));
const LuckyNumberGame = lazy(() => import('./pages/MiniGames/LuckyNumberGame'));
const AboutPage = lazy(() => import('./pages/Info/AboutPage'));

// Создание контекста для темы
export const ThemeSettingsContext = React.createContext({
  themeSettings: {
    mode: 'dark',
    primaryColor: '#D0BCFF',
    secondaryColor: '#f28c9a'
  },
  updateThemeSettings: () => {}
});

// Fallback для Suspense - показывается во время загрузки компонентов
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

// Обертка для анимации перехода между страницами
const PageTransition = ({ children }) => {
  return children;
};

// Индикатор загрузки приложения
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

// Проверяем, находимся ли мы на поддомене about
const isAboutSubdomain = () => {
  const hostname = window.location.hostname;
  return hostname === 'about.k-connect.ru';
};

// Правка для компонента AboutRoute - сделать его максимально простым
const AboutRoute = () => {
  return <AboutPage />;
};

// Компонент для обработки ошибок UI
const ErrorFallback = ({ error, resetErrorBoundary }) => {
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
      <Button 
        variant="contained" 
        onClick={resetErrorBoundary || (() => window.location.reload())}
      >
        Перезагрузить
      </Button>
    </Box>
  );
};

// Компонент для статичного отображения контента (общий для всех страниц)
const AppRoutes = () => {
  const { user, isAuthenticated, loading, checkAuth, error, setUser } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  
  // Get the background location from location state
  const background = location.state && location.state.background;
  
  // Используем useTransition для улучшения отзывчивости UI
  const [isPending, startTransition] = useTransition();
  
  // Проверяем авторизацию только один раз при монтировании и не делаем это на странице логина
  useEffect(() => {
    // Страницы входа и регистрации - не проверяем авторизацию автоматически
    const isAuthPage = ['/login', '/register', '/register/profile', '/confirm-email', '/auth_elem', '/about'].some(
      path => location.pathname.startsWith(path)
    );
    
    const hasSavedLoginError = !!localStorage.getItem('login_error');
    const authSuccessFlag = localStorage.getItem('auth_success') === 'true';
    
    // Если был успешный вход и пользователь перенаправлен на главную, очищаем флаг
    if (authSuccessFlag && location.pathname === '/') {
      console.log('Обнаружен флаг успешной авторизации, применяем сессию');
      localStorage.removeItem('auth_success');
      // Принудительно проверяем состояние авторизации
      startTransition(() => {
        checkAuth(true);
      });
      return;
    }
    
    if (!isAuthPage && !error && !hasSavedLoginError) {
      console.log('Проверка авторизации при загрузке страницы...');
      const initAuth = async () => {
        // Используем startTransition для плавного обновления UI
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Зависимость от пути страницы
  
  // ПРОСТАЯ ЛОГИКА: Только на /login и /register показываем формы логина
  // На всех остальных страницах показываем основной контент
  const currentPath = location.pathname;
  const isLoginPage = currentPath === '/login';
  const isRegisterPage = currentPath === '/register';
  const isElementAuthPage = currentPath.startsWith('/auth_elem') || currentPath === '/element-auth';
  
  // Отображаем адаптированную страницу логина/регистрации только если пользователь
  // специально перешел на эти страницы
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
  
  // Для страниц Element Auth показываем только компонент авторизации без основного layout
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
  
  // Главный компонент Routes
  return (
    <MainLayout>
      <PageTransition>
        <Routes location={background || location}>
          
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/about" element={<AboutPage />} />
          
          
          <Route path="/register/profile" element={<RegisterProfile setUser={setUser} />} />
          <Route path="/register/channel" element={<RegisterChannel />} />
          <Route path="/confirm-email/:token" element={<EmailConfirmation />} />
          
          
          <Route path="/" element={isAuthenticated ? <MainPage /> : <Navigate to="/login" replace />} />
          <Route path="/feed" element={<Navigate to="/" replace />} />
          <Route path="/main" element={<Navigate to="/" replace />} />
          
          
          <Route path="/post/:postId" element={isAuthenticated ? <PostDetailPage /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="/profile/:username" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="/profile/:username/followers" element={isAuthenticated ? <SubscriptionsPage tabIndex={0} /> : <Navigate to="/login" replace />} />
          <Route path="/profile/:username/following" element={isAuthenticated ? <SubscriptionsPage tabIndex={1} /> : <Navigate to="/login" replace />} />
          <Route path="/subscriptions" element={isAuthenticated ? <SubscriptionsPage /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
          <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" replace />} />
          <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />} />
          <Route path="/music" element={isAuthenticated ? <MusicPage /> : <Navigate to="/login" replace />} />
          <Route path="/bugs" element={<RequireAuth><BugReportPage /></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth><LeaderboardPage /></RequireAuth>} />


          
          <Route path="/share-preview-test" element={isAuthenticated ? <SharePreviewTest /> : <Navigate to="/login" replace />} />
          <Route path="/more" element={isAuthenticated ? <MorePage /> : <Navigate to="/login" replace />} />
          <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" replace />} />
          <Route path="/moderator" element={isAuthenticated ? <ModeratorPage /> : <Navigate to="/login" replace />} />
          <Route path="/badge-shop" element={isAuthenticated ? <BadgeShopPage /> : <Navigate to="/login" replace />} />
          
          <Route path="/minigames" element={isAuthenticated ? <MiniGamesPage /> : <Navigate to="/login" replace />} />
          <Route path="/minigames/cups" element={isAuthenticated ? <CupsGamePage /> : <Navigate to="/login" replace />} />
          <Route path="/minigames/lucky-number" element={isAuthenticated ? <LuckyNumberGame /> : <Navigate to="/login" replace />} />
          <Route path="/balance" element={isAuthenticated ? <BalancePage /> : <Navigate to="/login" replace />} />
          <Route path="/api-docs" element={isAuthenticated ? <SimpleApiDocsPage /> : <Navigate to="/login" replace />} />
          <Route path="/sub-planes" element={isAuthenticated ? <SubPlanes /> : <Navigate to="/login" replace />} />
          <Route path="/channels" element={<RequireAuth><ChannelsPage /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        
        {background && (
          <Routes>
            <Route 
              path="/post/:postId" 
              element={
                isAuthenticated ? <PostDetailPage isOverlay={true} /> : <Navigate to="/login" replace />
              } 
            />
          </Routes>
        )}
      </PageTransition>
      <AppBottomNavigation user={user} />
    </MainLayout>
  );
};

// Мемоизированный AppRoutes для предотвращения лишних перерисовок
const MemoizedAppRoutes = React.memo(AppRoutes);

// Preload required images for music player
const preloadMusicImages = () => {
  // Paths to check - try both with and without /static prefix
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
  
  // Try all combinations of paths
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

// Создаем компонент DefaultSEO для установки дефолтных SEO-метаданных
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
  const [themeSettings, setThemeSettings] = useState(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedThemeMode = localStorage.getItem('themeMode') || savedTheme; 
    
    return {
      mode: savedThemeMode,
      backgroundColor: localStorage.getItem('backgroundColor') || 
                      (savedThemeMode === 'light' ? '#f5f5f5' : '#131313'),
      paperColor: localStorage.getItem('paperColor') || 
                 (savedThemeMode === 'light' ? '#ffffff' : '#1A1A1A'),
      headerColor: localStorage.getItem('headerColor') || 
                  (savedThemeMode === 'light' ? '#ffffff' : '#121212'),
      bottomNavColor: localStorage.getItem('bottomNavColor') || 
                     (savedThemeMode === 'light' ? '#ffffff' : '#1A1A1A'),
      contentColor: localStorage.getItem('contentColor') || 
                   (savedThemeMode === 'light' ? '#ffffff' : '#1A1A1A'),
      primaryColor: localStorage.getItem('primaryColor') || 
                   (savedThemeMode === 'light' ? '#8c52ff' : '#D0BCFF'),
      textColor: localStorage.getItem('textColor') || 
                (savedThemeMode === 'light' ? '#121212' : '#FFFFFF'),
    };
  });
  
  // Determine if we're on about subdomain
  const onAboutSubdomain = useMemo(() => isAboutSubdomain(), []);
  
  // Preload images when app starts
  useEffect(() => {
    preloadMusicImages();
  }, []);

  // Function to calculate contrast color (black or white) based on background
  const getContrastTextColor = (hexColor) => {
    // Dark mode should always have white text on components
    if (themeSettings.mode === 'dark') {
      return '#FFFFFF';
    }
    
    // For light mode, calculate based on background color
    // Handle empty or invalid values
    if (!hexColor || typeof hexColor !== 'string') {
      return '#000000'; // Default to black for light mode
    }
    
    // Remove the # if present
    const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
    
    // Handle invalid hex values
    if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
      console.warn('Invalid hex color provided to getContrastTextColor:', hexColor);
      return '#000000';
    }
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Calculate relative luminance (per WCAG 2.0)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark ones
    return luminance > 0.6 ? '#000000' : '#FFFFFF';
  };

  // Загрузка настроек темы из сервера
  const loadThemeSettings = async (forceDefault = false) => {
    try {
      if (forceDefault) {
        // Use default settings
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
      // Fallback to default settings on error
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

  // Function to apply theme settings
  const applyThemeSettings = (settings) => {
    // Extract background colors for each UI element
    const backgroundColor = settings.background_color || '#131313';
    const containerColor = settings.container_color || '#1A1A1A';
    const headerColor = settings.header_color || settings.container_color || '#1A1A1A';
    const bottomNavColor = settings.bottom_nav_color || settings.container_color || '#1A1A1A';
    const contentColor = settings.content_color || settings.container_color || '#1A1A1A';
    const welcomeBubbleColor = settings.welcome_bubble_color || '#131313';
    const primaryColor = settings.avatar_border_color || '#D0BCFF';

    // Calculate contrast text colors
    const backgroundTextColor = getContrastTextColor(backgroundColor);
    const containerTextColor = getContrastTextColor(containerColor);
    const headerTextColor = getContrastTextColor(headerColor);
    const contentTextColor = getContrastTextColor(contentColor);
    const bottomNavTextColor = getContrastTextColor(bottomNavColor);

    // Update theme settings state with text colors explicitly included
    updateThemeSettings({
      backgroundColor: backgroundColor,
      paperColor: containerColor,
      headerColor: headerColor,
      bottomNavColor: bottomNavColor,
      contentColor: contentColor,
      primaryColor: primaryColor,
      textColor: containerTextColor,
      headerTextColor: headerTextColor,
      contentTextColor: contentTextColor,
      bottomNavTextColor: bottomNavTextColor,
      backgroundTextColor: backgroundTextColor
    });
    
    // Apply settings to CSS variables
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--container-color', containerColor);
    document.documentElement.style.setProperty('--header-color', headerColor);
    document.documentElement.style.setProperty('--bottom-nav-color', bottomNavColor);
    document.documentElement.style.setProperty('--content-color', contentColor);
    document.documentElement.style.setProperty('--welcome-bubble-color', welcomeBubbleColor);
    document.documentElement.style.setProperty('--avatar-border-color', primaryColor);
    
    // Apply text colors
    document.documentElement.style.setProperty('--background-text-color', backgroundTextColor);
    document.documentElement.style.setProperty('--container-text-color', containerTextColor);
    document.documentElement.style.setProperty('--header-text-color', headerTextColor);
    document.documentElement.style.setProperty('--content-text-color', contentTextColor);
    document.documentElement.style.setProperty('--bottom-nav-text-color', bottomNavTextColor);
    
    // Set accent colors
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--primary-light', primaryColor);
    document.documentElement.style.setProperty('--primary-dark', primaryColor);
    
    console.log('Theme settings applied:', {
      backgroundColor, 
      containerColor, 
      headerColor, 
      bottomNavColor, 
      contentColor,
      backgroundTextColor, 
      containerTextColor,
      headerTextColor,
      contentTextColor,
      bottomNavTextColor
    });
  };
  
  // Hook to Auth context to detect login/logout
  const authContextValue = useContext(AuthContext) || {};
  
  // Watch for auth state changes to load or reset theme settings
  useEffect(() => {
    if (authContextValue.isAuthenticated) {
      // User logged in - load their theme settings
      loadThemeSettings();
    } else if (!authContextValue.loading) {
      // User logged out and not in loading state - reset to defaults
      loadThemeSettings(true);
    }
  }, [authContextValue.isAuthenticated, authContextValue.loading]);
  
  // Функция для обновления настроек темы
  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // When theme settings are updated, save to localStorage
      if (newSettings.mode) {
        localStorage.setItem('theme', newSettings.mode);
        localStorage.setItem('themeMode', newSettings.mode); // Save to additional key for persistence
      }
      if (newSettings.backgroundColor) localStorage.setItem('backgroundColor', newSettings.backgroundColor);
      if (newSettings.paperColor) localStorage.setItem('paperColor', newSettings.paperColor);
      if (newSettings.headerColor) localStorage.setItem('headerColor', newSettings.headerColor);
      if (newSettings.bottomNavColor) localStorage.setItem('bottomNavColor', newSettings.bottomNavColor);
      if (newSettings.contentColor) localStorage.setItem('contentColor', newSettings.contentColor);
      if (newSettings.primaryColor) localStorage.setItem('primaryColor', newSettings.primaryColor);
      if (newSettings.textColor) localStorage.setItem('textColor', newSettings.textColor);
      
      return updated;
    });
  };

  // Создаем тему на основе настроек
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
          primary: themeSettings.textColor || 
                  (themeSettings.mode === 'dark' ? '#FFFFFF' : '#121212'),
          secondary: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        header: {
          main: themeSettings.headerColor || themeSettings.paperColor || '#1A1A1A',
          contrastText: themeSettings.headerTextColor || 
                        (themeSettings.mode === 'dark' ? '#FFFFFF' : '#121212'),
        },
        bottomNav: {
          main: themeSettings.bottomNavColor || themeSettings.paperColor || '#1A1A1A',
          contrastText: themeSettings.bottomNavTextColor || 
                        (themeSettings.mode === 'dark' ? '#FFFFFF' : '#121212'),
        },
        content: {
          main: themeSettings.contentColor || themeSettings.paperColor || '#1A1A1A',
          contrastText: themeSettings.contentTextColor || 
                        (themeSettings.mode === 'dark' ? '#FFFFFF' : '#121212'),
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
        borderRadius: 12, // Скругление для всех элементов 12px
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px', // Скругление для кнопок
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              lineHeight: 1,
              backgroundColor: themeSettings.backgroundColor || '#131313',
              color: themeSettings.textColor || (themeSettings.mode === 'light' ? '#121212' : '#FFFFFF'),
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: '15px', // Скругление для карточек
              overflow: 'hidden',
              backgroundColor: themeSettings.contentColor || themeSettings.paperColor || '#1A1A1A',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: '12px', // Скругление для Paper
              backgroundColor: themeSettings.paperColor || '#1A1A1A',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: themeSettings.headerColor || themeSettings.paperColor || '#1A1A1A',
              color: themeSettings.headerTextColor || getContrastTextColor(themeSettings.headerColor || '#1A1A1A'),
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
              color: themeSettings.mode === 'dark' ? '#FFFFFF' : themeSettings.bottomNavTextColor || getContrastTextColor(themeSettings.bottomNavColor || '#1A1A1A'),
              '&.Mui-selected': {
                color: themeSettings.primaryColor || '#D0BCFF',
              },
            },
            label: {
              color: 'inherit',
              '&.Mui-selected': {
                color: 'inherit',
              },
            },
            iconOnly: {
              color: 'inherit',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px', // Скругление для текстовых полей
                '& fieldset': {
                  borderColor: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: themeSettings.primaryColor || '#D0BCFF', // Основной цвет для обводки при фокусе
                },
              },
              '& .MuiInputLabel-root': {
                color: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-focused': {
                  color: themeSettings.primaryColor || '#D0BCFF', // Основной цвет для лейбла при фокусе
                },
              },
            },
          },
        },
      },
    });
    return themeObj;
  }, [themeSettings]);

  // Оптимизация для контекста темы
  const themeContextValue = useMemo(() => ({
    themeSettings,
    updateThemeSettings,
    loadThemeSettings
  }), [themeSettings]);

  // Быстрый прямой доступ к публичным страницам (about, rules, и т.д.)
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Быстрый прямой доступ к публичным страницам (about, rules, и т.д.)
  const isPublicPage = currentPath === '/about' || 
                        currentPath === '/rules' || 
                        currentPath === '/privacy-policy' || 
                        currentPath === '/terms-of-service';
  
  // Публичные страницы доступны без авторизации
  if (isPublicPage) {
    let PublicPage;
    
    if (currentPath === '/about') PublicPage = AboutPage;
    else if (currentPath === '/rules') PublicPage = RulesPage;
    else if (currentPath === '/privacy-policy') PublicPage = PrivacyPolicyPage;
    else if (currentPath === '/terms-of-service') PublicPage = TermsOfServicePage;
    
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}>
          <Suspense fallback={<LoadingIndicator />}>
            <PublicPage />
          </Suspense>
        </Box>
      </ThemeProvider>
    );
  }
  
  // Упрощенный рендеринг для поддомена
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

  // Explicitly save theme mode to ensure it persists
  useEffect(() => {
    // Make sure themeMode is always saved, regardless of where the mode came from
    localStorage.setItem('themeMode', themeSettings.mode);
  }, [themeSettings.mode]);

  // Ensure theme consistency by checking localStorage on each render
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode');
    // If mode in state doesn't match localStorage, update it
    if (savedThemeMode && savedThemeMode !== themeSettings.mode) {
      console.log('Theme mode mismatch, restoring from localStorage');
      updateThemeSettings({ mode: savedThemeMode });
    }
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeSettingsContext.Provider value={themeContextValue}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MusicProvider>
              <PostDetailProvider>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                  }}>
                    <Suspense fallback={<LoadingIndicator />}>
                      <DefaultSEO />
                      <AppRoutes />
                    </Suspense>
                  </Box>
                </ErrorBoundary>
              </PostDetailProvider>
            </MusicProvider>
          </ThemeProvider>
        </ThemeSettingsContext.Provider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
