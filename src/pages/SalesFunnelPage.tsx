
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/ui/logo";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo variant="default" size="md" />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Protect Your
                <br />
                <span className="text-blue-600">Digital</span> Reputation
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Advanced AI monitoring and threat detection to safeguard your online presence before damage occurs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Free Scan
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 px-8 py-4 text-lg">
                  Learn More
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-gray-600 text-sm">5.0 Rating</span>
                </div>
                <div className="text-gray-600 text-sm">
                  <span className="font-semibold">1000+</span> Protected Clients
                </div>
                <div className="text-gray-600 text-sm">
                  <span className="font-semibold">24/7</span> Monitoring
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8">
                <img 
                  src="/lovable-uploads/54be2a4a-0be1-459c-b307-390e14873c37.png" 
                  alt="Professional consultation" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How We Protect Your Reputation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform monitors, analyzes, and responds to threats across the entire digital landscape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Monitoring</h3>
              <p className="text-gray-600 mb-6">
                24/7 surveillance across social media, news sites, forums, and review platforms to catch threats early.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Social media tracking
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  News monitoring
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Review alerts
                </li>
              </ul>
            </Card>
            
            <Card className="bg-white p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600 mb-6">
                Advanced algorithms assess threat severity and recommend strategic response actions.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Sentiment analysis
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Risk scoring
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Impact prediction
                </li>
              </ul>
            </Card>
            
            <Card className="bg-white p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rapid Response</h3>
              <p className="text-gray-600 mb-6">
                Expert intervention and strategic content placement to neutralize threats quickly.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Crisis management
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Content suppression
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  SEO optimization
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Protection Level
            </h2>
            <p className="text-xl text-gray-600">
              Scalable solutions for individuals, executives, and enterprises.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white p-8 border border-gray-200 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">£299<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">For individuals and small businesses</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Basic monitoring across 10+ platforms
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Weekly threat reports
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Email alerts for high-risk threats
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Basic response guidance
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Card>
            
            <Card className="bg-blue-50 p-8 border-2 border-blue-200 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Executive</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">£899<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">For executives and public figures</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Comprehensive monitoring across 50+ platforms
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Real-time threat alerts
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Professional response management
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Crisis intervention support
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Monthly strategy consultations
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Card>
            
            <Card className="bg-white p-8 border border-gray-200 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">Custom</div>
                <p className="text-gray-600">For large organizations</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Unlimited platform monitoring
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Dedicated account manager
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  24/7 response team
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Custom integration options
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Advanced analytics dashboard
                </li>
              </ul>
              <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leaders Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white p-8 shadow-sm border border-gray-200">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic">
                "The early warning system caught a potential crisis before it could impact our brand. Their response was swift and professional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                  <p className="text-gray-600">Chief Executive Officer, TechCorp</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white p-8 shadow-sm border border-gray-200">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic">
                "Their AI monitoring system is incredibly sophisticated. We now have complete visibility into our digital reputation landscape."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Rodriguez</h4>
                  <p className="text-gray-600">Managing Partner, Global Ventures</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Protect Your Reputation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get started with a free risk assessment and see what threats are already out there.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Start Free Assessment
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo variant="light" size="md" className="mb-4" />
              <p className="text-gray-400">Advanced reputation protection powered by AI</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <div>Reputation Monitoring</div>
                <div>Crisis Management</div>
                <div>Threat Analysis</div>
                <div>Content Strategy</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-gray-400">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>GDPR Compliance</div>
                <div>Security</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
            © 2025 A.R.I.A™ — All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
