
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Running system health checks...')

    // Check 1: Database connectivity
    let dbStatus = 'ok'
    let dbDetails = 'Database connection successful'
    try {
      const { error } = await supabase.from('entities').select('count').limit(1)
      if (error) throw error
    } catch (err) {
      dbStatus = 'fail'
      dbDetails = `Database error: ${err.message}`
    }

    // Check 2: Queue processing status
    let queueStatus = 'ok'
    let queueDetails = 'Queue processing normal'
    const { data: pendingItems, error: queueError } = await supabase
      .from('threat_ingestion_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (queueError) {
      queueStatus = 'warn'
      queueDetails = 'Unable to check queue status'
    } else {
      const pendingCount = pendingItems?.length || 0
      if (pendingCount > 50) {
        queueStatus = 'warn'
        queueDetails = `High queue backlog: ${pendingCount} pending items`
      }
    }

    // Check 3: Recent threat detection
    let threatStatus = 'ok'
    let threatDetails = 'Recent threats detected'
    const { data: recentThreats, error: threatError } = await supabase
      .from('threats')
      .select('*', { count: 'exact', head: true })
      .eq('is_live', true)
      .gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (threatError) {
      threatStatus = 'warn'
      threatDetails = 'Unable to check threat status'
    } else {
      const threatCount = recentThreats?.length || 0
      if (threatCount === 0) {
        threatStatus = 'warn'
        threatDetails = 'No threats detected in last 24 hours'
      }
    }

    // Insert health check results
    const healthChecks = [
      {
        module: 'database',
        status: dbStatus,
        details: dbDetails,
        is_automated: true
      },
      {
        module: 'queue_processor',
        status: queueStatus,
        details: queueDetails,
        is_automated: true
      },
      {
        module: 'threat_detector',
        status: threatStatus,
        details: threatDetails,
        is_automated: true
      }
    ]

    for (const check of healthChecks) {
      await supabase.from('system_health_checks').insert(check)
    }

    // Update live status
    await supabase.from('live_status').upsert([
      {
        name: 'Reputation Monitoring',
        active_threats: recentThreats?.length || 0,
        last_threat_seen: recentThreats?.[0]?.detected_at || null,
        last_report: new Date().toISOString(),
        system_status: threatStatus === 'ok' ? 'LIVE' : 'STALE'
      }
    ], { onConflict: 'name' })

    return new Response(JSON.stringify({
      success: true,
      checks: healthChecks,
      overall_status: [dbStatus, queueStatus, threatStatus].includes('fail') ? 'fail' : 
                     [dbStatus, queueStatus, threatStatus].includes('warn') ? 'warn' : 'ok'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Health monitor error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
