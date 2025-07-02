import React from 'react';
import { Tooltip, SvgIcon } from '@mui/material';

/**
 * Modern verification badge component with different styles based on status
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.status - Verification status code
 * @param {string} props.size - Size of the badge ('small' or default)
 * @returns {React.ReactElement}
 */
const VerifiedBadge = React.forwardRef((props, ref) => (
  <SvgIcon 
    ref={ref}
    sx={{ 
      fontSize: props.size === 'small' ? 24 : 21,
      ml: 0.5,
      color: props.color,
      filter: `drop-shadow(0 0 3px ${props.color}66)`,
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1L12,1z M19,11c0,4.52-2.98,8.69-7,9.93 C7.98,19.69,5,15.52,5,11V6.3l7-3.11l7,3.11V11z M7.41,11.59L10,14.17l6.59-6.59L18,9l-8,8l-4-4L7.41,11.59z"/>
    </svg>
  </SvgIcon>
));

const OfficialBadge = React.forwardRef((props, ref) => (
  <SvgIcon 
    ref={ref}
    sx={{ 
      fontSize: props.size === 'small' ? 24 : 21,
      ml: 0.5,
      color: props.color,
      filter: `drop-shadow(0 0 3px ${props.color}66)`,
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17l-2.59-2.58z"/>
    </svg>
  </SvgIcon>
));

const VIPBadge = React.forwardRef((props, ref) => (
  <SvgIcon 
    ref={ref}
    sx={{ 
      fontSize: props.size === 'small' ? 24 : 21,
      ml: 0.5,
      color: props.color,
      filter: `drop-shadow(0 0 3px ${props.color}66)`,
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M18,11.09c0,4-2.55,7.7-6,8.83 c-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12l6,2.12V11.09z M8.82,10.59L7.4,12l3.54,3.54l7.05-7.05l-1.41-1.41l-5.64,5.64L8.82,10.59z"/>
      <path d="M16.5 6L12 4L7.5 6L12 8z"/>
    </svg>
  </SvgIcon>
));

const ModeratorBadge = React.forwardRef((props, ref) => (
  <SvgIcon 
    ref={ref}
    sx={{ 
      fontSize: props.size === 'small' ? 24 : 21,
      ml: 0.5,
      color: props.color,
      filter: `drop-shadow(0 0 3px ${props.color}66)`,
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11z"/>
      <path d="M12 7l-1.44 3.61h-3.74l2.94 2.15-1.13 3.47L12 14.25l3.37 1.98-1.12-3.47 2.94-2.15h-3.74L12 7z"/>
    </svg>
  </SvgIcon>
));

const SupportBadge = React.forwardRef((props, ref) => (
  <SvgIcon 
    ref={ref}
    sx={{ 
      fontSize: props.size === 'small' ? 24 : 21,
      ml: 0.5,
      color: props.color,
      filter: `drop-shadow(0 0 3px ${props.color}66)`,
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11z"/>
      <path d="M12 6.5c-2.49 0-4.5 2.01-4.5 4.5 0 1.79 1.05 3.33 2.56 4.06l-0.01 2.94h3.89l-0.01-2.94c1.52-0.73 2.57-2.27 2.57-4.06 0-2.49-2.01-4.5-4.5-4.5z"/>
    </svg>
  </SvgIcon>
));

const ChannelVerifiedBadge = React.forwardRef((props, ref) => (
  <SvgIcon 
    ref={ref}
    sx={{ 
      fontSize: props.size === 'small' ? 26 : 22,
      ml: 0.5,
      color: '#1e88e5',
      filter: 'drop-shadow(0 0 4px rgba(30, 136, 229, 0.4))',
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm2.59 7l-3.59-3.59L9.59 11 12 13.41 16.41 9 18 10.59l-6 6z"/>
    </svg>
  </SvgIcon>
));

const ChannelPremiumBadge = React.forwardRef((props, ref) => (
  <SvgIcon 
    ref={ref}
    sx={{ 
      fontSize: props.size === 'small' ? 26 : 22,
      ml: 0.5,
      color: '#7c4dff',
      filter: 'drop-shadow(0 0 4px rgba(124, 77, 255, 0.4))',
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 6l2.25 4.5 5.25.75-3.75 3.65.87 5.1L12 17.25 7.38 20l.87-5.1-3.75-3.65 5.25-.75z"/>
    </svg>
  </SvgIcon>
));

const VerificationBadge = React.forwardRef(({ status, size }, ref) => {
  if (!status) return null;
  
  const getColorAndTitle = (status) => {
    if (status === 'verified') {
      return { color: '#D0BCFF', title: 'Верифицирован' };
    }
    
    switch(Number(status)) {
      case 1:
        return { color: '#9e9e9e', title: 'Верифицирован' };
      case 2:
        return { color: '#d67270', title: 'Официальный аккаунт' };
      case 3:
        return { color: '#b39ddb', title: 'VIP аккаунт' };
      case 4:
        return { color: '#ff9800', title: 'Модератор' };
      case 5:
        return { color: '#4caf50', title: 'Поддержка' };
      case 6:
        return { color: '#1e88e5', title: 'Канал (Верифицированный)', isChannelVerified: true };
      case 7:
        return { color: '#7c4dff', title: 'Канал (Премиум)', isChannelPremium: true };
      default:
        return { color: '#D0BCFF', title: 'Верифицирован' };
    }
  };
  
  const { color, title, isChannelVerified, isChannelPremium } = getColorAndTitle(status);

  return (
    <Tooltip title={title} placement="top" arrow>
      {isChannelVerified ? (
        <ChannelVerifiedBadge ref={ref} size={size} />
      ) : isChannelPremium ? (
        <ChannelPremiumBadge ref={ref} size={size} />
      ) : Number(status) === 2 ? (
        <OfficialBadge ref={ref} size={size} color={color} />
      ) : Number(status) === 3 ? (
        <VIPBadge ref={ref} size={size} color={color} />
      ) : Number(status) === 4 ? (
        <ModeratorBadge ref={ref} size={size} color={color} />
      ) : Number(status) === 5 ? (
        <SupportBadge ref={ref} size={size} color={color} />
      ) : (
        <VerifiedBadge ref={ref} size={size} color={color} />
      )}
    </Tooltip>
  );
});

export default VerificationBadge; 