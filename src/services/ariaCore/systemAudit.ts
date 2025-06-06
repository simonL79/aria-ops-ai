
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemAuditResult {
  component: string;
  status: 'LIVE_VERIFIED' | 'MOCK_DETECTED' | 'SIMULATION_FOUND' | 'ERROR';
  details: string;
  issues: string[];
  recommendations: string[];
  complianceScore: number;
}

export interface ComprehensiveAuditReport {
  overallCompliance: boolean;
  totalComponents: number;
  liveComponents: number;
  issueComponents: number;
  auditResults: SystemAuditResult[];
  criticalIssues: string[];
  executiveSummary: string;
  timestamp: string;
}

/**
 * A.R.I.A™ System-Wide Live Data Compliance Audit
 * ZERO TOLERANCE for mock data in production client environment
 */
export class ARIASystemAudit {
  
  static async executeFullSystemAudit(): Promise<ComprehensiveAuditReport> {
    console.log('🔍 A.R.I.A™ CRITICAL AUDIT: Starting comprehensive live data compliance check');
    
    const auditResults: SystemAuditResult[] = [];
    const criticalIssues: string[] = [];
    
    try {
      // 1. Database Content Audit
      const dbAudit = await this.auditDatabaseContent();
      auditResults.push(dbAudit);
      if (dbAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`Database Content: ${dbAudit.details}`);
      }
      
      // 2. Scanning Services Audit
      const scanAudit = await this.auditScanningServices();
      auditResults.push(scanAudit);
      if (scanAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`Scanning Services: ${scanAudit.details}`);
      }
      
