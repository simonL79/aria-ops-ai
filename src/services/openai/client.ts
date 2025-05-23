
import { toast } from "sonner";
import { makeSecuredApiRequest, contentSafetyCheck } from "../secureApiService";
import { OpenAIMessage, OpenAIResponse } from "./types";

// Secure OpenAI API client
export const callSecureOpenAI = async (
  endpoint: string, 
  messages: OpenAIMessage[], 
  temperature: number = 0.7,
  model: string = "gpt-4o"
): Promise<any> => {
  try {
    // Use our secure API service instead of direct fetch
    const data = await makeSecuredApiRequest(endpoint, messages, temperature, model);
    
    if (!data) {
      throw new Error("Failed to get response from OpenAI API");
    }
    
    return data;
    
  } catch (error) {
    console.error("Secure OpenAI Client Error:", error);
    toast.error("Failed to communicate with AI service", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};

// Helper function to validate and sanitize messages
export const validateMessages = (messages: OpenAIMessage[]): boolean => {
  return messages.every(msg => {
    if (!msg.role || !msg.content) return false;
    if (!['system', 'user', 'assistant'].includes(msg.role)) return false;
    return contentSafetyCheck(msg.content);
  });
};
