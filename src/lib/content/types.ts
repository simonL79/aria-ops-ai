// Shared types for the A.R.I.A unified content engine (Phase 1).
// One content model powers every editorial/authority type.

export type ContentType =
  | "guide"
  | "report"
  | "research"
  | "case-study"
  | "tool"
  | "whitepaper"
  | "download"
  | "brief";

export type ContentStatus = "draft" | "scheduled" | "published";

export type ThreatLevel = "critical" | "high" | "elevated" | "moderate" | "low" | "informational";

export interface ContentSection {
  id?: string;
  heading: string;
  body?: string;
  level?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReferenceItem {
  label: string;
  url?: string;
  source?: string;
}

export interface DownloadItem {
  label: string;
  url: string;
  gated?: boolean;
  format?: string;
}

export interface StatItem {
  label: string;
  value: string;
  delta?: string;
  intent?: "up" | "down" | "neutral";
}

export interface VizBlock {
  kind:
    | "threat-heatmap"
    | "risk-matrix"
    | "search-visibility"
    | "sentiment-trend"
    | "authority-score"
    | "serp-snapshot"
    | "brand-exposure"
    | "entity-graph";
  title?: string;
  data?: unknown;
}

export interface ContentAuthor {
  id: string;
  slug: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  credentials: string[];
  avatar_url?: string | null;
}

export interface ContentCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  kind: string;
  icon?: string | null;
  sort_order: number;
}

export interface ContentItem {
  id: string;
  slug: string;
  type: ContentType;
  category_id: string | null;
  author_id: string | null;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  body?: string | null;
  cover_image?: string | null;
  status: ContentStatus;
  published_at?: string | null;
  featured: boolean;
  threat_level?: ThreatLevel | string | null;
  executive_risk?: string | null;
  detection_confidence?: number | null;
  reviewed: boolean;
  reviewed_at?: string | null;
  verified: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  tags: string[];
  sections: ContentSection[];
  faq: FaqItem[];
  references_list: ReferenceItem[];
  downloads: DownloadItem[];
  stats: StatItem[];
  viz: VizBlock[];
  reading_minutes?: number | null;
  view_count: number;
  // editorial governance
  is_seed_content?: boolean;
  noindex?: boolean;
  source_notes?: string | null;
  fact_checked_at?: string | null;
  fact_checked_by?: string | null;
  legal_reviewed_at?: string | null;
  legal_reviewed_by?: string | null;
  content_risk_level?: string | null;
  created_at: string;
  updated_at: string;
  // optional joined relations
  author?: ContentAuthor | null;
  category?: ContentCategory | null;
}

export type TaxonomyKind = "profession" | "industry" | "threat-type" | "audience" | "solution";

export interface TaxonomyEntity {
  id: string;
  slug: string;
  kind: TaxonomyKind | string;
  name: string;
  description?: string | null;
  overview?: string | null;
  common_risks: string[];
  recommended_monitoring: string[];
  examples: string[];
  faq: FaqItem[];
  threat_level?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  published: boolean;
  sort_order: number;
}

export interface ContentLink {
  id: string;
  source_id: string;
  target_id: string;
  relation: string;
  weight: number;
}

/** Human labels for content types, using intelligence-platform terminology. */
export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  guide: "Intelligence Guide",
  report: "Intelligence Report",
  research: "Research Report",
  "case-study": "Case File",
  tool: "Assessment Tool",
  whitepaper: "Whitepaper",
  download: "Operational Asset",
  brief: "Intelligence Brief",
};

/** Call-to-action verb per content type. */
export const CONTENT_TYPE_CTA: Record<ContentType, string> = {
  guide: "Read Intelligence Guide",
  report: "Read Intelligence Report",
  research: "Read Research Report",
  "case-study": "Open Case File",
  tool: "Run Assessment",
  whitepaper: "Read Whitepaper",
  download: "Access Asset",
  brief: "Read Intelligence Brief",
};
