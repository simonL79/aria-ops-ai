
import { ResponseToneStyle } from "@/types/dashboard";

export const TONE_STYLES: Record<ResponseToneStyle, string> = {
  professional: 'Professional and formal communication style',
  casual: 'Casual and conversational tone',
  empathetic: 'Understanding and compassionate approach',
  assertive: 'Direct and confident messaging'
};

export const toneOptions = [
  'professional',
  'casual', 
  'empathetic',
  'assertive'
];

export const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' }
];

export const responseTemplates = [
  {
    id: '1',
    name: 'Standard Response',
    content: 'Thank you for your feedback. We take all concerns seriously and will investigate this matter promptly.',
    tone: 'professional' as ResponseToneStyle,
    type: 'empathetic',
    description: 'A professional response that acknowledges the feedback',
    icon: 'MessageSquareText',
    template: 'Thank you for your feedback. We take all concerns seriously and will investigate this matter promptly.'
  },
  {
    id: '2', 
    name: 'Empathetic Response',
    content: 'We understand your frustration and sincerely apologize for any inconvenience caused. Please allow us to make this right.',
    tone: 'empathetic' as ResponseToneStyle,
    type: 'apology',
    description: 'An empathetic response that shows understanding',
    icon: 'UserRound',
    template: 'We understand your frustration and sincerely apologize for any inconvenience caused. Please allow us to make this right.'
  },
  {
    id: '3',
    name: 'Clarification Request', 
    content: 'We appreciate you bringing this to our attention. Could you please provide more details so we can better assist you?',
    tone: 'professional' as ResponseToneStyle,
    type: 'clarification',
    description: 'A request for more information',
    icon: 'FileCheck',
    template: 'We appreciate you bringing this to our attention. Could you please provide more details so we can better assist you?'
  }
];

export const defaultAutoResponseSettings = {
  enabled: false,
  threshold: 'high' as 'high' | 'medium' | 'all' | 'none',
  reviewRequired: false,
  defaultTone: 'professional' as ResponseToneStyle
};

export const DEFAULT_RESPONSE = `Thank you for raising your concern. We are committed to addressing this issue and ensuring your satisfaction.`;

export const DEFAULT_SEO_CONTENT = `This is a sample SEO content. Please replace with actual content.`;
