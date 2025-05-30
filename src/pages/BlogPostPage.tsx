import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicLayout from "@/components/layout/PublicLayout";
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { ArrowLeft, Calendar, User, Tag, Share, Facebook, Twitter, Linkedin, Mail, Rss, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/blog/BlogCard';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { blogPosts, loading, error } = useBlogPosts();
  
  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading blog post...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Error Loading Blog Post</h1>
          <p className="mb-8">{error}</p>
          <Button onClick={() => navigate('/blog')}>
            Return to Blog
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const post = blogPosts.find(post => post.slug === slug);
  const relatedPosts = blogPosts
    .filter(p => p.slug !== slug && p.category === post?.category)
    .slice(0, 3);
  
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "A.R.I.A™ Blog Post";
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };
  
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
  
  const isWhitePaper = post.category === "White Paper" || post.title.includes("[WHITE PAPER]");
  
  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        {/* Hero section with cover image */}
        <div 
          className={`w-full h-[40vh] bg-center bg-cover ${isWhitePaper ? 'border-b-4 border-amber-400' : ''}`}
          style={{ backgroundImage: `url(${post.image})` }}
        >
          <div className={`w-full h-full ${isWhitePaper ? 'bg-amber-900/50' : 'bg-black/50'} flex items-center justify-center`}>
            <div className="container px-6 max-w-4xl text-center text-white">
              {isWhitePaper && (
                <div className="mb-4">
                  <Badge variant="secondary" className="bg-amber-400 text-black font-bold text-sm px-4 py-2">
                    <FileText className="h-4 w-4 mr-2" />
                    OFFICIAL WHITE PAPER & DECLARATION
                  </Badge>
                </div>
              )}
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
            
            {isWhitePaper && (
              <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Official White Paper Declaration
                </h3>
                <p className="text-amber-700">
                  This document serves as both a technical white paper and an official declaration 
                  regarding the Eidetic memory system. Timestamp recorded for historical reference 
                  and intellectual property documentation.
                </p>
              </div>
            )}
            
            {/* Social sharing buttons */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-gray-500 text-sm">Share:</span>
              <Button variant="outline" size="icon" onClick={() => handleShare("facebook")} title="Share on Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("twitter")} title="Share on Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")} title="Share on LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("email")} title="Share via Email">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("copy")} title="Copy link">
                <Share className="h-4 w-4" />
              </Button>
            </div>
            
            <div className={`prose prose-lg max-w-none ${isWhitePaper ? 'prose-amber' : ''}`}>
              {post.content}
            </div>
            
            {/* Author info with headshot */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" alt="Simon Lindsay" />
                <AvatarFallback>SL</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold mb-2">About Simon Lindsay</h3>
                <p className="text-gray-600">
                  Simon Lindsay is the founder of A.R.I.A™ and a pioneer in applying artificial intelligence to reputation management. 
                  With over 15 years of experience in digital risk mitigation, Simon has protected the online presence of 
                  Fortune 500 executives, celebrities, and high-profile entrepreneurs.
                </p>
              </div>
            </div>
            
            {/* Email subscription form */}
            <div className="mt-12 pt-8 border-t border-gray-200 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Get the latest insights on AI-powered digital protection delivered to your inbox.
              </p>
              <form className="flex gap-2 flex-col sm:flex-row" onSubmit={(e) => {
                e.preventDefault();
                toast.success("Thank you for subscribing!");
                const form = e.target as HTMLFormElement;
                form.reset();
              }}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="border border-gray-300 px-4 py-2 rounded flex-grow"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
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
