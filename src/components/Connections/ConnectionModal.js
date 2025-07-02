import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Snackbar,
  Alert,
  IconButton,
  alpha,
  useTheme,
  Modal,
  InputAdornment
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ConnectionModal = ({ open, onClose }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingConnection, setPendingConnection] = useState(null);
  const [receivedConnection, setReceivedConnection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('search'); // 'search' | 'pending' | 'connected' | 'received'
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUserId, setMenuUserId] = useState(null);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/user/connections/list?type=love');
      const data = await response.json();
      if (data.success) {
        setConnections(data.connections || []);
        
        // Находим ожидающий коннект (который мы отправили)
        const pending = data.connections.find(conn => conn.connection_status === 'pending');
        setPendingConnection(pending);
        
        // Находим полученный коннект (который нам отправили)
        const received = data.connections.find(conn => conn.connection_status === 'received');
        setReceivedConnection(received);
        
        // Определяем, какой вид показывать
        if (pending) {
          setView('pending');
        } else if (received) {
          setView('received');
        } else if (data.connections.some(conn => conn.connection_status === 'confirmed')) {
          setView('connected');
        } else {
          setView('search');
        }
      }
    } catch (err) {
      setError('Ошибка при загрузке коннектов');
    }
  };

  const searchUsers = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`/api/user/connections/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.results) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError('Ошибка при поиске пользователей');
      setSearchResults([]);
    }
  };

  const addConnection = async (username) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/connections/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          connection_type: 'love'
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchConnections();
        setSearchQuery('');
        setSearchResults([]);
      } else {
        setError(data.message || 'Ошибка при добавлении коннекта');
      }
    } catch (err) {
      setError('Ошибка при добавлении коннекта');
    } finally {
      setLoading(false);
    }
  };

  const removeConnection = async (username) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/connections/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          connection_type: 'love'
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchConnections();
      } else {
        setError(data.message || 'Ошибка при удалении коннекта');
      }
    } catch (err) {
      setError('Ошибка при удалении коннекта');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchConnections();
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Функция для открытия меню
  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  // Функция для вычисления дней с confirmed_at
  const getDaysSince = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const renderPendingView = () => (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
        Ожидание подтверждения
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Avatar 
          src={`/static/uploads/avatar/${pendingConnection.id}/${pendingConnection.photo}`}
          alt={pendingConnection.username}
          sx={{ width: 64, height: 64, mr: 2 }}
        />
        <Box>
          <Typography sx={{ color: '#fff' }}>{pendingConnection.username}</Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{pendingConnection.name}</Typography>
        </Box>
      </Box>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
        Ожидаем подтверждения от пользователя
      </Typography>
      <Button
        variant="contained"
        onClick={() => removeConnection(pendingConnection.username)}
        disabled={loading}
        sx={{
          color: '#D0BCFF',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        Отменить запрос
      </Button>
    </Box>
  );

  const renderReceivedView = () => (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
        Запрос на связь
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Avatar 
          src={`/static/uploads/avatar/${receivedConnection.id}/${receivedConnection.photo}`}
          alt={receivedConnection.username}
          sx={{ width: 64, height: 64, mr: 2 }}
        />
        <Box>
          <Typography sx={{ color: '#fff' }}>{receivedConnection.username}</Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{receivedConnection.name}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => addConnection(receivedConnection.username)}
          disabled={loading}
          sx={{
            color: '#D0BCFF',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          Принять
        </Button>
        <Button
          variant="contained"
          onClick={() => removeConnection(receivedConnection.username)}
          disabled={loading}
          sx={{
            color: '#D0BCFF',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          Отклонить
        </Button>
      </Box>
    </Box>
  );

  const renderConnectedView = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
        Ваша любовная связь
      </Typography>
      {connections.map((connection) => {
        const days = getDaysSince(connection.confirmed_at);
        return (
          <Box
            key={connection.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              p: 2,
              mb: 2,
            }}
          >
            <Avatar
              src={`/static/uploads/avatar/${connection.id}/${connection.photo}`}
              alt={connection.username}
              sx={{ width: 44, height: 44, mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#fff' }}>{connection.username}</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{connection.name}</Typography>
              {connection.is_confirmed && days !== null && (
                <Typography sx={{ color: '#D0BCFF', fontSize: '0.85rem', mt: 0.5 }}>
                  Вместе {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                </Typography>
              )}
            </Box>
            {connection.is_confirmed ? (
              <>
                <IconButton
                  onClick={(e) => handleMenuOpen(e, connection.id)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && menuUserId === connection.id}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    onClick={() => {
                      removeConnection(connection.username);
                      handleMenuClose();
                    }}
                    sx={{ color: '#e57373' }}
                  >
                    Убрать соединение
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => removeConnection(connection.username)}
                disabled={loading}
                variant="outlined"
                color="error"
                sx={{ ml: 2, minWidth: 120 }}
              >
                Убрать соединение
              </Button>
            )}
          </Box>
        );
      })}
    </Box>
  );

  const renderSearchView = () => (
    <>
      <TextField
        fullWidth
        placeholder="Поиск пользователей..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
      }}>
        {searchQuery && searchResults.length > 0 && (
          <List>
            {searchResults.map((user) => (
              <ListItem
                key={user.id}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={`/static/uploads/avatar/${user.id}/${user.photo}`}
                    alt={user.username}
                  />
                </ListItemAvatar>
                <ListItemText 
                  primary={user.username}
                  secondary={user.name}
                  sx={{ 
                    color: '#fff',
                    '& .MuiListItemText-secondary': {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => addConnection(user.username)}
                  disabled={loading || user.is_connected}
                  sx={{
                    color: '#D0BCFF',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  {user.is_connected ? 'Подключено' : 'Коннект'}
                </Button>
              </ListItem>
            ))}
          </List>
        )}

        {searchQuery && searchResults.length === 0 && (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 2 }}>
            Пользователи не найдены
          </Typography>
        )}
      </Box>
    </>
  );

  // Фуллскрин на мобильных
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="connection-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 500,
          height: isMobile ? '100vh' : 'auto',
          minHeight: isMobile ? '100vh' : 400,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: isMobile ? 0 : '24px',
          boxShadow: 24,
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1300,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <CloseIcon />
        </IconButton>

        {view === 'pending' && renderPendingView()}
        {view === 'received' && renderReceivedView()}
        {view === 'connected' && renderConnectedView()}
        {view === 'search' && renderSearchView()}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Modal>
  );
};

export default ConnectionModal; 