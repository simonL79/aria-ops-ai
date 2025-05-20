
import { Mention } from "./types";
import { classifyThreat } from "@/services/intelligence/threatClassifier";
import { ThreatClassifierRequest } from "@/types/intelligence";

// Mock database for storing mentions (simulating the SQLite DB from Python)
let mentionsDatabase: Mention[] = [];

/**
 * Save a new mention to our in-memory database with AI-based threat classification
 */
export const saveMention = async (source: string, content: string, url: string) => {
  try {
    // Classify the content threat level using our AI service
    const request: ThreatClassifierRequest = {
      content,
      platform: source,
      brand: "ARIA" // Default brand name
    };
    
    const classification = await classifyThreat(request);
    
    mentionsDatabase.push({
      source,
      content,
      url,
      timestamp: new Date(),
      category: classification?.category,
      severity: classification?.severity,
      recommendation: classification?.recommendation,
      ai_reasoning: classification?.ai_reasoning
    });
    
    console.log(`New mention saved from ${source} with classification: ${classification?.category}`);
    return true;
  } catch (error) {
    console.error(`Error saving and classifying mention: ${error}`);
    // Still save the mention without classification
    mentionsDatabase.push({
      source,
      content,
      url,
      timestamp: new Date()
    });
    return false;
  }
};

/**
 * Get all stored mentions
 */
export const getAllMentions = () => {
  return mentionsDatabase;
};

/**
 * Clear mentions database (for testing)
 */
export const clearMentions = () => {
  mentionsDatabase = [];
  return true;
};
