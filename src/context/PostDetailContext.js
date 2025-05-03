import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PostDetailContext = createContext();

export const PostDetailProvider = ({ children }) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [backgroundLocation, setBackgroundLocation] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const match = location.pathname.match(/\/post\/(\d+)/);
    if (match && match[1]) {
      const postId = match[1];
      setCurrentPostId(postId);
      
      
      if (!overlayOpen && location.state?.background) {
        setOverlayOpen(true);
      }
    } else if (overlayOpen) {
      
      setOverlayOpen(false);
      setCurrentPostId(null);
    }
  }, [location, overlayOpen]);

  const openPostDetail = (postId, event) => {
    
    if (event && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) {
      return true; 
    }
    
    if (event) {
      event.preventDefault(); 
      event.stopPropagation(); 
    }
    
    console.log("Opening post detail for post ID:", postId);
    setCurrentPostId(postId);
    setBackgroundLocation(location);
    setOverlayOpen(true);
    
    
    navigate(`/post/${postId}`, { 
      state: { background: location },
      replace: false
    });
    
    return false; 
  };

  const closePostDetail = () => {
    setOverlayOpen(false);
    
    
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search, { replace: true });
    } else {
      
      navigate('/');
    }
    
    setCurrentPostId(null);
    setBackgroundLocation(null);
  };

  return (
    <PostDetailContext.Provider value={{ 
      overlayOpen, 
      currentPostId,
      backgroundLocation,
      openPostDetail,
      closePostDetail
    }}>
      {children}
    </PostDetailContext.Provider>
  );
};

export const usePostDetail = () => useContext(PostDetailContext);

export default PostDetailContext; 