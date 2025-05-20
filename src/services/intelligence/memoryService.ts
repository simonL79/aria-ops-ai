
import { MemoryEntry } from '@/types/intelligence';

// In-memory storage for demo purposes
// In a production app, this would be connected to a database
const memoryStore: MemoryEntry[] = [];

/**
 * Store a new memory entry in the system
 */
export const storeMemory = (entry: MemoryEntry): MemoryEntry => {
  memoryStore.unshift(entry);
  return entry;
};

/**
 * Retrieve memory entries based on optional filters
 */
export const getMemories = (
  options?: {
    category?: MemoryEntry['category'];
    limit?: number;
    searchTerm?: string;
    minConfidence?: number;
  }
): MemoryEntry[] => {
  let results = [...memoryStore];
  
  // Apply filters if provided
  if (options?.category) {
    results = results.filter(entry => entry.category === options.category);
  }
  
  if (options?.searchTerm) {
    const term = options.searchTerm.toLowerCase();
    results = results.filter(entry => 
      entry.content.toLowerCase().includes(term) || 
      (entry.context?.toLowerCase().includes(term)) ||
      entry.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
  
  if (options?.minConfidence) {
    results = results.filter(entry => entry.confidence >= options.minConfidence);
  }
  
  // Apply limit if provided
  if (options?.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }
  
  return results;
};

/**
 * Add sample memories for testing purposes
 */
export const addSampleMemories = (): void => {
  const sampleMemories: MemoryEntry[] = [
    {
      id: 'mem-1',
      timestamp: new Date().toISOString(),
      category: 'insight',
      content: 'Users tend to respond positively to empathetic messaging during crisis situations',
      source: 'response-analysis',
      confidence: 0.87,
      tags: ['crisis-management', 'messaging', 'user-psychology']
    },
    {
      id: 'mem-2',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      category: 'threat',
      content: 'Coordinated negative reviews appearing across multiple platforms simultaneously',
      context: 'Detected pattern from competitor IP ranges',
      source: 'threat-detection',
      confidence: 0.92,
      tags: ['competitor-activity', 'review-manipulation']
    },
    {
      id: 'mem-3',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      category: 'pattern',
      content: 'News coverage peaks 48-72 hours after initial social media mentions',
      source: 'trend-analysis',
      confidence: 0.78,
      tags: ['media-cycle', 'timing']
    },
    {
      id: 'mem-4',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      category: 'response',
      content: 'Proactive press releases reduced negative coverage by approximately 35%',
      source: 'effectiveness-analysis',
      confidence: 0.81,
      tags: ['press-release', 'mitigation']
    },
    {
      id: 'mem-5',
      timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      category: 'feedback',
      content: 'Users reported improved trust after transparent communication about service issues',
      source: 'customer-feedback',
      confidence: 0.89,
      tags: ['transparency', 'trust', 'communication']
    }
  ];
  
  sampleMemories.forEach(memory => memoryStore.push(memory));
};

// Initialize with sample data for demo purposes
addSampleMemories();
