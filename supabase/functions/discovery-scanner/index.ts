
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DiscoveredThreat {
  entityName: string;
  entityType: string;
  threatLevel: number;
  spreadVelocity: number;
  mentionCount: number;
  sentiment: number;
  platform: string;
  contextSnippet: string;
  sourceUrl?: string;
  timestamp: string;
  clientLinked?: boolean;
  linkedClientName?: string;
  matchType?: string;
  matchConfidence?: number;
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

    console.log('Starting Live Discovery Scanner...');

    // Get real scan results from the last 24 hours
    const { data: realThreats, error } = await supabase
      .from('scan_results')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching real threats:', error);
      throw error;
    }

    // Process real threats and match with client entities
    const discoveredThreats: DiscoveredThreat[] = [];

    for (const threat of realThreats || []) {
      // Check for client entity matches
      const { data: clientMatches } = await supabase
        .rpc('check_entity_client_match', { 
          entity_name_input: threat.risk_entity_name || threat.content?.substring(0, 100) 
        });

      const isClientLinked = clientMatches && clientMatches.length > 0;
      const clientMatch = clientMatches?.[0];

      discoveredThreats.push({
        entityName: threat.risk_entity_name || 'Detected Entity',
        entityType: threat.risk_entity_type || 'organization',
        threatLevel: Math.min(10, Math.max(1, Math.abs(threat.sentiment || 0) * 10)),
        spreadVelocity: threat.potential_reach ? Math.min(10, threat.potential_reach / 1000) : Math.floor(Math.random() * 5) + 1,
        mentionCount: 1,
        sentiment: threat.sentiment || 0,
        platform: threat.platform,
        contextSnippet: threat.content || '',
        sourceUrl: threat.url,
        timestamp: threat.created_at,
        clientLinked: isClientLinked,
        linkedClientName: clientMatch?.client_name,
        matchType: clientMatch?.match_type,
        matchConfidence: clientMatch?.confidence_score
      });
    }

    // Also check darkweb feed for additional threats
    const { data: darkwebThreats } = await supabase
      .from('darkweb_feed')
      .select('*')
      .gte('inserted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('inserted_at', { ascending: false })
      .limit(20);

    for (const dwThreat of darkwebThreats || []) {
      discoveredThreats.push({
        entityName: dwThreat.actor_alias || 'Dark Web Entity',
        entityType: 'threat_actor',
        threatLevel: Math.min(10, Math.max(5, dwThreat.entropy_score * 10)),
        spreadVelocity: 8,
        mentionCount: 1,
        sentiment: -0.8,
        platform: 'Dark Web',
        contextSnippet: dwThreat.content_text?.substring(0, 200) || '',
        sourceUrl: dwThreat.source_url,
        timestamp: dwThreat.inserted_at,
        clientLinked: false
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        threats: discoveredThreats,
        stats: {
          platformsScanned: new Set(discoveredThreats.map(t => t.platform)).size,
          threatsFound: discoveredThreats.length,
          clientLinkedThreats: discoveredThreats.filter(t => t.clientLinked).length
        },
        dataSource: 'live_intelligence'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Discovery scanner error:', error);
    return new Response(
      JSON.stringify({ error: 'Discovery scan failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
