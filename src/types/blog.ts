
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  medium_url?: string;
  created_at?: string;
  updated_at?: string;
}
