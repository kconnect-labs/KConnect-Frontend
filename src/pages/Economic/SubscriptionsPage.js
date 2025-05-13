import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
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
  useMediaQuery,
  Tooltip
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
  height: 80,
  overflow: 'hidden',
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
  height: 100
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  minHeight: 150
}));


const TruncatedText = styled(({ text, maxLength, variant, component, ...props }) => {
  const needsTruncation = text && text.length > maxLength;
  const displayText = needsTruncation ? `${text.substring(0, maxLength)}...` : text;

  return (
    <Tooltip title={needsTruncation ? text : ''} arrow placement="top">
      <Typography variant={variant} component={component} {...props}>
        {displayText || 'Нет описания'}
      </Typography>
    </Tooltip>
  );
})(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

/**
 * SubscriptionsPage component displaying friends, followers, and following
 * @param {number} tabIndex - Default tab index to show
 */
const SubscriptionsPage = ({ tabIndex = 0 }) => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [value, setValue] = useState(tabIndex);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [friends, setFriends] = useState([]);
  
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  
  const [pageFollowers, setPageFollowers] = useState(1);
  const [pageFollowing, setPageFollowing] = useState(1);
  const [pageFriends, setPageFriends] = useState(1);
  
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [hasMoreFriends, setHasMoreFriends] = useState(true);
  
  const [profileUser, setProfileUser] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState({});
  

  const [requestState, setRequestState] = useState({
    followersInProgress: false,
    followingInProgress: false,
    friendsInProgress: false,
    profileInProgress: false,
  });
  

  const responseCache = useRef({
    followers: {},
    following: {},
    friends: {},
    profile: {},
  });
  
  const loaderRef = useRef(null);
  

  const fetchUserData = useCallback(async () => {
    try {
      const targetUsername = username || currentUser?.username;
      if (!targetUsername) {
        setProfileUser(currentUser);
        return;
      }
      
      if (currentUser && targetUsername === currentUser.username) {
        setProfileUser(currentUser);
        return;
      }
      

      if (responseCache.current.profile[targetUsername]) {
        setProfileUser(responseCache.current.profile[targetUsername]);
        return;
      }
      
      if (requestState.profileInProgress) {
        return;
      }
      

      setRequestState(prev => ({ ...prev, profileInProgress: true }));
      
      const response = await axios.get(`/api/users/${targetUsername}`);
      

      responseCache.current.profile[targetUsername] = response.data;
      setProfileUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setRequestState(prev => ({ ...prev, profileInProgress: false }));
    }
  }, [username, currentUser]);
  

  const fetchFollowers = useCallback(async () => {
    try {
      const targetUsername = username || currentUser?.username;
      
      if (!targetUsername) {
        return;
      }
      

      if (requestState.followersInProgress) {
        return;
      }
      

      const cacheKey = `${targetUsername}_1`;
      if (responseCache.current.followers[cacheKey]) {
        const cachedData = responseCache.current.followers[cacheKey];
        

        const followersList = cachedData.followers || [];
        const filteredFollowers = followersList.filter(follower => !follower.is_friend);
        
        setFollowers(filteredFollowers);
        setHasMoreFollowers(cachedData.has_next || false);
        setPageFollowers(2);
        return;
      }
      
      setIsLoadingFollowers(true);
      setRequestState(prev => ({ ...prev, followersInProgress: true }));
      
      const response = await axios.get(`/api/users/${targetUsername}/followers`, {
        params: { page: 1, per_page: 20 }
      });
      

      responseCache.current.followers[cacheKey] = response.data;
      

      const followersList = response.data.followers || [];
      const filteredFollowers = followersList.filter(follower => !follower.is_friend);
      
      setFollowers(filteredFollowers);
      setHasMoreFollowers(response.data.has_next || false);
      setPageFollowers(2);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setIsLoadingFollowers(false);
      setRequestState(prev => ({ ...prev, followersInProgress: false }));
    }
  }, [username, currentUser]);
  

  const fetchFollowing = useCallback(async () => {
    try {
      const targetUsername = username || currentUser?.username;
      
      if (!targetUsername) {
        return;
      }
      

      if (requestState.followingInProgress) {
        return;
      }
      

      const cacheKey = `${targetUsername}_1`;
      if (responseCache.current.following[cacheKey]) {
        const cachedData = responseCache.current.following[cacheKey];
        setFollowing(cachedData.following || []);
        setHasMoreFollowing(cachedData.has_next || false);
        setPageFollowing(2);
        return;
      }
      
      setIsLoadingFollowing(true);
      setRequestState(prev => ({ ...prev, followingInProgress: true }));
      
      const response = await axios.get(`/api/users/${targetUsername}/following`, {
        params: { page: 1, per_page: 20 }
      });
      

      responseCache.current.following[cacheKey] = response.data;
      
      setFollowing(response.data.following || []);
      setHasMoreFollowing(response.data.has_next || false);
      setPageFollowing(2);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setIsLoadingFollowing(false);
      setRequestState(prev => ({ ...prev, followingInProgress: false }));
    }
  }, [username, currentUser]);
  

  const fetchFriends = useCallback(async () => {
    try {
      const targetUsername = username || currentUser?.username;
      
      if (!targetUsername) {
        return;
      }
      

      if (requestState.friendsInProgress) {
        return;
      }
      

      const cacheKey = `${targetUsername}_1`;
      if (responseCache.current.friends[cacheKey]) {
        const cachedData = responseCache.current.friends[cacheKey];
        setFriends(cachedData.friends || []);
        setHasMoreFriends(cachedData.has_next || false);
        setPageFriends(2);
        return;
      }
      
      setIsLoadingFriends(true);
      setRequestState(prev => ({ ...prev, friendsInProgress: true }));
      
      const response = await axios.get(`/api/profile/${targetUsername}/friends`, {
        params: { page: 1, per_page: 20 }
      });
      

      responseCache.current.friends[cacheKey] = response.data;
      
      setFriends(response.data.friends || []);
      setHasMoreFriends(response.data.has_next || false);
      setPageFriends(2);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoadingFriends(false);
      setRequestState(prev => ({ ...prev, friendsInProgress: false }));
    }
  }, [username, currentUser]);
  

  const loadMoreFollowers = useCallback(async () => {
    try {
      const targetUsername = username || currentUser?.username;
      

      if (isLoadingFollowers || requestState.followersInProgress) {
        return;
      }
      

      const cacheKey = `${targetUsername}_${pageFollowers}`;
      if (responseCache.current.followers[cacheKey]) {
        const cachedData = responseCache.current.followers[cacheKey];
        

        const followersList = cachedData.followers || [];
        const filteredFollowers = followersList.filter(follower => !follower.is_friend);
        
        setFollowers(prev => [...prev, ...filteredFollowers]);
        setHasMoreFollowers(cachedData.has_next || false);
        setPageFollowers(prev => prev + 1);
        return;
      }
      
      setIsLoadingFollowers(true);
      setRequestState(prev => ({ ...prev, followersInProgress: true }));
      
      const response = await axios.get(`/api/users/${targetUsername}/followers`, {
        params: { page: pageFollowers, per_page: 20 }
      });
      

      responseCache.current.followers[cacheKey] = response.data;
      

      const followersList = response.data.followers || [];
      const filteredFollowers = followersList.filter(follower => !follower.is_friend);
      
      setFollowers(prev => [...prev, ...filteredFollowers]);
      setHasMoreFollowers(response.data.has_next || false);
      setPageFollowers(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more followers:', error);
    } finally {
      setIsLoadingFollowers(false);
      setRequestState(prev => ({ ...prev, followersInProgress: false }));
    }
  }, [username, currentUser, pageFollowers, isLoadingFollowers, requestState.followersInProgress]);
  

  const loadMoreFollowing = useCallback(async () => {
    try {
      const targetUsername = username || currentUser?.username;
      

      if (isLoadingFollowing || requestState.followingInProgress) {
        return;
      }
      

      const cacheKey = `${targetUsername}_${pageFollowing}`;
      if (responseCache.current.following[cacheKey]) {
        const cachedData = responseCache.current.following[cacheKey];
        setFollowing(prev => [...prev, ...(cachedData.following || [])]);
        setHasMoreFollowing(cachedData.has_next || false);
        setPageFollowing(prev => prev + 1);
        return;
      }
      
      setIsLoadingFollowing(true);
      setRequestState(prev => ({ ...prev, followingInProgress: true }));
      
      const response = await axios.get(`/api/users/${targetUsername}/following`, {
        params: { page: pageFollowing, per_page: 20 }
      });
      

      responseCache.current.following[cacheKey] = response.data;
      
      setFollowing(prev => [...prev, ...(response.data.following || [])]);
      setHasMoreFollowing(response.data.has_next || false);
      setPageFollowing(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more following:', error);
    } finally {
      setIsLoadingFollowing(false);
      setRequestState(prev => ({ ...prev, followingInProgress: false }));
    }
  }, [username, currentUser, pageFollowing, isLoadingFollowing, requestState.followingInProgress]);
  

  const loadMoreFriends = useCallback(async () => {
    try {
      const targetUsername = username || currentUser?.username;
      

      if (isLoadingFriends || requestState.friendsInProgress) {
        return;
      }
      

      const cacheKey = `${targetUsername}_${pageFriends}`;
      if (responseCache.current.friends[cacheKey]) {
        const cachedData = responseCache.current.friends[cacheKey];
        setFriends(prev => [...prev, ...(cachedData.friends || [])]);
        setHasMoreFriends(cachedData.has_next || false);
        setPageFriends(prev => prev + 1);
        return;
      }
      
      setIsLoadingFriends(true);
      setRequestState(prev => ({ ...prev, friendsInProgress: true }));
      
      const response = await axios.get(`/api/profile/${targetUsername}/friends`, {
        params: { page: pageFriends, per_page: 20 }
      });
      

      responseCache.current.friends[cacheKey] = response.data;
      
      setFriends(prev => [...prev, ...(response.data.friends || [])]);
      setHasMoreFriends(response.data.has_next || false);
      setPageFriends(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more friends:', error);
    } finally {
      setIsLoadingFriends(false);
      setRequestState(prev => ({ ...prev, friendsInProgress: false }));
    }
  }, [username, currentUser, pageFriends, isLoadingFriends, requestState.friendsInProgress]);
  

  useEffect(() => {
    fetchUserData();
  }, [username, currentUser, fetchUserData]);
  

  useEffect(() => {
    if (value === 0 && friends.length === 0 && !requestState.friendsInProgress) {
      fetchFriends();
    } else if (value === 1 && followers.length === 0 && !requestState.followersInProgress) {
      fetchFollowers();
    } else if (value === 2 && following.length === 0 && !requestState.followingInProgress) {
      fetchFollowing();
    }
  }, [value, username, followers.length, following.length, friends.length, 
      fetchFollowers, fetchFollowing, fetchFriends, requestState]);
  

  useEffect(() => {
    let timeoutId = null;
    
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {

          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          timeoutId = setTimeout(() => {
            if (value === 0 && hasMoreFriends && !isLoadingFriends && !requestState.friendsInProgress) {
              loadMoreFriends();
            } else if (value === 1 && hasMoreFollowers && !isLoadingFollowers && !requestState.followersInProgress) {
              loadMoreFollowers();
            } else if (value === 2 && hasMoreFollowing && !isLoadingFollowing && !requestState.followingInProgress) {
              loadMoreFollowing();
            }
          }, 300);
        }
      },
      { threshold: 0.5 }
    );
    
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [value, hasMoreFollowers, hasMoreFollowing, hasMoreFriends, 
      isLoadingFollowers, isLoadingFollowing, isLoadingFriends,
      loadMoreFollowers, loadMoreFollowing, loadMoreFriends, requestState]);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  

  const clearUserCache = () => {
    responseCache.current.followers = {};
    responseCache.current.following = {};
    responseCache.current.friends = {};
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
        
        setFriends(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: true } : user
        ));
        
        clearUserCache();
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
        
        setFriends(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: false } : user
        ));
        
        clearUserCache();
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
    const isChannel = user.account_type === 'channel';
    
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
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0, flexShrink: 1 }}>
            <Avatar
              src={avatarUrl || '/static/uploads/avatar/system/avatar.png'}
              alt={user.name || user.username}
              sx={{ 
                width: 50, 
                height: 50,
                minWidth: 50,
                marginRight: 2,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1, flexShrink: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TruncatedText 
                  text={user.name || user.username}
                  maxLength={15}
                  variant="subtitle1" 
                  component="a" 
                  href={`/profile/${user.username}`}
                  sx={{ 
                    color: 'text.primary',
                    textDecoration: 'none', 
                    '&:hover': {
                      color: 'primary.main'
                    },
                    flexShrink: 1,
                    minWidth: 0
                  }}
                />
                {user.is_verified && (
                  <CheckCircleIcon 
                    sx={{ 
                      ml: 0.5,
                      fontSize: 16, 
                      color: 'primary.main',
                      flexShrink: 0
                    }} 
                  />
                )}
              </Box>
              <TruncatedText 
                text={user.about} 
                maxLength={25}
                variant="body2" 
                component="div"
                sx={{ color: 'text.secondary', flexShrink: 1, minWidth: 0 }}
              />
            </Box>
          </Box>
          
          {!isCurrentUser && currentUser && currentUser.account_type !== 'channel' && (
            <Box sx={{ ml: 2, flexShrink: 0 }}>
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
          <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2, flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={200} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
        </Box>
      </ProfileCard>
    ));
  };
  
  const renderEmptyState = (type) => {
    let message = '';
    
    switch(type) {
      case 'followers':
        message = profileUser?.account_type === 'channel' ? 'Нет подписчиков' : 'Нет подписчиков';
        break;
      case 'friends':
        message = 'Нет друзей';
        break;
      case 'following':
        message = 'Нет подписок';
        break;
      default:
        message = 'Ничего не найдено';
    }
    
    return (
      <EmptyStateContainer>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
        {type === 'friends' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 300 }}>
            Друзья — это пользователи, с которыми у вас взаимные подписки
          </Typography>
        )}
      </EmptyStateContainer>
    );
  };
  

  const getTabLabel = (type) => {
    const isChannel = profileUser?.account_type === 'channel';
    
    switch(type) {
      case 'followers':
        return isChannel ? 'Подписчики' : 'Подписчики';
      case 'friends':
        return 'Друзья';
      case 'following':
        return 'Подписки';
      default:
        return '';
    }
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
          {profileUser 
            ? `${profileUser.username} · ${profileUser.account_type === 'channel' ? 'Подписчики' : 'Социальные связи'}`
            : 'Подписки и подписчики'
          }
        </Typography>
      </Box>
      
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 3,
        '& .MuiTabs-flexContainer': {
          justifyContent: isMobile ? 'space-between' : 'flex-start' 
        }
      }}>
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
              textTransform: 'none',
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: 500,
              minWidth: isMobile ? 0 : 100,
              flexGrow: isMobile ? 1 : 0,
              padding: isMobile ? '12px 8px' : '12px 16px',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3,
            },
          }}
        >
          <Tab label={getTabLabel('friends')} />
          <Tab label={getTabLabel('followers')} />
          <Tab label={getTabLabel('following')} />
        </Tabs>
      </Box>
      
      {/* Friends Tab */}
      <Box role="tabpanel" hidden={value !== 0}>
        {value === 0 && (
          <>
            {isLoadingFriends && friends.length === 0 ? (
              renderSkeletonCards()
            ) : friends.length > 0 ? (
              friends.map(user => renderProfileCard(user))
            ) : (
              renderEmptyState('friends')
            )}
          </>
        )}
      </Box>
      
      {/* Followers Tab */}
      <Box role="tabpanel" hidden={value !== 1}>
        {value === 1 && (
          <>
            {isLoadingFollowers && followers.length === 0 ? (
              renderSkeletonCards()
            ) : followers.length > 0 ? (
              followers.map(user => renderProfileCard(user))
            ) : (
              renderEmptyState('followers')
            )}
          </>
        )}
      </Box>
      
      {/* Following Tab */}
      <Box role="tabpanel" hidden={value !== 2}>
        {value === 2 && (
          <>
            {isLoadingFollowing && following.length === 0 ? (
              renderSkeletonCards()
            ) : following.length > 0 ? (
              following.map(user => renderProfileCard(user))
            ) : (
              renderEmptyState('following')
            )}
          </>
        )}
      </Box>
      
      {/* Loading indicator for infinite scroll */}
      {((value === 0 && hasMoreFriends) || 
        (value === 1 && hasMoreFollowers) ||
        (value === 2 && hasMoreFollowing)) && (
        <LoadingContainer ref={loaderRef}>
          <CircularProgress size={40} />
        </LoadingContainer>
      )}
    </Container>
  );
};

export default SubscriptionsPage; 