import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Alert,
  Avatar,
  InputAdornment,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnequippedIcon,
  Search as SearchIcon,
  Upgrade as UpgradeIcon,
  Diamond as DiamondIcon,
  Star as StarIcon,
  Store as StoreIcon,
  RemoveShoppingCart as RemoveFromMarketIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import axios from 'axios';
import {
  GlowEffect,
  AnimatedSparkle,
  AnimatedStar,
  EFFECTS_CONFIG,
  extractDominantColor,
  getFallbackColor,
  useUpgradeEffects
} from './upgradeEffectsConfig';

const UpgradeEffects = ({ item, children }) => {
  const { dominantColor, isUpgraded } = useUpgradeEffects(item);

  if (!isUpgraded) {
    return children;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <GlowEffect color={dominantColor} />
      {EFFECTS_CONFIG.sparkles.map((sparkle, idx) => (
        <AnimatedSparkle
          key={idx}
          color={dominantColor}
          delay={sparkle.delay}
          size={sparkle.size}
          sx={sparkle.position}
        />
      ))}
      {EFFECTS_CONFIG.stars.map((star, idx) => (
        <AnimatedStar
          key={idx}
          color={dominantColor}
          delay={star.delay}
          size={star.size}
          sx={star.position}
        />
      ))}
    </Box>
  );
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
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
}));

const ItemImage = styled(Box)(({ theme }) => ({
  width: 250,
  height: 250,
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  margin: '0 auto 24px',
  overflow: 'hidden',
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: 'inherit',
    position: 'relative',
    zIndex: 2,
    maxWidth: '100%',
    maxHeight: '100%',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: 'inherit',
    zIndex: 1,
  },
}));

