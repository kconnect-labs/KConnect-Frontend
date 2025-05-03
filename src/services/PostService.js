import axios from './axiosConfig';
import AuthService from './AuthService';

const PostService = {
    getFeed: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`/api/posts/feed?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feed:', error);
      return { success: false, error: error.response?.data?.error || 'Не удалось загрузить ленту постов' };
    }
  },

    getPost: async (postId) => {
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return { success: false, error: error.response?.data?.error || 'Не удалось загрузить пост' };
    }
  },

    createPost: async (postData) => {
    try {
            const formData = postData instanceof FormData 
        ? postData 
        : new FormData();
      
            if (!(postData instanceof FormData) && typeof postData === 'object') {
        if (postData.content) {
          formData.append('content', postData.content);
        }
        
                if (Array.isArray(postData.images)) {
          postData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        }
        
                if (postData.image && postData.image instanceof File) {
          formData.append('image', postData.image);
        }
        
                if (postData.video && postData.video instanceof File) {
          formData.append('video', postData.video);
        }
        
                if (postData.music && Array.isArray(postData.music) && postData.music.length > 0) {
          formData.append('music', JSON.stringify(postData.music));
        }
      }
      
            console.log('Creating post with form data:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
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

    likePost: async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false, error: error.response?.data?.error || 'Не удалось поставить лайк' };
    }
  },

    deletePost: async (postId) => {
    try {
      console.log(`Attempting to delete post ${postId} with DELETE method and cascade`);
      
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
      
            if (error.response?.status === 404 || error.response?.status === 405 || error.response?.status === 500) {
        try {
          console.log(`Falling back to POST method with cascade for deletion of post ${postId}`);
          
                    const response = await axios.post(`/api/posts/${postId}/delete`, {
            cascade: true,
            full_delete: true
          });
          console.log('POST fallback method with cascade succeeded:', response.data);
          return response.data;
        } catch (fallbackError) {
          console.error(`Fallback deletion also failed for post ${postId}:`, fallbackError);
          
                    try {
            console.log(`Trying second fallback: POST to /api/posts/delete/${postId} with cascade`);
            const response = await axios.post(`/api/posts/delete/${postId}`, {
              cascade: true,
              full_delete: true
            });
            console.log('Second fallback with cascade succeeded:', response.data);
            return response.data;
          } catch (secondFallbackError) {
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
