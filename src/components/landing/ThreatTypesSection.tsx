
import React from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle, FileText, Brain, Eye, TrendingUp, Clock } from "lucide-react";

const ThreatTypesSection = () => {
  const threats = [
    {
      icon: AlertTriangle,
      title: "Viral Reddit Threads",
      description: "That go viral overnight",
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600"
    },
    {
      icon: FileText,
      title: "Outdated Articles",
      description: "That resurface at the worst time",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600"
    },
    {
      icon: Brain,
      title: "False AI Memories",
      description: "ChatGPT and Google \"remembering\" wrong info",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      icon: Eye,
      title: "Deepfake Content",
      description: "Impersonation on social media",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Internal Changes",
      description: "Company shifts that hint at crisis",
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-600"
    },
    {
      icon: Clock,
      title: "Timing Issues",
      description: "Wrong message at the wrong moment",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          🔍 What Can Damage Your Reputation?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {threats.map((threat, index) => {
            const IconComponent = threat.icon;
            return (
              <Card key={index} className={`p-6 text-center ${threat.color}`}>
                <IconComponent className={`h-12 w-12 ${threat.iconColor} mx-auto mb-4`} />
                <h3 className="font-semibold mb-2">{threat.title}</h3>
                <p className="text-gray-600">{threat.description}</p>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center bg-gray-100 p-8 rounded-lg">
          <p className="text-xl font-bold text-gray-800 mb-2">Most people find out too late.</p>
          <p className="text-lg text-blue-600 font-semibold">A.R.I.A™ finds it first — and fixes it silently.</p>
        </div>
      </div>
    </section>
  );
};

export default ThreatTypesSection;
