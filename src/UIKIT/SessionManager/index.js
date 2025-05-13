import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, List, ListItem, ListItemText, ListItemIcon, Divider, CircularProgress, Slide, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DevicesIcon from '@mui/icons-material/Devices';
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import axios from 'axios';


axios.defaults.headers.delete['Content-Type'] = 'application/json';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getDeviceIcon = (deviceType) => {

  const baseStyle = { 
    color: '#d0bcff',
    filter: 'drop-shadow(0px 0px 3px rgba(208, 188, 255, 0.3))'
  };
  
  switch (deviceType.toLowerCase()) {
    case 'android':
      return <PhoneAndroidIcon style={baseStyle} />;
    case 'ios':
      return <PhoneAndroidIcon style={baseStyle} />;
    case 'mac os':
      return <LaptopIcon style={baseStyle} />;
    case 'windows':
      return <ComputerIcon style={baseStyle} />;
    case 'linux':
      return <ComputerIcon style={baseStyle} />;
    default:
      return <DevicesIcon style={baseStyle} />;
  }
};

const getBrowserColor = (browser) => {

  return '#d0bcff';
};

const formatLastActive = (dateString) => {
  if (!dateString || dateString === "Неизвестно") return "Неизвестно";
  
  try {

    let date;
    

    if (dateString.includes('T') || dateString.includes('Z')) {

      date = new Date(dateString);
    } 

    else if (dateString.includes('.')) {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('.');
      

      date = new Date(`${year}-${month}-${day}T${timePart}Z`);
    } 

    else {
      date = new Date(dateString);
    }
    

    const now = new Date();
    

    const diffMs = now - date;
    

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;
    

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    

    return date.toLocaleString('ru-RU', options);
  } catch (e) {
    console.error('Error formatting date:', e, dateString);
    return dateString;
  }
};

