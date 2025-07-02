import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  useTheme
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import axios from 'axios';

// Глобальный флаг для отключения превью ссылок
export const DISABLE_LINK_PREVIEWS = false;

// Обновленная регулярка для URL - ищет только ссылки с http:// или https://
// Больше не будет ложных срабатываний на текст типа "as.34"
export const URL_REGEX = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

// Регулярка для @упоминаний пользователей - Safari-совместимая версия
export const USERNAME_MENTION_REGEX = /(^|[^a-zA-Z0-9_])@(\w+)/g;

// Регулярка для #хештегов (поддерживает латиницу и кириллицу) - Safari-совместимая версия
export const HASHTAG_REGEX = /(^|[^а-яА-Яa-zA-Z0-9_])#([а-яА-Яa-zA-Z0-9_]+)/g;

// Компонент предпросмотра ссылки, который можно использовать везде
export const LinkPreview = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
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

  if (error) {
    return null;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
        mt: 1,
        mb: 1,
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main + '08' : theme.palette.primary.main + '08',
        border: `1px solid ${theme.palette.primary.main}1A`,
        display: 'flex',
        flexDirection: { xs: 'row' },
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        height: '90px',
        '&:hover': {
          backgroundColor: theme.palette.primary.main + '18',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '3px',
          backgroundColor: theme.palette.primary.main,
          borderRadius: '2px',
        }
      }}
    >
      {loading ? (
        <Box sx={{ p: 1.5, width: '100%', display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="text" width="70%" sx={{ mb: 0.5 }} />
        </Box>
      ) : (
        <>
          {preview?.image && (
            <Box
              sx={{
                width: 90,
                height: 90,
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
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
          <Box sx={{ 
            p: 1.5, 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderLeft: preview?.image ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                margin: 0,
                fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
                fontWeight: 500,
                fontSize: '0.85rem',
                lineHeight: 1.57,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {(preview?.title || getDomainName(url)).length > 35 
                ? `${(preview?.title || getDomainName(url)).substring(0, 35)}...` 
                : (preview?.title || getDomainName(url))}
            </Typography>
            {preview?.description && (
              <Typography
                variant="caption"
                sx={{
                  margin: 0,
                  fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 0.5
                }}
              >
                {preview.description.length > 50 
                  ? `${preview.description.substring(0, 50)}...` 
                  : preview.description}
              </Typography>
            )}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: theme.palette.primary.main + '10',
              py: 0.25,
              px: 0.75,
              borderRadius: '4px',
              width: 'fit-content'
            }}>
              <LinkIcon fontSize="small" sx={{ color: theme.palette.primary.main, mr: 0.5, fontSize: '0.75rem' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  margin: 0,
                  fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  lineHeight: 1.57,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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


export const processTextWithLinks = (text, theme) => {
  if (!text) return null;
  const parts = [];
  const urls = new Set();
  let lastIndex = 0;
  let match;
  
  
  let processedText = text;
  let combinedMatches = [];
  
  
  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(text)) !== null) {
    combinedMatches.push({
      type: 'url',
      match: match[0],
      index: match.index,
      length: match[0].length
    });
  }
  
  
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
  
  
  combinedMatches.sort((a, b) => a.index - b.index);
  
  
  combinedMatches.forEach((item, i) => {
    
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
            textDecoration: 'none', 
            fontWeight: 'medium',
            wordBreak: 'break-word'
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
            fontWeight: 'medium'
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
            fontWeight: 'medium'
          }}
        >
          {item.match}
        </a>
      );
    }
    
    lastIndex = item.index + item.length;
  });
  
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return {
    parts,
    urls: Array.from(urls)
  };
};


export const linkRenderers = {
  p: ({ children }) => {
    const theme = useTheme();
    if (typeof children === 'string') {
      const { parts, urls } = processTextWithLinks(children, theme);
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
    if (Array.isArray(children) && children.some(child => {
      if (!child || typeof child !== 'object') return false;
      const type = child.type;
      return (
        type === 'h1' || type === 'h2' || type === 'h3' || type === 'h4' || type === 'h5' || type === 'h6' ||
        type === 'ul' || type === 'ol' || type === 'pre' || type === 'blockquote' || type === 'table'
      );
    })) {
      return <>{children}</>;
    }
    return <Typography component="p" variant="body1" sx={{ mb: 1 }}>{children}</Typography>;
  },
  
  a: ({ node, children, href }) => {
    const theme = useTheme();
    if (href.startsWith('/profile/')) {
      const username = href.substring('/profile/'.length);
      return (
        <a 
          href={href} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            window.location.href = href;
          }}
          style={{ 
            color: theme ? theme.palette.primary.main : '#7B68EE',
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
    
    
    if (href.includes('search?q=') && href.includes('type=posts')) {
      
      return (
        <a 
          href={href}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            window.location.href = href;
          }}
          style={{ 
            color: theme ? theme.palette.primary.main : '#7B68EE',
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
            color: theme ? theme.palette.primary.main : '#9E77ED',
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
  const theme = useTheme();
  const { parts, urls } = processTextWithLinks(text, theme);
  
  return (
    <>
      <Typography component="p" variant="body1" sx={{ mb: 1 }}>
        {parts}
      </Typography>
      
      {!DISABLE_LINK_PREVIEWS && urls.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <LinkPreview url={urls[0]} />
        </Box>
      )}
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