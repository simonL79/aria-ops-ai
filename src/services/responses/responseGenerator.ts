
import { toast } from "sonner";
import { ResponseToneStyle } from "@/types/dashboard";
import { ContentThreatType } from "@/types/intelligence";
import { callOpenAI } from "../api/openaiClient";

export interface ResponseGenerationProps {
  responseType: string;
  toneStyle: ResponseToneStyle;
  content: string;
  platform?: string; 
  severity?: string;
  threatType?: ContentThreatType | string;
  language?: string;
  autoRespond?: boolean;
}

// Define system prompts based on response type
const getSystemPrompt = (responseType: string, toneStyle: ResponseToneStyle, language?: string): string => {
  const basePrompt = "You are a brand reputation agent trained to respond to criticism with professionalism and empathy.";
  
  const tonePrompts: Record<ResponseToneStyle, string> = {
    professional: "Maintain a professional and authoritative tone that builds trust.",
    friendly: "Use a warm and approachable tone that feels conversational and personable.",
    formal: "Employ a structured, respectful tone that emphasizes precision and clarity.",
    casual: "Be relaxed and informal while still maintaining brand integrity.",
    humorous: "Incorporate appropriate humor to lighten the tone while still addressing the issue seriously.",
    apologetic: "Express genuine remorse and take ownership of the mistake without making excuses.",
    technical: "Provide detailed, fact-based information with appropriate technical terminology.",
    empathetic: "Show deep understanding of the customer's feelings and validate their experience."
  };
  
  const responseTypePrompts = {
    empathetic: "Focus on acknowledging the customer's feelings and showing understanding before addressing the issue.",
    correction: "Politely correct any misinformation with verifiable facts and evidence. Avoid sounding defensive.",
    apology: "Take full responsibility where appropriate and offer a genuine apology that demonstrates accountability.",
    gratitude: "Express sincere appreciation for positive feedback or customer loyalty.",
    clarification: "Provide clear and concise information to address confusion or misconceptions."
  };

  let prompt = `${basePrompt} ${responseTypePrompts[responseType as keyof typeof responseTypePrompts] || ""} ${tonePrompts[toneStyle] || ""}`;
  
  if (language && language !== 'en') {
    prompt += ` Respond in ${language}.`;
  }
  
  return prompt;
};

// Create context-aware messages for the API
const createContextMessages = (props: ResponseGenerationProps): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> => {
  const { responseType, toneStyle, content, platform, severity, threatType, language } = props;
  
  const messages = [
    {
      role: 'system' as const,
      content: getSystemPrompt(responseType, toneStyle, language)
    }
  ];
  
  // Add context if available
  let userMessageContent = content;
  if (platform || severity || threatType) {
    userMessageContent = `Context: This ${severity || ""} criticism was posted on ${platform || "social media"}${threatType ? `, and has been identified as potentially ${threatType.toString().replace(/([A-Z])/g, ' $1').toLowerCase()}` : ""}.\n\nMessage: ${content}`;
  }
  
  messages.push({
    role: 'user' as const,
    content: userMessageContent
  });
  
  return messages;
};

// Generate a response using the OpenAI API
export const generateAIResponse = async (props: ResponseGenerationProps): Promise<string> => {
  try {
    const messages = createContextMessages(props);
    
    const data = await callOpenAI({
      model: "gpt-4o",
      messages,
      temperature: 0.7
    });
    
    return data.choices[0]?.message?.content || "Unable to generate a response";
    
  } catch (error) {
    console.error("Response Generation Error:", error);
    toast.error("Failed to generate AI response", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return "Error generating response. Please check your API key or try again later.";
  }
};
