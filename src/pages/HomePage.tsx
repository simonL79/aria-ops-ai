
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import TrustedCompaniesSection from '@/components/sections/TrustedCompaniesSection';
import AIPoweredSection from '@/components/sections/AIPoweredSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import PricingSection from '@/components/sections/PricingSection';
import ErrorBoundary from '@/components/error/ErrorBoundary';

const HomePage = () => {
  return (
    <ErrorBoundary>
      <PublicLayout>
        <div className="bg-background text-foreground min-h-screen">
          <HeroSection />
          <TrustedCompaniesSection />
          <AIPoweredSection />
          <TestimonialsSection />
          <PricingSection />
        </div>
      </PublicLayout>
    </ErrorBoundary>
  );
};

export default HomePage;
