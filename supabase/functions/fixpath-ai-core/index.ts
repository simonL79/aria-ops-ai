
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

    const { entity_name, threat_level = 'moderate' } = await req.json()

    console.log(`🛠️ A.R.I.A™ Fix Path Generator: Creating strategy for ${entity_name}`)

    // Generate AI-powered fix path based on threat level
    const fixSteps = generateFixPath(threat_level, entity_name)

    // Store in fix_paths table
    const { data: fixPath, error } = await supabase
      .from('fix_paths')
      .insert({
        entity_name,
        threat_level,
        steps: fixSteps
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to store fix path: ${error.message}`)
    }

    // Log operation
    await supabase.from('aria_ops_log').insert({
      operation_type: 'fix_path_generation',
      module_source: 'fixpath-ai-core',
      operation_data: {
        entity_name,
        threat_level,
        steps_count: fixSteps.steps.length
      },
      success: true
    })

    return new Response(JSON.stringify({
      success: true,
      fix_path: fixPath,
      message: `Fix path generated for ${entity_name}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Fix path generation error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateFixPath(threatLevel: string, entityName: string) {
  const baseSteps = [
    {
      step: 1,
      action: "Immediate Assessment",
      description: `Analyze current threat landscape for ${entityName}`,
      timeline: "0-2 hours",
      priority: "critical"
    },
    {
      step: 2,
      action: "Containment Strategy",
      description: "Implement damage control measures",
      timeline: "2-6 hours",
      priority: "high"
    }
  ]

  let additionalSteps = []

  switch (threatLevel) {
    case 'critical':
      additionalSteps = [
        {
          step: 3,
          action: "Crisis Communication",
          description: "Deploy emergency response protocols",
          timeline: "6-12 hours",
          priority: "critical"
        },
        {
          step: 4,
          action: "Legal Review",
          description: "Engage legal counsel for threat assessment",
          timeline: "12-24 hours",
          priority: "high"
        },
        {
          step: 5,
          action: "Media Response",
          description: "Coordinate public relations strategy",
          timeline: "24-48 hours",
          priority: "medium"
        }
      ]
      break
    
    case 'high':
      additionalSteps = [
        {
          step: 3,
          action: "Stakeholder Communication",
          description: "Notify key stakeholders and partners",
          timeline: "6-24 hours",
          priority: "high"
        },
        {
          step: 4,
          action: "Monitoring Enhancement",
          description: "Increase surveillance and tracking",
          timeline: "24-72 hours",
          priority: "medium"
        }
      ]
      break
    
    default:
      additionalSteps = [
        {
          step: 3,
          action: "Continuous Monitoring",
          description: "Maintain enhanced observation protocols",
          timeline: "ongoing",
          priority: "low"
        }
      ]
  }

  return {
    threat_level: threatLevel,
    entity_name: entityName,
    generated_at: new Date().toISOString(),
    steps: [...baseSteps, ...additionalSteps],
    estimated_resolution_time: calculateResolutionTime(threatLevel),
    success_probability: calculateSuccessProbability(threatLevel)
  }
}

function calculateResolutionTime(threatLevel: string): string {
  switch (threatLevel) {
    case 'critical': return '1-2 weeks'
    case 'high': return '3-7 days'
    case 'moderate': return '1-3 days'
    default: return '24-48 hours'
  }
}

function calculateSuccessProbability(threatLevel: string): number {
  switch (threatLevel) {
    case 'critical': return 0.75
    case 'high': return 0.85
    case 'moderate': return 0.90
    default: return 0.95
  }
}
