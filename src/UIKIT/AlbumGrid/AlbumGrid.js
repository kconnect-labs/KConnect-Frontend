import React, { memo } from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  Grid,
  Container
} from '@mui/material';
import MusicCard, { MusicCardSkeleton } from '../MusicCard';

const GridContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -8,
    width: 40,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(0.5),
  }
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(-0.5),
}));

const AlbumGrid = ({
  title,
  subtitle,
  items = [],
  loading = false,
  compact = false,
  spacing = 2,
  onItemPlay,
  onItemPause,
  onItemFavoriteToggle,
  onItemMoreClick,
  itemsPerRow = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  maxItems,
  renderItem,
  ...rest
}) => {

  if (loading) {
    return (
      <GridContainer {...rest}>
        {title && <SectionTitle variant="h5">{title}</SectionTitle>}
        {subtitle && <SectionSubtitle variant="body2">{subtitle}</SectionSubtitle>}
        
        <Grid container spacing={spacing}>
          {Array.from(new Array(maxItems || 8)).map((_, index) => (
            <Grid 
              item 
              key={index} 
              xs={12 / itemsPerRow.xs} 
              sm={12 / itemsPerRow.sm} 
              md={12 / itemsPerRow.md} 
              lg={12 / itemsPerRow.lg} 
              xl={12 / itemsPerRow.xl}
            >
              <MusicCardSkeleton compact={compact} />
            </Grid>
          ))}
        </Grid>
      </GridContainer>
    );
  }


  if (items.length === 0) {
    return null;
  }


  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <GridContainer {...rest}>
      {title && <SectionTitle variant="h5">{title}</SectionTitle>}
      {subtitle && <SectionSubtitle variant="body2">{subtitle}</SectionSubtitle>}
      
      <Grid container spacing={spacing}>
        {displayItems.map((item, index) => (
          <Grid 
            item 
            key={item.id || index} 
            xs={12 / itemsPerRow.xs} 
            sm={12 / itemsPerRow.sm} 
            md={12 / itemsPerRow.md} 
            lg={12 / itemsPerRow.lg} 
            xl={12 / itemsPerRow.xl}
          >
            {renderItem ? (
              renderItem(item, index)
            ) : (
              <MusicCard
                image={item.coverImage || item.image}
                title={item.title || item.name}
                artist={item.artist || item.artistName}
                isPlaying={item.isPlaying}
                isFavorite={item.isFavorite}
                onPlay={() => onItemPlay(item, index)}
                onPause={() => onItemPause(item, index)}
                onToggleFavorite={() => onItemFavoriteToggle(item, index)}
                onMoreClick={(event) => onItemMoreClick(event, item, index)}
                compact={compact}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default memo(AlbumGrid); 