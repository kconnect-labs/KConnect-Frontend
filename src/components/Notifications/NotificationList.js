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
  Tooltip
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
import axios from 'axios';
import { formatDateTimeShort } from '../../utils/dateUtils';

// Get notification icon based on type
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

// Function to get proper avatar URL
const getAvatarUrl = (sender) => {
  if (!sender) return '/static/uploads/avatar/system/avatar.png';
  
  // If avatar_url is provided, use it directly
  if (sender.avatar_url) {
    // Check if the URL already has the full path to avoid duplicating
    if (sender.avatar_url.startsWith('/static/uploads/avatar/')) {
      return sender.avatar_url;
    }
    return sender.avatar_url;
  }
  
  // Otherwise construct from id and photo name
  if (sender.id && sender.photo) {
    // Make sure we're not duplicating paths
    if (sender.photo.startsWith('/static/uploads/avatar/')) {
      return sender.photo;
    }
    return `/static/uploads/avatar/${sender.id}/${sender.photo}`;
  }
  
  // Fallback
  return `/static/uploads/avatar/system/avatar.png`;
};

const NotificationItem = ({ notification, onNotificationClick, onDelete }) => {
  const theme = useTheme();
  
  if (!notification || !notification.id) {
    return null;
  }
  
  // Get sender name and avatar
  const senderName = notification.sender_user?.name || 'Пользователь';
  const avatar = getAvatarUrl(notification.sender_user);
  
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
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={notification.is_read ? 'normal' : 'medium'}>
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
              variant="body2" 
              color={notification.is_read ? "text.secondary" : "text.primary"}
              sx={{ 
                display: 'block',
                fontSize: '0.85rem',
                lineHeight: 1.4,
                mb: 0.5 
              }}
            >
              {notification.message || 'Новое уведомление'}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ opacity: 0.7, fontSize: '0.7rem' }}
            >
              {notification.created_at ? formatDateTimeShort(notification.created_at) : 'Только что'}
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications');
      
      if (response.data && response.data.notifications) {
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

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await axios.post('/api/notifications/mark-all-read');
      
      if (response.data && response.data.success) {
        // Update local state to mark all as read
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Delete a single notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      
      if (response.data && response.data.success) {
        // Remove the notification from state
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // Update unread count if the deleted notification was unread
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  // Clear all notifications
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
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      
      if (!notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Close drawer
      setDrawerOpen(false);
      
      // Navigate to link if provided
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      // Even if the API call fails, still navigate to the link
      if (notification.link) {
        setDrawerOpen(false);
        navigate(notification.link);
      }
    }
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    // Отмечаем все уведомления как прочитанные при открытии
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={handleOpenDrawer}
        sx={{ position: 'relative' }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.6rem',
              minWidth: '18px',
              height: '18px',
              padding: '0 4px'
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        PaperProps={{
          sx: {
            width: {
              xs: '100%',
              sm: 400
            },
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            boxShadow: '0 0 30px rgba(0,0,0,0.2)',
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <Box 
          sx={{ 
            p: 2.5, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1.25rem'
            }}
          >
            Уведомления
          </Typography>
          
          <Box>
            {notifications.length > 0 && (
              <Tooltip title="Очистить все уведомления">
                <IconButton 
                  size="small" 
                  onClick={clearAllNotifications}
                  sx={{ 
                    ml: 1,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                    }
                  }}
                >
                  <ClearAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            <IconButton 
              onClick={() => setDrawerOpen(false)}
              sx={{ ml: 1 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ p: 2, height: 'calc(100% - 70px)', overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={30} />
            </Box>
          ) : notifications.length > 0 ? (
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <Fade 
                  key={notification.id} 
                  in={true} 
                  timeout={300}
                >
                  <Box>
                    <NotificationItem 
                      notification={notification}
                      onNotificationClick={handleNotificationClick}
                      onDelete={deleteNotification}
                    />
                  </Box>
                </Fade>
              ))}
            </List>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                opacity: 0.7
              }}
            >
              <NotificationsIcon sx={{ fontSize: 56, opacity: 0.3, mb: 2 }} />
              <Typography color="text.secondary" variant="body1">
                Нет новых уведомлений
              </Typography>
            </Box>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default NotificationList; 