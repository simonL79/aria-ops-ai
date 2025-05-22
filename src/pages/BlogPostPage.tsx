
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicLayout from "@/components/layout/PublicLayout";
import { blogPosts } from '@/data/blogData';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/blog/BlogCard';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = blogPosts.find(post => post.slug === slug);
  const relatedPosts = blogPosts
    .filter(p => p.slug !== slug && p.category === post?.category)
    .slice(0, 3);
  
  if (!post) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/blog')}>
            Return to Blog
          </Button>
        </div>
      </PublicLayout>
    );
  }
  
  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        {/* Hero section with cover image */}
        <div 
          className="w-full h-[40vh] bg-center bg-cover"
          style={{ backgroundImage: `url(${post.image})` }}
        >
          <div className="w-full h-full bg-black/50 flex items-center justify-center">
            <div className="container px-6 max-w-4xl text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-center text-sm gap-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {post.category}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blog content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog" className="flex items-center text-blue-600 mb-8">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all articles
            </Link>
            
            <div className="prose prose-lg max-w-none">
              {post.content}
            </div>
            
            {/* Author info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-2">About the author</h3>
              <p className="text-gray-600">
                {post.authorBio || `${post.author} is a reputation management expert at A.R.I.A™.`}
              </p>
            </div>
          </div>
          
          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((post) => (
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
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPostPage;
