
import React from 'react';
import { Button } from "@/components/ui/button";

interface FinalCTASectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const FinalCTASection = ({ onScrollToForm }: FinalCTASectionProps) => {
  return (
    <section className="relative bg-[#D8DEE9] text-[#0A0F2C] py-24 px-6 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="border-r border-b border-[#0A0F2C]/10"></div>
          ))}
        </div>
      </div>
      
      {/* Pulsing accent nodes */}
      <div className="absolute top-20 left-1/4 w-6 h-6 bg-[#247CFF] rounded-full animate-pulse shadow-lg shadow-[#247CFF]/50"></div>
      <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-[#38C172] rounded-full animate-pulse shadow-lg shadow-[#38C172]/50"></div>
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <div className="flex justify-center mb-10">
          <div className="inline-block p-3 bg-gradient-to-r from-[#247CFF]/20 to-[#38C172]/20 rounded-3xl border border-[#247CFF]/30">
            <div className="bg-gradient-to-r from-[#247CFF] to-[#38C172] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-2xl font-bold tracking-widest uppercase font-['Space_Grotesk'] text-xs sm:text-sm md:text-base text-center">
              READY TO STAY AHEAD OF THE STORY?
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-12 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight text-center px-4 mx-auto max-w-5xl">
          YOUR REPUTATION DESERVES PROTECTION
        </h2>
        
        <div className="mb-16 space-y-6 text-base sm:text-lg md:text-2xl px-4 max-w-4xl mx-auto">
          <div className="group hover:bg-[#0A0F2C]/5 rounded-2xl p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="text-[#1C1C1E] group-hover:text-[#0A0F2C] transition-colors font-['Inter'] text-center">
              Your name shouldn't be left unguarded.
            </p>
          </div>
          <div className="group hover:bg-[#0A0F2C]/5 rounded-2xl p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="text-[#1C1C1E] group-hover:text-[#0A0F2C] transition-colors font-['Inter'] text-center">
              Your past shouldn't define your future.
            </p>
          </div>
          <div className="group hover:bg-[#0A0F2C]/5 rounded-2xl p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="font-bold text-[#0A0F2C] bg-gradient-to-r from-[#247CFF] to-[#38C172] bg-clip-text text-transparent font-['Space_Grotesk'] text-center">
              Your story shouldn't be written without you.
            </p>
          </div>
        </div>
        
        <div className="space-y-8 px-4 flex flex-col items-center">
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto group bg-[#247CFF] hover:bg-[#1c63cc] text-white px-8 sm:px-12 md:px-20 py-6 sm:py-8 md:py-12 text-base sm:text-lg md:text-2xl font-bold rounded-3xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_40px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-widest uppercase"
          >
            <a href="#scan-form" onClick={onScrollToForm} className="flex items-center justify-center">
              <div className="w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full mr-4 sm:mr-6 group-hover:animate-pulse shadow-lg"></div>
              REQUEST YOUR PRIVATE SCAN
            </a>
          </Button>
          
          <p className="text-xs sm:text-sm text-[#1C1C1E] mt-8 opacity-75 font-['Inter'] tracking-wide uppercase text-center max-w-md mx-auto">
            SECURE • CONFIDENTIAL • PROFESSIONAL
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
