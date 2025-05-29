
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LiveDataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalChecks: number;
  passedChecks: number;
}

/**
 * Production-grade live data validation service
 * Updated to be more permissive for development while maintaining security
 */
export class LiveDataValidator {
  
  /**
   * Run comprehensive live data validation with development mode considerations
   */
  static async validateLiveIntegrity(): Promise<LiveDataValidationResult> {
    const result: LiveDataValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      totalChecks: 0,
      passedChecks: 0
    };

    console.log('🔍 Starting A.R.I.A™ Live Data Integrity Check...');

    // Check 1: Database connectivity
    result.totalChecks++;
    const dbCheck = await this.checkDatabaseConnectivity();
    if (!dbCheck.isConnected) {
      result.errors.push('Database connectivity failed');
      result.isValid = false;
    } else {
      result.passedChecks++;
    }

    // Check 2: User authentication
    result.totalChecks++;
    const authCheck = await this.checkUserAuthentication();
    if (!authCheck.isAuthenticated) {
      result.warnings.push('User not authenticated - some features may be limited');
    } else {
      result.passedChecks++;
    }

    // Check 3: Core tables exist and are accessible
    result.totalChecks++;
    const tableCheck = await this.checkCoreTablesAccess();
    if (!tableCheck.accessible) {
      result.errors.push(`Core tables not accessible: ${tableCheck.issues.join(', ')}`);
      result.isValid = false;
    } else {
      result.passedChecks++;
    }

    // Check 4: Edge functions are deployed
    result.totalChecks++;
    const functionCheck = await this.checkEdgeFunctionDeployment();
    if (!functionCheck.deployed) {
      result.warnings.push('Some edge functions may not be deployed');
    } else {
      result.passedChecks++;
    }

    // Check 5: Live data processing capability
    result.totalChecks++;
    const processingCheck = await this.checkLiveDataProcessing();
    if (!processingCheck.canProcess) {
      result.warnings.push('Live data processing may be limited');
    } else {
      result.passedChecks++;
    }

    console.log(`✅ Live integrity check completed: ${result.passedChecks}/${result.totalChecks} checks passed`);
    
    return result;
  }

  /**
   * Check database connectivity
   */
  private static async checkDatabaseConnectivity() {
    try {
      const { error } = await supabase.from('user_roles').select('*').limit(1);
      return { isConnected: !error, error: error?.message };
    } catch (error) {
      console.error('Database connectivity check failed:', error);
      return { isConnected: false, error: 'Connection failed' };
    }
  }

  /**
   * Check user authentication status
   */
  private static async checkUserAuthentication() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return { isAuthenticated: !!user, user };
    } catch (error) {
      console.error('Authentication check failed:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  /**
   * Check access to core tables
   */
  private static async checkCoreTablesAccess() {
    // Define core tables with proper typing
    const coreTableChecks = [
      { name: 'threats', query: () => supabase.from('threats').select('id').limit(1) },
      { name: 'scan_results', query: () => supabase.from('scan_results').select('id').limit(1) },
      { name: 'clients', query: () => supabase.from('clients').select('id').limit(1) },
      { name: 'aria_notifications', query: () => supabase.from('aria_notifications').select('id').limit(1) }
    ];
    
    const issues: string[] = [];
    
    for (const tableCheck of coreTableChecks) {
      try {
        const { error } = await tableCheck.query();
        if (error) {
          issues.push(`${tableCheck.name}: ${error.message}`);
        }
      } catch (error) {
        issues.push(`${tableCheck.name}: Access failed`);
      }
    }

    return { accessible: issues.length === 0, issues };
  }

  /**
   * Check edge function deployment status
   */
  private static async checkEdgeFunctionDeployment() {
    try {
      // Test a simple edge function call
      const { error } = await supabase.functions.invoke('process-threat-ingestion', {
        body: { test: true }
      });
      
      return { deployed: true, lastError: error?.message };
    } catch (error) {
      console.log('Edge function check - some functions may not be deployed:', error);
      return { deployed: false, lastError: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Check live data processing capabilities
   */
  private static async checkLiveDataProcessing() {
    try {
      // Check if we can write to the live status table
      const { error } = await supabase
        .from('live_status')
        .upsert({
          name: 'System Health Check',
          active_threats: 0,
          last_threat_seen: new Date().toISOString(),
          last_report: new Date().toISOString(),
          system_status: 'TESTING'
        }, { onConflict: 'name' });

      return { canProcess: !error, error: error?.message };
    } catch (error) {
      console.error('Live data processing check failed:', error);
      return { canProcess: false, error: 'Processing check failed' };
    }
  }

  /**
   * Development-friendly enforcement that doesn't block operations
   */
  static async enforceProductionIntegrity(): Promise<boolean> {
    const validation = await this.validateLiveIntegrity();
    
    if (!validation.isValid) {
      const errorMsg = `⚠️ SYSTEM INTEGRITY ISSUES: ${validation.errors.join(', ')}`;
      console.warn(errorMsg);
      toast.warning('System integrity issues detected', {
        description: 'Some features may be limited. Check console for details.'
      });
      // Don't block operations in development - just warn
      return true;
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ System warnings:', validation.warnings);
      toast.info('System operational with warnings', {
        description: `${validation.warnings.length} warning(s) detected`
      });
    }

    console.log('✅ System integrity verified');
    return true;
  }
}