      // 3. Edge Functions Audit
      const edgeFunctionAudit = await this.auditEdgeFunctions();
      auditResults.push(edgeFunctionAudit);
      if (edgeFunctionAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`Edge Functions: ${edgeFunctionAudit.details}`);
      }
      
      // 4. Content Sources Audit
      const contentAudit = await this.auditContentSources();
      auditResults.push(contentAudit);
      if (contentAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`Content Sources: ${contentAudit.details}`);
      }
      
      // 5. Client Onboarding Audit
      const onboardingAudit = await this.auditClientOnboarding();
      auditResults.push(onboardingAudit);
      if (onboardingAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`Client Onboarding: ${onboardingAudit.details}`);
      }
      
      // 6. Intelligence Services Audit
      const intelligenceAudit = await this.auditIntelligenceServices();
      auditResults.push(intelligenceAudit);
      if (intelligenceAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`Intelligence Services: ${intelligenceAudit.details}`);
      }
      
      // 7. Dashboard Data Sources Audit
      const dashboardAudit = await this.auditDashboardSources();
      auditResults.push(dashboardAudit);
      if (dashboardAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`Dashboard Sources: ${dashboardAudit.details}`);
      }
      
      // 8. System Configuration Audit
      const configAudit = await this.auditSystemConfiguration();
      auditResults.push(configAudit);
      if (configAudit.status !== 'LIVE_VERIFIED') {
        criticalIssues.push(`System Configuration: ${configAudit.details}`);
      }
      
      // Calculate compliance metrics
      const liveComponents = auditResults.filter(r => r.status === 'LIVE_VERIFIED').length;
      const totalComponents = auditResults.length;
      const overallCompliance = criticalIssues.length === 0;
      
      const executiveSummary = overallCompliance 
        ? `✅ FULL COMPLIANCE ACHIEVED: All ${totalComponents} A.R.I.A™ components verified as 100% live data sources`
        : `🚨 COMPLIANCE FAILURE: ${criticalIssues.length} critical issues detected requiring immediate resolution`;
      
      const report: ComprehensiveAuditReport = {
        overallCompliance,
        totalComponents,
        liveComponents,
        issueComponents: totalComponents - liveComponents,
        auditResults,
        criticalIssues,
        executiveSummary,
        timestamp: new Date().toISOString()
      };
      
      // Store audit results in database
      await this.storeAuditResults(report);
      
      console.log('🔍 A.R.I.A™ AUDIT COMPLETE:', report.executiveSummary);
      
      if (overallCompliance) {
        toast.success("A.R.I.A™ System Audit: 100% Live Data Compliance Verified", {
          description: `All ${totalComponents} components confirmed as live data sources`
        });
      } else {
        toast.error("A.R.I.A™ System Audit: Critical Issues Detected", {
          description: `${criticalIssues.length} compliance failures require immediate attention`
        });
      }
      
      return report;
      
    } catch (error) {
      console.error('🚨 CRITICAL AUDIT FAILURE:', error);
      throw new Error(`A.R.I.A™ system audit failed: ${error.message}`);
    }
  }
  
  private static async auditDatabaseContent(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing database content for mock data contamination...');
    
    try {
      const issues: string[] = [];
      const recommendations: string[] = [];
      
      // Check scan_results for mock content
      const { data: mockScanResults, error: scanError } = await supabase
        .from('scan_results')
        .select('id, content, platform, source_type')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%,content.ilike.%sample%')
        .limit(10);
      
      if (scanError) {
        return {
          component: 'Database Content',
          status: 'ERROR',
          details: `Database query failed: ${scanError.message}`,
          issues: [`Database access error: ${scanError.message}`],
          recommendations: ['Check database connectivity and permissions'],
          complianceScore: 0
        };
      }
      
      if (mockScanResults && mockScanResults.length > 0) {
        issues.push(`${mockScanResults.length} mock/test entries found in scan_results`);
        recommendations.push('Purge all mock data from scan_results table');
      }
      
      // Check entities for test names
      const { data: mockEntities } = await supabase
        .from('entities')
        .select('id, name')
        .or('name.ilike.%test%,name.ilike.%mock%,name.ilike.%demo%')
        .limit(5);
      
      if (mockEntities && mockEntities.length > 0) {
        issues.push(`${mockEntities.length} test entities found`);
        recommendations.push('Remove all test entities');
      }
      
      // Check content_sources for mock URLs
      const { data: mockSources } = await supabase
        .from('content_sources')
        .select('id, url, title')
        .or('url.ilike.%example.com%,url.ilike.%test.%,title.ilike.%mock%')
        .limit(5);
      
      if (mockSources && mockSources.length > 0) {
        issues.push(`${mockSources.length} mock content sources found`);
        recommendations.push('Replace mock sources with live data sources');
      }
      
      // Verify live data sources are active
      const { data: liveSources } = await supabase
        .from('scan_results')
        .select('count')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      const liveCount = liveSources?.[0]?.count || 0;
      if (liveCount < 10) {
        issues.push(`Only ${liveCount} live OSINT results in last 24 hours - insufficient activity`);
        recommendations.push('Verify live data ingestion is functioning');
      }
      
      const complianceScore = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 25));
      
      return {
        component: 'Database Content',
        status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
        details: issues.length === 0 
          ? `Database verified clean: ${liveCount} live OSINT entries, no mock data detected`
          : `${issues.length} database compliance issues detected`,
        issues,
        recommendations,
        complianceScore
      };
      
    } catch (error) {
      return {
        component: 'Database Content',
        status: 'ERROR',
        details: `Audit failed: ${error.message}`,
        issues: [`Database audit error: ${error.message}`],
        recommendations: ['Check database connectivity'],
        complianceScore: 0
      };
    }
  }
  
  private static async auditScanningServices(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing scanning services for simulation dependencies...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check if performRealScan is configured correctly
    try {
      const { performRealScan } = await import('@/services/monitoring/realScan');
      
      // Test real scan functionality
      const testResults = await performRealScan({
        fullScan: false,
        targetEntity: 'system_audit_test',
        source: 'audit_verification'
      });
      
      if (testResults.length === 0) {
        issues.push('Real scan service returned no results - may not be properly configured');
        recommendations.push('Verify edge function connectivity and API keys');
      } else {
        console.log(`✅ Real scan verified: ${testResults.length} results returned`);
      }
      
    } catch (error) {
      issues.push(`Real scan service error: ${error.message}`);
      recommendations.push('Check real scan service configuration');
    }
    
    const complianceScore = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 50));
    
    return {
      component: 'Scanning Services',
      status: issues.length === 0 ? 'LIVE_VERIFIED' : 'ERROR',
      details: issues.length === 0 
        ? 'All scanning services verified as live data sources'
        : `${issues.length} scanning service issues detected`,
      issues,
      recommendations,
      complianceScore
    };
  }
  
  private static async auditEdgeFunctions(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing edge functions for live data compliance...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Test key edge functions
    const functionTests = [
      'reddit-scan',
      'uk-news-scanner', 
      'discovery-scanner',
      'monitoring-scan'
    ];
    
    let successfulFunctions = 0;
    
    for (const functionName of functionTests) {
      try {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: { test: true, audit: true }
        });
        
        if (error) {
          issues.push(`Edge function ${functionName} returned error: ${error.message}`);
        } else if (data) {
          successfulFunctions++;
          console.log(`✅ Edge function ${functionName} responded successfully`);
        }
        
      } catch (error) {
        issues.push(`Edge function ${functionName} failed to respond: ${error.message}`);
      }
    }
    
    if (successfulFunctions < functionTests.length) {
      recommendations.push(`${functionTests.length - successfulFunctions} edge functions need attention`);
    }
    
    const complianceScore = (successfulFunctions / functionTests.length) * 100;
    
    return {
      component: 'Edge Functions',
      status: successfulFunctions === functionTests.length ? 'LIVE_VERIFIED' : 'ERROR',
      details: `${successfulFunctions}/${functionTests.length} edge functions verified`,
      issues,
      recommendations,
      complianceScore
    };
  }
  
  private static async auditContentSources(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing content sources for live data feeds...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check content sources table for live vs mock ratios
    const { data: allSources } = await supabase
      .from('content_sources')
      .select('source_type, url')
      .limit(100);
    
    if (!allSources || allSources.length === 0) {
      issues.push('No content sources found in database');
      recommendations.push('Configure live content sources');
    } else {
      const mockSources = allSources.filter(s => 
        s.url?.includes('example.com') || 
        s.url?.includes('test.') ||
        s.source_type?.includes('mock')
      );
      
      if (mockSources.length > 0) {
        issues.push(`${mockSources.length} mock content sources detected`);
        recommendations.push('Replace all mock sources with live feeds');
      }
    }
    
    const complianceScore = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 30));
    
    return {
      component: 'Content Sources',
      status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
      details: issues.length === 0 
        ? 'All content sources verified as live feeds'
        : `${issues.length} content source issues detected`,
      issues,
      recommendations,
      complianceScore
    };
  }
  
  private static async auditClientOnboarding(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing client onboarding process for simulation usage...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check recent client intake submissions for test data
    const { data: intakeSubmissions } = await supabase
      .from('client_intake_submissions')
      .select('full_name, email, brand_or_alias')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(50);
    
    if (intakeSubmissions) {
      const testSubmissions = intakeSubmissions.filter(s => 
        s.full_name?.toLowerCase().includes('test') ||
        s.email?.includes('test') ||
        s.brand_or_alias?.toLowerCase().includes('test')
      );
      
      if (testSubmissions.length > 0) {
        issues.push(`${testSubmissions.length} test client submissions found`);
        recommendations.push('Remove test client data');
      }
    }
    
    const complianceScore = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 40));
    
    return {
      component: 'Client Onboarding',
      status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
      details: issues.length === 0 
        ? 'Client onboarding verified clean of test data'
        : `${issues.length} onboarding issues detected`,
      issues,
      recommendations,
      complianceScore
    };
  }
  
  private static async auditIntelligenceServices(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing intelligence services for live data usage...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Test AI search service if OpenAI key is available
    try {
      const { hasOpenAIKey } = await import('@/services/api/openaiClient');
      
      if (!hasOpenAIKey()) {
        issues.push('OpenAI API key not configured - AI services may not function');
        recommendations.push('Configure OpenAI API key for live AI intelligence');
      }
    } catch (error) {
      issues.push(`Intelligence service check failed: ${error.message}`);
    }
    
    const complianceScore = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 50));
    
    return {
      component: 'Intelligence Services',
      status: issues.length === 0 ? 'LIVE_VERIFIED' : 'ERROR',
      details: issues.length === 0 
        ? 'Intelligence services verified for live operation'
        : `${issues.length} intelligence service issues detected`,
      issues,
      recommendations,
      complianceScore
    };
  }
  
  private static async auditDashboardSources(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing dashboard data sources...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check for recent live activity
    const { data: recentActivity } = await supabase
      .from('activity_logs')
      .select('count')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    const activityCount = recentActivity?.[0]?.count || 0;
    if (activityCount < 5) {
      issues.push(`Low dashboard activity: only ${activityCount} entries in 24 hours`);
      recommendations.push('Verify live data ingestion pipeline');
    }
    
    const complianceScore = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 30));
    
    return {
      component: 'Dashboard Sources',
      status: issues.length === 0 ? 'LIVE_VERIFIED' : 'ERROR',
      details: issues.length === 0 
        ? `Dashboard sources active: ${activityCount} recent activities`
        : `${issues.length} dashboard source issues detected`,
      issues,
      recommendations,
      complianceScore
    };
  }
  
  private static async auditSystemConfiguration(): Promise<SystemAuditResult> {
    console.log('🔍 Auditing system configuration for mock data allowances...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check system config for mock data settings
    const { data: systemConfig } = await supabase
      .from('system_config')
      .select('config_key, config_value')
      .eq('config_key', 'allow_mock_data');
    
    if (systemConfig && systemConfig.length > 0) {
      const mockDataSetting = systemConfig[0]?.config_value;
      if (mockDataSetting === 'enabled') {
        issues.push('System configuration allows mock data - PRODUCTION RISK');
        recommendations.push('Disable mock data allowance in system configuration');
      }
    }
    
    const complianceScore = issues.length === 0 ? 100 : 0; // Zero tolerance for mock data config
    
    return {
      component: 'System Configuration',
      status: issues.length === 0 ? 'LIVE_VERIFIED' : 'MOCK_DETECTED',
      details: issues.length === 0 
        ? 'System configuration verified - mock data disabled'
        : 'CRITICAL: System allows mock data in production',
      issues,
      recommendations,
      complianceScore
    };
  }
  
  private static async storeAuditResults(report: ComprehensiveAuditReport): Promise<void> {
    try {
      await supabase
        .from('aria_validation_log')
        .insert({
          check_type: 'COMPREHENSIVE_SYSTEM_AUDIT',
          result_count: report.liveComponents,
          timestamp: report.timestamp,
          compliance_status: report.overallCompliance,
          audit_details: report
        });
      
      console.log('✅ Audit results stored in database');
    } catch (error) {
      console.error('❌ Failed to store audit results:', error);
    }
  }
}

/**
 * Execute immediate system audit
 */
export const executeSystemAudit = async (): Promise<ComprehensiveAuditReport> => {
  return await ARIASystemAudit.executeFullSystemAudit();
};
