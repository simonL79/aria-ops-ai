import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ScrollSpySection {
  id: string;
  label: string;
}

interface ScrollSpyProps {
  sections: ScrollSpySection[];
  className?: string;
}

/**
 * Lightweight section-aware scroll indicator.
 *
 * - Desktop: a fixed vertical dot rail on the right edge.
 * - Mobile: a sticky horizontal pill bar below the main header.
 *
 * Uses IntersectionObserver to highlight the section currently in view,
 * syncs the URL hash as the user scrolls, and clicking an indicator
 * scrolls smoothly to that section. Browser back/forward navigation
 * is respected so the active indicator and viewport stay in sync.
 */
export const ScrollSpy = ({ sections, className }: ScrollSpyProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const clearScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  const activateSection = useCallback((id: string, scroll = true) => {
    const el = document.getElementById(id);
    if (!el) return;

    setIsScrolling(true);
    setActiveId(id);
    clearScrollTimeout();

    if (scroll) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (el.hasAttribute('tabindex')) {
        el.focus({ preventScroll: true });
      }
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 700);
  }, [clearScrollTimeout]);

  // Resolve initial active section from URL hash or current viewport.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.some((s) => s.id === hash)) {
      activateSection(hash, true);
      return;
    }

    const firstVisible = sections.find(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4;
    });
    if (firstVisible) setActiveId(firstVisible.id);
  }, [sections, activateSection]);

  // Track sections with IntersectionObserver and update the active id.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Treat the middle 40% of the viewport as the "reading area".
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, isScrolling]);

  // Track real user scrolling so the hash only updates after the page has been
  // interacted with. This prevents the initial observer pass from adding a hash
  // to a clean URL on first load.
  useEffect(() => {
    const onScroll = () => setHasScrolled(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync the URL hash with the active section as the user scrolls.
  // Uses replaceState so we do not pollute the browser history.
  useEffect(() => {
    if (!activeId || isScrolling || !hasScrolled) return;
    const newHash = '#' + activeId;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [activeId, isScrolling, hasScrolled]);

  // Handle browser back/forward buttons: restore the section matching the hash.
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sections.some((s) => s.id === hash)) {
        activateSection(hash, true);
      } else if (!hash) {
        // No hash: fall back to the section currently in the reading area.
        const firstVisible = sections.find(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4;
        });
        if (firstVisible) setActiveId(firstVisible.id);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [sections, activateSection]);

  const handleClick = useCallback((id: string) => {
    // Push a new history entry so back/forward navigation works.
    window.history.pushState(null, '', '#' + id);
    activateSection(id, true);
  }, [activateSection]);

  useEffect(() => {
    return () => clearScrollTimeout();
  }, [clearScrollTimeout]);

  if (!sections.length) return null;

  return (
    <>
      {/* Mobile / compact: sticky horizontal pill bar */}
      <nav
        className={cn(
          'sticky top-20 z-40 md:hidden w-full bg-background/95 backdrop-blur border-b border-border/60',
          className
        )}
        aria-label="Section navigation"
      >
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
            {sections.map(({ id, label }) => (
              <li key={id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleClick(id)}
                  className={cn(
                    'whitespace-nowrap px-3 py-1 text-xs rounded-full transition-colors duration-200',
                    activeId === id
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  aria-current={activeId === id ? 'location' : undefined}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Desktop: fixed vertical dot rail */}
      <nav
        className={cn(
          'fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4',
          className
        )}
        aria-label="Section navigation"
      >
        {sections.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleClick(id)}
              className="group relative flex items-center justify-end"
              aria-current={isActive ? 'location' : undefined}
              aria-label={label}
            >
              <span className="absolute right-8 whitespace-nowrap px-2 py-1 text-xs rounded-md bg-card border border-border text-foreground opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                {label}
              </span>
              <span
                className={cn(
                  'block rounded-full border border-primary/30 transition-all duration-200',
                  isActive
                    ? 'h-4 w-4 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.45)]'
                    : 'h-2.5 w-2.5 bg-muted hover:bg-muted-foreground'
                )}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default ScrollSpy;
