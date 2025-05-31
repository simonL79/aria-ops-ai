
import { useCallback, useEffect, useMemo } from 'react';

interface PerformanceOptimization {
  debounce: <T extends (...args: any[]) => void>(func: T, delay: number) => (...args: Parameters<T>) => void;
  throttle: <T extends (...args: any[]) => void>(func: T, limit: number) => (...args: Parameters<T>) => void;
  memoizeCallback: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => T;
  optimizeImages: (imageUrl: string) => string;
}

export const usePerformanceOptimization = (): PerformanceOptimization => {
  // Debounce function to prevent excessive function calls
  const debounce = useCallback(<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Throttle function to limit function execution frequency
  const throttle = useCallback(<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Memoize callbacks with proper dependency tracking
  const memoizeCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    deps: any[]
  ): T => {
    return useCallback(callback, deps) as T;
  }, []);

  // Optimize image loading
  const optimizeImages = useCallback((imageUrl: string): string => {
    // Add responsive image optimizations
    if (imageUrl.includes('lovable-uploads')) {
      return `${imageUrl}?w=400&q=75&format=webp`;
    }
    return imageUrl;
  }, []);

  // Preload critical resources
  useEffect(() => {
    const preloadCriticalResources = () => {
      const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      ];

      criticalFonts.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = fontUrl;
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();
  }, []);

  return useMemo(() => ({
    debounce,
    throttle,
    memoizeCallback,
    optimizeImages
  }), [debounce, throttle, memoizeCallback, optimizeImages]);
};
