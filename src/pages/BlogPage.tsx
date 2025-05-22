
import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from "@/components/layout/PublicLayout";
import { blogPosts } from '@/data/blogData';
import { ArrowRight } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';

const BlogPage = () => {
  return (
    <PublicLayout>
      <div className="bg-black text-white min-h-screen py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">A.R.I.A™ Blog</h1>
            <p className="text-gray-400 text-xl">Insights on digital risk, online visibility, and the future of AI-powered protection.</p>
          </div>
          
          {/* Featured post */}
          {blogPosts.length > 0 && (
            <div className="mb-16">
              <Link 
                to={`/blog/${blogPosts[0].slug}`}
                className="block bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 h-64 md:h-auto">
                    <img 
                      src={blogPosts[0].image} 
                      alt={blogPosts[0].title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="text-blue-500 font-medium mb-2">{blogPosts[0].category}</div>
                    <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                    <p className="text-gray-400 mb-4">{blogPosts[0].description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{blogPosts[0].date}</span>
                      <span className="mx-2">•</span>
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <div className="mt-6 flex items-center text-blue-500 font-medium">
                      Read more <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          
          {/* Blog post grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                description={post.description}
                image={post.image}
                date={post.date}
                category={post.category}
                slug={post.slug}
              />
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;
