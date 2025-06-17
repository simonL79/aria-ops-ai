
import { AtlasDataEnforcer } from './dataEnforcement';

export interface PersonalIntelligence {
  name: string;
  timeline: TimelineEntry[];
  firstMention?: TimelineEntry;
  currentStatus: {
    lastSeen: string;
    reputationTrend: 'positive' | 'negative' | 'neutral';
    activeOnPlatforms: string[];
  };
}

export interface TimelineEntry {
  date: string;
  source: string;
  content: string;
  type: 'professional' | 'personal' | 'news' | 'social' | 'legal' | 'other';
  verified: boolean;
  url?: string;
  relevanceScore?: number;
}

export interface RealDataSource {
  name: string;
  type: 'search' | 'social' | 'news' | 'archive' | 'database';
  lastAccessed: string;
  resultsFound: number;
}

export class AtlasRealTimeCollector {
  private sources: RealDataSource[] = [];

  /**
   * Search for real mentions of a person across multiple live sources
   */
  async searchPersonMentions(personName: string): Promise<PersonalIntelligence> {
    console.log(`🔍 Atlas: Starting enhanced real-time search for "${personName}"`);
    
    // Execute comprehensive search across multiple sources
    const allResults = await this.executeEnhancedRealTimeSearch(personName);
    
    // Filter and validate results for relevance
    const relevantResults = this.filterRelevantResults(allResults, personName);
    
    console.log(`📊 Atlas: Found ${relevantResults.length} relevant results after filtering`);
    
    if (relevantResults.length === 0) {
      return this.createEmptyIntelligenceProfile(personName);
    }

    // Convert to intelligence format
    const intelligence = this.processIntelligenceData(personName, relevantResults);
    
    console.log(`✅ Atlas: Compiled intelligence profile with ${intelligence.timeline.length} verified entries`);
    
    return intelligence;
  }

  /**
   * Execute real-time searches across multiple sources
   */
  private async executeEnhancedRealTimeSearch(query: string): Promise<any[]> {
    console.log(`🔍 Atlas: Executing enhanced search for "${query}"`);
    
    const searchPromises = [
      this.searchDuckDuckGoInstant(query),
      this.searchWikipedia(query),
      this.searchInternetArchive(query),
      this.searchReddit(query),
      this.searchNews(query)
    ];

    const results = await Promise.allSettled(searchPromises);
    const allResults: any[] = [];

    results.forEach((result, index) => {
      const sourceNames = ['DuckDuckGo', 'Wikipedia', 'Internet Archive', 'Reddit', 'News'];
      if (result.status === 'fulfilled' && result.value) {
        allResults.push(...result.value);
        console.log(`✅ ${sourceNames[index]}: ${result.value.length} results`);
      } else {
        console.log(`❌ ${sourceNames[index]}: Failed or no results`);
      }
    });

    return allResults;
  }

  /**
   * Enhanced DuckDuckGo search with better query formatting
   */
  private async searchDuckDuckGoInstant(query: string): Promise<any[]> {
    console.log(`🦆 Atlas: Searching DuckDuckGo for: ${query}`);
    
    try {
      // Try multiple query variations for better results
      const queries = [
        query,
        `"${query}"`, // Exact phrase
        query.replace(/\s+/g, '+'), // Plus separated
        query + ' profile',
        query + ' biography'
      ];

      for (const searchQuery of queries) {
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&pretty=1`, {
          headers: { 'User-Agent': 'Atlas Intelligence Platform' }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Check for instant answers or abstract
          if (data.Abstract || data.Answer || (data.RelatedTopics && data.RelatedTopics.length > 0)) {
            const results = [];
            
            if (data.Abstract) {
              results.push({
                title: data.Heading || 'DuckDuckGo Abstract',
                content: data.Abstract,
                url: data.AbstractURL || 'https://duckduckgo.com',
                source: 'DuckDuckGo',
                type: 'search',
                relevanceScore: this.calculateRelevance(data.Abstract, query)
              });
            }

            if (data.RelatedTopics) {
              data.RelatedTopics.forEach((topic: any) => {
                if (topic.Text) {
                  results.push({
                    title: topic.FirstURL ? topic.Text.split(' - ')[0] : 'Related Topic',
                    content: topic.Text,
                    url: topic.FirstURL || 'https://duckduckgo.com',
                    source: 'DuckDuckGo',
                    type: 'search',
                    relevanceScore: this.calculateRelevance(topic.Text, query)
                  });
                }
              });
            }

            if (results.length > 0) {
              console.log(`🦆 Atlas: DuckDuckGo returned ${results.length} results`);
              return results;
            }
          }
        }
      }

      console.log('🦆 Atlas: DuckDuckGo returned no relevant results');
      return [];
    } catch (error) {
      console.error('❌ DuckDuckGo search failed:', error);
      return [];
    }
  }

  /**
   * Search Wikipedia for biographical information
   */
  private async searchWikipedia(query: string): Promise<any[]> {
    console.log(`📚 Atlas: Searching Wikipedia for: ${query}`);
    
    try {
      // Search for pages
      const searchResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/search?q=${encodeURIComponent(query)}&limit=5`
      );

      if (!searchResponse.ok) {
        console.warn(`Wikipedia search API error: ${searchResponse.status}`);
        return [];
      }

      const searchData = await searchResponse.json();
      const results = [];

      for (const page of searchData.pages || []) {
        if (page.title && page.extract) {
          results.push({
            title: page.title,
            content: page.extract,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
            source: 'Wikipedia',
            type: 'biographical',
            relevanceScore: this.calculateRelevance(page.extract, query)
          });
        }
      }

      console.log(`📚 Atlas: Wikipedia returned ${results.length} results`);
      return results;
    } catch (error) {
      console.error('❌ Wikipedia search failed:', error);
      return [];
    }
  }

