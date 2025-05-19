
// Define memory entry for AI learning
export interface MemoryEntry {
  id: string;
  content: string;
  context: string;
  timestamp: string;
  tags: string[];
  relatedEntities?: string[];
  importance: number;
  vector?: number[]; // For vector embedding
}
