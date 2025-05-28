import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { anubisSecurityService } from './anubisSecurityService';

export interface AnubisState {
  id: string;
  module: string;
  status: 'healthy' | 'warning' | 'error';
  last_checked: string;
  issue_summary: string;
  record_count: number;
  anomaly_detected: boolean;
}

export interface AnubisLogEntry {
  id: string;
  module: string;
  check_type: string;
  result_status: string;
  details: string;
  checked_at: string;
}

export interface AnubisSystemReport {
  overall_status: 'healthy' | 'warning' | 'critical';
  summary: {
    healthy_modules: number;
    warning_modules: number;
    error_modules: number;
    total_modules: number;
  };
  module_status: AnubisState[];
  active_issues: AnubisState[];
  last_check: string;
}

export interface LLMThreatMonitor {
  id: string;
  entity_name: string;
  model_detected?: string;
  vector_score: number;
  mention_type: 'neutral' | 'threatening' | 'false_claim' | 'attack';
  captured_prompt?: string;
  captured_response?: string;
  recorded_at: string;
}

export interface GraveyardSimulation {
  id: string;
  leak_title?: string;
  synthetic_link?: string;
  expected_trigger_module?: string;
  suppression_status: string;
  injected_at: string;
  completed_at?: string;
}

export interface LegalEscalation {
  id: string;
  violation_type?: string;
  entity_id?: string;
  auto_generated: boolean;
  jurisdiction?: string;
  packet_payload: any;
  delivery_status: 'pending' | 'dispatched' | 'error';
  law_firm_contact?: string;
  created_at: string;
  dispatched_at?: string;
}

// A.R.I.A™ Module definitions for comprehensive monitoring
export const ARIA_MODULES = {
  RSI: 'Rapid Sentiment Intervention',
  STI: 'Synthetic Threats Intelligence',
  Dispatch: 'Event Dispatch System',
  OpsLog: 'Operations Logging',
  CEREBRA: 'Memory Override System',
  PRAXIS: 'Crisis Forecasting',
  EIDETIC: 'Memory Decay Management',
  Narrative: 'Narrative Clustering',
  EntityRisk: 'Entity Risk Profiling',
  ContentAlerts: 'Content Alert Processing',
  ScanResults: 'Scan Results Management',
  DarkWeb: 'Dark Web Intelligence',
  Clients: 'Client Management',
  Reports: 'Executive Reporting',
  Notifications: 'Notification System',
  CleanLaunch: 'Clean Launch Pipeline'
} as const;

