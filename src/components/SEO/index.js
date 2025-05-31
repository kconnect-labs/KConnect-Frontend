import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

// Базовый URL для абсолютных ссылок (используется для всех изображений и URL)
const BASE_URL = 'https://k-connect.ru';

/**
 * SEO компонент для управления метатегами и ссылочными превью
 * Оптимизировано для работы с предпросмотрами в мессенджерах и социальных сетях
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
  url = typeof window !== 'undefined' ? window.location.href : 'https://k-connect.ru',
  type = 'website',
  meta = {},
}) => {
  
  // Подготовка абсолютного URL для текущей страницы
  const pageUrl = url.startsWith('http') 
    ? url 
    : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  
  // Подготовка абсолютного URL для изображения
  const getAbsoluteImageUrl = (imagePath) => {
    if (!imagePath) return `${BASE_URL}/icon-512.png`;
    if (imagePath.startsWith('http') || imagePath.startsWith('//')) return imagePath;
    
    // Очищаем от двойных слешей
    let cleanPath = imagePath;
    
    if (imagePath.includes('//')) {
      const parts = imagePath.split('//');
      cleanPath = parts[parts.length - 1];
      if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    }
    
    // Добавляем правильный префикс
    return `${BASE_URL}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  const absoluteImageUrl = getAbsoluteImageUrl(image);

  return (
    <Helmet 
      prioritizeSeoTags 
      encodeSpecialCharacters={false}
      // Важно добавить defer={false} чтобы теги добавлялись сразу
      defer={false}
    >
      {/* Основные метатеги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Индексация поисковиками */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="google" content="notranslate" />
      {meta.googleVerification && <meta name="google-site-verification" content={meta.googleVerification} />}
      {meta.yandexVerification && <meta name="yandex-verification" content={meta.yandexVerification} />}
      
      {/* OpenGraph теги - для Facebook, VK и Telegram */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="К-Коннект" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Дополнительные теги для изображений */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      
      {/* Twitter Card теги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      
      {/* Дополнительные метатеги */}
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      {meta.author && <meta name="author" content={meta.author} />}
      {meta.viewport && <meta name="viewport" content={meta.viewport || "width=device-width, initial-scale=1, maximum-scale=5"} />}
      
      {/* Специальные теги для статей */}
      {type === 'article' && meta.publishedTime && (
        <meta property="article:published_time" content={meta.publishedTime} />
      )}
      {type === 'article' && meta.author && (
        <meta property="article:author" content={meta.author} />
      )}
      
      {/* Schema.org JSON-LD - структурированные данные для Google */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": absoluteImageUrl,
            "author": meta.author || "К-Коннект",
            "datePublished": meta.publishedTime || new Date().toISOString(),
            "url": pageUrl
          })}
        </script>
      )}
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