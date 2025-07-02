import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Menu,
  CircularProgress,
  alpha,
  useTheme,
  Tooltip,
  styled,
  Zoom,
  Chip,
  Collapse,
  ListItemButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import ForumIcon from '@mui/icons-material/Forum';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RepeatIcon from '@mui/icons-material/Repeat';
import WarningIcon from '@mui/icons-material/Warning';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GavelIcon from '@mui/icons-material/Gavel';
import MessageIcon from '@mui/icons-material/Message';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Icon } from '@iconify/react';
import walletMoneyIcon from '@iconify-icons/solar/wallet-money-bold';
import axios from 'axios';
import { formatDateTimeShort } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    minWidth: 380,
    maxWidth: 380,
    maxHeight: 'calc(100vh - 100px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: theme.spacing(1),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    overflow: 'visible',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100vw',
      maxWidth: '100vw',
      width: '100vw',
      margin: 0,
      borderRadius: 0,
      position: 'fixed',
      top: '0 !important',
      left: '0 !important',
      right: '0 !important',
      bottom: '0 !important',
      height: '100vh',
      maxHeight: '100vh',
      border: 'none',
      boxShadow: 'none',
    },
    '& .MuiMenuItem-root': {
      padding: '10px 16px',
      borderRadius: '8px',
      margin: '2px 8px',
      transition: 'all 0.2s',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
      '&:hover': {
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
      }
    },
  },
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  backgroundColor: 'transparent',
}));

const StyledNotificationItem = styled(ListItem)(({ theme, unread }) => ({
  transition: 'all 0.2s ease',
  borderRadius: 8,
  margin: theme.spacing(0.5, 0),
  backgroundColor: unread ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: unread ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.5),
  },
  '& .notification-bg-icon': {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: 'translateY(-50%) rotate(-15deg)',
    fontSize: '3rem',
    opacity: 0.3,
    color: theme.palette.primary.main,
    pointerEvents: 'none',
    filter: 'blur(2px)',
    '& svg': {
      filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.6)})`,
    }
  }
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

const StyledChip = styled(Chip)(({ theme }) => ({
  '& .MuiChip-avatar': {
    width: 24,
    height: 24,
    marginLeft: 4,
    marginRight: -4,
  },
  '& .MuiChip-label': {
    paddingLeft: 8,
  },
  borderRadius: '16px',
  height: 32,
}));

const PointsIcon = styled('img')({
  width: 24,
  height: 24,
  marginRight: 4,
});

const GroupedNotificationItem = styled(ListItemButton)(({ theme, unread }) => ({
  transition: 'all 0.2s ease',
  borderRadius: 8,
  margin: theme.spacing(0.5, 0),
  backgroundColor: unread ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: unread ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.5),
  },
  '& .group-count': {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '50%',
    width: 15,
    height: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.6rem',
    fontWeight: 'bold',
    zIndex: 2,
  },
  '& .expand-icon': {
    position: 'absolute',
    right: 28,
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'transform 0.2s ease',
  }
}));

const getNotificationIcon = (type) => {
  switch (type) {
    case 'comment_like':
    case 'reply_like':
    case 'post_like':
      return <FavoriteIcon sx={{ fontSize: '3rem' }} />;
    case 'comment':
    case 'reply':
      return <ChatBubbleIcon sx={{ fontSize: '3rem' }} />;
    case 'follow':
      return <PersonAddIcon sx={{ fontSize: '3rem' }} />;
    case 'repost':
      return <RepeatIcon sx={{ fontSize: '3rem' }} />;
    case 'wall_post':
      return <PostAddIcon sx={{ fontSize: '3rem' }} />;
    case 'points_transfer':
      return <Icon icon={walletMoneyIcon} width="3rem" height="3rem" />;
    case 'badge_purchase':
    case 'username_auction_bid':
    case 'username_bid_accepted':
    case 'username_auction_outbid':
    case 'username_auction_sold':
    case 'username_auction_won':
    case 'username_auction_cancelled':
    case 'username_auction_bid_increased':
    case 'auction_win':
    case 'auction_sold':
    case 'auction_refund':
    case 'new_auction_bid':
      return <MonetizationOnIcon sx={{ fontSize: '3rem' }} />;
    case 'moderation':
    case 'ban':
    case 'unban':
    case 'warning':
      return <GavelIcon sx={{ fontSize: '3rem' }} />;
    case 'mention':
      return <MessageIcon sx={{ fontSize: '3rem' }} />;
    case 'medal':
      return <EmojiEventsIcon sx={{ fontSize: '3rem' }} />;
    default:
      return <NotificationsIcon sx={{ fontSize: '3rem' }} />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'comment_like':
    case 'reply_like':
    case 'post_like':
      return 'primary';
    case 'follow':
      return 'primary';
    case 'points_transfer':
    case 'badge_purchase':
    case 'username_auction_bid':
    case 'username_bid_accepted':
    case 'username_auction_outbid':
    case 'username_auction_sold':
    case 'username_auction_won':
    case 'username_auction_cancelled':
    case 'username_auction_bid_increased':
    case 'auction_win':
    case 'auction_sold':
    case 'auction_refund':
    case 'new_auction_bid':
      return 'primary';
    case 'moderation':
    case 'ban':
    case 'unban':
    case 'warning':
      return 'primary';
    case 'medal':
      return 'primary';
    default:
      return 'primary';
  }
};

const formatRelativeTime = (dateString) => {
  const { t } = useLanguage();
  if (!dateString) return t('notifications.time.just_now');
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return t('notifications.time.recently');
    }
    
    const now = new Date();
    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    
    if (seconds < 60) {
      return t('notifications.time.just_now');
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} ${getMinutesString(minutes)} ${t('notifications.time.ago')}`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} ${getHoursString(hours)} ${t('notifications.time.ago')}`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} ${getDaysString(days)} ${t('notifications.time.ago')}`;
    }
    
    return formatDateTimeShort(dateString);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return t('notifications.time.recently');
  }
};

