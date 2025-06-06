
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';

const AboutPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">About A.R.I.A™</h1>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                A.R.I.A™ (Adaptive Reputation Intelligence & Analysis) represents the cutting edge of 
                digital reputation management technology. Our enterprise-grade platform combines 
                artificial intelligence with human expertise to provide comprehensive protection 
                for individuals, executives, and organizations.
              </p>
              <p>
                Founded on the principle that everyone deserves protection from digital threats, 
                A.R.I.A™ monitors, analyzes, and responds to reputation risks in real-time across 
                all major platforms and emerging digital channels.
              </p>
              <p>
                Our mission is to ensure that your digital narrative remains under your control, 
                protecting what matters most in an increasingly connected world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
