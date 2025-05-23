
import { MetricValue, ContentSource, ContentAction, ResponseToneStyle, SeoContent } from "@/types/dashboard";

export const getMetrics = async (): Promise<MetricValue[]> => {
  // Mock metrics data
  return [
    { name: "Total Mentions", value: 1247, delta: 12, deltaType: "increase" },
    { name: "Negative Sentiment", value: 23, delta: -5, deltaType: "decrease" },
    { name: "Response Rate", value: 87, delta: 8, deltaType: "increase" },
    { name: "Threat Level", value: 34, delta: -2, deltaType: "decrease" }
  ];
};

export const getSources = async (): Promise<ContentSource[]> => {
  return [
    { 
      id: '1',
      name: 'Twitter', 
      status: 'critical', 
      positiveRatio: 35, 
      total: 120, 
      active: true,
      lastUpdated: '2 hours ago',
      mentionCount: 120,
      sentiment: -15
    },
    { 
      id: '2',
      name: 'Facebook', 
      status: 'good', 
      positiveRatio: 87, 
      total: 230, 
      active: true,
      lastUpdated: '5 hours ago',
      mentionCount: 230,
      sentiment: 25
    }
  ];
};

export const getRecentActivity = async (): Promise<ContentAction[]> => {
  return [
    { 
      id: '1', 
      type: 'removal',
      description: 'Requested removal of negative review',
      timestamp: '3 hours ago', 
      status: 'completed',
      user: 'admin',
      platform: 'Twitter', 
      action: 'removal_requested', 
      date: '3 hours ago'
    }
  ];
};

export const getToneStyles = async (): Promise<ResponseToneStyle[]> => {
  return ['professional', 'casual', 'empathetic', 'assertive'];
};

export const getSeoContent = async (): Promise<SeoContent[]> => {
  return [
    {
      id: '1',
      title: 'Sample SEO Content',
      content: 'This is sample SEO content for testing.',
      keywords: ['reputation', 'management'],
      priority: 'high'
    }
  ];
};
