
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
    
    // Simulate API call or processing
    setTimeout(() => {
      // Complete simulation
      setIsSimulating(false);
      
      // Show success message
      toast.success(options?.successMessage || "Simulation complete", {
        id: toastId,
        description: "Intelligence data has been updated with new information."
      });
      
      // Run completion callback if provided
      if (options?.onComplete) {
        options.onComplete();
      }
    }, options?.duration || 2500);
  };
  
  return {
    isSimulating,
    runSimulation
  };
};
