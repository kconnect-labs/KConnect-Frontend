import { useNavigate } from 'react-router-dom';
/**
 * Проверяет, авторизован ли пользователь, и если нет - перенаправляет на страницу логина
 * 
 * @param {Object} user - Объект пользователя из AuthContext
 * @param {boolean} isAuthenticated - Флаг авторизации из AuthContext
 * @param {Function} navigate - Функция для навигации (из useNavigate)
 * @returns {boolean} - true, если пользователь авторизован, false - если нет
 */
export const requireAuth = (user, isAuthenticated, navigate) => {
  if (!isAuthenticated || !user) {
    const currentPath = window.location.pathname;
    localStorage.setItem('redirect_after_login', currentPath);
    navigate('/login', { state: { from: currentPath } });
    return false;
  }
  return true;
};
/**
 * Хук для проверки авторизации с возможностью перенаправления
 * 
 * @param {Object} user - Объект пользователя из AuthContext
 * @param {boolean} isAuthenticated - Флаг авторизации из AuthContext
 * @returns {Function} - Функция для проверки авторизации и перенаправления
 */
export const useAuthCheck = (user, isAuthenticated) => {
  const navigate = useNavigate();
  return () => requireAuth(user, isAuthenticated, navigate);
};
export default {
  requireAuth,
  useAuthCheck
}; 