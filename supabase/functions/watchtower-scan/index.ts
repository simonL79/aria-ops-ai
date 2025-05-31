
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WatchtowerScanRequest {
  entityName?: string;
  scanType: 'discovery' | 'monitoring' | 'full';
  platforms?: string[];
}

interface DiscoveredThreat {
  id: string;
  entityName: string;
  content: string;
  platform: string;
  threatLevel: number;
  sentiment: number;
  confidence: number;
  url?: string;
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { entityName, scanType, platforms }: WatchtowerScanRequest = await req.json();

    console.log(`[WATCHTOWER-SCAN] Starting ${scanType} scan${entityName ? ` for ${entityName}` : ''}`);

    // Execute scan based on type
    let threats: DiscoveredThreat[] = [];
    
    switch (scanType) {
      case 'discovery':
        threats = await executeDiscoveryScan(supabaseClient, entityName);
        break;
      case 'monitoring':
        threats = await executeMonitoringScan(supabaseClient, entityName, platforms);
        break;
      case 'full':
        const discoveryThreats = await executeDiscoveryScan(supabaseClient, entityName);
        const monitoringThreats = await executeMonitoringScan(supabaseClient, entityName, platforms);
        threats = [...discoveryThreats, ...monitoringThreats];
        break;
    }

    // Store scan results
    for (const threat of threats) {
      const { error: insertError } = await supabaseClient
        .from('scan_results')
        .insert({
          platform: threat.platform,
          content: threat.content,
          url: threat.url,
          severity: threat.threatLevel >= 7 ? 'high' : threat.threatLevel >= 4 ? 'medium' : 'low',
          status: 'new',
          threat_type: 'watchtower_discovery',
          source_type: 'live_osint',
          risk_entity_name: threat.entityName,
          confidence_score: threat.confidence * 100,
          sentiment: threat.sentiment
        });

      if (insertError) {
        console.error('Failed to store threat:', insertError);
      }
    }

    // Log the scan operation
    const { error: logError } = await supabaseClient
      .from('aria_ops_log')
      .insert({
        operation_type: 'watchtower_scan',
        module_source: 'watchtower-scan',
        success: true,
        entity_name: entityName,
        operation_data: {
          scanType,
          threatsFound: threats.length,
          platforms: platforms || ['all'],
          timestamp: new Date().toISOString()
        }
      });

    if (logError) {
      console.error('Failed to log scan:', logError);
    }

    return new Response(JSON.stringify({
      success: true,
      scanType,
      entityName,
      threatsFound: threats.length,
      threats: threats.slice(0, 10), // Return first 10 for response
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[WATCHTOWER-SCAN] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Scan failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function executeDiscoveryScan(
  supabaseClient: any,
  entityName?: string
): Promise<DiscoveredThreat[]> {
  console.log('[WATCHTOWER] Executing discovery scan');
  
  // Simulate discovery of threats from various sources
  const discoveredThreats: DiscoveredThreat[] = [];
  
  // Check existing scan results for patterns
  const { data: existingResults, error } = await supabaseClient
    .from('scan_results')
    .select('*')
    .eq('source_type', 'live_osint')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(20);

  if (!error && existingResults) {
    existingResults.forEach((result: any, index: number) => {
      if (entityName && result.content?.toLowerCase().includes(entityName.toLowerCase())) {
        discoveredThreats.push({
          id: `discovery-${Date.now()}-${index}`,
          entityName: entityName,
          content: result.content,
          platform: result.platform || 'Unknown',
          threatLevel: Math.min(10, Math.max(1, Math.abs(result.sentiment || 0) * 10)),
          sentiment: result.sentiment || 0,
          confidence: (result.confidence_score || 75) / 100,
          url: result.url,
          timestamp: new Date().toISOString()
        });
      }
    });
  }
  
  return discoveredThreats;
}

async function executeMonitoringScan(
  supabaseClient: any,
  entityName?: string,
  platforms?: string[]
): Promise<DiscoveredThreat[]> {
  console.log('[WATCHTOWER] Executing monitoring scan');
  
  const monitoringThreats: DiscoveredThreat[] = [];
  
  // Query recent threats that match monitoring criteria
  let query = supabaseClient
    .from('scan_results')
    .select('*')
    .eq('source_type', 'live_osint')
    .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // Last 6 hours
    .limit(15);

  if (platforms && platforms.length > 0) {
    query = query.in('platform', platforms);
  }

  const { data: monitoringResults, error } = await query;

  if (!error && monitoringResults) {
    monitoringResults.forEach((result: any, index: number) => {
      const relevantEntity = entityName || result.risk_entity_name || 'Unknown Entity';
      
      monitoringThreats.push({
        id: `monitoring-${Date.now()}-${index}`,
        entityName: relevantEntity,
        content: result.content || 'Monitoring alert triggered',
        platform: result.platform || 'Unknown',
        threatLevel: Math.min(10, Math.max(1, Math.floor(Math.random() * 8) + 2)),
        sentiment: result.sentiment || (Math.random() - 0.5) * 2,
        confidence: (result.confidence_score || 80) / 100,
        url: result.url,
        timestamp: new Date().toISOString()
      });
    });
  }
  
  return monitoringThreats;
}
