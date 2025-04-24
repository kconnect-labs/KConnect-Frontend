import React, { useState, useContext, useEffect } from 'react';
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
  useMediaQuery
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
import { AuthContext } from '../../context/AuthContext';
import { useMusic } from '../../context/MusicContext';
import { ThemeSettingsContext } from '../../App';
import { ReactComponent as LogoSVG } from '../../assets/Logo.svg';
import { ReactComponent as BallsSVG } from '../../assets/balls.svg';
import NotificationList from '../Notifications/NotificationList';
import axios from 'axios';

const StyledAppBar = styled(AppBar)(({ theme, telegramMode }) => ({
  backgroundColor: alpha('#000000', 0.8),
  backdropFilter: 'blur(10px)',
  color: theme.palette.text.primary,
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  position: 'fixed',
  borderRadius: '0 !important',
  paddingTop: telegramMode ? '70px' : 0,
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
}));

const PlayerSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  maxWidth: 500,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const PlayerControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const VolumeSlider = styled('input')(({ theme }) => ({
  width: 60,
  height: 4,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  appearance: 'none',
  outline: 'none',
  '&::-webkit-slider-thumb': {
    appearance: 'none',
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
  },
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

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [userPoints, setUserPoints] = useState(0);
  const [telegramMode, setTelegramMode] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  
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
    }
  }, [user]);

  
  useEffect(() => {
    const telegramWebAppMode = localStorage.getItem('telegramWebAppMode') === 'true';
    console.log('Telegram WebApp Mode from localStorage:', telegramWebAppMode);
    
    setTelegramMode(telegramWebAppMode);
    
    
    if (telegramWebAppMode) {
      document.body.classList.add('telegram-webapp');
      document.documentElement.style.setProperty('--telegram-webapp-padding-top', '70px');
    }
  }, []);

  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
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
          minWidth: 180,
          mt: 0.5,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          borderRadius: '10px',
          overflow: 'visible',
          backgroundColor: alpha('#000000', 0.8),
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      {user && (
        <>
          <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
            <Avatar 
              src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
              alt={user.name || user.username} 
              sx={{ 
                width: 56, 
                height: 56, 
                mx: 'auto',
                border: `2px solid ${themeSettings.primaryColor}`,
              }}
            />
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {user.name || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
          <Divider sx={{ opacity: 0.1 }} />
        </>
      )}
      
      <MenuItem onClick={() => handleNavigate(`/profile/${user?.username}`)}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Мой профиль</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleNavigate('/settings')}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Настройки</ListItemText>
      </MenuItem>

      <Divider sx={{ opacity: 0.1 }} />

      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Выйти</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <StyledAppBar 
      telegramMode={telegramMode}
      sx={{ 
        display: isMusicPage && isMobile ? 'none' : 'block' 
      }}
    >
      <StyledToolbar>
        {}
        <LogoSection>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <LogoSVG 
              style={{ 
                height: 32, 
                width: 'auto'
              }} 
            />
            <LogoText>
              <Box component="span" sx={{ color: 'primary.main' }}>K</Box>
              <Box component="span" sx={{ color: 'white', opacity: 0.9 }}>-CONNECT</Box>
            </LogoText>
          </Link>
        </LogoSection>

        {}
        {currentTrack && (
          <PlayerSection>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {}
              <Box 
                component={Link} 
                to="/music" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mr: 2,
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Avatar 
                  variant="rounded" 
                  src={currentTrack.cover_path || '/static/uploads/system/album_placeholder.jpg'} 
                  alt={currentTrack.title}
                  sx={{ width: 40, height: 40, mr: 1, borderRadius: '8px' }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="medium" noWrap>
                    {truncateTitle(currentTrack.title)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {currentTrack.artist}
                  </Typography>
                </Box>
              </Box>
              
              {}
              <PlayerControls>
                <IconButton size="small" onClick={prevTrack}>
                  <SkipPreviousIcon fontSize="small" />
                </IconButton>
                
                <IconButton 
                  onClick={togglePlay}
                  sx={{ 
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                    p: 1
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                
                <IconButton size="small" onClick={nextTrack}>
                  <SkipNextIcon fontSize="small" />
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={toggleMute}
                    sx={{ mr: 0.5 }}
                  >
                    {isMuted || volume === 0 ? 
                      <VolumeOffIcon fontSize="small" /> : 
                      <VolumeUpIcon fontSize="small" />
                    }
                  </IconButton>
                  <VolumeSlider 
                    type="range" 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                  />
                </Box>
              </PlayerControls>
            </Box>
          </PlayerSection>
        )}

        {}
        <ActionsSection>
          {user && (
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
            onClick={() => navigate('/search')}
            sx={{ 
              bgcolor: location.pathname === '/search' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              color: location.pathname === '/search' ? 'primary.main' : 'inherit',
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
      </StyledToolbar>
      {profileMenu}
    </StyledAppBar>
  );
};

export default React.memo(Header); 