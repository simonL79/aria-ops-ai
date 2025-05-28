
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    console.log('🔐 Anubis Engine: Starting secure diagnostics...')

    // Call the secure admin function
    const { data: diagnosticsResult, error: diagnosticsError } = await supabaseClient
      .rpc('admin_trigger_anubis')

    if (diagnosticsError) {
      console.error('❌ Diagnostics error:', diagnosticsError)
      throw new Error(`Diagnostics failed: ${diagnosticsError.message}`)
    }

    console.log('✅ Diagnostics completed:', diagnosticsResult)

    // Get system status after diagnostics
    const { data: systemStatus, error: statusError } = await supabaseClient
      .from('anubis_state')
      .select('*')
      .order('last_checked', { ascending: false })

    if (statusError) {
      console.error('❌ Status fetch error:', statusError)
      throw new Error(`Status fetch failed: ${statusError.message}`)
    }

    // Calculate overall status
    const healthyModules = systemStatus?.filter(s => s.status === 'healthy').length || 0
    const warningModules = systemStatus?.filter(s => s.status === 'warning').length || 0
    const errorModules = systemStatus?.filter(s => s.status === 'error').length || 0
    const totalModules = systemStatus?.length || 0

    let overallStatus = 'healthy'
    if (errorModules > 0) {
      overallStatus = 'critical'
    } else if (warningModules > 0) {
      overallStatus = 'warning'
    }

    const activeIssues = systemStatus?.filter(s => s.anomaly_detected) || []

    const response = {
      success: true,
      message: 'A.R.I.A™ Anubis diagnostics completed successfully',
      timestamp: new Date().toISOString(),
      overall_status: overallStatus,
      summary: {
        healthy_modules: healthyModules,
        warning_modules: warningModules,
        error_modules: errorModules,
        total_modules: totalModules
      },
      module_status: systemStatus || [],
      active_issues: activeIssues,
      diagnostics_result: diagnosticsResult
    }

    console.log('🚀 Anubis Engine: Response ready', {
      overall_status: overallStatus,
      total_modules: totalModules,
      active_issues: activeIssues.length
    })

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Anubis Engine error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('Access denied') ? 403 : 500,
      },
    )
  }
})
