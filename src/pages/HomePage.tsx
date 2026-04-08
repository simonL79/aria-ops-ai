
import React from 'react';
import PublicPagesProtection from '@/components/layout/PublicPagesProtection';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactFormSection from '@/components/sections/ContactFormSection';
import SocialLinksSection from '@/components/sections/SocialLinksSection';
import AddOnServicesSection from '@/components/sections/AddOnServicesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import PricingSection from '@/components/sections/PricingSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import ChatWidget from '@/components/widgets/ChatWidget';

const HomePage = () => {
  console.log('HomePage component rendering...');
  
  return (
    <PublicPagesProtection>
      <PublicLayout>
        <div className="bg-black text-white min-h-screen">
          <HeroSection />
          <SocialLinksSection />
          <ServicesSection />
          <AddOnServicesSection />
          <HowItWorksSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <ContactFormSection />
          <CTASection />
        </div>
        <ChatWidget />
      </PublicLayout>
    </PublicPagesProtection>
  );
};

export default HomePage;
