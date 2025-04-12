import axios from 'axios';
import axiosInstance from '../axiosConfig';

// Базовый URL для API
const API_URL = ''; // Пустой URL для использования относительных путей

class MessengerService {
  // Получение списка чатов пользователя
  async getChats() {
    try {
      // В будущем будет использовать реальный API
      // const response = await axiosInstance.get(`${API_URL}/api/messenger/chats`);
      // return response.data;
      
      // Пока возвращаем заглушку
      return {
        success: true,
        chats: []
      };
    } catch (error) {
      console.error('Error fetching chats:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Не удалось загрузить чаты'
      };
    }
  }

  // Получение сообщений конкретного чата
  async getMessages(chatId) {
    try {
      // В будущем будет использовать реальный API
      // const response = await axios.get(`${API_URL}/api/messenger/chats/${chatId}/messages`);
      // return response.data;
      
      // Пока возвращаем заглушку
      return {
        success: true,
        messages: []
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Не удалось загрузить сообщения'
      };
    }
  }

  // Отправка сообщения
  async sendMessage(chatId, content, attachments = []) {
    try {
      // В будущем будет использовать реальный API
      // const formData = new FormData();
      // formData.append('content', content);
      // 
      // attachments.forEach((file, index) => {
      //   formData.append(`attachment_${index}`, file);
      // });
      // 
      // const response = await axios.post(
      //   `${API_URL}/api/messenger/chats/${chatId}/messages`,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data'
      //     }
      //   }
      // );
      // return response.data;
      
      // Пока возвращаем заглушку с эмуляцией задержки
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: {
              id: Date.now(),
              content,
              timestamp: new Date().toISOString(),
              attachments: attachments.map(file => ({
                id: Date.now(),
                filename: file.name,
                url: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'file'
              }))
            }
          });
        }, 500);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Не удалось отправить сообщение'
      };
    }
  }

  // Создание нового чата
  async createChat(userId) {
    try {
      // В будущем будет использовать реальный API
      // const response = await axios.post(`${API_URL}/api/messenger/chats`, { userId });
      // return response.data;
      
      // Пока возвращаем заглушку
      return {
        success: true,
        chatId: Date.now()
      };
    } catch (error) {
      console.error('Error creating chat:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Не удалось создать чат'
      };
    }
  }

  // Получение информации о статусе "прочитано"
  async markAsRead(chatId, messageId) {
    try {
      // В будущем будет использовать реальный API
      // const response = await axios.put(`${API_URL}/api/messenger/chats/${chatId}/messages/${messageId}/read`);
      // return response.data;
      
      // Пока возвращаем заглушку
      return {
        success: true
      };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Не удалось отметить сообщение как прочитанное'
      };
    }
  }
}

export default new MessengerService(); 