import React, { useContext, useState, useEffect, memo, useMemo } from 'react';
import { 
  Box, 
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';
import { SidebarProvider } from '../../context/SidebarContext';
import axios from 'axios';
import SidebarNavigation from './SidebarNavigation';
import UserProfileBlock from './UserProfileBlock';
import SidebarFooter from './SidebarFooter';


const SidebarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 1.5),
  borderRadius: theme.spacing(2),
  height: 'calc(100vh - 100px)',
  position: 'sticky',
  top: '84px',
  overflowY: 'auto',
  overflowX: 'hidden',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.07)',
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    width: '0px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
  },
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.up('md')]: {
    width: '230px',
    marginRight: 0,
    marginLeft: 'auto',
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(1.5, 1.2),
    width: '220px',
  },
  [theme.breakpoints.down('md')]: {
    width: '210px',
    padding: theme.spacing(1.2, 1),
  }
}));


const areEqual = (prevProps, nextProps) => {
  return true; 
};


const Sidebar = memo(() => {
  const { user } = useContext(AuthContext);
  const { themeSettings } = useContext(ThemeSettingsContext);
  const [isModeratorUser, setIsModeratorUser] = useState(false);
  const theme = useTheme();

  
  const themeValues = useMemo(() => {
  const sidebarBackgroundColor = themeSettings.paperColor || theme.palette.background.paper;
  const sidebarTextColor = themeSettings.textColor || theme.palette.text.primary;
  const primaryColor = themeSettings.primaryColor || theme.palette.primary.main;

  const sidebarStyle = {
    backgroundColor: sidebarBackgroundColor,
    color: sidebarTextColor,
    boxShadow: `0 4px 15px ${alpha('#000000', 0.07)}`,
    borderColor: alpha(sidebarTextColor, 0.08)
  };

    return {
      primaryColor,
      sidebarStyle
    };
  }, [themeSettings, theme]);

  
  const isAdmin = user?.id === 3;
  
  
  const isChannel = user?.account_type === 'channel';
  
  
  useEffect(() => {
    if (user) {
      checkModeratorStatus();
    }
  }, [user]);

  
  const [lastModeratorCheck, setLastModeratorCheck] = useState(0);

  const checkModeratorStatus = async () => {
    try {
      
      if (window._moderatorCheckInProgress) {
        console.log('Moderator check already in progress, skipping...');
        return;
      }
      
      
      const now = Date.now();
      if (now - lastModeratorCheck < 15 * 60 * 1000) {
        console.log('Using cached moderator status');
        return;
      }
      
      
      window._moderatorCheckInProgress = true;
      
      const response = await axios.get('/api/moderator/quick-status');
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
  
  
  const userNavData = useMemo(() => ({
    isAdmin,
    isModeratorUser,
    isChannel,
    user
  }), [isAdmin, isModeratorUser, isChannel, user]);

  return (
    <SidebarContainer elevation={2} style={themeValues.sidebarStyle}>
      <SidebarProvider>
      <Box>
          <UserProfileBlock 
            user={user} 
            primaryColor={themeValues.primaryColor} 
          />
          <SidebarNavigation 
            {...userNavData}
            primaryColor={themeValues.primaryColor}
                  />
                </Box>
      </SidebarProvider>
      
      <SidebarFooter primaryColor={themeValues.primaryColor} />
    </SidebarContainer>
  );
}, areEqual);

export default Sidebar;