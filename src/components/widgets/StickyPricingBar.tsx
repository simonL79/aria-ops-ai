import React, { useEffect, useState, useCallback } from 'react';
import { X, ArrowRight } from 'lucide-react';

type Props = {
  targetId: string;
  label: string;
  ctaText: string;
};

const StickyPricingBar = ({ targetId, label, ctaText }: Props) => {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const storageKey = `aria-pricing-bar-dismissed-${targetId}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(storageKey) === '1') setDismissed(true);
  }, [storageKey]);

  // Show after scrolling past the hero (~500px), throttled via rAF.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolledPastHero(window.scrollY > 500);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide while the pricing section is on screen. The target may be lazy-mounted,
  // so poll until it exists before observing.
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let raf = 0;
    const attach = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        raf = window.setTimeout(attach, 300);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setPricingVisible(entry.isIntersecting),
        { threshold: 0.15 },
      );
      observer.observe(el);
    };
    attach();
    return () => {
      observer?.disconnect();
      clearTimeout(raf);
    };
  }, [targetId]);

  const handleClick = useCallback(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  }, [targetId]);

  const handleDismiss = useCallback(() => {
    // Capture the element that had focus before the bar (the dismiss/CTA button)
    // so we can hand focus back to a sensible place instead of letting it fall to <body>.
    const active = document.activeElement as HTMLElement | null;
    const insideBar = active?.closest('[aria-label="Pricing quick access"]');

    setDismissed(true);
    if (typeof window !== 'undefined') sessionStorage.setItem(storageKey, '1');

    // If focus was inside the bar (keyboard dismiss), restore it to the main
    // landmark so keyboard users continue from a predictable location.
    if (insideBar) {
      requestAnimationFrame(() => {
        const main = document.querySelector('main') as HTMLElement | null;
        const fallback = main ?? document.body;
        if (main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
        fallback.focus();
      });
    }
  }, [storageKey]);

  const show = scrolledPastHero && !pricingVisible && !dismissed;

  // Polite, screen-reader-only announcements for appearance/dismissal so the
  // change in UI is conveyed without the user seeing it visually.
  const [announcement, setAnnouncement] = useState('');
  const prevShow = useRef(false);
  useEffect(() => {
    if (show && !prevShow.current) {
      setAnnouncement(`${label}. A pricing shortcut is available. Press Escape to dismiss it.`);
    } else if (!show && prevShow.current && dismissed) {
      setAnnouncement('Pricing shortcut dismissed.');
    }
    prevShow.current = show;
  }, [show, dismissed, label]);

  // Allow keyboard users to dismiss the bar with Escape while it is shown.
  useEffect(() => {
    if (!show) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [show, handleDismiss]);

  const hintId = `pricing-bar-hint-${targetId}`;

  return (
    <>
      {/* Visually hidden polite announcer — lives outside the inert region so it
          is always available to assistive tech. */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div
        role="region"
        aria-label="Pricing quick access"
        aria-describedby={hintId}
        className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
        aria-hidden={!show}
        // Keep the bar out of the focus order entirely while hidden so keyboard
        // users never tab into invisible controls.
        {...(!show ? { inert: '' as unknown as boolean } : {})}
      >
        <span id={hintId} className="sr-only">
          Quick access to pricing. Press Escape to dismiss this bar.
        </span>

      <div className="pointer-events-auto flex items-center gap-3 w-full max-w-2xl pr-20 sm:pr-24 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl pl-4 py-2.5">
        <p className="hidden sm:block flex-1 text-sm text-foreground/90 font-medium truncate">
          {label}
        </p>
        <button
          type="button"
          onClick={handleClick}
          tabIndex={show ? 0 : -1}
          aria-label={`${ctaText} — ${label}`}
          className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 transition-all duration-300 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          tabIndex={show ? 0 : -1}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          aria-label="Dismiss pricing bar"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      </div>
    </>
  );
};

export default StickyPricingBar;
