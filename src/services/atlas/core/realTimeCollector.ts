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

    console.log(`🔍 Atlas: Starting enhanced real-time search for "${name}"`);

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
      // Search across multiple real sources
      const searchResults = await this.executeEnhancedRealTimeSearch(name);
      
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
            verified: await this.verifyUrlAccessible(result.url)
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
   * Enhanced real-time search using multiple free sources
   */
  private async executeEnhancedRealTimeSearch(name: string): Promise<any[]> {
    const results: any[] = [];

    console.log(`🔍 Atlas: Executing enhanced search for "${name}"`);
    
    try {
      // 1. Try Wikipedia API (reliable and free)
      const wikiResults = await this.searchWikipedia(name);
      results.push(...wikiResults);

      // 2. Try Internet Archive Wayback Machine
      const archiveResults = await this.searchInternetArchive(name);
      results.push(...archiveResults);

      // 3. Try alternative DuckDuckGo approach
      const duckResults = await this.searchDuckDuckGoAlternative(name);
      results.push(...duckResults);

      // 4. Try Reddit search (free API)
      const redditResults = await this.searchReddit(name);
      results.push(...redditResults);

      console.log(`📊 Atlas: Retrieved ${results.length} results from enhanced sources`);
      
    } catch (error) {
      console.error('❌ Enhanced search error:', error);
    }
    
    return results;
  }

  /**
   * Search Wikipedia API
   */
  private async searchWikipedia(query: string): Promise<any[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/search?q=${encodedQuery}&limit=5`;
      
      console.log(`📚 Atlas: Searching Wikipedia for: ${query}`);
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        console.warn(`Wikipedia API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      const results: any[] = [];
      
      if (data.pages && Array.isArray(data.pages)) {
        for (const page of data.pages.slice(0, 3)) {
          if (page.title && page.description) {
            results.push({
              content: `${page.title}: ${page.description}`,
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
              source: 'Wikipedia',
              date: new Date().toISOString(),
              title: page.title
            });
          }
        }
      }
      
      console.log(`📚 Atlas: Wikipedia returned ${results.length} results`);
      return results;
      
    } catch (error) {
      console.error(`❌ Wikipedia search failed:`, error);
      return [];
    }
  }

  /**
   * Search Internet Archive Wayback Machine
   */
  private async searchInternetArchive(query: string): Promise<any[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const searchUrl = `https://web.archive.org/cdx/search/cdx?url=*${encodedQuery}*&output=json&limit=5`;
      
      console.log(`🏛️ Atlas: Searching Internet Archive for: ${query}`);
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        console.warn(`Internet Archive API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      const results: any[] = [];
      
      if (Array.isArray(data) && data.length > 1) {
        // Skip first row (headers) and process results
        for (const row of data.slice(1, 4)) {
          if (row.length >= 3) {
            results.push({
              content: `Archived page mentioning ${query}`,
              url: `https://web.archive.org/web/${row[1]}/${row[2]}`,
              source: 'Internet Archive',
              date: row[1] ? this.parseArchiveDate(row[1]) : new Date().toISOString(),
              title: `Archive: ${row[2]}`
            });
          }
        }
      }
      
      console.log(`🏛️ Atlas: Internet Archive returned ${results.length} results`);
      return results;
      
    } catch (error) {
      console.error(`❌ Internet Archive search failed:`, error);
      return [];
    }
  }

  /**
   * Alternative DuckDuckGo search using their zero-click info API
   */
  private async searchDuckDuckGoAlternative(query: string): Promise<any[]> {
    try {
      // Try multiple DuckDuckGo endpoints
      const endpoints = [
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`,
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' profile')}&format=json&pretty=1`,
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' bio')}&format=json&pretty=1`
      ];
      
      const results: any[] = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🦆 Atlas: Trying DuckDuckGo endpoint for: ${query}`);
          
          const response = await fetch(endpoint, {
            headers: {
              'User-Agent': 'Atlas Intelligence Platform'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Check for abstract/definition
            if (data.Abstract && data.AbstractURL) {
              results.push({
                content: data.Abstract,
                url: data.AbstractURL,
                source: 'DuckDuckGo Abstract',
                date: new Date().toISOString(),
                title: data.Heading || query
              });
            }
            
            // Check for infobox data
            if (data.Infobox && Array.isArray(data.Infobox.content)) {
              const infoContent = data.Infobox.content
                .map(item => `${item.label}: ${item.value}`)
                .join(', ');
              
              if (infoContent) {
                results.push({
                  content: infoContent,
                  url: data.AbstractURL || '#',
                  source: 'DuckDuckGo Infobox',
                  date: new Date().toISOString(),
                  title: `${query} - Profile Data`
                });
              }
            }
          }
        } catch (endpointError) {
          console.warn(`DuckDuckGo endpoint failed:`, endpointError);
        }
      }
      
      console.log(`🦆 Atlas: DuckDuckGo alternative returned ${results.length} results`);
      return results;
      
    } catch (error) {
      console.error(`❌ DuckDuckGo alternative search failed:`, error);
      return [];
    }
  }

  /**
   * Search Reddit (free API)
   */
  private async searchReddit(query: string): Promise<any[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const searchUrl = `https://www.reddit.com/search.json?q=${encodedQuery}&limit=5&sort=relevance`;
      
      console.log(`🔴 Atlas: Searching Reddit for: ${query}`);
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Atlas Intelligence Platform'
        }
      });
      
      if (!response.ok) {
        console.warn(`Reddit API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      const results: any[] = [];
      
      if (data.data && data.data.children && Array.isArray(data.data.children)) {
        for (const post of data.data.children.slice(0, 3)) {
          if (post.data && post.data.title) {
            results.push({
              content: `${post.data.title} - ${post.data.selftext || 'Reddit discussion'}`,
              url: `https://reddit.com${post.data.permalink}`,
              source: 'Reddit',
              date: new Date(post.data.created_utc * 1000).toISOString(),
              title: post.data.title
            });
          }
        }
      }
      
      console.log(`🔴 Atlas: Reddit returned ${results.length} results`);
      return results;
      
    } catch (error) {
      console.error(`❌ Reddit search failed:`, error);
      return [];
    }
  }

  /**
   * Parse Internet Archive date format
   */
  private parseArchiveDate(timestamp: string): string {
    try {
      // Archive timestamps are in format YYYYMMDDHHMMSS
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      const day = timestamp.substring(6, 8);
      return new Date(`${year}-${month}-${day}`).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  /**
   * Verify URL is accessible
   */
  private async verifyUrlAccessible(url: string): Promise<boolean> {
    try {
      // Use a simple HEAD request to check if URL is accessible
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false; // If we can't verify, assume not accessible
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
      if (url.includes('wikipedia')) platforms.add('Wikipedia');
      if (url.includes('reddit')) platforms.add('Reddit');
      if (url.includes('archive.org')) platforms.add('Internet Archive');
      
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
        lowerContent.includes('instagram') || lowerContent.includes('reddit')) {
      return 'social';
    }
    
    return 'personal';
  }

  /**
   * Analyze sentiment of content
   */
  private analyzeSentiment(content: string): number {
    // Simple sentiment analysis - would be enhanced with proper NLP
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'award', 'achievement'];
    const negativeWords = ['bad', 'terrible', 'negative', 'failure', 'problem', 'controversy', 'scandal'];
    
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
