
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
                    Simon Lindsay is the founder of A.R.I.A™ (AI Reputation Intelligence Agent), an advanced reputation intelligence platform designed to monitor, analyse, and protect digital reputation in an increasingly AI-driven information environment.
                  </p>
                  <p>
                    With experience spanning combat sports, celebrity management, commercial partnerships, and digital strategy, Simon has developed an international network across sport, media, and business. His work focuses on identifying emerging reputational risks, protecting public profiles, and structuring strategic opportunities that strengthen both personal and organisational brands.
                  </p>
                  <p>
                    Through A.R.I.A™, Simon combines artificial intelligence with real-world experience operating in high-profile environments. The platform enables clients to monitor their digital footprint, anticipate narrative risks, and maintain greater control over how they are represented across search, media, and social platforms.
                  </p>
                  <p>
                    Alongside his work in reputation intelligence, Simon remains active across boxing, BKFC, and the wider sports and entertainment industry, where he structures brand partnerships and commercial opportunities for athletes, creators, and public figures.
                  </p>
                  <p className="italic text-white mt-4">
                    "Protect reputation. Control narrative. Unlock strategic opportunity."
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
