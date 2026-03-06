
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Safety check for content to prevent misuse
export const contentSafetyCheck = (content: string): boolean => {
  if (!content || content.trim().length < 1) return false;
  
  const hasPotentialSqlInjection = /(\b(select|insert|update|delete|from|drop|alter)\b.*\b(from|into|table|database)\b)/i.test(content);
  const hasPotentialXss = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i.test(content);
  
  if (hasPotentialSqlInjection || hasPotentialXss) {
    toast.error("Content contains potentially unsafe patterns");
    return false;
  }
  
  return true;
};

// Secure API request wrapper — routes OpenAI calls through server-side proxy
export const makeSecuredApiRequest = async (
  endpoint: string, 
  messages: any[], 
  temperature: number = 0.7,
  model: string = "gpt-4o"
): Promise<any> => {
  try {
    const isOpenAiEndpoint = endpoint.includes('openai') || endpoint.includes('chat/completions');
    
    if (isOpenAiEndpoint) {
      // Route through server-side proxy — never call OpenAI directly from browser
      const { data, error } = await supabase.functions.invoke('openai-proxy', {
        body: { messages, temperature, model }
      });
      
      if (error) {
        throw new Error(error.message || "OpenAI proxy request failed");
      }
      
      return data;
    } else {
      // For internal APIs — use Supabase functions.invoke
      const functionName = endpoint.startsWith("http") 
        ? endpoint 
        : endpoint;
      
      if (endpoint.startsWith("http")) {
        // Direct URL call for non-Supabase endpoints
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messages)
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
      } else {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: messages
        });
        
        if (error) {
          throw new Error(error.message || "API request failed");
        }
        
        return data;
      }
    }
    
  } catch (error) {
    console.error("Secure API request failed:", error);
    toast.error("API request failed", { 
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};

// Helper to make an ARIA ingest request
export const makeAriaIngestRequest = async (content: any): Promise<any> => {
  try {
    return await makeSecuredApiRequest("aria-ingest", content);
  } catch (error) {
    console.error("ARIA ingest request failed:", error);
    toast.error("Content submission failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};