const SessionManager = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, sessionId: null });

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/auth/sessions');
      if (response.data.success) {
        setSessions(response.data.sessions || []);
      } else {
        setError(response.data.error || 'Не удалось загрузить сессии');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при загрузке сессий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open]);

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAlert({ 
          open: true, 
          message: 'Сессия успешно удалена', 
          severity: 'success' 
        });
        fetchSessions();
      } else {
        setAlert({ 
          open: true, 
          message: data.error || 'Не удалось удалить сессию', 
          severity: 'error' 
        });
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      setAlert({ 
        open: true, 
        message: err.message || 'Ошибка при удалении сессии', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, sessionId: null });
    }
  };

  const handleDeleteAllSessions = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ delete_all: true })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAlert({ 
          open: true, 
          message: 'Все другие сессии успешно удалены', 
          severity: 'success' 
        });
        fetchSessions();
      } else {
        setAlert({ 
          open: true, 
          message: data.error || 'Не удалось удалить сессии', 
          severity: 'error' 
        });
      }
    } catch (err) {
      console.error('Error deleting all sessions:', err);
      setAlert({ 
        open: true, 
        message: err.message || 'Ошибка при удалении сессий', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, sessionId: null });
    }
  };

  const openDeleteConfirm = (sessionId) => {
    setConfirmDialog({ open: true, sessionId });
  };

  const currentSession = sessions.find(s => s.is_current);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          style: {
            borderRadius: isMobile ? 0 : 16,
            backgroundColor: '#0A0A0A',
            color: '#fff',
            width: '100%',
            maxWidth: isMobile ? '100%' : '600px'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #222',
          backgroundColor: '#0F0F0F',
          py: 2,
          px: isMobile ? 2 : 3
        }}>
          <Typography variant="h6">Мои сессии</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ 
          p: 0, 
          backgroundColor: '#0F0F0F', 
          pb: 0,
          overflowX: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <ReportProblemIcon color="error" fontSize="large" />
              <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={fetchSessions}
                sx={{ mt: 2 }}
              >
                Повторить
              </Button>
            </Box>
          ) : (
            <>
              {currentSession && (
                <Box sx={{ mb: 2, px: 1 }}>
                  <Typography variant="subtitle1" sx={{ p: 2, pb: 1, fontWeight: 'bold' }}>
                    Текущая сессия
                  </Typography>
                  <List disablePadding>
                    <ListItem 
                      sx={{ 
                        backgroundColor: 'rgba(208, 188, 255, 0.08)', 
                        mb: 1,
                        mx: 1,
                        borderRadius: 2,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#4caf50',
                          right: 16,
                          top: 16
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: { xs: 36, sm: 56 } }}>
                        {getDeviceIcon(currentSession.device)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" component="span" sx={{ color: '#d0bcff' }}>
                              {currentSession.browser}
                            </Typography>
                            <CheckCircleIcon 
                              fontSize="small" 
                              sx={{ ml: 1, color: '#4caf50' }} 
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                            {currentSession.device} • Активно сейчас
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              )}

              <Typography variant="subtitle1" sx={{ p: 2, pb: 1, fontWeight: 'bold' }}>
                Все сессии {sessions.length > 0 && `(${sessions.length})`}
              </Typography>

              {sessions.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">Нет активных сессий</Typography>
                </Box>
              ) : (
                <List 
                  disablePadding
                  sx={{ 
                    maxHeight: isMobile ? 'calc(100vh - 260px)' : '400px', 
                    overflowY: 'auto', 
                    overflowX: 'hidden',
                    pb: 0,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#111',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#333',
                      borderRadius: '4px',
                    }
                  }}
                >
                  {sessions.map((session) => (
                    <Box 
                      key={session.id}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: session.is_current ? 'rgba(208, 188, 255, 0.08)' : 'transparent',
                        mx: 2,
                        mb: 1,
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(208, 188, 255, 0.05)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(100% - 40px)' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          minWidth: { xs: 36, sm: 48 } 
                        }}>
                          {getDeviceIcon(session.device)}
                        </Box>
                        
                        <Box sx={{ ml: 1, width: 'calc(100% - 48px)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: getBrowserColor(session.browser)
                              }}
                            >
                              {session.browser}
                            </Typography>
                            {session.is_current && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  ml: 1, 
                                  px: 1, 
                                  py: 0.5, 
                                  borderRadius: 1, 
                                  backgroundColor: 'rgba(208, 188, 255, 0.15)',
                                  color: '#d0bcff'
                                }}
                              >
                                Текущая
                              </Typography>
                            )}
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#B0B0B0', 
                              whiteSpace: 'normal', 
                              wordBreak: 'break-word',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            {session.device} • {session.ip_address} • {formatLastActive(session.last_activity)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {!session.is_current && (
                        <IconButton 
                          size="small"
                          aria-label="delete"
                          onClick={() => openDeleteConfirm(session.id)}
                          sx={{ 
                            color: '#ff5252',
                            width: 32,
                            height: 32,
                            '&:hover': {
                              backgroundColor: 'rgba(208, 188, 255, 0.08)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </List>
              )}
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'space-between', 
          p: 2, 
          pt: 3,
          backgroundColor: '#0F0F0F',
          borderTop: '1px solid #222',
          position: isMobile ? 'sticky' : 'relative',
          bottom: 0,
          width: '100%'
        }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              borderColor: 'rgba(208, 188, 255, 0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: '#d0bcff'
              }
            }}
            disabled={loading}
          >
            Закрыть
          </Button>
          
          <Button 
            onClick={handleDeleteAllSessions}
            variant="contained"
            startIcon={<DeleteIcon />}
            disabled={loading || sessions.length <= 1}
            sx={{
              backgroundColor: 'rgba(208, 188, 255, 0.1)',
              color: '#d0bcff',
              boxShadow: '0 4px 12px rgba(208, 188, 255, 0.1)',
              border: '1px solid rgba(208, 188, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(208, 188, 255, 0.2)',
              }
            }}
          >
            Завершить все сессии
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, sessionId: null })}
        aria-labelledby="alert-dialog-title"
        PaperProps={{
          style: {
            borderRadius: 16,
            backgroundColor: '#0F0F0F',
            color: '#fff'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ borderBottom: '1px solid #222' }}>
          Подтверждение действия
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography>
            Вы уверены, что хотите завершить эту сессию? Устройство будет отключено от аккаунта.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #222' }}>
          <Button 
            onClick={() => setConfirmDialog({ open: false, sessionId: null })} 
            sx={{ 
              color: '#fff' 
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={() => handleDeleteSession(confirmDialog.sessionId)} 
            variant="contained"
            sx={{
              backgroundColor: 'rgba(208, 188, 255, 0.1)',
              color: '#d0bcff',
              border: '1px solid rgba(208, 188, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(208, 188, 255, 0.2)',
              }
            }}
            autoFocus
          >
            Завершить сессию
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          marginBottom: isMobile ? '70px' : '10px',
          zIndex: 9999
        }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ 
          width: '100%',
          backgroundColor: alert.severity === 'success' ? 'rgb(41, 33, 58)' : '#271919',
          color: alert.severity === 'success' ? '#d0bcff' : '#fff',
          border: alert.severity === 'success' ? '1px solid rgb(71, 55, 110)' : 'none'
        }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SessionManager; 