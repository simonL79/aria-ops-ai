
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import TrustedCompaniesSection from '@/components/sections/TrustedCompaniesSection';
import AIPoweredSection from '@/components/sections/AIPoweredSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import PricingSection from '@/components/sections/PricingSection';

const HomePage = () => {
  return (
    <PageLayout title="A.R.I.A™ - AI Reputation Intelligence Agent" className="bg-black">
      <PublicLayout>
        <div className="bg-black text-white">
          <HeroSection />
          <TrustedCompaniesSection />
          <AIPoweredSection />
          <TestimonialsSection />
          <PricingSection />
        </div>
      </PublicLayout>
    </PageLayout>
  );
};

export default HomePage;
