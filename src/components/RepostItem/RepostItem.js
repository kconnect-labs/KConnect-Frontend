import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Avatar, 
  Card, 
  CardContent, 
  IconButton,
  MenuItem,
  Menu,
  styled,
  Fade
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { formatTimeAgo } from '../../utils/dateUtils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { AuthContext } from '../../context/AuthContext';
import { MusicContext } from '../../context/MusicContext';

// Стилизованные компоненты
const RepostCard = styled(Card)(({ theme, background }) => ({
  marginBottom: '4px',
  borderRadius: '12px',
  backgroundColor: '#1E1E1E', // Fallback color
  backgroundImage: background ? `linear-gradient(rgba(120, 100, 160, 0.03), rgba(20, 20, 20, 0.95)), url(${background})` : 
                'linear-gradient(145deg, rgba(30, 30, 30, 0.97), rgba(26, 26, 26, 0.99))',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'overlay',
  backdropFilter: 'blur(15px)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  overflow: 'visible',
  cursor: 'pointer',
  transition: 'opacity 0.3s ease',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '12px',
    background: 'rgba(100, 90, 140, 0.02)',
    backdropFilter: 'blur(10px)',
    zIndex: 0
  }
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '12px',
  background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(26, 26, 26, 0.97))',
  backdropFilter: 'blur(15px)',
  zIndex: 0
}));

const OriginalPostCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: 'rgba(42, 42, 42, 0.8)',
  backdropFilter: 'blur(5px)',
  marginTop: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  position: 'relative',
  zIndex: 1
}));

const MarkdownContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  '& p': {
    margin: 0,
    marginBottom: theme.spacing(1),
    wordBreak: 'break-word'
  },
  '& p:last-child': {
    marginBottom: 0
  },
  '& img': {
    maxWidth: '100%',
    borderRadius: '8px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(2)
  }
}));

const BlurredMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    '& .MuiMenuItem-root': {
      '&:hover': {
        backgroundColor: 'rgba(100, 90, 140, 0.1)',
      },
    }
  }
}));

// Simple verification badge component if project-specific one is not available
const VerificationBadge = ({ status, size }) => {
  if (!status) return null;
  
  return (
    <CheckCircleIcon 
      sx={{ 
        fontSize: size === 'small' ? 16 : 20,
        ml: 0.5,
        color: status === 1 ? '#9e9e9e' : 
              status === 2 ? '#d67270' : 
              status === 3 ? '#b39ddb' : 
              '#7B68EE'
      }} 
    />
  );
};

// Music track preview component
const MusicTrackPreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1.5),
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  border: '1px solid rgba(255, 255, 255, 0.07)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)'
  }
}));

