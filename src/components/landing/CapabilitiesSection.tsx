
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const CapabilitiesSection = () => {
  const capabilities = [
    {
      title: "Finds threats before you're aware",
      description: "Detects risks across the internet before they impact you",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      title: "Tracks across all platforms",
      description: "Forums, news, social media, and AI systems monitoring",
      gradient: "from-[#247CFF] to-[#D8DEE9]"
    },
    {
      title: "Human-readable reports",
      description: "No tools, no dashboards — just clear insights",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      title: "Prevents future crises",
      description: "Stops problems before they exist",
      gradient: "from-[#247CFF] to-[#1C1C1E]"
    },
    {
      title: "Corrects false memories",
      description: "Fixes what search engines and AI models remember",
      gradient: "from-[#1C1C1E] to-[#247CFF]"
    },
    {
      title: "Zero input scanning",
      description: "Finds everything — even what you didn't search for",
      gradient: "from-[#247CFF] to-[#38C172]"
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#D8DEE9]">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-6 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight">
          A.R.I.A™ IS THE WORLD'S FIRST FULLY-MANAGED REPUTATION INTELLIGENCE SYSTEM THAT:
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-[#247CFF] to-[#38C172] mx-auto mb-20"></div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {capabilities.map((capability, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-white hover:bg-[#0A0F2C] border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`absolute left-0 top-0 w-2 h-full bg-gradient-to-b ${capability.gradient} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top`}></div>
              
              <div className="relative p-10">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${capability.gradient} shadow-lg group-hover:shadow-[0_0_20px_rgba(36,124,255,0.3)]`}>
                    <Check className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl ml-6 text-[#0A0F2C] group-hover:text-white transition-colors font-['Space_Grotesk'] tracking-wide">
                    {capability.title.toUpperCase()}
                  </h3>
                </div>
                <p className="text-[#1C1C1E] group-hover:text-[#D8DEE9] transition-colors leading-relaxed font-['Inter']">
                  {capability.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
