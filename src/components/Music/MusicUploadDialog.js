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
  Alert
} from '@mui/material';
import {
  CloudUpload,
  Close,
  AudioFile,
  Image,
  MusicNote,
  InsertDriveFile
} from '@mui/icons-material';
import axios from 'axios';

const MusicUploadDialog = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Список жанров
  const genres = [
    'рэп', 'бодрое', 'грустное', 'весёлое', 'спокойное', 'поп', 'электроника'
  ];

  // Сброс формы
  const resetForm = () => {
    setFile(null);
    setCoverFile(null);
    setCoverPreview('');
    setTitle('');
    setArtist('');
    setAlbum('');
    setGenre('');
    setDescription('');
    setDuration(0);
    setError('');
    setSuccess(false);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Обработчик загрузки аудиофайла
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('audio/')) {
      setError('Выберите аудиофайл');
      return;
    }

    setFile(selectedFile);
    
    // Загружаем метаданные
    setLoadingMetadata(true);
    setError('');
    
    try {
      // Создаем FormData для отправки файла на сервер
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Запрос к API для извлечения метаданных
      const response = await axios.post('/api/music/metadata', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Если успешно получили метаданные
      if (response.data.success) {
        const metadata = response.data.metadata;
        
        // Заполняем форму полученными данными
        if (metadata.title) setTitle(metadata.title);
        if (metadata.artist) setArtist(metadata.artist);
        if (metadata.album) setAlbum(metadata.album);
        if (metadata.genre) setGenre(metadata.genre);
        if (metadata.duration) setDuration(metadata.duration);
        
        // Если получили обложку, отображаем ее
        if (metadata.cover_data) {
          setCoverPreview(metadata.cover_data);
          
          // Преобразуем base64 в Blob для сохранения как файл
          try {
            const base64Response = await fetch(metadata.cover_data);
            const blob = await base64Response.blob();
            const coverFile = new File(
              [blob], 
              'cover.' + (metadata.cover_mime ? metadata.cover_mime.split('/')[1] : 'jpg'), 
              { type: metadata.cover_mime || 'image/jpeg' }
            );
            setCoverFile(coverFile);
          } catch (e) {
            console.error('Ошибка при создании файла обложки из base64:', e);
          }
        }
        
        console.log('Metadata extracted successfully:', metadata);
      } else {
        // Создаем аудио элемент для получения длительности (запасной вариант)
        const audioElement = new Audio();
        const objectUrl = URL.createObjectURL(selectedFile);
        
        audioElement.onloadedmetadata = () => {
          setDuration(Math.round(audioElement.duration));
          URL.revokeObjectURL(objectUrl);
        };
        
        audioElement.onerror = () => {
          URL.revokeObjectURL(objectUrl);
        };
        
        audioElement.src = objectUrl;
        
        // Извлекаем информацию из имени файла
        let fileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // удаляем расширение
        
        // Если в имени файла есть тире или дефис, пробуем разделить на артиста и название
        if (fileName.includes(" - ")) {
          const parts = fileName.split(" - ");
          setArtist(parts[0].trim());
          setTitle(parts[1].trim());
        } else {
          setTitle(fileName);
        }
      }
    } catch (error) {
      console.error('Ошибка при получении метаданных:', error);
      setError('Не удалось получить метаданные из файла');
      
      // Запасной вариант - извлекаем хотя бы длительность и имя
      try {
        const audioElement = new Audio();
        const objectUrl = URL.createObjectURL(selectedFile);
        
        audioElement.onloadedmetadata = () => {
          setDuration(Math.round(audioElement.duration));
          URL.revokeObjectURL(objectUrl);
        };
        
        audioElement.src = objectUrl;
        
        let fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
        if (fileName.includes(" - ")) {
          const parts = fileName.split(" - ");
          setArtist(parts[0].trim());
          setTitle(parts[1].trim());
        } else {
          setTitle(fileName);
        }
      } catch (e) {
        console.error('Запасной метод извлечения данных не сработал:', e);
      }
    } finally {
      setLoadingMetadata(false);
    }
  };

  // Обработчик загрузки обложки
  const handleCoverChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Выберите изображение для обложки');
      return;
    }

    setCoverFile(selectedFile);
    setCoverPreview(URL.createObjectURL(selectedFile));
  };

  // Отправка формы
  const handleSubmit = async () => {
    if (!file) {
      setError('Выберите аудиофайл');
      return;
    }

    if (!coverFile) {
      setError('Выберите изображение для обложки');
      return;
    }

    if (!title) {
      setError('Введите название трека');
      return;
    }

    if (!artist) {
      setError('Введите имя исполнителя');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('cover', coverFile);
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('album', album);
      formData.append('genre', genre);
      formData.append('description', description);
      formData.append('duration', duration);

      const response = await axios.post('/api/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess(response.data.track);
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Ошибка при загрузке трека');
      }
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      setError(error.response?.data?.message || 'Ошибка при загрузке трека');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : onClose}
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
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
        <Typography variant="h6">Загрузить трек</Typography>
        {!loading && (
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Аудиофайл
              </Typography>
              <Box 
                sx={{ 
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  mb: 1,
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(208, 188, 255, 0.04)'
                  }
                }}
                component="label"
                htmlFor="audio-upload"
              >
                {file ? (
                  <>
                    <AudioFile sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" noWrap>
                      {file.name}
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Выберите аудиофайл
                    </Typography>
                  </>
                )}
                {loadingMetadata && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    bgcolor: 'rgba(0,0,0,0.6)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderRadius: 1 
                  }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={handleFileChange}
                  disabled={loading || loadingMetadata}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
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
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundImage: coverPreview ? `url(${coverPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: coverPreview ? 'unset' : 'rgba(208, 188, 255, 0.04)'
                  }
                }}
                component="label"
                htmlFor="cover-upload"
              >
                {!coverPreview && (
                  <>
                    <Image sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Выберите изображение для обложки
                    </Typography>
                  </>
                )}
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverChange}
                  disabled={loading}
                />
              </Box>
            </Box>
          </Grid>

          
          <Grid item xs={12} md={8}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Трек успешно загружен!
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Название трека"
                  fullWidth
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Исполнитель"
                  fullWidth
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Альбом"
                  fullWidth
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="genre-label">Жанр</InputLabel>
                  <Select
                    labelId="genre-label"
                    value={genre}
                    label="Жанр"
                    onChange={(e) => setGenre(e.target.value)}
                    disabled={loading}
                  >
                    <MenuItem value="">
                      <em>Не выбрано</em>
                    </MenuItem>
                    {genres.map((g) => (
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1.5, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}>
                  <MusicNote sx={{ color: 'primary.main', mr: 1 }} />
                  <Box>
                    <Typography variant="body2">
                      Длительность: {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file ? `Файл: ${file.name}` : 'Файл не выбран'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
          disabled={loading || !file || !coverFile || !title || !artist}
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
        >
          {loading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MusicUploadDialog; 