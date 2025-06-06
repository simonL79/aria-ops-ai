import { supabase } from '@/integrations/supabase/client';

export interface SystemAuditResult {
  component: string;
  status: 'LIVE_VERIFIED' | 'MOCK_DETECTED' | 'SIMULATION_FOUND' | 'ERROR';
  complianceScore: number;
  details: string;
  issues: string[];
  recommendations: string[];
}

export interface ComprehensiveAuditReport {
  timestamp: string;
  auditResults: SystemAuditResult[];
  totalComponents: number;
  liveComponents: number;
  issueComponents: number;
  criticalIssues: string[];
  overallCompliance: boolean;
  executiveSummary: string;
}

export class ARIASystemAudit {
  
  /**
   * Execute comprehensive system audit for live data compliance
   */
  static async executeComprehensiveAudit(): Promise<ComprehensiveAuditReport> {
    console.log('🔍 Starting A.R.I.A™ comprehensive system audit...');
    
    const auditResults: SystemAuditResult[] = [];
    const criticalIssues: string[] = [];
    let totalComponents = 0;
    let liveComponents = 0;
    let issueComponents = 0;
    
    try {
      // Audit Core Services
      const coreAudit = await this.auditCoreServices();
      auditResults.push(coreAudit);
      totalComponents++;
      if (coreAudit.status === 'LIVE_VERIFIED') liveComponents++;
      else issueComponents++;
      
      // Audit Database Integrity
      const dbAudit = await this.auditDatabaseIntegrity();
      auditResults.push(dbAudit);
      totalComponents++;
      if (dbAudit.status === 'LIVE_VERIFIED') liveComponents++;
      else issueComponents++;
      
      // Audit Monitoring Systems
      const monitoringAudit = await this.auditMonitoringSystems();
      auditResults.push(monitoringAudit);
      totalComponents++;
      if (monitoringAudit.status === 'LIVE_VERIFIED') liveComponents++;
      else issueComponents++;
      
      // Audit Edge Functions
      const edgeFunctionsAudit = await this.auditEdgeFunctions();
      auditResults.push(edgeFunctionsAudit);
      totalComponents++;
      if (edgeFunctionsAudit.status === 'LIVE_VERIFIED') liveComponents++;
      else issueComponents++;
      
      // Audit OSINT Sources
      const osintAudit = await this.auditOSINTSources();
      auditResults.push(osintAudit);
      totalComponents++;
      if (osintAudit.status === 'LIVE_VERIFIED') liveComponents++;
      else issueComponents++;
      
      // Audit Client Systems
      const clientAudit = await this.auditClientSystems();
      auditResults.push(clientAudit);
      totalComponents++;
      if (clientAudit.status === 'LIVE_VERIFIED') liveComponents++;
      else issueComponents++;

      // Collect critical issues
      auditResults.forEach(result => {
        if (result.status === 'MOCK_DETECTED' || result.status === 'SIMULATION_FOUND') {
          criticalIssues.push(`${result.component}: ${result.details}`);
        }
      });

      const overallCompliance = issueComponents === 0;
      const executiveSummary = overallCompliance 
        ? `✅ A.R.I.A™ System Audit PASSED: All ${totalComponents} components verified using 100% live data sources. Zero mock/simulation contamination detected.`
        : `❌ A.R.I.A™ System Audit FAILED: ${issueComponents}/${totalComponents} components have critical issues requiring immediate remediation.`;

      // Log audit completion to activity logs
      try {
        await supabase.from('activity_logs').insert({
          entity_type: 'system_audit',
          action: 'comprehensive_audit_completed',
          details: `Audit completed with ${criticalIssues.length} critical issues`,
          user_email: 'system@aria.com'
        });
      } catch (logError) {
        console.warn('Failed to log audit completion:', logError);
      }

      return {
        timestamp: new Date().toISOString(),
        auditResults,
        totalComponents,
        liveComponents,
        issueComponents,
        criticalIssues,
        overallCompliance,
        executiveSummary
      };

    } catch (error) {
      console.error('❌ System audit failed:', error);
      throw new Error(`System audit execution failed: ${error.message}`);
    }
  }

