/**
 * Utilities for image handling and placeholder generation
 */

/**
 * Generates a fallback gradient image for a playlist or section
 * @param {string} type - The type of placeholder ('liked', 'all', 'new', 'random', 'album', 'playlist')
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - Data URL of the generated image
 */
export const generatePlaceholderImage = (type = 'album', width = 300, height = 300) => {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Define gradients for different types
  const gradients = {
    liked: {
      colors: ['#ff5252', '#d32f2f'],
      shape: 'radial'
    },
    all: {
      colors: ['#3f51b5', '#1a237e'],
      shape: 'linear'
    },
    new: {
      colors: ['#43a047', '#1b5e20'],
      shape: 'linear'
    },
    random: {
      colors: ['#7b1fa2', '#4a148c'],
      shape: 'radial'
    },
    album: {
      colors: ['#424242', '#212121'],
      shape: 'linear'
    },
    playlist: {
      colors: ['#546e7a', '#263238'],
      shape: 'linear'
    }
  };
  
  // Use the appropriate gradient or default to 'album'
  const gradientConfig = gradients[type] || gradients.album;
  let gradient;
  
  if (gradientConfig.shape === 'radial') {
    gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width / 1.5
    );
  } else {
    gradient = ctx.createLinearGradient(0, 0, width, height);
  }
  
  gradient.addColorStop(0, gradientConfig.colors[0]);
  gradient.addColorStop(1, gradientConfig.colors[1]);
  
  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add some decoration based on type
  if (type === 'liked') {
    // Draw a heart shape
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    const heartSize = width / 2;
    const x = width / 2;
    const y = height / 2;
    
    // Heart shape path
    ctx.moveTo(x, y - heartSize / 4);
    ctx.bezierCurveTo(
      x, y - heartSize / 2,
      x - heartSize / 2, y - heartSize / 2,
      x - heartSize / 2, y - heartSize / 4
    );
    ctx.bezierCurveTo(
      x - heartSize / 2, y + heartSize / 4,
      x, y + heartSize / 2,
      x, y + heartSize / 2
    );
    ctx.bezierCurveTo(
      x, y + heartSize / 2,
      x + heartSize / 2, y + heartSize / 4,
      x + heartSize / 2, y - heartSize / 4
    );
    ctx.bezierCurveTo(
      x + heartSize / 2, y - heartSize / 2,
      x, y - heartSize / 2,
      x, y - heartSize / 4
    );
    
    ctx.fill();
  } else if (type === 'random') {
    // Draw some random circles
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width / 8 + 10,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  } else if (type === 'new') {
    // Draw a plus symbol
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    const size = width / 6;
    const x = width / 2 - size / 2;
    const y = height / 2 - size / 2;
    
    // Horizontal bar
    ctx.fillRect(x - size, y + size / 2 - size / 6, size * 3, size / 3);
    // Vertical bar
    ctx.fillRect(x + size / 2 - size / 6, y - size, size / 3, size * 3);
  } else if (type === 'all') {
    // Draw horizontal lines
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + (i * 0.02)})`;
      ctx.fillRect(width / 4, height / 3 + (i * height / 15), width / 2, height / 30);
    }
  } else {
    // Draw a subtle pattern for playlists and albums
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 - (i * 0.03)})`;
      ctx.fillRect(width / 4, height / 4 + (i * height / 12), width / 2, height / 15);
    }
  }
  
  // Return the image as a data URL
  return canvas.toDataURL('image/jpeg', 0.9);
};

/**
 * Get a cover image with fallback to generated placeholder
 * @param {string} path - The image path
 * @param {string} type - The type of placeholder if needed
 * @returns {string} - The image URL (original or generated)
 */
