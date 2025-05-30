
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo variant="default" size="md" />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
            <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl font-bold text-black mb-8 leading-tight">
                Build fast,
                <br />
                <span className="text-purple-600">ship faster</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                Create beautiful web applications in minutes, not months. Our AI-powered platform handles the complexity so you can focus on what matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full">
                  Start building for free
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 px-8 py-4 text-lg rounded-full hover:bg-gray-50">
                  View demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div>✓ No credit card required</div>
                <div>✓ 14-day free trial</div>
                <div>✓ Cancel anytime</div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 relative overflow-hidden">
                {/* Dashboard mockup */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-purple-100 rounded-lg"></div>
                      <div className="h-20 bg-blue-100 rounded-lg"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-600 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-600 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-black mb-6">
              Everything you need to ship
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to production in record time. Our platform provides all the tools and infrastructure you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white p-8 border-0 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">AI-Powered Development</h3>
              <p className="text-gray-600 mb-6">
                Write code faster with intelligent suggestions and automated optimizations.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Smart code completion
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Bug detection
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Performance optimization
                </li>
              </ul>
            </Card>
            
            <Card className="bg-white p-8 border-0 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Instant Deployment</h3>
              <p className="text-gray-600 mb-6">
                Deploy to production with a single click. No complex configuration required.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Global CDN
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Auto-scaling
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  SSL certificates
                </li>
              </ul>
            </Card>
            
            <Card className="bg-white p-8 border-0 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Team Collaboration</h3>
              <p className="text-gray-600 mb-6">
                Work together seamlessly with real-time collaboration and version control.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Real-time editing
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Comment system
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 text-green-500 mr-2">✓</span>
                  Branch management
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-black mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white p-8 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">Starter</h3>
                <div className="text-4xl font-bold text-black mb-4">$0<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">Perfect for side projects</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Up to 3 projects
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Community support
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Basic templates
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Standard deployment
                </li>
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-black text-white rounded-full">
                Get started
              </Button>
            </Card>
            
            <Card className="bg-purple-50 p-8 border-2 border-purple-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">Pro</h3>
                <div className="text-4xl font-bold text-black mb-4">$29<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">For growing teams</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Unlimited projects
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Priority support
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Premium templates
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Advanced deployment
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Team collaboration
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                Start free trial
              </Button>
            </Card>
            
            <Card className="bg-white p-8 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-black mb-4">Custom</div>
                <p className="text-gray-600">For large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Dedicated support
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  SLA guarantee
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                  On-premise deployment
                </li>
              </ul>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full">
                Contact sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-black mb-6">
              Loved by developers worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about their experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white p-8 border-0 shadow-sm">
              <div className="flex text-yellow-400 mb-6">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                "This platform has completely transformed how we build applications. What used to take weeks now takes days."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-black">Sarah Johnson</h4>
                  <p className="text-gray-600">Lead Developer at TechCorp</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white p-8 border-0 shadow-sm">
              <div className="flex text-yellow-400 mb-6">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                "The AI assistance is incredible. It's like having a senior developer pair programming with you 24/7."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-black">Michael Chen</h4>
                  <p className="text-gray-600">Founder at StartupXYZ</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to ship your next project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who are building faster with our platform.
          </p>
          <Button className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full">
            Start building for free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Logo variant="default" size="md" className="mb-4" />
              <p className="text-gray-600">Build beautiful applications faster than ever before.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-black mb-4">Product</h4>
              <div className="space-y-2 text-gray-600">
                <div>Features</div>
                <div>Pricing</div>
                <div>Documentation</div>
                <div>API Reference</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-black mb-4">Company</h4>
              <div className="space-y-2 text-gray-600">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-black mb-4">Resources</h4>
              <div className="space-y-2 text-gray-600">
                <div>Help Center</div>
                <div>Community</div>
                <div>Status</div>
                <div>Terms</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 pt-8 border-t border-gray-100">
            © 2025 Company Name — All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
