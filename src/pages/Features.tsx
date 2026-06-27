import React from 'react';
import SEO from '@/components/seo/SEO';
import PublicLayout from '@/components/layout/PublicLayout';

const Features = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center px-6 py-24 text-foreground">
        <SEO
          title="Features — A.R.I.A™ Reputation & Legal Intelligence"
          description="Explore A.R.I.A™ features: AI reputation monitoring, threat detection, narrative defence, identity protection, search positioning, and solicitor-ready legal case preparation."
          path="/features"
        />
        <div className="max-w-md w-full glass-card p-8 text-center">
          <h1 className="text-2xl font-display font-bold mb-4 text-foreground">Features</h1>
          <p className="text-muted-foreground">
            A.R.I.A™ unifies AI reputation monitoring and legal response — from threat detection and narrative defence to evidence packs and solicitor-ready case preparation.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Features;
