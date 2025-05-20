
import { toast } from "sonner";
import { ThreatClassifierRequest, ThreatClassificationResult } from "@/types/intelligence";
import { supabase } from "@/integrations/supabase/client";

// Simplified version of the threat classifier that now uses a Supabase Edge Function
export const classifyThreat = async (data: ThreatClassifierRequest): Promise<ThreatClassificationResult | null> => {
  try {
    const { data: responseData, error } = await supabase.functions.invoke('threat-classification', {
      body: data
    });

    if (error) {
      console.error("Edge function error:", error);
      toast.error("Failed to classify threat", {
        description: "There was an error communicating with the classification service.",
        duration: 5000
      });
      return null;
    }
    
    if (!responseData) {
      throw new Error("Empty response from classification service");
    }
    
    // The edge function returns a properly formatted result
    return responseData as ThreatClassificationResult;
    
  } catch (error) {
    console.error("Classification API Error:", error);
    toast.error("Failed to classify threat", {
      description: error instanceof Error 
        ? error.message 
        : "Unknown error occurred. Please try again later.",
      duration: 5000
    });
    return null;
  }
};

// Advanced threat classifier that takes additional context into account
export const classifyThreatAdvanced = async (
  data: ThreatClassifierRequest & {
    previousInteractions?: string[];
    reputationScore?: number;
    historicalContext?: string;
  }
): Promise<ThreatClassificationResult | null> => {
  try {
    // Use the same edge function for advanced classification
    const { data: responseData, error } = await supabase.functions.invoke('threat-classification', {
      body: data
    });

    if (error) {
      console.error("Edge function error:", error);
      toast.error("Failed to classify threat", {
        description: "There was an error communicating with the classification service.",
        duration: 5000
      });
      return null;
    }
    
    if (!responseData) {
      throw new Error("Empty response from classification service");
    }
    
    return responseData as ThreatClassificationResult;
    
  } catch (error) {
    console.error("Advanced Classification API Error:", error);
    toast.error("Failed to classify threat", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
