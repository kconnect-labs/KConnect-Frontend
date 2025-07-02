import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Button,
  styled,
  Fab,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Add,
  PlayArrow,
  MoreVert,
  Person,
  Public,
  MusicNote
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext';
import { PlaylistModal, PlaylistViewModal } from '../../UIKIT';
import axios from 'axios';

// Стили
const PlaylistCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const PlaylistsPage = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack } = useMusic();
  
  // Состояние
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [playlistViewModalOpen, setPlaylistViewModalOpen] = useState(false);
  const [viewingPlaylist, setViewingPlaylist] = useState(null);

  // Загрузка плейлистов
  const fetchPlaylists = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Загружаем пользовательские плейлисты
      const userResponse = await axios.get('/api/music/playlists');
      let userPlaylists = [];
      
      if (userResponse.data.success) {
        userPlaylists = await Promise.all(userResponse.data.playlists.map(async playlist => {
          let previewTracks = [];
          try {
            const detailResponse = await axios.get(`/api/music/playlists/${playlist.id}`);
            if (detailResponse.data.success && detailResponse.data.playlist && detailResponse.data.playlist.tracks) {
              previewTracks = detailResponse.data.playlist.tracks.slice(0, 3).map(track => ({
                id: track.id,
                title: track.title,
                artist: track.artist,
                cover_url: track.cover_url
              }));
            }
          } catch (error) {
            // Игнорируем ошибки загрузки preview треков
          }
          
          return {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description || '',
            is_public: playlist.is_public,
            cover_image: playlist.cover_url || "/static/uploads/system/playlist_placeholder.jpg",
            tracks_count: playlist.track_count || 0,
            created_at: playlist.created_at,
            updated_at: playlist.updated_at,
            is_owner: true,
            preview_tracks: previewTracks
          };
        }));
      }

      // Загружаем публичные плейлисты
      const publicResponse = await axios.get('/api/music/playlists/public');
      let publicPlaylists = [];
      
      if (publicResponse.data.success) {
        publicPlaylists = await Promise.all(publicResponse.data.playlists.map(async playlist => {
          let previewTracks = [];
          try {
            const detailResponse = await axios.get(`/api/music/playlists/${playlist.id}`);
            if (detailResponse.data.success && detailResponse.data.playlist && detailResponse.data.playlist.tracks) {
              previewTracks = detailResponse.data.playlist.tracks.slice(0, 3).map(track => ({
                id: track.id,
                title: track.title,
                artist: track.artist,
                cover_url: track.cover_url
              }));
            }
          } catch (error) {
            // Игнорируем ошибки загрузки preview треков
          }
          
          return {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description || '',
            is_public: true,
            cover_image: playlist.cover_url || playlist.cover_image || "/static/uploads/system/playlist_placeholder.jpg",
            tracks_count: playlist.tracks_count || 0,
            created_at: playlist.created_at,
            updated_at: playlist.updated_at,
            owner: playlist.owner,
            is_owner: false,
            preview_tracks: previewTracks
          };
        }));
      }

      // Убираем дубликаты
      const publicPlaylistIds = new Set(publicPlaylists.map(p => p.id));
      const uniqueUserPlaylists = userPlaylists.filter(p => !publicPlaylistIds.has(p.id) || p.is_owner);
      
      const allPlaylists = [...uniqueUserPlaylists, ...publicPlaylists];
      setPlaylists(allPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Обработчики
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreatePlaylist = () => {
    setEditingPlaylist(null);
    setPlaylistModalOpen(true);
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
    setPlaylistModalOpen(true);
  };

  const handleViewPlaylist = async (playlist) => {
    // Загружаем полный список треков для плейлиста
    try {
      const detailResponse = await axios.get(`/api/music/playlists/${playlist.id}`);
      if (detailResponse.data.success && detailResponse.data.playlist) {
        const fullPlaylist = {
          ...playlist,
          tracks: detailResponse.data.playlist.tracks || []
        };
        setViewingPlaylist(fullPlaylist);
        setPlaylistViewModalOpen(true);
      } else {
        setViewingPlaylist(playlist);
        setPlaylistViewModalOpen(true);
      }
    } catch (error) {
      setViewingPlaylist(playlist);
      setPlaylistViewModalOpen(true);
    }
  };

  const handlePlayPlaylist = (playlist) => {
    if (playlist.preview_tracks && playlist.preview_tracks.length > 0) {
      playTrack(playlist.preview_tracks[0], `playlist_${playlist.id}`);
    }
  };

  const handleSavePlaylist = async (playlistData, playlistId) => {
    try {
      if (playlistId) {
        // Обновление
        await axios.put(`/api/music/playlists/${playlistId}`, playlistData);
      } else {
        // Создание
        await axios.post('/api/music/playlists', playlistData);
      }
      
      setPlaylistModalOpen(false);
      fetchPlaylists(); // Перезагружаем список
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/music/playlists/${playlistId}`);
      setPlaylistModalOpen(false);
      fetchPlaylists(); // Перезагружаем список
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleAddTracks = async (playlistId, trackIds) => {
    try {
      await Promise.all(
        trackIds.map(trackId => 
          axios.post(`/api/music/playlists/${playlistId}/tracks`, { track_id: trackId })
        )
      );
      // Обновляем плейлист в модалке
      if (editingPlaylist && editingPlaylist.id === playlistId) {
        const response = await axios.get(`/api/music/playlists/${playlistId}`);
        if (response.data.success) {
          setEditingPlaylist(response.data.playlist);
        }
      }
    } catch (error) {
      console.error('Error adding tracks to playlist:', error);
    }
  };

  const handleRemoveTrack = async (playlistId, trackId) => {
    try {
      await axios.delete(`/api/music/playlists/${playlistId}/tracks/${trackId}`);
      // Обновляем плейлист в модалке
      if (editingPlaylist && editingPlaylist.id === playlistId) {
        const response = await axios.get(`/api/music/playlists/${playlistId}`);
        if (response.data.success) {
          setEditingPlaylist(response.data.playlist);
        }
      }
    } catch (error) {
      console.error('Error removing track from playlist:', error);
    }
  };

  // Фильтрация плейлистов
  const userPlaylists = playlists.filter(p => p.is_owner);
  const publicPlaylists = playlists.filter(p => !p.is_owner);

  // Загрузка при монтировании
  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return (
    <Box sx={{ 
      p: 1, 
      paddingBottom: 10,
      paddingTop: { xs: 7, md: 1 } // 40px на мобилках, 8px на десктопе
    }}>
      {/* Заголовок */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
          Плейлисты
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Управляйте своими плейлистами и открывайте новые
        </Typography>
      </Box>

      {/* Табы */}
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#fff',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#D0BCFF',
            }
          }}
        >
          <Tab label={`Мои (${userPlaylists.length})`} />
          <Tab label={`Все (${publicPlaylists.length})`} />
          <Tab 
            label="Создать" 
            onClick={(e) => {
              e.preventDefault();
              handleCreatePlaylist();
            }}
            sx={{
              backgroundColor: 'rgba(208, 188, 255, 0.1)',
              borderRadius: '8px 8px 0 0',
              marginLeft: 1,
              '&:hover': {
                backgroundColor: 'rgba(208, 188, 255, 0.2)',
              }
            }}
          />
        </Tabs>
      </Box>

      {/* Контент */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {activeTab === 0 && (
            <Box>
              {/* Список пользовательских плейлистов */}
              {userPlaylists.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 6,
                  textAlign: 'center'
                }}>
                  <MusicNote sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                    У вас пока нет плейлистов
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Нажмите на вкладку "Создать" чтобы создать свой первый плейлист
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {userPlaylists.map((playlist) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={playlist.id}>
                      <PlaylistCard onClick={() => handleViewPlaylist(playlist)}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={playlist.cover_image}
                            alt={playlist.name}
                            sx={{ borderRadius: '16px 16px 0 0' }}
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 0.5
                          }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPlaylist(playlist);
                              }}
                              sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: '#fff',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                }
                              }}
                            >
                              <PlayArrow />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPlaylist(playlist);
                              }}
                              sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: '#fff',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                }
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: '#fff', 
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {playlist.name}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {playlist.tracks_count} треков
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              icon={playlist.is_public ? <Public /> : <Person />}
                              label={playlist.is_public ? 'Публичный' : 'Приватный'}
                              size="small"
                              sx={{
                                backgroundColor: playlist.is_public ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                                color: playlist.is_public ? '#4CAF50' : '#9E9E9E',
                                '& .MuiChip-icon': {
                                  color: 'inherit'
                                }
                              }}
                            />
                          </Box>
                        </CardContent>
                      </PlaylistCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {publicPlaylists.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 6,
                  textAlign: 'center'
                }}>
                  <Public sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                    Публичные плейлисты не найдены
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Пока нет публичных плейлистов от других пользователей
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {publicPlaylists.map((playlist) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={playlist.id}>
                      <PlaylistCard onClick={() => handleViewPlaylist(playlist)}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={playlist.cover_image}
                            alt={playlist.name}
                            sx={{ borderRadius: '16px 16px 0 0' }}
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                          }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPlaylist(playlist);
                              }}
                              sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: '#fff',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                }
                              }}
                            >
                              <PlayArrow />
                            </IconButton>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: '#fff', 
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {playlist.name}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {playlist.tracks_count} треков
                          </Typography>
                          {playlist.owner && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                src={playlist.owner.avatar_url} 
                                sx={{ width: 20, height: 20 }}
                              >
                                <Person sx={{ fontSize: 12 }} />
                              </Avatar>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {playlist.owner.username}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </PlaylistCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </>
      )}

      {/* Модальные окна */}
      <PlaylistModal
        open={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        playlist={editingPlaylist}
        onSave={handleSavePlaylist}
        onDelete={handleDeletePlaylist}
        onAddTracks={handleAddTracks}
        onRemoveTrack={handleRemoveTrack}
        isLoading={false}
        nowPlaying={currentTrack}
      />

      <PlaylistViewModal
        open={playlistViewModalOpen}
        onClose={() => setPlaylistViewModalOpen(false)}
        playlist={viewingPlaylist}
        onEdit={handleEditPlaylist}
        onPlayTrack={(track) => {
          if (viewingPlaylist) {
            playTrack(track, `playlist_${viewingPlaylist.id}`);
          } else {
            playTrack(track);
          }
        }}
        nowPlaying={currentTrack}
      />
    </Box>
  );
};

export default PlaylistsPage; 