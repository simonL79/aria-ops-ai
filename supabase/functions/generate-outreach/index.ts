
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

  try {
    const { influencer_name, platform, controversy_type, content, outreach_type } = await req.json();
    
    // Validate input
    if (!influencer_name || !controversy_type) {
      return new Response(
        JSON.stringify({ error: "Required fields missing" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the prompt for message generation
    const prompt = `
You are a professional reputation management expert helping influencers and public figures manage their online presence.

INFLUENCER: ${influencer_name}
PLATFORM: ${platform || 'Social Media'}
ISSUE: ${controversy_type}
CONTEXT: ${content || 'Recent negative press coverage'}
MESSAGE TYPE: ${outreach_type || 'email'}

Write a personalized ${outreach_type === 'dm' ? 'direct message' : 'email'} introducing your reputation management services to this influencer who is currently facing reputational challenges.

The outreach should:
1. Be professional, warm and non-alarming
2. Emphasize that you've detected this issue early
3. Show understanding of their specific situation
4. Briefly outline your expertise in reputation management
5. Offer specific ways you can help them navigate this situation
6. Include a clear call-to-action for a consultation
7. Be concise and direct

DO NOT:
- Make the situation seem worse than it is
- Include generic marketing language
- Use scare tactics
- Make unrealistic promises
`;

    // For development or if OpenAI API is not available, return a default message
    if (!OPENAI_API_KEY) {
      console.log("OpenAI API key not available. Using default message template.");
      
      const defaultMessage = `
Dear ${influencer_name},

Our A.R.I.A. monitoring system recently detected coverage about you regarding "${controversy_type}" ${platform ? `on ${platform}` : ''}.

At our agency, we specialize in helping influencers effectively manage their online reputation and navigate challenging media situations. We noticed this before most people did, and our proactive approach can help you:

• Assess the potential impact on your online presence
• Develop a strategic response plan
• Mitigate negative sentiment and audience response
• Protect your brand partnerships and revenue streams

Would you be interested in a confidential, no-obligation consultation to discuss how we might help?

Best regards,
A.R.I.A. Reputation Intelligence Team
      `;
      
      return new Response(
        JSON.stringify({ message: defaultMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API to generate the message
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a reputation management expert assisting public figures.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", responseData);
      return new Response(
        JSON.stringify({ error: "Failed to generate message", details: responseData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedMessage = responseData.choices[0].message.content;
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Log the message generation
    await supabase
      .from('activity_logs')
      .insert({
        action: 'generate_outreach',
        details: `Generated ${outreach_type} outreach for ${influencer_name}`,
        entity_type: 'influencer',
        entity_id: 'system'
      });
    
    return new Response(
      JSON.stringify({ message: generatedMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in generate-outreach function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
