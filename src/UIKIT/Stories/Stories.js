import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Box, Avatar, Typography, IconButton, styled, Card, CircularProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useNavigate } from 'react-router-dom';
import StoryViewer from './StoryViewer';
import * as StoryViewerComponents from './StoryViewer';
import { AuthContext } from '../../context/AuthContext';
import { useStoriesFeed, useStoryActions, viewStory } from './storiesApi';
import { createPortal } from 'react-dom';

// Деструктурируем нужные компоненты из импорта
const { 
  StoryContentContainer, 
  MediaContainer, 
  Media: StoryMedia, 
  BlurredMediaBackground,
  ProgressContainer,
  Header, 
  UserInfo, 
  UserAvatar 
} = StoryViewerComponents;

const StoriesCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)', 
 border: theme.palette.mode === 'dark'   
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : '1px solid rgba(0, 0, 0, 0.1)',
  marginBottom: 0
}));

const StoriesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 2,
  overflowX: 'auto',
  padding: '16px',
  '&::-webkit-scrollbar': {
    height: '0px',
    display: 'none'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
}));

const StoryItem = styled(Box)(({ theme, hasStory }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease',
  },
}));

const StoryPreview = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  overflow: 'hidden',
  border: `2px solid ${theme.palette.primary.main}`,
  
  background: theme.palette.background.paper,
'&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: '50%',
    zIndex: -1,
  },
}));

const AddStoryButton = styled(IconButton)(({ theme }) => ({
  width: 64,
  height: 64,
  border: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: 'rgba(208, 188, 255, 0.1)',
  },
}));

const PreviewActionBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: 16,
  zIndex: 100, // Убедимся, что кнопки поверх предпросмотра
}));

