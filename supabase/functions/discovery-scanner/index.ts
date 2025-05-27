
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

    console.log('Starting Discovery Scanner...');

    // Simulate scanning multiple platforms
    const platforms = ['Reddit', 'Twitter', 'Google News', 'TrustPilot', 'Forums'];
    const discoveredThreats: DiscoveredThreat[] = [];

    // Get existing clients for matching
    const { data: clients } = await supabase
      .from('clients')
      .select('id, name, contactemail');

    const { data: clientEntities } = await supabase
      .from('client_entities')
      .select('client_id, entity_name, entity_type, alias');

    // Simulate discovering threats across platforms
    for (const platform of platforms) {
      const threatCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < threatCount; i++) {
        const entities = [
          'TechCorp Ltd', 'Sarah Johnson', 'Digital Marketing Pro', 'John Smith CEO',
          'Innovation Inc', 'Emma Thompson', 'Future Tech Solutions', 'Mike Davis'
        ];
        
        const entityName = entities[Math.floor(Math.random() * entities.length)];
        const threatLevel = Math.floor(Math.random() * 10) + 1;
        const sentiment = (Math.random() - 0.7) * 200; // Bias toward negative
        
        // Check if entity matches any client
        let clientLinked = false;
        let linkedClientName = '';
        let matchType = '';
        let matchConfidence = 0;
        
        if (clientEntities) {
          const match = clientEntities.find(ce => 
            ce.entity_name.toLowerCase().includes(entityName.toLowerCase()) ||
            entityName.toLowerCase().includes(ce.entity_name.toLowerCase()) ||
            (ce.alias && entityName.toLowerCase().includes(ce.alias.toLowerCase()))
          );
          
          if (match) {
            const client = clients?.find(c => c.id === match.client_id);
            if (client) {
              clientLinked = true;
              linkedClientName = client.name;
              matchType = 'partial';
              matchConfidence = 85;
            }
          }
        }

        const threat: DiscoveredThreat = {
          entityName,
          entityType: entityName.includes('Ltd') || entityName.includes('Inc') ? 'organization' : 'person',
          threatLevel,
          spreadVelocity: Math.floor(Math.random() * 10) + 1,
          mentionCount: Math.floor(Math.random() * 50) + 1,
          sentiment,
          platform,
          contextSnippet: `Negative discussion about ${entityName} on ${platform}. Users reporting concerns about recent activities and questioning credibility.`,
          sourceUrl: `https://${platform.toLowerCase()}.com/discussion/${entityName.replace(/\s+/g, '-').toLowerCase()}`,
          timestamp: new Date().toISOString(),
          clientLinked,
          linkedClientName,
          matchType,
          matchConfidence
        };

        discoveredThreats.push(threat);

        // Store in database
        await supabase
          .from('scan_results')
          .insert({
            platform,
            content: threat.contextSnippet,
            url: threat.sourceUrl,
            severity: threatLevel >= 7 ? 'high' : threatLevel >= 4 ? 'medium' : 'low',
            status: 'new',
            threat_type: 'reputation_risk',
            sentiment: sentiment,
            detected_entities: [entityName],
            risk_entity_name: entityName,
            risk_entity_type: threat.entityType,
            is_identified: true
          });
      }
    }

    console.log(`Discovery scan completed. Found ${discoveredThreats.length} threats.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        threats: discoveredThreats,
        stats: {
          platformsScanned: platforms.length,
          threatsFound: discoveredThreats.length,
          clientLinkedThreats: discoveredThreats.filter(t => t.clientLinked).length
        }
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
