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
  

  set(key, data, ttlSeconds = 180) {
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
      if (key.includes(`:${urlPrefix}`)) {
        this.cache.delete(key);
      }
    }
  },
  

  clearPostsCache() {
    const prefixesToClear = [
      '/api/posts',
      '/api/feed',
      '/api/profile'
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
  baseURL: 'https://k-connect.ru',
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
];


instance.interceptors.request.use(
  (config) => {

    config.requestId = Math.random().toString(36).substring(2, 9);
    

    if (config.method === 'get' && config.cache !== false) {
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
        if (config.method === pattern.method && 
            (url.includes(pattern.urlPattern) || url.match(new RegExp(pattern.urlPattern.replace('*', '.*'))))) {

          config._invalidatesCache = true;
          break;
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
      




      let ttl = 180;
      

      if (response.headers['x-cache-ttl']) {
        ttl = parseInt(response.headers['x-cache-ttl'], 10);
      } 

      else if (response.config.cacheTTL) {
        ttl = response.config.cacheTTL;
      }
      

      if (response.config.url.includes('/api/posts/feed') || 
          response.config.url.includes('/api/profile') ||
          response.config.url.includes('/api/users/online')) {
        ttl = 60;
      }
      

      requestCache.set(response.config._cacheKey, response.data, ttl);
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
          detail: { message: "Сессия истекла, пожалуйста, войдите снова" } 
        }));
      }
      

      if (error.response.status === 429) {

        window.dispatchEvent(new CustomEvent('rate-limit-error', { 
          detail: { 
            message: "Слишком много запросов, пожалуйста, подождите",
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
              delay: delay
            } 
          }));
          

          await new Promise(resolve => setTimeout(resolve, delay));
          
          return instance(config);
        }
      }
    } else if (error.request) {

      window.dispatchEvent(new CustomEvent('network-error', { 
        detail: { message: "Проблема с подключением к серверу, проверьте ваше интернет-соединение" } 
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

        let message = 'Произошла ошибка при загрузке данных';
        
        if (error.response) {
          switch(error.response.status) {
            case 400: message = 'Неверный запрос'; break;
            case 401: message = 'Необходима авторизация'; break;
            case 403: message = 'Доступ запрещен'; break;
            case 404: message = 'Ресурс не найден'; break;
            case 429: message = 'Слишком много запросов'; break;
            case 500: message = 'Внутренняя ошибка сервера'; break;
          }
        } else if (error.request) {
          message = 'Нет ответа от сервера';
        }
        
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { message } 
        }));
      }
      throw error;
    }
  }
};

export default instance; 