const Stories = ({ userIdentifier = null }) => {
  const { stories, loading, loadStories, setStories } = useStoriesFeed(userIdentifier);
  const { publish: publishStory } = useStoryActions();
  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [viewedStories, setViewedStories] = useState(new Set());
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Если пользователь не типа 'user', не показываем компонент
  // Для просмотра историй другого пользователя не проверяем тип аккаунта
  if (!userIdentifier && (!user || user.account_type !== 'user')) {
    return null;
  }

  // Определяем, является ли текущий профиль профилем авторизованного пользователя
  const isOwnProfile = userIdentifier === user?.id;

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 600px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Отслеживаем изменение громкости на мобильных устройствах
  useEffect(() => {
    if (!isMobile || !videoRef.current) return;

    const handleVolumeChange = (e) => {
      if (e.target.volume > 0) {
        setIsMuted(false);
      }
    };

    const video = videoRef.current;
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [isMobile]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  useEffect(() => {
    if (!stories || stories.length === 0) return;
    setViewedStories(() => {
      const viewed = new Set();
      stories.forEach(storyGroup => {
        storyGroup.stories.forEach(story => {
          if (story.view_count > 0) {
            viewed.add(story.id);
          }
        });
      });
      return viewed;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stories && stories.length > 0]);

  // Преобразуем истории в плоский массив
  const flattenedStories = useMemo(() => {
    if (!stories || stories.length === 0) return [];
    return stories.flatMap(storyGroup => 
      storyGroup.stories.map(story => ({
        ...story,
        user: storyGroup.user
      }))
    ).sort((a, b) => {
      const aViewed = a.view_count > 0;
      const bViewed = b.view_count > 0;
      if (aViewed !== bViewed) {
        return aViewed ? 1 : -1;
      }
      const aDate = new Date(a.created_at_utc || a.created_at);
      const bDate = new Date(b.created_at_utc || b.created_at);
      return bDate - aDate;
    });
  }, [stories]);

  const handleStoryClick = (storyId) => {
    const idx = flattenedStories.findIndex(s => s.id === storyId);
    setCurrentUserIndex(idx);
  };

  const handleCloseStory = () => {
    setCurrentUserIndex(null);
  };

  const handleAddStory = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancelPreview = () => {
    setPreviewFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePublishStory = async () => {
    if (!previewFile) return;
    try {
      await publishStory(previewFile);
      await loadStories(); // Обновляем список историй после успешной загрузки
      handleCancelPreview();
    } catch (error) {
      console.error('Error uploading story:', error);
      alert('Ошибка при загрузке истории');
    }
  };

  const handleToggleSound = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const previewMediaType = previewFile?.type.startsWith('video') ? 'video' : 'image';

  const areAllStoriesViewed = (storyGroup) => {
    return storyGroup.stories.every(story => viewedStories.has(story.id));
  };

  const updateViewedStories = async (storyId) => {
    // Создаём новый Set, чтобы React всегда увидел изменение
    setViewedStories(prev => new Set([...prev, storyId]));
    try {
      await viewStory(storyId);
      setStories(prevStories => prevStories.map(storyGroup => ({
        ...storyGroup,
        stories: storyGroup.stories.map(story =>
          story.id === storyId
            ? { ...story, view_count: (story.view_count || 0) + 1 }
            : story
        )
      })));
    } catch (e) {
      // ignore
    }
  };

  // Переключение на следующего пользователя
  const handleNextUser = () => {
    if (currentUserIndex < flattenedStories.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      setCurrentUserIndex(null); // Закрыть viewer
    }
  };

  // Удаление истории из массива stories
  const handleStoryDeleted = (deletedId) => {
    setStories(prevStories => {
      const updatedStories = prevStories.map((sg, idx) => {
        if (idx !== currentUserIndex) return sg;
        return {
          ...sg,
          stories: sg.stories.filter(story => story.id !== deletedId)
        };
      }).filter(sg => sg.stories.length > 0); // Удаляем пользователя, если не осталось историй
      // Если у текущего пользователя не осталось историй — перейти к следующему
      if (
        updatedStories.length > 0 &&
        (!updatedStories[currentUserIndex] || updatedStories[currentUserIndex].stories.length === 0)
      ) {
        setCurrentUserIndex(idx => (idx < updatedStories.length ? idx : null));
      } else if (updatedStories.length === 0) {
        setCurrentUserIndex(null);
      }
      return updatedStories;
    });
  };

  if (loading) {
    return (
      <StoriesCard>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
            Загрузка...
          </Typography>
        </Box>
      </StoriesCard>
    );
  }

  // Проверяем ответ API после загрузки
  if (!loading && !isOwnProfile && (!stories || stories.length === 0)) {
    return null;
  }

  return (
    <>
      <StoriesCard>
        <StoriesContainer>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            style={{ display: 'none' }}
          />
          {/* Add Story Button - показываем только на своем профиле */}
          {isOwnProfile && (
            <StoryItem>
              <AddStoryButton onClick={handleAddStory}>
                <AddIcon color="primary" />
              </AddStoryButton>
            </StoryItem>
          )}
          {/* Stories List */}
          {flattenedStories.map((story) => (
            <StoryItem 
              key={story.id}
              onClick={() => handleStoryClick(story.id)}
            >
              <StoryPreview>
                {story.preview_url ? (
                  <Box
                    component="img"
                    src={story.preview_url}
                    alt="story preview"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent'
                    }}
                  >
                    <VideocamIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  </Box>
                )}
              </StoryPreview>
            </StoryItem>
          ))}
        </StoriesContainer>

        {/* Preview Modal через портал */}
        {previewFile && previewUrl && createPortal(
          <Box 
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100000000,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }} 
            onClick={handleCancelPreview}
          >
            <Box 
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: 400,
                maxHeight: 600,
              }}
            >
              {/* Blurred Background */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${previewUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px)',
                  transform: 'scale(1.05)',
                  zIndex: -1,
                  opacity: 1,
                }}
              />
              {/* Header */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 10,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    zIndex: 1,
                    maxWidth: 'calc(100% - 80px)',
                  }}
                >
                  <Avatar
                    src={user?.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : undefined}
                    alt={user?.name || 'You'}
                    sx={{
                      width: 32,
                      height: 32,
                      border: theme => `2px solid ${theme.palette.primary.main}`,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography 
                      variant="subtitle1" 
                      color="white" 
                      sx={{ 
                        fontWeight: 600, 
                        lineHeight: 1.2, 
                        whiteSpace: 'nowrap', 
                        textOverflow: 'ellipsis', 
                        overflow: 'hidden' 
                      }}
                    >
                      {user?.name || 'Ваша история'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleCancelPreview(); 
                  }} 
                  sx={{ color: 'white', zIndex: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              {/* Media Container */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {previewMediaType === 'image' ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="preview"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                ) : (
                  <>
                    <Box
                      component="video"
                      ref={videoRef}
                      src={previewUrl}
                      loop
                      autoPlay
                      playsInline
                      muted={isMuted}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        zIndex: 1000,
                      }}
                    >
                      <IconButton
                        onClick={handleToggleSound}
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
                    </Box>
                  </>
                )}
              </Box>
              {/* Action Buttons */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  zIndex: 100,
                }}
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handlePublishStory(); 
                  }}
                >
                  Опубликовать
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleCancelPreview(); 
                  }}
                >
                  Отмена
                </Button>
              </Box>
            </Box>
          </Box>,
          document.body
        )}
      </StoriesCard>

      {/* Story Viewer через портал */}
      {currentUserIndex !== null && flattenedStories[currentUserIndex] && createPortal(
        <StoryViewer
          userStories={{
            user: flattenedStories[currentUserIndex].user,
            stories: [flattenedStories[currentUserIndex]]
          }}
          currentUserIndex={0}
          setCurrentUserIndex={setCurrentUserIndex}
          onClose={handleCloseStory}
          currentUserId={flattenedStories[currentUserIndex]?.user?.id}
          onStoryDeleted={handleStoryDeleted}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          isMobile={isMobile}
          onStoryViewed={updateViewedStories}
          onNextUser={handleNextUser}
        />,
        document.body,
      )}
    </>
  );
};

export default Stories; 