const RepostItem = ({ repost, onDelete, onOpenLightbox }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(MusicContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef(null);
  
  // Process music tracks
  const [postMusicTracks, setPostMusicTracks] = useState([]);
  
  // Получаем информацию о репосте и оригинальном посте
  const originalPost = repost.original_post;
  
  // Обрабатываем изображения из оригинального поста
  const images = [];
  if (originalPost.images && Array.isArray(originalPost.images)) {
    images.push(...originalPost.images);
  } else if (originalPost.image) {
    images.push(originalPost.image);
  }
  
  // Parse music tracks on component mount
  React.useEffect(() => {
    if (originalPost.music) {
      try {
        const parsedTracks = typeof originalPost.music === 'string' ? 
          JSON.parse(originalPost.music) : originalPost.music;
        setPostMusicTracks(Array.isArray(parsedTracks) ? parsedTracks : []);
      } catch (error) {
        console.error('Error parsing music tracks in repost:', error);
        setPostMusicTracks([]);
      }
    } else {
      setPostMusicTracks([]);
    }
  }, [originalPost]);
  
  // Function to handle track play
  const handleTrackPlay = (track, event) => {
    event.stopPropagation();
    
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay(); // Play/pause the current track
    } else {
      playTrack(track); // Play a new track
    }
  };
  
  // Функция для обработки клика на пост
  const handleClick = (e) => {
    // Предотвращаем переход по ссылке, если клик был на кнопке или другом интерактивном элементе
    if (e.target.closest('button') || e.target.closest('.MuiIconButton-root')) {
      return;
    }
    
    // Переход на страницу оригинального поста
    navigate(`/post/${originalPost.id}`);
  };
  
  // Функция для обработки клика на меню
  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Функция для удаления репоста
  const handleDelete = async () => {
    handleMenuClose();
    setIsDeleting(true);
    
    try {
      const response = await axios.delete(`/api/reposts/${repost.id}`);
      if (response.data && response.data.success) {
        // Не сразу вызываем onDelete, а ждем анимацию
        setTimeout(() => {
          if (onDelete) {
            // Передаем ID с префиксом repost- чтобы обработчик мог отличить репост от обычного поста
            onDelete(`repost-${repost.id}`);
          }
        }, 300); // Длительность анимации
      }
    } catch (error) {
      console.error('Error deleting repost:', error);
      setIsDeleting(false); // В случае ошибки сбрасываем состояние удаления
    }
  };
  
  // Получаем аватар пользователя для использования в качестве фона
  const backgroundImage = repost.user?.avatar_url || null;
  
  return (
    <Fade in={!isDeleting} timeout={300}>
      <RepostCard 
        ref={cardRef} 
        onClick={handleClick} 
        background={backgroundImage}
        sx={{
          opacity: isDeleting ? 0 : 1,
          transform: isDeleting ? 'translateY(10px)' : 'none',
        }}
      >
        <CardOverlay />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          
          <UserInfo>
            <Avatar 
              src={repost.user.avatar_url}
              alt={repost.user.name}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mr: 0.5 }}>
                  {repost.user.name}
                </Typography>
                <VerificationBadge status={repost.user.verification} size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  @{repost.user.username}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RepeatIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Поделился постом • {formatTimeAgo(repost.timestamp)}
                </Typography>
              </Box>
            </Box>
            
            
            {user && user.id === repost.user.id && (
              <>
                <IconButton 
                  size="small" 
                  onClick={handleMenuOpen}
                  sx={{ 
                    ml: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <BlurredMenu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MenuItem onClick={handleDelete}>Удалить репост</MenuItem>
                </BlurredMenu>
              </>
            )}
          </UserInfo>

          
          {repost.repost_text && (
            <MarkdownContent sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ 
                mb: 1.5, 
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}>
                <ReactMarkdown transformLinkUri={null}>{repost.repost_text}</ReactMarkdown>
              </Typography>
            </MarkdownContent>
          )}
          
          
          <OriginalPostCard>
            <UserInfo>
              <Avatar 
                src={originalPost.user.avatar_url}
                alt={originalPost.user.name}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 0.5 }}>
                    {originalPost.user.name}
                  </Typography>
                  <VerificationBadge status={originalPost.user.verification} size="small" />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    @{originalPost.user.username}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatTimeAgo(originalPost.timestamp)}
                </Typography>
              </Box>
            </UserInfo>
            
            
            <MarkdownContent>
              <Typography variant="body1" sx={{ 
                fontSize: '0.9rem', 
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <ReactMarkdown transformLinkUri={null}>{originalPost.content}</ReactMarkdown>
              </Typography>
            </MarkdownContent>
            
            
            {postMusicTracks.length > 0 && (
              <Box sx={{ mt: 1, mb: 1 }}>
                {postMusicTracks.slice(0, 2).map((track, index) => (
                  <MusicTrackPreview 
                    key={`track-${index}`} 
                    onClick={(e) => handleTrackPlay(track, e)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '6px', 
                        overflow: 'hidden', 
                        position: 'relative',
                        mr: 1.5,
                        flexShrink: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={
                          !track.cover_path ? '/uploads/system/album_placeholder.jpg' :
                          track.cover_path.startsWith('/static/') ? track.cover_path :
                          track.cover_path.startsWith('static/') ? `/${track.cover_path}` :
                          track.cover_path.startsWith('http') ? track.cover_path :
                          `/static/music/${track.cover_path}`
                        } 
                        alt={track.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/uploads/system/album_placeholder.jpg';
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <MusicNoteIcon 
                          sx={{ 
                            fontSize: 14, 
                            color: 'rgba(255, 255, 255, 0.9)',
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
                          }} 
                        />
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="caption" 
                        noWrap 
                        sx={{ 
                          fontWeight: 'medium',
                          color: currentTrack && currentTrack.id === track.id ? 'primary.main' : 'inherit',
                          fontSize: '0.8rem',
                          letterSpacing: '0.2px',
                          display: 'block'
                        }}
                      >
                        {track.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        noWrap 
                        sx={{ display: 'block', fontSize: '0.7rem' }}
                      >
                        {track.artist}
                      </Typography>
                    </Box>
                    {currentTrack && currentTrack.id === track.id && (
                      isPlaying ? (
                        <PauseIcon color="primary" fontSize="small" sx={{ 
                          ml: 1,
                          animation: 'pulse 1.5s infinite ease-in-out',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.7, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.1)' },
                            '100%': { opacity: 0.7, transform: 'scale(1)' }
                          }
                        }} />
                      ) : (
                        <PlayArrowIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                      )
                    )}
                  </MusicTrackPreview>
                ))}
                {postMusicTracks.length > 2 && (
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: 'block', 
                    textAlign: 'right', 
                    mt: 0.5, 
                    fontStyle: 'italic',
                    fontSize: '0.75rem',
                    opacity: 0.8
                  }}>
                    + еще {postMusicTracks.length - 2} трек(ов)
                  </Typography>
                )}
              </Box>
            )}
            
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, opacity: 0.9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <FavoriteIcon sx={{ fontSize: 16, mr: 0.5, color: '#e57373' }} />
                <Typography variant="caption" color="text.secondary">
                  {originalPost.likes_count || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {originalPost.comments_count || 0}
                </Typography>
              </Box>
              {postMusicTracks.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <MusicNoteIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {postMusicTracks.length}
                  </Typography>
                </Box>
              )}
            </Box>
          </OriginalPostCard>
        </CardContent>
      </RepostCard>
    </Fade>
  );
};

export default RepostItem; 