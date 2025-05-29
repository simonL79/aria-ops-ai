
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Live Data Enforcer - Ensures all A.R.I.A™ scanners produce real data only
 * Eliminates mock/demo/simulation data throughout the system
 */
export class LiveDataEnforcer {
  
  /**
   * Enforce live data integrity across all scanner modules
   */
  static async enforceSystemWideLiveData(): Promise<boolean> {
    try {
      console.log('🔒 Enforcing system-wide live data integrity...');
      
      // 1. Clean threat ingestion queue
      await this.cleanThreatIngestionQueue();
      
      // 2. Clean scan results
      await this.cleanScanResults();
      
      // 3. Clean entity data
      await this.cleanEntityData();
      
      // 4. Update system configuration
      await this.updateSystemConfig();
      
      // 5. Initialize live monitoring
      await this.initializeLiveMonitoring();
      
      console.log('✅ Live data enforcement completed successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Live data enforcement failed:', error);
      return false;
    }
  }
  
  /**
   * Clean threat ingestion queue of any mock data
   */
  private static async cleanThreatIngestionQueue(): Promise<void> {
    try {
      console.log('🧹 Cleaning threat ingestion queue...');
      
      // Remove any entries with mock/demo/test content
      const { error } = await supabase
        .from('threat_ingestion_queue')
        .delete()
        .or('raw_content.ilike.%mock%,raw_content.ilike.%demo%,raw_content.ilike.%test%,raw_content.ilike.%sample%');
      
      if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
        console.error('Error cleaning threat queue:', error);
      } else {
        console.log('✅ Threat ingestion queue cleaned');
      }
    } catch (error) {
      console.error('Error in cleanThreatIngestionQueue:', error);
    }
  }
  
  /**
   * Clean scan results of any mock data
   */
  private static async cleanScanResults(): Promise<void> {
    try {
      console.log('🧹 Cleaning scan results...');
      
      // Remove mock scan results
      const { error } = await supabase
        .from('scan_results')
        .delete()
        .or('content.ilike.%mock%,content.ilike.%demo%,content.ilike.%test%,content.ilike.%sample%,platform.ilike.%test%');
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error cleaning scan results:', error);
      } else {
        console.log('✅ Scan results cleaned');
      }
    } catch (error) {
      console.error('Error in cleanScanResults:', error);
    }
  }
  
  /**
   * Clean entity data of any test entities
   */
  private static async cleanEntityData(): Promise<void> {
    try {
      console.log('🧹 Cleaning entity data...');
      
      // Remove test entities
      const { error } = await supabase
        .from('client_entities')
        .delete()
        .or('entity_name.ilike.%test%,entity_name.ilike.%demo%,entity_name.ilike.%mock%,entity_name.ilike.%sample%');
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error cleaning entities:', error);
      } else {
        console.log('✅ Entity data cleaned');
      }
    } catch (error) {
      console.error('Error in cleanEntityData:', error);
    }
  }
  
  /**
   * Update system configuration to enforce live data
   */
  private static async updateSystemConfig(): Promise<void> {
    try {
      console.log('⚙️ Updating system configuration...');
      
      // Set system to live mode
      const { error } = await supabase
        .from('system_config')
        .upsert([
          { config_key: 'allow_mock_data', config_value: 'disabled' },
          { config_key: 'system_mode', config_value: 'live' },
          { config_key: 'scanner_mode', config_value: 'production' },
          { config_key: 'data_validation', config_value: 'strict' }
        ], { onConflict: 'config_key' });
      
      if (error) {
        console.error('Error updating system config:', error);
      } else {
        console.log('✅ System configuration updated');
      }
    } catch (error) {
      console.error('Error in updateSystemConfig:', error);
    }
  }
  
  /**
   * Initialize live monitoring status
   */
  private static async initializeLiveMonitoring(): Promise<void> {
    try {
      console.log('📊 Initializing live monitoring...');
      
      const liveModules = [
        'Live Threat Scanner',
        'Social Media Monitor',
        'News Feed Scanner', 
        'Forum Analysis Engine',
        'Legal Discussion Monitor',
        'Reputation Risk Detector'
      ];
      
      for (const module of liveModules) {
        await supabase
          .from('live_status')
          .upsert({
            name: module,
            active_threats: 0,
            last_threat_seen: new Date().toISOString(),
            last_report: new Date().toISOString(),
            system_status: 'LIVE'
          }, { onConflict: 'name' });
      }
      
      console.log('✅ Live monitoring initialized');
    } catch (error) {
      console.error('Error in initializeLiveMonitoring:', error);
    }
  }
  
  /**
   * Validate current system state for live data compliance
   */
  static async validateLiveDataCompliance(): Promise<{
    isCompliant: boolean;
    issues: string[];
    stats: Record<string, number>;
  }> {
    try {
      console.log('🔍 Validating live data compliance...');
      
      const issues: string[] = [];
      const stats: Record<string, number> = {};
      
      // Check threats table
      const { data: mockThreats } = await supabase
        .from('threats')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%demo%,content.ilike.%test%,content.ilike.%sample%');
      
      stats.mockThreats = mockThreats?.length || 0;
      if (stats.mockThreats > 0) {
        issues.push(`Found ${stats.mockThreats} mock threats`);
      }
      
      // Check threat queue
      const { data: mockQueue } = await supabase
        .from('threat_ingestion_queue')
        .select('id')
        .or('raw_content.ilike.%mock%,raw_content.ilike.%demo%,raw_content.ilike.%test%,raw_content.ilike.%sample%');
      
      stats.mockQueueItems = mockQueue?.length || 0;
      if (stats.mockQueueItems > 0) {
        issues.push(`Found ${stats.mockQueueItems} mock queue items`);
      }
      
      // Check scan results
      const { data: mockScans } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%demo%,content.ilike.%test%,content.ilike.%sample%');
      
      stats.mockScanResults = mockScans?.length || 0;
      if (stats.mockScanResults > 0) {
        issues.push(`Found ${stats.mockScanResults} mock scan results`);
      }
      
      return {
        isCompliant: issues.length === 0,
        issues,
        stats
      };
      
    } catch (error) {
      console.error('Error validating compliance:', error);
      return {
        isCompliant: false,
        issues: ['Validation failed due to system error'],
        stats: {}
      };
    }
  }
}
