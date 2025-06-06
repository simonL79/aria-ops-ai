
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactFormSection from '@/components/sections/ContactFormSection';
import SocialLinksSection from '@/components/sections/SocialLinksSection';
import AddOnServicesSection from '@/components/sections/AddOnServicesSection';
import ErrorBoundary from '@/components/error/ErrorBoundary';

const HomePage = () => {
  console.log('HomePage component rendering...');
  
  return (
    <ErrorBoundary>
      <PublicLayout>
        <div className="bg-black text-white min-h-screen">
          <HeroSection />
          <SocialLinksSection />
          <ServicesSection />
          <AddOnServicesSection />
          <TestimonialsSection />
          <ContactFormSection />
        </div>
      </PublicLayout>
    </ErrorBoundary>
  );
};

export default HomePage;
