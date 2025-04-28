import React, { useState, useEffect, useContext } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  Typography, 
  Avatar, 
  Box, 
  Divider, 
  CircularProgress, 
  Badge
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AccountSwitcher = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [accounts, setAccounts] = useState({
    current_account: null,
    main_account: null,
    channels: []
  });
  const [loading, setLoading] = useState(false);
  
  const open = Boolean(anchorEl);
  
  useEffect(() => {
    // Загружаем список аккаунтов пользователя
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/users/my-channels', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAccounts(data);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке аккаунтов:', error);
      }
    };
    
    if (user) {
      fetchAccounts();
    }
  }, [user]);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleSwitchAccount = async (accountId) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/switch-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Обновляем текущего пользователя
          setUser({
            ...data.account,
            id: data.account.id
          });
          
          // Перезагрузим страницу для применения изменений
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Ошибка при переключении аккаунта:', error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };
  
  const handleCreateChannel = () => {
    navigate('/register/channel');
    handleClose();
  };
  
  // Если пользователь не авторизован, не отображаем компонент
  if (!user) return null;
  
  return (
    <>
      <Button
        id="account-switcher-button"
        aria-controls={open ? 'account-switcher-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ 
          color: 'text.primary',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Avatar 
          src={user.avatar_url}
          sx={{ width: 28, height: 28 }}
        />
        {user.name}
        {user.account_type === 'channel' && (
          <Badge
            color="primary"
            badgeContent=""
            variant="dot"
            overlap="circular"
            sx={{ ml: 0.5 }}
          />
        )}
      </Button>
      <Menu
        id="account-switcher-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'account-switcher-button',
        }}
        PaperProps={{
          sx: {
            mt: 0.5,
            width: 240,
            bgcolor: 'background.paper',
            boxShadow: 5,
            borderRadius: 2
          }
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            
            {accounts.current_account && (
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {accounts.current_account.account_type === 'channel' ? 'Канал' : 'Ваш аккаунт'}
                </Typography>
                <MenuItem 
                  selected
                  sx={{ 
                    borderRadius: 1.5,
                    mb: 1 
                  }}
                >
                  <Avatar 
                    src={accounts.current_account.photo}
                    sx={{ width: 32, height: 32, mr: 1.5 }}
                  />
                  <Typography variant="body1" noWrap>
                    {accounts.current_account.name}
                  </Typography>
                </MenuItem>
              </Box>
            )}
            
            <Divider sx={{ my: 0.5 }} />
            
            
            {accounts.main_account && (
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Основной аккаунт
                </Typography>
                <MenuItem 
                  onClick={() => handleSwitchAccount(accounts.main_account.id)}
                  sx={{ 
                    borderRadius: 1.5,
                    mb: 1
                  }}
                >
                  <Avatar 
                    src={accounts.main_account.photo}
                    sx={{ width: 32, height: 32, mr: 1.5 }}
                  />
                  <Typography variant="body1" noWrap>
                    {accounts.main_account.name}
                  </Typography>
                </MenuItem>
              </Box>
            )}
            
            
            {accounts.channels && accounts.channels.length > 0 && (
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Ваши каналы
                </Typography>
                {accounts.channels.map(channel => (
                  <MenuItem 
                    key={channel.id}
                    onClick={() => handleSwitchAccount(channel.id)}
                    sx={{ 
                      borderRadius: 1.5,
                      mb: 0.5
                    }}
                  >
                    <Avatar 
                      src={channel.photo}
                      sx={{ width: 32, height: 32, mr: 1.5 }}
                    />
                    <Typography variant="body1" noWrap>
                      {channel.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
            )}
            
            <Divider sx={{ my: 0.5 }} />
            
            
            <Box sx={{ p: 1.5 }}>
              <MenuItem 
                onClick={handleCreateChannel}
                sx={{ 
                  borderRadius: 1.5
                }}
              >
                <AddIcon sx={{ mr: 1.5 }} />
                <Typography variant="body1">
                  Создать канал
                </Typography>
              </MenuItem>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default AccountSwitcher; 