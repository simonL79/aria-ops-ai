
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Response tone options
const toneOptions = {
  professional: "formal, business-like, restrained",
  friendly: "warm, approachable, personable",
  empathetic: "understanding, compassionate, supportive",
  authoritative: "knowledgeable, confident, direct",
  neutral: "balanced, objective, informative"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { content, threatType, severity, platform, tone = 'professional', brandName, length = 'medium' } = await req.json();
    
    // Validate input
    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Determine response length in tokens
    const lengthMap: Record<string, number> = {
      short: 150,
      medium: 300,
      long: 500
    };
    const maxTokens = lengthMap[length as keyof typeof lengthMap] || 300;
    
    // Get the appropriate tone description
    const toneDescription = toneOptions[tone as keyof typeof toneOptions] || toneOptions.professional;
    
    // Create the prompt for response generation
    const responsePrompt = `
You are an expert reputation management strategist who specializes in crafting perfect responses to online content.

CONTENT TO RESPOND TO:
"""
${content}
"""

PLATFORM: ${platform || 'Unknown'}
THREAT TYPE: ${threatType || 'Unknown'}
SEVERITY: ${severity || 'Medium'}
BRAND NAME: ${brandName || 'Our Company'}

TONE: ${toneDescription}

Please craft a strategic response that:
1. Addresses the specific concerns or issues raised
2. Defuses any tensions or negativity
3. Protects the brand's reputation
4. Is appropriate for the ${platform} platform
5. Has a ${tone} tone
6. Follows best practices for crisis communication and reputation management

Your response should be well-structured, concise, and effective.
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert reputation management strategist.' },
          { role: 'user', content: responsePrompt }
        ],
        temperature: 0.7,
        max_tokens: maxTokens
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", responseData);
      return new Response(
        JSON.stringify({ error: "Response generation failed", details: responseData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedResponse = responseData.choices[0].message.content;
    
    // Create supabase client for logging
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Log this response generation in activity logs
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        action: 'respond',
        details: `Generated ${length} ${tone} response for content on ${platform || 'unknown platform'}`,
        entity_type: 'response_generation',
        entity_id: 'system'
      });
      
    if (logError) {
      console.error("Error logging response generation:", logError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        response: generatedResponse,
        metadata: {
          platform,
          threatType,
          severity,
          tone,
          length,
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in generate-response function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
