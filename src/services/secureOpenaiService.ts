import { toast } from "sonner";
import { ContentThreatType } from "@/types/intelligence";
import { ResponseToneStyle } from "@/types/dashboard";
import { makeSecuredApiRequest, contentSafetyCheck } from "./secureApiService";

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
  toneStyle: ResponseToneStyle;
  content: string;
  platform?: string; 
  severity?: string;
  threatType?: ContentThreatType | string;
  language?: string;
  autoRespond?: boolean;
}

export interface ThreatClassificationResult {
  category: 'Neutral' | 'Positive' | 'Complaint' | 'Reputation Threat' | 'Misinformation' | 'Legal Risk';
  severity: number; // 1-10
  action: string;
  explanation?: string;
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
    empathetic: "Show deep understanding of the customer's feelings and validate their experience.",
    educational: "Explain concepts clearly with helpful information to increase customer understanding."
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
  const { responseType, toneStyle, content, platform, severity, threatType, language } = props;
  
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: getSystemPrompt(responseType, toneStyle, language)
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
    // Security check on input content
    if (!contentSafetyCheck(props.content)) {
      throw new Error("Content failed safety checks. Please review and try again.");
    }
    
    const messages = createContextMessages(props);
    
    // Use our secure API service instead of direct fetch
    const data = await makeSecuredApiRequest("chat/completions", messages, 0.7, "gpt-4o");
    
    if (!data) {
      return "Unable to generate a response. Please check your API key or try again later.";
    }
    
    return data.choices[0]?.message?.content || "Unable to generate a response";
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    toast.error("Failed to generate AI response", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return "Error generating response. Please check your API key or try again later.";
  }
};

// Create SEO-optimized content
export const generateSeoContent = async (
  keyword: string,
  title?: string,
  wordCount: number = 1000
): Promise<{ title: string, content: string }> => {
  try {
    // Security check on input
    if (!contentSafetyCheck(keyword) || (title && !contentSafetyCheck(title))) {
      throw new Error("Content failed safety checks. Please review and try again.");
    }
    
    const prompt = `Generate SEO-optimized content about "${keyword}" ${title ? `with the title "${title}"` : ''}.
    The content should be ${wordCount} words long and include:
    1. An engaging headline if not provided
    2. Strategic use of primary and LSI keywords
    3. Headings and subheadings in a logical structure
    4. Meta description for the content
    
    Format the response as properly formatted markdown with # for main heading, ## for subheadings, etc.`;
    
    const messages = [
      {
        role: 'system' as const,
        content: 'You are an expert SEO content creator that specializes in creating content that ranks highly in search engines.'
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];
    
    // Use our secure API service
    const data = await makeSecuredApiRequest("chat/completions", messages, 0.7, "gpt-4o");
    
    if (!data) {
      throw new Error("Failed to generate content. Please check your API key.");
    }
    
    const content = data.choices[0]?.message?.content || "";
    
    // Extract title from the content if it was generated
    const titleMatch = content.match(/^#\s(.+)$/m);
    const extractedTitle = titleMatch ? titleMatch[1] : title || keyword;
    
    return {
      title: extractedTitle,
      content: content
    };
    
  } catch (error) {
    console.error("SEO Content Generation Error:", error);
    toast.error("Failed to generate SEO content", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return {
      title: title || keyword,
      content: "Error generating SEO content. Please check your API key or try again later."
    };
  }
};

// Classify content threat using the OpenAI API
export const classifyContentThreat = async (content: string): Promise<ThreatClassificationResult | null> => {
  try {
    // Security check on input
    if (!contentSafetyCheck(content)) {
      throw new Error("Content failed safety checks. Please review and try again.");
    }
    
    const messages = createClassificationMessages(content);
    
    // Use our secure API service
    const data = await makeSecuredApiRequest("chat/completions", messages, 0.3, "gpt-4o");
    
    if (!data) {
      throw new Error("Failed to classify content. Please check your API key.");
    }
    
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