export const getCoverWithFallback = (path, type = 'album') => {
  // Безопасная проверка на null, undefined или пустую строку
  if (!path || path === '') {
    // Use placeholder based on type
    return generatePlaceholderImage(type || 'album');
  }
  
  // Защита от неправильного типа
  if (typeof path !== 'string') {
    console.warn('getCoverWithFallback: path is not a string', path);
    return generatePlaceholderImage(type || 'album');
  }
  
  // Fix common path issues
  if (path && !path.startsWith('/') && !path.startsWith('http')) {
    path = '/' + path;
  }
  
  try {
    // Handle both path formats - with or without /static prefix
    const isSystemFile = path && (
      path.includes('/uploads/system/') || 
      path.includes('/static/uploads/system/')
    );
    
    if (isSystemFile) {
      // For system files, provide specific fallbacks by type
      const fallbacks = {
        'like_playlist.jpg': generatePlaceholderImage('liked'),
        'all_tracks.jpg': generatePlaceholderImage('all'),
        'random_tracks.jpg': generatePlaceholderImage('random'),
        'album_placeholder.jpg': generatePlaceholderImage('album'),
        'playlist_placeholder.jpg': generatePlaceholderImage('playlist')
      };
      
      // Ищем соответствующий заглушку по имени файла
      for (const [filename, fallback] of Object.entries(fallbacks)) {
        if (path.includes(filename)) {
          // Такой файл есть на сервере - возвращаем исходный путь
          return path;
        }
      }
    }
    
    return path;
  } catch (error) {
    console.error('Error in getCoverWithFallback:', error);
    return generatePlaceholderImage(type || 'album');
  }
};

/**
 * Извлекает основной цвет из изображения
 * @param {string} imgSrc - Путь к изображению
 * @param {function} callback - Функция для возврата извлеченного цвета
 */
export const extractDominantColor = (imgSrc, callback) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    
    context.drawImage(img, 0, 0);
    
    // Берем цвет из центра изображения
    const centerX = img.width / 2;
    const centerY = img.height / 2;
    const data = context.getImageData(centerX, centerY, 1, 1).data;
    
    // Формируем строку RGB
    callback(`${data[0]}, ${data[1]}, ${data[2]}`);
  };
  
  img.onerror = () => {
    console.error(`Failed to load image: ${imgSrc}`);
    callback(null);
  };
  
  img.src = imgSrc;
};

/**
 * Проверяет поддержку WebP в браузере
 * @returns {Promise<boolean>} true если WebP поддерживается
 */
export const isWebPSupported = async () => {
  // Проверка наличия функции
  if (!self.createImageBitmap) return false;
  
  // Создаем тестовое WebP изображение в base64
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  
  try {
    // Пробуем декодировать
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  } catch (e) {
    return false;
  }
};

/**
 * Конвертирует изображение в формат WebP при поддержке
 * @param {string} url - Исходный URL изображения
 * @param {Object} options - Настройки конвертации
 * @param {number} options.quality - Качество WebP (0-1, по умолчанию 0.8)
 * @param {number} options.maxWidth - Максимальная ширина (сохраняет пропорции)
 * @param {boolean} options.cacheResults - Кэшировать ли результаты в sessionStorage
 * @returns {Promise<string>} URL изображения в WebP или исходный если конвертация не удалась
 */
