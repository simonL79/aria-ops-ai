
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content_html: string | null;
  image_url: string | null;
  canonical_url: string | null;
  tags: string[];
  language: string;
  meta_description: string | null;
  meta_keywords: string[];
  faq_schema: { question: string; answer: string }[] | null;
  reading_time: number;
  published_at: string | null;
  modified_at: string | null;
  synced_at: string | null;
}
