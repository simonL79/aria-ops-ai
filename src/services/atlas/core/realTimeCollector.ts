import { AtlasDataEnforcer } from './dataEnforcement';

export interface RealDataSource {
  name: string;
  url: string;
  lastCheck: string;
  isLive: boolean;
  dataPoints: number;
}

export interface PersonalIntelligence {
  name: string;
  firstMention: {
    date: string;
    source: string;
    url: string;
    context: string;
  } | null;
  timeline: TimelineEntry[];
  currentStatus: {
    lastSeen: string;
    activePlatforms: string[];
    reputationTrend: 'positive' | 'negative' | 'neutral';
  };
}

export interface TimelineEntry {
  date: string;
  source: string;
  url: string;
  content: string;
  type: 'professional' | 'personal' | 'news' | 'social' | 'legal';
  sentiment: number;
  verified: boolean;
}

export interface DuckDuckGoResult {
  Title: string;
  Description: string;
  FirstURL: string;
  Text: string;
}

/**
 * Atlas Real-Time Data Collector
 * Collects ONLY verified, live data from real sources
 */
export class AtlasRealTimeCollector {
  private activeSources: RealDataSource[] = [];

  /**
   * Search for real mentions of a person across live sources
   */
  async searchPersonMentions(name: string): Promise<PersonalIntelligence> {
    // Enforce real data only from the start
    AtlasDataEnforcer.enforceRealDataOnly({ name }, 'searchPersonMentions');

    console.log(`🔍 Atlas: Starting real-time search for "${name}"`);

    const intelligence: PersonalIntelligence = {
      name,
      firstMention: null,
      timeline: [],
      currentStatus: {
        lastSeen: new Date().toISOString(),
        activePlatforms: [],
        reputationTrend: 'neutral'
      }
    };

    try {
      // Search across real sources only
      const searchResults = await this.executeRealTimeSearch(name);
      
      // Process only verified real results
      for (const result of searchResults) {
        const validation = AtlasDataEnforcer.validateRealData(result, 'search_result');
        
        if (validation.isRealData) {
          const timelineEntry: TimelineEntry = {
            date: result.date || new Date().toISOString(),
            source: result.source,
            url: result.url,
            content: result.content,
            type: this.classifyContentType(result.content),
            sentiment: this.analyzeSentiment(result.content),
            verified: await AtlasDataEnforcer.verifyLiveUrl(result.url)
          };

          intelligence.timeline.push(timelineEntry);

          // Check if this is the earliest mention
          if (!intelligence.firstMention || 
              new Date(timelineEntry.date) < new Date(intelligence.firstMention.date)) {
            intelligence.firstMention = {
              date: timelineEntry.date,
              source: timelineEntry.source,
              url: timelineEntry.url,
              context: timelineEntry.content.substring(0, 200)
            };
          }
        }
      }

      // Update current status based on findings
      intelligence.currentStatus.activePlatforms = this.extractActivePlatforms(intelligence.timeline);
      intelligence.currentStatus.reputationTrend = this.calculateReputationTrend(intelligence.timeline);

      // Sort timeline chronologically
      intelligence.timeline.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      console.log(`✅ Atlas: Found ${intelligence.timeline.length} verified real mentions`);
      return intelligence;

    } catch (error) {
      console.error('❌ Atlas search failed:', error);
      throw error;
    }
  }

  /**
   * Execute real-time search across live sources using DuckDuckGo API
   */
  private async executeRealTimeSearch(name: string): Promise<any[]> {
    const results: any[] = [];

    console.log(`🔍 Atlas: Executing live search for "${name}" via DuckDuckGo`);
    
    try {
      // Search DuckDuckGo Instant Answer API
      const duckResults = await this.searchDuckDuckGo(name);
      results.push(...duckResults);

      // Search with additional context terms
      const contextTerms = ['linkedin', 'twitter', 'news', 'company', 'profile'];
      for (const term of contextTerms) {
        const contextResults = await this.searchDuckDuckGo(`"${name}" ${term}`);
        results.push(...contextResults);
      }

      console.log(`📊 Atlas: Retrieved ${results.length} raw results from live sources`);
      
    } catch (error) {
      console.error('❌ Real-time search error:', error);
    }
    
    return results;
  }

  /**
   * Search DuckDuckGo Instant Answer API
   */
  private async searchDuckDuckGo(query: string): Promise<any[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const apiUrl = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;
      
      console.log(`🦆 Atlas: Querying DuckDuckGo for: ${query}`);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }
      
      const data = await response.json();
      const results: any[] = [];
      
