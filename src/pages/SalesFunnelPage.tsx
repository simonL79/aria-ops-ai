
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
            Elevate Your<br />
            Online Reputation
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Safeguard your brand, enhance your presence,<br />
            and transform your image with our comprehensive.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-black px-8 py-3 rounded-full text-lg font-medium">
            Request a Demo
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
              Powered by AI,<br />
              Delivered by Experts
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded">
                <div className="text-sm text-gray-400 mb-2">CALIFORNIA SATURN CO.</div>
                <div className="h-24 bg-gray-800 rounded mb-2"></div>
                <div className="text-xs text-gray-500">Forecast data</div>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Score</span>
                  <span className="text-2xl">576</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-3/4"></div>
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
            Reputation Management Services<br />
            <span className="text-amber-500">– Powered by A.R.I.A™</span>
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-4xl mx-auto text-center">
            A.R.I.A™ isn't just for celebrities, CEOs, or global brands. Reputation is personal — and everyone deserves protection. Whether you're facing online abuse, negative press, or algorithmic bias, we've built elite tools for every type of modern digital identity.
          </p>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Social Media Protection */}
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Social Media Protection</h3>
              <p className="text-amber-400 mb-4 font-medium">Ideal for: Everyday users, community leaders, students, professionals</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-white">What We Do:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Monitor threats and harmful mentions across platforms like X (Twitter), Reddit, TikTok, and Instagram</li>
                  <li>• Automatically suppress legacy content and untag past associations (via GRAVEYARD™ & EIDETIC™)</li>
                  <li>• Detect and counter disinformation campaigns in real time</li>
                  <li>• Send takedown notices for impersonation, defamation, or harassment</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Why It Matters:</h4>
                <p className="text-gray-300">Your digital footprint should reflect who you are today — not mistakes, rumors, or misinformation from years ago.</p>
              </div>
            </Card>

            {/* Influencer & Creator Shield */}
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-3xl mb-4">📣</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Influencer & Creator Reputation Shield</h3>
              <p className="text-amber-400 mb-4 font-medium">Ideal for: Influencers, streamers, YouTubers, TikTokers, OnlyFans creators, podcasters</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-white">What We Do:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Real-time crisis monitoring when your content goes viral — good or bad</li>
                  <li>• Predictive behavior alerts (via PRAXIS™) when followers or collaborators might trigger a brand issue</li>
                  <li>• AI bias analysis on what LLMs and search engines say about you</li>
                  <li>• Automated counter-narratives (via RSI™) to redirect harmful stories</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Why It Matters:</h4>
                <p className="text-gray-300">One viral moment shouldn't define your career. A.R.I.A™ helps you stay ahead of cancel culture, hate mobs, and false narratives.</p>
              </div>
            </Card>

            {/* Everyday People */}
            <Card className="bg-gray-900 border-gray-800 p-8">
              <div className="text-3xl mb-4">🧑‍💼</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Reputation Management for Everyday People</h3>
              <p className="text-amber-400 mb-4 font-medium">Ideal for: Teachers, nurses, founders, job-seekers, private citizens</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-white">What We Do:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Search engine cleanup of outdated or harmful results</li>
                  <li>• Threat detection from forums, dark web leaks, or local news</li>
                  <li>• Alerting when your name, address, or image resurfaces</li>
                  <li>• Automated legal rights enforcement (GDPR, CCPA, DSR)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Why It Matters:</h4>
                <p className="text-gray-300">You don't need to be "famous" to be vulnerable. If you've ever Googled yourself and felt uneasy, we're here for you.</p>
              </div>
            </Card>
          </div>

          {/* Add-On Services */}
          <Card className="bg-gray-900 border-gray-800 p-8">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-2xl font-semibold mb-6 text-white">Add-On Services</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Dark Web Leak Monitoring</h4>
                <p className="text-gray-300">Get notified if your name, photos, or documents appear on black market sites</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">AI Disinfo Watchdog</h4>
                <p className="text-gray-300">Find out if hostile LLMs (like ChatGPT clones) are referencing you unfairly</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Family Reputation Package</h4>
                <p className="text-gray-300">Protect your children or family members across online platforms</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-white">Full Service Takedowns</h4>
                <p className="text-gray-300">We do the work — no forms or back-and-forth with platforms</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 leading-tight">
            Real Stories,<br />
            Real Results
          </h2>
          <p className="text-gray-400 mb-12 max-w-md">
            Learn tri, myeer for regulator livelliae, duck, 
            positions, arerit tour and bellisair Lagos 
            maecenatio.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-white">Laura M.</h3>
                  <p className="text-sm text-gray-400">ENTREPRENEUR CONSULTATION AND PREV BOT...</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-white">Andrew R.</h3>
                  <p className="text-sm text-gray-400">STRATEGIC CONSULTANT MARKETING...</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-white">Sarah W.</h3>
                  <p className="text-sm text-gray-400">MARKETING VP PERSONAL RESPONSIBLE...</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-6">Private</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Professional plan</li>
                <li>• Consultation case</li>
                <li>• Contact us</li>
              </ul>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-6">Executive</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Professional plan</li>
                <li>• Consultation case</li>
                <li>• Contact us</li>
              </ul>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-6">Enterprise</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Professional plan</li>
                <li>• Consultation case</li>
                <li>• Contact us</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesFunnelPage;
