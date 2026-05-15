
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import EnhancedCTASection from "@/components/sections/EnhancedCTASection";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";
import SEO from "@/components/seo/SEO";

const HowItWorksPage = () => {
  return (
    <PublicLayout>
      <SEO
        title="How A.R.I.A™ Works — AI Reputation Defence Process"
        description="See how A.R.I.A™ detects threats, defends narratives, and protects identity using AI-driven monitoring and autonomous response."
        path="/how-it-works"
      />
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-foreground">How A.R.I.A.™ Works</h1>
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-muted-foreground">
          Our AI-powered reputation defense system combines cutting-edge technology with proven strategies to protect your digital identity.
        </p>
        
        <HowItWorksSection />
        <EnhancedCTASection />
        <ScanRequestForm />
      </div>
    </PublicLayout>
  );
};

export default HowItWorksPage;
