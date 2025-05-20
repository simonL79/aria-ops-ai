
// Re-export all services from a single entry point
// OpenAI API Client
export { callOpenAI } from './api/openaiClient';

// Response Generation Services
export { generateAIResponse } from './responses/responseGenerator';
export type { ResponseGenerationProps } from './responses/responseGenerator';

// SEO Content Generation
export { generateSeoContent } from './content/seoContentGenerator';

// Content Classification
export { classifyContentThreat } from './intelligence/contentClassifier';
export type { ThreatClassificationResult } from './intelligence/contentClassifier';

// Threat Classification
export { 
  classifyThreat,
  classifyThreatAdvanced 
} from './intelligence/threatClassifier';

// Multi-agent Analysis
export { runMultiAgentAnalysis } from './intelligence/multiAgentAnalysis';

// Predictive Analysis
export { runPredictiveAnalysis } from './intelligence/predictiveAnalysis';

// Data Ingestion Services
export { 
  fetchContent, 
  connectDataSource, 
  getAvailableSources 
} from './dataIngestion';
export type { 
  ThreatSource, 
  IngestionOptions 
} from './dataIngestion/types';

// Monitoring Services
export {
  getMonitoringStatus,
  startMonitoring,
  stopMonitoring,
  runMonitoringScan,
  getMentionsAsAlerts,
  getMonitoredPlatforms,
  isPlatformMonitored
} from './monitoring';
export type {
  MonitoringStatus,
  MonitorablePlatform
} from './monitoring';
