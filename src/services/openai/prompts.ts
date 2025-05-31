
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
