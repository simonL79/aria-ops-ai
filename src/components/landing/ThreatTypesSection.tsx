
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, Eye, Zap } from "lucide-react";

const ThreatTypesSection = () => {
  const threats = [
    {
      icon: AlertTriangle,
      title: "Social Media Attacks",
      description: "Monitor and neutralize coordinated attacks across all social platforms before they gain momentum.",
      gradient: "from-[#247CFF] to-[#38C172]",
      bgGradient: "from-[#247CFF]/10 to-[#38C172]/10"
    },
    {
      icon: Eye,
      title: "Search Engine Manipulation",
      description: "Detect and counter negative SEO campaigns designed to damage your online reputation.",
      gradient: "from-[#247CFF] to-[#D8DEE9]",
      bgGradient: "from-[#247CFF]/10 to-[#D8DEE9]/10"
    },
    {
      icon: Shield,
      title: "Corporate Espionage",
      description: "Identify threats from competitors, disgruntled employees, and industrial espionage attempts.",
      gradient: "from-[#38C172] to-[#247CFF]",
      bgGradient: "from-[#38C172]/10 to-[#247CFF]/10"
    },
    {
      icon: Zap,
      title: "AI Model Poisoning",
      description: "Prevent false information from being embedded into AI training data and language models.",
      gradient: "from-[#1C1C1E] to-[#247CFF]",
      bgGradient: "from-[#1C1C1E]/10 to-[#247CFF]/10"
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#1C1C1E]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-white font-['Space_Grotesk'] tracking-tight text-center">
            THREAT INTELLIGENCE THAT MATTERS
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#247CFF] to-[#38C172] mx-auto mb-10"></div>
          <p className="text-xl text-[#D8DEE9] max-w-4xl mx-auto leading-relaxed font-['Inter'] text-center">
            Our advanced monitoring systems detect and classify threats across multiple vectors, 
            providing early warning for reputation risks before they escalate.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          {threats.map((threat, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#247CFF]/20 hover:border-[#247CFF]/50 shadow-lg hover:shadow-[0_0_30px_rgba(36,124,255,0.2)] transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 rounded-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${threat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute left-0 top-0 w-3 h-full bg-gradient-to-b ${threat.gradient} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top`}></div>
              
              <div className="relative p-10">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 text-center md:text-left">
                  <div className={`p-5 rounded-3xl bg-gradient-to-r ${threat.gradient} shadow-xl group-hover:shadow-[0_0_25px_rgba(36,124,255,0.4)] transition-shadow duration-500 flex-shrink-0`}>
                    <threat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-6 text-white group-hover:text-[#247CFF] transition-colors font-['Space_Grotesk'] tracking-wide">
                      {threat.title.toUpperCase()}
                    </h3>
                    <p className="text-[#D8DEE9] group-hover:text-white transition-colors leading-relaxed font-['Inter']">
                      {threat.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreatTypesSection;
