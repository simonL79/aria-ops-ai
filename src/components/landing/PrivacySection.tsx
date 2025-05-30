
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const PrivacySection = () => {
  const privacyFeatures = [
    {
      title: "Fully GDPR-compliant",
      description: "Complete data protection compliance",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      title: "No public dashboard, ever",
      description: "Your data stays completely private",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      title: "Enterprise-grade encryption",
      description: "Bank-level security for all data",
      gradient: "from-[#247CFF] to-[#1C1C1E]"
    },
    {
      title: "Verified secure operators",
      description: "Only trusted personnel handle your information",
      gradient: "from-[#1C1C1E] to-[#247CFF]"
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6 bg-[#1C1C1E]">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center mb-12 md:mb-16 lg:mb-20 text-white font-['Space_Grotesk'] tracking-tight leading-tight px-2">
          PRIVATE BY DESIGN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {privacyFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group p-6 md:p-8 bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#38C172]/20 hover:border-[#38C172]/50 shadow-lg hover:shadow-[0_0_25px_rgba(56,193,114,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl w-full"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-4 sm:mb-0 sm:mr-6 group-hover:shadow-[0_0_20px_rgba(56,193,114,0.4)] transition-shadow duration-500 flex-shrink-0`}>
                  <Check className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-[#38C172] transition-colors font-['Space_Grotesk'] tracking-wide text-center sm:text-left leading-tight">
                  {feature.title.toUpperCase()}
                </h3>
              </div>
              <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter'] text-center sm:text-left leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
