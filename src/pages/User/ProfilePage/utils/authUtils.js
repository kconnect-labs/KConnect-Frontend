export const requireAuth = (user, isAuthenticated, navigate) => {
  if (!isAuthenticated || !user) {
    navigate('/login', { 
      state: { 
        from: window.location.pathname,
        message: 'Для выполнения этого действия необходима авторизация'
      } 
    });
    return false;
  }
  return true;
};