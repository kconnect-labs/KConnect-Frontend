import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Container, 
  Grid, 
  Avatar, 
  Paper, 
  Tabs, 
  Tab, 
  IconButton, 
  Tooltip, 
  Link as MuiLink,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Link, useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import 'react-medium-image-zoom/dist/styles.css';
import { ThemeSettingsContext } from '../../App';
import { UsernameCard, VerificationBadge } from '../../UIKIT';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { useLanguage } from '../../context/LanguageContext';
// Импорты вынесенных компонентов
import { 
  CreatePost, 
  TabPanel, 
  SubscriptionBadge,
  UpgradeEffects,
  UserStatus,
  InventoryTab,
  PostsFeed, 
  WallFeed, 
  EquippedItem 
} from './ProfilePage/components';
import { getLighterColor } from './ProfilePage/utils/colorUtils';
import { requireAuth } from './ProfilePage/utils/authUtils';

import { WallPostsTab, PostsTab } from './ProfilePage/components/TabComponents';
import ImageLightbox from './ProfilePage/components/ImageLightbox';
import { useLightbox } from './ProfilePage/hooks/useLightbox';
import ProfileLoader from './ProfilePage/components/ProfileLoader';
import UserNotFound from './ProfilePage/components/UserNotFound';
import ProfileInfo from './ProfilePage/components/ProfileInfo';
import { useTabs } from './ProfilePage/hooks/useTabs';
import { usePostActions } from './ProfilePage/hooks/usePostActions';
import UserBanInfo from './ProfilePage/components/UserBanInfo';
import UserScamBadge from './ProfilePage/components/UserScamBadge';
import UserSubscriptionBadge from './ProfilePage/components/UserSubscriptionBadge';
import { OwnedUsernames } from './ProfilePage/components';
import { ProfileAbout } from './ProfilePage/components';



