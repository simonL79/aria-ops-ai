
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 px-6 overflow-hidden">
      {/* Background overlay with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/30 via-transparent to-transparent"></div>
      
      <div className="container mx-auto text-center max-w-5xl relative z-10">
        <div className="mb-8 space-y-6">
          <div className="inline-block">
            <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              A.R.I.A™
            </h1>
          </div>
          <h2 className="text-2xl md:text-4xl font-light mb-6 text-slate-200 tracking-wide">
            Adaptive Reputation Intelligence & Analysis
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Real-time protection for your name, your business, and your future.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border border-red-400/30 p-8 mb-12 rounded-2xl backdrop-blur-sm shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:-translate-y-1">
          <h3 className="text-2xl font-bold mb-4 flex items-center justify-center text-red-100">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
            Protect What Matters — Before It Breaks
          </h3>
          <p className="text-lg text-slate-200 leading-relaxed">
            You don't need to be famous to be at risk.<br />
            You just need someone to say the wrong thing — in the wrong place — at the wrong time.
          </p>
        </div>

        <div className="group">
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-16 py-8 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 border border-white/20"
          >
            <a href="#scan-form" onClick={onScrollToForm} className="flex items-center">
              <Search className="mr-4 h-7 w-7" />
              Request Your Private Scan
            </a>
          </Button>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-32 right-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
    </section>
  );
};

export default HeroSection;
