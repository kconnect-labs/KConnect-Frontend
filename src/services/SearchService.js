import axios from 'axios';
/**
 * Сервис для поиска пользователей и постов
 */
const SearchService = {
  /**
   * Поиск по всем категориям (пользователи и посты)
   * @param {string} query - Поисковый запрос
   * @param {number} page - Номер страницы
   * @param {number} perPage - Количество элементов на странице
   * @returns {Promise} - Результат запроса
   */
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
  /**
   * Поиск только пользователей
   * @param {string} query - Поисковый запрос
   * @param {number} page - Номер страницы
   * @param {number} perPage - Количество элементов на странице
   * @returns {Promise} - Результат запроса
   */
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
  /**
   * Поиск только постов
   * @param {string} query - Поисковый запрос
   * @param {number} page - Номер страницы
   * @param {number} perPage - Количество элементов на странице
   * @returns {Promise} - Результат запроса
   */
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