class AnubisService {
  async runDiagnostics(): Promise<AnubisSystemReport | null> {
    const startTime = Date.now();
    
    try {
      console.log('🔐 Triggering comprehensive A.R.I.A™ Anubis diagnostics...');
      
      // Log test start
      await anubisSecurityService.logTestResult({
        module: 'AnubisCore',
        test_name: 'comprehensive_diagnostics',
        passed: false, // Will update on success
        execution_time_ms: 0
      });

      // Call the Anubis Edge Function
      const { data, error } = await supabase.functions.invoke('anubis-engine');
      
      if (error) {
        const executionTime = Date.now() - startTime;
        console.error('Error calling Anubis engine:', error);
        
        // Log test failure
        await anubisSecurityService.logTestResult({
          module: 'AnubisCore',
          test_name: 'comprehensive_diagnostics',
          passed: false,
          execution_time_ms: executionTime,
          error_message: error.message
        });
        
        toast.error('Failed to run system diagnostics');
        return null;
      }

      const executionTime = Date.now() - startTime;

      if (data?.success) {
        // Log successful test
        await anubisSecurityService.logTestResult({
          module: 'AnubisCore',
          test_name: 'comprehensive_diagnostics',
          passed: true,
          execution_time_ms: executionTime
        });

        // Queue Slack notification for successful diagnostics
        await anubisSecurityService.queueSlackEvent({
          channel: '#anubis-alerts',
          event_type: 'diagnostics_completed',
          payload: {
            overall_status: data.overall_status,
            summary: data.summary,
            timestamp: data.timestamp,
            execution_time_ms: executionTime
          }
        });

        toast.success('Comprehensive system diagnostics completed');
        return {
          overall_status: data.overall_status,
          summary: data.summary,
          module_status: data.module_status || [],
          active_issues: data.active_issues || [],
          last_check: data.timestamp
        };
      } else {
        // Log test failure for unsuccessful response
        await anubisSecurityService.logTestResult({
          module: 'AnubisCore',
          test_name: 'comprehensive_diagnostics',
          passed: false,
          execution_time_ms: executionTime,
          error_message: 'Diagnostics completed with errors'
        });

        toast.error('Diagnostics completed with errors');
        return null;
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('Error in runDiagnostics:', error);
      
      // Log test failure
      await anubisSecurityService.logTestResult({
        module: 'AnubisCore',
        test_name: 'comprehensive_diagnostics',
        passed: false,
        execution_time_ms: executionTime,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      toast.error('Failed to run system diagnostics');
      return null;
    }
  }

  async getSystemStatus(): Promise<AnubisState[]> {
    try {
      const { data, error } = await supabase
        .from('anubis_state')
        .select('*')
        .order('last_checked', { ascending: false });

      if (error) {
        console.error('Error fetching system status:', error);
        return [];
      }

      // Type assertion to ensure proper typing from database
      return (data || []).map(item => ({
        id: item.id,
        module: item.module,
        status: item.status as 'healthy' | 'warning' | 'error',
        last_checked: item.last_checked,
        issue_summary: item.issue_summary,
        record_count: item.record_count,
        anomaly_detected: item.anomaly_detected
      }));
    } catch (error) {
      console.error('Error in getSystemStatus:', error);
      return [];
    }
  }

  async getSystemLogs(limit = 50): Promise<AnubisLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('anubis_log')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching system logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSystemLogs:', error);
      return [];
    }
  }

  async getLLMThreats(limit = 20): Promise<LLMThreatMonitor[]> {
    try {
      const { data, error } = await supabase
        .from('llm_threat_monitor')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching LLM threats:', error);
        return [];
      }

      // Type assertion to ensure proper typing from database
      return (data || []).map(item => ({
        id: item.id,
        entity_name: item.entity_name,
        model_detected: item.model_detected,
        vector_score: item.vector_score,
        mention_type: item.mention_type as 'neutral' | 'threatening' | 'false_claim' | 'attack',
        captured_prompt: item.captured_prompt,
        captured_response: item.captured_response,
        recorded_at: item.recorded_at
      }));
    } catch (error) {
      console.error('Error in getLLMThreats:', error);
      return [];
    }
  }

  async getGraveyardSimulations(limit = 20): Promise<GraveyardSimulation[]> {
    try {
      const { data, error } = await supabase
        .from('graveyard_simulations')
        .select('*')
        .order('injected_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching graveyard simulations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getGraveyardSimulations:', error);
      return [];
    }
  }

