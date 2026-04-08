
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import EnhancedCTASection from "@/components/sections/EnhancedCTASection";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";

const HowItWorksPage = () => {
  return (
    <PublicLayout>
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
