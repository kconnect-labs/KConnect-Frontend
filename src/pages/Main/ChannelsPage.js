import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  Button, 
  Avatar, 
  TextField, 
  InputAdornment, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Divider, 
  Chip, 
  IconButton, 
  useTheme, 
  alpha,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeSettingsContext } from '../../App';
import { AuthContext } from '../../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import { Icon } from '@iconify/react';
import personAddIcon from '@iconify-icons/solar/user-plus-bold';
import personCheckIcon from '@iconify-icons/solar/user-check-bold';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TvIcon from '@mui/icons-material/Tv';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EmptyChannelsPlaceholder from './EmptyChannelsPlaceholder';


const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  }
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  }
}));

const SearchSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  background: 'linear-gradient(145deg, #222222, #1c1c1c)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(2),
  }
}));

const StyledTextField = styled(TextField)(({ theme, themecolor }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: alpha(themecolor || theme.palette.primary.main, 0.5),
    },
    '&.Mui-focused fieldset': {
      borderColor: themecolor || theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
  }
}));

const ChannelCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #222222, #1c1c1c)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.18)',
  }
}));

const ChannelContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  }
}));

const ChannelAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  border: '2px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('sm')]: {
    width: 50,
    height: 50,
  }
}));

const ChannelName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
}));

const ChannelUsername = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.6)',
  marginBottom: theme.spacing(1.5),
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
}));

const ChannelDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  marginBottom: theme.spacing(1.5),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  minHeight: '2.5rem',
  maxHeight: '2.5rem',
  flexGrow: 0,
}));

const StyledChip = styled(Chip)(({ theme, isFollowing, themecolor }) => ({
  borderRadius: '8px',
  fontWeight: 500,
  background: isFollowing ? 
    'rgba(255, 255, 255, 0.1)' : 
    `linear-gradient(135deg, ${themecolor || theme.palette.primary.main}, ${alpha(themecolor || theme.palette.primary.main, 0.7)})`,
  color: isFollowing ? 'rgba(255, 255, 255, 0.9)' : '#fff',
  border: isFollowing ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
  '&:hover': {
    background: isFollowing ? 
      'rgba(255, 255, 255, 0.15)' : 
      `linear-gradient(135deg, ${themecolor || theme.palette.primary.main}, ${alpha(themecolor || theme.palette.primary.main, 0.8)})`,
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiChip-label': {
      padding: '0 6px',
      fontSize: '0.65rem',
    },
    '& .MuiChip-icon': {
      marginLeft: 4,
    }
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  borderRadius: '8px',
  minHeight: '38px',
  padding: '6px 12px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  minWidth: 0,
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
    fontWeight: 600,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    padding: '5px 10px',
  }
}));

const StyledTabs = styled(Tabs)(({ theme, themecolor }) => ({
  minHeight: '38px',
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: themecolor || theme.palette.primary.main,
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1),
  }
}));

const LoadMoreButton = styled(Button)(({ theme, themecolor }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1, 3),
  marginTop: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  background: `linear-gradient(135deg, ${themecolor || theme.palette.primary.main}, ${alpha(themecolor || theme.palette.primary.main, 0.8)})`,
  color: '#fff',
  '&:hover': {
    background: `linear-gradient(135deg, ${themecolor || theme.palette.primary.main}, ${alpha(themecolor || theme.palette.primary.main, 0.9)})`,
  }
}));


