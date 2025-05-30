
import React from 'react';
import { Button } from "@/components/ui/button";

interface FinalCTASectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const FinalCTASection = ({ onScrollToForm }: FinalCTASectionProps) => {
  return (
    <section className="relative bg-[#D8DEE9] text-[#0A0F2C] py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="border-r border-b border-[#0A0F2C]/10"></div>
          ))}
        </div>
      </div>
      
      {/* Pulsing accent nodes */}
      <div className="absolute top-16 md:top-20 left-1/4 w-4 h-4 md:w-6 md:h-6 bg-[#247CFF] rounded-full animate-pulse shadow-lg shadow-[#247CFF]/50"></div>
      <div className="absolute bottom-16 md:bottom-20 right-1/4 w-3 h-3 md:w-4 md:h-4 bg-[#38C172] rounded-full animate-pulse shadow-lg shadow-[#38C172]/50"></div>
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <div className="flex justify-center mb-6 md:mb-8 lg:mb-10">
          <div className="inline-block p-2 md:p-3 bg-gradient-to-r from-[#247CFF]/20 to-[#38C172]/20 rounded-2xl border border-[#247CFF]/30">
            <div className="bg-gradient-to-r from-[#247CFF] to-[#38C172] text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 rounded-xl font-bold tracking-widest uppercase font-['Space_Grotesk'] text-xs sm:text-sm md:text-base text-center">
              READY TO STAY AHEAD OF THE STORY?
            </div>
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black mb-8 md:mb-10 lg:mb-12 xl:mb-16 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight text-center leading-tight px-2 mx-auto max-w-4xl">
          YOUR REPUTATION DESERVES PROTECTION
        </h2>
        
        <div className="mb-10 md:mb-12 lg:mb-16 xl:mb-20 space-y-4 md:space-y-6 lg:space-y-8 text-sm sm:text-base md:text-lg lg:text-xl px-2 max-w-4xl mx-auto">
          <div className="group hover:bg-[#0A0F2C]/5 rounded-xl p-3 md:p-4 lg:p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="text-[#1C1C1E] group-hover:text-[#0A0F2C] transition-colors font-['Inter'] text-center leading-relaxed">
              Your name shouldn't be left unguarded.
            </p>
          </div>
          <div className="group hover:bg-[#0A0F2C]/5 rounded-xl p-3 md:p-4 lg:p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="text-[#1C1C1E] group-hover:text-[#0A0F2C] transition-colors font-['Inter'] text-center leading-relaxed">
              Your past shouldn't define your future.
            </p>
          </div>
          <div className="group hover:bg-[#0A0F2C]/5 rounded-xl p-3 md:p-4 lg:p-6 transition-all duration-300 border border-transparent hover:border-[#247CFF]/20">
            <p className="font-bold text-[#0A0F2C] bg-gradient-to-r from-[#247CFF] to-[#38C172] bg-clip-text text-transparent font-['Space_Grotesk'] text-center leading-relaxed">
              Your story shouldn't be written without you.
            </p>
          </div>
        </div>
        
        <div className="space-y-6 md:space-y-8 px-2 flex flex-col items-center">
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl group bg-[#247CFF] hover:bg-[#1c63cc] text-white px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold rounded-2xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_40px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase leading-tight"
          >
            <a href="#scan-form" onClick={onScrollToForm} className="flex items-center justify-center w-full">
              <div className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 bg-white rounded-full mr-3 sm:mr-4 md:mr-6 group-hover:animate-pulse shadow-lg flex-shrink-0"></div>
              <span className="text-center">REQUEST YOUR PRIVATE SCAN</span>
            </a>
          </Button>
          
          <p className="text-xs sm:text-sm md:text-base text-[#1C1C1E] opacity-75 font-['Inter'] tracking-wide uppercase text-center max-w-xs sm:max-w-sm md:max-w-md mx-auto leading-relaxed">
            SECURE • CONFIDENTIAL • PROFESSIONAL
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
