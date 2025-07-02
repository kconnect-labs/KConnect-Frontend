import React from 'react';
import { Box, SvgIcon } from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../context/LanguageContext';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';

const UserStatus = ({ statusText, statusColor }) => {
  const { t } = useLanguage();
  if (!statusText) return null;
  
  const getContrastTextColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const createGradientColor = (hexColor) => {
    let r = parseInt(hexColor.substr(1, 2), 16);
    let g = parseInt(hexColor.substr(3, 2), 16);
    let b = parseInt(hexColor.substr(5, 2), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if (brightness < 128) {
      r = Math.min(255, r + 30);
      g = Math.min(255, g + 30);
      b = Math.min(255, b + 30);
    } else {
      r = Math.max(0, r - 30);
      g = Math.max(0, g - 30);
      b = Math.max(0, b - 30);
    }
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const gradientColor = createGradientColor(statusColor || '#D0BCFF');
  const textColor = getContrastTextColor(statusColor || '#D0BCFF');

  const parseStatusText = (text) => {
    const iconTagRegex = /\{(\w+)\}/;
    const match = text.match(iconTagRegex);
    
    const result = {
      text: text,
      iconName: null
    };
    
    if (match) {
      result.iconName = match[1].toLowerCase();
      result.text = text.replace(iconTagRegex, '').trim();
    }
    
    return result;
  };
  
  const parsedStatus = parseStatusText(statusText);
  
  const getIconByName = (iconName) => {
    switch (iconName) {
      case 'minion':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M402.667 518C367.33 518 332.786 507.523 303.405 487.89C274.023 468.257 251.123 440.353 237.6 407.707C224.077 375.06 220.539 339.137 227.433 304.478C234.327 269.82 251.343 237.984 276.33 212.997C301.317 188.01 333.153 170.994 367.81 164.1C402.47 157.206 438.393 160.744 471.04 174.267C503.687 187.79 531.59 210.69 551.223 240.072C570.853 269.453 581.333 303.997 581.333 339.333C581.333 362.797 576.713 386.03 567.733 407.707C558.753 429.383 545.593 449.08 529.003 465.67C512.413 482.26 492.717 495.42 471.04 504.4C449.363 513.38 426.13 518 402.667 518ZM402.667 210.667C377.22 210.667 352.343 218.213 331.183 232.351C310.024 246.489 293.533 266.584 283.794 290.095C274.056 313.606 271.508 339.477 276.472 364.437C281.437 389.393 293.691 412.32 311.686 430.313C329.68 448.31 352.607 460.563 377.567 465.527C402.523 470.493 428.393 467.943 451.907 458.207C475.417 448.467 495.51 431.977 509.65 410.817C523.787 389.657 531.333 364.78 531.333 339.333C531.333 305.209 517.777 272.482 493.647 248.353C469.517 224.223 436.79 210.667 402.667 210.667Z" fill="currentColor"/>
            <path d="M400 643.667C376.53 643.72 353.28 639.123 331.597 630.14C309.913 621.157 290.224 607.97 273.667 591.333C269.251 586.593 266.847 580.327 266.961 573.85C267.075 567.373 269.699 561.193 274.28 556.613C278.86 552.033 285.04 549.407 291.516 549.293C297.993 549.18 304.261 551.583 309 556C333.693 579.057 366.216 591.88 400 591.88C433.783 591.88 466.31 579.057 491 556C495.74 551.583 502.006 549.18 508.483 549.293C514.96 549.407 521.14 552.033 525.72 556.613C530.303 561.193 532.926 567.373 533.04 573.85C533.153 580.327 530.75 586.593 526.333 591.333C509.776 607.97 490.086 621.157 468.403 630.14C446.72 639.123 423.47 643.72 400 643.667Z" fill="currentColor"/>
            <path d="M402.667 400C436.173 400 463.333 372.837 463.333 339.333C463.333 305.828 436.173 278.666 402.667 278.666C369.163 278.666 342 305.828 342 339.333C342 372.837 369.163 400 402.667 400Z" fill="currentColor"/>
            <path d="M666.666 755.333C660.036 755.333 653.676 752.7 648.99 748.01C644.3 743.323 641.666 736.963 641.666 730.333V333.333C637.156 272.944 609.983 216.492 565.596 175.297C521.21 134.102 462.89 111.209 402.333 111.209C341.776 111.209 283.457 134.102 239.07 175.297C194.684 216.492 167.511 272.944 163 333.333V730.333C163 736.963 160.366 743.323 155.678 748.01C150.989 752.7 144.631 755.333 138 755.333C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333V333.333C115.55 258.166 147.202 186.929 201.278 134.656C255.354 82.3832 327.623 53.1636 402.833 53.1636C478.043 53.1636 550.313 82.3832 604.39 134.656C658.466 186.929 690.116 258.166 692.666 333.333V730.333C692.623 733.69 691.913 737.003 690.58 740.08C689.246 743.16 687.313 745.943 684.893 748.27C682.476 750.597 679.62 752.417 676.49 753.63C673.36 754.843 670.023 755.423 666.666 755.333Z" fill="currentColor"/>
            <path d="M666.666 755.333H138C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333C113 723.703 115.634 717.343 120.322 712.657C125.011 707.967 131.37 705.333 138 705.333H666.666C673.296 705.333 679.656 707.967 684.343 712.657C689.033 717.343 691.666 723.703 691.666 730.333C691.666 736.963 689.033 743.323 684.343 748.01C679.656 752.7 673.296 755.333 666.666 755.333Z" fill="currentColor"/>
            </svg>
          </SvgIcon>
        );
      case 'heart':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z"/>
            </svg>
          </SvgIcon>
        );
      case 'star':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"/>
            </svg>
          </SvgIcon>
        );
      case 'music':
        return <MusicNoteIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'location':
        return <LocationOnIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'cake':
        return <CakeIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'chat':
        return <ChatIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      default:
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
          </SvgIcon>
        );
    }
  };
  
  const StatusIcon = getIconByName(parsedStatus.iconName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        delay: 0.2
      }}
      style={{
        position: 'absolute',
        left: '100%',
        top: '60%',
        zIndex: 10
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'transparent',
          filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.2))`,
          maxWidth: '200px',
          transform: 'translateX(10px)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: -8,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 14px 14px 0',
            borderColor: `transparent ${statusColor || '#D0BCFF'} transparent transparent`,
            transform: 'rotate(40deg)',
            filter: 'drop-shadow(-3px 2px 2px rgba(0,0,0,0.1))',
            zIndex: 0
          }
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${statusColor || '#D0BCFF'} 0%, ${gradientColor} 100%)`,
            color: textColor,
            padding: '8px 12px',
            borderRadius: '18px',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxShadow: `inset 0 0 10px rgba(255,255,255,0.15), 
                        0 1px 1px rgba(0,0,0,0.1),
                        0 4px 10px rgba(0,0,0,0.15)`,
            backdropFilter: 'blur(4px)',
            border: `1px solid ${statusColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            position: 'relative'
          }}
        >
          {StatusIcon}
          <Box 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '150px'
            }}
          >
            {parsedStatus.text}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default UserStatus; 