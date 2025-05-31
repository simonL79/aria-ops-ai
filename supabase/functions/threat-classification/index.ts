
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThreatClassificationRequest {
  content: string;
  platform: string;
  entityName?: string;
  context?: string;
}

interface ThreatClassificationResult {
  category: 'Neutral' | 'Positive' | 'Complaint' | 'Reputation Threat' | 'Misinformation' | 'Legal Risk';
  severity: number; // 1-10
  action: string;
  explanation: string;
  confidence: number;
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

    const { content, platform, entityName, context }: ThreatClassificationRequest = await req.json();

    console.log(`[THREAT-CLASSIFICATION] Processing content from ${platform}`);

    // Local threat classification logic (replacing OpenAI)
    const classificationResult = await classifyThreatLocally(content, platform, entityName);

    // Store classification result
    const { error: insertError } = await supabaseClient
      .from('aria_ops_log')
      .insert({
        operation_type: 'threat_classification',
        module_source: 'threat-classification',
        success: true,
        entity_name: entityName,
        operation_data: {
          platform,
          classification: classificationResult,
          processed_at: new Date().toISOString()
        }
      });

    if (insertError) {
      console.error('Failed to log classification:', insertError);
    }

    return new Response(JSON.stringify(classificationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[THREAT-CLASSIFICATION] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Classification failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function classifyThreatLocally(
  content: string, 
  platform: string, 
  entityName?: string
): Promise<ThreatClassificationResult> {
  const lowerContent = content.toLowerCase();
  
  // Local classification logic (no external API calls)
  let category: ThreatClassificationResult['category'] = 'Neutral';
  let severity = 1;
  let confidence = 0.8;
  
  // Threat indicators
  const threatIndicators = {
    legal: ['lawsuit', 'legal action', 'court', 'sue', 'defamation', 'libel'],
    reputation: ['scam', 'fraud', 'fake', 'lie', 'corrupt', 'criminal'],
    misinformation: ['false', 'hoax', 'fake news', 'conspiracy', 'untrue'],
    complaint: ['complaint', 'issue', 'problem', 'disappointed', 'unhappy']
  };

  // Positive indicators
  const positiveIndicators = ['great', 'excellent', 'amazing', 'love', 'recommend', 'fantastic'];

  // Classify based on indicators
  if (positiveIndicators.some(word => lowerContent.includes(word))) {
    category = 'Positive';
    severity = 1;
  } else if (threatIndicators.legal.some(word => lowerContent.includes(word))) {
    category = 'Legal Risk';
    severity = 8;
  } else if (threatIndicators.reputation.some(word => lowerContent.includes(word))) {
    category = 'Reputation Threat';
    severity = 7;
  } else if (threatIndicators.misinformation.some(word => lowerContent.includes(word))) {
    category = 'Misinformation';
    severity = 6;
  } else if (threatIndicators.complaint.some(word => lowerContent.includes(word))) {
    category = 'Complaint';
    severity = 4;
  }

  // Extract entities mentioned
  const entities: string[] = [];
  if (entityName && lowerContent.includes(entityName.toLowerCase())) {
    entities.push(entityName);
  }

  // Generate action recommendation
  let action = 'Monitor';
  if (severity >= 7) action = 'Escalation';
  else if (severity >= 5) action = 'Human Review';

  return {
    category,
    severity,
    action,
    explanation: `Local classification based on content analysis. Detected ${category.toLowerCase()} with severity ${severity}/10.`,
    confidence,
    entities
  };
}
