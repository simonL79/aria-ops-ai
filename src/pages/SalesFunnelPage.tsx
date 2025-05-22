
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AdminWalkthrough from "@/components/home/AdminWalkthrough";

const SalesFunnelPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If authenticated, show admin dashboard walkthrough
  if (isAuthenticated) {
    return (
      <PublicLayout>
        <div className="container max-w-screen-xl mx-auto py-12">
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                Welcome to A.R.I.A™ Admin Dashboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Follow this walkthrough guide to manage your clients' reputation,
                analyze threats, and deliver actionable insights.
              </p>
            </div>
            
            <AdminWalkthrough />
            
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="action"
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="shadow-lg"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/clients")}
              >
                Manage Clients
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // For public users, show the new landing page design
  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-premium-black/90 shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-bold text-xl text-white">A.R.I.A.™</span>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white border-white hover:bg-white/10"
                onClick={() => navigate("/auth")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="text-center py-24 pt-32 bg-gradient-to-b from-gray-900 to-black">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Scan Me. Fix Me. Forget Me Not.</h1>
        <p className="text-lg mb-8 max-w-xl mx-auto">A.R.I.A™ scans your online reputation before the internet ruins it.</p>
        <Button 
          asChild
          variant="action" 
          size="lg" 
          className="px-8 py-7 text-lg"
        >
          <a href="#scan-form">Start My Free Scan</a>
        </Button>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 md:px-24 bg-gray-800 text-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Google never forgets — but now, you don't have to either.</h2>
          <p className="text-lg">Old articles, buried posts, forum rumors — they all still rank. A.R.I.A™ finds what others see.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 md:px-24 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">How A.R.I.A™ Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50">
              <h3 className="font-bold text-xl mb-2">1. Scan</h3>
              <p>We search across web, news, forums & social.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50">
              <h3 className="font-bold text-xl mb-2">2. Classify</h3>
              <p>We identify threats, fake profiles, & negative press.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50">
              <h3 className="font-bold text-xl mb-2">3. Respond</h3>
              <p>You get alerts, strategies & AI-crafted responses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section id="scan-form" className="bg-blue-600 py-16 px-6 md:px-8 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Request Your Free A.R.I.A™ Scan</h2>
          <form className="max-w-xl mx-auto space-y-4">
            <input className="w-full p-3 rounded" type="text" placeholder="Your Full Name" required />
            <input className="w-full p-3 rounded" type="email" placeholder="Your Email Address" required />
            <Button 
              type="submit" 
              className="w-full bg-black text-white font-semibold py-6 rounded hover:bg-gray-800"
            >
              SCAN ME
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-center text-sm text-gray-400 mt-auto">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} A.R.I.A™ Reputation Intelligence. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Service</a>
            <a href="/contact" className="hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
