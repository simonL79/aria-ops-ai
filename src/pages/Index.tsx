
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HeroSection from '@/components/sections/HeroSection';
import NOCFeaturesSection from '@/components/sections/NOCFeaturesSection';
import ProblemSection from '@/components/sections/ProblemSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import PlatformsSection from '@/components/sections/PlatformsSection';
import ReputationOpsCenterSection from '@/components/sections/ReputationOpsCenterSection';
import EnhancedCTASection from '@/components/sections/EnhancedCTASection';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <HeroSection />
        <NOCFeaturesSection />
        <ProblemSection />
        <HowItWorksSection />
        <PlatformsSection />
        <ReputationOpsCenterSection />
        <EnhancedCTASection />
      </div>
    </DashboardLayout>
  );
};

export default Index;
