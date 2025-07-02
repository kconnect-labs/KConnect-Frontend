/**
 * Сервис для оптимизированной загрузки изображений инвентаря
 */

class InventoryImageService {
  constructor() {
    this.imageCache = new Map();
    this.pendingRequests = new Map();
    this.batchQueue = [];
    this.batchTimeout = null;
    this.batchDelay = 100; // Задержка для батчинга запросов
    this.maxBatchSize = 100; // Максимальный размер батча
  }

  /**
   * Получить URL изображения предмета по ID
   * @param {number} itemId - ID предмета
   * @returns {string} URL изображения
   */
  getItemImageUrl(itemId) {
    return `/inventory/${itemId}`;
  }

  /**
   * Получить URL изображения предмета из пака
   * @param {number} packId - ID пака
   * @param {string} itemName - Название предмета
   * @returns {string} URL изображения
   */
  getPackItemImageUrl(packId, itemName) {
    return `/inventory/pack/${packId}/${itemName}`;
  }

  /**
   * Разбить массив на батчи
   * @param {Array} items - Массив элементов
   * @param {number} batchSize - Размер батча
   * @returns {Array} Массив батчей
   */
  splitIntoBatches(items, batchSize = this.maxBatchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Проверить существование изображений в батче
   * @param {Array} items - Массив объектов с item_id или pack_id + item_name
   * @returns {Promise<Array>} Результаты проверки
   */
  async checkImagesBatch(items) {
    if (!items || items.length === 0) {
      return [];
    }

    // Проверяем кеш для каждого элемента
    const uncachedItems = [];
    const results = [];

    for (const item of items) {
      const cacheKey = this.getCacheKey(item);
      if (this.imageCache.has(cacheKey)) {
        results.push(this.imageCache.get(cacheKey));
      } else {
        uncachedItems.push(item);
      }
    }

    // Если все элементы в кеше, возвращаем результат
    if (uncachedItems.length === 0) {
      return results;
    }

    // Разбиваем на батчи если нужно
    const batches = this.splitIntoBatches(uncachedItems);
    const allBatchResults = [];

    // Обрабатываем каждый батч
    for (const batch of batches) {
      try {
        const response = await fetch('/api/inventory/images/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: batch }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`Batch request failed: ${errorData.message || response.statusText}`);
          
          // Добавляем fallback результаты для этого батча
          const fallbackResults = batch.map(item => ({
            ...item,
            exists: false,
            url: this.getUrlFromItem(item)
          }));
          allBatchResults.push(...fallbackResults);
          continue;
        }

        const data = await response.json();
        
        if (data.success) {
          // Кешируем результаты
          for (const imageInfo of data.images) {
            const cacheKey = this.getCacheKey(imageInfo);
            this.imageCache.set(cacheKey, imageInfo);
            allBatchResults.push(imageInfo);
          }
        } else {
          console.warn('Batch request returned error:', data.message);
          // Добавляем fallback результаты
          const fallbackResults = batch.map(item => ({
            ...item,
            exists: false,
            url: this.getUrlFromItem(item)
          }));
          allBatchResults.push(...fallbackResults);
        }
      } catch (error) {
        console.error('Error checking images batch:', error);
        // Добавляем fallback результаты для этого батча
        const fallbackResults = batch.map(item => ({
          ...item,
          exists: false,
          url: this.getUrlFromItem(item)
        }));
        allBatchResults.push(...fallbackResults);
      }
    }

    // Объединяем результаты из кеша и новых запросов
    return [...results, ...allBatchResults];
  }

  /**
   * Получить ключ кеша для элемента
   * @param {Object} item - Элемент с item_id или pack_id + item_name
   * @returns {string} Ключ кеша
   */
  getCacheKey(item) {
    if (item.item_id) {
      return `item_${item.item_id}`;
    } else if (item.pack_id && item.item_name) {
      return `pack_${item.pack_id}_${item.item_name}`;
    }
    return null;
  }

  /**
   * Получить URL из элемента
   * @param {Object} item - Элемент с item_id или pack_id + item_name
   * @returns {string} URL
   */
  getUrlFromItem(item) {
    if (item.item_id) {
      return this.getItemImageUrl(item.item_id);
    } else if (item.pack_id && item.item_name) {
      return this.getPackItemImageUrl(item.pack_id, item.item_name);
    }
    return null;
  }

  /**
   * Предзагрузить изображения для списка предметов
   * @param {Array} items - Массив предметов из инвентаря
   * @returns {Promise<void>}
   */
  async preloadInventoryImages(items) {
    if (!items || items.length === 0) {
      return;
    }

    const batchItems = items.map(item => ({
      item_id: item.id
    }));

    await this.checkImagesBatch(batchItems);
  }

  /**
   * Предзагрузить изображения для содержимого пака
   * @param {Array} contents - Массив содержимого пака
   * @param {number} packId - ID пака
   * @returns {Promise<void>}
   */
  async preloadPackImages(contents, packId) {
    if (!contents || contents.length === 0 || !packId) {
      return;
    }

    const batchItems = contents.map(content => ({
      pack_id: packId,
      item_name: content.item_name
    }));

    await this.checkImagesBatch(batchItems);
  }

  /**
   * Очистить кеш изображений
   */
  clearCache() {
    this.imageCache.clear();
  }

  /**
   * Получить статистику кеша
   * @returns {Object} Статистика кеша
   */
  getCacheStats() {
    return {
      size: this.imageCache.size,
      keys: Array.from(this.imageCache.keys()),
      maxBatchSize: this.maxBatchSize
    };
  }
}

// Создаем единственный экземпляр сервиса
const inventoryImageService = new InventoryImageService();

export default inventoryImageService; 