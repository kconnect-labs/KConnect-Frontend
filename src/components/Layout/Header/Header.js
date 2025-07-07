import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  styled,
  alpha,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
  useMediaQuery,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Tabs,
  Tab,
  ClickAwayListener,
  CircularProgress,
  Button,
  GlobalStyles,
  Zoom,
  Collapse
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VerifiedIcon from '@mui/icons-material/Verified';
import TranslateIcon from '@mui/icons-material/Translate';
import { AuthContext } from '../../../context/AuthContext';
import { useMusic } from '../../../context/MusicContext';
import { ThemeSettingsContext } from '../../../App';
import { useLanguage } from '../../../context/LanguageContext';
import { ReactComponent as LogoSVG } from '../../../assets/Logo.svg';
import NotificationList from '../../Notifications/NotificationList';
import axios from 'axios';
import { Icon } from '@iconify/react';
import DynamicIslandNotification from '../../DynamicIslandNotification';
import HeaderLogo from './HeaderLogo';
import HeaderSearch from './HeaderSearch';
import HeaderPlayer from './HeaderPlayer';
import HeaderActions from './HeaderActions';
import HeaderProfileMenu from './HeaderProfileMenu';
import ReactDOM from 'react-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundImage: 'none',
  color: '#FFFFFF',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'fixed',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '0 !important',
  zIndex: theme.zIndex.appBar,
  [theme.breakpoints.up('md')]: {
    width: '100%',
  },
  height: 48,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  height: 48,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, '15%'), 
    width: '100%',
    margin: '0 auto',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(1),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
}));

const PlayerSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  maxWidth: 400,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const PlayerControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
}));

const VolumeControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&:hover .volume-slider': {
    width: 60,
    opacity: 1,
    marginLeft: theme.spacing(0.5),
  }
}));

const VolumeSlider = styled('input')(({ theme }) => ({
  width: 0,
  height: 3,
  borderRadius: 1.5,
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  appearance: 'none',
  outline: 'none',
  transition: 'all 0.2s ease',
  opacity: 0,
  '&::-webkit-slider-thumb': {
    appearance: 'none',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
  },
  '&.volume-slider': {},
}));

const ActionsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const PointsChip = styled(Chip)(({ theme }) => ({
  borderRadius: 20,
  fontWeight: 'bold',
  background: `linear-gradient(45deg, #d0bcff 30%, ${alpha('#d0bcff', 0.8)} 90%)`,
  color: '#1a1a1a',
  border: 'none',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  height: 32,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const PointsIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  '& svg': {
    width: '100%',
    height: '100%',
  }
}));

const SearchInputWrapper = styled(Box)(({ theme, fullWidth }) => ({
  position: 'relative',
  borderRadius: 16,
  backgroundColor: '#131313',
  width: fullWidth ? '100%' : 450,
  display: 'flex',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
    margin: 0,
    borderRadius: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100vh',
    zIndex: 1300,
  }
}));

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-root': {
    color: theme.palette.common.white,
    backgroundColor: '#131313',
    borderRadius: 24,
    padding: theme.spacing(0.5, 1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.common.white, 0.2),
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
  }
}));

const SearchResultsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 10,
  right: 10,
  zIndex: 1200,
  maxHeight: 'calc(80vh - 70px)',
  overflow: 'auto',
  marginTop: theme.spacing(0.5),
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
  [theme.breakpoints.down('sm')]: {
    position: 'fixed',
    top: '48px',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: 'calc(100vh - 48px)',
    height: 'calc(100vh - 48px)',
    margin: 0,
    borderRadius: 0,
    border: 'none',
    boxShadow: 'none',
  }
}));

const SearchResultTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 40,
  '& .MuiTabs-indicator': {
    backgroundColor: '#D0BCFF',
    height: 3,
  },
}));

const SearchResultTab = styled(Tab)(({ theme }) => ({
  minHeight: 40,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
}));

