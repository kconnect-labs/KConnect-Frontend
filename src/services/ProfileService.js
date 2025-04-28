import axios from 'axios';

// Сервис для работы с профилем пользователя
const ProfileService = {
  // Получить данные профиля
  getProfile: async (username) => {
    try {
      const endpoint = username ? `/api/profile/${username}` : '/api/profile';
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Получить настройки профиля
  getSettings: async () => {
    try {
      const response = await axios.get('/api/profile/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Обновить настройки профиля
  updateSettings: async (settings) => {
    try {
      const response = await axios.post('/api/profile/settings', settings, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Обновить имя пользователя
  updateName: async (name) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      const response = await axios.post('/api/profile/update-name', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  },

  // Обновить имя пользователя (username)
  updateUsername: async (username) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      const response = await axios.post('/api/profile/update-username', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  },

  // Обновить информацию о себе
  updateAbout: async (about) => {
    try {
      // Поддержка как form-data, так и JSON
      const formData = new FormData();
      formData.append('about', about);
      const response = await axios.post('/api/profile/update-about', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating about:', error);
      throw error;
    }
  },

  // Загрузить аватар
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axios.post('/api/profile/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // Загрузить баннер
  uploadBanner: async (file) => {
    try {
      const formData = new FormData();
      formData.append('banner', file);
      
      const response = await axios.post('/api/profile/upload-banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading banner:', error);
      throw error;
    }
  },

  // Обновить социальную сеть
  updateSocial: async (name, link) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('link', link);
      const response = await axios.post('/api/profile/update-social', formData);
      return response.data;
    } catch (error) {
      console.error('Error updating social:', error);
      throw error;
    }
  },

  // Удалить социальную сеть
  deleteSocial: async (name) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      const response = await axios.post('/api/profile/delete-social', formData);
      return response.data;
    } catch (error) {
      console.error('Error deleting social:', error);
      throw error;
    }
  },

  // Подписаться на пользователя
  followUser: async (userId) => {
    try {
      const response = await axios.post('/api/profile/follow', {
        followed_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },
  
  // Отписаться от пользователя
  unfollowUser: async (userId) => {
    try {
      // Используем тот же endpoint, так как он автоматически определяет,
      // подписаны ли мы уже на пользователя или нет
      const response = await axios.post('/api/profile/follow', {
        followed_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },
  
  // Проверить статус подписки на пользователя
  checkFollowing: async (userId) => {
    try {
      const response = await axios.get(`/api/profile/${userId}`);
      return response.data.is_following;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }
};

export default ProfileService;
