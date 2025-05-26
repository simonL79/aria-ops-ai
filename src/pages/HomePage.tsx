
import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import NOCFeaturesSection from '@/components/sections/NOCFeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ProblemSection from '@/components/sections/ProblemSection';
import PlatformsSection from '@/components/sections/PlatformsSection';
import ReputationOpsCenterSection from '@/components/sections/ReputationOpsCenterSection';
import EnhancedTestimonialsSection from '@/components/sections/EnhancedTestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import EnhancedCTASection from '@/components/sections/EnhancedCTASection';
import PublicLayout from '@/components/layout/PublicLayout';

const HomePage = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <NOCFeaturesSection />
      <ProblemSection />
      <HowItWorksSection />
      <PlatformsSection />
      <ReputationOpsCenterSection />
      <EnhancedTestimonialsSection />
      <CTASection />
      <EnhancedCTASection />
    </PublicLayout>
  );
};

export default HomePage;
