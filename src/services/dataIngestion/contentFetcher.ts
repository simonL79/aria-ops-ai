
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { IngestionOptions } from "./types";
import { availableSources } from "./sourceData";
import { generateSimulatedAlert } from "./alertGenerator";

const defaultOptions: IngestionOptions = {
  keywords: ['company name', 'brand name'],
  sources: ['twitter', 'reddit', 'google_news'],
  maxResults: 100
};

/**
 * Fetches content from configured sources based on keywords
 */
export const fetchContent = async (options: Partial<IngestionOptions> = {}): Promise<ContentAlert[]> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // This would be an actual API call in production
    // For MVP, we'll simulate the fetch with some latency
    
    const simulatedData: ContentAlert[] = [];
    
    // Simulate different content from each source
    for (const sourceId of mergedOptions.sources) {
      const source = availableSources.find(s => s.id === sourceId);
      if (!source || !source.active) continue;
      
      // Generate 1-3 simulated results per source
      const resultCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < resultCount; i++) {
        simulatedData.push(generateSimulatedAlert(source.platform));
      }
    }
    
    return simulatedData;
    
  } catch (error) {
    console.error("Error fetching content:", error);
    toast.error("Failed to collect intelligence data");
    return [];
  }
};
