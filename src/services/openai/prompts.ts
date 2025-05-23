
import { ResponseToneStyle } from "@/types/dashboard";

// System prompts for different response types
export const getSystemPrompt = (responseType: string, toneStyle: ResponseToneStyle, language?: string): string => {
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

export const getClassificationPrompt = (): string => {
  return `You are a reputation intelligence analyst. Your task is to classify online content by risk level.
  
  Analyze the provided content and return a JSON object with the following properties:
  - category: One of ["Neutral", "Positive", "Complaint", "Reputation Threat", "Misinformation", "Legal Risk"]
  - severity: A number from 1 (minimal risk) to 10 (severe risk)
  - action: A brief recommendation like "Monitor", "Human Review", "Escalation", or "Legal Team"
  - explanation: A brief explanation of your classification

  Only respond with the JSON object, nothing else.`;
};
