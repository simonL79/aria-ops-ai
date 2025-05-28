
import React from 'react';
import { Card } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      title: "Weekly Intelligence Reports",
      description: "Summarized risks, shifts in sentiment, and clear next steps.",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      title: "Instant Alerts",
      description: "When something urgent emerges — we notify you directly.",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      title: "Memory Overwrites",
      description: "We help correct what AI models and search engines \"remember\" about you.",
      gradient: "from-[#247CFF] to-[#1C1C1E]"
    },
    {
      title: "Pre-Crisis Forecasting",
      description: "Detect reputation risks before they happen, based on tone, behavior, and online chatter.",
      gradient: "from-[#1C1C1E] to-[#38C172]"
    },
    {
      title: "Zero Input Scanning",
      description: "No keywords needed. We look for everything — even what you didn't know to search for.",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      title: "Private by Design",
      description: "GDPR-compliant, no public dashboards, enterprise-grade encryption.",
      gradient: "from-[#247CFF] to-[#38C172]"
    }
  ];

  return (
    <section className="py-20 px-6 bg-[#0A0F2C]">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-['Space_Grotesk'] tracking-tight">
          WHAT YOU GET
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group p-8 bg-[#1C1C1E] hover:bg-[#1C1C1E]/80 border border-[#247CFF]/20 hover:border-[#247CFF]/50 shadow-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl"
            >
              <div className={`w-4 h-20 bg-gradient-to-b ${service.gradient} mb-6 rounded-full group-hover:shadow-[0_0_15px_rgba(36,124,255,0.5)] transition-shadow duration-500`}></div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#247CFF] transition-colors font-['Space_Grotesk'] tracking-wide">
                {service.title.toUpperCase()}
              </h3>
              <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter']">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
