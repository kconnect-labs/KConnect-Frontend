import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MessengerMobile.css'; 
import { Box, Typography, Avatar, TextField, IconButton, Paper, Badge, Divider, 
  InputAdornment, CircularProgress, useMediaQuery, useTheme, Popover, Button, List, ListItem, 
  ListItemAvatar, ListItemText, ListItemButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, Slide, Stack, Chip, Drawer } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonIcon from '@mui/icons-material/Person';
import FileUploadPreview from '../../components/Messenger/FileUploadPreview';
import MessengerService from '../../services/Messenger/MessengerService';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Pagination from '@mui/material/Pagination';
import Picker from 'emoji-picker-react';
import PlyrVideo from '../../components/PlyrVideo';
import 'plyr/dist/plyr.css';
import { Fab } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSwipeable } from 'react-swipeable';
import { BOTTOM_NAV_ID } from '../../components/BottomNavigation'; 
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const SafeText = ({ children, ...props }) => {
  let content = children;
  if (content === null || content === undefined) {
    content = '';
  } else if (typeof content === 'object') {
    if (content.text) {
      content = content.text;
    } else if (content.message) {
      content = content.message;
    } else if (content.content) {
      content = content.content;
    } else {
      content = JSON.stringify(content);
    }
  }
  return <Typography {...props}>{content}</Typography>;
};
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '100vh', 
  maxHeight: '100vh', 
  position: 'fixed', 
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000, 
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
  [theme.breakpoints.up('md')]: {
    position: 'relative', 
    height: 'calc(100vh - 64px - 80px)', 
    maxHeight: '800px',
    margin: '40px auto',
    maxWidth: '1200px',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
      : '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
}));
const ChatListContainer = styled(Box)(({ theme, isMobile, showChatList }) => ({
  width: isMobile ? '100%' : '320px',
  minWidth: isMobile ? '100%' : '280px',
  borderRight: `1px solid ${theme.palette.divider}`,
  display: isMobile ? (showChatList ? 'flex' : 'none') : 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#131313' : '#FFFFFF',
  zIndex: 2, 
}));
const ChatListHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backdropFilter: 'blur(10px)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
}));
const ChatListItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})(({ theme, isActive }) => ({
  display: 'flex',
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  backgroundColor: isActive ? (theme.palette.mode === 'dark' ? 'rgba(128, 90, 213, 0.08)' : 'rgba(208, 188, 255, 0.08)') : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(128, 90, 213, 0.04)' : 'rgba(208, 188, 255, 0.04)',
  },
}));
const ChatInfoContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  marginLeft: 12,
  overflow: 'hidden',
});
const UnreadBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#805AD5',
    color: 'white',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    fontSize: '0.75rem',
    padding: '0 6px',
  }
}));
const UnreadBadgeContainer = styled(Box)({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  minWidth: '24px',
});
const LastMessageText = styled(SafeText)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.85rem',
  marginRight: '5px',
  maxWidth: 'calc(100% - 30px)',
});
const TimeText = styled(SafeText)({
  fontSize: '0.75rem',
  color: '#999',
  marginLeft: 'auto',
  alignSelf: 'flex-start',
});
const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: 10,
    height: 10,
    borderRadius: '50%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
