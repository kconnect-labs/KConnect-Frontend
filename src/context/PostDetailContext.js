import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PostDetailContext = createContext();

export const PostDetailProvider = ({ children }) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [backgroundLocation, setBackgroundLocation] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check URL for post ID when component mounts or URL changes
  useEffect(() => {
    const match = location.pathname.match(/\/post\/(\d+)/);
    if (match && match[1]) {
      const postId = match[1];
      setCurrentPostId(postId);
      
      // If we're on a post URL and have a background location, open the overlay
      if (!overlayOpen && location.state?.background) {
        setOverlayOpen(true);
      }
    } else if (overlayOpen) {
      // If we're not on a post URL but overlay is open, close it
      setOverlayOpen(false);
      setCurrentPostId(null);
    }
  }, [location, overlayOpen]);

  const openPostDetail = (postId, event) => {
    // If user is trying to open in a new tab or copy link, let default behavior happen
    if (event && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) {
      return true; // Allow default behavior
    }
    
    if (event) {
      event.preventDefault(); // Prevent standard navigation
      event.stopPropagation(); // Stop event propagation
    }
    
    console.log("Opening post detail for post ID:", postId);
    setCurrentPostId(postId);
    setBackgroundLocation(location);
    setOverlayOpen(true);
    
    // Update the URL without full navigation
    navigate(`/post/${postId}`, { 
      state: { background: location },
      replace: false
    });
    
    return false; // Prevent default behavior
  };

  const closePostDetail = () => {
    setOverlayOpen(false);
    
    // Go back to previous route if we came from somewhere in the app
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search, { replace: true });
    } else {
      // If there's no background location (e.g., direct URL access), go to home
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