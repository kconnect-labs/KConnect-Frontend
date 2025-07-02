import React from 'react';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';
import TrackItem from './TrackItem.js';

const TrackList = ({ tracks, loading, onPlay, playingTrackId }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Typography color="text.secondary">Здесь пока ничего нет.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={0.5}>
      {tracks.map((track, index) => (
        <TrackItem
          key={track.id}
          track={track}
          index={index}
          isPlaying={playingTrackId === track.id}
          onPlay={onPlay}
        />
      ))}
    </Stack>
  );
};

export default TrackList; 