const ProfilePage = () => {
  const { t } = useLanguage();
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [ownedUsernames, setOwnedUsernames] = useState([]);
  const [equippedItems, setEquippedItems] = useState([]);
  const [photos, setPhotos] = useState([]);  
  const [videos, setVideos] = useState([]);  
  const { tabValue, setTabValue, handleTabChange } = useTabs();
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [socials, setSocials] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { themeSettings, setProfileBackground, clearProfileBackground, globalProfileBackgroundEnabled } = useContext(ThemeSettingsContext);
  const [totalLikes, setTotalLikes] = useState(0);
  
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState(null);
  
  const [fallbackAvatarUrl, setFallbackAvatarUrl] = useState('');
  
  const [medals, setMedals] = useState([]);
  const [loadingMedals, setLoadingMedals] = useState(false);
  
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [usernameCardAnchor, setUsernameCardAnchor] = useState(null);
  const [usernameCardOpen, setUsernameCardOpen] = useState(false);
  

  const [userBanInfo, setUserBanInfo] = useState(null);
  

  const [isCurrentUserModerator, setIsCurrentUserModerator] = useState(false);
  
  const { lightboxIsOpen, currentImage, openLightbox, closeLightbox } = useLightbox();
  const { handlePostCreated } = usePostActions();
  
  const handleFollow = async () => {
    if (!requireAuth(currentUser, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      const response = await axios.post('/api/profile/follow', {
        followed_id: user.id
      });
      
      if (response.data.success) {
        setFollowing(response.data.is_following);
        setFollowersCount(prev => response.data.is_following ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log(`Fetching profile for username: ${username}`);
        
        const response = await axios.get(`/api/profile/${username}`);
        console.log("Profile API response:", response.data);
        
        
        console.log("Profile achievement data:", {
          rootAchievement: response.data.achievement_data,
          userAchievement: response.data.user?.achievement
        });
        
        
        if (response.data.user) {
          
          if (response.data.user.verification_status === undefined && response.data.verification) {
            response.data.user.verification_status = response.data.verification.status || null;
          }
          
          
          if (response.data.achievement) {
            response.data.user.achievement = response.data.achievement;
            console.log('Copied achievement data from root to user object:', response.data.achievement);
          }
          
          // Копируем connect_info из корневого объекта, если он есть
          if (response.data.connect_info) {
            response.data.user.connect_info = response.data.connect_info;
            console.log('Copied connect_info from root to user object:', response.data.connect_info);
          }
          
          setUser(response.data.user);
          
          
          if (response.data.user.total_likes !== undefined) {
            setTotalLikes(response.data.user.total_likes);
          }
          
          
          if (response.data.subscription) {
            response.data.user.subscription = response.data.subscription;
            console.log('Subscription data found:', response.data.subscription);
          } else if (response.data.user.subscription) {
            console.log('Subscription data found in user object:', response.data.user.subscription);
          } else {
            console.log('No subscription data found in API response');
            console.log('Full API response:', response.data);
          }
          
          
          
          if (response.data.user.photos) {
            
            const photosData = Array.isArray(response.data.user.photos) ? response.data.user.photos : [];
            setPhotos(photosData);
          } else {
            setPhotos([]);
          }
          
          if (response.data.user.videos) {
            
            const videosData = Array.isArray(response.data.user.videos) ? response.data.user.videos : [];
            setVideos(videosData);
          } else {
            setVideos([]);
          }
          
          
          if (response.data.user.followers_count !== undefined) {
            setFollowersCount(response.data.user.followers_count);
          }
          
          if (response.data.user.following_count !== undefined) {
            setFollowingCount(response.data.user.following_count);
          }
          
          
          if (response.data.user.is_following !== undefined) {
            setFollowing(response.data.user.is_following);
          } else if (response.data.is_following !== undefined) {
            setFollowing(response.data.is_following);
          }
          
          if (response.data.user.posts_count !== undefined) {
            setPostsCount(response.data.user.posts_count);
          } else if (response.data.posts_count !== undefined) {
            setPostsCount(response.data.posts_count);
          }
          
          
          if (response.data.socials) {
            setSocials(response.data.socials);
          }
          
          try {
            const usernamesResponse = await axios.get(`/api/username/purchased/${response.data.user.id}`);
            if (usernamesResponse.data.success) {
              const otherUsernames = usernamesResponse.data.usernames
                .filter(item => !item.is_active && item.username !== response.data.user.username)
                .map(item => item.username);
              
              setOwnedUsernames(otherUsernames);
            }
          } catch (error) {
            console.error('Error fetching owned usernames:', error);
            setOwnedUsernames([]);
          }
          

          if (response.data.user.ban || response.data.ban) {
            setUserBanInfo(response.data.user.ban || response.data.ban);
          } else {
            setUserBanInfo(null);
          }
          

          if (response.data.current_user_is_moderator !== undefined) {
            setIsCurrentUserModerator(response.data.current_user_is_moderator);
          }
          
          // Получаем надетые предметы из API профиля
          if (response.data.equipped_items) {
            setEquippedItems(response.data.equipped_items);
          } else {
            setEquippedItems([]);
          }
        } else {
          console.error('User data not found in response', response.data);
          setUser(null); 
        }
      } catch (error) {
        console.error('Error fetching profile', error);
        if (error.response && error.response.status === 404) {
          
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchUserProfile();
  }, [username, setLoading, setUser, setFollowersCount, setFollowingCount, setFollowing, setPostsCount, setSocials, setTotalLikes]);
  
  
  useEffect(() => {
    if (!currentUser) {
      setUser(null);
    }
  }, [currentUser]);

  
  useEffect(() => {
    
    if (user && user.id) {
      setLoadingFollowers(true);
      setLoadingFollowing(true);
      setLoadingFriends(true);
      
      console.log(`Загрузка подписчиков для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/followers`)
        .then(response => {
          console.log('Ответ API подписчиков:', response.data);
          if (response.data && response.data.followers) {
            
            const followersData = Array.isArray(response.data.followers) 
              ? response.data.followers.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${followersData.length} подписчиков`);
            setFollowers(followersData);
          } else {
            
            console.warn('Нет данных о подписчиках в ответе API');
            setFollowers([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки подписчиков:', error);
          setFollowers([]); 
        })
        .finally(() => {
          setLoadingFollowers(false);
        });
      
      console.log(`Загрузка подписок для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/following`)
        .then(response => {
          console.log('Ответ API подписок:', response.data);
          if (response.data && response.data.following) {
            
            const followingData = Array.isArray(response.data.following) 
              ? response.data.following.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${followingData.length} подписок`);
            setFollowingList(followingData);
          } else {
            
            console.warn('Нет данных о подписках в ответе API');
            setFollowingList([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки подписок:', error);
          setFollowingList([]); 
        })
        .finally(() => {
          setLoadingFollowing(false);
        });
        
      console.log(`Загрузка друзей для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/friends`)
        .then(response => {
          console.log('Ответ API друзей:', response.data);
          if (response.data && response.data.friends) {
            
            const friendsData = Array.isArray(response.data.friends) 
              ? response.data.friends.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${friendsData.length} друзей`);
            setFriends(friendsData);
          } else {
            
            console.warn('Нет данных о друзьях в ответе API');
            setFriends([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки друзей:', error);
          setFriends([]); 
        })
        .finally(() => {
          setLoadingFriends(false);
        });
    }
  }, [user]);

  
  useEffect(() => {
    const fetchTotalLikes = async () => {
      try {
        if (user && user.id) {
          const response = await axios.get(`/api/profile/${user.id}/stats`);
          if (response.data && response.data.total_likes !== undefined) {
            setTotalLikes(response.data.total_likes);
          } else {
            setTotalLikes(0);
          }
        }
      } catch (error) {
        console.error('Error fetching total likes:', error);
        setTotalLikes(0);
      }
    };
    
    if (user && user.id) {
      fetchTotalLikes();
    }
  }, [user]);

  
  const fetchOnlineStatus = async () => {
    try {
      if (!username) return;
      
      const response = await axios.get(`/api/profile/${username}/online_status`);
      
      if (response.data.success) {
        setIsOnline(response.data.is_online);
        setLastActive(response.data.last_active);
      }
    } catch (error) {
      console.error('Error fetching online status:', error);
    }
  };
  
  
  useEffect(() => {
    if (username) {
      fetchOnlineStatus();
    }
  }, [username]);

  
  useEffect(() => {
    if (user) {
      console.log('User state after setting:', {
        name: user.name,
        achievement: user.achievement,
        verification_status: user.verification_status
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchUserMedals();
    }
  }, [user]);

  const fetchUserMedals = async () => {
    try {
      setLoadingMedals(true);
      const response = await axios.get(`/api/profile/${user.id}/medals`);
      if (response.data.success) {
        setMedals(response.data.medals || []);
      } else {
        console.error('Error fetching medals:', response.data.error);
        setMedals([]);
      }
    } catch (error) {
      console.error('Error fetching medals:', error);
      setMedals([]);
    } finally {
      setLoadingMedals(false);
    }
  };


  const handleUsernameClick = (event, username) => {
    event.preventDefault();
    setSelectedUsername(username);
    setUsernameCardOpen(true);
  };
  
  const handleCloseUsernameCard = () => {
    setUsernameCardOpen(false);
  };

  // Функция для обновления надетых предметов
  const refreshEquippedItems = async () => {
    if (user?.id) {
      try {
        const response = await axios.get(`/api/inventory/user/${user.id}/equipped`);
        if (response.data.success) {
          setEquippedItems(response.data.equipped_items || []);
        }
      } catch (error) {
        console.error('Error refreshing equipped items:', error);
      }
    }
  };

  useEffect(() => {
    const restoreMyBackground = () => {
      if (globalProfileBackgroundEnabled) {
        let myBg = localStorage.getItem('myProfileBackgroundUrl');
        if (!myBg) {
          const match = document.cookie.match(/(?:^|; )myProfileBackgroundUrl=([^;]*)/);
          if (match) myBg = decodeURIComponent(match[1]);
        }
        if (myBg) {
          setProfileBackground(myBg);
        } else {
          clearProfileBackground();
        }
      } else {
        clearProfileBackground();
      }
    };

    if (user?.profile_background_url) {
      setProfileBackground(user.profile_background_url);
      return () => {
        restoreMyBackground();
      };
    } else {
      restoreMyBackground();
    }
  }, [user, globalProfileBackgroundEnabled, setProfileBackground, clearProfileBackground]);

  const [searchParams] = useSearchParams();
  const itemIdToOpen = searchParams.get('item');

  useEffect(() => {
    if (itemIdToOpen) {
      setTabValue(2);
    }
  }, [itemIdToOpen]);

  if (loading) {
    return <ProfileLoader />;
  }
  
  if (!user) {
    return <UserNotFound />;
  }
  
  const isCurrentUser = currentUser && currentUser.username === user.username;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: 0, 
        pb: 4, 
        px: { xs: 0.5, sm: 1 },
        width: '100%',
        marginRight: 'auto',
        marginLeft: '0!important',
        paddingTop: '24px',
        paddingBottom: '40px',
        paddingLeft: '0',
        paddingRight: '0',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Grid 
        container 
        spacing={0.5}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: { xs: 'nowrap', md: 'nowrap' }
        }}
      >
        
        <Grid item xs={12} md={5} sx={{ 
          position: { xs: 'static', md: 'sticky' },
          top: '60px',
          height: 'fit-content',
          zIndex: 2
        }}>
          
          <Paper sx={{
            p: 0,
            borderRadius: '16px',
            background: user?.profile_id === 2 && user?.banner_url
              ? `url(${user.banner_url}), rgba(255, 255, 255, 0.03)`
              : 'rgba(255, 255, 255, 0.03)',
            backgroundSize: user?.profile_id === 2 && user?.banner_url ? 'cover' : undefined,
            backgroundPosition: user?.profile_id === 2 && user?.banner_url ? 'center' : undefined,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            mb: '5px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Banner section */}
            {user?.profile_id !== 2 ? (
              user?.banner_url ? (
                <Box sx={{ 
                  width: '100%',
                  height: { xs: 150, sm: 200 },
                  backgroundImage: `url(${user.banner_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1
                  }
                }}></Box>
              ) : (
                <Box sx={{ 
                  width: '100%',
                  height: { xs: 100, sm: 120 },
                  position: 'relative',
                }}></Box>
              )
            ) : (
              null
            )}
            
            <Box sx={{ px: 3, pb: 3, pt: 0, mt: user?.profile_id === 2 ? 2 : -7 }}>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                
                <Box sx={{ position: 'relative' }}>
                  <Tooltip title="Открыть аватар" arrow placement="top">
                    <Avatar 
                      src={user?.avatar_url} 
                      alt={user?.name}
                      onClick={() => {
                        const imageUrl = user?.avatar_url || fallbackAvatarUrl;
                        if (imageUrl) openLightbox(imageUrl);
                      }}
                      sx={{ 
                        width: { xs: 110, sm: 130 }, 
                        height: { xs: 110, sm: 130 }, 
                        border: (user?.status_color && user?.status_text && user?.subscription) 
                          ? `4px solid ${user.status_color}` 
                          : user?.subscription 
                            ? `4px solid ${user.subscription.type === 'premium' ? 'rgba(186, 104, 200)' : user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255)' : user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255)' : 'rgba(66, 165, 245)'}` 
                          : theme => theme.palette.mode === 'dark'
                              ? '4px solid #121212'
                              : '4px solid #ffffff',
                        boxShadow: (user?.status_color && user?.status_text && user.subscription) 
                          ? `0 0 15px ${user.status_color}80` 
                          : user?.subscription 
                            ? (user.subscription.type === 'premium' ? '0 0 15px rgba(186, 104, 200, 0.5)' : user.subscription.type === 'pick-me' ? '0 0 15px rgba(208, 188, 255, 0.5)' : user.subscription.type === 'ultimate' ? '0 0 15px rgba(124, 77, 255, 0.5)' : '0 0 15px rgba(66, 165, 245, 0.5)') 
                            : '0 8px 20px rgba(0, 0, 0, 0.25)',
                        bgcolor: 'primary.dark',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: (user?.status_color && user?.status_text && user.subscription) 
                            ? `0 0 20px ${user.status_color}B3` 
                            : user?.subscription 
                              ? (user.subscription.type === 'premium' ? '0 0 20px rgba(186, 104, 200, 0.7)' : user.subscription.type === 'pick-me' ? '0 0 20px rgba(208, 188, 255, 0.7)' : user.subscription.type === 'ultimate' ? '0 0 20px rgba(124, 77, 255, 0.7)' : '0 0 20px rgba(66, 165, 245, 0.7)') 
                              : '0 10px 25px rgba(0, 0, 0, 0.35)',
                          border: (user?.status_color && user?.status_text && user.subscription) 
                            ? `4px solid ${user.status_color}CC` 
                            : user?.subscription 
                              ? `4px solid ${user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.8)' : user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.8)' : user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.8)' : 'rgba(66, 165, 245, 0.8)'}`
                              : '4px solid rgba(208, 188, 255, 0.4)'
                        }
                      }}
                      onError={(e) => {
                        if (user?.id) {
                          const fallbackSrc = `/static/uploads/avatar/${user.id}/${user.photo || 'default.png'}`;
                          e.currentTarget.src = fallbackSrc;
                          setFallbackAvatarUrl(fallbackSrc);
                        }
                      }}
                    />
                  </Tooltip>
                  {equippedItems.map((item, index) => (
                    <EquippedItem key={item.id} item={item} index={index} />
                  ))}
                  
                  
                  {isOnline && user?.subscription?.type !== 'channel' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#4caf50',
                        border: theme => theme.palette.mode === 'dark'
                          ? '2px solid #121212'
                          : '2px solid #ffffff',
                        bottom: 5,
                        right: 15,
                        boxShadow: '0 0 8px rgba(76, 175, 80, 0.9)',
                        zIndex: 2,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)'
                          },
                          '70%': {
                            boxShadow: '0 0 0 6px rgba(76, 175, 80, 0)'
                          },
                          '100%': {
                            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
                          }
                        }
                      }}
                    />
                  )}
                  
                  
                  <UserStatus statusText={user?.status_text} statusColor={user?.status_color} />
                </Box>
                

              </Box>
              
              
              <Box sx={{ mt: 2, whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: user?.profile_id === 2 ? '#fff' : 'inherit',
                        textShadow: user?.profile_id === 2 ? '0 1px 3px rgba(0,0,0,0.7)' : 'none',
                        background: user?.profile_id === 2 ? 'none' : theme => theme.palette.mode === 'dark' 
                          ? 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)'
                          : 'linear-gradient(90deg, #000 0%, rgba(0,0,0,0.8) 100%)',
                        WebkitBackgroundClip: user?.profile_id === 2 ? 'unset' : 'text',
                        WebkitTextFillColor: user?.profile_id === 2 ? 'unset' : 'transparent'
                      }}>
                      {user?.name || 'Пользователь'}
                    </Typography>
                    <VerificationBadge status={user?.verification_status} size="small" />
                    
                    {/* Добавляем значок подписки, если у пользователя есть подписка */}
                    {user?.subscription && user.subscription.total_duration_months > 0 && (
                      <SubscriptionBadge 
                        duration={user.subscription.total_duration_months} 
                        subscriptionDate={user.subscription.subscription_date}
                        subscriptionType={user.subscription.type}
                      />
                    )}

                    {user?.achievement && (
                      <Box 
                        component="img" 
                        sx={{ 
                          width: 'auto', 
                          height: 25, 
                          ml: 0.5
                        }} 
                        src={`/static/images/bages/${user.achievement.image_path}`} 
                        alt={user.achievement.bage}
                        onError={(e) => {
                          console.error("Achievement badge failed to load:", e);
                          if (e.target && e.target instanceof HTMLImageElement) {
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                    )}
                  </Box>


                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, flexWrap: 'wrap', maxWidth: '100%' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: user?.profile_id === 2 ? 'rgba(255,255,255,0.9)' : theme => theme.palette.text.secondary,
                      textShadow: user?.profile_id === 2 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      background: user?.profile_id === 2 
                        ? 'rgba(0,0,0,0.3)'
                        : theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 4,
                      border: user?.profile_id === 2
                        ? '1px solid rgba(255,255,255,0.15)'
                        : theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    @{user?.username || 'username'}
                  </Typography>

                  {user?.connect_info && user.connect_info.length > 0 && (
                    <>
                      <LinkRoundedIcon 
                        sx={theme => ({ 
                          width: '2em',
                          height: '2em',
                          fontSize: 16,
                          color: user?.profile_id === 2 ? 'rgba(255,255,255,0.9)' : theme.palette.text.secondary
                        })} 
                      />
                      <Typography
                        variant="body2"
                        component={Link}
                        to={`/profile/${user.connect_info[0].username}`}
                        sx={theme => ({
                          fontWeight: 500,
                          color: user?.profile_id === 2 ? 'rgba(255,255,255,0.9)' : theme.palette.text.secondary,
                          textShadow: user?.profile_id === 2 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          background: user?.profile_id === 2
                            ? 'rgba(0,0,0,0.3)'
                            : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 4,
                          border: user?.profile_id === 2
                            ? '1px solid rgba(255,255,255,0.15)'
                            : theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'none',
                            background: user?.profile_id === 2
                              ? 'rgba(0,0,0,0.4)'
                              : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                          }
                        })}
                      >
                        @{user.connect_info[0].username}
                      </Typography>
                    </>
                  )}

                  <UserBanInfo 
                    userBanInfo={userBanInfo}
                    user={user}
                    currentUser={currentUser}
                    isCurrentUserModerator={isCurrentUserModerator}
                    showTooltip={false}
                    showDetailed={true}
                  />

                  <UserScamBadge user={user} />
                  
                  <UserSubscriptionBadge user={user} />
                  
                </Box>
                  
                <OwnedUsernames 
                  ownedUsernames={ownedUsernames}
                  user={user}
                  t={t}
                  getLighterColor={getLighterColor}
                  handleUsernameClick={handleUsernameClick}
                />
                
                <UserBanInfo 
                  userBanInfo={userBanInfo}
                  user={user}
                  currentUser={currentUser}
                  isCurrentUserModerator={isCurrentUserModerator}
                  showTooltip={false}
                  showDetailed={true}
                />
                
                <ProfileAbout user={user} getLighterColor={getLighterColor} />

                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: user?.subscription?.type === 'channel' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                  gap: 1, 
                  mt: 1 
                }}>
                  
                  <Paper sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    textAlign: 'center',
                    background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    backdropFilter: 'blur(5px)',
                    border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: (user.status_color && user.status_text && user.subscription) ? 
                          user.status_color : 
                          'primary.main'
                      }}
                    >
                      {postsCount || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary
                    }}>
                      {t('profile.stats.posts')}
                    </Typography>
                  </Paper>
                  
                  
                  <Paper 
                    component={Link}
                    to={`/friends/${user?.username}`}
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      textAlign: 'center',
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      backdropFilter: 'blur(5px)',
                      border: (user.status_color && user.status_text && user.subscription) ? 
                        `1px solid ${user.status_color}33` : 
                        theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                        transform: 'translateY(-2px)',
                        boxShadow: (user.status_color && user.status_text && user.subscription) ? 
                          `0 4px 15px ${user.status_color}33` : 
                          '0 4px 15px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: (user.status_color && user.status_text && user.subscription) ? 
                          user.status_color : 
                          'primary.main'
                      }}
                    >
                      {followersCount || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary
                    }}>
                      {t('profile.stats.followers')}
                    </Typography>
                  </Paper>
                  
                  
                  {(!user?.subscription || user.subscription.type !== 'channel') && (
                    <Paper 
                      component={Link}
                      to={`/friends/${user?.username}`}
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        textAlign: 'center',
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        backdropFilter: 'blur(5px)',
                        border: (user.status_color && user.status_text && user.subscription) ? 
                          `1px solid ${user.status_color}33` : 
                          theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                          transform: 'translateY(-2px)',
                          boxShadow: (user.status_color && user.status_text && user.subscription) ? 
                            `0 4px 15px ${user.status_color}33` : 
                            '0 4px 15px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: (user.status_color && user.status_text && user.subscription) ? 
                            user.status_color : 
                            'primary.main'
                        }}
                      >
                        {followingCount || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary
                      }}>
                        {t('profile.stats.following')}
                      </Typography>
                    </Paper>
                  )}
                </Box>
                
                
                {(!user?.subscription || user.subscription.type !== 'channel') && (
                  <Grid container spacing={1} sx={{ mt: 1 }}> 
                    
                    
                    {(!user?.subscription || user.subscription.type !== 'channel') ? (
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {t('profile.followers')}
                          </Typography>
                          
                          
                          {loadingFollowers ? (
                            <CircularProgress size={20} />
                          ) : followers && followers.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {followers.slice(0, 3).map(follower => (
                                <Tooltip key={follower.id} title={follower.name} arrow>
                                  <Avatar 
                                    src={follower.avatar_url} 
                                    alt={follower.name}
                                    component={Link}
                                    to={`/profile/${follower.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      border: (user.status_color && user.status_text && user.subscription) ? 
                                        `1px solid ${user.status_color}` : 
                                        '1px solid #D0BCFF', 
                                      flexShrink: 0 
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load follower avatar for ${follower.username}`);
                                      if (follower.id) {
                                        e.target.src = `/static/uploads/avatar/${follower.id}/${follower.photo || 'avatar.png'}`;
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {followersCount > 3 && (
                                <Tooltip title={t('profile.show_all_followers')}>
                                  <Avatar 
                                    component={Link}
                                    to={`/friends/${user?.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                        `${user.status_color}26` : 
                                        'rgba(208, 188, 255, 0.15)', 
                                      fontSize: '0.75rem',
                                      color: (user.status_color && user.status_text && user.subscription) ? 
                                        user.status_color : 
                                        '#D0BCFF',
                                      flexShrink: 0 
                                    }}
                                  >
                                    +{followersCount - 3}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {t('profile.no_followers')}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ) : (
                      
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {t('profile.followers')}
                          </Typography>
                          <Typography variant="body2">
                            {followersCount || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    
                    
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {t('profile.subscriptions')}
                        </Typography>
                        
                        
                        {user?.subscription && user.subscription.type === 'channel' ? (
                          <Typography variant="body2">
                            {followingCount || 0}
                          </Typography>
                        ) : (
                          loadingFollowing ? (
                            <CircularProgress size={20} />
                          ) : followingList.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {followingList.slice(0, 3).map(following => (
                                <Tooltip key={following.id} title={following.name} arrow>
                                  <Avatar 
                                    src={following.avatar_url} 
                                    alt={following.name}
                                    component={Link}
                                    to={`/profile/${following.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      border: (user.status_color && user.status_text && user.subscription) ? 
                                        `1px solid ${user.status_color}` : 
                                        '1px solid #D0BCFF', 
                                      flexShrink: 0 
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load following avatar for ${following.username}`);
                                      if (following.id) {
                                        e.target.src = `/static/uploads/avatar/${following.id}/${following.photo || 'avatar.png'}`;
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {followingCount > 3 && (
                                <Tooltip title={t('profile.show_all_following')}>
                                  <Avatar 
                                    component={Link}
                                    to={`/friends/${user?.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                        `${user.status_color}26` : 
                                        'rgba(208, 188, 255, 0.15)', 
                                      fontSize: '0.75rem',
                                      color: (user.status_color && user.status_text && user.subscription) ? 
                                        user.status_color : 
                                        '#D0BCFF',
                                      flexShrink: 0 
                                    }}
                                  >
                                    +{followingCount - 3}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {t('profile.no_following')}
                            </Typography>
                          )
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                )}
                
                
                {socials && socials.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {socials.map((social, index) => (
                      <Tooltip key={index} title={social.title || social.name} arrow>
                        <IconButton 
                          component="a" 
                          href={social.url || social.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          size="small"
                          sx={{ 
                            color: (user.status_color && user.status_text && user.subscription) ? 
                              user.status_color :
                              social.color || 'primary.main',
                            padding: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.07)',
                            '&:hover': {
                              bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                `${user.status_color}15` : 
                                'rgba(255, 255, 255, 0.12)',
                              transform: 'translateY(-2px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          {social.icon ? (
                            <Box component="img" src={social.icon} alt={social.title || social.name} sx={{ width: 20, height: 20 }} />
                          ) : (
                            <Box component="div" sx={{ width: 20, height: 20, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {social.name?.toLowerCase().includes('instagram') ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              : social.name?.toLowerCase().includes('facebook') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5 1.583-5 4.615v3.385z"/></svg>
                              : social.name?.toLowerCase().includes('twitter') || social.name?.toLowerCase().includes('x') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                              : social.name?.toLowerCase().includes('vk') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/></svg>
                              : social.name?.toLowerCase().includes('youtube') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                              : social.name?.toLowerCase().includes('telegram') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.5 5.97-4.1-1.34c-.88-.28-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                              : social.name?.toLowerCase().includes('element') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12.7 12.7" fill="currentColor">
                                  <path d="M 4.9717204,2.3834823 A 5.0230292,5.0230292 0 0 0 0.59994682,7.3615548 5.0230292,5.0230292 0 0 0 5.6228197,12.384429 5.0230292,5.0230292 0 0 0 10.645693,7.3615548 5.0230292,5.0230292 0 0 0 10.630013,6.9628311 3.8648402,3.8648402 0 0 1 8.6139939,7.532543 3.8648402,3.8648402 0 0 1 4.7492118,3.6677608 3.8648402,3.8648402 0 0 1 4.9717204,2.3834823 Z" />
                                  <circle cx="8.6142359" cy="3.6677198" r="3.5209935" />
                                </svg>
                              : 
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/></svg>
                              }
                            </Box>
                          )}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                )}
                
                
                {!isCurrentUser && (!currentUser?.account_type || currentUser.account_type !== 'channel') && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mt: 2,
                    justifyContent: 'center'
                  }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={following ? <PersonRemoveIcon /> : <PersonAddIcon />}
                      onClick={handleFollow}
                      fullWidth
                      sx={{ 
                        borderRadius: 6,
                        py: 0.7,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: (user.status_color && user.status_text && user.subscription) ?
                          `0 2px 8px ${user.status_color}40` : 
                          '0 2px 8px rgba(208, 188, 255, 0.25)',
                        backgroundColor: following ? 
                          'rgba(255, 255, 255, 0.1)' : 
                          (user.status_color && user.status_text && user.subscription) ?
                            user.status_color :
                            'primary.main',
                        color: following ? 'text.primary' : '#fff',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: following ? 
                            'rgba(255, 255, 255, 0.15)' : 
                            (user.status_color && user.status_text && user.subscription) ?
                              `${user.status_color}E6` : 
                              'primary.dark',
                          transform: 'translateY(-2px)',
                          boxShadow: (user.status_color && user.status_text && user.subscription) ?
                            `0 4px 12px ${user.status_color}66` : 
                            '0 4px 12px rgba(208, 188, 255, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      {following ? t('profile.actions.unfollow') : t('profile.actions.follow')}
                    </Button>
                  </Box>
                )}
                
                
              </Box>

            </Box>
          </Paper>
        </Grid>
        
        
        <Grid item xs={12} md={7} sx={{ pt: 0, ml: { xs: 0, md: '5px' }, mb: '100px' }}>
        
          <Paper sx={{ 
            borderRadius: '12px', 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            mb: '5px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  '&.Mui-selected': {
                    color: theme => theme.palette.primary.main,
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                }
              }}
            >
              <Tab label={t('profile.tabs.posts')} />
              <Tab label={t('profile.tabs.wall')} />
              <Tab label="Инвентарь" />
              <Tab label={t('profile.tabs.about')} />
            </Tabs>
          </Paper>
          
          
          <TabPanel value={tabValue} index={0} sx={{ p: 0, mt: 1 }}>
            {isCurrentUser && (
              <CreatePost onPostCreated={handlePostCreated} />
            )}
            
            <PostsTab userId={user?.id} statusColor={user?.status_color} PostsFeed={PostsFeed} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1} sx={{ p: 0, mt: 1 }}>
            {currentUser && (!currentUser.subscription || currentUser.subscription.type !== 'channel') && (
              <CreatePost 
                onPostCreated={handlePostCreated} 
                postType="stena" 
                recipientId={user.id} 
              />
            )}
            
            <WallPostsTab userId={user.id} WallFeed={WallFeed} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2} sx={{ p: 0, mt: 1 }}>
            <UpgradeEffects item={user}>
              <InventoryTab 
                userId={user?.id} 
                itemIdToOpen={itemIdToOpen} 
                onEquippedItemsUpdate={refreshEquippedItems}
                currentUserId={currentUser?.id}
              />
            </UpgradeEffects>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3} sx={{ p: 0, mt: 1 }}>
            <ProfileInfo 
              user={user} 
              medals={medals}
              onUsernameClick={handleUsernameClick}
            />
          </TabPanel>
        </Grid>
      </Grid>
      
      
      <ImageLightbox 
        isOpen={lightboxIsOpen}
        imageUrl={currentImage}
        onClose={closeLightbox}
      />
      
      
      <AnimatePresence>
        {selectedUsername && (
          <UsernameCard 
            username={selectedUsername}
            onClose={handleCloseUsernameCard}
            open={usernameCardOpen}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProfilePage; 