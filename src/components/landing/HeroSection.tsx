
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScrollToForm?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onScrollToForm) {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.MouseEvent<HTMLAnchorElement>;
      onScrollToForm(syntheticEvent);
    } else {
      navigate('/scan');
    }
  };

  return (
    <section className="relative px-4 md:px-6 py-12 md:py-16 lg:py-20 text-center">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center mb-4 md:mb-6">
            <div className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-white rounded-full"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white font-['Space_Grotesk'] tracking-tight leading-none">
            A.R.I.A™
          </h1>
        </div>
        
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-[#247CFF] mb-4 md:mb-6 lg:mb-8 font-['Space_Grotesk'] tracking-wide text-center leading-tight px-2 max-w-4xl mx-auto">
          ADAPTIVE REPUTATION INTELLIGENCE & ANALYSIS
        </h2>
        
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#D8DEE9] mb-8 md:mb-12 lg:mb-16 font-['Inter'] max-w-4xl mx-auto text-center leading-relaxed px-2">
          Real-time protection for your name, your business, and your future.
        </p>
        
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-4 md:mb-6 lg:mb-8 font-['Space_Grotesk'] text-center leading-tight px-2 max-w-4xl mx-auto">
            PROTECT WHAT MATTERS — BEFORE IT BREAKS
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#D8DEE9] max-w-3xl mx-auto font-['Inter'] text-center px-2 leading-relaxed">
            You don't need to be famous to be at risk.<br className="hidden sm:block" />
            You just need someone to say the wrong thing — in the wrong place — at the wrong time.
          </p>
        </div>

        <div className="flex justify-center px-2">
          <Button
            onClick={handleButtonClick}
            className="w-full sm:w-auto sm:max-w-sm md:max-w-md lg:max-w-lg bg-[#247CFF] hover:bg-[#1c63cc] text-white px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold rounded-xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase text-center leading-tight"
          >
            REQUEST YOUR PRIVATE SCAN
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
