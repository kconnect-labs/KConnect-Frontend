import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Компонент SEO для управления метатегами и предпросмотром контента
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок страницы
 * @param {string} props.description - Описание страницы
 * @param {string} props.image - URL изображения для предпросмотра
 * @param {string} props.url - URL страницы
 * @param {string} props.type - Тип контента (article, profile, website и т.д.)
 * @param {Object} props.meta - Дополнительные мета-теги
 */
const SEO = ({
  title = 'К-Коннект',
  description = 'К-Коннект - социальная сеть от независимого разработчика',
  image = '/icon-512.png',
  url = window.location.href,
  type = 'website',
  meta = {},
}) => {
  
  // Normalize image path to remove duplications
  const normalizeImagePath = (path) => {
    if (!path) return '/icon-512.png';
    
    // Check if it's already a full URL
    if (path.startsWith('http') || path.startsWith('//')) {
      return path;
    }
    
    // Fix duplicate paths - look for patterns like /static/uploads/posts//static/uploads/
    if (path.includes('//')) {
      // Find the second occurrence of /static/ or /uploads/ after a double slash
      const doubleSlashPos = path.indexOf('//');
      if (doubleSlashPos !== -1) {
        const afterDoubleSlash = path.substring(doubleSlashPos + 2);
        if (afterDoubleSlash.startsWith('static/') || afterDoubleSlash.startsWith('uploads/')) {
          // Keep only what's after the double slash
          return '/' + afterDoubleSlash;
        }
      }
    }
    
    // Handle paths that already start with /static/ or /uploads/
    if (path.startsWith('/static/') || path.startsWith('/uploads/')) {
      return path;
    }
    
    // Add origin for relative paths
    return `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const imageUrl = normalizeImagePath(image);

  return (
    <Helmet>
      
      <title>{title}</title>
      <meta name="description" content={description} />
      
      
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="google" content="notranslate" />
      <meta name="google-site-verification" content={meta.googleVerification || ''} />
      <meta name="yandex-verification" content={meta.yandexVerification || ''} />
      
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="К-Коннект" />
      <meta property="og:locale" content="ru_RU" />
      
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      
      {meta.author && <meta name="author" content={meta.author} />}
      {meta.canonical && <link rel="canonical" href={meta.canonical} />}
      
      
      {type === 'profile' && meta.firstName && (
        <meta property="profile:first_name" content={meta.firstName} />
      )}
      {type === 'profile' && meta.lastName && (
        <meta property="profile:last_name" content={meta.lastName} />
      )}
      {type === 'profile' && meta.username && (
        <meta property="profile:username" content={meta.username} />
      )}
      
      
      {type === 'article' && meta.publishedTime && (
        <meta property="article:published_time" content={meta.publishedTime} />
      )}
      {type === 'article' && meta.modifiedTime && (
        <meta property="article:modified_time" content={meta.modifiedTime} />
      )}
      {type === 'article' && meta.author && (
        <meta property="article:author" content={meta.author} />
      )}
      {type === 'article' && meta.section && (
        <meta property="article:section" content={meta.section} />
      )}
      {type === 'article' && meta.tags && (
        <meta property="article:tag" content={meta.tags} />
      )}
      
      
      {type === 'music' && meta.song && (
        <meta property="music:song" content={meta.song} />
      )}
      {type === 'music' && meta.artist && (
        <meta property="music:musician" content={meta.artist} />
      )}
      {type === 'music' && meta.album && (
        <meta property="music:album" content={meta.album} />
      )}
      
      
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      {meta.viewport && <meta name="viewport" content={meta.viewport} />}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
};

export default SEO; 