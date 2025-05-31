
import { useState } from 'react';
import { toast } from 'sonner';
import { performRealScan } from '@/services/monitoring/realScan';

/**
 * Hook for live OSINT intelligence operations - NO SIMULATIONS ALLOWED
 * Uses consolidated real scanning logic
 */
export const useIntelligenceSimulation = (options?: {
  duration?: number;
  successMessage?: string;
  description?: string;
  onComplete?: () => void;
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  
  const runLiveOperation = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    const toastId = toast.loading("Executing live OSINT operation", {
      description: options?.description || "Running live intelligence gathering from real sources..."
    });
    
    try {
      console.log('🔍 A.R.I.A™ OSINT: Executing live intelligence operation');
      
      // Execute consolidated live intelligence scanning
      const results = await performRealScan({
        fullScan: true,
        source: 'intelligence_operation'
      });

      if (results.length > 0) {
        setTimeout(() => {
          setIsExecuting(false);
          
          toast.success(options?.successMessage || "Live OSINT operation complete", {
            id: toastId,
            description: `${results.length} live intelligence items processed successfully`
          });
          
          if (options?.onComplete) {
            options.onComplete();
          }
        }, options?.duration || 2500);
      } else {
        throw new Error('No live intelligence data available');
      }
      
    } catch (error) {
      setIsExecuting(false);
      toast.error("Live OSINT operation failed", {
        id: toastId,
        description: "Error executing live intelligence gathering"
      });
      console.error('Live OSINT operation error:', error);
    }
  };
  
  return {
    isSimulating: isExecuting, // Keep same interface for compatibility
    runSimulation: runLiveOperation // But execute live operations only
  };
};
