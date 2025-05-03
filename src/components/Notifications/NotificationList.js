import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Collapse,
  Divider,
  Badge,
  Menu,
  MenuItem,
  CircularProgress,
  alpha,
  Button,
  useTheme,
  Slide,
  Fade,
  ListItemSecondaryAction,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import ForumIcon from '@mui/icons-material/Forum';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { formatDateTimeShort } from '../../utils/dateUtils';


const getNotificationIcon = (type) => {
  switch (type) {
    case 'comment_like':
    case 'reply_like':
    case 'post_like':
      return <FavoriteIcon fontSize="small" color="error" />;
    case 'comment':
      return <ChatBubbleIcon fontSize="small" color="primary" />;
    case 'reply':
      return <ReplyIcon fontSize="small" color="primary" />;
    case 'follow':
      return <PersonAddIcon fontSize="small" color="primary" />;
    default:
      return null;
  }
};


const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Только что';
  
  try {
    
    const date = new Date(dateString);
    
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Недавно';
    }
    
    
    const now = new Date();
    
    
    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    
    
    if (seconds < 60) {
      return 'Только что';
    }
    
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} ${getMinutesString(minutes)} назад`;
    }
    
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} ${getHoursString(hours)} назад`;
    }
    
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} ${getDaysString(days)} назад`;
    }
    
    
    return formatDateTimeShort(dateString);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Недавно';
  }
};


const getMinutesString = (minutes) => {
  if (minutes % 10 === 1 && minutes % 100 !== 11) {
    return 'минуту';
  } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
    return 'минуты';
  } else {
    return 'минут';
  }
};

const getHoursString = (hours) => {
  if (hours % 10 === 1 && hours % 100 !== 11) {
    return 'час';
  } else if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) {
    return 'часа';
  } else {
    return 'часов';
  }
};

const getDaysString = (days) => {
  if (days % 10 === 1 && days % 100 !== 11) {
    return 'день';
  } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
    return 'дня';
  } else {
    return 'дней';
  }
};


const parseNotificationLink = (link) => {
  if (!link) return { type: 'unknown' };
  
  
  if (link.startsWith('/profile/')) {
    return {
      type: 'profile',
      username: link.split('/profile/')[1]
    };
  }
  
  
  if (link.includes('?comment=') && link.includes('&reply=')) {
    const postId = link.split('/post/')[1].split('?')[0];
    const commentId = link.split('comment=')[1].split('&')[0];
    const replyId = link.split('reply=')[1];
    
    return {
      type: 'reply',
      postId,
      commentId,
      replyId
    };
  }
  
  
  if (link.includes('?comment=')) {
    const postId = link.split('/post/')[1].split('?')[0];
    const commentId = link.split('comment=')[1];
    
    return {
      type: 'comment',
      postId,
      commentId
    };
  }
  
  
  if (link.startsWith('/post/')) {
    const postId = link.split('/post/')[1];
    
    return {
      type: 'post',
      postId
    };
  }
  
  return { type: 'unknown' };
};


const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};


const getContextIcon = (link) => {
  if (!link) return null;
  
  const linkInfo = parseNotificationLink(link);
  
  switch (linkInfo.type) {
    case 'post':
      return <ArticleIcon fontSize="small" sx={{ opacity: 0.7 }} />;
    case 'comment':
    case 'reply':
      return <ForumIcon fontSize="small" sx={{ opacity: 0.7 }} />;
    case 'profile':
      return <PersonIcon fontSize="small" sx={{ opacity: 0.7 }} />;
    default:
      return null;
  }
};


const getAvatarUrl = (sender) => {
  if (!sender) return '/static/uploads/avatar/system/avatar.png';
  
  
  if (sender.avatar_url) {
    
    if (sender.avatar_url.startsWith('/static/uploads/avatar/')) {
      return sender.avatar_url;
    }
    return sender.avatar_url;
  }
  
  
  if (sender.id && sender.photo) {
    
    if (sender.photo.startsWith('/static/uploads/avatar/')) {
      return sender.photo;
    }
    return `/static/uploads/avatar/${sender.id}/${sender.photo}`;
  }
  
  
  return `/static/uploads/avatar/system/avatar.png`;
};


const getContextText = (notification) => {
  if (!notification || !notification.link) return '';
  
  const linkInfo = parseNotificationLink(notification.link);
  
  switch (linkInfo.type) {
    case 'post':
      
      if (notification.post_data) {
        if (notification.post_data.preview) {
          return notification.post_data.preview;
        } else if (notification.post_data.text) {
          return truncateText(notification.post_data.text, 150);
        } else if (notification.post_content) {
          return truncateText(notification.post_content, 150);
        }
      }
      return "публикацию";
      
    case 'comment':
      
      if (notification.comment_data) {
        if (notification.comment_data.preview) {
          return notification.comment_data.preview;
        } else if (notification.comment_data.text) {
          return truncateText(notification.comment_data.text, 150);
        } else if (notification.comment_content) {
          return truncateText(notification.comment_content, 150);
        }
      }
      return "комментарий";
      
    case 'reply':
      
      if (notification.reply_data) {
        if (notification.reply_data.preview) {
          return notification.reply_data.preview;
        } else if (notification.reply_data.text) {
          return truncateText(notification.reply_data.text, 150);
        } else if (notification.reply_content) {
          return truncateText(notification.reply_content, 150);
        }
      }
      return "ответ на комментарий";
      
    case 'profile':
      return `профиль`;
      
    default:
      return '';
  }
};


const getContextTitle = (notification) => {
  if (!notification || !notification.link) return '';
  
  const linkInfo = parseNotificationLink(notification.link);
  
  switch (linkInfo.type) {
    case 'post':
      return "Публикация:";
    case 'comment':
      return "Комментарий:";
    case 'reply':
      return "Ответ:";
    case 'profile':
      return "Профиль";
    default:
      return '';
  }
};

const NotificationItem = ({ notification, onNotificationClick, onDelete }) => {
  const theme = useTheme();
  
  if (!notification || !notification.id) {
    return null;
  }
  
  
  const senderName = notification.sender_user?.name || 'Пользователь';
  const avatar = getAvatarUrl(notification.sender_user);
  
  
  const contextText = getContextText(notification);
  const contextTitle = getContextTitle(notification);
  
  
  const getActionText = () => {
    switch (notification.type) {
      case 'post_like':
        return 'поставил(-a) лайк на вашу публикацию';
      case 'comment_like':
        return 'поставил(-a) лайк на ваш комментарий';
      case 'reply_like':
        return 'поставил(-a) лайк на ваш ответ';
      case 'comment':
        return 'оставил(-a) комментарий к вашей публикации';
      case 'reply':
        return 'ответил(-a) на ваш комментарий';
      case 'follow':
        return 'подписался(-ась) на вас';
      default:
        return notification.message || 'выполнил действие';
    }
  };
  
  
  const getContentPreview = () => {
    
    if (notification.content_type) {
      switch (notification.content_type) {
        case 'comment':
          if (notification.comment_data) {
            if (notification.comment_data.preview) {
              return notification.comment_data.preview;
            } else if (notification.comment_data.text) {
              return truncateText(notification.comment_data.text, 150);
            } else if (notification.comment_content) {
              return truncateText(notification.comment_content, 150);
            }
          }
          break;
          
        case 'reply':
          if (notification.reply_data) {
            if (notification.reply_data.preview) {
              return notification.reply_data.preview;
            } else if (notification.reply_data.text) {
              return truncateText(notification.reply_data.text, 150);
            } else if (notification.reply_content) {
              return truncateText(notification.reply_content, 150);
            }
          }
          break;
          
        case 'post':
          if (notification.post_data) {
            if (notification.post_data.preview) {
              return notification.post_data.preview;
            } else if (notification.post_data.text) {
              return truncateText(notification.post_data.text, 150);
            } else if (notification.post_content) {
              return truncateText(notification.post_content, 150);
            }
          }
          break;
      }
    }
    
    
    const linkInfo = parseNotificationLink(notification.link);
    
    
    if (linkInfo.type === 'comment' && notification.comment_data) {
      if (notification.comment_data.preview) {
        return notification.comment_data.preview;
      } else if (notification.comment_data.text) {
        return truncateText(notification.comment_data.text, 150);
      } else if (notification.comment_content) {
        return truncateText(notification.comment_content, 150);
      }
    }
    
    
    if (linkInfo.type === 'reply' && notification.reply_data) {
      if (notification.reply_data.preview) {
        return notification.reply_data.preview;
      } else if (notification.reply_data.text) {
        return truncateText(notification.reply_data.text, 150);
      } else if (notification.reply_content) {
        return truncateText(notification.reply_content, 150);
      }
    }
    
    
    if (notification.post_data && notification.post_data.preview) {
      return notification.post_data.preview;
    } else if (notification.post_content) {
      return truncateText(notification.post_content, 150);
    }
    
    
    return contextText;
  };
  
  return (
    <ListItem
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        mb: 1,
        bgcolor: notification.is_read 
          ? alpha(theme.palette.background.paper, 0.6) 
          : alpha(theme.palette.primary.main, 0.08),
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: notification.is_read 
            ? alpha(theme.palette.background.paper, 0.8) 
            : alpha(theme.palette.primary.main, 0.12),
        },
        '&:hover .delete-button': {
          opacity: 1,
          transform: 'translateX(0)'
        }
      }}
    >
      <ListItemAvatar>
        <Avatar 
          src={avatar} 
          alt={senderName}
          sx={{ 
            width: 44, 
            height: 44,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onError={(e) => {
            if (e.currentTarget && e.currentTarget.setAttribute) {
              e.currentTarget.setAttribute('src', '/static/uploads/avatar/system/avatar.png');
            }
          }}
        />
      </ListItemAvatar>
      
      <ListItemText
        disableTypography={true}
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography component="span" variant="subtitle2" fontWeight={notification.is_read ? 'normal' : 'medium'}>
              {senderName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              {getNotificationIcon(notification.type)}
            </Box>
          </Box>
        }
        secondary={
          <Box>
            <Typography 
              component="span"
              variant="body2" 
              color={notification.is_read ? "text.secondary" : "text.primary"}
              sx={{ 
                display: 'block',
                fontSize: '0.85rem',
                lineHeight: 1.4,
                mb: 0.5 
              }}
            >
              {getActionText()}
            </Typography>
            
            
            {getContentPreview() && (
              <Box sx={{ 
                mt: 1, 
                p: 1, 
                borderRadius: 1,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getContextIcon(notification.link)}
                  <Typography 
                    component="span"
                    variant="caption" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem',
                      fontWeight: 'medium'
                    }}
                  >
                    {contextTitle}
                  </Typography>
                </Box>
                
                <Typography 
                  component="span"
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                    fontWeight: notification.is_read ? 'normal' : 'medium',
                    pl: 0.5
                  }}
                >
                  {getContentPreview()}
                </Typography>
              </Box>
            )}
            
            <Typography 
              component="span"
              variant="caption" 
              color="text.secondary"
              sx={{ 
                opacity: 0.7, 
                fontSize: '0.7rem', 
                display: 'block',
                mt: 0.5
              }}
            >
              {notification.created_at ? formatRelativeTime(notification.created_at) : 'Только что'}
            </Typography>
          </Box>
        }
        onClick={() => onNotificationClick(notification)}
        sx={{ cursor: 'pointer' }}
      />
      
      <IconButton 
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="delete-button"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          opacity: 0,
          transform: 'translateX(10px)',
          transition: 'all 0.2s ease',
          color: theme.palette.text.secondary,
          padding: 0.5
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </ListItem>
  );
};

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications');
      
      if (response.data && response.data.success && response.data.notifications) {
        
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  
  const markAllAsRead = async () => {
    try {
      const response = await axios.post('/api/notifications/mark-all-read');
      
      if (response.data && response.data.success) {
        
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      
      if (response.data && response.data.success) {
        
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  
  const clearAllNotifications = async () => {
    try {
      const response = await axios.delete('/api/notifications');
      
      if (response.data && response.data.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification || !notification.id) return;
    
    try {
      await axios.post(`/api/notifications/${notification.id}/read`);
      
      
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      
      if (!notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      
      setDrawerOpen(false);
      
      
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      
      if (notification.link) {
        setDrawerOpen(false);
        navigate(notification.link);
      }
    }
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };
  
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      
      <IconButton
        color="inherit"
        onClick={handleOpenDrawer}
        sx={{ 
          position: 'relative', 
          mr: 1,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1)
          }
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.7rem',
              height: '18px',
              minWidth: '18px'
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onOpen={handleOpenDrawer}
        disableSwipeToOpen={true}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 360, md: 420 },
            maxWidth: '100%',
            boxSizing: 'border-box',
            boxShadow: '0 0 15px rgba(0,0,0,0.15)',
            borderRadius: { xs: 0, sm: '16px 0 0 16px' },
            bgcolor: theme.palette.mode === 'dark' ? alpha('#000', 0.9) : alpha('#121212', 0.95)
          }
        }}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Уведомления
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {notifications.length > 0 && (
              <Tooltip title="Отметить все как прочитанные">
                <IconButton 
                  size="small" 
                  onClick={markAllAsRead}
                  disabled={notifications.length === 0 || unreadCount === 0}
                  sx={{ 
                    opacity: notifications.length > 0 && unreadCount > 0 ? 1 : 0.5,
                  }}
                >
                  <ExpandLess fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {notifications.length > 0 && (
              <Tooltip title="Очистить все уведомления">
                <IconButton 
                  size="small" 
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                  sx={{ 
                    opacity: notifications.length > 0 ? 1 : 0.5,
                  }}
                >
                  <ClearAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            <IconButton size="small" onClick={handleCloseDrawer}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ 
          height: 'calc(100% - 56px)', 
          overflowY: 'auto',
          p: 2,
          bgcolor: theme.palette.mode === 'dark' ? alpha('#121212', 0.7) : alpha('#1a1a1a', 0.8),
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%' 
            }}>
              <CircularProgress size={32} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
              opacity: 0.7
            }}>
              <NotificationsIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                У вас пока нет уведомлений
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              <Fade in={true} timeout={500}>
                <Box>
                  {notifications.map((notification, index) => (
                    <Slide 
                      key={notification.id} 
                      direction="left" 
                      in={true} 
                      timeout={(index + 1) * 100}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box>
                        <NotificationItem
                          notification={notification}
                          onNotificationClick={handleNotificationClick}
                          onDelete={deleteNotification}
                        />
                      </Box>
                    </Slide>
                  ))}
                </Box>
              </Fade>
            </List>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default NotificationList; 