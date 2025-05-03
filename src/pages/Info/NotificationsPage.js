import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Paper,
  IconButton,
  Collapse,
  Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatTimeAgo } from '../../utils/dateUtils';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


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

const NotificationGroup = ({ notifications, onNotificationClick }) => {
  const [open, setOpen] = useState(false);
  
  
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

  
  const senderName = firstNotification.sender_user?.name || 'Пользователь';
  const avatar = firstNotification.sender_user?.avatar_url || 
                 (firstNotification.sender_user?.id ? 
                  `/static/uploads/avatar/${firstNotification.sender_user.id}/${firstNotification.sender_user.photo || 'avatar.png'}` : 
                  '/static/uploads/avatar/system/avatar.png');

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 2, 
        overflow: 'hidden',
        bgcolor: hasUnread ? 'rgba(140, 82, 255, 0.03)' : 'background.paper',
        border: hasUnread ? '1px solid rgba(140, 82, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <ListItem 
        button 
        onClick={handleClick}
        sx={{
          py: 1.5,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.05)'
          }
        }}
      >
        <ListItemAvatar>
          <Avatar 
            src={avatar}
            alt={senderName}
            sx={{ width: 40, height: 40 }}
            onError={(e) => {
              
              if (e.currentTarget) {
                e.currentTarget.src = '/static/uploads/avatar/system/avatar.png';
              }
            }}
          >
            {senderName && senderName[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle2">
              {senderName}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {count > 1 ? `${count} уведомлений` : (firstNotification.message || 'Новое уведомление')}
            </Typography>
          }
        />
        {count > 1 && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id || index}>
              <ListItem 
                button 
                sx={{ 
                  pl: 4,
                  py: 1.5,
                  bgcolor: notification.is_read ? 'transparent' : 'rgba(140, 82, 255, 0.05)'
                }}
                onClick={() => onNotificationClick(notification)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  {getNotificationIcon(notification.type)}
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {notification.message || 'Новое уведомление'}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notification.created_at ? formatTimeAgo(notification.created_at) : 'Только что'}
                    </Typography>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        const response = await axios.get('/api/notifications');
        console.log("Notifications API response:", response.data);
        
        if (response.data && Array.isArray(response.data.notifications)) {
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.unread_count || 0);
          console.log(`Loaded ${response.data.notifications.length} notifications`);
        } else {
          console.warn("Invalid notifications data format:", response.data);
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

    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 90000); 
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
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  
  const groupedNotifications = useMemo(() => {
    console.log("Grouping notifications:", notifications);
    
    
    const validNotifications = notifications.filter(
      notification => notification && notification.sender_user && notification.sender_user.id
    );
    
    
    return validNotifications.reduce((acc, notification) => {
      const key = notification.sender_user.id;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      
      acc[key].push(notification);
      return acc;
    }, {});
  }, [notifications]);

  
  const notificationGroups = useMemo(() => {
    return Object.values(groupedNotifications);
  }, [groupedNotifications]);

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        pt: 3,
        pb: 4,
        minHeight: 'calc(100vh - 64px)'
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" component="h1">
          Уведомления
        </Typography>
        {unreadCount > 0 && (
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            sx={{ 
              '& .MuiBadge-badge': {
                fontSize: '0.8rem',
                height: '22px',
                minWidth: '22px'
              }
            }}
          />
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : notificationGroups.length > 0 ? (
        <List sx={{ p: 0 }}>
          {notificationGroups.map((group, index) => (
            <NotificationGroup 
              key={group[0].sender_user.id || index}
              notifications={group}
              onNotificationClick={handleNotificationClick}
            />
          ))}
        </List>
      ) : (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Typography color="text.secondary">
            У вас пока нет уведомлений
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default NotificationsPage; 