
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for live OSINT intelligence operations - NO SIMULATIONS ALLOWED
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
      
      // Execute multiple live intelligence functions in parallel
      const scanPromises = [
        supabase.functions.invoke('reddit-scan', {
          body: { 
            scanType: 'live_osint',
            enableLiveData: true,
            blockMockData: true
          }
        }),
        supabase.functions.invoke('uk-news-scanner', {
          body: { 
            scanType: 'live_osint',
            enableLiveData: true,
            blockMockData: true
          }
        }),
        supabase.functions.invoke('enhanced-intelligence', {
          body: { 
            scanType: 'live_osint',
            enableLiveData: true,
            blockMockData: true
          }
        }),
        supabase.functions.invoke('monitoring-scan', {
          body: { 
            scanType: 'live_osint',
            enableLiveData: true,
            blockMockData: true
          }
        })
      ];

      const results = await Promise.allSettled(scanPromises);
      const successfulScans = results.filter(result => result.status === 'fulfilled').length;

      if (successfulScans > 0) {
        setTimeout(() => {
          setIsExecuting(false);
          
          toast.success(options?.successMessage || "Live OSINT operation complete", {
            id: toastId,
            description: `${successfulScans}/4 live intelligence modules executed successfully`
          });
          
          if (options?.onComplete) {
            options.onComplete();
          }
        }, options?.duration || 2500);
      } else {
        throw new Error('All live intelligence modules failed');
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
