
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0'

const NEWSDATA_API_KEY = Deno.env.get('NEWSDATA_API_KEY')
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory storage for entities (would be persisted to database in production)
let detectedEntities = [];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  try {
    // Parse request
    const { timeframe = 'last24h' } = await req.json()
    let daysToLookBack = 1;
    
    // Set days to look back based on timeframe
    switch (timeframe) {
      case 'last3d':
        daysToLookBack = 3;
        break;
      case 'lastWeek':
        daysToLookBack = 7;
        break;
      default:
        daysToLookBack = 1;
    }

    // Get date for API query
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysToLookBack);
    const fromDateString = fromDate.toISOString().split('T')[0];

    console.log(`Starting news scan from ${fromDateString} to now...`);

    if (!NEWSDATA_API_KEY) {
      throw new Error("NewsData API key not configured");
    }

    // Fetch news articles
    const newsResponse = await fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&language=en&from_date=${fromDateString}&category=business,politics,technology`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!newsResponse.ok) {
      const errorText = await newsResponse.text();
      throw new Error(`Failed to fetch news: ${newsResponse.status} - ${errorText}`);
    }

    const newsData = await newsResponse.json();
    console.log(`Fetched ${newsData.results?.length || 0} articles from NewsData API`);

    // Process each article to extract entities
    const entities = await processArticles(newsData.results || []);
    console.log(`Extracted ${entities.length} entities with negative sentiment`);

    // In a real implementation, save entities to database
    detectedEntities = entities;

    return new Response(
      JSON.stringify({ success: true, entities, count: entities.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in radar-news-scan function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})

// Process articles to extract entities with sentiment analysis
async function processArticles(articles) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const entities = [];
  const processedEntities = new Set(); // To avoid duplicates

  for (const article of articles.slice(0, 10)) { // Process max 10 articles for demo
    if (!article.title || !article.content) continue;

    try {
      console.log(`Processing article: ${article.title}`);
      
      // Extract entities and sentiment using OpenAI
      const result = await extractEntitiesAndSentiment(article);
      
      if (result && result.entities) {
        for (const entity of result.entities) {
          // Only add entities with negative sentiment and that we haven't seen before
          if (entity.sentiment < -0.3 && !processedEntities.has(entity.name)) {
            processedEntities.add(entity.name);
            
            entities.push({
              id: crypto.randomUUID(),
              name: entity.name,
              type: entity.type,
              articles: [{
                id: crypto.randomUUID(),
                title: article.title,
                url: article.link,
                source: article.source_id,
                publishDate: article.pubDate,
                snippet: article.description || article.content.substring(0, 200),
                imageUrl: article.image_url
              }],
              sentiment: entity.sentiment,
              riskCategory: entity.riskCategory,
              riskScore: Math.abs(entity.sentiment) * 10, // Convert to 0-10 scale
              firstDetected: new Date().toISOString(),
              outreachStatus: 'pending'
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error processing article ${article.title}:`, error);
      // Continue with next article
    }
  }

  return entities;
}

// Use OpenAI to extract entities and analyze sentiment
async function extractEntitiesAndSentiment(article) {
  const prompt = `
  Extract named entities (people and organizations) from this news article.
  Only extract entities that are portrayed negatively or are experiencing a potential reputation issue.
  For each entity, determine their sentiment score (-1 to 0 for negative entities only) and risk category.

  Title: ${article.title}
  Content: ${article.content.substring(0, 1000)}

  Return ONLY a JSON object with this structure:
  {
    "entities": [
      {
        "name": "Entity Name",
        "type": "person|organization",
        "sentiment": -0.8,
        "riskCategory": "Scandal|Legal Issue|Public Criticism|Data Breach|etc"
      }
    ]
  }
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: "You are an AI that extracts named entities with negative sentiment from news articles." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content;
    
    if (!resultText) {
      throw new Error("Empty response from OpenAI");
    }

    try {
      // Extract JSON from response (handles case where model might add explanation text)
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : resultText;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse entity extraction result:", parseError);
      console.error("Raw content:", resultText);
      throw new Error("Invalid entity extraction response format");
    }
  } catch (error) {
    console.error("Entity extraction API Error:", error);
    throw error;
  }
}
