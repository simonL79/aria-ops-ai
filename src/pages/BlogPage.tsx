
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, User, TrendingUp, Shield, AlertTriangle } from 'lucide-react';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The New Era of Digital Reputation Management",
      excerpt: "How AI-powered monitoring is changing the game for brands and individuals who need to protect their online presence.",
      author: "Simon Lindsay",
      date: "2024-01-15",
      category: "Strategy",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "GDPR Compliance in Reputation Monitoring",
      excerpt: "Understanding your obligations when monitoring digital mentions and how A.R.I.A™ keeps you compliant.",
      author: "Legal Team",
      date: "2024-01-10",
      category: "Compliance",
      readTime: "7 min read",
      featured: false
    },
    {
      id: 3,
      title: "Employee Risk: The Hidden Threat to Your Brand",
      excerpt: "Why monitoring employee digital footprints is essential for modern businesses and how to do it ethically.",
      author: "Simon Lindsay",
      date: "2024-01-05",
      category: "Risk Management",
      readTime: "6 min read",
      featured: false
    }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">A.R.I.A.™</span>
            </a>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium hover:text-primary">Home</a>
            <a href="/about" className="text-sm font-medium hover:text-primary">About</a>
            <a href="/blog" className="text-sm font-medium hover:text-primary">Blog</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">A.R.I.A™ Insights</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
            Digital Reputation Intelligence & Strategy
          </p>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
            Stay ahead of the curve with expert insights on digital reputation management, 
            threat detection, and crisis prevention from the A.R.I.A™ team.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${post.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    {post.featured && <Badge className="bg-blue-600">Featured</Badge>}
                  </div>
                  <CardTitle className={`${post.featured ? 'text-2xl' : 'text-xl'} hover:text-blue-600 transition-colors`}>
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Stay Informed</h2>
          <p className="text-lg text-gray-700 mb-8">
            Get the latest insights on digital reputation management delivered to your inbox.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Protect Your Reputation?</h2>
          <p className="text-xl mb-8 text-blue-200">Let's start with a comprehensive scan of your digital presence.</p>
          <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50">
            <a href="/#scan-form">
              🎯 Request Your Scan
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              🔐 GDPR Compliant
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              📊 Used by Agencies & Enterprises
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              🛡 Built in the UK
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
