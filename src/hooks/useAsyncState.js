import { useState, useCallback, useEffect, useTransition, useDeferredValue } from 'react';
/**
 * Хук для оптимизированного управления асинхронными состояниями с использованием React 18
 * - Использует useTransition для улучшения отзывчивости UI
 * - Использует useDeferredValue для снижения нагрузки при частых обновлениях
 * 
 * @param {Function} asyncFunction - Асинхронная функция, которая должна выполниться
 * @param {Array} dependencies - Зависимости для повторного запуска (как в useEffect)
 * @param {*} initialData - Начальное значение data
 * @returns {Object} { data, error, loading, isPending, execute }
 */
export default function useAsyncState(asyncFunction, dependencies = [], initialData = null) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deferredData = useDeferredValue(data);
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      startTransition(() => {
        setData(result);
      });
      return result;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);
  useEffect(() => {
    execute().catch(error => {
      console.error('Error in useAsyncState:', error);
    });
  }, dependencies); 
  return { 
    data: deferredData, 
    error, 
    loading, 
    isPending, 
    execute 
  };
}
/**
 * Хук для оптимизированной задержки выполнения функции при изменении значения
 * Полезен для реализации поиска при вводе, чтобы не выполнять запросы на каждый символ
 * 
 * @param {Function} callback - Функция для выполнения после задержки
 * @param {number} delay - Задержка в миллисекундах
 * @returns {Function} - Функция для запуска с задержкой
 */
export function useDebounceWithTransition(callback, delay = 300) {
  const [isPending, startTransition] = useTransition();
  const debouncedFn = useCallback(
    (...args) => {
      const timeoutId = setTimeout(() => {
        startTransition(() => {
          callback(...args);
        });
      }, delay);
      return () => clearTimeout(timeoutId);
    },
    [callback, delay, startTransition]
  );
  return { 
    debouncedFn, 
    isPending 
  };
} 