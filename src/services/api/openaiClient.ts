
import { toast } from "sonner";

interface OpenAIRequestOptions {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || localStorage.getItem("openai_api_key")}`
      },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling OpenAI API");
    }
    
    return await response.json() as OpenAIResponse;
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    toast.error("OpenAI API Error", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};
