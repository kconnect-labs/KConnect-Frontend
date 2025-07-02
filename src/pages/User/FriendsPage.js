import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Container, Grid, CircularProgress, TextField, InputAdornment } from '@mui/material';
import StyledTabs from '../../UIKIT/StyledTabs';
import FriendsList from '../../UIKIT/FriendsList';
import InfoBlock from '../../UIKIT/InfoBlock';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';

const TABS = [
  { label: 'Друзья', value: 0 },
  { label: 'Подписчики', value: 1 },
  { label: 'Подписки', value: 2 },
];

const FriendsPage = () => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState(0);
  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState({});
  const [search, setSearch] = useState('');
  const [suggested, setSuggested] = useState([]);

  const fetchFriends = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/profile/${username}/friends`, { params: { page: 1, per_page: 50 } });
      setFriends(res.data.friends || []);
    } catch (e) {
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const fetchFollowers = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/users/${username}/followers`, { params: { page: 1, per_page: 50 } });
      // Только не-друзья
      setFollowers((res.data.followers || []).filter(f => !f.is_friend));
    } catch (e) {
      setFollowers([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const fetchFollowing = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/users/${username}/following`, { params: { page: 1, per_page: 50 } });
      setFollowing(res.data.following || []);
    } catch (e) {
      setFollowing([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (!username) return;
    fetchFollowers();
    if (tab === 0) fetchFriends();
    if (tab === 2) fetchFollowing();
  }, [tab, username, fetchFriends, fetchFollowers, fetchFollowing]);

  useEffect(() => {
    if (followers.length && suggested.length === 0) {
      const getRandomUsers = (arr, n) => {
        if (arr.length <= n) return arr;
        const shuffled = arr.slice().sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
      };
      setSuggested(getRandomUsers(followers, 3));
    }
  }, [followers, suggested.length]);

  const handleUnfollow = async (userId) => {
    setLoadingIds(prev => ({ ...prev, [userId]: true }));
    try {
      await axios.post('/api/profile/unfollow', { unfollowed_id: userId });
      if (tab === 0) fetchFriends();
      if (tab === 1) fetchFollowers();
      if (tab === 2) fetchFollowing();
    } catch (e) {}
    setLoadingIds(prev => ({ ...prev, [userId]: false }));
  };

  const handleFollow = async (userId) => {
    setLoadingIds(prev => ({ ...prev, [userId]: true }));
    try {
      await axios.post('/api/profile/follow', { followed_id: userId });
      if (tab === 0) fetchFriends();
      if (tab === 1) fetchFollowers();
      if (tab === 2) fetchFollowing();
    } catch (e) {}
    setLoadingIds(prev => ({ ...prev, [userId]: false }));
  };

  const filterUsers = (arr) => {
    if (!search.trim()) return arr;
    const q = search.trim().toLowerCase();
    return arr.filter(u =>
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q))
    );
  };

  const getList = () => {
    if (tab === 0) return filterUsers(friends);
    if (tab === 1) return filterUsers(followers.filter(f => !friends.some(fr => fr.id === f.id)));
    if (tab === 2) return filterUsers(following.filter(f => !friends.some(fr => fr.id === f.id)));
    return [];
  };

  return (
    <Container maxWidth="lg" sx={{ pt: '20px', px: { xs: '2.5px', sm: 2 }, mb: '60px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledTabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            tabs={TABS}
            fullWidth
            variant="fullWidth"
            customStyle
          />
          <TextField
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по пользователям"
            size="small"
            fullWidth
            sx={{ mb: 1.5, mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
          <Box sx={{ mt: '5px', minHeight: 300 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <FriendsList
                users={getList().map(u => ({ ...u, onUnfollow: handleUnfollow, onFollow: handleFollow, loading: !!loadingIds[u.id] }))}
                cardSpacing={2}
                cardRadius={12}
                forceUnfollow={tab === 0}
              />
            )}
          </Box>
        </Grid>
        {!isMobile && (
          <Grid item xs={12} md={4}>
            <InfoBlock
              title={TABS[tab].label}
              description={
                tab === 0
                  ? 'Здесь отображаются пользователи, с которыми у вас взаимные подписки.'
                  : tab === 1
                  ? 'Пользователи, которые подписаны на вас.'
                  : 'Пользователи, на которых вы подписаны.'
              }
              customStyle
            />
            <InfoBlock
              title="Возможно вам знакомы"
              customStyle
              sx={{ mt: 2 }}
            >
              {suggested.length === 0 ? (
                <Box sx={{ color: 'text.secondary', fontSize: 14, py: 1 }}>Нет рекомендаций</Box>
              ) : (
                suggested.map(user => (
                  <Box
                    key={user.id}
                    component="a"
                    href={`/profile/${user.username}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.2,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '12px',
                      px: 1.5,
                      py: 1,
                      transition: 'background 0.18s',
                      '&:hover': { background: 'rgba(208,188,255,0.13)' },
                    }}
                  >
                    <Box
                      component="img"
                      src={user.photo && user.photo !== '' ? `/static/uploads/avatar/${user.id}/${user.photo}` : '/static/uploads/avatar/system/avatar.png'}
                      alt={user.name || user.username}
                      sx={{ width: 36, height: 36, borderRadius: '50%', mr: 1.5, objectFit: 'cover', border: '1.5px solid #D0BCFF' }}
                    />
                    <Box>
                      <Box sx={{ fontWeight: 500, fontSize: 15, color: 'text.primary', lineHeight: 1 }}>{user.name || user.username}</Box>
                      <Box sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.2 }}>@{user.username}</Box>
                    </Box>
                  </Box>
                ))
              )}
            </InfoBlock>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default FriendsPage; 