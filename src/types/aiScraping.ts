
// Add or ensure these types are defined
export interface ScanParameters {
  platforms?: string[];
  keywords?: string[];
  timeframe?: "day" | "week" | "month";
  intensity?: "low" | "medium" | "high";
  threatTypes?: string[];
  keywordFilters?: string[];
  maxResults?: number;
  includeCustomerEnquiries?: boolean;
  prioritizeSeverity?: "low" | "medium" | "high"; // String, not boolean
}

// Add any other AI scraping related types here
