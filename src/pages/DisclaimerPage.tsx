
import React from 'react';
import StickyHeader from '@/components/layout/StickyHeader';
import Footer from '@/components/layout/Footer';

const DisclaimerPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-premium-silver/20">
      {/* Sticky Navigation */}
      <StickyHeader isScrolled={true} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
          <p className="text-gray-600 mb-8">Last updated: {currentDate}</p>
          
          <p>
            The information provided by A.R.I.A™ (AI Reputation Intelligence Agent) on this website is for general informational purposes only.
          </p>

          <p>
            All information is provided in good faith, however we make no warranty of any kind regarding accuracy, adequacy, or completeness.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">AI Limitations</h2>
          <p>
            A.R.I.A™ uses artificial intelligence to detect and classify online reputation threats. AI outputs are generated based on third-party data and may not always reflect legal, factual, or actionable advice.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">No Legal Advice</h2>
          <p>
            Nothing on this website constitutes legal advice. If you are facing a legal dispute or defamation case, we strongly recommend consulting a qualified legal professional.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">External Links</h2>
          <p>
            This site may contain links to third-party websites. A.R.I.A™ has no control over and assumes no responsibility for the content or practices of any third-party sites.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Liability</h2>
          <p>
            Under no circumstance shall A.R.I.A™, Simon Lindsay, or associated partners be held liable for any loss, damage, or liability incurred due to reliance on our tools, reports, or services.
          </p>
          
          <p className="mt-8 font-medium">
            Use of our platform indicates your agreement to this disclaimer.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DisclaimerPage;
