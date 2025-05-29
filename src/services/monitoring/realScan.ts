
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const performRealScan = async (options: {
  fullScan?: boolean;
  targetEntity?: string;
  source?: string;
} = {}) => {
  try {
    console.log('🚀 Starting real monitoring scan...');
    
    // Update monitoring status to show scan is active
    const { error: statusError } = await supabase
      .from('monitoring_status')
      .upsert({
        id: '1',
        is_active: true,
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (statusError) {
      console.error('Error updating monitoring status:', statusError);
    }

    // Call the monitoring-scan edge function
    const { data, error } = await supabase.functions.invoke('monitoring-scan', {
      body: {
        fullScan: options.fullScan || true,
        targetEntity: options.targetEntity || null,
        source: options.source || 'real_scan'
      }
    });
    
    if (error) {
      console.error('Real scan error:', error);
      toast.error('Real scan failed: ' + error.message);
      return [];
    }
    
    // Get the latest scan results
    const { data: results, error: fetchError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (fetchError) {
      console.error('Error fetching scan results:', fetchError);
      return [];
    }
    
    console.log(`✅ Real scan completed: ${results?.length || 0} results`);
    toast.success(`Real scan completed: ${results?.length || 0} new results`);
    
    return results || [];
    
  } catch (error) {
    console.error('Error in real scan:', error);
    toast.error('Real scan failed: ' + error.message);
    return [];
  }
};

export const getMonitoringStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching monitoring status:', error);
      return { isActive: false, lastRun: null };
    }
    
    return {
      isActive: data?.is_active || false,
      lastRun: data?.last_run ? new Date(data.last_run) : null,
      nextRun: data?.next_run ? new Date(data.next_run) : null
    };
  } catch (error) {
    console.error('Error in getMonitoringStatus:', error);
    return { isActive: false, lastRun: null };
  }
};
