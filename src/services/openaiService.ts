
// This file is kept for backward compatibility
// All functionality has been moved to more specific modules
// Import and re-export from new modularized services

import { 
  generateAIResponse as generateResponse,
  ResponseGenerationProps,
  generateSeoContent as genSeoContent,
  classifyContentThreat as classifyThreat,
  ThreatClassificationResult
} from './index';

// Re-export for backward compatibility
export type { OpenAIMessage, OpenAIResponse } from './api/openaiClient';
export type { ResponseGenerationProps, ThreatClassificationResult };

export const generateAIResponse = generateResponse;
export const generateSeoContent = genSeoContent;
export const classifyContentThreat = classifyThreat;
