import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Grid, Chip, Avatar, IconButton, Divider, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';


import BugReportIcon from '@mui/icons-material/BugReport';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';


const BugContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
}));

const BugHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#f8f8f8',
  borderRadius: theme.shape.borderRadius,
}));

const BugCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const BugDetailCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const CommentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0',
}));

const ImagePreview = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '200px',
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};


const StatusBadge = ({ status }) => {
  
  if (!status || status === 'Неизвестно') {
    return (
      <Chip 
        icon={<PendingIcon />} 
        label="Открыт" 
        color="error" 
        sx={{ fontWeight: 'bold' }} 
        size="small"
      />
    );
  }
  
  if (status === 'Решено') {
    return (
      <Chip 
        icon={<CheckCircleIcon />} 
        label={status} 
        color="success" 
        sx={{ fontWeight: 'bold' }} 
        size="small"
      />
    );
  } else if (status === 'В обработке') {
    return (
      <Chip 
        icon={<PendingIcon />} 
        label={status} 
        color="primary" 
        sx={{ fontWeight: 'bold' }} 
        size="small"
      />
    );
  } else if (status === 'Открыт') {
    return (
      <Chip 
        icon={<ErrorIcon />} 
        label={status} 
        color="error" 
        sx={{ fontWeight: 'bold' }} 
        size="small"
      />
    );
  }
  
  
  return (
    <Chip 
      icon={<PendingIcon />} 
      label="Открыт" 
      color="error" 
      sx={{ fontWeight: 'bold' }} 
      size="small"
    />
  );
};

const BugReportPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newBug, setNewBug] = useState({
    subject: '',
    text: '',
    site_link: 'k-connect.ru'
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bugs');
      setBugs(response.data.bugs || []);
    } catch (err) {
      console.error('Error loading bugs:', err);
      setError('Не удалось загрузить баг-репорты');
    } finally {
      setLoading(false);
    }
  };

  const handleBugClick = async (bugId) => {
    try {
      const response = await axios.get(`/api/bugs/${bugId}`);
      setSelectedBug(response.data.bug);
    } catch (err) {
      console.error('Error loading bug details:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBug(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('subject', newBug.subject);
      formData.append('text', newBug.text);
      formData.append('site_link', newBug.site_link);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('/api/bugs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        
        setNewBug({
          subject: '',
          text: '',
          site_link: 'k-connect.ru'
        });
        setImageFile(null);
        setImagePreview('');
        
        loadBugs();
      }
    } catch (err) {
      console.error('Error submitting bug:', err);
      setError(err.response?.data?.error || 'Ошибка при отправке баг-репорта');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    try {
      const response = await axios.post(`/api/bugs/${selectedBug.id}/comments`, {
        comment_text: commentText
      });
      
      if (response.data.success) {
        
        setSelectedBug(prev => ({
          ...prev,
          comments: [...prev.comments, response.data.comment]
        }));
        setCommentText('');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleToggleLike = async (bugId) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.post(`/api/bugs/${bugId}/reaction`);
      
      if (response.data.success) {
        
        setBugs(prev => prev.map(bug => {
          if (bug.id === bugId) {
            return {
              ...bug,
              is_liked_by_user: response.data.reaction === 'added',
              likes_count: response.data.reaction === 'added' 
                ? bug.likes_count + 1 
                : bug.likes_count - 1
            };
          }
          return bug;
        }));
        
        
        if (selectedBug && selectedBug.id === bugId) {
          setSelectedBug(prev => ({
            ...prev,
            is_liked_by_user: response.data.reaction === 'added',
            likes_count: response.data.reaction === 'added' 
              ? prev.likes_count + 1 
              : prev.likes_count - 1
          }));
        }
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  const handleChangeStatus = async (bugId, newStatus) => {
    
    if (!isAuthenticated || ![3, 54, 57].includes(user?.id)) return;
    
    try {
      const response = await axios.post(`/api/bugs/${bugId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        
        setSelectedBug(prev => ({
          ...prev,
          status: response.data.status
        }));
        
        
        setBugs(prev => prev.map(bug => {
          if (bug.id === bugId) {
            return { ...bug, status: response.data.status };
          }
          return bug;
        }));
      }
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };

  const isAdmin = isAuthenticated && user && [3, 54, 57].includes(user.id);

  
  if (!selectedBug) {
    return (
      <Container maxWidth="md">
        <BugContainer>
          <BugHeader elevation={0}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <BugReportIcon fontSize="large" color="error" />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Баг-репорты
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Сообщите о найденных ошибках и проблемах на сайте
                </Typography>
              </Grid>
            </Grid>
          </BugHeader>

          
          <Paper sx={{ padding: 3, marginBottom: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Сообщить о проблеме
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="subject"
                    label="Заголовок"
                    fullWidth
                    required
                    value={newBug.subject}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 40 }}
                    helperText="До 40 символов"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="text"
                    label="Описание"
                    fullWidth
                    required
                    multiline
                    rows={4}
                    value={newBug.text}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 700 }}
                    helperText="До 700 символов"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="site_link"
                    label="Сайт"
                    select
                    fullWidth
                    value={newBug.site_link}
                    onChange={handleInputChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="k-connect.ru">К-Коннект</option>
                    <option value="elemsocial.com">Элемент</option>
                    <option value="clientelement.sault">Клиент Элемента</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    fullWidth
                  >
                    Загрузить фото
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Grid>
                {imagePreview && (
                  <Grid item xs={12}>
                    <ImagePreview src={imagePreview} alt="Preview" />
                  </Grid>
                )}
                {error && (
                  <Grid item xs={12}>
                    <Typography color="error">{error}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitLoading}
                    startIcon={
                      submitLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendIcon />
                      )
                    }
                  >
                    Отправить
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          
          <Typography variant="h6" component="h2" gutterBottom>
            Список проблем
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : bugs.length === 0 ? (
            <Typography align="center" color="textSecondary" my={4}>
              Баг-репортов пока нет
            </Typography>
          ) : (
            bugs.map(bug => (
              <BugCard key={bug.id} onClick={() => handleBugClick(bug.id)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="h3" noWrap>
                      {bug.subject}
                    </Typography>
                    <StatusBadge status={bug.status} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {bug.text}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Typography variant="caption" color="textSecondary">
                          {bug.user_name || 'Гость'} • {formatDate(bug.date)}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={bug.site_link} 
                          sx={{ ml: 1, fontSize: '0.7rem' }} 
                        />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike(bug.id);
                          }}
                          color={bug.is_liked_by_user ? "primary" : "default"}
                          disabled={!isAuthenticated}
                        >
                          {bug.is_liked_by_user ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                        </IconButton>
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {bug.likes_count || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </BugCard>
            ))
          )}
        </BugContainer>
      </Container>
    );
  }

  
  return (
    <Container maxWidth="md">
      <BugContainer>
        <Button 
          variant="outlined" 
          onClick={() => setSelectedBug(null)}
          sx={{ mb: 2 }}
        >
          Назад к списку
        </Button>

        <BugDetailCard>
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="h1">
                {selectedBug.subject}
              </Typography>
              <StatusBadge status={selectedBug.status} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1">
                {selectedBug.text}
              </Typography>
            </Grid>
            
            {selectedBug.image_url && (
              <Grid item xs={12}>
                <Box
                  component="img"
                  src={`https://${window.location.hostname}${selectedBug.image_url}`}
                  alt="Bug report"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(`https://${window.location.hostname}${selectedBug.image_url}`, '_blank')}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={selectedBug.user_avatar}
                      alt={selectedBug.user_name || 'Гость'}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    >
                      {selectedBug.user_name ? selectedBug.user_name[0] : 'G'}
                    </Avatar>
                    <Typography variant="body2">
                      {selectedBug.user_name || 'Гость'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(selectedBug.date)}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <IconButton 
                    size="small" 
                    onClick={() => handleToggleLike(selectedBug.id)}
                    color={selectedBug.is_liked_by_user ? "primary" : "default"}
                    disabled={!isAuthenticated}
                  >
                    {selectedBug.is_liked_by_user ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {selectedBug.likes_count || 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {isAdmin && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" gap={1}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="success"
                    onClick={() => handleChangeStatus(selectedBug.id, 'Решено')}
                  >
                    Решено
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    onClick={() => handleChangeStatus(selectedBug.id, 'В обработке')}
                  >
                    В обработке
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleChangeStatus(selectedBug.id, 'Открыт')}
                  >
                    Открыт
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </BugDetailCard>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          Комментарии ({selectedBug.comments?.length || 0})
        </Typography>
        
        
        {selectedBug.comments?.length > 0 ? (
          selectedBug.comments.map(comment => (
            <CommentCard key={comment.id}>
              <Box display="flex" alignItems="flex-start">
                <Avatar
                  src={comment.user_avatar}
                  alt={comment.user_name || 'Гость'}
                  sx={{ width: 32, height: 32, mr: 2 }}
                >
                  {comment.user_name ? comment.user_name[0] : 'G'}
                </Avatar>
                <Box flex={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle2">
                      {comment.user_name || 'Гость'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(comment.timestamp)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.comment_text}</Typography>
                </Box>
              </Box>
            </CommentCard>
          ))
        ) : (
          <Typography align="center" color="textSecondary" my={2}>
            Комментариев пока нет
          </Typography>
        )}
        
        
        <Paper sx={{ padding: 2, mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Добавить комментарий..."
            multiline
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            inputProps={{ maxLength: 500 }}
          />
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
            >
              Отправить
            </Button>
          </Box>
        </Paper>
      </BugContainer>
    </Container>
  );
};

export default BugReportPage; 