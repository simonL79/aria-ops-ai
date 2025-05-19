
import { toast } from "sonner";
import { callOpenAI } from "../api/openaiClient";

export interface ThreatClassificationResult {
  category: 'Neutral' | 'Positive' | 'Complaint' | 'Reputation Threat' | 'Misinformation' | 'Legal Risk';
  severity: number; // 1-10
  action: string;
  explanation?: string;
}

const getClassificationPrompt = (): string => {
  return `You are a reputation intelligence analyst. Your task is to classify online content by risk level.
  
  Analyze the provided content and return a JSON object with the following properties:
  - category: One of ["Neutral", "Positive", "Complaint", "Reputation Threat", "Misinformation", "Legal Risk"]
  - severity: A number from 1 (minimal risk) to 10 (severe risk)
  - action: A brief recommendation like "Monitor", "Human Review", "Escalation", or "Legal Team"
  - explanation: A brief explanation of your classification

  Only respond with the JSON object, nothing else.`;
};

// Create classification messages for the API
const createClassificationMessages = (content: string): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> => {
  return [
    {
      role: 'system' as const,
      content: getClassificationPrompt()
    },
    {
      role: 'user' as const,
      content: content
    }
  ];
};

// Classify content threat using the OpenAI API
export const classifyContentThreat = async (content: string): Promise<ThreatClassificationResult | null> => {
  try {
    const messages = createClassificationMessages(content);
    
    const data = await callOpenAI({
      model: "gpt-4o",
      messages,
      temperature: 0.3
    });
    
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
