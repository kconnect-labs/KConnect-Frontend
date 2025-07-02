import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Grid,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  backgroundImage:'unset',
  border: '2px solid rgb(17, 17, 17)',

}));

const DecorationPreview = styled(Box)(({ theme, decoration }) => {
  const isGradient = decoration?.background?.includes('linear-gradient');
  const isImage = decoration?.background?.includes('/');

  return {
    position: 'relative',
    width: '100%',
    height: '80px',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    background: decoration?.background ? (
      isImage ? `url(${decoration.background})` : decoration.background
    ) : theme.palette.background.paper,
    backgroundSize: isImage ? 'cover' : 'auto',
    backgroundPosition: 'center',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
});

const DecorationItem = styled('img')({
  position: 'absolute',
  right: 0,
  height: 'max-content',
  maxHeight: '60px',
  opacity: 1,
  pointerEvents: 'none',
});

const DecorationMenu = ({ open, onClose, userId, username }) => {
  const [loading, setLoading] = useState(false);
  const [availableDecorations, setAvailableDecorations] = useState([]);
  const [userDecorations, setUserDecorations] = useState([]);
  const [error, setError] = useState(null);

  const fetchDecorations = async () => {
    setLoading(true);
    try {
      const [availableRes, userRes] = await Promise.all([
        fetch('/api/moderator/decorations'),
        fetch(`/api/moderator/users/${userId}/decorations`)
      ]);

      if (!availableRes.ok || !userRes.ok) {
        throw new Error('Failed to fetch decorations');
      }

      const availableData = await availableRes.json();
      const userData = await userRes.json();

      setAvailableDecorations(availableData.decorations || []);
      setUserDecorations(userData.decorations.map(item => ({
        ...item.decoration,
        is_active: item.is_active,
        user_decoration_id: item.id
      })) || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && userId) {
      fetchDecorations();
    }
  }, [open, userId]);

  const handleGrantDecoration = async (decorationId) => {
    try {
      const response = await fetch(`/api/moderator/users/${userId}/decorations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ decoration_id: decorationId })
      });

      if (!response.ok) {
        throw new Error('Failed to grant decoration');
      }

      fetchDecorations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRevokeDecoration = async (decorationId) => {
    try {
      const response = await fetch(`/api/moderator/users/${userId}/decorations/${decorationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to revoke decoration');
      }

      fetchDecorations();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderDecorationItem = (decoration, isUserDecoration = false) => {
    const userHasDecoration = userDecorations.some(ud => ud.id === decoration.id);
    const userDecorationData = userDecorations.find(ud => ud.id === decoration.id);
    
    return (
      <StyledPaper key={decoration.id}>
        <DecorationPreview decoration={decoration}>
          {decoration.item_path && (() => {
            const [path, ...styles] = decoration.item_path.split(';');
            const styleObj = styles.reduce((acc, style) => {
              const [key, value] = style.split(':').map(s => s.trim());
              return { ...acc, [key]: value };
            }, {});
            
            return (
              <DecorationItem
                src={path}
                style={styleObj}
                alt=""
              />
            );
          })()}
        </DecorationPreview>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">{decoration.name}</Typography>
          {isUserDecoration ? (
            <Tooltip title="Отозвать декорацию">
              <IconButton 
                onClick={() => handleRevokeDecoration(decoration.id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={userHasDecoration ? 'Уже выдано' : 'Выдать декорацию'}>
              <span>
                <IconButton
                  onClick={() => handleGrantDecoration(decoration.id)}
                  color="primary"
                  size="small"
                  disabled={userHasDecoration}
                >
                  {userHasDecoration ? <CheckCircleIcon /> : <AddIcon />}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      </StyledPaper>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundImage: 'unset',
        },
      }}
    >
      <DialogTitle>
        Управление декорациями пользователя {username}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Декорации пользователя
              </Typography>
              {userDecorations.map(decoration => renderDecorationItem(decoration, true))}
              {userDecorations.length === 0 && (
                <Typography color="textSecondary">
                  У пользователя нет декораций
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Доступные декорации
              </Typography>
              {availableDecorations.map(decoration => renderDecorationItem(decoration))}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DecorationMenu; 