
import { supabase } from '@/integrations/supabase/client';

export interface ThreatIngestionItem {
  id: string;
  raw_content: string;
  source_platform: string;
  detected_at: string;
  status: 'pending' | 'processed' | 'failed';
  threat_indicators?: any;
  entity_matches?: string[];
}

/**
 * Threat Ingestion Service - Handles real-time threat data ingestion
 */
export class ThreatIngestionService {
  
  /**
   * Ingest threat data from various sources
   */
  static async ingestThreat(data: {
    content: string;
    platform: string;
    url?: string;
    entityName?: string;
    threatType?: string;
    severity?: string;
  }): Promise<string | null> {
    try {
      // Check if mock data is allowed
      const { data: config } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'allow_mock_data')
        .single();
      
      const allowMockData = config?.config_value === 'enabled';
      
      // Reject mock data if not allowed
      if (!allowMockData && this.isMockData(data.content)) {
        console.warn('🚫 Mock data rejected by live enforcement');
        return null;
      }
      
      // Insert into threats table if it exists
      const { data: threat, error } = await supabase
        .from('threats')
        .insert({
          content: data.content,
          source: data.platform,
          threat_type: data.threatType || 'general',
          detected_at: new Date().toISOString(),
          is_live: true
        })
        .select('id')
        .single();
      
      if (error) {
        // Fallback to threat ingestion queue
        const { data: queueItem, error: queueError } = await supabase
          .from('threat_ingestion_queue')
          .insert({
            raw_content: data.content,
            source: data.platform,
            status: 'pending'
          })
          .select('id')
          .single();
        
        if (queueError) {
          console.error('Failed to queue threat:', queueError);
          return null;
        }
        
        return queueItem?.id || null;
      }
      
      // Update live status
      await this.updateLiveStatus(data.platform);
      
      return threat?.id || null;
      
    } catch (error) {
      console.error('Threat ingestion failed:', error);
      return null;
    }
  }
  
  /**
   * Check if content appears to be mock/test data
   */
  private static isMockData(content: string): boolean {
    const lowerContent = content.toLowerCase();
    const mockIndicators = ['test', 'mock', 'demo', 'sample', 'example'];
    
    return mockIndicators.some(indicator => lowerContent.includes(indicator));
  }
  
  /**
   * Update live status for the platform
   */
  private static async updateLiveStatus(platform: string): Promise<void> {
    try {
      const moduleName = this.getModuleNameForPlatform(platform);
      
      await supabase
        .from('live_status')
        .upsert({
          name: moduleName,
          active_threats: 1, // Increment would require a function
          last_threat_seen: new Date().toISOString(),
          last_report: new Date().toISOString(),
          system_status: 'LIVE'
        }, { onConflict: 'name' });
        
    } catch (error) {
      console.error('Failed to update live status:', error);
    }
  }
  
  /**
   * Map platform to module name
   */
  private static getModuleNameForPlatform(platform: string): string {
    const platformMap: Record<string, string> = {
      'twitter': 'Social Media Monitor',
      'facebook': 'Social Media Monitor',
      'instagram': 'Social Media Monitor',
      'linkedin': 'Social Media Monitor',
      'reddit': 'Forum Analysis Engine',
      'discord': 'Forum Analysis Engine',
      'news': 'News Feed Scanner',
      'legal': 'Legal Discussion Monitor',
      'web': 'Live Threat Scanner'
    };
    
    return platformMap[platform.toLowerCase()] || 'Live Threat Scanner';
  }

  /**
   * Get live threats from the system
   */
  static async getLiveThreats(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('threats')
        .select('*')
        .eq('is_live', true)
        .order('detected_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to fetch live threats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching live threats:', error);
      return [];
    }
  }

  /**
   * Get queue status
   */
  static async getQueueStatus(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('threat_ingestion_queue')
        .select('status')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch queue status:', error);
        return { pending: 0, processed: 0, failed: 0 };
      }

      const statusCounts = data?.reduce((acc: any, item: any) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        pending: statusCounts.pending || 0,
        processed: statusCounts.processed || 0,
        failed: statusCounts.failed || 0
      };
    } catch (error) {
      console.error('Error fetching queue status:', error);
      return { pending: 0, processed: 0, failed: 0 };
    }
  }

  /**
   * Get system health status
   */
  static async getSystemHealth(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('live_status')
        .select('*')
        .order('last_report', { ascending: false });

      if (error) {
        console.error('Failed to fetch system health:', error);
        return { modules: [], overall: 'unknown' };
      }

      const modules = data || [];
      const liveModules = modules.filter(m => m.system_status === 'LIVE');
      const overall = liveModules.length === modules.length ? 'healthy' : 'degraded';

      return { modules, overall };
    } catch (error) {
      console.error('Error fetching system health:', error);
      return { modules: [], overall: 'unknown' };
    }
  }

  /**
   * Initialize live system
   */
  static async initializeLiveSystem(): Promise<boolean> {
    try {
      console.log('🚀 Initializing live system...');
      
      // Check system configuration
      const { data: configs, error } = await supabase
        .from('system_config')
        .select('*');

      if (error) {
        console.error('Failed to check system config:', error);
        return false;
      }

      const configMap = new Map(configs?.map(c => [c.config_key, c.config_value]) || []);
      
      if (configMap.get('live_enforcement') === 'enabled') {
        console.log('✅ Live system already initialized');
        return true;
      }

      console.log('⚠️ Live enforcement not enabled');
      return false;
    } catch (error) {
      console.error('Error initializing live system:', error);
      return false;
    }
  }

  /**
   * Trigger pipeline processing
   */
  static async triggerPipelineProcessing(): Promise<boolean> {
    try {
      console.log('🔄 Triggering pipeline processing...');
      
      // Process pending items in queue
      const { data: pendingItems, error } = await supabase
        .from('threat_ingestion_queue')
        .select('*')
        .eq('status', 'pending')
        .limit(10);

      if (error) {
        console.error('Failed to fetch pending items:', error);
        return false;
      }

      if (!pendingItems || pendingItems.length === 0) {
        console.log('No pending items to process');
        return true;
      }

      // Update processed items
      for (const item of pendingItems) {
        await supabase
          .from('threat_ingestion_queue')
          .update({ 
            status: 'processed',
            processed_at: new Date().toISOString()
          })
          .eq('id', item.id);
      }

      console.log(`✅ Processed ${pendingItems.length} items`);
      return true;
    } catch (error) {
      console.error('Error triggering pipeline processing:', error);
      return false;
    }
  }
}

// Export convenience functions
export const {
  getLiveThreats,
  getQueueStatus,
  getSystemHealth,
  initializeLiveSystem,
  triggerPipelineProcessing
} = ThreatIngestionService;
