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
  padding: theme.spacing(0.7, 1.3),
  backgroundColor: active ? 
    'rgba(255, 255, 255, 0.08)' : 
    'transparent',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active ? 
      'rgba(255, 255, 255, 0.12)' : 
      'rgba(255, 255, 255, 0.05)',
    transform: 'translateX(2px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '30%',
    height: '40%',
    width: active ? '2px' : '0px',
    backgroundColor: isspecial ? '#f44336' : (themecolor || theme.palette.primary.main),
    borderRadius: '0 2px 2px 0',
    transition: 'width 0.2s ease',
  },
  '&:hover::before': {
    width: active ? '2px' : '1px',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0.6, 1.1),
    marginBottom: theme.spacing(0.4),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5, 1),
    marginBottom: theme.spacing(0.3),
  }
}));


const NavIconStyled = styled(ListItemIcon)(({ theme, active, isspecial, themecolor }) => ({
  minWidth: '32px',
  color: active ? 
    (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
    (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
  transition: 'all 0.25s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.15rem',
    transition: 'transform 0.25s ease',
    filter: active ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : 'none',
  },
  '.MuiListItem-root:hover &': {
    color: active ? 
      (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) : 
      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'),
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.12)',
    }
  },
  [theme.breakpoints.down('lg')]: {
    minWidth: '30px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '26px',
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
    },
  }
}));


const NavTextStyled = styled(ListItemText)(({ theme, active, isspecial, themecolor }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: active ? 500 : 400,
    fontSize: '0.85rem',
    color: active 
      ? (isspecial ? '#f44336' : themecolor || theme.palette.primary.main) 
      : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'),
    letterSpacing: active ? '0.3px' : '0.2px',
    transition: 'all 0.25s ease',
    textShadow: active ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
  },
  '.MuiListItem-root:hover & .MuiListItemText-primary': {
    letterSpacing: '0.3px',
  },
  [theme.breakpoints.down('lg')]: {
    '& .MuiListItemText-primary': {
      fontSize: '0.8rem',
      letterSpacing: active ? '0.25px' : '0.15px',
    }
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiListItemText-primary': {
      fontSize: '0.75rem',
    }
  }
}));


const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.active === nextProps.active &&
    prevProps.path === nextProps.path &&
    prevProps.text === nextProps.text &&
    prevProps.isSpecial === nextProps.isSpecial
  );
};

// Основной компонент
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
  // Определяем компонент для рендеринга (RouterLink или div для onClick)
  const componentProps = path ? {
    component: RouterLink,
    to: path,
    target,
    rel
  } : {
    onClick
  };

  // Дополнительные стили для вложенных элементов
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

// Экспортируем также стилизованные компоненты, чтобы их можно было переиспользовать
export { NavItemStyled, NavIconStyled, NavTextStyled };
export default memo(NavButton, areEqual); 