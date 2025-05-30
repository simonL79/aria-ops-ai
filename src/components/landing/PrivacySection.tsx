
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
    <section className="py-12 md:py-16 lg:py-20 xl:py-24 px-4 md:px-6 bg-[#1C1C1E]">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center mb-10 md:mb-12 lg:mb-16 xl:mb-20 text-white font-['Space_Grotesk'] tracking-tight leading-tight px-2">
          PRIVATE BY DESIGN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {privacyFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group p-4 sm:p-5 md:p-6 lg:p-8 bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#38C172]/20 hover:border-[#38C172]/50 shadow-lg hover:shadow-[0_0_25px_rgba(56,193,114,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl w-full"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-3 sm:mb-0 sm:mr-4 md:mr-6 group-hover:shadow-[0_0_20px_rgba(56,193,114,0.4)] transition-shadow duration-500 flex-shrink-0`}>
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-white group-hover:text-[#38C172] transition-colors font-['Space_Grotesk'] tracking-wide text-center sm:text-left leading-tight">
                  {feature.title.toUpperCase()}
                </h3>
              </div>
              <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter'] text-center sm:text-left leading-relaxed text-xs sm:text-sm md:text-base">
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
