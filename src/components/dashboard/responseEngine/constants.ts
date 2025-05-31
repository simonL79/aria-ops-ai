
import { ResponseToneStyle } from '@/types/dashboard';
import { AutoResponseSettings } from './types';

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

export const toneOptions: ResponseToneStyle[] = [
  'professional',
  'friendly', 
  'formal',
  'casual',
  'humorous',
  'apologetic',
  'technical',
  'empathetic'
];

export const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' }
];

export const responseTemplates = [
  {
    id: '1',
    type: 'empathetic',
    description: 'Understanding and supportive response',
    icon: 'UserRound',
    template: 'Thank you for sharing your experience. We understand your concerns and take all feedback seriously.'
  },
  {
    id: '2', 
    type: 'correction',
    description: 'Factual correction with evidence',
    icon: 'FileCheck',
    template: 'We appreciate you bringing this to our attention. Here are the facts regarding this matter...'
  },
  {
    id: '3',
    type: 'apology',
    description: 'Sincere apology and commitment to improvement',
    icon: 'ThumbsUp',
    template: 'We sincerely apologize for this experience. This does not reflect our standards and we are taking immediate action.'
  },
  {
    id: '4',
    type: 'gratitude',
    description: 'Thankful response for positive feedback',
    icon: 'MessageSquareText',
    template: 'Thank you so much for taking the time to share your positive experience with us.'
  }
];

export const defaultAutoResponseSettings: AutoResponseSettings = {
  enabled: false,
  threshold: 'high',
  reviewRequired: true,
  defaultTone: 'professional'
};
