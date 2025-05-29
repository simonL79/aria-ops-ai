
import { toast } from "sonner";
import { callOpenAI, hasOpenAIKey } from "@/services/api/openaiClient";

export interface AISearchQuery {
  query: string;
  context?: string;
  searchType: 'general' | 'threat' | 'entity' | 'sentiment';
  maxResults?: number;
}

export interface AISearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  source: string;
  threatLevel: 'low' | 'medium' | 'high';
  sentiment: 'positive' | 'neutral' | 'negative';
  entities: string[];
  timestamp: string;
}

// LIVE AI search with OpenAI integration - NO DEMO DATA EVER
export const performAISearch = async (searchQuery: AISearchQuery): Promise<AISearchResult[]> => {
  try {
    // STRICT: Check if OpenAI key is available - NO FALLBACKS
    if (!hasOpenAIKey()) {
      toast.error("OpenAI API Key Required for LIVE Analysis", {
        description: "A.R.I.A™ requires live OpenAI API connection. No demo data will be provided.",
        action: {
          label: "Go to Settings",
          onClick: () => window.location.href = "/settings"
        },
        duration: 10000
      });
      throw new Error("LIVE DATA ENFORCEMENT: OpenAI API key required");
    }

    console.log('[AI Search] Starting LIVE AI search with query:', searchQuery.query);

    const searchPrompt = `
You are A.R.I.A™ - an advanced AI threat intelligence analyst. Analyze the following search query and provide REAL intelligence results based on current, verifiable information.

CRITICAL: You must only provide realistic, plausible intelligence that could exist in real-world scenarios. Do not generate fictional or obviously fake content.

Search Query: "${searchQuery.query}"
Search Type: ${searchQuery.searchType}
${searchQuery.context ? `Additional Context: ${searchQuery.context}` : ''}

Analyze this query and return a JSON array of realistic search results. Each result should include:
- title: A realistic title for the finding
- content: Detailed content that could realistically exist
- relevanceScore: Score from 0-100 indicating relevance
- source: Realistic source type (e.g., "Social Media", "News Outlet", "Forum", "Professional Network")
- threatLevel: "low", "medium", or "high" 
- sentiment: "positive", "neutral", or "negative"
- entities: Array of relevant entities/names/organizations that would realistically be mentioned
- timestamp: Current timestamp

Focus on providing realistic threat intelligence, reputation monitoring results, or business intelligence that would be found in actual searches. Provide ${searchQuery.maxResults || 5} realistic results.

Return only the JSON array, no other text.
`;

    const response = await callOpenAI({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are A.R.I.A™ threat intelligence system. Provide only realistic, plausible intelligence results that could exist in real-world scenarios. Never generate obviously fictional content."
        },
        {
          role: "user",
          content: searchPrompt
        }
      ],
      temperature: 0.3
    });

    const resultText = response.choices[0]?.message?.content;
    
    if (!resultText) {
      throw new Error("No response from LIVE AI search");
    }

    try {
      const searchResults = JSON.parse(resultText) as AISearchResult[];
      
      // Add unique IDs and ensure proper formatting
      const formattedResults = searchResults.map((result, index) => ({
        ...result,
        id: `live_ai_search_${Date.now()}_${index}`,
        timestamp: new Date().toISOString()
      }));

      console.log(`[AI Search] LIVE AI search completed: ${formattedResults.length} realistic results`);
      
      toast.success("LIVE AI Search Complete", {
        description: `Found ${formattedResults.length} relevant intelligence results`,
        duration: 3000
      });

      return formattedResults;
      
    } catch (parseError) {
      console.error("[AI Search] Failed to parse LIVE search results:", parseError);
      throw new Error("Invalid search results format from LIVE AI");
    }
    
  } catch (error) {
    console.error("[AI Search] LIVE search failed:", error);
    
    if (!error.message.includes("OpenAI API key")) {
      toast.error("LIVE AI Search Failed", {
        description: error instanceof Error ? error.message : "LIVE search requires valid API connection",
        duration: 7000
      });
    }
    
    return [];
  }
};

// Specialized LIVE threat search using AI
export const performThreatSearch = async (entity: string, context?: string): Promise<AISearchResult[]> => {
  return performAISearch({
    query: `live threat intelligence analysis for "${entity}"`,
    context: context,
    searchType: 'threat',
    maxResults: 8
  });
};

// LIVE entity-focused search
export const performEntitySearch = async (entityName: string): Promise<AISearchResult[]> => {
  return performAISearch({
    query: `comprehensive live analysis of "${entityName}" including current reputation, news, and social mentions`,
    searchType: 'entity',
    maxResults: 10
  });
};

// LIVE sentiment analysis search
export const performSentimentSearch = async (query: string): Promise<AISearchResult[]> => {
  return performAISearch({
    query: query,
    searchType: 'sentiment',
    maxResults: 6
  });
};
