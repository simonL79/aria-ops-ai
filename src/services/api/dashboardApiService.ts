
import { MetricValue, ContentSource, ContentAction, ResponseToneStyle, SeoContent } from "@/types/dashboard";

export const getMetrics = async (): Promise<MetricValue[]> => {
  // Mock metrics data
  return [
    { id: "1", title: "Total Mentions", value: 1247, change: 12, icon: "trending-up", color: "blue", delta: 12, deltaType: "increase" },
    { id: "2", title: "Negative Sentiment", value: 23, change: -5, icon: "trending-down", color: "red", delta: -5, deltaType: "decrease" },
    { id: "3", title: "Response Rate", value: 87, change: 8, icon: "trending-up", color: "green", delta: 8, deltaType: "increase" },
    { id: "4", title: "Threat Level", value: 34, change: -2, icon: "trending-down", color: "yellow", delta: -2, deltaType: "decrease" }
  ];
};

export const getSources = async (): Promise<ContentSource[]> => {
  return [
    { 
      id: '1',
      name: 'Twitter', 
      type: 'social',
      status: 'critical', 
      lastUpdate: '2 hours ago',
      metrics: {
        total: 120,
        positive: 42,
        negative: 78,
        neutral: 0
      },
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
      type: 'social',
      status: 'good', 
      lastUpdate: '5 hours ago',
      metrics: {
        total: 230,
        positive: 200,
        negative: 30,
        neutral: 0
      },
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
      url: 'https://example.com/seo-content',
      rank: 1,
      impression: 1000,
      keywords: ['reputation', 'management'],
      priority: 'high'
    }
  ];
};
