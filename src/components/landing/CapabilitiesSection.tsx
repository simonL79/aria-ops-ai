
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const CapabilitiesSection = () => {
  const capabilities = [
    {
      title: "Finds threats before you're aware",
      description: "Detects risks across the internet before they impact you",
      color: "border-l-green-500"
    },
    {
      title: "Tracks across all platforms",
      description: "Forums, news, social media, and AI systems monitoring",
      color: "border-l-blue-500"
    },
    {
      title: "Human-readable reports",
      description: "No tools, no dashboards — just clear insights",
      color: "border-l-purple-500"
    },
    {
      title: "Prevents future crises",
      description: "Stops problems before they exist",
      color: "border-l-orange-500"
    },
    {
      title: "Corrects false memories",
      description: "Fixes what search engines and AI models remember",
      color: "border-l-red-500"
    },
    {
      title: "Zero input scanning",
      description: "Finds everything — even what you didn't search for",
      color: "border-l-indigo-500"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          A.R.I.A™ is the world's first fully-managed reputation intelligence system that:
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {capabilities.map((capability, index) => (
            <Card key={index} className={`p-6 border-l-4 ${capability.color}`}>
              <div className="flex items-center mb-3">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">{capability.title}</h3>
              </div>
              <p className="text-gray-600">{capability.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
