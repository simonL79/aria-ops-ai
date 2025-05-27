
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, Eye, Zap } from "lucide-react";

const ThreatTypesSection = () => {
  const threats = [
    {
      icon: AlertTriangle,
      title: "Social Media Attacks",
      description: "Monitor and neutralize coordinated attacks across all social platforms before they gain momentum.",
      gradient: "from-red-500 to-orange-600",
      bgGradient: "from-red-500/10 to-orange-500/10"
    },
    {
      icon: Eye,
      title: "Search Engine Manipulation",
      description: "Detect and counter negative SEO campaigns designed to damage your online reputation.",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Shield,
      title: "Corporate Espionage",
      description: "Identify threats from competitors, disgruntled employees, and industrial espionage attempts.",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-500/10 to-violet-500/10"
    },
    {
      icon: Zap,
      title: "AI Model Poisoning",
      description: "Prevent false information from being embedded into AI training data and language models.",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Threat Intelligence That Matters
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our advanced monitoring systems detect and classify threats across multiple vectors, 
            providing early warning for reputation risks before they escalate.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {threats.map((threat, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${threat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute left-0 top-0 w-2 h-full bg-gradient-to-b ${threat.gradient} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top`}></div>
              
              <div className="relative p-8">
                <div className="flex items-start space-x-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${threat.gradient} shadow-xl group-hover:shadow-2xl transition-shadow duration-500 flex-shrink-0`}>
                    <threat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-4 text-slate-800 group-hover:text-slate-900 transition-colors">
                      {threat.title}
                    </h3>
                    <p className="text-slate-600 group-hover:text-slate-700 transition-colors leading-relaxed">
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
