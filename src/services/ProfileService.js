import axios from 'axios';
import { SessionContext } from '../App';


let sessionContext = {
  checkSessionStatus: () => true,
  lastFetchTime: null,
};


export const setSessionContext = (context) => {
  sessionContext = context;
};


const shouldMakeRequest = () => {


  return true;
};

const ProfileService = {
    getProfile: async (username) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
    try {
      const endpoint = username ? `/api/profile/${username}` : '/api/profile';
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

    getSettings: async () => {
    if (!shouldMakeRequest()) {

      return { 
        success: true, 
        settings: JSON.parse(localStorage.getItem('theme_settings') || '{}')
      };
    }
    
    try {
      const response = await axios.get('/api/profile/settings');

      if (response.data.success && response.data.settings) {
        localStorage.setItem('theme_settings', JSON.stringify(response.data.settings));
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

    updateSettings: async (settings) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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

    updateName: async (name) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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

    updateUsername: async (username) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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

    updateAbout: async (about) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
    try {
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

    uploadAvatar: async (file) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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

    uploadBanner: async (file) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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

    updateSocial: async (name, link) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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

    deleteSocial: async (name) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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

    addSocial: async (name, link) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('link', link);
      const response = await axios.post('/api/profile/update-social', formData);
      return response.data;
    } catch (error) {
      console.error('Error adding social:', error);
      throw error;
    }
  },

    followUser: async (userId) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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
  
    unfollowUser: async (userId) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
    try {
                  const response = await axios.post('/api/profile/follow', {
        followed_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },
  
    checkFollowing: async (userId) => {
    if (!shouldMakeRequest()) {
      return { success: false, message: 'Session expired' };
    }
    
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
