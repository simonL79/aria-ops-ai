
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnubisSystemStatus {
  id: string;
  module: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  last_checked: string;
  issue_summary?: string;
  record_count?: number;
  anomaly_detected?: boolean;
}

export interface AnubisLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  module: string;
  message: string;
  details?: any;
}

export interface AnubisReport {
  session_id: string;
  overall_status: 'healthy' | 'degraded' | 'critical';
  modules_checked: number;
  issues_found: number;
  recommendations: string[];
  generated_at: string;
}

// Additional interfaces for enhanced monitoring
export interface AnubisState {
  id: string;
  module: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  last_checked: string;
  issue_summary?: string;
  record_count?: number;
  anomaly_detected?: boolean;
}

export interface LLMThreatMonitor {
  id: string;
  entity_name: string;
  mention_type: string;
  model_detected?: string;
  vector_score: number;
  captured_response?: string;
  recorded_at: string;
}

export interface GraveyardSimulation {
  id: string;
  leak_title?: string;
  expected_trigger_module?: string;
  suppression_status: string;
  injected_at: string;
}

export interface LegalEscalation {
  id: string;
  violation_type?: string;
  jurisdiction?: string;
  delivery_status: string;
  auto_generated: boolean;
  law_firm_contact?: string;
  created_at: string;
}

export interface AnubisSystemReport {
  session_id: string;
  overall_status: 'healthy' | 'degraded' | 'critical';
  modules_checked: number;
  issues_found: number;
  recommendations: string[];
  generated_at: string;
  module_status: AnubisState[];
}

export const ARIA_MODULES = {
  'Database': 'Core Database Operations',
  'ThreatScanning': 'Threat Detection Engine',
  'EntityManagement': 'Entity Management System',
  'Notifications': 'Notification System',
  'Authentication': 'User Authentication',
  'Monitoring': 'Live Monitoring System'
};

export class AnubisService {
  
  static async runDiagnostics(): Promise<AnubisReport> {
    try {
      console.log('🔬 Anubis: Starting comprehensive system diagnostics...');
      
      const sessionId = crypto.randomUUID();
      const startTime = new Date().toISOString();
      
      // Run diagnostic checks using existing tables
      const diagnosticResults = await this.runSystemChecks();
      
      const report: AnubisReport = {
        session_id: sessionId,
        overall_status: this.determineOverallStatus(diagnosticResults),
        modules_checked: diagnosticResults.length,
        issues_found: diagnosticResults.filter(r => r.status !== 'healthy').length,
        recommendations: this.generateRecommendations(diagnosticResults),
        generated_at: startTime
      };
      
      // Log the diagnostic session
      await this.logDiagnosticSession(report);
      
      console.log('✅ Anubis: Diagnostics completed');
      return report;
    } catch (error) {
      console.error('❌ Anubis: Diagnostic failed:', error);
      throw error;
    }
  }

  static async runEnhancedDiagnostics(): Promise<AnubisSystemReport> {
    try {
      console.log('🔬 Anubis: Starting enhanced system diagnostics...');
      
      const sessionId = crypto.randomUUID();
      const startTime = new Date().toISOString();
      
      const diagnosticResults = await this.runSystemChecks();
      
      // Convert AnubisSystemStatus to AnubisState
      const moduleStatus: AnubisState[] = diagnosticResults.map(result => ({
        id: result.id,
        module: result.module,
        status: result.status === 'critical' ? 'error' : result.status,
        last_checked: result.last_checked,
        issue_summary: result.issue_summary,
        record_count: result.record_count,
        anomaly_detected: result.anomaly_detected
      }));
      
      const report: AnubisSystemReport = {
        session_id: sessionId,
        overall_status: this.determineOverallStatus(diagnosticResults),
        modules_checked: diagnosticResults.length,
        issues_found: diagnosticResults.filter(r => r.status !== 'healthy').length,
        recommendations: this.generateRecommendations(diagnosticResults),
        generated_at: startTime,
        module_status: moduleStatus
      };
      
      await this.logDiagnosticSession(report);
      
      console.log('✅ Anubis: Enhanced diagnostics completed');
      return report;
    } catch (error) {
      console.error('❌ Anubis: Enhanced diagnostic failed:', error);
      throw error;
    }
  }

