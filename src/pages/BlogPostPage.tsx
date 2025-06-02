
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, ExternalLink } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { blogPosts, loading, error } = useBlogPosts();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <PublicLayout>
          <div className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-300">Loading blog post...</p>
                </div>
              </div>
            </div>
          </div>
        </PublicLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <PublicLayout>
          <div className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center py-10 text-red-500">
                  <p className="text-lg">Error loading blog post: {error}</p>
                  <Button asChild variant="ghost" className="mt-4 text-orange-500 hover:text-orange-400">
                    <Link to="/blog">← Back to Blog</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PublicLayout>
      </div>
    );
  }

  const blogPost = blogPosts.find(post => post.slug === slug);

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-black text-white">
        <PublicLayout>
          <div className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center py-10">
                  <h1 className="text-3xl font-bold mb-4 text-white">Blog Post Not Found</h1>
                  <p className="text-gray-300 mb-6">The blog post you're looking for doesn't exist.</p>
                  <Button asChild variant="ghost" className="text-orange-500 hover:text-orange-400">
                    <Link to="/blog">← Back to Blog</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PublicLayout>
      </div>
    );
  }

  // Convert markdown-style content to HTML
  const formatContent = (content: string) => {
    return content
      .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h2>')
      .replace(/### (.*?)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3 text-orange-500">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, '</p>');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{blogPost.meta_title || blogPost.title}</title>
        <meta name="description" content={blogPost.meta_description || blogPost.description} />
        <meta name="keywords" content={blogPost.meta_keywords || `${blogPost.category}, A.R.I.A, reputation management, digital intelligence`} />
        <meta property="og:title" content={blogPost.meta_title || blogPost.title} />
        <meta property="og:description" content={blogPost.meta_description || blogPost.description} />
        <meta property="og:image" content={blogPost.image} />
        <meta property="og:url" content={`${window.location.origin}/blog/${blogPost.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogPost.meta_title || blogPost.title} />
        <meta name="twitter:description" content={blogPost.meta_description || blogPost.description} />
        <meta name="twitter:image" content={blogPost.image} />
        <link rel="canonical" href={`${window.location.origin}/blog/${blogPost.slug}`} />
        {blogPost.medium_url && (
          <link rel="alternate" href={blogPost.medium_url} title="Read on Medium" />
        )}
      </Helmet>
      
      <PublicLayout>
        <div className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <Button asChild variant="ghost" className="mb-6 text-orange-500 hover:text-orange-400 hover:bg-gray-800">
                <Link to="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>

              <article>
                <header className="mb-8">
                  <Badge variant="secondary" className="bg-orange-500 text-black mb-4">
                    {blogPost.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    {blogPost.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {blogPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {blogPost.author}
                    </div>
                  </div>
                  
                  {blogPost.medium_url && (
                    <div className="mb-6">
                      <Button asChild variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                        <a href={blogPost.medium_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Read Original on Medium
                        </a>
                      </Button>
                    </div>
                  )}
                </header>

                <div className="prose prose-invert prose-lg max-w-none">
                  <div 
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatContent(blogPost.content || '') }}
                  />
                </div>

                <footer className="mt-12 pt-8 border-t border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
                    <Button asChild variant="ghost" className="text-orange-500 hover:text-orange-400">
                      <Link to="/blog" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to All Posts
                      </Link>
                    </Button>
                    
                    {blogPost.medium_url && (
                      <Button asChild variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                        <a href={blogPost.medium_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Read on Medium
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-white">Ready to Protect Your Reputation?</h3>
                    <p className="text-gray-300 mb-6">
                      Get started with a comprehensive assessment of your digital risk profile.
                    </p>
                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Link to="/scan">Request Assessment</Link>
                    </Button>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </PublicLayout>
    </div>
  );
};

export default BlogPostPage;
