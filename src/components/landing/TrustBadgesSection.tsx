
import React from 'react';
import { Shield, TrendingUp, Eye } from "lucide-react";

const TrustBadgesSection = () => {
  const badges = [
    {
      icon: Shield,
      text: "GDPR COMPLIANT",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      icon: TrendingUp,
      text: "USED BY AGENCIES & ENTERPRISES",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      icon: Eye,
      text: "HUMAN + AI VERIFIED",
      gradient: "from-[#247CFF] to-[#1C1C1E]"
    },
    {
      icon: Shield,
      text: "BUILT IN THE UK",
      gradient: "from-[#1C1C1E] to-[#247CFF]"
    }
  ];

  return (
    <section className="py-12 px-6 bg-[#D8DEE9]">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-12 text-sm text-[#0A0F2C]">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div key={index} className="group flex items-center p-4 rounded-2xl hover:bg-white/50 transition-all duration-300 hover:shadow-lg">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${badge.gradient} mr-4 group-hover:shadow-[0_0_15px_rgba(36,124,255,0.3)] transition-shadow duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold tracking-wide font-['Space_Grotesk']">
                  {badge.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