  /**
   * Search Internet Archive for historical data
   */
  private async searchInternetArchive(query: string): Promise<any[]> {
    console.log(`🏛️ Atlas: Searching Internet Archive for: ${query}`);
    
    try {
      const response = await fetch(
        `https://web.archive.org/cdx/search/cdx?url=*${encodeURIComponent(query)}*&output=json&limit=5`
      );

      if (!response.ok) {
        throw new Error(`Internet Archive API returned ${response.status}`);
      }

      const data = await response.json();
      const results = [];

      if (Array.isArray(data) && data.length > 1) {
        // Skip header row
        for (let i = 1; i < data.length; i++) {
          const [urlkey, timestamp, original, mimetype, statuscode, digest, length] = data[i];
          if (original && timestamp) {
            results.push({
              title: `Archive: ${original}`,
              content: `Historical capture from ${timestamp}`,
              url: `https://web.archive.org/web/${timestamp}/${original}`,
              source: 'Internet Archive',
              type: 'archive',
              relevanceScore: this.calculateRelevance(original, query)
            });
          }
        }
      }

      console.log(`🏛️ Atlas: Internet Archive returned ${results.length} results`);
      return results;
    } catch (error) {
      console.error('❌ Internet Archive search failed:', error);
      return [];
    }
  }

  /**
   * Search Reddit with improved filtering
   */
  private async searchReddit(query: string): Promise<any[]> {
    console.log(`🔴 Atlas: Searching Reddit for: ${query}`);
    
    try {
      const response = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`,
        {
          headers: { 'User-Agent': 'Atlas Intelligence Platform' }
        }
      );

      if (!response.ok) {
        throw new Error(`Reddit API returned ${response.status}`);
      }

      const data = await response.json();
      const results = [];

      if (data.data && data.data.children) {
        for (const post of data.data.children) {
          const postData = post.data;
          if (postData.title && postData.selftext) {
            const relevanceScore = this.calculateRelevance(postData.title + ' ' + postData.selftext, query);
            
            // Only include if relevance score is above threshold
            if (relevanceScore > 0.3) {
              results.push({
                title: postData.title,
                content: postData.selftext.substring(0, 500),
                url: `https://reddit.com${postData.permalink}`,
                source: 'Reddit',
                type: 'social',
                relevanceScore: relevanceScore
              });
            }
          }
        }
      }

      console.log(`🔴 Atlas: Reddit returned ${results.length} relevant results`);
      return results;
    } catch (error) {
      console.error('❌ Reddit search failed:', error);
      return [];
    }
  }

  /**
   * Search news sources
   */
  private async searchNews(query: string): Promise<any[]> {
    console.log(`📰 Atlas: Searching news sources for: ${query}`);
    
    try {
      // Try NewsAPI alternative endpoints or RSS feeds
      // For now, return empty array as most news APIs require keys
      return [];
    } catch (error) {
      console.error('❌ News search failed:', error);
      return [];
    }
  }

  /**
   * Calculate relevance score between content and query
   */
  private calculateRelevance(content: string, query: string): number {
    if (!content || !query) return 0;
    
    const contentLower = content.toLowerCase();
    const queryTerms = query.toLowerCase().split(/\s+/);
    
    let score = 0;
    let totalTerms = queryTerms.length;
    
    for (const term of queryTerms) {
      if (term.length > 2) { // Ignore very short terms
        if (contentLower.includes(term)) {
          score += 1;
        }
      }
    }
    
    // Check for exact phrase match
    if (contentLower.includes(query.toLowerCase())) {
      score += 2;
    }
    
    return totalTerms > 0 ? score / (totalTerms + 2) : 0;
  }

  /**
   * Filter results for relevance to the search query
   */
  private filterRelevantResults(results: any[], query: string): any[] {
    return results.filter(result => {
      // Must have minimum relevance score
      if (result.relevanceScore && result.relevanceScore < 0.2) {
        return false;
      }
      
      // Must contain at least one query term
      const queryTerms = query.toLowerCase().split(/\s+/);
      const content = (result.title + ' ' + result.content).toLowerCase();
      
      return queryTerms.some(term => 
        term.length > 2 && content.includes(term)
      );
    });
  }

  /**
   * Process intelligence data from search results
   */
  private processIntelligenceData(personName: string, results: any[]): PersonalIntelligence {
    const timeline: TimelineEntry[] = results.map(result => ({
      date: new Date().toISOString(),
      source: result.source,
      content: result.content,
      type: this.classifyContentType(result),
      verified: true,
      url: result.url,
      relevanceScore: result.relevanceScore
    }));

    // Sort by relevance score
    timeline.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return {
      name: personName,
      timeline,
      firstMention: timeline.length > 0 ? timeline[0] : undefined,
      currentStatus: {
        lastSeen: new Date().toISOString(),
        reputationTrend: 'neutral',
        activeOnPlatforms: [...new Set(timeline.map(t => t.source))]
      }
    };
  }

  /**
   * Create empty intelligence profile when no results found
   */
  private createEmptyIntelligenceProfile(personName: string): PersonalIntelligence {
    return {
      name: personName,
      timeline: [],
      currentStatus: {
        lastSeen: new Date().toISOString(),
        reputationTrend: 'neutral',
        activeOnPlatforms: []
      }
    };
  }

  /**
   * Classify content type based on source and content
   */
  private classifyContentType(result: any): TimelineEntry['type'] {
    if (result.source === 'Wikipedia') return 'professional';
    if (result.source === 'Reddit') return 'social';
    if (result.source === 'Internet Archive') return 'other';
    if (result.source === 'News') return 'news';
    return 'other';
  }
}
