
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";

const AboutPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About A.R.I.A™</h1>
            <div className="prose prose-lg mx-auto">
              <p className="text-xl text-gray-600 mb-8 text-center">
                Automated Reputation Intelligence & Analysis
              </p>
              
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p>
                    In today's digital world, reputation moves at the speed of a headline. 
                    A.R.I.A™ helps individuals and organizations understand their online presence 
                    and take action before small issues become serious problems.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">What We Do</h2>
                  <ul className="space-y-2">
                    <li>• Monitor online mentions across platforms</li>
                    <li>• Analyze sentiment and threat levels</li>
                    <li>• Provide actionable insights and recommendations</li>
                    <li>• Help protect and build your digital reputation</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">Founded by Simon Lindsay</h2>
                  <p>
                    A.R.I.A™ was founded by Simon Lindsay, a recognized expert in digital 
                    reputation management and AI-powered monitoring solutions.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
