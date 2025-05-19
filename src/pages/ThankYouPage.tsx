
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Logo from '@/components/ui/logo';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-premium-silver/20 to-white flex flex-col">
      {/* Simple header */}
      <header className="bg-premium-black text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex justify-center md:justify-start">
            <Logo variant="light" size="sm" />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-premium-black">
            Thank You for Your Submission!
          </h1>
          
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <p className="text-xl mb-4 text-premium-gray">
              We've received your information and are preparing your personalized reputation report.
            </p>
            
            <p className="text-lg mb-6 text-premium-darkGray font-medium">
              You'll receive your free report within the next 24 hours.
            </p>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-premium-black">What happens next?</h3>
              <ol className="text-left text-premium-gray list-decimal pl-5 space-y-2">
                <li>Our A.R.I.A™ system will scan the web for your digital footprint</li>
                <li>We'll analyze any potential reputation threats</li>
                <li>You'll receive a detailed report with actionable insights</li>
                <li>One of our specialists may contact you to review your results</li>
              </ol>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button asChild variant="outline" className="mr-4">
              <Link to="/">Return to Homepage</Link>
            </Button>
            <Button asChild>
              <Link to="/about">Learn More About A.R.I.A™</Link>
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-premium-gray">
            A.R.I.A™ — AI Reputation Intelligence Agent
          </p>
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
