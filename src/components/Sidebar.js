import React, { useContext, useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Paper,
  Typography,
  Avatar,
  Button,
  Badge,
  Collapse,
  Tooltip,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeSettingsContext } from '../../App';
import axios from 'axios';

<NavIcon 
  active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
  themecolor={primaryColor}
>
  <Icon icon="solar:user-bold" width="20" height="20" />
</NavIcon>

<Icon icon="solar:home-bold" width="20" height="20" />
<Icon icon="solar:music-notes-bold" width="20" height="20" />
<Icon icon="solar:users-group-two-rounded-bold" width="20" height="20" />
<Icon icon="solar:magnifer-bold" width="20" height="20" />
<Icon icon="solar:gamepad-bold" width="20" height="20" />
<Icon icon="solar:shop-bold" width="20" height="20" />
<Icon icon="solar:crown-bold" width="20" height="20" />
<Icon icon="solar:shield-star-bold" width="20" height="20" />
<Icon icon="solar:shield-user-bold" width="20" height="20" />
<Icon icon="solar:menu-dots-bold" width="20" height="20" />
<Icon icon="solar:alt-arrow-up-bold" width="20" height="20" />
<Icon icon="solar:alt-arrow-down-bold" width="20" height="20" />
<Icon icon="solar:chart-bold" width="20" height="20" />
<Icon icon="solar:bug-bold" width="20" height="20" />
<Icon icon="solar:document-text-bold" width="20" height="20" />
<Icon icon="solar:code-bold" width="20" height="20" /> 

