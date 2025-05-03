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
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const targetUsername = username || currentUser?.username;
        if (!targetUsername) {
          setProfileUser(currentUser);
          return;
        }
        
        if (currentUser && targetUsername === currentUser.username) {
          setProfileUser(currentUser);
        } else {
          const response = await axios.get(`/api/users/${targetUsername}`);
          setProfileUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserData();
  }, [username, currentUser]);
  
  useEffect(() => {
    if (value === 0) {
      fetchFollowers();
    }
  }, [value, username]);
  
  useEffect(() => {
    if (value === 1) {
      fetchFollowing();
    }
  }, [value, username]);
  
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
        setFollowers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: true } : user
        ));
        
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
      const response = await axios.post(`/api/profile/unfollow`, {
        unfollowed_id: userId
      });
      
      if (response.data.success) {
        setFollowers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: false } : user
        ));
        
        setFollowing(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: false } : user
        ));
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const renderProfileCard = (user) => {
    const isFollowing = user.is_following;
    const isCurrentUser = currentUser && user.id === currentUser.id;
    
    let avatarUrl = user.photo;
    if (avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('/')) {
      avatarUrl = `/static/uploads/avatar/${user.id}/${avatarUrl}`;
    }
    
    return (
      <motion.div
        key={user.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProfileCard>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar
              src={avatarUrl || '/static/uploads/avatar/system/avatar.png'}
              alt={user.name || user.username}
              sx={{ 
                width: 50, 
                height: 50,
                marginRight: 2,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="subtitle1" 
                  component={Link} 
                  to={`/profile/${user.username}`}
                  sx={{ 
                    color: 'text.primary',
                    textDecoration: 'none', 
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {user.name || user.username}
                </Typography>
                {user.is_verified && (
                  <CheckCircleIcon 
                    sx={{ 
                      ml: 0.5,
                      fontSize: 16, 
                      color: 'primary.main' 
                    }} 
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.about ? 
                  (user.about.length > 15 ? user.about.substring(0, 15) + '...' : user.about) 
                  : 'Нет описания'}
              </Typography>
            </Box>
          </Box>
          
          {!isCurrentUser && currentUser && (
            <Box sx={{ ml: 2 }}>
              {isFollowing ? (
                <IconButton
                  onClick={() => handleUnfollow(user.id)}
                  disabled={loadingFollow[user.id]}
                  color="primary"
                  size="small"
                >
                  {loadingFollow[user.id] ? (
                    <CircularProgress size={24} />
                  ) : (
                    <PersonRemoveIcon />
                  )}
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => handleFollow(user.id)}
                  disabled={loadingFollow[user.id]}
                  color="primary"
                  size="small"
                >
                  {loadingFollow[user.id] ? (
                    <CircularProgress size={24} />
                  ) : (
                    <PersonAddIcon />
                  )}
                </IconButton>
              )}
            </Box>
          )}
        </ProfileCard>
      </motion.div>
    );
  };
  
  const renderSkeletonCards = () => {
    return Array(3).fill(0).map((_, index) => (
      <ProfileCard key={index}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={200} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </ProfileCard>
    ));
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {profileUser ? `Подписки ${profileUser.username}` : 'Подписки'}
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{ 
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
          }}
        >
          <Tab label={`Подписчики (${followers.length})`} />
          <Tab label={`Подписки (${following.length})`} />
        </Tabs>
      </Box>
        
        <Box role="tabpanel" hidden={value !== 0}>
          {value === 0 && (
            <>
              {isLoadingFollowers && followers.length === 0 ? (
                renderSkeletonCards()
            ) : (
              followers.map(user => renderProfileCard(user))
              )}
            </>
          )}
        </Box>
        
        <Box role="tabpanel" hidden={value !== 1}>
          {value === 1 && (
            <>
              {isLoadingFollowing && following.length === 0 ? (
                renderSkeletonCards()
            ) : (
              following.map(user => renderProfileCard(user))
              )}
            </>
          )}
        </Box>
      
      {((value === 0 && hasMoreFollowers) || (value === 1 && hasMoreFollowing)) && (
        <LoadingContainer ref={loaderRef}>
          <CircularProgress size={40} />
        </LoadingContainer>
      )}
    </Container>
  );
};

export default SubscriptionsPage; 