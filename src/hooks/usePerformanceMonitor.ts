
import { useCallback, useEffect } from 'react';

interface PerformanceMeasurement {
  measureRenderTime: (operationName: string) => () => void;
}

export const usePerformanceMonitor = (componentName: string): PerformanceMeasurement => {
  useEffect(() => {
    console.log(`${componentName} component mounted`);
    
    return () => {
      console.log(`${componentName} component unmounted`);
    };
  }, [componentName]);

  const measureRenderTime = useCallback((operationName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Only log if duration is significant to avoid spam
      if (duration > 10) {
        console.log(`${componentName} - ${operationName}: ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  return { measureRenderTime };
};
