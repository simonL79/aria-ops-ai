
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RealScanOptions {
  fullScan?: boolean;
  source?: string;
  targetEntity?: string;
}

export const performRealScan = async (options: RealScanOptions = {}) => {
  try {
    console.log('🔍 Starting LIVE monitoring scan...');
    
    toast.info("Initiating live threat scan...", {
      description: "Connecting to live data sources"
    });

    // Call the monitoring scan edge function with live enforcement
    const { data, error } = await supabase.functions.invoke('monitoring-scan', {
      body: {
        fullScan: options.fullScan || true,
        targetEntity: options.targetEntity,
        source: options.source || 'operator_console'
      }
    });

    if (error) {
      console.error('Real scan failed:', error);
      toast.error("Live scan failed", {
        description: error.message || "Unable to connect to live data sources"
      });
      return [];
    }

    if (data?.success) {
      const resultCount = data.results?.length || 0;
      
      if (resultCount > 0) {
        toast.success("Live scan completed", {
          description: `Found ${resultCount} real threats from live sources`
        });
        
        console.log(`✅ Live scan completed: ${resultCount} real threats detected`);
        return data.results;
      } else {
        toast.info("Live scan completed", {
          description: "No threats detected in current scan"
        });
        
        console.log('ℹ️ Live scan completed: No threats detected');
        return [];
      }
    } else {
      console.warn('Scan completed but no success flag returned');
      return [];
    }

  } catch (error) {
    console.error('Error performing real scan:', error);
    toast.error("Scan error", {
      description: "An error occurred while scanning live sources"
    });
    return [];
  }
};
