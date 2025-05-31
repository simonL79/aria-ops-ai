
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "The Rise of AI-Powered Reputation Management",
      excerpt: "How artificial intelligence is revolutionizing the way we protect and manage digital reputations in 2024.",
      author: "Simon Lindsay",
      date: "2024-01-15",
      category: "Technology",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Understanding Digital Threats in the Modern Age",
      excerpt: "A comprehensive guide to identifying and mitigating online reputation threats before they damage your brand.",
      author: "Simon Lindsay",
      date: "2024-01-10",
      category: "Security",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Case Study: How A.R.I.A.™ Saved a Fortune 500 Company",
      excerpt: "Real-world example of crisis management and reputation recovery using advanced AI monitoring systems.",
      author: "Simon Lindsay",
      date: "2024-01-05",
      category: "Case Study",
      readTime: "6 min read"
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Reputation Intelligence Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Insights, strategies, and the latest developments in digital reputation management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-orange-500 text-orange-500">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-gray-400">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-white text-xl mb-3">
                    {post.title}
                  </CardTitle>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-orange-500 hover:text-orange-400 flex items-center gap-1 text-sm"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400">
              Stay informed about the latest in reputation management and digital security.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;
