import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useLanguage } from '@/context/LanguageContext';
import TranslateIcon from '@mui/icons-material/Translate';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        size="small"
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <TranslateIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => handleLanguageChange('RU')}
          selected={currentLanguage === 'RU'}
        >
          Русский
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageChange('EN')}
          selected={currentLanguage === 'EN'}
        >
          English
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 