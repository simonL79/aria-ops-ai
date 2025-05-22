
import React, { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/hooks/useAuth";
import StickyHeader from "@/components/layout/StickyHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import PlatformsSection from "@/components/sections/PlatformsSection";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";

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

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* CTA Form */}
      <ScanRequestForm />

      {/* Use the Footer component for consistent navigation */}
      <Footer />
    </div>
  );
};

export default SalesFunnelPage;
