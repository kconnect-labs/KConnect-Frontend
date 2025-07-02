import axios from 'axios';


const requestCache = {
  cache: new Map(),
  

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  },
  

  set(key, data, ttlSeconds = 15) {
    const expiry = ttlSeconds > 0 ? Date.now() + (ttlSeconds * 1000) : null;
    this.cache.set(key, { data, expiry });
  },
  

  generateKey(config) {
    const { url, method, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
  },
  

  clear() {
    this.cache.clear();
  },
  

  clearByUrlPrefix(urlPrefix) {
    for (const [key] of this.cache.entries()) {
      const [method, url] = key.split(':');
      if (url && url.startsWith(urlPrefix)) {
        this.cache.delete(key);
      }
    }
  },
  

  clearPostsCache() {
    const prefixesToClear = [
      '/api/posts',
      '/api/feed',
      '/api/profile',
      '/api/profile/posts',
      '/api/profile/wall',
      '/api/profile/pinned_post',
      '/api/users',
      '/api/reposts',
      '/api/stories'
    ];
    
    for (const prefix of prefixesToClear) {
      this.clearByUrlPrefix(prefix);
    }
  }
};


const loadingManager = {
  requests: new Map(),
  
  startRequest(url) {
    const count = this.requests.get(url) || 0;
    this.requests.set(url, count + 1);
    this.updateGlobalState();
  },
  
  finishRequest(url) {
    const count = this.requests.get(url) || 1;
    if (count > 1) {
      this.requests.set(url, count - 1);
    } else {
      this.requests.delete(url);
    }
    this.updateGlobalState();
  },
  
  updateGlobalState() {

    const isLoading = this.requests.size > 0;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-loading-changed', { 
        detail: { isLoading, activeRequests: this.getActiveRequests() } 
      }));
    }
  },
  
  getActiveRequests() {
    return Array.from(this.requests.keys());
  }
};


const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;


const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : 'https://k-connect.ru',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

axios.defaults.withCredentials = true;


const STATE_CHANGING_PATTERNS = [
  { method: 'post', urlPattern: '/api/posts/create' },
  { method: 'put', urlPattern: '/api/posts' },
  { method: 'post', urlPattern: '/api/post/new' },
  { method: 'delete', urlPattern: '/api/posts/' },
  { method: 'post', urlPattern: '/api/posts/delete/' },
  { method: 'post', urlPattern: '/api/posts/*/like' },
  { method: 'post', urlPattern: '/api/posts/*/dislike' },
  { method: 'post', urlPattern: '/api/comments/create' },
  { method: 'post', urlPattern: '/api/comments/*/like' },
  { method: 'post', urlPattern: '/api/posts/*/edit' },
];


