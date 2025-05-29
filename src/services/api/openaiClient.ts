
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
    // First try to get the key from our secure storage, then fallback to environment
    const apiKey = getSecureKey('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;
    
    // If no API key is available, show error with guidance
    if (!apiKey) {
      toast.error("OpenAI API Key Required", {
        description: "Please set your OpenAI API key in the Settings > Security panel for AI capabilities to work",
        action: {
          label: "Go to Settings",
          onClick: () => window.location.href = "/settings"
        },
        duration: 10000
      });
      throw new Error("OpenAI API key not found. Please configure it in Settings > Security.");
    }
    
    // Validate API key format
    if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
      toast.warning("API Key Format Warning", {
        description: "Your OpenAI API key may not be in the correct format. Please verify it in Settings.",
        duration: 7000
      });
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
    
    // Update last request time
    sessionStorage.setItem("last_api_request_time", currentTime.toString());
    
    // Show processing notification
    const toastId = toast.loading("Processing with OpenAI...", {
      description: `Using model: ${options.model}`
    });
    
    console.log('[OpenAI Client] Making API request with model:', options.model);
    
    // Make the API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "User-Agent": "ARIA-Intelligence/1.0"
      },
      body: JSON.stringify({
        ...options,
        temperature: options.temperature || 0.7
      })
    });
    
    // Dismiss loading toast
    toast.dismiss(toastId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      
      console.error('[OpenAI Client] API Error:', response.status, errorMessage);
      
      // Handle specific error types
      if (response.status === 401) {
        toast.error("Invalid OpenAI API Key", {
          description: "Your API key is invalid or has expired. Please update it in Settings > Security.",
          action: {
            label: "Update Key",
            onClick: () => window.location.href = "/settings"
          },
          duration: 10000
        });
        throw new Error("Invalid API key");
      }
      
      if (response.status === 429) {
        toast.error("OpenAI Rate Limit Exceeded", {
          description: "Too many requests. Please wait a moment before trying again.",
          duration: 7000
        });
        throw new Error("Rate limit exceeded");
      }
      
      if (errorMessage.toLowerCase().includes("quota") || 
          errorMessage.toLowerCase().includes("insufficient_quota")) {
        toast.error("OpenAI Quota Exceeded", {
          description: "Your API usage quota has been exceeded. Please check your OpenAI account.",
          action: {
            label: "Check Usage",
            onClick: () => window.open("https://platform.openai.com/usage", "_blank")
          },
          duration: 10000
        });
        throw new Error("Quota exceeded");
      }
      
      toast.error("OpenAI API Error", {
        description: errorMessage,
        duration: 7000
      });
      throw new Error(errorMessage);
    }
    
    const data = await response.json() as OpenAIResponse;
    
    console.log('[OpenAI Client] API request successful, tokens used:', data.usage?.total_tokens || 'unknown');
    
    // Show success for completed analysis
    toast.success("AI Analysis Complete", { 
      description: `Processed successfully using ${options.model}`,
      duration: 3000
    });
    
    return data;
    
  } catch (error) {
    console.error("[OpenAI Client] Error:", error);
    
    // Don't show duplicate toasts if we already showed one above
    if (!error.message.includes("Rate limit") && 
        !error.message.includes("Invalid API key") && 
        !error.message.includes("Quota exceeded")) {
      toast.error("AI Processing Failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        duration: 7000
      });
    }
    
    throw error;
  }
};

// Helper function to check if we have a valid API key
export const hasOpenAIKey = (): boolean => {
  const hasStored = hasValidKey('openai_api_key');
  const hasEnv = !!import.meta.env.VITE_OPENAI_API_KEY;
  
  console.log('[OpenAI Client] Key status - Stored:', hasStored, 'Environment:', hasEnv);
  
  return hasStored || hasEnv;
};

// Test the OpenAI connection
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const response = await callOpenAI({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Test connection. Please respond with 'OK' if you can read this."
        }
      ],
      temperature: 0
    });
    
    const result = response.choices[0]?.message?.content?.toLowerCase();
    return result?.includes('ok') || false;
    
  } catch (error) {
    console.error('[OpenAI Client] Connection test failed:', error);
    return false;
  }
};
