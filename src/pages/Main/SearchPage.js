import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  Container, Box, TextField, InputAdornment, Tabs, Tab, Typography,
  Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider,
  Button, Card, CardContent, CardMedia, IconButton, Paper, CircularProgress
} from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ThemeSettingsContext } from '../../App';
import { AuthContext } from '../../context/AuthContext';
import { searchService, profileService } from '../../services';
import LightBox from '../../components/LightBox';


const StyledSearchBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 70, 
  zIndex: 10,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
}));

const NoResultsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  marginTop: theme.spacing(2),
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  
  
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';
  
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchType, setSearchType] = useState(typeParam === 'users' ? 1 : typeParam === 'posts' ? 2 : 0);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const searchInputRef = useRef(null);
  
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);
  
  
  const updateSearchParams = (query, type) => {
    const newParams = new URLSearchParams();
    if (query) newParams.set('q', query);
    if (type === 1) {
      newParams.set('type', 'users');
    } else if (type === 2) {
      newParams.set('type', 'posts');
    } else {
      newParams.set('type', 'all');
    }
    navigate(`/search?${newParams.toString()}`);
  };
  
  
  const performSearch = async (query, type, page = 1, append = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      let response;
      
      
      const cleanQuery = query.trim();
      
      
      if (type === 1) { 
        response = await searchService.searchUsers(cleanQuery, page);
        
        if (response.data && response.data.users) {
          
          const uniqueUsers = removeDuplicates(response.data.users, 'id');
          
          if (append) {
            setUsers(prev => {
              
              const combined = [...prev, ...uniqueUsers];
              return removeDuplicates(combined, 'id');
            });
          } else {
            setUsers(uniqueUsers);
          }
          
          setHasMoreUsers(response.data.has_next);
          
          
          if (isAuthenticated && uniqueUsers.length > 0) {
            loadFollowingStatus(uniqueUsers);
          }
        }
      } else if (type === 2) { 
        response = await searchService.searchPosts(cleanQuery, page);
        
        if (response.data && response.data.posts) {
          
          const uniquePosts = removeDuplicates(response.data.posts, 'id');
          
          if (append) {
            setPosts(prev => {
              const combined = [...prev, ...uniquePosts];
              return removeDuplicates(combined, 'id');
            });
          } else {
            setPosts(uniquePosts);
          }
          
          setHasMorePosts(response.data.has_next);
        }
      } else { 
        response = await searchService.searchAll(cleanQuery);
        
        if (!append && response.data) {
          if (response.data.users) {
            setUsers(removeDuplicates(response.data.users, 'id'));
          } else {
            setUsers([]);
          }
          
          if (response.data.posts) {
            setPosts(removeDuplicates(response.data.posts, 'id'));
          } else {
            setPosts([]);
          }
          
          
          if (isAuthenticated && response.data.users && response.data.users.length > 0) {
            loadFollowingStatus(response.data.users);
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const removeDuplicates = (array, key) => {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => t[key] === item[key])
    );
  };
  
  
  const loadFollowingStatus = async (usersList) => {
    if (!isAuthenticated || !usersList || usersList.length === 0) return;
    
    try {
      const statuses = {};
      
      for (const user of usersList) {
        if (user.id === (user?.id)) continue; 
        
        try {
          const response = await profileService.checkFollowing(user.id);
          statuses[user.id] = response.data.following;
        } catch (error) {
          console.error(`Error checking following status for user ${user.id}:`, error);
          statuses[user.id] = false;
        }
      }
      
      setFollowingStatus(prev => ({ ...prev, ...statuses }));
    } catch (error) {
      console.error('Error loading following statuses:', error);
    }
  };
  
  
  const handleFollowToggle = async (userId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      if (followingStatus[userId]) {
        await profileService.unfollowUser(userId);
      } else {
        await profileService.followUser(userId);
      }
      
      
      setFollowingStatus(prev => ({
        ...prev,
        [userId]: !prev[userId]
      }));
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };
  
  
  const handleTabChange = (event, newValue) => {
    setSearchType(newValue);
    
    
    let type = 'all';
    if (newValue === 1) type = 'users';
    else if (newValue === 2) type = 'posts';
    
    updateSearchParams(searchQuery, newValue);
    
    
    setUserPage(1);
    setPostPage(1);
    
    
    performSearch(searchQuery, newValue);
  };
  
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    
    
    if (!cleanQuery && searchType === 1) {
      performSearch('', searchType); 
    } else {
      updateSearchParams(cleanQuery, searchType);
      
      
      setUserPage(1);
      setPostPage(1);
      
      
      performSearch(cleanQuery, searchType);
    }
  };
  
  
  const loadMoreResults = () => {
    if (searchType === 1 && hasMoreUsers) {
      const nextPage = userPage + 1;
      setUserPage(nextPage);
      performSearch(searchQuery, searchType, nextPage, true);
    } else if (searchType === 2 && hasMorePosts) {
      const nextPage = postPage + 1;
      setPostPage(nextPage);
      performSearch(searchQuery, searchType, nextPage, true);
    }
  };
  
  
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    
    setSearchQuery(query);
    setSearchType(type === 'users' ? 1 : type === 'posts' ? 2 : 0);
    
    
    if (!initialLoad || query) {
      performSearch(
        query, 
        type === 'users' ? 1 : type === 'posts' ? 2 : 0
      );
    }
    
    setInitialLoad(false);
  }, [location.search]);
  
  
  useEffect(() => {
    if (initialLoad && !queryParam) {
      performSearch('', 1); 
    }
  }, []);
  
  
  const handleOpenPostImage = (image, allImages, index) => {
    setCurrentImage(image);
    setLightboxImages(allImages);
    setCurrentImageIndex(index || 0);
    setLightboxOpen(true);
  };
  
  
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };
  
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % lightboxImages.length;
      setCurrentImage(lightboxImages[nextIndex]);
      return nextIndex;
    });
  };
  
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + lightboxImages.length) % lightboxImages.length;
      setCurrentImage(lightboxImages[nextIndex]);
      return nextIndex;
    });
  };
  
  
  
  useEffect(() => {
    const debounceTime = 300; 
    
    const cleanQuery = searchQuery.trim();
    
    if (cleanQuery) {
      
      const handler = setTimeout(() => {
        if (cleanQuery.length >= 2) { 
          updateSearchParams(cleanQuery, searchType);
          performSearch(cleanQuery, searchType);
        }
      }, debounceTime);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchQuery, searchType]);
  
  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 8 }}>
      <StyledSearchBox sx={{ 
        background: `linear-gradient(145deg, ${themeSettings.paperColor} 0%, rgba(26, 26, 26, 0.9) 100%)`
      }}>
        <form onSubmit={handleSearchSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск пользователей, постов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputRef={searchInputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': { 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }
              }
            }}
          />
        </form>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs 
            value={searchType} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#D0BCFF',
                height: 3
              },
            }}
          >
            <Tab label="Все" />
            <Tab label="Пользователи" />
            <Tab label="Посты" />
          </Tabs>
        </Box>
      </StyledSearchBox>
      
      {loading && !users.length && !posts.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          
          <TabPanel value={searchType} index={0}>
            {users.length === 0 && posts.length === 0 ? (
              <NoResultsContainer>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Ничего не найдено
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Попробуйте изменить поисковый запрос
                </Typography>
              </NoResultsContainer>
            ) : (
              <>
                
                {users.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Пользователи</Typography>
                      {users.length > 4 && (
                        <Button 
                          variant="text" 
                          color="primary" 
                          onClick={() => handleTabChange(null, 1)}
                        >
                          Показать все
                        </Button>
                      )}
                    </Box>
                    <Paper sx={{ 
                      borderRadius: 2,
                      background: `linear-gradient(145deg, ${themeSettings.paperColor} 0%, rgba(26, 26, 26, 0.9) 100%)`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                      <List>
                        {users.slice(0, 4).map((user, index) => (
                          <React.Fragment key={user.id}>
                            <ListItem
                              alignItems="flex-start"
                              secondaryAction={
                                isAuthenticated && user.id !== (user?.id) && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                    onClick={() => handleFollowToggle(user.id)}
                                    startIcon={followingStatus[user.id] ? <PersonRemoveIcon /> : <PersonAddIcon />}
                                    sx={{
                                      borderRadius: 6,
                                      textTransform: 'none',
                                      borderColor: followingStatus[user.id] ? 'rgba(255, 255, 255, 0.2)' : '#D0BCFF',
                                      color: followingStatus[user.id] ? 'text.secondary' : '#D0BCFF',
                                    }}
                                  >
                                    {followingStatus[user.id] ? 'Отписаться' : 'Подписаться'}
                                  </Button>
                                )
                              }
                            >
                              <ListItemAvatar>
                                <Avatar 
                                  src={user.photo && user.photo !== 'avatar.png' 
                                    ? user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}` 
                                    : `/static/uploads/avatar/system/avatar.png`}
                                  alt={user.name}
                                  component={Link}
                                  to={`/profile/${user.username}`}
                                  sx={{ 
                                    width: 50, 
                                    height: 50, 
                                    marginRight: 1,
                                    border: '2px solid #D0BCFF'
                                  }}
                                  onError={(e) => {
                                    console.error(`Failed to load avatar for ${user.username}`);
                                    e.target.onerror = null; 
                                    e.target.src = `/static/uploads/avatar/system/avatar.png`;
                                  }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography 
                                      component={Link}
                                      to={`/profile/${user.username}`}
                                      variant="subtitle1"
                                      sx={{ 
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                        color: 'text.primary',
                                        '&:hover': {
                                          textDecoration: 'underline',
                                        }
                                      }}
                                    >
                                      {user.name}
                                    </Typography>
                                    {user.verification_status === 'verified' && (
                                      <VerifiedIcon 
                                        sx={{ 
                                          fontSize: 16, 
                                          ml: 0.5, 
                                          color: '#D0BCFF' 
                                        }} 
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      @{user.username}
                                    </Typography>
                                    {user.about && (
                                      <Typography
                                        component="div"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                      >
                                        {user.about}
                                      </Typography>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                            {index < users.length - 1 && <Divider variant="inset" component="li" />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Paper>
                  </Box>
                )}
                
                
                {posts.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Посты</Typography>
                      {posts.length > 3 && (
                        <Button 
                          variant="text" 
                          color="primary" 
                          onClick={() => handleTabChange(null, 2)}
                        >
                          Показать все
                        </Button>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {posts.slice(0, 3).map((post) => (
                        <Card 
                          key={post.id} 
                          component={Link}
                          to={`/post/${post.id}`}
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 2,
                            overflow: 'hidden',
                            textDecoration: 'none',
                            background: `linear-gradient(145deg, ${themeSettings.paperColor} 0%, rgba(26, 26, 26, 0.9) 100%)`,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            }
                          }}
                        >
                          {post.image && (
                            <CardMedia
                              component="img"
                              image={post.image}
                              alt="Post image"
                              sx={{ 
                                height: 200, 
                                objectFit: 'cover',
                                backgroundColor: '#111',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleOpenPostImage(post.image, [post.image], 0)}
                              onError={(e) => {
                                console.error("Failed to load post image");
                                const postId = post.id;
                                const filename = post.image.split('/').pop();
                                if (postId && filename) {
                                  e.target.src = `/static/uploads/avatar/system/avatar.png`;
                                }
                              }}
                            />
                          )}
                          {post.video && (
                            <Box sx={{ height: 200, backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <video 
                                src={post.video}
                                style={{ 
                                  maxHeight: '100%', 
                                  maxWidth: '100%',
                                  objectFit: 'contain' 
                                }}
                                onError={(e) => {
                                  console.error("Failed to load post video");
                                  const postId = post.id;
                                  const filename = post.video.split('/').pop();
                                  if (postId && filename) {
                                    e.target.src = `/static/uploads/avatar/system/avatar.png`;
                                  }
                                }}
                              />
                            </Box>
                          )}
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar 
                                src={post.user.photo && post.user.photo !== 'avatar.png' 
                                  ? post.user.photo.startsWith('/') ? post.user.photo : `/static/uploads/avatar/${post.user.id}/${post.user.photo}` 
                                  : `/static/uploads/avatar/system/avatar.png`}
                                alt={post.user.name}
                                sx={{ 
                                  width: 36, 
                                  height: 36, 
                                  mr: 1.5,
                                  border: '1px solid #D0BCFF'
                                }}
                                onError={(e) => {
                                  console.error(`Failed to load user avatar for post`);
                                  e.target.onerror = null; 
                                  e.target.src = `/static/uploads/avatar/system/avatar.png`;
                                }}
                              />
                              <Box>
                                <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold' }}>
                                  {post.user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  @{post.user.username}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                              {post.content}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton size="small" disabled>
                                  <ThumbUpOutlinedIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="caption" color="text.secondary">
                                  {post.likes_count || 0}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton size="small" disabled>
                                  <ChatBubbleOutlineIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="caption" color="text.secondary">
                                  {post.comments_count || 0}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </TabPanel>
          
          
          <TabPanel value={searchType} index={1}>
            {users.length === 0 ? (
              <NoResultsContainer>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchQuery ? 'Пользователи не найдены' : 'Рекомендуемые пользователи'}
                </Typography>
                {searchQuery && (
                  <Typography variant="body2" color="text.secondary">
                    Попробуйте изменить поисковый запрос
                  </Typography>
                )}
              </NoResultsContainer>
            ) : (
              <Paper sx={{ 
                borderRadius: 2,
                background: `linear-gradient(145deg, ${themeSettings.paperColor} 0%, rgba(26, 26, 26, 0.9) 100%)`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <List>
                  {users.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <ListItem
                        alignItems="flex-start"
                        secondaryAction={
                          isAuthenticated && user.id !== (user?.id) && (
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => handleFollowToggle(user.id)}
                              startIcon={followingStatus[user.id] ? <PersonRemoveIcon /> : <PersonAddIcon />}
                              sx={{
                                borderRadius: 6,
                                textTransform: 'none',
                                borderColor: followingStatus[user.id] ? 'rgba(255, 255, 255, 0.2)' : '#D0BCFF',
                                color: followingStatus[user.id] ? 'text.secondary' : '#D0BCFF',
                              }}
                            >
                              {followingStatus[user.id] ? 'Отписаться' : 'Подписаться'}
                            </Button>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={user.photo && user.photo !== 'avatar.png' 
                              ? user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}` 
                              : `/static/uploads/avatar/system/avatar.png`}
                            alt={user.name}
                            component={Link}
                            to={`/profile/${user.username}`}
                            sx={{ 
                              width: 50, 
                              height: 50, 
                              marginRight: 1,
                              border: '2px solid #D0BCFF'
                            }}
                            onError={(e) => {
                              console.error(`Failed to load avatar for ${user.username}`);
                              e.target.onerror = null; 
                              e.target.src = `/static/uploads/avatar/system/avatar.png`;
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography 
                                component={Link}
                                to={`/profile/${user.username}`}
                                variant="subtitle1"
                                sx={{ 
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  color: 'text.primary',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  }
                                }}
                              >
                                {user.name}
                              </Typography>
                              {user.verification_status === 'verified' && (
                                <VerifiedIcon 
                                  sx={{ 
                                    fontSize: 16, 
                                    ml: 0.5, 
                                    color: '#D0BCFF' 
                                  }} 
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                @{user.username}
                              </Typography>
                              {user.about && (
                                <Typography
                                  component="div"
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {user.about}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {index < users.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
                
                {hasMoreUsers && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Button 
                      variant="outlined"
                      color="primary"
                      onClick={loadMoreResults}
                      disabled={loading}
                      sx={{
                        borderRadius: 6,
                        textTransform: 'none',
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Загрузить еще'}
                    </Button>
                  </Box>
                )}
              </Paper>
            )}
          </TabPanel>
          
          
          <TabPanel value={searchType} index={2}>
            {posts.length === 0 ? (
              <NoResultsContainer>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Посты не найдены
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Попробуйте изменить поисковый запрос
                </Typography>
              </NoResultsContainer>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {posts.map((post) => (
                  <Card 
                    key={post.id} 
                    component={Link}
                    to={`/post/${post.id}`}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      background: `linear-gradient(145deg, ${themeSettings.paperColor} 0%, rgba(26, 26, 26, 0.9) 100%)`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    {post.image && (
                      <CardMedia
                        component="img"
                        image={post.image}
                        alt="Post image"
                        sx={{ 
                          height: 200, 
                          objectFit: 'cover',
                          backgroundColor: '#111',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleOpenPostImage(post.image, [post.image], 0)}
                        onError={(e) => {
                          console.error("Failed to load post image");
                          const postId = post.id;
                          const filename = post.image.split('/').pop();
                          if (postId && filename) {
                            e.target.src = `/static/uploads/avatar/system/avatar.png`;
                          }
                        }}
                      />
                    )}
                    {post.video && (
                      <Box sx={{ height: 200, backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <video 
                          src={post.video}
                          style={{ 
                            maxHeight: '100%', 
                            maxWidth: '100%',
                            objectFit: 'contain' 
                          }}
                          onError={(e) => {
                            console.error("Failed to load post video");
                            const postId = post.id;
                            const filename = post.video.split('/').pop();
                            if (postId && filename) {
                              e.target.src = `/static/uploads/avatar/system/avatar.png`;
                            }
                          }}
                        />
                      </Box>
                    )}
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          src={post.user.photo && post.user.photo !== 'avatar.png' 
                            ? post.user.photo.startsWith('/') ? post.user.photo : `/static/uploads/avatar/${post.user.id}/${post.user.photo}` 
                            : `/static/uploads/avatar/system/avatar.png`}
                          alt={post.user.name}
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            mr: 1.5,
                            border: '1px solid #D0BCFF'
                          }}
                          onError={(e) => {
                            console.error(`Failed to load user avatar for post`);
                            e.target.onerror = null; 
                            e.target.src = `/static/uploads/avatar/system/avatar.png`;
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold' }}>
                            {post.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{post.user.username}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                        {post.content}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton size="small" disabled>
                            <ThumbUpOutlinedIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" color="text.secondary">
                            {post.likes_count || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton size="small" disabled>
                            <ChatBubbleOutlineIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" color="text.secondary">
                            {post.comments_count || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
        </>
      )}
      
      
      <LightBox 
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
        imageSrc={currentImage}
        onNext={lightboxImages.length > 1 ? handleNextImage : undefined}
        onPrev={lightboxImages.length > 1 ? handlePrevImage : undefined}
        totalImages={lightboxImages.length}
        currentIndex={currentImageIndex}
      />
    </Container>
  );
};

export default SearchPage;