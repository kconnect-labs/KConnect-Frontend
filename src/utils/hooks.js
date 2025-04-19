import { useState, useEffect, useRef, useCallback } from 'react';


export function useSafeState(initialValue) {
  const [state, setState] = useState(initialValue);
  const mounted = useRef(true);
  
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  
  const safeSetState = useCallback((value) => {
    if (mounted.current) {
      setState(value);
    }
  }, []);
  
  return [state, safeSetState];
}


export function useAsync() {
  const [loading, setLoading] = useSafeState(false);
  const [error, setError] = useSafeState(null);
  
  const withAsync = useCallback(async (asyncFn) => {
    
    let loadingTimer = null;
    let isCompleted = false;
    
    
    loadingTimer = setTimeout(() => {
      if (!isCompleted) {
        setLoading(true);
      }
    }, 750); 
    
    setError(null);
    
    try {
      const result = await asyncFn();
      isCompleted = true;
      clearTimeout(loadingTimer);
      setLoading(false);
      return result;
    } catch (err) {
      isCompleted = true;
      clearTimeout(loadingTimer);
      setError(err);
      setLoading(false);
      return null;
    }
  }, [setLoading, setError]);
  
  return { loading, error, setError, withAsync };
} 