import React from 'react';
import { createRoot } from 'react-dom/client';

import './utils/ensure-global-functions';

import indexedDbCache from './utils/indexedDbCache';

import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import './services/axiosConfig';

// Функция для управления кэшированием
async function setupCaching() {
  console.debug('[Cache] Настройка кэширования...');
  
  try {
    // 1. Отключение сервис-воркера (кроме пуш-уведомлений)
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        try {
          // Check if this is our push notification service worker by examining active state
          const active = registration.active;
          if (active) {
            // Try to get the script URL
            const scriptURL = active.scriptURL || '';
            if (scriptURL.includes('service-worker.js')) {
              console.debug('[ServiceWorker] Сохранен для push-уведомлений:', registration.scope);
              continue; // Skip unregistration
            }
          }
          
          // Unregister all other service workers
          await registration.unregister();
          console.debug('[ServiceWorker] Деактивирован:', registration.scope);
        } catch (err) {
          console.error('[ServiceWorker] Ошибка при проверке:', err);
        }
      }
    }
    
    // 2. Модифицируем fetch для не-ассетов (добавляем nocache параметр)
    const originalFetch = window.fetch;
    window.fetch = function(resource, options = {}) {
      // Не модифицируем запросы к ассетам - они обрабатываются indexedDbCache
      const url = resource instanceof Request ? resource.url : resource;
      
      if (typeof url === 'string' && url.includes('/assets/')) {
        return originalFetch(resource, options);
      }
      
      // Для всех остальных запросов предотвращаем кэширование
      if (!options.headers) {
        options.headers = {};
      }
      
      // Преобразуем headers в обычный объект
      if (options.headers instanceof Headers) {
        const headersObj = {};
        for (const [key, value] of options.headers.entries()) {
          headersObj[key] = value;
        }
        options.headers = headersObj;
      }
      
      // Добавляем заголовки против кэширования
      options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      options.headers['Pragma'] = 'no-cache';
      options.headers['Expires'] = '0';
      
      // Добавляем случайное число к URL для предотвращения кэширования
      if (typeof url === 'string' && 
          (url.includes('/static/') || url.includes('/api/') || 
           url.includes('/media/') || url.includes('/uploads/'))) {
        const separator = url.includes('?') ? '&' : '?';
        const modifiedUrl = `${url}${separator}_nocache=${Date.now()}`;
        return originalFetch(modifiedUrl, options);
      }
      
      return originalFetch(resource, options);
    };
    
    // 3. Модифицируем XMLHttpRequest для не-ассетов
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      // Не модифицируем запросы к ассетам
      if (typeof url === 'string' && url.includes('/assets/')) {
        originalXhrOpen.call(this, method, url, ...rest);
        return;
      }
      
      // Для всех остальных запросов предотвращаем кэширование
      this.setRequestHeader = this.setRequestHeader || function() {};
      
      let modifiedUrl = url;
      if (typeof url === 'string' && 
          (url.includes('/static/') || url.includes('/api/') || 
           url.includes('/media/') || url.includes('/uploads/'))) {
        const separator = url.includes('?') ? '&' : '?';
        modifiedUrl = `${url}${separator}_nocache=${Date.now()}`;
      }
      
      originalXhrOpen.call(this, method, modifiedUrl, ...rest);
      
      const originalSetRequestHeader = this.setRequestHeader;
      this.setRequestHeader = function(header, value) {
        if (header === 'Cache-Control' || header === 'Pragma' || header === 'Expires') {
          // Пропускаем заголовки, которые уже могут быть установлены
          return;
        }
        originalSetRequestHeader.call(this, header, value);
      };
      
      try {
        this.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        this.setRequestHeader('Pragma', 'no-cache');
        this.setRequestHeader('Expires', '0');
      } catch (e) {
        // Игнорируем ошибки - могут возникать если запрос уже отправлен
      }
    };
    
    console.debug('[Cache] Настройка кэширования завершена');
  } catch (error) {
    console.error('[Cache] Ошибка при настройке кэширования:', error);
  }
}

// Инициализируем IndexedDB для assets
indexedDbCache.init();

// Настраиваем кэширование для остальных ресурсов
setupCaching().then(() => {
  // Используем новый API createRoot из React 18
  const container = document.getElementById('root');
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}); 