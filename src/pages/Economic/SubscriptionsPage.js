import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Avatar, 
  Button, 
  Paper, 
  CircularProgress,
  IconButton,
  Skeleton,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const ProfileCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  }
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const SubscriptionsPage = ({ tabIndex = 0 }) => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [value, setValue] = useState(tabIndex);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(true);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [pageFollowers, setPageFollowers] = useState(1);
  const [pageFollowing, setPageFollowing] = useState(1);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [profileUser, setProfileUser] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState({});
  
  const loaderRef = useRef(null);
  
  // Get user data for the profile we're viewing
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // If username is not provided, use current user
        const targetUsername = username || currentUser?.username;
        if (!targetUsername) {
          setProfileUser(currentUser);
          return;
        }
        
        // If viewing our own profile/subscriptions
        if (currentUser && targetUsername === currentUser.username) {
          setProfileUser(currentUser);
        } else {
          // Fetch user data for the specified username
          const response = await axios.get(`/api/users/${targetUsername}`);
          setProfileUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserData();
  }, [username, currentUser]);
  
  // Load followers
  useEffect(() => {
    if (value === 0) {
      fetchFollowers();
    }
  }, [value, username]);
  
  // Load following
  useEffect(() => {
    if (value === 1) {
      fetchFollowing();
    }
  }, [value, username]);
  
  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {
          if (value === 0 && hasMoreFollowers && !isLoadingFollowers) {
            loadMoreFollowers();
          } else if (value === 1 && hasMoreFollowing && !isLoadingFollowing) {
            loadMoreFollowing();
          }
        }
      },
      { threshold: 1.0 }
    );
    
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [value, hasMoreFollowers, hasMoreFollowing, isLoadingFollowers, isLoadingFollowing]);
  
  const fetchFollowers = async () => {
    try {
      setIsLoadingFollowers(true);
      const targetUsername = username || currentUser?.username;
      
      if (!targetUsername) {
        setIsLoadingFollowers(false);
        return;
      }
      
      const response = await axios.get(`/api/users/${targetUsername}/followers`, {
        params: { page: 1, per_page: 20 }
      });
      
      setFollowers(response.data.followers || []);
      setHasMoreFollowers(response.data.has_next || false);
      setPageFollowers(2);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setIsLoadingFollowers(false);
    }
  };
  
  const fetchFollowing = async () => {
    try {
      setIsLoadingFollowing(true);
      const targetUsername = username || currentUser?.username;
      
      if (!targetUsername) {
        setIsLoadingFollowing(false);
        return;
      }
      
      const response = await axios.get(`/api/users/${targetUsername}/following`, {
        params: { page: 1, per_page: 20 }
      });
      
      setFollowing(response.data.following || []);
      setHasMoreFollowing(response.data.has_next || false);
      setPageFollowing(2);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setIsLoadingFollowing(false);
    }
  };
  
  const loadMoreFollowers = async () => {
    try {
      setIsLoadingFollowers(true);
      const targetUsername = username || currentUser?.username;
      
      const response = await axios.get(`/api/users/${targetUsername}/followers`, {
        params: { page: pageFollowers, per_page: 20 }
      });
      
      setFollowers(prev => [...prev, ...(response.data.followers || [])]);
      setHasMoreFollowers(response.data.has_next || false);
      setPageFollowers(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more followers:', error);
    } finally {
      setIsLoadingFollowers(false);
    }
  };
  
  const loadMoreFollowing = async () => {
    try {
      setIsLoadingFollowing(true);
      const targetUsername = username || currentUser?.username;
      
      const response = await axios.get(`/api/users/${targetUsername}/following`, {
        params: { page: pageFollowing, per_page: 20 }
      });
      
      setFollowing(prev => [...prev, ...(response.data.following || [])]);
      setHasMoreFollowing(response.data.has_next || false);
      setPageFollowing(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more following:', error);
    } finally {
      setIsLoadingFollowing(false);
    }
  };
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleFollow = async (userId) => {
    try {
      setLoadingFollow(prev => ({ ...prev, [userId]: true }));
      const response = await axios.post(`/api/profile/follow`, {
        followed_id: userId
      });
      
      if (response.data.success) {
        // Update followers list with new is_following status
        setFollowers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: true } : user
        ));
        
        // Update following list with new is_following status
        setFollowing(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: true } : user
        ));
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleUnfollow = async (userId) => {
    try {
      setLoadingFollow(prev => ({ ...prev, [userId]: true }));
      const response = await axios.post(`/api/profile/follow`, {
        followed_id: userId
      });
      
      if (response.data.success) {
        // Update followers list with new is_following status
        setFollowers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: response.data.is_following } : user
        ));
        
        // Update following list with new is_following status
        setFollowing(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: response.data.is_following } : user
        ));
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const renderProfileCard = (user) => {
    const isCurrentUser = currentUser && user.id === currentUser.id;
    const isFollowing = user.is_following;
    const isLoading = loadingFollow[user.id] || false;
    
    return (
      <ProfileCard key={user.id} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Avatar
          src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'}
          alt={user.name}
          component={Link}
          to={`/profile/${user.username}`}
          sx={{ 
            width: 50, 
            height: 50,
            mr: 2,
            border: '2px solid #D0BCFF'
          }}
        />
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to={`/profile/${user.username}`}
            sx={{ 
              textDecoration: 'none', 
              color: 'text.primary',
              '&:hover': { color: 'primary.main' },
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {user.name}
            {user.verification && user.verification.status > 0 && (
              <CheckCircleIcon 
                sx={{ 
                  color: user.verification.status === 1 ? '#9e9e9e' : 
                         user.verification.status === 2 ? '#d67270' : 
                         user.verification.status === 3 ? '#b39ddb' :
                         user.verification.status === 4 ? '#ff9800' : 
                         'primary.main',
                  ml: 0.5,
                  width: 20,
                  height: 20
                }} 
              />
            )}
            {user.achievement && (
              <Box 
                component="img" 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  ml: 0.5 
                }} 
                src={`/bages/${user.achievement.image_path}`} 
                alt={user.achievement.bage}
                onError={(e) => {
                  console.error("Achievement badge failed to load:", e);
                  e.target.style.display = 'none';
                }}
              />
            )}
          </Typography>
          
          {user.username && (
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          )}
          
          {user.about && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {user.about}
            </Typography>
          )}
        </Box>
        
        {!isCurrentUser && (
          isFollowing ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={isLoading ? <CircularProgress size={16} /> : <PersonRemoveIcon />}
              onClick={() => handleUnfollow(user.id)}
              disabled={isLoading}
              sx={{ 
                minWidth: isMobile ? 'auto' : '120px',
                ml: 1
              }}
            >
              {isMobile ? '' : 'Отписаться'}
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={isLoading ? <CircularProgress size={16} /> : <PersonAddIcon />}
              onClick={() => handleFollow(user.id)}
              disabled={isLoading}
              sx={{ 
                minWidth: isMobile ? 'auto' : '120px',
                ml: 1
              }}
            >
              {isMobile ? '' : 'Подписаться'}
            </Button>
          )
        )}
      </ProfileCard>
    );
  };
  
  const renderSkeletonCards = () => {
    return Array(5).fill().map((_, index) => (
      <ProfileCard key={index}>
        <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
      </ProfileCard>
    ));
  };
  
  const targetUsername = username || currentUser?.username || '';
  const title = profileUser ? 
    `${profileUser.name}${username ? '' : ' — Ваши подписки'}` : 
    'Подписки';
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          aria-label="Назад"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">{title}</Typography>
      </Box>
      
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant="fullWidth"
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              fontWeight: 'bold',
            }
          }}
        >
          <Tab label="Подписчики" />
          <Tab label="Подписки" />
        </Tabs>
        
        <Box role="tabpanel" hidden={value !== 0}>
          {value === 0 && (
            <>
              {isLoadingFollowers && followers.length === 0 ? (
                renderSkeletonCards()
              ) : followers.length > 0 ? (
                <>
                  {followers.map(renderProfileCard)}
                  
                  {hasMoreFollowers && (
                    <LoadingContainer ref={loaderRef}>
                      <CircularProgress size={30} />
                    </LoadingContainer>
                  )}
                </>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">У {username ? 'этого пользователя' : 'вас'} еще нет подписчиков</Typography>
                </Paper>
              )}
            </>
          )}
        </Box>
        
        <Box role="tabpanel" hidden={value !== 1}>
          {value === 1 && (
            <>
              {isLoadingFollowing && following.length === 0 ? (
                renderSkeletonCards()
              ) : following.length > 0 ? (
                <>
                  {following.map(renderProfileCard)}
                  
                  {hasMoreFollowing && (
                    <LoadingContainer ref={loaderRef}>
                      <CircularProgress size={30} />
                    </LoadingContainer>
                  )}
                </>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">{username ? 'Этот пользователь' : 'Вы'} еще ни на кого не подписались</Typography>
                </Paper>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default SubscriptionsPage; 