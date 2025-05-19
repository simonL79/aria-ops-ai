
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
