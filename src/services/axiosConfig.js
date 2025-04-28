import axios from 'axios';

// Create an axios instance with custom configuration
const instance = axios.create({
  baseURL: 'https://k-connect.ru', // Changed from empty string to k-connect.ru
  withCredentials: true, // Include cookies with requests
  timeout: 30000, // 30 second timeout
});

// Глобальная настройка для всех запросов axios
axios.defaults.withCredentials = true;

// Add request interceptor for authentication
instance.interceptors.request.use(
  (config) => {
    // Принудительно включаем withCredentials для всех запросов
    config.withCredentials = true;
    
    // Log request for debugging
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      withCredentials: config.withCredentials
    });
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    // Return response directly without logging
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error (4xx, 5xx)
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Could redirect to login page or trigger auth refresh
      }
    } else if (error.request) {
      // Request made but no response received
    }
    
    return Promise.reject(error);
  }
);

export default instance; 