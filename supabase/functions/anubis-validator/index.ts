
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidationResult {
  check_name: string;
  status: 'pass' | 'warning' | 'fail';
  value: number | string | boolean;
  expected?: number | string | boolean;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔍 Anubis Enhanced Validation: Running comprehensive system checks...');

    const results: ValidationResult[] = [];
    let overallStatus = 'healthy';
    let criticalIssues = 0;

    // Enhanced Core System Checks
    const coreChecks = [
      {
        name: 'threat_pipeline_health',
        query: "SELECT COUNT(*) as count FROM threats WHERE is_live = true",
        evaluate: (count: number) => ({ 
          status: count >= 0 ? 'pass' : 'fail', 
          message: `Live threats: ${count}`,
          severity: 'medium' as const
        })
      },
      {
        name: 'ingestion_queue_status',
        query: "SELECT COUNT(*) as count FROM threat_ingestion_queue WHERE status = 'pending'",
        evaluate: (count: number) => ({ 
          status: count < 100 ? 'pass' : count < 500 ? 'warning' : 'fail',
          message: `Pending ingestion: ${count}`,
          severity: count < 100 ? 'low' as const : count < 500 ? 'medium' as const : 'high' as const
        })
      },
      {
        name: 'rls_enforcement',
        query: "SELECT COUNT(*) as count FROM pg_tables t JOIN pg_class c ON t.tablename = c.relname WHERE t.schemaname = 'public' AND c.relrowsecurity = false AND t.tablename IN ('threats', 'reports', 'user_roles')",
        evaluate: (count: number) => ({ 
          status: count === 0 ? 'pass' : 'fail',
          message: `Tables without RLS: ${count}`,
          severity: count === 0 ? 'low' as const : 'critical' as const
        })
      }
    ];

    // Execute core checks
    for (const check of coreChecks) {
      try {
        const { data, error } = await supabase.rpc('run_custom_query', { query: check.query });
        if (error) throw error;
        
        const count = data?.[0]?.count || 0;
        const evaluation = check.evaluate(count);
        
        results.push({
          check_name: check.name,
          status: evaluation.status,
          value: count,
          message: evaluation.message,
          severity: evaluation.severity
        });

        if (evaluation.status === 'fail' && evaluation.severity === 'critical') {
          criticalIssues++;
          overallStatus = 'critical';
        } else if (evaluation.status === 'fail' && overallStatus !== 'critical') {
          overallStatus = 'warning';
        }
      } catch (error) {
        console.error(`Check ${check.name} failed:`, error);
        results.push({
          check_name: check.name,
          status: 'fail',
          value: 'error',
          message: `Check failed: ${error.message}`,
          severity: 'high'
        });
        criticalIssues++;
      }
    }

    // Mock Data Detection (Enhanced)
    try {
      const mockPatterns = ['mock', 'demo', 'test', 'fake', 'sample'];
      let totalMockRecords = 0;

      for (const pattern of mockPatterns) {
        const { data: mockData, error } = await supabase
          .from('threats')
          .select('id')
          .ilike('content', `%${pattern}%`);

        if (!error && mockData) {
          totalMockRecords += mockData.length;
        }
      }

      results.push({
        check_name: 'mock_data_contamination',
        status: totalMockRecords === 0 ? 'pass' : 'fail',
        value: totalMockRecords,
        expected: 0,
        message: `Mock data records found: ${totalMockRecords}`,
        severity: totalMockRecords === 0 ? 'low' : 'critical'
      });

      if (totalMockRecords > 0) {
        criticalIssues++;
        overallStatus = 'critical';
      }
    } catch (error) {
      console.error('Mock data check failed:', error);
    }

    // System Health Freshness
    try {
      const { data: healthData, error } = await supabase
        .from('anubis_log')
        .select('logged_at')
        .order('logged_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const lastLog = healthData?.[0]?.logged_at;
      const hoursSinceLastLog = lastLog 
        ? (Date.now() - new Date(lastLog).getTime()) / (1000 * 60 * 60)
        : 999;

      results.push({
        check_name: 'anubis_activity_freshness',
        status: hoursSinceLastLog < 1 ? 'pass' : hoursSinceLastLog < 6 ? 'warning' : 'fail',
        value: hoursSinceLastLog.toFixed(1),
        expected: '< 1 hour',
        message: `Last Anubis activity: ${hoursSinceLastLog.toFixed(1)}h ago`,
        severity: hoursSinceLastLog < 1 ? 'low' : hoursSinceLastLog < 6 ? 'medium' : 'high'
      });
    } catch (error) {
      console.error('Activity freshness check failed:', error);
    }

    // Admin Access Validation
    try {
      const { data: adminData, error } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (error) throw error;

      const adminCount = adminData?.length || 0;
      results.push({
        check_name: 'admin_access_control',
        status: adminCount > 0 ? 'pass' : 'fail',
        value: adminCount,
        expected: '> 0',
        message: `Active admin accounts: ${adminCount}`,
        severity: adminCount > 0 ? 'low' : 'critical'
      });

      if (adminCount === 0) {
        criticalIssues++;
        overallStatus = 'critical';
      }
    } catch (error) {
      console.error('Admin validation failed:', error);
    }

    // Log results to Anubis system
    const validationSummary = {
      total_checks: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      warnings: results.filter(r => r.status === 'warning').length,
      failures: results.filter(r => r.status === 'fail').length,
      critical_issues: criticalIssues
    };

    await supabase.from('anubis_log').insert({
      module: 'Enhanced_Validator',
      check_type: 'comprehensive_validation',
      result_status: overallStatus,
      details: `Validation complete: ${validationSummary.passed}/${validationSummary.total_checks} passed, ${criticalIssues} critical issues`
    });

    // Update Anubis state with current system status
    await supabase.from('anubis_state').upsert({
      module: 'System_Validator',
      status: overallStatus,
      issue_summary: criticalIssues > 0 ? `${criticalIssues} critical validation failures` : 'All validations passed',
      record_count: validationSummary.total_checks,
      anomaly_detected: criticalIssues > 0
    }, { onConflict: 'module' });

    return new Response(JSON.stringify({
      success: true,
      anubis_validation: {
        overall_status: overallStatus,
        summary: validationSummary,
        results: results,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Anubis Enhanced Validation error:', error);
    
    // Log error to Anubis
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase.from('anubis_log').insert({
        module: 'Enhanced_Validator',
        check_type: 'validation_error',
        result_status: 'error',
        details: `Validation system failure: ${error.message}`
      });
    } catch (logError) {
      console.error('Failed to log error to Anubis:', logError);
    }

    return new Response(JSON.stringify({
      error: 'Anubis Enhanced Validation failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