export const convertToWebP = async (url, options = {}) => {
  // Пропускаем data URL, SVG, GIF и уже WebP
  if (!url || 
      url.startsWith('data:') || 
      url.includes('.svg') || 
      url.includes('.gif') || 
      url.includes('.webp')) {
    return url;
  }
  
  // Параметры по умолчанию
  const {
    quality = 0.8,
    maxWidth = 1200,
    cacheResults = true
  } = options;
  
  // Создаем ключ для кэша
  const cacheKey = `webp-cache-${url}-${quality}-${maxWidth}`;
  
  // Сначала проверяем кэш если разрешено
  if (cacheResults && 'sessionStorage' in window) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (e) {
      console.warn('Failed to read from sessionStorage', e);
    }
  }
  
  // Проверяем поддержку WebP
  const webpSupported = await isWebPSupported();
  if (!webpSupported) {
    return url;
  }
  
  // Создаем элемент изображения для загрузки оригинала
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Вычисляем размеры
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = Math.round(height * ratio);
      }
      
      // Создаем канвас и рисуем изображение
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Конвертируем в WebP
      try {
        const webpUrl = canvas.toDataURL('image/webp', quality);
        
        // Сохраняем в кэш если разрешено
        if (cacheResults && 'sessionStorage' in window) {
          try {
            sessionStorage.setItem(cacheKey, webpUrl);
          } catch (e) {
            console.warn('Failed to write to sessionStorage', e);
          }
        }
        
        resolve(webpUrl);
      } catch (e) {
        console.warn('Failed to convert image to WebP', e);
        resolve(url);
      }
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${url}`);
      resolve(url);
    };
    
    img.src = url;
  });
};

/**
 * Оптимизирует изображение для отображения, приоритезируя WebP где возможно
 * @param {string} url - URL исходного изображения
 * @param {Object} options - Опции оптимизации
 * @param {number} options.quality - Качество (0-1)
 * @param {number} options.maxWidth - Максимальная ширина
 * @param {boolean} options.cacheResults - Кэшировать ли результаты
 * @param {boolean} options.preferWebP - Предпочитать ли WebP
 * @returns {Promise<Object>} - Объект с оптимизированным URL и типом
 */
export const optimizeImage = async (url, options = {}) => {
  // Значения по умолчанию
  const {
    quality = 0.8,
    maxWidth = 1000,
    cacheResults = true,
    preferWebP = true
  } = options;
  
  // Проверяем кэш
  const cacheKey = `img_${url}_${quality}_${maxWidth}_${preferWebP}`;
  if (cacheResults && window._imageCache && window._imageCache[cacheKey]) {
    return window._imageCache[cacheKey];
  }
  
  // Проверка поддержки WebP
  let webpSupported = false;
  try {
    webpSupported = preferWebP && await isWebPSupported();
  } catch (e) {
    console.warn('Error checking WebP support:', e);
  }
  
  // Если у нас URL с сервера, используем параметры API для оптимизации
  if (url && (url.startsWith('/static/') || url.startsWith('/uploads/'))) {
    // Создаем новый URL с параметрами оптимизации
    const separator = url.includes('?') ? '&' : '?';
    let optimizedUrl = `${url}${separator}width=${maxWidth}&quality=${Math.round(quality * 100)}`;
    
    // Добавляем WebP если поддерживается
    if (webpSupported) {
      optimizedUrl += '&format=webp';
    }
    
    // Создаем результат
    const result = {
      src: optimizedUrl,
      originalSrc: url,
      type: webpSupported ? 'image/webp' : 'image/jpeg',
      optimized: true
    };
    
    // Кэшируем результат если нужно
    if (cacheResults) {
      if (!window._imageCache) window._imageCache = {};
      window._imageCache[cacheKey] = result;
    }
    
    return result;
  }
  
  // Для внешних URL или если формат не поддерживается, возвращаем исходный URL
  return {
    src: url,
    originalSrc: url,
    type: 'image/jpeg', // Предполагаем что JPEG
    optimized: false
  };
};

/**
 * Generates a data URL for a placeholder image
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @param {string} text - Optional text to display on the placeholder
 * @param {string} bgColor - Background color (hex, rgb, etc)
 * @param {string} textColor - Text color (hex, rgb, etc)
 * @returns {string} - Data URL for the placeholder image
 */
export const generatePlaceholder = (width = 300, height = 150, text = '', bgColor = '#e0e0e0', textColor = '#666666') => {
  try {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Add text if provided
    if (text) {
      ctx.fillStyle = textColor;
      ctx.font = `bold ${Math.floor(height / 10)}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // If text is too long, truncate with ellipsis
      const maxWidth = width * 0.8;
      let displayText = text;
      let textWidth = ctx.measureText(displayText).width;
      
      if (textWidth > maxWidth) {
        // Try to fit a portion of the text with ellipsis
        let i = displayText.length;
        while (textWidth > maxWidth && i > 0) {
          i--;
          displayText = displayText.substring(0, i) + '...';
          textWidth = ctx.measureText(displayText).width;
        }
      }
      
      ctx.fillText(displayText, width / 2, height / 2);
    }
    
    // Add dimensions as small text at bottom
    const dimensionsText = `${width}×${height}`;
    ctx.font = `${Math.floor(height / 20)}px Arial, sans-serif`;
    ctx.fillText(dimensionsText, width / 2, height - Math.floor(height / 15));
    
    // Return data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating placeholder image:', error);
    // Fallback to a very simple data URL
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' fill='%23666666'%3E${width}×${height}%3C/text%3E%3C/svg%3E`;
  }
}; 