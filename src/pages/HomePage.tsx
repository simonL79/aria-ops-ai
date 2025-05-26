
import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ProblemSection from '@/components/sections/ProblemSection';
import PlatformsSection from '@/components/sections/PlatformsSection';
import EnhancedTestimonialsSection from '@/components/sections/EnhancedTestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import EnhancedCTASection from '@/components/sections/EnhancedCTASection';
import PublicLayout from '@/components/layout/PublicLayout';

const HomePage = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <PlatformsSection />
      <EnhancedTestimonialsSection />
      <CTASection />
      <EnhancedCTASection />
    </PublicLayout>
  );
};

export default HomePage;
