
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-4 md:px-6 py-12 md:py-20 text-center">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center mb-4 md:mb-0">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-full"></div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight mt-4 md:mt-0">A.R.I.A™</h1>
        </div>
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#247CFF] mb-4 md:mb-6 font-['Space_Grotesk'] tracking-wide text-center">
          ADAPTIVE REPUTATION INTELLIGENCE & ANALYSIS
        </h2>
        <p className="text-lg md:text-xl text-[#D8DEE9] mb-8 md:mb-12 font-['Inter'] max-w-2xl mx-auto text-center">
          Real-time protection for your name, your business, and your future.
        </p>
        
        <div className="mb-12 md:mb-16">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 font-['Space_Grotesk'] text-center">
            PROTECT WHAT MATTERS — BEFORE IT BREAKS
          </h3>
          <p className="text-base md:text-lg text-[#D8DEE9] max-w-2xl mx-auto font-['Inter'] text-center px-4">
            You don't need to be famous to be at risk.<br className="hidden md:block" />
            You just need someone to say the wrong thing — in the wrong place — at the wrong time.
          </p>
        </div>

        <Button
          onClick={() => navigate('/scan')}
          className="w-full md:w-auto bg-[#247CFF] hover:bg-[#1c63cc] text-white px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-bold rounded-xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase"
        >
          REQUEST YOUR PRIVATE SCAN
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
