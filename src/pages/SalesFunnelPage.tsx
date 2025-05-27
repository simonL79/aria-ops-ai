
import React, { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/hooks/useAuth";
import StickyHeader from "@/components/layout/StickyHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import NOCFeaturesSection from "@/components/sections/NOCFeaturesSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import EnhancedTestimonialsSection from "@/components/sections/EnhancedTestimonialsSection";
import EnhancedCTASection from "@/components/sections/EnhancedCTASection";
import PlatformsSection from "@/components/sections/PlatformsSection";
import ReputationOpsCenterSection from "@/components/sections/ReputationOpsCenterSection";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";
import LeadMagnetForm from "@/components/lead-magnet/LeadMagnetForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, BookOpen } from "lucide-react";

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
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
      {/* Use the StickyHeader component for consistent navigation */}
      <StickyHeader isScrolled={isScrolled} />
      
      {/* Hero Section */}
      <HeroSection />

      {/* NOC Features Section */}
      <NOCFeaturesSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* How It Works */}
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      
      {/* Platforms We Monitor */}
      <PlatformsSection />

      {/* Reputation Ops Center Section */}
      <ReputationOpsCenterSection />

      {/* Enhanced Testimonials */}
      <EnhancedTestimonialsSection />

      {/* Lead Magnet Section */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-blue-900">
                Get Your FREE Threat Intelligence Briefing
              </h2>
              <p className="text-blue-700 mb-6">
                Discover how threat actors target your reputation and learn command center strategies to defend against them:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-blue-600 mt-1" />
                  <span className="text-blue-700">Build your personal threat intelligence NOC</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-blue-600 mt-1" />
                  <span className="text-blue-700">Learn case threading and triage methodologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-blue-600 mt-1" />
                  <span className="text-blue-700">Get operator-level response playbooks</span>
                </li>
              </ul>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                  <Link to="/resources" className="flex items-center">
                    Browse resources <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                  <Link to="/blog" className="flex items-center">
                    Read our blog <BookOpen className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <LeadMagnetForm
                title="Download Your Free Threat Intelligence Briefing"
                description="Command center strategies for reputation defense"
                downloadName="threat-intelligence-briefing"
                ctaText="Get My Briefing"
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
