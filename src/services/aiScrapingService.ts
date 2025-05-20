import { ScrapingSource, ScrapingResult, ScrapingQuery } from '@/types/aiScraping';
import { toast } from 'sonner';
import { callOpenAI } from '@/services/api/openaiClient';

// GPT Prompt Templates for reputation analysis
const GPT_PROMPTS = {
  generalWebAnalysis: `You are a reputation analyst.

Analyze the following web page content and identify:
1. The sentiment toward the person or brand mentioned
2. Whether the content contains any reputational risk
3. If there is risk, classify it: Defamation, Controversy, Lawsuit, Misconduct, Rumor, or None
4. Summarize the potential issue in 1-2 sentences
5. Rate the reputational threat from 0 (none) to 10 (severe)

Content:
"""
{content}
"""`,

  googleSearchAnalysis: `You are a digital reputation monitor.

The following are Google search snippets for a person or brand.

1. For each result, analyze sentiment (Positive, Neutral, Negative)
2. Highlight any reputational risk or controversy
3. Flag keywords like: accused, scandal, bankruptcy, legal, backlash, fraud, complaint
4. Return a list of flagged items and summarize the concern

Search Snippets:
"""
{content}
"""`,

  socialPostAnalysis: `You are scanning public posts for reputational risk.

Analyze the following social posts. For each post:
1. Identify sentiment (Positive, Neutral, Negative)
2. Does it reference a person or brand negatively?
3. Flag harmful language or insinuations
4. Rate risk level: None, Low, Medium, High
5. Suggest whether the brand should respond or ignore

Posts:
"""
{content}
"""`,

  reputationScoreEstimator: `Based on the following web mentions and summaries, estimate the reputation health of the individual or brand mentioned.

Instructions:
1. Weigh how many mentions are positive vs. negative
2. Consider severity of any flagged content
3. Output a reputation score from 0-100
4. Write 2-3 sentence summary of the brand's public perception

Mentions:
"""
{content}
"""`,

  generateResponse: `Write a professional public response to this reputational issue, written in an {tone} tone.

Include:
- Acknowledgment of the issue
- Brief correction (if needed)
- A call to move forward and offer support/resources

Issue Summary:
"""
{content}
"""`,
};

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

