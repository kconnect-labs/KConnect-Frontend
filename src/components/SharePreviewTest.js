import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

/**
 * Компонент для тестирования предпросмотра ссылок в K-Connect
 * Позволяет увидеть, как будут выглядеть ссылки в мессенджерах и соцсетях
 */
const SharePreviewTest = () => {
  const [url, setUrl] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const fetchPreviewData = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      const isRelative = !url.startsWith('http');
      const fullUrl = isRelative 
        ? `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}` 
        : url;
      
      
      const urlObj = new URL(fullUrl);
      const path = urlObj.pathname;
      
      
      let type = 'website';
      let title = 'K-Connect';
      let description = 'Социальная сеть от независимого разработчика';
      let image = '/icon-512.png';
      
      if (path.includes('/post/')) {
        type = 'article';
        title = 'Пост пользователя';
        description = 'Интересный пост в социальной сети K-Connect';
        image = '/static/images/post_preview.jpg';
      } else if (path.includes('/profile/')) {
        type = 'profile';
        const username = path.split('/').pop();
        title = `Профиль @${username}`;
        description = `Профиль пользователя ${username} в K-Connect`;
        image = '/static/images/profile_preview.jpg';
      } else if (path.includes('/music')) {
        type = 'music';
        title = 'Музыка в K-Connect';
        description = 'Слушайте музыку в социальной сети K-Connect';
        image = '/static/images/music_preview.jpg';
      }
      
      setPreviewData({
        url: fullUrl,
        title,
        description,
        image,
        type
      });
    } catch (err) {
      console.error('Ошибка при получении данных для предпросмотра:', err);
      setError('Не удалось получить данные для предпросмотра. Проверьте URL и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Тестирование предпросмотра ссылок
        </Typography>
        
        <Typography variant="body1" paragraph>
          Введите URL страницы K-Connect, чтобы увидеть, как она будет отображаться при шаринге в мессенджерах и соцсетях.
        </Typography>
        
        <Box sx={{ display: 'flex', mb: 3 }}>
          <TextField
            fullWidth
            label="URL страницы"
            value={url}
            onChange={handleUrlChange}
            placeholder="Например: /post/123 или /profile/username"
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            onClick={fetchPreviewData}
            disabled={!url || loading}
          >
            {loading ? 'Загрузка...' : 'Проверить'}
          </Button>
        </Box>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {previewData && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Превью ссылки:
            </Typography>
            
            <Paper sx={{ mb: 3, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="caption" color="textSecondary">
                  Так будет выглядеть ссылка при шаринге:
                </Typography>
              </Box>
              
              <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, border: '1px solid #eee' }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 200, sm: 'auto' }
                  }}
                  image={previewData.image}
                  alt={previewData.title}
                />
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {new URL(previewData.url).hostname}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {previewData.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {previewData.description}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Мета-теги:
            </Typography>
            
            <Paper>
              <List>
                <ListItem divider>
                  <ListItemText
                    primary="Заголовок (og:title)"
                    secondary={previewData.title}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText
                    primary="Описание (og:description)"
                    secondary={previewData.description}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText
                    primary="Изображение (og:image)"
                    secondary={previewData.image}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText
                    primary="URL (og:url)"
                    secondary={previewData.url}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Тип (og:type)"
                    secondary={previewData.type}
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SharePreviewTest; 