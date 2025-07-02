import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Diamond as DiamondIcon,
  Star as StarIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'visible',
  height: '480px',
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 768px)': {
    height: '420px',
  }
}));

const PackImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 200,
  background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.2) 0%, rgba(156, 100, 242, 0.2) 100%)',
  borderRadius: '16px 16px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(208, 188, 255, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const ItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

const MainItem = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 12,
  background: 'rgba(208, 188, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(208, 188, 255, 0.3)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    border: '2px solid rgba(208, 188, 255, 0.5)',
  },
}));

const SideItem = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 8,
  background: 'rgba(208, 188, 255, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(208, 188, 255, 0.2)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    border: '1px solid rgba(208, 188, 255, 0.4)',
  },
}));

const ItemImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: 'inherit',
});

const PriceChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  color: 'text.primary',
  fontWeight: 500,
  fontSize: '0.8rem',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiChip-label': {
    padding: '4px 8px',
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
    fontSize: '0.8rem',
    '& .MuiChip-label': {
      padding: '2px 8px',
    },
  };
});

const PackCard = ({ pack, userPoints, onBuy, disabled, onPackClick }) => {
  const [packContents, setPackContents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackContents();
  }, [pack.id]);

  const fetchPackContents = async () => {
    try {
      const response = await fetch(`/api/inventory/packs/${pack.id}`);
      const data = await response.json();
      
      if (data.success && data.pack.contents) {
        setPackContents(data.pack.contents);
      }
    } catch (err) {
      console.error('Error fetching pack contents:', err);
    }
  };

  const handleBuyClick = async (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    if (disabled) return;
    
    setLoading(true);
    try {
      await onBuy();
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (onPackClick) {
      onPackClick(pack, packContents);
    }
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

  // Выбираем 3 предмета для отображения
  const displayItems = packContents.slice(0, 3);
  const mainItem = displayItems[0];
  const sideItems = displayItems.slice(1, 3);

  // Функция для сокращения длинных описаний
  const truncateDescription = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const isSoldOut = pack.is_limited && (pack.max_quantity - pack.sold_quantity <= 0);

  return (
    <StyledCard onClick={handleCardClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PackImage>
        <ItemContainer>
          {sideItems[0] && (
            <SideItem>
              <Tooltip title={`${sideItems[0].item_name} (${getRarityLabel(sideItems[0].rarity)})`}>
                <ItemImage 
                  src={`/inventory/pack/${pack.id}/${sideItems[0].item_name}`}
                  alt={sideItems[0].item_name}
                  onError={(e) => {
                    console.error(`Failed to load image: /inventory/pack/${pack.id}/${sideItems[0].item_name}`);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image: /inventory/pack/${pack.id}/${sideItems[0].item_name}`);
                  }}
                />
              </Tooltip>
            </SideItem>
          )}
          
          <MainItem>
            {mainItem ? (
              <Tooltip title={`${mainItem.item_name} (${getRarityLabel(mainItem.rarity)})`}>
                <ItemImage 
                  src={`/inventory/pack/${pack.id}/${mainItem.item_name}`}
                  alt={mainItem.item_name}
                  onError={(e) => {
                    console.error(`Failed to load image: /inventory/pack/${pack.id}/${mainItem.item_name}`);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image: /inventory/pack/${pack.id}/${mainItem.item_name}`);
                  }}
                />
              </Tooltip>
            ) : (
              <Typography variant="body2" color="text.secondary">
                ???
              </Typography>
            )}
          </MainItem>
          
          {sideItems[1] && (
            <SideItem>
              <Tooltip title={`${sideItems[1].item_name} (${getRarityLabel(sideItems[1].rarity)})`}>
                <ItemImage 
                  src={`/inventory/pack/${pack.id}/${sideItems[1].item_name}`}
                  alt={sideItems[1].item_name}
                  onError={(e) => {
                    console.error(`Failed to load image: /inventory/pack/${pack.id}/${sideItems[1].item_name}`);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image: /inventory/pack/${pack.id}/${sideItems[1].item_name}`);
                  }}
                />
              </Tooltip>
            </SideItem>
          )}
        </ItemContainer>
      </PackImage>

      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            textAlign: 'center'
          }}
        >
          {pack.display_name}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary', 
            mb: 2,
            textAlign: 'center',
            fontSize: '0.85rem',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {truncateDescription(pack.description)}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
          <PriceChip 
            icon={<DiamondIcon />}
            label={`${pack.price} баллов`}
          />
          {pack.is_limited && (
            <Chip 
              icon={<LockIcon />}
              label={`Осталось: ${pack.max_quantity - pack.sold_quantity}`}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'text.secondary',
                fontSize: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '& .MuiChip-label': {
                  padding: '2px 6px',
                },
              }}
            />
          )}
        </Box>

        <Button
          variant="outlined"
          fullWidth
          disabled={disabled || loading || isSoldOut}
          onClick={handleBuyClick}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'text.primary',
            fontWeight: 500,
            borderRadius: 1,
            py: 1,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '&:disabled': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'text.secondary',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={16} />
          ) : isSoldOut ? (
            'Закончился'
          ) : disabled ? (
            'Недостаточно баллов'
          ) : (
            'Купить'
          )}
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default PackCard; 