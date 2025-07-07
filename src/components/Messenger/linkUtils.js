import React from 'react';
import { useTheme } from '@mui/material';
import LinkPreview from './LinkPreview';

// Регулярные выражения для поиска ссылок
export const URL_REGEX = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
export const USERNAME_MENTION_REGEX = /(^|[^a-zA-Z0-9_])@(\w+)/g;
export const HASHTAG_REGEX = /(^|[^а-яА-Яa-zA-Z0-9_])#([а-яА-Яa-zA-Z0-9_]+)/g;

/**
 * Обрабатывает текст и находит в нем ссылки, упоминания и хештеги
 * @param {string} text - исходный текст
 * @param {object} theme - тема MUI
 * @returns {object} - объект с обработанными частями текста и найденными URL
 */
export const processTextWithLinks = (text, theme) => {
  if (!text) return { parts: [], urls: [] };
  
  const parts = [];
  const urls = new Set();
  let lastIndex = 0;
  let match;
  
  let combinedMatches = [];
  
  // Поиск URL
  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(text)) !== null) {
    combinedMatches.push({
      type: 'url',
      match: match[0],
      index: match.index,
      length: match[0].length
    });
  }
  
  // Поиск упоминаний пользователей
  USERNAME_MENTION_REGEX.lastIndex = 0;
  while ((match = USERNAME_MENTION_REGEX.exec(text)) !== null) {
    const prefix = match[1];
    const username = match[2];
    const fullMatch = match[0];
    
    const adjustedIndex = prefix ? match.index + prefix.length : match.index;
    const adjustedMatch = prefix ? fullMatch.substring(prefix.length) : fullMatch;
    
    combinedMatches.push({
      type: 'mention',
      match: adjustedMatch,
      username: username,
      index: adjustedIndex,
      length: adjustedMatch.length
    });
  }
  
  // Поиск хештегов
  HASHTAG_REGEX.lastIndex = 0;
  while ((match = HASHTAG_REGEX.exec(text)) !== null) {
    const prefix = match[1];
    const hashtag = match[2];
    const fullMatch = match[0];
    
    const adjustedIndex = prefix ? match.index + prefix.length : match.index;
    const adjustedMatch = prefix ? fullMatch.substring(prefix.length) : fullMatch;
    
    combinedMatches.push({
      type: 'hashtag',
      match: adjustedMatch,
      hashtag: hashtag,
      index: adjustedIndex,
      length: adjustedMatch.length
    });
  }
  
  // Сортируем по позиции в тексте
  combinedMatches.sort((a, b) => a.index - b.index);
  
  // Формируем части текста
  combinedMatches.forEach((item, i) => {
    // Добавляем обычный текст перед найденным элементом
    if (item.index > lastIndex) {
      parts.push(text.substring(lastIndex, item.index));
    }
    
    if (item.type === 'url') {
      const url = item.match;
      urls.add(url);
      parts.push(
        <a 
          key={`url-${i}`}
          href={url.startsWith('http') ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            color: theme ? theme.palette.primary.main : '#9E77ED',
            textDecoration: 'underline', 
            fontWeight: 500,
            wordBreak: 'normal',
            overflowWrap: 'break-word'
          }}
        >
          {url}
        </a>
      );
    } else if (item.type === 'mention') {
      parts.push(
        <a 
          key={`mention-${i}`}
          href={`/profile/${item.username}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/profile/${item.username}`;
          }}
          style={{ 
            color: theme ? theme.palette.primary.main : '#9E77ED',
            textDecoration: 'none',
            fontWeight: 500,
            backgroundColor: 'rgba(158, 119, 237, 0.15)',
            padding: '1px 4px',
            borderRadius: '4px',
            wordBreak: 'normal'
          }}
        >
          {item.match}
        </a>
      );
    } else if (item.type === 'hashtag') {
      parts.push(
        <a 
          key={`hashtag-${i}`}
          href={`https://k-connect.ru/search?q=${encodeURIComponent(item.hashtag)}&type=posts`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `https://k-connect.ru/search?q=${encodeURIComponent(item.hashtag)}&type=posts`;
          }}
          style={{ 
            color: theme ? theme.palette.primary.main : '#9E77ED',
            textDecoration: 'none',
            fontWeight: 500,
            backgroundColor: 'rgba(158, 119, 237, 0.15)',
            padding: '1px 4px',
            borderRadius: '4px',
            wordBreak: 'normal'
          }}
        >
          {item.match}
        </a>
      );
    }
    
    lastIndex = item.index + item.length;
  });
  
  // Добавляем оставшийся текст
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return {
    parts,
    urls: Array.from(urls)
  };
};

/**
 * Компонент для отображения текста с ссылками и их превью
 * @param {string} text - текст сообщения
 * @param {boolean} isCurrentUser - является ли отправителем текущий пользователь
 * @returns {JSX.Element}
 */
export const TextWithLinks = ({ text, isCurrentUser = false }) => {
  const theme = useTheme();
  const { parts, urls } = processTextWithLinks(text, theme);
  
  return (
    <>
      {/* Отображаем обработанный текст */}
      <span style={{ 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'normal',
        overflowWrap: 'break-word'
      }}>
        {parts}
      </span>
      
      {/* Отображаем превью для первой найденной ссылки */}
      {urls.length > 0 && (
        <LinkPreview url={urls[0]} isCurrentUser={isCurrentUser} />
      )}
    </>
  );
};

export default {
  URL_REGEX,
  processTextWithLinks,
  TextWithLinks,
  LinkPreview
}; 