const getMinutesString = (minutes) => {
  const { t } = useLanguage();
  if (minutes % 10 === 1 && minutes % 100 !== 11) {
    return t('notifications.time.minute');
  } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
    return t('notifications.time.minutes');
  } else {
    return t('notifications.time.minutes_many');
  }
};

const getHoursString = (hours) => {
  const { t } = useLanguage();
  if (hours % 10 === 1 && hours % 100 !== 11) {
    return t('notifications.time.hour');
  } else if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) {
    return t('notifications.time.hours');
  } else {
    return t('notifications.time.hours_many');
  }
};

const getDaysString = (days) => {
  const { t } = useLanguage();
  if (days % 10 === 1 && days % 100 !== 11) {
    return t('notifications.time.day');
  } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
    return t('notifications.time.days');
  } else {
    return t('notifications.time.days_many');
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

const getAvatarUrl = (user) => {
  if (!user) return '/static/uploads/avatar/system/avatar.png';
  return user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png';
};

const getContextText = (notification) => {
  const { t } = useLanguage();
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
      return t('notifications.context.default_post');
      
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
      return t('notifications.context.default_comment');
      
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
      return t('notifications.context.default_reply');
      
    case 'profile':
      return t('notifications.context.default_profile');
      
    default:
      return '';
  }
};

