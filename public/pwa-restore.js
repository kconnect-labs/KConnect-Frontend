// Скрипт для восстановления PWA мета-тегов после загрузки React

// Функция для создания и добавления мета-тегов
function addMetaTag(name, content, rel) {
  let tag;
  
  if (rel) {
    // Для link элементов
    if (!document.querySelector(`link[rel="${rel}"]${name ? `[href="${name}"]` : ''}`)) {
      tag = document.createElement('link');
      tag.setAttribute('rel', rel);
      if (name) tag.setAttribute('href', name);
      if (content) tag.setAttribute(content.name, content.value);
      document.head.appendChild(tag);
    }
  } else {
    // Для meta элементов
    if (!document.querySelector(`meta[name="${name}"]`)) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    }
  }
}

// Функция для восстановления PWA мета-тегов
function restorePwaMetaTags() {
  // Восстанавливаем manifest
  addMetaTag('manifest.json', null, 'manifest');
  
  // Восстанавливаем основные PWA мета-теги
  addMetaTag('mobile-web-app-capable', 'yes');
  addMetaTag('application-name', 'К-Коннект');
  addMetaTag('theme-color', '#131313');
  
  // Восстанавливаем iOS PWA мета-теги
  addMetaTag('apple-mobile-web-app-capable', 'yes');
  addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMetaTag('apple-mobile-web-app-title', 'К-Коннект');
  
  // Восстанавливаем иконки
  addMetaTag('icon-180.png', null, 'apple-touch-icon');
  addMetaTag('icon-152.png', {name: 'sizes', value: '152x152'}, 'apple-touch-icon');
  addMetaTag('icon-167.png', {name: 'sizes', value: '167x167'}, 'apple-touch-icon');
  addMetaTag('icon-180.png', {name: 'sizes', value: '180x180'}, 'apple-touch-icon');
  
  // Восстанавливаем сплеш-скрины
  addMetaTag('splash/splash-1125x2436.png', {name: 'media', value: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'}, 'apple-touch-startup-image');
  addMetaTag('splash/splash-750x1334.png', {name: 'media', value: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'}, 'apple-touch-startup-image');
  
  // Восстанавливаем заголовок
  if (document.title !== 'К-Коннект') {
    document.title = 'К-Коннект';
  }
  
  // Восстанавливаем favicon
  if (!document.querySelector('link[rel="icon"][href="favicon.ico"]')) {
    addMetaTag('favicon.ico', null, 'icon');
    addMetaTag('favicon.ico', {name: 'type', value: 'image/x-icon'}, 'shortcut icon');
  }
}

// Запуск восстановления при полной загрузке страницы
window.addEventListener('load', function() {
  // Сначала восстанавливаем сразу
  restorePwaMetaTags();
  
  // Затем проверяем периодически
  setInterval(restorePwaMetaTags, 1000);
});

// Запуск также при переходах по страницам
if ('onpopstate' in window) {
  window.addEventListener('popstate', restorePwaMetaTags);
} 