import React from 'react';
import { Box } from '@mui/material';
import {
  GlowEffect,
  AnimatedSparkle,
  AnimatedStar,
  EFFECTS_CONFIG,
  useUpgradeEffects
} from '../../../Economic/components/inventoryPack/upgradeEffectsConfig';

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

export default UpgradeEffects; 