const ConversationContainer = styled(Box)(({ theme, isMobile, showChatList }) => ({
  flexGrow: 1,
  display: isMobile ? (showChatList ? 'none' : 'flex') : 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
  position: 'relative',
  overflow: 'hidden', 
}));
const ConversationHeader = styled(Box)(({ theme }) => ({
  display: 'flex', 
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  height: '64px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#1f1f1f', 
  position: 'sticky',
  top: 0,
  zIndex: 100, 
  backdropFilter: 'blur(10px)',
  justifyContent: 'space-between', 
  width: '100%', 
  visibility: 'visible !important', 
  overflow: 'visible', 
}));
const UserStatus = styled(Typography)(({ isOnline, theme }) => ({
  fontSize: '0.8rem',
  color: isOnline ? '#44b700' : theme.palette.text.secondary,
  marginTop: 2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));
const MessagesContainer = styled(Box)(({ theme, keyboardActive }) => ({
  flexGrow: 1,
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column', 
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
  WebkitOverflowScrolling: 'touch', 
  height: 'calc(100% - 128px)', 
  scrollBehavior: 'smooth',
  position: 'relative',
  zIndex: 1,
  margin: 0,
  marginTop: 0,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  }
}));
const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOwn'
})(({ theme, isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  alignItems: 'flex-end',
  marginBottom: theme.spacing(0.5),
  '&.new-message': {
    animation: 'fadeIn 0.3s ease-in-out',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  width: '100%', 
}));
const MessageAvatar = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  alignSelf: 'flex-end',
}));
const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '75%',
  padding: theme.spacing(0.8, 1.2),
  borderRadius: '12px',
  backgroundColor: isOwn ? 
    'rgba(128, 90, 213, 0.15)' : 
    theme.palette.mode === 'dark' ? 'rgba(41, 41, 41, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  color: theme.palette.mode === 'dark' ? 
    (isOwn ? '#EDE7F6' : '#ffffff') : 
    '#000000',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  position: 'relative',
  wordBreak: 'break-word',  
  marginBottom: '2px',
  borderTopRightRadius: isOwn ? '4px' : '12px',
  borderTopLeftRadius: isOwn ? '12px' : '4px',
  '&:first-of-type': {
    marginTop: '4px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '85%',
  },
}));
const MessageText = styled(Typography)(({ theme, isOwn }) => ({
  fontSize: '0.95rem',
  whiteSpace: 'normal',      
  wordBreak: 'break-all',     
  wordWrap: 'break-word',      
  overflowWrap: 'break-word',  
  textOverflow: 'ellipsis',    
  hyphens: 'none',  
  marginRight: '45px',           
  lineHeight: 1.4,
  color: isOwn ? 
    theme.palette.mode === 'dark' ? '#EDE7F6' : '#1A1A1A' : 
    theme.palette.text.primary,
  display: 'block',            
  width: '100%',               
}));
const MessageTime = styled(Typography)(({ theme, isOwn }) => ({
  fontSize: '0.7rem',
  color: isOwn ? 
    theme.palette.mode === 'dark' ? 'rgba(237, 231, 246, 0.7)' : 'rgba(26, 26, 26, 0.6)' : 
    theme.palette.text.secondary,
  display: 'inline-block',
  marginLeft: '4px',
  lineHeight: 1,
  alignSelf: 'flex-end',
}));
const ReadMarks = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOwn' && prop !== 'isRead'
})(({ theme, isOwn, isRead }) => ({
  fontSize: '0.7rem',
  marginLeft: '2px',
  color: isRead 
    ? theme.palette.primary.main 
    : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
}));
const ImageAttachment = styled('img')({
  maxWidth: '100%',
  maxHeight: '300px',
  objectFit: 'contain',
  borderRadius: '8px',
});
const FileAttachmentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  cursor: 'pointer',
  marginTop: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
  },
}));
const ErrorMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(244, 67, 54, 0.1)',
  color: theme.palette.error.main,
  fontSize: '0.85rem',
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.error.main,
  }
}));
const InputContainer = styled(Box)(({ theme, keyboardActive }) => ({
  padding: theme.spacing(1.5), 
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5', 
  transition: 'all 0.2s ease-in-out',
  position: 'sticky',
  bottom: 0,
  zIndex: 5,
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark' ? '0 -1px 2px rgba(0,0,0,0.2)' : '0 -1px 2px rgba(0,0,0,0.05)',
}));
const NoChatsMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
}));
const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  try {
    const messageDate = typeof timestamp === 'string' 
      ? new Date(timestamp) 
      : new Date(parseInt(timestamp));
    if (isNaN(messageDate.getTime())) {
      console.error('Invalid date:', timestamp);
      return '';
    }
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'вчера';
    }
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return messageDate.toLocaleDateString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting message time:', error);
    return '';
  }
};
const MOCK_CHATS = [
  {
    id: 1,
    name: 'Анна Смирнова',
    avatar: '/static/uploads/avatars/anna_avatar.jpg',
    isOnline: true,
    lastMessage: 'Привет! Как дела?',
    lastMessageTime: '10:45',
    unread: 2
  },
  {
    id: 2,
    name: 'Иван Петров',
    avatar: '/static/uploads/avatars/ivan_avatar.jpg',
    isOnline: false,
    lastMessage: 'Спасибо за помощь с проектом!',
    lastMessageTime: 'Вчера',
    unread: 0
  },
  {
    id: 3,
    name: 'Мария Иванова',
    avatar: '/static/uploads/avatars/maria_avatar.jpg',
    isOnline: true,
    lastMessage: 'Пришлю материалы завтра',
    lastMessageTime: 'Вчера',
    unread: 0
  },
  {
    id: 4,
    name: 'Александр Николаев',
    avatar: '/static/uploads/avatars/alex_avatar.jpg',
    isOnline: false,
    lastMessage: 'Встречаемся в 15:00?',
    lastMessageTime: '20 апр',
    unread: 0
  },
];
const MOCK_MESSAGES = [
  { id: 1, senderId: 2, content: 'Привет! Как у тебя дела?', timestamp: '10:30', isRead: true },
  { id: 2, senderId: 1, content: 'Привет! Всё хорошо, спасибо. Работаю над проектом.', timestamp: '10:32', isRead: true },
  { id: 3, senderId: 2, content: 'Звучит интересно! Над чем именно работаешь?', timestamp: '10:33', isRead: true },
  { id: 4, senderId: 1, content: 'Разрабатываю новую функцию для нашей платформы. Это будет мессенджер с поддержкой фото и видео.', timestamp: '10:35', isRead: true },
  { id: 5, senderId: 2, content: 'Вот фото с прошлой недели:', timestamp: '10:40', isRead: true, media: { type: 'image', url: '/static/uploads/messenger/sample_image.jpg' } },
  { id: 6, senderId: 2, content: 'И небольшое видео:', timestamp: '10:41', isRead: true, media: { type: 'video', url: '/static/uploads/messenger/sample_video.mp4' } },
  { id: 7, senderId: 1, content: 'Выглядит здорово! Я добавлю эти материалы в презентацию. Спасибо!', timestamp: '10:43', isRead: true },
];
const formatLastSeen = (lastActiveTime) => {
  if (!lastActiveTime) return '';
  try {
    const lastActive = new Date(lastActiveTime);
    if (isNaN(lastActive.getTime())) return '';
    const now = new Date();
    const diffMinutes = Math.floor((now - lastActive) / (1000 * 60));
    if (diffMinutes < 1) return 'только что';
    if (diffMinutes < 60) return `был(а) ${diffMinutes} ${formatMinutes(diffMinutes)} назад`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `был(а) ${diffHours} ${formatHours(diffHours)} назад`;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastActive.toDateString() === yesterday.toDateString()) return 'был(а) вчера';
    return `был(а) ${lastActive.toLocaleDateString()}`;
  } catch (error) {
    console.error('Error formatting last seen:', error);
    return '';
  }
};
const formatMinutes = (minutes) => {
  if (minutes >= 11 && minutes <= 14) return 'минут';
  const lastDigit = minutes % 10;
  if (lastDigit === 1) return 'минуту';
  if (lastDigit >= 2 && lastDigit <= 4) return 'минуты';
  return 'минут';
};
const formatHours = (hours) => {
  if (hours >= 11 && hours <= 14) return 'часов';
  const lastDigit = hours % 10;
  if (lastDigit === 1) return 'час';
  if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
  return 'часов';
};
const MessageTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
    padding: '5px 2px', 
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
      boxShadow: theme.palette.mode === 'dark' ? '0 0 0 1px rgba(255, 255, 255, 0.1)' : '0 0 0 1px rgba(0, 0, 0, 0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 5px', 
    fontSize: '0.95rem',
  },
  '& .MuiInputAdornment-root': {
    marginRight: '2px',
  },
  '& .MuiIconButton-root': {
    padding: '8px',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    },
  },
  '& .MuiIconButton-root[color="primary"]': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
  },
}));
const MessengerPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  console.log("Component rendered with chatId:", chatId, "pathname:", location.pathname);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const touchStartY = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesStartRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showChatList, setShowChatList] = useState(!chatId || !isMobile);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [isLoadingMessages, setMessagesLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [activeChatId, setActiveChatId] = useState(chatId ? parseInt(chatId) : null);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0); 
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [isLoadingMutualConnections, setIsLoadingMutualConnections] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeoutRef] = useState({ current: null });
  const [recentChats, setRecentChats] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const loadingChatsRef = useRef({});
  const loadingTimersRef = useRef({});
  const componentMountedRef = useRef(true);
  const isMounted = useRef(true);
  const chatLoadingRef = useRef({});
  const lastRequestTimeRef = useRef({});
  const previousChatRef = useRef(null);
  const [sendingInProgress, setSendingInProgress] = useState(false);
  const markAsRead = useCallback((chatId) => {
    if (!chatId) return;
    console.log(`[MessengerPage] Marking chat ${chatId} as read`);
    MessengerService.markMessagesRead(chatId)
      .then(response => {
        if (response && response.success) {
          setChats(prevChats => 
            prevChats.map(chat => 
              chat && chat.id === chatId 
                ? { ...chat, unread_count: 0 } 
                : chat
            )
          );
          console.log(`[MessengerPage] Successfully marked chat ${chatId} as read`);
        } else {
          console.error(`[MessengerPage] Failed to mark chat ${chatId} as read:`, response?.error);
        }
      })
      .catch(error => {
        console.error(`[MessengerPage] Error marking chat ${chatId} as read:`, error);
      });
  }, []);
  const handleNewChatClick = () => {
    setIsNewChatDialogOpen(true);
    setSearchQuery('');
    setSearchResults([]);
    fetchMutualConnections();
  };
  const handleCloseNewChatDialog = () => {
    setIsNewChatDialogOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };
  const renderNewChatDialog = () => {
    return (
      <Dialog 
        open={isNewChatDialogOpen} 
        onClose={handleCloseNewChatDialog}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Transition}
      >
        <DialogTitle>Новый чат</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Поиск пользователей"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: searchLoading ? (
                  <CircularProgress size={24} />
                ) : null
              }}
            />
          </Box>
          {searchQuery.trim() ? (
            <List>
              {searchResults.length > 0 ? (
                searchResults.map(user => (
                  <ListItem key={user.id} disablePadding>
                    <ListItemButton onClick={() => handleStartChat(user.id)}>
                      <ListItemAvatar>
                        <UserAvatar user={user} size={40} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={user.name}
                        secondary={user.username ? `@${user.username}` : ''}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                  </Typography>
                </Box>
              )}
            </List>
          ) : (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Недавние чаты
              </Typography>
              {recentChats && recentChats.length > 0 ? (
                <List>
                  {recentChats.map(chat => (
                    <ListItem key={chat.id} disablePadding>
                      <ListItemButton onClick={() => {
                        handleChatClick(chat.id);
                        handleCloseNewChatDialog();
                      }}>
                        <ListItemAvatar>
                          <UserAvatar 
                            user={{
                              id: chat.user_id,
                              name: chat.name,
                              photo: chat.photo,
                              avatar_url: chat.user?.avatar_url || chat.avatar_url
                            }} 
                            size={40} 
                          />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={chat.name}
                          secondary={chat.last_message || 'Нет сообщений'}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Недавние чаты не найдены
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  };
  const handleStartChat = (userId) => {
    handleCloseNewChatDialog();
    setMessagesLoading(true);
    MessengerService.createOrGetChat(userId)
      .then(response => {
        if (response.success && response.chat) {
          setChats(prevChats => {
            const exists = prevChats.some(chat => chat.id === response.chat.id);
            if (!exists) {
              return [response.chat, ...prevChats];
            }
            return prevChats;
          });
          navigate(`/messenger/${response.chat.id}`);
        } else {
          console.error("Failed to create chat:", response.error);
        }
      })
      .catch(error => {
        console.error("Error creating chat:", error);
      })
      .finally(() => {
        setMessagesLoading(false);
      });
  };
  const fetchChats = async () => {
    if (isLoadingChats) return;
    setIsLoadingChats(true);
    try {
      const response = await MessengerService.getChats();
      if (response.success) {
        const processedChats = (response.chats || []).map(chat => {
          if (chat && typeof chat.last_message === 'object') {
            return {
              ...chat,
              last_message: safeRender(chat.last_message)
            };
          }
          return chat;
        });
        setChats(processedChats);
      } else {
        console.error("Error loading chats:", response.error);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoadingChats(false);
    }
  };
  const fetchMutualConnections = async () => {
    if (isLoadingMutualConnections) return;
    setIsLoadingMutualConnections(true);
    try {
      const response = await MessengerService.getMutualConnections();
      if (response.success) {
        setMutualConnections(response.connections || []);
      } else {
        console.error("Error loading mutual connections:", response.error);
      }
    } catch (error) {
      console.error("Error fetching mutual connections:", error);
    } finally {
      setIsLoadingMutualConnections(false);
    }
  };
  const renderChatHeader = () => {
    if (!activeChat) return null;
    const user = activeChat.user || {};
    const name = user.name || activeChat.name || "Chat";
    const photo = user.photo || "/static/img/avatar.png";
    return (
      <ChatHeader>
        <Box display="flex" alignItems="center">
          {isMobile && (
            <IconButton 
              onClick={() => setShowChatList(true)}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <UserAvatar 
            user={user}
            size={40}
            showOnlineStatus={true}
          />
          <Box ml={2}>
            <Typography variant="h6" component="div">
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton aria-label="more options" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleClearChat}>
              <ListItemIcon>
                <DeleteOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Очистить историю</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </ChatHeader>
    );
  };
  const renderUserOnlineStatus = (user) => {
    if (!user) return null;
    const isOnline = user.is_online;
    const lastActive = user.last_active ? new Date(user.last_active) : null;
    if (isOnline) {
      return (
        <Typography variant="caption" sx={{ color: 'success.main', ml: 1 }}>
          в сети
        </Typography>
      );
    } else if (lastActive) {
      return (
        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
          {formatLastSeen(lastActive)}
        </Typography>
      );
    }
    return null;
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClearChat = () => {
    handleMenuClose();
    if (window.confirm("Вы уверены, что хотите очистить историю чата?")) {
      MessengerService.clearChatHistory(activeChatId)
        .then(response => {
          if (response.success) {
            setMessages([]);
          } else {
            console.error("Error clearing chat history:", response.error);
          }
        })
        .catch(error => {
          console.error("Error clearing chat history:", error);
        });
    }
  };
  const renderChatItem = (chat) => {
    console.log("Rendering chat item:", chat);
    if (!chat || typeof chat !== 'object') return null;
    const isActive = activeChatId === chat.id;
    const unreadCount = chat.unread_count || 0;
    const lastMessage = typeof chat.last_message === 'object' 
      ? safeRender(chat.last_message) 
      : chat.last_message || "";
    const formattedTime = chat.last_message_timestamp 
      ? formatMessageTime(chat.last_message_timestamp)
      : "";
    const userData = {
      id: chat.user?.id || chat.user_id,
      name: chat.user?.name || chat.name || "User",
      photo: chat.user?.photo || chat.photo || "",
      avatar_url: chat.user?.avatar_url || chat.avatar_url,
      is_online: chat.user?.is_online || false,
      last_active: chat.user?.last_active || null
    };
    return (
      <ChatListItem 
        key={chat.id} 
        isActive={isActive}
        onClick={() => handleChatClick(chat.id)}
      >
        <UserAvatar 
          user={userData} 
          size={40} 
          showOnlineStatus={true} 
        />
        <ChatInfoContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography noWrap sx={{ fontWeight: unreadCount > 0 ? 'bold' : 'normal' }}>
            </Typography>
            <TimeText>
              {formattedTime}
            </TimeText>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LastMessageText color="text.secondary" sx={{ fontWeight: unreadCount > 0 ? 'bold' : 'normal' }}>
            </LastMessageText>
            <UnreadBadgeContainer>
              {unreadCount > 0 && (
                <UnreadBadge badgeContent={unreadCount} />
              )}
            </UnreadBadgeContainer>
          </Box>
        </ChatInfoContainer>
      </ChatListItem>
    );
  };
  const handleChatClick = (chatId) => {
    const numericChatId = parseInt(chatId, 10);
    console.log("Выбран чат:", numericChatId);
    setActiveChatId(numericChatId);
    if (isMobile) {
      setShowChatList(false);
    }
    navigate(`/messenger/${numericChatId}`);
  };
  const renderMessage = (message, index) => {
    console.log("Rendering message:", message);
    if (!message) {
      console.error("Attempt to render null/undefined message");
      return null;
    }
    const messageKey = message.id ? `msg-${message.id}` : `msg-index-${index}`;
    const defaultUserId = currentUser?.id || -1;
    const isOwn = message.user_id !== undefined && currentUser?.id !== undefined 
      ? message.user_id === currentUser.id
      : false;
    const messageDate = message.created_at ? new Date(message.created_at) : null;
    const formattedTime = messageDate ? 
      messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
      message.timestamp || '';
    const hasAttachment = message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0;
    const messageClass = message.isNew 
      ? 'new-message' 
      : 'message';
    let messageContent = '';
    if (message.content) {
      if (typeof message.content === 'object') {
        if (message.content.text) {
          messageContent = message.content.text;
        } else if (message.content.message) {
          messageContent = message.content.message;
        } else if (message.content.content) {
          messageContent = message.content.content;
        } else {
          messageContent = JSON.stringify(message.content);
          console.warn("Message content is an object without recognized text field:", message.content);
        }
      } else {
        messageContent = message.content;
      }
    }
    const formattedContent = messageContent;
    if (message.isNew) {
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg && msg.id === message.id 
              ? { ...msg, isNew: false } 
              : msg
          )
        );
      }, 1000);
    }
    return (
      <MessageContainer 
        key={messageKey}
        isOwn={isOwn}
        className={messageClass}
      >
        
        <MessageBubble isOwn={isOwn}>
          {messageContent && (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <Box sx={{ flexGrow: 1, maxWidth: '100%' }}>
                <MessageText isOwn={isOwn}>
                  <Box sx={{ wordBreak: 'break-word' }}>
                    <ReactMarkdown transformLinkUri={null}>{formattedContent}</ReactMarkdown>
                  </Box>
                </MessageText>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, ml: 'auto',  position: 'absolute',right: '10px',bottom: '5px' }}>
                <MessageTime isOwn={isOwn}>{formattedTime}</MessageTime>
                {isOwn && (
                  <ReadMarks isOwn={isOwn} isRead={message.is_read}>
                  </ReadMarks>
                )}
              </Box>
            </Box>
          )}
          {hasAttachment && message.attachments.map((attachment, idx) => {
            console.log("Rendering attachment:", attachment);
            if (attachment.type === 'image') {
              return (
                <Box key={`att-${idx}`} sx={{ mt: messageContent ? 1 : 0.5, mb: 0.5 }}>
                  <ImageAttachment 
                    src={attachment.url} 
                    alt="Изображение" 
                    loading="lazy"
                    onClick={() => handleImagePreviewOpen(attachment.url)}
                    onError={(e) => {
                      console.error(`Error loading image ${attachment.url}`, e);
                      e.target.src = '/static/img/broken-image.png';
                    }}
                  />
                </Box>
              );
            } else if (attachment.type === 'video') {
              return (
                <Box key={`att-${idx}`} sx={{ mt: messageContent ? 1 : 0.5, mb: 0.5 }}>
                  <video 
                    controls
                    style={{ maxWidth: '100%', borderRadius: '4px' }}
                    src={attachment.url}
                  >
                    Ваш браузер не поддерживает видео
                  </video>
                </Box>
              );
            } else if (attachment.type === 'audio') {
              return (
                <Box key={`att-${idx}`} sx={{ mt: messageContent ? 1 : 0.5, mb: 0.5 }}>
                  <audio 
                    controls
                    style={{ width: '100%' }}
                    src={attachment.url}
                  >
                    Ваш браузер не поддерживает аудио
                  </audio>
                </Box>
              );
            } else {
              return (
                <FileAttachmentContainer 
                  key={`att-${idx}`} 
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <InsertDriveFileIcon sx={{ mr: 1 }} />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="body2" noWrap>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {attachment.size ? `${Math.round(attachment.size / 1024)} КБ` : ''}
                    </Typography>
                  </Box>
                </FileAttachmentContainer>
              );
            }
          })}
          
          {!messageContent && hasAttachment && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
              <MessageTime isOwn={isOwn}>{formattedTime}</MessageTime>
              {isOwn && (
                <ReadMarks isOwn={isOwn} isRead={message.is_read}>
                </ReadMarks>
              )}
            </Box>
          )}
        </MessageBubble>
      </MessageContainer>
    );
  };
  const handleImagePreviewOpen = (url) => {
    console.log("Open image preview for:", url);
  };
  const handleFocus = () => {
    setTimeout(() => {
      scrollToBottom('smooth');
    }, 300);
  };
  const handleBlur = () => {
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleEmojiButtonClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };
  const handleCloseEmojiPicker = () => {
    setEmojiAnchorEl(null);
  };
  const handleEmojiClick = (emojiData, event) => {
    setMessageText(prev => prev + emojiData.emoji);
  };
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    console.log("Selected files:", files);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`Файл ${file.name} слишком большой (макс. 10МБ)`);
        return false;
      }
      const validTypes = ['image/', 'video/', 'audio/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      if (!isValidType) {
        setErrorMessage(`Тип файла ${file.type} не поддерживается`);
        return false;
      }
      return true;
    });
    const filesWithPreviews = validFiles.map(file => {
      const preview = file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : null;
      return {
        ...file,
        rawFile: file, 
        preview,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 'file',
        name: file.name,
        size: file.size,
        url: preview
      };
    });
    setAttachments(prev => [...prev, ...filesWithPreviews]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log("Added attachments:", filesWithPreviews);
  };
  const handleRemoveFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  const handleSendMessage = async () => {
    const hasText = messageText && messageText.trim() !== '';
    const hasAttachments = attachments.length > 0;
    if (!hasText && !hasAttachments) {
      return;
    }
    if (!activeChatId) {
      console.error('No active chat selected');
      setErrorMessage('Выберите чат для отправки сообщения');
      return;
    }
    if (sendingInProgress) {
      console.warn('Отправка сообщения уже в процессе');
      return;
    }
    setSendingInProgress(true);
    const messageCopy = messageText;
    setMessageText('');
    const filesCopy = [...attachments];
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    try {
      console.log(`Отправка сообщения в чат ${activeChatId}:`, messageCopy, filesCopy);
      const messageText = hasText ? messageCopy : (hasAttachments ? "📎 Вложение" : "");
      console.log(`Отправляем сообщение с текстом: "${messageText}"`);
      const messageResult = await MessengerService.sendMessage(activeChatId, messageText, []);
      if (!messageResult.success) {
        console.error('Ошибка при отправке сообщения:', messageResult.error);
        setErrorMessage(`Ошибка отправки: ${messageResult.error || 'Неизвестная ошибка'}`);
        setTimeout(() => setErrorMessage(''), 5000);
        setSendingInProgress(false);
        return;
      }
      const messageId = messageResult.message?.id;
      console.log(`Сообщение успешно создано с ID: ${messageId}`);
      if (hasAttachments && messageId) {
        setErrorMessage('Загрузка файлов...');
        const uploadedAttachmentIds = [];
        for (const file of filesCopy) {
          try {
            const formData = new FormData();
            const fileToUpload = file instanceof File ? file : (file.rawFile || file);
            if (!(fileToUpload instanceof File) && !(fileToUpload instanceof Blob)) {
              console.error("Ошибка: объект не является файлом:", fileToUpload);
              setErrorMessage(`Ошибка: ${file.name || 'Файл'} не является допустимым объектом File`);
              continue;
            }
            console.log("Создаем FormData с файлом:", fileToUpload);
            formData.append('file', fileToUpload);
            formData.append('message_id', messageId.toString());
            formData.append('chat_id', activeChatId.toString());
            const nocacheParam = Date.now().toString();
            const uploadResponse = await MessengerService.uploadAttachment(formData, activeChatId, nocacheParam);
            console.log("Результат загрузки:", uploadResponse);
            if (uploadResponse.success && uploadResponse.attachment && uploadResponse.attachment.id) {
              uploadedAttachmentIds.push(uploadResponse.attachment.id);
              console.log(`Вложение успешно загружено с ID: ${uploadResponse.attachment.id}`);
            } else {
              console.error("Ошибка загрузки:", uploadResponse.error || "Неизвестная ошибка");
              setErrorMessage(`Ошибка загрузки файла ${file.name}: ${uploadResponse.error || "Неизвестная ошибка"}`);
            }
          } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            setErrorMessage(`Ошибка загрузки файла ${file.name}: ${error.message || "Неизвестная ошибка"}`);
          }
        }
        setErrorMessage('');
        if (uploadedAttachmentIds.length > 0) {
          console.log(`Обновляем сообщение ${messageId} с вложениями:`, uploadedAttachmentIds);
          try {
            const updateResult = await MessengerService.updateMessageWithAttachments(
              activeChatId,
              messageId,
              uploadedAttachmentIds
            );
            if (updateResult.success) {
              console.log('Сообщение успешно обновлено с вложениями');
            } else {
              console.error('Ошибка при обновлении сообщения с вложениями:', updateResult.error);
              setErrorMessage(`Не удалось обновить сообщение с вложениями: ${updateResult.error}`);
              setTimeout(() => setErrorMessage(''), 5000);
            }
          } catch (error) {
            console.error('Ошибка при обновлении сообщения:', error);
            setErrorMessage(`Ошибка при обновлении сообщения: ${error.message || 'Неизвестная ошибка'}`);
            setTimeout(() => setErrorMessage(''), 5000);
          }
        } else if (filesCopy.length > 0) {
          console.warn('Ни одно вложение не было успешно загружено');
          setErrorMessage('Не удалось загрузить вложения');
          setTimeout(() => setErrorMessage(''), 5000);
        }
      }
      console.log('Сообщение успешно отправлено, ожидаем ответ от сервера через вебсокет');
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);
    } catch (error) {
      console.error('Ошибка в handleSendMessage:', error);
      setErrorMessage(`Ошибка отправки: ${error.message || 'Неизвестная ошибка'}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSendingInProgress(false);
    }
  };
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (!touchStartY.current) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartY.current - touchY;
    if (diff > 5 && messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 10) {
        e.preventDefault();
      }
    }
  };
  const onTouchEnd = () => {
    touchStartY.current = null;
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      if (value.text) {
        return value.text;
      } else if (value.message) {
        return value.message;
      } else if (value.content) {
        return value.content;
      } else {
        return JSON.stringify(value);
      }
    }
    return value;
  };
  const scrollToBottom = useCallback((behavior = 'auto') => {
    try {
      const scrollContainer = messagesContainerRef?.current;
      if (scrollContainer && typeof scrollContainer.scrollHeight === 'number') {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
      }
    } catch (error) {
      console.error("Error scrolling to bottom:", error);
    }
  }, []);
    const fetchCurrentUser = async () => {
    console.log("Fetching current user data...");
    try {
      const response = await MessengerService.getCurrentUser();
      if (response.success && response.user) {
        console.log("Current user data loaded:", response.user);
        setCurrentUser(response.user);
      } else {
        console.error("Error loading current user:", response.error);
        }
      } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };
  useEffect(() => {
    fetchCurrentUser();
  }, []);
  useEffect(() => {
    const originalSendMessage = MessengerService.sendMessage;
    const originalGetMessages = MessengerService.getMessages;
    const originalJoinChatRoom = MessengerService.joinChatRoom;
    MessengerService.sendMessage = async (chatId, content, attachments) => {
      try {
        const response = await originalSendMessage.call(MessengerService, chatId, content, attachments);
        return response;
      } catch (error) {
        throw error;
      }
    };
    MessengerService.getMessages = async (chatId, page) => {
      try {
        const response = await originalGetMessages.call(MessengerService, chatId, page);
        return response;
      } catch (error) {
        throw error;
      }
    };
    MessengerService.joinChatRoom = async (chatId) => {
      try {
        const response = await originalJoinChatRoom.call(MessengerService, chatId);
        return response;
      } catch (error) {
        throw error;
      }
    };
    const originalOn = MessengerService.on;
    MessengerService.on = (event, callback) => {
      return originalOn.call(MessengerService, event, callback);
    };
    const originalInitSocket = MessengerService.initSocket;
    MessengerService.initSocket = async () => {
      try {
        const response = await originalInitSocket.call(MessengerService);
        return response;
      } catch (error) {
        throw error;
      }
    };
    return () => {
      MessengerService.sendMessage = originalSendMessage;
      MessengerService.getMessages = originalGetMessages;
      MessengerService.joinChatRoom = originalJoinChatRoom;
      MessengerService.on = originalOn;
      MessengerService.initSocket = originalInitSocket;
    };
  }, []);
  useEffect(() => {
    let mounted = true;
    const componentMountedRef = {current: true}; 
    const chatLoadingRef = {current: null}; 
    const previousChatRef = {current: null}; 
    const handleNewMessageWithSafety = (message) => {
      if (!componentMountedRef.current) return;
      try {
        handleNewMessage(message);
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    };
    const handleNewMessageNotificationWithSafety = (notification) => {
      if (!componentMountedRef.current) return;
      try {
        handleNewMessageNotification(notification);
      } catch (error) {
        console.error("Error in notification handler:", error);
      }
    };
    const handleUserStatusChangedWithSafety = (statusData) => {
      if (!componentMountedRef.current) return;
      try {
        console.log("Получен статус пользователя:", statusData);
        handleUserStatusChanged(statusData);
      } catch (error) {
        console.error("Error in user status handler:", error);
      }
    };
    const handleContactsStatusWithSafety = (statusData) => {
      if (!componentMountedRef.current) return;
      try {
        console.log("Получены статусы контактов:", statusData);
        handleContactsStatus(statusData);
      } catch (error) {
        console.error("Error in contacts status handler:", error);
      }
    };
    const handleSocketError = (error) => {
      if (!componentMountedRef.current) return;
      console.error("Socket error:", error);
    };
    const initializeMessenger = async () => {
      try {
        console.log("👋 Initializing messenger service");
        await MessengerService.initSocket({ forceNew: true });
        MessengerService.on('new_message', handleNewMessageWithSafety);
        MessengerService.on('new_message_notification', handleNewMessageNotificationWithSafety);
        MessengerService.on('user_status_changed', handleUserStatusChangedWithSafety);
        MessengerService.on('contacts_status', handleContactsStatusWithSafety);
        MessengerService.on('error', handleSocketError);
        MessengerService.on('connect', () => console.log("Socket connected successfully!"));
        MessengerService.on('disconnect', (reason) => console.log("Socket disconnected:", reason));
        MessengerService.on('messenger_connected', (data) => console.log("Messenger connected successfully:", data));
        fetchChats();
        console.log('✅ Messenger initialized successfully with universal connection');
      } catch (error) {
        console.error('Error initializing messenger:', error);
      }
    };
    initializeMessenger();
    return () => {
      mounted = false;
      componentMountedRef.current = false;
      MessengerService.off('new_message', handleNewMessageWithSafety);
      MessengerService.off('new_message_notification', handleNewMessageNotificationWithSafety);
      MessengerService.off('user_status_changed', handleUserStatusChangedWithSafety);
      MessengerService.off('contacts_status', handleContactsStatusWithSafety);
      MessengerService.off('error', handleSocketError);
      MessengerService.off('connect', () => {});
      MessengerService.off('disconnect', () => {});
      MessengerService.off('messenger_connected', () => {});
    };
  }, []);
  const handleNewMessage = useCallback((message) => {
    console.log("Получено новое сообщение из сокета:", message);
    if (!message || typeof message !== 'object') {
      console.error("Получено некорректное сообщение:", message);
      return;
    }
    try {
      const normalizedMessage = {
        id: message.id,
        chat_id: typeof message.chat_id === 'string' ? parseInt(message.chat_id, 10) : message.chat_id,
        user_id: message.user_id,
        content: message.content || '',
        created_at: message.created_at || new Date().toISOString(),
        updated_at: message.updated_at || message.created_at || new Date().toISOString(),
        sender_name: message.sender_name || 'Пользователь',
        sender_photo: message.sender_photo || '',
        is_read: Boolean(message.is_read),
        has_attachment: Boolean(message.has_attachment),
        attachments: Array.isArray(message.attachments) ? message.attachments : [],
        is_optimistic: false,
        is_direct_message: Boolean(message.is_direct_message) 
      };
      console.log("Преобразованное сообщение:", normalizedMessage);
      if (!normalizedMessage || !normalizedMessage.chat_id) {
        console.error("Не удалось нормализовать сообщение:", message);
        return;
      }
      const normalizedChatId = typeof normalizedMessage.chat_id === 'string' 
        ? parseInt(normalizedMessage.chat_id, 10) 
        : normalizedMessage.chat_id;
      const currentChatId = typeof activeChatId === 'string' 
        ? parseInt(activeChatId, 10) 
        : activeChatId;
      console.log(`[handleNewMessage] Сообщение из чата ${normalizedChatId}, текущий активный чат ${currentChatId}, типы: ${typeof normalizedChatId}, ${typeof currentChatId}`);
      const isOwnMessage = currentUser && normalizedMessage.user_id === currentUser.id;
      if (normalizedChatId === currentChatId) {
        console.log(`[handleNewMessage] Сообщение для текущего активного чата ${currentChatId}, добавляем в UI`);
        normalizedMessage.isNew = true;
        if (!isOwnMessage) {
          MessengerService.markMessagesRead(currentChatId)
            .catch(err => console.error("Ошибка при отметке сообщений как прочитанных:", err));
        }
        setMessages(prevMessages => {
          const safeMessages = Array.isArray(prevMessages) ? prevMessages : [];
          const isDuplicate = safeMessages.some(m => 
            m && (
              m.id === normalizedMessage.id || 
              (isOwnMessage && m.content === normalizedMessage.content && 
               Math.abs(new Date(m.created_at || 0) - new Date(normalizedMessage.created_at || 0)) < 5000)
            )
          );
          if (isDuplicate) {
            console.log(`[handleNewMessage] Дубликат сообщения id=${normalizedMessage.id}, пропускаем`);
            return safeMessages;
          }
          console.log(`[handleNewMessage] Добавляем новое сообщение id=${normalizedMessage.id} в UI`);
          const updatedMessages = [...safeMessages, normalizedMessage].sort((a, b) => {
            if (!a || !b) return 0;
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateA - dateB; 
          });
          setTimeout(() => scrollToBottom('smooth'), 100);
          return updatedMessages;
        });
      } else {
        console.log(`[handleNewMessage] Сообщение для другого чата ${normalizedChatId}, текущий чат ${currentChatId}`);
      }
      console.log(`[handleNewMessage] Обновляем список чатов для сообщения из чата ${normalizedMessage.chat_id}`);
      setChats(prevChats => {
        const safeChats = Array.isArray(prevChats) ? prevChats : [];
        const chatIndex = safeChats.findIndex(c => c && c.id === normalizedMessage.chat_id);
        if (chatIndex === -1) {
          console.log(`[handleNewMessage] Чат ${normalizedMessage.chat_id} не найден в списке, загружаем список чатов`);
          setTimeout(() => fetchChats(), 300);
          return safeChats;
        }
        const updatedChats = [...safeChats];
        const updatedChat = {...updatedChats[chatIndex]};
        const contentPreview = typeof normalizedMessage.content === 'string' 
          ? normalizedMessage.content.substring(0, 50) + (normalizedMessage.content.length > 50 ? '...' : '')
          : (normalizedMessage.has_attachment ? 'Вложение' : '');
        updatedChat.last_message = contentPreview;
        updatedChat.last_message_timestamp = normalizedMessage.created_at;
        if (normalizedMessage.chat_id !== currentChatId && !isOwnMessage) {
          updatedChat.unread_count = (updatedChat.unread_count || 0) + 1;
        }
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(updatedChat);
        return updatedChats;
      });
    } catch (error) {
      console.error("Ошибка при обработке нового сообщения:", error);
    }
  }, [activeChatId, currentUser, scrollToBottom, fetchChats]); 
  const handleNewMessageNotification = useCallback((notification) => {
    const contentPreview = typeof notification.content_preview === 'object'
      ? safeRender(notification.content_preview)
      : notification.content_preview || '';
    setChats(prevChats => {
      const updatedChats = [...prevChats];
      const chatIndex = updatedChats.findIndex(chat => chat.id === notification.chat_id);
      if (chatIndex !== -1) {
        const updatedChat = {...updatedChats[chatIndex]};
        updatedChat.last_message = contentPreview;
        updatedChat.last_message_timestamp = notification.timestamp;
        updatedChat.unread_count = (updatedChat.unread_count || 0) + 1;
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(updatedChat);
      }
      return updatedChats;
    });
  }, [safeRender]);
  useEffect(() => {
    fetchChats();
    fetchMutualConnections();
  }, []);
  useEffect(() => {
    console.log("URL chatId changed:", chatId);
    if (chatId) {
      const numericChatId = parseInt(chatId, 10);
      setActiveChatId(numericChatId);
      setShowChatList(!isMobile);
    } else {
      setActiveChatId(null);
      setShowChatList(true);
    }
  }, [chatId, isMobile]);
  useEffect(() => {
    let isCancelled = false;
    const loadChat = async () => {
      if (!activeChatId) {
        setMessages([]);
        setMessagesLoading(false);
        return;
      }
      if (chatLoadingRef.current === activeChatId) {
        console.log(`[loadActiveChat] Already loading chat ${activeChatId}, skipping duplicate request`);
        return;
      }
      try {
        console.log(`[loadActiveChat] Loading chat ${activeChatId}`);
        chatLoadingRef.current = activeChatId;
        setMessagesLoading(true);
        previousChatRef.current = activeChatId;
        console.log(`[loadActiveChat] Using existing socket connection for chat ${activeChatId}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        if (isCancelled) return;
        console.log(`[loadActiveChat] Fetching messages for chat ${activeChatId}`);
        const response = await MessengerService.getMessages(activeChatId, 1);
        console.log('[loadActiveChat] Messages response:', response);
        if (isCancelled) return;
        if (response && response.success) {
          if (response.messages && Array.isArray(response.messages)) {
            console.log(`Loaded ${response.messages.length} messages`);
            if (response.total_messages) {
              setTotalMessages(response.total_messages);
            }
            setMessages(response.messages);
            if (response.chat) {
              let userData = null;
              if (response.chat.members && Array.isArray(response.chat.members)) {
                const otherMember = response.chat.members.find(m => 
                  m.user_id !== (currentUser ? currentUser.id : null)
                );
                if (otherMember) {
                  userData = otherMember.user;
                }
              } else if (response.chat.user) {
                userData = response.chat.user;
              }
              setActiveChat({
                ...response.chat,
                user: userData || response.chat.user || null
              });
            }
            if (response.chat) {
              console.log("Данные чата:", response.chat);
              setChats(prevChats => {
                const updatedChats = [...prevChats];
                const chatIndex = updatedChats.findIndex(c => c.id === activeChatId);
                if (chatIndex !== -1) {
                  updatedChats[chatIndex] = {
                    ...updatedChats[chatIndex],
                    ...response.chat,
                  };
                }
                return updatedChats;
              });
            }
            MessengerService.markMessagesRead(activeChatId).catch(err => {
              console.error("Error marking messages read:", err);
            });
            scrollToBottom('auto');
          } else {
            console.error("Получен некорректный формат сообщений:", response.messages);
            setMessages([]);
          }
        } else {
          console.error('[loadActiveChat] Error response:', response);
          setMessages([]);
          setError(response?.error || 'Failed to load messages');
        }
      } catch (error) {
        if (isCancelled) return;
        console.error(`[loadActiveChat] Error loading chat ${activeChatId}:`, error);
        setError(error.message || 'Failed to load messages');
        setMessages([]);
      } finally {
        if (!isCancelled) {
          setMessagesLoading(false);
          chatLoadingRef.current = null;
        }
      }
    };
    loadChat();
    return () => {
      isCancelled = true;
    };
  }, [activeChatId, currentUser, scrollToBottom]);
  useEffect(() => {
    return () => {
      console.log("[MessengerPage] COMPONENT UNMOUNTING - Cleaning up all socket connections");
      if (activeChatId) {
        MessengerService.leaveChatRoom(activeChatId);
      }
    };
  }, []);
  const transformMessage = useCallback((message, chatId = activeChatId) => {
    if (!message || typeof message !== 'object') {
      console.error("Cannot transform invalid message:", message);
      return null;
    }
    console.log("Transforming message format:", message);
    const normalizedMessage = MessengerService.normalizeMessage(message, chatId);
    console.log("Transformed message:", normalizedMessage);
    return normalizedMessage;
  }, [activeChatId]);
  const addMessageToChat = useCallback((rawMessage) => {
    if (!activeChatId) {
      console.error("Cannot add message - no active chat");
      return;
    }
    const message = transformMessage(rawMessage);
    if (!message) {
      console.error("Failed to transform message");
      return;
    }
    setMessages(prev => {
      const exists = prev.some(m => m && m.id === message.id);
      if (exists) return prev;
      return [...prev, message].sort((a, b) => {
        if (!a || !b) return 0;
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateA - dateB; 
      });
    });
    setTimeout(() => scrollToBottom('smooth'), 100);
    return message;
  }, [activeChatId, transformMessage, scrollToBottom]);
  const getAvatarUrl = (userId, photoOrObject) => {
    if (photoOrObject && typeof photoOrObject === 'object') {
      if (photoOrObject.avatar_url) {
        return photoOrObject.avatar_url;
      }
      photoOrObject = photoOrObject.photo;
    }
    const photoName = photoOrObject;
    if (!photoName) return '/static/img/avatar.png';
    if (photoName.startsWith('http')) return photoName;
    if (photoName.startsWith('/')) return photoName;
    return `/static/uploads/avatar/${userId}/${photoName}`;
  };
  const searchUsers = async (query) => {
    setSearchLoading(true);
    try {
      console.log("Searching for users with query:", query);
      const result = await MessengerService.searchUsers(query);
      if (result.success) {
        setSearchResults(result.users || []);
        console.log("Search results:", result.users);
      } else {
        console.error("Error searching users:", result.error);
        setErrorMessage(`Ошибка поиска: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error("Error in searchUsers:", error);
      setErrorMessage(`Ошибка поиска: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setSearchLoading(false);
    }
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (value.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(value);
      }, 500); 
    } else {
      setSearchResults([]);
    }
  };
  const notifyLayoutChange = (isInChat) => {
    if (typeof window !== 'undefined') {
      const mainHeader = document.querySelector('header.MuiAppBar-root');
      if (mainHeader) {
        mainHeader.style.display = 'none';
      }
      const shouldHideBottomNav = isMobile && activeChatId && !showChatList;
      const bottomNav = document.getElementById('app-bottom-navigation');
      if (bottomNav) {
        console.log(`${shouldHideBottomNav ? 'Скрываем' : 'Показываем'} нижнюю навигацию, активный чат: ${activeChatId}, showChatList: ${showChatList}`);
        if (shouldHideBottomNav) {
          bottomNav.style.display = 'none';
          bottomNav.style.visibility = 'hidden';
          bottomNav.style.opacity = '0';
          bottomNav.style.pointerEvents = 'none';
          bottomNav.style.position = 'absolute';
          bottomNav.style.zIndex = '-1';
        } else {
          bottomNav.style.display = '';
          bottomNav.style.visibility = '';
          bottomNav.style.opacity = '';
          bottomNav.style.pointerEvents = '';
          bottomNav.style.position = '';
          bottomNav.style.zIndex = '';
        }
      } else {
        console.error("Bottom navigation element not found by ID!");
      }
      const event = new CustomEvent('messenger-layout-change', { 
        detail: { isInChat: shouldHideBottomNav, timestamp: Date.now() } 
      });
      document.dispatchEvent(event);
      return () => {
        if (mainHeader) {
          mainHeader.style.display = '';
        }
        if (bottomNav) {
          bottomNav.style.display = '';
          bottomNav.style.visibility = '';
          bottomNav.style.opacity = '';
          bottomNav.style.pointerEvents = '';
          bottomNav.style.position = '';
          bottomNav.style.zIndex = '';
        }
      };
    }
  };
  useEffect(() => {
    if (isMobile) {
      const header = document.querySelector('header.MuiAppBar-root');
      if (header) {
        header.style.display = 'none';
      }
      const isInChat = !showChatList && activeChat;
      notifyLayoutChange(isInChat);
      return () => {
        notifyLayoutChange(false);
        if (header) {
          header.style.display = '';
        }
      };
    }
  }, [isMobile, showChatList, activeChat]);
  const swipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
      if (isMobile && !showChatList && eventData.initial[0] < 50) {
        setShowChatList(true);
      }
    },
    trackMouse: false,
    delta: 10, 
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    swipeDuration: 500, 
    touchEventOptions: { passive: false }
  });
  useEffect(() => {
    if (activeChatId) {
      setTimeout(() => {
        const headerElement = document.getElementById('chat-conversation-header');
        if (headerElement) {
          console.log("Header element found:", headerElement);
          console.log("Header style:", window.getComputedStyle(headerElement));
          headerElement.style.display = 'flex';
          headerElement.style.visibility = 'visible';
          headerElement.style.zIndex = '999';
          headerElement.style.position = 'sticky';
          headerElement.style.top = '0';
          headerElement.style.backgroundColor = '#1f1f1f';
          headerElement.style.borderBottom = '1px solid #333';
          headerElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        } else {
          console.error("Header element not found in DOM!");
        }
      }, 500);
    }
  }, [activeChatId]);
  useEffect(() => {
    console.log("[DEBUG] activeChat изменился:", activeChat);
    if (activeChat && document.getElementById('chat-conversation-header') === null) {
      console.log("[DEBUG] Хедер не найден после обновления activeChat, принудительно перерисовываем");
      setTimeout(() => {
        const headerElement = document.getElementById('chat-conversation-header');
        console.log("[DEBUG] Хедер после задержки:", headerElement);
        if (headerElement) {
          const styles = window.getComputedStyle(headerElement);
          console.log("[DEBUG] Стили хедера:", {
            display: styles.display,
            visibility: styles.visibility,
            zIndex: styles.zIndex,
            position: styles.position
          });
        }
      }, 100);
    }
  }, [activeChat]);
  useEffect(() => {
    if (isMobile && activeChatId) {
      notifyLayoutChange();
    }
  }, [showChatList, activeChatId, isMobile]);
  useEffect(() => {
    if (!isLoadingMessages && messages.length > 0) {
      scrollToBottom('auto');
    }
  }, [isLoadingMessages, messages.length, scrollToBottom]);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const handleMessagesScroll = useCallback((e) => {
    const container = e.target;
    if (container.scrollTop < 100 && !isLoadingMoreMessages && hasMoreMessages && activeChatId) {
      const scrollPosition = container.scrollHeight - container.scrollTop;
      setIsLoadingMoreMessages(true);
      const nextPage = page + 1;
      console.log(`Загрузка предыдущих сообщений, страница ${nextPage}`);
      MessengerService.getMessages(activeChatId, nextPage)
        .then(response => {
          if (response.success) {
            if (Array.isArray(response.messages) && response.messages.length > 0) {
              setMessages(prevMessages => {
                const allMessages = [...response.messages, ...prevMessages];
                const uniqueMessages = allMessages.filter((message, index, self) => 
                  message && message.id && 
                  index === self.findIndex(m => m && m.id === message.id)
                );
                return uniqueMessages.sort((a, b) => {
                  if (!a || !b) return 0;
                  const dateA = new Date(a.created_at || 0);
                  const dateB = new Date(b.created_at || 0);
                  return dateA - dateB; 
                });
              });
              setPage(nextPage);
              setHasMoreMessages(response.has_next);
              setTimeout(() => {
                if (messagesContainerRef.current) {
                  const newScrollTop = messagesContainerRef.current.scrollHeight - scrollPosition;
                  messagesContainerRef.current.scrollTop = newScrollTop > 0 ? newScrollTop : 0;
                }
              }, 100);
            } else {
              setHasMoreMessages(false);
            }
          } else {
            console.error("Ошибка при загрузке предыдущих сообщений:", response.error);
          }
        })
        .catch(error => {
          console.error("Ошибка при загрузке предыдущих сообщений:", error);
        })
        .finally(() => {
          setIsLoadingMoreMessages(false);
        });
    }
  }, [activeChatId, isLoadingMoreMessages, hasMoreMessages, page, setHasMoreMessages, setMessages, setPage]);
  const avatarUrlCache = {};
  const getCachedAvatarUrl = (userId, user) => {
    const cacheKey = `${userId}-${user?.avatar_url || ''}-${user?.photo || ''}`;
    if (avatarUrlCache[cacheKey]) {
      return avatarUrlCache[cacheKey];
    }
    try {
      const url = getAvatarUrl(userId, user);
      avatarUrlCache[cacheKey] = url;
      return url;
    } catch (err) {
      avatarUrlCache[cacheKey] = '/static/img/avatar.png';
      return avatarUrlCache[cacheKey];
    }
  };
  const StaticAvatar = React.memo(({ user, size = 40, showOnlineStatus = false, isOnline = false }) => {
    const userId = user?.id;
    const name = user?.name || "User";
    const firstLetter = name.charAt(0).toUpperCase();
    const avatarUrl = userId ? getCachedAvatarUrl(userId, user) : null;
    const imgStyle = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      objectFit: 'cover',
      backgroundColor: !avatarUrl ? '#1976d2' : 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: `${size/2}px`,
      border: '1px solid rgba(255,255,255,0.1)',
    };
    const containerStyle = showOnlineStatus ? {
      position: 'relative',
      display: 'inline-block',
    } : {};
    const dotStyle = showOnlineStatus ? {
      position: 'absolute',
      bottom: '3px',
      right: '3px',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: isOnline ? '#4caf50' : '#bdbdbd',
      border: '2px solid #121212',
      display: isOnline ? 'block' : 'none',
    } : {};
    if (avatarUrl) {
      return (
        <div style={containerStyle}>
          <img 
            src={avatarUrl} 
            alt={name}
            style={imgStyle}
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
          />
          {showOnlineStatus && <div style={dotStyle}></div>}
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <div style={imgStyle}>
        </div>
        {showOnlineStatus && <div style={dotStyle}></div>}
      </div>
    );
  }, (prevProps, nextProps) => {
    return prevProps.user?.id === nextProps.user?.id;
  });
  const UserAvatar = React.memo(({ user, size = 40, showOnlineStatus = false, isOnline = false }) => {
    return (
      <StaticAvatar 
        user={user}
        size={size}
        showOnlineStatus={showOnlineStatus}
        isOnline={isOnline}
      />
    );
  }, (prevProps, nextProps) => {
    return prevProps.user?.id === nextProps.user?.id;
  });
  useEffect(() => {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(metaViewport);
    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);
  const handleUserStatusChanged = useCallback((statusData) => {
    if (!statusData || !statusData.user_id) return;
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.user && chat.user.id === statusData.user_id) {
          return {
            ...chat,
            user: {
              ...chat.user,
              is_online: statusData.is_online,
              last_active: statusData.last_active
            }
          };
        }
        return chat;
      });
    });
    if (activeChat && activeChat.user && activeChat.user.id === statusData.user_id) {
      setActiveChat(prevChat => ({
        ...prevChat,
        user: {
          ...prevChat.user,
          is_online: statusData.is_online,
          last_active: statusData.last_active
        }
      }));
    }
  }, [activeChat]);
  const handleContactsStatus = useCallback((statusData) => {
    if (!statusData || !statusData.contacts || !Array.isArray(statusData.contacts)) return;
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (!chat.user) return chat;
        const contactStatus = statusData.contacts.find(
          contact => contact.user_id === chat.user.id
        );
        if (contactStatus) {
          return {
            ...chat,
            user: {
              ...chat.user,
              is_online: contactStatus.is_online,
              last_active: contactStatus.last_active
            }
          };
        }
        return chat;
      });
    });
    if (activeChat && activeChat.user) {
      const contactStatus = statusData.contacts.find(
        contact => contact.user_id === activeChat.user.id
      );
      if (contactStatus) {
        setActiveChat(prevChat => ({
          ...prevChat,
          user: {
            ...prevChat.user,
            is_online: contactStatus.is_online,
            last_active: contactStatus.last_active
          }
        }));
      }
    }
  }, [activeChat]);
  const ChatHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark' ? '#1f1f1f' : '#ffffff',
    height: '64px',
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 20
  }));
  return (
    <>
      <ChatContainer {...swipeHandlers}>
        <ChatListContainer isMobile={isMobile} showChatList={showChatList}>
          <ChatListHeader>
            <Typography variant="h6">Сообщения</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              size="small"
              onClick={handleNewChatClick}
              sx={{ borderRadius: '20px' }}
            >
              Новый чат
            </Button>
          </ChatListHeader>
          {isLoadingChats ? (
            <LoadingContainer>
              <CircularProgress />
            </LoadingContainer>
          ) : chats.length === 0 ? (
            <NoChatsMessage>
              <PersonIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Нет активных чатов
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Начните новую беседу или найдите друзей
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={handleNewChatClick}
                sx={{ mt: 2, borderRadius: '20px' }}
              >
                Новый чат
              </Button>
            </NoChatsMessage>
          ) : (
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
              {chats.filter(chat => chat && typeof chat === 'object' && chat.id).map(chat => {
                try {
                  return renderChatItem(chat);
                } catch (error) {
                  console.error("Error rendering chat item:", error, chat);
                  return null;
                }
              })}
            </Box>
          )}
        </ChatListContainer>
        <ConversationContainer isMobile={isMobile} showChatList={showChatList}>
          {activeChatId ? (
            <>
              <MessagesContainer 
                ref={messagesContainerRef}
                keyboardActive={keyboardActive}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onScroll={handleMessagesScroll} 
              >
                {isLoadingMoreMessages && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                <div ref={messagesStartRef} style={{ height: 1, width: '100%' }} />
                {isLoadingMessages ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, height: '100%' }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                      Загрузка сообщений...
                    </Typography>
                  </Box>
                ) : activeChat?.error ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, height: '100%' }}>
                    <ErrorOutlineIcon color="error" style={{ fontSize: 48, marginBottom: 16 }} />
                    <Typography variant="h6" gutterBottom color="error">
                      Ошибка загрузки
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                    </Typography>
                    <Button 
                      variant="outlined" 
                      sx={{ mt: 2 }} 
                      onClick={() => {
                        chatLoadingRef.current[activeChatId] = false;
                        lastRequestTimeRef.current[activeChatId] = 0;
                        setActiveChat(prev => ({ ...prev, error: null, isLoading: false }));
                        navigate(`/messenger/${activeChatId}`, { replace: true });
                      }}
                    >
                      Попробовать снова
                    </Button>
                  </Box>
                ) : (
                  <>
                    {page > 1 && hasMoreMessages && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, mb: 2 }}>
                        <Pagination
                          count={Math.ceil(totalMessages / 50)}
                          page={page}
                          onChange={handlePageChange}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    )}
                    
                    <Box sx={{ p: 2, display: 'none' }}>
                      <Typography variant="caption">
                        Debug: {messages?.length || 0} messages, activeChat: {activeChat ? JSON.stringify(activeChat.id) : 'null'}
                      </Typography>
                    </Box>
                    {Array.isArray(messages) && messages.filter(Boolean).map((message, index) => {
                      if (!message || typeof message !== 'object') {
                        console.error('Invalid message in messages array:', message);
                        return null;
                      }
                      try {
                        return renderMessage(message, index);
                      } catch (error) {
                        console.error('Error rendering message:', error, message);
                        return (
                          <Box key={index} sx={{ p: 2, color: 'text.secondary' }}>
                        <Typography variant="body2">
                              [Message rendering error]
                            </Typography>
                          </Box>
                        );
                      }
                    })}
                    {(!messages || messages.length === 0) && !isLoadingMessages && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, height: '100%' }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Нет сообщений
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Начните общение прямо сейчас!
                        </Typography>
                      </Box>
                    )}
                    
                    <div ref={messagesEndRef} style={{ height: 1, width: '100%' }} />
                  </>
                )}
              </MessagesContainer>
              {activeChatId && !isLoadingMessages && !activeChat?.error && (
                <InputContainer keyboardActive={keyboardActive}>
                  {errorMessage && (
                    <ErrorMessage>
                      <ErrorOutlineIcon fontSize="small" />
                    </ErrorMessage>
                  )}
                  {attachments.length > 0 && (
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {attachments.map((file, index) => (
                <FileUploadPreview 
                        key={index}
                        file={file}
                        onRemove={() => handleRemoveFile(index)}
                      />
                    ))}
                    </Box>
                  )}
                  <MessageTextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Напишите сообщение..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleEmojiButtonClick}>
                            <EmojiEmotionsIcon />
                          </IconButton>
                          <IconButton onClick={handleFileSelect}>
                            <AttachFileIcon />
                          </IconButton>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                          <IconButton 
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() && attachments.length === 0}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Popover
                    open={Boolean(emojiAnchorEl)}
                    anchorEl={emojiAnchorEl}
                    onClose={handleCloseEmojiPicker}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                  >
                    <Picker onEmojiClick={handleEmojiClick} />
                  </Popover>
                </InputContainer>
              )}
            </>
          ) : (
            <Box 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                p: 3
              }}
            >
              <Typography variant="h6" gutterBottom>
                Выберите чат или начните новый
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Для общения выберите собеседника из списка или создайте новый чат
              </Typography>
              {!isMobile && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleNewChatClick}
                  sx={{ mt: 2 }}
                >
                  Новый чат
                </Button>
              )}
            </Box>
          )}
        </ConversationContainer>
        
        <Dialog
          open={isNewChatDialogOpen}
          onClose={handleCloseNewChatDialog}
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
        >
        </Dialog>
        
        <Drawer
          anchor="right"
          open={mobileDrawerOpen}
          onClose={handleCloseNewChatDialog}
          PaperProps={{
            sx: { width: '100%' }
          }}
        >
        </Drawer>
      </ChatContainer>
    </>
  );
};
export default MessengerPage; 