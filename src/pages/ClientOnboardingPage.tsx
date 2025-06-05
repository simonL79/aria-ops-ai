
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminGuard from '@/components/auth/AdminGuard';
import OnboardingWorkflow from '@/components/client-onboarding/OnboardingWorkflow';

const ClientOnboardingPage = () => {
  return (
    <>
      <Helmet>
        <title>A.R.I.A™ Client Onboarding - Defense System Configuration</title>
        <meta name="description" content="Complete client onboarding and defense system configuration for A.R.I.A™ reputation management" />
      </Helmet>
      
      <AdminGuard>
        <div className="container mx-auto py-8">
          <OnboardingWorkflow />
        </div>
      </AdminGuard>
    </>
  );
};

export default ClientOnboardingPage;
