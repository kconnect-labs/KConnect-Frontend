import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const JoinGroupChat = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleJoinGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/messenger/chats/join/${inviteCode}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setLoading(false);
        setShowConfirmation(false);
        // Show success message and button to return to messenger
        setError(null);
        navigate('/messenger');
      } else {
        throw new Error(data.error || 'Ошибка при присоединении к чату');
      }
    } catch (err) {
      setDebugInfo(`Error details: ${JSON.stringify(err, null, 2)}`);
      setError(err.message || 'Произошла ошибка при присоединении к чату');
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleReturnToMessenger = () => {
    navigate('/messenger');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Присоединение к чату...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 2
        }}
      >
        <Typography color="error" align="center" variant="h6">
          {error}
        </Typography>
        {debugInfo && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'grey.100', 
            borderRadius: 1,
            maxWidth: '600px',
            overflow: 'auto'
          }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {debugInfo}
            </Typography>
          </Box>
        )}
        <Button variant="contained" onClick={handleReturnToMessenger}>
          Вернуться в мессенджер
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 2
        }}
      >
        <Typography variant="h5" align="center">
          Приглашение в групповой чат
        </Typography>
        <Button variant="contained" onClick={() => setShowConfirmation(true)}>
          Присоединиться к чату
        </Button>
        <Button variant="outlined" onClick={handleReturnToMessenger}>
          Вернуться в мессенджер
        </Button>
      </Box>

      <Dialog 
        open={showConfirmation} 
        onClose={() => setShowConfirmation(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <Typography>
            Вы точно хотите вступить в чат?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>
            Нет
          </Button>
          <Button onClick={handleJoinGroup} variant="contained" autoFocus>
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JoinGroupChat; 