  /**
   * Audit core A.R.I.A™ services
   */
  private static async auditCoreServices(): Promise<SystemAuditResult> {
    try {
      console.log('🔍 Auditing A.R.I.A™ Core Services...');
      
      // Check live data enforcer status
      const { LiveDataEnforcer } = await import('./liveDataEnforcer');
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      
      if (!compliance.isCompliant) {
        return {
          component: 'A.R.I.A™ Core Services',
          status: 'SIMULATION_FOUND',
          complianceScore: 0,
          details: `Core services compliance failed: ${compliance.message}`,
          issues: [compliance.message],
          recommendations: ['Restart A.R.I.A™ Core with enforced live data mode']
        };
      }

      // Check system configuration
      const { data: configs } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['allow_mock_data', 'system_mode', 'live_enforcement']);

      const issues: string[] = [];
      const recommendations: string[] = [];

      if (configs) {
        const configMap = new Map(configs.map(c => [c.config_key, c.config_value]));
        
        if (configMap.get('allow_mock_data') === 'enabled') {
          issues.push('Mock data is enabled in production');
          recommendations.push('Disable mock data in system configuration');
        }
        
        if (configMap.get('system_mode') !== 'live') {
          issues.push('System not in live mode');
          recommendations.push('Set system_mode to live');
        }
        
        if (configMap.get('live_enforcement') !== 'enabled') {
          issues.push('Live enforcement is disabled');
          recommendations.push('Enable live enforcement');
        }
      }

      return {
        component: 'A.R.I.A™ Core Services',
        status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
        complianceScore: issues.length === 0 ? 100 : 25,
        details: issues.length === 0 
          ? 'Core services operating with 100% live data compliance'
          : `${issues.length} configuration issues detected`,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('Core services audit failed:', error);
      return {
        component: 'A.R.I.A™ Core Services',
        status: 'ERROR',
        complianceScore: 0,
        details: `Audit failed: ${error.message}`,
        issues: [`Core services audit error: ${error.message}`],
        recommendations: ['Check A.R.I.A™ Core Services configuration and restart']
      };
    }
  }

