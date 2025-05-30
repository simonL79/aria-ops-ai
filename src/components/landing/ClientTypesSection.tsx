
import React from 'react';
import { Card } from "@/components/ui/card";

const ClientTypesSection = () => {
  const clientTypes = [
    {
      title: "Executives",
      description: "Founders, CEOs, and public leaders",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      title: "Creators",
      description: "Influencers and professionals",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      title: "Organizations",
      description: "Brands, agencies, and legal teams",
      gradient: "from-[#247CFF] to-[#1C1C1E]"
    },
    {
      title: "Individuals",
      description: "Private people with reputational vulnerabilities",
      gradient: "from-[#1C1C1E] to-[#247CFF]"
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 xl:py-24 px-4 md:px-6 bg-[#D8DEE9]">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center mb-10 md:mb-12 lg:mb-16 xl:mb-20 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight leading-tight px-2">
          WHO WE PROTECT
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {clientTypes.map((client, index) => (
            <Card 
              key={index} 
              className="group p-4 sm:p-5 md:p-6 lg:p-8 text-center bg-white hover:bg-[#0A0F2C] border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl mx-auto w-full"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-2xl bg-gradient-to-r ${client.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(36,124,255,0.3)] transition-shadow duration-500`}>
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="font-bold mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl text-[#0A0F2C] group-hover:text-white transition-colors font-['Space_Grotesk'] tracking-wide text-center leading-tight">
                {client.title.toUpperCase()}
              </h3>
              <p className="text-[#1C1C1E] group-hover:text-[#D8DEE9] transition-colors font-['Inter'] text-center leading-relaxed text-xs sm:text-sm md:text-base">
                {client.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientTypesSection;
