
// Define memory entry interface for the intelligence system
export interface MemoryEntry {
  id: string;
  timestamp: string;
  category: 'insight' | 'threat' | 'pattern' | 'response' | 'feedback';
  content: string;
  context?: string;
  source: string;
  confidence: number;
  tags: string[];
  relatedEntities?: string[];
  expiresAt?: string;
  importance?: number;
}
