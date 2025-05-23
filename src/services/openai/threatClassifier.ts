
import { toast } from "sonner";
import { contentSafetyCheck } from "../secureApiService";
import { callSecureOpenAI, validateMessages } from "./client";
import { createClassificationMessages } from "./messageBuilder";
import { ThreatClassificationResult } from "./types";

// Classify content threat using the OpenAI API
export const classifyContentThreat = async (content: string): Promise<ThreatClassificationResult | null> => {
  try {
    // Security check on input
    if (!contentSafetyCheck(content)) {
      throw new Error("Content failed safety checks. Please review and try again.");
    }
    
    const messages = createClassificationMessages(content);
    
    // Validate messages before sending
    if (!validateMessages(messages)) {
      throw new Error("Message validation failed");
    }
    
    const data = await callSecureOpenAI("chat/completions", messages, 0.3, "gpt-4o");
    
    if (!data) {
      throw new Error("Failed to classify content. Please check your API key.");
    }
    
    const resultText = data.choices[0]?.message?.content;
    
    if (!resultText) {
      throw new Error("Empty response from API");
    }
    
    try {
      return JSON.parse(resultText) as ThreatClassificationResult;
    } catch (parseError) {
      console.error("Failed to parse classification result:", parseError);
      throw new Error("Invalid classification response format");
    }
    
  } catch (error) {
    console.error("Classification API Error:", error);
    toast.error("Failed to classify content", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
