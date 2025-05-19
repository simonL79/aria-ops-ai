
// Define client change interface
export interface ClientChange {
  id: string;
  clientId: string;
  clientName: string;
  type: 'update' | 'incident' | 'request';
  description: string;
  timestamp: Date;
  severity?: number;
  read: boolean;
}

// Define content alert interface
export interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'reviewing';
  sourceType?: string;
  threatType?: string;
  confidenceScore?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  detectedEntities?: string[];
  potentialReach?: number;
}

// Define content source interface
export interface ContentSource {
  id: string;
  name: string;
  active: boolean;
  lastUpdated: string;
  mentionCount: number;
  sentiment: number;
}

// Define content action interface
export interface ContentAction {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
  user: string;
}

// Define response tone style enum
export type ResponseToneStyle = 
  'professional' | 
  'casual' | 
  'friendly' | 
  'formal' | 
  'technical' | 
  'educational' | 
  'empathetic';

// Define SEO content type
export interface SeoContent {
  id: string;
  title: string;
  url: string;
  type: string;
  status: string;
  date: string;
}
