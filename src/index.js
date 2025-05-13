import React from 'react';
import { createRoot } from 'react-dom/client';

import './utils/ensure-global-functions';

import indexedDbCache from './utils/indexedDbCache';

import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import './services/axiosConfig';

import ErrorBoundary from './components/ErrorBoundary';
import LoadingIndicator from './components/LoadingIndicator';

async function setupCaching() {
  console.debug('[Cache] Настройка кэширования...');
  
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        try {
          const active = registration.active;
          if (active) {
            const scriptURL = active.scriptURL || '';
            if (scriptURL.includes('service-worker.js')) {
              console.debug('[ServiceWorker] Сохранен для push-уведомлений:', registration.scope);
              continue;
            }
          }
          
          await registration.unregister();
          console.debug('[ServiceWorker] Деактивирован:', registration.scope);
        } catch (err) {
          console.error('[ServiceWorker] Ошибка при проверке:', err);
        }
      }
    }
    
    const originalFetch = window.fetch;
    window.fetch = function(resource, options = {}) {
      const url = resource instanceof Request ? resource.url : resource;
      
      if (typeof url === 'string' && url.includes('/assets/')) {
        return originalFetch(resource, options);
      }
      
      if (!options.headers) {
        options.headers = {};
      }
      
      if (options.headers instanceof Headers) {
        const headersObj = {};
        for (const [key, value] of options.headers.entries()) {
          headersObj[key] = value;
        }
        options.headers = headersObj;
      }
      
      options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      options.headers['Pragma'] = 'no-cache';
      options.headers['Expires'] = '0';
      
      if (typeof url === 'string' && 
          (url.includes('/static/') || url.includes('/api/') || 
           url.includes('/media/') || url.includes('/uploads/'))) {
        const separator = url.includes('?') ? '&' : '?';
        const modifiedUrl = `${url}${separator}_nocache=${Date.now()}`;
        return originalFetch(modifiedUrl, options);
      }
      
      return originalFetch(resource, options);
    };
    
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      if (typeof url === 'string' && url.includes('/assets/')) {
        originalXhrOpen.call(this, method, url, ...rest);
        return;
      }
      
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
          return;
        }
        originalSetRequestHeader.call(this, header, value);
      };
      
      try {
        this.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        this.setRequestHeader('Pragma', 'no-cache');
        this.setRequestHeader('Expires', '0');
      } catch (e) {
      }
    };
    
    console.debug('[Cache] Настройка кэширования завершена');
  } catch (error) {
    console.error('[Cache] Ошибка при настройке кэширования:', error);
  }
}

indexedDbCache.init();

setupCaching().then(() => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <LoadingIndicator />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}); 