const getContextTitle = (notification) => {
  const { t } = useLanguage();
  if (!notification || !notification.link) return '';
  
  const linkInfo = parseNotificationLink(notification.link);
  
  switch (linkInfo.type) {
    case 'post':
      return t('notifications.context.post');
    case 'comment':
      return t('notifications.context.comment');
    case 'reply':
      return t('notifications.context.reply');
    case 'profile':
      return t('notifications.context.profile');
    default:
      return '';
  }
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

const getNotificationMessage = (notification, t) => {
  if (!notification.message) return '';

  const pointsMatch = notification.message.match(/(\d+)\s+балл[а-я]*/);
  const points = pointsMatch ? pointsMatch[1] : null;
  const badgeMatch = notification.message.match(/бейджик «([^»]+)»/);
  const badgeName = badgeMatch ? badgeMatch[1] : null;
  const priceMatch = notification.message.match(/за (\d+) балл/);
  const price = priceMatch ? priceMatch[1] : null;
  const royaltyMatch = notification.message.match(/\+(\d+) балл/);
  const royalty = royaltyMatch ? royaltyMatch[1] : null;

  switch (notification.type) {
    case 'post_like':
      return t('notifications.messages.post_like');
    case 'post_comment':
      return t('notifications.messages.post_comment');
    case 'comment_like':
      return t('notifications.messages.comment_like');
    case 'post_repost':
      return t('notifications.messages.post_repost');
    case 'points_transfer':
      return points ? t('notifications.messages.points_transfer', { points }) : notification.message;
    case 'badge_purchase':
      return badgeName && price && royalty 
        ? t('notifications.messages.badge_purchase', { badge: badgeName, price, royalty })
        : notification.message;
    case 'wall_post':
      return t('notifications.messages.wall_post');
    case 'comment_reply':
      return t('notifications.messages.comment_reply', { username: notification.sender_user?.name || t('notifications.user.default') });
    default:
      return notification.message;
  }
};

const groupNotificationsByUser = (notifications) => {
  const groups = {};
  
  notifications.forEach(notification => {
    const userId = notification.sender_user?.id;
    if (!userId) {
      // Если нет пользователя, добавляем как отдельное уведомление
      if (!groups['no-user']) {
        groups['no-user'] = [];
      }
      groups['no-user'].push(notification);
      return;
    }
    
    if (!groups[userId]) {
      groups[userId] = [];
    }
    groups[userId].push(notification);
  });
  
  // Преобразуем группы в массив
  return Object.entries(groups).map(([userId, notifications]) => ({
    userId,
    user: userId === 'no-user' ? null : notifications[0]?.sender_user,
    notifications: notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    unreadCount: notifications.filter(n => !n.is_read).length,
    latestNotification: notifications[0]
  }));
};

const NotificationItemComponent = React.memo(({ notification, onClick }) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const senderName = notification.sender_user?.name || t('notifications.user.default');
  const avatar = getAvatarUrl(notification.sender_user);
  const notificationColor = getNotificationColor(notification.type);

  const renderNotificationContent = useCallback(() => {
    if (!notification.message) return null;

    const pointsMatch = notification.message.match(/(\d+)\s+балл[а-я]*/);
    const points = pointsMatch ? pointsMatch[1] : null;
    const badgeMatch = notification.message.match(/бейджик «([^»]+)»/);
    const badgeName = badgeMatch ? badgeMatch[1] : null;
    const usernameMatch = notification.message.match(/юзернейм "([^"]+)"/);
    const username = usernameMatch ? usernameMatch[1] : null;

    let message = getNotificationMessage(notification, t);
    let showMessage = true;

    if (notification.type === 'points_transfer') {
      showMessage = notification.message.includes('с сообщением:');
      if (showMessage) {
        const parts = notification.message.split('с сообщением:');
        message = parts[1]?.trim() || '';
      }
    } else if (notification.message.includes('с сообщением:')) {
      const parts = notification.message.split('с сообщением:');
      message = `${getNotificationMessage(notification, t)} ${t('notifications.messages.with_message')} ${parts[1]?.trim() || ''}`;
    }

    return (
      <Box sx={{ mt: 1 }}>
        {showMessage && message && (
          <Typography variant="body2" color="text.primary">
            {message}
          </Typography>
        )}
        {(points || badgeName || username) && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {points && (
              <StyledChip
                size="small"
                avatar={<PointsIcon src="/static/icons/KBalls.svg" alt="points" />}
                label={t('notifications.points.label', { count: formatNumber(parseInt(points)) })}
                variant="outlined"
              />
            )}
            {badgeName && (
              <StyledChip
                size="small"
                icon={<EmojiEventsIcon />}
                label={badgeName}
                variant="outlined"
              />
            )}
            {username && (
              <StyledChip
                size="small"
                icon={<PersonAddIcon />}
                label={username}
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>
    );
  }, [notification, t]);

  return (
    <StyledNotificationItem 
      button 
      unread={!notification.is_read ? 1 : 0}
      onClick={() => onClick(notification)}
      sx={{ 
        borderLeft: `2px solid ${!notification.is_read ? theme.palette[notificationColor].main : 'transparent'}`,
        mb: 1,
        borderRadius: 1,
        '&:hover': {
          backgroundColor: alpha(theme.palette[notificationColor].main, 0.08),
        }
      }}
    >
      <ListItemAvatar>
        <Avatar 
          src={avatar} 
          alt={senderName}
          sx={{ 
            width: 40, 
            height: 40,
            border: !notification.is_read ? `2px solid ${theme.palette[notificationColor].main}` : 'none',
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography 
              variant="body2" 
              fontWeight={!notification.is_read ? 600 : 400}
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 80px)'
              }}
            >
              {senderName}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                ml: 1,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontSize: '0.65rem'
              }}
            >
              {formatRelativeTime(notification.created_at)}
            </Typography>
          </Box>
        }
        secondary={renderNotificationContent()}
      />
      <Box className="notification-bg-icon">
        {getNotificationIcon(notification.type || 'default')}
      </Box>
    </StyledNotificationItem>
  );
});

