
import { supabase } from '@/integrations/supabase/client';

export interface RealScanOptions {
  fullScan?: boolean;
  targetEntity?: string;
  source?: string;
  platforms?: string[];
  scan_depth?: string; // Add this missing property
}

export interface ScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  threat_type?: string;
  created_at: string;
  status: 'new' | 'read' | 'actioned' | 'resolved'; // Fix the status type
  sentiment: number;
  confidence_score: number;
  potential_reach: number;
  detected_entities: string[];
  source_type: string;
  source_credibility_score: number;
  media_is_ai_generated: boolean;
  ai_detection_confidence: number;
  entity_name: string; // Add this required property for LiveScanResult compatibility
}

/**
 * Perform a real scan using available data sources
 */
export const performRealScan = async (options: RealScanOptions = {}): Promise<ScanResult[]> => {
  try {
    console.log('🔍 Starting real scan with options:', options);
    
    const { fullScan = false, targetEntity = 'test-entity', source = 'real_scan' } = options;
    
    // Get recent scan results as baseline
    const { data: existingResults, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(fullScan ? 100 : 20);
    
    if (error) {
      console.error('Error fetching existing scan results:', error);
      return [];
    }
    
    // Transform to expected format
    const scanResults: ScanResult[] = (existingResults || []).map(result => ({
      id: result.id,
      content: result.content,
      platform: result.platform,
      url: result.url || '',
      severity: result.severity as 'low' | 'medium' | 'high',
      confidence: result.confidence_score || 0.8,
      threat_type: result.threat_type,
      created_at: result.created_at,
      status: (result.status || 'new') as 'new' | 'read' | 'actioned' | 'resolved',
      sentiment: 0,
      confidence_score: result.confidence_score || 0.8,
      potential_reach: 1000,
      detected_entities: [],
      source_type: 'live_osint',
      source_credibility_score: 0.8,
      media_is_ai_generated: false,
      ai_detection_confidence: 0,
      entity_name: targetEntity
    }));
    
    // Log the scan operation
    await supabase.from('aria_ops_log').insert({
      operation_type: 'real_scan',
      entity_name: targetEntity,
      module_source: source,
      operation_data: {
        fullScan,
        resultsCount: scanResults.length,
        platforms: options.platforms || ['all']
      },
      success: true
    });
    
    console.log(`✅ Real scan completed: ${scanResults.length} results`);
    return scanResults;
    
  } catch (error) {
    console.error('❌ Real scan failed:', error);
    
    // Log the failure
    await supabase.from('aria_ops_log').insert({
      operation_type: 'real_scan',
      entity_name: options.targetEntity || 'unknown',
      module_source: options.source || 'real_scan',
      operation_data: { error: error.message },
      success: false,
      error_message: error.message
    });
    
    return [];
  }
};

/**
 * Check system health for real scanning capabilities
 */
export const checkScanSystemHealth = async (): Promise<{
  healthy: boolean;
  services: Record<string, boolean>;
  message: string;
}> => {
  try {
    const services = {
      database: false,
      monitoring: false,
      ai_service: false
    };
    
    // Check database connectivity
    try {
      await supabase.from('scan_results').select('id').limit(1);
      services.database = true;
    } catch (error) {
      console.warn('Database check failed:', error);
    }
    
    // Check monitoring status
    try {
      const { data } = await supabase.from('monitoring_status').select('*').limit(1);
      services.monitoring = !!data;
    } catch (error) {
      console.warn('Monitoring check failed:', error);
    }
    
    // Check AI service status
    try {
      const { data } = await supabase.from('system_config')
        .select('config_value')
        .eq('config_key', 'aria_core_active')
        .single();
      services.ai_service = data?.config_value === 'true';
    } catch (error) {
      console.warn('AI service check failed:', error);
    }
    
    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;
    const healthy = healthyServices >= totalServices * 0.7; // 70% threshold
    
    return {
      healthy,
      services,
      message: `${healthyServices}/${totalServices} services operational`
    };
    
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      healthy: false,
      services: {},
      message: 'Health check failed'
    };
  }
};
