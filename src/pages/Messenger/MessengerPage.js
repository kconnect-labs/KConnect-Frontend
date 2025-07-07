import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, Checkbox, IconButton, Menu, MenuItem, ListItemIcon, Snackbar } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import ChatList from '../../components/Messenger/ChatList';
import ChatWindow from '../../components/Messenger/ChatWindow';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SEO from '../../components/SEO';
import '../../styles/messenger.css';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowBack, MoreVert, Info, Link, Delete, Edit } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';

const MessengerPage = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [slideIn, setSlideIn] = React.useState(false);
  const [forcedSessionKey, setForcedSessionKey] = useState(null);
  const [isLoadingSessionKey, setIsLoadingSessionKey] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatMenuAnchor, setChatMenuAnchor] = useState(null);
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Состояния для создания группы
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState('followers'); // 'followers' или 'following'
  
  // Найти место, где отображается название группы и добавить редактируемое поле только для админа
  const isCurrentUserAdmin = useMemo(() => (
    currentChat && currentChat.members && authContext.user && currentChat.members.some(m => m.user_id === authContext.user.id && m.role === 'admin')
  ), [currentChat, authContext.user]);
  const [editTitle, setEditTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  
  // Мемоизация getCookie
  const getCookie = useCallback((name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }, []);
  
  // Мемоизация sessionKeyCookie и jwtToken
  const sessionKeyCookie = useMemo(() => getCookie('session_key') || getCookie('jwt') || getCookie('token'), [getCookie]);
  const jwtToken = useMemo(() => localStorage.getItem('token') || sessionKeyCookie, [sessionKeyCookie]);
  
  // Мемоизация sessionKey
  const sessionKey = useMemo(() => (
    authContext.sessionKey || authContext.session_key || 
                    localStorage.getItem('session_key') || sessionKeyCookie || 
    forcedSessionKey || jwtToken
  ), [authContext.sessionKey, authContext.session_key, sessionKeyCookie, forcedSessionKey, jwtToken]);
  
  // Настройка API для мессенджера через путь /apiMes/ (будет проксирован через NGINX)
  const API_URL = 'https://k-connect.ru/apiMes';
  const MAIN_API_URL = 'https://k-connect.ru/api';
  const BASE_URL = 'https://k-connect.ru';
  
  // Загрузка списка подписчиков и подписок
  useEffect(() => {
    if (createGroupOpen && authContext.user) {
      setLoadingUsers(true);
      Promise.all([
        axios.get(`${MAIN_API_URL}/users/${authContext.user.username}/followers`),
        axios.get(`${MAIN_API_URL}/users/${authContext.user.username}/following`)
      ])
        .then(([followersRes, followingRes]) => {
          // Получаем списки из правильных полей ответа
          setFollowers(followersRes.data.followers || []);
          setFollowing(followingRes.data.following || []);
        })
        .catch(error => {
          console.error('Error loading users:', error);
        })
        .finally(() => {
          setLoadingUsers(false);
        });
    }
  }, [createGroupOpen, authContext.user]);

  // Обработчик создания группы
  const handleCreateGroup = async () => {
    if (!groupTitle.trim() || selectedUsers.length === 0) return;

    try {
      const response = await axios.post(`${API_URL}/messenger/chats/group`, {
        title: groupTitle,
        member_ids: selectedUsers.map(user => user.id),
        is_group: true // Добавляем флаг, указывающий что это групповая беседа
      });

      if (response.data.success) {
        setCreateGroupOpen(false);
        setGroupTitle('');
        setSelectedUsers([]);
        // Обновить список чатов
        window.location.reload();
      } else {
        console.error('Error creating group:', response.data.error);
      }
    } catch (error) {
      console.error('Error creating group:', error.response?.data || error);
    }
  };

  // Мемоизация handleUserSelect
  const handleUserSelect = useCallback((user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  }, []);
  
  // Принудительно запрашиваем session_key с сервера, если нет
  useEffect(() => {
    if (!sessionKey && authContext.isAuthenticated && authContext.user && !isLoadingSessionKey) {
      console.log("Запрашиваем session_key с сервера напрямую...");
      setIsLoadingSessionKey(true);
      
      (async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/get-session-key`, {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Cache-Control': 'no-cache'
            }
          });
          
          if (response.data?.session_key) {
            console.log("Получили session_key от сервера:", response.data.session_key);
            localStorage.setItem('session_key', response.data.session_key);
            setForcedSessionKey(response.data.session_key);
          }
        } catch (err) {
          console.error("Ошибка получения session_key:", err);
          
          // Запасной вариант - используем JWT как session_key
          if (jwtToken && !localStorage.getItem('session_key')) {
            console.log("Используем JWT как session_key");
            localStorage.setItem('session_key', jwtToken);
            setForcedSessionKey(jwtToken);
          }
        } finally {
          setIsLoadingSessionKey(false);
        }
      })();
    }
  }, [authContext.isAuthenticated, authContext.user, jwtToken, sessionKey, isLoadingSessionKey, API_URL]);
  
  // Сохраняем рабочий ключ в localStorage, если получили его из куки
  useEffect(() => {
    if (sessionKeyCookie && !localStorage.getItem('session_key')) {
      localStorage.setItem('session_key', sessionKeyCookie);
      console.log('MessengerPage: Saved session key from cookie to localStorage');
    }
  }, [sessionKeyCookie]);
  
  // Check if user is a channel (channels cannot use messenger)
  const isChannel = authContext.user?.type === 'channel';
  
  // Debug
  useEffect(() => {
    console.log('Auth Context:', authContext);
    console.log('User Type:', authContext.user?.type);
    console.log('Session Key from Auth Context:', authContext.sessionKey || authContext.session_key);
    console.log('Session Key from localStorage:', localStorage.getItem('session_key'));
    console.log('Session Key from cookie:', sessionKeyCookie);
    console.log('JWT Token:', jwtToken);
    console.log('Forced Session Key:', forcedSessionKey);
    console.log('Final Session Key:', sessionKey);
    console.log('API URL:', API_URL);
  }, [authContext, sessionKey, sessionKeyCookie, jwtToken, forcedSessionKey, API_URL]);
  


  // Мемоизация handleChatSelect и handleBackToList
  const handleChatSelect = useCallback(() => {
    if (isMobile) {
      document.dispatchEvent(new CustomEvent('messenger-layout-change', { 
        detail: { isInChat: true } 
      }));
      document.body.classList.add('messenger-chat-fullscreen');
      setSlideIn(true);
      setTimeout(() => {
        setShowSidebar(false);
      }, 50);
    }
  }, [isMobile]);
  
  const handleBackToList = useCallback(() => {
    if (isMobile) {
      document.dispatchEvent(new CustomEvent('messenger-layout-change', { 
        detail: { isInChat: false } 
      }));
      document.body.classList.remove('messenger-chat-fullscreen');
      setSlideIn(false);
      setTimeout(() => {
        setShowSidebar(true);
      }, 300);
    }
  }, [isMobile]);
  
  // Обработчик копирования ссылки-приглашения
  const handleCopyInviteLink = async () => {
    try {
      const response = await axios.post(`${API_URL}/messenger/chats/${currentChat.id}/invite`);
      if (response.data.success) {
        const inviteLink = `${window.location.origin}/messenger/join/${response.data.invite_link}`;
        await navigator.clipboard.writeText(inviteLink);
        setSnackbarMessage('Ссылка скопирована в буфер обмена');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error generating invite link:', error);
      setSnackbarMessage('Ошибка при генерации ссылки');
      setSnackbarOpen(true);
    }
  };

  // Обработчик изменения аватара группы
  const handleGroupAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(`${API_URL}/messenger/chats/${currentChat.id}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        // Обновляем информацию о чате
        setCurrentChat(prev => ({
          ...prev,
          avatar: response.data.avatar
        }));
        setSnackbarMessage('Аватар группы обновлен');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating group avatar:', error);
      setSnackbarMessage('Ошибка при обновлении аватара');
      setSnackbarOpen(true);
    }
  };

  // Обработчик изменения названия группы
  const handleGroupTitleChange = async (newTitle) => {
    try {
      const response = await axios.post(`${API_URL}/messenger/chats/${currentChat.id}/update`, {
        title: newTitle
      });
      if (response.data.success) {
        setCurrentChat(prev => ({
          ...prev,
          title: newTitle
        }));
        setSnackbarMessage('Название группы обновлено');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating group title:', error);
      setSnackbarMessage('Ошибка при обновлении названия');
      setSnackbarOpen(true);
    }
  };

  // Мемоизация списков пользователей для диалога создания группы
  const followersList = useMemo(() => followers, [followers]);
  const followingList = useMemo(() => following, [following]);
  const selectedUsersIds = useMemo(() => selectedUsers.map(u => u.id), [selectedUsers]);

  // Вынесем onClick для кнопок в переменные, чтобы не создавать новые функции на каждый рендер
  const handleNewChatClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent('messenger-new-chat'));
  }, []);
  const handleCreateGroupOpen = useCallback(() => setCreateGroupOpen(true), []);

  return (
    <Box sx={{ mt: 2.5 }}>
      <SEO 
        title="Мессенджер" 
        description="Обмен сообщениями и чаты на платформе К-Коннект"
      />
      
      {/* Если идет загрузка аутентификации или ключа сессии */}
      {(authContext.loading || isLoadingSessionKey) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '70vh' 
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Если нет ключа сессии, показываем ошибку */}
      {!sessionKey && !authContext.loading && !isLoadingSessionKey && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh'
        }}>
          <Typography variant="h6" gutterBottom>
            Ошибка авторизации
          </Typography>
          <Typography variant="body1" mb={2}>
            Для доступа к мессенджеру необходимо авторизоваться
          </Typography>
        </Box>
      )}
      
      {/* Основной контент мессенджера */}
      {!authContext.loading && !isLoadingSessionKey && sessionKey && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          height: { xs: '100vh', md: 'calc(100vh - 70px)' },
          maxWidth: '1400px',
          mx: 'auto',
          mt: { xs: 0, md: 1 },
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: "8px",
          border: '1px solid rgba(255, 255, 255, 0.12)', 
          position: 'relative'
        }}>
          {/* Боковая панель со списком чатов */}
          <Box sx={{ 
            width: { xs: '100%', md: '350px' },
            borderRight: { md: `1px solid ${theme.palette.divider}` },
            display: isMobile && !showSidebar ? 'none' : 'block',
            height: '100%',
            overflow: 'hidden'
          }}>
            {/* Кнопки "Новый чат" и "Создать группу" */}
            <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.32)',
                  borderRadius: '8px'
                }}
                startIcon={<ChatIcon />}
                onClick={handleNewChatClick}
              >
                Новый чат
              </Button>
              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.32)',
                  borderRadius: '8px'
                }}
                startIcon={<AddIcon />}
                onClick={handleCreateGroupOpen}
              >
                Создать группу
              </Button>
            </Box>
            
            {/* Явно передаем обработчик выбора чата */}
            <ChatList onSelectChat={handleChatSelect} />
          </Box>
          
          {/* Основная область с чатом */}
          {isMobile ? (
            <Box 
              id="mobile-chat-container"
              className={`messenger-main ${slideIn ? 'slide-in' : 'slide-out'}`}
              sx={{ 
                display: slideIn ? 'block' : 'none', // Полностью скрываем когда не активен
                transform: slideIn ? 'translateX(0%) !important' : 'translateX(100%) !important',
                transition: 'transform 0.3s ease-in-out',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100vh',
                zIndex: slideIn ? 1300 : -1, // Управляем z-index
                backgroundColor: theme.palette.background.paper,
                overflowX: 'hidden',  
                maxWidth: '100vw',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'manipulation',
                // Дополнительная защита от блокировки интерфейса
                pointerEvents: slideIn ? 'auto' : 'none',
              }}
            >
              <ChatWindow backAction={handleBackToList} isMobile={isMobile} />
            </Box>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden'
            }}>
              <ChatWindow />
            </Box>
          )}
        </Box>
      )}

      {/* Диалог создания группы */}
      <Dialog 
        open={createGroupOpen} 
        onClose={() => setCreateGroupOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            color: '#fff',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'transparent', color: '#fff' }}>
          Создать группу
          <IconButton
            aria-label="close"
            onClick={() => setCreateGroupOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'transparent', color: '#fff' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Название группы"
            fullWidth
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Button 
              color={activeTab === 'followers' ? 'primary' : 'inherit'}
              onClick={() => setActiveTab('followers')}
            >
              Подписчики
            </Button>
            <Button 
              color={activeTab === 'following' ? 'primary' : 'inherit'}
              onClick={() => setActiveTab('following')}
            >
              Подписки
            </Button>
          </Box>

          {loadingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {(activeTab === 'followers' ? followersList : followingList).map((user) => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={selectedUsersIds.includes(user.id)}
                      onChange={() => handleUserSelect(user)}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={user.photo ? `${BASE_URL}/static/uploads/avatar/${user.id}/${user.photo}` : undefined}
                      alt={user.name}
                    >
                      {user.name?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name || user.username}
                    secondary={user.username}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateGroupOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleCreateGroup}
            variant="contained"
            disabled={!groupTitle.trim() || selectedUsers.length === 0}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Найти место, где отображается название группы и добавить редактируемое поле только для админа */}
      {currentChat && currentChat.is_group && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editingTitle ? (
            <>
              <TextField
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                size="small"
                disabled={!isCurrentUserAdmin}
              />
              <Button
                onClick={async () => {
                  await handleGroupTitleChange(editTitle);
                  setEditingTitle(false);
                }}
                disabled={!isCurrentUserAdmin || !editTitle.trim()}
                size="small"
                variant="contained"
              >
                Сохранить
              </Button>
              <Button onClick={() => setEditingTitle(false)} size="small">Отмена</Button>
            </>
          ) : (
            <>
              <Typography variant="h6">{currentChat.title}</Typography>
              {isCurrentUserAdmin && (
                <IconButton size="small" onClick={() => { setEditTitle(currentChat.title); setEditingTitle(true); }}>
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MessengerPage; 