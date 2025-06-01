
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import NOCFeaturesSection from '@/components/sections/NOCFeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ProblemSection from '@/components/sections/ProblemSection';
import PlatformsSection from '@/components/sections/PlatformsSection';
import ReputationOpsCenterSection from '@/components/sections/ReputationOpsCenterSection';
import EnhancedTestimonialsSection from '@/components/sections/EnhancedTestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import EnhancedCTASection from '@/components/sections/EnhancedCTASection';

const HomePage = () => {
  return (
    <div className="bg-corporate-dark text-white min-h-screen" style={{ backgroundColor: '#0A0B0D', color: '#F9FAFB' }}>
      <PageLayout title="A.R.I.A™ - AI Reputation Intelligence Agent" className="bg-corporate-dark">
        <PublicLayout>
          <div className="bg-corporate-dark text-white">
            <HeroSection />
            <NOCFeaturesSection />
            <ProblemSection />
            <HowItWorksSection />
            <PlatformsSection />
            <ReputationOpsCenterSection />
            <EnhancedTestimonialsSection />
            <CTASection />
            <EnhancedCTASection />
          </div>
        </PublicLayout>
      </PageLayout>
    </div>
  );
};

export default HomePage;
