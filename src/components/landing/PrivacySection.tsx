
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
    <section className="py-20 px-6 bg-[#1C1C1E]">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-white font-['Space_Grotesk'] tracking-tight">
          PRIVATE BY DESIGN
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {privacyFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group p-8 bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#38C172]/20 hover:border-[#38C172]/50 shadow-lg hover:shadow-[0_0_25px_rgba(56,193,114,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl"
            >
              <div className="flex items-center mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mr-6 group-hover:shadow-[0_0_20px_rgba(56,193,114,0.4)] transition-shadow duration-500`}>
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-white group-hover:text-[#38C172] transition-colors font-['Space_Grotesk'] tracking-wide">
                  {feature.title.toUpperCase()}
                </h3>
              </div>
              <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter']">
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
