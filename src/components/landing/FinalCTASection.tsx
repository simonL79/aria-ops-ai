
import React from 'react';
import { Button } from "@/components/ui/button";

interface FinalCTASectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const FinalCTASection = ({ onScrollToForm }: FinalCTASectionProps) => {
  return (
    <section className="relative bg-[#D8DEE9] text-[#0A0F2C] py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
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
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="inline-block p-2 md:p-3 bg-gradient-to-r from-[#247CFF]/20 to-[#38C172]/20 rounded-2xl border border-[#247CFF]/30">
            <div className="bg-gradient-to-r from-[#247CFF] to-[#38C172] text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl font-bold tracking-widest uppercase font-['Space_Grotesk'] text-sm md:text-base text-center">
              READY TO STAY AHEAD OF THE STORY?
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-10 md:mb-12 lg:mb-16 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight text-center leading-tight px-2 mx-auto max-w-5xl">
          YOUR REPUTATION DESERVES PROTECTION
        </h2>
        
        <div className="mb-12 md:mb-16 lg:mb-20 space-y-6 md:space-y-8 text-base md:text-lg lg:text-xl px-4 max-w-4xl mx-auto">
          <div className="group hover:bg-[#0A0F2C]/5 rounded-xl p-4 md:p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="text-[#1C1C1E] group-hover:text-[#0A0F2C] transition-colors font-['Inter'] text-center leading-relaxed">
              Your name shouldn't be left unguarded.
            </p>
          </div>
          <div className="group hover:bg-[#0A0F2C]/5 rounded-xl p-4 md:p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="text-[#1C1C1E] group-hover:text-[#0A0F2C] transition-colors font-['Inter'] text-center leading-relaxed">
              Your past shouldn't define your future.
            </p>
          </div>
          <div className="group hover:bg-[#0A0F2C]/5 rounded-xl p-4 md:p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="font-bold text-[#0A0F2C] bg-gradient-to-r from-[#247CFF] to-[#38C172] bg-clip-text text-transparent font-['Space_Grotesk'] text-center leading-relaxed">
              Your story shouldn't be written without you.
            </p>
          </div>
        </div>
        
        <div className="space-y-8 px-4 flex flex-col items-center">
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto max-w-lg group bg-[#247CFF] hover:bg-[#1c63cc] text-white px-8 sm:px-12 md:px-16 lg:px-20 py-6 md:py-8 lg:py-10 text-lg md:text-xl lg:text-2xl font-bold rounded-2xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_40px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase"
          >
            <a href="#scan-form" onClick={onScrollToForm} className="flex items-center justify-center">
              <div className="w-4 md:w-5 h-4 md:h-5 bg-white rounded-full mr-4 md:mr-6 group-hover:animate-pulse shadow-lg"></div>
              <span className="text-center">REQUEST YOUR PRIVATE SCAN</span>
            </a>
          </Button>
          
          <p className="text-sm md:text-base text-[#1C1C1E] opacity-75 font-['Inter'] tracking-wide uppercase text-center max-w-md mx-auto leading-relaxed">
            SECURE • CONFIDENTIAL • PROFESSIONAL
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
