import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert
} from '@mui/material';

const DeleteChannelDialog = ({ open, onClose, channelId, onDelete }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmationChange = (e) => {
    setConfirmationText(e.target.value);
    setError('');
  };

  const handleDelete = async () => {
    if (confirmationText !== 'ПОДТВЕРЖДЕНИЕ') {
      setError('Пожалуйста, введите слово "ПОДТВЕРЖДЕНИЕ" заглавными буквами');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/delete-channel/${channelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        onDelete(data);
        onClose();
      } else {
        setError(data.error || 'Произошла ошибка при удалении канала');
      }
    } catch (err) {
      setError('Произошла ошибка при удалении канала');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Удаление канала</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Вы собираетесь удалить канал. Это действие нельзя отменить.
        </Typography>
        <Typography variant="body2" color="error" gutterBottom>
          Все данные канала будут сохранены в архиве перед удалением.
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" gutterBottom>
            Для подтверждения введите слово "ПОДТВЕРЖДЕНИЕ" заглавными буквами:
          </Typography>
          <TextField
            fullWidth
            value={confirmationText}
            onChange={handleConfirmationChange}
            error={!!error}
            helperText={error}
            margin="normal"
          />
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Отмена
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          disabled={confirmationText !== 'ПОДТВЕРЖДЕНИЕ' || isDeleting}
        >
          {isDeleting ? 'Удаление...' : 'Удалить канал'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteChannelDialog; 