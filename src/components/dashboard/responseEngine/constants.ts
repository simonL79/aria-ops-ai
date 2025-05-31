
import { ResponseToneStyle } from '@/types/dashboard';

export const TONE_STYLES: Record<ResponseToneStyle, string> = {
  professional: 'Professional and business-focused',
  friendly: 'Warm and approachable',
  formal: 'Structured and official',
  casual: 'Relaxed and conversational',
  humorous: 'Light-hearted with appropriate humor',
  apologetic: 'Acknowledging concerns with empathy',
  technical: 'Detailed and solution-oriented',
  empathetic: 'Understanding and supportive'
};

export const DEFAULT_TONE: ResponseToneStyle = 'professional';
