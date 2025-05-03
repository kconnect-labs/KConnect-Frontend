import React, { useState, useContext, useEffect, useRef } from 'react';
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
  Button
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
import { AuthContext } from '../../context/AuthContext';
import { useMusic } from '../../context/MusicContext';
import { ThemeSettingsContext } from '../../App';
import { ReactComponent as LogoSVG } from '../../assets/Logo.svg';
import { ReactComponent as BallsSVG } from '../../assets/balls.svg';
import NotificationList from '../Notifications/NotificationList';
import axios from 'axios';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'rgb(18 18 18 / 81%)' 
    ? alpha('#000000', 0.95) 
    : alpha('#ffffff', 0.9),
  backgroundImage: 'unset',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 1px 5px rgba(0,0,0,0.25)' 
    : '0 1px 3px rgba(0,0,0,0.12)',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' 
    ? alpha(theme.palette.divider, 0.2) 
    : alpha(theme.palette.divider, 0.1)}`,
  position: 'fixed',
  borderRadius: '0 !important',
  zIndex: theme.zIndex.appBar,
  [theme.breakpoints.up('md')]: {
    width: '100%',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  height: 64,
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
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  width: fullWidth ? '100%' : 'auto',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  }
}));

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-root': {
    color: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.common.white, 0.05),
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
  backgroundColor: alpha('#000000', 0.95),
  backdropFilter: 'blur(10px)',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
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
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [userPoints, setUserPoints] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userChannels, setUserChannels] = useState([]);
  const [accounts, setAccounts] = useState({
    current_account: null,
    main_account: null,
    channels: []
  });
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], channels: [] });
  const [searchTab, setSearchTab] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);
  
  const headerColor = themeSettings.headerColor || theme.palette.background.paper;
  
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
    setVolume 
  } = useMusic();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logout();
    } catch (error) {
      navigate('/login');
    }
  };

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const truncateTitle = (title, maxLength = 25) => {
    if (!title || title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      fetchUserChannels();
    }
  }, [user]);

  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

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
        
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching account:', error);
    } finally {
      handleMenuClose();
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
          backgroundColor: alpha('#000000', 0.8),
          backdropFilter: 'blur(10px)',
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.05)}`,
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
      {user && (
        <>
          <Box sx={{ px: 3, py: 2, textAlign: 'center' }}>
            <Avatar 
              src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
              alt={user.name || user.username} 
              sx={{ 
                width: 64,
                height: 64,
                mx: 'auto',
                border: `2px solid ${themeSettings.primaryColor}`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Typography variant="subtitle1" sx={{ mt: 1.5, fontWeight: 600 }}>
              {user.name || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            {user.account_type === 'channel' && (
              <Chip 
                size="small"
                label="Канал"
                color="primary"
                sx={{ mt: 0.5, fontWeight: 500, px: 1 }}
              />
            )}
          </Box>
          <Divider sx={{ opacity: 0.1, mx: 2 }} />
        </>
      )}
      
      <MenuItem onClick={() => handleNavigate(`/profile/${user?.username}`)}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>Мой профиль</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleNavigate('/settings')}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>Настройки</ListItemText>
      </MenuItem>

      <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />

      
      
      {accounts.channels.length < 3 && (
        <MenuItem onClick={handleCreateChannel}>
          <ListItemIcon>
            <AddIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Создать канал</ListItemText>
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
            Основной аккаунт
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
            Мои каналы
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
        <ListItemText>Выйти</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <StyledAppBar 
      sx={{ 
        display: isMusicPage && isMobile ? 'none' : 'block',
        backgroundColor: headerColor || undefined
      }}
    >
      <StyledToolbar>
        
        {isMobile && showSearch ? (
          <SearchInputWrapper fullWidth>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ width: '100%', position: 'relative' }}>
                <StyledSearchInput
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  inputRef={searchInputRef}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          edge="end"
                          onClick={toggleSearch}
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                {showSearchResults && (
                  <SearchResultsContainer>
                    <SearchResultTabs
                      value={searchTab}
                      onChange={handleSearchTabChange}
                      variant="fullWidth"
                    >
                      <SearchResultTab label="Все" />
                      <SearchResultTab label="Каналы" />
                    </SearchResultTabs>
                    
                    <Box sx={{ p: 1 }}>
                      {searchLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      ) : searchTab === 0 ? (
                        
                        <>
                          {searchResults.users.length > 0 ? (
                            <List sx={{ p: 0 }}>
                              {searchResults.users.map(user => (
                                <ListItem 
                                  key={user.id} 
                                  button 
                                  onClick={() => handleSearchItemClick(`/profile/${user.username}`)}
                                  sx={{ borderRadius: 1 }}
                                >
                                  <ListItemAvatar>
                                    <Avatar 
                                      src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
                                      alt={user.name || user.username}
                                    />
                                  </ListItemAvatar>
                                  <ListItemText 
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {user.name}
                                        {user.verification_status === 'verified' && (
                                          <VerifiedIcon sx={{ fontSize: 14, ml: 0.5, color: '#D0BCFF' }} />
                                        )}
                                      </Box>
                                    } 
                                    secondary={`@${user.username}`} 
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                Пользователи не найдены
                              </Typography>
                            </Box>
                          )}
                        </>
                      ) : (
                        
                        <>
                          {searchResults.channels.length > 0 ? (
                            <List sx={{ p: 0 }}>
                              {searchResults.channels.map(channel => (
                                <ListItem 
                                  key={channel.id} 
                                  button 
                                  onClick={() => handleSearchItemClick(`/profile/${channel.username}`)}
                                  sx={{ borderRadius: 1 }}
                                >
                                  <ListItemAvatar>
                                    <Avatar 
                                      src={channel.photo} 
                                      alt={channel.name}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/static/uploads/avatar/system/avatar.png';
                                      }}
                                    />
                                  </ListItemAvatar>
                                  <ListItemText 
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {channel.name}
                                        {channel.is_verified && (
                                          <VerifiedIcon sx={{ fontSize: 14, ml: 0.5, color: '#D0BCFF' }} />
                                        )}
                                      </Box>
                                    } 
                                    secondary={`@${channel.username}`} 
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                Каналы не найдены
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}
                      
                      {(searchTab === 0 && searchResults.users.length > 0) || 
                       (searchTab === 1 && searchResults.channels.length > 0) ? (
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                          <Button 
                            size="small" 
                            onClick={handleViewAll}
                            sx={{ 
                              textTransform: 'none',
                              color: '#D0BCFF',
                              '&:hover': { backgroundColor: alpha('#D0BCFF', 0.1) }
                            }}
                          >
                            Показать все
                          </Button>
                        </Box>
                      ) : null}
                    </Box>
                  </SearchResultsContainer>
                )}
              </Box>
            </ClickAwayListener>
          </SearchInputWrapper>
        ) : (
          <>
            
            <LogoSection>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <LogoSVG 
                  style={{ 
                    height: 32, 
                    width: 'auto'
                  }} 
                />
                {!isMobile && (
                  <LogoText>
                    <Box component="span" sx={{ color: 'primary.main' }}>K</Box>
                    <Box component="span" sx={{ 
                      color: theme.palette.mode === 'dark' ? 'white' : 'black', 
                      opacity: 0.9 
                    }}>-CONNECT</Box>
                  </LogoText>
                )}
              </Link>
            </LogoSection>

            
            {currentTrack && (
              <PlayerSection>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  
                  {/* Compact Track Info */}
                  <Box 
                    component={Link} 
                    to="/music" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                      flex: '1',
                      minWidth: 0, 
                    }}
                  >
                    <Avatar 
                      variant="rounded" 
                      src={currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'} 
                      alt={currentTrack.title}
                      sx={{ width: 32, height: 32, mr: 1, borderRadius: '4px' }}
                    />
                    <Box sx={{ minWidth: 0 }}> {/* Container for proper text truncation */}
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {truncateTitle(currentTrack.title, 20)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {truncateTitle(currentTrack.artist, 20)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Simplified Controls */}
                  <PlayerControls>
                    <IconButton size="small" onClick={prevTrack} sx={{ p: 0.5 }}>
                      <SkipPreviousIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    
                    <IconButton 
                      onClick={togglePlay}
                      size="small"
                      sx={{ 
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                        p: 0.7,
                        mx: 0.5,
                      }}
                    >
                      {isPlaying ? <PauseIcon sx={{ fontSize: '1.1rem' }} /> : <PlayArrowIcon sx={{ fontSize: '1.1rem' }} />}
                    </IconButton>
                    
                    <IconButton size="small" onClick={nextTrack} sx={{ p: 0.5 }}>
                      <SkipNextIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    
                    <VolumeControl>
                      <IconButton 
                        size="small" 
                        onClick={toggleMute}
                        sx={{ p: 0.5, ml: 0.5 }}
                      >
                        {isMuted || volume === 0 ? 
                          <VolumeOffIcon sx={{ fontSize: '1.1rem' }} /> : 
                          <VolumeUpIcon sx={{ fontSize: '1.1rem' }} />
                        }
                      </IconButton>
                      <VolumeSlider 
                        className="volume-slider"
                        type="range" 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                      />
                    </VolumeControl>
                  </PlayerControls>
                </Box>
              </PlayerSection>
            )}

            
            <ActionsSection>
              {user && !isMobile && (
                <Tooltip title="Ваши баллы">
                  <PointsChip
                    icon={
                      <PointsIcon>
                        <BallsSVG />
                      </PointsIcon>
                    }
                    label={`${userPoints} баллов`}
                    onClick={() => navigate('/balance')}
                    clickable
                  />
                </Tooltip>
              )}
              
              <IconButton 
                color="inherit" 
                onClick={isMobile ? toggleSearch : () => navigate('/search')}
                sx={{ 
                  bgcolor: (isMobile && showSearch) || (!isMobile && location.pathname === '/search') 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent',
                  color: (isMobile && showSearch) || (!isMobile && location.pathname === '/search')
                    ? 'primary.main' 
                    : 'inherit',
                }}
              >
                <SearchIcon />
              </IconButton>
              
              <NotificationList />
              
              <IconButton
                edge="end"
                aria-label="account"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 0.5 }}
              >
                {user ? (
                  <Avatar 
                    src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
                    alt={user.name || user.username} 
                    sx={{ 
                      width: 30, 
                      height: 30,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
            </ActionsSection>
          </>
        )}
      </StyledToolbar>
      {profileMenu}
    </StyledAppBar>
  );
};

export default React.memo(Header); 