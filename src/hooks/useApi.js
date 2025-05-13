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

  // Состояния хука
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  // Использовать useRef для хранения последних параметров запроса
  const requestParamsRef = useRef({
    url,
    method,
    params,
    data,
    headers,
    cache
  });

  // Обновляем ref при изменении параметров
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

  // Функция для выполнения запроса
  const fetchData = useCallback(async (overrideParams = {}) => {
    try {
      // Используем последние параметры запроса из ref, с возможностью переопределения
      const currentParams = {
        ...requestParamsRef.current,
        ...overrideParams
      };

      // Обновляем состояние
      setError(null);
      setLoading(true);
      setFromCache(false);

      // Формируем конфигурацию запроса
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

      // Выполняем запрос
      const result = await axios(config);

      // Проверяем, был ли ответ из кэша
      const isFromCache = result.fromCache === true;
      setFromCache(isFromCache);

      // Обновляем состояние
      setResponse(result.data);
      setLastUpdated(new Date());

      // Вызываем колбэк при успехе
      if (onSuccess) {
        onSuccess(result.data, isFromCache);
      }

      return result.data;
    } catch (err) {
      // Обрабатываем ошибку
      setError(err);
      
      // Вызываем колбэк при ошибке
      if (onError) {
        onError(err);
      }
      
      // Показываем уведомление об ошибке, если нет колбэка
      if (!onError) {
        let message = 'Произошла ошибка при загрузке данных';
        
        if (err.response) {
          // Ошибка с ответом от сервера
          const status = err.response.status;
          if (status >= 400 && status < 500) {
            message = 'Ошибка в запросе данных';
          } else if (status >= 500) {
            message = 'Ошибка сервера. Пожалуйста, попробуйте позже';
          }
        } else if (err.request) {
          // Ошибка сети
          message = 'Проблема с подключением к серверу';
        }
        
        // Диспатчим событие для отображения ошибки
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { message } 
        }));
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError, cacheTTL]);

  // Очистка кэша для текущего эндпоинта
  const clearCache = useCallback(() => {
    if (url) {
      // Очищаем кэш для текущего URL
      axios.cache.clearByUrlPrefix(url);
    }
  }, [url]);

  // Принудительное обновление данных
  const refresh = useCallback(async (overrideParams = {}) => {
    // При refresh всегда игнорируем кэш
    return fetchData({ 
      ...overrideParams, 
      cache: false 
    });
  }, [fetchData]);

  // Автоматически выполняем запрос при монтировании, если не указан lazy
  useEffect(() => {
    if (!lazy) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazy, ...dependencies]);

  // Возвращаем состояние и методы управления
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

  // Базовые состояния
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(startPage);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Инициализируем useApi хук для запросов
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

  // Функция для загрузки следующей страницы
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
      
      // Добавляем новые элементы к существующим
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

  // Функция для обновления списка (сброс и загрузка с первой страницы)
  const refresh = useCallback(async () => {
    setItems([]);
    setCurrentPage(startPage);
    setHasMore(true);
    setError(null);
    
    // Очищаем кэш
    clearCache();
    
    // Загружаем первую страницу
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

  // Загружаем первую страницу при монтировании
  useEffect(() => {
    if (!restOptions.lazy) {
      refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Функция выполнения мутации
  const mutate = useCallback(async (mutationData = {}, configOverrides = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Формируем конфигурацию запроса
      const config = {
        url,
        method,
        ...restOptions,
        ...configOverrides,
        data: mutationData
      };
      
      // Выполняем запрос
      const response = await axios(config);
      
      // Устанавливаем данные
      setData(response.data);
      
      // Вызываем колбэк при успехе
      if (onSuccess) {
        onSuccess(response.data, mutationData);
      }
      
      return response.data;
    } catch (err) {
      setError(err);
      
      // Вызываем колбэк при ошибке
      if (onError) {
        onError(err, mutationData);
      } else {
        // Базовая обработка ошибок
        let message = 'Произошла ошибка при выполнении операции';
        
        if (err.response) {
          // Формируем понятное сообщение в зависимости от кода ошибки
          const status = err.response.status;
          if (status === 400) message = 'Неверные данные для операции';
          else if (status === 401) message = 'Необходима авторизация';
          else if (status === 403) message = 'Доступ запрещен';
          else if (status === 404) message = 'Ресурс не найден';
          else if (status === 409) message = 'Конфликт при выполнении операции';
          else if (status >= 500) message = 'Ошибка сервера при выполнении операции';
          
          // Если сервер вернул сообщение об ошибке, используем его
          if (err.response.data && (err.response.data.message || err.response.data.error)) {
            message = err.response.data.message || err.response.data.error;
          }
        } else if (err.request) {
          message = 'Отсутствует соединение с сервером';
        }
        
        // Диспатчим событие для отображения ошибки
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { message } 
        }));
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, onSuccess, onError, restOptions]);

  // Сброс состояния хука
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