
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';

const PricingPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">Individual</h3>
                <p className="text-3xl font-bold mb-6">Contact Us</p>
                <ul className="space-y-3 text-gray-300">
                  <li>• Personal reputation monitoring</li>
                  <li>• Basic threat detection</li>
                  <li>• Monthly reports</li>
                  <li>• Email support</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 border border-orange-500 rounded-lg p-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-orange-500 mb-4">Executive</h3>
                <p className="text-3xl font-bold mb-6">Contact Us</p>
                <ul className="space-y-3 text-gray-300">
                  <li>• Executive protection suite</li>
                  <li>• Advanced threat intelligence</li>
                  <li>• Real-time alerts</li>
                  <li>• Crisis response team</li>
                  <li>• Weekly reports</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">Enterprise</h3>
                <p className="text-3xl font-bold mb-6">Contact Us</p>
                <ul className="space-y-3 text-gray-300">
                  <li>• Full organization coverage</li>
                  <li>• Custom threat models</li>
                  <li>• Dedicated account manager</li>
                  <li>• API access</li>
                  <li>• Daily reports</li>
                  <li>• 24/7 support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PricingPage;
