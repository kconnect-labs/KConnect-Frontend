import axios from 'axios';
import axiosInstance from '../axiosConfig';


const API_URL = ''; 

class MessengerService {
  
  async getChats() {
    try {
      
      
      
      
      
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

  
  async getMessages(chatId) {
    try {
      
      
      
      
      
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

  
  async sendMessage(chatId, content, attachments = []) {
    try {
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
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

  
  async createChat(userId) {
    try {
      
      
      
      
      
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

  
  async markAsRead(chatId, messageId) {
    try {
      
      
      
      
      
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