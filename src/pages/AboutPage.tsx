
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';

const AboutPage = () => {
  return (
    <PublicLayout>
      <SEO
        title="About A.R.I.A™ — AI Reputation & Legal Intelligence Platform"
        description="A.R.I.A™ is an enterprise-grade AI platform combining reputation monitoring with solicitor-ready legal response, protecting executives, public figures, and organisations across the global digital landscape."
        path="/about"
      />
      <div className="min-h-screen bg-background text-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">About A.R.I.A™</h1>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                A.R.I.A™ (Adaptive Reputation Intelligence & Analysis) represents the next generation 
                of digital reputation and legal protection. Our enterprise-grade platform combines advanced 
                artificial intelligence with strategic human expertise to monitor, analyse, protect 
                reputations, and prepare solicitor-ready legal responses across the global digital ecosystem.
              </p>
              <p>
                Designed for high-profile individuals, executives, public figures, and organizations, 
                A.R.I.A™ delivers real-time intelligence on emerging reputation risks across news media, 
                search engines, social platforms, and evolving digital channels. When a threat crosses into 
                legal exposure, ARIA Legal Shield™ organises evidence, drafts documentation, and builds the 
                case file needed for regulated legal advice.
              </p>
              <p>
                Built on the principle that reputation and legal position are two of the most valuable 
                assets in the modern world, A.R.I.A™ provides the tools, insights and preparation needed 
                to safeguard credibility, influence, and rights in an increasingly connected environment.
              </p>
              <p>
                Our mission is simple: to ensure that your digital narrative and legal position remain in 
                your control — protecting what matters most in the age of information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