  async getLegalEscalations(limit = 20): Promise<LegalEscalation[]> {
    try {
      const { data, error } = await supabase
        .from('legal_escalation_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching legal escalations:', error);
        return [];
      }

      // Type assertion to ensure proper typing from database
      return (data || []).map(item => ({
        id: item.id,
        violation_type: item.violation_type,
        entity_id: item.entity_id,
        auto_generated: item.auto_generated,
        jurisdiction: item.jurisdiction,
        packet_payload: item.packet_payload,
        delivery_status: item.delivery_status as 'pending' | 'dispatched' | 'error',
        law_firm_contact: item.law_firm_contact,
        created_at: item.created_at,
        dispatched_at: item.dispatched_at
      }));
    } catch (error) {
      console.error('Error in getLegalEscalations:', error);
      return [];
    }
  }

  async getSystemHealth(): Promise<{
    overallStatus: 'healthy' | 'warning' | 'critical';
    moduleCount: number;
    issueCount: number;
    lastCheck: string | null;
    securityMetrics?: any;
  }> {
    try {
      const status = await this.getSystemStatus();
      
      const healthyCount = status.filter(s => s.status === 'healthy').length;
      const warningCount = status.filter(s => s.status === 'warning').length;
      const errorCount = status.filter(s => s.status === 'error').length;
      const issueCount = status.filter(s => s.anomaly_detected).length;

      let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (errorCount > 0) {
        overallStatus = 'critical';
      } else if (warningCount > 0) {
        overallStatus = 'warning';
      }

      const lastCheck = status.length > 0 ? status[0].last_checked : null;

      // Get enhanced security metrics
      const securityMetrics = await anubisSecurityService.getSecurityMetrics();

      return {
        overallStatus,
        moduleCount: status.length,
        issueCount,
        lastCheck,
        securityMetrics
      };
    } catch (error) {
      console.error('Error in getSystemHealth:', error);
      return {
        overallStatus: 'critical',
        moduleCount: 0,
        issueCount: 0,
        lastCheck: null
      };
    }
  }

  getModuleName(moduleCode: string): string {
    return ARIA_MODULES[moduleCode as keyof typeof ARIA_MODULES] || moduleCode;
  }

  async getModuleBreakdown(): Promise<Record<string, { healthy: number; warning: number; error: number }>> {
    try {
      const status = await this.getSystemStatus();
      const breakdown: Record<string, { healthy: number; warning: number; error: number }> = {};

      status.forEach(moduleStatus => {
        if (!breakdown[moduleStatus.module]) {
          breakdown[moduleStatus.module] = { healthy: 0, warning: 0, error: 0 };
        }
        breakdown[moduleStatus.module][moduleStatus.status]++;
      });

      return breakdown;
    } catch (error) {
      console.error('Error in getModuleBreakdown:', error);
      return {};
    }
  }

  async runEnhancedDiagnostics(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 Running enhanced A.R.I.A™ diagnostics with admin security...');
      
      // Log enhanced diagnostics test
      await anubisSecurityService.logTestResult({
        module: 'AnubisEnhanced',
        test_name: 'enhanced_diagnostics',
        passed: false, // Will update on success
        execution_time_ms: 0
      });
      
      // Use the new secure admin trigger function
      const { data, error } = await supabase.rpc('admin_trigger_anubis');
      
      const executionTime = Date.now() - startTime;
      
      if (error) {
        console.error('Error running enhanced diagnostics:', error);
        
        // Log test failure
        await anubisSecurityService.logTestResult({
          module: 'AnubisEnhanced',
          test_name: 'enhanced_diagnostics',
          passed: false,
          execution_time_ms: executionTime,
          error_message: error.message
        });

        if (error.message.includes('Access denied')) {
          toast.error('Access denied: Admin privileges required');
        } else {
          toast.error('Enhanced diagnostics failed');
        }
        return;
      }

      // Log successful test
      await anubisSecurityService.logTestResult({
        module: 'AnubisEnhanced',
        test_name: 'enhanced_diagnostics',
        passed: true,
        execution_time_ms: executionTime
      });

      // Queue Slack notification
      await anubisSecurityService.queueSlackEvent({
        channel: '#anubis-alerts',
        event_type: 'enhanced_diagnostics_completed',
        payload: {
          result: data,
          execution_time_ms: executionTime,
          timestamp: new Date().toISOString()
        }
      });

      toast.success('Enhanced A.R.I.A™ diagnostics completed');
      console.log('Enhanced diagnostics result:', data);
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('Error in runEnhancedDiagnostics:', error);
      
      // Log test failure
      await anubisSecurityService.logTestResult({
        module: 'AnubisEnhanced',
        test_name: 'enhanced_diagnostics',
        passed: false,
        execution_time_ms: executionTime,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      toast.error('Failed to run enhanced diagnostics');
    }
  }
}

export const anubisService = new AnubisService();
