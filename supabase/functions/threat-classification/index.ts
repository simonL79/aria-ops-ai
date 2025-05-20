
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get OpenAI API key from environment variable (secure)
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

// Safely extract JSON from potentially non-JSON text
const extractJSON = (text: string): string => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : text;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { content, platform, brand, context } = await req.json();

    // Create the prompt for classification
    const prompt = `
You are a digital reputation analyst. Classify this post.

Platform: ${platform}
Brand: ${brand}
Content: "${content}"
${context ? `Additional context: ${context}` : ''}

Return JSON with:
- category: (one of 'Neutral', 'Positive', 'Complaint', 'Reputation Threat', 'Misinformation', 'Legal Risk')
- severity: 1-10
- recommendation: next step (e.g. auto-response, escalation)
- ai_reasoning: why you classified it this way

IMPORTANT: Reply ONLY with valid JSON. Do not include any other text, markdown formatting, or explanations outside of the JSON structure.
`;

    console.log("Processing threat classification request");
    
    // Call OpenAI API securely from the edge function
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: 'system',
            content: 'You are a digital reputation analysis AI that helps analyze content for potential threats to brand reputation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(errorData.error?.message || "Error calling OpenAI API");
    }

    const responseData = await response.json();
    const content_response = responseData?.choices[0]?.message?.content;

    if (!content_response) {
      throw new Error("Empty response from OpenAI API");
    }

    try {
      // Extract JSON from potential text and parse it
      const jsonContent = extractJSON(content_response);
      const parsed = JSON.parse(jsonContent);

      // Validate the response has required fields
      if (!parsed.category || !parsed.severity || !parsed.recommendation) {
        console.error("Invalid classification response structure:", parsed);
        throw new Error("The API response is missing required fields");
      }

      // Return the classification result
      return new Response(
        JSON.stringify(parsed),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );

    } catch (parseError) {
      console.error("Failed to parse classification result:", parseError);
      console.error("Raw content:", content_response);
      throw new Error("Invalid classification response format");
    }
    
  } catch (error) {
    console.error("Classification API Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to classify threat", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
