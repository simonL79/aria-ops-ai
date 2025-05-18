// Define content threat type
export type ContentThreatType = 
  'falseReviews' | 
  'coordinatedAttack' | 
  'competitorSmear' | 
  'botActivity' | 
  'misinformation' | 
  'legalRisk' | 
  'viralThreat';

// Define a content threat interface that contains more information
export interface ContentThreat {
  type: ContentThreatType;
  description: string;
  icon: React.ReactElement;
  detectionRate: number;
  difficulty: 'easy' | 'moderate' | 'hard';
}

// Define intelligence strategy
export interface IntelligenceStrategy {
  name: string;
  description: string;
  effectivenessRate: number;
  platforms: string[];
  timeToImplement: string;
  icon: React.ReactElement;
}

// Define alert severity
export type AlertSeverity = 'high' | 'medium' | 'low';

// Define threat source
export interface ThreatSource {
  id: string;
  name: string;
  type: string;
  confidence?: number;
  lastUpdated?: string;
  platform: string;
  active: boolean;
  lastScan?: string;
  credentials: {
    type: string;
    status: string;
  };
}

// Define intelligence levels
export type IntelligenceLevel = 
  'basic' | 
  'advanced' | 
  'enterprise' | 
  'expert';

// Source types
export type SourceType = 
  'social' | 
  'news' | 
  'review' | 
  'forum' | 
  'darkweb';

// For threat vectors and analysis
export interface ThreatVector {
  type: string;
  count: number; 
  severity: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  examples: string[];
}

export interface IntelligenceReport {
  id: string;
  title: string;
  date: string;
  summary: string;
  threatLevel: number;
  topics: string[];
  sources: number;
  mentions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface DataSourceStats {
  source: string;
  mentions: number;
  sentiment: number;
  coverage: number;
}

// For the UI components
export interface ThreatFeedProps {
  threats: any[];
  loading?: boolean;
  onThreatSelect?: (threat: any) => void;
}

export interface TimelineViewProps {
  data: any[];
  period?: 'day' | 'week' | 'month' | 'year';
  loading?: boolean;
}

export interface ActionPanelProps {
  selectedAlert?: any;
  onApprove?: (response: string) => void;
  onSend?: (response: string) => void;
}

export interface SEOTrackerProps {
  keywords: string[];
  positions: any[];
  loading?: boolean;
}

// Helper function for Intelligence level colors
export const getIntelligenceLevelColor = (level: IntelligenceLevel): string => {
  switch(level) {
    case 'basic':
      return 'bg-blue-500';
    case 'advanced':
      return 'bg-green-500';
    case 'enterprise':
      return 'bg-purple-500';
    case 'expert':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

// Update dashboard.ts ContentAlert interface to include 'read' status
export interface ContentAlertUpdate {
  status: 'read' | 'new' | 'reviewing' | 'actioned';
}

// FastAPI threat classification types
export interface ThreatClassifierRequest {
  content: string;
  platform: string;
  brand: string;
}

export interface ThreatClassificationResult {
  category: 'Neutral' | 'Positive' | 'Complaint' | 'Reputation Threat' | 'Misinformation' | 'Legal Risk';
  severity: number; // 1-10
  recommendation: string;
  ai_reasoning: string;
}

// Define AI agent types
export type AgentRole = 
  'sentinel' | 
  'liaison' | 
  'legal' | 
  'outreach' | 
  'researcher' | 
  'predictor';

// Define AI agent interface
export interface IntelligenceAgent {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  capabilities: string[];
  active: boolean;
  lastAction?: string;
  memory?: {
    incidentsAnalyzed: number;
    decisionsRecorded: number;
    memoryVectors: number;
  };
  tools: string[];
}

// Define Agent collaboration types
export interface AgentCollaboration {
  id: string;
  title: string;
  description: string;
  agents: AgentRole[];
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  results?: {
    insights: string[];
    recommendations: string[];
    actions: string[];
  };
}

// Define prediction model
export interface PredictionModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTrained: string;
  predictionType: 'virality' | 'sentiment' | 'seo' | 'attack';
  activeIndicators: string[];
}

// Define simulation scenario
export interface RedTeamSimulation {
  id: string;
  title: string;
  description: string;
  scenario: string;
  status: 'planned' | 'running' | 'completed';
  results?: {
    defenseScore: number;
    vulnerabilities: string[];
    recommendations: string[];
  };
  createdAt: string;
  completedAt?: string;
}

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
