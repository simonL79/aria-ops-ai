
import { ResponseToneStyle } from '@/types/dashboard';

export const TONE_PROMPTS: Record<ResponseToneStyle, string> = {
  professional: 'Respond in a professional, business-appropriate manner.',
  friendly: 'Respond in a warm, friendly, and approachable tone.',
  formal: 'Respond in a formal, structured manner with proper protocol.',
  casual: 'Respond in a relaxed, conversational tone.',
  humorous: 'Respond with appropriate humor while maintaining professionalism.',
  apologetic: 'Respond with empathy and acknowledgment of concerns.',
  technical: 'Respond with detailed, technical explanations and solutions.',
  empathetic: 'Respond with understanding and emotional support.'
};

export const getResponsePrompt = (tone: ResponseToneStyle, context: string): string => {
  const toneInstruction = TONE_PROMPTS[tone];
  return `${toneInstruction}\n\nContext: ${context}\n\nPlease provide an appropriate response.`;
};

export const getSystemPrompt = (
  responseType: string, 
  toneStyle: ResponseToneStyle, 
  language?: string
): string => {
  const toneInstruction = TONE_PROMPTS[toneStyle];
  const languageInstruction = language && language !== 'en' 
    ? `Please respond in ${language}.` 
    : '';
  
  return `You are a professional communication assistant specializing in ${responseType} responses. ${toneInstruction} ${languageInstruction}

Guidelines:
- Be authentic and genuine in your response
- Address the specific concerns mentioned
- Maintain a helpful and solution-oriented approach
- Keep responses concise but comprehensive
- Avoid corporate jargon or overly defensive language`;
};

export const getClassificationPrompt = (): string => {
  return `You are a content classification system. Analyze the provided content and classify it based on:

1. Threat Level: high, medium, low
2. Threat Type: reputation_risk, product_issue, service_complaint, legal_threat, misinformation
3. Sentiment: positive, negative, neutral
4. Platform Context: Consider the platform where this was posted
5. Urgency: immediate, standard, low

Provide a JSON response with these classifications and a brief explanation for each.`;
};
