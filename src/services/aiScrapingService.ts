
import { ScrapingSource, ScrapingResult, ScrapingQuery } from '@/types/aiScraping';
import { toast } from 'sonner';

// Sample sources for demonstration
const defaultSources: ScrapingSource[] = [
  {
    id: 'google-search',
    name: 'Google Search',
    type: 'google',
    enabled: true,
    lastScan: new Date().toISOString(),
    config: {
      maxResults: 5
    }
  },
  {
    id: 'news-aggregator',
    name: 'News Aggregator',
    type: 'news',
    enabled: true,
    config: {
      cronSchedule: '0 */6 * * *' // Every 6 hours
    }
  },
  {
    id: 'manual-input',
    name: 'Manual Input',
    type: 'manual',
    enabled: true
  },
  {
    id: 'web-crawler',
    name: 'Web Crawler',
    type: 'crawler',
    enabled: false,
    config: {
      cronSchedule: '0 0 * * *' // Daily
    }
  },
  {
    id: 'zapier-webhook',
    name: 'Zapier Integration',
    type: 'zapier',
    enabled: false
  }
];

// Use localStorage to persist sources
const getSources = (): ScrapingSource[] => {
  const stored = localStorage.getItem('scraping_sources');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored sources:', e);
      return defaultSources;
    }
  }
  return defaultSources;
};

const saveSources = (sources: ScrapingSource[]): void => {
  localStorage.setItem('scraping_sources', JSON.stringify(sources));
};

// Use localStorage to persist results
const getResults = (): ScrapingResult[] => {
  const stored = localStorage.getItem('scraping_results');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored results:', e);
      return [];
    }
  }
  return [];
};

const saveResults = (results: ScrapingResult[]): void => {
  localStorage.setItem('scraping_results', JSON.stringify(results));
};

// Add or update a source
export const updateSource = (source: ScrapingSource): void => {
  const sources = getSources();
  const index = sources.findIndex(s => s.id === source.id);
  
  if (index >= 0) {
    sources[index] = { ...sources[index], ...source };
  } else {
    sources.push(source);
  }
  
  saveSources(sources);
};

// Delete a source
export const deleteSource = (id: string): void => {
  const sources = getSources().filter(s => s.id !== id);
  saveSources(sources);
};

// Toggle source enabled state
export const toggleSourceEnabled = (id: string, enabled: boolean): void => {
  const sources = getSources();
  const source = sources.find(s => s.id === id);
  
  if (source) {
    source.enabled = enabled;
    saveSources(sources);
  }
};

// Get all available sources
export const getAllSources = (): ScrapingSource[] => {
  return getSources();
};

// Get enabled sources
export const getEnabledSources = (): ScrapingSource[] => {
  return getSources().filter(s => s.enabled);
};

// Add a new result
export const addResult = (result: ScrapingResult): void => {
  const results = getResults();
  results.push({
    ...result,
    id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  });
  saveResults(results);
};

// Get all results
export const getAllResults = (): ScrapingResult[] => {
  return getResults();
};

