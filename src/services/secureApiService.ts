
import { toast } from "sonner";

// Safety check for content to prevent misuse
export const contentSafetyCheck = (content: string): boolean => {
  if (!content || content.trim().length < 1) return false;
  
  // Basic checks to prevent misuse - can be expanded
  const hasPotentialSqlInjection = /(\b(select|insert|update|delete|from|drop|alter)\b.*\b(from|into|table|database)\b)/i.test(content);
  const hasPotentialXss = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i.test(content);
  
  if (hasPotentialSqlInjection || hasPotentialXss) {
    toast.error("Content contains potentially unsafe patterns");
    return false;
  }
  
  return true;
};

// Secure API request wrapper
export const makeSecuredApiRequest = async (
  endpoint: string, 
  messages: any[], 
  temperature: number = 0.7,
  model: string = "gpt-4o"
): Promise<any> => {
  try {
    // Define endpoint based on whether it's OpenAI or an internal endpoint
    const isOpenAiEndpoint = endpoint.includes('openai') || endpoint.includes('chat/completions');
    
    let url, headers, body;
    
    if (isOpenAiEndpoint) {
      // For OpenAI requests
      url = "https://api.openai.com/v1/" + endpoint;
      headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + import.meta.env.VITE_OPENAI_API_KEY
      };
      body = JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature
      });
    } else {
      // For internal APIs like ARIA-ingest
      url = endpoint.startsWith("http") ? endpoint : `https://ssvskbejfacmjemphmry.supabase.co/functions/v1/${endpoint}`;
      
      // IMPORTANT: Send the full auth key WITH "Bearer " prefix to match what's expected in the edge function
      headers = {
        "Content-Type": "application/json",
        "Authorization": "H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0="
      };
      
      body = JSON.stringify(messages);
    }
    
    console.log(`Making secure API request to ${url}`);
    console.log(`Using headers:`, headers);
    
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Secure API request failed:", error);
    toast.error("API request failed", { 
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};

// Helper to make an ARIA ingest request - useful for direct content insertion
export const makeAriaIngestRequest = async (content: any): Promise<any> => {
  try {
    // Send as raw content object
    return await makeSecuredApiRequest("aria-ingest", content);
  } catch (error) {
    console.error("ARIA ingest request failed:", error);
    toast.error("Content submission failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};