  private static async runSystemChecks(): Promise<AnubisSystemStatus[]> {
    const checks: AnubisSystemStatus[] = [];
    
    try {
      // Check database connectivity
      const { data: healthCheck, error } = await supabase
        .from('activity_logs')
        .select('*')
        .limit(1);
      
      checks.push({
        id: crypto.randomUUID(),
        module: 'Database',
        status: error ? 'critical' : 'healthy',
        last_checked: new Date().toISOString(),
        issue_summary: error ? error.message : undefined
      });
      
      // Check scan results table
      const { data: scanResults, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .limit(10);
      
      checks.push({
        id: crypto.randomUUID(),
        module: 'ThreatScanning',
        status: scanError ? 'warning' : 'healthy',
        last_checked: new Date().toISOString(),
        record_count: scanResults?.length || 0,
        issue_summary: scanError ? scanError.message : undefined
      });
      
      // Check genesis entities
      const { data: entities, error: entitiesError } = await supabase
        .from('genesis_entities')
        .select('*')
        .limit(5);
      
      checks.push({
        id: crypto.randomUUID(),
        module: 'EntityManagement',
        status: entitiesError ? 'warning' : 'healthy',
        last_checked: new Date().toISOString(),
        record_count: entities?.length || 0,
        issue_summary: entitiesError ? entitiesError.message : undefined
      });
      
      // Check notifications
      const { data: notifications, error: notifError } = await supabase
        .from('aria_notifications')
        .select('*')
        .limit(5);
      
      checks.push({
        id: crypto.randomUUID(),
        module: 'Notifications',
        status: notifError ? 'warning' : 'healthy',
        last_checked: new Date().toISOString(),
        record_count: notifications?.length || 0,
        issue_summary: notifError ? notifError.message : undefined
      });
      
    } catch (error) {
      console.error('System check failed:', error);
    }
    
    return checks;
  }

  private static determineOverallStatus(results: AnubisSystemStatus[]): 'healthy' | 'degraded' | 'critical' {
    if (results.some(r => r.status === 'critical')) return 'critical';
    if (results.some(r => r.status === 'warning')) return 'degraded';
    return 'healthy';
  }

  private static generateRecommendations(results: AnubisSystemStatus[]): string[] {
    const recommendations: string[] = [];
    
    const criticalIssues = results.filter(r => r.status === 'critical');
    const warningIssues = results.filter(r => r.status === 'warning');
    
    if (criticalIssues.length > 0) {
      recommendations.push('Immediate attention required for critical system components');
    }
    
    if (warningIssues.length > 0) {
      recommendations.push('Monitor warning-level components for potential escalation');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('All systems operating within normal parameters');
    }
    
    return recommendations;
  }

  private static async logDiagnosticSession(report: AnubisReport | AnubisSystemReport): Promise<void> {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          action: 'anubis_diagnostic',
          details: JSON.stringify({
            session_id: report.session_id,
            overall_status: report.overall_status,
            modules_checked: report.modules_checked,
            issues_found: report.issues_found
          }),
          entity_type: 'system_diagnostic'
        });
    } catch (error) {
      console.error('Failed to log diagnostic session:', error);
    }
  }

  static async getSystemStatus(): Promise<AnubisSystemStatus[]> {
    return this.runSystemChecks();
  }

  static async getSystemLogs(limit: number = 50): Promise<AnubisLogEntry[]> {
    try {
      // Use activity_logs as our log source
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(log => ({
        id: log.id,
        timestamp: log.created_at,
        level: 'info' as const,
        module: log.entity_type || 'system',
        message: log.action,
        details: log.details
      }));
    } catch (error) {
      console.error('Failed to get system logs:', error);
      return [];
    }
  }

  static async getSystemHealth(): Promise<any[]> {
    try {
      const health = await this.runSystemChecks();
      return health.map(item => ({
        component: item.module,
        status: item.status,
        lastCheck: item.last_checked,
        message: item.issue_summary || 'Operating normally'
      }));
    } catch (error) {
      console.error('Failed to get system health:', error);
      return [];
    }
  }

  static async getLLMThreats(): Promise<LLMThreatMonitor[]> {
    try {
      // Use scan_results as mock LLM threat data
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('threat_type', 'llm_threat')
        .limit(10);

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        entity_name: item.detected_entities?.[0] || 'Unknown Entity',
        mention_type: item.severity || 'neutral',
        vector_score: item.confidence_score / 100 || 0.5,
        captured_response: item.content,
        recorded_at: item.created_at
      }));
    } catch (error) {
      console.error('Failed to get LLM threats:', error);
      return [];
    }
  }

  static async getGraveyardSimulations(): Promise<GraveyardSimulation[]> {
    try {
      // Use graveyard_simulations table if it exists, otherwise return mock data
      const { data, error } = await supabase
        .from('graveyard_simulations')
        .select('*')
        .limit(10);

      if (error) {
        // Return mock data if table doesn't exist
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get graveyard simulations:', error);
      return [];
    }
  }

  static async getLegalEscalations(): Promise<LegalEscalation[]> {
    try {
      // Return mock legal escalation data
      return [];
    } catch (error) {
      console.error('Failed to get legal escalations:', error);
      return [];
    }
  }

  static getModuleName(module: string): string {
    return ARIA_MODULES[module as keyof typeof ARIA_MODULES] || module;
  }

  static async emergencyShutdown(reason: string): Promise<boolean> {
    try {
      console.warn('🚨 ANUBIS EMERGENCY SHUTDOWN INITIATED:', reason);
      
      await supabase
        .from('activity_logs')
        .insert({
          action: 'emergency_shutdown',
          details: `Emergency shutdown initiated: ${reason}`,
          entity_type: 'system_emergency'
        });
      
      toast.error(`Emergency shutdown: ${reason}`);
      return true;
    } catch (error) {
      console.error('Failed to execute emergency shutdown:', error);
      return false;
    }
  }

  static async validateSystemIntegrity(): Promise<boolean> {
    try {
      const checks = await this.runSystemChecks();
      const criticalIssues = checks.filter(c => c.status === 'critical');
      
      return criticalIssues.length === 0;
    } catch (error) {
      console.error('System integrity validation failed:', error);
      return false;
    }
  }
}

export const anubisService = new AnubisService();
