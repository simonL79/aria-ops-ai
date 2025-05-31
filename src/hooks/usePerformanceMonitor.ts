
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(performance.now());
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      const loadTime = performance.now() - startTime.current;
      
      // Log performance metrics
      console.log(`[PERFORMANCE] ${componentName} load time: ${loadTime.toFixed(2)}ms`);
      
      // Report to performance API if available
      if ('performance' in window && 'measure' in window.performance) {
        try {
          performance.mark(`${componentName}-loaded`);
          performance.measure(`${componentName}-load-time`, 'navigationStart', `${componentName}-loaded`);
        } catch (error) {
          console.warn('Performance measurement failed:', error);
        }
      }
      
      // Check memory usage if available
      if ('memory' in (performance as any)) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
        console.log(`[MEMORY] ${componentName} memory usage: ${memoryUsage.toFixed(2)}MB`);
      }
      
      isFirstRender.current = false;
    }
  }, [componentName]);

  const measureRenderTime = (renderName: string) => {
    const renderStart = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStart;
      console.log(`[RENDER] ${componentName}.${renderName}: ${renderTime.toFixed(2)}ms`);
    };
  };

  return { measureRenderTime };
};
