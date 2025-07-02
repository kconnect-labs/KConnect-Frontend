import React from 'react';
import { Box, ClickAwayListener, InputAdornment, IconButton, CircularProgress, Typography, Button, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Tabs, Tab, useTheme, alpha, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Icon } from '@iconify/react';

const SearchInputWrapper = ({ focused, isMobile, ...props }) => {
  const theme = useTheme();
  return (
    <Box
      {...props}
      sx={{
        position: 'relative',
        borderRadius: '14px',
        backgroundColor: theme.palette.background.paper,
        width: isMobile ? '100%' : 480,
        maxWidth: '100vw',
        transition: 'all 0.3s cubic-bezier(.4,1.3,.6,1)',
        border: `1.5px solid ${focused ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.08)}`,
        zIndex: 1300,
        ...props.sx
      }}
    />
  );
};

const StyledSearchInput = React.forwardRef(({ focused, ...props }, ref) => {
  const theme = useTheme();
  return (
    <TextField
      {...props}
      inputRef={ref}
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          color: theme.palette.text.primary,
          backgroundColor: 'transparent',
          borderRadius: '14px',
          padding: theme.spacing(0.5, 1),
          fontSize: 18,
          fontWeight: 500,
          boxShadow: 'none',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiInputBase-input': {
          padding: theme.spacing(1.2, 1, 1.2, 0),
        },
      }}
    />
  );
});

const SearchResultsContainer = ({ focused, ...props }) => {
  const theme = useTheme();
  return (
    <Paper
      {...props}
      sx={{
        position: 'absolute',
        top: 54,
        left: 0,
        right: 0,
        zIndex: 1200,
        maxHeight: 420,
        overflow: 'auto',
        background: theme.palette.background.paper,
        borderRadius: '14px',
        border: `1.5px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        mt: 1,
        p: 0,
        // Apple-style scrollbar
        '&::-webkit-scrollbar': {
          width: 8,
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.18),
          borderRadius: 8,
          transition: 'background 0.2s',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: alpha(theme.palette.primary.main, 0.32),
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        // Firefox
        scrollbarWidth: 'thin',
        scrollbarColor: `${alpha(theme.palette.primary.main, 0.18)} transparent`,
        ...props.sx
      }}
    />
  );
};

const SearchResultTabs = (props) => <Tabs {...props} />;
const SearchResultTab = (props) => <Tab {...props} />;

const HeaderSearch = ({
  showSearch,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchTab,
  setSearchTab,
  searchLoading,
  showSearchResults,
  setShowSearchResults,
  searchInputRef,
  t,
  theme,
  handleSearchChange,
  handleSearchFocus,
  handleClickAway,
  handleSearchTabChange,
  handleViewAll,
  handleSearchItemClick,
  toggleSearch,
  isMobile
}) => {
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (showSearch) setFocused(true);
    else setFocused(false);
  }, [showSearch]);

  return showSearch ? (
    <SearchInputWrapper focused={focused} isMobile={isMobile}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ width: '100%', position: 'relative' }}>
          <StyledSearchInput
            focused={focused}
            placeholder={t('header.search.placeholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => { handleSearchFocus(); setFocused(true); }}
            onBlur={() => setFocused(false)}
            inputRef={searchInputRef}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main, opacity: 0.8 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    edge="end"
                    onClick={toggleSearch}
                    sx={{ color: theme.palette.primary.main, opacity: 0.7 }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {showSearchResults && (
            <SearchResultsContainer focused={focused}>
              <SearchResultTabs
                value={searchTab}
                onChange={handleSearchTabChange}
                variant="fullWidth"
                sx={{
                  minHeight: 40,
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                  },
                }}
              >
                <SearchResultTab label={t('header.search.tabs.all')} />
                <SearchResultTab label={t('header.search.tabs.channels')} />
              </SearchResultTabs>
              <Box sx={{ p: 0 }}>
                {searchLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={28} color="primary" />
                  </Box>
                ) : searchTab === 0 ? (
                  searchResults.users.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {searchResults.users.map(user => (
                        <ListItem 
                          key={user.id} 
                          button 
                          onClick={() => handleSearchItemClick(`/profile/${user.username}`)}
                          sx={{
                            borderRadius: '14px',
                            px: 2,
                            py: 1.2,
                            mb: 0.5,
                            '&:hover, &:active': {
                              background: alpha(theme.palette.primary.main, 0.08),
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar 
                              src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'} 
                              alt={user.name || user.username}
                              sx={{ width: 44, height: 44, mr: 1, border: `2px solid ${alpha(theme.palette.primary.main, 0.13)}` }}
                            />
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 17 }}>
                                {user.name}
                                {user.verification_status === 'verified' && (
                                  <VerifiedIcon sx={{ fontSize: 16, ml: 0.7, color: theme.palette.primary.main }} />
                                )}
                              </Box>
                            } 
                            secondary={<Typography variant="body2" color="text.secondary">@{user.username}</Typography>} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                      <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 500 }}>
                        {t('header.search.no_results.users')}
                      </Typography>
                    </Box>
                  )
                ) : (
                  searchResults.channels.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {searchResults.channels.map(channel => (
                        <ListItem 
                          key={channel.id} 
                          button 
                          onClick={() => handleSearchItemClick(`/profile/${channel.username}`)}
                          sx={{
                            borderRadius: '14px',
                            px: 2,
                            py: 1.2,
                            mb: 0.5,
                            '&:hover, &:active': {
                              background: alpha(theme.palette.primary.main, 0.08),
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar 
                              src={channel.photo} 
                              alt={channel.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/static/uploads/avatar/system/avatar.png';
                              }}
                              sx={{ width: 44, height: 44, mr: 1, border: `2px solid ${alpha(theme.palette.primary.main, 0.13)}` }}
                            />
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 17 }}>
                                {channel.name}
                                {channel.is_verified && (
                                  <VerifiedIcon sx={{ fontSize: 16, ml: 0.7, color: theme.palette.primary.main }} />
                                )}
                              </Box>
                            } 
                            secondary={<Typography variant="body2" color="text.secondary">@{channel.username}</Typography>} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                      <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 500 }}>
                        {t('header.search.no_results.channels')}
                      </Typography>
                    </Box>
                  )
                )}
                {(searchTab === 0 && searchResults.users.length > 0) || 
                 (searchTab === 1 && searchResults.channels.length > 0) ? (
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      size="small" 
                      onClick={handleViewAll}
                      sx={{ 
                        textTransform: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: '14px',
                        px: 2,
                        py: 1,
                        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                      }}
                    >
                      {t('header.search.view_all')}
                    </Button>
                  </Box>
                ) : null}
              </Box>
            </SearchResultsContainer>
          )}
        </Box>
      </ClickAwayListener>
    </SearchInputWrapper>
  ) : null;
};

export default HeaderSearch; 