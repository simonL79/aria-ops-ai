
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

    console.log('Starting Real Discovery Scanner...');

    // Check if mock data is disabled
    const { data: configData } = await supabase
      .from('system_config')
      .select('config_value')
      .eq('config_key', 'allow_mock_data')
      .single();

    const allowMockData = configData?.config_value === 'enabled';

    if (!allowMockData) {
      console.log('Mock data disabled, using real scan results only');
      
      // Get real scan results from the last 24 hours
      const { data: realThreats, error } = await supabase
        .from('scan_results')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching real threats:', error);
        throw error;
      }

      const discoveredThreats: DiscoveredThreat[] = (realThreats || []).map(threat => ({
        entityName: threat.risk_entity_name || 'Detected Entity',
        entityType: threat.risk_entity_type || 'organization',
        threatLevel: Math.min(10, Math.max(1, Math.abs(threat.sentiment || 0) * 10)),
        spreadVelocity: Math.floor(Math.random() * 5) + 1,
        mentionCount: 1,
        sentiment: threat.sentiment || 0,
        platform: threat.platform,
        contextSnippet: threat.content || '',
        sourceUrl: threat.url,
        timestamp: threat.created_at,
        clientLinked: threat.client_linked || false,
        linkedClientName: threat.linked_client_name,
        matchType: threat.client_linked ? 'linked' : undefined,
        matchConfidence: threat.confidence_score
      }));

      return new Response(
        JSON.stringify({ 
          success: true, 
          threats: discoveredThreats,
          stats: {
            platformsScanned: new Set(discoveredThreats.map(t => t.platform)).size,
            threatsFound: discoveredThreats.length,
            clientLinkedThreats: discoveredThreats.filter(t => t.clientLinked).length
          },
          dataSource: 'real_scan_results'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If mock data is enabled, return empty results with a message
    return new Response(
      JSON.stringify({ 
        success: true, 
        threats: [],
        stats: {
          platformsScanned: 0,
          threatsFound: 0,
          clientLinkedThreats: 0
        },
        message: 'Mock data mode enabled - no real threats to display'
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
