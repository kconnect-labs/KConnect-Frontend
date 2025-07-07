import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../context/AuthContext';
import { useSession } from '../../App';
import axios from 'axios';

/**
 * StreetBlacklistV1Page – активная версия с API и админ-панелью
 * Path: /street/blacklist/v1
 */
const StreetBlacklistV1Page = () => {
  const { user } = useContext(AuthContext);
  const { sessionActive } = useSession();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    car_name: '',
    car_image: null
  });
  const [stats, setStats] = useState({
    total_participants: 0,
    total_wins: 0,
    average_wins: 0
  });
  const [participantsWithRank, setParticipantsWithRank] = useState([]);
  const [dominantColors, setDominantColors] = useState({});

  // Проверка админ-прав (ID 1019 и 3)
  const isAdmin = user && (user.id === 1019 || user.id === 3);

  useEffect(() => {
    fetchParticipants();
    fetchStats();
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/street_blacklist/participants');
      if (response.data.success) {
        const participants = response.data.participants;
        
        // Сортируем по количеству побед и добавляем ранг
        const sortedParticipants = participants
          .sort((a, b) => b.wins - a.wins)
          .map((participant, index) => ({
            ...participant,
            rank: index + 1
          }));
        
        setParticipants(sortedParticipants);
        setParticipantsWithRank(sortedParticipants);
        
        // Анализируем цвета изображений
        analyzeImageColors(sortedParticipants);
      } else {
        setError('Ошибка загрузки участников');
      }
    } catch (err) {
      setError('Ошибка загрузки участников');
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/street_blacklist/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleAddParticipant = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nickname', formData.nickname);
      formDataToSend.append('car_name', formData.car_name);
      if (formData.car_image) {
        formDataToSend.append('car_image', formData.car_image);
      }

      const response = await axios.post('/api/street_blacklist/participants', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setAdminDialogOpen(false);
        setFormData({ nickname: '', car_name: '', car_image: null });
        fetchParticipants();
        fetchStats();
      }
    } catch (err) {
      setError('Ошибка добавления участника');
      console.error('Error adding participant:', err);
    }
  };

  const handleEditParticipant = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nickname', formData.nickname);
      formDataToSend.append('car_name', formData.car_name);
      if (formData.car_image) {
        formDataToSend.append('car_image', formData.car_image);
      }

      const response = await axios.put(`/api/street_blacklist/participants/${editingParticipant.id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setEditDialogOpen(false);
        setEditingParticipant(null);
        setFormData({ nickname: '', car_name: '', car_image: null });
        fetchParticipants();
      }
    } catch (err) {
      setError('Ошибка обновления участника');
      console.error('Error updating participant:', err);
    }
  };

  const handleDeleteParticipant = async (id) => {
    if (!window.confirm('Удалить участника?')) return;
    
    try {
      const response = await axios.delete(`/api/street_blacklist/participants/${id}`);
      if (response.data.success) {
        fetchParticipants();
        fetchStats();
      }
    } catch (err) {
      setError('Ошибка удаления участника');
      console.error('Error deleting participant:', err);
    }
  };

  const handleAddWin = async (id) => {
    try {
      const response = await axios.post(`/api/street_blacklist/participants/${id}/wins`, {
        wins: 1
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        fetchParticipants();
        fetchStats();
      }
    } catch (err) {
      setError('Ошибка добавления победы');
      console.error('Error adding win:', err);
    }
  };

  const openEditDialog = (participant) => {
    setEditingParticipant(participant);
    setFormData({
      nickname: participant.nickname,
      car_name: participant.car_name,
      car_image: null
    });
    setEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData({ nickname: '', car_name: '', car_image: null });
    setAdminDialogOpen(true);
  };

  // Функция для получения доминирующего цвета из изображения
  const getDominantColor = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Простой алгоритм для нахождения доминирующего цвета
        const colorCounts = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = Math.floor(data[i] / 32) * 32;
          const g = Math.floor(data[i + 1] / 32) * 32;
          const b = Math.floor(data[i + 2] / 32) * 32;
          const color = `rgb(${r}, ${g}, ${b})`;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
        
        // Найти самый частый цвет
        let maxCount = 0;
        let dominantColor = '#333';
        for (const [color, count] of Object.entries(colorCounts)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
          }
        }
        
        resolve(dominantColor);
      };
      img.onerror = () => resolve('#333');
      img.src = imageUrl;
    });
  };

  // Функция для анализа цветов всех изображений
  const analyzeImageColors = async (participants) => {
    const colors = {};
    for (const participant of participants) {
      if (participant.car_image_path) {
        const imageUrl = `/static/street_blacklist/${participant.car_image_path}`;
        try {
          const color = await getDominantColor(imageUrl);
          colors[participant.id] = color;
        } catch (error) {
          colors[participant.id] = '#333';
        }
      }
    }
    setDominantColors(colors);
  };

  // Функция для получения среднего доминирующего цвета
  const getAverageDominantColor = () => {
    const colors = Object.values(dominantColors);
    if (colors.length === 0) return '#ff4444';
    
    let totalR = 0, totalG = 0, totalB = 0;
    let count = 0;
    
    colors.forEach(color => {
      if (color.startsWith('rgb')) {
        const rgb = color.match(/\d+/g);
        if (rgb && rgb.length === 3) {
          totalR += parseInt(rgb[0]);
          totalG += parseInt(rgb[1]);
          totalB += parseInt(rgb[2]);
          count++;
        }
      } else if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        totalR += parseInt(hex.substr(0, 2), 16);
        totalG += parseInt(hex.substr(2, 2), 16);
        totalB += parseInt(hex.substr(4, 2), 16);
        count++;
      }
    });
    
    if (count === 0) return '#ff4444';
    
    const avgR = Math.round(totalR / count);
    const avgG = Math.round(totalG / count);
    const avgB = Math.round(totalB / count);
    
    return `rgb(${avgR}, ${avgG}, ${avgB})`;
  };

  // Функция для получения стилей карточки в зависимости от ранга
  const getCardStyles = (rank, participantId) => {
    const baseStyles = {
      background: 'linear-gradient(135deg, rgba(255, 68, 68, 0.05) 0%, rgba(19, 19, 19, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 2,
      height: '100%',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 12px 40px rgba(255, 68, 68, 0.3)',
        borderColor: 'rgba(255, 68, 68, 0.4)',
        '&::before': {
          opacity: 1
        }
      }
    };

    switch (rank) {
      case 1: // Огонь - чемпион
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.15) 0%, rgba(19, 19, 19, 0.95) 100%)',
          border: '3px solid rgba(255, 69, 0, 0.6)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #FF4500, transparent)',
            opacity: 0.8
          },
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: '0 12px 40px rgba(255, 69, 0, 0.4)',
            borderColor: 'rgba(255, 69, 0, 0.8)'
          }
        };
      case 2: // Молния - второй
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.15) 0%, rgba(19, 19, 19, 0.95) 100%)',
          border: '3px solid rgba(255, 255, 0, 0.6)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #FFFF00, transparent)',
            opacity: 0.8
          },
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: '0 12px 40px rgba(255, 255, 0, 0.4)',
            borderColor: 'rgba(255, 255, 0, 0.8)'
          }
        };
      case 3: // Череп - третий
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(128, 128, 128, 0.15) 0%, rgba(19, 19, 19, 0.95) 100%)',
          border: '3px solid rgba(128, 128, 128, 0.6)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #808080, transparent)',
            opacity: 0.8
          },
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: '0 12px 40px rgba(128, 128, 128, 0.4)',
            borderColor: 'rgba(128, 128, 128, 0.8)'
          }
        };
      default: // Обычные участники
        const dominantColor = dominantColors[participantId] || '#ff4444';
        // Конвертируем RGB в hex если нужно
        let colorHex = dominantColor;
        if (dominantColor.startsWith('rgb')) {
          const rgb = dominantColor.match(/\d+/g);
          if (rgb && rgb.length === 3) {
            colorHex = `#${parseInt(rgb[0]).toString(16).padStart(2, '0')}${parseInt(rgb[1]).toString(16).padStart(2, '0')}${parseInt(rgb[2]).toString(16).padStart(2, '0')}`;
          }
        }
        
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${colorHex}15 0%, rgba(19, 19, 19, 0.95) 100%)`,
          border: `2px solid ${colorHex}40`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${colorHex}, transparent)`,
            opacity: 0.6
          },
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: `0 12px 40px ${colorHex}40`,
            borderColor: `${colorHex}80`
          }
        };
    }
  };

  // Функция для получения иконки ранга
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🔥'; // Огонь для чемпиона
      case 2:
        return '⚡'; // Молния для второго
      case 3:
        return '💀'; // Череп для третьего
      default:
        return `#${rank}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>Street Blacklist v1 - Участники</title>
        <meta name="description" content="Активные участники Street Blacklist - подземные гонки" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap');
          .graffiti-font {
            font-family: 'Rock Salt', cursive !important;
            font-weight: normal !important;
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </Helmet>

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#131313',
          color: '#D0BCFF',
          position: 'relative',
          overflow: 'hidden',
          pb: 4
        }}
      >
        {/* Фоновые размазанные шарики */}
        <Box
          sx={{
            position: 'absolute',
            top: '-160px',
            left: '-120px',
            width: 350,
            height: 350,
            background: '#006b37',
            opacity: 0.55,
            borderRadius: '50%',
            filter: 'blur(120px)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-140px',
            right: '-100px',
            width: 380,
            height: 380,
            background: '#cfbcfb',
            opacity: 0.5,
            borderRadius: '50%',
            filter: 'blur(130px)',
            zIndex: 0,
          }}
        />

        {/* Заголовок */}
        <Box sx={{ position: 'relative', zIndex: 2, pt: 4, px: 2 }}>
          <Typography
            variant="h2"
            className="graffiti-font"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 900,
              color: getAverageDominantColor(),
              textShadow: `0 0 20px ${getAverageDominantColor().replace('rgb', 'rgba').replace(')', ', 0.8)')}`,
              textAlign: 'center',
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Street Blacklist v1
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#8aff8a',
              textAlign: 'center',
              mb: 3,
            }}
          >
            <span style={{ color: '#cfbcfb' }}>К-Коннект</span> × <span className="graffiti-font">Street Blacklist</span>
          </Typography>
        </Box>

        {/* Статистика */}
        <Box sx={{ position: 'relative', zIndex: 2, px: 2, mb: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(138, 255, 138, 0.05) 0%, rgba(19, 19, 19, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(138, 255, 138, 0.2)',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #8aff8a, transparent)',
                  opacity: 0.6
                }
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#8aff8a', fontWeight: 700 }}>
                    {stats.total_participants}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffffb0' }}>
                    Участников
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{
                background: `linear-gradient(135deg, ${getAverageDominantColor().replace('rgb', 'rgba').replace(')', ', 0.05)')} 0%, rgba(19, 19, 19, 0.95) 100%)`,
                backdropFilter: 'blur(20px)',
                border: `2px solid ${getAverageDominantColor().replace('rgb', 'rgba').replace(')', ', 0.2)')}`,
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${getAverageDominantColor()}, transparent)`,
                  opacity: 0.6
                }
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: getAverageDominantColor(), fontWeight: 700 }}>
                    {stats.total_wins}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffffb0' }}>
                    Всего побед
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(207, 188, 251, 0.05) 0%, rgba(19, 19, 19, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(207, 188, 251, 0.2)',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #cfbcfb, transparent)',
                  opacity: 0.6
                }
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#cfbcfb', fontWeight: 700 }}>
                    {stats.average_wins ? stats.average_wins.toFixed(1) : '0.0'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffffb0' }}>
                    Среднее побед
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Админ кнопка */}
        {isAdmin && (
          <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 10 }}>
            <Fab
              color="primary"
              onClick={openAddDialog}
              sx={{
                backgroundColor: '#8aff8a',
                color: '#000',
                '&:hover': { backgroundColor: '#6be96b' },
                boxShadow: '0 0 10px rgba(138,255,138,0.6)',
              }}
            >
              <AddIcon />
            </Fab>
          </Box>
        )}

        {/* Список участников */}
        <Box sx={{ position: 'relative', zIndex: 2, px: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#8aff8a' }} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {participants.map((participant) => (
                <Grid item xs={12} sm={6} md={4} key={participant.id}>
                  <Card sx={getCardStyles(participant.rank, participant.id)}>
                    <CardContent>
                      {/* Ранг участника */}
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: participant.rank <= 3 ? '#FFD700' : '#ffffffb0',
                            fontWeight: 700,
                            fontSize: participant.rank <= 3 ? '1.2rem' : '1rem'
                          }}
                        >
                          {getRankIcon(participant.rank)}
                        </Typography>
                      </Box>

                      {/* Машина игрока */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        height: 120,
                        position: 'relative'
                      }}>
                        {participant.car_image_url ? (
                          <Box
                            component="img"
                            src={participant.car_image_url}
                            sx={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                              filter: 'drop-shadow(0 0 10px rgba(255, 68, 68, 0.3))'
                            }}
                            alt={participant.car_name}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px dashed rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            <SpeedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 40 }} />
                          </Box>
                        )}
                      </Box>

                      {/* Информация об игроке */}
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography 
                          variant="h5" 
                          className="graffiti-font"
                          sx={{ 
                            color: participant.rank <= 3 ? '#ff4444' : dominantColors[participant.id] || '#ff4444', 
                            fontWeight: 700,
                            textShadow: `0 0 10px ${participant.rank <= 3 ? 'rgba(255, 68, 68, 0.5)' : (dominantColors[participant.id] || '#ff4444').replace('rgb', 'rgba').replace(')', ', 0.5)')}`,
                            mb: 1
                          }}
                        >
                          {participant.nickname}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: participant.rank <= 3 ? '#8aff8a' : dominantColors[participant.id] || '#8aff8a', 
                            fontWeight: 600,
                            mb: 1
                          }}
                        >
                          {participant.car_name}
                        </Typography>
                      </Box>

                      {/* Статистика побед */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2,
                        p: 1,
                        backgroundColor: participant.rank <= 3 
                          ? `rgba(${participant.rank === 1 ? '255, 69, 0' : participant.rank === 2 ? '255, 255, 0' : '128, 128, 128'}, 0.15)`
                          : `${dominantColors[participant.id] || '#ff4444'}`.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                        borderRadius: 1,
                        border: `1px solid ${participant.rank <= 3 
                          ? `rgba(${participant.rank === 1 ? '255, 69, 0' : participant.rank === 2 ? '255, 255, 0' : '128, 128, 128'}, 0.4)`
                          : `${dominantColors[participant.id] || '#ff4444'}`.replace('rgb', 'rgba').replace(')', ', 0.4)')}`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': participant.rank <= 3 ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(45deg, transparent, rgba(${participant.rank === 1 ? '255, 69, 0' : participant.rank === 2 ? '255, 255, 0' : '128, 128, 128'}, 0.1), transparent)`,
                          animation: 'shimmer 2s infinite'
                        } : {}
                      }}>
                        <TrophyIcon sx={{ 
                          color: participant.rank <= 3 
                            ? participant.rank === 1 ? '#FF4500' : participant.rank === 2 ? '#FFFF00' : '#808080'
                            : dominantColors[participant.id] || '#ff4444', 
                          mr: 1, 
                          fontSize: 20 
                        }} />
                        <Typography variant="h6" sx={{ 
                          color: participant.rank <= 3 
                            ? participant.rank === 1 ? '#FF4500' : participant.rank === 2 ? '#FFFF00' : '#808080'
                            : dominantColors[participant.id] || '#ff4444', 
                          fontWeight: 700 
                        }}>
                          {participant.wins}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffffb0', ml: 1 }}>
                          побед
                        </Typography>
                      </Box>

                      {/* Кнопки управления */}
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {isAdmin && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(participant)}
                              sx={{ 
                                color: '#cfbcfb',
                                backgroundColor: 'rgba(207, 188, 251, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(207, 188, 251, 0.2)' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteParticipant(participant.id)}
                              sx={{ 
                                color: '#ff4444',
                                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(255, 68, 68, 0.2)' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleAddWin(participant.id)}
                              sx={{
                                borderColor: '#8aff8a',
                                color: '#8aff8a',
                                backgroundColor: 'rgba(138, 255, 138, 0.1)',
                                '&:hover': { 
                                  borderColor: '#6be96b', 
                                  backgroundColor: 'rgba(138, 255, 138, 0.2)' 
                                },
                                borderRadius: 1.5,
                              }}
                            >
                              + Победа
                            </Button>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {!loading && participants.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#ffffffb0' }}>
                Пока нет участников
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff80' }}>
                Будьте первым в Blacklist!
              </Typography>
            </Box>
          )}
        </Box>

        {/* Кнопка возврата */}
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', mt: 4 }}>
          <Button
            href="/street/blacklist"
            variant="contained"
            sx={{
              backgroundColor: '#cfbcfb',
              color: '#000',
              '&:hover': { backgroundColor: '#b8a8e8' },
              fontWeight: 700,
              px: 4,
              borderRadius: 2,
              boxShadow: '0 0 10px rgba(207,188,251,0.6)',
            }}
          >
            Назад к тизеру
          </Button>
        </Box>
      </Box>

      {/* Диалог добавления участника */}
      <Dialog 
        open={adminDialogOpen} 
        onClose={() => setAdminDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(19, 19, 19, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#8aff8a', fontWeight: 700 }}>
          Добавить участника
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Никнейм"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              sx: { color: '#ffffff', borderRadius: 1.5 }
            }}
            InputLabelProps={{
              sx: { color: '#ffffffb0' }
            }}
          />
          <TextField
            fullWidth
            label="Название машины"
            value={formData.car_name}
            onChange={(e) => setFormData({ ...formData, car_name: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: '#ffffff', borderRadius: 1.5 }
            }}
            InputLabelProps={{
              sx: { color: '#ffffffb0' }
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, car_image: e.target.files[0] })}
            style={{ marginTop: 8 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setAdminDialogOpen(false)}
            sx={{ color: '#ffffffb0' }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleAddParticipant}
            variant="contained"
            sx={{
              backgroundColor: '#8aff8a',
              color: '#000',
              '&:hover': { backgroundColor: '#6be96b' },
              borderRadius: 1.5,
            }}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования участника */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(19, 19, 19, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#8aff8a', fontWeight: 700 }}>
          Редактировать участника
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Никнейм"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              sx: { color: '#ffffff', borderRadius: 1.5 }
            }}
            InputLabelProps={{
              sx: { color: '#ffffffb0' }
            }}
          />
          <TextField
            fullWidth
            label="Название машины"
            value={formData.car_name}
            onChange={(e) => setFormData({ ...formData, car_name: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: '#ffffff', borderRadius: 1.5 }
            }}
            InputLabelProps={{
              sx: { color: '#ffffffb0' }
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, car_image: e.target.files[0] })}
            style={{ marginTop: 8 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#ffffffb0' }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleEditParticipant}
            variant="contained"
            sx={{
              backgroundColor: '#8aff8a',
              color: '#000',
              '&:hover': { backgroundColor: '#6be96b' },
              borderRadius: 1.5,
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StreetBlacklistV1Page; 