import { useState, useCallback } from 'react';
import axios from '../../services/axiosConfig';

// Получить ленту историй
export const fetchStories = async () => {
  const response = await axios.get('/api/stories/feed');
  return response.data && response.data.stories ? response.data.stories : [];
};

// Опубликовать новую историю
export const publishStory = async (file) => {
  const formData = new FormData();
  formData.append('media', file);
  const response = await axios.post('/api/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Отметить историю как просмотренную
export const viewStory = async (storyId) => {
  if (!storyId) return;
  return axios.post(`/api/stories/${storyId}/view`);
};

// Удалить историю
export const deleteStory = async (storyId) => {
  if (!storyId) return;
  return axios.delete(`/api/stories/${storyId}`);
};

// Добавить/убрать реакцию на историю
export const addStoryReaction = async (storyId, emoji) => {
  if (!storyId || !emoji) return;
  return axios.post(`/api/stories/${storyId}/reaction`, { emoji });
};

// Получить список реакций с пользователями для истории
export const getStoryReactionsWithUsers = async (storyId) => {
  if (!storyId) return [];
  const response = await axios.get(`/api/stories/${storyId}/reactions`);
  return response.data && response.data.reactions ? response.data.reactions : [];
};

// Получить истории конкретного пользователя
export const fetchUserStories = async (userIdentifier) => {
  const response = await axios.get(`/api/stories/user/${userIdentifier}`);
  return response.data && response.data.stories ? [response.data] : [];
};

// Хук для получения и обновления ленты историй
export function useStoriesFeed(userIdentifier = null) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = userIdentifier 
        ? await fetchUserStories(userIdentifier)
        : await fetchStories();
      setStories(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [userIdentifier]);

  return { stories, loading, error, loadStories, setStories };
}

// Хук для действий с историями (публикация, просмотр, удаление)
export function useStoryActions() {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const publish = useCallback(async (file) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const data = await publishStory(file);
      return data;
    } catch (e) {
      setActionError(e);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const view = useCallback(async (storyId) => {
    try {
      await viewStory(storyId);
    } catch (e) {
      // Не критично, просто логируем
      console.error('Error viewing story', e);
    }
  }, []);

  const remove = useCallback(async (storyId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteStory(storyId);
    } catch (e) {
      setActionError(e);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return { publish, view, remove, actionLoading, actionError };
} 