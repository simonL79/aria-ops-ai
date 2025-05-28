
import { supabase } from '@/integrations/supabase/client';
import { anubisSecurityService } from './anubisSecurityService';
import { anubisService } from './anubisService';
import { toast } from 'sonner';

export interface AnubisActivityLog {
  module: string;
  activity_type: string;
  user_id?: string;
  metadata: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source_component: string;
}

export interface AnubisMetrics {
  module: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  timestamp: string;
}

class AnubisIntegrationService {
  // Core activity logging for all A.R.I.A™ modules
  async logActivity(activity: AnubisActivityLog): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_activity_log')
        .insert({
          module: activity.module,
          activity_type: activity.activity_type,
          user_id: activity.user_id,
          metadata: activity.metadata,
          severity: activity.severity,
          source_component: activity.source_component
        });

      if (error) {
        console.error('Anubis activity logging failed:', error);
        return false;
      }

      // If critical severity, trigger immediate alert
      if (activity.severity === 'critical') {
        await this.triggerCriticalAlert(activity);
      }

      return true;
    } catch (error) {
      console.error('Error in Anubis logActivity:', error);
      return false;
    }
  }

  // Performance metrics tracking
  async recordMetric(metric: AnubisMetrics): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_metrics')
        .insert(metric);

      if (error) {
        console.error('Anubis metrics recording failed:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in Anubis recordMetric:', error);
      return false;
    }
  }

  // SOVRA Decision Engine Integration
  async logSovraDecision(threatId: string, decision: string, confidence: number, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'SOVRA',
      activity_type: 'decision_made',
      user_id: userId,
      metadata: {
        threat_id: threatId,
        decision,
        confidence,
        timestamp: new Date().toISOString()
      },
      severity: decision === 'approved' ? 'warning' : 'info',
      source_component: 'SovraDecisionEngine'
    });
  }

  // Emergency Strike Engine Integration
  async logEmergencyStrike(threatId: string, action: string, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'EMERGENCY_STRIKE',
      activity_type: 'emergency_action',
      user_id: userId,
      metadata: {
        threat_id: threatId,
        action,
        timestamp: new Date().toISOString()
      },
      severity: 'critical',
      source_component: 'EmergencyStrikeEngine'
    });
  }

  // Clean Launch Integration
  async logCleanLaunchEvent(eventType: string, details: any, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'CLEAN_LAUNCH',
      activity_type: eventType,
      user_id: userId,
      metadata: details,
      severity: 'info',
      source_component: 'CleanLaunchPipeline'
    });
  }

  // EIDETIC Memory Integration
  async logEideticAccess(memoryId: string, accessType: string, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'EIDETIC',
      activity_type: 'memory_access',
      user_id: userId,
      metadata: {
        memory_id: memoryId,
        access_type: accessType,
        timestamp: new Date().toISOString()
      },
      severity: 'info',
      source_component: 'EideticMemorySystem'
    });
  }

  // Compliance Dashboard Integration
  async logComplianceEvent(eventType: string, details: any, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'COMPLIANCE',
      activity_type: eventType,
      user_id: userId,
      metadata: details,
      severity: eventType.includes('violation') ? 'error' : 'info',
      source_component: 'ComplianceDashboard'
    });
  }

  // Client Management Integration
  async logClientActivity(clientId: string, activity: string, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'CLIENT_MANAGEMENT',
      activity_type: activity,
      user_id: userId,
      metadata: {
        client_id: clientId,
        timestamp: new Date().toISOString()
      },
      severity: 'info',
      source_component: 'ClientManagement'
    });
  }

  // RSI Threat Simulation Integration
  async logRSISimulation(simulationId: string, results: any, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'RSI',
      activity_type: 'threat_simulation',
      user_id: userId,
      metadata: {
        simulation_id: simulationId,
        results,
        timestamp: new Date().toISOString()
      },
      severity: results.risk_level === 'high' ? 'warning' : 'info',
      source_component: 'RSIThreatSimulator'
    });
  }

  // PRAXIS Crisis Forecasting Integration
  async logPraxisForecast(forecastId: string, predictions: any, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'PRAXIS',
      activity_type: 'crisis_forecast',
      user_id: userId,
      metadata: {
        forecast_id: forecastId,
        predictions,
        timestamp: new Date().toISOString()
      },
      severity: predictions.crisis_probability > 0.7 ? 'warning' : 'info',
      source_component: 'PraxisCrisisForecasting'
    });
  }

  // Discovery Scanner Integration
  async logDiscoveryEvent(scanType: string, results: any, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'DISCOVERY',
      activity_type: 'scan_completed',
      user_id: userId,
      metadata: {
        scan_type: scanType,
        results_count: results.length || 0,
        timestamp: new Date().toISOString()
      },
      severity: 'info',
      source_component: 'DiscoveryScanner'
    });
  }

  // HyperCore Integration
  async logHyperCoreActivity(activity: string, details: any, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'HYPERCORE',
      activity_type: activity,
      user_id: userId,
      metadata: details,
      severity: activity.includes('error') ? 'error' : 'info',
      source_component: 'HyperCore'
    });
  }

  // Graveyard Archive Integration
  async logGraveyardAccess(archiveId: string, accessType: string, userId?: string): Promise<void> {
    await this.logActivity({
      module: 'GRAVEYARD',
      activity_type: 'archive_access',
      user_id: userId,
      metadata: {
        archive_id: archiveId,
        access_type: accessType,
        timestamp: new Date().toISOString()
      },
      severity: 'info',
      source_component: 'GraveyardArchive'
    });
  }

  // Critical alert system
  private async triggerCriticalAlert(activity: AnubisActivityLog): Promise<void> {
    try {
      // Queue Slack alert for critical events
      await anubisSecurityService.queueSlackEvent({
        channel: '#aria-critical-alerts',
        event_type: 'critical_activity',
        payload: {
          module: activity.module,
          activity: activity.activity_type,
          component: activity.source_component,
          timestamp: new Date().toISOString(),
          metadata: activity.metadata
        }
      });

      // Log as security event
      await anubisSecurityService.logTestResult({
        module: activity.module,
        test_name: 'critical_activity_detected',
        passed: false,
        execution_time_ms: 0,
        error_message: `Critical activity in ${activity.source_component}: ${activity.activity_type}`
      });

    } catch (error) {
      console.error('Failed to trigger critical alert:', error);
    }
  }

  // System-wide health check
  async performSystemHealthCheck(): Promise<any> {
    const modules = [
      'SOVRA', 'EMERGENCY_STRIKE', 'CLEAN_LAUNCH', 'EIDETIC', 
      'COMPLIANCE', 'CLIENT_MANAGEMENT', 'RSI', 'PRAXIS', 
      'DISCOVERY', 'HYPERCORE', 'GRAVEYARD'
    ];

    const healthReport = {
      overall_status: 'healthy',
      module_statuses: [] as any[],
      timestamp: new Date().toISOString()
    };

    for (const module of modules) {
      try {
        // Check recent activity for each module
        const { data, error } = await supabase
          .from('anubis_activity_log')
          .select('*')
          .eq('module', module)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        const recentActivity = data || [];
        const errorCount = recentActivity.filter(a => a.severity === 'error' || a.severity === 'critical').length;
        
        const moduleStatus = {
          module,
          status: errorCount > 5 ? 'error' : errorCount > 2 ? 'warning' : 'healthy',
          recent_activity_count: recentActivity.length,
          error_count: errorCount,
          last_activity: recentActivity[0]?.created_at || null
        };

        healthReport.module_statuses.push(moduleStatus);

        if (moduleStatus.status === 'error') {
          healthReport.overall_status = 'error';
        } else if (moduleStatus.status === 'warning' && healthReport.overall_status === 'healthy') {
          healthReport.overall_status = 'warning';
        }

      } catch (error) {
        console.error(`Health check failed for ${module}:`, error);
        healthReport.module_statuses.push({
          module,
          status: 'error',
          error: error.message
        });
        healthReport.overall_status = 'error';
      }
    }

    // Log the health check results
    await this.logActivity({
      module: 'ANUBIS',
      activity_type: 'system_health_check',
      metadata: healthReport,
      severity: healthReport.overall_status === 'healthy' ? 'info' : 'warning',
      source_component: 'AnubisIntegrationService'
    });

    return healthReport;
  }

  // Get comprehensive system metrics
  async getSystemMetrics(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<any> {
    const timeframeMilis = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    const since = new Date(Date.now() - timeframeMilis[timeframe]).toISOString();

    try {
      const { data: activities, error } = await supabase
        .from('anubis_activity_log')
        .select('*')
        .gte('created_at', since);

      if (error) throw error;

      const metrics = {
        timeframe,
        total_activities: activities?.length || 0,
        by_module: {} as Record<string, any>,
        by_severity: {} as Record<string, number>,
        critical_events: activities?.filter(a => a.severity === 'critical') || [],
        most_active_components: {} as Record<string, number>
      };

      activities?.forEach(activity => {
        // By module
        if (!metrics.by_module[activity.module]) {
          metrics.by_module[activity.module] = {
            total: 0,
            by_severity: { info: 0, warning: 0, error: 0, critical: 0 }
          };
        }
        metrics.by_module[activity.module].total++;
        metrics.by_module[activity.module].by_severity[activity.severity]++;

        // By severity
        metrics.by_severity[activity.severity] = (metrics.by_severity[activity.severity] || 0) + 1;

        // By component
        metrics.most_active_components[activity.source_component] = 
          (metrics.most_active_components[activity.source_component] || 0) + 1;
      });

      return metrics;
    } catch (error) {
      console.error('Error getting system metrics:', error);
      return null;
    }
  }
}

export const anubisIntegrationService = new AnubisIntegrationService();
