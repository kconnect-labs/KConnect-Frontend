import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProfileService from './services/ProfileService'; 
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppBottomNavigation from './components/BottomNavigation';
import { MusicProvider } from './context/MusicContext';
import { Box } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';

// Страницы
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterProfile from './pages/RegisterProfile';
import EmailConfirmation from './pages/EmailConfirmation';
import ElementAuth from './pages/ElementAuth'; // Новая страница для Element авторизации

// Новые компоненты для улучшенного интерфейса
import MainLayout from './components/Layout/MainLayout';
import ProfilePage from './pages/ProfilePage'; // Улучшенный профиль
import MainPage from './pages/MainPage'; // Новая главная страница
import PostDetailPage from './pages/PostDetailPage'; // Страница деталей поста
import SettingsPage from './pages/SettingsPage'; // Страница настроек профиля
import NotificationsPage from './pages/NotificationsPage';
import SearchPage from './pages/SearchPage'; // Страница поиска
import MusicPage from './pages/MusicPage'; // Страница музыки
import SubscriptionsPage from './pages/SubscriptionsPage'; // Страница подписок
import BugReportPage from './pages/BugReportPage'; // Страница баг-репортов
import LeaderboardPage from './pages/LeaderboardPage'; // Страница лидерборда
import RulesPage from './pages/RulesPage'; // Страница правил
import MorePage from './pages/MorePage'; // Страница "Еще" для мобильного вида
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import ModeratorPage from './pages/ModeratorPage'; // Страница модератора
import MessengerPage from './pages/Messenger/MessengerPage'; // Новая страница мессенджера
import SharePreviewTest from './components/SharePreviewTest'; // Компонент тестирования превью
import BadgeShopPage from './pages/BadgeShopPage'; // Страница магазина бейджиков
import BalancePage from './pages/BalancePage'; // Новая страница баланса
import SimpleApiDocsPage from './pages/SimpleApiDocsPage'; // Простая страница документации API

// Создание контекста для темы
export const ThemeSettingsContext = React.createContext({
  themeSettings: {
    mode: 'dark',
    primaryColor: '#D0BCFF',
    secondaryColor: '#f28c9a'
  },
  updateThemeSettings: () => {}
});

// Мемоизированные компоненты страниц для предотвращения перерисовки
const MemoizedMainPage = React.memo(MainPage);
const MemoizedProfilePage = React.memo(ProfilePage);
const MemoizedPostDetailPage = React.memo(PostDetailPage);
const MemoizedSettingsPage = React.memo(SettingsPage);
const MemoizedNotificationsPage = React.memo(NotificationsPage);
const MemoizedSearchPage = React.memo(SearchPage);
const MemoizedMusicPage = React.memo(MusicPage);
const MemoizedSubscriptionsPage = React.memo(SubscriptionsPage);
const MemoizedBugReportPage = React.memo(BugReportPage);
const MemoizedLeaderboardPage = React.memo(LeaderboardPage); // Мемоизируем компонент лидерборда
const MemoizedRulesPage = React.memo(RulesPage); // Мемоизируем компонент правил
const MemoizedMorePage = React.memo(MorePage); // Мемоизируем страницу "Еще"
const MemoizedNotFound = React.memo(NotFound);
const MemoizedAdminPage = React.memo(AdminPage); // Мемоизируем страницу админа
const MemoizedModeratorPage = React.memo(ModeratorPage); // Мемоизируем страницу модератора
const MemoizedMessengerPage = React.memo(MessengerPage); // Мемоизируем компонент мессенджера
const MemoizedSharePreviewTest = React.memo(SharePreviewTest); // Мемоизируем компонент тестирования превью
const MemoizedBadgeShopPage = React.memo(BadgeShopPage);
const MemoizedBalancePage = React.memo(BalancePage); // Мемоизируем страницу баланса
const MemoizedSimpleApiDocsPage = React.memo(SimpleApiDocsPage); // Мемоизируем новую страницу документации API

// Обертка для анимации перехода между страницами
const PageTransition = ({ children }) => {
  return children;
};

// Индикатор загрузки приложения
const LoadingIndicator = () => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{ 
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
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7] 
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <Box 
          component="img" 
          src="/static/logo-icon.png" 
          alt="K-Connect"
          sx={{ 
            width: 80, 
            height: 80,
            filter: 'drop-shadow(0 0 8px rgba(208, 188, 255, 0.4))'
          }} 
        />
      </motion.div>
    </motion.div>
  );
};