      // Process Abstract (main result)
      if (data.Abstract && data.AbstractURL) {
        results.push({
          content: data.Abstract,
          url: data.AbstractURL,
          source: data.AbstractSource || 'DuckDuckGo',
          date: new Date().toISOString(),
          title: data.Heading || query
        });
      }
      
      // Process Related Topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 5)) { // Limit to 5 related topics
          if (topic.Text && topic.FirstURL) {
            results.push({
              content: topic.Text,
              url: topic.FirstURL,
              source: 'DuckDuckGo Related',
              date: new Date().toISOString(),
              title: topic.Text.substring(0, 100)
            });
          }
        }
      }
      
      // Process Results (if available)
      if (data.Results && Array.isArray(data.Results)) {
        for (const result of data.Results.slice(0, 3)) { // Limit to 3 results
          if (result.Text && result.FirstURL) {
            results.push({
              content: result.Text,
              url: result.FirstURL,
              source: 'DuckDuckGo Results',
              date: new Date().toISOString(),
              title: result.Text.substring(0, 100)
            });
          }
        }
      }
      
      console.log(`📋 Atlas: DuckDuckGo returned ${results.length} results for "${query}"`);
      return results;
      
    } catch (error) {
      console.error(`❌ DuckDuckGo search failed for "${query}":`, error);
      return [];
    }
  }

  /**
   * Extract active platforms from timeline
   */
  private extractActivePlatforms(timeline: TimelineEntry[]): string[] {
    const platforms = new Set<string>();
    
    timeline.forEach(entry => {
      const url = entry.url.toLowerCase();
      if (url.includes('linkedin')) platforms.add('LinkedIn');
      if (url.includes('twitter') || url.includes('x.com')) platforms.add('Twitter/X');
      if (url.includes('facebook')) platforms.add('Facebook');
      if (url.includes('instagram')) platforms.add('Instagram');
      if (url.includes('github')) platforms.add('GitHub');
      if (url.includes('youtube')) platforms.add('YouTube');
      
      // Add source as platform if not already categorized
      if (platforms.size === 0) {
        platforms.add(entry.source);
      }
    });
    
    return Array.from(platforms);
  }

  /**
   * Calculate reputation trend from timeline sentiment
   */
  private calculateReputationTrend(timeline: TimelineEntry[]): 'positive' | 'negative' | 'neutral' {
    if (timeline.length === 0) return 'neutral';
    
    const avgSentiment = timeline.reduce((sum, entry) => sum + entry.sentiment, 0) / timeline.length;
    
    if (avgSentiment > 0.1) return 'positive';
    if (avgSentiment < -0.1) return 'negative';
    return 'neutral';
  }

  /**
   * Classify content type based on source and content analysis
   */
  private classifyContentType(content: string): TimelineEntry['type'] {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('linkedin') || lowerContent.includes('job') || 
        lowerContent.includes('company') || lowerContent.includes('career')) {
      return 'professional';
    }
    
    if (lowerContent.includes('court') || lowerContent.includes('legal') || 
        lowerContent.includes('lawsuit')) {
      return 'legal';
    }
    
    if (lowerContent.includes('news') || lowerContent.includes('article') || 
        lowerContent.includes('reporter')) {
      return 'news';
    }
    
    if (lowerContent.includes('twitter') || lowerContent.includes('facebook') || 
        lowerContent.includes('instagram')) {
      return 'social';
    }
    
    return 'personal';
  }

  /**
   * Analyze sentiment of content
   */
  private analyzeSentiment(content: string): number {
    // Simple sentiment analysis - would be enhanced with proper NLP
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success'];
    const negativeWords = ['bad', 'terrible', 'negative', 'failure', 'problem'];
    
    const lowerContent = content.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerContent.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerContent.includes(word)) score -= 1;
    });
    
    return Math.max(-1, Math.min(1, score * 0.1));
  }

  /**
   * Get status of active real-time sources
   */
  getActiveSources(): RealDataSource[] {
    return this.activeSources;
  }

  /**
   * Add a new verified real-time source
   */
  async addRealTimeSource(source: RealDataSource): Promise<boolean> {
    AtlasDataEnforcer.enforceRealDataOnly(source, 'addRealTimeSource');
    
    // Verify the source is live
    const isLive = await AtlasDataEnforcer.verifyLiveUrl(source.url);
    
    if (isLive) {
      this.activeSources.push({
        ...source,
        isLive: true,
        lastCheck: new Date().toISOString()
      });
      return true;
    }
    
    return false;
  }
}
