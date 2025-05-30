
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPage = () => {
  const blogPosts = [
    {
      title: "The Future of Digital Reputation Management",
      description: "How AI is revolutionizing the way we protect and manage online reputations in 2024.",
      date: "December 15, 2024",
      author: "Simon Lindsay",
      category: "Technology",
      slug: "future-digital-reputation-management"
    },
    {
      title: "Crisis Prevention vs Crisis Management",
      description: "Why proactive reputation intelligence is more valuable than reactive damage control.",
      date: "December 10, 2024",
      author: "A.R.I.A Team",
      category: "Strategy",
      slug: "crisis-prevention-vs-management"
    },
    {
      title: "Understanding Digital Threat Vectors",
      description: "A comprehensive guide to the types of online threats that can damage your reputation.",
      date: "December 5, 2024",
      author: "Simon Lindsay",
      category: "Education",
      slug: "understanding-digital-threat-vectors"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
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
              
              <div className="space-y-8">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-orange-500 text-black">
                          {post.category}
                        </Badge>
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
                        <Button asChild variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-gray-700">
                          <Link to={`/blog/${post.slug}`} className="flex items-center gap-1">
                            Read More <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

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
