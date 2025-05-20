
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get the request body
  const data = await req.json();
  const { content, platform, brand, context } = data;

  // Validation
  if (!content) {
    return new Response(
      JSON.stringify({ error: "Content is required" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!OPENAI_API_KEY) {
    console.error("Missing OpenAI API key");
    return new Response(
      JSON.stringify({ error: "API key not configured" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const classificationPrompt = `
You are an AI specialized in detecting reputation threats, online attacks, and digital risks to brands and individuals. Your task is to analyze the provided content and determine if it contains any threats, harmful content, or potential reputation risks.

CONTENT TO ANALYZE:
"""
${content}
"""

PLATFORM: ${platform || 'Unknown'}
BRAND/TARGET: ${brand || 'Unknown'}
ADDITIONAL CONTEXT: ${context || 'None provided'}

Provide a detailed analysis structured as a JSON object with the following fields:
- category: The type of threat (e.g., "Negative Review", "Defamation", "Misinformation", "Harassment", "Coordinated Attack", "Potential Litigation", "Customer Complaint", "Competitor Activity", "Non-threatening")
- severity: A number from 1-10 rating the severity (10 being most severe)
- explanation: A clear, concise explanation of why this content is classified as it is, including who or what is being targeted
- recommendation: Specific, actionable steps recommended to address this threat
- ai_reasoning: Your detailed reasoning process for this classification
- confidence: A number between 0-1 indicating your confidence in this classification
- detectedEntities: An array of strings listing the specific entities (people, brands, companies) that are being targeted or mentioned in the content
- detectedBeliefs: If applicable, an array of strings that represent key claims or beliefs expressed that might be problematic

Be extremely specific about who or what is being targeted and the potential impacts. If the content is non-threatening, assign a low severity score and explain why it poses minimal risk.
`;

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a specialized threat assessment AI for reputation management.' },
          { role: 'user', content: classificationPrompt }
        ],
        temperature: 0.2,
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", responseData);
      return new Response(
        JSON.stringify({ error: "Classification service error", details: responseData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const assistantMessage = responseData.choices[0].message.content;
    let classificationResult;
    
    try {
      // Try to parse the response as JSON
      classificationResult = JSON.parse(assistantMessage);
      
      // Extract targets manually if they aren't already provided
      if (!classificationResult.detectedEntities || classificationResult.detectedEntities.length === 0) {
        // Try to extract from the explanation or reasoning
        const properNouns = (classificationResult.explanation || classificationResult.ai_reasoning || "")
          .match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
          
        if (properNouns) {
          classificationResult.detectedEntities = [...new Set(properNouns)].slice(0, 5);
        }
      }
      
      // Log the classification for debugging and analysis
      console.log("Classification completed:", {
        content: content.substring(0, 100) + "...",
        result: JSON.stringify(classificationResult)
      });
      
      // Create supabase client for logging
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Log the classification to activity_logs
      const { error: logError } = await supabase
        .from('activity_logs')
        .insert({
          action: 'classify',
          details: `Classified content with severity ${classificationResult.severity}/10 as "${classificationResult.category}"`,
          entity_type: 'content_classification',
          entity_id: 'system'
        });
        
      if (logError) {
        console.error("Error logging classification:", logError);
      }
      
      return new Response(
        JSON.stringify(classificationResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error("Failed to parse classification result:", parseError);
      console.error("Raw response:", assistantMessage);
      
      // Attempt to extract structured data from unstructured response
      // This is a fallback in case the model doesn't return proper JSON
      const fallbackResult = {
        category: assistantMessage.includes("threat") ? "Potential Threat" : "Unclassified",
        severity: assistantMessage.includes("high") ? 8 : assistantMessage.includes("medium") ? 5 : 3,
        explanation: "The classification system encountered an issue but detected concerning content.",
        recommendation: "Review this content manually for potential threats.",
        ai_reasoning: assistantMessage,
        confidence: 0.5,
        detectedEntities: []
      };
      
      // Try to extract entities even in the fallback case
      const properNouns = assistantMessage.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (properNouns) {
        fallbackResult.detectedEntities = [...new Set(properNouns)].slice(0, 5);
      }
      
      return new Response(
        JSON.stringify(fallbackResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in threat classification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
