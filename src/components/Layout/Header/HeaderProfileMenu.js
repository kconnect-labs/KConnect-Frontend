import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, Avatar, Typography, Chip, Button, Box, alpha, Tooltip, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import VerifiedIcon from '@mui/icons-material/Verified';
import TranslateIcon from '@mui/icons-material/Translate';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Icon } from '@iconify/react';

const HeaderProfileMenu = ({
  user,
  isMobile,
  t,
  theme,
  anchorEl,
  isMenuOpen,
  handleMenuClose,
  handleNavigate,
  handleLogout,
  handleCreateChannel,
  accounts,
  handleSwitchAccount,
  handleLanguageMenuOpen,
  languageMenuAnchorEl,
  isLanguageMenuOpen,
  handleLanguageMenuClose,
  handleLanguageChange,
  language
}) => {
  const isFullScreenMenu = isMobile;

  // Языковое меню
  const languageMenu = (
    <Menu
      anchorEl={languageMenuAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isLanguageMenuOpen}
      onClose={handleLanguageMenuClose}
      container={isFullScreenMenu ? document.body : undefined}
      PaperProps={{ 
        elevation: 3,
        sx: { 
          minWidth: isFullScreenMenu ? '100vw' : 200,
          maxWidth: isFullScreenMenu ? '100vw' : undefined,
          width: isFullScreenMenu ? '100vw' : undefined,
          margin: 0,
          borderRadius: isFullScreenMenu ? 0 : '14px',
          position: isFullScreenMenu ? 'fixed' : undefined,
          top: isFullScreenMenu ? '0 !important' : undefined,
          left: isFullScreenMenu ? '0 !important' : undefined,
          right: isFullScreenMenu ? '0 !important' : undefined,
          bottom: isFullScreenMenu ? '0 !important' : undefined,
          height: isFullScreenMenu ? '100vh' : undefined,
          maxHeight: isFullScreenMenu ? '100vh' : undefined,
          boxShadow: isFullScreenMenu ? 'none' : '0 8px 24px rgba(0,0,0,0.15)',
          border: isFullScreenMenu ? 'none' : (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'visible',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          '& .MuiMenuItem-root': {
            padding: '10px 16px',
            borderRadius: '8px',
            margin: '2px 8px',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }
          },
        }
      }}
    >
      <Box sx={{ px: 3, py: 2, textAlign: 'center' }}>
        {isMobile && (
          <IconButton
            onClick={handleLanguageMenuClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
        <TranslateIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('header.profile_menu.select_language')}
        </Typography>
      </Box>
      <Divider sx={{ opacity: 0.1, mx: 2, mb: 1 }} />
      <MenuItem 
        onClick={() => handleLanguageChange('RU')}
        selected={language === 'RU'}
      >
        <ListItemIcon>
          <img 
            src="/static/flags/ru.svg" 
            alt="Russian" 
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Russia_%28CMYK%29.png/120px-Flag_of_Russia_%28CMYK%29.png';
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Русский" />
        {language === 'RU' && (
          <Icon icon="solar:check-circle-bold" style={{ color: theme.palette.primary.main, marginLeft: 8 }} />
        )}
      </MenuItem>
      <MenuItem 
        onClick={() => handleLanguageChange('EN')}
        selected={language === 'EN'}
      >
        <ListItemIcon>
          <img 
            src="/static/flags/en.svg" 
            alt="English" 
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/2560px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png';
            }}
          />
        </ListItemIcon>
        <ListItemText primary="English" />
        {language === 'EN' && (
          <Icon icon="solar:check-circle-bold" style={{ color: theme.palette.primary.main, marginLeft: 8 }} />
        )}
      </MenuItem>
      <MenuItem 
        onClick={() => handleLanguageChange('JP')}
        selected={language === 'JP'}
      >
        <ListItemIcon>
          <img 
            src="/static/flags/jp.svg" 
            alt="Japanese" 
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1200px-Flag_of_Japan.svg.png';
            }}
          />
        </ListItemIcon>
        <ListItemText primary="日本語" />
        {language === 'JP' && (
          <Icon icon="solar:check-circle-bold" style={{ color: theme.palette.primary.main, marginLeft: 8 }} />
        )}
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        container={isFullScreenMenu ? document.body : undefined}
        PaperProps={{ 
          elevation: 3,
          sx: { 
            minWidth: isFullScreenMenu ? '100vw' : 280,
            maxWidth: isFullScreenMenu ? '100vw' : undefined,
            width: isFullScreenMenu ? '100vw' : undefined,
            margin: 0,
            borderRadius: isFullScreenMenu ? 0 : '14px',
            position: isFullScreenMenu ? 'fixed' : undefined,
            top: isFullScreenMenu ? '0 !important' : undefined,
            left: isFullScreenMenu ? '0 !important' : undefined,
            right: isFullScreenMenu ? '0 !important' : undefined,
            bottom: isFullScreenMenu ? '0 !important' : undefined,
            height: isFullScreenMenu ? '100vh' : undefined,
            maxHeight: isFullScreenMenu ? '100vh' : undefined,
            boxShadow: isFullScreenMenu ? 'none' : '0 8px 24px rgba(0,0,0,0.15)',
            border: isFullScreenMenu ? 'none' : (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'visible',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            '& .MuiMenuItem-root': {
              padding: '8px 14px',
              borderRadius: '8px',
              margin: '1px 6px',
              minHeight: '36px',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
              }
            },
            '& .MuiDivider-root': {
              margin: '4px 0',
            },
            '& .MuiTypography-caption': {
              padding: '4px 12px',
            }
          }
        }}
      >
        {user && (
          <>
            <Box sx={{ px: 2, py: 2, textAlign: 'center', position: 'relative' }}>
              {isMobile && (
                <IconButton
                  onClick={handleMenuClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <ClearIcon />
                </IconButton>
              )}
              <Avatar 
                src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
                alt={user.name || user.username} 
                sx={{ 
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                {user.name || user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                @{user.username}
              </Typography>
              {user.account_type === 'channel' && (
                <Chip 
                  size="small"
                  label={t('header.profile_menu.channel_label')}
                  color="primary"
                  sx={{ mt: 1, fontWeight: 500, px: 1 }}
                />
              )}
            </Box>
            <Divider sx={{ opacity: 0.1, mx: 2 }} />
            {isMobile && (
              <>
                <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}>
                  <Button
                    component="a"
                    href="/balance"
                    startIcon={<Icon icon="solar:wallet-money-bold" width="18" height="18" />}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      }
                    }}
                  >
                    {t('header.profile_menu.wallet')}
                  </Button>
                  <Button
                    component="a"
                    href="/badge-shop"
                    startIcon={<Icon icon="solar:shop-bold" width="18" height="18" />}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      }
                    }}
                  >
                    {t('header.profile_menu.shop')}
                  </Button>
                </Box>
                <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
              </>
            )}
            <MenuItem onClick={() => handleNavigate(`/profile/${user?.username}`)}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>{t('header.profile_menu.my_profile')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>{t('header.profile_menu.settings')}</ListItemText>
            </MenuItem>
            {isMobile && (
              <>
                <MenuItem onClick={() => handleNavigate('/search')}>
                  <ListItemIcon>
                    <Icon icon="solar:magnifer-bold" width="20" height="20" />
                  </ListItemIcon>
                  <ListItemText>{t('header.profile_menu.search')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/subscriptions')}>
                  <ListItemIcon>
                    <Icon icon="solar:users-group-rounded-bold" width="20" height="20" />
                  </ListItemIcon>
                  <ListItemText>{t('header.profile_menu.subscriptions')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/channels')}>
                  <ListItemIcon>
                    <Icon icon="solar:play-stream-bold" width="20" height="20" />
                  </ListItemIcon>
                  <ListItemText>{t('header.profile_menu.channels')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/leaderboard')}>
                  <ListItemIcon>
                    <Icon icon="solar:chart-bold" width="20" height="20" />
                  </ListItemIcon>
                  <ListItemText>{t('header.profile_menu.rating')}</ListItemText>
                </MenuItem>
              </>
            )}
            <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
            {accounts.channels.length < 3 && (
              <MenuItem onClick={handleCreateChannel}>
                <ListItemIcon>
                  <AddIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>{t('header.profile_menu.create_channel')}</ListItemText>
              </MenuItem>
            )}
            {accounts.main_account && accounts.current_account?.account_type === 'channel' && (
              <>
                <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    px: 3,
                    py: 0.5,
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  {t('header.profile_menu.main_account')}
                </Typography>
                <MenuItem 
                  key={accounts.main_account.id}
                  onClick={() => handleSwitchAccount(accounts.main_account.id)}
                >
                  <ListItemIcon>
                    <Avatar
                      src={accounts.main_account.photo}
                      sx={{ width: 30, height: 30 }}
                    />
                  </ListItemIcon>
                  <ListItemText>{accounts.main_account.name}</ListItemText>
                </MenuItem>
              </>
            )}
            {accounts.channels && accounts.channels.length > 0 && (
              <>
                <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    px: 3,
                    py: 0.5,
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  {t('header.profile_menu.my_channels')}
                </Typography>
                {accounts.channels.map(channel => (
                  <MenuItem 
                    key={channel.id}
                    onClick={() => handleSwitchAccount(channel.id)}
                  >
                    <ListItemIcon>
                      <Avatar
                        src={channel.photo}
                        sx={{ width: 30, height: 30 }}
                      />
                    </ListItemIcon>
                    <ListItemText>{channel.name}</ListItemText>
                  </MenuItem>
                ))}
              </>
            )}
            <Divider sx={{ opacity: 0.1, mx: 2, my: 1 }} />
            <MenuItem onClick={handleLanguageMenuOpen}>
              <ListItemIcon>
                <TranslateIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>{t('header.profile_menu.language')}</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                color: theme => theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.error.main, 0.08),
                }
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" style={{ color: 'inherit' }} />
              </ListItemIcon>
              <ListItemText>{t('header.profile_menu.logout')}</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
      {languageMenu}
    </>
  );
};

export default HeaderProfileMenu; 