
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import TrustedCompaniesSection from '@/components/sections/TrustedCompaniesSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import ErrorBoundary from '@/components/error/ErrorBoundary';

const HomePage = () => {
  return (
    <ErrorBoundary>
      <PublicLayout>
        <div className="bg-background text-foreground min-h-screen">
          <HeroSection />
          <TrustedCompaniesSection />
          <ServicesSection />
          <TestimonialsSection />
          <CTASection />
        </div>
      </PublicLayout>
    </ErrorBoundary>
  );
};

export default HomePage;
