
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  author: string;
  date: string;
  image: string;
  category: string;
  status?: 'draft' | 'published';
}
