
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';

const BlogPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">A.R.I.A™ Blog</h1>
            <p className="text-xl text-gray-300 text-center mb-12">
              Insights, analysis, and updates from the world of digital reputation management
            </p>
            
            <div className="space-y-8">
              <article className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-orange-500 mb-4">
                  The Evolution of Digital Reputation Management
                </h2>
                <p className="text-gray-300 mb-4">
                  How AI-powered reputation intelligence is transforming the way individuals and 
                  organizations protect their digital presence in an increasingly connected world.
                </p>
                <span className="text-sm text-gray-500">Coming Soon</span>
              </article>
              
              <article className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-orange-500 mb-4">
                  Understanding Threat Vectors in the Digital Age
                </h2>
                <p className="text-gray-300 mb-4">
                  A comprehensive guide to identifying and mitigating reputation risks across 
                  social media platforms and digital channels.
                </p>
                <span className="text-sm text-gray-500">Coming Soon</span>
              </article>
              
              <article className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-orange-500 mb-4">
                  Executive Protection in the Information Era
                </h2>
                <p className="text-gray-300 mb-4">
                  Why C-suite executives need specialized digital reputation protection and 
                  how A.R.I.A™ delivers enterprise-grade solutions.
                </p>
                <span className="text-sm text-gray-500">Coming Soon</span>
              </article>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;
