import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Diamond as DiamondIcon,
  Star as StarIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../../../context/AuthContext';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    width: 400,
    height: '90vh',
    maxWidth: 'none',
    maxHeight: 'none',
    '@media (max-width: 768px)': {
      margin: 0,
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
    }
  }
});

const ItemImage = styled(Box)({
  width: 200,
  height: 200,
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  margin: '0 auto 24px',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: 'inherit',
  },
});

const RarityChip = styled(Chip)(({ rarity }) => {
  const colors = {
    common: { bg: '#95a5a6', color: '#fff' },
    rare: { bg: '#3498db', color: '#fff' },
    epic: { bg: '#9b59b6', color: '#fff' },
    legendary: { bg: '#f39c12', color: '#fff' },
  };
  
  return {
    background: colors[rarity]?.bg || colors.common.bg,
    color: colors[rarity]?.color || colors.common.color,
    fontWeight: 600,
    fontSize: '0.9rem',
    '& .MuiChip-label': {
      padding: '4px 12px',
    },
  };
});

const MarketPriceChip = styled(Box)({
  position: 'absolute',
  top: 8,
  right: 8,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(5px)',
  borderRadius: '20px',
  padding: '6px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  zIndex: 2,
});

const KBallsIcon = styled('img')({
  width: '16px',
  height: '16px',
  marginRight: '4px',
});

const MarketplaceModal = ({ open, onClose, listing, onPurchaseSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const [copyStatus, setCopyStatus] = useState('');
  
  if (!listing) return null;
  
  const { item, price, seller_name, seller_id } = listing;
  const isOwner = currentUser?.id === seller_id;

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <DiamondIcon />;
      case 'epic': return <StarIcon />;
      case 'rare': return <StarIcon />;
      default: return null;
    }
  };

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'common': return 'Обычный';
      case 'rare': return 'Редкий';
      case 'epic': return 'Эпический';
      case 'legendary': return 'Легендарный';
      default: return 'Обычный';
    }
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/marketplace/buy/${listing.id}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        onPurchaseSuccess(listing);
        onClose();
      } else {
        enqueueSnackbar(data.message || 'Не удалось купить предмет', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      enqueueSnackbar('Не удалось купить предмет', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromMarketplace = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/marketplace/cancel/${listing.id}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        enqueueSnackbar('Предмет снят с продажи!', { variant: 'success' });
        onPurchaseSuccess();
        onClose();
      } else {
        enqueueSnackbar(data.message || 'Не удалось снять предмет с продажи', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      enqueueSnackbar('Не удалось снять предмет с продажи', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `https://k-connect.ru/item/${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyStatus('Скопировано!');
      setTimeout(() => setCopyStatus(''), 1500);
    });
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Покупка предмета
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Box position="relative">
            <Box sx={{
              width: 250,
              height: 250,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              mb: 2,
              margin: 'auto',
              ...(item.background_url && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${item.background_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 'inherit',
                  zIndex: 1,
                }
              })
            }}>
              <img src={item.image_url} alt={item.item_name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'inherit', position: 'relative', zIndex: 2, display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%' }} />
              <MarketPriceChip>
                <KBallsIcon src="/static/icons/KBalls.svg" alt="KBalls" />
                {price}
              </MarketPriceChip>
            </Box>
            
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
              {item.item_name}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <RarityChip 
                rarity={item.rarity} 
                label={getRarityLabel(item.rarity)}
                icon={getRarityIcon(item.rarity)}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>ID предмета:</strong> {item.id}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Пак:</strong> {item.pack_name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Получен:</strong> {new Date(item.obtained_at).toLocaleDateString('ru-RU')}
              </Typography>
              {item.gifter_username && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  <strong>Подарен:</strong> @{item.gifter_username}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Экземпляр:</strong> {item.item_number} из {item.total_count}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Продавец:</strong> {seller_name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <Button
                size="small"
                variant="text"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={handleCopyLink}
                sx={{ minWidth: 0, px: 1, fontSize: '0.85rem' }}
              >
                {copyStatus || 'Скопировать'}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', pb: 3, px: 3 }}>
        <Button onClick={onClose} color="inherit">
          Закрыть
        </Button>
        {isOwner ? (
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveFromMarketplace}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Снять с продажи
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handlePurchase}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Купить за {price} <img src="/static/icons/KBalls.svg" alt="KBalls" style={{ width: 16, height: 16, marginLeft: 8 }} />
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default MarketplaceModal; 