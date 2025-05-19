
import { toast } from "sonner";
import { OpenAIMessage, OpenAIResponse } from "@/services/openaiService";

// Secure wrapper for OpenAI API calls
export const makeSecuredApiRequest = async (
  endpoint: string, 
  messages: OpenAIMessage[], 
  temperature: number = 0.7,
  model: string = "gpt-4o"
): Promise<any> => {
  try {
    // Check if we have an API key in localStorage (development mode only)
    const apiKey = localStorage.getItem("openai_api_key");
    
    // Try to get API key from environment (production mode)
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // If no API key is available, show error
    if (!apiKey && !envApiKey) {
      toast.error("API Key Required", {
        description: "Please set your OpenAI API key in the settings panel"
      });
      return null;
    }

    // Check for rate limiting or implement your own rate limits
    const lastRequestTime = localStorage.getItem("last_api_request_time");
    const currentTime = Date.now();
    
    if (lastRequestTime && (currentTime - parseInt(lastRequestTime)) < 500) {
      toast.warning("API Rate Limit", {
        description: "Please wait before making another request"
      });
      return null;
    }
    
    // Update last request time
    localStorage.setItem("last_api_request_time", currentTime.toString());
    
    // Log the API call attempt (but not the content for security)
    console.log(`Secure API request to: ${endpoint}`);
    
    // Make the API call with appropriate headers and sanitized inputs
    const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Use secure API key handling
        "Authorization": `Bearer ${envApiKey || apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: sanitizeInputMessages(messages),
        temperature
      })
    });
    
    // Check for successful response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error calling API: ${response.status}`);
    }
    
    // Return the data
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Secure API Error:", error);
    toast.error("API Request Failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};

// Sanitize input to prevent prompt injection and other attacks
const sanitizeInputMessages = (messages: OpenAIMessage[]): OpenAIMessage[] => {
  return messages.map(message => {
    // Deep copy to avoid modifying the original
    const sanitizedMessage = { ...message };
    
    if (typeof sanitizedMessage.content === 'string') {
      // Basic input sanitization
      sanitizedMessage.content = sanitizedMessage.content
        // Remove any attempts to override system instructions
        .replace(/\[system\]|\[\/system\]/gi, '')
        // Remove any special tokens that could be used for prompt injection
        .replace(/<\|endoftext\|>|<\|im_start\|>|<\|im_end\|>/g, '')
        // Replace multiple newlines (could be used to visually hide instructions)
        .replace(/(\n{3,})/g, '\n\n');
    }
    
    return sanitizedMessage;
  });
};

// Role-based access check
export const checkPermission = (
  requiredRole: string,
  userRoles?: string[]
): boolean => {
  // If no user roles, default to no access
  if (!userRoles || userRoles.length === 0) return false;
  
  // Define role hierarchy
  const roleHierarchy: Record<string, number> = {
    'user': 1,
    'analyst': 2,
    'manager': 3,
    'admin': 4
  };
  
  // Get the required role level
  const requiredLevel = roleHierarchy[requiredRole.toLowerCase()] || 0;
  
  // Check if user has any role that meets or exceeds the required level
  return userRoles.some(role => {
    const userRoleLevel = roleHierarchy[role.toLowerCase()] || 0;
    return userRoleLevel >= requiredLevel;
  });
};

// LLM Content Safety Checks
export const contentSafetyCheck = (content: string): boolean => {
  // List of patterns that indicate potential misuse or unwanted behaviors
  const dangerPatterns = [
    /how to hack/i,
    /create malware/i,
    /password cracking/i,
    /credit card generator/i,
    /bypass security/i,
    // Add more patterns as needed
  ];
  
  // Check for any dangerous patterns
  return !dangerPatterns.some(pattern => pattern.test(content));
};

// Encrypt sensitive data before storing
export const encryptData = (data: string, key?: string): string => {
  // In a real implementation, use a proper encryption library
  // This is a very basic obfuscation, not real encryption
  if (!key) {
    // Use a consistent key if none provided
    key = "A.R.I.A.SecretKey123";
  }
  
  // Simple XOR operation for demonstration (NOT SECURE)
  return Array.from(data)
    .map((char, i) => {
      const keyChar = key![i % key!.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    })
    .join('');
};

// Decrypt the data
export const decryptData = (encryptedData: string, key?: string): string => {
  // Decryption is the same operation for XOR
  return encryptData(encryptedData, key);
};
