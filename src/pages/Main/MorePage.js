import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Avatar, 
  Container, 
  Button, 
  Divider,
  IconButton,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { Icon } from '@iconify/react';
import GavelIcon from '@mui/icons-material/Gavel';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { VerificationBadge } from '../../UIKIT';


const ProfileBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 120,
  width: '100vw',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: 0,
}));

const ProfileAvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '-20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  padding: '2px',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  border: '2px solid',
  borderColor: theme.palette.background.paper,
  backgroundColor: theme.palette.primary.main,
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.1rem',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));


const MenuSection = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden', 
  marginBottom: theme.spacing(1),
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 600,
  color: alpha(theme.palette.text.secondary, 0.6),
  padding: theme.spacing(1, 1.5, 0.5),
  textTransform: 'none',
  letterSpacing: '0.1px',
}));


const MenuListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.8, 1.2),
  borderRadius: theme.spacing(1),
  transition: 'all 0.15s ease',
  maxWidth: 'calc(100% - 8px)',
  margin: theme.spacing(0, 0.5),
  marginBottom: 1,
  width: 'auto',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: 'translateX(1px)',
  },
  '& .MuiListItemText-root': {
    margin: 0,
    overflow: 'hidden',
    flexShrink: 1,
    minWidth: 0,
  },
  '& .MuiTypography-primary': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  '& .MuiTypography-secondary': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.65rem',
    color: alpha(theme.palette.text.secondary, 0.7),
  }
}));

const HighlightedMenuItem = styled(MenuListItem)(({ theme, color = 'primary' }) => ({
  backgroundColor: alpha(theme.palette[color].main, 0.03),
  margin: theme.spacing(0, 0.5),
  marginBottom: 1,
  maxWidth: 'calc(100% - 8px)',
  '&:hover': {
    backgroundColor: alpha(theme.palette[color].main, 0.06),
    transform: 'translateX(1px)',
  },
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  color: theme.palette.text.secondary,
  opacity: 0.8,
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  },
}));


const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(0.6, 1.2),
  flex: 1,
  minWidth: 0,
  marginBottom: 1,
  fontSize: '0.7rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  '& .MuiButton-startIcon': {
    marginRight: 4,
    opacity: 0.8,
    minWidth: 16,
  },
  '& .MuiButton-endIcon': {
    marginLeft: 0,
    marginRight: 0,
    opacity: 0.7,
  }
}));


const BalanceButton = styled(ActionButton)(({ theme }) => ({
  '& .number': {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  '& .unit': {
    marginLeft: 2,
    fontWeight: 500
  }
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(8),
  padding: theme.spacing(1.5),
  textAlign: 'center',
  opacity: 0.8,
}));

const StatCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: alpha(theme.palette.primary.main, 0.06),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5),
  flex: 1,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
  }
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: theme.palette.primary.main,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));


const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  if (num < 1000) return num.toString();
  
  const units = ['', 'k', 'M', 'B'];
  const unit = Math.floor((num.toFixed(0).length - 1) / 3);
  const value = (num / Math.pow(1000, unit)).toFixed(1);
  

  return `${parseFloat(value)}${units[unit]}`;
};

const MorePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useLanguage();
  const [userPoints, setUserPoints] = useState(0);
  const isAdmin = user?.id === 3; 
  const isChannel = user?.account_type === 'channel';
  const [isModeratorUser, setIsModeratorUser] = useState(false);
  const [lastModeratorCheck, setLastModeratorCheck] = useState(0);
  
  useEffect(() => {
    if (user) {
      checkModeratorStatus();
      fetchUserPoints();
    }
  }, [user]);

  const checkModeratorStatus = async () => {
    try {
      if (window._moderatorCheckInProgress) {
        console.log('MorePage: Moderator check already in progress, skipping...');
        return;
      }
      
      const now = Date.now();
      if (now - lastModeratorCheck < 15 * 60 * 1000) {
        console.log('MorePage: Using cached moderator status');
        return;
      }
      
      window._moderatorCheckInProgress = true;
      
      const response = await axios.get('/api/moderator/status');
      if (response.data && response.data.is_moderator) {
        setIsModeratorUser(true);
      } else {
        setIsModeratorUser(false);
      }
      
      setLastModeratorCheck(now);
    } catch (error) {
      console.error('Error checking moderator status:', error);
      setIsModeratorUser(false);
    } finally {
      window._moderatorCheckInProgress = false;
    }
  };
  
  const fetchUserPoints = async () => {
    try {
      const response = await axios.get('/api/user/points');
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Ошибка при загрузке баллов:', error);
      setUserPoints(0);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      pb: 10, 
      position: 'relative', 
      overflow: 'hidden',
      px: { xs: 1.5, sm: 2 }
    }}>
      {/* Profile Banner */}
      <ProfileBanner>
        <ProfileAvatarWrapper>
          <ProfileAvatar
            src={user?.avatar_url || (user?.photo && `/static/uploads/avatar/${user.id}/${user.photo}`)}
            alt={user?.name}
            onError={(e) => {
              console.error(t('more_page.errors.avatar_load_error'));
              e.target.src = `/static/uploads/avatar/system/avatar.png`;
            }}
          >
            {user?.name ? user.name.charAt(0) : '?'}
          </ProfileAvatar>
        </ProfileAvatarWrapper>
      </ProfileBanner>

      {/* Profile Info */}
      <Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ProfileName variant="h5">
          {user?.name || t('more_page.default_user')}
          {user?.verification && user.verification.status > 0 && (
            <VerificationBadge 
              status={user.verification.status} 
              size="small" 
            />
          )}
        </ProfileName>
        <Typography variant="body2" color="textSecondary" align="center">
          @{user?.username || t('more_page.default_username')}
        </Typography>
        
        {/* Primary Actions */}
        <Box sx={{ 
          display: 'flex', 
          width: '100%', 
          gap: 1,
          mt: 1,
          mb: 0.5,
          px: { xs: 1, sm: 1.5 },
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <BalanceButton
            component={Link}
            to="/balance"
            startIcon={<Icon icon="solar:wallet-money-bold" width="18" height="18" />}
            sx={{ px: 1 }}
          >
            <span className="number">{formatNumber(userPoints)}</span>
            <span className="unit">{t('more_page.points')}</span>
          </BalanceButton>
          
          <ActionButton
            component={Link}
            to="/badge-shop"
            startIcon={<Icon icon="solar:shop-bold" width="18" height="18" />}
            sx={{ px: 1 }}
          >
            {t('more_page.shop')}
          </ActionButton>
          
          <ActionButton
            component={Link}
            to="/settings"
            startIcon={<SettingsIcon sx={{ fontSize: '1rem' }} />}
            sx={{ px: 1 }}
          >
            {t('more_page.settings')}
          </ActionButton>
        </Box>
      </Box>

      {/* Social & Content */}
      <MenuSection>
        <SectionTitle>{t('more_page.sections.social.title')}</SectionTitle>
        <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
          <MenuListItem button component={Link} to="/search">
            <MenuItemIcon>
              <Icon icon="solar:magnifer-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.social.search')} />
          </MenuListItem>

          <MenuListItem button component={Link} to={user && user.username ? `/friends/${user.username}` : '/friends'}>
            <MenuItemIcon>
              <Icon icon="solar:users-group-rounded-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.social.subscriptions')} />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/channels">
            <MenuItemIcon>
              <Icon icon="solar:play-stream-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.social.channels')} />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/leaderboard">
            <MenuItemIcon>
              <Icon icon="solar:chart-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.social.rating')} />
          </MenuListItem>
        </List>
      </MenuSection>

      {/* Entertainment & Features */}
      <MenuSection>
        <SectionTitle>{t('more_page.sections.entertainment.title')}</SectionTitle>
        <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
        {!isChannel && (
            <HighlightedMenuItem 
              button 
              component={Link} 
              to="/minigames/clicker"
              color="secondary"
            >
              <MenuItemIcon sx={{ color: theme.palette.secondary.main }}>
                <Icon icon="solar:gamepad-bold" width="20" height="20" />
              </MenuItemIcon>
              <ListItemText 
                primary={t('more_page.sections.entertainment.minigames')}
              />
            </HighlightedMenuItem>
          )}
          <MenuListItem button component={Link} to="/economic/packs">
            <MenuItemIcon>
              <Icon icon="solar:box-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Пачки" />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/economic/inventory">
            <MenuItemIcon>
              <Icon icon="solar:bag-4-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Мой Инвентарь" />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/marketplace">
            <MenuItemIcon>
              <Icon icon="solar:shop-2-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary="Маркетплейс" />
          </MenuListItem>
          
          {!isChannel && (
            <MenuListItem button component={Link} to="/inform/sticker">
              <MenuItemIcon>
                <Icon icon="solar:sticker-smile-circle-2-bold" width="20" height="20" />
              </MenuItemIcon>
              <ListItemText primary="Управление стикерами" />
            </MenuListItem>
          )}
          
          <HighlightedMenuItem
            button 
            component={Link} 
            to="/grant"
            color="secondary"
          >
            <MenuItemIcon sx={{ color: theme.palette.secondary.main }}>
              <Icon icon="solar:star-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText 
              primary="Гранты каналам"
            />
            <Chip 
              label="NEW"
              size="small" 
              color="secondary" 
              sx={{ 
                height: 18, 
                fontSize: '0.6rem',
                fontWeight: 'bold',
                flexShrink: 0,
                ml: 0.5,
                maxWidth: 45
              }} 
            />
          </HighlightedMenuItem>
          
          <HighlightedMenuItem
            button 
            component={Link} 
            to="/username-auction"
          >
            <MenuItemIcon>
              <GavelIcon sx={{ fontSize: '1.1rem' }} />
            </MenuItemIcon>
            <ListItemText 
              primary={t('more_page.sections.entertainment.username_auction')}
              sx={{ flexShrink: 1, minWidth: 0 }}
            />
            <Chip 
              label={t('more_page.sections.entertainment.new_badge')}
              size="small" 
              color="primary" 
              sx={{ 
                height: 18, 
                fontSize: '0.6rem',
                fontWeight: 'bold',
                flexShrink: 0,
                ml: 0.5,
                maxWidth: 55
              }} 
            />
          </HighlightedMenuItem>
          
          {!isChannel && (
            <MenuListItem button component={Link} to="/sub-planes">
              <MenuItemIcon>
                <Icon icon="solar:star-bold" width="20" height="20" />
              </MenuItemIcon>
              <ListItemText primary={t('more_page.sections.entertainment.subscription_plans')} />
            </MenuListItem>
          )}
        </List>
      </MenuSection>

      {/* Admin Section */}
      {(isAdmin || isModeratorUser) && (
        <MenuSection>
          <SectionTitle>{t('more_page.sections.administration.title')}</SectionTitle>
          <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
            {isModeratorUser && (
              <HighlightedMenuItem 
                button 
                component={Link} 
                to="/moderator"
                color="error"
              >
                <MenuItemIcon sx={{ color: theme.palette.error.main }}>
                  <Icon icon="solar:shield-star-bold" width="20" height="20" />
                </MenuItemIcon>
                <ListItemText primary={t('more_page.sections.administration.moderation')} />
              </HighlightedMenuItem>
            )}

            {isAdmin && (
              <MenuListItem button component={Link} to="/admin">
                <MenuItemIcon>
                  <Icon icon="solar:shield-user-bold" width="20" height="20" />
                </MenuItemIcon>
                <ListItemText primary={t('more_page.sections.administration.admin_panel')} />
              </MenuListItem>
            )}
          </List>
        </MenuSection>
      )}

      {/* Platform Section */}
      <MenuSection>
        <SectionTitle>{t('more_page.sections.platform.title')}</SectionTitle>
        <List disablePadding sx={{ width: '100%', overflow: 'hidden', px: 0.5, boxSizing: 'border-box' }}>
          {!isChannel && (
            <MenuListItem button component={Link} to="/bugs">
              <MenuItemIcon>
                <Icon icon="solar:bug-bold" width="20" height="20" />
              </MenuItemIcon>
              <ListItemText primary={t('more_page.sections.platform.bug_reports')} />
            </MenuListItem>
          )}
          
          <MenuListItem button component={Link} to="/about" target="_blank" rel="noopener noreferrer">
            <MenuItemIcon>
              <Icon icon="solar:info-circle-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.platform.about')} />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/rules">
            <MenuItemIcon>
              <Icon icon="solar:document-text-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.platform.rules')} />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/messenger">
            <MenuItemIcon>
              <Icon icon="solar:code-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.platform.messenger')} />
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/documentapi">
            <MenuItemIcon>
              <Icon icon="solar:code-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText primary={t('more_page.sections.platform.api_docs')} />
          </MenuListItem>
          
          <Divider sx={{ my: 1, mx: 2 }} />
          
          <MenuListItem button onClick={handleLogout}>
            <MenuItemIcon sx={{ color: theme.palette.error.main }}>
              <Icon icon="solar:logout-3-bold" width="20" height="20" />
            </MenuItemIcon>
            <ListItemText 
              primary={t('more_page.sections.platform.logout')}
              primaryTypographyProps={{ sx: { color: theme.palette.error.main } }}
            />
          </MenuListItem>
        </List>
      </MenuSection>

      {/* Footer */}
      <FooterSection>
        <Typography variant="caption" display="block" color="primary" sx={{ fontWeight: 500, mb: 0.5 }}>
          {t('more_page.footer.version')}
        </Typography>
        <Typography variant="caption" display="block" color="textSecondary">
          {t('more_page.footer.email')}
        </Typography>
      </FooterSection>
    </Container>
  );
};

export default MorePage; 