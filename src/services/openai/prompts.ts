
import { ResponseToneStyle } from '@/types/dashboard';

// System prompts for different response types
export const RESPONSE_TYPE_PROMPTS = {
  'empathetic': 'You are crafting an empathetic response that acknowledges the person\'s feelings and concerns.',
  'apology': 'You are drafting a sincere apology that takes responsibility without making excuses.',
  'clarification': 'You are asking for more information in a professional and respectful manner.',
  'gratitude': 'You are expressing genuine appreciation for feedback or comments.'
};

// Tone style descriptions
export const TONE_STYLE_PROMPTS: Record<ResponseToneStyle, string> = {
  'professional': 'Use formal language and maintain a business-appropriate tone.',
  'casual': 'Use conversational language without being too formal.',
  'empathetic': 'Focus on understanding and compassion in your language.',
  'assertive': 'Be direct and confident while remaining respectful.'
};

// Base prompt for response generation
export const BASE_RESPONSE_PROMPT = `
You are an AI assistant trained to generate appropriate responses to social media comments, reviews, and messages.
Given the content below, craft a response that follows these guidelines:

1. Match the specified tone style.
2. Address the specific concerns or points raised.
3. Keep responses concise and natural-sounding.
4. Avoid generic platitudes.

Content to respond to:
`;

// Export functions needed by messageBuilder
export const getSystemPrompt = (responseType: string, toneStyle: ResponseToneStyle, language?: string) => {
  const basePrompt = RESPONSE_TYPE_PROMPTS[responseType as keyof typeof RESPONSE_TYPE_PROMPTS] || 'You are generating a professional response.';
  const tonePrompt = TONE_STYLE_PROMPTS[toneStyle];
  const languagePrompt = language ? `Respond in ${language}.` : '';
  
  return `${basePrompt} ${tonePrompt} ${languagePrompt}`;
};

export const getClassificationPrompt = () => {
  return `You are an AI trained to classify content for threat analysis. Analyze the given content and provide a classification with severity, category, and explanation.`;
};
