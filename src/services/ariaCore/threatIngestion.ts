
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
          platform: data.platform,
          url: data.url,
          entity_name: data.entityName,
          threat_type: data.threatType || 'general',
          severity: data.severity || 'medium',
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
            source_platform: data.platform,
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
}
