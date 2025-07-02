    import React from 'react';
    import { Box, Card, CardContent, Typography, CardActionArea, unstable_useEnhancedEffect } from '@mui/material';
    import { styled } from '@mui/material/styles';
    import { formatDistance } from 'date-fns';
    import Chip from '@mui/material/Chip';

    const StyledCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.spacing(2),
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.02)',
    },
    }));

    const ItemImage = styled('img')({
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    maxHeight: 200,
    });

    const PriceBadge = styled(Box)({
    position: 'absolute',
    top: 8,
    padding: '4px 8px',
    borderRadius: 12,
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    });

    const KBallsIcon = styled('img')({
    width: '16px',
    height: '16px',
    marginRight: '2px',
    });

    const rarityColors = {
    common: { bg: '#95a5a6', color: '#fff', label: 'Обычный' },
    rare: { bg: '#3498db', color: '#fff', label: 'Редкий' },
    epic: { bg: '#9b59b6', color: '#fff', label: 'Эпический' },
    legendary: { bg: '#f39c12', color: '#fff', label: 'Легендарный' },
    };

    const MarketplaceItemCard = ({ listing, onClick }) => {
    const { item, price, listed_at, seller_name } = listing;
    const timeAgo = formatDistance(new Date(listed_at), new Date(), { addSuffix: true });

    return (
        <StyledCard>
        <CardActionArea onClick={onClick}>
            <Box sx={{
              position: 'relative',
              width: 170,
              height: 170,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: 1,
              background: 'rgba(255,255,255,0.04)',
              margin: 'auto',
              marginTop: '12px',
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
              <ItemImage
                src={item.image_url}
                alt={item.item_name}
                loading="lazy"
                style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%' }}
              />
              <PriceBadge sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 3
              }}>
                <KBallsIcon src="/static/icons/KBalls.svg" alt="KBalls" />
                {price}
              </PriceBadge>
            </Box>
            <CardContent>
            <Typography variant="h6" gutterBottom>
                {item.item_name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {item.rarity && (
                <Chip
                    label={rarityColors[item.rarity]?.label || 'Обычный'}
                    sx={{
                    background: rarityColors[item.rarity]?.bg || rarityColors.common.bg,
                    color: rarityColors[item.rarity]?.color || rarityColors.common.color,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 1.5,
                    }}
                    size="small"
                />
                )}
            </Box>
            <Typography variant="body2" color="text.secondary">
                Продавец: {seller_name}
            </Typography>
            </CardContent>
        </CardActionArea>
        </StyledCard>
    );
    };

    export default MarketplaceItemCard; 