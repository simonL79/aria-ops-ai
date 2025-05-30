
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blog';
import BlogCard from '@/components/blog/BlogCard';

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                alt="A.R.I.A Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 text-white mb-2">
                <FileText className="h-10 w-10 text-amber-400" />
                Blog & Insights
              </h1>
              <p className="text-xl text-gray-300">
                Latest thoughts on reputation management and digital intelligence
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#111214] border-gray-800 hover:border-amber-600/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Edit className="h-5 w-5 text-amber-400" />
                  Draft Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-400">{blogPosts.filter(post => post.status === 'draft').length}</div>
                <p className="text-sm text-gray-400">Ready for review</p>
              </CardContent>
            </Card>

            <Card className="bg-[#111214] border-gray-800 hover:border-amber-600/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5 text-amber-400" />
                  Published Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-400">{blogPosts.filter(post => post.status === 'published').length}</div>
                <p className="text-sm text-gray-400">Live articles</p>
              </CardContent>
            </Card>

            <Card className="bg-[#111214] border-gray-800 hover:border-amber-600/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-amber-400" />
                  Total Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-400">{blogPosts.length}</div>
                <p className="text-sm text-gray-400">All articles</p>
              </CardContent>
            </Card>
          </div>

          {/* Blog Posts Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Latest Articles</h2>
            
            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(0, 9).map((post) => (
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
            ) : (
              <Card className="bg-[#111214] border-gray-800">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Coming Soon</CardTitle>
                  <CardDescription className="text-gray-400">
                    In-depth articles on reputation management, crisis prevention, and digital intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300 mb-6">
                    Our team of experts is preparing comprehensive insights and case studies to help you 
                    navigate the complex world of digital reputation management.
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-500 text-black">
                    Subscribe for Updates
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 A.R.I.A™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
