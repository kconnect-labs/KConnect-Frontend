import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Dialog,
  DialogContent,
  DialogTitle,
  Typography, 
  IconButton, 
  Avatar,
  Divider,
  CircularProgress,
  Paper,
  Skeleton,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import axios from 'axios';
import { formatDate } from '../../utils/dateUtils';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#121212', 0.9)} 0%, ${alpha('#1A1A1A', 0.85)} 100%)`
    : `linear-gradient(135deg, ${alpha('#f5f5f5', 0.9)} 0%, ${alpha('#FAFAFA', 0.85)} 100%)`,
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? alpha('#121212', 0.9)
    : alpha('#FFFFFF', 0.9),
  backdropFilter: 'blur(8px)',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
  },
}));

const HistoryItem = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.4)
    : alpha(theme.palette.background.paper, 0.7),
  transition: 'transform 0.2s ease',
  backdropFilter: 'blur(4px)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  }
}));

const OwnerBox = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.dark, 0.1)
    : alpha(theme.palette.primary.light, 0.1),
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? alpha(theme.palette.primary.main, 0.2)
    : alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
  }
}));


const truncateText = (text, maxLength = 15) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};


const usernameHistoryCache = {};


const userDataCache = {};


const loadCacheFromSessionStorage = () => {
  try {
    const historyCache = sessionStorage.getItem('usernameHistoryCache');
    if (historyCache) {
      Object.assign(usernameHistoryCache, JSON.parse(historyCache));
    }
    
    const userCache = sessionStorage.getItem('userDataCache');
    if (userCache) {
      Object.assign(userDataCache, JSON.parse(userCache));
    }
  } catch (error) {
    console.warn('Ошибка при загрузке кэша из sessionStorage:', error);
  }
};


const saveCacheToSessionStorage = () => {
  try {
    sessionStorage.setItem('usernameHistoryCache', JSON.stringify(usernameHistoryCache));
    sessionStorage.setItem('userDataCache', JSON.stringify(userDataCache));
  } catch (error) {
    console.warn('Ошибка при сохранении кэша в sessionStorage:', error);
  }
};


loadCacheFromSessionStorage();

const UsernameCard = ({ username, onClose, open }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUsernameHistory = async () => {
      if (!open || !username) return;
      
      try {
        setLoading(true);
        setError(null);
        

        const cacheKey = username.toLowerCase();
        const currentTime = Date.now();
        const cacheExpiration = 5 * 60 * 1000;
        
        let historyData;
        

        if (
          usernameHistoryCache[cacheKey] && 
          currentTime - usernameHistoryCache[cacheKey].timestamp < cacheExpiration
        ) {
          console.log('Используем кэшированные данные истории для:', username);
          historyData = usernameHistoryCache[cacheKey].data;
          setHistory(historyData);
          

          const cachedUsers = {};
          if (historyData.users) {
            Object.keys(historyData.users).forEach(userId => {

              userDataCache[userId] = historyData.users[userId];
              cachedUsers[userId] = historyData.users[userId];
            });
            setUserData(cachedUsers);
          }
          
          setLoading(false);
          return;
        }
        

        const response = await axios.get(`/api/username/history/${username}`);
        
        if (response.data && response.data.success) {
          console.log('Получены данные истории юзернейма:', response.data);
          historyData = response.data;
          setHistory(historyData);
          

          usernameHistoryCache[cacheKey] = {
            data: historyData,
            timestamp: currentTime
          };
          

          if (historyData.users) {
            Object.keys(historyData.users).forEach(userId => {
              userDataCache[userId] = historyData.users[userId];
            });
            setUserData(historyData.users);
          }
          

          saveCacheToSessionStorage();
        } else {
          throw new Error(response.data?.message || 'Не удалось получить данные об юзернейме');
        }
      } catch (err) {
        console.error('Ошибка при загрузке истории юзернейма:', err);
        setError('Не удалось загрузить информацию о юзернейме');
      } finally {
        setLoading(false);
      }
    };

    fetchUsernameHistory();
  }, [username, open]);
  

  const renderUserInfo = (userId, isFirst = false, size = 'small') => {
    const user = userData[userId];
    const isSmall = size === 'small';
    const avatarSize = isSmall ? 24 : 36;
    
    if (!user) {
      return isFirst ? (
        <Typography variant="body2" fontWeight="medium">
          Первое приобретение: ID {userId}
        </Typography>
      ) : (
        <Typography variant="body2" fontWeight="medium">
          ID {userId}
        </Typography>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {user.photo ? (
          <Avatar 
            src={user.photo}
            sx={{ 
              width: avatarSize, 
              height: avatarSize, 
              mr: 0.5
            }}
          />
        ) : (
          <Avatar 
            sx={{ 
              width: avatarSize, 
              height: avatarSize, 
              mr: 0.5, 
              fontSize: isSmall ? '0.8rem' : '1rem',
              bgcolor: 'primary.main'
            }}
          >
            {user.name?.charAt(0) || user.username?.charAt(0) || "?"}
          </Avatar>
        )}
        <Link
          href={`/profile/${userId}`}
          underline="hover"
          color="text.primary"
          sx={{ 
            fontWeight: "medium",
            display: 'flex',
            alignItems: 'center',
            maxWidth: isSmall ? 70 : 120 
          }}
        >
          <Typography 
            noWrap 
            sx={{ 
              maxWidth: isSmall ? 60 : 100, 
              display: 'block',
              fontSize: isSmall ? '0.85rem' : '1rem'
            }}
          >
            {truncateText(user.username || user.name, isSmall ? 10 : 15)}
          </Typography>
          {user.is_verified && (
            <VerifiedIcon 
              color="primary" 
              sx={{ 
                ml: 0.5, 
                fontSize: isSmall ? '0.9rem' : '1.1rem'
              }} 
            />
          )}
        </Link>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: isMobile ? 0 : 2,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          background: 'transparent',
          maxHeight: isMobile ? '100%' : '90vh'
        }
      }}
    >
      <StyledDialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AlternateEmailIcon 
            sx={{ 
              mr: 1, 
              color: 'primary.main',
              fontSize: '1.5rem'
            }} 
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            @{username}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : (
          <>
            {history?.current_owner_id && (
              <OwnerBox>
                {renderUserInfo(history.current_owner_id, false, 'large')}
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                    Текущий владелец
                  </Typography>
                </Box>
              </OwnerBox>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'medium', 
                mb: 1.5, 
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              <HistoryIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
              История владения
            </Typography>
            
            {history?.ownership_history?.length > 0 ? (
              <Box sx={{ mt: 1 }}>
                {history.ownership_history.map((item, index) => (
                  <HistoryItem key={index} elevation={0}>
                    <SwapHorizIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.seller_id ? (
                          <>
                            {renderUserInfo(item.seller_id)}
                            <Typography sx={{ mx: 0.5 }}>→</Typography>
                            {renderUserInfo(item.buyer_id)}
                          </>
                        ) : (
                          renderUserInfo(item.buyer_id, true)
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item.timestamp)}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main' 
                          }}
                        >
                          {item.price} баллов
                        </Typography>
                      </Box>
                    </Box>
                  </HistoryItem>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 1, textAlign: 'center' }}>
                История владения недоступна
              </Typography>
            )}
          </>
        )}
      </StyledDialogContent>
    </Dialog>
  );
};

export default UsernameCard; 