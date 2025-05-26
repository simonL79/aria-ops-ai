
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import ConcernSubmissionForm from '@/components/forms/ConcernSubmissionForm';

const ScanPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <ConcernSubmissionForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default ScanPage;
