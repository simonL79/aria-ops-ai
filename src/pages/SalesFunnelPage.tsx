
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
      <header className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Logo variant="light" size="md" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-light mb-8 leading-tight">
              Elevate Your<br />
              <span className="text-orange-500">Digital</span> Reputation
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
              Enterprise-grade reputation intelligence and crisis prevention. Powered by AI, delivered by experts who understand the stakes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md text-lg font-medium">
                Learn More
              </Button>
            </div>
            
            {/* Client Feedback */}
            <div className="space-y-4">
              <div className="text-sm text-gray-400">CLIENT FEEDBACK IN 72 HOURS</div>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
              <div className="text-sm text-gray-300">
                15 five-star Google Rating
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="flex text-blue-400">
                  {"★".repeat(5)}
                </div>
              </div>
              <div className="text-sm text-gray-300">
                Trustpilot score
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end relative">
            <img 
              src="/lovable-uploads/54be2a4a-0be1-459c-b307-390e14873c37.png" 
              alt="Professional headshot" 
              className="w-80 h-80 object-cover rounded-lg"
            />
            <Button className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md">
              Schedule to Protect
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted Across Industries */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-8">Trusted Across Industries</p>
          <div className="grid grid-cols-5 gap-8 items-center opacity-60">
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-gray-400 text-sm">Government Relations</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-gray-400 text-sm">Professional Services</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-gray-400 text-sm">Technology</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-gray-400 text-sm">Financial Services</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-gray-400 text-sm">Healthcare</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reputation Management Services */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-4">Reputation Management Services – Powered by A.R.I.A™</h2>
          <p className="text-center text-gray-300 mb-16 max-w-4xl mx-auto">
            A.R.I.A™ isn't just for celebrities, CEOs, or royal brands. Reputation is personal — and everyone deserves protection. Whether you're facing career issues, negative press, or algorithmic bias, we've built elite tools for every type of modern digital identity.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-orange-500 text-2xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Social Media Protection</h3>
              <p className="text-gray-300 text-sm mb-6">Real-time threat scan across all online platforms for celebrity & top executives</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Monitor direct mentions of the top celebrities</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Smart celebrity track up to our enterprise</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Extract performance with social media</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Crisis intervention and data intervention</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Starting From</div>
                <div className="text-orange-500 font-bold">£299/month</div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-orange-500 text-2xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Influencer & Creator</h3>
              <p className="text-gray-300 text-sm mb-6">Real-time influencer tracking & solution, focused, integrated business-focused</p>
              
              <div className="space-y-2 text-sm">
                <div className="text-white font-semibold mb-2">What We Do</div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Real-time mentions monitoring</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Positive internet articles on A.R.I.A™</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>AI love social content templates</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Automated content creation to SERP</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Book Now</div>
                <div className="text-orange-500 font-bold">£150 total fees</div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-orange-500 text-2xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Everyday People Protection</h3>
              <p className="text-gray-300 text-sm mb-6">Built for CEO, celebrities, influencers, job seekers & other modern professionals</p>
              
              <div className="space-y-2 text-sm">
                <div className="text-white font-semibold mb-2">What We Do</div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Guard your professional or personal brand</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Monitor brand image to defend against</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Relevant new social media management</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✓</span>
                  <span>Assign content by our brand reputation</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Starting From</div>
                <div className="text-orange-500 font-bold">£15/month</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Ready to Get Started */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">Get a personalised assessment of your digital risk profile and strategic roadmap</p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md text-lg font-medium">
            Schedule a Risk Assessment
          </Button>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="text-orange-500 text-xl mr-3">🔧</div>
            <h2 className="text-2xl font-light">Add-On Services</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Dark Web Leak Monitoring</h3>
              <p className="text-gray-300 text-sm mb-4">Get notified if your name, phone, or email is sold in online crime sites or leaked data</p>
              
              <h3 className="font-semibold mb-2">AI Courts Monitoring</h3>
              <p className="text-gray-300 text-sm">Use AI to track online court records or to find a legal ruling which might be in your interests</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Family Reputation Package</h3>
              <p className="text-gray-300 text-sm mb-4">Protect and track your family members with intelligent solutions</p>
              
              <h3 className="font-semibold mb-2">Full Service Takedowns</h3>
              <p className="text-gray-300 text-sm">We do the heavy lifting by filing legal takedown or due to fraudulent takedown platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Clients Say */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-16">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-300 italic mb-4">"ARIA development platform helped us identify and understand a coordinated attack before it reached mainstream media. Their proactive approach saved our organisation."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Sarah Chen</h4>
                  <p className="text-sm text-gray-400">Chief Communications Officer</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-300 italic mb-4">"The depth of their analysis and speed of response is remarkable. They don't just find threats - they provide context for any serious organisation."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-400">Partner at Global Ventures</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Ready to Secure Your Reputation */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-4">Ready to Secure Your Reputation?</h2>
          <p className="text-gray-300 mb-12">Get a comprehensive assessment of your digital risk profile. Our experts will identify vulnerabilities and provide a strategic roadmap.</p>
          
          <Card className="bg-gray-900 border-gray-800 p-8 max-w-md mx-auto">
            <h3 className="text-orange-500 font-semibold mb-6">Request Your Assessment</h3>
            <form className="space-y-4">
              <div>
                <input type="text" placeholder="Full Name" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
              </div>
              <div>
                <input type="email" placeholder="Corporate Email" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
              </div>
              <div>
                <input type="text" placeholder="Company" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium">
                Get Assessment
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-4">Confidential and secure</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo variant="light" size="md" className="mb-4" />
              <p className="text-gray-400 text-sm">Advanced Reputation Intelligence Agent</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Digital Detection</div>
                <div>Risk Management</div>
                <div>Intelligence Reports</div>
                <div>Crisis Response</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Access</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Admin Login</div>
                <div>Client Portal</div>
                <div>API Service</div>
                <div>Get Started</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-800">
            © 2025 A.R.I.A™ — All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