// Analyze content using the appropriate prompt template
const analyzeContentWithAI = async (content: string, sourceType: string, entityName: string): Promise<{
  sentiment: number;
  summary?: string;
  recommendation?: string;
  threatClassification?: string;
  riskScore?: number;
  category?: string;
}> => {
  try {
    // Select the appropriate prompt template based on source type
    let promptTemplate = '';
    
    switch (sourceType) {
      case 'google':
        promptTemplate = GPT_PROMPTS.googleSearchAnalysis;
        break;
      case 'news':
        promptTemplate = GPT_PROMPTS.generalWebAnalysis;
        break;
      case 'social':
      case 'twitter':
        promptTemplate = GPT_PROMPTS.socialPostAnalysis;
        break;
      default:
        promptTemplate = GPT_PROMPTS.generalWebAnalysis;
    }
    
    // Insert the content into the prompt template
    const prompt = promptTemplate.replace('{content}', content);
    
    // Call the OpenAI API
    const response = await callOpenAI({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are A.R.I.A™, an AI reputation intelligence analyst that analyzes content for reputation risks.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.3
    });
    
    const analysisText = response.choices[0].message.content;
    
    // Parse the analysis to extract sentiment, risk score, etc.
    const sentimentMatch = analysisText.match(/sentiment[:\s]+([a-zA-Z]+)/i);
    const riskMatch = analysisText.match(/threat[:\s]+(\d+)/i) || analysisText.match(/risk[:\s]+(none|low|medium|high)/i);
    const summaryMatch = analysisText.match(/summarize[:\s]+(.*?)(?=\n|$)/i);
    
    // Convert sentiment text to numeric value
    let sentiment = 0;
    if (sentimentMatch) {
      const sentimentText = sentimentMatch[1].toLowerCase();
      if (sentimentText.includes('positive')) sentiment = 0.7;
      else if (sentimentText.includes('negative')) sentiment = -0.7;
    }
    
    // Convert risk score text to numeric value
    let riskScore = 0;
    if (riskMatch) {
      const riskText = riskMatch[1].toLowerCase();
      if (!isNaN(Number(riskText))) {
        riskScore = Number(riskText);
      } else {
        if (riskText === 'high') riskScore = 8;
        else if (riskText === 'medium') riskScore = 5;
        else if (riskText === 'low') riskScore = 2;
      }
    }
    
    // Extract category from the analysis
    let category = 'Neutral';
    if (analysisText.toLowerCase().includes('defamation')) category = 'Reputation Threat';
    else if (analysisText.toLowerCase().includes('lawsuit')) category = 'Legal Risk';
    else if (analysisText.toLowerCase().includes('controversy')) category = 'Reputation Threat';
    else if (analysisText.toLowerCase().includes('misconduct')) category = 'Reputation Threat';
    else if (analysisText.toLowerCase().includes('rumor')) category = 'Misinformation';
    else if (sentiment > 0.3) category = 'Positive';
    
    return {
      sentiment,
      summary: summaryMatch ? summaryMatch[1] : 'AI analysis of content',
      recommendation: riskScore > 5 ? 'Monitor closely' : 'No action needed',
      threatClassification: riskScore > 7 ? 'Potential threat' : 'No threat detected',
      riskScore,
      category
    };
  } catch (error) {
    console.error('Error analyzing content with AI:', error);
    return {
      sentiment: 0,
      summary: 'Error analyzing content',
      riskScore: 0,
      category: 'Error'
    };
  }
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
  for (const source of sources) {
    const resultCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < resultCount; i++) {
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)] as 'person' | 'organization' | 'location';
      const content = generateMockContent(query.query, source.type, 0); // Neutral content initially
      
      // Analyze the content with AI
      const aiAnalysis = await analyzeContentWithAI(content, source.type, query.query);
      
      const result: ScrapingResult = {
        id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceId: source.id,
        sourceName: source.name,
        sourceType: source.type,
        entityName: query.query,
        entityType,
        content: content,
        url: source.type !== 'manual' ? `https://example.com/${source.type}/${Math.random().toString(36).substr(2, 5)}` : undefined,
        timestamp: new Date().toISOString(),
        sentiment: aiAnalysis.sentiment,
        category: aiAnalysis.category,
        riskScore: aiAnalysis.riskScore,
        aiAnalysis: {
          summary: aiAnalysis.summary,
          recommendation: aiAnalysis.recommendation,
          threatClassification: aiAnalysis.threatClassification
        },
        processed: false
      };
      
      mockResults.push(result);
    }
  }
  
  // Save the results
  const allResults = getResults();
  const combined = [...mockResults, ...allResults];
  saveResults(combined);
  
  toast.success(`Found ${mockResults.length} mentions`, {
    description: `AI has analyzed and classified the results`
  });
  
  return mockResults;
};

// Generate response to a reputation issue
export const generateResponse = async (issue: string, tone: 'empathetic' | 'legal' | 'confident' | 'firm' = 'empathetic'): Promise<string> => {
  try {
    const prompt = GPT_PROMPTS.generateResponse
      .replace('{content}', issue)
      .replace('{tone}', tone);
      
    const response = await callOpenAI({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are A.R.I.A™, an AI reputation intelligence expert that crafts appropriate responses to reputation issues.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.7
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Error generating response. Please try again.';
  }
};

// Add a manual result
export const addManualResult = async (data: {
  entityName: string;
  entityType: 'person' | 'organization' | 'location';
  content: string;
  url?: string;
  sentiment?: number;
  category?: string;
}): Promise<ScrapingResult> => {
  // Use AI to analyze the content
  const aiAnalysis = await analyzeContentWithAI(data.content, 'manual', data.entityName);
  
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
    sentiment: data.sentiment !== undefined ? data.sentiment : aiAnalysis.sentiment,
    category: data.category || aiAnalysis.category,
    riskScore: aiAnalysis.riskScore,
    aiAnalysis: {
      summary: aiAnalysis.summary,
      recommendation: aiAnalysis.recommendation,
      threatClassification: aiAnalysis.threatClassification
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
