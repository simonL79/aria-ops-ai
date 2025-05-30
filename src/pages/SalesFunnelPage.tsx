
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/ui/logo";
import { Star, Shield, Eye, Users, CheckCircle, LogIn, Building, Briefcase, Award, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

  const industries = [
    { name: 'Government Relations', icon: Building },
    { name: 'Professional Services', icon: Briefcase },
    { name: 'Private Equity', icon: Award },
    { name: 'Venture Capital', icon: BadgeCheck },
    { name: 'Investment Management', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <Logo variant="light" size="xl" />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/simon-lindsay" className="text-gray-300 hover:text-white transition-colors">
                About Simon
              </Link>
              <Link to="/scan" className="text-gray-300 hover:text-white transition-colors">
                Get Started
              </Link>
              <button className="text-gray-300 hover:text-white transition-colors">
                Services
              </button>
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <LogIn className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center">
            {/* A.R.I.A Logo */}
            <div className="flex justify-center">
              <Logo variant="light" size="10x" />
            </div>
            
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Elevate Your
                <br />
                <span className="text-orange-500">Digital</span> <span className="text-white">Reputation</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
                Enterprise-grade reputation intelligence and crisis prevention. Powered by AI, delivered by experts who understand the stakes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-md">
                Request Assessment
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg rounded-md">
                Learn More
              </Button>
            </div>
            
            {/* Ratings */}
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-sm text-gray-300">Rated Excellent on Trustpilot</span>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-green-500 text-green-500" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center">Based on 247+ reviews</p>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-sm text-gray-300">5.0 Stars on Google Reviews</span>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-blue-400 text-blue-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center">Verified business reviews</p>
              </div>
            </div>
          </div>
          
          {/* Right Content - Professional Portrait with Trusted to Protect Button */}
          <div className="relative">
            <div className="relative">
              <img 
                src="/lovable-uploads/25cdb440-ad52-4fdf-a3a0-24ef40720b24.png" 
                alt="Professional executive portrait"
                className="w-full max-w-md mx-auto rounded-lg"
              />
              {/* Trusted to Protect Button - positioned at left bottom edge */}
              <div className="absolute bottom-4 left-0">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-xl font-bold rounded-md flex items-center">
                  <Shield className="mr-3 h-6 w-6" />
                  Trusted to Protect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Across Industries Section */}
      <section className="py-8 bg-black">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-300 mb-8">Trusted Across Industries</h3>
          <div className="grid grid-cols-5 gap-8 items-center">
            {industries.map((industry, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <industry.icon className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-sm text-gray-400">{industry.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Reputation Management Services – Powered by A.R.I.A™
            </h2>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto">
              A.R.I.A™ isn't just for celebrities, CEOs, or great brands. Reputation is personal — and everyone 
              deserves protection. Whether you're facing online abuse, negative press, or algorithmic bias, we've 
              built elite tools for every type of modern digital identity.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Social Media Protection */}
            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-bold text-orange-500">Social Media Protection</h3>
              </div>
              <p className="text-gray-300 mb-4 text-center">
                <strong>Ideal for:</strong> Everyday users, community leaders, students, professionals
              </p>
              <div className="space-y-3 mb-6">
                <div className="text-sm font-semibold text-white text-center">What We Do</div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Monitor threats across X (Twitter), Reddit, TikTok, and Instagram
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Suppress legacy content via GRAVEYARD™ & EIDETIC™
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Counter disinformation campaigns in real time
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Send takedown notices for harassment
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-white mb-2 text-center">Why It Matters</div>
                <p className="text-xs text-gray-400 text-center">
                  Your digital footprint should reflect who you are today — not mistakes, rumors, or misinformation from years ago.
                </p>
              </div>
            </Card>

            {/* Influencer & Creator */}
            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-bold text-orange-500">Influencer & Creator Shield</h3>
              </div>
              <p className="text-gray-300 mb-4 text-center">
                <strong>Ideal for:</strong> Influencers, streamers, YouTubers, TikTokers, OnlyFans creators, podcasters
              </p>
              <div className="space-y-3 mb-6">
                <div className="text-sm font-semibold text-white text-center">What We Do</div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Real-time crisis monitoring when content goes viral
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Predictive behavior alerts via PRAXIS™
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  AI bias analysis on LLMs and search engines
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Automated counter-narratives via RSI™
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-white mb-2 text-center">Why It Matters</div>
                <p className="text-xs text-gray-400 text-center">
                  One viral moment shouldn't define your career. A.R.I.A™ helps you stay ahead of cancel culture, hate mobs, and false narratives.
                </p>
              </div>
            </Card>

            {/* Everyday People Protection */}
            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-bold text-orange-500">Everyday People Protection</h3>
              </div>
              <p className="text-gray-300 mb-4 text-center">
                <strong>Ideal for:</strong> Teachers, nurses, founders, job-seekers, private citizens
              </p>
              <div className="space-y-3 mb-6">
                <div className="text-sm font-semibold text-white text-center">What We Do</div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Search engine cleanup of harmful results
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Threat detection from forums and dark web
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Alerts when your information resurfaces
                </div>
                <div className="flex items-center text-sm text-gray-300 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Legal rights enforcement (GDPR, CCPA, DSR)
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-white mb-2 text-center">Why It Matters</div>
                <p className="text-xs text-gray-400 text-center">
                  You don't need to be "famous" to be vulnerable. If you've ever Googled yourself and felt uneasy, we're here for you.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Ready to Get Started CTA */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gray-900 border-gray-700 p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-8">
                Get a comprehensive assessment of your digital risk profile and strategic roadmap.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-md">
                Request Risk Assessment
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-8">
            <Shield className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-orange-500">Add-On Services</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Dark Web Leak Monitoring</h3>
              <p className="text-gray-300 text-sm mb-4">
                Get notified if your name, phone, or email appears to be stolen and now being traded on the dark web.
              </p>
              <h3 className="text-lg font-semibold mb-4">AI Diende Monitoring</h3>
              <p className="text-gray-300 text-sm">
                True AI-11 model looks after Discord, Reddit and messaging monitoring.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Family Reputation Package</h3>
              <p className="text-gray-300 text-sm mb-4">
                Protect your children or family members from online harassment and digital reputation damage.
              </p>
              <h3 className="text-lg font-semibold mb-4">Full Service Takedowns</h3>
              <p className="text-gray-300 text-sm">
                We do the heavy AI-work of facts and spin your narrative properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-700 p-8">
              <div className="flex mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "ARIA's intelligence platform helped us identify and orchestrate a coordinated attack before it reached mainstream media. Their proactive approach saved our reputation."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-gray-400">Chief Communications Officer</div>
                  <div className="text-sm text-gray-400">Global Financial Services</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700 p-8">
              <div className="flex mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The depth of their analysis and speed of response is unmatched. They don't just monitor - they predict and prevent. Essential for any serious organization."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Michael Rodriguez</div>
                  <div className="text-sm text-gray-400">Partner</div>
                  <div className="text-sm text-gray-400">Top-Tier Investment Fund</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Reputation?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Get a comprehensive assessment of your digital risk profile. Our experts will identify vulnerabilities and provide a strategic roadmap.
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-xl font-semibold text-orange-500 mb-4">Request Your Assessment</h3>
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
            <input 
              type="email" 
              placeholder="Corporate Email" 
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
            <input 
              type="text" 
              placeholder="Company" 
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold rounded-md">
              Get Assessment
            </Button>
            <p className="text-xs text-gray-400">Results delivered within 48 hours</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo variant="light" size="md" className="mb-4" />
              <p className="text-gray-400 text-sm">Advanced Reputation Intelligence Agent</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Threat Detection</div>
                <div>Risk Management</div>
                <div>Intelligence Reports</div>
                <div>Crisis Response</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Access</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Admin Login</div>
                <div>Client Portal</div>
                <div>API Status</div>
                <div>Get Started</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 pt-8 mt-8 border-t border-gray-800">
            © 2025 A.R.I.A.™ All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
