import React, { memo } from 'react';
import { NavItemStyled, NavIconStyled, NavTextStyled } from './NavButton';
import { Box, styled } from '@mui/material';


const MoreButtonStyled = styled(NavItemStyled)(({ theme, active, themecolor }) => ({
  justifyContent: 'space-between',
  paddingRight: theme.spacing(1.8),
  marginTop: theme.spacing(0.8),
  '& .arrow-icon': {
    transition: 'transform 0.3s ease',
    transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
    color: active ? (themecolor || theme.palette.primary.main) : 
      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)'),
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
    }
  },
  '&:hover .arrow-icon': {
    color: active ? (themecolor || theme.palette.primary.main) : 
      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'),
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.1)',
    }
  }
}));


const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.active === nextProps.active &&
    prevProps.text === nextProps.text &&
    prevProps.onClick === nextProps.onClick
  );
};

const MoreButton = ({ 
  text, 
  icon, 
  active = false, 
  themeColor, 
  onClick,
  arrowIcon, 
  arrowUpIcon, 
  arrowDownIcon,
  ...rest 
}) => {

  const ArrowIcon = active ? 
    (arrowUpIcon || arrowIcon) : 
    (arrowDownIcon || arrowIcon);

  return (
    <MoreButtonStyled
      button
      onClick={onClick}
      active={active ? 1 : 0}
      themecolor={themeColor}
      {...rest}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <NavIconStyled 
          active={active ? 1 : 0}
          themecolor={themeColor}
        >
          {icon}
        </NavIconStyled>
        <NavTextStyled 
          primary={text} 
          active={active ? 1 : 0}
          themecolor={themeColor}
        />
      </Box>
      <Box className="arrow-icon">
        {ArrowIcon}
      </Box>
    </MoreButtonStyled>
  );
};

export default memo(MoreButton, areEqual); 