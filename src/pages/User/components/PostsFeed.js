import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';


import Post from '../../../components/Post/Post';
import PostSkeleton from '../../../components/Post/PostSkeleton';

const PostsFeed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
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

  
  const fetchPosts = useCallback(async (pageNumber = 1) => {
    
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      
      const response = await axios.get(`/api/profile/${userId}/posts`, {
        params: { 
          page: pageNumber, 
          per_page: 10  
        }
      });

      
      if (!isMounted.current) return;

      
      if (response.data.posts && Array.isArray(response.data.posts)) {
        const newPosts = response.data.posts;
        
        if (pageNumber === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prevPosts => {
            const prevArray = Array.isArray(prevPosts) ? prevPosts : [];
            return [...prevArray, ...newPosts];
          });
        }

        
        setHasMore(response.data.has_next);
      } else {
        if (pageNumber === 1) {
          setPosts([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка при загрузке постов:', error);
      if (isMounted.current) {
        setError('Произошла ошибка при загрузке постов');
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
      setPosts([]);
      setHasMore(true);
      fetchPosts(1);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [userId, fetchPosts]);

  
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
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  
  const handleDeletePost = (postId, updatedPost) => {
    if (updatedPost) {
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id.toString() === postId.toString() ? updatedPost : post
        )
      );
    } else {
      
      setPosts(prevPosts => 
        prevPosts.filter(post => post.id.toString() !== postId.toString())
      );
    }
  };
  
  
  useEffect(() => {
    const handleGlobalPostCreated = (event) => {
      const newPost = event.detail;
      
      if (newPost && newPost.user_id === parseInt(userId)) {
        setPosts(prevPosts => [newPost, ...prevPosts]);
      }
    };
    
    window.addEventListener('post_created', handleGlobalPostCreated);
    
    return () => {
      window.removeEventListener('post_created', handleGlobalPostCreated);
    };
  }, [userId]);

  if (loading && posts.length === 0) {
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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Нет постов для отображения
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 0.5 }}>
      {posts.map((post, index) => {
        
        if (posts.length === index + 1) {
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
      
      {isLoadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {!hasMore && posts.length > 5 && (
        <Box sx={{ textAlign: 'center', py: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Все посты загружены
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostsFeed; 