const GroupedNotificationComponent = React.memo(({ group, onClick, onMarkGroupAsRead, isExpanded, onToggleExpanded, onUpdateUnreadCount }) => {
  const theme = useTheme();
  const { t } = useLanguage();
  
  const userName = group.user?.name || t('notifications.user.default');
  const avatar = getAvatarUrl(group.user);
  const notificationColor = getNotificationColor(group.latestNotification.type);
  
  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleExpanded(group.userId);
    
    // Если группа раскрывается и есть непрочитанные уведомления, отмечаем их как прочитанные
    // но не обновляем состояние списка, чтобы группа не перемещалась
    if (!isExpanded && group.unreadCount > 0) {
      const unreadNotifications = group.notifications.filter(n => !n.is_read);
      if (unreadNotifications.length > 0) {
        // Отправляем запросы на сервер без обновления локального состояния
        unreadNotifications.forEach(notification => {
          axios.post(`/api/notifications/${notification.id}/read`).catch(error => {
            console.error('Error marking notification as read:', error);
          });
        });
        
        // Обновляем только счетчик непрочитанных уведомлений
        onUpdateUnreadCount(prev => Math.max(0, prev - unreadNotifications.length));
      }
    }
  };
  
  const handleGroupClick = () => {
    // При клике на группу переходим к самому новому уведомлению
    if (group.latestNotification && onClick) {
      onClick(group.latestNotification);
    }
  };
  
  const getGroupSummary = () => {
    const types = [...new Set(group.notifications.map(n => n.type))];
    const count = group.notifications.length;
    
    if (count === 1) {
      return getNotificationMessage(group.latestNotification, t);
    }
    
    // Создаем краткое описание группы
    const typeCounts = {};
    group.notifications.forEach(n => {
      typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
    });
    
    const typeNames = Object.entries(typeCounts).map(([type, count]) => {
      switch (type) {
        case 'post_like':
          return `${count} ${count === 1 ? t('notifications.types.like') : t('notifications.types.likes')}`;
        case 'comment':
          return `${count} ${count === 1 ? t('notifications.types.comment') : t('notifications.types.comments')}`;
        case 'follow':
          return `${count} ${count === 1 ? t('notifications.types.follow') : t('notifications.types.follows')}`;
        case 'points_transfer':
          return `${count} ${count === 1 ? t('notifications.types.transfer') : t('notifications.types.transfers')}`;
        default:
          return `${count} ${t('notifications.types.notifications')}`;
      }
    });
    
    return typeNames.join(', ');
  };
  
  return (
    <Box>
      <GroupedNotificationItem
        unread={group.unreadCount > 0 ? 1 : 0}
        onClick={handleGroupClick}
        sx={{ 
          borderLeft: `2px solid ${group.unreadCount > 0 ? theme.palette[notificationColor].main : 'transparent'}`,
          mb: 1,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: alpha(theme.palette[notificationColor].main, 0.08),
          }
        }}
      >
        <ListItemAvatar>
          <Avatar 
            src={avatar} 
            alt={userName}
            sx={{ 
              width: 40, 
              height: 40,
              border: group.unreadCount > 0 ? `2px solid ${theme.palette[notificationColor].main}` : 'none',
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="body2" 
                fontWeight={group.unreadCount > 0 ? 600 : 400}
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 'calc(100% - 120px)'
                }}
              >
                {userName}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  fontSize: '0.65rem'
                }}
              >
                {formatRelativeTime(group.latestNotification.created_at)}
              </Typography>
            </Box>
          }
          secondary={
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.primary">
                {getGroupSummary()}
              </Typography>
            </Box>
          }
        />
        
        {/* Счетчик уведомлений в группе */}
        {group.notifications.length > 1 && (
          <Box className="group-count">
            {group.notifications.length}
          </Box>
        )}
        
        {/* Иконка раскрытия */}
        {group.notifications.length > 1 && (
          <IconButton
            size="small"
            onClick={handleToggle}
            className="expand-icon"
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </GroupedNotificationItem>
      
      {/* Раскрытый список уведомлений */}
      {group.notifications.length > 1 && (
        <Collapse in={isExpanded}>
          <List sx={{ width: '100%', p: 0 }}>
            {group.notifications.map((notification) => (
              <NotificationItemComponent
                key={notification.id} 
                notification={notification}
                onClick={onClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
});

const NotificationList = ({ onNewNotification }) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get('/api/notifications');
      if (response.data && response.data.success) {
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    const intervalId = setInterval(fetchUnreadCount, 30000); // Update every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchUnreadCount]);

  const fetchNotifications = useCallback(async () => {
    if (loading) return;
  
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/notifications');
      
      if (response.data && response.data.success) {
        const newNotifications = response.data.notifications || [];
        setNotifications(newNotifications);
        setUnreadCount(response.data.unread_count || 0);

        // Check for new notifications
        if (newNotifications.length > 0) {
          const latestNotification = newNotifications[0];
          const now = new Date();
          const notificationTime = new Date(latestNotification.created_at);
          const timeDiff = now - notificationTime;
          
          // If notification is less than 1 minute old, show popup
          if (timeDiff <= 60000 && onNewNotification) {
            onNewNotification(latestNotification);
          }
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [loading, onNewNotification]);
  
  const markAllAsRead = useCallback(async () => {
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
  }, []);

  const markGroupAsRead = useCallback(async (group) => {
    try {
      const unreadNotifications = group.notifications.filter(n => !n.is_read);
      if (unreadNotifications.length === 0) return;
      
      // Отмечаем все уведомления в группе как прочитанные
      await Promise.all(
        unreadNotifications.map(notification =>
          axios.post(`/api/notifications/${notification.id}/read`)
        )
      );
      
      // Обновляем состояние
      setNotifications(prev => 
        prev.map(n => 
          group.notifications.some(groupN => groupN.id === n.id) 
            ? { ...n, is_read: true }
            : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - unreadNotifications.length));
    } catch (error) {
      console.error('Error marking group as read:', error);
    }
  }, []);

  const handleNotificationClick = useCallback(async (notification) => {
    if (!notification || !notification.id) return;
    
    try {
      await axios.post(`/api/notifications/${notification.id}/read`);
      
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      
      if (!notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      if (notification.link) {
        navigate(notification.link);
        handleMenuClose();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [navigate]);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMenuClose = useCallback(() => {
    // Очищаем состояние раскрытых групп
    setExpandedGroups(new Set());
    setAnchorEl(null);
  }, []);

  const clearAllNotifications = useCallback(async () => {
    try {
      const response = await axios.delete('/api/notifications');
      if (response.data && response.data.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, []);

  const handleToggleExpanded = useCallback((userId) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  // Группируем уведомления
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByUser(notifications).sort((a, b) => {
      // Сначала непрочитанные группы
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      // Затем по времени последнего уведомления
      return new Date(b.latestNotification.created_at) - new Date(a.latestNotification.created_at);
    });
  }, [notifications]);

  return (
    <>
      <Tooltip title={t('notifications.tooltips.notifications')} arrow TransitionComponent={Zoom}>
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
            {t('notifications.title')}
            {unreadCount > 0 && (
              <Badge 
                badgeContent={unreadCount} 
                color="primary" 
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <Box>
            {notifications.length > 0 && (
              <Tooltip title={t('notifications.tooltips.clear_all')}>
                <IconButton 
                  size="small" 
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                  sx={{ 
                    opacity: notifications.length > 0 ? 1 : 0.5,
                    mr: 1
                  }}
                >
                  <ClearAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {unreadCount > 0 && (
              <Tooltip title={t('notifications.tooltips.mark_all_read')} arrow>
                <IconButton size="small" onClick={markAllAsRead} sx={{ mr: 1 }}>
                  <DoneAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('notifications.tooltips.close')} arrow>
              <IconButton size="small" onClick={handleMenuClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </NotificationHeader>
        
        <Box sx={{ 
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          px: 1,
          [theme.breakpoints.down('sm')]: {
            maxHeight: 'calc(100vh - 120px)',
            height: 'calc(100vh - 120px)'
          }
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={30} color="primary" />
            </Box>
          ) : error ? (
            <EmptyNotifications>
              <Typography variant="body2" color="error">
                {t('notifications.error.load_failed')}
              </Typography>
            </EmptyNotifications>
          ) : groupedNotifications.length > 0 ? (
            <List sx={{ width: '100%', p: 0 }}>
              {groupedNotifications.map((group) => (
                <GroupedNotificationComponent
                  key={group.userId} 
                  group={group}
                  onClick={handleNotificationClick}
                  onMarkGroupAsRead={markGroupAsRead}
                  isExpanded={expandedGroups.has(group.userId)}
                  onToggleExpanded={handleToggleExpanded}
                  onUpdateUnreadCount={setUnreadCount}
                />
              ))}
            </List>
          ) : (
            <EmptyNotifications>
              <NotificationsIcon sx={{ fontSize: 40, opacity: 0.5, mb: 2 }} />
              <Typography variant="body1">{t('notifications.empty.no_notifications')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('notifications.empty.description')}
              </Typography>
            </EmptyNotifications>
          )}
        </Box>
      </StyledMenu>
    </>
  );
};

export default React.memo(NotificationList); 