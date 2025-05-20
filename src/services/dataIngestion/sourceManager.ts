
import { availableSources } from "./sourceData";
import { ThreatSource } from "./types";

/**
 * Connects to a new data source
 */
export const connectDataSource = async (sourceId: string, credentials: any): Promise<boolean> => {
  try {
    // Simulate API call to connect to the source
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update the source in our list
    const sourceIndex = availableSources.findIndex(s => s.id === sourceId);
    if (sourceIndex >= 0) {
      availableSources[sourceIndex].active = true;
      availableSources[sourceIndex].credentials = {
        type: credentials.type,
        status: 'valid'
      };
    }
    
    return true;
  } catch (error) {
    console.error("Failed to connect data source:", error);
    return false;
  }
};

/**
 * Returns all available data sources
 */
export const getAvailableSources = (): ThreatSource[] => {
  return availableSources;
};