const RarityChip = styled(Chip)(({ rarity, theme }) => {
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

const SuggestionsContainer = styled(Box)(() => ({
  backgroundColor: 'rgba(20, 20, 20, 0.4)',
  backdropFilter: 'blur(5px)',
  borderRadius: 8,
  marginBottom: 16,
  maxHeight: 150,
  overflow: 'auto',
}));

const SuggestionItem = styled(Box)(() => ({
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(40, 40, 40, 0.4)'
  }
}));

const UserAvatar = styled(Avatar)(() => ({
  width: 32,
  height: 32,
  fontSize: 14,
  marginRight: 12,
  backgroundColor: '#444444'
}));

const MarketPriceChip = styled(Box)(({ theme }) => ({
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
}));

const KBallsIcon = styled('img')({
  width: '16px',
  height: '16px',
  marginRight: '4px',
});

const ItemInfoModal = ({ 
  open, 
  onClose, 
  item, 
  userPoints, 
  onItemUpdate,
  onTransferSuccess 
}) => {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeConfirmOpen, setUpgradeConfirmOpen] = useState(false);
  const [userSearch, setUserSearch] = useState({
    loading: false,
    exists: false,
    suggestions: []
  });
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const debounceTimerRef = useRef(null);
  const [marketplaceModalOpen, setMarketplaceModalOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    if (!open) {
      setTransferModalOpen(false);
      setRecipientUsername('');
      setTransferError('');
      setUserSearch({ loading: false, exists: false, suggestions: [] });
      setSelectedRecipientId(null);
    }
  }, [open]);

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

  const handleEquipItem = async () => {
    try {
      const response = await fetch(`/api/inventory/equip/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification(data.message, 'success');
        onItemUpdate();
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Ошибка при надевании предмета', 'error');
    }
  };

  const handleUnequipItem = async () => {
    try {
      const response = await fetch(`/api/inventory/unequip/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification(data.message, 'success');
        onItemUpdate();
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Ошибка при снятии предмета', 'error');
    }
  };

  const handleUpgradeItem = async () => {
    setUpgradeConfirmOpen(false);
    try {
      setUpgradeLoading(true);
      const response = await fetch(`/api/inventory/upgrade/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        showNotification(data.message, 'success');
        onItemUpdate();
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Ошибка при улучшении предмета', 'error');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleTransferItem = () => {
    setRecipientUsername('');
    setTransferError('');
    setTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false);
    setRecipientUsername('');
    setTransferError('');
    setUserSearch({
      loading: false,
      exists: false,
      suggestions: []
    });
    setSelectedRecipientId(null);
  };

  const searchUser = (query) => {
    setUserSearch(prev => ({...prev, loading: true}));
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      const url = `/api/search/recipients?query=${encodeURIComponent(query)}`;
      axios.get(url)
        .then(response => {
          if (response.data && response.data.users && response.data.users.length > 0) {
            const exactMatch = response.data.users.find(u => 
              u.username.toLowerCase() === query.toLowerCase()
            );
            if (exactMatch) {
              setSelectedRecipientId(exactMatch.id);
            } else {
              setSelectedRecipientId(null);
            }
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: !!exactMatch,
              suggestions: response.data.users.slice(0, 3),
            }));
          } else {
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: false,
              suggestions: [],
            }));
            setSelectedRecipientId(null);
          }
        })
        .catch(error => {
          setUserSearch(prev => ({
            ...prev,
            loading: false,
            exists: false,
            suggestions: [],
          }));
          setSelectedRecipientId(null);
        });
    }, 300); 
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setRecipientUsername(username);
    if (username.trim()) {
      searchUser(username.trim());
    } else {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setUserSearch(prev => ({
        ...prev,
        loading: false,
        exists: false,
        suggestions: [],
      }));
      setSelectedRecipientId(null);
    }
  };

  const selectSuggestion = (username, userId) => {
    setRecipientUsername(username);
    setSelectedRecipientId(userId);
    setUserSearch(prev => ({
      ...prev,
      loading: false,
      exists: true,
      suggestions: []
    }));
  };

  const handleConfirmTransfer = async () => {
    if (!recipientUsername.trim()) {
      setTransferError('Введите имя пользователя');
      return;
    }
    if (!selectedRecipientId) {
      setTransferError('Пользователь не найден');
      return;
    }
    if (userPoints < 5000) {
      setTransferError('Недостаточно баллов для передачи (требуется 5000)');
      return;
    }
    setTransferLoading(true);
    setTransferError('');
    try {
      const response = await fetch(`/api/inventory/transfer/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_username: recipientUsername.trim()
        }),
      });
      const data = await response.json();
      if (data.success) {
        handleCloseTransferModal();
        if (typeof onTransferSuccess === 'function') onTransferSuccess();
        if (typeof onClose === 'function') onClose();
      } else {
        setTransferError(data.message || 'Ошибка передачи предмета');
      }
    } catch (err) {
      setTransferError('Ошибка сети');
    } finally {
      setTransferLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleListOnMarketplace = async () => {
    try {
      setMarketplaceLoading(true);
      const response = await axios.post(`/api/marketplace/list/${item.id}`, {
        price: parseInt(price)
      });
      
      if (response.data.success) {
        showNotification('Предмет выставлен на маркетплейс', 'success');
        onItemUpdate();
        setMarketplaceModalOpen(false);
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Ошибка при выставлении предмета', 'error');
    } finally {
      setMarketplaceLoading(false);
    }
  };

  const handleRemoveFromMarketplace = async () => {
    try {
      setMarketplaceLoading(true);
      const response = await axios.post(`/api/marketplace/cancel/${item.marketplace.id}`);
      
      if (response.data.success) {
        showNotification('Предмет снят с маркетплейса', 'success');
        onItemUpdate();
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Ошибка при снятии предмета', 'error');
    } finally {
      setMarketplaceLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `https://k-connect.ru/item/${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyStatus('Скопировано!');
      setTimeout(() => setCopyStatus(''), 1500);
    });
  };

  if (!item) return null;

  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <UpgradeEffects item={item}>
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 1
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Информация о предмете
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
                <UpgradeEffects item={item}>
                  <ItemImage sx={{
                    ...(item?.background_url && {
                      '&::before': {
                        backgroundImage: `url(${item.background_url})`,
                      }
                    })
                  }}>
                    <img src={item?.image_url} alt={item?.item_name} />
                  </ItemImage>
                </UpgradeEffects>
                {item?.marketplace?.status === 'active' && (
                  <MarketPriceChip>
                    <KBallsIcon src="/static/icons/KBalls.svg" alt="KBalls" />
                    {item.marketplace.price}
                  </MarketPriceChip>
                )}
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
                {item.upgrade_level === 1 && (
                  <Chip label="Улучшено" color="success" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Пак: {item.pack_name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Статус: {item.is_equipped ? 'Экипировано' : 'Не экипировано'}
                </Typography>
                {item.item_number && item.total_count && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Экземпляр: {item.item_number} из {item.total_count}
                  </Typography>
                )}
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
          </DialogContent>
          <DialogActions sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center', pb: 3, px: 3 }}>
            {!item.is_equipped ? (
              <Button
                variant="outlined"
                onClick={handleEquipItem}
                disabled={upgradeLoading}
                startIcon={upgradeLoading ? <CircularProgress size={16} /> : null}
                fullWidth
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                Экипировать
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleUnequipItem}
                disabled={upgradeLoading}
                startIcon={upgradeLoading ? <CircularProgress size={16} /> : null}
                fullWidth
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                Снять
              </Button>
            )}
            {item.upgradeable && item.upgrade_level === 0 && (
              <Button
                variant="outlined"
                onClick={() => setUpgradeConfirmOpen(true)}
                disabled={upgradeLoading || userPoints < Math.floor(item.pack_price ? item.pack_price / 2 : 0)}
                startIcon={upgradeLoading ? <CircularProgress size={16} /> : <UpgradeIcon />}
                fullWidth
                sx={{
                  borderColor: 'rgba(255, 152, 0, 0.3)',
                  color: '#ff9800',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'rgba(255, 152, 0, 0.5)',
                    backgroundColor: 'rgba(255, 152, 0, 0.05)',
                  },
                }}
              >
                {upgradeLoading ? 'Улучшение...' : `Улучшить (${Math.floor(item.pack_price ? item.pack_price / 2 : 0)} очков)`}
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handleTransferItem}
              startIcon={<SendIcon />}
              fullWidth
              disabled={userPoints < 5000}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  background: 'rgba(255, 255, 255, 0.05)',
                },
                '&:disabled': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'text.secondary',
                },
              }}
            >
              Передать (5000 баллов)
            </Button>
            {!item?.is_equipped && (
              item?.marketplace?.status === 'active' ? (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RemoveFromMarketIcon />}
                  onClick={handleRemoveFromMarketplace}
                  disabled={marketplaceLoading}
                  fullWidth
                >
                  {marketplaceLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Снять с продажи'
                  )}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<StoreIcon />}
                  onClick={() => setMarketplaceModalOpen(true)}
                  fullWidth
                >
                  Выставить на маркетплейс
                </Button>
              )
            )}
          </DialogActions>
        </UpgradeEffects>
      </StyledDialog>

      {/* Модалка передачи предмета */}
      <Dialog
        open={transferModalOpen}
        onClose={handleCloseTransferModal}
        maxWidth="sm"
        fullWidth
        fullScreen={window.innerWidth <= 768}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: window.innerWidth <= 768 ? 0 : 1,
            '@media (max-width: 768px)': {
              margin: 0,
              maxWidth: '100vw',
              maxHeight: '100vh',
              borderRadius: 0,
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'text.primary',
          pb: 1
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Передать предмет
          </Typography>
          <IconButton
            onClick={handleCloseTransferModal}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {item && (
            <>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <ItemImage sx={{ 
                  width: 125,
                  height: 125,
                  mb: 2,
                  ...(item?.background_url && {
                    '&::before': {
                      backgroundImage: `url(${item.background_url})`,
                    }
                  })
                }}>
                  <img 
                    src={item.image_url}
                    alt={item.item_name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </ItemImage>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.item_name}
                </Typography>
                <RarityChip
                  rarity={item.rarity || 'common'}
                  label={getRarityLabel(item.rarity || 'common')}
                  icon={getRarityIcon(item.rarity || 'common')}
                  size="small"
                />
              </Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Стоимость передачи: 5000 баллов
              </Alert>
              {transferError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {transferError}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Имя пользователя получателя"
                value={recipientUsername}
                onChange={handleUsernameChange}
                placeholder="Введите username получателя"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {userSearch.loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      )}
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                  },
                }}
              />
              {userSearch.suggestions.length > 0 && !userSearch.exists && (
                <SuggestionsContainer>
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                      Похожие пользователи:
                    </Typography>
                  </Box>
                  {userSearch.suggestions.map((user) => (
                    <SuggestionItem
                      key={user.id}
                      onClick={() => selectSuggestion(user.username, user.id)}
                    >
                      <UserAvatar 
                        src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : undefined}
                        alt={user.username}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </SuggestionItem>
                  ))}
                </SuggestionsContainer>
              )}
              {userSearch.exists && selectedRecipientId && (
                <Box sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: 'rgba(40, 40, 40, 0.4)', 
                  backdropFilter: 'blur(5px)',
                  borderRadius: 2,
                  border: '1px solid rgba(60, 60, 60, 0.4)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="body2">
                    Получатель подтвержден: <strong>{recipientUsername}</strong>
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseTransferModal}
            sx={{
              color: 'text.secondary',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirmTransfer}
            disabled={transferLoading || !recipientUsername.trim() || !selectedRecipientId || userPoints < 5000}
            variant="contained"
            startIcon={transferLoading ? <CircularProgress size={16} /> : <SendIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'text.primary',
              fontWeight: 500,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'text.secondary',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {transferLoading ? 'Передача...' : 'Передать'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модалка подтверждения улучшения */}
      <Dialog open={upgradeConfirmOpen} onClose={() => setUpgradeConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: '1.1rem', fontWeight: 600, pb: 1 }}>Вы уверены?</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Typography variant="body2">Потратить {Math.floor(item.pack_price ? item.pack_price / 2 : 0)} очков на улучшение этого предмета?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeConfirmOpen(false)} color="secondary" size="small">Нет</Button>
          <Button onClick={handleUpgradeItem} color="primary" size="small" disabled={upgradeLoading}>{upgradeLoading ? <CircularProgress size={16} /> : 'Да'}</Button>
        </DialogActions>
      </Dialog>

      {/* Marketplace Modal */}
      <Dialog
        open={marketplaceModalOpen}
        onClose={() => setMarketplaceModalOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle>
          Выставить на маркетплейс
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Укажите цену, за которую хотите продать предмет
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <img src="/static/icons/KBalls.svg" alt="KBalls" style={{ width: 16, height: 16 }} />
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMarketplaceModalOpen(false)} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={handleListOnMarketplace}
            variant="contained"
            color="primary"
            disabled={!price || marketplaceLoading}
          >
            {marketplaceLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Выставить'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            background: notification.severity === 'error' 
              ? 'rgba(244, 67, 54, 0.9)' 
              : notification.severity === 'warning'
              ? 'rgba(255, 152, 0, 0.9)'
              : notification.severity === 'info'
              ? 'rgba(33, 150, 243, 0.9)'
              : 'rgba(76, 175, 80, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            fontWeight: 500,
          }
        }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ 
            width: '100%',
            background: 'transparent',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ItemInfoModal; 