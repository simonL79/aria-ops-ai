
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from "@/components/layout/PublicLayout";
import { blogPosts } from '@/data/blog';
import { ArrowRight, Rss, Mail, Edit, Lock } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';

const BlogPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for subscribing!");
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <PublicLayout>
      <div className="bg-black text-white min-h-screen py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Insights from Simon Lindsay</h1>
                <p className="text-gray-400 text-xl">Founder of A.R.I.A™, thought leader in AI-powered digital protection.</p>
              </div>
              
              {isAuthenticated && (
                <Button 
                  onClick={() => navigate('/blog/admin')} 
                  variant="outline"
                  className="mt-4 md:mt-0 border-blue-500 text-blue-400 hover:bg-blue-500/10 self-start"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Manage Blog
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <Link to="/rss.xml" className="flex items-center text-blue-500 hover:text-blue-400 transition">
                <Rss className="h-4 w-4 mr-1" />
                Subscribe via RSS
              </Link>
              
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10" onClick={() => {
                const subscribeSection = document.getElementById('email-subscribe');
                if (subscribeSection) {
                  subscribeSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                <Mail className="h-4 w-4 mr-1" />
                Email Updates
              </Button>
              
              {!isAuthenticated && (
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => navigate('/auth', { state: { from: '/blog/admin' } })}
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Admin Login
                </Button>
              )}
            </div>
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
          
          {/* Email subscription section */}
          <div id="email-subscribe" className="max-w-2xl mx-auto mt-20 p-8 bg-gray-900 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Get Expert Insights Delivered</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to receive the latest articles on digital protection, reputation management, 
              and AI-powered monitoring from Simon Lindsay.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded bg-black border border-gray-700 text-white w-full sm:w-auto"
                required
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;
