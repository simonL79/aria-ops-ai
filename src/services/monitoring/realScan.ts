
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RealScanOptions {
  fullScan?: boolean;
  source?: string;
  targetEntity?: string;
}

export const performRealScan = async (options: RealScanOptions = {}) => {
  try {
    console.log('🔍 Starting A.R.I.A™ OSINT Intelligence Sweep...');
    
    toast.info("A.R.I.A™ Intelligence Sweep initiated", {
      description: "Direct web crawling & OSINT processing active"
    });

    // Call the monitoring scan edge function for real OSINT
    const { data, error } = await supabase.functions.invoke('monitoring-scan', {
      body: {
        fullScan: options.fullScan || true,
        targetEntity: options.targetEntity,
        source: options.source || 'operator_console'
      }
    });

    if (error) {
      console.error('A.R.I.A™ Intelligence Sweep failed:', error);
      toast.error("Intelligence sweep failed", {
        description: error.message || "Unable to complete OSINT operations"
      });
      return [];
    }

    if (data?.success) {
      const resultCount = data.results?.length || 0;
      const highRisk = data.stats?.high_risk || 0;
      const mediumRisk = data.stats?.medium_risk || 0;
      
      if (resultCount > 0) {
        toast.success("A.R.I.A™ Intelligence Sweep completed", {
          description: `${resultCount} intelligence items processed (${highRisk} high-risk, ${mediumRisk} medium-risk)`
        });
        
        console.log(`✅ A.R.I.A™ OSINT completed: ${resultCount} intelligence items processed`);
        console.log(`📊 Risk breakdown: ${highRisk} high, ${mediumRisk} medium`);
        return data.results;
      } else {
        toast.info("Intelligence sweep completed", {
          description: "No relevant intelligence detected in current sweep"
        });
        
        console.log('ℹ️ A.R.I.A™ OSINT completed: No relevant intelligence detected');
        return [];
      }
    } else {
      console.warn('Intelligence sweep completed but no success flag returned');
      return [];
    }

  } catch (error) {
    console.error('Error performing A.R.I.A™ Intelligence Sweep:', error);
    toast.error("Intelligence sweep error", {
      description: "An error occurred during OSINT operations"
    });
    return [];
  }
};
