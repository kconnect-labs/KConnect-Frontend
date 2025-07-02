import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Box, Grid, Typography, Select, MenuItem, FormControl, InputLabel, Slider, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import MarketplaceItemCard from './MarketplaceItemCard';
import MarketplaceModal from './MarketplaceModal';
import { FilterList, Sort } from '@mui/icons-material';
import InfoBlock from '../../../../UIKIT/InfoBlock';
import { AuthContext } from '../../../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import inventoryImageService from '../../../../services/InventoryImageService';

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const MarketplacePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [packs, setPacks] = useState([]);
  const location = useLocation();
  const [filters, setFilters] = useState({
    packId: '',
    rarity: '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'listed_at',
    sortOrder: 'desc'
  });
  const [filterTimeout, setFilterTimeout] = useState(null);
  const [error, setError] = useState(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Открываем модальное окно если пришли из профиля с ID предмета
  useEffect(() => {
    if (location.state?.openItemId && listings.length > 0) {
      const itemToOpen = listings.find(listing => listing.id === location.state.openItemId);
      if (itemToOpen) {
        setSelectedItem(itemToOpen);
      }
    }
  }, [location.state, listings]);

  // Функция для загрузки листингов
  const fetchListings = useCallback(async (currentFilters) => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    
    if (currentFilters.packId) {
      queryParams.append('pack_id', currentFilters.packId);
    }
    if (currentFilters.rarity) {
      queryParams.append('rarity', currentFilters.rarity);
    }
    if (currentFilters.minPrice > 0) {
      queryParams.append('min_price', currentFilters.minPrice);
    }
    if (currentFilters.maxPrice < 10000) {
      queryParams.append('max_price', currentFilters.maxPrice);
    }
    queryParams.append('sort_by', currentFilters.sortBy);
    queryParams.append('sort_order', currentFilters.sortOrder);

    try {
      const response = await axios.get(`/api/marketplace/listings?${queryParams.toString()}`);
      if (response.data.success) {
        setListings(response.data.listings);
        
        // Предзагружаем изображения для всех листингов
        if (response.data.listings && response.data.listings.length > 0) {
          const imageItems = response.data.listings.map(listing => ({
            item_id: listing.item.id
          }));
          await inventoryImageService.checkImagesBatch(imageItems);
        }
      } else {
        enqueueSnackbar(response.data.message || 'Failed to load marketplace items', { variant: 'error' });
      }
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
      enqueueSnackbar('Failed to load marketplace items', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Fetch available packs for filter
  const fetchPacks = async () => {
    try {
      const response = await axios.get('/api/inventory/packs');
      if (response.data.success) {
        setPacks(response.data.packs);
      }
    } catch (error) {
      console.error('Error fetching packs:', error);
    }
  };

  // Добавляем функцию для получения баллов пользователя
  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  // Fetch marketplace listings with filters and debouncing
  useEffect(() => {
    // Очищаем предыдущий таймаут
    if (filterTimeout) {
      clearTimeout(filterTimeout);
    }

    // Устанавливаем новый таймаут
    const timeoutId = setTimeout(() => {
      fetchListings(filters);
    }, 500); // Задержка в 500мс

    setFilterTimeout(timeoutId);

    // Очищаем таймаут при размонтировании
    return () => {
      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }
    };
  }, [filters, fetchListings]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    }));
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handlePurchaseSuccess = (item) => {
    // Запускаем фейерверк
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Запускаем частицы с разных сторон
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Показываем уведомление
    enqueueSnackbar(
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Поздравляем с покупкой!
        </Typography>
        <Typography variant="body2">
          Вы приобрели предмет "{item.item.item_name}" за {item.price} KBalls
        </Typography>
      </Box>,
      { 
        variant: 'success',
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      }
    );

    // Обновляем список предметов
    setSelectedItem(null);
    fetchListings(filters);
  };

  useEffect(() => {
    fetchPacks();
    fetchUserPoints();
    fetchListings(filters);
  }, []);

  return (
    <StyledContainer>
      <InfoBlock
        title="Маркетплейс"
        description="Торговая площадка для покупки и продажи коллекционных предметов между людьми"
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

      {/* Filters */}
      <StyledBox>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Пак</InputLabel>
              <Select
                value={filters.packId}
                onChange={handleFilterChange('packId')}
                label="Пак"
              >
                <MenuItem value="">Все Пачки</MenuItem>
                {packs.map(pack => (
                  <MenuItem key={pack.id} value={pack.id}>{pack.display_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Редкость</InputLabel>
              <Select
                value={filters.rarity}
                onChange={handleFilterChange('rarity')}
                label="Редкость"
              >
                <MenuItem value="">Все редкости</MenuItem>
                <MenuItem value="common">Обычный</MenuItem>
                <MenuItem value="rare">Редкий</MenuItem>
                <MenuItem value="epic">Эпический</MenuItem>
                <MenuItem value="legendary">Легендарный</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={handleFilterChange('sortBy')}
                label="Сортировка"
                startAdornment={<Sort />}
              >
                <MenuItem value="listed_at">Последние</MenuItem>
                <MenuItem value="price">Цена</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Порядок</InputLabel>
              <Select
                value={filters.sortOrder}
                onChange={handleFilterChange('sortOrder')}
                label="Порядок"
              >
                <MenuItem value="desc">По убыванию</MenuItem>
                <MenuItem value="asc">По возрастанию</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Диапазон цен</Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </StyledBox>

      {/* Items Grid */}
      <Grid container spacing={0.5} sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        px: 0.3,
        '& .MuiGrid-item': {
          flex: '0 0 calc(25% - 5px)',
          maxWidth: 'calc(25% - 5px)',
          minWidth: 'calc(25% - 5px)',
          margin: '2.5px !important',
          '@media (max-width: 768px)': {
            flex: '0 0 calc(50% - 5px)',
            maxWidth: 'calc(50% - 5px)',
            minWidth: 'calc(50% - 5px)',
          }
        }
      }}>
        {loading ? (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <CircularProgress 
                size={60} 
                sx={{
                  color: 'primary.main',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
              />
            </Box>
          </Grid>
        ) : listings.length === 0 ? (
          <Grid item xs={12}>
            <Box textAlign="center" py={8}>
              <Typography variant="h6" mb={2}>
                Предметы не найдены
              </Typography>
            </Box>
          </Grid>
        ) : (
          listings.map(listing => (
            <Grid item key={listing.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MarketplaceItemCard
                  listing={listing}
                  onClick={() => handleItemClick(listing)}
                />
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>

      {/* Purchase Modal */}
      {selectedItem && (
        <MarketplaceModal
          open={Boolean(selectedItem)}
          onClose={handleCloseModal}
          listing={selectedItem}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </StyledContainer>
  );
};

export default MarketplacePage; 