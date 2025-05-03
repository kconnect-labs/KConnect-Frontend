import React, { memo, useMemo, useCallback, useContext } from 'react';
import { List, Collapse } from '@mui/material';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { NavButton, MoreButton } from '../../UIKIT';
import { SidebarContext } from '../../context/SidebarContext';


import homeIcon from '@iconify-icons/solar/home-bold';
import personIcon from '@iconify-icons/solar/user-bold';
import groupIcon from '@iconify-icons/solar/users-group-rounded-bold';
import musicIcon from '@iconify-icons/solar/music-notes-bold';
import messageIcon from '@iconify-icons/solar/chat-round-dots-bold';
import settingsIcon from '@iconify-icons/solar/settings-bold';
import searchIcon from '@iconify-icons/solar/magnifer-bold';
import arrowDownIcon from '@iconify-icons/solar/alt-arrow-down-bold';
import arrowUpIcon from '@iconify-icons/solar/alt-arrow-up-bold';
import bookmarkIcon from '@iconify-icons/solar/bookmark-bold';
import eventIcon from '@iconify-icons/solar/calendar-bold';
import gameIcon from '@iconify-icons/solar/gamepad-bold';
import peopleIcon from '@iconify-icons/solar/users-group-two-rounded-bold';
import bugIcon from '@iconify-icons/solar/bug-bold';
import adminIcon from '@iconify-icons/solar/shield-user-bold';
import chatIcon from '@iconify-icons/solar/chat-round-bold';
import leaderboardIcon from '@iconify-icons/solar/chart-bold';
import moderatorIcon from '@iconify-icons/solar/shield-star-bold';
import rulesIcon from '@iconify-icons/solar/document-text-bold';
import moreIcon from '@iconify-icons/solar/menu-dots-bold';
import shopIcon from '@iconify-icons/solar/shop-bold';
import apiIcon from '@iconify-icons/solar/code-bold';
import starIcon from '@iconify-icons/solar/star-bold';
import subscriptionIcon from '@iconify-icons/solar/crown-bold';

