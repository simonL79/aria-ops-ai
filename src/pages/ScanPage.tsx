
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import ConcernSubmissionForm from '@/components/forms/ConcernSubmissionForm';
import SEO from '@/components/seo/SEO';

const ScanPage = () => {
  return (
    <PublicLayout>
      <SEO
        title="Free Reputation & Legal Risk Scan — A.R.I.A™ Threat Check"
        description="Run a free scan and get an instant view of online threats, impersonation risks, harmful content, and legal exposure targeting you or your brand."
        path="/scan"
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6">
          <ConcernSubmissionForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default ScanPage;
