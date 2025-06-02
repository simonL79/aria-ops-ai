
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const BlogPage = () => {
  const { blogPosts, loading, error } = useBlogPosts();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Helmet>
          <title>A.R.I.A™ Blog - Reputation Intelligence Insights</title>
          <meta name="description" content="Expert insights on reputation intelligence, digital security, and crisis prevention from A.R.I.A™ team." />
          <meta name="keywords" content="reputation intelligence, digital security, crisis prevention, A.R.I.A, blog, insights" />
        </Helmet>
        <PublicLayout>
          <div className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">A.R.I.A™ Blog</h1>
                  <p className="text-xl text-gray-300">
                    Insights on reputation intelligence, digital security, and crisis prevention
                  </p>
                </div>
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-300">Loading blog posts...</p>
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
        <Helmet>
          <title>A.R.I.A™ Blog - Reputation Intelligence Insights</title>
          <meta name="description" content="Expert insights on reputation intelligence, digital security, and crisis prevention from A.R.I.A™ team." />
        </Helmet>
        <PublicLayout>
          <div className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">A.R.I.A™ Blog</h1>
                  <p className="text-xl text-gray-300">
                    Insights on reputation intelligence, digital security, and crisis prevention
                  </p>
                </div>
                <div className="text-center py-10 text-red-500">
                  <p className="text-lg">Error loading blog posts: {error}</p>
                </div>
              </div>
            </div>
          </div>
        </PublicLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>A.R.I.A™ Blog - Reputation Intelligence Insights</title>
        <meta name="description" content="Expert insights on reputation intelligence, digital security, and crisis prevention from A.R.I.A™ team." />
        <meta name="keywords" content="reputation intelligence, digital security, crisis prevention, A.R.I.A, blog, insights, Simon Lindsay" />
        <meta property="og:title" content="A.R.I.A™ Blog - Reputation Intelligence Insights" />
        <meta property="og:description" content="Expert insights on reputation intelligence, digital security, and crisis prevention from A.R.I.A™ team." />
        <meta property="og:url" content={`${window.location.origin}/blog`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>
      
      <PublicLayout>
        <div className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">A.R.I.A™ Blog</h1>
                <p className="text-xl text-gray-300">
                  Insights on reputation intelligence, digital security, and crisis prevention
                </p>
              </div>
              
              {blogPosts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-300">No blog posts found.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {blogPosts.map((post, index) => (
                    <Card key={post.id || index} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="bg-orange-500 text-black">
                            {post.category}
                          </Badge>
                          {post.medium_url && (
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              Available on Medium
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl text-white hover:text-orange-500 transition-colors">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-lg">
                          {post.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {post.medium_url && (
                              <Button asChild variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                                <a href={post.medium_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  Medium
                                </a>
                              </Button>
                            )}
                            <Button asChild variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-gray-700">
                              <Link to={`/blog/${post.slug}`} className="flex items-center gap-1">
                                Read More <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <h2 className="text-2xl font-bold mb-4 text-white">Stay Updated</h2>
                <p className="text-gray-300 mb-6">
                  Subscribe to our newsletter for the latest insights on reputation intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </div>
  );
};

export default BlogPage;
