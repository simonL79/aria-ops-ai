
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Choose Your Reputation Protection Plan</h1>
            <p className="text-xl text-premium-gray max-w-2xl mx-auto">
              From basic monitoring to full-scale defense, we have a solution for every need and budget.
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
                <CardDescription className="font-medium text-lg">"Watch & Wait"</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-xl font-bold">£0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Who it's for:</h3>
                  <p className="text-premium-gray mb-4">People who just want to quietly monitor their name or brand and see what's out there.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">What you get:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Scans your name or brand once a week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Alerts you if something serious shows up</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>One simple report sent monthly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>No tools or responses — just awareness</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Good if you're:</h3>
                  <p className="text-premium-gray">New to this, on a budget, or just curious what's online about you.</p>
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
                <CardDescription className="font-medium text-lg">"Monitor & Manage"</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-xl font-bold">£97-£297</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Who it's for:</h3>
                  <p className="text-premium-gray mb-4">Business owners, public figures, or professionals who need real-time alerts and basic protection.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">What you get:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>24/7 scanning of Google, social media, news, Reddit, etc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>A.R.I.A™ uses AI to rate how serious each mention is</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Email alerts when something needs action</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Monthly strategy reports (what's changed, what to fix)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Advice on how to respond or what content to create to push bad links down</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Good if you're:</h3>
                  <p className="text-premium-gray">Actively building your brand and want to stay ahead of threats.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/scan">Get Started</Link>
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
                <CardDescription className="font-medium text-lg">"Defend & Suppress"</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-xl font-bold">£997+</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Who it's for:</h3>
                  <p className="text-premium-gray mb-4">People in the public eye, high-risk businesses, or anyone with bad press, viral posts, or serious defamation to handle.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">What you get:</h3>
                  <p className="text-premium-gray mb-2">Everything in PRO — plus:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Direct access to our private response team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Custom content creation to bury negative links (blogs, SEO, videos, PR)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Help removing or reporting harmful content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Suppression strategies and timelines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Dark web/pastebin scanning if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Full confidentiality + NDA</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Good if you're:</h3>
                  <p className="text-premium-gray">Dealing with active threats or rebuilding after bad press, legal issues, or cancellation.</p>
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
                  <Zap className="h-5 w-5 text-amber-500" /> BONUS OFFER
                </CardTitle>
              </div>
              <CardDescription className="font-medium">One-Time "Scan & Report" (£49–£99)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-premium-gray">
                A full audit of your name or brand — what's out there, what it means, and how to fix it — no subscription needed.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/scan">Get Your Report</Link>
              </Button>
            </CardFooter>
          </Card>
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
