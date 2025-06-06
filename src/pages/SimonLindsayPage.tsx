
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';

const SimonLindsayPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Simon Lindsay</h1>
            <p className="text-xl text-gray-300 text-center mb-12">
              Founder & CEO of A.R.I.A™
            </p>
            
            <div className="space-y-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-orange-500 mb-6">About Simon</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Simon Lindsay is the visionary founder and CEO of A.R.I.A™ (Adaptive Reputation 
                    Intelligence & Analysis), bringing over a decade of experience in digital security, 
                    artificial intelligence, and reputation management.
                  </p>
                  <p>
                    With a background in cybersecurity and emerging technologies, Simon recognized 
                    the critical need for intelligent, proactive reputation protection in our 
                    increasingly connected world. His vision led to the creation of A.R.I.A™, 
                    a platform that combines cutting-edge AI with human expertise to deliver 
                    unparalleled reputation intelligence.
                  </p>
                  <p>
                    Under Simon's leadership, A.R.I.A™ has become a trusted partner for executives, 
                    organizations, and individuals seeking comprehensive digital reputation protection. 
                    His commitment to innovation and client success continues to drive the evolution 
                    of reputation management technology.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-orange-500 mb-6">Expertise</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Technical Leadership</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• AI & Machine Learning</li>
                      <li>• Cybersecurity</li>
                      <li>• Data Analytics</li>
                      <li>• System Architecture</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Business Strategy</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Digital Transformation</li>
                      <li>• Risk Management</li>
                      <li>• Crisis Response</li>
                      <li>• Executive Protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SimonLindsayPage;
