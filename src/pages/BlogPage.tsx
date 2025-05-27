
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, User, TrendingUp, Shield, AlertTriangle, ExternalLink, FileText, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '@/data/blog';

const BlogPage = () => {
  // Sort posts by date and mark the first one as featured
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const postsWithFeatured = sortedPosts.map((post, index) => ({
    ...post,
    featured: index === 0 // Mark the most recent post as featured
  }));

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      <Helmet>
        <title>A.R.I.A™ Insights - Digital Reputation Intelligence & EIDETIC Whitepaper</title>
        <meta name="description" content="Stay ahead with expert insights on digital reputation management, AI threat detection, and revolutionary EIDETIC memory firewall technology from A.R.I.A™." />
        <meta name="keywords" content="EIDETIC, digital reputation management, AI threat detection, memory firewall, reputation intelligence, crisis prevention, A.R.I.A" />
        <meta property="og:title" content="A.R.I.A™ Insights - Digital Reputation Intelligence & EIDETIC Whitepaper" />
        <meta property="og:description" content="Discover cutting-edge insights on digital reputation management and the revolutionary EIDETIC memory firewall technology." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="A.R.I.A™ Insights - EIDETIC Whitepaper" />
        <meta name="twitter:description" content="Revolutionary AI-powered digital memory management and reputation protection technology." />
        <link rel="canonical" href="https://aria.com/blog" />
      </Helmet>

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

      {/* EIDETIC Whitepaper Claim Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <Card className="shadow-xl border-2 border-purple-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                    🧠 EIDETIC™ Memory Firewall Whitepaper
                  </CardTitle>
                  <p className="text-purple-100 text-lg">
                    Revolutionary AI-Powered Digital Memory Management Technology
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-purple-100 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Published: May 27, 2025</span>
                  </div>
                  <Badge className="bg-white/20 text-white">Featured Research</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Introducing EIDETIC™: The Future of Digital Reputation Protection
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Our groundbreaking whitepaper reveals how EIDETIC™ technology revolutionizes digital memory management 
                    through advanced AI algorithms, temporal decay analysis, and intelligent content recalibration. 
                    Discover how this cutting-edge system protects digital reputations by managing memory footprints 
                    across the web with unprecedented precision.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700">AI-Powered Memory Decay Analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700">Predictive Content Recalibration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700">Proactive Reputation Risk Mitigation</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      asChild 
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                      <a 
                        href="https://medium.com/@simonlindsay7988/eidetic-ba18e0ecfce4" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-4 w-4" />
                        Read Full Whitepaper
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    
                    <Button variant="outline" asChild>
                      <a href="/eidetic" className="flex items-center gap-2">
                        Experience EIDETIC™ Live Demo
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-lg border-2 border-dashed border-purple-300">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🧠</div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        EIDETIC™ Technology Stack
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>✓ Memory Footprint Detection</p>
                        <p>✓ Temporal Decay Profiling</p>
                        <p>✓ AI Content Recalibration</p>
                        <p>✓ Predictive Risk Analysis</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timestamp badge */}
                  <div className="absolute -top-3 -right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    May 2025
                  </div>
                </div>
              </div>
              
              {/* Additional metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Simon Lindsay, Founder & CEO
                    </span>
                    <span>Research Publication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">AI Research</Badge>
                    <Badge variant="secondary">Digital Reputation</Badge>
                    <Badge variant="secondary">Memory Management</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {postsWithFeatured.map((post) => (
              <Card key={post.id || post.slug} className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${post.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
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
                    {post.description}
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
