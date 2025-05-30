
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
            Elite Reputation<br />
            Management
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A.R.I.A™ powered reputation defense for executives, influencers,<br />
            and high-net-worth individuals who demand sovereign-grade protection.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-black px-8 py-3 rounded-full text-lg font-medium">
            Secure Your Reputation
          </Button>
        </div>
      </section>

      {/* Client Logos */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
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

      {/* Powered by AI Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
              A.R.I.A™ Intelligence,<br />
              Expert Execution
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded">
                <div className="text-sm text-gray-400 mb-2">THREAT DETECTION ENGINE</div>
                <div className="h-24 bg-gray-800 rounded mb-2 flex items-center justify-center">
                  <span className="text-amber-500 font-mono">ARIA.SCAN_ACTIVE</span>
                </div>
                <div className="text-xs text-gray-500">Real-time monitoring across 50+ platforms</div>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Reputation Score</span>
                  <span className="text-2xl text-green-400">94.2</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-[94%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/54be2a4a-0be1-459c-b307-390e14873c37.png" 
              alt="Professional headshot" 
              className="w-80 h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-center">
            Sovereign-Grade Protection<br />
            <span className="text-amber-500">– Powered by A.R.I.A™</span>
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-4xl mx-auto text-center">
            A.R.I.A™ isn't just technology—it's your digital sovereignty. Whether you're facing coordinated attacks, legacy content suppression, or sophisticated disinformation campaigns, our intelligence-first approach delivers results that traditional PR firms simply cannot match.
          </p>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Executive Shield */}
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Executive Shield</h3>
              <p className="text-amber-400 mb-4 font-medium">For: C-Suite executives, board members, high-profile entrepreneurs</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-white">Advanced Protection:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Board-level threat briefings and crisis simulation</li>
                  <li>• Pre-emptive narrative construction via CEREBRA™</li>
                  <li>• Dark web monitoring for executive targeting</li>
                  <li>• Coordinated response across legal, PR, and digital channels</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Strategic Value:</h4>
                <p className="text-gray-300">Your reputation is your company's reputation. One viral moment shouldn't define decades of leadership.</p>
              </div>
            </Card>

            {/* Influencer Armor */}
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Influencer Armor</h3>
              <p className="text-amber-400 mb-4 font-medium">For: Content creators, public figures, thought leaders</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-white">Real-Time Defense:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Platform-specific crisis protocols for TikTok, YouTube, Twitter</li>
                  <li>• Fan base sentiment analysis and early warning systems</li>
                  <li>• Counter-narrative deployment within golden hours</li>
                  <li>• Brand partnership protection and stakeholder communication</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Why It Matters:</h4>
                <p className="text-gray-300">Cancel culture moves fast. A.R.I.A™ moves faster—detecting threats before they viral and deploying countermeasures in real-time.</p>
              </div>
            </Card>

            {/* Legacy Suppression */}
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-3xl mb-4">🗄️</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Legacy Suppression</h3>
              <p className="text-amber-400 mb-4 font-medium">For: Anyone with historical digital baggage</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-white">Deep Cleaning:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• GRAVEYARD™ protocol for legacy content burial</li>
                  <li>• Search engine result manipulation and optimization</li>
                  <li>• Archive and cache removal across global CDNs</li>
                  <li>• Legal pathway analysis for content takedowns</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">The Promise:</h4>
                <p className="text-gray-300">Your past doesn't define your future. We ensure that only the reputation you choose to project reaches your stakeholders.</p>
              </div>
            </Card>
          </div>

          {/* Add-On Services */}
          <Card className="bg-gray-900 border-gray-800 p-8">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-2xl font-semibold mb-6 text-white">Elite Add-On Services</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Emergency Strike Capability</h4>
                <p className="text-gray-300">24/7 rapid response team for crisis situations requiring immediate intervention</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Predictive Threat Analysis</h4>
                <p className="text-gray-300">PRAXIS™ behavioral modeling to anticipate threats before they materialize</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Counter-Intelligence Operations</h4>
                <p className="text-gray-300">Active monitoring and disruption of coordinated attack campaigns</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Family Protection Package</h4>
                <p className="text-gray-300">Extend A.R.I.A™ protection to family members and close associates</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 leading-tight">
            Trusted by Leaders<br />
            Who Demand Results
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-black font-bold">SC</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Sarah Chen</h3>
                  <p className="text-sm text-gray-400">Fortune 500 CEO</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"A.R.I.A™ detected and neutralized a coordinated disinformation campaign targeting our IPO. The sophistication of their intelligence gathering is unmatched."</p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Marcus Rodriguez</h3>
                  <p className="text-sm text-gray-400">Tech Entrepreneur (4.2M followers)</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"When a deep fake video threatened to destroy my personal brand, A.R.I.A™ had it contained and discredited within hours. They saved my company."</p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-bold">AL</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Alexandra Laurent</h3>
                  <p className="text-sm text-gray-400">Investment Fund Partner</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"The GRAVEYARD™ protocol completely eliminated 15 years of negative search results. It's like having a time machine for your reputation."</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Investment Tiers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-2">Executive</h3>
              <p className="text-3xl font-bold mb-6 text-amber-500">£15,000<span className="text-lg text-gray-400">/month</span></p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li>• Real-time monitoring across 50+ platforms</li>
                <li>• Monthly threat intelligence briefings</li>
                <li>• Standard response protocols</li>
                <li>• Basic GRAVEYARD™ suppression</li>
              </ul>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black">
                Secure Executive Protection
              </Button>
            </Card>
            
            <Card className="bg-gray-900 border-amber-500 border-2 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</span>
              </div>
              <h3 className="text-2xl font-light mb-2">Sovereign</h3>
              <p className="text-3xl font-bold mb-6 text-amber-500">£35,000<span className="text-lg text-gray-400">/month</span></p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li>• Everything in Executive</li>
                <li>• CEREBRA™ predictive threat modeling</li>
                <li>• 24/7 emergency strike capability</li>
                <li>• Advanced counter-intelligence operations</li>
                <li>• Full GRAVEYARD™ protocol deployment</li>
              </ul>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black">
                Deploy Sovereign Defense
              </Button>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-2">Enterprise</h3>
              <p className="text-3xl font-bold mb-6 text-amber-500">Custom</p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li>• Everything in Sovereign</li>
                <li>• Multi-executive protection packages</li>
                <li>• Corporate reputation defense</li>
                <li>• Board-level strategic consultation</li>
                <li>• Custom A.R.I.A™ module development</li>
              </ul>
              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                Discuss Enterprise Needs
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 border-t border-gray-800 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Your Reputation.<br />
            <span className="text-amber-500">Your Rules.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the ranks of leaders who refuse to leave their legacy to chance.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-black px-12 py-4 text-xl font-medium rounded-full">
            Begin Your Protection
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SalesFunnelPage;
