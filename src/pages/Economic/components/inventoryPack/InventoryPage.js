import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Avatar,
  InputAdornment,
  Snackbar,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Diamond as DiamondIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnequippedIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Upgrade as UpgradeIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import InfoBlock from '../../../../UIKIT/InfoBlock';
import StyledTabs from '../../../../UIKIT/StyledTabs';
import ItemInfoModal from './ItemInfoModal';
import {
  GlowEffect,
  AnimatedSparkle,
  AnimatedStar,
  EFFECTS_CONFIG,
  extractDominantColor,
  getFallbackColor,
  useUpgradeEffects
} from './upgradeEffectsConfig';
import inventoryImageService from '../../../../services/InventoryImageService';

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
}));

const ItemImage = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  margin: '0 auto 16px',
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

const PageTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  fontWeight: 700,
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
    fontSize: '0.8rem',
    '& .MuiChip-label': {
      padding: '2px 8px',
    },
  };
});

const SuggestionsContainer = styled(Box)(() => ({
  backgroundColor: 'rgba(20, 20, 20, 0.4)',
  backdropFilter: 'blur(5px)',
  borderRadius: 8,
  marginBottom: 24,
  maxHeight: 200,
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

const PriceBadge = styled(Box)({
  position: 'absolute',
  top: 8,
  right: 8,
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  color: '#fff',
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  zIndex: 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

const KBallsIcon = styled('img')({
  width: '16px',
  height: '16px',
  marginRight: '4px',
});

const InventoryTab = forwardRef(({ userId, itemIdToOpen }, ref) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemInfo, setShowItemInfo] = useState(false);
  const [externalItem, setExternalItem] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState('');
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [showEquipped, setShowEquipped] = useState(true);
  const { user } = useAuth();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });
  
  // Пагинация
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 15,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInventory();
      fetchUserPoints();
    }
  }, [user]);

  useEffect(() => {
    if (itemIdToOpen) {
      // Сначала ищем в инвентаре
      const found = items.find(i => String(i.id) === String(itemIdToOpen));
      if (found) {
        setSelectedItem(found);
        setShowItemInfo(true);
        setExternalItem(null);
        setExternalError('');
      } else {
        // Если нет — грузим отдельно
        setExternalLoading(true);
        setExternalError('');
        setShowItemInfo(true);
        setSelectedItem(null);
        fetch(`/api/inventory/item/${itemIdToOpen}`)
          .then(r => r.json())
          .then(data => {
            if (data.success && data.item) {
              setExternalItem(data.item);
            } else {
              setExternalError('Не удалось получить предмет');
            }
          })
          .catch(() => setExternalError('Ошибка при получении предмета'))
          .finally(() => setExternalLoading(false));
      }
    }
  }, [itemIdToOpen, items]);

  const fetchInventory = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await axios.get(`/api/inventory/my-inventory?page=${page}&per_page=15`);
      if (response.data.success) {
        const newItems = response.data.items;
        
        if (append) {
          setItems(prevItems => [...prevItems, ...newItems]);
        } else {
          setItems(newItems);
        }
        
        // Обновляем пагинацию
        setPagination(response.data.pagination);
        setHasMore(response.data.pagination.has_next);
        
        // Предзагружаем изображения для новых предметов
        if (newItems && newItems.length > 0) {
          await inventoryImageService.preloadInventoryImages(newItems);
        }
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      if (!append) {
        setError('Ошибка при загрузке инвентаря');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreItems = () => {
    if (!loadingMore && hasMore) {
      fetchInventory(pagination.page + 1, true);
    }
  };

  // Обработчик прокрутки для бесконечной загрузки
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loadingMore && hasMore) {
      loadMoreItems();
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const handleEquipItem = async (itemId) => {
    try {
      const response = await fetch(`/api/inventory/equip/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification(data.message);
        fetchInventory();
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Ошибка при надевании предмета', 'error');
    }
  };

  const handleUnequipItem = async (itemId) => {
    try {
      const response = await fetch(`/api/inventory/unequip/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification(data.message);
        fetchInventory();
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Ошибка при снятии предмета', 'error');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemInfo(true);
  };

  const handleCloseItemInfoModal = () => {
    setShowItemInfo(false);
    setSelectedItem(null);
  };

  const handleItemUpdate = () => {
    fetchInventory(1, false); // Перезагружаем с первой страницы
    fetchUserPoints();
  };

  const handleTransferSuccess = () => {
    fetchInventory(1, false); // Перезагружаем с первой страницы
    fetchUserPoints();
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return <DiamondIcon sx={{ fontSize: 16 }} />;
      case 'epic':
        return <StarIcon sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return '#f39c12';
      case 'epic':
        return '#9b59b6';
      case 'rare':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'Легендарный';
      case 'epic':
        return 'Эпический';
      case 'rare':
        return 'Редкий';
      case 'common':
        return 'Обычный';
      default:
        return rarity;
    }
  };

  const filteredItems = activeTab === 0 
    ? items 
    : activeTab === 1 
    ? items.filter(item => item.is_equipped)
    : items.filter(item => !item.is_equipped);

  const tabs = [
    {
      value: 0,
      label: `Все (${items.length})`
    },
    {
      value: 1,
      label: `Надетые (${items.filter(item => item.is_equipped).length})`
    },
    {
      value: 2,
      label: `Не надетые (${items.filter(item => !item.is_equipped).length})`
    }
  ];

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

  const handleUpgradeItem = async (item) => {
    if (!item.upgradeable || item.upgrade_level >= 1) {
      return;
    }

    try {
      setUpgrading(true);
      const response = await axios.post(`/api/inventory/upgrade/${item.id}`);
      
      if (response.data.success) {
        setUserPoints(response.data.remaining_points);
        // Обновляем предмет в списке
        setItems(prevItems => 
          prevItems.map(i => 
            i.id === item.id 
              ? { ...i, upgrade_level: response.data.upgrade_level }
              : i
          )
        );
        alert(`Предмет "${item.item_name}" успешно улучшен!`);
      } else {
        alert(response.data.message || 'Ошибка улучшения предмета');
      }
    } catch (error) {
      console.error('Error upgrading item:', error);
      alert('Ошибка при улучшении предмета');
    } finally {
      setUpgrading(false);
    }
  };

  const handleTransferItem = async () => {
    if (!selectedItem || !recipientUsername.trim()) {
      return;
    }

    try {
      setTransferring(true);
      const response = await axios.post(`/api/inventory/transfer/${selectedItem.id}`, {
        recipient_username: recipientUsername.trim()
      });
      
      if (response.data.success) {
        setUserPoints(response.data.remaining_points);
        // Удаляем предмет из списка
        setItems(prevItems => prevItems.filter(i => i.id !== selectedItem.id));
        setTransferDialogOpen(false);
        setRecipientUsername('');
        setSelectedItem(null);
        alert(`Предмет "${selectedItem.item_name}" успешно передан!`);
      } else {
        alert(response.data.message || 'Ошибка передачи предмета');
      }
    } catch (error) {
      console.error('Error transferring item:', error);
      alert('Ошибка при передаче предмета');
    } finally {
      setTransferring(false);
    }
  };

  useImperativeHandle(ref, () => ({
    openItemModalById: (id) => {
      const item = items.find(i => String(i.id) === String(id));
      if (item) {
        setSelectedItem(item);
        setShowItemInfo(true);
      }
    }
  }));

  if (!user) {
    return (
      <StyledContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h5">
            Необходимо авторизоваться для просмотра инвентаря
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  if (loading) {
    return (
      <StyledContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <StyledCard>
          <CardContent>
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
            <Button 
              onClick={fetchInventory} 
              variant="contained" 
              sx={{ mt: 2, display: 'block', mx: 'auto' }}
            >
              Попробовать снова
            </Button>
          </CardContent>
        </StyledCard>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer onScroll={handleScroll} sx={{ height: '100vh', overflowY: 'auto' }}>
      <InfoBlock
        title="Мой Инвентарь"
        description="Лимитированные вещи в коннекте - коллекционные предметы, которые можно получить из паков и сундуков"
        styleVariant="dark"
        sx={{ 
          textAlign: 'center',
          mb: 1,
          '& .MuiTypography-h5': {
            textAlign: 'center',
            fontWeight: 600
          },
          '& .MuiTypography-body2': {
            textAlign: 'center',
            opacity: 0.8
          }
        }}
      />

      <Box sx={{ mb: 1 }}>
        <StyledTabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          tabs={tabs}
          variant="standard"
          centered
          fullWidth
        />
      </Box>

      {filteredItems.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" mb={2}>
            {activeTab === 0 
              ? 'У вас пока нет предметов в инвентаре'
              : activeTab === 1 
              ? 'У вас нет надетых предметов'
              : 'У вас нет ненадетых предметов'
            }
          </Typography>
          {activeTab === 0 && (
            <Button 
              variant="contained"
              href="/economic/packs"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Купить Пачки
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={0.5} sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            px: 0.3, // 2.5px с каждой стороны
            '& .MuiGrid-item': {
              flex: '0 0 calc(25% - 5px)',
              maxWidth: 'calc(25% - 5px)',
              minWidth: 'calc(25% - 5px)',
              margin: '2.5px !important', // 5px между карточками
              '@media (max-width: 768px)': {
                flex: '0 0 calc(50% - 5px)',
                maxWidth: 'calc(50% - 5px)',
                minWidth: 'calc(50% - 5px)',
              }
            }
          }}>
            {filteredItems.map((item) => (
              <Grid item key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <StyledCard onClick={() => handleItemClick(item)} sx={{ height: 250 }}>
                    <UpgradeEffects item={item}>
                      <CardContent sx={{ textAlign: 'center', p: 2, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        {item?.marketplace?.status === 'active' && (
                          <PriceBadge>
                            <KBallsIcon src="/static/icons/KBalls.svg" alt="KBalls" />
                            {item.marketplace.price}
                          </PriceBadge>
                        )}
                        <ItemImage sx={{ 
                          width: 100, 
                          height: 100, 
                          mb: 2,
                          transition: 'all 0.3s ease',
                          ...(item.background_url && {
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

                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.item_name}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                          <RarityChip
                            rarity={item.rarity} 
                            label={getRarityLabel(item.rarity)}
                            size="small"
                          />
                        </Box>

                        <Typography 
                          variant="caption" 
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {item.pack_name}
                        </Typography>

                        <Typography 
                          variant="caption" 
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.7rem',
                            opacity: 0.7,
                            mt: 'auto',
                            pt: 1
                          }}
                        >
                          Нажмите для подробностей
                        </Typography>
                      </CardContent>
                    </UpgradeEffects>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          {/* Индикатор загрузки для пагинации */}
          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={40} />
            </Box>
          )}
          
          {/* Информация о загрузке */}
          {!loadingMore && hasMore && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Прокрутите вниз для загрузки еще предметов
              </Typography>
            </Box>
          )}
          
          {/* Информация о конце списка */}
          {!hasMore && items.length > 0 && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Загружено {items.length} из {pagination.total} предметов
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Модальное окно информации о предмете */}
      <ItemInfoModal
        open={showItemInfo}
        onClose={() => setShowItemInfo(false)}
        item={selectedItem || externalItem}
        loading={externalLoading}
        error={externalError}
        readOnly={!!externalItem}
        userPoints={userPoints}
        onItemUpdate={handleItemUpdate}
        onTransferSuccess={handleTransferSuccess}
      />

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
    </StyledContainer>
  );
});

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

export default InventoryTab; 