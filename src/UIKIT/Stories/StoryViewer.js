import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, styled, Avatar, Dialog, DialogTitle, DialogActions, Button, useMediaQuery, Fade, Popper, Tabs, Tab, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../../context/AuthContext';
import { deleteStory as apiDeleteStory, addStoryReaction, getStoryReactionsWithUsers } from './storiesApi';

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '🔥'];

const ReactionMenu = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  bottom: '10%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 12,
  zIndex: 20,
  background: 'rgba(30,30,30,0.95)',
  borderRadius: 24,
  padding: '8px 16px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
  alignItems: 'center',
  maxWidth: '90%',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.1)',
}));

const ReactionButton = styled(IconButton)(({ theme, selected }) => ({
  fontSize: 28,
  transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
  transform: selected ? 'translateY(-18px) scale(1.25)' : 'none',
  filter: selected ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' : 'none',
  background: selected ? 'rgba(255,255,255,0.08)' : 'none',
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  zIndex: selected ? 2 : 1,
  color: selected ? theme.palette.primary.main : 'inherit',
  '&:hover': {
    background: 'rgba(255,255,255,0.12)',
    transform: 'translateY(-8px) scale(1.1)',
  },
}));

const ViewerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  zIndex: 1300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
}));

const StoryContentContainer = styled(Box)(({ theme, $isMobile }) => ({
  width: $isMobile ? '100vw' : 'auto',
  height: $isMobile ? '100vh' : 'auto',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  background: 'rgba(0,0,0,0.95)',
  minWidth: $isMobile ? '100vw' : 420,
  minHeight: $isMobile ? '100vh' : 0,
  maxWidth: $isMobile ? '100vw' : 420,
  maxHeight: $isMobile ? '100vh' : '90vh',
  aspectRatio: $isMobile ? undefined : '9/16',
}));

const BlurredMediaBackground = styled(Box)(({ theme, imageUrl }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(20px)',
  transform: 'scale(1.05)',
  zIndex: -1,
  opacity: 1,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 4,
  padding: 16,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
}));

const ProgressBar = styled(Box)(({ theme, progress }) => ({
  flex: 1,
  height: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 2,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    display: 'block',
    height: '100%',
    width: `${progress}%`,
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.1s linear',
  },
}));

const MediaContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  height: '100%',
  maxHeight: '100%',
  overflow: 'hidden'
}));

const Media = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'relative',
  zIndex: 1,
  maxWidth: '100%',
  maxHeight: '100%'
}));

const Video = styled('video')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'relative',
  zIndex: 1,
  maxWidth: '100%',
  maxHeight: '100%'
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  right: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  zIndex: 5,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '4px 8px',
  borderRadius: '20px',
  backdropFilter: 'blur(4px)',
  maxHeight: 'calc(100% - 32px)'
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 5,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}));

const Header = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 10,
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  zIndex: 1,
  maxWidth: 'calc(100% - 80px)',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  border: `2px solid ${theme.palette.primary.main}`,
  flexShrink: 0,
}));

const ClickableOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '50%',
  zIndex: 2,
  cursor: 'pointer',
  height: '100%'
}));

