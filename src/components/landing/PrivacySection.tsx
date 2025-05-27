
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const PrivacySection = () => {
  const privacyFeatures = [
    {
      title: "Fully GDPR-compliant",
      description: "Complete data protection compliance"
    },
    {
      title: "No public dashboard, ever",
      description: "Your data stays completely private"
    },
    {
      title: "Enterprise-grade encryption",
      description: "Bank-level security for all data"
    },
    {
      title: "Verified secure operators",
      description: "Only trusted personnel handle your information"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gray-100">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">🔒 Private by Design</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {privacyFeatures.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
