
// Re-export all services from a single entry point
import { 
  getMonitoringStatus,
  startMonitoring,
  runMonitoringScan
} from './monitoring/status';

import {
  saveMention,
  getAllMentions,
  clearMentions,
  getMentionsByPlatform
} from './monitoring/mentions';

import {
  getMonitoredPlatforms,
  isPlatformMonitored,
  updatePlatformStatus
} from './monitoring/platforms';

import {
  getMentionsAsAlerts
} from './monitoring/alerts';

// Export the stopMonitoring function
const stopMonitoring = () => {
  console.log("Stopping real-time monitoring services...");
  
  return {
    success: true,
    stopped: new Date().toISOString()
  };
};

// Re-export the runMonitoringScan function from scan.ts
import { runMonitoringScan as runScan } from './monitoring/scan';

// Import the OpenAI service functions
import { 
  generateAIResponse,
  generateSeoContent,
  classifyContentThreat,
  ResponseGenerationProps,
  ThreatClassificationResult
} from './secureOpenaiService';

// Import the threat classifier functions
import {
  classifyThreat,
  classifyThreatAdvanced,
  runMultiAgentAnalysis,
  runPredictiveAnalysis
} from './intelligence/threatClassifier';

// Export all services
export {
  // Monitoring status services
  getMonitoringStatus,
  startMonitoring,
  stopMonitoring,
  runScan as runMonitoringScan,
  
  // Mentions services
  saveMention,
  getAllMentions,
  clearMentions,
  getMentionsByPlatform,
  getMentionsAsAlerts,
  
  // Platform services
  getMonitoredPlatforms,
  isPlatformMonitored,
  updatePlatformStatus,
  
  // OpenAI services
  generateAIResponse,
  generateSeoContent,
  classifyContentThreat,
  ResponseGenerationProps,
  ThreatClassificationResult,
  
  // Threat classifier services
  classifyThreat,
  classifyThreatAdvanced,
  runMultiAgentAnalysis,
  runPredictiveAnalysis
};
