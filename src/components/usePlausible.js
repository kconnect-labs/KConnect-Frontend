

import { useCallback } from 'react';

export const usePlausible = () => {
  const trackEvent = useCallback((eventName, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}:`, data);
    }

  }, []);

  return { trackEvent };
};

export default usePlausible; 