
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import TrustBadgesSection from '@/components/landing/TrustBadgesSection';
import ClientTypesSection from '@/components/landing/ClientTypesSection';
import ProcessSection from '@/components/landing/ProcessSection';
import ServicesSection from '@/components/landing/ServicesSection';
import PrivacySection from '@/components/landing/PrivacySection';
import ErrorBoundary from '@/components/error/ErrorBoundary';

const HomePage = () => {
  return (
    <ErrorBoundary>
      <PublicLayout>
        <div className="bg-background text-foreground min-h-screen">
          {/* Hero Section */}
          <section className="py-20 px-6 bg-[#0A0F2C] text-center">
            <div className="container mx-auto max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-black mb-6 text-white font-['Space_Grotesk'] tracking-tight">
                A.R.I.A™
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold mb-8 text-[#247CFF] font-['Space_Grotesk'] tracking-wide">
                AI REPUTATION INTELLIGENCE AGENT
              </h2>
              <p className="text-xl md:text-2xl mb-12 text-[#D8DEE9] font-['Inter'] leading-relaxed">
                Protecting reputations before threats emerge. Advanced AI monitoring for executives, creators, and organizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/scan" 
                  className="bg-gradient-to-r from-[#247CFF] to-[#38C172] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.4)] transition-all duration-500 transform hover:scale-105 font-['Space_Grotesk']"
                >
                  GET STARTED
                </a>
                <a 
                  href="#services" 
                  className="border-2 border-[#247CFF] text-[#247CFF] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#247CFF] hover:text-white transition-all duration-500 font-['Space_Grotesk']"
                >
                  LEARN MORE
                </a>
              </div>
            </div>
          </section>

          <TrustBadgesSection />
          <ClientTypesSection />
          <ProcessSection />
          <div id="services">
            <ServicesSection />
          </div>
          <PrivacySection />

          {/* CTA Section */}
          <section className="py-20 px-6 bg-[#0A0F2C] text-center">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-black mb-8 text-white font-['Space_Grotesk'] tracking-tight">
                READY TO PROTECT YOUR REPUTATION?
              </h2>
              <p className="text-xl mb-8 text-[#D8DEE9] font-['Inter']">
                Join executives and organizations who trust A.R.I.A™ to safeguard their digital presence.
              </p>
              <a 
                href="/scan" 
                className="bg-gradient-to-r from-[#38C172] to-[#247CFF] text-white px-12 py-4 rounded-2xl font-bold text-xl hover:shadow-[0_0_25px_rgba(56,193,114,0.4)] transition-all duration-500 transform hover:scale-105 font-['Space_Grotesk']"
              >
                START YOUR PROTECTION
              </a>
            </div>
          </section>
        </div>
      </PublicLayout>
    </ErrorBoundary>
  );
};

export default HomePage;