const ChannelCardLoader = () => {
  const theme = useTheme();
  return (
    <Card sx={{ 
      borderRadius: 4, 
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #222222, #1c1c1c)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
        <Skeleton variant="circular" width={80} height={80} sx={{ 
          mb: 2, 
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          [theme => theme.breakpoints.down('sm')]: {
            width: 50,
            height: 50,
          }
        }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 'auto' }}>
          <Skeleton variant="rectangular" width="30%" height={22} sx={{ borderRadius: '6px', bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          <Skeleton variant="rectangular" width="40%" height={32} sx={{ borderRadius: '8px', bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        </Box>
      </Box>
    </Card>
  );
};


const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

const ChannelsPage = () => {
  const { themeSettings } = useContext(ThemeSettingsContext);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'recent';
  
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [channels, setChannels] = useState([]);
  const [popularChannels, setPopularChannels] = useState([]);
  const [featuredChannels, setFeaturedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [withDescription, setWithDescription] = useState(true);
  const [followedChannels, setFollowedChannels] = useState([]);
  const [loadingFollowed, setLoadingFollowed] = useState(true);
  
  const primaryColor = themeSettings?.primaryColor || theme.palette.primary.main;
  
  
  const getFormattedUrl = (tab, q = searchQuery) => {
    const params = new URLSearchParams();
    if (tab) params.set('tab', tab);
    if (q) params.set('q', q);
    return `/channels?${params.toString()}`;
  };
  
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
    setChannels([]);
    setLoading(true);
    navigate(getFormattedUrl(newValue), { replace: true });
  };
  
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setChannels([]);
    setIsSearching(true);
    setLoading(true);
    navigate(getFormattedUrl(activeTab, searchQuery), { replace: true });
  };
  
  
  useEffect(() => {
    const fetchPopularChannels = async () => {
      try {
        const response = await axios.get('/api/search/channels', {
          params: {
            sort: 'popular',
            with_description: 'true',
            per_page: 4
          }
        });
        
        if (response.data && Array.isArray(response.data.channels)) {
          setPopularChannels(response.data.channels);
        }
      } catch (err) {
        console.error('Error fetching popular channels:', err);
      }
    };
    
    fetchPopularChannels();
  }, []);
  
  
  useEffect(() => {
    const fetchFeaturedChannels = async () => {
      try {
        const response = await axios.get('/api/search/channels', {
          params: {
            with_description: 'true',
            per_page: 4
          }
        });
        
        if (response.data && Array.isArray(response.data.channels)) {
          setFeaturedChannels(response.data.channels);
        }
      } catch (err) {
        console.error('Error fetching featured channels:', err);
      }
    };
    
    fetchFeaturedChannels();
  }, []);
  
  
  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get('/api/search/channels', {
          params: {
            q: searchQuery,
            sort: activeTab,
            page: 1,
            per_page: 12,
            with_description: withDescription ? 'true' : 'false'
          }
        });
        
        if (response.data) {
          setChannels(response.data.channels || []);
          setHasMore(response.data.has_next || false);
          setTotal(response.data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching channels:', err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };
    
    fetchChannels();
    
  }, [activeTab, searchQuery, withDescription]);
  
  
  const loadMoreChannels = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const response = await axios.get('/api/search/channels', {
        params: {
          q: searchQuery,
          sort: activeTab,
          page: nextPage,
          per_page: 12,
          with_description: withDescription ? 'true' : 'false'
        }
      });
      
      if (response.data) {
        setChannels(prevChannels => [...prevChannels, ...(response.data.channels || [])]);
        setHasMore(response.data.has_next || false);
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more channels:', err);
    } finally {
      setLoadingMore(false);
    }
  };
  
  
  const handleFollowToggle = async (channelId, isFollowing) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      
      const updatedChannels = channels.map(channel => 
        channel.id === channelId
          ? { ...channel, is_following: !isFollowing }
          : channel
      );
      setChannels(updatedChannels);
      
      
      const updatedPopular = popularChannels.map(channel => 
        channel.id === channelId
          ? { ...channel, is_following: !isFollowing }
          : channel
      );
      setPopularChannels(updatedPopular);
      
      
      const updatedFeatured = featuredChannels.map(channel => 
        channel.id === channelId
          ? { ...channel, is_following: !isFollowing }
          : channel
      );
      setFeaturedChannels(updatedFeatured);
      
      
      if (isFollowing) {
        await axios.post(`/api/profile/unfollow`, { followed_id: channelId });
      } else {
        await axios.post(`/api/profile/follow`, { followed_id: channelId });
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      
      
      const revertChannels = channels.map(channel => 
        channel.id === channelId
          ? { ...channel, is_following: isFollowing }
          : channel
      );
      setChannels(revertChannels);
      
      const revertPopular = popularChannels.map(channel => 
        channel.id === channelId
          ? { ...channel, is_following: isFollowing }
          : channel
      );
      setPopularChannels(revertPopular);
      
      const revertFeatured = featuredChannels.map(channel => 
        channel.id === channelId
          ? { ...channel, is_following: isFollowing }
          : channel
      );
      setFeaturedChannels(revertFeatured);
    }
  };
  
  
  const handleChannelClick = (username) => {
    navigate(`/profile/${username}`);
  };
  
  
  const renderChannelCard = (channel) => (
    <ChannelCard key={channel.id}>
      <CardActionArea onClick={() => handleChannelClick(channel.username)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <ChannelAvatar 
            src={channel.photo}
            alt={channel.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/static/uploads/avatar/system/avatar.png';
            }}
          />
          <ChannelContent>
            <Box>
              <ChannelName variant="h6">
                {channel.name}
                {channel.is_verified && (
                  <Box component="span" sx={{ ml: 0.5, color: 'primary.main', display: 'inline-flex', alignItems: 'center' }}>
                    <Icon icon="solar:verified-check-bold" width="16" height="16" />
                  </Box>
                )}
              </ChannelName>
              <ChannelUsername variant="body2">
                @{channel.username}
              </ChannelUsername>
              
              <ChannelDescription variant="body2">
                {channel.about || 'Нет описания'}
              </ChannelDescription>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
              <Chip
                size="small"
                icon={<Icon icon="solar:users-group-rounded-bold" width={14} height={14} />}
                label={formatNumber(channel.followers_count || 0)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  height: '22px',
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }
                }}
              />
              
              <StyledChip
                size="small"
                label={channel.is_following ? "Вы подписаны" : "Подписаться"}
                isFollowing={channel.is_following}
                themecolor={primaryColor}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowToggle(channel.id, channel.is_following);
                }}
                icon={channel.is_following ? 
                  <Icon icon={personCheckIcon} width="16" height="16" /> : 
                  <Icon icon={personAddIcon} width="16" height="16" />
                }
              />
            </Box>
          </ChannelContent>
        </Box>
      </CardActionArea>
    </ChannelCard>
  );
  
  
  useEffect(() => {
    const fetchFollowedChannels = async () => {
      if (!user) {
        setLoadingFollowed(false);
        return;
      }
      
      setLoadingFollowed(true);
      try {
        const response = await axios.get('/api/users/my-channels');
        if (response.data && Array.isArray(response.data.channels)) {
          setFollowedChannels(response.data.channels);
        }
      } catch (err) {
        console.error('Error fetching followed channels:', err);
      } finally {
        setLoadingFollowed(false);
      }
    };
    
    fetchFollowedChannels();
  }, [user]);
  
  return (
    <PageContainer maxWidth="lg">
      <PageHeader>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 0.5, 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <GroupsIcon sx={{ fontSize: 28 }} />
          Каналы
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: 600
          }}
        >
          Следите за обновлениями ваших любимых каналов и открывайте новый контент
        </Typography>
      </PageHeader>
      
      
      <SearchSection>
        <form onSubmit={handleSearch}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Найти каналы..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            themecolor={primaryColor}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: isSearching && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              )
            }}
          />
        </form>
      </SearchSection>
      
      
      {!searchQuery && popularChannels.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Популярные каналы
            </Typography>
          </SectionHeader>
          
          <Grid container spacing={2}>
            {popularChannels.map(channel => (
              <Grid item xs={6} sm={4} md={3} key={channel.id}>
                {renderChannelCard(channel)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      
      {!searchQuery && featuredChannels.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Отборные каналы
            </Typography>
          </SectionHeader>
          
          <Grid container spacing={2}>
            {featuredChannels.map(channel => (
              <Grid item xs={6} sm={4} md={3} key={channel.id}>
                {renderChannelCard(channel)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="channel tabs"
            variant="scrollable"
            scrollButtons="auto"
            themecolor={primaryColor}
          >
            <StyledTab label="Недавние" value="recent" />
            <StyledTab label="Популярные" value="popular" />
            {searchQuery && <StyledTab label={`Поиск: ${searchQuery}`} value="search" disabled />}
          </StyledTabs>
        </Box>
        
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {isSearching ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Поиск...
              </Box>
            ) : total > 0 ? (
              `Найдено ${total} каналов`
            ) : (
              !loading && "Нет каналов"
            )}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => setWithDescription(!withDescription)}
              sx={{ 
                color: withDescription ? 'primary.main' : 'text.secondary',
                ml: 1 
              }}
              aria-label="Toggle filtering"
              title={withDescription ? "Показывать все каналы" : "Только с описанием"}
            >
              <FilterAltIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        
        <Grid container spacing={2}>
          {loading ? (
            
            Array.from(new Array(12)).map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <ChannelCardLoader />
              </Grid>
            ))
          ) : (
            channels.length > 0 ? (
              channels.map(channel => (
                <Grid item xs={6} sm={4} md={3} key={channel.id}>
                  {renderChannelCard(channel)}
                </Grid>
              ))
            ) : (
              !loading && (
                <Grid item xs={12}>
                  <EmptyChannelsPlaceholder 
                    message={searchQuery ? `Каналы по запросу "${searchQuery}" не найдены` : "Каналы не найдены"} 
                  />
                </Grid>
              )
            )
          )}
        </Grid>
        
        
        {!loading && channels.length > 0 && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <LoadMoreButton
              variant="contained"
              onClick={loadMoreChannels}
              disabled={loadingMore}
              themecolor={primaryColor}
              startIcon={loadingMore && <CircularProgress size={20} color="inherit" />}
            >
              {loadingMore ? 'Загрузка...' : 'Загрузить еще'}
            </LoadMoreButton>
          </Box>
        )}
      </Box>
      
      
      <Box sx={{ height: '60px', width: '100%' }} />
    </PageContainer>
  );
};

export default ChannelsPage; 