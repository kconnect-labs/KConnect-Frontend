import axios from 'axios';


const SearchService = {
  
  searchAll: (query, page = 1, perPage = 10) => {
    return axios.get('/api/search', {
      params: {
        q: query,
        type: 'all',
        page,
        per_page: perPage
      }
    });
  },

  
  searchUsers: (query = '', page = 1, perPage = 10) => {
    return axios.get('/api/search', {
      params: {
        q: query,
        type: 'users',
        page,
        per_page: perPage
      }
    });
  },

  
  searchPosts: (query, page = 1, perPage = 10) => {
    return axios.get('/api/search', {
      params: {
        q: query,
        type: 'posts',
        page,
        per_page: perPage
      }
    });
  }
};

export default SearchService; 