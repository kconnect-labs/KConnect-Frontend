import React from 'react';
import { Box, rgbToHex, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getGradientEffects, gradientBorder } from '../styles/gradientEffects';
import { rgba } from 'framer-motion';

const InfoBlockContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'customStyle',
})(({ theme, styleVariant = 'default', customStyle = false }) => (
  customStyle
    ? {
        width: '100%',
        margin: '0 auto',
        marginBottom: theme.spacing(1),
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        color: theme.palette.text.primary,
        textAlign: 'left',
        padding: 14,
        borderRadius: 16,
      }
    : {
        width: '100%',
        margin: '0 auto',
        marginBottom: theme.spacing(1),
        ...gradientBorder(theme, styleVariant),
        background: 'rgba(26,26,26, 0.03)',
        backdropFilter: 'blur(20px)',
        color: styleVariant === 'dark' ? 'white' : theme.palette.text.primary,
        textAlign: 'left',
        padding: 14,
        ...getGradientEffects(theme, styleVariant),
      }
));

const StyledTitle = styled('div')(({ theme, styleVariant = 'default' }) => ({
  fontWeight: 700,
  margin: 0,
  color: styleVariant === 'dark' ? 'white' : theme.palette.text.primary,
  marginBottom: 0,
  ...theme.components?.InfoBlock?.styleOverrides?.title,
}));

const StyledDescription = styled('div')(({ theme, styleVariant = 'default' }) => ({
  color: styleVariant === 'dark' ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
  ...theme.components?.InfoBlock?.styleOverrides?.description,
}));

/**
 * InfoBlock component for displaying information with gradient effects
 * @param {Object} props
 * @param {string} props.title - Title of the info block
 * @param {string} props.description - Description text
 * @param {React.ReactNode} props.children - Optional children content
 * @param {string} props.styleVariant - 'default' | 'dark' - Visual variant of the block
 * @param {Object} props.sx - Additional styles for the container
 * @param {Object} props.titleSx - Additional styles for the title
 * @param {Object} props.descriptionSx - Additional styles for the description
 * @param {boolean} props.customStyle - Whether to use custom style
 */
const InfoBlock = ({
  title,
  description,
  children,
  styleVariant = 'default',
  sx,
  titleSx,
  descriptionSx,
  customStyle = false,
  ...props
}) => {
  const theme = useTheme();

  return (
    <InfoBlockContainer styleVariant={styleVariant} sx={sx} customStyle={customStyle} {...props}>
      {title && (
        <StyledTitle styleVariant={styleVariant} style={titleSx}>
          <Typography variant="h5" sx={{ margin: 0 }}>
            {title}
          </Typography>
        </StyledTitle>
      )}
      {description && (
        <StyledDescription styleVariant={styleVariant} style={descriptionSx}>
          <Typography variant="body2">
            {description}
          </Typography>
        </StyledDescription>
      )}
      {children}
    </InfoBlockContainer>
  );
};

export default InfoBlock;
