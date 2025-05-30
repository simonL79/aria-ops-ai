
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="md" />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Services</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <span className="text-gray-400 text-sm font-medium">A.R.I.A™</span>
              <p className="text-gray-300 mt-2">AI Reputation Intelligence Agent</p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-light mb-8 leading-tight">
              Elevate Your<br />
              <span className="text-orange-500">Digital</span> Reputation
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Protect and enhance your online presence with AI-powered reputation intelligence and monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-medium">
                Learn More
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full text-lg font-medium">
                Schedule to Protect
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/lovable-uploads/54be2a4a-0be1-459c-b307-390e14873c37.png" 
              alt="Professional headshot" 
              className="w-80 h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-400 mb-8 text-sm">Trusted by leading organizations</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div className="text-gray-400 font-light text-lg">Goldman<br />Sachs</div>
            <div className="text-gray-400 font-light text-lg">Deloitte.</div>
            <div className="text-gray-400 font-light text-lg flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400"></div>
              Microsoft
            </div>
            <div className="text-gray-400 font-light text-xl tracking-wider">HSBC</div>
            <div className="w-12 h-12 border border-gray-400 flex items-center justify-center">
              <span className="text-gray-400 font-bold">GM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Reputation Monitoring</h3>
              <p className="text-gray-300">Real-time monitoring of your digital footprint across all major platforms and news sources.</p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Threat Intelligence</h3>
              <p className="text-gray-300">Advanced AI-powered analysis to identify and assess potential reputation threats before they escalate.</p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Crisis Response</h3>
              <p className="text-gray-300">Rapid response protocols and strategic communication to protect your reputation during critical situations.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <p className="text-gray-300 italic mb-4">"A.R.I.A™ has transformed how we manage our digital reputation. The AI-powered insights are invaluable for our executive team."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Sarah Johnson</h4>
                  <p className="text-sm text-gray-400">CEO, TechCorp</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <p className="text-gray-300 italic mb-4">"The proactive monitoring and threat detection capabilities have saved us from multiple potential crises. Highly recommended."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Michael Chen</h4>
                  <p className="text-sm text-gray-400">CMO, Global Ventures</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">Get Started Today</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Ready to Protect Your Reputation?</h3>
              <p className="text-gray-300 mb-6">Contact us for a personalized consultation and discover how A.R.I.A™ can safeguard your digital presence.</p>
              <div className="space-y-2 text-gray-300">
                <p>📧 contact@aria-intelligence.com</p>
                <p>📞 +44 20 7946 0958</p>
                <p>🌍 London, United Kingdom</p>
              </div>
            </div>
            <Card className="bg-gray-900 border-gray-800 p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Name</label>
                  <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Email</label>
                  <input type="email" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Message</label>
                  <textarea rows={4} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"></textarea>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <Logo variant="light" size="md" />
          </div>
          <p className="text-gray-400">&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
