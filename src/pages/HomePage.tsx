
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import AINewsFeedSection from '@/components/sections/AINewsFeedSection';
import SectionDivider from '@/components/ui/SectionDivider';
import ChatWidget from '@/components/widgets/ChatWidget';

const HomePage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <PublicPagesProtection>
      <PublicLayout>
        <div className="bg-background text-foreground min-h-screen">
          <HeroSection />
          
          <ThreatScoreSection />
          <SectionDivider glow />
          <ServicesSection />
          <AINewsFeedSection />
          <SectionDivider glow />
          <HowItWorksSection />
          <TrustSection />
          <TestimonialsSection />
          <SectionDivider glow />
          <PricingSection />
          <FAQSection />
          <SectionDivider />
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
