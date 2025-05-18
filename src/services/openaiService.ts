
import { toast } from "sonner";

// Define the types for our OpenAI API responses
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
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

export interface ResponseGenerationProps {
  responseType: string;
  toneStyle: string;
  content: string;
  platform?: string; 
  severity?: string;
  threatType?: string;
}

// Define system prompts based on response type
const getSystemPrompt = (responseType: string, toneStyle: string): string => {
  const basePrompt = "You are a brand reputation agent trained to respond to criticism with professionalism and empathy.";
  
  const tonePrompts = {
    professional: "Maintain a professional and authoritative tone that builds trust.",
    friendly: "Use a warm and approachable tone that feels conversational and personable.",
    formal: "Employ a structured, respectful tone that emphasizes precision and clarity.",
    casual: "Be relaxed and informal while still maintaining brand integrity."
  };
  
  const responseTypePrompts = {
    empathetic: "Focus on acknowledging the customer's feelings and showing understanding before addressing the issue.",
    correction: "Politely correct any misinformation with verifiable facts and evidence. Avoid sounding defensive.",
    apology: "Take full responsibility where appropriate and offer a genuine apology that demonstrates accountability."
  };
  
  return `${basePrompt} ${responseTypePrompts[responseType as keyof typeof responseTypePrompts] || ""} ${tonePrompts[toneStyle as keyof typeof tonePrompts] || ""}`;
};

// Create context-aware messages for the API
const createContextMessages = (props: ResponseGenerationProps): OpenAIMessage[] => {
  const { responseType, toneStyle, content, platform, severity, threatType } = props;
  
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: getSystemPrompt(responseType, toneStyle)
    }
  ];
  
  // Add context if available
  let userMessageContent = content;
  if (platform || severity || threatType) {
    userMessageContent = `Context: This ${severity || ""} criticism was posted on ${platform || "social media"}${threatType ? `, and has been identified as potentially ${threatType.replace(/([A-Z])/g, ' $1').toLowerCase()}` : ""}.\n\nMessage: ${content}`;
  }
  
  messages.push({
    role: 'user',
    content: userMessageContent
  });
  
  return messages;
};

// Generate a response using the OpenAI API
export const generateAIResponse = async (props: ResponseGenerationProps): Promise<string> => {
  try {
    const messages = createContextMessages(props);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || localStorage.getItem("openai_api_key")}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling OpenAI API");
    }
    
    const data = await response.json() as OpenAIResponse;
    return data.choices[0]?.message?.content || "Unable to generate a response";
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    toast.error("Failed to generate AI response", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return "Error generating response. Please check your API key or try again later.";
  }
};
