
// Export specific types from each module to avoid naming conflicts

// From agents.ts
export type { 
  AgentRole,
  IntelligenceAgent,
  AgentCollaboration 
} from './agents';

// From components.ts
export type { 
  IntelligenceStrategy 
} from './components';

// From core.ts
export type { 
  AlertSeverity,
  IntelligenceLevel,
  SourceType,
  ContentAlertUpdate
} from './core';
export { getIntelligenceLevelColor } from './core';

// From memory.ts
export type { 
  MemoryEntry 
} from './memory';

// From prediction.ts
export type { 
  PredictionModel,
  RedTeamSimulation
} from './prediction';

// From reports.ts
export type { 
  IntelligenceReport 
} from './reports';

// From sources.ts
export type { 
  ThreatSource,
  DataSourceStats 
} from './sources';

// From threats.ts
export type { 
  ContentThreatType,
  ContentThreat,
  ThreatVector,
  ThreatClassifierRequest,
  ThreatClassificationResult
} from './threats';
