
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const CapabilitiesSection = () => {
  const capabilities = [
    {
      title: "Finds threats before you're aware",
      description: "Detects risks across the internet before they impact you",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Tracks across all platforms",
      description: "Forums, news, social media, and AI systems monitoring",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Human-readable reports",
      description: "No tools, no dashboards — just clear insights",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      title: "Prevents future crises",
      description: "Stops problems before they exist",
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Corrects false memories",
      description: "Fixes what search engines and AI models remember",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      title: "Zero input scanning",
      description: "Finds everything — even what you didn't search for",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          A.R.I.A™ is the world's first fully-managed reputation intelligence system that:
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-16"></div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {capabilities.map((capability, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${capability.gradient} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top`}></div>
              
              <div className="relative p-8">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${capability.gradient} shadow-lg`}>
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg ml-4 text-slate-800 group-hover:text-slate-900 transition-colors">{capability.title}</h3>
                </div>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors leading-relaxed">{capability.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
