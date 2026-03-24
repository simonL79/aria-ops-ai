
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content_html: string | null;
  content_markdown: string | null;
  image_url: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  infographic_url: string | null;
  canonical_url: string | null;
  tags: string[];
  language: string;
  meta_description: string | null;
  meta_keywords: string[];
  faq_schema: { question: string; answer: string }[] | null;
  reading_time: number;
  published_at: string | null;
  modified_at: string | null;
  updated_at: string | null;
  created_at: string | null;
  synced_at: string | null;
  received_at: string | null;
}
