
import { supabase } from '@/integrations/supabase/client';

export interface ThreatProcessingResult {
  threatId: string;
  processed: boolean;
  actions: string[];
  severity: string;
  entityMatches: string[];
}

/**
 * A.R.I.A™ Core Threat Processor - Handles live threat analysis and processing
 */
export class AriaCoreThreatProcessor {
  
  /**
   * Process a threat through the A.R.I.A™ pipeline
   */
  static async processThreat(threatId: string): Promise<ThreatProcessingResult | null> {
    try {
      console.log(`🔍 Processing threat: ${threatId}`);
      
      // Get threat data
      const { data: threat, error } = await supabase
        .from('threats')
        .select('*')
        .eq('id', threatId)
        .single();
      
      if (error || !threat) {
        console.error('Threat not found:', error);
        return null;
      }
      
      // Analyze threat content
      const analysis = await this.analyzeThreatContent(threat.content);
      
      // Determine severity
      const severity = this.calculateSeverity(analysis);
      
      // Find entity matches
      const entityMatches = await this.findEntityMatches(threat.content);
      
      // Generate recommended actions
      const actions = this.generateActions(severity, analysis, entityMatches);
      
      // Update threat with analysis results
      await supabase
        .from('threats')
        .update({
          analysis_result: {
            ...analysis,
            entity_matches: entityMatches,
            recommended_actions: actions,
            processed_at: new Date().toISOString()
          }
        })
        .eq('id', threatId);
      
      // Log processing
      await this.logProcessing(threatId, severity, actions);
      
      return {
        threatId,
        processed: true,
        actions,
        severity,
        entityMatches
      };
      
    } catch (error) {
      console.error('Threat processing failed:', error);
      return null;
    }
  }

  /**
   * Process pending threats
   */
  static async processPendingThreats(): Promise<number> {
    try {
      const { data: pendingThreats, error } = await supabase
        .from('threats')
        .select('id')
        .is('analysis_result', null)
        .limit(10);

      if (error) {
        console.error('Failed to fetch pending threats:', error);
        return 0;
      }

      if (!pendingThreats || pendingThreats.length === 0) {
        return 0;
      }

      let processed = 0;
      for (const threat of pendingThreats) {
        const result = await this.processThreat(threat.id);
        if (result?.processed) {
          processed++;
        }
      }

      return processed;
    } catch (error) {
      console.error('Error processing pending threats:', error);
      return 0;
    }
  }

  /**
   * Validate live data integrity
   */
  static async validateLiveDataIntegrity(): Promise<any> {
    try {
      const { data: config, error } = await supabase
        .from('system_config')
        .select('*')
        .eq('config_key', 'live_enforcement')
        .single();

      if (error) {
        return { valid: false, message: 'Could not check live enforcement status' };
      }

      const isLiveEnabled = config?.config_value === 'enabled';
      
      return {
        valid: isLiveEnabled,
        message: isLiveEnabled ? 'Live data enforcement is active' : 'Live data enforcement is disabled'
      };
    } catch (error) {
      return { valid: false, message: 'Validation failed' };
    }
  }
  
  /**
   * Analyze threat content for indicators
   */
  private static async analyzeThreatContent(content: string): Promise<any> {
    // Simple content analysis - in production this would use AI/ML
    const lowerContent = content.toLowerCase();
    
    const indicators = {
      reputation_attack: ['defamation', 'libel', 'slander', 'false', 'lie', 'fraud'].some(term => lowerContent.includes(term)),
      legal_threat: ['lawsuit', 'legal', 'court', 'attorney', 'lawyer', 'sue'].some(term => lowerContent.includes(term)),
      privacy_violation: ['address', 'phone', 'email', 'personal', 'private'].some(term => lowerContent.includes(term)),
      financial_threat: ['money', 'payment', 'debt', 'financial', 'bankruptcy'].some(term => lowerContent.includes(term)),
      harassment: ['harass', 'stalk', 'threaten', 'intimidate', 'bully'].some(term => lowerContent.includes(term))
    };
    
    return {
      indicators,
      confidence: Object.values(indicators).filter(Boolean).length * 0.2,
      analyzed_at: new Date().toISOString()
    };
  }
  
  /**
   * Calculate threat severity based on analysis
   */
  private static calculateSeverity(analysis: any): string {
    const indicatorCount = Object.values(analysis.indicators).filter(Boolean).length;
    
    if (indicatorCount >= 3) return 'critical';
    if (indicatorCount >= 2) return 'high';
    if (indicatorCount >= 1) return 'medium';
    return 'low';
  }
  
  /**
   * Find entity matches in threat content
   */
  private static async findEntityMatches(content: string): Promise<string[]> {
    try {
      // Search for client entities mentioned in the content
      const { data: entities, error } = await supabase
        .from('client_entities')
        .select('entity_name')
        .or(`entity_name.ilike.%${content}%,alias.ilike.%${content}%`);
      
      if (error) {
        console.warn('Entity matching failed:', error);
        return [];
      }
      
      return entities?.map(e => e.entity_name) || [];
      
    } catch (error) {
      console.error('Entity matching error:', error);
      return [];
    }
  }
  
  /**
   * Generate recommended actions based on threat analysis
   */
  private static generateActions(severity: string, analysis: any, entityMatches: string[]): string[] {
    const actions: string[] = [];
    
    // Base actions by severity
    switch (severity) {
      case 'critical':
        actions.push('immediate_escalation', 'legal_review', 'client_notification');
        break;
      case 'high':
        actions.push('escalation', 'monitoring_increase', 'client_alert');
        break;
      case 'medium':
        actions.push('monitor', 'document', 'review');
        break;
      default:
        actions.push('log', 'monitor');
    }
    
    // Additional actions based on threat type
    if (analysis.indicators.legal_threat) {
      actions.push('legal_consultation');
    }
    
    if (analysis.indicators.privacy_violation) {
      actions.push('privacy_assessment', 'data_protection_review');
    }
    
    if (entityMatches.length > 0) {
      actions.push('client_entity_alert', 'reputation_monitoring');
    }
    
    return [...new Set(actions)]; // Remove duplicates
  }
  
  /**
   * Log threat processing for audit trail
   */
  private static async logProcessing(threatId: string, severity: string, actions: string[]): Promise<void> {
    try {
      await supabase
        .from('aria_ops_log')
        .insert({
          operation_type: 'threat_processing',
          module_source: 'AriaCore',
          success: true,
          threat_id: threatId,
          operation_data: {
            severity,
            actions,
            processed_at: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Failed to log processing:', error);
    }
  }
}

// Export for backward compatibility
export const threatProcessor = AriaCoreThreatProcessor;
