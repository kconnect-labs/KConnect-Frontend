/**
 * Сервис для управления данными об обновлениях системы
 */


const updates = [
  {
    version: "2.7",
    date: "13.05.2025",
    title: "Обновление 2.7",
    updates: [
      "Добавлен мессенджер",
      "Добавлены плейлисты",
      "Модальные окна для плейлистов",
      "Очередь плейлистов покругу",
      "Новый вид профиля",
      "Репосты"
      
    ],
    fixes: [
      "Прогрузка плейлистов",
      "Работа с плейлистами в мобильной версии",
      "Обновление системы Аукциона юзернеймов",
    ]
  },{
    version: "2.6",
    date: "08.05.2025",
    title: "Обновление 2.6",
    updates: [
      "Начало улучшений Бэкэнда",
      "Сессии длятся 30 дней",
      "Добавлены друзья",
      "Статусы для каналов",
      "Новый Плеер Музыки",
      "Карточки музыкантов"

    ],
    fixes: [
      "Ошибки при нагрузке на сервер",
      "Выкидывание из аккаунтов",
      "Исправлен аукцион",
      "Исправлены ошибки в плеере"
    ]
  },
  {
    version: "2.5",
    date: "05.05.2025",
    title: "Обновление 2.5",
    updates: [
      "Синхронизация между вкладками с использованием BroadcastChannel API",
      "Улучшенная производительность и отзывчивость интерфейса",
      "Добавлен аукцион юзернеймов",
      "Улучшен просмотр изображений",
      "История владения юзернеймами",
      "История транзакций по играм",
      "Блекджек"
    ],
    fixes: [
      "Исправлена ошибка с множественными запросами к серверу",
      "Устранены проблемы с отображением в мобильных браузерах",
      "Исправлена синхронизация данных при использовании нескольких устройств"
    ]
  },
  {
    version: "2.4",
    date: "01.04.2025",
    title: "Обновление 2.0 - 2.4",
    updates: [
      "Полный перенос на React",
      "Улучшенная производительность и отзывчивость интерфейса",
      "Переписан полностью бэкенд на работу с React",
      "Добавлены новые мини-игры",
      "Баланс, переводы, оплаты",
      "Магазин Бейджиков",
      "Планы подписок",

    ],
    fixes: [
      "Исправлены ошибки в бекенде",
      "Добавлена защита от спама запросов",
      "Добавлена документация по API (устаревшая на момент 08.05.2025)", 
      "Множество исправлений о которых уже не возможно вспомнить"
    ]
  }
];


const UpdateService = {
  /**
   * Получение последнего обновления
   * @returns {Object} Данные о последнем обновлении
   */
  getLatestUpdate: () => {
    return updates[0];
  },

  /**
   * Получение всех обновлений
   * @returns {Array} Массив с данными обо всех обновлениях
   */
  getAllUpdates: () => {
    return updates;
  },

  /**
   * Получение обновления по версии
   * @param {string} version - Версия обновления
   * @returns {Object|null} Данные об обновлении или null, если не найдено
   */
  getUpdateByVersion: (version) => {
    return updates.find(update => update.version === version) || null;
  },

  /**
   * Получение обновлений за определенный период
   * @param {number} count - Количество последних обновлений
   * @returns {Array} Массив с данными о последних обновлениях
   */
  getRecentUpdates: (count = 3) => {
    return updates.slice(0, count);
  }
};

export default UpdateService; 