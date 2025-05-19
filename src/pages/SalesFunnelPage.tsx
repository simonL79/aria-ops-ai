
import React, { useState, useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import StickyHeader from '@/components/layout/StickyHeader';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import PlatformsSection from '@/components/sections/PlatformsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/layout/Footer';

const SalesFunnelPage = () => {
  const isMobile = useIsMobile();
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
    <div className="min-h-screen bg-premium-silver/10">
      {/* STICKY NAVIGATION */}
      <StickyHeader isScrolled={isScrolled} />

      {/* SECTION 1: HERO / HEADLINE */}
      <HeroSection />

      {/* SECTION 2: THE PROBLEM */}
      <ProblemSection />

      {/* SECTION 3: HOW IT WORKS */}
      <HowItWorksSection />

      {/* SECTION: PLATFORMS WE MONITOR */}
      <PlatformsSection />

      {/* SECTION 4: SOCIAL PROOF */}
      <TestimonialsSection />

      {/* SECTION 5: CALL TO ACTION */}
      <CTASection />

      {/* SECTION 6: FOOTER */}
      <Footer />
    </div>
  );
};

export default SalesFunnelPage;
