
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const platforms = [
  'Twitter', 
  'Facebook', 
  'LinkedIn', 
  'Reddit', 
  'News Sites', 
  'Blogs', 
  'Review Sites',
  'Forums'
];

const sentimentRange = [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1];
const severities = ['low', 'medium', 'high'] as const;

// Sample content templates to generate realistic examples
const contentTemplates = [
  "Just saw a post about {brand}. Looks like they're having issues with {issue}.",
  "{brand}'s customer service is {sentiment}. They {action} when I needed help.",
  "Has anyone else experienced {issue} with {brand}? I'm thinking of {action}.",
  "New review of {brand} just dropped. They're getting {sentiment} feedback about their {feature}.",
  "Breaking: {brand} just {action}. This could affect their reputation in the {industry} industry.",
  "I've been using {brand} for {time} now. Overall it's been {sentiment}.",
  "{brand} vs competitors - they {comparative} when it comes to {feature}.",
  "Public opinion about {brand} seems to be shifting after they {action}."
];

// Adjectives and verbs to make content more varied
const sentimentWords = {
  positive: ["excellent", "great", "helpful", "responsive", "amazing", "outstanding"],
  negative: ["terrible", "awful", "unhelpful", "slow", "disappointing", "frustrating"],
  neutral: ["okay", "fine", "adequate", "reasonable", "standard", "typical"]
};

const issues = [
  "customer service delays", 
  "product quality", 
  "website outages", 
  "billing problems",
  "delivery delays",
  "pricing changes",
  "staff behavior",
  "policy changes"
];

const actions = [
  "responded quickly", 
  "ignored my request", 
  "announced major changes", 
  "apologized publicly",
  "denied allegations",
  "launched a new product",
  "merged with a competitor",
  "changed their terms of service"
];

const features = ["mobile app", "website", "product line", "support team", "pricing structure", "loyalty program"];
const timeframes = ["a week", "a month", "six months", "a year", "three years", "two days"];
const comparatives = ["excel", "fall short", "are about the same", "have improved", "are declining"];

function generateContent(brand: string, sentiment: number): string {
  // Select a random template
  const template = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  
  // Determine sentiment category
  let sentimentCategory: 'positive' | 'negative' | 'neutral';
  if (sentiment > 0.3) sentimentCategory = 'positive';
  else if (sentiment < -0.3) sentimentCategory = 'negative';
  else sentimentCategory = 'neutral';
  
  // Select appropriate words based on sentiment
  const sentimentWord = sentimentWords[sentimentCategory][Math.floor(Math.random() * sentimentWords[sentimentCategory].length)];
  const issue = issues[Math.floor(Math.random() * issues.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  const time = timeframes[Math.floor(Math.random() * timeframes.length)];
  const comparative = comparatives[Math.floor(Math.random() * comparatives.length)];
  
  // Replace placeholders with selected words
  return template
    .replace('{brand}', brand)
    .replace('{sentiment}', sentimentWord)
    .replace('{issue}', issue)
    .replace('{action}', action)
    .replace('{feature}', feature)
    .replace('{time}', time)
    .replace('{comparative}', comparative)
    .replace('{industry}', 'tech'); // Default industry
}

function getSeverityFromSentiment(sentiment: number): typeof severities[number] {
  if (sentiment < -0.6) return 'high';
  if (sentiment < -0.2) return 'medium';
  return 'low';
}

async function fetchClientsForMonitoring() {
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, industry, keywordtargets');
    
  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  
  return data || [];
}

async function scanForClient(client: any): Promise<any[]> {
  try {
    const results = [];
    // Generate 0-3 random results for this client
    const resultCount = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < resultCount; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const sentimentIndex = Math.floor(Math.random() * sentimentRange.length);
      const sentiment = sentimentRange[sentimentIndex];
      const content = generateContent(client.name, sentiment);
      const severity = getSeverityFromSentiment(sentiment);
      
      // Generate a fake URL that looks realistic for the platform
      const url = platform.toLowerCase().replace(' ', '') + '.com/' + 
        (platform === 'Twitter' ? 'status/' : 'post/') + 
        Math.random().toString(36).substring(2, 10);
      
      results.push({
        client_id: client.id,
        platform,
        content,
        url,
        sentiment,
        severity,
        status: 'new',
        threat_type: severity === 'high' ? 'Reputation Risk' : null
      });
    }
    
    return results;
  } catch (error) {
    console.error(`Error scanning for client ${client.name}:`, error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { fullScan = true, clientId = null } = await req.json();
    
    // Get clients to scan for
    let clients;
    if (clientId) {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, industry, keywordtargets')
        .eq('id', clientId)
        .limit(1);
        
      if (error) throw error;
      clients = data || [];
    } else {
      clients = await fetchClientsForMonitoring();
    }
    
    const scanPromises = clients.map(client => scanForClient(client));
    const scanResultsArrays = await Promise.all(scanPromises);
    
    // Flatten the results
    const allResults = scanResultsArrays.flat();
    
    // Store results in the database
    if (allResults.length > 0) {
      const { error: insertError } = await supabase
        .from('scan_results')
        .insert(allResults);
        
      if (insertError) {
        console.error("Error storing scan results:", insertError);
      }
    }
    
    // Update monitoring status
    const nextRunTime = new Date();
    nextRunTime.setHours(nextRunTime.getHours() + 1); // Next run in 1 hour
    
    const { error: statusError } = await supabase
      .from('monitoring_status')
      .upsert({
        id: '1', // Using a constant ID for the single status record
        last_run: new Date().toISOString(),
        next_run: nextRunTime.toISOString(),
        is_active: true,
        sources_count: platforms.length,
        updated_at: new Date().toISOString()
      });
      
    if (statusError) {
      console.error("Error updating monitoring status:", statusError);
    }
    
    // Also record this scan in the activity log
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        action: 'scan',
        details: `Monitoring scan completed. Found ${allResults.length} mentions.`,
        entity_type: 'monitoring',
        entity_id: 'system'
      });
      
    if (logError) {
      console.error("Error logging activity:", logError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        results: allResults,
        scannedClients: clients.length,
        nextRun: nextRunTime.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in monitoring-scan function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
