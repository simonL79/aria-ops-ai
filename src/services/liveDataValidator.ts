
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
 * Ensures NO mock data exists and all systems are truly live
 */
export class LiveDataValidator {
  
  /**
   * Run comprehensive live data validation
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

    // Check 1: No mock data in threats table
    result.totalChecks++;
    const mockThreats = await this.checkMockDataInThreats();
    if (mockThreats.hasMockData) {
      result.errors.push(`Found ${mockThreats.count} mock threats in database`);
      result.isValid = false;
    } else {
      result.passedChecks++;
    }

    // Check 2: RLS compliance on all tables
    result.totalChecks++;
    const rlsCheck = await this.checkRLSCompliance();
    if (!rlsCheck.isCompliant) {
      result.errors.push(`RLS not enabled on: ${rlsCheck.unprotectedTables.join(', ')}`);
      result.isValid = false;
    } else {
      result.passedChecks++;
    }

    // Check 3: Live threat ingestion queue has real data
    result.totalChecks++;
    const queueCheck = await this.checkThreatIngestionQueue();
    if (!queueCheck.hasRealData) {
      result.warnings.push('Threat ingestion queue is empty - no live threats being processed');
    } else {
      result.passedChecks++;
    }

    // Check 4: Edge functions are logging properly
    result.totalChecks++;
    const functionCheck = await this.checkEdgeFunctionActivity();
    if (!functionCheck.isActive) {
      result.errors.push('Edge functions not executing - no recent activity logged');
      result.isValid = false;
    } else {
      result.passedChecks++;
    }

    // Check 5: System health monitoring is active
    result.totalChecks++;
    const healthCheck = await this.checkSystemHealthMonitoring();
    if (!healthCheck.isActive) {
      result.warnings.push('System health monitoring not active');
    } else {
      result.passedChecks++;
    }

    console.log(`✅ Live integrity check completed: ${result.passedChecks}/${result.totalChecks} checks passed`);
    
    return result;
  }

  /**
   * Check for mock data in threats table
   */
  private static async checkMockDataInThreats() {
    try {
      const { data, error } = await supabase
        .from('threats')
        .select('id, content')
        .or('content.ilike.%mock%,content.ilike.%demo%,content.ilike.%test%');

      if (error) {
        console.error('Error checking mock data:', error);
        return { hasMockData: false, count: 0, mockEntries: [] };
      }

      return {
        hasMockData: (data?.length || 0) > 0,
        count: data?.length || 0,
        mockEntries: data || []
      };
    } catch (error) {
      console.error('Error checking mock data:', error);
      return { hasMockData: false, count: 0, mockEntries: [] };
    }
  }

  /**
   * Check RLS compliance across all tables
   */
  private static async checkRLSCompliance() {
    try {
      const { data, error } = await supabase.rpc('check_rls_compliance');
      
      if (error) {
        console.error('RLS compliance check error:', error);
        return { isCompliant: false, unprotectedTables: ['database_check_failed'], totalTables: 0 };
      }

      if (!data || !Array.isArray(data)) {
        console.error('Invalid RLS data format:', data);
        return { isCompliant: false, unprotectedTables: ['invalid_response'], totalTables: 0 };
      }

      const unprotectedTables = data
        .filter((table: any) => !table.rls_enabled)
        .map((table: any) => table.table_name) || [];

      console.log('RLS Check Results:', { totalTables: data.length, unprotectedTables });

      return {
        isCompliant: unprotectedTables.length === 0,
        unprotectedTables,
        totalTables: data.length
      };
    } catch (error) {
      console.error('Error checking RLS compliance:', error);
      return { isCompliant: false, unprotectedTables: ['check_failed'], totalTables: 0 };
    }
  }

  /**
   * Check threat ingestion queue for real data
   */
  private static async checkThreatIngestionQueue() {
    try {
      const { data, error } = await supabase
        .from('threat_ingestion_queue')
        .select('id, status, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error checking threat queue:', error);
        return { hasRealData: false, recentItems: 0, pendingItems: 0 };
      }

      return {
        hasRealData: (data?.length || 0) > 0,
        recentItems: data?.length || 0,
        pendingItems: data?.filter(item => item.status === 'pending').length || 0
      };
    } catch (error) {
      console.error('Error checking threat queue:', error);
      return { hasRealData: false, recentItems: 0, pendingItems: 0 };
    }
  }

  /**
   * Check edge function activity
   */
  private static async checkEdgeFunctionActivity() {
    try {
      const { data, error } = await supabase
        .from('edge_function_events')
        .select('id, function_name, executed_at')
        .gte('executed_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('executed_at', { ascending: false });

      if (error) {
        console.error('Error checking edge function activity:', error);
        return { isActive: false, recentCalls: 0, lastCall: null };
      }

      return {
        isActive: (data?.length || 0) > 0,
        recentCalls: data?.length || 0,
        lastCall: data?.[0]?.executed_at || null
      };
    } catch (error) {
      console.error('Error checking edge function activity:', error);
      return { isActive: false, recentCalls: 0, lastCall: null };
    }
  }

  /**
   * Check system health monitoring
   */
  private static async checkSystemHealthMonitoring() {
    try {
      const { data, error } = await supabase
        .from('system_health_checks')
        .select('id, status, check_time')
        .gte('check_time', new Date(Date.now() - 30 * 60 * 1000).toISOString())
        .order('check_time', { ascending: false });

      if (error) {
        console.error('Error checking system health:', error);
        return { isActive: false, recentChecks: 0, lastCheck: null };
      }

      return {
        isActive: (data?.length || 0) > 0,
        recentChecks: data?.length || 0,
        lastCheck: data?.[0]?.check_time || null
      };
    } catch (error) {
      console.error('Error checking system health:', error);
      return { isActive: false, recentChecks: 0, lastCheck: null };
    }
  }

  /**
   * Kill switch - prevent operation if mock data detected
   */
  static async enforceProductionIntegrity(): Promise<boolean> {
    const validation = await this.validateLiveIntegrity();
    
    if (!validation.isValid) {
      const errorMsg = `🚨 PRODUCTION INTEGRITY FAILURE: ${validation.errors.join(', ')}`;
      console.error(errorMsg);
      toast.error('System integrity check failed', {
        description: 'Mock data or configuration issues detected'
      });
      return false;
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Production warnings:', validation.warnings);
      toast.warning('System warnings detected', {
        description: validation.warnings.join(', ')
      });
    }

    console.log('✅ Production integrity verified - system is live');
    return true;
  }
}
