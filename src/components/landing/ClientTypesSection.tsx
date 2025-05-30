
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
    <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6 bg-[#D8DEE9]">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center mb-12 md:mb-16 lg:mb-20 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight leading-tight px-2">
          WHO WE PROTECT
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {clientTypes.map((client, index) => (
            <Card 
              key={index} 
              className="group p-6 md:p-8 text-center bg-white hover:bg-[#0A0F2C] border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl mx-auto w-full max-w-sm sm:max-w-none"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${client.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(36,124,255,0.3)] transition-shadow duration-500`}>
                <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="font-bold mb-4 text-xl md:text-2xl text-[#0A0F2C] group-hover:text-white transition-colors font-['Space_Grotesk'] tracking-wide text-center leading-tight">
                {client.title.toUpperCase()}
              </h3>
              <p className="text-[#1C1C1E] group-hover:text-[#D8DEE9] transition-colors font-['Inter'] text-center leading-relaxed text-sm md:text-base">
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
