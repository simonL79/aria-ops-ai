
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { blogPosts } from '@/data/blog';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">A.R.I.A™ Blog</h1>
            <p className="text-xl text-gray-300 text-center mb-12">
              Insights, analysis, and updates from the world of digital reputation management
            </p>
            
            <div className="space-y-8">
              {blogPosts.map((post, index) => (
                <article key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.date}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-4">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">By {post.author}</span>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-orange-500 hover:text-orange-400 font-semibold"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
              
              {blogPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No blog posts available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;
