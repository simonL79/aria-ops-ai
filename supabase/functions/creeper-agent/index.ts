
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🕷️ Anubis Creeper Agent: Starting system health checks...')

    // Helper function to check module health and log results
    async function checkModuleHealth(
      module: string, 
      functionName: string,
      testFn: () => Promise<{ ok: boolean, message: string, fix?: string }>
    ) {
      try {
        const { ok, message, fix } = await testFn()
        const severity = ok ? 'low' : 'high'

        const { error: logError } = await supabaseClient
          .from('anubis_creeper_log')
          .insert({
            module,
            function_name: functionName,
            issue_detected: !ok,
            issue_description: message,
            severity,
            suggested_fix: fix || null,
            simulated_result: 'Expected output based on known ARIA behavior',
            actual_result: ok ? 'Passed' : 'Error observed'
          })

        if (logError) {
          console.error(`Failed to log ${module} check:`, logError)
        } else {
          console.log(`✅ ${module} check logged: ${message}`)
        }

        return { module, ok, message }
      } catch (error) {
        console.error(`Error checking ${module}:`, error)
        return { module, ok: false, message: `Check failed: ${error.message}` }
      }
    }

    // RSI Queue Health Check
    async function testRSIQueue() {
      const { data, error } = await supabaseClient
        .from('rsi_queue')
        .select('*')
        .eq('status', 'pending')
        .lt('created_at', new Date(Date.now() - 1000 * 60 * 10).toISOString()) // older than 10 min

      if (error) {
        return { ok: false, message: 'Failed to query RSI queue.', fix: 'Check Supabase permissions or table schema.' }
      }
      
      if (data && data.length > 0) {
        return { 
          ok: false, 
          message: `${data.length} pending RSI tasks not processing.`, 
          fix: 'Check the RSI processor function or CRON jobs.' 
        }
      }

      return { ok: true, message: 'RSI queue healthy.' }
    }

    // Synthetic Threats Check
    async function testSyntheticThreats() {
      const { data, error } = await supabaseClient
        .from('synthetic_threats')
        .select('*')
        .eq('threat_score', 0)
        .lt('inserted_at', new Date(Date.now() - 1000 * 60 * 15).toISOString()) // older than 15 min

      if (error) {
        return { ok: false, message: 'Failed to query synthetic threats.', fix: 'Check table permissions.' }
      }

      if (data && data.length > 0) {
        return { 
          ok: false, 
          message: `${data.length} synthetic threats with zero score detected.`, 
          fix: 'Check threat scoring algorithms or data ingestion pipeline.' 
        }
      }

      return { ok: true, message: 'Synthetic threats processing normally.' }
    }

    // ARIA Operations Activity Check
    async function testAriaOpsActivity() {
      const { data, error } = await supabaseClient
        .from('aria_ops_log')
        .select('*')
        .gt('created_at', new Date(Date.now() - 1000 * 60 * 30).toISOString()) // last 30 min

      if (error) {
        return { ok: false, message: 'Failed to query ARIA ops log.', fix: 'Check logging permissions.' }
      }

      if (!data || data.length === 0) {
        return { 
          ok: false, 
          message: 'No ARIA operations logged in last 30 minutes.', 
          fix: 'Check if ARIA core systems are running properly.' 
        }
      }

      return { ok: true, message: `ARIA operations active: ${data.length} logs in last 30 min.` }
    }

    // Event Dispatch Check
    async function testEventDispatch() {
      const { data, error } = await supabaseClient
        .from('aria_event_dispatch')
        .select('*')
        .eq('dispatched', false)
        .lt('created_at', new Date(Date.now() - 1000 * 60 * 5).toISOString()) // older than 5 min

      if (error) {
        return { ok: false, message: 'Failed to query event dispatch.', fix: 'Check dispatch table permissions.' }
      }

      if (data && data.length > 0) {
        return { 
          ok: false, 
          message: `${data.length} events not dispatched after 5+ minutes.`, 
          fix: 'Check event dispatch worker or notification services.' 
        }
      }

      return { ok: true, message: 'Event dispatch functioning normally.' }
    }

    // Scan Results Activity Check
    async function testScanResults() {
      const { data, error } = await supabaseClient
        .from('scan_results')
        .select('*')
        .gt('created_at', new Date(Date.now() - 1000 * 60 * 60).toISOString()) // last hour
        .neq('content', '')

      if (error) {
        return { ok: false, message: 'Failed to query scan results.', fix: 'Check scan results table permissions.' }
      }

      if (!data || data.length === 0) {
        return { 
          ok: false, 
          message: 'No scan results in the last hour.', 
          fix: 'Check scanning services and data ingestion pipelines.' 
        }
      }

      return { ok: true, message: `Scanning active: ${data.length} results in last hour.` }
    }

    // Execute all health checks
    const healthChecks = await Promise.all([
      checkModuleHealth('RSI', 'testRSIQueue', testRSIQueue),
      checkModuleHealth('STI', 'testSyntheticThreats', testSyntheticThreats),
      checkModuleHealth('ARIA_OPS', 'testAriaOpsActivity', testAriaOpsActivity),
      checkModuleHealth('EVENT_DISPATCH', 'testEventDispatch', testEventDispatch),
      checkModuleHealth('SCANNING', 'testScanResults', testScanResults)
    ])

    const issues = healthChecks.filter(check => !check.ok)
    const healthyModules = healthChecks.filter(check => check.ok)

    console.log(`🕷️ Creeper Agent completed: ${healthyModules.length} healthy, ${issues.length} issues detected`)

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        summary: {
          total_checks: healthChecks.length,
          healthy_modules: healthyModules.length,
          issues_detected: issues.length
        },
        healthy_modules: healthyModules.map(h => ({ module: h.module, message: h.message })),
        issues: issues.map(i => ({ module: i.module, message: i.message })),
        message: `Anubis Creeper Agent scan completed. ${issues.length > 0 ? 'Issues detected and logged.' : 'All systems healthy.'}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Anubis Creeper Agent error:', error)
    return new Response(
      JSON.stringify({
        error: 'Creeper Agent scan failed',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
