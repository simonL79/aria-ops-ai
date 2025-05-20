
import React from 'react';

// Define agent roles
export type AgentRole = 
  'analyst' | 
  'responder' | 
  'monitor' | 
  'researcher' |
  'coordinator' |
  'predictor' |
  'sentinel' |
  'legal' |
  'liaison' |
  'outreach';

// Define intelligence agent interface
export interface IntelligenceAgent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  icon: React.ReactElement;
  capabilities: string[];
  active: boolean;
  isAI: boolean;
  lastActive?: string;
  tools?: string[];
  memory?: {
    incidentsAnalyzed: number;
    decisionsRecorded: number;
    memoryVectors: number;
  };
}

// For agent collaboration tracking
export interface AgentCollaboration {
  id: string;
  agents: string[];
  task: string;
  status: 'pending' | 'active' | 'completed';
  created: string;
  results?: string;
}
