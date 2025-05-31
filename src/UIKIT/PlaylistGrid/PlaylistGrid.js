import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ThemeSettingsContext } from '../../App';
import PlaylistCard, { PlaylistCardSkeleton } from '../PlaylistCard';

const GridContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none', /* Firefox */
  '&::-webkit-scrollbar': {
    display: 'none', /* Chrome, Safari */
  },
  '-ms-overflow-style': 'none', /* IE and Edge */
  paddingBottom: theme.spacing(1),
  gap: theme.spacing(2),
  paddingRight: theme.spacing(2),
  WebkitOverflowScrolling: 'touch',
}));

const PlaylistItemContainer = styled(Box)(({ theme, width }) => ({
  flexShrink: 0,
  width: width,
}));

const PlaylistGrid = ({
  title,
  subtitle,
  playlists = [],
  loading = false,
  skeletonCount = 6,
  onPlaylistClick,
  onPlaylistPlay,
  onPlaylistMoreClick,
  compact = false,
  spacing = 2,
  ...rest
}) => {
  const theme = useTheme();
  const { themeSettings } = useContext(ThemeSettingsContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  if (!loading && playlists.length === 0) {
    return null;
  }

  
  let itemWidth = '20%'; 
  
  if (isMobile) {
    itemWidth = '40%'; 
  } else if (isTablet) {
    itemWidth = '30%'; 
  }

  if (loading) {
    return (
      <ScrollableContainer>
        {Array.from(new Array(skeletonCount)).map((_, index) => (
          <PlaylistItemContainer key={`skeleton-${index}`} width={itemWidth}>
            <PlaylistCardSkeleton />
          </PlaylistItemContainer>
        ))}
      </ScrollableContainer>
    );
  }

  return (
    <GridContainer {...rest}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          {subtitle}
        </Typography>
      )}
      
      {playlists.length > 0 ? (
        <ScrollableContainer>
          {playlists.map((playlist) => (
            <PlaylistItemContainer key={playlist.id} width={itemWidth}>
              <PlaylistCard
                id={playlist.id}
                name={playlist.name}
                description={playlist.description}
                coverImage={playlist.cover_image}
                tracksCount={playlist.tracks_count}
                previewTracks={playlist.preview_tracks}
                owner={playlist.owner}
                isPublic={playlist.is_public}
                isOwner={playlist.is_owner}
                onClick={() => onPlaylistClick && onPlaylistClick(playlist.id)}
                onMoreClick={(e) => onPlaylistMoreClick && onPlaylistMoreClick(e, playlist)}
              />
            </PlaylistItemContainer>
          ))}
        </ScrollableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          Нет доступных плейлистов
        </Typography>
      )}
    </GridContainer>
  );
};

export default PlaylistGrid; 