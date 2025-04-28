import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
/**
 * ScrollToTop component that scrolls to the top of the page on route changes
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export default ScrollToTop; 