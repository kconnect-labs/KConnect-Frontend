import axios from './axiosConfig';
import AuthService from './AuthService';

// Сервис для работы с постами
const PostService = {
  // Получить ленту постов
  getFeed: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`/api/posts/feed?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feed:', error);
      return { success: false, error: error.response?.data?.error || 'Не удалось загрузить ленту постов' };
    }
  },

  // Получить конкретный пост по ID
  getPost: async (postId) => {
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return { success: false, error: error.response?.data?.error || 'Не удалось загрузить пост' };
    }
  },

  // Создать новый пост
  createPost: async (postData) => {
    try {
      // If postData is already FormData, use it directly
      const formData = postData instanceof FormData 
        ? postData 
        : new FormData();
      
      // If postData is not FormData, add its properties to formData
      if (!(postData instanceof FormData) && typeof postData === 'object') {
        if (postData.content) {
          formData.append('content', postData.content);
        }
        
        // Handle multiple images
        if (Array.isArray(postData.images)) {
          postData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        }
        
        // Handle single image
        if (postData.image && postData.image instanceof File) {
          formData.append('image', postData.image);
        }
        
        // Handle video
        if (postData.video && postData.video instanceof File) {
          formData.append('video', postData.video);
        }
        
        // Handle music tracks
        if (postData.music && Array.isArray(postData.music) && postData.music.length > 0) {
          formData.append('music', JSON.stringify(postData.music));
        }
      }
      
      // Log the form data for debugging
      console.log('Creating post with form data:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // First try POST method
      try {
        console.log('Attempting to create post with POST method');
        const response = await axios.post('/api/posts/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('POST success:', response.data);
        return response.data;
      } catch (postError) {
        console.error('POST method failed:', postError);
        
        // Try alternative endpoint if POST fails
        try {
          console.log('Attempting fallback: PUT method to /api/posts');
          const putResponse = await axios.put('/api/posts', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('PUT success:', putResponse.data);
          return putResponse.data;
        } catch (putError) {
          console.error('PUT method failed:', putError);
          
          // Final attempt with different endpoint
          console.log('Attempting final fallback: POST to /api/post/new');
          const finalResponse = await axios.post('/api/post/new', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Final attempt success:', finalResponse.data);
          return finalResponse.data;
        }
      }
    } catch (error) {
      console.error('All post creation methods failed:', error);
      throw error;
    }
  },

  // Поставить/убрать лайк посту
  likePost: async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false, error: error.response?.data?.error || 'Не удалось поставить лайк' };
    }
  },

  // Удалить пост
  deletePost: async (postId) => {
    try {
      console.log(`Attempting to delete post ${postId} with DELETE method and cascade`);
      
      // Попытка использовать метод DELETE с параметром cascade=true
      const response = await axios.delete(`/api/posts/${postId}`, {
        params: {
          cascade: true,
          full_delete: true
        }
      });
      console.log('DELETE method with cascade succeeded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post ${postId} with DELETE method:`, error);
      
      // Проверяем, связана ли ошибка с неподдерживаемым методом или не найденным ресурсом
      if (error.response?.status === 404 || error.response?.status === 405 || error.response?.status === 500) {
        try {
          console.log(`Falling back to POST method with cascade for deletion of post ${postId}`);
          
          // Пробуем альтернативный метод POST для удаления с параметром cascade
          const response = await axios.post(`/api/posts/${postId}/delete`, {
            cascade: true,
            full_delete: true
          });
          console.log('POST fallback method with cascade succeeded:', response.data);
          return response.data;
        } catch (fallbackError) {
          console.error(`Fallback deletion also failed for post ${postId}:`, fallbackError);
          
          // Попытка третьего варианта
          try {
            console.log(`Trying second fallback: POST to /api/posts/delete/${postId} with cascade`);
            const response = await axios.post(`/api/posts/delete/${postId}`, {
              cascade: true,
              full_delete: true
            });
            console.log('Second fallback with cascade succeeded:', response.data);
            return response.data;
          } catch (secondFallbackError) {
            // Последняя попытка с явным указанием удаления связанных сущностей
            try {
              console.log(`Final attempt: GET /api/posts/delete/${postId}/cascade`);
              const response = await axios.get(`/api/posts/delete/${postId}/cascade`);
              console.log('Final cascade deletion attempt succeeded:', response.data);
              return response.data;
            } catch (finalError) {
              console.error('All deletion methods failed:', finalError);
              return { 
                success: false, 
                error: 'Не удалось удалить пост. Возможно, у вас нет прав на это действие или сервер временно недоступен.'
              };
            }
          }
        }
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || 'Не удалось удалить пост. Проверьте соединение и попробуйте снова.'
      };
    }
  }
};

export default PostService;