  /**
   * Audit database integrity and live data sources
   */
  private static async auditDatabaseIntegrity(): Promise<SystemAuditResult> {
    try {
      console.log('🔍 Auditing Database Integrity...');
      
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for recent live scan results
      const { data: recentScans, count: scanCount } = await supabase
        .from('scan_results')
        .select('*', { count: 'exact' })
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (!scanCount || scanCount === 0) {
        issues.push('No live OSINT scan results in last 24 hours');
        recommendations.push('Verify OSINT scanning services are active');
      }

      // Check for mock data contamination
      const { count: mockCount } = await supabase
        .from('scan_results')
        .select('*', { count: 'exact', head: true })
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%');

      if (mockCount && mockCount > 0) {
        issues.push(`${mockCount} records contain mock/test data`);
        recommendations.push('Purge mock data from scan results');
      }

      // Check live threat ingestion
      const { count: threatCount } = await supabase
        .from('threats')
        .select('*', { count: 'exact', head: true })
        .eq('is_live', true)
        .gte('detected_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString());

      if (!threatCount || threatCount === 0) {
        issues.push('No live threats ingested in last 12 hours');
        recommendations.push('Check threat ingestion pipeline');
      }

      return {
        component: 'Database Integrity',
        status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
        complianceScore: Math.max(0, 100 - (issues.length * 25)),
        details: issues.length === 0 
          ? `Database contains ${scanCount} live scan results and ${threatCount} live threats`
          : `Database integrity issues detected: ${issues.join(', ')}`,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('Database audit failed:', error);
      return {
        component: 'Database Integrity',
        status: 'ERROR',
        complianceScore: 0,
        details: `Database audit failed: ${error.message}`,
        issues: [`Database audit error: ${error.message}`],
        recommendations: ['Check database connectivity and permissions']
      };
    }
  }

  /**
   * Audit monitoring systems and real-time feeds
   */
  private static async auditMonitoringSystems(): Promise<SystemAuditResult> {
    try {
      console.log('🔍 Auditing Monitoring Systems...');
      
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check monitoring status
      const { data: monitoringStatus } = await supabase
        .from('monitoring_status')
        .select('*')
        .order('last_run', { ascending: false })
        .limit(1);

      if (!monitoringStatus || monitoringStatus.length === 0) {
        issues.push('No monitoring status records found');
        recommendations.push('Initialize monitoring system');
      } else {
        const lastRun = new Date(monitoringStatus[0].last_run);
        const hoursSinceLastRun = (Date.now() - lastRun.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastRun > 2) {
          issues.push(`Monitoring system last run ${hoursSinceLastRun.toFixed(1)} hours ago`);
          recommendations.push('Restart monitoring services');
        }
      }

      // Check active platforms
      const { data: platforms } = await supabase
        .from('monitored_platforms')
        .select('*')
        .eq('status', 'active');

      if (!platforms || platforms.length === 0) {
        issues.push('No active monitoring platforms');
        recommendations.push('Configure and activate monitoring platforms');
      }

      return {
        component: 'Monitoring Systems',
        status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
        complianceScore: Math.max(0, 100 - (issues.length * 30)),
        details: issues.length === 0 
          ? `Monitoring systems active with ${platforms?.length || 0} platforms`
          : `Monitoring system issues: ${issues.join(', ')}`,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('Monitoring systems audit failed:', error);
      return {
        component: 'Monitoring Systems',
        status: 'ERROR',
        complianceScore: 0,
        details: `Monitoring audit failed: ${error.message}`,
        issues: [`Monitoring audit error: ${error.message}`],
        recommendations: ['Check monitoring system configuration']
      };
    }
  }

  /**
   * Audit edge functions and external integrations
   */
  private static async auditEdgeFunctions(): Promise<SystemAuditResult> {
    try {
      console.log('🔍 Auditing Edge Functions...');
      
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check recent edge function activity
      const { count: functionCount } = await supabase
        .from('edge_function_events')
        .select('*', { count: 'exact', head: true })
        .gte('executed_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString());

      if (!functionCount || functionCount === 0) {
        issues.push('No edge function activity in last 6 hours');
        recommendations.push('Check edge function deployments and triggers');
      }

      // Check for function errors
      const { count: errorCount } = await supabase
        .from('edge_function_events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'error')
        .gte('executed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (errorCount && errorCount > 0) {
        issues.push(`${errorCount} edge function errors in last 24 hours`);
        recommendations.push('Review edge function logs and fix errors');
      }

      return {
        component: 'Edge Functions',
        status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
        complianceScore: Math.max(0, 100 - (issues.length * 25)),
        details: issues.length === 0 
          ? `Edge functions active with ${functionCount} recent executions`
          : `Edge function issues: ${issues.join(', ')}`,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('Edge functions audit failed:', error);
      return {
        component: 'Edge Functions',
        status: 'ERROR',
        complianceScore: 0,
        details: `Edge functions audit failed: ${error.message}`,
        issues: [`Edge functions audit error: ${error.message}`],
        recommendations: ['Check edge function deployment status']
      };
    }
  }

  /**
   * Audit OSINT sources and live intelligence feeds
   */
  private static async auditOSINTSources(): Promise<SystemAuditResult> {
    try {
      console.log('🔍 Auditing OSINT Sources...');
      
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check content sources
      const { count: sourceCount } = await supabase
        .from('content_sources')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (!sourceCount || sourceCount === 0) {
        issues.push('No content sources updated in last 24 hours');
        recommendations.push('Verify OSINT source feeds are active');
      }

      // Check for live intelligence gathering
      const platforms = ['Reddit', 'Twitter', 'Google News', 'RSS'];
      for (const platform of platforms) {
        const { count: platformCount } = await supabase
          .from('scan_results')
          .select('*', { count: 'exact', head: true })
          .eq('platform', platform)
          .eq('source_type', 'live_osint')
          .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString());

        if (!platformCount || platformCount === 0) {
          issues.push(`No live intelligence from ${platform} in last 6 hours`);
          recommendations.push(`Check ${platform} integration and API credentials`);
        }
      }

      return {
        component: 'OSINT Sources',
        status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
        complianceScore: Math.max(0, 100 - (issues.length * 15)),
        details: issues.length === 0 
          ? 'All OSINT sources actively gathering live intelligence'
          : `OSINT source issues: ${issues.slice(0, 3).join(', ')}`,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('OSINT sources audit failed:', error);
      return {
        component: 'OSINT Sources',
        status: 'ERROR',
        complianceScore: 0,
        details: `OSINT audit failed: ${error.message}`,
        issues: [`OSINT audit error: ${error.message}`],
        recommendations: ['Check OSINT source configurations and API access']
      };
    }
  }

  /**
   * Audit client systems and data integrity
   */
  private static async auditClientSystems(): Promise<SystemAuditResult> {
    try {
      console.log('🔍 Auditing Client Systems...');
      
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check client entities for mock data
      const { count: mockEntities } = await supabase
        .from('client_entities')
        .select('*', { count: 'exact', head: true })
        .or('entity_name.ilike.%test%,entity_name.ilike.%mock%,entity_name.ilike.%demo%');

      if (mockEntities && mockEntities > 0) {
        issues.push(`${mockEntities} client entities contain test/mock names`);
        recommendations.push('Remove mock entities from client database');
      }

      // Check recent client activity
      const { count: activeClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!activeClients || activeClients === 0) {
        issues.push('No client activity in last 7 days');
        recommendations.push('Verify client onboarding and monitoring systems');
      }

      // Check intake submissions
      const { count: intakeCount } = await supabase
        .from('client_intake_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      return {
        component: 'Client Systems',
        status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
        complianceScore: Math.max(0, 100 - (issues.length * 30)),
        details: issues.length === 0 
          ? `Client systems operational with ${activeClients} active clients and ${intakeCount} recent intakes`
          : `Client system issues: ${issues.join(', ')}`,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('Client systems audit failed:', error);
      return {
        component: 'Client Systems',
        status: 'ERROR',
        complianceScore: 0,
        details: `Client systems audit failed: ${error.message}`,
        issues: [`Client systems audit error: ${error.message}`],
        recommendations: ['Check client database connectivity and data integrity']
      };
    }
  }
}

/**
 * Execute comprehensive system audit
 */
export const executeSystemAudit = ARIASystemAudit.executeComprehensiveAudit.bind(ARIASystemAudit);
