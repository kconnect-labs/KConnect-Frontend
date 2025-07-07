import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Box, CircularProgress, Typography, Card, CardMedia, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { useLanguage } from '../../../../context/LanguageContext';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Masonry from 'react-masonry-css';
import './AttachmentsFeed.masonry.css';
import { useLightbox } from '../hooks/useLightbox';
import SimpleImageViewer from '@/components/SimpleImageViewer';
import VideoPlayer from '@/components/VideoPlayer';
import Dialog from '@mui/material/Dialog';

const AttachmentCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    '& .attachment-overlay': {
      opacity: 1,
    },
  },
}));

const AttachmentMedia = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  minHeight: '150px',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const AttachmentOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '& .overlay-content': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
  },
}));

const AttachmentsFeed = ({ userId, statusColor, onImageClick, onImageError, hideOverlay = false, miniMode = false, maxHeight = 400 }) => {
  const { t } = useLanguage();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const observer = useRef();
  
  const isMounted = useRef(true);
  const loadingRef = useRef(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { openLightbox } = useLightbox();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchAttachments = useCallback(async (pageNumber = 1) => {
    if (loadingRef.current) return;
    try {
      loadingRef.current = true;
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      const response = await axios.get(`/api/profile/${userId}/attachments`, {
        params: { 
          page: pageNumber, 
          per_page: 20  
        }
      });
      
      if (!isMounted.current) return;
      
      if (response.data.attachments && Array.isArray(response.data.attachments)) {
        const newAttachments = response.data.attachments;
        if (pageNumber === 1) {
          setAttachments(newAttachments);
        } else {
          setAttachments(prevAttachments => {
            const prevArray = Array.isArray(prevAttachments) ? prevAttachments : [];
            return [...prevArray, ...newAttachments];
          });
        }
        setHasMore(response.data.has_next);
      } else {
        if (pageNumber === 1) {
          setAttachments([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка при загрузке вложений:', error);
      if (isMounted.current) {
        setError(t('profile.feed.attachments.loading_error'));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setIsLoadingMore(false);
        loadingRef.current = false;
      }
    }
  }, [userId, t]);

  useEffect(() => {
    if (userId) {
      setPage(1);
      setAttachments([]);
      setHasMore(true);
      fetchAttachments(1);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [userId, fetchAttachments]);

  const lastAttachmentElementRef = useCallback(node => {
    if (loading || isLoadingMore || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, isLoadingMore, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchAttachments(page);
    }
  }, [page, fetchAttachments]);

  const photoAttachments = attachments.filter(a => a.type === 'photo');
  const handleAttachmentClick = (attachment, idx) => {
    if (attachment.type === 'photo') {
      const index = photoAttachments.findIndex(a => a.url === attachment.url);
      setLightboxIndex(index >= 0 ? index : 0);
      setLightboxOpen(true);
      if (onImageClick) onImageClick(index);
    } else if (attachment.type === 'video') {
      setVideoModalUrl(attachment.url);
      setVideoModalOpen(true);
    }
  };

  if (loading && attachments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4, 
        px: 3,
        bgcolor: 'background.paper', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}>
        <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography variant="h6" color="text.primary" gutterBottom>
          {t('profile.feed.attachments.error_title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (attachments.length === 0 && !loading) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4, 
        px: 3,
        bgcolor: 'background.paper', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}>
        <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography variant="h6" color="text.primary" gutterBottom>
          {t('profile.feed.attachments.empty')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          {t('profile.feed.attachments.empty_description')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 0.5 }}>
      <Masonry
        breakpointCols={2}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {attachments.map((attachment, index) => {
          const isLast = attachments.length === index + 1;
          return (
            <Box
              key={`${attachment.post_id}-${attachment.filename}`}
              ref={isLast ? lastAttachmentElementRef : null}
            >
              <AttachmentCard onClick={() => handleAttachmentClick(attachment, index)}>
                {attachment.type === 'video' ? (
                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#11111C', borderRadius: '8px', overflow: 'hidden' }}>
                    <video
                      src={attachment.url}
                      poster={attachment.poster || '/static/images/video_placeholder.png'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                      preload="metadata"
                      tabIndex={-1}
                      muted
                      playsInline
                      onClick={e => e.preventDefault()}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}>
                      <PlayArrowIcon sx={{ fontSize: 64, color: '#fff', opacity: 0.85, filter: 'drop-shadow(0 2px 8px #000)' }} />
                    </Box>
                  </Box>
                ) : (
                  <AttachmentMedia
                    component="img"
                    image={attachment.url}
                    src={attachment.url}
                    alt={attachment.filename}
                    sx={{
                      minHeight: '150px',
                    }}
                    onError={onImageError}
                  />
                )}
                <AttachmentOverlay className="attachment-overlay">
                  <Box className="overlay-content">
                    {attachment.type === 'video' ? (
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {t('profile.feed.attachments.play_video')}
                      </Typography>
                    ) : (
                      <>
                        <ZoomInIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {t('profile.feed.attachments.view_image')}
                        </Typography>
                      </>
                    )}
                  </Box>
                </AttachmentOverlay>
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3,
                }}>
                  {attachment.type === 'video' ? (
                    <VideoLibraryIcon sx={{ fontSize: 20, color: 'white' }} />
                  ) : (
                    <ImageIcon sx={{ fontSize: 20, color: 'white' }} />
                  )}
                </Box>
              </AttachmentCard>
            </Box>
          );
        })}
      </Masonry>
      {isLoadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {!hasMore && attachments.length > 5 && (
        <Box sx={{ textAlign: 'center', py: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('profile.feed.attachments.all_loaded')}
          </Typography>
        </Box>
      )}
      {lightboxOpen && photoAttachments.length > 0 && (
        <SimpleImageViewer
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={photoAttachments.map(a => a.url)}
          initialIndex={lightboxIndex}
        />
      )}
      {videoModalOpen && videoModalUrl && (
        <Dialog
          open={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(0,0,0,0.95)',
              boxShadow: 'none',
              borderRadius: 2,
              p: 0,
              m: 0,
              overflow: 'hidden',
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }
          }}
        >
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }}>
            <VideoPlayer videoUrl={videoModalUrl} options={{ autoplay: true }} />
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

AttachmentsFeed.defaultProps = {
  onImageClick: undefined,
  onImageError: undefined,
  hideOverlay: false,
  miniMode: false,
  maxHeight: 400,
};

export default AttachmentsFeed; 