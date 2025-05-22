import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Shield, Bell, Search, Zap } from 'lucide-react';
import Logo from '@/components/ui/logo';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <header className="py-6 bg-white border-b border-premium-silver shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-premium-gray hover:text-premium-black transition-colors">Home</Link>
              <Link to="/about" className="text-premium-gray hover:text-premium-black transition-colors">About</Link>
              <Link to="/biography" className="text-premium-gray hover:text-premium-black transition-colors">Simon Lindsay</Link>
            </div>
            <Button asChild variant="default" className="bg-premium-black hover:bg-premium-black/90">
              <Link to="/scan">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-12 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">🛡️ Your Reputation Has a Plan Now</h1>
            <p className="text-xl text-premium-gray max-w-2xl mx-auto">
              Not everyone needs the same level of protection. Whether you're just watching your name or dealing with negative articles or viral posts, A.R.I.A™ adapts to your risk level.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* FREE TIER */}
            <Card className="border-gray-200 relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>FREE TIER</CardTitle>
                  <Search className="h-5 w-5 text-premium-gray" />
                </div>
                <CardDescription className="font-medium text-lg">Just Watching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-xl font-bold">£0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Best for:</h3>
                  <p className="text-premium-gray mb-4">Individuals or small brands who want peace of mind.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">You'll get:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>A weekly scan of your name or business</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>A monthly report with any mentions we find</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>An email if something serious pops up</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-premium-gray italic">📩 Think of it as your early warning system.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/scan">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* PRO TIER */}
            <Card className="border-premium-silver relative shadow-md">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-premium-black text-white text-sm py-1 px-3 rounded-full">
                Most Popular
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>PRO TIER</CardTitle>
                  <Bell className="h-5 w-5 text-premium-silver" />
                </div>
                <CardDescription className="font-medium text-lg">Active Monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-xl font-bold">£97-£297</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Best for:</h3>
                  <p className="text-premium-gray mb-4">Entrepreneurs, professionals, or businesses with visibility.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">You'll get:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>24/7 scanning of the internet (Google, Reddit, news, social)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>AI-powered threat scoring (what's serious, what's not)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Monthly reports with guidance on what to do</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Alerts sent straight to your inbox or Slack</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-premium-gray italic">📊 Smart reputation defense for people who can't afford surprises.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/payment">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* ELITE TIER */}
            <Card className="border-gray-300 bg-gradient-to-b from-white to-gray-50 relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ELITE TIER</CardTitle>
                  <Shield className="h-5 w-5 text-premium-black" />
                </div>
                <CardDescription className="font-medium text-lg">Full Suppression + Support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-xl font-bold">£997+</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Best for:</h3>
                  <p className="text-premium-gray mb-4">Public figures, high-profile businesses, or anyone under fire.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">You'll get:</h3>
                  <p className="text-premium-gray mb-2">Everything in PRO — plus:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Hands-on help with removing or burying bad content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Custom blog/SEO/PR campaigns to push threats off Google</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>1-on-1 support under NDA</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-premium-gray italic">🧨 This is crisis management with intelligence-grade tools.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full border-premium-black text-premium-black hover:bg-premium-black hover:text-white">
                  <Link to="/scan">Contact Us</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* BONUS OFFER */}
          <Card className="border-dashed border-2 border-premium-silver max-w-2xl mx-auto">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" /> One-Time Scan (Optional)
                </CardTitle>
              </div>
              <CardDescription className="font-medium">Want to try it first?</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="font-bold mb-3">📍 A.R.I.A™ Threat Audit – £49</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Full scan of your name, brand, or business</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI risk score + recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Delivered to your inbox in 24–48 hours</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/scan">Get Your Report</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Final CTA */}
          <div className="text-center mt-16 bg-gray-50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to protect your name before it's too late?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Button asChild size="lg" className="bg-premium-black hover:bg-premium-black/90">
                <Link to="/scan">Book a Free Scan</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-premium-black text-premium-black hover:bg-premium-black hover:text-white">
                <Link to="/scan">Schedule 1-on-1 Call</Link>
              </Button>
            </div>
          </div>
        </div>
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
              <Link to="/privacy-policy" className="text-premium-silver hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/disclaimer" className="text-premium-silver hover:text-white transition-colors">Disclaimer</Link>
              <Link to="/gdpr-compliance" className="text-premium-silver hover:text-white transition-colors">GDPR Compliance</Link>
              <Link to="/auth" className="text-premium-silver hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div className="border-t border-premium-darkGray pt-8 mt-8">
            <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
