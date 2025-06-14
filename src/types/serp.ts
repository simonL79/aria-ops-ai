
export interface SERPResult {
  position: number;
  previousPosition: number;
  url: string;
  title: string;
  type: "owned" | "negative" | "neutral";
}

export interface SeoMetrics {
  ownedResults: number;
  negativeResults: number;
  controlScore: number;
  visibilityScore: number;
}

export interface SerpPositionChange {
  difference: number;
  improved: boolean;
  declined: boolean;
  noChange: boolean;
}
