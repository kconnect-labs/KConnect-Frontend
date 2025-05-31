/**
 * Форматирует время воспроизведения в формат мм:сс
 * @param {number} seconds - время в секундах
 * @returns {string} отформатированное время в формате мм:сс
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};


export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  
  const date = new Date(dateString);
  
  
  const offset = new Date().getTimezoneOffset();
  
  
  date.setMinutes(date.getMinutes() - offset);
  
  
  return date.toLocaleString();
};


export const convertUTCToLocal = (utcDateString) => {
  if (!utcDateString) return null;
  
  
  const date = new Date(utcDateString);
  
  
  return date;
};


export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const now = new Date();
  const date = new Date(dateString);
  
  
  const diff = now - date;
  
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) {
    return 'только что';
  } else if (minutes < 60) {
    return `${minutes} ${getMinutesText(minutes)} назад`;
  } else if (hours < 24) {
    return `${hours} ${getHoursText(hours)} назад`;
  } else if (days < 7) {
    return `${days} ${getDaysText(days)} назад`;
  } else {
    return formatDate(dateString);
  }
};


function getMinutesText(minutes) {
  const lastDigit = minutes % 10;
  if (minutes >= 11 && minutes <= 14) return 'минут';
  if (lastDigit === 1) return 'минуту';
  if (lastDigit >= 2 && lastDigit <= 4) return 'минуты';
  return 'минут';
}

function getHoursText(hours) {
  const lastDigit = hours % 10;
  if (hours >= 11 && hours <= 14) return 'часов';
  if (lastDigit === 1) return 'час';
  if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
  return 'часов';
}

function getDaysText(days) {
  const lastDigit = days % 10;
  if (days >= 11 && days <= 14) return 'дней';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
} 