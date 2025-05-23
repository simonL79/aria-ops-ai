
import { ResponseToneStyle } from "@/types/dashboard";

export const TONE_STYLES: Record<ResponseToneStyle, string> = {
  professional: 'Professional and formal communication style',
  casual: 'Casual and conversational tone',
  empathetic: 'Understanding and compassionate approach',
  assertive: 'Direct and confident messaging'
};

export const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'assertive', label: 'Assertive' }
];

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' }
];

export const responseTemplates = [
  {
    id: '1',
    name: 'Standard Response',
    content: 'Thank you for your feedback. We take all concerns seriously and will investigate this matter promptly.',
    tone: 'professional' as ResponseToneStyle
  },
  {
    id: '2',
    name: 'Empathetic Response',
    content: 'We understand your frustration and sincerely apologize for any inconvenience caused. Please allow us to make this right.',
    tone: 'empathetic' as ResponseToneStyle
  },
  {
    id: '3',
    name: 'Clarification Request',
    content: 'We appreciate you bringing this to our attention. Could you please provide more details so we can better assist you?',
    tone: 'professional' as ResponseToneStyle
  }
];

export const defaultAutoResponseSettings = {
  enabled: false,
  tone: 'professional' as ResponseToneStyle,
  language: 'en',
  responseDelay: 15,
  keywords: ['complaint', 'issue', 'problem', 'dissatisfied'],
  platforms: ['twitter', 'facebook', 'reddit']
};

export const DEFAULT_RESPONSE = `Thank you for raising your concern. We are committed to addressing this issue and ensuring your satisfaction.`;

export const DEFAULT_SEO_CONTENT = `This is a sample SEO content. Please replace with actual content.`;
