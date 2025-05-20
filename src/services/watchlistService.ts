
import { toast } from 'sonner';
import { EntityWatchlist, ScrapingResult } from '@/types/aiScraping';

// Mock storage for watchlist entities
let watchlistEntitiesStorage: EntityWatchlist[] = [
  {
    id: 'entity-001',
    name: 'Acme Corporation',
    type: 'organization',
    keywords: ['Acme Corp', 'Acme Corporation', 'Acme Inc'],
    sources: ['google', 'news', 'crawler'],
    alertThreshold: 6,
    scanFrequency: 'daily',
    autoRespond: true,
    lastScan: new Date(Date.now() - 86400000).toISOString(), // yesterday
    createdAt: new Date(Date.now() - 604800000).toISOString(), // a week ago
    updatedAt: new Date(Date.now() - 86400000).toISOString() // yesterday
  },
  {
    id: 'entity-002',
    name: 'Jane Smith',
    type: 'person',
    keywords: ['Jane Smith', 'J. Smith', 'CEO Jane Smith'],
    sources: ['twitter', 'google', 'news'],
    alertThreshold: 5,
    scanFrequency: 'weekly',
    autoRespond: false,
    lastScan: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
    updatedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

/**
 * Get all entities in the watchlist
 */
export const getWatchlistEntities = async (): Promise<EntityWatchlist[]> => {
  // In a real implementation, this would be fetched from a database
  return watchlistEntitiesStorage;
};

/**
 * Get a specific watchlist entity by ID
 */
export const getWatchlistEntity = async (id: string): Promise<EntityWatchlist | undefined> => {
  return watchlistEntitiesStorage.find(entity => entity.id === id);
};

/**
 * Create or update a watchlist entity
 */
export const updateWatchlistEntity = async (entity: EntityWatchlist): Promise<EntityWatchlist> => {
  // Check if the entity already exists
  const existingIndex = watchlistEntitiesStorage.findIndex(e => e.id === entity.id);
  
  if (existingIndex >= 0) {
    // Update existing entity
    watchlistEntitiesStorage[existingIndex] = {
      ...entity,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Create new entity
    watchlistEntitiesStorage.push({
      ...entity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return entity;
};

/**
 * Delete a watchlist entity
 */
export const deleteWatchlistEntity = async (id: string): Promise<boolean> => {
  const initialLength = watchlistEntitiesStorage.length;
  watchlistEntitiesStorage = watchlistEntitiesStorage.filter(e => e.id !== id);
  return watchlistEntitiesStorage.length < initialLength;
};

/**
 * Run a scan for a specific watchlist entity
 */
export const runWatchlistScan = async (entityId: string): Promise<ScrapingResult[]> => {
  // Get the entity
  const entity = await getWatchlistEntity(entityId);
  if (!entity) {
    throw new Error(`Entity with ID ${entityId} not found`);
  }
  
  // Simulate scanning process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock results
  const results: ScrapingResult[] = Array(Math.floor(Math.random() * 5) + 1)
    .fill(0)
    .map((_, i) => {
      const sourceType = entity.sources[Math.floor(Math.random() * entity.sources.length)];
      const sentiment = Math.random() * 2 - 1; // -1 to 1
      const riskScore = Math.abs(sentiment) * 10; // 0 to 10
      
      return {
        id: `result-${Date.now()}-${i}`,
        sourceId: `source-${sourceType}`,
        sourceName: sourceType.charAt(0).toUpperCase() + sourceType.slice(1),
        sourceType,
        entityName: entity.name,
        entityType: entity.type,
        content: `Mock mention of ${entity.name} with ${sentiment < 0 ? 'negative' : 'positive'} sentiment.`,
        url: 'https://example.com/mock-result',
        timestamp: new Date().toISOString(),
        sentiment,
        riskScore,
        category: sentiment < 0 ? 'Potential Risk' : 'Neutral Mention',
        aiAnalysis: {
          summary: `This is a mock ${sentiment < 0 ? 'negative' : 'positive'} mention of ${entity.name}.`,
          recommendation: sentiment < 0 ? 'Monitor closely' : 'No action needed',
          threatClassification: sentiment < 0 ? 'Low Risk' : 'No Risk'
        },
        processed: true,
        notified: false
      };
    });
  
  // Update the entity's last scan timestamp
  await updateWatchlistEntity({
    ...entity,
    lastScan: new Date().toISOString()
  });
  
  // Show a success toast if we found risks above threshold
  const risksFound = results.filter(r => (r.riskScore || 0) >= entity.alertThreshold).length;
  
  if (risksFound > 0) {
    toast.warning(`Found ${risksFound} potential risk${risksFound > 1 ? 's' : ''} for ${entity.name}`, {
      description: 'Check Results tab for details'
    });
  }
  
  return results;
};

/**
 * Run scheduled scans for all entities due for scanning
 */
export const runScheduledScans = async (): Promise<void> => {
  const now = new Date();
  const entitiesToScan: EntityWatchlist[] = [];
  
  for (const entity of watchlistEntitiesStorage) {
    // Skip disabled entities
    if (!entity.lastScan) {
      entitiesToScan.push(entity);
      continue;
    }
    
    const lastScanDate = new Date(entity.lastScan);
    let shouldScan = false;
    
    switch (entity.scanFrequency) {
      case 'daily':
        // Scan if last scan was more than 24 hours ago
        shouldScan = now.getTime() - lastScanDate.getTime() > 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        // Scan if last scan was more than 7 days ago
        shouldScan = now.getTime() - lastScanDate.getTime() > 7 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        // Scan if last scan was more than 30 days ago
        shouldScan = now.getTime() - lastScanDate.getTime() > 30 * 24 * 60 * 60 * 1000;
        break;
    }
    
    if (shouldScan) {
      entitiesToScan.push(entity);
    }
  }
  
  // Run scans for entities that are due
  for (const entity of entitiesToScan) {
    try {
      await runWatchlistScan(entity.id);
    } catch (error) {
      console.error(`Error running scheduled scan for ${entity.name}:`, error);
    }
  }
};
