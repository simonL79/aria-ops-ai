
import React from 'react';
import PublicPagesProtection from '@/components/layout/PublicPagesProtection';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import ThreatScoreSection from '@/components/sections/ThreatScoreSection';
import ServicesSection from '@/components/sections/ServicesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TrustSection from '@/components/sections/TrustSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import PricingSection from '@/components/sections/PricingSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactFormSection from '@/components/sections/ContactFormSection';
import CTASection from '@/components/sections/CTASection';
import SocialLinksSection from '@/components/sections/SocialLinksSection';
import ChatWidget from '@/components/widgets/ChatWidget';

const HomePage = () => {
  return (
    <PublicPagesProtection>
      <PublicLayout>
        <div className="bg-background text-foreground min-h-screen">
          <HeroSection />
          <ThreatScoreSection />
          <ServicesSection />
          <HowItWorksSection />
          <TrustSection />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
          <ContactFormSection />
          <CTASection />
          <SocialLinksSection />
        </div>
        <ChatWidget />
      </PublicLayout>
    </PublicPagesProtection>
  );
};

export default HomePage;
