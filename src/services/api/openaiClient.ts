
import { toast } from "sonner";
import { getSecureKey, hasValidKey } from "@/utils/secureKeyStorage";

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequestOptions {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
    index: number;
  }[];
  model: string;
  usage: {
    total_tokens: number;
  };
}

export const callOpenAI = async (options: OpenAIRequestOptions): Promise<OpenAIResponse> => {
  try {
    // First try to get the key from our secure storage
    const apiKey = getSecureKey('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;
    
    // If no API key is available, show error
    if (!apiKey) {
      toast.error("API Key Required", {
        description: "Please set your OpenAI API key in the settings panel",
        action: {
          label: "Settings",
          onClick: () => window.location.href = "/settings"
        }
      });
      throw new Error("OpenAI API key not found");
    }
    
    // Check for rate limiting
    const lastRequestTime = sessionStorage.getItem("last_api_request_time");
    const currentTime = Date.now();
    
    if (lastRequestTime && (currentTime - parseInt(lastRequestTime)) < 500) {
      toast.warning("API Rate Limit", {
        description: "Please wait before making another request"
      });
      throw new Error("Rate limit exceeded");
    }
    
    // Update last request time in sessionStorage
    sessionStorage.setItem("last_api_request_time", currentTime.toString());
    
    // Make the API call with appropriate headers
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || "Error calling OpenAI API";
      
      // Check specifically for quota errors
      if (errorMessage.toLowerCase().includes("quota") ||
          errorMessage.toLowerCase().includes("rate limit") ||
          errorMessage.toLowerCase().includes("capacity")) {
        toast.error("OpenAI API Quota Exceeded", {
          description: "Your API key's usage quota has been exceeded. Please check your OpenAI account.",
          action: {
            label: "Manage API Key",
            onClick: () => window.location.href = "/settings"
          },
          duration: 10000
        });
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json() as OpenAIResponse;
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Note: We're not showing a toast here as the calling functions will handle specific errors
    throw error;
  }
};

// Helper function that checks if we have a valid API key or environment variable
export const hasOpenAIKey = (): boolean => {
  return hasValidKey('openai_api_key') || !!import.meta.env.VITE_OPENAI_API_KEY;
};
