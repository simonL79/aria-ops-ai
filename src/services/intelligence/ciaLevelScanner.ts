import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';

export interface CIAScanOptions {
  targetEntity: string;
  fullScan: boolean;
  source: string;
  precisionMode: 'high' | 'medium' | 'low';
  enableFalsePositiveFilter: boolean;
  liveDataOnly: boolean;
  blockSimulations: boolean;
}

export interface CIAScanResult {
  id: string;
  content: string;
  platform: string;
  url?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threat_type: string;
  confidence_score: number;
  source_type: string;
  created_at: string;
}

export class CIALevelScanner {
  
  /**
   * Execute CIA-precision scan with advanced filtering
   */
  static async executePrecisionScan(options: CIAScanOptions): Promise<CIAScanResult[]> {
    console.log('🎯 CIA-Level Scanner: Initiating precision scan');
    
    // MANDATORY: Block simulation attempts
    if (options.blockSimulations !== false) {
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      if (!compliance.isCompliant || compliance.simulationDetected) {
        console.error('🚫 CIA Scanner BLOCKED: Simulation detected');
        LiveDataEnforcer.blockSimulation('CIALevelScanner.executePrecisionScan');
      }
    }

    // Validate entity input is live data
    if (options.liveDataOnly !== false) {
      const entityValidation = await LiveDataEnforcer.validateDataInput(options.targetEntity, options.source);
      if (!entityValidation) {
        throw new Error('CIA Scanner blocked: Target entity appears to be simulation data');
      }
    }

    try {
      let query = supabase
        .from('scan_results')
        .select('*')
        .ilike('content', `%${options.targetEntity}%`)
        .eq('source_type', 'live_osint')
        .order('created_at', { ascending: false });

      // Apply precision mode filters
      switch (options.precisionMode) {
        case 'high':
          query = query
            .gte('confidence_score', 0.8)
            .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
            .limit(50);
          break;
        case 'medium':
          query = query
            .gte('confidence_score', 0.6)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(100);
          break;
        case 'low':
          query = query
            .gte('confidence_score', 0.4)
            .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
            .limit(200);
          break;
      }

      const { data: scanResults, error } = await query;

      if (error) {
        console.error('CIA Scanner database error:', error);
        throw new Error(`CIA Scanner failed: ${error.message}`);
      }

      // Apply false positive filtering if enabled
      let filteredResults = scanResults || [];
      
      if (options.enableFalsePositiveFilter) {
        filteredResults = filteredResults.filter(result => 
          !this.isFalsePositive(result.content, options.targetEntity)
        );
      }

      // Log scan execution
      await supabase.from('aria_ops_log').insert({
        operation_type: 'cia_precision_scan',
        entity_name: options.targetEntity,
        module_source: 'cia_level_scanner',
        success: true,
        operation_data: {
          precision_mode: options.precisionMode,
          full_scan: options.fullScan,
          results_found: filteredResults.length,
          false_positive_filter: options.enableFalsePositiveFilter,
          live_data_only: options.liveDataOnly,
          scan_timestamp: new Date().toISOString()
        }
      });

      console.log(`✅ CIA Scanner: Found ${filteredResults.length} precision results`);
      
      // Fix severity type mapping
      return filteredResults.map(result => ({
        id: result.id,
        content: result.content,
        platform: result.platform,
        url: result.url,
        severity: this.mapSeverity(result.severity),
        threat_type: result.threat_type || 'reputation_risk',
        confidence_score: result.confidence_score || 0,
        source_type: result.source_type,
        created_at: result.created_at
      }));

    } catch (error) {
      console.error('❌ CIA Scanner execution failed:', error);
      if (error.message.includes('simulation') || error.message.includes('blocked')) {
        throw error; // Re-throw simulation blocks
      }
      throw new Error('CIA Scanner: Live precision scan failed');
    }
  }

  /**
   * Map database severity to typed severity
   */
  private static mapSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  /**
   * Detect false positives using advanced pattern matching
   */
  private static isFalsePositive(content: string, entityName: string): boolean {
    const contentLower = content.toLowerCase();
    const entityLower = entityName.toLowerCase();

    // Common false positive indicators
    const falsePositivePatterns = [
      'mock', 'test', 'demo', 'sample', 'example',
      'lorem ipsum', 'placeholder', 'dummy',
      'fictional', 'hypothetical', 'not real'
    ];

    // Check for false positive patterns
    for (const pattern of falsePositivePatterns) {
      if (contentLower.includes(pattern)) {
        return true;
      }
    }

    // Check for entity name in clearly non-relevant contexts
    const irrelevantContexts = [
      'username', 'handle', 'tag', 'label',
      'variable', 'function', 'class', 'id'
    ];

    for (const context of irrelevantContexts) {
      if (contentLower.includes(`${context}:`) && contentLower.includes(entityLower)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get scan statistics for performance monitoring
   */
  static async getScanStatistics(entityName: string, days: number = 7): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('aria_ops_log')
        .select('operation_data, created_at')
        .eq('operation_type', 'cia_precision_scan')
        .eq('entity_name', entityName)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scan statistics:', error);
        return null;
      }

      const totalScans = data?.length || 0;
      // Fix JSON access with proper type checking
      const totalResults = data?.reduce((sum, log) => {
        const operationData = log.operation_data as any;
        return sum + (operationData?.results_found || 0);
      }, 0) || 0;
      const avgResultsPerScan = totalScans > 0 ? totalResults / totalScans : 0;

      return {
        total_scans: totalScans,
        total_results: totalResults,
        avg_results_per_scan: Math.round(avgResultsPerScan * 100) / 100,
        scan_period_days: days,
        last_scan: data?.[0]?.created_at || null
      };

    } catch (error) {
      console.error('Failed to get scan statistics:', error);
      return null;
    }
  }

  /**
   * PERMANENTLY BLOCK mock scanning
   */
  static executeMockScan(): never {
    LiveDataEnforcer.blockSimulation('CIALevelScanner.executeMockScan');
  }
}
