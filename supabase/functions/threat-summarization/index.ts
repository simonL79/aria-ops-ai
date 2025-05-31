
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThreatSummarizationRequest {
  content: string;
  threatType?: string;
  entityName?: string;
  platform?: string;
}

interface ThreatSummary {
  summary: string;
  keyPoints: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedActions: string[];
  entities: string[];
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

    const { content, threatType, entityName, platform }: ThreatSummarizationRequest = await req.json();

    console.log(`[THREAT-SUMMARIZATION] Summarizing ${threatType || 'unknown'} threat`);

    // Local summarization logic
    const summary = await summarizeThreatLocally(content, threatType, entityName, platform);

    // Log the summarization
    const { error: logError } = await supabaseClient
      .from('aria_ops_log')
      .insert({
        operation_type: 'threat_summarization',
        module_source: 'threat-summarization',
        success: true,
        entity_name: entityName,
        operation_data: {
          platform,
          threatType,
          summary: summary.summary,
          riskLevel: summary.riskLevel,
          processed_at: new Date().toISOString()
        }
      });

    if (logError) {
      console.error('Failed to log summarization:', logError);
    }

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[THREAT-SUMMARIZATION] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Summarization failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function summarizeThreatLocally(
  content: string,
  threatType?: string,
  entityName?: string,
  platform?: string
): Promise<ThreatSummary> {
  const words = content.split(' ');
  const contentLength = words.length;
  
  // Extract key sentences (simple approach)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const keyPoints: string[] = [];
  
  // Find most relevant sentences
  sentences.slice(0, 3).forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 20) {
      keyPoints.push(trimmed);
    }
  });

  // Generate summary (first 100 words + analysis)
  const summaryWords = words.slice(0, 100).join(' ');
  const summary = `${summaryWords}${words.length > 100 ? '...' : ''} [Analysis: ${threatType || 'Content'} detected on ${platform || 'platform'}${entityName ? ` mentioning ${entityName}` : ''}]`;

  // Determine risk level
  const lowerContent = content.toLowerCase();
  let riskLevel: ThreatSummary['riskLevel'] = 'Low';
  
  const highRiskTerms = ['lawsuit', 'legal action', 'scam', 'fraud', 'criminal'];
  const mediumRiskTerms = ['complaint', 'issue', 'problem', 'concerned'];
  
  if (highRiskTerms.some(term => lowerContent.includes(term))) {
    riskLevel = 'High';
  } else if (mediumRiskTerms.some(term => lowerContent.includes(term))) {
    riskLevel = 'Medium';
  }

  // Generate recommended actions
  const recommendedActions: string[] = [];
  switch (riskLevel) {
    case 'Critical':
    case 'High':
      recommendedActions.push('Immediate escalation required');
      recommendedActions.push('Legal team consultation');
      recommendedActions.push('Client notification');
      break;
    case 'Medium':
      recommendedActions.push('Monitor closely');
      recommendedActions.push('Prepare response strategy');
      break;
    default:
      recommendedActions.push('Continue monitoring');
      recommendedActions.push('Document for records');
  }

  // Extract entities
  const entities: string[] = [];
  if (entityName && lowerContent.includes(entityName.toLowerCase())) {
    entities.push(entityName);
  }

  return {
    summary,
    keyPoints,
    riskLevel,
    recommendedActions,
    entities
  };
}
