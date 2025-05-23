
// Backward compatibility file - re-exports from the new modular structure
import { 
  generateAIResponse,
  classifyContentThreat,
  generateSeoContent
} from './openai';

import type { 
  OpenAIMessage,
  OpenAIResponse,
  ResponseGenerationProps, 
  ThreatClassificationResult 
} from './openai';

// Re-export all functionality for backward compatibility
export { generateAIResponse, classifyContentThreat, generateSeoContent };
export type { OpenAIMessage, OpenAIResponse, ResponseGenerationProps, ThreatClassificationResult };
