
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
    <section className="py-20 px-6 bg-[#D8DEE9]">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight">
          WHO WE PROTECT
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {clientTypes.map((client, index) => (
            <Card 
              key={index} 
              className="group p-8 text-center bg-white hover:bg-[#0A0F2C] border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${client.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(36,124,255,0.3)] transition-shadow duration-500`}>
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="font-bold mb-4 text-xl text-[#0A0F2C] group-hover:text-white transition-colors font-['Space_Grotesk'] tracking-wide">
                {client.title.toUpperCase()}
              </h3>
              <p className="text-[#1C1C1E] group-hover:text-[#D8DEE9] transition-colors font-['Inter']">
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
