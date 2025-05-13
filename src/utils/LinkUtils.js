import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Skeleton
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import axios from 'axios';

// Глобальный флаг для отключения превью ссылок
export const DISABLE_LINK_PREVIEWS = false;

// Супер-универсальное регулярное выражение для поиска URL
// Находит:
// - URL с http/https и без них
// - URL с www и без
// - Международные доменные имена
// - URL с параметрами запроса и фрагментами
// - URL с номерами портов
// - URL с разными доменами верхнего уровня
// - URL со спецсимволами
export const URL_REGEX = /\b((?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)|(?:www\.)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?::\d{1,5})?(?:[/?#]\S*)?|(?:@)?\b(?:donationalerts\.[a-zA-Z]{2,6})\/\S+\b)/gi;

// Регулярка для @упоминаний пользователей
export const USERNAME_MENTION_REGEX = /(?<!\w)@(\w+)/g;

// Регулярка для #хештегов (поддерживает латиницу и кириллицу)
export const HASHTAG_REGEX = /(?<![а-яА-Яa-zA-Z0-9_])#([а-яА-Яa-zA-Z0-9_]+)/g;

// Компонент предпросмотра ссылки, который можно использовать везде
export const LinkPreview = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        // Запрос на получение метаданных ссылки
        const response = await axios.post('/api/utils/link-preview', { url });
        if (response.data) {
          setPreview(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  // Не показываем ничего при ошибке
  if (error) {
    return null;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to extract the domain name
  const getDomainName = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  return (
    <Paper
      elevation={0}
      onClick={handleClick}
      sx={{
        mt: 2,
        mb: 2,
        overflow: 'hidden',
        borderRadius: '12px',
        backgroundColor: 'rgba(140, 82, 255, 0.03)',
        border: '1px solid rgba(140, 82, 255, 0.1)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'rgba(140, 82, 255, 0.06)',
          transform: 'translateY(-3px) scale(1.01)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '4px',
          backgroundColor: '#9E77ED',
          borderRadius: '2px',
        }
      }}
    >
      {loading ? (
        <Box sx={{ p: 2, width: '100%' }}>
          <Skeleton variant="text" width="70%" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" />
        </Box>
      ) : (
        <>
          {preview?.image && (
            <Box
              sx={{
                width: { xs: '100%', sm: 200 },
                height: { xs: 140, sm: 'auto' },
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src={preview.image}
                alt={preview.title || "Ссылка"}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
          <Box sx={{ 
            p: 2, 
            flex: 1,
            borderLeft: preview?.image ? { xs: 'none', sm: '1px solid rgba(255, 255, 255, 0.08)' } : 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="medium" 
              noWrap
              sx={{ 
                color: '#f0f0f0',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {preview?.title || getDomainName(url)}
            </Typography>
            {preview?.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontSize: '0.8rem',
                  opacity: 0.8,
                  lineHeight: 1.4
                }}
              >
                {preview.description}
              </Typography>
            )}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              py: 0.5,
              px: 1,
              borderRadius: '4px',
              width: 'fit-content'
            }}>
              <LinkIcon fontSize="small" sx={{ color: '#9E77ED', mr: 1, fontSize: '0.875rem' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 'medium',
                  fontSize: '0.75rem'
                }} 
                noWrap
              >
                {getDomainName(url)}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

// Функция для обработки текста с ссылками
export const processTextWithLinks = (text) => {
  if (!text) return null;
  
  const parts = [];
  const urls = new Set();
  let lastIndex = 0;
  let match;
  
  // Prepare combined text for processing
  let processedText = text;
  let combinedMatches = [];
  
  // Find all URL matches
  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(text)) !== null) {
    combinedMatches.push({
      type: 'url',
      match: match[0],
      index: match.index,
      length: match[0].length
    });
  }
  
  // Find all @username mentions
  USERNAME_MENTION_REGEX.lastIndex = 0;
  while ((match = USERNAME_MENTION_REGEX.exec(text)) !== null) {
    combinedMatches.push({
      type: 'mention',
      match: match[0],
      username: match[1],
      index: match.index,
      length: match[0].length
    });
  }
  
  // Find all #hashtag matches
  HASHTAG_REGEX.lastIndex = 0;
  while ((match = HASHTAG_REGEX.exec(text)) !== null) {
    combinedMatches.push({
      type: 'hashtag',
      match: match[0],
      hashtag: match[1],
      index: match.index,
      length: match[0].length
    });
  }
  
  // Sort all matches by their position in the text
  combinedMatches.sort((a, b) => a.index - b.index);
  
  // Convert the matches into React elements
  combinedMatches.forEach((item, i) => {
    // Add any text before this match
    if (item.index > lastIndex) {
      parts.push(text.substring(lastIndex, item.index));
    }
    
    if (item.type === 'url') {
      const url = item.match;
      
      // Add URL to the set of URLs for preview
      urls.add(url);
      
      // Create a clickable link
      parts.push(
        <a 
          key={`url-${i}`}
          href={url.startsWith('http') ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            color: '#9E77ED', 
            textDecoration: 'none', 
            fontWeight: 'medium',
            wordBreak: 'break-word'
          }}
        >
          {url}
        </a>
      );
    } else if (item.type === 'mention') {
      // Create a clickable mention
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
            color: '#9E77ED', 
            textDecoration: 'none',
            fontWeight: 'medium'
          }}
        >
          {item.match}
        </a>
      );
    } else if (item.type === 'hashtag') {
      // Create a clickable hashtag with full domain
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
            color: '#9E77ED', 
            textDecoration: 'none',
            fontWeight: 'medium'
          }}
        >
          {item.match}
        </a>
      );
    }
    
    lastIndex = item.index + item.length;
  });
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return {
    parts,
    urls: Array.from(urls)
  };
};

// Custom renderer для ReactMarkdown
export const linkRenderers = {
  p: ({ children }) => {
    if (typeof children === 'string') {
      // Process text content to detect and convert URLs and @mentions
      const { parts, urls } = processTextWithLinks(children);
      
      return (
        <>
          <Typography component="p" variant="body1" sx={{ mb: 1 }}>
            {parts}
          </Typography>
          
          
          {urls.length > 0 && !DISABLE_LINK_PREVIEWS && urls.map((url, index) => (
            <LinkPreview key={`preview-${index}`} url={url} />
          ))}
        </>
      );
    }
    
    return <Typography component="p" variant="body1" sx={{ mb: 1 }}>{children}</Typography>;
  },
  // Add a custom renderer for links to make them more prominent
  a: ({ node, children, href }) => {
    // Check if this is a username mention link (starts with /profile/)
    if (href.startsWith('/profile/')) {
      const username = href.substring('/profile/'.length);
      return (
        <a 
          href={href} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Navigate to the profile page
            window.location.href = href;
          }}
          style={{ 
            color: '#7B68EE', 
            fontWeight: 'bold',
            textDecoration: 'none',
            background: 'rgba(123, 104, 238, 0.08)',
            padding: '0 4px',
            borderRadius: '4px'
          }}
        >
          {children}
        </a>
      );
    }
    
    // Check if this is a hashtag search link (contains search?q=)
    if (href.includes('search?q=') && href.includes('type=posts')) {
      // Handle hashtag links
      return (
        <a 
          href={href}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Use the full URL for navigation
            window.location.href = href;
          }}
          style={{ 
            color: '#7B68EE', 
            fontWeight: 'bold',
            textDecoration: 'none',
            background: 'rgba(123, 104, 238, 0.08)',
            padding: '0 4px',
            borderRadius: '4px'
          }}
        >
          {children}
        </a>
      );
    }

    const enhancedHref = href.startsWith('http') ? href : `https://${href}`;
    
    return (
      <>
        <a 
          href={enhancedHref} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(enhancedHref, '_blank');
          }}
          style={{ 
            color: '#9E77ED', 
            fontWeight: 'bold',
            textDecoration: 'underline', 
            wordBreak: 'break-all'
          }}
        >
          {children}
        </a>
        
        {!DISABLE_LINK_PREVIEWS && <LinkPreview url={enhancedHref} />}
      </>
    );
  }
};

// Компонент для отображения текста с ссылками - для использования везде, где не используется ReactMarkdown
export const TextWithLinks = ({ text }) => {
  const { parts, urls } = processTextWithLinks(text);
  
  return (
    <>
      <Typography component="p" variant="body1" sx={{ mb: 1 }}>
        {parts}
      </Typography>
      
      {!DISABLE_LINK_PREVIEWS && urls.length > 0 && urls.slice(0, 1).map((url, index) => (
        <LinkPreview key={`preview-${index}`} url={url} />
      ))}
    </>
  );
};

export default {
  URL_REGEX,
  LinkPreview,
  processTextWithLinks,
  linkRenderers,
  TextWithLinks
}; 