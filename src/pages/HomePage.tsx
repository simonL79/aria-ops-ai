
import React, { useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import PublicPagesProtection from '@/components/layout/PublicPagesProtection';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';

import ActiveFootprintSection from '@/components/sections/ActiveFootprintSection';
import ServicesSection from '@/components/sections/ServicesSection';
import SectionDivider from '@/components/ui/SectionDivider';
import SEO from '@/components/seo/SEO';

// Below-the-fold sections — lazy-loaded so they don't block FCP / LCP
const HowItWorksSection = lazy(() => import('@/components/sections/HowItWorksSection'));
const TrustSection = lazy(() => import('@/components/sections/TrustSection'));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));
const PricingSection = lazy(() => import('@/components/sections/PricingSection'));
const FAQSection = lazy(() => import('@/components/sections/FAQSection'));
const ContactFormSection = lazy(() => import('@/components/sections/ContactFormSection'));
const CTASection = lazy(() => import('@/components/sections/CTASection'));
const SocialLinksSection = lazy(() => import('@/components/sections/SocialLinksSection'));
const AINewsFeedSection = lazy(() => import('@/components/sections/AINewsFeedSection'));
const ChatWidget = lazy(() => import('@/components/widgets/ChatWidget'));

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
        <SEO
          title="A.R.I.A™ — AI Reputation Defence & Legal Response"
          description="A.R.I.A™ combines AI-powered reputation monitoring with solicitor-ready legal response. Real-time threat detection, narrative defence, identity protection, and AI legal case preparation."
          path="/"
        />
        <div className="bg-background text-foreground min-h-screen">
          <HeroSection />

          <ActiveFootprintSection />
          <SectionDivider glow />
          <ServicesSection />
          <Suspense fallback={null}>
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
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </PublicLayout>
    </PublicPagesProtection>
  );
};

export default HomePage;
