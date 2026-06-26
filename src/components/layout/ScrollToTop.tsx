import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ACTIVE_CLASS = 'aria-target-active';

/**
 * Scrolls the window to the top on route (pathname) change.
 * Preserves position when only the hash changes so in-page anchors
 * like /home#pricing still work, and highlights the target section.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Clear any previous target highlight.
    document.querySelectorAll(`section.${ACTIVE_CLASS}`).forEach((el) => {
      el.classList.remove(ACTIVE_CLASS);
    });

    if (hash) {
      const id = hash.replace('#', '');
      let attempt = 0;
      let timer: number | null = null;

      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (el.hasAttribute('tabindex')) {
            el.focus({ preventScroll: true });
          }
          el.classList.add(ACTIVE_CLASS);
          return;
        }
        if (attempt < 10) {
          attempt += 1;
          timer = window.setTimeout(tryScroll, 50);
        }
      };

      tryScroll();
      return () => {
        if (timer) window.clearTimeout(timer);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
