
import React from 'react';
import { Card } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      emoji: "📄",
      title: "Weekly Intelligence Reports",
      description: "Summarized risks, shifts in sentiment, and clear next steps.",
      color: "border-l-blue-500"
    },
    {
      emoji: "🚨",
      title: "Instant Alerts",
      description: "When something urgent emerges — we notify you directly.",
      color: "border-l-red-500"
    },
    {
      emoji: "🧠",
      title: "Memory Overwrites",
      description: "We help correct what AI models and search engines \"remember\" about you.",
      color: "border-l-purple-500"
    },
    {
      emoji: "🧬",
      title: "Pre-Crisis Forecasting",
      description: "Detect reputation risks before they happen, based on tone, behavior, and online chatter.",
      color: "border-l-green-500"
    },
    {
      emoji: "👁",
      title: "Zero Input Scanning",
      description: "No keywords needed. We look for everything — even what you didn't know to search for.",
      color: "border-l-orange-500"
    },
    {
      emoji: "🔒",
      title: "Private by Design",
      description: "GDPR-compliant, no public dashboards, enterprise-grade encryption.",
      color: "border-l-indigo-500"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">🛡 What You Get</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className={`p-8 border-l-4 ${service.color}`}>
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">{service.emoji}</div>
                <h3 className="text-xl font-bold">{service.title}</h3>
              </div>
              <p className="text-gray-600">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