instance.interceptors.request.use(
  (config) => {
    config.requestId = Math.random().toString(36).substring(2, 9);
    
    if (config.method === 'get' && config.cache !== false) {
      // Disable caching for all post-related requests
      if (config.url && (
        config.url.includes('/api/posts') ||
        config.url.includes('/api/feed') ||
        config.url.includes('/api/profile/posts') ||
        config.url.includes('/api/profile/wall') ||
        config.url.includes('/api/profile/pinned_post')
      )) {
        config.cache = false;
        return config;
      }

      const cacheKey = requestCache.generateKey(config);
      const cachedData = requestCache.get(cacheKey);
      
      const forceRefresh = config.forceRefresh === true;
      
      if (cachedData && !forceRefresh) {
        const source = axios.CancelToken.source();
        setTimeout(() => {
          source.cancel(JSON.stringify({
            status: 200,
            data: cachedData,
            fromCache: true
          }));
        }, 0);
        
        config.cancelToken = source.token;
        return config;
      }
      
      config._cacheKey = cacheKey;
    }
    
    if (config.method !== 'get') {
      const url = config.url || '';
      for (const pattern of STATE_CHANGING_PATTERNS) {
        if (config.method === pattern.method) {
          // Более безопасная логика для совместимости с Safari
          const urlPattern = pattern.urlPattern;
          let matches = false;
          
          try {
            // Простая проверка без сложных regex конструкций
            if (urlPattern.includes('*')) {
              const simplePattern = urlPattern.replace(/\*/g, '');
              matches = url.includes(simplePattern);
            } else {
              matches = url.includes(urlPattern);
            }
          } catch (e) {
            // Fallback для очень старых браузеров
            matches = url.indexOf(urlPattern.replace(/\*/g, '')) !== -1;
          }
          
          if (matches) {
            config._invalidatesCache = true;
            break;
          }
        }
      }
    }
    
    const url = config.url?.split('?')[0] || 'unknown';
    loadingManager.startRequest(url);
    

    if (process.env.NODE_ENV !== 'production') {
      console.log(`🚀 API Request [${config.requestId}]:`, {
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request configuration error:', error);
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => {

    const url = response.config.url?.split('?')[0] || 'unknown';
    loadingManager.finishRequest(url);
    

    if (response.config._invalidatesCache) {


      requestCache.clearPostsCache();
      

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('data-updated', { 
          detail: { url: response.config.url, method: response.config.method } 
        }));
      }
    }
    

    if (response.config.method === 'get' && 
        response.config._cacheKey && 
        response.status === 200) {
      




      requestCache.set(response.config._cacheKey, response.data, 15);
    }
    

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ API Response [${response.config.requestId}]:`, {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    
    return response;
  },
  async (error) => {

    if (axios.isCancel(error) && error.message) {
      try {
        const response = JSON.parse(error.message);
        if (response.fromCache) {
          return { 
            ...response,
            status: 200, 
            statusText: 'OK', 
            headers: {},
            config: error.config,
            fromCache: true
          };
        }
      } catch (e) {

      }
    }
    
    let config = error.config;
    

    if (config && config.url) {
      const url = config.url?.split('?')[0] || 'unknown';
      loadingManager.finishRequest(url);
    }
    

    if (process.env.NODE_ENV !== 'production') {
      console.error(`❌ API Error [${config?.requestId || 'unknown'}]:`, {
        message: error.message,
        status: error.response?.status,
        url: config?.url,
        method: config?.method,
        data: error.response?.data
      });
    }
    

    if (error.response) {
      
      if (error.response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth-error', { 
          detail: { 
            message: "Сессия истекла", 
            shortMessage: "Войдите снова",
            notificationType: "error",
            animationType: "pill" 
          } 
        }));
      }
      
      
      if (error.response.status === 429) {
        window.dispatchEvent(new CustomEvent('rate-limit-error', { 
          detail: { 
            message: "Лимит запросов превышен",
            shortMessage: "Подождите",
            notificationType: "warning",
            animationType: "bounce", 
            retryAfter: error.response.headers['retry-after'] 
          } 
        }));
      }
      
      
      if ([500, 502, 503, 504].includes(error.response.status) && 
          config && !config._retryCount) {

        config._retryCount = config._retryCount || 0;
        

        if (config._retryCount < MAX_RETRIES) {
          config._retryCount++;
          

          const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);
          

          window.dispatchEvent(new CustomEvent('api-retry', { 
            detail: { 
              url: config.url,
              attempt: config._retryCount,
              delay: delay,
              message: "Повторное подключение",
              shortMessage: `Попытка ${config._retryCount}`,
              notificationType: "info",
              animationType: "pulse"
            } 
          }));
          

          await new Promise(resolve => setTimeout(resolve, delay));
          
          return instance(config);
        }
      }
    } else if (error.request) {
      
      window.dispatchEvent(new CustomEvent('network-error', { 
        detail: { 
          message: "Проблема с подключением", 
          shortMessage: "Нет сети",
          notificationType: "error",
          animationType: "drop"
        } 
      }));
    }
    
    return Promise.reject(error);
  }
);


instance.cache = {
  clear: requestCache.clear.bind(requestCache),
  clearByUrlPrefix: requestCache.clearByUrlPrefix.bind(requestCache),
  clearPostsCache: requestCache.clearPostsCache.bind(requestCache)
};


instance.helpers = {

  async loadData(config, onProgress, onError) {
    try {
      const result = await instance(config);
      return result.data;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        
        let message = 'Ошибка загрузки данных';
        let shortMessage = 'Ошибка';
        let notificationType = 'error';
        let animationType = 'pill';
        
        if (error.response) {
          switch(error.response.status) {
            case 400: 
              message = 'Неверный запрос'; 
              shortMessage = 'Ошибка запроса';
              break;
            case 401: 
              message = 'Требуется авторизация'; 
              shortMessage = 'Войдите';
              break;
            case 403: 
              message = 'Доступ запрещен'; 
              shortMessage = 'Нет доступа';
              break;
            case 404: 
              message = 'Ресурс не найден'; 
              shortMessage = 'Не найдено';
              break;
            case 429: 
              message = 'Превышен лимит запросов'; 
              shortMessage = 'Подождите';
              notificationType = 'warning';
              animationType = 'bounce';
              break;
            case 500: 
              message = 'Ошибка сервера'; 
              shortMessage = 'Сервер недоступен';
              break;
          }
        } else if (error.request) {
          message = 'Нет ответа от сервера';
          shortMessage = 'Нет соединения';
          animationType = 'drop';
        }
        
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { 
            message, 
            shortMessage, 
            notificationType, 
            animationType 
          } 
        }));
      }
      throw error;
    }
  }
};

export default instance; 