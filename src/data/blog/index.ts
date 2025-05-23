
import { BlogPost } from '@/types/blog';
import { ariaPosts } from './ariaPosts';
import { technologyPosts } from './technologyPosts';
import { reputationPosts } from './reputationPosts';

// Combine all blog posts and sort by date (newest first)
export const blogPosts: BlogPost[] = [
  ...ariaPosts,
  ...technologyPosts,
  ...reputationPosts
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Export the interface for backward compatibility
export type { BlogPost };
