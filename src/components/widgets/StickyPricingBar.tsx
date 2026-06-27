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
    setDismissed(true);
    if (typeof window !== 'undefined') sessionStorage.setItem(storageKey, '1');
  }, [storageKey]);

  const show = scrolledPastHero && !pricingVisible && !dismissed;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      aria-hidden={!show}
    >
      <div className="pointer-events-auto flex items-center gap-3 w-full max-w-2xl pr-20 sm:pr-24 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl pl-4 py-2.5">
        <p className="hidden sm:block flex-1 text-sm text-foreground/90 font-medium truncate">
          {label}
        </p>
        <button
          onClick={handleClick}
          className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 transition-all duration-300 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)]"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <button
          onClick={handleDismiss}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Dismiss pricing bar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default StickyPricingBar;
