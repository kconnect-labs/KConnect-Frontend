import { useState, useCallback, useEffect, useTransition, useDeferredValue } from 'react';


export default function useAsyncState(asyncFunction, dependencies = [], initialData = null) {
  
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  
  const [isPending, startTransition] = useTransition();
  
  
  
  const deferredData = useDeferredValue(data);
  
  
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction(...args);
      
      
      startTransition(() => {
        setData(result);
      });
      
      return result;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);
  
  
  useEffect(() => {
    execute().catch(error => {
      console.error('Error in useAsyncState:', error);
    });
  }, dependencies); 
  
  return { 
    data: deferredData, 
    error, 
    loading, 
    isPending, 
    execute 
  };
}


export function useDebounceWithTransition(callback, delay = 300) {
  const [isPending, startTransition] = useTransition();
  
  
  const debouncedFn = useCallback(
    (...args) => {
      
      const timeoutId = setTimeout(() => {
        
        startTransition(() => {
          callback(...args);
        });
      }, delay);
      
      
      return () => clearTimeout(timeoutId);
    },
    [callback, delay, startTransition]
  );
  
  return { 
    debouncedFn, 
    isPending 
  };
} 