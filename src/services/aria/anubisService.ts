
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AnubisSecurityService } from './anubisSecurityService';

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

  private static async logDiagnosticSession(report: AnubisReport): Promise<void> {
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
