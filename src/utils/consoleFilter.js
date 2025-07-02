/**
 * Утилита для фильтрации ошибок консоли
 * Скрывает ошибки Яндекс.Метрики и других внешних сервисов
 */

class ConsoleFilter {
  constructor() {
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
    this.filteredPatterns = [
      // Яндекс.Метрика
      /mc\.yandex\.ru/,
      /yandex\.ru/,
      /Access to fetch at.*mc\.yandex\.ru/,
      /CORS policy.*mc\.yandex\.ru/,
      /Request header field.*is not allowed by Access-Control-Allow-Headers/,
      
      // Google Analytics
      /googletagmanager\.com/,
      /google-analytics\.com/,
      /analytics\.google\.com/,
      
      // Facebook Pixel
      /connect\.facebook\.net/,
      /facebook\.com/,
      
      // VK
      /vk\.com/,
      /vk\.ru/,
      
      // Telegram
      /telegram\.org/,
      /t\.me/,
      
      // Общие CORS ошибки для внешних доменов
      /Access to fetch at.*has been blocked by CORS policy/,
      /Failed to fetch/,
      /net::ERR_FAILED/,
      
      // Другие внешние сервисы
      /doubleclick\.net/,
      /googlesyndication\.com/,
      /googleadservices\.com/,
      /amazon-adsystem\.com/,
      /bing\.com/,
      /baidu\.com/,
      /yandex\.com/,
    ];
    
    this.init();
  }

  /**
   * Инициализация фильтра
   */
  init() {
    // Переопределяем console.error
    console.error = (...args) => {
      const message = args.join(' ');
      if (!this.shouldFilter(message)) {
        this.originalConsoleError.apply(console, args);
      }
    };

    // Переопределяем console.warn
    console.warn = (...args) => {
      const message = args.join(' ');
      if (!this.shouldFilter(message)) {
        this.originalConsoleWarn.apply(console, args);
      }
    };

    // Перехватываем необработанные ошибки
    window.addEventListener('error', (event) => {
      if (this.shouldFilter(event.message)) {
        event.preventDefault();
        return false;
      }
    });

    // Перехватываем необработанные промисы
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.message || event.reason?.toString() || '';
      if (this.shouldFilter(message)) {
        event.preventDefault();
        return false;
      }
    });
  }

  /**
   * Проверяет, нужно ли фильтровать сообщение
   * @param {string} message - Сообщение для проверки
   * @returns {boolean} - Нужно ли фильтровать
   */
  shouldFilter(message) {
    return this.filteredPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Добавляет новый паттерн для фильтрации
   * @param {RegExp|string} pattern - Паттерн для фильтрации
   */
  addFilter(pattern) {
    if (typeof pattern === 'string') {
      pattern = new RegExp(pattern, 'i');
    }
    this.filteredPatterns.push(pattern);
  }

  /**
   * Удаляет паттерн из фильтрации
   * @param {RegExp|string} pattern - Паттерн для удаления
   */
  removeFilter(pattern) {
    if (typeof pattern === 'string') {
      pattern = new RegExp(pattern, 'i');
    }
    this.filteredPatterns = this.filteredPatterns.filter(p => p.toString() !== pattern.toString());
  }

  /**
   * Восстанавливает оригинальные методы консоли
   */
  restore() {
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
  }

  /**
   * Получает список активных фильтров
   * @returns {Array} - Список паттернов
   */
  getFilters() {
    return this.filteredPatterns.map(p => p.toString());
  }

  /**
   * Очищает все фильтры
   */
  clearFilters() {
    this.filteredPatterns = [];
  }
}

// Создаем глобальный экземпляр
const consoleFilter = new ConsoleFilter();

// Экспортируем для использования в других модулях
export default consoleFilter;

// Также делаем доступным глобально для отладки
if (typeof window !== 'undefined') {
  window.consoleFilter = consoleFilter;
} 