
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Local inference server URL
const LOCAL_INFERENCE_URL = Deno.env.get('LOCAL_INFERENCE_URL') || 'http://localhost:3001';

serve(async (req) => {
  console.log('[LOCAL-THREAT-ANALYSIS] Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, platform, entityName, analysisType = 'classify' } = await req.json();
    
    console.log(`[LOCAL-THREAT-ANALYSIS] Analyzing content for entity: ${entityName}, type: ${analysisType}`);

    let endpoint = '';
    let requestBody = {};

    switch (analysisType) {
      case 'classify':
        endpoint = '/threat-classify';
        requestBody = {
          content,
          platform,
          entityName,
          prompt: `Analyze this content for threats against "${entityName}". Classify the threat level (1-10), category (reputation, legal, misinformation, etc.), and provide a brief explanation.`
        };
        break;
      
      case 'summarize':
        endpoint = '/summarize';
        requestBody = {
          content,
          prompt: `Summarize this threat intelligence content concisely, focusing on key risks and actionable insights for "${entityName}".`
        };
        break;
      
      case 'legal-analysis':
        endpoint = '/legal-draft';
        requestBody = {
          content,
          entityName,
          prompt: `Analyze this content for legal implications regarding "${entityName}". Identify potential legal risks, compliance issues, or actionable legal concerns.`
        };
        break;
      
      default:
        throw new Error(`Unknown analysis type: ${analysisType}`);
    }

    // Call local inference server
    const response = await fetch(`${LOCAL_INFERENCE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Local inference server error: ${response.status}`);
    }

    const result = await response.json();
    
    // Log the analysis to activity logs
    await supabase.from('activity_logs').insert({
      action: 'local_threat_analysis',
      details: `Local ${analysisType} analysis completed for ${entityName}`,
      entity_type: 'threat_analysis'
    });

    console.log('[LOCAL-THREAT-ANALYSIS] Analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      analysisType,
      result,
      provider: 'local_ollama'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[LOCAL-THREAT-ANALYSIS] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallback: 'Consider using OpenAI fallback if local inference is unavailable'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
