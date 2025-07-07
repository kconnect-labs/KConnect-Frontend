import axios from 'axios';
import { io } from 'socket.io-client';
import React from 'react';
const API_URL = ''; 
class MessengerService {
  constructor() {
    this.socket = null;
    this.eventListeners = {};
    this.connectionPromise = null;
    this.joinedRooms = new Set(); 
    this.pendingJoins = {}; 
    this.joinThrottleTimers = {}; 
    this.pendingRequests = {}; 
    this.avatarCache = new Map();
    this.userProfileCache = new Map();
    this.userStatusCache = new Map();
    this.cacheCleanupInterval = setInterval(() => this.cleanupCache(), 1000 * 60 * 30); 
  }
  cleanupCache() {
    const now = Date.now();
    const MAX_AGE = 1000 * 60 * 60; 
    this.avatarCache.forEach((entry, key) => {
      if (now - entry.timestamp > MAX_AGE) {
        this.avatarCache.delete(key);
      }
    });
    this.userProfileCache.forEach((entry, key) => {
      if (now - entry.timestamp > MAX_AGE) {
        this.userProfileCache.delete(key);
      }
    });
    this.userStatusCache.forEach((entry, key) => {
      if (now - entry.timestamp > MAX_AGE) {
        this.userStatusCache.delete(key);
      }
    });
    console.log('Cache cleanup completed. Avatar cache size:', this.avatarCache.size, 'Profile cache size:', this.userProfileCache.size, 'Status cache size:', this.userStatusCache.size);
  }
  initSocket(options = {}) {
    if (this.socket && this.socket.connected && !options.forceNew) {
      console.log("Socket already connected with ID:", this.socket.id);
      return Promise.resolve(this.socket);
    }
    if (options.forceNew && this.socket) {
      console.log("Forcing socket reconnection due to forceNew option");
      try {
        this.socket.disconnect();
      } catch (e) {
        console.warn("Error during socket disconnect on force reconnect:", e);
      }
      this.socket = null;
      this.connectionPromise = null;
    }
    if (this.connectionPromise && !options.forceNew) {
      console.log("Socket connection already in progress");
      return this.connectionPromise;
    }
    this.connectionPromise = new Promise((resolve, reject) => {
      console.log("Initializing Socket.IO connection to messenger...");
      const socketOptions = {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: options.reconnectionAttempts || 10,
        reconnectionDelay: options.reconnectionDelay || 1000,
        reconnectionDelayMax: options.reconnectionDelayMax || 5000,
        timeout: options.timeout || 20000,
        autoConnect: true,
        forceNew: options.forceNew || false
      };
      if (this.socket) {
        if (!this.socket.connected) {
          console.log("Attempting to reconnect existing socket");
          this.socket.connect();
        }
      } else {
        this.socket = io(window.location.origin, socketOptions);
      }
      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server with ID:', this.socket.id);
        this.connectionPromise = null;
        if (this.eventListeners['connect']) {
          this.eventListeners['connect'].forEach(callback => callback());
        }
        resolve(this.socket);
      });
      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        if (this.eventListeners['connect_error']) {
          this.eventListeners['connect_error'].forEach(callback => callback(error));
        }
        if (this.connectionPromise) {
          this.connectionPromise = null;
          reject(error);
        }
      });
      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from Socket.IO server. Reason:', reason);
        if (reason === 'io server disconnect' || reason === 'transport close') {
          console.log('Attempting to reconnect...');
          this.socket.connect();
        }
        if (this.eventListeners['disconnect']) {
          this.eventListeners['disconnect'].forEach(callback => callback(reason));
        }
      });
      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`Socket.IO reconnected after ${attemptNumber} attempts`);
        if (this.eventListeners['reconnect']) {
          this.eventListeners['reconnect'].forEach(callback => callback(attemptNumber));
        }
      });
      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Socket.IO reconnect attempt ${attemptNumber}`);
        if (this.eventListeners['reconnect_attempt']) {
          this.eventListeners['reconnect_attempt'].forEach(callback => callback(attemptNumber));
        }
      });
      this.socket.on('messenger_connected', (data) => {
        try {
          console.log('Received messenger_connected event:', data);
          if (this.eventListeners['messenger_connected']) {
            this.eventListeners['messenger_connected'].forEach(callback => callback(data));
          }
          this.getContactsStatus();
        } catch (error) {
          console.error('Error processing messenger_connected event:', error);
        }
      });
      this.socket.on('new_message', (message) => {
        try {
          console.log('Received new_message event:', message);
          if (message && message.user_id) {
            const cachedAvatar = this.getAvatarFromCache(message.user_id);
            if (cachedAvatar) {
              message.sender_photo = cachedAvatar;
            }
          }
          if (this.eventListeners['new_message']) {
            this.eventListeners['new_message'].forEach(callback => callback(message));
          }
        } catch (error) {
          console.error('Error processing new message:', error);
        }
      });
      this.socket.on('new_message_notification', (notification) => {
        try {
          console.log('Received new_message_notification event:', notification);
          if (notification && notification.sender_id) {
            const cachedAvatar = this.getAvatarFromCache(notification.sender_id);
            if (cachedAvatar) {
              notification.sender_photo = cachedAvatar;
            }
          }
          if (this.eventListeners['new_message_notification']) {
            this.eventListeners['new_message_notification'].forEach(callback => callback(notification));
          }
        } catch (error) {
          console.error('Error processing message notification:', error);
        }
      });
      this.socket.on('user_status_changed', (statusData) => {
        try {
          console.log('Received user_status_changed event:', statusData);
          if (statusData && statusData.user_id) {
            this.setUserStatusInCache(statusData.user_id, {
              is_online: statusData.is_online,
              last_active: statusData.last_active,
              timestamp: Date.now()
            });
          }
          if (this.eventListeners['user_status_changed']) {
            this.eventListeners['user_status_changed'].forEach(callback => callback(statusData));
          }
        } catch (error) {
          console.error('Error processing user status update:', error);
        }
      });
      this.socket.on('contacts_status', (statusData) => {
        try {
          console.log('Received contacts_status event:', statusData);
          if (statusData && statusData.contacts && Array.isArray(statusData.contacts)) {
            statusData.contacts.forEach(contact => {
              if (contact && contact.user_id) {
                this.setUserStatusInCache(contact.user_id, {
                  is_online: contact.is_online,
                  last_active: contact.last_active,
                  timestamp: Date.now()
                });
              }
            });
          }
          if (this.eventListeners['contacts_status']) {
            this.eventListeners['contacts_status'].forEach(callback => callback(statusData));
          }
        } catch (error) {
          console.error('Error processing contacts status data:', error);
        }
      });
      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        if (this.eventListeners['error']) {
          this.eventListeners['error'].forEach(callback => callback(error));
        }
      });
      setTimeout(() => {
        if (this.connectionPromise) {
          this.connectionPromise = null;
          reject(new Error('Socket.IO connection timeout'));
        }
      }, socketOptions.timeout);
    });
    return this.connectionPromise;
  }
  getContactsStatus() {
    if (!this.socket || !this.socket.connected) {
      console.warn('Cannot get contacts status: socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }
    return new Promise((resolve) => {
      console.log('Requesting contacts status...');
      this.socket.emit('get_contacts_status');
      resolve(); 
    });
  }
  sequentialRejoin(rooms, index) {
    console.log("sequentialRejoin: Method is deprecated. Using only personal user room now.");
  }
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }
  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }
  async joinChatRoom(chatId) {
    console.log(`joinChatRoom: Больше не используется. Сервер будет отправлять сообщения в персональную комнату пользователя`);
    return true;
  }
  async leaveChatRoom(chatId) {
    console.log(`leaveChatRoom: Больше не используется. Сервер отправляет сообщения в персональную комнату пользователя`);
    return true;
  }
  disconnect() {
    console.log("Disconnecting from all socket connections...");
    try {
      this.joinedRooms.clear();
      console.log("Cleared local room tracking");
      Object.keys(this.pendingJoins).forEach(key => {
        console.log(`Cleaning up pending join for ${key}`);
        delete this.pendingJoins[key];
      });
      Object.keys(this.joinThrottleTimers).forEach(key => {
        console.log(`Cleaning up throttle timer for ${key}`);
        clearTimeout(this.joinThrottleTimers[key]);
        delete this.joinThrottleTimers[key];
      });
      Object.keys(this.pendingRequests).forEach(key => {
        console.log(`Cleaning up pending request for ${key}`);
        delete this.pendingRequests[key];
      });
      if (this.socket) {
        console.log("Disconnecting socket...");
        this.socket.disconnect();
        this.socket = null;
      }
      this.connectionPromise = null;
      if (this.cacheCleanupInterval) {
        clearInterval(this.cacheCleanupInterval);
      }
      console.log("Successfully disconnected from all socket connections");
      return true;
    } catch (error) {
      console.error("Error during socket disconnect:", error);
      if (this.socket) {
        try {
          this.socket.disconnect();
        } catch (e) {
          console.error("Error during forced socket disconnect:", e);
        }
        this.socket = null;
      }
      this.connectionPromise = null;
      this.joinedRooms.clear();
      return false;
    }
  }
  getUserStatusFromCache(userId) {
    const cached = this.userStatusCache.get(String(userId));
    if (cached) {
      cached.timestamp = Date.now();
      return {
        is_online: cached.is_online,
        last_active: cached.last_active
      };
    }
    return null;
  }
  setUserStatusInCache(userId, status) {
    if (userId && status) {
      this.userStatusCache.set(String(userId), {
        is_online: status.is_online,
        last_active: status.last_active,
        timestamp: Date.now()
      });
    }
  }
  async getChats(page = 1, perPage = 20) {
    const requestKey = `chats-${page}-${perPage}`;
    if (this.pendingRequests[requestKey]) {
      return this.pendingRequests[requestKey];
    }
    this.pendingRequests[requestKey] = axios.get(`${API_URL}/api/messenger/chats`, {
      params: { page, per_page: perPage }
    })
    .then(async response => {
      if (response.data && response.data.chats) {
        response.data.chats.forEach(chat => {
          if (chat.user && chat.user.id) {
            const cachedAvatar = this.getAvatarFromCache(chat.user.id);
            if (cachedAvatar) {
              chat.user.photo = cachedAvatar;
            } else if (chat.user.photo) {
              this.setAvatarInCache(chat.user.id, chat.user.photo);
            }
            const userStatus = this.getUserStatusFromCache(chat.user.id);
            if (userStatus) {
              chat.user.is_online = userStatus.is_online;
              chat.user.last_active = userStatus.last_active;
            }
          }
        });
        try {
          await this.initSocket();
          console.log("Socket initialized for messenger");
        } catch (error) {
          console.warn("Failed to initialize socket for messenger:", error);
        }
      }
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching chats:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load chat list',
        chats: []
      };
    })
    .finally(() => {
      setTimeout(() => delete this.pendingRequests[requestKey], 2000);
    });
    return this.pendingRequests[requestKey];
  }
  sequentialJoin(rooms, index) {
    console.log("sequentialJoin: Method is deprecated. Using only personal user room now.");
  }
  async getMessages(chatId, page = 1, perPage = 50) {
    try {
      const requestKey = `getMessages-${chatId}-${page}-${perPage}`;
      if (this.pendingRequests[requestKey]) {
        return this.pendingRequests[requestKey];
      }
      console.log(`Ensuring socket connection before fetching messages for chat ${chatId}`);
      await this.initSocket();
      const url = `${API_URL}/api/messenger/chats/${chatId}/messages?page=${page}&per_page=${perPage}`;
      this.pendingRequests[requestKey] = axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })
      .then(response => {
        if (response.data) {
          if (response.data.messages && Array.isArray(response.data.messages)) {
            response.data.messages = response.data.messages.map(message => {
              if (message.user_id) {
                const cachedAvatar = this.getAvatarFromCache(message.user_id);
                if (cachedAvatar) {
                  message.sender_photo = cachedAvatar;
                } else if (message.sender_photo) {
                  this.setAvatarInCache(message.user_id, message.sender_photo);
                }
              }
              return this.normalizeMessage(message, chatId);
            }).filter(Boolean); 
          } else {
            response.data.messages = [];
          }
          return response.data;
        }
        throw new Error('Invalid response format');
      })
      .catch(error => {
        console.error(`Error getting messages for chat ${chatId}:`, error);
        return {
          success: false,
          error: error.message || 'Error fetching messages',
          messages: [],
          chat: { id: chatId, name: `Чат ${chatId}` }
        };
      })
      .finally(() => {
        setTimeout(() => delete this.pendingRequests[requestKey], 2000);
      });
      return this.pendingRequests[requestKey];
    } catch (error) {
      console.error(`Fatal error in getMessages for chat ${chatId}:`, error);
      return {
        success: false,
        error: 'Failed to load messages',
        messages: [],
        chat: { id: chatId, name: `Чат ${chatId}` }
      };
    }
  }
  async sendMessage(chatId, content, attachments = []) {
    try {
      if (!chatId || isNaN(parseInt(chatId))) {
        return {
          success: false,
          error: 'Invalid chat ID',
          message: null
        };
      }
      if (content === '' && (!attachments || attachments.length === 0)) {
        return {
          success: false,
          error: 'Empty message without attachments',
          message: null
        };
      }
      let socketSuccess = false;
      if (attachments.length === 0 && this.socket && this.socket.connected) {
        try {
          const socketResult = await this.sendMessageSocket(chatId, content);
          socketSuccess = socketResult && socketResult.success;
          if (socketSuccess) {
            return socketResult;
          }
        } catch (socketError) {
          console.warn('Socket message failed, using HTTP fallback:', socketError);
        }
      }
      if (socketSuccess) {
        return { success: true, message: null };
      }
      const payload = {
        content: content || ''
      };
      const response = await axios.post(
        `${API_URL}/api/messenger/chats/${chatId}/messages`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );
      if (!response.data || !response.data.success) {
        return response.data;
      }
      if (!attachments || attachments.length === 0) {
        return response.data;
      }
      const messageId = response.data.message.id;
      const attachmentIds = [];
      for (const file of attachments) {
        if (file.url && !file.url.startsWith('blob:') && file.id && !file.id.startsWith('temp-')) {
          attachmentIds.push(file.id);
          continue;
        }
        const result = await this.uploadAttachment(file, chatId);
        if (result.success && result.attachment) {
          attachmentIds.push(result.attachment.id);
        }
      }
      if (attachmentIds.length > 0) {
        const updateResult = await this.updateMessageWithAttachments(chatId, messageId, attachmentIds);
        if (updateResult.success && updateResult.message) {
          response.data.message = updateResult.message;
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || error.response.data?.error || 'Server error',
          message: null
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - server did not respond',
          message: null
        };
      } else {
        return {
          success: false,
          error: error.message || 'Failed to send message',
          message: null
        };
      }
    }
  }
  getAvatarFromCache(userId) {
    const cached = this.avatarCache.get(String(userId));
    if (cached) {
      cached.timestamp = Date.now();
      return cached.url;
    }
    return null;
  }
  setAvatarInCache(userId, url) {
    if (userId && url) {
      this.avatarCache.set(String(userId), {
        url: url,
        timestamp: Date.now()
      });
    }
  }
  async getUserProfile(userId) {
    if (!userId) return null;
    const cachedProfile = this.userProfileCache.get(String(userId));
    if (cachedProfile) {
      cachedProfile.timestamp = Date.now();
      return cachedProfile.profile;
    }
    try {
      const response = await axios.get(`${API_URL}/api/profile/${userId}`);
      if (response.data && response.data.success && response.data.user) {
        this.userProfileCache.set(String(userId), {
          profile: response.data.user,
          timestamp: Date.now()
        });
        if (response.data.user.photo) {
          this.setAvatarInCache(userId, response.data.user.photo);
        }
        const userStatus = this.getUserStatusFromCache(userId);
        if (userStatus) {
          response.data.user.is_online = userStatus.is_online;
          response.data.user.last_active = userStatus.last_active;
        }
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      return null;
    }
  }
  normalizeMessage(message, chatId = null) {
    if (!message || typeof message !== 'object') {
      return null;
    }
    try {
      const messageId = message.id || `temp-${Date.now()}`;
      const userId = message.user_id;
      const chatIdValue = message.chat_id || chatId;
      const content = typeof message.content === 'string' ? message.content : 
                     (typeof message.content === 'object' ? JSON.stringify(message.content) : '');
      const createdAt = message.created_at || new Date().toISOString();
      const updatedAt = message.updated_at || createdAt;
      const senderName = message.sender_name || 'Unknown User';
      let senderPhoto = '/static/img/avatar.png'; 
      if (userId) {
        const cachedAvatar = this.getAvatarFromCache(userId);
        if (cachedAvatar) {
          senderPhoto = cachedAvatar;
        } else if (message.sender_photo) {
          if (message.avatar_url) {
            senderPhoto = message.avatar_url;
          } else if (message.sender_photo.startsWith('http') || message.sender_photo.startsWith('/')) {
            senderPhoto = message.sender_photo;
          } else {
            senderPhoto = `/static/uploads/avatar/${userId}/${message.sender_photo}`;
          }
          this.setAvatarInCache(userId, senderPhoto);
        }
      }
      let attachments = [];
      if (message.attachments && Array.isArray(message.attachments)) {
        attachments = message.attachments.map(attachment => {
          if (!attachment) return null;
          let url = attachment.url || '';
          if (url && !url.startsWith('http') && !url.startsWith('/')) {
            url = `/${url}`;
          } else if (!url && attachment.file_path) {
            url = attachment.file_path.startsWith('/') ? attachment.file_path : `/${attachment.file_path}`;
          }
          return {
            id: attachment.id || `temp-${Date.now()}`,
            type: attachment.type || attachment.file_type || 'file',
            name: attachment.name || attachment.file_name || 'File',
            file_name: attachment.file_name || attachment.name || 'File',
            file_size: attachment.file_size || attachment.size || 0,
            file_type: attachment.file_type || attachment.type || 'application/octet-stream',
            url: url,
            file_path: attachment.file_path || '',
            uploaded_at: attachment.uploaded_at || createdAt
          };
        }).filter(Boolean); 
      }
      return {
        id: messageId,
        chat_id: chatIdValue,
        user_id: userId,
        content: content,
        created_at: createdAt,
        updated_at: updatedAt,
        sender_name: senderName,
        sender_photo: senderPhoto,
        is_read: Boolean(message.is_read),
        has_attachment: attachments.length > 0 || Boolean(message.has_attachment),
        attachments: attachments,
        is_optimistic: Boolean(message.is_optimistic),
        error: message.error || null
      };
    } catch (error) {
      console.error('Error normalizing message:', error, 'Raw message:', message);
      return null;
    }
  }
  normalizeSocketMessage(message) {
    if (!message || typeof message !== 'object') {
      return null;
    }
    try {
      if (message.user_id) {
        const cachedAvatar = this.getAvatarFromCache(message.user_id);
        if (cachedAvatar) {
          message.sender_photo = cachedAvatar;
        } else if (!message.avatar_url && !message.is_optimistic) {
          this.getUserProfile(message.user_id)
            .then(userData => {
              if (userData && userData.photo) {
                this.setAvatarInCache(message.user_id, userData.photo);
                if (this.eventListeners['avatar_updated']) {
                  this.eventListeners['avatar_updated'].forEach(callback => 
                    callback({user_id: message.user_id, avatar_url: userData.photo})
                  );
                }
              }
            })
            .catch(() => {
              console.debug('Failed to load user profile for avatar update');
            });
        }
      }
      return this.normalizeMessage(message);
    } catch (error) {
      console.error("Error processing socket message:", error);
      return null;
    }
  }
  async sendMessageSocket(chatId, content, attachmentId = null) {
    try {
      await this.initSocket();
      if (!this.socket || !this.socket.connected) {
        console.warn('Socket not connected, falling back to HTTP');
        throw new Error('Socket.IO not connected');
      }
      return new Promise((resolve, reject) => {
        console.log(`Sending message via socket to chat ${chatId}`);
        const messageData = {
          chat_id: chatId,
          content
        };
        if (attachmentId) {
          messageData.attachment_id = attachmentId;
        }
        this.socket.emit('send_message', messageData, (response) => {
          if (response === true) {
            resolve({ success: true });
          } else {
            reject(new Error('Failed to send message through socket'));
          }
        });
        setTimeout(() => {
          reject(new Error('Socket message send timeout'));
        }, 8000); 
      });
    } catch (error) {
      console.error('Error sending message via socket:', error);
      throw error;
    }
  }
  async uploadAttachment(fileOrFormData, chatId = null, nocache = null) {
    try {
      console.log("Загрузка вложения:", fileOrFormData, "для чата:", chatId);
      let formData;
      if (fileOrFormData instanceof FormData) {
        formData = fileOrFormData;
        console.log("Используем переданный FormData объект");
        if (chatId && !formData.has('chat_id')) {
          formData.append('chat_id', chatId);
        }
      } else {
        formData = new FormData();
        const fileToUpload = fileOrFormData instanceof File ? fileOrFormData : (fileOrFormData.rawFile || fileOrFormData);
        console.log("Создаем новый FormData с файлом:", fileToUpload);
        formData.append('file', fileToUpload);
        if (chatId) {
          formData.append('chat_id', chatId);
        }
      }
      formData.append('timestamp', Date.now().toString());
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      const uploadUrl = nocache 
        ? `${API_URL}/api/messenger/upload?_nocache=${nocache}` 
        : `${API_URL}/api/messenger/upload`;
      console.log("Отправляем запрос на:", uploadUrl);
      const response = await axios.post(
        uploadUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 
        }
      );
      console.log("Ответ от сервера:", response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка загрузки вложения:', error);
      if (error.response) {
        console.error('Ответ сервера с ошибкой:', error.response.data);
      } else if (error.request) {
        console.error('Нет ответа от сервера');
      }
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Не удалось загрузить вложение'
      };
    }
  }
  async markMessagesRead(chatId) {
    try {
      const response = await axios.post(`${API_URL}/api/messenger/chats/${chatId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark messages as read'
      };
    }
  }
  async deleteChat(chatId) {
    try {
      const response = await axios.delete(`${API_URL}/api/messenger/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete chat'
      };
    }
  }
  async getUnreadCount() {
    try {
      const response = await axios.get(`${API_URL}/api/messenger/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get unread message count',
        total_unread: 0,
        chats_unread: {}
      };
    }
  }
  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/api/profile/current`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      return {
        success: true,
        user: {
          id: 1, 
          name: 'Текущий пользователь', 
          username: 'current_user',
          photo: '/static/img/avatar.png', 
          is_online: true
        }
      };
    }
  }
  async updateMessageWithAttachments(chatId, messageId, attachmentIds) {
    try {
      console.log(`Обновление сообщения ${messageId} в чате ${chatId} с вложениями:`, attachmentIds);
      const response = await axios.put(
        `${API_URL}/api/messenger/chats/${chatId}/messages/${messageId}`,
      );
      console.log("Ответ на обновление сообщения:", response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении сообщения с вложениями:', error);
      if (error.response) {
        console.error('Ответ сервера с ошибкой:', error.response.data);
        return {
          success: false,
          error: error.response.data?.error || 'Ошибка сервера при обновлении сообщения'
        };
      }
      return {
        success: false,
        error: error.message || 'Не удалось обновить сообщение с вложениями'
      };
    }
  }
}
const messengerService = new MessengerService();
export default messengerService; 