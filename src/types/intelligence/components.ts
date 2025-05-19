
// For the UI components
export interface ThreatFeedProps {
  threats: any[];
  loading?: boolean;
  onThreatSelect?: (threat: any) => void;
}

export interface TimelineViewProps {
  data: any[];
  period?: 'day' | 'week' | 'month' | 'year';
  loading?: boolean;
}

export interface ActionPanelProps {
  selectedAlert?: any;
  onApprove?: (response: string) => void;
  onSend?: (response: string) => void;
}

export interface SEOTrackerProps {
  keywords: string[];
  positions: any[];
  loading?: boolean;
}
