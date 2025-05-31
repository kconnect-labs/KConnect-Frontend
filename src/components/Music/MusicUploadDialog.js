import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  CloudUpload,
  Close,
  AudioFile,
  Image,
  MusicNote,
  InsertDriveFile,
  AudiotrackOutlined,
  Delete,
  Add,
  Album
} from '@mui/icons-material';
import axios from 'axios';


const GENRES = [
  'рэп', 'бодрое', 'грустное', 'весёлое', 'спокойное', 'поп', 'электроника'
];


const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MusicUploadDialog = ({ open, onClose, onSuccess }) => {
  
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setTracks([]);
    setCurrentTrackIndex(0);
    setError('');
    setSuccess(false);
    setUploadProgress(0);
  };

  
  const createEmptyTrack = () => ({
    file: null,
    coverFile: null,
    coverPreview: '',
    title: '',
    artist: '',
    album: '',
    genre: '',
    description: '',
    duration: 0,
    metadata: {
      fileFormat: '',
      sampleRate: 0,
      bitDepth: 0,
      channels: 0,
      fileSize: 0
    }
  });

  
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    
    const filesToProcess = selectedFiles.slice(0, 10);
    
    if (selectedFiles.length > 10) {
      setError('Максимальное количество треков для загрузки: 10. Первые 10 файлов были выбраны.');
    } else {
      setError('');
    }

    setLoadingMetadata(true);

    
    const newTracks = [];
    
    for (const file of filesToProcess) {
      if (!file.type.startsWith('audio/')) {
        console.warn(`Файл ${file.name} не является аудио и будет пропущен`);
        continue;
      }

      const track = createEmptyTrack();
      track.file = file;

      try {
        
        const metadata = await extractMetadata(file);
        if (metadata) {
          track.title = metadata.title || '';
          track.artist = metadata.artist || '';
          track.album = metadata.album || '';
          track.genre = metadata.genre || '';
          track.duration = metadata.duration || 0;
          track.metadata = {
            fileFormat: metadata.file_format || '',
            sampleRate: metadata.sample_rate || 0,
            bitDepth: metadata.bit_depth || 0,
            channels: metadata.channels || 0,
            fileSize: metadata.file_size || 0
          };

          
          if (metadata.cover_data) {
            track.coverPreview = metadata.cover_data;
            try {
              const base64Response = await fetch(metadata.cover_data);
              const blob = await base64Response.blob();
              const coverFile = new File(
                [blob],
                'cover.' + (metadata.cover_mime ? metadata.cover_mime.split('/')[1] : 'jpg'),
                { type: metadata.cover_mime || 'image/jpeg' }
              );
              track.coverFile = coverFile;
            } catch (e) {
              console.error('Ошибка при создании файла обложки из base64:', e);
            }
          }
        } else {
          
          const fileName = file.name.replace(/\.[^/.]+$/, "");
          if (fileName.includes(" - ")) {
            const parts = fileName.split(" - ");
            track.artist = parts[0].trim();
            track.title = parts[1].trim();
          } else {
            track.title = fileName;
          }

          
          try {
            const objectUrl = URL.createObjectURL(file);
            const audioElement = new Audio();
            await new Promise((resolve) => {
              audioElement.onloadedmetadata = () => {
                track.duration = Math.round(audioElement.duration);
                URL.revokeObjectURL(objectUrl);
                resolve();
              };
              audioElement.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve();
              };
              audioElement.src = objectUrl;
            });
          } catch (e) {
            console.error('Ошибка при получении длительности аудио:', e);
          }
        }
      } catch (error) {
        console.error('Ошибка при извлечении метаданных:', error);
      }

      newTracks.push(track);
    }

    if (newTracks.length > 0) {
      setTracks(newTracks);
      setCurrentTrackIndex(0);
    }

    setLoadingMetadata(false);
  };

  
  const extractMetadata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/music/metadata', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.metadata;
      }
    } catch (error) {
      console.error('Ошибка при получении метаданных:', error);
    }
    return null;
  };

  
  const handleCoverChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Выберите изображение для обложки');
      return;
    }

    const updatedTracks = [...tracks];
    updatedTracks[currentTrackIndex].coverFile = selectedFile;
    updatedTracks[currentTrackIndex].coverPreview = URL.createObjectURL(selectedFile);
    setTracks(updatedTracks);
    setError('');
  };

  
  const handleTrackChange = (field, value) => {
    const updatedTracks = [...tracks];
    updatedTracks[currentTrackIndex][field] = value;
    setTracks(updatedTracks);
  };

  
  const handleRemoveTrack = (index) => {
    const updatedTracks = [...tracks];
    updatedTracks.splice(index, 1);
    setTracks(updatedTracks);
    
    
    if (currentTrackIndex >= updatedTracks.length) {
      setCurrentTrackIndex(Math.max(0, updatedTracks.length - 1));
    }
  };

  
  const handleSubmit = async () => {
    
    const invalidTrackIndex = tracks.findIndex(track => {
      return !track.file || !track.title || !track.artist || !track.coverFile;
    });

    if (invalidTrackIndex !== -1) {
      setCurrentTrackIndex(invalidTrackIndex);
      setError('Заполните все обязательные поля для всех треков (файл, название, исполнитель, обложка)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setUploadProgress(0);

    try {
      
      const formData = new FormData();
      
      
      tracks.forEach((track, index) => {
        formData.append(`file[${index}]`, track.file);
        formData.append(`cover[${index}]`, track.coverFile);
        formData.append(`title[${index}]`, track.title);
        formData.append(`artist[${index}]`, track.artist);
        formData.append(`album[${index}]`, track.album || '');
        formData.append(`genre[${index}]`, track.genre || '');
        formData.append(`description[${index}]`, track.description || '');
        formData.append(`duration[${index}]`, track.duration || 0);
      });

      
      const uploadProgressCallback = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      };

      
      const response = await axios.post('/api/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: uploadProgressCallback
      });

      
      if (response.data.success) {
        const uploadedTracks = response.data.tracks || [response.data.track];
        setSuccess(true);
        
        
        if (response.data.errors && response.data.errors.length > 0) {
          setError('Некоторые треки не были загружены: ' + response.data.errors.join(', '));
        }
        
        setTimeout(() => {
          onSuccess && onSuccess(uploadedTracks);
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Ошибка при загрузке треков');
      }
    } catch (error) {
      console.error('Ошибка при загрузке треков:', error);
      setError(error.response?.data?.message || 'Ошибка при загрузке треков');
    } finally {
      setLoading(false);
      setUploadProgress(100);
    }
  };

  
  const renderSelectFilesButton = () => (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Button
        variant="outlined"
        component="label"
        htmlFor="audio-upload-multi"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        disabled={loadingMetadata}
      >
        Выбрать треки (до 10)
        <input
          id="audio-upload-multi"
          type="file"
          accept="audio/*"
          multiple
          hidden
          onChange={handleFileChange}
          disabled={loadingMetadata}
        />
      </Button>
      
      {loadingMetadata && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Извлечение метаданных...
          </Typography>
        </Box>
      )}
    </Box>
  );

  
  const renderTrackList = () => (
    <Paper variant="outlined" sx={{ height: '100%', overflow: 'auto' }}>
      <List dense sx={{ p: 0 }}>
        {tracks.map((track, index) => (
          <ListItem 
            key={index}
            selected={index === currentTrackIndex}
            button
            onClick={() => setCurrentTrackIndex(index)}
            sx={{ 
              borderLeft: index === currentTrackIndex ? '3px solid' : '3px solid transparent',
              borderLeftColor: 'primary.main',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <ListItemAvatar>
              {track.coverPreview ? (
                <Avatar variant="rounded" src={track.coverPreview} />
              ) : (
                <Avatar variant="rounded">
                  <AudioFile />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText 
              primary={track.title || 'Без названия'} 
              secondary={track.artist || 'Неизвестный исполнитель'}
              primaryTypographyProps={{ noWrap: true }}
              secondaryTypographyProps={{ noWrap: true }}
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTrack(index);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  
  const renderTrackForm = () => {
    if (!tracks.length || currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
          <Album sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Выберите музыкальные файлы для загрузки
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
            Поддерживаются форматы MP3, FLAC, WAV, OGG и другие аудио форматы
          </Typography>
        </Box>
      );
    }

    const track = tracks[currentTrackIndex];

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Название трека"
            fullWidth
            required
            value={track.title}
            onChange={(e) => handleTrackChange('title', e.target.value)}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Исполнитель"
            fullWidth
            required
            value={track.artist}
            onChange={(e) => handleTrackChange('artist', e.target.value)}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Альбом"
            fullWidth
            value={track.album}
            onChange={(e) => handleTrackChange('album', e.target.value)}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="genre-label">Жанр</InputLabel>
            <Select
              labelId="genre-label"
              value={track.genre}
              label="Жанр"
              onChange={(e) => handleTrackChange('genre', e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">
                <em>Не выбрано</em>
              </MenuItem>
              {GENRES.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={track.description}
            onChange={(e) => handleTrackChange('description', e.target.value)}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Обложка
          </Typography>
          <Box 
            sx={{ 
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              textAlign: 'center',
              mb: 1,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
              backgroundImage: track.coverPreview ? `url(${track.coverPreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: track.coverPreview ? 'unset' : 'rgba(208, 188, 255, 0.04)'
              }
            }}
            component="label"
            htmlFor={`cover-upload-${currentTrackIndex}`}
          >
            {!track.coverPreview && (
              <>
                <Image sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Выберите изображение для обложки
                </Typography>
              </>
            )}
            <input
              id={`cover-upload-${currentTrackIndex}`}
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverChange}
              disabled={loading}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            p: 1.5, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <MusicNote sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                Информация о треке
              </Typography>
            </Box>
            
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Длительность: {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </Typography>
              </Grid>
              
              {track.file && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Файл: {track.file.name}
                    </Typography>
                  </Grid>
                  
                  {track.metadata.fileFormat && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Формат: {track.metadata.fileFormat}
                      </Typography>
                    </Grid>
                  )}
                  
                  {track.metadata.fileSize > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Размер: {formatFileSize(track.metadata.fileSize)}
                      </Typography>
                    </Grid>
                  )}
                  
                  {track.metadata.sampleRate > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Частота: {track.metadata.sampleRate} Гц
                      </Typography>
                    </Grid>
                  )}
                  
                  {track.metadata.bitDepth > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Бит: {track.metadata.bitDepth} бит
                      </Typography>
                    </Grid>
                  )}
                  
                  {track.metadata.channels > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Каналы: {track.metadata.channels}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            
            {track.metadata.fileFormat && (
              <Box sx={{ mt: 1 }}>
                <Chip 
                  size="small" 
                  label={track.metadata.fileFormat} 
                  color="primary" 
                  variant="outlined"
                  icon={<AudiotrackOutlined fontSize="small" />} 
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : onClose}
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '70vh',
          '@media (max-width: 600px)': {
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            borderRadius: 0,
          }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {tracks.length > 0 
            ? `Загрузка треков (${tracks.length})`
            : 'Загрузка треков'
          }
        </Typography>
        {!loading && (
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {tracks.length > 1
              ? `${tracks.length} треков успешно загружено!`
              : 'Трек успешно загружен!'
            }
          </Alert>
        )}
        
        {tracks.length === 0 ? (
          renderSelectFilesButton()
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              {renderTrackList()}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  htmlFor="audio-upload-multi-add"
                  startIcon={<Add />}
                  fullWidth
                  size="small"
                  disabled={loading || loadingMetadata || tracks.length >= 10}
                >
                  Добавить еще
                  <input
                    id="audio-upload-multi-add"
                    type="file"
                    accept="audio/*"
                    multiple
                    hidden
                    onChange={handleFileChange}
                    disabled={loading || loadingMetadata || tracks.length >= 10}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              {renderTrackForm()}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || tracks.length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
        >
          {loading ? (
            <>
              Загрузка... {uploadProgress}%
            </>
          ) : tracks.length > 1 ? (
            `Загрузить ${tracks.length} треков`
          ) : (
            'Загрузить трек'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MusicUploadDialog; 