
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OffensiveOperationRequest {
  target_entity?: string;
  operation_type: 'seo_suppression' | 'narrative_control' | 'counter_intelligence' | 'digital_displacement';
  priority_level?: 'low' | 'medium' | 'high' | 'critical';
  target_platforms?: string[];
}

async function authenticateAdmin(req: Request): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const adminSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: roleData } = await adminSupabase
    .from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').single();
  if (!roleData) return null;

  return { userId: user.id };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await authenticateAdmin(req);
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin role required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: OffensiveOperationRequest = await req.json();
    const { target_entity, operation_type, priority_level = 'medium', target_platforms = ['google', 'social_media'] } = request;

    // Validate operation_type
    const validTypes = ['seo_suppression', 'narrative_control', 'counter_intelligence', 'digital_displacement'];
    if (!validTypes.includes(operation_type)) {
      return new Response(JSON.stringify({ error: 'Invalid operation type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const operationResults = {
      operation_id: `OP-${Date.now()}`,
      target_entity: target_entity || 'Target Entity',
      operation_type,
      priority_level,
      execution_plan: {
        phase_1: { name: 'Intelligence Gathering', duration: '24-48 hours', activities: ['target analysis', 'vulnerability assessment', 'content mapping'] },
        phase_2: { name: 'Strategic Deployment', duration: '3-7 days', activities: ['content creation', 'platform positioning', 'narrative seeding'] },
        phase_3: { name: 'Consolidation', duration: '2-4 weeks', activities: ['ranking optimization', 'amplification campaigns', 'monitoring'] }
      },
      tactical_objectives: {
        seo_targets: ['displace negative content', 'optimize positive narratives'],
        platform_specific: target_platforms.map(platform => ({ platform, objective: `Establish dominant positive presence on ${platform}` }))
      },
      expected_outcomes: { timeline: '30-90 days', success_probability: 0.85 }
    };

    await supabase.from('scan_results').insert({
      platform: 'Offensive Operations',
      content: `${operation_type} operation initiated for ${target_entity || 'target entity'}`,
      severity: priority_level === 'critical' ? 'high' : priority_level === 'high' ? 'medium' : 'low',
      status: 'new',
      threat_type: 'offensive_operation',
      source_type: 'offensive_operation',
    });

    return new Response(JSON.stringify({
      success: true,
      operation_plan: operationResults,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Offensive Operations error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
