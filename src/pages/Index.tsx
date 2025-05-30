import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Eye, Check, ArrowRight, Menu, X, Star, MessageCircle, Megaphone, Users, ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminAccess = () => {
    if (isAuthenticated && isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const handleScanRequest = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-[#0A0B0D]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A0B0D]/80">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                alt="A.R.I.A Logo" 
                className="h-24 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              <a href="/simon-lindsay" className="text-gray-300 hover:text-white transition-colors">About Simon</a>
              <a href="#get-started" className="text-gray-300 hover:text-white transition-colors">Get Started</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <Button
                onClick={handleAdminAccess}
                variant="outline"
                className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black"
              >
                {isAuthenticated && isAdmin ? 'Dashboard' : 'Client Portal'}
              </Button>
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-800/50 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
                <a href="/simon-lindsay" className="text-gray-300 hover:text-white transition-colors">About Simon</a>
                <a href="#get-started" className="text-gray-300 hover:text-white transition-colors">Get Started</a>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
                <Button
                  onClick={handleAdminAccess}
                  variant="outline"
                  className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black w-full"
                >
                  {isAuthenticated && isAdmin ? 'Dashboard' : 'Client Portal'}
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* A.R.I.A Logo - 5x larger and centered */}
                <div className="flex justify-center mb-2">
                  <img 
                    src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                    alt="A.R.I.A Logo" 
                    className="h-60 w-auto"
                  />
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-center">
                  Elevate Your 
                  <span className="text-amber-400"> Digital</span> Reputation
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto text-center">
                  Enterprise-grade reputation intelligence and crisis prevention. 
                  Powered by AI, delivered by experts who understand the stakes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleScanRequest}
                  className="bg-amber-600 hover:bg-amber-500 text-black px-8 py-3 text-lg font-semibold"
                >
                  Request Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-white hover:bg-gray-800 px-8 py-3 text-lg"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>

              {/* Review Sections */}
              <div className="mt-8 space-y-6">
                {/* Trustpilot Reviews */}
                <div className="text-center">
                  <p className="text-sm text-gray-300 mb-2">Rated Excellent on Trustpilot</p>
                  <div className="flex justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-green-500 text-green-500" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Based on 247+ reviews</p>
                </div>
                
                {/* Google Reviews */}
                <div className="text-center">
                  <p className="text-sm text-gray-300 mb-2">5.0 Stars on Google Reviews</p>
                  <div className="flex justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Verified business reviews</p>
                </div>
              </div>
            </div>

            {/* Right Column - Professional Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="/lovable-uploads/e1f0cf1a-a8fe-4efe-8615-fa4f8a7747fe.png" 
                  alt="Professional consultant"
                  className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-amber-600 text-black p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Trusted to Protect</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-6 border-t border-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-gray-400 mb-12 text-lg">Trusted Across Industries</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {[
              { name: "Investment Banking", logo: "IB" },
              { name: "Professional Services", logo: "PS" },
              { name: "Technology", logo: "TC" },
              { name: "Financial Services", logo: "FS" },
              { name: "Automotive", logo: "AU" }
            ].map((industry, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {industry.logo}
                </div>
                <p className="text-sm text-gray-400">{industry.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-[#111214]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Reputation Management Services – Powered by A.R.I.A™</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              A.R.I.A™ isn't just for celebrities, CEOs, or global brands. Reputation is personal — and everyone deserves protection. 
              Whether you're facing online abuse, negative press, or algorithmic bias, we've built elite tools for every type of modern digital identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Social Media Protection */}
            <Card className="bg-[#1A1B1E] border-gray-800 p-8 hover:border-amber-600/50 transition-colors">
              <MessageCircle className="h-12 w-12 text-amber-400 mb-6" />
              <h3 className="text-xl font-bold mb-4 text-white">💬 Social Media Protection</h3>
              <p className="text-sm text-amber-400 mb-4">Ideal for: Everyday users, community leaders, students, professionals</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">What We Do:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Monitor threats across X (Twitter), Reddit, TikTok, and Instagram
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Suppress legacy content via GRAVEYARD™ & EIDETIC™
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Counter disinformation campaigns in real time
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Send takedown notices for harassment
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0A0B0D] border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  <strong>Why It Matters:</strong> Your digital footprint should reflect who you are today — not mistakes, rumors, or misinformation from years ago.
                </p>
              </div>
            </Card>

            {/* Influencer & Creator Shield */}
            <Card className="bg-[#1A1B1E] border-gray-800 p-8 hover:border-amber-600/50 transition-colors">
              <Megaphone className="h-12 w-12 text-amber-400 mb-6" />
              <h3 className="text-xl font-bold mb-4 text-white">📣 Influencer & Creator Shield</h3>
              <p className="text-sm text-amber-400 mb-4">Ideal for: Influencers, streamers, YouTubers, TikTokers, OnlyFans creators, podcasters</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">What We Do:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Real-time crisis monitoring when content goes viral
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Predictive behavior alerts via PRAXIS™
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    AI bias analysis on LLMs and search engines
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Automated counter-narratives via RSI™
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0A0B0D] border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  <strong>Why It Matters:</strong> One viral moment shouldn't define your career. A.R.I.A™ helps you stay ahead of cancel culture, hate mobs, and false narratives.
                </p>
              </div>
            </Card>

            {/* Everyday People Protection */}
            <Card className="bg-[#1A1B1E] border-gray-800 p-8 hover:border-amber-600/50 transition-colors">
              <Users className="h-12 w-12 text-amber-400 mb-6" />
              <h3 className="text-xl font-bold mb-4 text-white">🧑‍💼 Everyday People Protection</h3>
              <p className="text-sm text-amber-400 mb-4">Ideal for: Teachers, nurses, founders, job-seekers, private citizens</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">What We Do:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Search engine cleanup of harmful results
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Threat detection from forums and dark web
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Alerts when your information resurfaces
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Legal rights enforcement (GDPR, CCPA, DSR)
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0A0B0D] border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  <strong>Why It Matters:</strong> You don't need to be "famous" to be vulnerable. If you've ever Googled yourself and felt uneasy, we're here for you.
                </p>
              </div>
            </Card>
          </div>

          {/* Add-On Services */}
          <Card className="bg-[#1A1B1E] border-amber-600/30 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-12 w-12 text-amber-400" />
              <h3 className="text-2xl font-bold text-white">🛡️ Add-On Services</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Dark Web Leak Monitoring</h4>
                    <p className="text-sm text-gray-300">Get notified if your name, photos, or documents appear on black market sites</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">AI Disinfo Watchdog</h4>
                    <p className="text-sm text-gray-300">Find out if hostile LLMs (like ChatGPT clones) are referencing you unfairly</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Family Reputation Package</h4>
                    <p className="text-sm text-gray-300">Protect your children or family members across online platforms</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Full Service Takedowns</h4>
                    <p className="text-sm text-gray-300">We do the work — no forms or back-and-forth with platforms</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "ARIA's intelligence platform helped us identify and neutralize a coordinated attack before it reached mainstream media. Their proactive approach saved our IPO.",
                author: "Sarah Chen",
                role: "Chief Communications Officer",
                company: "Fortune 500 Technology Company"
              },
              {
                quote: "The depth of their analysis and speed of response is unmatched. They don't just monitor - they predict and prevent. Essential for any serious organization.",
                author: "Michael Rodriguez",
                role: "Head of Corporate Affairs", 
                company: "Global Financial Services"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-[#111214] border-gray-800 p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-20 px-6 bg-[#111214]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Reputation?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Get a comprehensive assessment of your digital risk profile. 
            Our experts will identify vulnerabilities and provide a strategic roadmap.
          </p>
          
          <Card className="max-w-md mx-auto bg-[#1A1B1E] border-gray-800 p-8">
            <h3 className="text-xl font-bold mb-6 text-amber-400">Request Your Assessment</h3>
            <form onSubmit={handleScanRequest} className="space-y-4">
              <Input
                placeholder="Full Name"
                className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
              />
              <Input
                type="email"
                placeholder="Corporate Email"
                className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
              />
              <Input
                placeholder="Company"
                className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
              />
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-semibold py-3"
              >
                Get Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-4">
              Confidential • Secure • Professional
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                  alt="A.R.I.A Logo" 
                  className="h-24 w-auto"
                />
              </div>
              <p className="text-gray-400">
                Advanced Reputation Intelligence & Analysis
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Threat Detection</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Crisis Management</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Intelligence Reports</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/simon-lindsay" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Access</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/admin/login" className="hover:text-white transition-colors">Admin Login</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 A.R.I.A™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
