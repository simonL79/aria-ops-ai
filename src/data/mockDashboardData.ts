
import { ContentAlert, ContentSource, ContentAction, MetricValue } from '@/types/dashboard';

export const mockMetrics: MetricValue[] = [
  { id: "1", title: "Total Mentions", value: 156, change: 12, icon: "trending-up", color: "blue", delta: 12, deltaType: "increase" },
  { id: "2", title: "Negative Sentiment", value: 23, change: -5, icon: "trending-down", color: "red", delta: -5, deltaType: "decrease" },
  { id: "3", title: "Active Sources", value: 8, change: 2, icon: "trending-up", color: "green", delta: 2, deltaType: "increase" },
  { id: "4", title: "Response Rate", value: 87, change: 8, icon: "trending-up", color: "yellow", delta: 8, deltaType: "increase" }
];

export const mockAlerts: ContentAlert[] = [
  {
    id: "1",
    platform: "Twitter",
    content: "This company has terrible customer service",
    date: "2024-01-15",
    severity: "high",
    status: "new",
    threatType: "reputation_risk",
    confidenceScore: 85,
    sourceType: "social",
    sentiment: "negative",
    potentialReach: 5000,
    detectedEntities: ["company"],
    url: "https://twitter.com/example"
  },
  {
    id: "2", 
    platform: "Reddit",
    content: "Having issues with their product quality",
    date: "2024-01-14",
    severity: "medium",
    status: "read",
    threatType: "product_issue",
    confidenceScore: 72,
    sourceType: "forum",
    sentiment: "negative",
    potentialReach: 1200,
    detectedEntities: ["product"],
    url: "https://reddit.com/example"
  }
];

export const mockSources: ContentSource[] = [
  {
    id: "1",
    name: "Twitter",
    type: "social",
    status: "good",
    lastUpdate: "2024-01-15",
    metrics: { total: 45, positive: 30, negative: 10, neutral: 5 },
    positiveRatio: 67,
    total: 45,
    active: true,
    lastUpdated: "2024-01-15",
    mentionCount: 45,
    sentiment: 0.2
  },
  {
    id: "2", 
    name: "Reddit",
    type: "forum",
    status: "warning",
    lastUpdate: "2024-01-15",
    metrics: { total: 23, positive: 8, negative: 12, neutral: 3 },
    positiveRatio: 35,
    total: 23,
    active: true,
    lastUpdated: "2024-01-15", 
    mentionCount: 23,
    sentiment: -0.3
  }
];

export const mockActions: ContentAction[] = [
  {
    id: "1",
    type: "urgent",
    description: "Respond to negative Twitter mention",
    timestamp: "2024-01-15",
    status: "pending",
    platform: "Twitter",
    action: "respond",
    date: "2024-01-15"
  },
  {
    id: "2",
    type: "monitoring", 
    description: "Monitor Reddit thread escalation",
    timestamp: "2024-01-14",
    status: "completed",
    platform: "Reddit",
    action: "monitor",
    date: "2024-01-14"
  }
];
