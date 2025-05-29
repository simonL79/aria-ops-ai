
export * from './monitoringService';
export * from './status';
export * from './types';

/**
 * Initialize monitoring platforms
 */
export const initializeMonitoringPlatforms = async (): Promise<void> => {
  try {
    console.log('🔧 Initializing monitoring platforms...');
    
    // Import here to avoid circular dependency
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Initialize monitoring platforms
    const platforms = [
      'Social Media',
      'News Sources', 
      'Forums',
      'Legal Discussions',
      'Dark Web',
      'AI Models'
    ];
    
    // Update or create monitoring status
    const { error } = await supabase
      .from('monitoring_status')
      .upsert({
        id: '1',
        is_active: true,
        sources_count: platforms.length,
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (error && error.code !== 'PGRST116') {
      console.warn('Could not update monitoring status:', error);
    }
    
    console.log('✅ Monitoring platforms initialized');
  } catch (error) {
    console.error('❌ Failed to initialize monitoring platforms:', error);
  }
};
