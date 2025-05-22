
import React, { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/hooks/useAuth";
import StickyHeader from "@/components/layout/StickyHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import EnhancedTestimonialsSection from "@/components/sections/EnhancedTestimonialsSection";
import EnhancedCTASection from "@/components/sections/EnhancedCTASection";
import PlatformsSection from "@/components/sections/PlatformsSection";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";
import LeadMagnetForm from "@/components/lead-magnet/LeadMagnetForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const SalesFunnelPage = () => {
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
        <AdminDashboardWelcome />
      </PublicLayout>
    );
  }

  // For public users, show the landing page with proper navigation
  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      {/* Use the StickyHeader component for consistent navigation */}
      <StickyHeader isScrolled={isScrolled} />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Platforms We Monitor */}
      <PlatformsSection />

      {/* Enhanced Testimonials */}
      <EnhancedTestimonialsSection />

      {/* Lead Magnet Section */}
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-premium-black">
                Get Your FREE AI Risk Assessment
              </h2>
              <p className="text-premium-gray mb-6">
                Discover how AI can be used against you and what you can do to protect yourself with our comprehensive guide:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Identify AI-generated threats to your reputation</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Learn how deepfakes and synthetic media can impact you</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Get a 7-step action plan to protect your digital identity</span>
                </li>
              </ul>
              
              <div className="mt-4">
                <Button asChild variant="outline" className="text-premium-gray">
                  <Link to="/resources" className="flex items-center">
                    Browse more free resources <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <LeadMagnetForm
                title="Download Your Free AI Risk Assessment"
                description="Protect yourself from AI-powered reputation threats"
                downloadName="ai-risk-assessment-guide"
                ctaText="Get My Free Guide"
                variant="default"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <EnhancedCTASection />

      {/* CTA Form */}
      <ScanRequestForm />

      {/* Use the Footer component for consistent navigation */}
      <Footer />
    </div>
  );
};

export default SalesFunnelPage;