const SidebarNavigation = memo(({ 
  isAdmin, 
  isModeratorUser, 
  isChannel, 
  primaryColor,
  user
}) => {
  const location = useLocation();
  const { expandedMore, expandedAdminMod, toggleExpandMore, toggleExpandAdminMod } = useContext(SidebarContext);
  
  
  const isActive = useCallback((path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  }, [location.pathname]);
  
  
  const icons = useMemo(() => ({
    person: <Icon icon={personIcon} width="20" height="20" />,
    home: <Icon icon={homeIcon} width="20" height="20" />,
    music: <Icon icon={musicIcon} width="20" height="20" />,
    people: <Icon icon={peopleIcon} width="20" height="20" />,
    channels: <Icon icon="solar:users-group-rounded-bold" width="20" height="20" />,
    search: <Icon icon={searchIcon} width="20" height="20" />,
    shop: <Icon icon={shopIcon} width="20" height="20" />,
    admin: <Icon icon={adminIcon} width="20" height="20" />,
    moderator: <Icon icon={moderatorIcon} width="20" height="20" />,
    games: <Icon icon={gameIcon} width="20" height="20" />,
    subscription: <Icon icon={subscriptionIcon} width="20" height="20" />,
    more: <Icon icon={moreIcon} width="20" height="20" />,
    arrowUp: <Icon icon={arrowUpIcon} width="20" height="20" />,
    arrowDown: <Icon icon={arrowDownIcon} width="20" height="20" />,
    leaderboard: <Icon icon={leaderboardIcon} width="20" height="20" />,
    bug: <Icon icon={bugIcon} width="20" height="20" />,
    rules: <Icon icon={rulesIcon} width="20" height="20" />,
    api: <Icon icon={apiIcon} width="20" height="20" />
  }), []);
  
  
  const mainMenu = useMemo(() => (
    <>
      <NavButton
        text="Мой профиль"
        icon={icons.person}
        path={`/profile/${user?.username || user?.id}`}
        active={isActive(`/profile/${user?.username || user?.id}`)}
        themeColor={primaryColor}
      />
      
      <NavButton
        text="Лента"
        icon={icons.home}
        path="/"
        active={isActive('/')}
        themeColor={primaryColor}
      />
      
      <NavButton
        text="Музыка"
        icon={icons.music}
        path="/music"
        active={isActive('/music')}
        themeColor={primaryColor}
      />
      
      <NavButton
        text="Подписки"
        icon={icons.people}
        path="/subscriptions"
        active={isActive('/subscriptions')}
        themeColor={primaryColor}
      />
      
      <NavButton
        text="Каналы"
        icon={icons.channels}
        path="/channels"
        active={isActive('/channels')}
        themeColor={primaryColor}
      />
      
      <NavButton
        text="Поиск"
        icon={icons.search}
        path="/search"
        active={isActive('/search')}
        themeColor={primaryColor}
      />
      
      <NavButton
        text="Магазин бейджиков"
        icon={icons.shop}
        path="/badge-shop"
        active={isActive('/badge-shop')}
        themeColor={primaryColor}
      />
    </>
  ), [icons, isActive, primaryColor, user]);
  
  const adminModMenu = useMemo(() => (
    (isAdmin || isModeratorUser) && (
      <>
        <NavButton
          text="Управление"
          icon={icons.admin}
          active={expandedAdminMod}
          isSpecial={true}
          onClick={toggleExpandAdminMod}
          endIcon={expandedAdminMod ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        />
        
        <Collapse in={expandedAdminMod} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 1.5, pt: 0.5 }}>
            
            {isAdmin && (
              <NavButton
                text="Админ Панель"
                icon={icons.admin}
                path="/admin"
                active={isActive('/admin')}
                isSpecial={true}
                nested={true}
              />
            )}
            
            {isModeratorUser && (
              <NavButton
                text="Модерировать"
                icon={icons.moderator}
                path="/moderator"
                active={isActive('/moderator')}
                isSpecial={true}
                nested={true}
              />
            )}
          </List>
        </Collapse>
      </>
    )
  ), [icons, isActive, isAdmin, isModeratorUser, expandedAdminMod, toggleExpandAdminMod]);
  
  const extraMenu = useMemo(() => (
    !isChannel && (
      <>
        <NavButton
          text="Мини-игры"
          icon={icons.games}
          path="/minigames"
          active={isActive('/minigames')}
          themeColor={primaryColor}
        />
        
        <NavButton
          text="Планы подписок"
          icon={icons.subscription}
          path="/sub-planes"
          active={isActive('/sub-planes')}
          themeColor={primaryColor}
        />
      </>
    )
  ), [icons, isActive, isChannel, primaryColor]);
  
  const moreSection = useMemo(() => (
    <>
      <MoreButton 
        text="Еще"
        icon={icons.more}
        active={expandedMore}
        themeColor={primaryColor}
        onClick={toggleExpandMore}
        arrowUpIcon={icons.arrowUp}
        arrowDownIcon={icons.arrowDown}
      />

      <Collapse in={expandedMore} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1.5, pt: 0.5 }}>
          
          {!isChannel && (
            <>
              <NavButton
                text="Лидерборд"
                icon={icons.leaderboard}
                path="/leaderboard"
                active={isActive('/leaderboard')}
                themeColor={primaryColor}
                nested={true}
              />
              
              <NavButton
                text="Баг-репорты"
                icon={icons.bug}
                path="/bugs"
                active={isActive('/bugs')}
                themeColor={primaryColor}
                nested={true}
              />
            </>
          )}
          
          <NavButton
            text="Правила"
            icon={icons.rules}
            path="/rules"
            active={isActive('/rules')}
            themeColor={primaryColor}
            nested={true}
            target="_blank"
            rel="noopener noreferrer"
          />
          
          {/* <NavButton
            text="API Документация"
            icon={icons.api}
            path="/api-docs"
            active={isActive('/api-docs')}
            themeColor={primaryColor}
            nested={true}
          />
           */}
          <NavButton
            text="О платформе"
            icon={icons.rules}
            path="/about"
            active={isActive('/about')}
            themeColor={primaryColor}
            nested={true}
            target="_blank"
            rel="noopener noreferrer"
          />
        </List>
      </Collapse>
    </>
  ), [icons, isActive, isChannel, primaryColor, expandedMore, toggleExpandMore]);
  
  return (
    <List component="nav" sx={{ p: 1, mt: 1 }}>
      {mainMenu}
      {adminModMenu}
      {extraMenu}
      {moreSection}
    </List>
  );
});

export default SidebarNavigation; 