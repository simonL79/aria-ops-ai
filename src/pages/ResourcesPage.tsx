
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/logo';
import BlogCard from '@/components/blog/BlogCard';
import LeadMagnetForm from '@/components/lead-magnet/LeadMagnetForm';

const ResourcesPage = () => {
  // Sample blog posts data - in a real app, this would come from a database
  const blogPosts = [
    {
      title: "How AI is Changing Online Reputation Management",
      description: "AI-powered tools are revolutionizing how individuals and businesses manage their digital presence. Learn the latest trends and strategies.",
      image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000",
      date: "May 20, 2025",
      category: "AI & Reputation",
      slug: "ai-changing-reputation-management"
    },
    {
      title: "5 Warning Signs Your Online Reputation Is Under Threat",
      description: "Discover the early warning signs that your digital reputation might be at risk, and what you can do to protect yourself.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000",
      date: "May 15, 2025",
      category: "Protection Strategies",
      slug: "warning-signs-reputation-threat"
    },
    {
      title: "The True Cost of Negative Search Results",
      description: "One negative article in your search results can cost you thousands. Find out how to calculate the real impact on your business or career.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
      date: "May 10, 2025",
      category: "Search Results",
      slug: "cost-of-negative-search-results"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="py-6 bg-white border-b border-premium-silver shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-premium-gray hover:text-premium-black transition-colors">Home</Link>
              <Link to="/pricing" className="text-premium-gray hover:text-premium-black transition-colors">Pricing</Link>
              <Link to="/about" className="text-premium-gray hover:text-premium-black transition-colors">About</Link>
            </div>
            <Button asChild variant="default" className="bg-premium-black hover:bg-premium-black/90">
              <Link to="/scan">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-premium-black">Reputation Intelligence Resources</h1>
          <p className="text-xl text-premium-gray max-w-2xl mx-auto">
            Insights, strategies, and case studies to help you understand and protect your digital reputation.
          </p>
        </div>
        
        {/* Featured Resource Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-premium-black to-premium-darkGray rounded-xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded inline-block mb-4 w-fit">FEATURED RESOURCE</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">The 2025 AI Reputation Scan Playbook</h2>
                <p className="text-premium-silver mb-6">
                  Discover how advanced AI tools are being used to monitor, protect, and enhance your digital presence. Our comprehensive guide gives you the exact steps to take control of your online narrative.
                </p>
                <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-premium-black transition-all w-fit">
                  <Link to="/resources/ai-reputation-scan-playbook" className="flex items-center">
                    Download Free Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000')] bg-cover bg-center min-h-[300px]"></div>
            </div>
          </div>
        </section>
        
        {/* Latest Articles Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-premium-black">Latest Articles</h2>
            <Button variant="outline" asChild>
              <Link to="/blog" className="flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard 
                key={index}
                title={post.title}
                description={post.description}
                image={post.image}
                date={post.date}
                category={post.category}
                slug={post.slug}
              />
            ))}
          </div>
        </section>
        
        {/* Lead Magnet Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-premium-black">Free Reputation Audit</h2>
              <p className="text-premium-gray mb-6">
                Get our comprehensive reputation audit checklist and find out where your online presence stands. Includes:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Self-assessment questionnaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Top 10 reputation risk factors</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Action plan template for reputation repair</span>
                </li>
              </ul>
              <p className="text-premium-gray mb-4">
                This audit has helped over 500 individuals and businesses identify critical vulnerabilities in their online presence.
              </p>
            </div>
            <div>
              <LeadMagnetForm
                title="Download Free Reputation Audit"
                description="Enter your details to receive our comprehensive audit checklist"
                downloadName="reputation-audit-checklist"
                ctaText="Get The Audit Checklist"
                variant="premium"
              />
            </div>
          </div>
        </section>
        
        {/* Case Studies Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-premium-black">Case Studies</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000')] bg-cover bg-center"></div>
              <CardHeader>
                <CardTitle>How A.R.I.A™ Helped a Tech CEO Restore His Reputation</CardTitle>
                <CardDescription>
                  After a series of negative press articles threatened his career, our client leveraged A.R.I.A's advanced monitoring and suppression techniques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-premium-black font-bold">Results:</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">97% Negative Content Suppressed</span>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/case-studies/tech-ceo">
                    Read Case Study
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000')] bg-cover bg-center"></div>
              <CardHeader>
                <CardTitle>Preventing a Reputation Crisis Before It Happens</CardTitle>
                <CardDescription>
                  Our client, a rising influencer, received early warnings about potential smear campaigns being organized in private forums.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-premium-black font-bold">Results:</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Crisis Averted</span>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/case-studies/influencer-prevention">
                    Read Case Study
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-premium-black text-premium-silver py-16 text-center mt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <Logo variant="light" size="md" />
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <Link to="/about" className="text-premium-silver hover:text-white transition-colors">About</Link>
              <Link to="/biography" className="text-premium-silver hover:text-white transition-colors">Simon Lindsay</Link>
              <Link to="/pricing" className="text-premium-silver hover:text-white transition-colors">Pricing</Link>
              <Link to="/privacy-policy" className="text-premium-silver hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/disclaimer" className="text-premium-silver hover:text-white transition-colors">Disclaimer</Link>
              <Link to="/gdpr-compliance" className="text-premium-silver hover:text-white transition-colors">GDPR Compliance</Link>
              <Link to="/auth" className="text-premium-silver hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div className="border-t border-premium-darkGray pt-6 mt-6">
            <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResourcesPage;
