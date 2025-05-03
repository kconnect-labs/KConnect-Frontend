import axios from 'axios';

class NotificationService {
  async getVapidPublicKey() {
    let retryCount = 0;
    const maxRetries = 2;
    
    // NOTE: We're using a hardcoded VAPID key for compatibility
    
    const hardcodedVapidKey = 'BHHDcCL7H0Aze-qL17sSPR-x4PcDrvConfsgy-BaRmEkSBq8QyacSjt-EDocdQbxvEwplO0GbBVFe0UWmM0HKp0=';
    console.log(`Using hardcoded VAPID key: ${hardcodedVapidKey.substring(0, 10)}...`);
    return hardcodedVapidKey;
    
  }
  
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        
        const existingRegistrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of existingRegistrations) {
          if (reg.active && reg.active.scriptURL.includes('service-worker.js')) {
            console.log('Push service worker already registered with scope:', reg.scope);
            return reg;
          }
        }
        
        
        console.log('Registering push service worker...');
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
          updateViaCache: 'none' 
        });
        console.log('Push service worker registered with scope:', registration.scope);
        
        
        if (registration.installing) {
          console.log('Service worker installing...');
          registration.installing.addEventListener('statechange', e => {
            if (e.target.state === 'activated') {
              console.log('Service worker activated!');
            }
          });
        }
        
        return registration;
      } catch (error) {
        console.error('Push service worker registration failed:', error);
        throw error;
      }
    } else {
      throw new Error('Service Worker not supported in this browser');
    }
  }
  
  async subscribeToPushNotifications() {
    try {
      console.log('Starting push notification subscription process...');
      
      
      if (Notification.permission !== 'granted') {
        console.log('Notification permission not granted, requesting permission...');
        const permission = await this.requestNotificationPermission();
        if (permission !== 'granted') {
          throw new Error(`Notification permission not granted: ${permission}`);
        }
      }
      
      
      let registration;
      if (navigator.serviceWorker.controller) {
        console.log('Service worker already controlling, getting ready state...');
        registration = await navigator.serviceWorker.ready;
      } else {
        console.log('Service worker not controlling, registering new service worker...');
        registration = await this.registerServiceWorker();
      }
      
      console.log('Getting VAPID public key...');
      const vapidPublicKey = await this.getVapidPublicKey();
      console.log('VAPID public key retrieved, length:', vapidPublicKey.length);
      
      
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
      console.log('Converted VAPID key to Uint8Array, length:', convertedVapidKey.length);
      
      
      console.log('Checking for existing push subscriptions...');
      let subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        console.log('Existing subscription found:', subscription.endpoint);
        
        
        const currentServerKey = new Uint8Array(subscription.options.applicationServerKey);
        let needsResubscribe = currentServerKey.length !== convertedVapidKey.length;
        
        if (!needsResubscribe) {
          for (let i = 0; i < currentServerKey.length; i++) {
            if (currentServerKey[i] !== convertedVapidKey[i]) {
              needsResubscribe = true;
              break;
            }
          }
        }
        
        if (needsResubscribe) {
          console.log('Server key changed, unsubscribing from old subscription...');
          await subscription.unsubscribe();
          subscription = null;
        }
      }
      
      
      if (!subscription) {
        console.log('Creating new push subscription...');
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
          console.log('Successfully subscribed to push notifications');
        } catch (subscribeError) {
          console.error('Error subscribing to push:', subscribeError);
          throw subscribeError;
        }
      }
      
      
      console.log('Saving subscription to server...');
      await this.saveSubscription(subscription);
      console.log('Subscription successfully saved to server');
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }
  
  async unsubscribeFromPushNotifications() {
    try {
      if (!navigator.serviceWorker.controller) {
        console.log('No active service worker found');
        return false;
      }
      
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        
        await axios.delete('/api/notifications/push-subscription', {
          data: { endpoint: subscription.endpoint }
        });
        
        
        await subscription.unsubscribe();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  }
  
  async saveSubscription(subscription) {
    try {
      const subscriptionJSON = subscription.toJSON();
      
      
      const payload = {
        ...subscriptionJSON,
        send_test: true,  
        platform: this.getBrowserInfo(), 
        url: 'https://k-connect.ru'  // Всегда включаем параметр url вместо link
      };
      
      console.log('Saving subscription to server:', payload);
      const response = await axios.post('/api/notifications/push-subscription', payload);
      console.log('Subscription saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving subscription to server:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw error;
    }
  }
  
  // Получение информации о браузере для аналитики
  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'other';
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = 'chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = 'firefox';
    } else if (userAgent.match(/safari/i)) {
      browserName = 'safari';
    } else if (userAgent.match(/opr\//i)) {
      browserName = 'opera';
    } else if (userAgent.match(/edg/i)) {
      browserName = 'edge';
    }
    
    return browserName;
  }
  
  async getNotificationPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }
  
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  async isPushNotificationSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }
  
  // Helper to parse notification links and content
  parseNotificationLink(link) {
    if (!link) return { type: 'unknown' };
    if (link.startsWith('/profile/')) {
      return {
        type: 'profile',
        username: link.split('/profile/')[1]
      };
    }
    if (link.includes('?comment=') && link.includes('&reply=')) {
      const postId = link.split('/post/')[1].split('?')[0];
      const commentId = link.split('comment=')[1].split('&')[0];
      const replyId = link.split('reply=')[1];
      
      return {
        type: 'reply',
        postId,
        commentId,
        replyId
      };
    }
    if (link.includes('?comment=')) {
      const postId = link.split('/post/')[1].split('?')[0];
      const commentId = link.split('comment=')[1];
      
      return {
        type: 'comment',
        postId,
        commentId
      };
    }
    if (link.startsWith('/post/')) {
      const postId = link.split('/post/')[1];
      
      return {
        type: 'post',
        postId
      };
    }
    
    return { type: 'unknown' };
  }
  async fetchNotificationContent(notification) {
    try {
      if (!notification || !notification.link) {
        return notification;
      }
      
      const linkInfo = this.parseNotificationLink(notification.link);
      
      switch (linkInfo.type) {
        case 'post':
          try {
            const postResponse = await axios.get(`/api/posts/${linkInfo.postId}/preview`);
            if (postResponse.data && postResponse.data.success) {
              return {
                ...notification,
                post_data: postResponse.data.post
              };
            }
          } catch (error) {
            console.error('Error fetching post data for notification:', error);
          }
          break;
          
        case 'comment':
          try {
            const commentResponse = await axios.get(`/api/comments/${linkInfo.commentId}/preview`);
            if (commentResponse.data && commentResponse.data.success) {
              return {
                ...notification,
                comment_data: commentResponse.data.comment
              };
            }
          } catch (error) {
            console.error('Error fetching comment data for notification:', error);
          }
          break;
          
        case 'reply':
          try {
            const replyResponse = await axios.get(`/api/comments/${linkInfo.replyId}/preview`);
            if (replyResponse.data && replyResponse.data.success) {
              return {
                ...notification,
                reply_data: replyResponse.data.comment
              };
            }
          } catch (error) {
            console.error('Error fetching reply data for notification:', error);
          }
          break;
      }
      
      return notification;
    } catch (error) {
      console.error('Error enriching notification with content:', error);
      return notification;
    }
  }
  urlBase64ToUint8Array(base64String) {
    if (!base64String) {
      console.error('Empty base64String provided to urlBase64ToUint8Array');
      throw new Error('Invalid VAPID key: empty string');
    }
    
    console.log(`Converting VAPID key to Uint8Array. Input length: ${base64String.length}, browser: ${this.getBrowserInfo()}`);
    
    try {
      let base64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      
      console.log(`Normalized base64 length: ${base64.length}`);
      const binaryStr = atob(base64);
      console.log(`Decoded binary string length: ${binaryStr.length}`);
      const outputArray = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; ++i) {
        outputArray[i] = binaryStr.charCodeAt(i);
      }
      
      console.log(`Final Uint8Array length: ${outputArray.length}`);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if ((isSafari || isIOS) && outputArray.length !== 65) {
        console.warn(`VAPID key may not be in correct format for Safari/iOS. Length: ${outputArray.length}, expected: 65`);
      }
      
      return outputArray;
    } catch (error) {
      console.error('Error converting VAPID key:', error);
      throw new Error(`Failed to convert VAPID key: ${error.message}`);
    }
  }
  async sendTestNotification() {
    try {
      console.log('Sending test notification request...');
      const response = await axios.post('/api/notifications/test', {
        url: 'https://k-connect.ru',
        title: 'Тестовое уведомление',
        body: 'Уведомления настроены и работают'
      });
      console.log('Test notification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending test notification:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw error;
    }
  }
}

export default new NotificationService(); 