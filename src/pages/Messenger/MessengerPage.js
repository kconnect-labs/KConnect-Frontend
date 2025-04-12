import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, TextField, IconButton, Paper, Badge, Divider, 
  InputAdornment, CircularProgress, useMediaQuery, useTheme, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadPreview from '../../components/Messenger/FileUploadPreview';
import MessengerService from '../../services/Messenger/MessengerService';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Pagination from '@mui/material/Pagination';
import Picker from 'emoji-picker-react';
import PlyrVideo from '../../components/PlyrVideo';
import 'plyr/dist/plyr.css';

// Styled components
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: 'calc(100vh - 64px - 80px)', // Уменьшенная высота на ПК - отступы сверху и снизу
  maxHeight: '800px', // Максимальная высота для больших экранов
  margin: '40px auto', // Центрирование и отступы
  maxWidth: '1200px', // Максимальная ширина для больших экранов
  borderRadius: theme.spacing(2), // Скругленные углы для ПК версии
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
    : '0 10px 30px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    margin: '20px auto',
    height: 'calc(100vh - 64px - 40px)',
  },
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 56px)', // На мобильных полная высота минус хедер
    margin: 0,
    borderRadius: 0,
    boxShadow: 'none',
    maxHeight: 'none',
  }
}));

const ChatListContainer = styled(Box)(({ theme, isMobile, showChatList }) => ({
  width: isMobile ? '100%' : '320px',
  minWidth: isMobile ? '100%' : '280px',
  borderRight: `1px solid ${theme.palette.divider}`,
  display: isMobile ? (showChatList ? 'flex' : 'none') : 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#131313' : '#FFFFFF',
  [theme.breakpoints.between('sm', 'md')]: {
    width: '280px',
  }
}));

const ChatListHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ChatListItem = styled(Box)(({ theme, isActive }) => ({
  display: 'flex',
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  backgroundColor: isActive ? (theme.palette.mode === 'dark' ? '#2D2D2D' : '#F0F0F0') : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#252525' : '#F8F8F8',
  },
}));

const ChatInfoContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  marginLeft: 12,
  overflow: 'hidden',
});

const UnreadBadgeContainer = styled(Box)({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: 'auto',
  minWidth: '24px',
});

const LastMessageText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.85rem',
  marginRight: '5px',
  maxWidth: 'calc(100% - 30px)',
});

const TimeText = styled(Typography)({
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
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
}));

const ConversationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#131313' : '#FFFFFF',
}));

const MessagesContainer = styled(Box)(({ theme, keyboardActive }) => ({
  flexGrow: 1,
  width: '100%',
  overflow: 'auto',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
  transition: 'height 0.3s ease-in-out',
  WebkitOverflowScrolling: 'touch',
  '-webkit-tap-highlight-color': 'transparent',
  ...(keyboardActive && {
    height: 'calc(100vh - 250px)',
  }),
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

const MessageContainer = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  width: '100%',
  marginBottom: theme.spacing(0.5),
  opacity: 1,
  transform: 'translateY(0)',
  transition: 'opacity 0.2s ease, transform 0.3s ease',
  '&.new-message': {
    animation: 'fadeIn 0.3s ease',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  }
}));

const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  padding: theme.spacing(1, 1.5, 1.5, 1.5),
  paddingRight: '46px',
  maxWidth: '75%',
  borderRadius: '16px',
  borderBottomRightRadius: isOwn ? '4px' : '16px',
  borderBottomLeftRadius: isOwn ? '16px' : '4px',
  backgroundColor: isOwn ? theme.palette.primary.main : (theme.palette.mode === 'dark' ? '#2D2D2D' : '#FFFFFF'),
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  wordBreak: 'break-word',
  transition: 'all 0.2s ease',
  boxShadow: 'none',
  position: 'relative',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '80%',
  }
}));

