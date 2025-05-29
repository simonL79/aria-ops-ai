
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

// Enhanced AI search with OpenAI integration
export const performAISearch = async (searchQuery: AISearchQuery): Promise<AISearchResult[]> => {
  try {
    // Check if OpenAI key is available
    if (!hasOpenAIKey()) {
      toast.error("OpenAI API Key Required", {
        description: "Please configure your OpenAI API key in Settings > Security to use AI search capabilities",
        action: {
          label: "Go to Settings",
          onClick: () => window.location.href = "/settings"
        },
        duration: 10000
      });
      throw new Error("OpenAI API key not configured");
    }

    console.log('[AI Search] Starting search with query:', searchQuery.query);

    const searchPrompt = `
You are an advanced AI search and threat intelligence analyst. Analyze the following search query and provide comprehensive intelligence results.

Search Query: "${searchQuery.query}"
Search Type: ${searchQuery.searchType}
${searchQuery.context ? `Additional Context: ${searchQuery.context}` : ''}

Please analyze this query and return a JSON array of search results. Each result should include:
- title: A descriptive title for the finding
- content: Detailed content or summary
- relevanceScore: Score from 0-100 indicating relevance
- source: The type of source (e.g., "Social Media", "News", "Forums", "Academic")
- threatLevel: "low", "medium", or "high" 
- sentiment: "positive", "neutral", or "negative"
- entities: Array of relevant entities/names/organizations mentioned
- timestamp: Current timestamp

Focus on finding potential reputation risks, threats, controversies, or notable mentions. Provide ${searchQuery.maxResults || 5} realistic results that would be found in an actual search.

Return only the JSON array, no other text.
`;

    const response = await callOpenAI({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI search and threat intelligence system specialized in reputation monitoring and risk assessment."
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
      throw new Error("Empty response from AI search");
    }

    try {
      const searchResults = JSON.parse(resultText) as AISearchResult[];
      
      // Add unique IDs and ensure proper formatting
      const formattedResults = searchResults.map((result, index) => ({
        ...result,
        id: `ai_search_${Date.now()}_${index}`,
        timestamp: new Date().toISOString()
      }));

      console.log(`[AI Search] Found ${formattedResults.length} AI-generated search results`);
      
      toast.success("AI Search Complete", {
        description: `Found ${formattedResults.length} relevant results`,
        duration: 3000
      });

      return formattedResults;
      
    } catch (parseError) {
      console.error("[AI Search] Failed to parse search results:", parseError);
      throw new Error("Invalid search results format from AI");
    }
    
  } catch (error) {
    console.error("[AI Search] Search failed:", error);
    
    if (!error.message.includes("OpenAI API key")) {
      toast.error("AI Search Failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred during AI search",
        duration: 7000
      });
    }
    
    return [];
  }
};

// Specialized threat search using AI
export const performThreatSearch = async (entity: string, context?: string): Promise<AISearchResult[]> => {
  return performAISearch({
    query: `threat analysis for "${entity}"`,
    context: context,
    searchType: 'threat',
    maxResults: 8
  });
};

// Entity-focused search
export const performEntitySearch = async (entityName: string): Promise<AISearchResult[]> => {
  return performAISearch({
    query: `comprehensive analysis of "${entityName}" including reputation, news, and social mentions`,
    searchType: 'entity',
    maxResults: 10
  });
};

// Sentiment analysis search
export const performSentimentSearch = async (query: string): Promise<AISearchResult[]> => {
  return performAISearch({
    query: query,
    searchType: 'sentiment',
    maxResults: 6
  });
};
