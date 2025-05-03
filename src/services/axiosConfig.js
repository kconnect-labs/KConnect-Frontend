import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://k-connect.ru',
  withCredentials: true,
  timeout: 30000,
});

axios.defaults.withCredentials = true;

instance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    
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

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
      }
    } else if (error.request) {
    }
    
    return Promise.reject(error);
  }
);

export default instance; 