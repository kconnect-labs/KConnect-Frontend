import { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../services/axiosConfig';

/**
 * Хук для удобной работы с API
 * @param {string} url - URL эндпоинта
 * @param {Object} options - Опции запроса
 * @param {Object} options.params - Параметры запроса
 * @param {boolean} options.cache - Использовать ли кэширование (по умолчанию true для GET)
 * @param {number} options.cacheTTL - Время жизни кэша в секундах (по умолчанию 180)
 * @param {boolean} options.lazy - Не выполнять запрос автоматически (по умолчанию false)
 * @param {Object} options.data - Данные для POST/PUT/PATCH запросов
 * @param {string} options.method - Метод запроса (по умолчанию 'get')
 * @param {Function} options.onSuccess - Колбэк при успешном запросе
 * @param {Function} options.onError - Колбэк при ошибке
 * @param {Object} options.headers - Дополнительные заголовки запроса
 * @returns {Object} Результат запроса с методами управления
 */
export default function useApi(url, options = {}) {
  const {
    params = {},
    cache = true,
    cacheTTL,
    lazy = false,
    data = null,
    method = 'get',
    onSuccess,
    onError,
    headers = {},
    retry = true,
    dependencies = [],
  } = options;

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  
  const requestParamsRef = useRef({
    url,
    method,
    params,
    data,
    headers,
    cache
  });

  
  useEffect(() => {
    requestParamsRef.current = {
      url,
      method,
      params,
      data,
      headers,
      cache
    };
  }, [url, method, JSON.stringify(params), JSON.stringify(data), JSON.stringify(headers), cache]);

  
  const fetchData = useCallback(async (overrideParams = {}) => {
    try {
      
      const currentParams = {
        ...requestParamsRef.current,
        ...overrideParams
      };

      
      setError(null);
      setLoading(true);
      setFromCache(false);

      
      const config = {
        url: currentParams.url,
        method: currentParams.method,
        params: currentParams.params,
        data: currentParams.data,
        headers: currentParams.headers,
        cache: currentParams.cache
      };

      if (cacheTTL) {
        config.cacheTTL = cacheTTL;
      }

      
      const result = await axios(config);

      
      const isFromCache = result.fromCache === true;
      setFromCache(isFromCache);

      
      setResponse(result.data);
      setLastUpdated(new Date());

      
      if (onSuccess) {
        onSuccess(result.data, isFromCache);
      }

      return result.data;
    } catch (err) {
      
      setError(err);
      
      
      if (onError) {
        onError(err);
      }
      
      
      if (!onError) {
        let message = 'Произошла ошибка при загрузке данных';
        
        if (err.response) {
          
          const status = err.response.status;
          if (status >= 400 && status < 500) {
            message = 'Ошибка в запросе данных';
          } else if (status >= 500) {
            message = 'Ошибка сервера. Пожалуйста, попробуйте позже';
          }
        } else if (err.request) {
          
          message = 'Проблема с подключением к серверу';
        }
        
        
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { message } 
        }));
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError, cacheTTL]);

  
  const clearCache = useCallback(() => {
    if (url) {
      
      axios.cache.clearByUrlPrefix(url);
    }
  }, [url]);

  
  const refresh = useCallback(async (overrideParams = {}) => {
    
    return fetchData({ 
      ...overrideParams, 
      cache: false 
    });
  }, [fetchData]);

  
  useEffect(() => {
    if (!lazy) {
      fetchData();
    }
  
  }, [lazy, ...dependencies]);

  
  return {
    data: response,
    loading,
    error,
    fetch: fetchData,
    refresh,
    clearCache,
    lastUpdated,
    fromCache
  };
}

/**
 * Хук для работы с бесконечным скроллом и пагинацией
 * Автоматически подгружает следующие страницы по скроллу
 */
