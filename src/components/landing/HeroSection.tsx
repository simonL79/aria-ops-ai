
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-6">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            A.R.I.A™
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6 text-blue-200">
            Adaptive Reputation Intelligence & Analysis
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Real-time protection for your name, your business, and your future.
          </p>
        </div>
        
        <div className="bg-blue-800 border-l-4 border-blue-400 p-6 mb-8 rounded-lg">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center">
            🚨 Protect What Matters — Before It Breaks
          </h3>
          <p className="text-lg">
            You don't need to be famous to be at risk.<br />
            You just need someone to say the wrong thing — in the wrong place — at the wrong time.
          </p>
        </div>

        <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
          <a href="#scan-form" onClick={onScrollToForm} className="flex items-center">
            <Search className="mr-3 h-6 w-6" />
            🔍 Request Your Private Scan
          </a>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
