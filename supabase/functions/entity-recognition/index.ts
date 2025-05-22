
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Entity {
  name: string;
  type: 'person' | 'organization' | 'handle' | 'location' | 'unknown';
  confidence: number;
  mentions?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentId, content, mode } = await req.json();

    if (!contentId && !content) {
      return new Response(
        JSON.stringify({ error: "Missing contentId or content parameter" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If contentId is provided but not content, fetch the content from the database
    let textToAnalyze = content;
    if (contentId && !textToAnalyze) {
      const { data, error } = await supabase
        .from('scan_results')
        .select('content')
        .eq('id', contentId)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch content", details: error }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      textToAnalyze = data.content;
    }

    // Extract entities using regex for simple mode
    let entities: Entity[] = [];
    
    if (mode === 'simple' || !mode) {
      entities = extractEntitiesSimple(textToAnalyze);
    } else if (mode === 'advanced') {
      // In a real implementation, this would call an NLP API or ML model
      // For now, we'll just use the simple extraction as a placeholder
      entities = extractEntitiesSimple(textToAnalyze);
      
      // Simulate better results from advanced processing
      entities = entities.map(entity => ({
        ...entity,
        confidence: Math.min(entity.confidence + 0.2, 0.95) // Boost confidence but cap at 0.95
      }));
    }

    // If contentId is provided, update the database with the extracted entities
    if (contentId) {
      const { error } = await supabase
        .from('scan_results')
        .update({
          detected_entities: entities.map(e => e.name),
          risk_entity_name: entities.find(e => e.type === 'person')?.name,
          risk_entity_type: entities.find(e => e.type === 'person') ? 'person' : 
                          entities.find(e => e.type === 'organization') ? 'organization' : 'unknown',
          is_identified: true
        })
        .eq('id', contentId);

      if (error) {
        console.error("Error updating database:", error);
      }
    }

    return new Response(
      JSON.stringify({ 
        entities,
        content: textToAnalyze,
        processedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing entity recognition:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Simple entity extraction using regex
 */
function extractEntitiesSimple(text: string): Entity[] {
  if (!text) return [];
  
  const entities: Map<string, Entity> = new Map();
  
  // Extract mentions (@username)
  const mentionRegex = /@[\w\d_]{2,}/g;
  const mentions = text.match(mentionRegex) || [];
  
  mentions.forEach(mention => {
    entities.set(mention, {
      name: mention,
      type: 'handle',
      confidence: 0.9
    });
  });
  
  // Extract person names (capitalized words in sequence)
  const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const names = text.match(nameRegex) || [];
  
  names.forEach(name => {
    // Skip if name contains common words that might be false positives
    const commonWords = ['The', 'This', 'That', 'These', 'Those', 'Their', 'Your', 'Our'];
    if (commonWords.some(word => name.includes(word))) return;
    
    entities.set(name, {
      name,
      type: 'person',
      confidence: 0.7
    });
  });
  
  // Extract organization names (simplistic approach)
  const orgIndicators = [
    'Inc', 'LLC', 'Ltd', 'Limited', 'Corp', 'Corporation', 
    'Company', 'Co', 'Group', 'Foundation', 'Association'
  ];
  
  orgIndicators.forEach(indicator => {
    const orgRegex = new RegExp(`\\b[A-Z][\\w\\s]*\\s+${indicator}\\b`, 'g');
    const orgs = text.match(orgRegex) || [];
    
    orgs.forEach(org => {
      entities.set(org, {
        name: org,
        type: 'organization',
        confidence: 0.8
      });
    });
  });
  
  // Extract location names (simplistic approach for cities and countries)
  const locationIndicators = [
    'Street', 'Avenue', 'Road', 'Boulevard', 'Lane',
    'City', 'Town', 'Village', 'County', 'State', 'Province',
    'Country', 'Nation', 'Kingdom', 'Republic'
  ];
  
  locationIndicators.forEach(indicator => {
    const locRegex = new RegExp(`\\b[A-Z][\\w\\s]*\\s+${indicator}\\b`, 'g');
    const locations = text.match(locRegex) || [];
    
    locations.forEach(location => {
      if (!entities.has(location)) {
        entities.set(location, {
          name: location,
          type: 'location',
          confidence: 0.75
        });
      }
    });
  });
  
  return Array.from(entities.values());
}
