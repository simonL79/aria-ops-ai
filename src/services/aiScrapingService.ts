
import { ScrapingSource, ScrapingResult, ScrapingQuery } from '@/types/aiScraping';

// Mock storage for scraping sources
let scrapingSourcesStorage: ScrapingSource[] = [
  {
    id: 'source-1',
    name: 'Google Search',
    type: 'google',
    enabled: true,
    config: {
      maxResults: 10
    },
    lastScan: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'source-2',
    name: 'News Aggregator',
    type: 'news',
    enabled: true,
    config: {
      maxResults: 5
    },
    lastScan: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'source-3',
    name: 'Manual Data Entry',
    type: 'manual',
    enabled: true
  }
];

// Mock storage for scraping results
let scrapingResultsStorage: ScrapingResult[] = [];

/**
 * Get all scraping sources
 */
export const getAllSources = (): ScrapingSource[] => {
  return [...scrapingSourcesStorage];
};

/**
 * Get all enabled sources
 */
export const getEnabledSources = (): ScrapingSource[] => {
  return scrapingSourcesStorage.filter(source => source.enabled);
};

/**
 * Toggle source enabled status
 */
export const toggleSourceEnabled = (id: string, enabled: boolean): void => {
  scrapingSourcesStorage = scrapingSourcesStorage.map(source => {
    if (source.id === id) {
      return { ...source, enabled };
    }
    return source;
  });
};

/**
 * Update or create a source
 */
export const updateSource = (source: ScrapingSource): void => {
  const index = scrapingSourcesStorage.findIndex(s => s.id === source.id);
  if (index >= 0) {
    scrapingSourcesStorage[index] = source;
  } else {
    scrapingSourcesStorage.push(source);
  }
};

/**
 * Delete a source
 */
export const deleteSource = (id: string): void => {
  scrapingSourcesStorage = scrapingSourcesStorage.filter(source => source.id !== id);
};

/**
 * Get all scraping results
 */
export const getAllResults = (): ScrapingResult[] => {
  return [...scrapingResultsStorage];
};

/**
 * Filter results based on criteria
 */
export const filterResults = (
  entityType?: string,
  source?: string,
  minRiskScore?: number
): ScrapingResult[] => {
  return scrapingResultsStorage.filter(result => {
    if (entityType && result.entityType !== entityType) {
      return false;
    }
    if (source && result.sourceName !== source) {
      return false;
    }
    if (minRiskScore !== undefined && (result.riskScore || 0) < minRiskScore) {
      return false;
    }
    return true;
  });
};

/**
 * Execute a scraping query
 */
export const executeScrapingQuery = async (query: ScrapingQuery): Promise<ScrapingResult[]> => {
  // In a real implementation, this would call an API or run a web scraper
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Generate mock results based on the query
  const results: ScrapingResult[] = [];
  
  for (let i = 0; i < (Math.min(query.maxResults, 5)); i++) {
    const result: ScrapingResult = {
      id: `result-${Date.now()}-${i}`,
      sourceId: `source-${Math.floor(Math.random() * 3) + 1}`,
      sourceName: ['Google', 'Twitter', 'News API', 'Reddit'][Math.floor(Math.random() * 4)],
      sourceType: ['google', 'news', 'crawler', 'manual'][Math.floor(Math.random() * 4)],
      entityName: query.query,
      entityType: query.entityTypes[Math.floor(Math.random() * query.entityTypes.length)],
      content: `This is a sample result for "${query.query}" found through AI-powered scraping.`,
      url: `https://example.com/result/${i}`,
      timestamp: new Date().toISOString(),
      sentiment: (Math.random() * 2) - 1, // -1 to 1
      riskScore: Math.floor(Math.random() * 10) + 1, // 1-10
      aiAnalysis: {
        summary: `This is an AI-generated summary of the mention of "${query.query}".`,
        recommendation: Math.random() > 0.5 ? 'Monitor closely' : 'No action needed',
        threatClassification: Math.random() > 0.7 ? 'Potential Risk' : 'Neutral'
      },
      processed: true,
      notified: false
    };
    
    results.push(result);
  }
  
  // Add to storage
  scrapingResultsStorage = [...results, ...scrapingResultsStorage];
  
  return results;
};

/**
 * Add manual result with AI analysis
 */
export const addManualResult = async (params: {
  entityName: string;
  entityType: string;
  content: string;
  url?: string;
}): Promise<ScrapingResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate sentiment and risk score based on content length and randomness
  const sentiment = ((Math.random() * 2) - 1) * (params.content.length > 100 ? 0.8 : 0.5);
  const riskScore = Math.floor(Math.random() * 10) + 1;
  
  // Create the result with AI analysis
  const result: ScrapingResult = {
    id: `manual-${Date.now()}`,
    sourceId: 'source-3', // Manual input source
    sourceName: 'Manual Input',
    sourceType: 'manual',
    entityName: params.entityName,
    entityType: params.entityType,
    content: params.content,
    url: params.url || 'https://example.com/manual-input',
    timestamp: new Date().toISOString(),
    sentiment,
    riskScore,
    aiAnalysis: {
      summary: `This is an AI-generated analysis of manually input content about "${params.entityName}".`,
      recommendation: riskScore > 7 ? 'Requires immediate attention' : 
                       riskScore > 4 ? 'Monitor closely' : 
                       'No immediate action required',
      threatClassification: riskScore > 7 ? 'High Risk' : 
                             riskScore > 4 ? 'Medium Risk' : 
                             'Low Risk'
    },
    processed: true,
    notified: false
  };
  
  // Add to storage
  scrapingResultsStorage = [result, ...scrapingResultsStorage];
  
  return result;
};
