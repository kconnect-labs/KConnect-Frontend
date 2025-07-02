import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../../../../context/LanguageContext';

import Post from '../../../../components/Post/Post';
import PostSkeleton from '../../../../components/Post/PostSkeleton';

const WallFeed = ({ userId }) => {
  const { t } = useLanguage();
  const [wallPosts, setWallPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const observer = useRef();
  const isMounted = useRef(true);
  const loadingRef = useRef(false);

  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  
  const fetchWallPosts = useCallback(async (pageNumber = 1) => {
    
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      
      const response = await axios.get(`/api/profile/${userId}/wall`, {
        params: {
          page: pageNumber,
          per_page: 10 
        }
      });

      
      if (!isMounted.current) return;

      
      if (response.data.posts && Array.isArray(response.data.posts)) {
        if (pageNumber === 1) {
          setWallPosts(response.data.posts);
        } else {
          setWallPosts(prev => [...prev, ...response.data.posts]);
        }
        
        setHasMore(response.data.has_next);
      } else {
        if (pageNumber === 1) setWallPosts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка при загрузке записей стены:', error);
      if (isMounted.current) {
        if (pageNumber === 1) setWallPosts([]);
        setError('Произошла ошибка при загрузке записей стены');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setIsLoadingMore(false);
        loadingRef.current = false;
      }
    }
  }, [userId]);

  
  useEffect(() => {
    if (userId) {
      setPage(1);
      setWallPosts([]);
      setHasMore(true);
      fetchWallPosts(1);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [userId, fetchWallPosts]);

  
  const lastPostElementRef = useCallback(node => {
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
      fetchWallPosts(page);
    }
  }, [page, fetchWallPosts]);

  
  const handleDeletePost = (postId, updatedPost) => {
    if (updatedPost) {
      setWallPosts(prevPosts => 
        prevPosts.map(post => 
          post.id.toString() === postId.toString() ? updatedPost : post
        )
      );
    } else {
      setWallPosts(prevPosts => 
        prevPosts.filter(post => 
          post.id.toString() !== postId.toString()
        )
      );
    }
  };

  
  useEffect(() => {
    const handleGlobalPostCreated = (event) => {
      const newPost = event.detail;
      
      if (newPost.type === 'stena' && newPost.recipient_id === parseInt(userId)) {
        setWallPosts(prevPosts => [newPost, ...prevPosts]);
      }
    };
    
    window.addEventListener('post_created', handleGlobalPostCreated);
    
    return () => {
      window.removeEventListener('post_created', handleGlobalPostCreated);
    };
  }, [userId]);

  if (loading && wallPosts.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        {[1, 2, 3].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
        <Typography color="error">{t('profile.feed.wall.loading_error')}</Typography>
      </Box>
    );
  }

  if (wallPosts.length === 0 && !loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
        <Typography variant="h6" color="text.secondary">
          {t('profile.feed.wall.empty')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt:0.5 }}>
      {wallPosts.map((post, index) => {
        
        if (wallPosts.length === index + 1) {
          return (
            <Box ref={lastPostElementRef} key={post.id}>
              <Post 
                post={post} 
                onDelete={handleDeletePost}
                showActions
              />
            </Box>
          );
        } else {
          return (
            <Post 
              key={post.id} 
              post={post} 
              onDelete={handleDeletePost}
              showActions
            />
          );
        }
      })}
      
      {/* Индикатор загрузки */}
      {isLoadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {/* Сообщение, когда постов больше нет */}
      {!hasMore && wallPosts.length > 5 && (
        <Box sx={{ textAlign: 'center', py: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('profile.feed.wall.all_loaded')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WallFeed; 