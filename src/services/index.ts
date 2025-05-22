
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

// Re-export entity recognition services
import {
  extractEntitiesFromText,
  processEntities,
  batchProcessEntities,
  getAllEntities,
  getScanResultsByEntity,
  getEntityStatistics
} from './entityRecognition';

// Export the stopMonitoring function
const stopMonitoring = () => {
  console.log("Stopping real-time monitoring services...");
  
  return {
    success: true,
    stopped: new Date().toISOString()
  };
};

// Import the runMonitoringScan function from scan.ts
import { runMonitoringScan as runScan } from './monitoring/scan';

// Import the OpenAI service functions
import { 
  generateAIResponse,
  generateSeoContent,
  classifyContentThreat
} from './secureOpenaiService';

// Import types from secureOpenaiService
import type { 
  ResponseGenerationProps,
  ThreatClassificationResult
} from './secureOpenaiService';

// Import the threat classifier functions
import {
  classifyThreat,
  classifyThreatAdvanced
} from './intelligence/threatClassifier';

// Create and export a monitoring service object
export const monitoringService = {
  getMonitoringStatus,
  startMonitoring,
  stopMonitoring,
  runMonitoringScan: runScan,
  saveMention,
  getAllMentions,
  clearMentions,
  getMentionsByPlatform,
  getMentionsAsAlerts
};

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
  
  // Threat classifier services
  classifyThreat,
  classifyThreatAdvanced,
  
  // Entity recognition services
  extractEntitiesFromText,
  processEntities,
  batchProcessEntities,
  getAllEntities,
  getScanResultsByEntity,
  getEntityStatistics
};

// Export types
export type { ResponseGenerationProps, ThreatClassificationResult };

// Export default monitoring service
export default monitoringService;
