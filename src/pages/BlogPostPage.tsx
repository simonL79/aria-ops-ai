
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";

const BlogPostPage = () => {
  const { slug } = useParams();

  // Mock blog post data - in a real app, this would come from an API
  const blogPost = {
    title: "The Future of Digital Reputation Management",
    content: `
      <p>In today's interconnected digital landscape, your online reputation can make or break your personal and professional success. As we advance into 2024, artificial intelligence is revolutionizing how we approach reputation management, shifting from reactive damage control to proactive threat prevention.</p>
      
      <h2>The Evolution of Reputation Management</h2>
      <p>Traditional reputation management was largely reactive - waiting for negative content to appear before taking action. This approach left individuals and organizations vulnerable to significant damage before any remediation could begin.</p>
      
      <h2>AI-Powered Proactive Protection</h2>
      <p>Modern AI systems like A.R.I.A™ can monitor millions of data points across the digital ecosystem, identifying potential threats before they materialize into crisis situations. This proactive approach represents a fundamental shift in how we think about reputation protection.</p>
      
      <h2>Key Benefits of AI-Driven Systems</h2>
      <ul>
        <li>Real-time monitoring across multiple platforms and sources</li>
        <li>Predictive analytics to identify emerging threats</li>
        <li>Automated response systems for immediate threat neutralization</li>
        <li>Comprehensive risk assessment and strategic planning</li>
      </ul>
      
      <h2>The Future Landscape</h2>
      <p>As AI technology continues to evolve, we can expect even more sophisticated reputation intelligence systems that not only protect but actively enhance online presence and credibility.</p>
    `,
    date: "December 15, 2024",
    author: "Simon Lindsay",
    category: "Technology",
    readTime: "5 min read"
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {blogPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {blogPost.author}
                    </div>
                    <span>{blogPost.readTime}</span>
                  </div>
                </header>

                <div className="prose prose-invert prose-lg max-w-none">
                  <div 
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  />
                </div>

                <footer className="mt-12 pt-8 border-t border-gray-700">
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
