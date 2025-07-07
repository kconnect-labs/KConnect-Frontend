import React, { memo } from 'react';
import { 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  styled,
  alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


const NavItemStyled = styled(ListItem)(({ theme, active, isspecial, themecolor }) => ({
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.8, 1.4),
  backgroundColor: active ? 
    'rgba(255, 255, 255, 0.1)' : 
    'transparent',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: active ? 
      'rgba(255, 255, 255, 0.15)' : 
      'rgba(255, 255, 255, 0.08)',
    transform: 'translateX(3px) scale(1.02)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: active ? '3px' : '0px',
    backgroundColor: isspecial ? '#f44336' : (themecolor || theme.palette.primary.main),
    borderRadius: '0 3px 3px 0',
    transition: 'width 0.3s ease, height 0.3s ease',
    boxShadow: active ? '0 0 8px rgba(0, 0, 0, 0.3)' : 'none',
  },
  '&:hover::before': {
    width: active ? '3px' : '2px',
    height: '60%',
    top: '20%',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0.7, 1.2),
    marginBottom: theme.spacing(0.4),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.6, 1.1),
    marginBottom: theme.spacing(0.3),
  }
}));


const NavIconStyled = styled(ListItemIcon)(({ theme, active, isspecial, themecolor }) => ({
  minWidth: '32px',
  color: active ? 
    (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
    (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)'),
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    filter: active ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' : 'none',
    transition: 'all 0.3s ease',
  },
  '.MuiListItem-root:hover &': {
    color: active ? 
      (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'),
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.15)',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
    }
  },
  [theme.breakpoints.down('lg')]: {
    minWidth: '30px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.15rem',
    },
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '28px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  }
}));


const NavTextStyled = styled(ListItemText)(({ theme, active, isspecial, themecolor }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 500,
    fontSize: '0.9rem',
    color: active 
      ? (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) 
      : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'),
    letterSpacing: active ? '0.4px' : '0.25px',
    transition: 'all 0.3s ease',
    textShadow: active ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
  },
  '.MuiListItem-root:hover & .MuiListItemText-primary': {
    letterSpacing: '0.4px',
    fontWeight: 600,
  },
  [theme.breakpoints.down('lg')]: {
    '& .MuiListItemText-primary': {
      fontSize: '0.85rem',
      letterSpacing: active ? '0.35px' : '0.2px',
    }
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiListItemText-primary': {
      fontSize: '0.8rem',
    }
  }
}));


const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.active === nextProps.active &&
    prevProps.path === nextProps.path &&
    prevProps.text === nextProps.text &&
    prevProps.isSpecial === nextProps.isSpecial &&
    prevProps.icon === nextProps.icon
  );
};


const NavButton = ({ 
  text, 
  icon, 
  path, 
  active = false, 
  isSpecial = false, 
  themeColor, 
  onClick,
  endIcon,
  endIconActive,
  component,
  nested = false,
  target,
  rel,
  ...rest 
}) => {

  const componentProps = path ? {
    component: RouterLink,
    to: path,
    target,
    rel
  } : {
    onClick
  };


  const nestedStyles = nested ? {
    pl: 2,
    borderRadius: (theme) => theme.spacing(1.2),
    marginBottom: (theme) => theme.spacing(0.4),
    padding: (theme) => theme.spacing(0.6, 1.2, 0.6, 2),
  } : {};

  return (
    <NavItemStyled
      button
      active={active ? 1 : 0}
      isspecial={isSpecial ? 'true' : undefined}
      themecolor={themeColor}
      {...componentProps}
      {...rest}
      sx={{...nestedStyles, ...rest.sx}}
    >
      {/* Если есть endIcon и нужно отображать его не в конце кнопки, используем Box для структуры контента */}
      {endIcon && !endIconActive ? (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon && (
              <NavIconStyled 
                active={active ? 1 : 0}
                isspecial={isSpecial ? 'true' : undefined}
                themecolor={themeColor}
              >
                {icon}
              </NavIconStyled>
            )}
            <NavTextStyled 
              primary={text} 
              active={active ? 1 : 0}
              isspecial={isSpecial ? 'true' : undefined}
              themecolor={themeColor}
            />
          </Box>
          {endIcon}
        </Box>
      ) : (
        <>
          {icon && (
            <NavIconStyled 
              active={active ? 1 : 0}
              isspecial={isSpecial ? 'true' : undefined}
              themecolor={themeColor}
            >
              {icon}
            </NavIconStyled>
          )}
          <NavTextStyled 
            primary={text} 
            active={active ? 1 : 0}
            isspecial={isSpecial ? 'true' : undefined}
            themecolor={themeColor}
          />
          {endIcon && endIconActive}
        </>
      )}
    </NavItemStyled>
  );
};


export { NavItemStyled, NavIconStyled, NavTextStyled };
export default memo(NavButton, areEqual); 