const Header = ({ toggleSidebar }) => {
  const { user, logout, setUser } = useContext(AuthContext);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userChannels, setUserChannels] = useState([]);
  const [accounts, setAccounts] = useState({
    current_account: null,
    main_account: null,
    channels: []
  });
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], channels: [] });
  const [searchTab, setSearchTab] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);
  
  const [showMobilePlayer, setShowMobilePlayer] = useState(false);
  
  const themeValues = useMemo(() => {
    const headerTextColor = themeSettings.textColor || theme.palette.text.primary;
    const primaryColor = themeSettings.primaryColor || theme.palette.primary.main;

    const headerStyle = {
      background: 'rgba(255, 255, 255, 0.03)',
      color: headerTextColor,
      boxShadow: `0 4px 15px ${alpha('#000000', 0.07)}`,
      borderColor: alpha(headerTextColor, 0.08)
    };

    return {
      primaryColor,
      headerStyle
    };
  }, [themeSettings, theme]);
  
  const isMusicPage = location.pathname === '/music';

  const { 
    currentTrack, 
    isPlaying, 
    isMuted,
    volume,
    togglePlay, 
    nextTrack,
    prevTrack,
    toggleMute,
    setVolume,
    openFullScreenPlayer
  } = useMusic();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [showNewNotification, setShowNewNotification] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const lastNotificationId = useRef(null);

  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const isLanguageMenuOpen = Boolean(languageMenuAnchorEl);

  const [isInMessengerChat, setIsInMessengerChat] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logout();
    } catch (error) {
      navigate('/login');
    }
  };

  const handleCreateChannel = () => {
    handleMenuClose();
    navigate('/register/channel');
  };

  const handleSwitchAccount = async (accountId) => {
    try {
      const response = await axios.post('/api/users/switch-account', { 
        account_id: accountId 
      });
      
      if (response.data.success) {
        setUser({
          ...response.data.account,
          id: response.data.account.id
        });
        
        handleMenuClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching account:', error);
    }
  };

  const truncateTitle = (title, maxLength = 25) => {
    if (!title || title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  useEffect(() => {
    if (user) {
      fetchUserChannels();
    }
  }, [user]);

  const fetchUserChannels = async () => {
    try {
      const response = await axios.get('/api/users/my-channels');
      if (response.data.success) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Error fetching user channels:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get('/api/notifications');
          if (response.data && response.data.success) {
            const newCount = response.data.unread_count || 0;
            setUnreadNotificationsCount(newCount);

            // Check for new notifications
            if (response.data.notifications && response.data.notifications.length > 0) {
              const latestNotification = response.data.notifications[0];
              
              // If this is a new notification (different ID than last one)
              if (latestNotification.id !== lastNotificationId.current) {
                lastNotificationId.current = latestNotification.id;
                handleNewNotification(latestNotification);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };

      // Initial fetch
      fetchUnreadCount();

      // Set up periodic fetch
      const intervalId = setInterval(fetchUnreadCount, 30000); // Every 30 seconds

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user]);

  const handleNewNotification = (notification) => {
    if (!notification.is_read) {
      setNewNotification(notification);
      setShowNewNotification(true);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNewNotification(false);
      }, 5000);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length >= 2) {
      performSearch(query);
      setShowSearchResults(true);
    } else {
      setSearchResults({ users: [], channels: [] });
      setShowSearchResults(false);
    }
  };
  
  const performSearch = async (query) => {
    if (query.trim().length < 2) return;
    
    setSearchLoading(true);
    try {
      const usersResponse = await axios.get('/api/search/', {
        params: { 
          q: query,
          type: 'users',
          per_page: 5 
        }
      });
      
      const channelsResponse = await axios.get('/api/search/channels', {
        params: { 
          q: query,
          per_page: 5 
        }
      });
      
      setSearchResults({
        users: usersResponse.data?.users || [],
        channels: channelsResponse.data?.channels || []
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };
  
  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };
  
  const handleClickAway = () => {
    setShowSearchResults(false);
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };
  
  const handleSearchTabChange = (event, newValue) => {
    setSearchTab(newValue);
  };
  
  const handleViewAll = () => {
    if (searchTab === 0) {
      navigate(`/search?q=${searchQuery}&type=users`);
    } else {
      navigate(`/channels?q=${searchQuery}`);
    }
    setShowSearchResults(false);
    setShowSearch(false);
  };
  
  const handleSearchItemClick = (path) => {
    navigate(path);
    setShowSearchResults(false);
    setShowSearch(false);
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      }
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchorEl(event.currentTarget);
    handleMenuClose(); // Close the profile menu
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    handleLanguageMenuClose();
  };

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{ 
        elevation: 3,
        sx: { 
          minWidth: 280,
          mt: 0.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: '14px',
          overflow: 'visible',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          [theme.breakpoints.down('sm')]: {
            minWidth: '100vw',
            maxWidth: '100vw',
            width: '100vw',
            margin: 0,
            borderRadius: 0,
            position: 'fixed',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            height: '100vh',
            maxHeight: '100vh',
            border: 'none',
            boxShadow: 'none',
          },
          '& .MuiMenuItem-root': {
            padding: '8px 14px',
            borderRadius: '8px',
            margin: '1px 6px',
            minHeight: '36px',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }
          },
          '& .MuiDivider-root': {
            margin: '4px 0',
          },
          '& .MuiTypography-caption': {
            padding: '4px 12px',
          }
        }
      }}
    >
      {user && (
        <>
          <Box sx={{ px: 2, py: 2, textAlign: 'center', position: 'relative' }}>
            {isMobile && (
              <IconButton
                onClick={handleMenuClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
            <Avatar 
              src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
              alt={user.name || user.username} 
              sx={{ 
                width: 80,
                height: 80,
                mx: 'auto',
                border: `2px solid ${themeValues.primaryColor}`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
              {user.name || user.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              @{user.username}
            </Typography>
            {user.account_type === 'channel' && (
              <Chip 
                size="small"
                label={t('header.profile_menu.channel_label')}
                color="primary"
                sx={{ mt: 1, fontWeight: 500, px: 1 }}
              />
            )}
          </Box>
          <Divider sx={{ opacity: 0.1, mx: 2 }} />

          {isMobile && (
            <>
              <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/balance"
                  startIcon={<Icon icon="solar:wallet-money-bold" width="18" height="18" />}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    }
                  }}
                >
                  {t('header.profile_menu.wallet')}
                </Button>
                <Button
                  component={Link}
                  to="/badge-shop"
                  startIcon={<Icon icon="solar:shop-bold" width="18" height="18" />}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    }
                  }}
                >
                  {t('header.profile_menu.shop')}
                </Button>
              </Box>
              <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
            </>
          )}
        </>
      )}
      
      <MenuItem onClick={() => handleNavigate(`/profile/${user?.username}`)}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>{t('header.profile_menu.my_profile')}</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleNavigate('/settings')}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>{t('header.profile_menu.settings')}</ListItemText>
      </MenuItem>

      {isMobile && (
        <>
          <MenuItem onClick={() => handleNavigate('/search')}>
            <ListItemIcon>
              <Icon icon="solar:magnifer-bold" width="20" height="20" />
            </ListItemIcon>
            <ListItemText>{t('header.profile_menu.search')}</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleNavigate('/subscriptions')}>
            <ListItemIcon>
              <Icon icon="solar:users-group-rounded-bold" width="20" height="20" />
            </ListItemIcon>
            <ListItemText>{t('header.profile_menu.subscriptions')}</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleNavigate('/channels')}>
            <ListItemIcon>
              <Icon icon="solar:play-stream-bold" width="20" height="20" />
            </ListItemIcon>
            <ListItemText>{t('header.profile_menu.channels')}</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleNavigate('/leaderboard')}>
            <ListItemIcon>
              <Icon icon="solar:chart-bold" width="20" height="20" />
            </ListItemIcon>
            <ListItemText>{t('header.profile_menu.rating')}</ListItemText>
          </MenuItem>
        </>
      )}

      <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />

      {accounts.channels.length < 3 && (
        <MenuItem onClick={handleCreateChannel}>
          <ListItemIcon>
            <AddIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{t('header.profile_menu.create_channel')}</ListItemText>
        </MenuItem>
      )}

      {accounts.main_account && accounts.current_account?.account_type === 'channel' && (
        <>
          <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
          <Typography
            variant="caption"
            sx={{
              px: 3,
              py: 0.5,
              display: 'block',
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            {t('header.profile_menu.main_account')}
          </Typography>
          <MenuItem 
            key={accounts.main_account.id}
            onClick={() => handleSwitchAccount(accounts.main_account.id)}
          >
            <ListItemIcon>
              <Avatar
                src={accounts.main_account.photo}
                sx={{ width: 30, height: 30 }}
              />
            </ListItemIcon>
            <ListItemText>{accounts.main_account.name}</ListItemText>
          </MenuItem>
        </>
      )}

      {accounts.channels && accounts.channels.length > 0 && (
        <>
          <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
          <Typography
            variant="caption"
            sx={{
              px: 3,
              py: 0.5,
              display: 'block',
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            {t('header.profile_menu.my_channels')}
          </Typography>
          {accounts.channels.map(channel => (
            <MenuItem 
              key={channel.id}
              onClick={() => handleSwitchAccount(channel.id)}
            >
              <ListItemIcon>
                <Avatar
                  src={channel.photo}
                  sx={{ width: 30, height: 30 }}
                />
              </ListItemIcon>
              <ListItemText>{channel.name}</ListItemText>
            </MenuItem>
          ))}
        </>
      )}

      <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />

      <MenuItem onClick={handleLanguageMenuOpen}>
        <ListItemIcon>
          <TranslateIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>{t('header.profile_menu.language')}</ListItemText>
      </MenuItem>

      <MenuItem 
        onClick={handleLogout}
        sx={{ 
          color: theme => theme.palette.error.main,
          '&:hover': {
            backgroundColor: theme => alpha(theme.palette.error.main, 0.08),
          }
        }}
      >
        <ListItemIcon>
          <ExitToAppIcon fontSize="small" style={{ color: 'inherit' }} />
        </ListItemIcon>
        <ListItemText>{t('header.profile_menu.logout')}</ListItemText>
      </MenuItem>
    </Menu>
  );

  const languageMenu = (
    <Menu
      anchorEl={languageMenuAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isLanguageMenuOpen}
      onClose={handleLanguageMenuClose}
      PaperProps={{ 
        elevation: 3,
        sx: { 
          minWidth: 200,
          mt: 0.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: '14px',
          overflow: 'visible',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          [theme.breakpoints.down('sm')]: {
            minWidth: '100vw',
            maxWidth: '100vw',
            width: '100vw',
            margin: 0,
            borderRadius: 0,
            position: 'fixed',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            height: '100vh',
            maxHeight: '100vh',
            border: 'none',
            boxShadow: 'none',
          },
          '& .MuiMenuItem-root': {
            padding: '10px 16px',
            borderRadius: '8px',
            margin: '2px 8px',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }
          },
        }
      }}
    >
      <Box sx={{ px: 3, py: 2, textAlign: 'center' }}>
        {isMobile && (
          <IconButton
            onClick={handleLanguageMenuClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
        <TranslateIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('header.profile_menu.select_language')}
        </Typography>
      </Box>
      
      <Divider sx={{ opacity: 0.1, mx: 2, mb: 1 }} />
      
      <MenuItem 
        onClick={() => handleLanguageChange('RU')}
        selected={language === 'RU'}
      >
        <ListItemIcon>
          <img 
            src="/static/flags/ru.svg" 
            alt="Russian" 
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Russia_%28CMYK%29.png/120px-Flag_of_Russia_%28CMYK%29.png';
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Русский" />
        {language === 'RU' && (
          <Icon icon="solar:check-circle-bold" style={{ color: theme.palette.primary.main, marginLeft: 8 }} />
        )}
      </MenuItem>
      
      <MenuItem 
        onClick={() => handleLanguageChange('EN')}
        selected={language === 'EN'}
      >
        <ListItemIcon>
          <img 
            src="/static/flags/en.svg" 
            alt="English" 
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/2560px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png';
            }}
          />
        </ListItemIcon>
        <ListItemText primary="English" />
        {language === 'EN' && (
          <Icon icon="solar:check-circle-bold" style={{ color: theme.palette.primary.main, marginLeft: 8 }} />
        )}
      </MenuItem>

      <MenuItem 
        onClick={() => handleLanguageChange('JP')}
        selected={language === 'JP'}
      >
        <ListItemIcon>
          <img 
            src="/static/flags/jp.svg" 
            alt="Japanese" 
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1200px-Flag_of_Japan.svg.png';
            }}
          />
        </ListItemIcon>
        <ListItemText primary="日本語" />
        {language === 'JP' && (
          <Icon icon="solar:check-circle-bold" style={{ color: theme.palette.primary.main, marginLeft: 8 }} />
        )}
      </MenuItem>
    </Menu>
  );

  useEffect(() => {
    const handleMessengerLayoutChange = (event) => {
      const { isInChat } = event.detail;
      console.log('Header: Received messenger-layout-change event, isInChat:', isInChat);
      setIsInMessengerChat(isInChat);
    };
    
    document.addEventListener('messenger-layout-change', handleMessengerLayoutChange);
    
    return () => {
      document.removeEventListener('messenger-layout-change', handleMessengerLayoutChange);
    };
  }, []);

  return (
    <StyledAppBar 
      sx={{ 
        display: (isMusicPage && isMobile) || isInMessengerChat ? 'none' : 'block',
      }}
      style={themeValues.headerStyle}
    >
      <GlobalStyles styles={{
        '.MuiToolbar-root': {
          minHeight: '48px !important',
          height: '48px !important',
          paddingTop: 0,
          paddingBottom: 0,
        }
      }} />
      <StyledToolbar>
        {/* Мобильный плеер рендерится только на мобильных устройствах */}
        {isMobile && currentTrack && (
          <IconButton
            color={showMobilePlayer ? 'primary' : 'inherit'}
            onClick={() => setShowMobilePlayer(v => !v)}
            sx={{
              mr: 1,
              opacity: 0.6,
              transition: 'all 0.2s',
              '&:hover': { opacity: 1 },
              bgcolor: showMobilePlayer ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            }}
          >
            <Icon icon="solar:music-note-2-bold" width="24" height="24" sx={{ color: theme.palette.primary.main }} />
          </IconButton>
        )}
        {isMobile && (
          <Collapse in={showMobilePlayer} timeout={300} unmountOnExit sx={{ width: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <HeaderPlayer
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                isMuted={isMuted}
                volume={volume}
                togglePlay={togglePlay}
                nextTrack={nextTrack}
                prevTrack={prevTrack}
                toggleMute={toggleMute}
                setVolume={setVolume}
                theme={theme}
                truncateTitle={truncateTitle}
                isMobile={true}
                onOpenFullscreen={openFullScreenPlayer}
              />
            </Box>
          </Collapse>
        )}
        {isMobile && showMobilePlayer ? null : (
          <>
            {isMobile ? (
              !currentTrack && <HeaderLogo isMobile={isMobile} t={t} />
        ) : (
          <HeaderLogo isMobile={isMobile} t={t} />
        )}
        {showSearch ? (
          isMobile ? (
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000, width: '100vw', height: 56, bgcolor: theme.palette.background.paper, display: 'flex', alignItems: 'center', px: 1, boxShadow: 3 }}>
              <HeaderSearch
                showSearch={showSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                searchTab={searchTab}
                setSearchTab={setSearchTab}
                searchLoading={searchLoading}
                showSearchResults={showSearchResults}
                setShowSearchResults={setShowSearchResults}
                searchInputRef={searchInputRef}
                t={t}
                theme={theme}
                handleSearchChange={handleSearchChange}
                handleSearchFocus={handleSearchFocus}
                handleClickAway={handleClickAway}
                handleSearchTabChange={handleSearchTabChange}
                handleViewAll={handleViewAll}
                handleSearchItemClick={handleSearchItemClick}
                toggleSearch={toggleSearch}
                isMobile={true}
              />
            </Box>
          ) : (
            ReactDOM.createPortal(
              <Box sx={{
                position: 'fixed',
                top: '10%',
                left: 0,
                right: 0,
                mx: 'auto',
                maxWidth: 520,
                zIndex: 2000,
                p: 2,
                borderRadius: 1,
                boxShadow: 8,
                bgcolor: theme.palette.background.paper,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <HeaderSearch
                  showSearch={showSearch}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  searchTab={searchTab}
                  setSearchTab={setSearchTab}
                  searchLoading={searchLoading}
                  showSearchResults={showSearchResults}
                  setShowSearchResults={setShowSearchResults}
                  searchInputRef={searchInputRef}
                  t={t}
                  theme={theme}
                  handleSearchChange={handleSearchChange}
                  handleSearchFocus={handleSearchFocus}
                  handleClickAway={handleClickAway}
                  handleSearchTabChange={handleSearchTabChange}
                  handleViewAll={handleViewAll}
                  handleSearchItemClick={handleSearchItemClick}
                  toggleSearch={toggleSearch}
                  isMobile={false}
                />
              </Box>,
              document.body
            )
          )
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <HeaderSearch
                  showSearch={showSearch}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  searchTab={searchTab}
                  setSearchTab={setSearchTab}
                  searchLoading={searchLoading}
                  showSearchResults={showSearchResults}
                  setShowSearchResults={setShowSearchResults}
                  searchInputRef={searchInputRef}
                  t={t}
                  theme={theme}
                  handleSearchChange={handleSearchChange}
                  handleSearchFocus={handleSearchFocus}
                  handleClickAway={handleClickAway}
                  handleSearchTabChange={handleSearchTabChange}
                  handleViewAll={handleViewAll}
                  handleSearchItemClick={handleSearchItemClick}
                  toggleSearch={toggleSearch}
                />
                {/* Desktop плеер рендерится только на PC */}
                {!showSearch && !isMobile && (
                  <HeaderPlayer
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    volume={volume}
                    togglePlay={togglePlay}
                    nextTrack={nextTrack}
                    prevTrack={prevTrack}
                    toggleMute={toggleMute}
                    setVolume={setVolume}
                    theme={theme}
                    truncateTitle={truncateTitle}
                    onOpenFullscreen={openFullScreenPlayer}
                    isMobile={isMobile}
                  />
                )}
              </Box>
            </Box>
            <HeaderActions
              user={user}
              isMobile={isMobile}
              t={t}
              theme={theme}
              navigate={navigate}
              toggleSearch={toggleSearch}
              showSearch={showSearch}
              handleProfileMenuOpen={handleProfileMenuOpen}
              NotificationList={NotificationList}
              handleNewNotification={handleNewNotification}
            />
              </>
            )}
          </>
        )}
      </StyledToolbar>
      
      {showNewNotification && newNotification && (
        <DynamicIslandNotification
          open={true}
          message={newNotification.message}
          shortMessage={newNotification.sender_user?.name || t('header.notifications.new')}
          notificationType="notification"
          animationType="pill"
          autoHideDuration={5000}
          onClose={() => setShowNewNotification(false)}
          notificationData={newNotification}
        />
      )}
      
      <HeaderProfileMenu
        user={user}
        isMobile={isMobile}
        t={t}
        theme={theme}
        anchorEl={anchorEl}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
        handleNavigate={handleNavigate}
        handleLogout={handleLogout}
        handleCreateChannel={handleCreateChannel}
        accounts={accounts}
        handleSwitchAccount={handleSwitchAccount}
        handleLanguageMenuOpen={handleLanguageMenuOpen}
        languageMenuAnchorEl={languageMenuAnchorEl}
        isLanguageMenuOpen={isLanguageMenuOpen}
        handleLanguageMenuClose={handleLanguageMenuClose}
        handleLanguageChange={handleLanguageChange}
        language={language}
      />
      {languageMenu}
    </StyledAppBar>
  );
};

export default React.memo(Header); 