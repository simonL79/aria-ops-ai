import React from 'react';
import SEO from '@/components/seo/SEO';

const Features = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SEO
        title="Features — A.R.I.A™ Reputation & Legal Intelligence"
        description="Explore A.R.I.A™ features: AI reputation monitoring, threat detection, narrative defence, identity protection, search positioning, and solicitor-ready legal case preparation."
        path="/features"
      />
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Features</h1>
        <p className="text-gray-600 text-center">
          A.R.I.A™ unifies AI reputation monitoring and legal response — from threat detection and narrative defence to evidence packs and solicitor-ready case preparation.
        </p>
      </div>
    </div>
  );
};

export default Features;
