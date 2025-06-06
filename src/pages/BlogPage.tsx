
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import MediumImportButton from '@/components/blog/MediumImportButton';
import { Loader2 } from 'lucide-react';

const BlogPage = () => {
  const { blogPosts, loading, error } = useBlogPosts();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-center mb-2">A.R.I.A™ Blog</h1>
                <p className="text-xl text-gray-300 text-center">
                  Insights, analysis, and updates from the world of digital reputation management
                </p>
              </div>
              {isAuthenticated && isAdmin && <MediumImportButton />}
            </div>
            
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-300">Loading articles...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-400">Error loading articles: {error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-8">
                {blogPosts.map((post, index) => (
                  <article key={post.id || index} className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm">{post.date}</span>
                      {post.medium_url && (
                        <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-semibold">
                          Medium Import
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-300 mb-4">
                      {post.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">By {post.author}</span>
                      <div className="flex gap-4">
                        {post.medium_url && (
                          <a 
                            href={post.medium_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-400 font-semibold"
                          >
                            View on Medium →
                          </a>
                        )}
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-orange-500 hover:text-orange-400 font-semibold"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
                
                {!loading && !error && blogPosts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">No blog posts available at the moment.</p>
                    {isAuthenticated && isAdmin && (
                      <p className="text-gray-500 text-sm">Use the import button above to import Medium articles.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;
