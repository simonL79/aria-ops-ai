
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import ScanRequestForm from '@/components/salesFunnel/ScanRequestForm';

const ScanPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Get Your Free Reputation Scan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover what's being said about you online and take control of your digital reputation.
            </p>
          </div>
          <ScanRequestForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default ScanPage;