// Filter results
export const filterResults = (
  entityType?: string,
  sourceName?: string,
  startDate?: string,
  endDate?: string
): ScrapingResult[] => {
  let results = getResults();
  
  if (entityType) {
    results = results.filter(r => r.entityType === entityType);
  }
  
  if (sourceName) {
    results = results.filter(r => r.sourceName === sourceName);
  }
  
  if (startDate) {
    const start = new Date(startDate);
    results = results.filter(r => new Date(r.timestamp) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    results = results.filter(r => new Date(r.timestamp) <= end);
  }
  
  return results;
};

// Simulate running a scraping operation
export const runScraping = async (query: ScrapingQuery): Promise<ScrapingResult[]> => {
  // In a real implementation, this would connect to your backend or edge function
  // that performs the actual scraping and AI analysis
  
  toast.info("Starting AI-powered scraping", {
    description: `Scanning sources for "${query.query}"...`
  });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate some mock results
  const mockResults: ScrapingResult[] = [];
  const sources = getEnabledSources();
  const entityTypes = query.entityTypes || ['person', 'organization'];
  
  // For each enabled source, generate 1-3 results
  sources.forEach(source => {
    const resultCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < resultCount; i++) {
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)] as 'person' | 'organization' | 'location';
      const sentiment = Math.random() * 2 - 1; // Range from -1 to 1
      const riskScore = Math.abs(sentiment) * 10; // Higher risk for more negative sentiment
      
      const result: ScrapingResult = {
        id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceId: source.id,
        sourceName: source.name,
        sourceType: source.type,
        entityName: query.query,
        entityType,
        content: generateMockContent(query.query, source.type, sentiment),
        url: source.type !== 'manual' ? `https://example.com/${source.type}/${Math.random().toString(36).substr(2, 5)}` : undefined,
        timestamp: new Date().toISOString(),
        sentiment,
        category: sentiment < -0.3 ? 'Reputation Threat' : sentiment > 0.3 ? 'Positive' : 'Neutral',
        riskScore,
        aiAnalysis: {
          summary: `AI analysis of content related to ${query.query}`,
          recommendation: sentiment < -0.2 ? 'Monitor closely' : 'No action needed',
          threatClassification: sentiment < -0.5 ? 'Potential threat' : 'No threat detected'
        },
        processed: false
      };
      
      mockResults.push(result);
    }
  });
  
  // Save the results
  const allResults = getResults();
  const combined = [...mockResults, ...allResults];
  saveResults(combined);
  
  toast.success(`Found ${mockResults.length} mentions`, {
    description: `AI has analyzed and classified the results`
  });
  
  return mockResults;
};

// Add a manual result
export const addManualResult = (data: {
  entityName: string;
  entityType: 'person' | 'organization' | 'location';
  content: string;
  url?: string;
  sentiment?: number;
  category?: string;
}): ScrapingResult => {
  // In a real implementation, this would send the content to an AI for analysis
  // before storing the result
  
  const sentiment = data.sentiment !== undefined ? data.sentiment : Math.random() * 2 - 1;
  const riskScore = Math.abs(sentiment) * 10;
  
  const result: ScrapingResult = {
    id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sourceId: 'manual-input',
    sourceName: 'Manual Input',
    sourceType: 'manual',
    entityName: data.entityName,
    entityType: data.entityType,
    content: data.content,
    url: data.url,
    timestamp: new Date().toISOString(),
    sentiment,
    category: data.category || (sentiment < -0.3 ? 'Reputation Threat' : sentiment > 0.3 ? 'Positive' : 'Neutral'),
    riskScore,
    aiAnalysis: {
      summary: `AI analysis of manually entered content related to ${data.entityName}`,
      recommendation: sentiment < -0.2 ? 'Monitor closely' : 'No action needed',
      threatClassification: sentiment < -0.5 ? 'Potential threat' : 'No threat detected'
    },
    processed: false
  };
  
  addResult(result);
  return result;
};

// Helper function to generate mock content
const generateMockContent = (query: string, sourceType: string, sentiment: number): string => {
  const positive = [
    `${query} has received positive feedback from customers`,
    `Great experience with ${query}, highly recommended`,
    `${query} demonstrates excellent business practices`,
    `Top-rated service provided by ${query}`
  ];
  
  const neutral = [
    `${query} was mentioned in an industry report`,
    `Recent updates from ${query} include new service offerings`,
    `${query} participated in the local business forum`,
    `Information about ${query} was discussed in a recent article`
  ];
  
  const negative = [
    `Concerns have been raised about ${query}'s business practices`,
    `Several complaints about ${query} have surfaced online`,
    `${query} facing criticism for recent decisions`,
    `Issues reported regarding ${query}'s customer service`
  ];
  
  let contentArray;
  if (sentiment > 0.3) {
    contentArray = positive;
  } else if (sentiment < -0.3) {
    contentArray = negative;
  } else {
    contentArray = neutral;
  }
  
  const randomIndex = Math.floor(Math.random() * contentArray.length);
  return `[From ${sourceType}] ${contentArray[randomIndex]}`;
};
