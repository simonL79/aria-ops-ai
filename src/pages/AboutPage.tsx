
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
                A.R.I.A™ (Adaptive Reputation Intelligence & Analysis) represents the next generation 
                of digital reputation protection. Our enterprise-grade platform combines advanced 
                artificial intelligence with strategic human expertise to monitor, analyze, and protect 
                reputations across the global digital ecosystem.
              </p>
              <p>
                Designed for high-profile individuals, executives, public figures, and organizations, 
                A.R.I.A™ delivers real-time intelligence on emerging reputation risks across news media, 
                search engines, social platforms, and evolving digital channels. By continuously scanning 
                the online landscape, the system identifies potential threats early and enables strategic 
                responses before narratives gain traction.
              </p>
              <p>
                Built on the principle that reputation is one of the most valuable assets in the modern 
                world, A.R.I.A™ provides the tools and insights needed to safeguard credibility, influence, 
                and public perception in an increasingly connected environment.
              </p>
              <p>
                Our mission is simple: to ensure that your digital narrative remains in your control — 
                protecting what matters most in the age of information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
