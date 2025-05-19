
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
  sentiment?: 'positive' | 'neutral' | 'negative' | 'threatening';
  detectedEntities?: string[];
  potentialReach?: number;
  category?: string;
  recommendation?: string;
  ai_reasoning?: string;
  url?: string;
}

// Define content source interface
export interface ContentSource {
  id: string;
  name: string;
  active: boolean;
  lastUpdated: string;
  mentionCount: number;
  sentiment: number;
  status?: string;
}

// Define content action interface
export interface ContentAction {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
  user: string;
  platform?: string;
  date?: string;
  action?: string;
}

// Define response tone style enum
export type ResponseToneStyle = 
  'professional' | 
  'casual' | 
  'friendly' | 
  'formal' | 
  'technical' | 
  'educational' | 
  'empathetic' |
  'humorous' |
  'apologetic';

// Define SEO content type
export interface SeoContent {
  id: string;
  title: string;
  url: string;
  type: string;
  status: string;
  date: string;
  keywords?: string[];
  dateCreated?: string;
  publishDate?: string;
  score?: number;
}

// Define SourceData for DashboardMainContent component
export interface SourceData {
  id: string;
  name: string;
  active: boolean;
  lastUpdated: string;
  mentionCount: number;
  sentiment: number;
  status: string;
  positiveRatio: number;
  total: number;
}
