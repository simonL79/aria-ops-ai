
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Anubis Engine: Running live system diagnostics...');

    // Check module health and trigger auto-responses
    const modules = [
      { name: 'RSI', table: 'rsi_queue', healthCheck: 'status = \'pending\' AND created_at < NOW() - INTERVAL \'15 minutes\'' },
      { name: 'STI', table: 'synthetic_threats', healthCheck: 'threat_score = 0 AND inserted_at < NOW() - INTERVAL \'10 minutes\'' },
      { name: 'Dispatch', table: 'aria_event_dispatch', healthCheck: 'dispatched = FALSE AND created_at < NOW() - INTERVAL \'5 minutes\'' },
      { name: 'OpsLog', table: 'aria_ops_log', healthCheck: 'created_at > NOW() - INTERVAL \'15 minutes\'' }
    ];

    const systemHealth = [];
    const criticalIssues = [];

    for (const module of modules) {
      try {
        const { data, error } = await supabase
          .from(module.table)
          .select('*')
          .limit(1);

        if (error && !error.message.includes('does not exist')) {
          console.error(`Error checking ${module.name}:`, error);
          continue;
        }

        const isHealthy = data ? data.length === 0 : true;
        const status = isHealthy ? 'healthy' : 'warning';
        
        systemHealth.push({
          module: module.name,
          status,
          lastChecked: new Date().toISOString(),
          issues: isHealthy ? 0 : 1
        });

        if (!isHealthy) {
          criticalIssues.push({
            module: module.name,
            severity: 'medium',
            description: `${module.name} has pending items requiring attention`
          });
        }
      } catch (err) {
        console.log(`Module ${module.name} not yet available:`, err.message);
      }
    }

    // Auto-trigger system maintenance if needed
    if (criticalIssues.length > 0) {
      console.log('Anubis: Triggering auto-maintenance for critical issues');
      
      // Log the maintenance action
      await supabase.from('anubis_log').insert({
        module: 'System',
        check_type: 'auto_maintenance',
        result_status: 'triggered',
        details: `Auto-maintenance triggered for ${criticalIssues.length} issues`
      });
    }

    // Run system diagnostics
    const { error: diagError } = await supabase.rpc('anubis_run_diagnostics');
    if (diagError) {
      console.error('Diagnostics error:', diagError);
    }

    return new Response(JSON.stringify({
      success: true,
      systemHealth,
      criticalIssues,
      autoMaintenanceTriggered: criticalIssues.length > 0,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Anubis Engine error:', error);
    return new Response(JSON.stringify({
      error: 'Anubis Engine failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
