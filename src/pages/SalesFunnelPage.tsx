
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Bug, Scale, Search, Menu, X } from 'lucide-react';
import Logo from '@/components/ui/logo';
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const SalesFunnelPage = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* STICKY NAVIGATION */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-premium-black/90 shadow-lg backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center">
              <Logo variant={isScrolled ? "light" : "default"} size="sm" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/" className={`${navigationMenuTriggerStyle()} ${isScrolled ? 'text-white hover:text-premium-silver' : ''}`}>
                      Home
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/about" className={`${navigationMenuTriggerStyle()} ${isScrolled ? 'text-white hover:text-premium-silver' : ''}`}>
                      About
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <a href="#how-it-works" className={`${navigationMenuTriggerStyle()} ${isScrolled ? 'text-white hover:text-premium-silver' : ''}`}>
                      How It Works
                    </a>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/biography" className={`${navigationMenuTriggerStyle()} ${isScrolled ? 'text-white hover:text-premium-silver' : ''}`}>
                      Simon Lindsay
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <Button asChild size="sm" className="ml-4">
                <Link to="/dashboard">Scan My Name Now</Link>
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-premium-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-white' : ''}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-white' : ''}`} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-premium-black/95 backdrop-blur-sm">
            <nav className="container mx-auto px-6 py-4">
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    className="block text-white hover:text-premium-silver transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="block text-white hover:text-premium-silver transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a 
                    href="#how-it-works" 
                    className="block text-white hover:text-premium-silver transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link 
                    to="/biography" 
                    className="block text-white hover:text-premium-silver transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Simon Lindsay
                  </Link>
                </li>
                <li className="pt-4">
                  <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/dashboard">Scan My Name Now</Link>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* SECTION 1: HERO / HEADLINE */}
      <section className="hero bg-gradient-to-r from-premium-black to-premium-darkGray text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo variant="light" size="10x" className="mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight text-shadow-lg text-center">
            Your Reputation Is Under <span className="text-premium-silver">Surveillance</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed text-gray-300 text-center">
            A.R.I.A™ monitors, protects, and restores your digital reputation — using artificial intelligence built from real-world experience.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="bg-white text-premium-black px-8 py-7 text-lg font-semibold rounded-md shadow-lg hover:bg-premium-silver transition-all duration-300 hover:shadow-xl">
              <a href="#get-started" className="flex items-center gap-2">
                Start Your Reputation Scan <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="problem bg-gray-100 py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-premium-black">One Post Can Wreck Everything</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-16 text-premium-gray">
            Whether it's a tweet, a review, or a hit piece — your name online shapes your future. Most people discover the damage when it's too late.
            <span className="block mt-2 font-semibold text-premium-darkGray">A.R.I.A™ changes that.</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
              <div className="bg-red-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Bug className="h-8 w-8 text-premium-silver" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Viral Complaints</h3>
              <p className="text-premium-gray">Flagged & suppressed before they can spread</p>
            </div>
            <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Scale className="h-8 w-8 text-premium-silver" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Legal Threats</h3>
              <p className="text-premium-gray">Monitored & classified to reduce risk</p>
            </div>
            <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
              <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-8 w-8 text-premium-silver" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Google Results</h3>
              <p className="text-premium-gray">Buried & replaced with positive content</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works py-24 text-center bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-premium-black">How A.R.I.A™ Defends You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-premium-black text-white flex items-center justify-center font-bold text-xl">1</div>
              <div className="border-2 border-premium-lightSilver p-8 rounded-xl h-full shadow-md">
                <h3 className="text-xl font-bold mb-4 text-premium-darkGray">Scan & Detect</h3>
                <p className="text-premium-gray">A.R.I.A™ searches the web — news, social, forums — for any mention of your name or brand.</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-premium-black text-white flex items-center justify-center font-bold text-xl">2</div>
              <div className="border-2 border-premium-lightSilver p-8 rounded-xl h-full shadow-md">
                <h3 className="text-xl font-bold mb-4 text-premium-darkGray">Analyze & Score</h3>
                <p className="text-premium-gray">Mentions are AI-scored for severity, category, and urgency — instantly.</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-premium-black text-white flex items-center justify-center font-bold text-xl">3</div>
              <div className="border-2 border-premium-lightSilver p-8 rounded-xl h-full shadow-md">
                <h3 className="text-xl font-bold mb-4 text-premium-darkGray">Suppress & Repair</h3>
                <p className="text-premium-gray">We push down damaging links, publish optimized content, and notify you in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PLATFORMS WE MONITOR */}
      <section className="platforms-section bg-gray-50 py-20 text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold mb-12 text-premium-darkGray">Platforms We Monitor</h3>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 max-w-5xl mx-auto">
            {/* Platform logos */}
            <div className="flex items-center justify-center h-12">
              <svg className="h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
              </svg>
            </div>
            <div className="flex items-center justify-center h-12">
              <svg className="h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z"/>
              </svg>
            </div>
            <div className="flex items-center justify-center h-12">
              <svg className="h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22,12c0,5.52-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2S22,6.48,22,12z M10.66,4.12C12.06,6.44,14.6,8,17.5,8c0.17,0,0.33-0.03,0.5-0.04C16.56,5.56,14.04,4,11.17,4C10.99,4,10.82,4.06,10.66,4.12z M6.5,16c-0.17,0-0.33,0.03-0.5,0.04C7.44,18.44,9.96,20,12.83,20c0.18,0,0.35-0.06,0.51-0.12C11.94,17.56,9.4,16,6.5,16z M8,12c0-0.55,0.45-1,1-1s1,0.45,1,1s-0.45,1-1,1S8,12.55,8,12z M12,12c0-0.55,0.45-1,1-1s1,0.45,1,1s-0.45,1-1,1S12,12.55,12,12z M16,12c0-0.55,0.45-1,1-1s1,0.45,1,1s-0.45,1-1,1S16,12.55,16,12z"/>
              </svg>
            </div>
            <div className="flex items-center justify-center h-12">
              <svg className="h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
            </div>
            <div className="flex items-center justify-center h-12">
              <svg className="h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div className="flex items-center justify-center h-12">
              <svg className="h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.93 12.645h4.14c0 2.274-1.863 4.138-4.14 4.138-2.276 0-4.138-1.863-4.138-4.138s1.863-4.14 4.138-4.14a4.13 4.13 0 0 1 2.916 1.223l1.416-1.424A5.957 5.957 0 0 0 9.93 6.484c-3.403 0-6.162 2.76-6.162 6.162S6.527 18.81 9.93 18.81c3.403 0 6.162-2.76 6.162-6.163h-6.162v-2.002ZM20.642 12.645h-2.007l-.023 2.008h-2.003v-2.008h-2.003v-2.003h2.003V8.637h2.003v2.005h2.007"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SOCIAL PROOF */}
      <section className="testimonials bg-gray-100 py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-premium-black">Real Recovery. Real People.</h2>
          <p className="text-lg md:text-xl mb-16 max-w-xl mx-auto text-premium-gray">
            We've helped founders, influencers, and businesses clear their name and reclaim their future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="premium-card p-8 rounded-xl">
              <div className="mb-6">
                <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-6 text-premium-gray italic">"ARIA helped bury 3 negative articles that haunted my business for years."</p>
              <strong className="text-premium-darkGray font-medium">– Former Tech CEO</strong>
            </div>
            <div className="premium-card p-8 rounded-xl">
              <div className="mb-6">
                <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-6 text-premium-gray italic">"I got a call from a law firm. A.R.I.A™ flagged it before Google did."</p>
              <strong className="text-premium-darkGray font-medium">– Influencer, UK</strong>
            </div>
            <div className="premium-card p-8 rounded-xl">
              <div className="mb-6">
                <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-6 text-premium-gray italic">"This is the digital PR assistant I didn't know I needed."</p>
              <strong className="text-premium-darkGray font-medium">– Private Client</strong>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section id="get-started" className="cta premium-gradient text-white py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-shadow">Ready to Take Control of Your Reputation?</h2>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-premium-silver">
            Start with a free reputation scan and get your first threat report within 24 hours.
          </p>
          <div className="space-y-6">
            <Button asChild size="lg" className="bg-white text-premium-black px-12 py-7 text-lg font-bold rounded-md shadow-lg hover:bg-premium-silver hover:shadow-xl transition-all duration-300">
              <Link to="/dashboard">Scan My Name Now</Link>
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-green-400" />
                <span>Free initial scan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-green-400" />
                <span>24/7 monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="bg-premium-black text-premium-silver py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <Logo variant="light" size="md" />
            </div>
            <div className="flex space-x-8">
              <Link to="/about" className="text-premium-silver hover:text-white transition-colors">About</Link>
              <Link to="/biography" className="text-premium-silver hover:text-white transition-colors">Simon Lindsay</Link>
              <Link to="/auth" className="text-premium-silver hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div className="border-t border-premium-darkGray pt-8 mt-8">
            <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
            <p className="mt-2">Built with integrity by Simon Lindsay</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
