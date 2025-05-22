
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AdminWalkthrough from "@/components/home/AdminWalkthrough";
import HeroSection from "@/components/sections/HeroSection";
import PlatformsSection from "@/components/sections/PlatformsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ProblemSection from "@/components/sections/ProblemSection";
import CTASection from "@/components/sections/CTASection";

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

  // For public users, show the sales funnel landing page
  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic header that changes on scroll */}
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
      
      {/* Main content sections */}
      <main className="flex-grow">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <PlatformsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      {/* Footer */}
      <footer className="bg-premium-black text-white py-8 text-center">
        <div className="container mx-auto">
          <p>&copy; 2025 A.R.I.A.™ — All rights reserved</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="/privacy-policy" className="text-sm text-premium-silver hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-sm text-premium-silver hover:text-white">Terms of Service</a>
            <a href="/contact" className="text-sm text-premium-silver hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
