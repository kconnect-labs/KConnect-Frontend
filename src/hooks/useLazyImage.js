import { useState, useEffect, useRef } from 'react';
import { imageCache } from '../utils/imageUtils';

/**
 * @param {string} src 
 * @param {Object} options
 * @param {boolean} options.lazy
 * @param {number} options.threshold 
 * @param {string} options.rootMargin 
 * @returns {Object}
 */
export const useLazyImage = (src, options = {}) => {
  const {
    lazy = true,
    threshold = 0.1,
    rootMargin = '50px',
    ...otherOptions
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(lazy ? null : src);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!lazy) {
      setImageSrc(src);
      return;
    }

    const cachedImage = imageCache.get(src);
    if (cachedImage) {
      setIsLoaded(true);
      setImageSrc(src);
      return;
    }

    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              setImageSrc(src);
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      setIsInView(true);
      setImageSrc(src);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, lazy, threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
    imageCache.set(src, { loaded: true, timestamp: Date.now() });
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  return {
    ref: imgRef,
    src: imageSrc,
    isLoaded,
    isInView,
    error,
    onLoad: handleLoad,
    onError: handleError,
    ...otherOptions
  };
};

/**
 * @param {string[]} urls
 * @returns {Object}
 */
export const usePreloadImages = (urls = []) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount] = useState(urls.length);

  useEffect(() => {
    if (urls.length === 0) return;

    let mounted = true;
    let loaded = 0;

    const preloadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
          }
          resolve();
        };
        img.onerror = () => {
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
          }
          resolve();
        };
        img.src = url;
      });
    };

    // Предзагружаем все изображения параллельно
    Promise.all(urls.map(preloadImage));

    return () => {
      mounted = false;
    };
  }, [urls]);

  return {
    loadedCount,
    totalCount,
    progress: totalCount > 0 ? loadedCount / totalCount : 0,
    isComplete: loadedCount === totalCount
  };
}; 