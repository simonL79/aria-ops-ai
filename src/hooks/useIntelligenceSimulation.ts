
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook to manage intelligence simulations with consistent UI behavior
 */
export const useIntelligenceSimulation = (options?: {
  duration?: number;
  successMessage?: string;
  description?: string;
  onComplete?: () => void;
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  
  const runSimulation = () => {
    if (isSimulating) return;
    
    // Show loading toast
    setIsSimulating(true);
    const toastId = toast.loading("Running simulation", {
      description: options?.description || "Analyzing data and generating insights..."
    });
    
    // This hook now just manages the UI state for simulations
    // The actual simulation logic is handled by the caller
    // (which will call into the appropriate services)
    
    // Use a timeout to ensure the UI has time to update
    setTimeout(() => {
      // Complete simulation UI after the duration
      setTimeout(() => {
        setIsSimulating(false);
        
        // Update toast to success
        toast.success(options?.successMessage || "Simulation complete", {
          id: toastId,
          description: "Intelligence data has been updated with new information."
        });
        
        // Run completion callback if provided
        if (options?.onComplete) {
          options.onComplete();
        }
      }, options?.duration || 2500);
    }, 0);
  };
  
  return {
    isSimulating,
    runSimulation
  };
};
