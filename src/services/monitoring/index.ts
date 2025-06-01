
export * from './status';
export * from './types';

// Import services to avoid naming conflicts
import { getMonitoringStatus as getStatus, runMonitoringScan as runScan, startMonitoring as start, stopMonitoring as stop } from './monitoringService';

// Re-export with explicit names to avoid conflicts
export { getStatus as getMonitoringStatus, runScan as runMonitoringScan, start as startMonitoring, stop as stopMonitoring };

/**
 * Initialize monitoring platforms
 */
export const initializeMonitoringPlatforms = async (): Promise<void> => {
  try {
    console.log('🔧 Initializing monitoring platforms...');
    
    // Import here to avoid circular dependency
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Check if monitoring status exists first
    const { data: existing } = await supabase
      .from('monitoring_status')
      .select('id')
      .eq('id', '1')
      .single();

    if (!existing) {
      // Only insert if it doesn't exist
      const { error } = await supabase
        .from('monitoring_status')
        .insert({
          id: '1',
          is_active: true,
          sources_count: 6,
          last_run: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.warn('Could not create monitoring status:', error.message);
      }
    } else {
      // Update existing record
      const { error } = await supabase
        .from('monitoring_status')
        .update({
          is_active: true,
          sources_count: 6,
          updated_at: new Date().toISOString()
        })
        .eq('id', '1');

      if (error) {
        console.warn('Could not update monitoring status:', error.message);
      }
    }
    
    console.log('✅ Monitoring platforms initialized');
  } catch (error) {
    console.error('❌ Failed to initialize monitoring platforms:', error);
  }
};
