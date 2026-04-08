import { useEffect, useState, RefObject } from 'react';

interface ReadingProgressBarProps {
  containerRef: RefObject<HTMLElement>;
}

const ReadingProgressBar = ({ containerRef }: ReadingProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const containerHeight = rect.height;
      const scrolled = window.scrollY - containerTop;
      const total = containerHeight - window.innerHeight;

      if (total <= 0) {
        setProgress(0);
        return;
      }

      const pct = Math.min(Math.max(scrolled / total, 0), 1) * 100;
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  if (progress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-transparent">
      <div
        className="h-full bg-orange-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