// Компонент для статичного отображения контента (общий для всех страниц)
const AppRoutes = () => {
  const { user, isAuthenticated, loading, checkAuth, error, setUser } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  
  // Проверяем авторизацию только один раз при монтировании и не делаем это на странице логина
  useEffect(() => {
    // Страницы входа и регистрации - не проверяем авторизацию автоматически
    const isAuthPage = ['/login', '/register', '/register/profile', '/confirm-email', '/auth_elem'].some(
      path => location.pathname.startsWith(path)
    );
    
    const hasSavedLoginError = !!localStorage.getItem('login_error');
    const authSuccessFlag = localStorage.getItem('auth_success') === 'true';
    
    // Если был успешный вход и пользователь перенаправлен на главную, очищаем флаг
    if (authSuccessFlag && location.pathname === '/') {
      console.log('Обнаружен флаг успешной авторизации, применяем сессию');
      localStorage.removeItem('auth_success');
      // Принудительно проверяем состояние авторизации
      checkAuth(true);
      return;
    }
    
    if (!isAuthPage && !error && !hasSavedLoginError) {
      console.log('Проверка авторизации при загрузке страницы...');
      const initAuth = async () => {
        // Принудительно проверяем авторизацию при каждой загрузке любой страницы, кроме auth страниц
        await checkAuth(true);
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
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
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
  
  // Для всех остальных страниц показываем основную структуру с навигацией
  return (
    <MainLayout>
      <PageTransition>
        <Routes location={location}>
          <Route path="/register/profile" element={<RegisterProfile setUser={setUser} />} />
          <Route path="/confirm-email/:token" element={<EmailConfirmation />} />
          <Route path="/bugs" element={<MemoizedBugReportPage />} />
          <Route path="/" element={<MemoizedMainPage />} />
          <Route path="/feed" element={<Navigate to="/" replace />} />
          <Route path="/main" element={<Navigate to="/" replace />} />
          <Route path="/post/:postId" element={<MemoizedPostDetailPage />} />
          <Route path="/profile" element={<MemoizedProfilePage />} />
          <Route path="/profile/:username" element={<MemoizedProfilePage />} />
          <Route path="/profile/:username/followers" element={<MemoizedSubscriptionsPage tabIndex={0} />} />
          <Route path="/profile/:username/following" element={<MemoizedSubscriptionsPage tabIndex={1} />} />
          <Route path="/subscriptions" element={<MemoizedSubscriptionsPage />} />
          <Route path="/settings" element={<MemoizedSettingsPage />} />
          <Route path="/notifications" element={<MemoizedNotificationsPage />} />
          <Route path="/search" element={<MemoizedSearchPage />} />
          <Route path="/music" element={<MemoizedMusicPage />} />
          <Route path="/messenger" element={<MemoizedMessengerPage />} />
          <Route path="/messenger/:userId" element={<MemoizedMessengerPage />} />
          <Route path="/share-preview-test" element={<MemoizedSharePreviewTest />} />
          <Route path="/bugs" element={<MemoizedBugReportPage />} />
          <Route path="/leaderboard" element={<MemoizedLeaderboardPage />} />
          <Route path="/rules" element={<MemoizedRulesPage />} />
          <Route path="/more" element={<MemoizedMorePage />} />
          <Route path="/admin" element={<MemoizedAdminPage />} />
          <Route path="/moderator" element={<MemoizedModeratorPage />} />
          <Route path="/badge-shop" element={<MemoizedBadgeShopPage />} />
          <Route path="/balance" element={<MemoizedBalancePage />} />
          <Route path="/api-docs" element={<MemoizedSimpleApiDocsPage />} />
          <Route path="*" element={<MemoizedNotFound />} />
        </Routes>
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
  const [themeSettings, setThemeSettings] = useState({
    mode: localStorage.getItem('themeMode') || 'dark',
    primaryColor: '#D0BCFF',
    secondaryColor: '#f28c9a',
    backgroundColor: '#131313',
    paperColor: '#1A1A1A',
    headerColor: '#1A1A1A',
    bottomNavColor: '#1A1A1A',
    contentColor: '#1A1A1A',
    textColor: '#FFFFFF',
  });
  
  // Preload images when app starts
  useEffect(() => {
    preloadMusicImages();
  }, []);

  // Function to calculate contrast color (black or white) based on background
  const getContrastTextColor = (hexColor) => {
    // Remove the # if present
    const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Calculate relative luminance (per WCAG 2.0)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark ones
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
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

    // Update theme settings state
    updateThemeSettings({
      backgroundColor: backgroundColor,
      paperColor: containerColor,
      headerColor: headerColor,
      bottomNavColor: bottomNavColor,
      contentColor: contentColor,
      primaryColor: primaryColor,
      textColor: containerTextColor
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
    setThemeSettings(prev => ({
      ...prev,
      ...newSettings
    }));
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
          primary: themeSettings.textColor || '#FFFFFF',
          secondary: themeSettings.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        header: {
          main: themeSettings.headerColor || '#1A1A1A',
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

  return (
    <HelmetProvider>
      <ThemeSettingsContext.Provider value={{ themeSettings, updateThemeSettings, loadThemeSettings }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <MusicProvider>
              <DefaultSEO />
              <MemoizedAppRoutes />
            </MusicProvider>
          </AuthProvider>
        </ThemeProvider>
      </ThemeSettingsContext.Provider>
    </HelmetProvider>
  );
}

export default App;
