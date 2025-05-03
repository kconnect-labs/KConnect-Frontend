import { useNavigate } from 'react-router-dom';

export const requireAuth = (user, isAuthenticated, navigate) => {
  if (!isAuthenticated || !user) {
    const currentPath = window.location.pathname;
    localStorage.setItem('redirect_after_login', currentPath);
    navigate('/login', { state: { from: currentPath } });
    return false;
  }
  return true;
};

export const useAuthCheck = (user, isAuthenticated) => {
  const navigate = useNavigate();
  return () => requireAuth(user, isAuthenticated, navigate);
};

export default {
  requireAuth,
  useAuthCheck
}; 