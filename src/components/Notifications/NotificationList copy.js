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
  Button,
  alpha,
  useTheme,
  styled,
  Paper,
  Tooltip,
  Zoom
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { formatDateTimeShort } from '../../utils/dateUtils';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    minWidth: 380,
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    padding: theme.spacing(1),
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    overflow: 'visible',
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 18,
      width: 12,
      height: 12,
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
}));

const NotificationItem = styled(ListItem)(({ theme, unread }) => ({
  transition: 'all 0.2s ease',
  borderRadius: 8,
  margin: theme.spacing(0.5, 0),
  backgroundColor: unread ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  '&:hover': {
    backgroundColor: unread ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.5),
  },
}));

const NotificationIcon = styled(Box)(({ theme, type = 'default' }) => {
  const getColor = () => {
    switch (type) {
      case 'comment_like':
      case 'reply_like':
      case 'post_like':
        return theme.palette.error.main;
      case 'follow':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: alpha(getColor(), 0.1),
    color: getColor(),
    marginRight: theme.spacing(1.5),
  };
});

const EmptyNotifications = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AnimatedItem = styled(Box)(({ theme, delay = 0 }) => ({
  animation: `fadeInUp 0.3s ease forwards ${delay}s`,
  opacity: 0,
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const getNotificationIcon = (type) => {
  switch (type) {
    case 'comment_like':
    case 'reply_like':
    case 'post_like':
      return <FavoriteIcon fontSize="small" />;
    case 'comment':
      return <ChatBubbleIcon fontSize="small" />;
    case 'reply':
      return <ReplyIcon fontSize="small" />;
    case 'follow':
      return <PersonAddIcon fontSize="small" />;
    default:
      return <NotificationsIcon fontSize="small" />;
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

const NotificationGroup = ({ notifications, onNotificationClick }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  
  
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }
  
  const firstNotification = notifications[0];
  if (!firstNotification || typeof firstNotification !== 'object') {
    return null;
  }

  const count = notifications.length;
  const hasUnread = notifications.some(n => !n.is_read);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleNotificationClick = (notification) => {
    if (onNotificationClick && typeof onNotificationClick === 'function') {
      onNotificationClick(notification);
    }
  };

  
  const senderName = firstNotification.sender_user?.name || 'Пользователь';
  const avatar = getAvatarUrl(firstNotification.sender_user);

  return (
    <AnimatedItem>
      <NotificationItem 
        button 
        onClick={handleClick}
        unread={hasUnread ? 1 : 0}
      >
        <ListItemAvatar>
          <Avatar 
            src={avatar} 
            alt={senderName}
            sx={{ 
              width: 45, 
              height: 45,
              border: hasUnread ? `2px solid ${theme.palette.primary.main}` : 'none',
            }}
            onError={(e) => {
              
              if (e.currentTarget && e.currentTarget.setAttribute) {
                e.currentTarget.setAttribute('src', '/static/uploads/avatar/system/avatar.png');
              }
            }}
          >
            {senderName ? senderName[0] : '?'}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle2" fontWeight={hasUnread ? 600 : 400}>
              {senderName}
              {hasUnread && (
                <Box 
                  component="span" 
                  sx={{ 
                    display: 'inline-block', 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    ml: 1
                  }}
                />
              )}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
              {count > 1 ? `${count} уведомлений` : (firstNotification.message || 'Новое уведомление')}
            </Typography>
          }
        />
        {count > 1 && (
          <Box sx={{ ml: 1 }}>
            {open ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
          </Box>
        )}
      </NotificationItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2, pr: 1 }}>
          {notifications.map((notification, index) => (
            notification && (
              <AnimatedItem key={notification.id || index} delay={0.05 * index}>
                <NotificationItem 
                  button 
                  unread={!notification.is_read ? 1 : 0}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ borderLeft: `2px solid ${!notification.is_read ? theme.palette.primary.main : 'transparent'}` }}
                >
                  <NotificationIcon type={notification.type || 'default'}>
                    {getNotificationIcon(notification.type || 'default')}
                  </NotificationIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={!notification.is_read ? 600 : 400}>
                        {notification.message || 'Новое уведомление'}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {notification.created_at ? formatDateTimeShort(notification.created_at) : 'Только что'}
                      </Typography>
                    }
                  />
                </NotificationItem>
                {index < notifications.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
              </AnimatedItem>
            )
          ))}
        </List>
      </Collapse>
      <Divider sx={{ opacity: 0.5 }} />
    </AnimatedItem>
  );
};

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  
  const groupedNotifications = React.useMemo(() => {
    if (!Array.isArray(notifications) || notifications.length === 0) return [];
    
    const groups = {};
    notifications.forEach(notification => {
      if (!notification) return;
      
      const senderId = notification.sender_user?.id || 'system';
      if (!groups[senderId]) {
        groups[senderId] = [];
      }
      groups[senderId].push(notification);
    });
    
    
    return Object.values(groups).filter(group => group.length > 0);
  }, [notifications]);

  
  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications...');
      const response = await axios.get('/api/notifications');
      console.log('Notifications data:', response.data);
      
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
        console.log(`Loaded ${response.data.notifications.length} notifications`);
      } else {
        console.warn('Invalid notification data:', response.data);
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
      console.log('Marking all notifications as read');
      const response = await axios.post('/api/notifications/mark-all-read');
      console.log('Mark all read response:', response.data);
      
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

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification || !notification.id) return;
    
    try {
      console.log('Marking notification as read:', notification.id);
      await axios.post(`/api/notifications/${notification.id}/read`);
      
      
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      
      
      if (!notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      
      if (notification.data && notification.data.url) {
        navigate(notification.data.url);
        handleMenuClose();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    
    if (notifications.length === 0 || loading) {
      fetchNotifications();
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Уведомления" arrow TransitionComponent={Zoom}>
        <IconButton 
          onClick={handleMenuOpen}
          sx={{ 
            position: 'relative',
            color: Boolean(anchorEl) ? 'primary.main' : 'inherit',
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="primary" 
            overlap="circular"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 16,
                minWidth: 16,
                padding: '0 4px',
              }
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <NotificationHeader>
          <Typography variant="subtitle1" fontWeight="bold">
            Уведомления
            {unreadCount > 0 && (
              <Badge 
                badgeContent={unreadCount} 
                color="primary" 
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Box>
            {unreadCount > 0 && (
              <Tooltip title="Отметить все как прочитанные" arrow>
                <IconButton size="small" onClick={markAllAsRead} sx={{ mr: 1 }}>
                  <DoneAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Закрыть" arrow>
              <IconButton size="small" onClick={handleMenuClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </NotificationHeader>
        
        <Divider sx={{ mb: 1 }} />
        
        <Box sx={{ maxHeight: 400, overflow: 'auto', px: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={30} color="primary" />
            </Box>
          ) : groupedNotifications.length > 0 ? (
            <List sx={{ width: '100%', p: 0 }}>
              {groupedNotifications.map((group, index) => (
                <NotificationGroup 
                  key={index} 
                  notifications={group} 
                  onNotificationClick={handleNotificationClick} 
                />
              ))}
            </List>
          ) : (
            <EmptyNotifications>
              <NotificationsIcon sx={{ fontSize: 40, opacity: 0.5, mb: 2 }} />
              <Typography variant="body1">Нет новых уведомлений</Typography>
              <Typography variant="body2" color="text.secondary">
                Здесь будут отображаться ваши уведомления
              </Typography>
            </EmptyNotifications>
          )}
        </Box>
        
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button 
            variant="text" 
            color="primary" 
            size="small" 
            onClick={() => {
              navigate('/notifications');
              handleMenuClose();
            }}
          >
            Все уведомления
          </Button>
        </Box>
      </StyledMenu>
    </>
  );
};

export default NotificationList; 