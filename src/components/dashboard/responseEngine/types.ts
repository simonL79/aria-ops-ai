
import { ContentThreatType } from "@/types/intelligence";
import { ResponseToneStyle } from "@/types/dashboard";

// Response template definition
export interface ResponseTemplateProps {
  type: string;
  description: string;
  icon: React.ReactNode;
  template: string;
}

// Language option definition
export interface LanguageOption {
  code: string;
  name: string;
}

// Props for the response generator tab
export interface ResponseGeneratorTabProps {
  initialContent?: string;
  threatType?: ContentThreatType | string;
  severity?: string;
  platform?: string;
}

// Auto-response settings
export interface AutoResponseSettings {
  enabled: boolean;
  threshold: 'high' | 'medium' | 'all' | 'none';
  reviewRequired: boolean;
  defaultTone: ResponseToneStyle;
}
