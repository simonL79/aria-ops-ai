
// Define intelligence report
export interface IntelligenceReport {
  id: string;
  title: string;
  date: string;
  summary: string;
  threatLevel: number;
  topics: string[];
  sources: number;
  mentions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}
