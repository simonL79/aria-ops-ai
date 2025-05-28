
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    try {
      console.log('🔐 Triggering comprehensive A.R.I.A™ Anubis diagnostics...');
      
      // Call the Anubis Edge Function
      const { data, error } = await supabase.functions.invoke('anubis-engine');
      
      if (error) {
        console.error('Error calling Anubis engine:', error);
        toast.error('Failed to run system diagnostics');
        return null;
      }

      if (data?.success) {
        toast.success('Comprehensive system diagnostics completed');
        return {
          overall_status: data.overall_status,
          summary: data.summary,
          module_status: data.module_status || [],
          active_issues: data.active_issues || [],
          last_check: data.timestamp
        };
      } else {
        toast.error('Diagnostics completed with errors');
        return null;
      }
    } catch (error) {
      console.error('Error in runDiagnostics:', error);
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

      return data || [];
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

  async getSystemHealth(): Promise<{
    overallStatus: 'healthy' | 'warning' | 'critical';
    moduleCount: number;
    issueCount: number;
    lastCheck: string | null;
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

      return {
        overallStatus,
        moduleCount: status.length,
        issueCount,
        lastCheck
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

      status.forEach(module => {
        if (!breakdown[module.module]) {
          breakdown[module.module] = { healthy: 0, warning: 0, error: 0 };
        }
        breakdown[module.module][module.status as keyof typeof breakdown[module.module]]++;
      });

      return breakdown;
    } catch (error) {
      console.error('Error in getModuleBreakdown:', error);
      return {};
    }
  }
}

export const anubisService = new AnubisService();
