
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const openaiApiKey = Deno.env.get("OPENAI_API_KEY") as string;
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

const ENTITY_EXTRACTION_PROMPT = (text: string) => `
Extract all identifiable entities from the text below.

Return ONLY a JSON array of objects with this exact format:
[
  { "name": "Jane Doe", "type": "PERSON" },
  { "name": "ACME Corp", "type": "ORG" },
  { "name": "@johndoe", "type": "SOCIAL" }
]

Types to identify:
- PERSON: People's names (first/last names)
- ORG: Company names, organizations, brands
- SOCIAL: Social media handles (@username, usernames)
- LOCATION: Cities, countries, places

Text:
"""${text}"""

Return only the JSON array, no other text.
`;

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

    let entities: Entity[] = [];
    
    if (mode === 'advanced' && openaiApiKey) {
      // Use OpenAI for advanced entity extraction
      entities = await extractEntitiesWithOpenAI(textToAnalyze);
    } else {
      // Fallback to simple regex extraction
      entities = extractEntitiesSimple(textToAnalyze);
    }

    // If contentId is provided, update the database with the extracted entities
    if (contentId) {
      const { error } = await supabase
        .from('scan_results')
        .update({
          detected_entities: entities.map(e => e.name),
          risk_entity_name: entities.find(e => e.type === 'person')?.name ||
                          entities.find(e => e.type === 'organization')?.name,
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

async function extractEntitiesWithOpenAI(text: string): Promise<Entity[]> {
  try {
    console.log('Calling OpenAI for entity extraction...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that extracts structured entities from text. Always return valid JSON.' },
          { role: 'user', content: ENTITY_EXTRACTION_PROMPT(text) },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return extractEntitiesSimple(text);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      console.error('No content from OpenAI response');
      return extractEntitiesSimple(text);
    }

    console.log('OpenAI response:', content);
    
    // Parse the JSON response
    let parsedEntities;
    try {
      parsedEntities = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON response:', parseError);
      return extractEntitiesSimple(text);
    }

    if (!Array.isArray(parsedEntities)) {
      console.error('OpenAI response is not an array');
      return extractEntitiesSimple(text);
    }

    // Convert to our format
    const entities: Entity[] = parsedEntities.map((entity: any) => ({
      name: entity.name,
      type: mapOpenAIEntityType(entity.type),
      confidence: 0.9,
      mentions: 1
    }));

    console.log('Extracted entities with OpenAI:', entities);
    return entities;
  } catch (error) {
    console.error('OpenAI entity extraction failed:', error);
    return extractEntitiesSimple(text);
  }
}

function mapOpenAIEntityType(type: string): Entity['type'] {
  switch (type?.toUpperCase()) {
    case 'PERSON':
      return 'person';
    case 'ORG':
    case 'ORGANIZATION':
      return 'organization';
    case 'SOCIAL':
    case 'HANDLE':
      return 'handle';
    case 'LOCATION':
      return 'location';
    default:
      return 'unknown';
  }
}

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
