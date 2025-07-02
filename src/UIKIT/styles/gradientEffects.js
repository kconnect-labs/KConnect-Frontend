import { alpha } from '@mui/material/styles';

export const gradientEffects = {
  before: {
    content: '""',
    position: 'absolute',
    left: -80,
    top: '50%',
    transform: 'translateY(-50%) rotate(-12deg)',
    width: 180,
    height: 220,
    background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
    opacity: 0.25,
    filter: 'blur(18px)',
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  after: {
    content: '""',
    position: 'absolute',
    right: -80,
    top: '50%',
    transform: 'translateY(-50%) rotate(12deg)',
    width: 180,
    height: 220,
    background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
    opacity: 0.25,
    filter: 'blur(18px)',
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  beforeTop: {
    content: '""',
    position: 'absolute',
    left: -80,
    top: 0,
    transform: 'rotate(-12deg)',
    width: 180,
    height: 90,
    background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
    opacity: 0.25,
    filter: 'blur(18px)',
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  afterTop: {
    content: '""',
    position: 'absolute',
    right: -80,
    top: 0,
    transform: 'rotate(12deg)',
    width: 180,
    height: 90,
    background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
    opacity: 0.25,
    filter: 'blur(18px)',
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  },
};

export const getGradientEffects = (theme, variant = 'dark', customColors, options = {}) => {
  const colors = customColors || {
    start: '#B69DF8',
    end: '#D0BCFF'
  };
  const position = options.position || 'center';

  if (position === 'top') {
    return {
      '&::before': {
        ...gradientEffects.beforeTop,
        background: `linear-gradient(13.89deg, ${colors.start} 47.02%, ${colors.end} 97.69%)`,
        opacity: variant === 'dark' ? 0.25 : 0.15,
      },
      '&::after': {
        ...gradientEffects.afterTop,
        background: `linear-gradient(13.89deg, ${colors.start} 47.02%, ${colors.end} 97.69%)`,
        opacity: variant === 'dark' ? 0.25 : 0.15,
      },
    };
  }

  return {
    '&::before': {
      ...gradientEffects.before,
      background: `linear-gradient(13.89deg, ${colors.start} 47.02%, ${colors.end} 97.69%)`,
      opacity: variant === 'dark' ? 0.25 : 0.15,
    },
    '&::after': {
      ...gradientEffects.after,
      background: `linear-gradient(13.89deg, ${colors.start} 47.02%, ${colors.end} 97.69%)`,
      opacity: variant === 'dark' ? 0.25 : 0.15,
    },
  };
};

export const gradientBorder = (theme, variant = 'dark') => ({
  border: `1px solid ${variant === 'dark' ? 'rgba(255, 255, 255, 0.1)' : alpha(theme.palette.primary.main, 0.2)}`,
  background: variant === 'dark' 
    ? '#1c1c1c' 
    : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 2,
}); 