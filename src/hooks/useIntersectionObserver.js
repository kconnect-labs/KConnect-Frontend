import { useEffect, useRef } from 'react';

/**
 * Хук для обнаружения пересечения элемента с областью видимости
 * Используется для бесконечной прокрутки и подгрузки контента
 */
const useIntersectionObserver = ({
  target, // ref элемента, который нужно отслеживать
  onIntersect, // callback, который вызывается при пересечении
  threshold = 0.1, // порог видимости (0-1)
  rootMargin = '0px', // отступы от root элемента
  enabled = true, // включен ли observer
  debounceTime = 300  // Добавляем параметр для дебаунса
}) => {
  // Сохраняем таймер дебаунса
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!enabled || !target.current) {
      return;
    }
    
    // Функция-обработчик с дебаунсом
    const handleIntersect = (entries) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        // Очищаем существующий таймер если есть
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        
        // Устанавливаем новый таймер
        debounceRef.current = setTimeout(() => {
          onIntersect();
          debounceRef.current = null;
        }, debounceTime);
      }
    };
    
    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });
    
    observer.observe(target.current);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      observer.disconnect();
    };
  }, [target, enabled, threshold, rootMargin, onIntersect, debounceTime]);
};

export default useIntersectionObserver; 