// Универсальная функция для форматирования времени с учетом локали
const formatTime = (created_at_unix, created_at_utc) => {
  let date;
  if (created_at_utc) {
    // Предпочитаем ISO 8601 строку с 'Z', так как она явно указывает UTC
    // JS Date constructor и Date.parse корректно обрабатывают 'Z'
    date = new Date(created_at_utc);
  } else if (created_at_unix) {
    // Unix timestamp - секунды с эпохи в UTC
    date = new Date(created_at_unix * 1000);
  } else {
    return '';
  }

  // Если дата некорректна после парсинга
  if (isNaN(date.getTime())) {
      console.error('Некорректная дата получена или спарсена:', { created_at_unix, created_at_utc });
      return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime(); // Разница в миллисекундах (в UTC)

  // Пороговые значения в миллисекундах
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < 0) return 'в будущем'; // На всякий случай
  if (diffMs < minute) return 'только что'; // Меньше 1 минуты
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}м`; // Меньше 1 часа
  if (diffMs < day) return `${Math.floor(diffMs / hour)}ч`; // Меньше 24 часов

  // Если больше 24 часов, показываем дату и время в локальном формате
  // toLocaleString использует локальный часовой пояс клиента по умолчанию
  return date.toLocaleString(undefined, {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const ReactionUsersDialog = ({ open, onClose, storyId }) => {
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getStoryReactionsWithUsers(storyId)
      .then((data) => {
        setReactions(data);
      })
      .finally(() => setLoading(false));
  }, [open, storyId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(24, 24, 28, 0.98)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span>Реакции на историю</span>
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <Box sx={{ px: 2, pt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : reactions.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Нет реакций</Typography>
        ) : (
          <Box>
            {reactions.map((user) => (
              <Box key={user.user_id + user.emoji} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                <Avatar src={user.photo ? `/static/uploads/avatar/${user.user_id}/${user.photo}` : undefined} />
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>{user.name || user.username}</Typography>
                  <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
                </Box>
                <Box sx={{ ml: 'auto', fontSize: 22 }}>{user.emoji}</Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Box sx={{ height: 8 }} />
    </Dialog>
  );
};

const StoryViewer = ({ 
  userStories, 
  currentUserIndex, 
  setCurrentUserIndex, 
  onClose, 
  currentUserId, 
  onStoryDeleted,
  isMuted,
  onToggleSound,
  isMobile,
  onStoryViewed,
  onNextUser
}) => {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const progressInterval = useRef(null);
  const videoRef = useRef(null);
  const storyDuration = 5000; // 5 seconds per story
  const theme = useTheme();
  const viewedStories = useRef(new Set()); // For tracking viewed stories
  const { user: currentUser } = useAuth(); // Get current logged-in user
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const alreadyViewedStories = useRef(new Set());
  const [lastLoadedBg, setLastLoadedBg] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [reactionMenuOpen, setReactionMenuOpen] = useState(false);
  const [myReaction, setMyReaction] = useState(null);
  const [reactionAnchor, setReactionAnchor] = useState(null);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [showReactionsDialog, setShowReactionsDialog] = useState(false);

  // useRef для отслеживания предыдущего userId и stories.length
  const prevUserId = useRef();
  const prevStoriesLength = useRef();

  useEffect(() => {
    // Сбрасываем только если сменился пользователь или количество историй
    const newUserId = userStories?.user?.id;
    const newStoriesLength = userStories?.stories?.length;
    if (prevUserId.current !== newUserId || prevStoriesLength.current !== newStoriesLength) {
      setStories(userStories.stories || []);
      setCurrentIndex(0);
      setProgress(0);
      prevUserId.current = newUserId;
      prevStoriesLength.current = newStoriesLength;
    } else if (userStories && userStories.stories) {
      setStories(userStories.stories);
    }
  }, [userStories]);

  const recordStoryView = (storyId) => {
    if (!storyId) return;
    if (alreadyViewedStories.current.has(storyId)) return;
    alreadyViewedStories.current.add(storyId);
    onStoryViewed?.(storyId);
  };

  useEffect(() => {
    if (stories.length > 0 && currentIndex < stories.length) {
      recordStoryView(stories[currentIndex].id);
      startProgress();
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, stories]);

  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setProgress(0);
    const isVideo = stories[currentIndex]?.media_url?.match(/\.(mp4|webm|mov)$/i);
    const duration = isVideo ? (videoRef.current?.duration || 5) * 1000 : storyDuration;
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          handleNext();
          return 0;
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (onNextUser) {
        onNextUser();
      } else {
        onClose();
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleOverlayClick = (e) => {
    const { clientX } = e;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;
    
    if (clickPosition < width / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleClose = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    onClose();
  };

  const handleDeleteStory = async () => {
    try {
      const deletedId = stories[currentIndex].id;
      await apiDeleteStory(deletedId);
      setDeleteDialogOpen(false);
      // Удаляем из локального состояния
      const updatedStories = stories.filter((_, idx) => idx !== currentIndex);
      if (updatedStories.length === 0) {
        // Если больше нет историй, закрываем viewer
        if (onStoryDeleted) onStoryDeleted(deletedId); // Сообщаем родителю
        onClose();
      } else {
        setStories(updatedStories);
        if (currentIndex >= updatedStories.length) {
          setCurrentIndex(updatedStories.length - 1);
        }
        if (onStoryDeleted) onStoryDeleted(deletedId); // Сообщаем родителю
      }
      // Показываем уведомление через NotificationManager
      window.dispatchEvent(new CustomEvent('show-error', {
        detail: {
          message: 'История удалена',
          shortMessage: 'Удалено',
          notificationType: 'success',
          animationType: 'pill',
        }
      }));
    } catch (error) {
      console.error('Error deleting story:', error);
      window.dispatchEvent(new CustomEvent('show-error', {
        detail: {
          message: 'Ошибка при удалении истории',
          shortMessage: 'Ошибка',
          notificationType: 'error',
          animationType: 'pill',
        }
      }));
    }
  };

  useEffect(() => {
    setBgLoaded(false);
  }, [currentIndex, stories]);

  useEffect(() => {
    if (stories.length > 0 && currentIndex < stories.length) {
      if (stories[currentIndex]?.media_url) {
        if (bgLoaded) setLastLoadedBg(stories[currentIndex].media_url);
      }
    }
  }, [bgLoaded, currentIndex, stories]);

  useEffect(() => {
    setReactionMenuOpen(false);
    setReactionAnchor(null);
    setReactionLoading(false);
    // Определяем свою реакцию из currentStory.user_reaction (если есть)
    if (stories[currentIndex] && stories[currentIndex].user_reaction) {
      setMyReaction(stories[currentIndex].user_reaction);
    } else {
      setMyReaction(null);
    }
  }, [currentIndex, stories]);

  if (!stories.length) return null;
  const currentStory = stories[currentIndex];
  const displayUser = userStories?.user || {};

  // Определяем тип медиа для текущей истории
  const currentMediaType = currentStory?.media_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' 
                         : currentStory?.media_url?.match(/\.(mp4|mov|webm)$/i) ? 'video' 
                         : null;

  const handleReactionClick = (e) => {
    e.stopPropagation();
    setReactionMenuOpen((open) => !open);
    setReactionAnchor(e.currentTarget);
  };

  const handleSelectReaction = async (emoji) => {
    if (reactionLoading) return;
    setReactionLoading(true);
    try {
      if (myReaction === emoji) {
        // Снять реакцию
        await addStoryReaction(currentStory.id, emoji);
        setMyReaction(null);
      } else {
        await addStoryReaction(currentStory.id, emoji);
        setMyReaction(emoji);
      }
      setReactionMenuOpen(false);
    } finally {
      setReactionLoading(false);
    }
  };

  const isMyStory = currentUser?.id === displayUser.id;

  return (
    <ViewerContainer onClick={handleClose}>
      <StoryContentContainer $isMobile={isMobileScreen || isMobile} onClick={(e) => e.stopPropagation()}>
        <ProgressContainer>
          {stories.map((_, index) => (
            <ProgressBar
              key={index}
              progress={index === currentIndex ? progress : index < currentIndex ? 100 : 0}
            />
          ))}
        </ProgressContainer>

        <Header>
          <UserInfo>
            <UserAvatar 
              src={displayUser.photo ? `/static/uploads/avatar/${displayUser.id}/${displayUser.photo}` : undefined}
              alt={displayUser.name || 'User'}
            />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle1" color="white" sx={{ fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {displayUser.name || displayUser.username || 'Пользователь'}
              </Typography>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" sx={{ lineHeight: 1.2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {formatTime(currentStory?.created_at_unix, currentStory?.created_at_utc)}
              </Typography>
            </Box>
          </UserInfo>
          <Box>
            {currentUser?.id === displayUser.id && (
              <IconButton onClick={(e) => { e.stopPropagation(); setDeleteDialogOpen(true); }} sx={{ color: 'white', mr: 1 }}>
                <DeleteIcon />
              </IconButton>
            )}
            <IconButton onClick={(e) => { e.stopPropagation(); handleClose(); }} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Header>

        <MediaContainer sx={{ position: 'relative' }}>
          {lastLoadedBg && (
            <BlurredMediaBackground
              style={{
                backgroundImage: `url(${lastLoadedBg})`,
                opacity: bgLoaded ? 0 : 1,
                zIndex: 0,
                transition: 'opacity 0.3s'
              }}
            />
          )}
          {currentStory?.media_url && (
            <BlurredMediaBackground
              style={{
                backgroundImage: `url(${currentStory.media_url})`,
                opacity: bgLoaded ? 1 : 0,
                zIndex: 1,
                transition: 'opacity 0.3s'
              }}
            >
              <img
                src={currentStory.media_url}
                style={{ display: 'none' }}
                onLoad={() => setBgLoaded(true)}
                alt="preload"
              />
            </BlurredMediaBackground>
          )}
          <ClickableOverlay style={{ left: 0 }} onClick={handleOverlayClick} />
          <ClickableOverlay style={{ right: 0, left: 'auto' }} onClick={handleOverlayClick} />
          {currentMediaType === 'image' ? (
            <>
              <Media
                src={currentStory?.media_url}
                alt="Story"
                onLoad={startProgress}
              />
              <ControlsContainer>
                <VisibilityIcon sx={{ color: 'white', fontSize: '1rem' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    ml: 0.5
                  }}
                >
                  {currentStory?.view_count || 0}
                </Typography>
              </ControlsContainer>
            </>
          ) : currentMediaType === 'video' ? (
            <>
              <Video
                ref={videoRef}
                src={currentStory?.media_url}
                loop
                autoPlay
                playsInline
                muted={isMuted}
                onLoadedData={startProgress}
              />
              <ControlsContainer>
                <VisibilityIcon sx={{ color: 'white', fontSize: '1rem' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    ml: 0.5
                  }}
                >
                  {currentStory?.view_count || 0}
                </Typography>
                <IconButton
                  onClick={onToggleSound}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    width: 32,
                    height: 32,
                    padding: 0,
                  }}
                >
                  {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                </IconButton>
              </ControlsContainer>
            </>
          ) : null}
          {/* Реакции */}
          <Box sx={{ position: 'absolute', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 20 }}>
            <IconButton
              onClick={isMyStory ? () => setShowReactionsDialog(true) : handleReactionClick}
              sx={{
                fontSize: 28,
                background: myReaction ? 'rgba(255,255,255,0.08)' : 'rgba(30,30,30,0.7)',
                border: myReaction ? `2px solid ${theme.palette.primary.main}` : 'none',
                color: myReaction ? theme.palette.primary.main : 'inherit',
                transition: 'all 0.2s',
                boxShadow: myReaction ? '0 2px 12px rgba(0,0,0,0.18)' : 'none',
              }}
            >
              {myReaction || '😊'}
            </IconButton>
            {!isMyStory && (
              <Popper open={reactionMenuOpen} anchorEl={reactionAnchor} placement="top" transition disablePortal>
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={200}>
                    <ReactionMenu>
                      {REACTION_EMOJIS.map((emoji) => (
                        <ReactionButton
                          key={emoji}
                          selected={myReaction === emoji}
                          onClick={() => handleSelectReaction(emoji)}
                          disabled={reactionLoading}
                        >
                          {emoji}
                        </ReactionButton>
                      ))}
                    </ReactionMenu>
                  </Fade>
                )}
              </Popper>
            )}
          </Box>
        </MediaContainer>
      </StoryContentContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удалить историю?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDeleteStory} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      <ReactionUsersDialog open={showReactionsDialog} onClose={() => setShowReactionsDialog(false)} storyId={currentStory?.id} />
    </ViewerContainer>
  );
};

export default StoryViewer;