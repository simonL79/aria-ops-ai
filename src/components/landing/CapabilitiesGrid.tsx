
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const CapabilitiesGrid = () => {
  const capabilities = [
    {
      title: "FINDS THREATS BEFORE YOU'RE AWARE",
      description: "Detects risks across the internet before they impact you",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      title: "TRACKS ACROSS ALL PLATFORMS",
      description: "Forums, news, social media, and AI systems monitoring",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      title: "HUMAN-READABLE REPORTS",
      description: "No tools, no dashboards — just clear insights",
      gradient: "from-[#247CFF] to-[#1C1C1E]"
    },
    {
      title: "PREVENTS FUTURE CRISES",
      description: "Stops problems before they exist",
      gradient: "from-[#1C1C1E] to-[#247CFF]"
    },
    {
      title: "CORRECTS FALSE MEMORIES",
      description: "Fixes what search engines and AI models remember",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      title: "ZERO INPUT SCANNING",
      description: "Finds everything — even what you didn't search for",
      gradient: "from-[#38C172] to-[#247CFF]"
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-[#1C1C1E]">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-center mb-4 text-white font-['Space_Grotesk'] tracking-tight px-4">
          A.R.I.A™ IS THE WORLD'S FIRST FULLY-MANAGED REPUTATION INTELLIGENCE SYSTEM THAT:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
          {capabilities.map((capability, index) => (
            <Card key={index} className="group p-6 md:p-8 bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#247CFF]/20 hover:border-[#247CFF]/50 shadow-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl">
              <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-2xl bg-gradient-to-r ${capability.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transition-shadow duration-500`}>
                <Check className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="font-bold mb-3 md:mb-4 text-base md:text-lg text-white group-hover:text-[#247CFF] transition-colors font-['Space_Grotesk'] tracking-wide text-center">
                {capability.title}
              </h3>
              <p className="text-sm md:text-base text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter'] text-center">
                {capability.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
