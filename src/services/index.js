import './axiosConfig'; // Импортируем конфигурацию axios первой для глобальных настроек
import authService from './AuthService';
import profileService from './ProfileService';
import postService from './PostService';
import searchService from './SearchService';

export {
  authService,
  profileService,
  postService,
  searchService
}; 