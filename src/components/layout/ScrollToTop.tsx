import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on route (pathname) change.
 * Preserves position when only the hash changes so in-page anchors
 * like /home#pricing still work.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait for the target section to mount after route change, then smooth-scroll
      // and move focus so screen-reader users and keyboard users land at the section.
      const id = hash.replace('#', '');
      const ACTIVE_CLASS = 'aria-target-active';
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (el.hasAttribute('tabindex')) {
            el.focus({ preventScroll: true });
          }
          el.classList.add(ACTIVE_CLASS);
        } else if (attempt < 10) {
          window.setTimeout(() => tryScroll(attempt + 1), 50);
        }
      };
      tryScroll();
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
