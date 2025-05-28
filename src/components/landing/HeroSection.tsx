
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen bg-[#0A0F2C] text-white py-20 px-6 overflow-hidden">
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#247CFF]/20 to-transparent animate-pulse"></div>
        <div className="grid grid-cols-12 h-full opacity-30">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="border-r border-b border-[#247CFF]/10"></div>
          ))}
        </div>
      </div>
      
      {/* Pulsing nodes for surveillance feel */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-[#247CFF] rounded-full animate-pulse shadow-lg shadow-[#247CFF]/50"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#38C172] rounded-full animate-pulse shadow-lg shadow-[#38C172]/50"></div>
      <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-[#247CFF] rounded-full animate-pulse"></div>
      
      <div className="container mx-auto text-center max-w-6xl relative z-10">
        <div className="mb-12 space-y-8">
          <div className="inline-block">
            <h1 className="text-7xl md:text-9xl font-black mb-6 leading-tight font-['Space_Grotesk'] tracking-tight">
              <span className="bg-gradient-to-r from-white via-[#D8DEE9] to-[#247CFF] bg-clip-text text-transparent">
                A.R.I.A™
              </span>
            </h1>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#D8DEE9] tracking-wide font-['Space_Grotesk']">
            ADAPTIVE REPUTATION INTELLIGENCE & ANALYSIS
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-[#D8DEE9] max-w-4xl mx-auto leading-relaxed font-['Inter']">
            Real-time protection for your name, your business, and your future.
          </p>
        </div>
        
        <div className="relative bg-gradient-to-r from-[#1C1C1E]/40 via-[#0A0F2C]/60 to-[#1C1C1E]/40 border border-[#247CFF]/30 p-10 mb-16 rounded-3xl backdrop-blur-sm group hover:border-[#247CFF]/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-[#247CFF]/5 via-transparent to-[#247CFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-2xl font-bold mb-6 flex items-center justify-center text-[#247CFF] font-['Space_Grotesk'] tracking-wide">
            <div className="w-3 h-3 bg-[#247CFF] rounded-full mr-4 animate-pulse shadow-lg shadow-[#247CFF]/50"></div>
            PROTECT WHAT MATTERS — BEFORE IT BREAKS
          </h3>
          <p className="text-lg text-[#D8DEE9] leading-relaxed font-['Inter']">
            You don't need to be famous to be at risk.<br />
            You just need someone to say the wrong thing — in the wrong place — at the wrong time.
          </p>
        </div>

        <div className="group">
          <Button 
            asChild 
            size="lg" 
            className="bg-[#247CFF] hover:bg-[#247CFF]/90 text-white px-20 py-10 text-xl font-bold rounded-2xl border border-[#247CFF]/50 hover:border-[#247CFF] hover:shadow-[0_0_30px_rgba(36,124,255,0.3)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-widest uppercase"
          >
            <a href="#scan-form" onClick={onScrollToForm} className="flex items-center">
              <Search className="mr-4 h-8 w-8" />
              REQUEST YOUR PRIVATE SCAN
            </a>
          </Button>
        </div>
      </div>

      {/* Data visualization elements */}
      <div className="absolute top-32 right-10 w-32 h-32 border border-[#247CFF]/30 rounded-full flex items-center justify-center animate-pulse">
        <div className="w-20 h-20 border border-[#247CFF]/50 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-[#247CFF] rounded-full shadow-lg shadow-[#247CFF]/50"></div>
        </div>
      </div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-[#38C172]/30 rounded-full animate-pulse"></div>
    </section>
  );
};

export default HeroSection;
