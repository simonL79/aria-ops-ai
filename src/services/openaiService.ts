
import { toast } from "sonner";
import { ContentThreatType } from "@/types/intelligence";
import { AlertSeverity } from "@/types/dashboard";

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
  severity?: AlertSeverity;
  threatType?: ContentThreatType;
}

export interface ThreatClassificationResult {
  category: 'Neutral' | 'Positive' | 'Complaint' | 'Reputation Threat' | 'Misinformation' | 'Legal Risk';
  severity: number; // 1-10
  action: string;
  explanation?: string;
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

const getClassificationPrompt = (): string => {
  return `You are a reputation intelligence analyst. Your task is to classify online content by risk level.
  
  Analyze the provided content and return a JSON object with the following properties:
  - category: One of ["Neutral", "Positive", "Complaint", "Reputation Threat", "Misinformation", "Legal Risk"]
  - severity: A number from 1 (minimal risk) to 10 (severe risk)
  - action: A brief recommendation like "Monitor", "Human Review", "Escalation", or "Legal Team"
  - explanation: A brief explanation of your classification

  Only respond with the JSON object, nothing else.`;
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

// Create classification messages for the API
const createClassificationMessages = (content: string): OpenAIMessage[] => {
  return [
    {
      role: 'system',
      content: getClassificationPrompt()
    },
    {
      role: 'user',
      content: content
    }
  ];
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

// Classify content threat using the OpenAI API
export const classifyContentThreat = async (content: string): Promise<ThreatClassificationResult | null> => {
  try {
    const messages = createClassificationMessages(content);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || localStorage.getItem("openai_api_key")}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling OpenAI API");
    }
    
    const data = await response.json() as OpenAIResponse;
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
