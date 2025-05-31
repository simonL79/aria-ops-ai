
import { MetricValue, ContentAlert, ContentSource, ContentAction, ResponseToneStyle, SeoContent } from '@/types/dashboard';

export const fetchDashboardMetrics = async (): Promise<MetricValue[]> => {
  // Mock data for now - replace with actual API calls
  return [
    { id: "1", title: "Total Mentions", value: 156, change: 12, icon: "trending-up", color: "blue", delta: 12, deltaType: "increase" },
    { id: "2", title: "Negative Sentiment", value: 23, change: -5, icon: "trending-down", color: "red", delta: -5, deltaType: "decrease" },
    { id: "3", title: "Active Sources", value: 8, change: 2, icon: "trending-up", color: "green", delta: 2, deltaType: "increase" },
    { id: "4", title: "Response Rate", value: 87, change: 8, icon: "trending-up", color: "yellow", delta: 8, deltaType: "increase" }
  ];
};

export const fetchContentAlerts = async (): Promise<ContentAlert[]> => {
  // Mock data - replace with actual API calls
  return [];
};

export const fetchContentSources = async (): Promise<ContentSource[]> => {
  // Mock data - replace with actual API calls
  return [];
};

export const fetchContentActions = async (): Promise<ContentAction[]> => {
  // Mock data - replace with actual API calls
  return [];
};

export const generateResponse = async (
  content: string,
  tone: ResponseToneStyle = 'professional',
  context?: string
): Promise<string> => {
  // Mock implementation - replace with actual API call
  return `Generated response in ${tone} tone for: ${content.substring(0, 50)}...`;
};

export const fetchSeoContent = async (): Promise<SeoContent[]> => {
  // Mock data - replace with actual API calls
  return [];
};