const MessageTime = styled(Box)(({ theme, isOwn }) => ({
  fontSize: '0.7rem',
  position: 'absolute',
  right: '6px',
  bottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '0 3px',
  color: isOwn ? 'rgba(255, 255, 255, 0.9)' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-3px',
    right: '-3px',
    top: '-2px',
    bottom: '-2px',
    borderRadius: '8px',
    backgroundColor: isOwn 
      ? 'rgba(0, 0, 0, 0.2)' 
      : theme.palette.mode === 'dark' 
        ? 'rgba(0, 0, 0, 0.3)' 
        : 'rgba(255, 255, 255, 0.7)',
    zIndex: -1,
  },
}));

const InputContainer = styled(Box)(({ theme, keyboardActive }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#131313' : '#FFFFFF',
  transition: 'padding 0.3s ease',
  position: 'relative',
  zIndex: 5,
  ...(keyboardActive && {
    padding: theme.spacing(1),
  })
}));

const ImageMessage = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  borderRadius: '8px',
  marginTop: '8px',
  objectFit: 'cover', // Добавляем правильное кадрирование
});

// Use VideoContainer for videos with Plyr styling
const VideoContainer = styled(Box)({
  maxWidth: '100%',
  maxHeight: '250px', 
  borderRadius: '8px',
  marginTop: '8px',
  overflow: 'hidden',
  // Улучшенные стили для Plyr
  '& .plyr': {
    borderRadius: '8px',
    '--plyr-color-main': '#8c54ff', // Акцентный цвет для плеера
    '--plyr-video-control-color': '#fff',
  }
});

// Mock data for demonstration
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
  {
    id: 5,
    name: 'Елена Козлова',
    avatar: '/static/uploads/avatars/elena_avatar.jpg',
    isOnline: true,
    lastMessage: 'Посмотри фото с мероприятия',
    lastMessageTime: '19 апр',
    unread: 0
  }
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

// Стиль для текста сообщения
const MessageText = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  lineHeight: 1.4,
  margin: 0,
  padding: 0,
  wordBreak: 'break-word',
}));

// Обновляем стиль читаемых меток для максимального сходства с Telegram
const ReadMarks = styled('span')(({ isOwn, isRead, theme }) => ({
  marginLeft: '1px',
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.85rem',
  letterSpacing: isRead ? '-4px' : '-1px',
  fontWeight: 'bold',
  color: isOwn 
    ? (isRead ? '#4fae4e' : 'rgba(255, 255, 255, 0.9)')
    : (isRead ? '#4fae4e' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'),
}));

// Стилизуем счетчик непрочитанных сообщений
const UnreadBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    borderRadius: '10px',
    animation: 'pulse 1s',
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(0.8)',
      },
      '50%': {
        transform: 'scale(1.1)',
      },
      '100%': {
        transform: 'scale(1)',
      },
    },
  },
}));

const MessengerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeChat, setActiveChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState(MOCK_CHATS);
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const messagesPerPage = 20;
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [keyboardActive, setKeyboardActive] = useState(false);

  // Minimum swipe distance required (in px)
  const minSwipeDistance = 50;

  // Add state for emoji picker
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const openEmojiPicker = Boolean(emojiAnchorEl);

  // Set initial active chat
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0]);
      setMessages(MOCK_MESSAGES);
    }
  }, [chats, activeChat]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle keyboard detection on mobile
  useEffect(() => {
    const handleFocus = () => {
      if (isMobile) {
        setKeyboardActive(true);
        // Scroll to the bottom after a short delay
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    };
    
    const handleBlur = () => {
      if (isMobile) {
        setKeyboardActive(false);
      }
    };
    
    const input = document.querySelector('input[type="text"], textarea');
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }
    
    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, [isMobile]);

  // Добавляем обработчик для предотвращения автоматического скрытия клавиатуры на iOS
  useEffect(() => {
    // Предотвращаем автоматическое скрытие клавиатуры на iOS
    const preventKeyboardHide = () => {
      // Только для iOS устройств
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (!isIOS) return;
      
      const inputs = document.querySelectorAll('textarea, input');
      inputs.forEach(input => {
        input.addEventListener('blur', function(e) {
          // Предотвращаем скрытие клавиатуры, если это была отправка сообщения
          if (e.target.closest('.message-input-container')) {
            setTimeout(() => {
              input.focus();
            }, 100);
          }
        });
      });
      
      // Предотвращаем появление нативных элементов iOS
      document.addEventListener('touchstart', function(e) {
        const target = e.target;
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
          // Предотвращаем появление лупы на iOS
          e.preventDefault();
          target.focus();
        }
      }, { passive: false });
    };
    
    preventKeyboardHide();
  }, []);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setMessages(MOCK_MESSAGES);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && selectedFiles.length === 0) return;

    // Simulate sending a message
    setLoading(true);
    
    try {
      // In the future, this will use the MessengerService
      // const response = await MessengerService.sendMessage(
      //   activeChat.id, 
      //   messageText.trim(), 
      //   selectedFiles
      // );
      
      setTimeout(() => {
        const fileAttachments = selectedFiles.map((file, index) => ({
          id: Date.now() + index,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'file',
          url: URL.createObjectURL(file),
          filename: file.name
        }));
        
        const newMessage = {
          id: Date.now(),
          senderId: 1, // Current user id
          content: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          media: fileAttachments.length > 0 ? fileAttachments[0] : null,
          attachments: fileAttachments,
          isNew: true // Маркер нового сообщения для анимации
        };
        
        setMessages([...messages, newMessage]);
        setMessageText('');
        setSelectedFiles([]);
        setLoading(false);
        
        // Через небольшую задержку прокручиваем вниз для отображения нового сообщения
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          
          // Сфокусируемся снова на текстовом поле
          const input = document.querySelector('textarea');
          if (input) {
            input.focus();
          }
        }, 100);
        
        // Update the chat list with the new message
        setChats(chats.map(chat => 
          chat.id === activeChat.id 
            ? { 
                ...chat, 
                lastMessage: messageText || (fileAttachments.length > 0 ? `Отправлен ${fileAttachments.length > 1 ? 'файлы' : 'файл'}` : ''), 
                lastMessageTime: 'Сейчас' 
              }
            : chat
        ));
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    // Reset the input to allow selecting the same file again
    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Function to format date/time
  const formatMessageDate = (timestamp) => {
    return timestamp;
  };

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && isMobile && !showChatList && activeChat) {
      handleBackToList();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Set total pages based on message count
  useEffect(() => {
    // Calculate total pages
    const messageCount = messages.length;
    const calculatedPages = Math.ceil(messageCount / messagesPerPage);
    setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
  }, [messages, messagesPerPage]);

  // Add function to load messages by page
  const loadMessagesByPage = (pageNum) => {
    // In a real implementation, this would fetch messages from API
    // For now, we simulate pagination with the mock data
    setPage(pageNum);
    
    // Simulate page loading (in real implementation, you'd fetch from backend)
    const startIndex = (pageNum - 1) * messagesPerPage;
    const endIndex = Math.min(startIndex + messagesPerPage, MOCK_MESSAGES.length);
    const paginatedMessages = MOCK_MESSAGES.slice(startIndex, endIndex);
    
    // In a real implementation we would set these messages,
    // but for now we'll just log this for demonstration
    console.log(`Loading messages ${startIndex + 1}-${endIndex}`);
  };
  
  // Update page change handler
  const handlePageChange = (event, value) => {
    loadMessagesByPage(value);
  };

  // Menu handlers
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteChat = () => {
    if (!activeChat) return;
    console.log(`Deleting chat with ${activeChat.name}`);
    
    // In a real implementation, this would call an API
    // For now, we'll just simulate it
    setChats(chats.filter(chat => chat.id !== activeChat.id));
    setActiveChat(null);
    setShowChatList(true);
    handleMenuClose();
  };

  const handleClearHistory = () => {
    if (!activeChat) return;
    console.log(`Clearing history with ${activeChat.name}`);
    
    // In a real implementation, this would call an API
    // For now, we'll just simulate it
    setMessages([]);
    handleMenuClose();
  };

  // Update emoji handler function
  const handleEmojiClick = (emojiObject) => {
    setMessageText(prev => prev + emojiObject.emoji);
  };
  
  const handleEmojiButtonClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };
  
  const handleCloseEmojiPicker = () => {
    setEmojiAnchorEl(null);
  };

  // Hide app header and navbar when in messenger
  useEffect(() => {
    // Только скрываем нижнюю навигацию при открытой переписке на мобильных
    const bottomNav = document.querySelector('.MuiBottomNavigation-root')?.parentElement;
    
    if (bottomNav && isMobile && !showChatList && activeChat) {
      const originalBottomNavDisplay = bottomNav.style.display;
      bottomNav.style.display = 'none';
      
      return () => {
        bottomNav.style.display = originalBottomNavDisplay;
      };
    }
  }, [isMobile, showChatList, activeChat]);

  // Стили для emoji picker
  const emojiPickerStyle = {
    width: '100%',
    maxWidth: '320px',
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
    border: 'none',
    boxShadow: `0px 5px 15px rgba(0, 0, 0, ${theme.palette.mode === 'dark' ? '0.4' : '0.2'})`,
    '.emoji-categories': {
      backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#e5e5e5',
    },
    '.emoji-search': {
      backgroundColor: theme.palette.mode === 'dark' ? '#363636' : '#ffffff',
      borderRadius: '20px',
      padding: '8px 10px',
      margin: '8px',
      color: theme.palette.text.primary,
    },
    '.emoji-group:before': {
      backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
      padding: '8px 0',
      fontSize: '14px',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    '.emoji-picker-react .emoji-scroll-wrapper::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
    }
  };

  return (
    <ChatContainer>
      {/* Chat list */}
      <ChatListContainer isMobile={isMobile} showChatList={showChatList}>
        <ChatListHeader>
          <Typography variant="h6">Сообщения</Typography>
        </ChatListHeader>
        
        {chats.map((chat) => (
          <ChatListItem 
            key={chat.id} 
            isActive={activeChat && activeChat.id === chat.id}
            onClick={() => handleChatSelect(chat)}
          >
            {chat.isOnline ? (
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar src={chat.avatar} alt={chat.name} />
              </OnlineBadge>
            ) : (
              <Avatar src={chat.avatar} alt={chat.name} />
            )}
            
            <ChatInfoContainer>
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Typography variant="subtitle2" noWrap>{chat.name}</Typography>
                <TimeText>{chat.lastMessageTime}</TimeText>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <LastMessageText color="textSecondary">{chat.lastMessage}</LastMessageText>
                {chat.unread > 0 && (
                  <UnreadBadgeContainer>
                    <UnreadBadge badgeContent={chat.unread} />
                  </UnreadBadgeContainer>
                )}
              </Box>
            </ChatInfoContainer>
          </ChatListItem>
        ))}
      </ChatListContainer>

      {/* Conversation area with touch events for swipe */}
      <ConversationContainer 
        isMobile={isMobile} 
        showChatList={showChatList}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {activeChat ? (
          <>
            <ConversationHeader>
              {isMobile && (
                <IconButton edge="start" onClick={handleBackToList} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              
              {activeChat.isOnline ? (
                <OnlineBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar src={activeChat.avatar} alt={activeChat.name} />
                </OnlineBadge>
              ) : (
                <Avatar src={activeChat.avatar} alt={activeChat.name} />
              )}
              
              <Box ml={2}>
                <Typography variant="subtitle1">{activeChat.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {activeChat.isOnline ? 'В сети' : 'Не в сети'}
                </Typography>
              </Box>
              
              <IconButton 
                sx={{ marginLeft: 'auto' }}
                onClick={handleMenuOpen}
                aria-label="more options"
                aria-controls="chat-menu"
                aria-haspopup="true"
              >
                <MoreVertIcon />
              </IconButton>
              
              {/* Chat Options Menu */}
              <Menu
                id="chat-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleClearHistory}>
                  <ListItemIcon>
                    <ClearAllIcon fontSize="small" />
                  </ListItemIcon>
                  Очистить историю
                </MenuItem>
                <MenuItem onClick={handleDeleteChat}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography color="error">Удалить чат</Typography>
                </MenuItem>
              </Menu>
            </ConversationHeader>

            <MessagesContainer keyboardActive={keyboardActive}>
              {messages.length > 0 ? (
                <>
                  {/* Show pagination if needed */}
                  {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" my={1}>
                      <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange} 
                        size="small"
                        color="primary" 
                        siblingCount={0}
                        boundaryCount={1}
                      />
                    </Box>
                  )}
                  
                  {messages.map((message, index) => {
                    const isOwn = message.senderId === 1; // Current user id
                    
                    // Проверяем, нужно ли группировать сообщение с предыдущим
                    const isPreviousFromSameSender = index > 0 && messages[index - 1].senderId === message.senderId;
                    const isNextFromSameSender = index < messages.length - 1 && messages[index + 1].senderId === message.senderId;
                    
                    // Определяем стиль закругления углов для сгруппированных сообщений
                    const getBorderRadius = () => {
                      if (isOwn) {
                        if (isPreviousFromSameSender && isNextFromSameSender) {
                          return '16px 4px 4px 16px'; // Середина группы своих сообщений
                        } else if (isPreviousFromSameSender) {
                          return '16px 4px 16px 16px'; // Последнее в группе своих сообщений
                        } else if (isNextFromSameSender) {
                          return '16px 16px 4px 16px'; // Первое в группе своих сообщений
                        }
                        return '16px 16px 4px 16px'; // Одиночное своё сообщение
                      } else {
                        if (isPreviousFromSameSender && isNextFromSameSender) {
                          return '4px 16px 16px 4px'; // Середина группы чужих сообщений
                        } else if (isPreviousFromSameSender) {
                          return '4px 16px 16px 16px'; // Последнее в группе чужих сообщений
                        } else if (isNextFromSameSender) {
                          return '16px 16px 16px 4px'; // Первое в группе чужих сообщений
                        }
                        return '16px 16px 16px 4px'; // Одиночное чужое сообщение
                      }
                    };
                    
                    // Определяем, отображать ли время для данного сообщения
                    // Показываем только для последнего в группе или одиночных
                    const showTime = !isNextFromSameSender || index === messages.length - 1;
                    
                    return (
                      <MessageContainer 
                        key={message.id} 
                        isOwn={isOwn} 
                        className={message.isNew ? 'new-message' : ''}
                        style={{ 
                          marginBottom: isNextFromSameSender ? '2px' : '8px'
                        }}
                      >
                        <MessageBubble 
                          isOwn={isOwn}
                          style={{ 
                            borderRadius: getBorderRadius(),
                            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {message.content && <MessageText>{message.content}</MessageText>}
                          
                          {message.media && message.media.type === 'image' && (
                            <Box 
                              sx={{ 
                                mt: 0.5, // Уменьшаем отступ от текста до изображения
                                maxWidth: '100%',
                                '& img': { 
                                  display: 'block',
                                  maxWidth: '100%',
                                  borderRadius: '8px',
                                } 
                              }}
                            >
                              <ImageMessage src={message.media.url} alt="Shared image" />
                            </Box>
                          )}
                          
                          {message.media && message.media.type === 'video' && (
                            <VideoContainer>
                              <PlyrVideo src={message.media.url} />
                            </VideoContainer>
                          )}
                          
                          {/* Отображение дополнительных вложений */}
                          {message.attachments && message.attachments.length > 1 && (
                            <Box mt={0.5}>
                              {message.attachments.slice(1).map((attachment, index) => (
                                <Box key={index} mt={0.5}>
                                  {attachment.type === 'image' && (
                                    <Box sx={{ '& img': { maxWidth: '100%', borderRadius: '8px' } }}>
                                      <ImageMessage src={attachment.url} alt={`Attachment ${index + 1}`} />
                                    </Box>
                                  )}
                                  {attachment.type === 'video' && (
                                    <VideoContainer>
                                      <PlyrVideo src={attachment.url} />
                                    </VideoContainer>
                                  )}
                                  {attachment.type !== 'image' && attachment.type !== 'video' && (
                                    <Typography variant="body2">
                                      Файл: {attachment.filename}
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}
                          
                          {showTime && (
                            <MessageTime isOwn={isOwn}>
                              {formatMessageDate(message.timestamp)}
                              {isOwn && (
                                <ReadMarks isOwn={isOwn} isRead={message.isRead}>
                                  {message.isRead ? '✓✓' : '✓'}
                                </ReadMarks>
                              )}
                            </MessageTime>
                          )}
                        </MessageBubble>
                      </MessageContainer>
                    );
                  })}
                </>
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                  <Typography variant="body1" color="textSecondary">
                    Нет сообщений. Начните общение прямо сейчас!
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputContainer keyboardActive={keyboardActive}>
              {/* File upload preview */}
              <FileUploadPreview 
                files={selectedFiles}
                onRemoveFile={handleRemoveFile}
              />
              
              {/* Hidden file input */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              <TextField
                className="message-input-container"
                fullWidth
                variant="outlined"
                placeholder="Написать сообщение..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                multiline
                maxRows={keyboardActive ? 2 : 4}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleFileSelect} size={keyboardActive ? "small" : "medium"}>
                        <AttachFileIcon fontSize={keyboardActive ? "small" : "medium"} />
                      </IconButton>
                      <IconButton 
                        onClick={handleEmojiButtonClick}
                        size={keyboardActive ? "small" : "medium"}
                      >
                        <EmojiEmotionsIcon fontSize={keyboardActive ? "small" : "medium"} />
                      </IconButton>
                      <IconButton 
                        disabled={(!(messageText.trim() || selectedFiles.length > 0)) || loading} 
                        onClick={handleSendMessage} 
                        color="primary"
                        size={keyboardActive ? "small" : "medium"}
                      >
                        {loading ? <CircularProgress size={keyboardActive ? 18 : 24} /> : <SendIcon fontSize={keyboardActive ? "small" : "medium"} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                  '& .MuiOutlinedInput-input': {
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '-webkit-user-select': 'text',
                    '-webkit-touch-callout': 'none',
                  },
                  '& textarea': {
                    // Стили для предотвращения проблем iOS
                    WebkitAppearance: 'none',
                    '-webkit-user-select': 'text',
                    '-webkit-touch-callout': 'none',
                    '-webkit-tap-highlight-color': 'transparent',
                  },
                  '&:focus': {
                    position: 'sticky',
                    bottom: 0
                  }
                }}
                inputProps={{
                  style: { caretColor: 'auto' },
                  enterKeyHint: 'send',
                  autoCapitalize: 'none',
                  autoCorrect: 'off',
                  spellCheck: 'false',
                }}
              />
              
              {/* Emoji Picker */}
              <Popover
                open={openEmojiPicker}
                anchorEl={emojiAnchorEl}
                onClose={handleCloseEmojiPicker}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                sx={{ 
                  '& .MuiPopover-paper': { 
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }
                }}
              >
                <Picker
                  onEmojiClick={handleEmojiClick}
                  native={true}
                  disableAutoFocus={true}
                  searchPlaceholder="Поиск эмодзи..."
                  groupNames={{
                    smileys_people: 'Смайлы и люди',
                    animals_nature: 'Животные и природа',
                    food_drink: 'Еда и напитки',
                    travel_places: 'Путешествия и места',
                    activities: 'Деятельность',
                    objects: 'Объекты',
                    symbols: 'Символы',
                    flags: 'Флаги'
                  }}
                  theme="light"
                  suggestedEmojisMode="recent"
                  skinTonePickerLocation="PREVIEW"
                  previewConfig={{
                    showPreview: true,
                    defaultCaption: 'Выберите эмодзи...',
                    defaultEmoji: '1f60a'
                  }}
                  style={emojiPickerStyle}
                />
              </Popover>
            </InputContainer>
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
            <ImageIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">Выберите чат, чтобы начать общение</Typography>
          </Box>
        )}
      </ConversationContainer>
    </ChatContainer>
  );
};

export default MessengerPage; 