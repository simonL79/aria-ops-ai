
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  timestamp: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    const measurePerformance = () => {
      const startTime = performance.now();
      const memoryInfo = (performance as any).memory;
      
      // Measure actual load time
      const loadTime = performance.timing 
        ? performance.timing.loadEventEnd - performance.timing.navigationStart 
        : startTime;
      
      const renderTime = performance.now() - startTime;
      const memoryUsage = memoryInfo 
        ? memoryInfo.usedJSHeapSize / (1024 * 1024) // Convert to MB
        : 0;

      const newMetrics: PerformanceMetrics = {
        loadTime: loadTime > 0 ? loadTime : 1000, // Fallback for negative values
        renderTime,
        memoryUsage,
        timestamp: Date.now()
      };

      setMetrics(newMetrics);
      setIsOptimized(newMetrics.loadTime < 3000 && newMetrics.memoryUsage < 50);
    };

    // Measure immediately and after page is fully loaded
    measurePerformance();
    
    const timer = setTimeout(measurePerformance, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!metrics) {
    return (
      <Card className="corporate-card">
        <CardContent className="p-4">
          <div className="text-center text-corporate-lightGray">
            Measuring performance...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceStatus = () => {
    if (metrics.loadTime < 2000) return { status: 'excellent', icon: TrendingUp, color: 'text-green-500' };
    if (metrics.loadTime < 5000) return { status: 'good', icon: TrendingUp, color: 'text-yellow-500' };
    return { status: 'poor', icon: AlertTriangle, color: 'text-red-500' };
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <Card className="corporate-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 corporate-heading">
          <performanceStatus.icon className={`h-4 w-4 ${performanceStatus.color}`} />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-corporate-lightGray">Load Time:</span>
            <Badge variant={metrics.loadTime < 3000 ? "default" : "destructive"}>
              {(metrics.loadTime / 1000).toFixed(2)}s
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-corporate-lightGray">Memory Usage:</span>
            <Badge variant={metrics.memoryUsage < 50 ? "default" : "secondary"}>
              {metrics.memoryUsage.toFixed(1)}MB
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-corporate-lightGray">Status:</span>
            <Badge 
              variant={isOptimized ? "default" : "destructive"}
              className={isOptimized ? "bg-green-600" : "bg-red-600"}
            >
              {isOptimized ? "Optimized" : "Needs Optimization"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