const Sidebar = ({ mobile, closeDrawer }) => {
  

  
  const mainMenuItems = [
    { text: 'Мой профиль', iconName: 'solar:user-bold', path: `/profile/${user?.username || user?.id}` },
    { text: 'Лента', iconName: 'solar:home-bold', path: '/' },
    { text: 'Музыка', iconName: 'solar:music-notes-bold', path: '/music' },
    { text: 'Подписки', iconName: 'solar:users-group-two-rounded-bold', path: '/subscriptions' },
    { text: 'Поиск', iconName: 'solar:magnifer-bold', path: '/search' },
    { text: 'Мини-игры', iconName: 'solar:gamepad-bold', path: '/minigames' },
    { text: 'Магазин бейджиков', iconName: 'solar:shop-bold', path: '/badge-shop' },
    { text: 'Планы подписок', iconName: 'solar:crown-bold', path: '/sub-planes' },
  ];

  
  const moreMenuItems = [
    { text: 'Лидерборд', iconName: 'solar:chart-bold', path: '/leaderboard' },
    { text: 'Баг-репорты', iconName: 'solar:bug-bold', path: '/bugs' },
    { text: 'Правила', iconName: 'solar:document-text-bold', path: '/rules' },
    { text: 'API Документация', iconName: 'solar:code-bold', path: '/api-docs' },
  ];

  

  return (
    <SidebarContainer elevation={2}>
      <Box>
        {user && (
          <UserProfile>
            {}
          </UserProfile>
        )}

        <List component="nav" sx={{ p: 1, mt: 1 }}>
          {}
          <NavItem
            button
            component={RouterLink}
            to={`/profile/${user?.username || user?.id}`}
            active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:user-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Мой профиль" 
              active={isActive(`/profile/${user?.username || user?.id}`) ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          {isModeratorUser && (
            <NavItem
              button
              component={RouterLink}
              to="/moderator"
              active={isActive('/moderator') ? 1 : 0}
              isSpecial={1}
            >
              <NavIcon 
                active={isActive('/moderator') ? 1 : 0}
                isSpecial={1}
              >
                <Icon icon="solar:shield-star-bold" width="20" height="20" />
              </NavIcon>
              <NavText 
                primary="Модерировать" 
                active={isActive('/moderator') ? 1 : 0}
                isSpecial={1}
              />
            </NavItem>
          )}
          
          {}
          <NavItem
            button
            component={RouterLink}
            to="/"
            active={isActive('/') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:home-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Лента" 
              active={isActive('/') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          <NavItem
            button
            component={RouterLink}
            to="/music"
            active={isActive('/music') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/music') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:music-notes-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Музыка" 
              active={isActive('/music') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          <NavItem
            button
            component={RouterLink}
            to="/subscriptions"
            active={isActive('/subscriptions') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/subscriptions') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:users-group-two-rounded-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Подписки" 
              active={isActive('/subscriptions') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          <NavItem
            button
            component={RouterLink}
            to="/search"
            active={isActive('/search') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/search') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:magnifer-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Поиск" 
              active={isActive('/search') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          <NavItem
            button
            component={RouterLink}
            to="/minigames"
            active={isActive('/minigames') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/minigames') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:gamepad-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Мини-игры" 
              active={isActive('/minigames') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          <NavItem
            button
            component={RouterLink}
            to="/badge-shop"
            active={isActive('/badge-shop') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/badge-shop') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:shop-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Магазин бейджиков" 
              active={isActive('/badge-shop') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          <NavItem
            button
            component={RouterLink}
            to="/sub-planes"
            active={isActive('/sub-planes') ? 1 : 0}
            themecolor={primaryColor}
          >
            <NavIcon 
              active={isActive('/sub-planes') ? 1 : 0}
              themecolor={primaryColor}
            >
              <Icon icon="solar:crown-bold" width="20" height="20" />
            </NavIcon>
            <NavText 
              primary="Планы подписок" 
              active={isActive('/sub-planes') ? 1 : 0}
              themecolor={primaryColor}
            />
          </NavItem>
          
          {}
          {isAdmin && (
            <NavItem
              button
              component={RouterLink}
              to="/admin"
              active={isActive('/admin') ? 1 : 0}
              themecolor={primaryColor}
            >
              <NavIcon 
                active={isActive('/admin') ? 1 : 0}
                themecolor={primaryColor}
              >
                <Icon icon="solar:shield-user-bold" width="20" height="20" />
              </NavIcon>
              <NavText 
                primary="Админ Панель" 
                active={isActive('/admin') ? 1 : 0}
                themecolor={primaryColor}
              />
            </NavItem>
          )}

          {}
          <MoreButton 
            button 
            onClick={toggleExpandMore}
            active={expandMore ? 1 : 0}
            themecolor={primaryColor}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavIcon 
                active={expandMore ? 1 : 0}
                themecolor={primaryColor}
              >
                <Icon icon="solar:menu-dots-bold" width="20" height="20" />
              </NavIcon>
              <NavText 
                primary="Еще" 
                active={expandMore ? 1 : 0}
                themecolor={primaryColor}
              />
            </Box>
            <Box className="arrow-icon">
              {expandMore ? 
                <Icon icon="solar:alt-arrow-up-bold" width="20" height="20" /> : 
                <Icon icon="solar:alt-arrow-down-bold" width="20" height="20" />
              }
            </Box>
          </MoreButton>

          <Collapse in={expandMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1.5, pt: 0.5 }}>
              {}
              <NestedItem
                button
                component={RouterLink}
                to="/leaderboard"
                active={isActive('/leaderboard') ? 1 : 0}
                themecolor={primaryColor}
              >
                <NavIcon 
                  active={isActive('/leaderboard') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <Icon icon="solar:chart-bold" width="20" height="20" />
                </NavIcon>
                <NavText 
                  primary="Лидерборд" 
                  active={isActive('/leaderboard') ? 1 : 0}
                  themecolor={primaryColor}
                />
              </NestedItem>
              
              {}
              <NestedItem
                button
                component={RouterLink}
                to="/bugs"
                active={isActive('/bugs') ? 1 : 0}
                themecolor={primaryColor}
              >
                <NavIcon 
                  active={isActive('/bugs') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <Icon icon="solar:bug-bold" width="20" height="20" />
                </NavIcon>
                <NavText 
                  primary="Баг-репорты" 
                  active={isActive('/bugs') ? 1 : 0}
                  themecolor={primaryColor}
                />
              </NestedItem>
              
              {}
              <NestedItem
                button
                component={RouterLink}
                to="/rules"
                active={isActive('/rules') ? 1 : 0}
                themecolor={primaryColor}
              >
                <NavIcon 
                  active={isActive('/rules') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <Icon icon="solar:document-text-bold" width="20" height="20" />
                </NavIcon>
                <NavText 
                  primary="Правила" 
                  active={isActive('/rules') ? 1 : 0}
                  themecolor={primaryColor}
                />
              </NestedItem>
              
              {}
              <NestedItem
                button
                component={RouterLink}
                to="/api-docs"
                active={isActive('/api-docs') ? 1 : 0}
                themecolor={primaryColor}
              >
                <NavIcon 
                  active={isActive('/api-docs') ? 1 : 0}
                  themecolor={primaryColor}
                >
                  <Icon icon="solar:code-bold" width="20" height="20" />
                </NavIcon>
                <NavText 
                  primary="API Документация" 
                  active={isActive('/api-docs') ? 1 : 0}
                  themecolor={primaryColor}
                />
              </NestedItem>
            </List>
          </Collapse>
        </List>
      </Box>

      {}
    </SidebarContainer>
  );
};

export default Sidebar; 