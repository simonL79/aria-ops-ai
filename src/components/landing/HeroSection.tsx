
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Logo from '@/components/ui/logo';

interface HeroSectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen bg-[#0A0F2C] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
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
        {/* Logo prominently displayed */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <Logo variant="light" size="xl" className="mx-auto" />
        </div>
        
        <div className="mb-8 sm:mb-10 md:mb-12 space-y-4 sm:space-y-6 md:space-y-8">
          <div className="flex justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-4 sm:mb-6 leading-tight font-['Space_Grotesk'] tracking-tight text-center px-2">
              <span className="bg-gradient-to-r from-white via-[#D8DEE9] to-[#247CFF] bg-clip-text text-transparent">
                A.R.I.A™
              </span>
            </h1>
          </div>
          <h2 className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl font-bold mb-6 sm:mb-8 text-[#D8DEE9] tracking-wide font-['Space_Grotesk'] text-center px-2 mx-auto max-w-5xl">
            ADAPTIVE REPUTATION INTELLIGENCE & ANALYSIS
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8 sm:mb-10 md:mb-12 text-[#D8DEE9] max-w-4xl mx-auto leading-relaxed font-['Inter'] text-center px-2">
            Real-time protection for your name, your business, and your future.
          </p>
        </div>
        
        <div className="relative bg-gradient-to-r from-[#1C1C1E]/40 via-[#0A0F2C]/60 to-[#1C1C1E]/40 border border-[#247CFF]/30 p-4 sm:p-6 md:p-10 mb-8 sm:mb-12 md:mb-16 rounded-2xl sm:rounded-3xl backdrop-blur-sm group hover:border-[#247CFF]/50 transition-all duration-500 mx-2 sm:mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-[#247CFF]/5 via-transparent to-[#247CFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center justify-center text-[#247CFF] font-['Space_Grotesk'] tracking-wide text-center">
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-[#247CFF] rounded-full mr-2 sm:mr-4 animate-pulse shadow-lg shadow-[#247CFF]/50"></div>
            PROTECT WHAT MATTERS — BEFORE IT BREAKS
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-[#D8DEE9] leading-relaxed font-['Inter'] text-center max-w-4xl mx-auto">
            You don't need to be famous to be at risk.<br className="hidden md:block" />
            You just need someone to say the wrong thing — in the wrong place — at the wrong time.
          </p>
        </div>

        <div className="flex justify-center px-2 sm:px-4">
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto bg-[#247CFF] hover:bg-[#1c63cc] text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4 sm:py-6 md:py-8 lg:py-10 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold rounded-xl sm:rounded-2xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_30px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide sm:tracking-widest uppercase"
          >
            <a href="#scan-form" onClick={onScrollToForm} className="flex items-center justify-center min-w-0">
              <Search className="mr-2 sm:mr-3 md:mr-4 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">REQUEST YOUR PRIVATE SCAN</span>
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
