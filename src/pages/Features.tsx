import React from 'react';
import SEO from '@/components/seo/SEO';

const Features = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SEO
        title="Features — A.R.I.A™ Reputation Intelligence"
        description="Explore A.R.I.A™ features: AI threat detection, narrative defence, identity protection, and search positioning for high-profile clients."
        path="/features"
      />
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Features</h1>
        <p className="text-gray-600 text-center">
          Features page coming soon...
        </p>
      </div>
    </div>
  );
};

export default Features;
