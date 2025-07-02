import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close as CloseIcon,
  FiberManualRecord as DotIcon
} from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(18, 18, 18, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: window.innerWidth <= 768 ? 0 : '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    maxWidth: window.innerWidth <= 768 ? '100vw' : 400,
    width: window.innerWidth <= 768 ? '100%' : '90%',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      margin: 0,
      maxHeight: '100vh',
      borderRadius: 0,
    }
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  textAlign: 'center',
  minHeight: 320,
}));

const PackContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 140,
  height: 140,
  margin: '0 auto 32px',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
}));

const ItemContainer = styled(Box)(({ theme }) => ({
  width: 250,
  height: 250,
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  margin: '0 auto',
}));

const ItemImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: 8,
  maxWidth: '100%',
  maxHeight: '100%',
});

const RarityChip = styled(Chip)(({ rarity, theme }) => {
  const colors = {
    common: { bg: 'rgba(156, 163, 175, 0.2)', color: '#9CA3AF', border: 'rgba(156, 163, 175, 0.3)' },
    rare: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
    epic: { bg: 'rgba(147, 51, 234, 0.2)', color: '#9333EA', border: 'rgba(147, 51, 234, 0.3)' },
    legendary: { bg: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
  };
  
  return {
    background: colors[rarity]?.bg || colors.common.bg,
    color: colors[rarity]?.color || colors.common.color,
    border: `1px solid ${colors[rarity]?.border || colors.common.border}`,
    fontWeight: 500,
    fontSize: '0.875rem',
    padding: '6px 12px',
    backdropFilter: 'blur(10px)',
    '& .MuiChip-label': {
      padding: '2px 8px',
    },
  };
});

const LoadingDots = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  margin: '24px 0',
});

const PackOpeningModal = ({ pack, onClose, hasMorePacks = false, onOpenAnother, onBalanceUpdate }) => {
  const [opening, setOpening] = useState(true);
  const [obtainedItem, setObtainedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (pack && pack.purchase_id) {
      openPack();
    }
  }, [pack]);

  const openPack = async () => {
    try {
      const response = await fetch(`/api/inventory/packs/${pack.purchase_id}/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Имитируем задержку открытия
        setTimeout(() => {
          setObtainedItem(data.item);
          setOpening(false);
          setShowResult(true);
        }, 2500);
      } else {
        alert(data.message || 'Ошибка открытия пака');
        onClose();
      }
    } catch (err) {
      alert('Ошибка сети');
      onClose();
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

  const handleClose = () => {
    if (!opening) {
      onClose();
    }
  };

  const handleOpenAnother = async () => {
    if (!opening) {
      try {
        setOpening(true);
        setShowResult(false);
        setObtainedItem(null);
        
        // Покупаем новый пак того же типа
        const buyResponse = await fetch(`/api/inventory/packs/${pack.id}/buy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        const buyData = await buyResponse.json();
        
        if (buyData.success) {
          // Обновляем баланс пользователя
          if (onBalanceUpdate) {
            onBalanceUpdate(buyData.remaining_points);
          }
          
          // Открываем новый пак
          const openResponse = await fetch(`/api/inventory/packs/${buyData.purchase_id}/open`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const openData = await openResponse.json();
          
          if (openData.success) {
            // Имитируем задержку открытия
            setTimeout(() => {
              setObtainedItem(openData.item);
              setOpening(false);
              setShowResult(true);
            }, 2500);
          } else {
            alert(openData.message || 'Ошибка открытия пака');
            onClose();
          }
        } else {
          alert(buyData.message || 'Ошибка покупки пака');
          setOpening(false);
          setShowResult(true);
        }
      } catch (error) {
        console.error('Error buying/opening pack:', error);
        alert('Ошибка сети');
        setOpening(false);
        setShowResult(true);
      }
    }
  };

  return (
    <StyledDialog
      open={true}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={window.innerWidth <= 768}
      disableEscapeKeyDown={opening}
    >
      <DialogContent sx={{ p: 0 }}>
        <ModalContent>
          <IconButton
            onClick={handleClose}
            disabled={opening}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'rgba(255, 255, 255, 0.6)',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <AnimatePresence mode="wait">
            {opening ? (
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 400, 
                    mb: 4,
                    color: 'rgba(255, 255, 255, 0.9)',
                    letterSpacing: '0.5px'
                  }}
                >
                  Открытие пака
                </Typography>

                <PackContainer>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontSize: '3rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: 300
                      }}
                    >
                      ?
                    </Typography>
                  </motion.div>
                </PackContainer>

                <LoadingDots>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    >
                      <DotIcon sx={{ 
                        fontSize: 8, 
                        color: 'rgba(255, 255, 255, 0.6)' 
                      }} />
                    </motion.div>
                  ))}
                </LoadingDots>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.875rem',
                    fontWeight: 300
                  }}
                >
                  Обработка...
                </Typography>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 400, 
                    mb: 3,
                    color: 'rgba(255, 255, 255, 0.9)',
                    letterSpacing: '0.5px'
                  }}
                >
                  Получен предмет
                </Typography>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20,
                    delay: 0.2
                  }}
                >
                  <ItemContainer sx={{
                    ...(obtainedItem?.background_url && {
                      backgroundImage: `url(${obtainedItem.background_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    })
                  }}>
                    <ItemImage 
                      src={`/inventory/${obtainedItem?.id}`}
                      alt={obtainedItem?.name}
                      onError={(e) => {
                        console.error(`Failed to load image: /inventory/${obtainedItem?.id}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  </ItemContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500, 
                      mb: 2,
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontSize: '1.25rem'
                    }}
                  >
                    {obtainedItem?.name}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <RarityChip
                      rarity={obtainedItem?.rarity}
                      label={getRarityLabel(obtainedItem?.rarity)}
                    />
                  </Box>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      mb: 4,
                      fontSize: '0.875rem',
                      fontWeight: 300
                    }}
                  >
                    Предмет добавлен в инвентарь
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={handleOpenAnother}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                        borderRadius: '8px',
                        px: 3,
                        py: 1.5,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        background: 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          transform: 'translateY(-1px)'
                        },
                      }}
                    >
                      Купить еще
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={onClose}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                        borderRadius: '8px',
                        px: 3,
                        py: 1.5,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        background: 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          transform: 'translateY(-1px)'
                        },
                      }}
                    >
                      Продолжить
                    </Button>
                  </Box>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </ModalContent>
      </DialogContent>
    </StyledDialog>
  );
};

export default PackOpeningModal; 