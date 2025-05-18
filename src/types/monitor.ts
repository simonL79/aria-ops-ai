
export interface ContentItem {
  id: string;
  platform: string;
  type: 'post' | 'comment' | 'review';
  content: string;
  date: string;
  sentiment: 'negative' | 'neutral' | 'positive';
  impact: 'high' | 'medium' | 'low';
  url: string;
}

export interface ContentFilterState {
  platform: string;
  sentiment: string;
}