export function useInfiniteApi(url, options = {}) {
  const {
    pageParam = 'page',
    limitParam = 'limit',
    startPage = 1,
    limit = 20,
    dataExtractor = (res) => res.items || res.data || res,
    hasMoreExtractor = (res) => {
      if (res.hasMore !== undefined) return res.hasMore;
      if (res.has_more !== undefined) return res.has_more;
      if (res.pagination && res.pagination.hasMore !== undefined) return res.pagination.hasMore;
      
      const items = dataExtractor(res);
      return Array.isArray(items) && items.length >= limit;
    },
    ...restOptions
  } = options;

  
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(startPage);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  
  const apiParams = {
    ...restOptions.params,
    [pageParam]: currentPage,
    [limitParam]: limit,
  };

  const { 
    fetch, 
    refresh: refreshData,
    clearCache 
  } = useApi(url, {
    ...restOptions,
    params: apiParams,
    lazy: true,
    onError: (err) => {
      setError(err);
      setLoading(false);
      if (restOptions.onError) restOptions.onError(err);
    }
  });

  
  const loadNextPage = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      
      const newData = await fetch({
        params: {
          ...restOptions.params,
          [pageParam]: currentPage,
          [limitParam]: limit,
        }
      });
      
      const newItems = dataExtractor(newData);
      setHasMore(hasMoreExtractor(newData));
      
      
      setItems(prev => [...prev, ...newItems]);
      setCurrentPage(prev => prev + 1);
      setLastUpdated(new Date());
      
      return newItems;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, dataExtractor, fetch, hasMore, hasMoreExtractor, limit, loading, pageParam, restOptions.params]);

  
  const refresh = useCallback(async () => {
    setItems([]);
    setCurrentPage(startPage);
    setHasMore(true);
    setError(null);
    
    
    clearCache();
    
    
    try {
      setLoading(true);
      
      const newData = await fetch({
        params: {
          ...restOptions.params,
          [pageParam]: startPage,
          [limitParam]: limit,
        },
        cache: false
      });
      
      const newItems = dataExtractor(newData);
      setHasMore(hasMoreExtractor(newData));
      setItems(newItems);
      setCurrentPage(startPage + 1);
      setLastUpdated(new Date());
      
      return newItems;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetch, clearCache, dataExtractor, hasMoreExtractor, limit, pageParam, restOptions.params, startPage]);

  
  useEffect(() => {
    if (!restOptions.lazy) {
      refresh();
    }
  
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    loadNextPage,
    refresh,
    clearCache,
    currentPage,
    lastUpdated
  };
}

/**
 * Хук для работы с мутациями данных (POST, PUT, DELETE)
 */
export function useMutation(url, options = {}) {
  const {
    method = 'post',
    onSuccess,
    onError,
    ...restOptions
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  
  const mutate = useCallback(async (mutationData = {}, configOverrides = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      
      const config = {
        url,
        method,
        ...restOptions,
        ...configOverrides,
        data: mutationData
      };
      
      
      const response = await axios(config);
      
      
      setData(response.data);
      
      
      if (onSuccess) {
        onSuccess(response.data, mutationData);
      }
      
      return response.data;
    } catch (err) {
      setError(err);
      
      
      if (onError) {
        onError(err, mutationData);
      } else {
        
        let message = 'Произошла ошибка при выполнении операции';
        
        if (err.response) {
          
          const status = err.response.status;
          if (status === 400) message = 'Неверные данные для операции';
          else if (status === 401) message = 'Необходима авторизация';
          else if (status === 403) message = 'Доступ запрещен';
          else if (status === 404) message = 'Ресурс не найден';
          else if (status === 409) message = 'Конфликт при выполнении операции';
          else if (status >= 500) message = 'Ошибка сервера при выполнении операции';
          
          
          if (err.response.data && (err.response.data.message || err.response.data.error)) {
            message = err.response.data.message || err.response.data.error;
          }
        } else if (err.request) {
          message = 'Отсутствует соединение с сервером';
        }
        
        
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { message } 
        }));
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, onSuccess, onError, restOptions]);

  
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    data,
    reset
  };
}

/**
 * Хук для получения глобального статуса загрузки API
 */
export function useApiLoadingStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);

  useEffect(() => {
    const handleLoadingChange = (e) => {
      setIsLoading(e.detail.isLoading);
      setActiveRequests(e.detail.activeRequests || []);
    };

    window.addEventListener('api-loading-changed', handleLoadingChange);
    
    return () => {
      window.removeEventListener('api-loading-changed', handleLoadingChange);
    };
  }, []);

  return { isLoading, activeRequests };
} 