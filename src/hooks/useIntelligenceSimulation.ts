
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to manage live OSINT intelligence operations - NO SIMULATIONS
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
      // Execute live intelligence gathering
      const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
        body: { 
          scanType: 'live_osint',
          enableLiveData: true,
          blockMockData: true
        }
      });

      if (error) {
        throw error;
      }

      // Complete operation
      setTimeout(() => {
        setIsExecuting(false);
        
        // Update toast to success
        toast.success(options?.successMessage || "Live operation complete", {
          id: toastId,
          description: "Live intelligence data has been collected from real sources."
        });
        
        // Run completion callback if provided
        if (options?.onComplete) {
          options.onComplete();
        }
      }, options?.duration || 2500);
      
    } catch (error) {
      setIsExecuting(false);
      toast.error("Live operation failed", {
        id: toastId,
        description: "Error executing live OSINT operation"
      });
      console.error('Live operation error:', error);
    }
  };
  
  return {
    isSimulating: isExecuting, // Keep same interface for compatibility
    runSimulation: runLiveOperation // But execute live operations instead
  };
};
